const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to create annual version of a plan
const createAnnualPlan = (monthlyPlan, discount = 0.20) => {
  const annualPrice = Math.round(monthlyPlan.price * 12 * (1 - discount) * 100) / 100; // 20% discount by default, rounded to 2 decimal places
  return {
    ...monthlyPlan,
    price: annualPrice,
    billingCycle: 'ANNUALLY',
    description: `${monthlyPlan.description} (Annual billing)`,
  };
};

async function main() {
  console.log('Starting to seed subscription plans...');

  // Define monthly plans
  const monthlyPlans = [
    {
      name: 'Free Trial',
      description: 'Try our services free for 14 days',
      price: 0,
      billingCycle: 'MONTHLY',
      features: [
        'Up to 2 users',
        '1 location',
        'Basic booking management',
        'Limited client records',
        'Email support'
      ],
      tier: 'FREE',
      planType: 'free-trial',
      supportLevel: 'BASIC',
      analyticsLevel: 'NONE'
    },
    {
      name: 'Basic',
      description: 'Perfect for small businesses',
      price: 29.99,
      billingCycle: 'MONTHLY',
      features: [
        'Up to 5 users',
        '1 location',
        'Full booking management',
        'Unlimited client records',
        'Email & chat support',
        'Basic analytics',
        'Up to 200 bookings/month'
      ],
      tier: 'BASIC',
      planType: 'basic',
      supportLevel: 'BASIC',
      analyticsLevel: 'BASIC'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      price: 99.99,
      billingCycle: 'MONTHLY',
      features: [
        'Up to 15 users',
        'Up to 3 locations',
        'Full booking management',
        'Unlimited client records',
        'Email & chat support',
        'Advanced analytics',
        'Up to 1000 bookings/month',
        'Basic marketing tools',
        'Basic custom branding'
      ],
      tier: 'PRO',
      planType: 'professional',
      supportLevel: 'PRIORITY',
      analyticsLevel: 'ADVANCED'
    },
    {
      name: 'Enterprise',
      description: 'Complete solution for large businesses',
      price: 299.99,
      billingCycle: 'MONTHLY',
      features: [
        'Up to 50 users',
        'Unlimited locations',
        'Full booking management',
        'Unlimited client records',
        'Email, chat & phone support',
        'Advanced analytics & reports',
        'Unlimited bookings',
        'Advanced marketing tools',
        'Full custom branding',
        'Dedicated account manager'
      ],
      tier: 'ENTERPRISE',
      planType: 'enterprise',
      supportLevel: 'DEDICATED',
      analyticsLevel: 'ADVANCED'
    }
  ];

  // Generate annual plans
  const annualPlans = monthlyPlans
    .filter(plan => plan.price > 0) // Skip free plans
    .map(plan => createAnnualPlan(plan));

  // Combine all plans
  const allPlans = [...monthlyPlans, ...annualPlans];

  // Clear existing plans to prevent duplicates
  await prisma.subscriptionPlan.deleteMany({});

  // Create all plans
  for (const plan of allPlans) {
    const { planType, ...planData } = plan; // Extract planType and prepare planData for insertion
    
    await prisma.subscriptionPlan.create({
      data: {
        ...planData,
        isActive: true
      }
    });
    console.log(`- Created plan: ${plan.name} (${plan.billingCycle.toLowerCase()})`);
  }

  console.log('Subscription plans seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding subscription plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 