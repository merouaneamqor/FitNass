'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUsers, FiCalendar, FiStar, FiBarChart2, FiDollarSign, FiTrendingUp, FiClock, FiActivity } from 'react-icons/fi';
import { PageHeader, Card, StatsCard, Button } from '@/components/dashboard';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import SubscriptionInfo from './subscription-info';
import Link from 'next/link';

// Define interfaces for our data types
interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  phone: string;
  status: string;
  membershipType: string;
  lastVisit: string;
}

interface Reservation {
  id: string;
  memberName: string;
  date: string;
  time: string;
  service: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [memberCount, setMemberCount] = useState(0);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (session?.user?.role === 'GYM_OWNER') {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch member count
      const membersResponse = await fetch('/api/members');
      if (membersResponse.ok) {
        const membersData = await membersResponse.json() as Member[];
        setMemberCount(membersData.length);
        
        // Get most recent 5 members
        const sortedMembers = [...membersData]
          .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
          .slice(0, 5);
        
        setRecentMembers(sortedMembers);
      }
      
      // You would fetch real reservation data here when available
      // For now, using mock data
      setUpcomingReservations([
        {
          id: '1',
          memberName: 'Samira Belhaj',
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          time: '10:00 - 11:30',
          service: 'Group Training'
        },
        {
          id: '2',
          memberName: 'Ahmed Khalid',
          date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
          time: '14:00 - 15:00',
          service: 'Personal Training'
        },
        {
          id: '3',
          memberName: 'Nadia El Amrani',
          date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
          time: '18:30 - 19:30',
          service: 'Swimming Session'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  if (session.user.role !== 'GYM_OWNER') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.name || 'User'}!</h2>
            <p>This dashboard is designed for gym owners. Please contact support if you need access.</p>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Manage your gym and track performance metrics."
        icon={FiBarChart2}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Members"
          value={loading ? '...' : memberCount.toString()}
          icon={FiUsers}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Today's Visits"
          value="24"
          icon={FiCalendar}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Upcoming Bookings"
          value={loading ? '...' : upcomingReservations.length.toString()}
          icon={FiClock}
          trend={{ value: 7, isPositive: true }}
        />
        <StatsCard
          title="Revenue (Monthly)"
          value="9,850 MAD"
          icon={FiDollarSign}
          trend={{ value: 12, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Info */}
        <Card className="lg:col-span-1">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Subscription Status</h2>
          </div>
          <div className="p-4">
            <SubscriptionInfo userId={session.user.id} />
          </div>
        </Card>

        {/* Recent Members */}
        <Card className="lg:col-span-1">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Recent Members</h2>
            <Link href="/dashboard/members">
              <Button size="sm" variant="ghost">View All</Button>
            </Link>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : recentMembers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No members found</div>
            ) : (
              recentMembers.map((member) => (
                <div key={member.id} className="p-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FiUsers className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">Joined {new Date(member.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Reservations */}
        <Card className="lg:col-span-1">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Upcoming Reservations</h2>
            <Link href="/dashboard/reservations">
              <Button size="sm" variant="ghost">View All</Button>
            </Link>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : upcomingReservations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No upcoming reservations</div>
            ) : (
              upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">{reservation.memberName}</p>
                    <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                      {reservation.service}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-1" />
                    <span>{new Date(reservation.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <FiClock className="mr-1" />
                    <span>{reservation.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Quick Actions</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/dashboard/members/new">
                <div className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors cursor-pointer">
                  <FiUsers className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <span className="block font-medium">Add Member</span>
                </div>
              </Link>
              <Link href="/dashboard/reservations/new">
                <div className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors cursor-pointer">
                  <FiCalendar className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <span className="block font-medium">New Booking</span>
                </div>
              </Link>
              <Link href="/dashboard/classes">
                <div className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors cursor-pointer">
                  <FiActivity className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <span className="block font-medium">Manage Classes</span>
                </div>
              </Link>
              <Link href="/dashboard/reports">
                <div className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg text-center transition-colors cursor-pointer">
                  <FiBarChart2 className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <span className="block font-medium">Reports</span>
                </div>
              </Link>
              <Link href="/dashboard/promotions">
                <div className="bg-red-50 hover:bg-red-100 p-4 rounded-lg text-center transition-colors cursor-pointer">
                  <FiTrendingUp className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <span className="block font-medium">Promotions</span>
                </div>
              </Link>
              <Link href="/dashboard/settings">
                <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition-colors cursor-pointer">
                  <FiDollarSign className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <span className="block font-medium">Finances</span>
                </div>
              </Link>
            </div>
          </div>
        </Card>
        
        {/* Activity Chart - Placeholder */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Gym Activity (Week)</h2>
          </div>
          <div className="p-4">
            {/* This would be replaced with an actual chart component */}
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="space-y-4 w-full px-6">
                <div className="flex items-center">
                  <div className="w-12 text-xs text-gray-500">Mon</div>
                  <div className="relative h-6 bg-blue-100 rounded w-5/12">
                    <div className="absolute inset-y-0 left-0 bg-blue-500 rounded w-10/12"></div>
                  </div>
                  <div className="ml-2 text-sm">38</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-xs text-gray-500">Tue</div>
                  <div className="relative h-6 bg-blue-100 rounded w-4/12">
                    <div className="absolute inset-y-0 left-0 bg-blue-500 rounded w-8/12"></div>
                  </div>
                  <div className="ml-2 text-sm">26</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-xs text-gray-500">Wed</div>
                  <div className="relative h-6 bg-blue-100 rounded w-6/12">
                    <div className="absolute inset-y-0 left-0 bg-blue-500 rounded w-11/12"></div>
                  </div>
                  <div className="ml-2 text-sm">45</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-xs text-gray-500">Thu</div>
                  <div className="relative h-6 bg-blue-100 rounded w-5/12">
                    <div className="absolute inset-y-0 left-0 bg-blue-500 rounded w-9/12"></div>
                  </div>
                  <div className="ml-2 text-sm">34</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-xs text-gray-500">Fri</div>
                  <div className="relative h-6 bg-blue-100 rounded w-7/12">
                    <div className="absolute inset-y-0 left-0 bg-blue-500 rounded w-10/12"></div>
                  </div>
                  <div className="ml-2 text-sm">52</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 