'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function SubscriptionsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page with tab=subscriptions
    router.push('/profile/me?tab=subscriptions');
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center">
      <LoadingSpinner />
    </div>
  );
} 