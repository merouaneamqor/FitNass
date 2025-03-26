export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { randomInt } from 'crypto';
import os from 'os';

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
    
    // Get server load using OS metrics
    let serverLoad = 0;
    try {
      // This is a simple example - in a production environment you might use more sophisticated metrics
      const cpuCount = os.cpus().length;
      const loadAvg = os.loadavg()[0]; // 1 minute load average
      serverLoad = Math.min(Math.round((loadAvg / cpuCount) * 100), 100); // Convert to percentage
    } catch (error) {
      console.error('Error calculating server load:', error);
      serverLoad = 20; // Fallback value
    }
    
    // Get database metrics
    let userCount = 0;
    let gymCount = 0;
    let reviewCount = 0;
    
    try {
      userCount = await prisma.user.count();
    } catch (error) {
      console.error('Error counting users:', error);
    }
    
    try {
      gymCount = await prisma.gym.count();
    } catch (error) {
      console.error('Error counting gyms:', error);
    }
    
    try {
      reviewCount = await prisma.review.count();
    } catch (error) {
      console.error('Error counting reviews:', error);
    }
    
    // Calculate a database "usage" metric (this is simplified for demonstration)
    const totalRecords = userCount + gymCount + reviewCount;
    
    // In a real app, you'd use database-specific metrics like connection pool usage
    const dbCapacity = 10000; // Arbitrary number for demonstration
    const databaseUsage = Math.min(Math.round((totalRecords / dbCapacity) * 100), 100);
    
    // Get storage metrics (simulated for demonstration)
    // In a real app, you'd use actual disk usage metrics
    let storageUsage;
    try {
      const totalStorage = 1024 * 1024 * 1024; // 1GB (arbitrary for demonstration)
      const usedStorage = totalRecords * 10 * 1024; // Estimating 10KB per record
      storageUsage = Math.min(Math.round((usedStorage / totalStorage) * 100), 100);
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      storageUsage = 30; // Fallback value
    }
    
    // Get last backup time (simulated)
    let lastBackupFormatted;
    try {
      const now = new Date();
      const lastBackupHours = randomInt(1, 24); // Random time between 1-24 hours ago for demonstration
      const lastBackup = new Date(now.getTime() - lastBackupHours * 60 * 60 * 1000);
      lastBackupFormatted = formatRelativeTime(lastBackup);
    } catch (error) {
      console.error('Error formatting backup time:', error);
      lastBackupFormatted = 'a few hours ago'; // Fallback value
    }
    
    // Determine system status based on metrics
    let systemStatus = 'operational';
    if (serverLoad > 80 || databaseUsage > 80 || storageUsage > 80) {
      systemStatus = 'degraded';
    }
    
    return NextResponse.json({
      serverLoad,
      databaseUsage,
      storageUsage,
      systemStatus,
      lastBackup: lastBackupFormatted
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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