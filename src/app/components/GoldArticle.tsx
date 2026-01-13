"use client";

import { useState, useRef } from "react";

interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  preview: string;
  content: React.ReactNode;
}

const articles: Article[] = [
  {
    id: "gold-origins",
    title: "Where Does Gold Come From, and How Is It Formed in Nature?",
    date: "Updated Dec 14, 2025",
    readTime: "8 min read",
    preview: "Gold is one of the oldest and most fascinating metals known to humankind. Long before it became jewellery, currency, or an investment asset, gold had an extraordinary journey that began far beyond Earth.",
    content: <GoldOriginsContent />,
  },
  {
    id: "gold-special",
    title: "What Makes Gold So Special and Sought After Compared to Other Metals?",
    date: "Updated Dec 14, 2025",
    readTime: "7 min read",
    preview: "Gold has been valued by civilizations across the world for thousands of years. Discover the unique physical properties, rarity, and universal trust that set gold apart from all other metals.",
    content: <GoldSpecialContent />,
  },
  {
    id: "gold-hedge",
    title: "Why Do Investors Turn to Gold During Economic Uncertainty or as a Hedge Against Inflation?",
    date: "Updated Dec 14, 2025",
    readTime: "8 min read",
    preview: "Gold has long been considered a safe and reliable asset during periods of economic stress. Learn why investors turn to gold as a hedge against inflation and currency devaluation.",
    content: <GoldHedgeContent />,
  },
  {
    id: "gold-premiums",
    title: "How Do Spot Prices and Premiums Work When Buying Gold?",
    date: "Updated Dec 14, 2025",
    readTime: "7 min read",
    preview: "Understand the difference between spot prices and the actual price you pay for gold, including how premiums work and why they vary for different gold products.",
    content: <GoldPremiumsContent />,
  },
  {
    id: "gold-facts",
    title: "Fun and Interesting Facts About Gold",
    date: "Updated Dec 14, 2025",
    readTime: "6 min read",
    preview: "Discover fascinating facts about gold, from its cosmic origins to its surprising uses in technology, making it one of the most extraordinary elements on Earth.",
    content: <GoldFactsContent />,
  },
  {
    id: "gold-hallmarking",
    title: "What Is the Process of Gold Hallmarking in India?",
    date: "Updated Dec 14, 2025",
    readTime: "7 min read",
    preview: "Learn about BIS hallmarking in India, how it protects consumers, and why it's essential for ensuring the authenticity and purity of gold jewellery.",
    content: <GoldHallmarkingContent />,
  },
];

export default function GoldArticle() {
  const [expandedId, setExpandedId] = useState("gold-origins");
  const sectionRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleArticleClick = (articleId: string) => {
    setExpandedId(articleId);
    // Scroll to the clicked article, avoiding the fixed navbar
    setTimeout(() => {
      const articleElement = articleRefs.current[articleId];
      if (articleElement) {
        // Calculate offset to account for fixed navbar (approximately 80px)
        const yOffset = -80;
        const y = articleElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-bold text-charcoal mb-6">Featured Articles</h2>
      
      {/* Gold Education Links */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Gold Education</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleArticleClick("gold-origins")}
                className="text-amber-700 font-semibold hover:text-amber-600 transition-colors text-sm text-left"
              >
                → Where Does Gold Come From?
              </button>
            </li>
            <li>
              <button
                onClick={() => handleArticleClick("gold-special")}
                className="text-amber-700 font-semibold hover:text-amber-600 transition-colors text-sm text-left"
              >
                → What Makes Gold So Special?
              </button>
            </li>
            <li>
              <button
                onClick={() => handleArticleClick("gold-facts")}
                className="text-amber-700 font-semibold hover:text-amber-600 transition-colors text-sm text-left"
              >
                → Fun Facts About Gold
              </button>
            </li>
          </ul>
        </div>
        
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Learn About Gold</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleArticleClick("gold-hedge")}
                className="text-amber-700 font-semibold hover:text-amber-600 transition-colors text-sm text-left"
              >
                → Gold During Economic Uncertainty
              </button>
            </li>
            <li>
              <button
                onClick={() => handleArticleClick("gold-premiums")}
                className="text-amber-700 font-semibold hover:text-amber-600 transition-colors text-sm text-left"
              >
                → Spot Prices & Premiums
              </button>
            </li>
            <li>
              <button
                onClick={() => handleArticleClick("gold-hallmarking")}
                className="text-amber-700 font-semibold hover:text-amber-600 transition-colors text-sm text-left"
              >
                → Gold Hallmarking in India
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Articles Container - All articles in order */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            ref={(el) => {
              if (el) articleRefs.current[article.id] = el;
            }}
          >
            <button
              onClick={() => handleArticleClick(article.id)}
              className="w-full text-left transition-all duration-500 ease-out"
            >
              {expandedId === article.id ? (
                // Expanded Article
                <article className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold text-charcoal mb-2">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-2 mb-8 text-sm text-slate-500">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
                    {article.content}
                  </div>
                </div>

                {/* Schema markup for SEO */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Article",
                      headline: article.title,
                      description: article.preview,
                      author: {
                        "@type": "Organization",
                        name: "GoldRate",
                      },
                      datePublished: "2025-12-14",
                      dateModified: "2025-12-14",
                    }),
                  }}
                />
              </article>
            ) : (
              // Collapsed Article
              <div className="rounded-2xl border border-slate-100 bg-white p-6 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold mb-2 text-charcoal text-lg line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-xs text-slate-500 mb-3">{article.date}</p>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {article.preview}
                </p>
                
                <div className="text-sm text-amber-600 font-semibold">
                  Read →
                </div>
              </div>
            )}
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}

