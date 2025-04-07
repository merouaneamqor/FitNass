"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Define types for subscription plans
type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  isPopular?: boolean;
  startDate?: string;
  endDate?: string;
};

type SubscriptionData = {
  currentPlan: SubscriptionPlan | null;
  nextBillingDate: string | null;
  usage: {
    used: number;
    total: number;
  };
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid';
  autoRenew?: boolean;
};

export default function SubscriptionInfo() {
  const { data: session } = useSession();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetchSubscriptionData();
    }
  }, [session]);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscriptions/current');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      const data = await response.json();
      setSubscriptionData(data);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError('Failed to load subscription data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionData?.currentPlan) return;

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Refresh subscription data
      await fetchSubscriptionData();
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!subscriptionData?.currentPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>You don&apos;t have an active subscription plan.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push('/subscriptions')}>
            View Plans
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const { currentPlan, nextBillingDate, usage, status } = subscriptionData;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{currentPlan.name}</CardTitle>
            <CardDescription>{currentPlan.description}</CardDescription>
          </div>
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Usage</h4>
            <Progress value={(usage.used / usage.total) * 100} />
            <p className="text-sm text-gray-500 mt-1">
              {usage.used} of {usage.total} features used
            </p>
          </div>
          {nextBillingDate && (
            <div>
              <h4 className="text-sm font-medium mb-1">Next Billing Date</h4>
              <p className="text-sm text-gray-500">
                {new Date(nextBillingDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleCancelSubscription}
          disabled={status !== 'active'}
        >
          Cancel Subscription
        </Button>
        <Button onClick={() => router.push('/subscriptions')}>
          Upgrade Plan
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
} 