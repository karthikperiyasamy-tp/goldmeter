import CommunityClient from "./CommunityClient";

const communityJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Gold Community — Q&A, Discussions & Polls",
  description:
    "Join the GoldMeter community: ask gold questions, discuss market trends, vote on weekly polls, and share insights with Indian gold investors.",
  url: "https://goldmeter.in/community",
  isPartOf: {
    "@type": "WebSite",
    name: "GoldMeter",
    url: "https://goldmeter.in",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://goldmeter.in" },
      { "@type": "ListItem", position: 2, name: "Community", item: "https://goldmeter.in/community" },
    ],
  },
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(communityJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">
            Gold Community
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Discuss gold markets, share insights, and get answers from fellow Indian gold investors.
          </p>
        </header>

        <CommunityClient />
      </div>
    </main>
  );
}
