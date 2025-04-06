const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Sport field types from the schema
const sportFieldTypes = [
  'FOOTBALL',
  'TENNIS',
  'BASKETBALL',
  'VOLLEYBALL',
  'SQUASH',
  'PADEL',
  'SWIMMING_POOL',
  'GOLF',
  'OTHER'
];

// Surface types by sport field type
const surfaceTypes = {
  FOOTBALL: ['Grass', 'Artificial turf', 'Indoor turf'],
  TENNIS: ['Clay', 'Hard court', 'Grass', 'Carpet'],
  BASKETBALL: ['Hardwood', 'Synthetic', 'Concrete', 'Asphalt'],
  VOLLEYBALL: ['Sand', 'Hardwood', 'Synthetic'],
  SQUASH: ['Hardwood', 'Synthetic'],
  PADEL: ['Artificial turf', 'Synthetic'],
  SWIMMING_POOL: ['Indoor', 'Outdoor', 'Olympic', 'Semi-Olympic'],
  GOLF: ['18-hole', '9-hole', 'Driving range', 'Mini golf'],
  OTHER: ['Multi-purpose', 'Synthetic', 'Indoor', 'Outdoor']
};

// Amenities by field type
const amenitiesByType = {
  FOOTBALL: ['Changing rooms', 'Showers', 'Floodlights', 'Equipment rental', 'Parking', 'Spectator seating', 'Water dispensers'],
  TENNIS: ['Changing rooms', 'Showers', 'Ball machine', 'Equipment rental', 'Pro shop', 'Coaching service'],
  BASKETBALL: ['Changing rooms', 'Showers', 'Scoreboard', 'Ball rental', 'Water dispensers'],
  VOLLEYBALL: ['Changing rooms', 'Showers', 'Net adjustment', 'Ball rental', 'Beach chairs'],
  SQUASH: ['Changing rooms', 'Showers', 'Racket rental', 'Ball rental', 'Air conditioning'],
  PADEL: ['Changing rooms', 'Showers', 'Racket rental', 'Ball rental', 'Coaching service'],
  SWIMMING_POOL: ['Changing rooms', 'Showers', 'Towel service', 'Lockers', 'Swimming lanes', 'Lifeguard', 'Swimming lessons'],
  GOLF: ['Club house', 'Pro shop', 'Equipment rental', 'Golf carts', 'Coaching service', 'Restaurant', 'Putting green'],
  OTHER: ['Changing rooms', 'Showers', 'Equipment rental', 'Water dispensers', 'First aid kit']
};

// Generate random price per hour based on field type
function getPricePerHour(type) {
  const priceRanges = {
    FOOTBALL: { min: 250, max: 800 },
    TENNIS: { min: 100, max: 300 },
    BASKETBALL: { min: 150, max: 400 },
    VOLLEYBALL: { min: 150, max: 350 },
    SQUASH: { min: 80, max: 200 },
    PADEL: { min: 120, max: 250 },
    SWIMMING_POOL: { min: 50, max: 150 },
    GOLF: { min: 300, max: 1000 },
    OTHER: { min: 100, max: 300 }
  };

  const range = priceRanges[type] || { min: 100, max: 500 };
  return faker.number.int({ min: range.min, max: range.max });
}

// Helper to get random items from an array
function getRandomItems(array, min, max) {
  const count = faker.number.int({ min, max: Math.min(max, array.length) });
  return faker.helpers.arrayElements(array, count);
}

// Generate availability data for a field
function generateAvailability() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const availability = {};

  days.forEach(day => {
    // 80% chance the field is available on this day
    if (faker.number.int({ min: 1, max: 10 }) <= 8) {
      // Random opening hour between 6-10 AM
      const openHour = faker.number.int({ min: 6, max: 10 });
      // Random closing hour between 6-11 PM
      const closeHour = faker.number.int({ min: 18, max: 23 });
      
      availability[day] = {
        isOpen: true,
        openTime: `${openHour}:00`,
        closeTime: `${closeHour}:00`
      };
    } else {
      availability[day] = { isOpen: false };
    }
  });

  return availability;
}

