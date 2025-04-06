"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface SubscriptionInfoProps {
  userId: string;
}

export default function SubscriptionInfo({ userId }: SubscriptionInfoProps) {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscribed = searchParams.get('subscribed');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (!response.ok) {
          throw new Error('Failed to fetch subscription data');
        }
        const data = await response.json();
        setSubscriptionData(data);
        
        if (subscribed === 'true') {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load subscription information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [subscribed]);

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.')) {
      return;
    }

    setCancellingSubscription(true);
    try {
      const response = await fetch('/api/user/subscription', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      // Refresh subscription data
      const subscriptionResponse = await fetch('/api/user/subscription');
      if (subscriptionResponse.ok) {
        const data = await subscriptionResponse.json();
        setSubscriptionData(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
      console.error(err);
    } finally {
      setCancellingSubscription(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner size="md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionData?.hasSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Explore our subscription plans to access premium features and enhance your business.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/subscriptions')} className="w-full">
            View Subscription Plans <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Calculate subscription period progress
  const startDate = new Date(subscriptionData.subscription.startDate);
  const endDate = new Date(subscriptionData.subscription.endDate);
  const currentDate = new Date();
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = currentDate.getTime() - startDate.getTime();
  const progressPercentage = Math.min(Math.round((elapsedDuration / totalDuration) * 100), 100);
  
  const daysRemaining = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      {showSuccess && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-700" />
          <AlertTitle className="text-green-700">Subscription Activated</AlertTitle>
          <AlertDescription className="text-green-600">
            Your subscription has been successfully activated.
          </AlertDescription>
        </Alert>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </div>
          <Badge className={
            subscriptionData.subscription.status === 'ACTIVE' 
              ? 'bg-green-500' 
              : subscriptionData.subscription.status === 'TRIALING' 
                ? 'bg-blue-500' 
                : 'bg-yellow-500'
          }>
            {subscriptionData.subscription.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm">Current Plan</h3>
            <p className="text-xl font-semibold">{subscriptionData.subscription.plan.name}</p>
            <p className="text-muted-foreground text-sm">{subscriptionData.subscription.plan.description}</p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-sm">Billing Period</h3>
              <span className="text-sm">{daysRemaining} days remaining</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{startDate.toLocaleDateString()}</span>
              <span>{endDate.toLocaleDateString()}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-1">Plan Features</h3>
            <ul className="space-y-1">
              {subscriptionData.subscription.plan.features.map((feature: any, index: number) => (
                feature.included && <li key={index} className="text-sm flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm">Auto-Renewal</h3>
            <p className={subscriptionData.subscription.autoRenew ? 'text-green-600' : 'text-yellow-600'}>
              {subscriptionData.subscription.autoRenew 
                ? 'Your subscription will automatically renew on ' + endDate.toLocaleDateString()
                : 'Your subscription will end on ' + endDate.toLocaleDateString()
              }
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => router.push('/subscriptions')}
          variant="outline"
        >
          Change Plan
        </Button>
        
        {subscriptionData.subscription.autoRenew && (
          <Button
            onClick={handleCancelSubscription}
            variant="destructive"
            disabled={cancellingSubscription}
          >
            {cancellingSubscription ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" /> Processing...
              </>
            ) : (
              'Cancel Subscription'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 