const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Moroccan cities with coordinates
const cities = [
  { name: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  { name: 'Rabat', lat: 34.0209, lng: -6.8416 },
  { name: 'Marrakech', lat: 31.6295, lng: -7.9811 },
  { name: 'Fès', lat: 34.0181, lng: -5.0078 },
  { name: 'Tanger', lat: 35.7673, lng: -5.7998 },
  { name: 'Agadir', lat: 30.4278, lng: -9.5981 },
  { name: 'Meknès', lat: 33.8731, lng: -5.5407 },
  { name: 'Oujda', lat: 34.6905, lng: -1.9056 },
  { name: 'Kénitra', lat: 34.2610, lng: -6.5802 },
];

// Gym names and concepts
const gymConcepts = [
  {
    prefix: "Fitness",
    suffixes: ["Club", "Center", "Pro", "Max", "Elite", "Zone", "Studio", "Premium"],
    descriptions: [
      "Modern gym with state-of-the-art equipment and expert trainers to help you achieve your fitness goals.",
      "A premium fitness center offering personalized training programs and a wide range of equipment.",
      "Join our community of fitness enthusiasts and transform your body with our comprehensive facilities."
    ],
    facilities: ["Cardio Area", "Strength Training", "Free Weights", "Locker Rooms", "Showers"]
  },
  {
    prefix: "PowerFit",
    suffixes: ["Gym", "Hub", "Center", "Club", "Arena"],
    descriptions: [
      "Specialized in strength training with premium weightlifting equipment and dedicated coaches.",
      "Build strength and endurance with our extensive collection of free weights and resistance machines.",
      "Where serious lifters come to train. Top-quality equipment in a motivating environment."
    ],
    facilities: ["Olympic Weightlifting", "Power Racks", "Free Weights", "Deadlift Platforms", "Strongman Equipment"]
  },
  {
    prefix: "Wellness",
    suffixes: ["Hub", "Center", "Spa", "Retreat", "Studio", "Sanctuary"],
    descriptions: [
      "Holistic wellness center combining fitness, nutrition guidance, and relaxation therapies.",
      "Focus on your overall wellbeing with our balanced approach to fitness and health.",
      "A sanctuary for body and mind wellness, featuring both exercise facilities and relaxation areas."
    ],
    facilities: ["Yoga Studio", "Meditation Room", "Nutritionist", "Massage", "Light Therapy"]
  },
  {
    prefix: "CrossTrain",
    suffixes: ["Box", "Arena", "Zone", "Hub", "Center"],
    descriptions: [
      "High-intensity functional training gym with daily WODs and supportive community.",
      "Challenge yourself with our functional fitness programs designed for all skill levels.",
      "Build strength, endurance, and agility through varied, functional movements at high intensity."
    ],
    facilities: ["Functional Training", "CrossFit Equipment", "Kettlebells", "Climbing Ropes", "Assault Bikes"]
  },
  {
    prefix: "Muscle",
    suffixes: ["Factory", "Hub", "Zone", "Temple", "Arena"],
    descriptions: [
      "Bodybuilding-focused gym with extensive equipment for serious muscle development.",
      "Premium bodybuilding gym with state-of-the-art machines and free weights for maximum gains.",
      "Build your ideal physique with our comprehensive range of equipment designed for muscle growth."
    ],
    facilities: ["Free Weights", "Smith Machines", "Cable Stations", "Isolation Machines", "Supplement Bar"]
  },
  {
    prefix: "Elite",
    suffixes: ["Fitness", "Training", "Performance", "Athletics", "Gym"],
    descriptions: [
      "Premium fitness club with exclusive amenities and personalized coaching for discerning members.",
      "Luxury fitness experience with high-end equipment and premium services in an elegant environment.",
      "Where fitness meets luxury. Exclusive training facilities with personalized service."
    ],
    facilities: ["Personal Training", "Towel Service", "Sauna", "Jacuzzi", "Lounge Area", "Nutrition Bar"]
  },
  {
    prefix: "Ladies",
    suffixes: ["Fitness", "Gym", "Studio", "Club", "Center"],
    descriptions: [
      "Women-only fitness center offering a comfortable environment with specialized programs.",
      "Created by women for women, our gym provides a supportive space for achieving your fitness goals.",
      "Female-focused fitness facility with tailored programs and a welcoming, supportive community."
    ],
    facilities: ["Cardio Equipment", "Light Weights", "Zumba Studio", "Pilates", "Women's Locker Room"]
  },
  {
    prefix: "24/7",
    suffixes: ["Fitness", "Gym", "Center", "Club", "Zone"],
    descriptions: [
      "Round-the-clock access to fitness equipment, allowing you to work out on your own schedule.",
      "Flexible fitness solution with 24/7 access for busy professionals and night owls.",
      "Always open, always ready. Train whenever suits your lifestyle with our secure 24/7 facilities."
    ],
    facilities: ["Cardio Equipment", "Machine Weights", "Free Weights", "Security System", "Vending Machines"]
  }
];

// Additional gym facilities
const additionalFacilities = [
  "Personal Training", "Group Classes", "Cardio Area", "Strength Training", "Free Weights",
  "Machines", "Functional Training", "CrossFit", "Yoga Studio", "Pilates",
  "Boxing", "Cycling Studio", "Swimming Pool", "Sauna", "Steam Room",
  "Jacuzzi", "Locker Rooms", "Showers", "Towel Service", "Protein Bar",
  "Juice Bar", "Nutrition Counseling", "Childcare", "Parking", "WiFi",
  "Mobile App", "TRX", "HIIT", "Zumba", "Bootcamp",
  "Kettlebells", "Massage", "Physical Therapy", "Body Composition Analysis", "Virtual Classes"
];

// Create the gym owner accounts and example gyms
async function main() {
  console.log('Starting to seed gyms data...');

  // Create gym owner accounts
  const owners = [];
  for (let i = 1; i <= 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const owner = await prisma.user.upsert({
      where: { email: `gym-owner-${i}@example.com` },
      update: {},
      create: {
        email: `gym-owner-${i}@example.com`,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        role: 'GYM_OWNER',
      },
    });
    
    owners.push(owner);
    console.log(`Created gym owner: ${owner.email}`);
  }

  // Create example gyms
  const total = 20; // Create 20 gyms
  const gyms = [];

  for (let i = 0; i < total; i++) {
    // Select a random city
    const city = faker.helpers.arrayElement(cities);
    
    // Create slight randomness in location
    const latitude = city.lat + (Math.random() * 0.03 - 0.015);
    const longitude = city.lng + (Math.random() * 0.03 - 0.015);
    
    // Select a random concept
    const concept = faker.helpers.arrayElement(gymConcepts);
    
    // Generate gym name
    const prefix = concept.prefix;
    const suffix = faker.helpers.arrayElement(concept.suffixes);
    const gymName = `${prefix} ${suffix}${i % 5 === 0 ? ` ${city.name}` : ''}`;
    
    // Generate description
    const description = faker.helpers.arrayElement(concept.descriptions);
    
    // Generate facilities
    let facilities = [...concept.facilities];
    
    // Add some random additional facilities
    const additionalCount = faker.number.int({ min: 3, max: 8 });
    const additionalForThisGym = faker.helpers.arrayElements(additionalFacilities, additionalCount);
    facilities = [...new Set([...facilities, ...additionalForThisGym])];
    
    // Generate price range
    const priceRanges = ['€', '€€', '€€€'];
    const priceWeights = [0.3, 0.5, 0.2]; // 30% budget, 50% mid-range, 20% premium
    
    let priceRange;
    const randValue = Math.random();
    if (randValue < priceWeights[0]) {
      priceRange = priceRanges[0];
    } else if (randValue < priceWeights[0] + priceWeights[1]) {
      priceRange = priceRanges[1];
    } else {
      priceRange = priceRanges[2];
    }
    
    // Select random owner
    const owner = faker.helpers.arrayElement(owners);
    
    // Generate sample images
    const images = [
      `https://picsum.photos/seed/${gymName.replace(/\s+/g, '')}-1/800/600`,
      `https://picsum.photos/seed/${gymName.replace(/\s+/g, '')}-2/800/600`,
      `https://picsum.photos/seed/${gymName.replace(/\s+/g, '')}-3/800/600`,
    ];
    
    // Create gym in database
    const gym = await prisma.gym.create({
      data: {
        name: gymName,
        description,
        address: faker.location.streetAddress(),
        city: city.name,
        state: 'Morocco',
        zipCode: faker.location.zipCode(),
        latitude,
        longitude,
        phone: faker.phone.number('+212 #{###} #{####}'),
        website: `https://www.${gymName.toLowerCase().replace(/\s+/g, '')}.ma`,
        email: `info@${gymName.toLowerCase().replace(/\s+/g, '')}.ma`,
        rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
        priceRange,
        facilities,
        images,
        ownerId: owner.id,
        status: 'ACTIVE',
        viewCount: faker.number.int({ min: 10, max: 500 }),
      }
    });
    
    gyms.push(gym);
    console.log(`Created gym: ${gym.name} in ${city.name}`);
    
    // Create some reviews for each gym
    const reviewCount = faker.number.int({ min: 3, max: 15 });
    
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
          }
        });
      }
      
      // Create review
      const review = await prisma.review.create({
        data: {
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.paragraph(),
          gymId: gym.id,
          userId: reviewUser.id,
          isHelpful: faker.number.int({ min: 0, max: 20 }),
          status: 'PUBLISHED',
        }
      });
      
      console.log(`Created review for ${gym.name} by ${reviewUser.email}`);
    }
    
    // Create some promotions for premium gyms
    if (priceRange === '€€€' || faker.datatype.boolean(0.3)) {
      const promoCount = faker.number.int({ min: 1, max: 3 });
      
      for (let k = 0; k < promoCount; k++) {
        const startDate = faker.date.soon({ days: 7 });
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + faker.number.int({ min: 30, max: 90 }));
        
        const promo = await prisma.promotion.create({
          data: {
            title: `${faker.number.int({ min: 10, max: 50 })}% Off ${faker.word.sample()} Membership`,
            description: faker.lorem.sentence(),
            startDate,
            endDate,
            discount: `${faker.number.int({ min: 10, max: 50 })}%`,
            gymId: gym.id,
            redemptionCount: faker.number.int({ min: 0, max: 50 }),
            status: 'ACTIVE',
          }
        });
        
        console.log(`Created promotion for ${gym.name}`);
      }
    }
  }

  console.log(`Created ${gyms.length} gyms with reviews and promotions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 