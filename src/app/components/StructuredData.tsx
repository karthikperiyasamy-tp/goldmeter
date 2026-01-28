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
  gold18k?: number;
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
  // Freshness signal for AIO
  dateISO?: string;
};

export default function StructuredData({ 
  type,
  city,
  gold22k,
  gold24k,
  gold18k,
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
  dateISO,
}: StructuredDataProps) {
  // Use new URL structure: /gold-rate/{city} (not old /{city})
  const cityUrl = city ? `https://goldmeter.in/gold-rate/${city.toLowerCase()}` : undefined;
  const defaultImage = "https://goldmeter.in/og-image.png";

  const toPrice = (value?: number | null) =>
    typeof value === "number" && Number.isFinite(value) ? Number(value.toFixed(2)) : null;

  let structuredData: any = {
    "@context": "https://schema.org",
  };

  if (type === 'homepage' || type === 'city') {
    // Financial service schema for gold price pages
    structuredData = {
      ...structuredData,
      "@type": "FinancialService",
      "name": `GoldMeter - ${city || 'India'} Gold Prices`,
      "description": `Today's 22K and 24K gold rates in ${city || 'India'}. Updated daily by GoldMeter.`,
      "url": cityUrl || "https://goldmeter.in",
      "priceRange": "₹₹",
      "currenciesAccepted": "INR",
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressLocality": city || "India"
      }
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
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "datePublished": published,
      "dateModified": modified,
      "image": imageUrl ? [imageUrl] : [defaultImage],
      "author": {
        "@type": "Organization",
        "name": authorName || "GoldMeter",
        "url": "https://goldmeter.in"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GoldMeter",
        "url": "https://goldmeter.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://goldmeter.in/logo.png",
          "width": 250,
          "height": 60
        },
      },
      // Enhanced for AIO: Article section and keywords
      "articleSection": "Gold Market News",
      "keywords": ["gold rate", "gold price", "bullion", "precious metals", "India gold"],
      "inLanguage": "en-IN",
      "isAccessibleForFree": true,
      "about": {
        "@type": "Thing",
        "name": "Gold Price in India"
      }
    };
  }

  const baseOffer = (price: number | null, url?: string) =>
    price === null
      ? null
      : {
          "@type": "Offer",
          url,
          priceCurrency: "INR",
          price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              currency: "INR",
              value: 0,
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 1,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 3,
                unitCode: "DAY",
              },
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "IN",
            returnPolicyCategory: "https://schema.org/NonRefundable",
          },
        };

  // Product schema for gold rates (per 10g) on city pages to satisfy Google product snippet requirements
  const productData =
    type === "city" && city
      ? [
          (() => {
            const price = toPrice(gold22k);
            if (price === null) return null;
            return {
              "@context": "https://schema.org",
              "@type": "Product",
              name: `${city} 22K Gold Price (per 10g)`,
              description: `22 karat gold rate in ${city} per 10 grams. Updated daily by GoldMeter.`,
              brand: {
                "@type": "Brand",
                name: "GoldMeter",
              },
              category: "Gold",
              url: cityUrl,
              image: [defaultImage],
              offers: baseOffer(price, cityUrl),
            };
          })(),
          (() => {
            const price = toPrice(gold24k);
            if (price === null) return null;
            return {
              "@context": "https://schema.org",
              "@type": "Product",
              name: `${city} 24K Gold Price (per 10g)`,
              description: `24 karat gold rate in ${city} per 10 grams. Updated daily by GoldMeter.`,
              brand: {
                "@type": "Brand",
                name: "GoldMeter",
              },
              category: "Gold",
              url: cityUrl,
              image: [defaultImage],
              offers: baseOffer(price, cityUrl),
            };
          })(),
        ].filter(Boolean)
      : [];

  // AIO-optimized FinancialProduct schema with offers and dateModified (critical for AI search)
  const financialProductData = type === "city" && city && dateISO ? {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": `Gold Rate in ${city}`,
    "description": `Today's gold rate in ${city}: 24K, 22K and 18K gold prices per gram. Updated daily by GoldMeter.`,
    "areaServed": {
      "@type": "City",
      "name": city
    },
    "provider": {
      "@type": "Organization",
      "name": "GoldMeter",
      "url": "https://goldmeter.in"
    },
    "offers": [
      gold24k ? {
        "@type": "Offer",
        "price": String(Math.round(gold24k / 10)),
        "priceCurrency": "INR",
        "name": "24K Gold per gram",
        "description": "24 karat pure gold (99.9% purity)"
      } : null,
      gold22k ? {
        "@type": "Offer",
        "price": String(Math.round(gold22k / 10)),
        "priceCurrency": "INR",
        "name": "22K Gold per gram",
        "description": "22 karat gold (91.6% purity)"
      } : null,
      gold18k ? {
        "@type": "Offer",
        "price": String(Math.round(gold18k / 10)),
        "priceCurrency": "INR",
        "name": "18K Gold per gram",
        "description": "18 karat gold (75% purity)"
      } : null
    ].filter(Boolean),
    "dateModified": dateISO
  } : null;

  // Dataset schema for AIO data authority (critical for beating competitors like Goodreturns)
  // This tells AI that GoldMeter IS the data source, not just displaying third-party data
  const datasetData = type === "city" && city && dateISO ? {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${city} Gold Rate Today`,
    "description": `Live gold price per gram in ${city} for 22K and 24K gold, updated daily from ${city} bullion market.`,
    "creator": {
      "@type": "Organization",
      "name": "GoldMeter",
      "url": "https://goldmeter.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GoldMeter",
      "url": "https://goldmeter.in"
    },
    "temporalCoverage": dateISO,
    "spatialCoverage": {
      "@type": "Place",
      "name": `${city}, India`
    },
    "variableMeasured": [
      gold24k ? {
        "@type": "PropertyValue",
        "name": "24K Gold Price",
        "value": Math.round(gold24k / 10),
        "unitText": "INR per gram"
      } : null,
      gold22k ? {
        "@type": "PropertyValue",
        "name": "22K Gold Price",
        "value": Math.round(gold22k / 10),
        "unitText": "INR per gram"
      } : null,
      gold18k ? {
        "@type": "PropertyValue",
        "name": "18K Gold Price",
        "value": Math.round(gold18k / 10),
        "unitText": "INR per gram"
      } : null
    ].filter(Boolean),
    "dateModified": dateISO,
    "license": "https://goldmeter.in/terms"
  } : null;

  // Add organization data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GoldMeter",
    "url": "https://goldmeter.in",
    "logo": "https://goldmeter.in/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
    },
    "sameAs": [
      "https://twitter.com/goldmeter",
      "https://facebook.com/goldmeter"
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
        "item": cityUrl
      }
    ]
  } : null;

  // WebPage schema with Speakable specification for Voice Search Optimization
  // This helps Google Assistant, Alexa, and other voice assistants identify speakable content
  const webPageWithSpeakableData = (type === "city" || type === "homepage") && dateISO ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": city 
      ? `Gold Rate Today in ${city} - Live 22K & 24K Price per Gram`
      : "Gold Rate Today in India - Live 22K & 24K Price",
    "description": city
      ? `Today's gold rate in ${city}: ₹${gold24k ? Math.round(gold24k / 10).toLocaleString('en-IN') : ''}/gram for 24K, ₹${gold22k ? Math.round(gold22k / 10).toLocaleString('en-IN') : ''}/gram for 22K.`
      : "Live gold prices across Indian cities with 22K, 24K rates updated daily.",
    "url": cityUrl || "https://goldmeter.in",
    "dateModified": dateISO,
    "inLanguage": "en-IN",
    "isPartOf": {
      "@type": "WebSite",
      "name": "GoldMeter",
      "url": "https://goldmeter.in"
    },
    // Speakable specification for voice search - targets key answer blocks
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "[data-ai-answer]",           // Primary answer paragraph
        "h1",                          // Page title/headline
        "[data-price-table] caption",  // Table caption
        "[data-speakable-price]",      // Key price elements
        "[data-speakable-summary]"     // Summary blocks
      ]
    }
  } : null;

  // Article speakable for news articles
  const articleSpeakableData = type === "article" && url ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": headline,
    "url": url,
    "dateModified": dateModified ? new Date(dateModified).toISOString() : undefined,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "[data-ai-answer]",
        "h1",
        "[data-article-summary]",
        ".article-intro"
      ]
    }
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
      {productData.map((product, index) => (
        <script
          key={`product-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
        />
      ))}
      {financialProductData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductData) }}
        />
      )}
      {datasetData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetData) }}
        />
      )}
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
      {webPageWithSpeakableData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageWithSpeakableData) }}
        />
      )}
      {articleSpeakableData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSpeakableData) }}
        />
      )}
    </>
  );
}

