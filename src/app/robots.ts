import { MetadataRoute } from 'next'

// Old city URLs that have been migrated to /gold-rate/{city}
// These are disallowed to prevent crawling of deprecated URLs
const OLD_CITY_URLS = [
  '/ahmedabad',
  '/ayodhya',
  '/bangalore',
  '/bhubaneswar',
  '/chandigarh',
  '/chennai',
  '/coimbatore',
  '/delhi',
  '/hyderabad',
  '/jaipur',
  '/kerala',
  '/kolkata',
  '/lucknow',
  '/madurai',
  '/mangalore',
  '/moodbidri',
  '/mumbai',
  '/mysore',
  '/nagpur',
  '/nashik',
  '/patna',
  '/pune',
  '/rajkot',
  '/salem',
  '/surat',
  '/trichy',
  '/vadodara',
  '/vijayawada',
  '/visakhapatnam',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/static/',
        '/_next/image',
        // Disallow old city URLs - they redirect to /gold-rate/{city}
        ...OLD_CITY_URLS,
      ],
    },
    sitemap: 'https://goldmeter.in/sitemap.xml',
  }
}

