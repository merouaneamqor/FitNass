// src/lib/routes.ts
import { slugify } from './utils'; // Import slugify if needed for defaults, though slugs should ideally come from data

// Helper function to encode URI components safely
const encode = (value: string): string => {
  try {
    // Already slugified values might not need encoding, but encodeURIComponent is generally safe
    return encodeURIComponent(value);
  } catch (e) {
    console.error('Failed to encode URI component:', value, e);
    return ''; // Return empty string or handle error as appropriate
  }
};

export const Routes = {
  home: () => '/',
  about: () => '/about',
  contact: () => '/contact',
  
  // Auth Routes (Mapping to existing? TBC)
  login: () => '/auth/signin', // Assuming maps to existing
  signup: () => '/auth/signup', // Assuming maps to existing

  // Blog Routes
  blog: {
    index: () => '/blog',
    // Requires article slug (e.g., "my-first-post")
    post: (articleSlug: string) => `/blog/${encode(articleSlug)}`,
  },

  // Category Routes
  // Requires category slug (e.g., "yoga", "weightlifting")
  category: (categorySlug: string) => `/categories/${encode(categorySlug)}`,

  // City/Location Routes (Replaces `locations`)
  // Requires city slug (e.g., "casablanca", "new-york")
  city: {
    overview: (citySlug: string) => `/city/${encode(citySlug)}`,
    gyms: (citySlug: string) => `/city/${encode(citySlug)}/gyms`,
    trainers: (citySlug: string) => `/city/${encode(citySlug)}/trainers`,
    // Base classes route. Filtering by type (e.g., yoga) should use query params: /city/casablanca/classes?type=yoga
    classes: (citySlug: string) => `/city/${encode(citySlug)}/classes`, 
  },

  // Detail Page Routes (Now require composite slugs)
  // It's assumed you will generate slugs like "casablanca-gold-s-gym" or pass pre-generated slugs
  gyms: {
    // Requires a composite slug like "{city-slug}-{gym-slug}"
    detail: (compositeGymSlug: string) => `/gym/${encode(compositeGymSlug)}`,
  },
  trainers: {
     // Requires a composite slug like "{city-slug}-{trainer-slug}"
    detail: (compositeTrainerSlug: string) => `/trainer/${encode(compositeTrainerSlug)}`,
  },
  classes: {
     // Requires a composite slug like "{city-slug}-{class-slug}"
    detail: (compositeClassSlug: string) => `/class/${encode(compositeClassSlug)}`,
  },
  clubs: { // Assuming similar structure for clubs if they have detail pages
    // Requires a composite slug like "{city-slug}-{club-slug}"
    detail: (compositeClubSlug: string) => `/club/${encode(compositeClubSlug)}`,
  },

  // Other existing routes
  search: () => '/search',
  profile: () => '/profile',
  pricing: () => '/pricing',
  dashboard: () => '/dashboard',
  subscriptions: () => '/subscriptions',
  reservations: () => '/reservations',
  promotions: () => '/promotions',
  admin: {
    dashboard: () => '/admin/dashboard',
  },
  // Keep full auth object if more routes were there
  auth: {
    signIn: () => '/auth/signin',
    signUp: () => '/auth/signup',
  },
}; 