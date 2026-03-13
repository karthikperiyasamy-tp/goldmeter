import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Community — Q&A, Discussions & Polls | GoldMeter",
  description:
    "Join the GoldMeter community: ask gold questions, discuss market trends, vote on weekly polls, and share insights with Indian gold investors.",
  keywords: [
    "gold community India",
    "gold discussion forum",
    "gold Q&A",
    "gold investment discussion",
    "gold price discussion",
    "gold buying advice",
    "Indian gold investors",
    "gold market poll",
  ],
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "Gold Community — Discuss, Ask & Vote | GoldMeter",
    description:
      "Ask gold-related questions, participate in weekly market polls, and discuss gold trends with fellow Indian investors on GoldMeter.",
    url: "https://goldmeter.in/community",
    siteName: "GoldMeter",
    locale: "en_IN",
    type: "website",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
