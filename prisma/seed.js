require('dotenv').config(); // Load environment variables from .env file

// Debug: Print the loaded MONGO_URL
console.log('DEBUG: MONGO_URL =', process.env.MONGO_URL);

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Helper to generate random items from an array
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
const randomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Load scraped data from JSON file
const loadScrapedData = () => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, '../clubs.json'), 'utf8');
    const clubsData = JSON.parse(rawData);
    return clubsData.filter(club => club.name !== "N/A" && club.description !== "N/A");
  } catch (error) {
    console.error('Error loading clubs data:', error);
    return [];
  }
};

async function main() {
  console.log('Starting database seeding with scraped Moroccan gym data...');

  // Pre-defined arrays for filling in gaps or adding additional data
  const gymFacilities = [
    'Cardio', 'Musculation', 'Piscine', 'Sauna', 'Cours collectifs', 
    'Coach personnel', 'Boxe', 'Yoga', 'Pilates', 'CrossFit', 
    'Vestiaires', 'Douches', 'Parking gratuit', 'Massage', 'Nutrition', 
    'Hammam traditionnel', 'Espace femmes', 'MMA', 'Rooftop', 'HIIT'
  ];
  
  const moroccanCities = [
    { city: 'Casablanca', lat: 33.5731, lng: -7.5898 },
    { city: 'Rabat', lat: 34.0209, lng: -6.8416 },
    { city: 'Marrakech', lat: 31.6295, lng: -7.9811 },
    { city: 'Fès', lat: 34.0181, lng: -5.0078 },
    { city: 'Tanger', lat: 35.7673, lng: -5.7998 },
    { city: 'Meknès', lat: 33.8731, lng: -5.5407 },
    { city: 'Agadir', lat: 30.4278, lng: -9.5981 },
    { city: 'Tétouan', lat: 35.5689, lng: -5.3681 },
    { city: 'Oujda', lat: 34.6805, lng: -1.9056 },
    { city: 'Kénitra', lat: 34.2610, lng: -6.5802 },
    { city: 'Nador', lat: 35.1681, lng: -2.9330 },
    { city: 'Mohammedia', lat: 33.6861, lng: -7.3828 },
    { city: 'El Jadida', lat: 33.2316, lng: -8.5007 },
    { city: 'Settat', lat: 33.0010, lng: -7.6165 },
    { city: 'Essaouira', lat: 31.5085, lng: -9.7595 }
  ];
  
  // Get city coordinates map for faster lookups
  const cityCoordinatesMap = {};
  moroccanCities.forEach(city => {
    cityCoordinatesMap[city.city] = { lat: city.lat, lng: city.lng };
  });
  
  const reviewComments = [
    "Excellentes installations et personnel accueillant. Recommandé!",
    "Équipement de qualité mais peut être bondé en soirée.",
    "Les cours collectifs sont dynamiques, surtout le HIIT.",
    "Prix raisonnable pour la qualité des services offerts.",
    "Vestiaires propres et hammam agréable après l'effort.",
    "Coachs professionnels qui s'adaptent à votre niveau.",
    "Ambiance motivante et clientèle respectueuse.",
    "Emplacement idéal en centre-ville, facile d'accès.",
    "Parfait pour débutants, staff patient et à l'écoute.",
    "Horaires d'ouverture étendus très pratiques.",
    "Résultats visibles après seulement quelques semaines!",
    "L'application pour réserver les cours fonctionne parfaitement.",
    "J'apprécie l'espace réservé aux femmes certains jours.",
    "Personnel toujours souriant et serviable.",
    "Bon rapport qualité-prix comparé à d'autres salles."
  ];
  
  const promotionTitles = [
    "Offre Ramadan : -30% sur l'abonnement annuel",
    "Summer Deal : 3 mois au prix de 2",
    "Parrainage : Un mois offert pour vous et votre ami",
    "Pack Family : -50% sur le second abonnement",
    "Offre Découverte : Premier mois à 99 MAD",
    "Early Bird : -20% sur les abonnements matin",
    "Tarif Étudiant : Réduction spéciale toute l'année",
    "Programme Fidélité : Avantages sur renouvellement",
    "Promo Weekend : -40% ce weekend uniquement",
    "Coach Offert : 3 séances avec toute nouvelle inscription"
  ];
  
  const promotionDescriptions = [
    "Profitez de notre offre spéciale Ramadan et transformez votre routine fitness.",
    "Préparez votre silhouette d'été avec cette offre limitée.",
    "Invitez vos proches et bénéficiez tous les deux d'avantages exclusifs.",
    "Venez vous entraîner en famille et économisez sur les abonnements.",
    "Testez nos installations sans engagement avec notre offre découverte.",
    "Pour les lève-tôt, profitez de tarifs avantageux avant 10h.",
    "Sur présentation de votre carte d'étudiant, accédez à des tarifs réduits.",
    "Nous récompensons votre fidélité avec des avantages exclusifs.",
    "Ne manquez pas cette opportunité unique, valable ce weekend uniquement.",
    "Démarrez votre parcours fitness avec l'accompagnement de nos experts."
  ];

  // Moroccan names
  const firstNames = [
    'Mohammed', 'Youssef', 'Omar', 'Ali', 'Hamza', 'Amine', 'Ibrahim', 'Adam', 'Karim', 'Samir',
    'Fatima', 'Aisha', 'Maryam', 'Nora', 'Layla', 'Salma', 'Yasmine', 'Amina', 'Sara', 'Zainab'
  ];
  
  const lastNames = [
    'Alami', 'Benjelloun', 'Chakri', 'Daoudi', 'El Fassi', 'Fathi', 'Ghali', 'Hakimi', 'Idrissi', 'Jabri',
    'Kadiri', 'Lemrini', 'Mansouri', 'Naciri', 'Ouazzani', 'Qadir', 'Rouissi', 'Saadi', 'Tazi', 'Ziani'
  ];

  // Load the scraped clubs data
  const scrapedClubs = loadScrapedData();
  console.log(`Loaded ${scrapedClubs.length} clubs from scraped data`);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@masalledesport.ma' },
    update: {},
    create: {
      email: 'admin@masalledesport.ma',
      name: 'Admin Système',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create gym owner users (10)
  const gymOwners = [];
  const gymOwnerPassword = await bcrypt.hash('owner123', 10);
  
  for (let i = 1; i <= 10; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const gymOwner = await prisma.user.upsert({
      where: { email: `proprietaire${i}@masalledesport.ma` },
      update: {},
      create: {
        email: `proprietaire${i}@masalledesport.ma`,
        name: `${firstName} ${lastName}`,
        password: gymOwnerPassword,
        role: 'GYM_OWNER',
      },
    });
    gymOwners.push(gymOwner);
    console.log('Gym owner created:', gymOwner.email);
  }

  // Create regular users (30)
  const users = [];
  const userPassword = await bcrypt.hash('user123', 10);
  
  for (let i = 1; i <= 30; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.ma` },
      update: {},
      create: {
        email: `user${i}@example.ma`,
        name: `${firstName} ${lastName}`,
        password: userPassword,
        role: 'USER',
      },
    });
    users.push(user);
    console.log(`Regular user ${i} created:`, user.email);
  }

  // Create gyms from scraped data
  const gyms = [];
  
  for (let i = 0; i < scrapedClubs.length; i++) {
    const club = scrapedClubs[i];
    
    // Extract city name without "à" prefix if it exists
    let cityName = club.city.trim();
    if (cityName.startsWith('à')) {
      cityName = cityName.substring(1).trim();
    }
    
    // Get coordinates for the city
    const coordinates = cityCoordinatesMap[cityName] || { 
      lat: 33.5731 + (Math.random() * 0.02 - 0.01), // Default to Casablanca with slight randomization
      lng: -7.5898 + (Math.random() * 0.02 - 0.01)
    };
    
    // Convert activities from string to array if needed
    let activities = [];
    if (typeof club.activities === 'string') {
      activities = club.activities.split(',').map(a => a.trim()).filter(a => a);
    } else if (Array.isArray(club.activities)) {
      activities = club.activities;
    }
    
    // Ensure we have at least some facilities
    let facilities = [...activities];
    if (facilities.length < 3) {
      facilities = [...facilities, ...randomItems(gymFacilities, 5)];
    }

    // Generate some images
    const images = [];
    if (club.image_url && club.image_url !== 'N/A') {
      images.push(club.image_url);
    }
    
    // Add random images if needed
    while (images.length < 3) {
      images.push(`https://picsum.photos/seed/${club.name.replace(/\s+/g, '')}-${images.length}/800/600`);
    }
    
    // Determine price range
    const priceRanges = ['€', '€€', '€€€'];
    const priceRange = randomItem(priceRanges);
    
    // Fix URL if needed
    let website = club.url;
    if (website && website.startsWith('https://www.clubs.mahttps://')) {
      website = website.replace('https://www.clubs.mahttps://', 'https://');
    }
    
    // Generate email from name if not present
    const email = `contact@${club.name.toLowerCase().replace(/\s+/g, '')}.ma`;
    
    try {
      const gym = await prisma.gym.upsert({
        where: { name: club.name },
        update: {
          description: club.description || 'Centre sportif à Casablanca offrant des services de qualité',
          address: club.address || `${Math.floor(Math.random() * 200) + 1} Avenue Mohammed V`,
          city: cityName || 'Casablanca',
          state: '',
          zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          phone: club.phone !== 'N/A' ? club.phone : `+212 ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000) + 1000000}`,
          website: website !== 'N/A' ? website : null,
          email: email,
          rating: club.rating || parseFloat((3 + Math.random() * 2).toFixed(1)),
          priceRange: priceRange,
          facilities: facilities,
          images: images,
          ownerId: randomItem(gymOwners).id
        },
        create: {
          name: club.name,
          description: club.description || 'Centre sportif à Casablanca offrant des services de qualité',
          address: club.address || `${Math.floor(Math.random() * 200) + 1} Avenue Mohammed V`,
          city: cityName || 'Casablanca',
          state: '',
          zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          phone: club.phone !== 'N/A' ? club.phone : `+212 ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000) + 1000000}`,
          website: website !== 'N/A' ? website : null,
          email: email,
          rating: club.rating || parseFloat((3 + Math.random() * 2).toFixed(1)),
          priceRange: priceRange,
          facilities: facilities,
          images: images,
          ownerId: randomItem(gymOwners).id
        },
      });
      gyms.push(gym);
      console.log(`Gym ${i + 1}/${scrapedClubs.length} created:`, gym.name);
    } catch (error) {
      console.error(`Failed to create gym ${club.name}:`, error);
    }
  }

  // Create reviews (3-5 per gym)
  console.log('Creating reviews for gyms...');
  
  for (const gym of gyms) {
    const reviewCount = Math.floor(Math.random() * 3) + 3; // 3-5 reviews per gym
    
    for (let i = 0; i < reviewCount; i++) {
      const rating = Math.floor(Math.random() * 3) + 3; // Ratings from 3-5
      const user = randomItem(users);
      
      try {
        const review = await prisma.review.create({
          data: {
            rating: rating,
            comment: randomItem(reviewComments),
            userId: user.id,
            gymId: gym.id,
          },
        });
        console.log(`Review created for ${gym.name} by ${user.email}`);
      } catch (error) {
        console.error(`Failed to create review for gym ${gym.name}:`, error);
      }
    }
  }

  // Create promotions (1-2 per gym)
  console.log('Creating promotions for gyms...');
  
  for (const gym of gyms) {
    const hasPromotion = Math.random() > 0.3; // 70% chance of having a promotion
    
    if (hasPromotion) {
      const promoCount = Math.floor(Math.random() * 2) + 1; // 1-2 promotions
      
      for (let i = 0; i < promoCount; i++) {
        const titleIndex = Math.floor(Math.random() * promotionTitles.length);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30 + Math.floor(Math.random() * 60)); // 30-90 days
        
        try {
          const promotion = await prisma.promotion.create({
            data: {
              title: promotionTitles[titleIndex],
              description: promotionDescriptions[titleIndex],
              startDate: startDate,
              endDate: endDate,
              discount: `${Math.floor(Math.random() * 40) + 10}%`, // 10-50% discount
              gymId: gym.id,
            },
          });
          console.log(`Promotion created for ${gym.name}: ${promotion.title}`);
        } catch (error) {
          console.error(`Failed to create promotion for gym ${gym.name}:`, error);
        }
      }
    }
  }

  // Update gym ratings based on reviews
  console.log('Updating gym ratings based on reviews...');
  
  for (const gym of gyms) {
    const reviews = await prisma.review.findMany({
      where: { gymId: gym.id },
    });
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await prisma.gym.update({
        where: { id: gym.id },
        data: { rating: parseFloat(avgRating.toFixed(1)) },
      });
      console.log(`Updated rating for ${gym.name} to ${avgRating.toFixed(1)}`);
    }
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 