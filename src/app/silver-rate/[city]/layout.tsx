import type { Metadata } from "next";

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  
  return {
    title: `Silver Rate in ${cityName} Today - 1kg, 10g Price | GoldMeter`,
    description: `Check today's silver rate in ${cityName}. Live 1kg and 10g silver prices with historical trends and daily updates.`,
    alternates: {
      canonical: `https://goldmeter.in/silver-rate/${city.toLowerCase()}`,
    },
    openGraph: {
      title: `Silver Rate in ${cityName} Today - 1kg, 10g Price | GoldMeter`,
      description: `Check today's silver rate in ${cityName}. Live 1kg and 10g silver prices with historical trends and daily updates.`,
      type: "website",
      url: `https://goldmeter.in/silver-rate/${city.toLowerCase()}`,
      siteName: "GoldMeter",
      locale: "en_IN",
      images: [
        {
          url: "https://goldmeter.in/og-image.png",
          width: 1200,
          height: 630,
          alt: `Silver Rate in ${cityName} Today - GoldMeter`,
        },
      ],
    },
  };
}

export default function SilverCityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