function GoldSpecialContent() {
  return (
    <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
      <>
        <p>
          Gold has been valued by civilizations across the world for thousands of years. While many metals exist in nature, none have achieved the same universal trust, desirability, and long-term value as gold. From ancient coins and royal ornaments to modern investments and electronics, gold continues to stand apart. But what exactly makes gold so special compared to other metals?
        </p>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Unique Physical Properties of Gold
          </h2>
          <p>
            One of the biggest reasons gold is special lies in its physical characteristics.
          </p>
          <p>
            Gold is extremely malleable and ductile. A single gram of gold can be beaten into a thin sheet covering more than a square foot, or stretched into a wire several kilometres long. No other metal can be shaped so easily without breaking. This makes gold ideal for creating intricate jewellery and fine designs.
          </p>
          <p>
            Another remarkable property is that gold does not rust, corrode, or tarnish. Metals like iron rust, silver tarnishes, and copper oxidizes over time. Gold, however, remains unchanged even after centuries. This resistance to decay makes it perfect for long-term storage of wealth.
          </p>
          <p>
            Gold also reflects heat and conducts electricity efficiently, which is why it is used in electronics, medical equipment, and aerospace technology.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Rarity and Limited Supply
          </h2>
          <p>
            Gold is rare, but not impossibly rare. This balance is crucial.
          </p>
          <p>
            If gold were as common as iron, it would have little value. If it were too scarce, it would be impractical for widespread use. Gold exists in limited quantities, and mining it is difficult, time-consuming, and expensive. The supply of gold grows only marginally each year, which helps preserve its value.
          </p>
          <p>
            Importantly, gold cannot be created artificially at scale. Unlike paper currency, which can be printed in unlimited amounts, gold's supply is controlled by nature.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Universal Acceptance and Trust
          </h2>
          <p>
            Gold is accepted and valued everywhere in the world, regardless of language, culture, or political system. A gold bar or coin has value whether you are in India, the United States, Europe, or the Middle East.
          </p>
          <p>
            This universal trust developed over thousands of years. Ancient civilizations used gold as money long before modern banking systems existed. Even today, central banks across the world hold large gold reserves as a financial safeguard.
          </p>
          <p>
            In India, gold carries an even deeper meaning. It is associated with prosperity, tradition, and security. Gold is commonly gifted during weddings, festivals, and important life events, reinforcing its emotional and financial value.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Gold as a Store of Value
          </h2>
          <p>
            One of gold's most powerful qualities is its ability to preserve purchasing power over time.
          </p>
          <p>
            Paper currencies lose value due to inflation. What ₹1,000 could buy 20 years ago cannot be bought today. Gold, however, has historically maintained its worth across generations. This is why gold is often described as a "store of value."
          </p>
          <p>
            Unlike stocks or bonds, gold does not depend on the performance of a company or government. It has no credit risk and no default risk.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Comparison with Other Metals
          </h2>
          <p>
            While other precious metals like silver, platinum, and palladium also have value, they lack some of gold's advantages.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Silver is more abundant and tarnishes over time.</li>
            <li>Platinum is rarer but more industrially dependent, making its price volatile.</li>
            <li>Copper and iron are useful but too common to store value.</li>
          </ul>
          <p>
            Gold uniquely combines rarity, durability, beauty, and trust.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Liquidity and Ease of Exchange
          </h2>
          <p>
            Gold is highly liquid. It can be easily bought, sold, or pledged almost anywhere. In India, gold loans are widely available, allowing individuals to access funds without selling their gold.
          </p>
          <p>
            This liquidity makes gold not just a valuable asset, but also a practical one.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Conclusion
          </h2>
          <p>
            Gold is special because it satisfies multiple roles at once. It is a beautiful metal, a reliable store of value, a hedge against uncertainty, and a universally trusted asset. Its physical properties, limited supply, and deep cultural significance ensure that gold remains sought after, regardless of changes in technology or economic systems.
          </p>
          <p>
            While many metals serve specific purposes, gold alone has stood the test of time as both a symbol of wealth and a foundation of financial security.
          </p>
        </div>
      </>
    </div>
  );
}

