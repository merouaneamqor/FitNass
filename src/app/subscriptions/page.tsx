"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { LoadingSpinner } from '@/components/loading-spinner';

interface Feature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  features: Feature[];
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);
  
  const router = useRouter();
  const { data: session, status } = useSession();

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
        if (status === 'authenticated') {
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
  }, [status]);

  const handleSubscribe = async (planId: string) => {
    if (status !== 'authenticated') {
      // Redirect to login page if not authenticated
      router.push('/login?returnUrl=/subscriptions');
      return;
    }

    setSubscribing(true);
    try {
      // In a real implementation, this would integrate with Stripe/payment processor
      // For now, we'll create a subscription directly
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          paymentMethodId: 'mock-payment-method' // Mock payment method ID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const result = await response.json();
      
      // Refresh the user's subscription data
      const subscriptionResponse = await fetch('/api/user/subscription');
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        setUserSubscription(subscriptionData);
      }

      // Show success message or redirect to dashboard
      router.push('/dashboard?subscribed=true');
    } catch (err: any) {
      setError(err.message || 'Failed to create subscription');
      console.error(err);
    } finally {
      setSubscribing(false);
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

  const userHasSubscription = userSubscription?.hasSubscription;

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
            You are currently subscribed to the <strong>{userSubscription.subscription.plan.name}</strong> plan.
          </p>
          <p className="mt-2">
            Status: <Badge>{userSubscription.subscription.status}</Badge>
          </p>
          {userSubscription.subscription.autoRenew ? (
            <p className="mt-2">
              Your subscription will automatically renew on{' '}
              {new Date(userSubscription.subscription.endDate).toLocaleDateString()}.
            </p>
          ) : (
            <p className="mt-2">
              Your subscription will end on{' '}
              {new Date(userSubscription.subscription.endDate).toLocaleDateString()}.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  {formatPrice(plan.price, plan.billingCycle)}
                </span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className={`mr-2 h-5 w-5 ${feature.included ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing || (userHasSubscription && userSubscription.subscription.plan.id === plan.id)}
                className="w-full"
                variant={userHasSubscription && userSubscription.subscription.plan.id === plan.id ? "outline" : "default"}
              >
                {subscribing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" /> Processing...
                  </>
                ) : userHasSubscription && userSubscription.subscription.plan.id === plan.id ? (
                  'Current Plan'
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