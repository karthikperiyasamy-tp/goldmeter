"use client";

import Link from "next/link";
import type { JewellerConfig } from "@/lib/jewellerConfig";

type JewellerCardProps = {
  jeweller: JewellerConfig;
  featured?: boolean;
};

export default function JewellerCard({ jeweller, featured = false }: JewellerCardProps) {
  const typeLabel = jeweller.type === 'national' ? 'Pan-India' : 'Regional';
  const typeBadgeClass = jeweller.type === 'national' 
    ? 'bg-amber-100 text-amber-800' 
    : 'bg-slate-100 text-slate-700';

  return (
    <Link
      href={`/jewellers/${jeweller.slug}`}
      className={`group block rounded-2xl border bg-white p-5 transition-all hover:shadow-lg ${
        featured 
          ? 'border-amber-300 shadow-md' 
          : 'border-slate-100 shadow-soft hover:border-amber-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Jeweller Name */}
          <h3 className="text-lg font-bold text-charcoal group-hover:text-amber-700 transition-colors truncate">
            {jeweller.name}
          </h3>
          
          {/* Location & Year */}
          <p className="mt-1 text-sm text-slate-500">
            {jeweller.headquarters} • Est. {jeweller.foundedYear}
          </p>
        </div>
        
        {/* Type Badge */}
        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadgeClass}`}>
          {typeLabel}
        </span>
      </div>

      {/* Making Charges - Highlighted */}
      <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 p-3">
        <p className="text-xs font-medium text-amber-800 uppercase tracking-wide">
          Making Charges
        </p>
        <p className="mt-1 text-lg font-bold text-amber-900">
          {jeweller.makingChargesRange}
        </p>
      </div>

      {/* Highlights */}
      <div className="mt-4 flex flex-wrap gap-2">
        {jeweller.highlights.slice(0, 2).map((highlight, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 text-xs text-slate-600"
          >
            <span className="text-amber-500">✓</span>
            <span className="truncate max-w-[140px]">{highlight}</span>
          </span>
        ))}
      </div>

      {/* City Links Preview */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500 mb-2">Available in:</p>
        <div className="flex flex-wrap gap-1.5">
          {jeweller.cityLinks.slice(0, 4).map((city) => (
            <span
              key={city.slug}
              className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600"
            >
              {city.name}
            </span>
          ))}
          {jeweller.cityLinks.length > 4 && (
            <span className="px-2 py-0.5 text-xs text-slate-400">
              +{jeweller.cityLinks.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* View Details Link */}
      <div className="mt-4 flex items-center justify-end">
        <span className="text-sm font-semibold text-amber-600 group-hover:text-amber-700 transition-colors">
          View details →
        </span>
      </div>
    </Link>
  );
}
