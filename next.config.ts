import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers including Content-Security-Policy
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

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
