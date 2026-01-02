import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";

export const metadata: Metadata = {
  title: "GoldMeter — Daily India Gold Prices & Tools",
  description:
    "Track live 22K & 24K gold prices across Indian cities, compare trends, and calculate jewellery costs with GoldMeter.",
  metadataBase: new URL("https://goldmeter.in"),
  alternates: {
    canonical: "/",
  },
  icons: {
    // Google requires at least 48x48, prefers multiples of 48
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // Apple touch icon (standard name)
    apple: "/apple-touch-icon.png",
    // Shortcut icon for legacy support
    shortcut: "/favicon.ico",
  },
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
      <body className="bg-[#fffdf7] text-charcoal min-h-screen">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
