type FreshnessTrustBarProps = {
  dateISO: string;
  dateLabel: string;
  timeLabel?: string;
  sourceLabel?: string;
};

export default function FreshnessTrustBar({
  dateISO,
  dateLabel,
  timeLabel,
  sourceLabel = "GoldMeter.in",
}: FreshnessTrustBarProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 border border-emerald-200">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Verified from IBJA
      </span>
      <span>|</span>
      <span>
        Updated: <time dateTime={dateISO}>{dateLabel}{timeLabel ? `, ${timeLabel}` : ""}</time>
      </span>
      <span>|</span>
      <span>
        Source: <strong>{sourceLabel}</strong>
      </span>
    </div>
  );
}