// Create seed data
async function main() {
  console.log('Starting database seeding for sport clubs and fields...');

  // Create club owner
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const clubOwner = await prisma.user.upsert({
    where: { email: 'club-owner@example.com' },
    update: {},
    create: {
      email: 'club-owner@example.com',
      name: 'Club Owner',
      password: hashedPassword,
      role: 'CLUB_OWNER',
      isVerified: true,
    },
  });
  
  console.log(`Created club owner: ${clubOwner.email}`);
  
  // Moroccan cities with coordinates
  const cities = [
    { name: 'Casablanca', lat: 33.5731, lng: -7.5898 },
    { name: 'Rabat', lat: 34.0209, lng: -6.8416 },
    { name: 'Marrakech', lat: 31.6295, lng: -7.9811 },
    { name: 'Fès', lat: 34.0181, lng: -5.0078 },
    { name: 'Tanger', lat: 35.7673, lng: -5.7998 },
    { name: 'Agadir', lat: 30.4278, lng: -9.5981 },
  ];
  
  // Create clubs (one for each city)
  const clubs = [];
  
  for (const city of cities) {
    const club = await prisma.club.create({
      data: {
        name: `${city.name} Sports Complex`,
        description: `A modern sports facility in ${city.name} offering a variety of amenities and fields for all sports enthusiasts.`,
        address: faker.location.streetAddress(),
        city: city.name,
        state: 'Morocco',
        zipCode: faker.location.zipCode(),
        latitude: city.lat + (Math.random() * 0.02 - 0.01), // Add some variation
        longitude: city.lng + (Math.random() * 0.02 - 0.01),
        phone: faker.phone.number('+212 5########'),
        website: `https://www.${city.name.toLowerCase()}sports.ma`,
        email: `info@${city.name.toLowerCase()}sports.ma`,
        images: [
          faker.image.urlLoremFlickr({ category: 'sports' }),
          faker.image.urlLoremFlickr({ category: 'sports' }),
          faker.image.urlLoremFlickr({ category: 'sports' }),
        ],
        facilities: getRandomItems([
          'Café', 'Parking', 'Lockers', 'Showers', 'Wi-Fi', 'Pro shop',
          'Restaurant', 'Children's area', 'Fitness center', 'First aid'
        ], 3, 7),
        openingHours: JSON.stringify({
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '09:00', close: '20:00' },
          sunday: { open: '09:00', close: '18:00' },
        }),
        status: 'ACTIVE',
        ownerId: clubOwner.id,
        isVerified: true,
      }
    });
    
    clubs.push(club);
    console.log(`Created club: ${club.name}`);
  }
  
  // Create sport fields for each club
  for (const club of clubs) {
    // How many fields to create for this club (3-8)
    const fieldCount = faker.number.int({ min: 3, max: 8 });
    
    // Shuffle the sport field types to select a random subset
    const shuffledTypes = [...sportFieldTypes].sort(() => 0.5 - Math.random());
    const selectedTypes = shuffledTypes.slice(0, fieldCount);
    
    // For each selected type, create a field
    for (let i = 0; i < selectedTypes.length; i++) {
      const fieldType = selectedTypes[i];
      const isIndoor = faker.datatype.boolean(0.3); // 30% chance of being indoor
      
      // Get appropriate surface for this field type
      const surfaceOptions = surfaceTypes[fieldType];
      const surface = faker.helpers.arrayElement(surfaceOptions);
      
      // Get amenities
      const amenities = getRandomItems(amenitiesByType[fieldType], 2, 5);
      
      // Create name based on the field number and type
      const fieldName = `${fieldType.charAt(0) + fieldType.slice(1).toLowerCase().replace('_', ' ')} ${i + 1}`;
      
      // Create the sport field
      const sportField = await prisma.sportField.create({
        data: {
          name: fieldName,
          description: `${isIndoor ? 'Indoor' : 'Outdoor'} ${fieldType.toLowerCase().replace('_', ' ')} field with ${surface} surface.`,
          type: fieldType,
          surface,
          indoor: isIndoor,
          size: faker.helpers.arrayElement(['Small', 'Medium', 'Standard', 'Large', 'Olympic']),
          maxCapacity: faker.number.int({ min: 2, max: 30 }),
          pricePerHour: getPricePerHour(fieldType),
          availability: generateAvailability(),
          amenities,
          images: [
            faker.image.urlLoremFlickr({ category: fieldType.toLowerCase() }),
            faker.image.urlLoremFlickr({ category: 'sports' }),
          ],
          clubId: club.id,
          status: 'AVAILABLE',
        }
      });
      
      console.log(`Created sport field: ${sportField.name} at ${club.name}`);
    }
  }
  
  // Create some regular users for reservations
  const users = [];
  
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        name: faker.person.fullName(),
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
        isVerified: true,
      },
    });
    
    users.push(user);
    console.log(`Created user: ${user.email}`);
  }
  
  // Create some reservations (30% of fields will have existing reservations)
  const sportFields = await prisma.sportField.findMany();
  
  for (const field of sportFields) {
    // 30% chance of having reservations
    if (faker.number.int({ min: 1, max: 10 }) <= 3) {
      // Create 1-3 reservations for this field
      const reservationCount = faker.number.int({ min: 1, max: 3 });
      
      for (let i = 0; i < reservationCount; i++) {
        // Random date in the next 7 days
        const reservationDate = new Date();
        reservationDate.setDate(reservationDate.getDate() + faker.number.int({ min: 1, max: 7 }));
        
        // Random hour (8 AM - 8 PM)
        reservationDate.setHours(faker.number.int({ min: 8, max: 20 }), 0, 0, 0);
        
        // Duration (1-2 hours)
        const durationHours = faker.number.int({ min: 1, max: 2 });
        
        // End time
        const endTime = new Date(reservationDate);
        endTime.setHours(endTime.getHours() + durationHours);
        
        // Random user
        const randomUser = faker.helpers.arrayElement(users);
        
        // Create the reservation
        const reservation = await prisma.reservation.create({
          data: {
            startTime: reservationDate,
            endTime: endTime,
            status: faker.helpers.arrayElement(['PENDING', 'CONFIRMED']),
            totalPrice: field.pricePerHour * durationHours,
            userId: randomUser.id,
            sportFieldId: field.id,
            paymentStatus: faker.helpers.arrayElement(['UNPAID', 'PAID']),
            participantCount: faker.number.int({ min: 1, max: 10 }),
            notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
          }
        });
        
        console.log(`Created reservation for ${field.name} on ${reservationDate.toLocaleString()}`);
      }
    }
  }
  
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 