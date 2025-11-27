/**
 * Structured Data (JSON-LD) component for SEO
 * Adds rich snippets for Google Search
 */

type StructuredDataProps = {
  type: 'homepage' | 'city' | 'tool';
  city?: string;
  gold22k?: number;
  gold24k?: number;
  toolName?: string;
  toolDescription?: string;
};

export default function StructuredData({ 
  type, 
  city, 
  gold22k, 
  gold24k,
  toolName,
  toolDescription 
}: StructuredDataProps) {
  let structuredData: any = {
    "@context": "https://schema.org",
  };

  if (type === 'homepage' || type === 'city') {
    // Financial service schema for gold price pages
    structuredData = {
      ...structuredData,
      "@type": "FinancialService",
      "name": `GoldRate - ${city || 'India'} Gold Prices`,
      "description": `Live 22K and 24K gold rates in ${city || 'India'}. Updated daily with accurate pricing from leading jewellers.`,
      "url": city 
        ? `https://goldmeter.in/${city.toLowerCase()}` 
        : "https://goldmeter.in",
      "priceRange": "₹₹",
      "currenciesAccepted": "INR",
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "offers": [
        gold22k && {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "22 Karat Gold",
            "description": `22K gold price per 10 grams in ${city || 'India'}`
          },
          "price": (gold22k / 10).toFixed(2),
          "priceCurrency": "INR",
          "priceValidUntil": new Date(Date.now() + 86400000).toISOString().split('T')[0],
          "availability": "https://schema.org/InStock"
        },
        gold24k && {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "24 Karat Gold",
            "description": `24K gold price per 10 grams in ${city || 'India'}`
          },
          "price": (gold24k / 10).toFixed(2),
          "priceCurrency": "INR",
          "priceValidUntil": new Date(Date.now() + 86400000).toISOString().split('T')[0],
          "availability": "https://schema.org/InStock"
        }
      ].filter(Boolean)
    };
  } else if (type === 'tool') {
    // Software application schema for calculator tools
    structuredData = {
      ...structuredData,
      "@type": "SoftwareApplication",
      "name": toolName || "Gold Calculator",
      "description": toolDescription || "Calculate gold jewellery costs with making charges and GST",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150"
      }
    };
  }

  // Add organization data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GoldRate",
    "url": "https://goldmeter.in",
    "logo": "https://goldmeter.in/logo.png",
    "sameAs": [
      "https://twitter.com/goldrate",
      "https://facebook.com/goldrate"
    ]
  };

  // Add breadcrumb for city pages
  const breadcrumbData = city ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://goldmeter.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${city} Gold Rate`,
        "item": `https://goldmeter.in/${city.toLowerCase()}`
      }
    ]
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
      )}
    </>
  );
}