function GoldHedgeContent() {
  return (
    <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
      <>
        <p>
          Gold has long been considered a safe and reliable asset, especially during periods of economic stress. When financial markets become unstable, inflation rises, or currencies weaken, investors across the world often increase their exposure to gold. This behaviour is not accidental—it is rooted in gold's unique ability to protect wealth during uncertain times.
        </p>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Gold as a Safe-Haven Asset
          </h2>
          <p>
            A safe-haven asset is one that tends to retain or increase its value during market turmoil. Gold has earned this status over centuries.
          </p>
          <p>
            During events such as:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Economic recessions</li>
            <li>Stock market crashes</li>
            <li>Geopolitical conflicts</li>
            <li>Banking or debt crises</li>
          </ul>
          <p>
            investors lose confidence in riskier assets like equities. Gold, on the other hand, is not tied to the performance of a company or a government. It exists independently of financial systems, which makes it a natural refuge when uncertainty rises.
          </p>
          <p>
            Historically, gold prices have often moved upward when fear dominates financial markets.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Protection Against Inflation
          </h2>
          <p>
            Inflation reduces the purchasing power of money. When prices rise, the same amount of currency buys fewer goods and services. Gold has consistently proven to be an effective hedge against inflation.
          </p>
          <p>
            Unlike fiat currency, which can be printed in unlimited quantities, gold has a limited supply. As inflation increases and currencies lose value, gold prices tend to adjust upward, helping investors preserve real purchasing power.
          </p>
          <p>
            For example, over long periods, gold has maintained its ability to buy similar quantities of essential goods, even as currency values change dramatically.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Currency Devaluation and Gold
          </h2>
          <p>
            Gold is priced internationally in US dollars. When local currencies weaken against the dollar, gold prices in that country often rise.
          </p>
          <p>
            In India, when the rupee depreciates, gold becomes more expensive even if global prices remain stable. This makes gold a useful hedge against currency risk, particularly for countries that import most of their gold.
          </p>
          <p>
            For Indian investors, gold acts as a financial shield against both domestic inflation and global currency fluctuations.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Low Correlation with Other Assets
          </h2>
          <p>
            One of the strongest reasons investors include gold in their portfolios is its low correlation with stocks and bonds.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>When stock markets perform well, gold may remain stable.</li>
            <li>When stock markets fall sharply, gold often holds its value or rises.</li>
          </ul>
          <p>
            This diversification benefit helps reduce overall portfolio risk. Even a small allocation to gold can improve portfolio stability during volatile periods.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Liquidity During Crisis
          </h2>
          <p>
            Gold is highly liquid. It can be sold quickly almost anywhere in the world, even during financial crises.
          </p>
          <p>
            In India, gold has additional advantages:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Easily accepted by banks and lenders</li>
            <li>Can be pledged for gold loans</li>
            <li>Strong domestic demand ensures quick resale</li>
          </ul>
          <p>
            This liquidity provides financial flexibility when access to cash becomes difficult.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Central Banks and Gold
          </h2>
          <p>
            Central banks around the world hold gold as part of their foreign exchange reserves. This itself reflects gold's importance.
          </p>
          <p>
            During periods of global uncertainty, many central banks increase their gold reserves to reduce reliance on any single currency. This institutional demand further reinforces gold's role as a stabilizing asset.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Emotional and Psychological Security
          </h2>
          <p>
            Beyond numbers and charts, gold offers psychological comfort. Investors trust gold because it has protected wealth for generations. This trust becomes especially important during crises, when fear and uncertainty dominate decision-making.
          </p>
          <p>
            In India, gold also serves as a cultural and financial safety net, passed down through families as a form of intergenerational wealth.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Conclusion
          </h2>
          <p>
            Investors turn to gold during economic uncertainty because it offers stability when other assets become unpredictable. Its ability to hedge against inflation, protect against currency depreciation, diversify portfolios, and provide liquidity makes gold a timeless financial safeguard.
          </p>
          <p>
            While no investment is entirely risk-free, gold's historical resilience and universal trust ensure that it remains a cornerstone of wealth preservation during uncertain times.
          </p>
        </div>
      </>
    </div>
  );
}

