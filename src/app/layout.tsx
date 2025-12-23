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
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
  // Add Google Search Console verification code here after setup
  // verification: {
  //   google: "YOUR_VERIFICATION_CODE",
  // },
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
