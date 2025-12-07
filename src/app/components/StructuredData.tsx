/**
 * Structured Data (JSON-LD) component for SEO
 * Adds rich snippets for Google Search
 */

type FAQItem = { question: string; answer: string };

type StructuredDataProps = {
  type: 'homepage' | 'city' | 'tool' | 'article';
  city?: string;
  gold22k?: number;
  gold24k?: number;
  toolName?: string;
  toolDescription?: string;
  // Article data
  headline?: string;
  description?: string;
  url?: string;
  datePublished?: string | Date;
  dateModified?: string | Date;
  imageUrl?: string;
  authorName?: string;
  // FAQ data
  faqs?: FAQItem[];
};

export default function StructuredData({ 
  type,
  city,
  gold22k,
  gold24k,
  toolName,
  toolDescription,
  headline,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
  authorName,
  faqs,
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
        gold22k && gold22k > 0 && {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "22 Karat Gold",
            "description": `22K gold price per 10 grams in ${city || 'India'}`,
            "offers": {
              "@type": "Offer",
              "price": (gold22k / 10).toFixed(2),
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock"
            }
          },
          "price": (gold22k / 10).toFixed(2),
          "priceCurrency": "INR",
          "priceValidUntil": new Date(Date.now() + 86400000).toISOString().split('T')[0],
          "availability": "https://schema.org/InStock"
        },
        gold24k && gold24k > 0 && {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "24 Karat Gold",
            "description": `24K gold price per 10 grams in ${city || 'India'}`,
            "offers": {
              "@type": "Offer",
              "price": (gold24k / 10).toFixed(2),
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock"
            }
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
  } else if (type === 'article') {
    const published = datePublished
      ? new Date(datePublished).toISOString()
      : undefined;
    const modified = dateModified
      ? new Date(dateModified).toISOString()
      : published;

    structuredData = {
      ...structuredData,
      "@type": "NewsArticle",
      "headline": headline,
      "description": description,
      "url": url,
      "mainEntityOfPage": url,
      "datePublished": published,
      "dateModified": modified,
      "image": imageUrl ? [imageUrl] : undefined,
      "author": {
        "@type": "Organization",
        "name": authorName || "GoldMeter",
      },
      "publisher": {
        "@type": "Organization",
        "name": "GoldMeter",
        "logo": {
          "@type": "ImageObject",
          "url": "https://goldmeter.in/logo.png",
        },
      },
    };
  }

  // Add organization data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GoldRate",
    "url": "https://goldmeter.in",
    "logo": "https://goldmeter.in/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
    },
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

  // Add FAQ structured data where FAQs exist
  const faqData =
    faqs && faqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer,
            },
          })),
        }
      : null;

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
      {faqData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
      )}
    </>
  );
}

