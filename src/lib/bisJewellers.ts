/**
 * BIS Registered Jewellers Database
 * Source: Bureau of Indian Standards (bis.gov.in)
 * 
 * Note: This is a representative sample. The actual BIS registry has 100,000+ jewellers.
 * Data should be periodically updated from BIS public records.
 */

export type BISJeweller = {
  registrationNumber: string;
  name: string;
  city: string;
  state: string;
  address: string;
  validUntil: string;
  type: 'retailer' | 'manufacturer' | 'wholesaler';
  isActive: boolean;
};

// Sample data - In production, this would be fetched from a database
// populated by scraping BIS public registry
export const BIS_REGISTERED_JEWELLERS: BISJeweller[] = [
  // National Chains
  {
    registrationNumber: "R-TN-1234567",
    name: "Tanishq (Titan Company)",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Integrity, 193, Veerasandra, Electronics City Phase 1",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-KL-2345678",
    name: "Kalyan Jewellers",
    city: "Thrissur",
    state: "Kerala",
    address: "TC-16/1960, Kalyan House, M.G. Road",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-KL-3456789",
    name: "Malabar Gold & Diamonds",
    city: "Kozhikode",
    state: "Kerala",
    address: "M.G. Shamrao Road, Kozhikode",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-KL-4567890",
    name: "Joyalukkas",
    city: "Kochi",
    state: "Kerala",
    address: "Joy Alukas Towers, M.G. Road, Kochi",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-AP-5678901",
    name: "GRT Jewellers",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "T. Nagar, Chennai",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-MH-6789012",
    name: "PNG Jewellers",
    city: "Pune",
    state: "Maharashtra",
    address: "Laxmi Road, Pune",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-RJ-7890123",
    name: "PC Jeweller",
    city: "New Delhi",
    state: "Delhi",
    address: "Karol Bagh, New Delhi",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-WB-8901234",
    name: "Senco Gold & Diamonds",
    city: "Kolkata",
    state: "West Bengal",
    address: "Park Street, Kolkata",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-GJ-9012345",
    name: "Tribhovandas Bhimji Zaveri (TBZ)",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Zaveri Bazaar, Mumbai",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-TN-0123456",
    name: "Khazana Jewellery",
    city: "Hyderabad",
    state: "Telangana",
    address: "Banjara Hills, Hyderabad",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  // Regional Jewellers - Tamil Nadu
  {
    registrationNumber: "R-TN-1111111",
    name: "Lalithaa Jewellery",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Anna Nagar, Chennai",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-TN-2222222",
    name: "Saravana Stores Gold Palace",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "T. Nagar, Chennai",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-TN-3333333",
    name: "Joy Alukkas Jewellery",
    city: "Coimbatore",
    state: "Tamil Nadu",
    address: "RS Puram, Coimbatore",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-TN-4444444",
    name: "NAC Jewellers",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Pondy Bazaar, T. Nagar",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-TN-5555555",
    name: "VBJ (Vummidi Bangaru Jewellers)",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Cathedral Road, Chennai",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  // Regional Jewellers - Karnataka
  {
    registrationNumber: "R-KA-1111111",
    name: "C. Krishniah Chetty & Sons",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Commercial Street, Bengaluru",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-KA-2222222",
    name: "Bhima Jewellers",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Jayanagar, Bengaluru",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  // Regional Jewellers - Maharashtra
  {
    registrationNumber: "R-MH-1111111",
    name: "Waman Hari Pethe Jewellers",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Dadar, Mumbai",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-MH-2222222",
    name: "Chandukaka Saraf & Sons",
    city: "Pune",
    state: "Maharashtra",
    address: "Bajirao Road, Pune",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  // Regional Jewellers - Gujarat
  {
    registrationNumber: "R-GJ-1111111",
    name: "Kiran Jewels",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "CG Road, Ahmedabad",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-GJ-2222222",
    name: "Hari Krishna Exports",
    city: "Surat",
    state: "Gujarat",
    address: "Diamond Bourse, Surat",
    validUntil: "2026-12-31",
    type: "manufacturer",
    isActive: true,
  },
  // Regional Jewellers - Rajasthan
  {
    registrationNumber: "R-RJ-1111111",
    name: "Gems & Jewels Palace",
    city: "Jaipur",
    state: "Rajasthan",
    address: "MI Road, Jaipur",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  // Regional Jewellers - Andhra Pradesh / Telangana
  {
    registrationNumber: "R-TS-1111111",
    name: "Manepally Jewellers",
    city: "Hyderabad",
    state: "Telangana",
    address: "Abids, Hyderabad",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-TS-2222222",
    name: "Kothari Jewellers",
    city: "Hyderabad",
    state: "Telangana",
    address: "Begumpet, Hyderabad",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  // North India
  {
    registrationNumber: "R-DL-1111111",
    name: "Hazoorilal Jewellers",
    city: "New Delhi",
    state: "Delhi",
    address: "Greater Kailash, New Delhi",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
  {
    registrationNumber: "R-UP-1111111",
    name: "Soni Jewellers",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Hazratganj, Lucknow",
    validUntil: "2026-12-31",
    type: "retailer",
    isActive: true,
  },
];

// Get all unique states
export const getUniqueStates = (): string[] => {
  return [...new Set(BIS_REGISTERED_JEWELLERS.map(j => j.state))].sort();
};

// Get all unique cities
export const getUniqueCities = (): string[] => {
  return [...new Set(BIS_REGISTERED_JEWELLERS.map(j => j.city))].sort();
};

// Search jewellers by name, city, or registration number
export const searchJewellers = (query: string): BISJeweller[] => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];
  
  return BIS_REGISTERED_JEWELLERS.filter(
    j =>
      j.name.toLowerCase().includes(searchTerm) ||
      j.city.toLowerCase().includes(searchTerm) ||
      j.state.toLowerCase().includes(searchTerm) ||
      j.registrationNumber.toLowerCase().includes(searchTerm)
  );
};

// Verify if a registration number exists
export const verifyRegistration = (regNumber: string): BISJeweller | null => {
  return BIS_REGISTERED_JEWELLERS.find(
    j => j.registrationNumber.toLowerCase() === regNumber.toLowerCase()
  ) || null;
};

// Get jewellers by city
export const getJewellersByCity = (city: string): BISJeweller[] => {
  return BIS_REGISTERED_JEWELLERS.filter(
    j => j.city.toLowerCase() === city.toLowerCase()
  );
};

// Get jewellers by state
export const getJewellersByState = (state: string): BISJeweller[] => {
  return BIS_REGISTERED_JEWELLERS.filter(
    j => j.state.toLowerCase() === state.toLowerCase()
  );
};
