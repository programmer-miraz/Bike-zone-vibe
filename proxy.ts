// proxy.ts runs before a page is rendered (in Next.js 16 the old
// "middleware.ts" is called "proxy").
//
// Why we need it: /bikes/[id] streams its content. Once the response has
// started streaming, the status code is already 200 — calling notFound()
// later can only show the not-found page with "noindex" (a soft 404).
// So we check the id here, before rendering starts, and can answer with a
// real 404.
//
// The checks are kept fast on purpose: a quick format test plus one
// indexed lookup. If the database has a problem we let the request
// through and let the page show its own error message.

import { NextResponse, type NextRequest } from "next/server";
import { bikeExists } from "@/lib/bikes";
import { isValidBikeId } from "@/lib/types";

// Only the /bikes pages use the proxy. API routes and the list page
// are not touched.
export const config = {
  matcher: "/bikes/:path*",
};

// We stop waiting for the database after this many milliseconds.
const EXISTENCE_CHECK_TIMEOUT_MS = 3000;

/**
 * Show the 404 page with a real 404 status code, while the address bar
 * keeps the original /bikes/<id> URL.
 */
function showNotFoundPage(request: NextRequest): NextResponse {
  return NextResponse.rewrite(new URL("/bike-not-found", request.url));
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  // "/bikes/panigale-v4r" becomes ["bikes", "panigale-v4r"].
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);

  // "/bikes" (the list page) — nothing to check.
  if (parts.length < 2) return NextResponse.next();

  const id = parts[1];

  // Image files inside /public/bikes (hero.jpg, category-sport.jpg, ...).
  // The proxy runs before those files are served, and a file name like
  // "hero.jpg" would otherwise be treated as a bike id and break every
  // image on the site. Real bike ids never contain a dot.
  if (id.includes(".")) return NextResponse.next();

  // "/bikes/<id>/something" is not a real page, and an id that is not a
  // slug (for example "Panigale_V4") can never exist.
  if (parts.length > 2 || !isValidBikeId(id)) {
    return showNotFoundPage(request);
  }

  // The id looks right — check that the bike really exists. We wait at
  // most 3 seconds; after that we let the request continue (the page
  // will load the bike itself and show its own error if needed).
  try {
    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), EXISTENCE_CHECK_TIMEOUT_MS),
    );

    const exists = await Promise.race([bikeExists(id), timeout]);

    // false = no such bike. null = the check timed out, so we do not know.
    if (exists === false) return showNotFoundPage(request);
  } catch {
    // The database is not reachable — let the request through.
  }

  return NextResponse.next();
}
