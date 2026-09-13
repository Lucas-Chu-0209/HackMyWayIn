type FeaturedCandidate = {
  slug: string;
  date: string;
  importance: number;
  featured: boolean;
};

// Curated posts take priority; remaining slots show the newest articles.
export function selectFeaturedPosts<T extends FeaturedCandidate>(posts: readonly T[], limit = 5): T[] {
  return [...posts].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.featured && a.importance !== b.importance) return b.importance - a.importance;
    return b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);
  }).slice(0, limit);
}
