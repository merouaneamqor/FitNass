import React from 'react';
import { UserProfile } from '@/types/user';
import { FiCreditCard, FiCalendar, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

interface UserSubscriptionsProps {
  profile: UserProfile;
  onCancelSubscription?: (subscriptionId: string) => Promise<void>;
  className?: string;
}

export const UserSubscriptions: React.FC<UserSubscriptionsProps> = ({
  profile,
  onCancelSubscription,
  className = "",
}) => {
  const subscriptions = profile.subscriptions || [];

  if (subscriptions.length === 0) {
    return (
      <div className={`bg-white border border-neutral-200 rounded-xl p-6 text-center ${className}`}>
        <FiCreditCard className="mx-auto text-neutral-300 h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium text-neutral-700">No Active Subscriptions</h3>
        <p className="text-neutral-500 mt-2">
          You don&apos;t have any active gym memberships or subscriptions.
        </p>
        <Link 
          href="/gyms" 
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
        >
          Explore Gym Memberships
        </Link>
      </div>
    );
  }

  const getStatusStyles = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      case 'expired':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'active':
        return <FiCheck className="w-4 h-4 mr-1" />;
      case 'cancelled':
      case 'expired':
        return <FiAlertCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {subscriptions.map((subscription) => {
        const startDate = new Date(subscription.startDate);
        const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
        
        const formatDate = (date: Date): string => {
          return date.toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          });
        };

        return (
          <div 
            key={subscription.id} 
            className="bg-white border border-neutral-200 rounded-xl p-6"
          >
            <div className="flex justify-between items-start">
              <Link href={`/gyms/${subscription.gymId}`} className="group">
                <h3 className="text-lg font-medium text-neutral-800 group-hover:text-indigo-600 transition-colors">
                  {subscription.gymName}
                </h3>
              </Link>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusStyles(subscription.status)}`}>
                {getStatusIcon(subscription.status)}
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="font-medium">{subscription.plan}</div>
              
              <div className="flex items-center text-neutral-600">
                <FiCalendar className="w-4 h-4 mr-2" />
                <span>
                  {formatDate(startDate)}
                  {endDate && ` - ${formatDate(endDate)}`}
                </span>
              </div>
            </div>
            
            {subscription.status === 'active' && onCancelSubscription && (
              <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-end">
                <button
                  onClick={() => onCancelSubscription(subscription.id)}
                  className="px-4 py-2 border border-rose-300 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-sm"
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserSubscriptions; 