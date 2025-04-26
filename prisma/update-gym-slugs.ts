const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Define the slugify function directly in the script
function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word chars, and consecutive dashes with a single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

async function updateGymSlugs() {
  console.log('Starting slug update for gyms...');
  
  try {
    // Get all gyms
    const gyms = await prisma.gym.findMany();
    console.log(`Found ${gyms.length} gyms to update`);
    
    // Update each gym with slugs
    for (const gym of gyms) {
      // Generate slugs from name and city
      const citySlug = slugify(gym.city);
      let slug = slugify(gym.name);
      
      // Check if this slug combination already exists
      const existingGym = await prisma.gym.findFirst({
        where: {
          citySlug,
          slug,
          id: { not: gym.id } // Don't match the current gym
        }
      });
      
      // If duplicate, append a random string
      if (existingGym) {
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        slug = `${slug}-${randomSuffix}`;
      }
      
      // Update the gym
      await prisma.gym.update({
        where: { id: gym.id },
        data: { slug, citySlug }
      });
      
      console.log(`Updated gym: ${gym.name} (${gym.city}) → ${citySlug}/${slug}`);
    }
    
    console.log('Successfully updated all gym slugs!');
  } catch (error) {
    console.error('Error updating gym slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateGymSlugs()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 