function GoldPremiumsContent() {
  return (
    <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
      <>
        <p>
          When buying gold—whether in the form of jewellery, coins, or bars—many buyers notice that the price they pay is higher than the gold rate shown online or in the news. This difference often causes confusion. To make informed buying decisions, it is important to understand how spot prices and premiums work in the gold market.
        </p>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            What Is the Spot Price of Gold?
          </h2>
          <p>
            The spot price of gold is the current market price at which gold can be bought or sold for immediate delivery. It is usually quoted per gram or per ounce and represents the price of pure gold (24 karat).
          </p>
          <p>
            Spot prices are determined in international markets and change continuously throughout the day. Several factors influence spot prices, including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Global supply and demand</li>
            <li>Interest rates</li>
            <li>Inflation expectations</li>
            <li>Currency movements, especially the US dollar</li>
            <li>Geopolitical events</li>
          </ul>
          <p>
            In India, daily gold rates are derived from international prices, adjusted for import duties, taxes, and currency exchange rates.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Why the Buying Price Is Higher Than the Spot Price
          </h2>
          <p>
            When you purchase physical gold, you are not just paying for the metal itself. The final price includes additional costs known as premiums.
          </p>
          <p>
            A premium is the amount charged over and above the spot price. It covers all the expenses involved in bringing gold from raw form to a finished product ready for sale.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Components of a Gold Premium
          </h2>
          <p>
            Premiums vary depending on the type of gold product and seller. Common components include:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                1. Manufacturing and Refining Costs
              </h3>
              <p>
                Gold must be refined to high purity levels and shaped into bars, coins, or jewellery. These processes involve specialized equipment, skilled labour, and quality control.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                2. Making Charges (Jewellery)
              </h3>
              <p>
                Jewellery includes design and craftsmanship costs. Complex designs and branded jewellery usually carry higher making charges than plain gold items.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                3. Transportation and Insurance
              </h3>
              <p>
                Gold must be transported securely and insured against loss or damage. These logistics add to the overall cost.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                4. Dealer Margin
              </h3>
              <p>
                Retailers and dealers include a margin to cover operational costs and profit.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                5. Taxes
              </h3>
              <p>
                In India, gold purchases attract Goods and Services Tax (GST), which is applied to the final price.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            How Premiums Differ by Gold Type
          </h2>
          <p>
            Gold coins and bars generally have lower premiums compared to jewellery because they require minimal design work.
          </p>
          <p>
            Small-weight coins often have higher premiums per gram than larger bars due to packaging and handling costs.
          </p>
          <p>
            Jewellery has the highest premiums due to making charges and design complexity. Understanding these differences helps buyers choose the most cost-effective form of gold based on their purpose—investment or adornment.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Why Premiums Change Over Time
          </h2>
          <p>
            Premiums are not fixed. They can change based on:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Demand and supply conditions</li>
            <li>Festival and wedding seasons</li>
            <li>Market volatility</li>
            <li>Availability of physical gold</li>
          </ul>
          <p>
            During periods of high demand or limited supply, premiums may increase even if spot prices remain stable.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Spot Price vs Value at Resale
          </h2>
          <p>
            When selling gold, buyers typically receive close to the prevailing spot price, not the price including premiums paid earlier. Making charges and certain premiums are usually not recovered, especially for jewellery.
          </p>
          <p>
            This is why investors often prefer coins or bars with lower premiums if their primary goal is wealth preservation rather than consumption.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            How Gold Prices Are Displayed Online
          </h2>
          <p>
            Most gold price websites show the spot price or near-spot price for standard purity levels like 22K and 24K. The final price at a jeweller will always be higher due to premiums.
          </p>
          <p>
            Checking daily gold rates helps buyers identify fair pricing and avoid overpaying.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Conclusion
          </h2>
          <p>
            Understanding spot prices and premiums is essential for anyone buying gold. The spot price reflects the true market value of gold, while premiums represent the costs involved in converting raw gold into a usable product.
          </p>
          <p>
            By knowing how premiums work and how they differ across gold products, buyers can make smarter decisions, choose the right form of gold, and better evaluate value—whether buying for investment, gifting, or personal use.
          </p>
        </div>
      </>
    </div>
  );
}

