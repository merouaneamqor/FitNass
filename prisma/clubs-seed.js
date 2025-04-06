const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed clubs data...');

  // Create club owner accounts
  const owners = [];
  for (let i = 1; i <= 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const owner = await prisma.user.upsert({
      where: { email: `club-owner-${i}@example.com` },
      update: {},
      create: {
        email: `club-owner-${i}@example.com`,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        role: 'CLUB_OWNER',
        isVerified: true,
      },
    });
    
    owners.push(owner);
    console.log(`Created club owner: ${owner.email}`);
  }

  // Read clubs data from file
  const clubsFilePath = path.join(__dirname, '../clubs.json');
  const clubsData = JSON.parse(fs.readFileSync(clubsFilePath, 'utf-8'));
  
  console.log(`Read ${clubsData.length} clubs from clubs.json`);

  // Filter out entries with name "N/A"
  const validClubs = clubsData.filter(club => club.name !== "N/A");
  console.log(`Found ${validClubs.length} valid clubs after filtering`);

  // Import a subset of clubs to avoid overwhelming the database
  const clubsToImport = validClubs.slice(0, 30);
  const importedClubs = [];

  for (const clubData of clubsToImport) {
    try {
      // Map the fields from the JSON format to our database schema
      const activities = clubData.activities ? clubData.activities.split(', ') : [];
      const facilities = [...activities, clubData.type].filter(Boolean);
      
      // Generate a random rating if not provided or zero
      const rating = clubData.rating > 0 
        ? clubData.rating 
        : faker.number.float({ min: 3.5, max: 4.9, precision: 0.1 });
      
      // Select random owner
      const owner = faker.helpers.arrayElement(owners);
      
      // Generate images - use the provided image_url as first image or generate placeholders
      const images = [];
      if (clubData.image_url && clubData.image_url !== "N/A") {
        images.push(clubData.image_url);
      }
      
      // Add some placeholder images if needed
      while (images.length < 3) {
        images.push(`https://picsum.photos/seed/${clubData.name.replace(/\s+/g, '')}-${images.length + 1}/800/600`);
      }
      
      // Add some randomness to coordinates
      const latitude = 33.5731 + (Math.random() * 2 - 1); // Around Morocco
      const longitude = -7.5898 + (Math.random() * 2 - 1);
      
      // Create the club
      const club = await prisma.club.create({
        data: {
          name: clubData.name,
          description: clubData.description !== "N/A" 
            ? clubData.description 
            : `Sports club in ${clubData.city}`,
          address: clubData.address !== "N/A" 
            ? clubData.address 
            : faker.location.streetAddress(),
          city: clubData.city !== "N/A" 
            ? clubData.city 
            : faker.helpers.arrayElement(['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir']),
          state: 'Morocco',
          zipCode: faker.location.zipCode(),
          latitude,
          longitude,
          phone: clubData.phone !== "N/A" 
            ? clubData.phone 
            : faker.phone.number('+212 #{###} #{####}'),
          website: clubData.url !== "N/A" 
            ? clubData.url 
            : `https://www.${clubData.name.toLowerCase().replace(/\s+/g, '')}.ma`,
          email: `info@${clubData.name.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}.ma`,
          rating,
          facilities,
          images,
          ownerId: owner.id,
          isVerified: clubData.verified,
          status: 'ACTIVE',
          viewCount: faker.number.int({ min: 10, max: 500 }),
        }
      });
      
      importedClubs.push(club);
      console.log(`Created club: ${club.name} in ${club.city}`);
      
      // Create some reviews for each club
      const reviewCount = faker.number.int({ min: 3, max: 10 });
      
      for (let j = 0; j < reviewCount; j++) {
        // Get a random user (not the owner)
        const userEmail = `user${faker.number.int({ min: 1, max: 10 })}@example.com`;
        
        let reviewUser = await prisma.user.findUnique({
          where: { email: userEmail }
        });
        
        if (!reviewUser) {
          // Create the user if they don't exist
          reviewUser = await prisma.user.create({
            data: {
              email: userEmail,
              name: `${faker.person.firstName()} ${faker.person.lastName()}`,
              password: await bcrypt.hash('password123', 10),
              role: 'USER',
              isVerified: true,
            }
          });
        }
        
        // Create review
        const review = await prisma.review.create({
          data: {
            rating: faker.number.int({ min: 3, max: 5 }),
            comment: faker.lorem.paragraph(),
            clubId: club.id,
            userId: reviewUser.id,
            isHelpful: faker.number.int({ min: 0, max: 20 }),
            status: 'PUBLISHED',
          }
        });
        
        console.log(`Created review for ${club.name} by ${reviewUser.email}`);
      }
      
      // Create sport fields for each club
      const fieldCount = faker.number.int({ min: 1, max: 5 });
      const sportTypes = ['FOOTBALL', 'TENNIS', 'BASKETBALL', 'VOLLEYBALL', 'PADEL', 'SWIMMING_POOL'];
      
      for (let k = 0; k < fieldCount; k++) {
        const sportType = faker.helpers.arrayElement(sportTypes);
        const hourlyRate = faker.number.int({ min: 100, max: 500 });
        
        const sportField = await prisma.sportField.create({
          data: {
            name: `${sportType} Field ${k + 1}`,
            description: `Professional ${sportType.toLowerCase()} field with excellent conditions.`,
            type: sportType,
            pricePerHour: hourlyRate,
            surface: faker.helpers.arrayElement(['Grass', 'Synthetic', 'Wood', 'Clay', 'Concrete']),
            indoor: faker.datatype.boolean(),
            size: `${faker.number.int({ min: 20, max: 100 })}m x ${faker.number.int({ min: 10, max: 50 })}m`,
            maxCapacity: faker.number.int({ min: 2, max: sportType === 'FOOTBALL' ? 22 : 8 }),
            amenities: faker.helpers.arrayElements(
              ['Changing Rooms', 'Showers', 'Lighting', 'Equipment Rental', 'Parking', 'Water Dispenser'], 
              faker.number.int({ min: 1, max: 4 })
            ),
            images: [
              `https://picsum.photos/seed/${club.name}-${sportType}-${k}-1/800/600`,
              `https://picsum.photos/seed/${club.name}-${sportType}-${k}-2/800/600`
            ],
            status: 'AVAILABLE',
            clubId: club.id,
          }
        });
        
        console.log(`Created sport field: ${sportField.name} for ${club.name}`);
      }
      
    } catch (error) {
      console.error(`Error creating club ${clubData.name}:`, error);
    }
  }

  console.log(`Successfully imported ${importedClubs.length} clubs with reviews and sport fields`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 