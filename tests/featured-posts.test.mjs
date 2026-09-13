import test from "node:test";
import assert from "node:assert/strict";
import { selectFeaturedPosts } from "../src/lib/featured-posts.ts";
const post = (slug, date, importance = 3, featured = false) => ({ slug, date, importance, featured });
test("curated importance precedes recency; latest posts fill five slots without mutation", () => {
  const posts = Object.freeze([
    post("new", "2026-09-14", 1), post("old", "2025-01-01", 5),
    post("curated", "2024-01-01", 5, true), post("curated-new", "2026-09-13", 4, true),
    post("recent", "2026-09-12"), post("middle", "2026-01-01"),
  ]);
  assert.deepEqual(selectFeaturedPosts(posts).map(p => p.slug), ["curated", "curated-new", "new", "recent", "middle"]);
  assert.equal(posts[0].slug, "new");
});
test("ties use date then slug, custom limit and short collections are supported", () => {
  const posts = [post("b", "2026-09-12", 5, true), post("a", "2026-09-12", 5, true), post("c", "2026-09-13", 5, true)];
  assert.deepEqual(selectFeaturedPosts(posts).map(p => p.slug), ["c", "a", "b"]);
  assert.deepEqual(selectFeaturedPosts(posts, 1).map(p => p.slug), ["c"]);
  assert.deepEqual(selectFeaturedPosts([]), []);
});