function GoldFactsContent() {
  return (
    <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
      <>
        <p>
          Gold is not just a valuable investment or a beautiful metal used in jewellery—it is also one of the most fascinating elements on Earth. Its unique properties, ancient history, and surprising uses make gold stand out among all metals. Here are some fun and interesting facts about gold that highlight why it has captured human imagination for thousands of years.
        </p>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Gold Is Older Than the Earth
          </h2>
          <p>
            One of the most astonishing facts about gold is that it is older than our planet. Gold was formed billions of years ago during cosmic events such as supernova explosions and neutron star collisions. When the Earth was formed, gold became part of its structure. Every piece of gold you see today has existed since before the Earth itself came into being.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            All the Gold Ever Mined Is Surprisingly Small
          </h2>
          <p>
            Despite its global presence and long history, the total amount of gold mined by humans is surprisingly limited. Scientists estimate that all the gold ever mined could fit into a cube about 22 meters on each side. This limited supply is a key reason why gold remains valuable and desirable.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Gold Is Extremely Malleable
          </h2>
          <p>
            Gold is the most malleable metal known. A single gram of gold can be beaten into a sheet thin enough to cover more than one square foot. It can also be drawn into extremely fine wires.
          </p>
          <p>
            This property allows jewellers to create intricate designs and enables gold to be used in electronics, medical devices, and precision equipment.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Gold Does Not Rust or Tarnish
          </h2>
          <p>
            Unlike most metals, gold does not rust, corrode, or tarnish. This means a gold ornament buried underground for centuries can emerge looking almost unchanged. This resistance to decay makes gold ideal for long-term storage of wealth and important artefacts.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Gold Is Edible
          </h2>
          <p>
            Pure gold is non-toxic and edible. In many cultures, thin gold leaf—known as vark in India—is used to decorate sweets and desserts. Gold is also used in luxury foods and beverages around the world, adding a touch of elegance rather than flavour.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Gold Is Used in Technology
          </h2>
          <p>
            Gold is not just for jewellery. It is widely used in modern technology because it conducts electricity efficiently and does not corrode. Gold is found in:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Smartphones and computers</li>
            <li>Medical equipment</li>
            <li>Satellites and spacecraft</li>
          </ul>
          <p>
            Even small quantities of gold play a critical role in advanced electronics.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Most Gold Is Still Above Ground
          </h2>
          <p>
            Unlike many natural resources that are consumed or destroyed, nearly all the gold ever mined still exists in some form—jewellery, coins, bars, or industrial products. Gold can be melted and reused without losing quality, making it a truly recyclable metal.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Gold Has Shaped Human History
          </h2>
          <p>
            Gold has influenced trade, wars, and economies throughout history. Ancient civilizations such as the Egyptians, Romans, and Indians used gold as currency and symbols of power. Many modern currencies were once backed by gold, known as the gold standard.
          </p>
          <p>
            Even today, central banks hold gold reserves as a financial safeguard.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            India Is One of the Largest Consumers of Gold
          </h2>
          <p>
            India is among the largest consumers of gold in the world. Gold plays a central role in weddings, festivals, and religious traditions. Indian households collectively hold thousands of tonnes of gold, making it an important part of the country's wealth.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Conclusion
          </h2>
          <p>
            Gold's appeal goes far beyond its price. Its cosmic origin, rarity, durability, and wide range of uses make it one of the most extraordinary elements known to humanity. Whether in ancient artefacts, modern technology, or festive celebrations, gold continues to shine as a symbol of value, beauty, and timelessness.
          </p>
        </div>
      </>
    </div>
  );
}

