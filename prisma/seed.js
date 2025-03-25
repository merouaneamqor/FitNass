const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fitnass.com' },
    update: {},
    create: {
      email: 'admin@fitnass.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create gym owner users
  const gymOwnerPassword = await bcrypt.hash('owner123', 10);
  const gymOwner1 = await prisma.user.upsert({
    where: { email: 'owner1@fitnass.com' },
    update: {},
    create: {
      email: 'owner1@fitnass.com',
      name: 'Gym Owner 1',
      password: gymOwnerPassword,
      role: 'GYM_OWNER',
    },
  });
  console.log('Gym owner created:', gymOwner1.email);

  const gymOwner2 = await prisma.user.upsert({
    where: { email: 'owner2@fitnass.com' },
    update: {},
    create: {
      email: 'owner2@fitnass.com',
      name: 'Gym Owner 2',
      password: gymOwnerPassword,
      role: 'GYM_OWNER',
    },
  });
  console.log('Gym owner created:', gymOwner2.email);

  // Create regular users
  const userPassword = await bcrypt.hash('user123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('Regular user created:', user1.email);

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'Jane Smith',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('Regular user created:', user2.email);

  // Create gyms
  const gym1 = await prisma.gym.upsert({
    where: { id: 'gym1' },
    update: {},
    create: {
      id: 'gym1',
      name: 'FitLife Gym',
      description: 'A modern gym with state-of-the-art equipment and expert trainers.',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      latitude: 40.7128,
      longitude: -74.006,
      phone: '212-555-1234',
      website: 'https://fitlifegym.com',
      email: 'info@fitlifegym.com',
      rating: 4.7,
      priceRange: '$$',
      facilities: ['Cardio Machines', 'Weights', 'Pool', 'Sauna', 'Group Classes'],
      images: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
      ],
      ownerId: gymOwner1.id,
    },
  });
  console.log('Gym created:', gym1.name);

  const gym2 = await prisma.gym.upsert({
    where: { id: 'gym2' },
    update: {},
    create: {
      id: 'gym2',
      name: 'PowerFit Center',
      description: 'Specialized gym focusing on strength training and powerlifting.',
      address: '456 Broad Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      latitude: 34.0522,
      longitude: -118.2437,
      phone: '323-555-6789',
      website: 'https://powerfitcenter.com',
      email: 'contact@powerfitcenter.com',
      rating: 4.5,
      priceRange: '$$$',
      facilities: ['Free Weights', 'Squat Racks', 'Deadlift Platforms', 'Personal Training'],
      images: [
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
        'https://images.unsplash.com/photo-1558611848-73f7eb4001a1',
        'https://images.unsplash.com/photo-1546483875-ad9014c88eba',
      ],
      ownerId: gymOwner1.id,
    },
  });
  console.log('Gym created:', gym2.name);

  const gym3 = await prisma.gym.upsert({
    where: { id: 'gym3' },
    update: {},
    create: {
      id: 'gym3',
      name: 'Yoga & Wellness Studio',
      description: 'Peaceful studio offering yoga, meditation, and wellness classes.',
      address: '789 Tranquil Lane',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      latitude: 37.7749,
      longitude: -122.4194,
      phone: '415-555-4321',
      website: 'https://yogawellnessstudio.com',
      email: 'namaste@yogawellnessstudio.com',
      rating: 4.9,
      priceRange: '$$',
      facilities: ['Yoga Studio', 'Meditation Room', 'Massage Therapy', 'Wellness Store'],
      images: [
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597',
        'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
        'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3',
      ],
      ownerId: gymOwner2.id,
    },
  });
  console.log('Gym created:', gym3.name);

  // Create reviews
  const review1 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Amazing facilities and friendly staff. Highly recommend!',
      userId: user1.id,
      gymId: gym1.id,
    },
  });
  console.log('Review created for', gym1.name);

  const review2 = await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Great equipment but can get crowded during peak hours.',
      userId: user2.id,
      gymId: gym1.id,
    },
  });
  console.log('Review created for', gym1.name);

  const review3 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Perfect studio for yoga enthusiasts. Peaceful and clean.',
      userId: user1.id,
      gymId: gym3.id,
    },
  });
  console.log('Review created for', gym3.name);

  // Create promotions
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 2);

  const promotion1 = await prisma.promotion.create({
    data: {
      title: 'Summer Special: 20% Off',
      description: 'Get 20% off on all membership plans for the summer.',
      startDate: currentDate,
      endDate: futureDate,
      discount: '20% off',
      gymId: gym1.id,
    },
  });
  console.log('Promotion created for', gym1.name);

  const promotion2 = await prisma.promotion.create({
    data: {
      title: 'Free Trial Week',
      description: 'Try our gym for one week with no commitment.',
      startDate: currentDate,
      endDate: futureDate,
      discount: 'Free trial',
      gymId: gym2.id,
    },
  });
  console.log('Promotion created for', gym2.name);

  const promotion3 = await prisma.promotion.create({
    data: {
      title: 'Bring a Friend: 2-for-1 Special',
      description: 'Buy one membership and get one free for a friend.',
      startDate: currentDate,
      endDate: futureDate,
      discount: '2-for-1 deal',
      gymId: gym3.id,
    },
  });
  console.log('Promotion created for', gym3.name);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 