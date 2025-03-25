const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listGyms() {
  try {
    const gyms = await prisma.gym.findMany({
      include: {
        owner: true,
        reviews: true,
        promotions: true,
      }
    });
    
    console.log(JSON.stringify(gyms, null, 2));
    console.log(`Total gyms: ${gyms.length}`);
  } catch (error) {
    console.error('Error fetching gyms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listGyms(); 