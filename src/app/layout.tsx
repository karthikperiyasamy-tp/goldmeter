import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoldRate — Daily India Gold Prices & Tools",
  description:
    "Track live 22K & 24K gold prices across Indian cities, compare trends, and calculate jewellery costs with GoldRate.",
  metadataBase: new URL("https://gdrate.app"),
  keywords: [
    "gold rate",
    "india gold price",
    "22k 24k gold",
    "gold calculator",
    "chennai gold rate",
  ],
  openGraph: {
    title: "GoldRate — Live Prices, City Insights & Calculators",
    description:
      "Monitor gold prices across India, explore city-specific trends, and run instant gold value estimates.",
    url: "https://gdrate.app",
    siteName: "GoldRate",
    locale: "en_IN",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
