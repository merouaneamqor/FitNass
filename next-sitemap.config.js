/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.fitnass.ma', // Replace with your production domain
  generateRobotsTxt: true, // Optional: Generates robots.txt based on config (can override existing)
  // robotsTxtOptions: { 
  //   policies: [
  //     { userAgent: '*', allow: '/' },
  //     // Add specific disallows if needed
  //     // { userAgent: '*', disallow: '/admin' },
  //   ],
  //   // additionalSitemaps: [
  //   //   'https://example.com/my-custom-sitemap-1.xml',
  //   // ],
  // },
  // Optional: Add dynamic paths that need to be generated (e.g., if not using Server-Side Rendering extensively)
  // It often automatically finds pages in the `app` directory, but explicit definition helps for complex cases
  // especially for dynamic routes like locations, gyms, trainers, classes.
  // We might need a function to fetch all valid location/gym/trainer/class slugs from the DB here.
  // Example:
  // additionalPaths: async (config) => {
  //   // Fetch all gym IDs, trainer IDs, location slugs etc. from your database
  //   // const gyms = await fetchAllGymSlugs(); 
  //   // const trainers = await fetchAllTrainerSlugs();
  //   // const locations = await fetchAllLocationSlugs();
  //   
  //   // const gymPaths = gyms.map(id => `/gyms/${id}`);
  //   // const trainerPaths = trainers.map(id => `/trainers/${id}`);
  //   // const locationPaths = locations.map(loc => `/locations/${loc.country}/${loc.city}`);

  //   // return [
  //   //   ...gymPaths,
  //   //   ...trainerPaths,
  //   //   ...locationPaths,
  //   //   // Add paths for class types within locations too
  //   // ];
  //   return []; // Placeholder - Requires DB access and fetching logic
  // },
  // exclude: ['/admin/*', '/api/*'], // Optional: Exclude specific paths
  // priority: 0.7, // Default priority
  // changefreq: 'daily', // Default change frequency
}; 