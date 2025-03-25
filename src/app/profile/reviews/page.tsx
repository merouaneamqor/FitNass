'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function ReviewsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page with tab=reviews
    router.push('/profile/me?tab=reviews');
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center">
      <LoadingSpinner />
    </div>
  );
} 