function GoldHallmarkingContent() {
  return (
    <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
      <>
        <p>
          Gold hallmarking is one of the most important safeguards for anyone buying gold in India. It ensures that the gold you purchase meets the purity standards claimed by the seller. With gold being both a financial asset and an emotional investment, hallmarking plays a crucial role in building trust and transparency in the gold market.
        </p>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            What Is Gold Hallmarking?
          </h2>
          <p>
            Gold hallmarking is the process of officially certifying the purity of gold. A hallmark is a set of symbols or marks stamped on gold jewellery or artefacts that confirm the gold's karatage and authenticity.
          </p>
          <p>
            In India, gold hallmarking is regulated by the Bureau of Indian Standards (BIS). BIS is the national standards body responsible for ensuring quality and consumer protection.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Why Hallmarking Is Important
          </h2>
          <p>
            Before hallmarking became widespread, buyers often depended solely on the jeweller's word regarding purity. This led to inconsistencies and under-purity issues.
          </p>
          <p>
            Hallmarking protects consumers by:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Ensuring accurate gold purity</li>
            <li>Preventing adulteration and fraud</li>
            <li>Making gold pricing transparent</li>
            <li>Increasing resale and loan value</li>
          </ul>
          <p>
            A BIS-hallmarked gold item gives buyers confidence that they are paying the right price for the correct purity.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Mandatory Hallmarking in India
          </h2>
          <p>
            The Indian government has made BIS hallmarking mandatory for most gold jewellery and artefacts. This rule applies to both offline and online sellers, with a few exceptions for very small items and certain types of jewellery.
          </p>
          <p>
            Mandatory hallmarking has helped standardize gold quality across the country and reduced the chances of consumers being misled.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Components of a BIS Hallmark
          </h2>
          <p>
            A BIS-hallmarked gold item typically contains the following marks:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                BIS Logo
              </h3>
              <p>
                Indicates certification by the Bureau of Indian Standards.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                Purity or Fineness Mark
              </h3>
              <p>
                Shows the purity of gold, such as:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>916 for 22K gold</li>
                <li>750 for 18K gold</li>
                <li>585 for 14K gold</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                Assaying and Hallmarking Centre (AHC) Mark
              </h3>
              <p>
                Identifies the BIS-authorized centre where the gold was tested.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                Jeweller's Identification Mark
              </h3>
              <p>
                A unique mark that identifies the jeweller or manufacturer.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                Year of Hallmarking
              </h3>
              <p>
                Represented by a code letter indicating the year the hallmark was applied.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            How the Hallmarking Process Works
          </h2>
          <p>
            The hallmarking process involves several steps:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>The jeweller submits the gold item to a BIS-authorized assaying and hallmarking centre.</li>
            <li>The centre tests the gold using advanced techniques such as X-ray fluorescence (XRF) or fire assay methods.</li>
            <li>If the gold meets the declared purity, the hallmark is stamped.</li>
            <li>If it fails, the item is returned to the jeweller for correction or rejection.</li>
          </ul>
          <p>
            This independent testing ensures unbiased verification of purity.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Hallmarking and Resale Value
          </h2>
          <p>
            Hallmarked gold usually enjoys higher trust in the resale market. Buyers, lenders, and banks prefer BIS-hallmarked jewellery because purity is already certified. This often results in better resale prices and smoother gold loan processing.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Things Buyers Should Check
          </h2>
          <p>
            When buying gold, consumers should:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Look for all five BIS hallmark components</li>
            <li>Verify jeweller registration with BIS</li>
            <li>Match the purity mark with the invoice</li>
            <li>Avoid unhallmarked gold for long-term investment</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Conclusion
          </h2>
          <p>
            Gold hallmarking is a powerful consumer protection mechanism that ensures purity, transparency, and trust. In a country like India, where gold is deeply woven into culture and finance, hallmarking helps buyers make informed decisions and safeguards their wealth.
          </p>
          <p>
            By choosing BIS-hallmarked gold, consumers not only protect their investment but also contribute to a more transparent and trustworthy gold market.
          </p>
        </div>
      </>
    </div>
  );
}

