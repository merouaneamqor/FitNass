import { prisma } from '@/lib/prisma';
import { SubscriptionPlan } from '@prisma/client';
import SubscriptionPlansClient from "@/components/subscriptions/SubscriptionPlans";

async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    // Fetch active plans, ordered by price (can be adjusted)
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    return plans;
  } catch (error) {
    console.error("Failed to fetch subscription plans for pricing page:", error);
    return []; // Return empty array on error
  }
}

export default async function PricingPage() {
  const plans = await fetchSubscriptionPlans(); // Fetch data here on the server

  return (
    <div className="container mx-auto py-16 px-4 bg-black text-white">
      <h1 className="text-6xl font-bebasNeue text-center mb-6 tracking-wider uppercase">
        <span className="text-neon-yellow">Choose</span> Your <span className="text-blood-red">Weapon</span>
      </h1>
      <p className="text-center text-neutral-300 mb-16 max-w-2xl mx-auto font-poppins text-lg">
        Select the perfect ammo pack for your facility. Dominate bookings, members, and crush the competition with FitNass.
      </p>
      <SubscriptionPlansClient plans={plans} />
    </div>
  );
} 