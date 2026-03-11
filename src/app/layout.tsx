import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import AdScript from "./components/AdScript";

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";


export const metadata: Metadata = {
  title: "GoldMeter — Daily India Gold Prices & Tools",
  description:
    "Track live 22K & 24K gold prices across Indian cities, compare trends, and calculate jewellery costs with GoldMeter.",
  metadataBase: new URL("https://goldmeter.in"),
  alternates: {
    canonical: "/",
  },
  // Icons are auto-detected from /app directory (favicon.ico, icon.png, apple-icon.png)
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
  keywords: [
    "gold rate",
    "india gold price",
    "22k 24k gold",
    "gold calculator",
    "chennai gold rate",
    "mumbai gold rate",
    "gold price today",
    "jewellery calculator",
  ],
  authors: [{ name: "GoldMeter Team" }],
  creator: "GoldMeter",
  publisher: "GoldMeter",
  openGraph: {
    title: "GoldMeter — Live Prices, City Insights & Calculators",
    description:
      "Monitor gold prices across India, explore city-specific trends, and run instant gold value estimates.",
    url: "https://goldmeter.in",
    siteName: "GoldMeter",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://goldmeter.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoldMeter - India Gold Prices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoldMeter — Live Gold Prices Across India",
    description: "Track 22K & 24K gold rates in Indian cities with real-time updates.",
    images: ["https://goldmeter.in/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // TODO: Add your Google Search Console verification code
  // Get it from: https://search.google.com/search-console
  // verification: {
  //   google: "YOUR_VERIFICATION_CODE",
  // },
  other: {
    // Help Google find favicon faster
    'msapplication-TileImage': '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  // Enhanced measurement features
                  send_page_view: true,
                  // Campaign tracking (UTM parameters)
                  campaign_tracking: true,
                  // Track clicks to external domains
                  link_attribution: true,
                  // Enhanced e-commerce tracking (if needed later)
                  enhanced_measurement: {
                    scrolls: true,
                    outbound_clicks: true,
                    site_search: true,
                    video_engagement: false,
                    file_downloads: false
                  }
                });
              `}
            </Script>
          </>
        )}
        


      </head>
      <body className="bg-[#fffdf7] text-charcoal min-h-screen" suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
        {ADS_ENABLED && <AdScript />}
      </body>
    </html>
  );
}
