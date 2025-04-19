require('dotenv').config();
const { PrismaClient, PlanTier, BillingCycle, PlanAnalyticsLevel, PlanSupportLevel } = require('@prisma/client');

const prisma = new PrismaClient();

const plans = [
  {
    name: 'Free',
    tier: PlanTier.FREE,
    description: 'Get started with essential features.',
    price: 0,
    billingCycle: BillingCycle.MONTHLY,
    features: ['1 Gym/Club Listing', 'Basic Booking Management', 'Community Support'],
    maxGyms: 1,
    maxClubs: 1,
    maxLocations: 1,
    analyticsLevel: PlanAnalyticsLevel.NONE,
    supportLevel: PlanSupportLevel.NONE,
    isActive: true,
  },
  {
    name: 'Basic',
    tier: PlanTier.BASIC,
    description: 'Ideal for small, independent facilities.',
    price: 49.99, // Example price
    billingCycle: BillingCycle.MONTHLY,
    features: ['Up to 5 Gym/Club Listings', 'Advanced Booking Management', 'Basic Analytics', 'Email Support', 'Custom Branding (Basic)'],
    maxGyms: 5,
    maxClubs: 5,
    maxLocations: 1,
    analyticsLevel: PlanAnalyticsLevel.BASIC,
    supportLevel: PlanSupportLevel.BASIC,
    isActive: true,
  },
  {
    name: 'Pro',
    tier: PlanTier.PRO,
    description: 'For growing businesses needing more power.',
    price: 99.99, // Example price
    billingCycle: BillingCycle.MONTHLY,
    features: ['Unlimited Listings', 'Advanced Analytics & Reporting', 'Marketing Tools', 'Priority Support', 'Full Custom Branding', 'API Access'],
    maxGyms: null, // null indicates unlimited
    maxClubs: null,
    maxLocations: 5, // Example limit
    analyticsLevel: PlanAnalyticsLevel.ADVANCED,
    supportLevel: PlanSupportLevel.PRIORITY,
    isActive: true,
  },
    {
    name: 'Enterprise',
    tier: PlanTier.ENTERPRISE,
    description: 'Tailored solutions for large organizations and chains.',
    price: 0, // Typically custom pricing
    billingCycle: BillingCycle.ANNUALLY, // Often billed annually
    features: ['Everything in Pro', 'Multi-location Management', 'Dedicated Account Manager', 'Custom Integrations', 'SLA'],
    maxGyms: null,
    maxClubs: null,
    maxLocations: null,
    analyticsLevel: PlanAnalyticsLevel.ADVANCED,
    supportLevel: PlanSupportLevel.DEDICATED,
    isActive: true, // May require manual activation/contact
  },
];

async function main() {
  console.log('Starting subscription plan seeding...');

  for (const planData of plans) {
    const existingPlan = await prisma.subscriptionPlan.findFirst({
        where: { name: planData.name }
    });

    if (!existingPlan) {
        const plan = await prisma.subscriptionPlan.create({
            data: planData,
        });
        console.log(`Created plan: ${plan.name}`);
    } else {
         // Optionally update existing plans if needed
         const updatedPlan = await prisma.subscriptionPlan.update({
            where: { id: existingPlan.id },
            data: planData, // Update with the latest data
         });
         console.log(`Updated existing plan: ${updatedPlan.name}`);
    }
  }

  console.log('Subscription plan seeding finished.');
}

main()
  .catch((e) => {
    console.error('Error seeding subscription plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 