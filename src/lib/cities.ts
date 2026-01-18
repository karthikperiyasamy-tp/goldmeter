/**
 * Shared configuration for all supported cities
 * Used for internal linking, navigation, and sitemap generation
 */

// Cities that have dedicated pages (gold rate pages)
export const GOLD_RATE_CITIES = [
  'Ahmedabad',
  'Ayodhya',
  'Bangalore',
  'Bhubaneswar',
  'Chandigarh',
  'Chennai',
  'Coimbatore',
  'Delhi',
  'Hyderabad',
  'Jaipur',
  'Kerala',
  'Kochi',
  'Kolkata',
  'Lucknow',
  'Madurai',
  'Mangalore',
  'Moodbidri',
  'Mumbai',
  'Mysore',
  'Nagpur',
  'Nashik',
  'Patna',
  'Pune',
  'Rajkot',
  'Salem',
  'Surat',
  'Tirunelveli',
  'Trichy',
  'Vadodara',
  'Vijayawada',
  'Visakhapatnam',
] as const;

// Cities that have silver rate pages
export const SILVER_RATE_CITIES = [
  'Ahmedabad',
  'Ayodhya',
  'Bangalore',
  'Bhubaneswar',
  'Chandigarh',
  'Chennai',
  'Coimbatore',
  'Delhi',
  'Hyderabad',
  'Jaipur',
  'Kerala',
  'Kolkata',
  'Lucknow',
  'Madurai',
  'Mangalore',
  'Moodbidri',
  'Mumbai',
  'Mysore',
  'Nagpur',
  'Nashik',
  'Patna',
  'Pune',
  'Rajkot',
  'Salem',
  'Surat',
  'Trichy',
  'Vadodara',
  'Vijayawada',
  'Visakhapatnam',
] as const;

// Type for city names
export type GoldRateCity = typeof GOLD_RATE_CITIES[number];
export type SilverRateCity = typeof SILVER_RATE_CITIES[number];

// Helper to get city slug (lowercase)
export const getCitySlug = (city: string): string => city.toLowerCase();

// Helper to check if a city has a gold rate page
export const hasGoldRatePage = (city: string): boolean => 
  GOLD_RATE_CITIES.map(c => c.toLowerCase()).includes(city.toLowerCase());

// Helper to check if a city has a silver rate page
export const hasSilverRatePage = (city: string): boolean => 
  SILVER_RATE_CITIES.map(c => c.toLowerCase()).includes(city.toLowerCase());

