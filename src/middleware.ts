import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const path = request.nextUrl.pathname;
  const isPageView =
    !path.startsWith("/api/") &&
    !path.startsWith("/_next/") &&
    !path.startsWith("/admin/") &&
    !path.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|map)$/);

  if (isPageView) {
    response.headers.set("x-track-pageview", "true");
  }

  return response;
}

export const config = {
  matcher: [
    // Skip APIs, Next internals and any static asset files (e.g. /logo.png, /manifest.webmanifest)
    "/((?!api|admin|_next|_vercel|.*\\..*).*)",
  ],
};
