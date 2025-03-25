const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listGymsSummary() {
  try {
    const gyms = await prisma.gym.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        rating: true,
        priceRange: true,
        facilities: true,
        owner: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            reviews: true,
            promotions: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });
    
    console.log('GYMS IN DATABASE:');
    console.log('=================\n');
    
    gyms.forEach(gym => {
      console.log(`ID: ${gym.id}`);
      console.log(`Name: ${gym.name}`);
      console.log(`City: ${gym.city}`);
      console.log(`Rating: ${gym.rating} ⭐`);
      console.log(`Price Range: ${gym.priceRange}`);
      console.log(`Facilities: ${gym.facilities.join(', ')}`);
      console.log(`Owner: ${gym.owner.name} (${gym.owner.email})`);
      console.log(`Reviews: ${gym._count.reviews}`);
      console.log(`Promotions: ${gym._count.promotions}`);
      console.log('-'.repeat(50));
    });
    
    console.log(`\nTotal gyms: ${gyms.length}`);
  } catch (error) {
    console.error('Error fetching gyms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listGymsSummary(); 