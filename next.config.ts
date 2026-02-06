import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Optimize page transitions
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // Security headers including Content-Security-Policy
  async headers() {
    return [
      {
        // Block Next.js internal files from being indexed
        source: "/_next/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
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
