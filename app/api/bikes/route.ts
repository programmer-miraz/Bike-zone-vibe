import type { NextRequest } from "next/server";
import { databaseErrorResponse, listBikes } from "@/lib/bikes";
import {
  CATEGORIES,
  MAX_SEARCH_LENGTH,
  SORT_OPTIONS,
  parseCategoryParam,
  parseSearchParam,
  parseSortParam,
} from "@/lib/types";

/**
 * GET /api/bikes
 *
 * Query parameters (all optional, they can be used together):
 *  - search | q : match against brand or model, case does not matter (max 80 characters)
 *  - category   : Sport | Cruiser | Adventure | Street
 *  - sort       : default | price-asc | price-desc
 *
 * Success response: { bikes: Bike[], count: number }
 * Errors: 400 wrong parameter · 503 MONGODB_URI missing · 500 database problem
 */
export async function GET(request: NextRequest) {
  // All the values the browser sent in the URL (?search=harley&category=Sport).
  const params = request.nextUrl.searchParams;

  // --- category ---
  const rawCategory = params.get("category");
  const category = parseCategoryParam(rawCategory);

  // "all" simply means "no filter", so it is fine. Any other unknown
  // value is a mistake, so we answer with 400.
  if (rawCategory && rawCategory.trim().toLowerCase() !== "all" && !category) {
    return Response.json(
      {
        error: `Invalid category "${rawCategory.slice(0, 40)}". Allowed values: ${CATEGORIES.join(", ")}.`,
      },
      { status: 400 },
    );
  }

  // --- sort ---
  const rawSort = params.get("sort");
  const sort = parseSortParam(rawSort);

  if (rawSort && !sort) {
    return Response.json(
      {
        error: `Invalid sort "${rawSort.slice(0, 40)}". Allowed values: ${SORT_OPTIONS.join(", ")}.`,
      },
      { status: 400 },
    );
  }

  // --- search ---
  const rawSearch = params.get("search") ?? params.get("q");

  if (rawSearch && rawSearch.length > MAX_SEARCH_LENGTH) {
    return Response.json(
      { error: `Search term must be ${MAX_SEARCH_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  // --- load the bikes ---
  try {
    const bikes = await listBikes({
      search: parseSearchParam(rawSearch),
      category,
      sort: sort ?? "default",
    });

    return Response.json({ bikes, count: bikes.length });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
