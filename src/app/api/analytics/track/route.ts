import { NextResponse } from "next/server";

import { trackPostAnalytics } from "@/lib/analytics";
import { getPostBySlug } from "@/lib/posts";

export const runtime = "nodejs";

type TrackPayload = {
  slug?: unknown;
};

function isValidSlugValue(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let payload: TrackPayload;

  try {
    payload = (await request.json()) as TrackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isValidSlugValue(payload.slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  const slug = payload.slug.trim();
  const post = await getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const result = await trackPostAnalytics(slug, request.headers);

  return NextResponse.json({
    ok: true,
    tracked: result.tracked,
    rateLimited: result.rateLimited,
    reason: result.reason ?? null,
  });
}
