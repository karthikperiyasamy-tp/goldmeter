import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
              // Scripts: allow https for ad networks (Adsterra, AdSense) which load from many dynamic domains
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https:",
              "connect-src 'self' https:",
              // Frames: allow https for ad iframes (AdSense, Adsterra, Google sign-in, etc.)
              "frame-src 'self' https:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https:",
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

    const locales = ['hi', 'ta', 'te'];

    const englishRedirects = cities.map((city) => ({
      source: `/${city}`,
      destination: `/gold-rate/${city}`,
      permanent: true,
    }));

    const localeRedirects = locales.flatMap((locale) =>
      cities.map((city) => ({
        source: `/${locale}/${city}`,
        destination: `/${locale}/gold-rate/${city}`,
        permanent: true,
      }))
    );

    return [...englishRedirects, ...localeRedirects];
  },
};

export default withNextIntl(nextConfig);
