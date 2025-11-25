"use client";

type City = {
  name: string;
  gold22k: number;
  updated: string;
};

type CitySelectorProps = {
  cities: City[];
  onSelect: (city: string) => void;
};

export default function CitySelector({ cities, onSelect }: CitySelectorProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-charcoal">
          Prices by City
        </h3>
        <button className="text-sm font-semibold text-amber-600">
          View all cities →
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cities.map((city) => (
          <button
            key={city.name}
            className="text-left rounded-2xl border border-slate-100 bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:border-amber-200"
            onClick={() => onSelect(city.name)}
          >
            <p className="text-sm text-slate-500">{city.name}</p>
            <p className="mt-1 text-2xl font-bold text-charcoal">
              ₹{city.gold22k.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-400">Updated {city.updated}</p>
            <p className="mt-2 text-xs font-semibold text-amber-600">View →</p>
          </button>
        ))}
      </div>
    </section>
  );
}

