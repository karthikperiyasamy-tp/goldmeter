import { Metadata } from "next";
import { notFound } from "next/navigation";
import JewellerPageShell from "../../components/JewellerPageShell";
import { getJewellerConfig, getAllJewellerSlugs } from "@/lib/jewellerConfig";
import { fetchCityRates } from "@/lib/fetchCityRates";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params for all jewellers
export async function generateStaticParams() {
  return getAllJewellerSlugs().map((slug) => ({
    slug: slug,
  }));
}

// Dynamic metadata for each jeweller page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const jeweller = getJewellerConfig(slug);

  if (!jeweller) {
    return { title: "Jeweller Not Found" };
  }

  // Use custom SEO fields if available, otherwise fall back to auto-generated
  const title = jeweller.seoTitle || `${jeweller.name} Making Charges & Gold Rate Today | GoldMeter`;
  const description = jeweller.seoDescription || `${jeweller.name} making charges: ${jeweller.makingChargesRange}. Check gold rates, exchange policy, and reviews. ${jeweller.headquarters} since ${jeweller.foundedYear}.`;
  
  // Merge custom keywords with default keywords
  const defaultKeywords = [
    `${jeweller.name.toLowerCase()} making charges`,
    `${jeweller.name.toLowerCase()} gold rate`,
    `${jeweller.name.toLowerCase()} review`,
    `${jeweller.name.toLowerCase()} exchange policy`,
    "gold jewellers india",
  ];
  const keywords = jeweller.seoKeywords 
    ? [...jeweller.seoKeywords, ...defaultKeywords] 
    : defaultKeywords;

  return {
    title,
    description,
    alternates: {
      canonical: `https://goldmeter.in/jewellers/${jeweller.slug}`,
    },
    openGraph: {
      title: jeweller.seoTitle || `${jeweller.name} - Making Charges & Reviews`,
      description,
      type: "website",
      url: `https://goldmeter.in/jewellers/${jeweller.slug}`,
      siteName: "GoldMeter",
      locale: "en_IN",
      images: [
        {
          url: "https://goldmeter.in/og-image.png",
          width: 1200,
          height: 630,
          alt: `${jeweller.name} - GoldMeter`,
        },
      ],
    },
    keywords,
  };
}

export default async function JewellerPage({ params }: Props) {
  const { slug } = await params;
  const jeweller = getJewellerConfig(slug);

  if (!jeweller) {
    notFound();
  }

  // Fetch gold rate for jeweller's headquarters city
  const headersList = await headers();
  const host = headersList.get("host") || "goldmeter.in";
  
  // Extract city name from headquarters (e.g., "Dubai, UAE" -> "Dubai", "Chennai, Tamil Nadu" -> "Chennai")
  const headquartersCity = jeweller.headquarters.split(",")[0].trim();
  
  // Try to fetch gold rate for the headquarters city
  let goldRateData = null;
  try {
    const cityRates = await fetchCityRates(headquartersCity, host);
    if (cityRates.source !== 'mock') {
      goldRateData = {
        gold22k: cityRates.gold22k,
        gold24k: cityRates.gold24k,
        gold18k: cityRates.gold18k,
        priceChange: {
          gold22k: cityRates.priceChange.gold22k,
          gold24k: cityRates.priceChange.gold24k,
        },
        date: cityRates.date,
        dateISO: cityRates.dateISO,
        city: headquartersCity,
      };
    }
  } catch (error) {
    console.error(`Failed to fetch gold rate for ${headquartersCity}:`, error);
  }

  // Current timestamp for "Last updated"
  const lastUpdated = new Date().toISOString();

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": jeweller.name,
    "description": jeweller.description.substring(0, 200),
    "foundingDate": jeweller.foundedYear.toString(),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": jeweller.headquarters.split(",")[0],
      "addressCountry": "IN",
    },
    "url": jeweller.website,
    "priceRange": jeweller.makingChargesRange,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": jeweller.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <JewellerPageShell jeweller={jeweller} goldRate={goldRateData} lastUpdated={lastUpdated} />
    </>
  );
}

// Static generation with revalidation
export const revalidate = 86400; // Revalidate daily
