export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin' | 'gym-owner';
  createdAt: string;
  memberSince?: string;
  bio?: string;
  city?: string;
  favoriteGyms?: string[];
}

export interface UserProfile extends User {
  reviews?: Review[];
  subscriptions?: Subscription[];
  bookings?: Booking[];
}

export interface Review {
  id: string;
  gymId: string;
  gymName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  gymId: string;
  gymName: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

export interface Booking {
  id: string;
  gymId: string;
  gymName: string;
  className?: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
} 