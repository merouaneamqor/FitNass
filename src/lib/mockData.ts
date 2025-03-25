/**
 * Mock data for fallback when database operations fail
 * This is used in development and testing environments
 */

export const mockStats = {
  totalUsers: 1254,
  totalGyms: 87,
  pendingApprovals: 12,
  reviewsThisWeek: 156,
  activePromotions: 34,
};

export const mockRecentActivity = [
  { id: 'user-1', action: 'User registered', time: '2 hours ago', user: 'John Smith' },
  { id: 'gym-1', action: 'New gym registered', time: '5 hours ago', user: 'FitLife Gym' },
  { id: 'promo-1', action: 'New promotion created', time: '1 day ago', user: 'PowerFit Center: Summer Special' },
  { id: 'review-1', action: 'New 5-star review', time: '1 day ago', user: 'Emily Johnson for CoreStrength Studio' },
  { id: 'gym-2', action: 'Gym information updated', time: '2 days ago', user: 'CrossFit Zone' },
];

export const mockSystemHealth = {
  serverLoad: 24,
  databaseUsage: 62,
  storageUsage: 38,
  systemStatus: 'operational',
  lastBackup: '2 hours ago'
}; 