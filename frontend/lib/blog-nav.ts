/** Deep-link back from `/blog/[slug]` to the Blogs tab with the preview modal open. */
export function portfolioReturnFromBlogHref(slug: string) {
  return `/?nav=blogs&blog=${encodeURIComponent(slug)}`;
}
