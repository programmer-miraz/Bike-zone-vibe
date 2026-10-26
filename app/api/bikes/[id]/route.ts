import type { NextRequest } from "next/server";
import { databaseErrorResponse, getBikeById } from "@/lib/bikes";
import { isValidBikeId } from "@/lib/types";

/**
 * GET /api/bikes/[id]
 *
 * Find one bike by its id (for example "panigale-v4r").
 *
 * Success response: { bike: Bike }
 * Errors: 400 wrong id · 404 unknown id · 503 MONGODB_URI missing · 500 database problem
 */
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/bikes/[id]">,
) {
  const { id } = await ctx.params;

  // A wrong id (for example "Panigale V4!") is stopped here, so no
  // database query is made with it.
  if (!isValidBikeId(id)) {
    return Response.json(
      {
        error:
          "Invalid bike ID. Expected a slug like \"panigale-v4r\" (lowercase letters, digits and hyphens).",
      },
      { status: 400 },
    );
  }

  try {
    const bike = await getBikeById(id);

    if (!bike) {
      return Response.json(
        { error: `Bike "${id}" was not found. Run "npm run seed" to load sample data.` },
        { status: 404 },
      );
    }

    return Response.json({ bike });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
