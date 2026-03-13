import { defineRouting } from "next-intl/routing";

export const locales = ["en", "hi", "ta", "te"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});
