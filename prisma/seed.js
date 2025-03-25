const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

// Set random seed for consistency
faker.seed(123);

// Helper to generate random items from an array
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
const randomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

async function main() {
  console.log('Starting database seeding with Moroccan data...');

  // Pre-defined arrays for realistic Moroccan data
  const gymFacilities = [
    'Cardio', 'Musculation', 'Piscine', 'Sauna', 'Cours collectifs', 
    'Coach personnel', 'Boxe', 'Yoga', 'Pilates', 'CrossFit', 
    'Vestiaires', 'Douches', 'Parking gratuit', 'Massage', 'Nutrition', 
    'Hammam traditionnel', 'Espace femmes', 'MMA', 'Rooftop', 'HIIT'
  ];
  
  const gymBrands = [
    'Atlas Gym', 'Casablanca Fitness', 'Marrakech Health Club', 
    'Tangier Strength', 'Royal Fitness', 'Moroccan Power', 'MedFit', 
    'FES Athletic', 'Rabat Elite', 'Agadir Beach Club',
    'Maghreb Fitness', 'City Club', 'California Gym', 'Golds Gym', 
    'Fitness Factory', 'Wellness Club', 'Fit Zone', 'Sportfit', 'Power Gym'
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
  
  const gymDescriptions = [
    "Salle de sport moderne avec des équipements de pointe et des entraîneurs certifiés.",
    "Centre de fitness offrant une variété de cours et un suivi personnalisé.",
    "Club premium avec installations haut de gamme et hammam traditionnel.",
    "Salle familiale avec des options pour tous les âges et niveaux.",
    "Centre spécialisé dans le CrossFit et l'entraînement fonctionnel.",
    "Studio de yoga et bien-être avec vue panoramique sur la ville.",
    "Complexe sportif avec piscine olympique et terrains multisports.",
    "Club ouvert 24/7 avec accès par badge et coaching virtuel.",
    "Espace réservé aux femmes offrant intimité et programmes adaptés.",
    "Centre combinant traditions marocaines et techniques modernes de fitness."
  ];
  
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

  const gymImageURLs = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    'https://images.unsplash.com/photo-1558611848-73f7eb4001a1',
    'https://images.unsplash.com/photo-1546483875-ad9014c88eba',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
    'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c',
    'https://images.unsplash.com/photo-1623874228601-f4193c7b1818',
    'https://images.unsplash.com/photo-1581122584612-713f89daa8eb',
    'https://images.unsplash.com/photo-1554284126-aa88f22d8b74',
    'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa',
    'https://images.unsplash.com/photo-1607962837359-5e7e89f86776'
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

  // Create gyms (25)
  const gyms = [];
  
  for (let i = 1; i <= 25; i++) {
    const location = randomItem(moroccanCities);
    const priceRanges = ['€', '€€', '€€€'];
    const brand = randomItem(gymBrands);
    
    const gym = await prisma.gym.upsert({
      where: { id: `gym${i}` },
      update: {},
      create: {
        id: `gym${i}`,
        name: `${brand} ${location.city}`,
        description: randomItem(gymDescriptions),
        address: `${Math.floor(Math.random() * 200) + 1} Avenue Mohammed V`,
        city: location.city,
        state: '',
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        latitude: location.lat + (Math.random() * 0.02 - 0.01),
        longitude: location.lng + (Math.random() * 0.02 - 0.01),
        phone: `+212 ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000) + 1000000}`,
        website: `https://www.${brand.toLowerCase().replace(/\s+/g, '')}.ma`,
        email: `contact@${brand.toLowerCase().replace(/\s+/g, '')}.ma`,
        rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
        priceRange: randomItem(priceRanges),
        facilities: randomItems(gymFacilities, 5 + Math.floor(Math.random() * 8)),
        images: randomItems(gymImageURLs, 3 + Math.floor(Math.random() * 3)),
        ownerId: randomItem(gymOwners).id
      },
    });
    gyms.push(gym);
    console.log('Gym created:', gym.name);
  }

  // Create reviews (100)
  const reviews = [];
  
  for (let i = 1; i <= 150; i++) {
    const rating = Math.floor(Math.random() * 3) + 3; // Ratings from 3-5
    const gym = randomItem(gyms);
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
      reviews.push(review);
      console.log(`Review ${i} created for ${gym.name} by ${user.name}`);
    } catch (error) {
      // Skip if user already reviewed this gym
      console.log(`Skipping duplicate review for gym ${gym.name} by ${user.name}`);
    }
  }

  // Update gym ratings based on reviews
  for (const gym of gyms) {
    const gymReviews = await prisma.review.findMany({
      where: { gymId: gym.id },
    });
    
    if (gymReviews.length > 0) {
      const averageRating = gymReviews.reduce((sum, review) => sum + review.rating, 0) / gymReviews.length;
      
      await prisma.gym.update({
        where: { id: gym.id },
        data: { rating: parseFloat(averageRating.toFixed(1)) },
      });
      
      console.log(`Updated rating for ${gym.name} to ${averageRating.toFixed(1)}`);
    }
  }

  // Create promotions (40)
  const promotions = [];
  const statuses = ['ACTIVE', 'SCHEDULED', 'EXPIRED'];
  
  for (let i = 1; i <= 40; i++) {
    const gym = randomItem(gyms);
    const titleIndex = i % promotionTitles.length;
    const descriptionIndex = i % promotionDescriptions.length;
    
    // Generate random dates
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setMonth(pastDate.getMonth() - 6);
    
    const futureDate = new Date(now);
    futureDate.setMonth(futureDate.getMonth() + 6);
    
    // Randomize promotion status
    const status = randomItem(statuses);
    
    let startDate, endDate;
    
    if (status === 'ACTIVE') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      
      endDate = new Date(now);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 60) + 5);
    } else if (status === 'SCHEDULED') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1);
      
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 60) + 30);
    } else if (status === 'EXPIRED') {
      endDate = new Date(now);
      endDate.setDate(endDate.getDate() - Math.floor(Math.random() * 10) - 1);
      
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 60) - 10);
    }
    
    // Create discounts
    const discountTypes = ['% de réduction', 'DH de réduction', 'Mois gratuit', 'Sans frais d\'inscription', '2 pour 1'];
    const discountValues = ['10', '15', '20', '25', '30', '40', '50', '100', '200', '300'];
    const discountValue = randomItem(discountValues);
    const discountType = randomItem(discountTypes);
    let discount;
    
    if (discountType === '% de réduction') {
      discount = `${discountValue}% de réduction`;
    } else if (discountType === 'DH de réduction') {
      discount = `${discountValue} DH de réduction`;
    } else {
      discount = discountType;
    }
    
    const promotion = await prisma.promotion.create({
      data: {
        title: promotionTitles[titleIndex],
        description: promotionDescriptions[descriptionIndex],
        startDate: startDate,
        endDate: endDate,
        discount: discount,
        gymId: gym.id,
      },
    });
    
    promotions.push(promotion);
    console.log(`Promotion ${i} created for ${gym.name}: ${promotion.title} (${status})`);
  }

  console.log('Database seeding completed successfully!');
  console.log(`Created: ${gymOwners.length} gym owners, ${users.length} users, ${gyms.length} gyms, ${reviews.length} reviews, ${promotions.length} promotions`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 