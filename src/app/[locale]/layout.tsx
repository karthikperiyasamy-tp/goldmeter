import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import LayoutWrapper from "../components/LayoutWrapper";
import AdScript from "../components/AdScript";

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
    description:
      "Track 22K & 24K gold rates in Indian cities with real-time updates.",
    images: ["https://goldmeter.in/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "msapplication-TileImage": "/icon-192.png",
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering for locale routes by avoiding request-based locale lookup.
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
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
                  send_page_view: true,
                  campaign_tracking: true,
                  link_attribution: true,
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
     <!-- <Script src="https://quge5.com/88/tag.min.js" data-zone="258916" async data-cfasync="false"></Script> -->
        <Script>(function(s){s.dataset.zone='11275969',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</Script>
        
      </head>
      <body
        className="bg-[#fffdf7] text-charcoal min-h-screen"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </NextIntlClientProvider>
        {ADS_ENABLED && <AdScript />}
      </body>
    </html>
  );
}
