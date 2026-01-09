import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 301 Redirects for URL restructuring (SEO migration)
  // Old: /{city} -> New: /gold-rate/{city}
  async redirects() {
    const cities = [
      'ahmedabad',
      'ayodhya',
      'bangalore',
      'bhubaneswar',
      'chandigarh',
      'chennai',
      'coimbatore',
      'delhi',
      'hyderabad',
      'jaipur',
      'kerala',
      'kolkata',
      'lucknow',
      'madurai',
      'mangalore',
      'moodbidri',
      'mumbai',
      'mysore',
      'nagpur',
      'nashik',
      'patna',
      'pune',
      'rajkot',
      'salem',
      'surat',
      'trichy',
      'vadodara',
      'vijayawada',
      'visakhapatnam',
    ];

    return cities.map((city) => ({
      source: `/${city}`,
      destination: `/gold-rate/${city}`,
      permanent: true, // 301 redirect - transfers SEO equity
    }));
  },
};

export default nextConfig;