function GoldOriginsContent() {
  return (
    <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
      <>
        {/* Introduction */}
        <p>
          Gold is one of the oldest and most fascinating metals known to humankind. Long before it became jewellery, currency, or an investment asset, gold had an extraordinary journey that began far beyond Earth. Understanding where gold comes from and how it is formed in nature adds depth to its value and explains why it is so rare and precious even today.
        </p>

        {/* Cosmic Origins Section */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Cosmic Origins of Gold
          </h2>
          <p>
            Gold is not formed naturally on Earth like wood, stone, or water. Scientists believe that gold was created billions of years ago in outer space during extreme cosmic events. The most accepted theory is that gold was formed during supernova explosions and neutron star collisions.
          </p>
          <p>
            These events involve unimaginable temperatures and pressures—conditions powerful enough to create heavy elements such as gold, platinum, and uranium. When neutron stars collide, massive amounts of energy are released, forging gold atoms and scattering them across space. Over time, these particles became part of the cosmic dust that eventually formed planets, including Earth.
          </p>
          <p>
            <em>In simple terms, the gold we use today is older than our planet itself.</em>
          </p>
        </div>

        {/* How Gold Reached Earth's Crust */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            How Gold Reached the Earth's Crust
          </h2>
          <p>
            When Earth was formed around 4.5 billion years ago, most of its gold sank deep into the planet's core because gold is very dense. However, not all of it disappeared forever.
          </p>
          <p>
            Over millions of years, geological processes such as:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Volcanic activity</li>
            <li>Tectonic plate movement</li>
            <li>Meteorite impacts</li>
          </ul>
          <p>
            brought gold closer to the Earth's surface. Some scientists also believe that meteorites striking Earth after its formation added additional gold to the crust.
          </p>
          <p>
            Once closer to the surface, gold interacted with underground fluids. Hot water flowing through cracks in rocks dissolved small quantities of gold and later deposited it in veins as the water cooled. This process created gold-bearing quartz veins, which are commonly mined today.
          </p>
        </div>

        {/* Types of Natural Gold Deposits */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Types of Natural Gold Deposits
          </h2>
          <p>
            Gold is found in nature in two main forms:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                1. Lode (Hard Rock) Gold
              </h3>
              <p>
                This type of gold is found embedded in solid rock, usually quartz. Mining lode gold requires drilling, blasting, and processing the ore to extract the gold. Most large-scale gold mines operate this way.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                2. Alluvial (Placer) Gold
              </h3>
              <p>
                Alluvial gold forms when gold-bearing rocks erode over time. Rivers and streams carry gold particles downstream, where they settle due to gold's heavy weight. This is why gold is often found in riverbeds and sediments.
              </p>
              <p>
                Historically, many gold rushes—such as those in California and Australia—were driven by alluvial gold discoveries.
              </p>
            </div>
          </div>
        </div>

        {/* Where Is Gold Found Today */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Where Is Gold Found Today?
          </h2>
          <p>
            Gold is mined in many parts of the world. The leading gold-producing countries include:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>China</li>
            <li>Australia</li>
            <li>Russia</li>
            <li>South Africa</li>
            <li>Canada</li>
          </ul>
          <p>
            India also has gold deposits, particularly in Karnataka (Kolar and Hutti mines), Andhra Pradesh, and Rajasthan. However, domestic production is limited, and India imports the majority of its gold to meet demand for jewellery and investment.
          </p>
        </div>

        {/* Why Gold Is So Rare */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Why Gold Is So Rare
          </h2>
          <p>
            Gold's rarity is a major reason for its high value. Unlike iron or aluminium, gold cannot be manufactured or synthesized economically. The amount of gold available on Earth is finite.
          </p>
          <p>
            It is estimated that all the gold ever mined in human history would fit into a cube roughly 22 meters on each side. This limited supply, combined with consistent global demand, ensures that gold remains valuable over long periods.
          </p>
        </div>

        {/* From Nature to Market */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            From Nature to Market
          </h2>
          <p>
            Once gold is mined, it undergoes several stages:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Crushing and grinding</li>
            <li>Chemical processing or smelting</li>
            <li>Refining to achieve high purity (such as 99.9%)</li>
          </ul>
          <p>
            After refining, gold is converted into bars, coins, or jewellery and enters the global market, where prices are determined by demand, supply, and economic factors.
          </p>
        </div>

        {/* Conclusion */}
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-3">
            Conclusion
          </h2>
          <p>
            Gold's journey—from violent cosmic explosions to riverbeds, mines, and finally into our homes—is unlike that of any other metal. Its natural rarity, ancient origin, and resistance to decay make it truly special. When you hold gold, you are holding a piece of the universe's history, shaped over billions of years.
          </p>
          <p>
            This extraordinary origin is one of the many reasons gold continues to be trusted as a store of value, a symbol of wealth, and a timeless asset.
          </p>
        </div>
      </>
    </div>
  );
}
