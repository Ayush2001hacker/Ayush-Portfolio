/** Custom highlights (saved via API) use ids with this prefix; seeded defaults never do. */
export function isDeletableCustomHighlightId(id: string): boolean {
  return id.startsWith("custom-");
}
