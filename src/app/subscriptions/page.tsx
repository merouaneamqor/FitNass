"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/loading-spinner';

// Define types for subscription plans and user subscriptions
type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  isPopular?: boolean;
};

type UserSubscription = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  plan: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    interval?: string;
  };
};

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Fetch available subscription plans
        const plansResponse = await fetch('/api/subscriptions');
        if (!plansResponse.ok) {
          throw new Error('Failed to fetch subscription plans');
        }
        const plansData = await plansResponse.json();
        setPlans(plansData);
        
        // Fetch user's current subscription if logged in
        if (session) {
          const subscriptionResponse = await fetch('/api/user/subscription');
          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            setUserSubscription(subscriptionData);
          }
        }
      } catch (err) {
        setError('Failed to load subscription plans. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [session]);

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      // Redirect to login page if not authenticated
      router.push('/login?returnUrl=/subscriptions');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number, cycle: string) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}/${cycle === 'MONTHLY' ? 'month' : cycle === 'QUARTERLY' ? 'quarter' : 'year'}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const userHasSubscription = !!userSubscription && !!userSubscription.plan && userSubscription.status === 'ACTIVE';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Choose Your Subscription Plan</h1>
        <p className="text-muted-foreground">
          Select the plan that best fits your business needs
        </p>
      </div>

      {userHasSubscription && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Your Current Subscription</h2>
          <p>
            You are currently subscribed to the <strong>{userSubscription.plan?.name ?? "Unknown Plan"}</strong> plan.
          </p>
          <p className="mt-2">
            Status: <Badge>{userSubscription.status ?? "Unknown"}</Badge>
          </p>
          {userSubscription.autoRenew ? (
            <p className="mt-2">
              Your subscription will automatically renew on{' '}
              {userSubscription.endDate ? new Date(userSubscription.endDate).toLocaleDateString() : 'N/A'}.
            </p>
          ) : (
            <p className="mt-2">
              Your subscription will end on{' '}
              {userSubscription.endDate ? new Date(userSubscription.endDate).toLocaleDateString() : 'N/A'}.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  {formatPrice(plan.price, plan.interval)}
                </span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processing}
                className="w-full"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}