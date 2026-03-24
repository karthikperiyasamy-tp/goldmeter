/**
 * Detect whether an RSS-derived summary is distinct enough to show as a "real" excerpt.
 * Many feeds (notably Google News) repeat the headline or ship almost no body text.
 */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[""'']/g, '"')
    .trim();
}

const MIN_MEANINGFUL_LEN = 48;

export function hasMeaningfulSummary(title: string, summary: string): boolean {
  const t = normalize(title);
  const s = normalize(summary);
  if (!s || s.length < MIN_MEANINGFUL_LEN) return false;
  if (s.startsWith("read the latest:")) return false;
  if (s === t) return false;
  // Common pattern: description is just the headline plus a short source name
  if (s.startsWith(t)) {
    const rest = s.slice(t.length).trim();
    if (rest.length < 30) return false;
  }
  // Title fully contains summary and summary is not much shorter (duplicate)
  if (t.startsWith(s) && s.length >= t.length * 0.95) return false;
  return true;
}
