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
  };
}

export default function SilverCityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

