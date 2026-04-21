/** `next/image` cannot optimize these — use `<img>` or `unoptimized`. */
export function isDataOrBlobImageSrc(src: string): boolean {
  return src.startsWith("data:") || src.startsWith("blob:");
}
