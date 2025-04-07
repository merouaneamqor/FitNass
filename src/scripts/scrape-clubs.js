// This script scrapes data about sports clubs from Google Maps API
// Usage: node scrape-clubs.js

import fs from 'fs';
import path from 'path';
import { Client } from '@googlemaps/google-maps-services-js';

// Initialize the Google Maps client
const client = new Client({});

// Moroccan cities to search in
const cities = [
  'Casablanca, Morocco',
  'Rabat, Morocco',
  'Marrakech, Morocco',
  'Fez, Morocco',
  'Tangier, Morocco',
  'Agadir, Morocco',
  'Oujda, Morocco',
];

// Search terms for sports facilities
const searchTerms = [
  'sports club',
  'tennis club',
  'football club',
  'soccer club',
  'padel club',
  'club sportif',
  'terrain de sport',
];

// Function to search for places and extract data
async function searchPlaces(location, keyword) {
  try {
    const response = await client.textSearch({
      params: {
        query: `${keyword} in ${location}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
      console.error(`Error searching for ${keyword} in ${location}:`, response.data.status);
      return [];
    }

    return response.data.results.map(place => ({
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      placeId: place.place_id,
      rating: place.rating || 0,
      totalRatings: place.user_ratings_total || 0,
      types: place.types,
      vicinity: place.vicinity,
      city: location.split(',')[0].trim(),
    }));
  } catch (error) {
    console.error(`Error searching for ${keyword} in ${location}:`, error);
    return [];
  }
}

// Function to get additional details for a place
async function getPlaceDetails(placeId) {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY,
        fields: [
          'formatted_phone_number',
          'website',
          'opening_hours',
          'photos',
          'price_level',
        ],
      },
    });

    if (response.data.status !== 'OK') {
      console.error(`Error getting details for place ${placeId}:`, response.data.status);
      return {};
    }

    const details = response.data.result;
    return {
      phoneNumber: details.formatted_phone_number,
      website: details.website,
      openingHours: details.opening_hours?.weekday_text,
      photos: details.photos?.slice(0, 5).map(photo => photo.photo_reference),
      priceLevel: details.price_level,
    };
  } catch (error) {
    console.error(`Error getting details for place ${placeId}:`, error);
    return {};
  }
}

// Function to deduplicate places based on place ID
function dedupePlaces(places) {
  const seen = new Set();
  return places.filter(place => {
    if (seen.has(place.placeId)) {
      return false;
    }
    seen.add(place.placeId);
    return true;
  });
}

// Main function to run the scraping process
async function scrapeClubs() {
  let allPlaces = [];

  // Search for each term in each city
  for (const city of cities) {
    for (const term of searchTerms) {
      console.log(`Searching for ${term} in ${city}...`);
      const places = await searchPlaces(city, term);
      allPlaces = [...allPlaces, ...places];
      
      // Add a delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Deduplicate places
  const uniquePlaces = dedupePlaces(allPlaces);
  console.log(`Found ${uniquePlaces.length} unique places.`);

  // Get additional details for each place
  const placesWithDetails = [];
  for (let i = 0; i < uniquePlaces.length; i++) {
    const place = uniquePlaces[i];
    console.log(`Getting details for ${place.name} (${i + 1}/${uniquePlaces.length})...`);
    
    const details = await getPlaceDetails(place.placeId);
    placesWithDetails.push({
      ...place,
      ...details,
    });
    
    // Add a delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Transform the data to match our Club model
  const clubs = placesWithDetails.map(place => ({
    name: place.name,
    description: `Sports club in ${place.city}`,
    address: place.address,
    city: place.city,
    state: 'Morocco',
    zipCode: '',
    latitude: place.location.lat,
    longitude: place.location.lng,
    phone: place.phoneNumber || '',
    website: place.website || '',
    email: '',
    rating: place.rating,
    images: place.photos || [],
    facilities: place.types || [],
    openingHours: place.openingHours ? JSON.stringify(place.openingHours) : null,
    isVerified: false,
    status: 'PENDING_APPROVAL',
    viewCount: 0,
  }));

  // Write the results to files
  const outputDir = path.join(__dirname, '../../');
  
  // CSV format
  const csvHeaders = Object.keys(clubs[0]).join(',');
  const csvRows = clubs.map(club => 
    Object.values(club).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  );
  const csvContent = [csvHeaders, ...csvRows].join('\n');
  fs.writeFileSync(path.join(outputDir, 'clubs.csv'), csvContent);
  
  // JSON format
  fs.writeFileSync(path.join(outputDir, 'clubs.json'), JSON.stringify(clubs, null, 2));
  
  console.log(`Successfully scraped ${clubs.length} clubs. Results saved to clubs.csv and clubs.json.`);
}

// Run the scraper
scrapeClubs().catch(console.error); 