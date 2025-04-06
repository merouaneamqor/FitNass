const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed subscription plans...');

  // Free Trial Plan
  const freeTrial = await prisma.subscriptionPlan.upsert({
    where: { id: 'free-trial' },
    update: {},
    create: {
      id: 'free-trial',
      name: 'Free Trial',
      description: 'Try our services free for 14 days',
      price: 0,
      billingCycle: 'MONTHLY',
      features: JSON.stringify([
        { name: 'Up to 2 users', included: true },
        { name: '1 location', included: true },
        { name: 'Basic booking management', included: true },
        { name: 'Limited client records', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Unlimited bookings', included: false },
        { name: 'Marketing tools', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Priority support', included: false }
      ])
    }
  });

  // Basic Plan
  const basic = await prisma.subscriptionPlan.upsert({
    where: { id: 'basic' },
    update: {},
    create: {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for small businesses',
      price: 29.99,
      billingCycle: 'MONTHLY',
      features: JSON.stringify([
        { name: 'Up to 5 users', included: true },
        { name: '1 location', included: true },
        { name: 'Full booking management', included: true },
        { name: 'Unlimited client records', included: true },
        { name: 'Email & chat support', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Up to 200 bookings/month', included: true },
        { name: 'Marketing tools', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Priority support', included: false }
      ])
    }
  });

  // Professional Plan
  const professional = await prisma.subscriptionPlan.upsert({
    where: { id: 'professional' },
    update: {},
    create: {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses',
      price: 99.99,
      billingCycle: 'MONTHLY',
      features: JSON.stringify([
        { name: 'Up to 15 users', included: true },
        { name: 'Up to 3 locations', included: true },
        { name: 'Full booking management', included: true },
        { name: 'Unlimited client records', included: true },
        { name: 'Email & chat support', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Up to 1000 bookings/month', included: true },
        { name: 'Basic marketing tools', included: true },
        { name: 'Basic custom branding', included: true },
        { name: 'Priority support', included: false }
      ])
    }
  });

  // Enterprise Plan
  const enterprise = await prisma.subscriptionPlan.upsert({
    where: { id: 'enterprise' },
    update: {},
    create: {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large businesses',
      price: 299.99,
      billingCycle: 'MONTHLY',
      features: JSON.stringify([
        { name: 'Up to 50 users', included: true },
        { name: 'Unlimited locations', included: true },
        { name: 'Full booking management', included: true },
        { name: 'Unlimited client records', included: true },
        { name: 'Email, chat & phone support', included: true },
        { name: 'Advanced analytics & reports', included: true },
        { name: 'Unlimited bookings', included: true },
        { name: 'Advanced marketing tools', included: true },
        { name: 'Full custom branding', included: true },
        { name: 'Dedicated account manager', included: true }
      ])
    }
  });

  console.log('Subscription plans seeded successfully:');
  console.log(`- Created plan: ${freeTrial.name}`);
  console.log(`- Created plan: ${basic.name}`);
  console.log(`- Created plan: ${professional.name}`);
  console.log(`- Created plan: ${enterprise.name}`);
}

main()
  .catch((e) => {
    console.error('Error seeding subscription plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 