'use client'; // Make this a client component for interaction

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from 'lucide-react';
import { SubscriptionPlan } from '@prisma/client'; // Import the type
import { createCheckoutSession } from '@/lib/actions/subscription.actions'; // Import the server action
import { useSession } from 'next-auth/react'; // Import useSession
import Link from 'next/link'; // Import Link for sign-in button
import { useToast } from "@/hooks/use-toast"; // Corrected import path for the hook

// Note: Fetching data in a Client Component like this is generally discouraged
// for initial load in Next.js App Router. It's better to fetch in the Page (Server Component)
// and pass the data down. However, for simplicity in connecting the action,
// we'll keep the fetch here for now. Consider refactoring later.

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[]; // Expect plans to be passed as props now
}

// Renamed component to reflect it expects props
export default function SubscriptionPlansClient({ plans }: SubscriptionPlansProps) {
  const { toast } = useToast();
  const { status } = useSession(); // Get session status
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const isLoggedIn = status === 'authenticated';
  const isAuthLoading = status === 'loading'; // Explicitly check auth loading status

  const handleSelectPlan = async (planId: string) => {
    if (!isLoggedIn) { // Double-check, though button shouldn't render
        toast({ title: "Authentication Required", description: "Please sign in to select a plan.", variant: "destructive" });
        return;
    }
    setLoadingPlanId(planId);
    try {
      // Call the server action
      const result = await createCheckoutSession(planId);

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message || "Subscription process initiated.",
        });
        // TODO: Handle redirection to Stripe if result.url is provided
        // if (result.url) { window.location.href = result.url; }
      } else {
        toast({
          title: "Action Required",
          description: result.message || "Could not initiate subscription.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to initiate subscription:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  // const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  // useEffect(() => {
  //   fetchSubscriptionPlans().then(setPlans);
  // }, []); // Fetch on mount - Requires API/Action or passing props

  if (!plans || plans.length === 0) {
    return <p className="text-center text-neutral-400">No subscription plans available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {plans.map((plan) => {
        const isLoading = loadingPlanId === plan.id;
        return (
          <Card 
            key={plan.id} 
            className="flex flex-col bg-gunmetal-gray border-2 border-neutral-700 rounded-lg shadow-lg hover:border-neon-yellow transition-colors duration-200 group"
          >
            <CardHeader className="border-b border-neutral-600 pb-4">
              <CardTitle className="text-3xl font-bebasNeue tracking-wider uppercase text-white text-center">{plan.name}</CardTitle>
              <CardDescription className="text-neutral-300 text-center text-sm pt-1">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <div className="mb-6 text-center">
                <span className="text-5xl font-extrabold text-neon-yellow">${plan.price > 0 ? plan.price.toFixed(2) : 'Free'}</span>
                {plan.price > 0 && (
                  <span className="text-sm text-neutral-400">/{plan.billingCycle.toLowerCase()}</span>
                )}
              </div>
              <ul className="space-y-3 font-poppins">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-neon-yellow flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-4 pt-4 border-t border-neutral-600">
              {isLoggedIn ? (
                <Button
                  className="w-full bg-neon-yellow text-black font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors duration-200 py-3 text-base disabled:opacity-50"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading || isAuthLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    'Select Plan'
                  )}
                </Button>
              ) : (
                 <Button asChild className="w-full bg-blood-red text-white font-bold uppercase tracking-wider hover:bg-red-700 transition-colors duration-200 py-3 text-base">
                  <Link href="/auth/signin?callbackUrl=/pricing">Sign in to Subscribe</Link>
                 </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
} 