'use client'; // Make this a client component for interaction

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Zap } from 'lucide-react';
import { SubscriptionPlan } from '@prisma/client'; // Import the type
import { createCheckoutSession } from '@/lib/actions/subscription.actions'; // Import the server action
import { useSession } from 'next-auth/react'; // Import useSession
import Link from 'next/link'; // Import Link for sign-in button
import { useToast } from "@/hooks/use-toast"; // Corrected import path for the hook
import { motion } from "framer-motion";

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
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUALLY'>(() => {
    // Try to retrieve from localStorage, default to MONTHLY if not found
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferredBillingCycle');
      return (saved === 'ANNUALLY' ? 'ANNUALLY' : 'MONTHLY') as 'MONTHLY' | 'ANNUALLY';
    }
    return 'MONTHLY';
  });

  const isLoggedIn = status === 'authenticated';
  const isAuthLoading = status === 'loading'; // Explicitly check auth loading status

  // Filter plans based on the selected billing cycle
  const filteredPlans = plans.filter(plan => plan.billingCycle === billingCycle);
  
  // Function to identify the recommended plan - typically the middle-tier plan
  const getRecommendedPlanId = () => {
    if (filteredPlans.length <= 2) return filteredPlans[filteredPlans.length - 1]?.id;
    return filteredPlans[Math.floor(filteredPlans.length / 2)]?.id;
  };
  
  const recommendedPlanId = getRecommendedPlanId();

  const handleSelectPlan = async (planId: string) => {
    if (!isLoggedIn) {
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

  // Add this effect to save the preference when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredBillingCycle', billingCycle);
    }
  }, [billingCycle]);

  if (!plans || plans.length === 0) {
    return <p className="text-center text-gray-400">No subscription plans available at the moment.</p>;
  }

  // Calculate savings percentage for yearly vs monthly
  const calculateSavings = () => {
    const monthlyPlans = plans.filter(plan => plan.billingCycle === 'MONTHLY');
    const yearlyPlans = plans.filter(plan => plan.billingCycle === 'ANNUALLY');
    
    if (monthlyPlans.length > 0 && yearlyPlans.length > 0) {
      // Find a plan with the same name in both cycles
      for (const monthlyPlan of monthlyPlans) {
        const matchingYearlyPlan = yearlyPlans.find(
          yearlyPlan => yearlyPlan.name === monthlyPlan.name
        );
        
        if (matchingYearlyPlan) {
          const monthlyCost = monthlyPlan.price;
          const yearlyCost = matchingYearlyPlan.price / 12; // Monthly equivalent
          const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
          if (savings > 0) return Math.round(savings);
        }
      }
    }
    
    return 15; // Default savings percentage if calculation not possible
  };

  const savingsPercentage = calculateSavings();

  return (
    <div id="pricing-plans" className="space-y-10">
      {/* Billing toggle */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => setBillingCycle('MONTHLY')}
          className={`px-4 py-2 rounded-md transition-colors ${
            billingCycle === 'MONTHLY'
              ? 'bg-neon-yellow text-black font-bold'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Monthly
        </button>
        
        <div className="relative">
          <div className="w-16 h-8 bg-gray-200 rounded-full p-1 cursor-pointer"
               onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'ANNUALLY' : 'MONTHLY')}>
            <motion.div 
              className="w-6 h-6 bg-white rounded-full shadow-md" 
              animate={{ x: billingCycle === 'ANNUALLY' ? 8 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
        
        <button
          onClick={() => setBillingCycle('ANNUALLY')}
          className={`px-4 py-2 rounded-md transition-colors flex items-center ${
            billingCycle === 'ANNUALLY'
              ? 'bg-neon-yellow text-black font-bold'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Annual
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-blood-red text-white text-xs font-medium">
            Save {savingsPercentage}%
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {filteredPlans.map((plan) => {
          const isLoading = loadingPlanId === plan.id;
          const isRecommended = plan.id === recommendedPlanId;
          
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              {isRecommended && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-blood-red text-white text-sm font-bold py-1 px-3 rounded-full flex items-center shadow-sm">
                    <Zap size={16} className="mr-1" /> MOST POPULAR
                  </span>
                </div>
              )}
              
              <Card 
                className={`flex flex-col h-full bg-white border ${
                  isRecommended ? 'border-blood-red shadow-lg' : 'border-gray-200 shadow-sm'
                } rounded-lg hover:border-neon-yellow transition-colors duration-200`}
              >
                <CardHeader className={`border-b border-gray-200 pb-4 ${isRecommended ? 'bg-red-50' : ''}`}>
                  <CardTitle className="text-2xl font-bebasNeue tracking-wider uppercase text-gray-800 text-center">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-500 text-center text-sm pt-1">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pt-6">
                  <div className="mb-6 text-center">
                    <span className="text-4xl font-bold text-gray-900">${plan.price > 0 ? plan.price.toFixed(2) : '0'}</span>
                    {plan.price > 0 && (
                      <span className="text-sm text-gray-500">
                        /{billingCycle === 'MONTHLY' ? 'month' : 'year'}
                      </span>
                    )}
                    
                    {billingCycle === 'ANNUALLY' && plan.price > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        ${(plan.price / 12).toFixed(2)}/month billed annually
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${
                          isRecommended ? 'text-blood-red' : 'text-neon-yellow'
                        }`} />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-4 pt-4 border-t border-gray-200">
                  {isLoggedIn ? (
                    <Button
                      className={`w-full font-bold uppercase tracking-wider py-3 text-base disabled:opacity-50 ${
                        isRecommended 
                          ? 'bg-blood-red text-white hover:brightness-95' 
                          : 'bg-neon-yellow text-black hover:brightness-95'
                      } transition-all duration-200 rounded-md shadow-md`}
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
                     <Button asChild className="w-full bg-blood-red text-white font-bold uppercase tracking-wider hover:brightness-95 transition-all duration-200 py-3 text-base rounded-md shadow-md">
                      <Link href="/auth/signin?callbackUrl=/pricing">Sign in to Subscribe</Link>
                     </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <div className="text-center text-gray-500 text-sm max-w-xl mx-auto pt-4">
        All plans include a 14-day money-back guarantee. You can cancel your subscription anytime from your dashboard.
        <br/>
        <a href="/terms" className="text-blood-red hover:underline">Terms and conditions</a> apply.
      </div>
    </div>
  );
} 