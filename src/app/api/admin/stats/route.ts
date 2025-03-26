import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    let totalUsers = 0;
    let totalGyms = 0;
    let pendingApprovals = 0;
    let reviewsThisWeek: number = 0;
    let activePromotions: number = 0;
    let recentActivity: any[] = [];
    
    try {
      // Get total users count
      totalUsers = await prisma.user.count();
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
    
    try {
      // Get total gyms count
      totalGyms = await prisma.gym.count();
    } catch (error) {
      console.error('Error fetching total gyms:', error);
    }
    
    try {
      // Get pending approvals (gyms awaiting approval)
      pendingApprovals = await prisma.gym.count({
        where: {
          status: 'PENDING_APPROVAL'
        }
      });
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
    
    try {
      // Get reviews from the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      reviewsThisWeek = await prisma.review.count({
        where: {
          createdAt: {
            gte: oneWeekAgo
          }
        }
      });
    } catch (error) {
      console.error('Error fetching reviews this week:', error);
    }
    
    try {
      // Get active promotions
      activePromotions = await prisma.promotion.count({
        where: {
          endDate: {
            gte: new Date()
          },
          status: 'ACTIVE'
        }
      });
    } catch (error) {
      console.error('Error fetching active promotions:', error);
    }
    
    try {
      // Get recent activity (last 5 activities)
      recentActivity = await getRecentActivity();
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      recentActivity = [];
    }
    
    return NextResponse.json({
      stats: {
        totalUsers,
        totalGyms,
        pendingApprovals,
        reviewsThisWeek,
        activePromotions
      },
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getRecentActivity() {
  // Add explicit type annotations for each array
  let recentUsers: Array<{id: string, name: string | null, createdAt: Date}> = [];
  let recentGyms: Array<{id: string, name: string, createdAt: Date}> = [];
  let recentReviews: Array<{
    id: string;
    rating: number;
    createdAt: Date;
    user: { name: string | null };
    gym: { name: string | null };
  }> = [];
  let recentPromotions: Array<{
    id: string;
    title: string;
    createdAt: Date;
    gym: { name: string | null };
  }> = [];
  
  try {
    // Recent user registrations
    recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
  } catch (error) {
    console.error('Error fetching recent users:', error);
    recentUsers = [];
  }
  
  try {
    // Recent gym registrations
    recentGyms = await prisma.gym.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
  } catch (error) {
    console.error('Error fetching recent gyms:', error);
    recentGyms = [];
  }
  
  try {
    // Recent reviews
    recentReviews = await prisma.review.findMany({
      select: {
        id: true,
        rating: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        },
        gym: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
  } catch (error) {
    console.error('Error fetching recent reviews:', error);
    recentReviews = [];
  }
  
  try {
    // Recent promotions
    recentPromotions = await prisma.promotion.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        gym: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
  } catch (error) {
    console.error('Error fetching recent promotions:', error);
    recentPromotions = [];
  }
  
  // Combine all activities
  const combinedActivities = [
    ...recentUsers.map(user => ({
      id: `user-${user.id}`,
      action: 'User registered',
      time: user.createdAt,
      user: user.name
    })),
    ...recentGyms.map(gym => ({
      id: `gym-${gym.id}`,
      action: 'New gym registered',
      time: gym.createdAt,
      user: gym.name
    })),
    ...recentReviews.map(review => ({
      id: `review-${review.id}`,
      action: `New ${review.rating}-star review`,
      time: review.createdAt,
      user: `${review.user?.name || 'Unknown'} for ${review.gym?.name || 'Unknown'}`
    })),
    ...recentPromotions.map(promo => ({
      id: `promo-${promo.id}`,
      action: 'New promotion created',
      time: promo.createdAt,
      user: `${promo.gym?.name || 'Unknown'}: ${promo.title}`
    }))
  ];
  
  try {
    // Sort by time (most recent first) and limit to 5
    return combinedActivities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5)
      .map(activity => ({
        ...activity,
        // Format the time as a relative string (e.g., "2 hours ago")
        time: formatRelativeTime(activity.time)
      }));
  } catch (error) {
    console.error('Error processing activity data:', error);
    return [];
  }
}

// Helper function to format timestamps as relative time
function formatRelativeTime(date: Date): string {
  try {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'recently';
  }
} 