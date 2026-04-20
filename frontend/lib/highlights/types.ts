/** One Instagram-style highlight story (strip + detail modal). */
export type Highlight = {
  id: string;
  /** Short label under the ring (keep concise for layout). */
  label: string;
  emoji: string;
  /** Heading inside the detail popup (defaults to `label`). */
  title?: string;
  summary?: string;
  body?: string;
  href?: string;
  ctaLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  attachmentHref?: string;
  attachmentLabel?: string;
};
