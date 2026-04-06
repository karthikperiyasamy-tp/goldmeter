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

// Type for city names
export type GoldRateCity = typeof GOLD_RATE_CITIES[number];
export type SilverRateCity = typeof SILVER_RATE_CITIES[number];

// Localized city display names (URL slugs stay English)
export const CITY_NAMES_LOCALIZED: Record<string, Record<string, string>> = {
  ahmedabad:      { en: "Ahmedabad",      hi: "अहमदाबाद",      ta: "அகமதாபாத்",     te: "అహ్మదాబాద్"     },
  ayodhya:        { en: "Ayodhya",        hi: "अयोध्या",       ta: "அயோத்தி",       te: "అయోధ్య"        },
  bangalore:      { en: "Bangalore",      hi: "बेंगलुरु",       ta: "பெங்களூர்",     te: "బెంగళూరు"      },
  bhubaneswar:    { en: "Bhubaneswar",    hi: "भुवनेश्वर",      ta: "புவனேஸ்வர்",    te: "భువనేశ్వర్"     },
  chandigarh:     { en: "Chandigarh",     hi: "चंडीगढ़",        ta: "சண்டிகர்",      te: "చండీగఢ్"       },
  chennai:        { en: "Chennai",        hi: "चेन्नई",        ta: "சென்னை",        te: "చెన్నై"        },
  coimbatore:     { en: "Coimbatore",     hi: "कोयंबटूर",       ta: "கோயம்புத்தூர்",  te: "కోయంబత్తూర్"    },
  delhi:          { en: "Delhi",          hi: "दिल्ली",        ta: "டெல்லி",        te: "ఢిల్లీ"        },
  hyderabad:      { en: "Hyderabad",      hi: "हैदराबाद",       ta: "ஹைதராபாத்",     te: "హైదరాబాద్"      },
  jaipur:         { en: "Jaipur",         hi: "जयपुर",         ta: "ஜெய்ப்பூர்",    te: "జైపూర్"        },
  kerala:         { en: "Kerala",         hi: "केरल",          ta: "கேரளா",         te: "కేరళ"          },
  kochi:          { en: "Kochi",          hi: "कोच्चि",        ta: "கொச்சி",        te: "కొచ్చి"        },
  kolkata:        { en: "Kolkata",        hi: "कोलकाता",       ta: "கொல்கத்தா",     te: "కోల్‌కతా"      },
  lucknow:        { en: "Lucknow",        hi: "लखनऊ",          ta: "லக்னோ",         te: "లక్నో"         },
  madurai:        { en: "Madurai",        hi: "मदुरै",         ta: "மதுரை",         te: "మదురై"         },
  mangalore:      { en: "Mangalore",      hi: "मैंगलोर",        ta: "மங்களூர்",      te: "మంగళూరు"       },
  moodbidri:      { en: "Moodbidri",      hi: "मूडबिद्री",      ta: "மூட்பிட்ரி",    te: "మూడ్బిద్రి"     },
  mumbai:         { en: "Mumbai",         hi: "मुंबई",         ta: "மும்பை",        te: "ముంబై"         },
  mysore:         { en: "Mysore",         hi: "मैसूर",         ta: "மைசூர்",        te: "మైసూరు"        },
  nagpur:         { en: "Nagpur",         hi: "नागपुर",        ta: "நாக்பூர்",      te: "నాగ్‌పూర్"      },
  nashik:         { en: "Nashik",         hi: "नासिक",         ta: "நாசிக்",        te: "నాసిక్"        },
  patna:          { en: "Patna",          hi: "पटना",          ta: "பாட்னா",        te: "పాట్నా"        },
  pune:           { en: "Pune",           hi: "पुणे",          ta: "புனே",          te: "పుణె"          },
  rajkot:         { en: "Rajkot",         hi: "राजकोट",        ta: "ராஜ்கோட்",      te: "రాజ్‌కోట్"      },
  salem:          { en: "Salem",          hi: "सेलम",          ta: "சேலம்",         te: "సేలం"          },
  surat:          { en: "Surat",          hi: "सूरत",          ta: "சூரத்",         te: "సూరత్"         },
  tirunelveli:    { en: "Tirunelveli",    hi: "तिरुनेलवेली",     ta: "திருநெல்வேலி",   te: "తిరునెల్వేలి"    },
  trichy:         { en: "Trichy",         hi: "तिरुचिरापल्ली",   ta: "திருச்சி",       te: "తిరుచ్చి"       },
  vadodara:       { en: "Vadodara",       hi: "वडोदरा",        ta: "வடோதரா",        te: "వడోదర"         },
  vijayawada:     { en: "Vijayawada",     hi: "विजयवाड़ा",      ta: "விஜயவாடா",      te: "విజయవాడ"       },
  visakhapatnam:  { en: "Visakhapatnam",  hi: "विशाखापत्तनम",    ta: "விசாகப்பட்டினம்", te: "విశాఖపట్నం"     },
};

// Get localized city name (falls back to English)
export const getLocalizedCityName = (slug: string, locale: string = "en"): string => {
  const names = CITY_NAMES_LOCALIZED[slug.toLowerCase()];
  if (!names) return slug;
  return names[locale] || names.en || slug;
};

// Helper to get city slug (lowercase)
export const getCitySlug = (city: string): string => city.toLowerCase();

// Helper to check if a city has a gold rate page
export const hasGoldRatePage = (city: string): boolean => 
  GOLD_RATE_CITIES.map(c => c.toLowerCase()).includes(city.toLowerCase());

// Helper to check if a city has a silver rate page
export const hasSilverRatePage = (city: string): boolean => 
  SILVER_RATE_CITIES.map(c => c.toLowerCase()).includes(city.toLowerCase());

