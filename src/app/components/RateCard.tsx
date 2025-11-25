type RateCardProps = {
  label: string;
  grams: number;
  price: number;
  change?: number;
};

const currency = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export default function RateCard({
  label,
  grams,
  price,
  change,
}: RateCardProps) {
  const changeColor =
    change && change > 0 ? "text-emerald-600" : "text-rose-500";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-charcoal">
        ₹{currency.format(price)}
      </p>
      <p className="text-xs text-slate-500">{grams} gram</p>
      {typeof change === "number" && (
        <p className={`mt-2 text-xs font-semibold ${changeColor}`}>
          {change > 0 ? "▲" : "▼"} ₹{Math.abs(change)}
        </p>
      )}
    </div>
  );
}

