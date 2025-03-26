export interface ActivityItem {
  id: string;
  action: string;
  time: string;
  user: string | null;
  role: 'USER' | 'GYM_OWNER' | 'ADMIN';
} 