import { readFileSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { UPLOADS_DIR } from "../config/resumeStorage.js";

export const HIGHLIGHTS_CUSTOM_JSON = join(UPLOADS_DIR, "highlights-custom.json");
export const HIGHLIGHT_ASSETS_DIR = join(UPLOADS_DIR, "highlight-assets");

const CUSTOM_ID_RE = /^custom-[a-zA-Z0-9-]{6,128}$/;
const MAX_CUSTOM = 40;
const MAX_STR = {
  label: 120,
  emoji: 16,
  title: 240,
  summary: 12000,
  body: 12000,
  href: 2000,
  ctaLabel: 120,
  imageSrc: 2400,
  imageAlt: 400,
  attachmentHref: 2000,
  attachmentLabel: 200,
};

/** @param {unknown} h */
export function sanitizeHighlight(h) {
  if (!h || typeof h !== "object") return null;
  const o = /** @type {Record<string, unknown>} */ (h);
  const id = typeof o.id === "string" ? o.id.trim() : "";
  if (!CUSTOM_ID_RE.test(id)) return null;

  /** @param {unknown} v @param {number} max */
  const s = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);
  const label = s(o.label, MAX_STR.label);
  if (!label) return null;

  const out = {
    id,
    label,
    emoji: s(o.emoji, MAX_STR.emoji) || "✨",
    title: s(o.title, MAX_STR.title),
    summary: s(o.summary, MAX_STR.summary),
    body: s(o.body, MAX_STR.body),
    href: s(o.href, MAX_STR.href),
    ctaLabel: s(o.ctaLabel, MAX_STR.ctaLabel),
    imageSrc: s(o.imageSrc, MAX_STR.imageSrc),
    imageAlt: s(o.imageAlt, MAX_STR.imageAlt),
    attachmentHref: s(o.attachmentHref, MAX_STR.attachmentHref),
    attachmentLabel: s(o.attachmentLabel, MAX_STR.attachmentLabel),
  };
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined && v !== ""));
}

export function readCustomHighlightsFromDisk() {
  if (!existsSync(HIGHLIGHTS_CUSTOM_JSON)) return [];
  try {
    const raw = readFileSync(HIGHLIGHTS_CUSTOM_JSON, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out = [];
    for (const row of parsed) {
      const h = sanitizeHighlight(row);
      if (h) out.push(h);
    }
    return out;
  } catch {
    return [];
  }
}

/** @param {unknown[]} items */
export function writeCustomHighlightsToDisk(items) {
  if (!Array.isArray(items) || items.length > MAX_CUSTOM) {
    throw new Error(`Invalid highlights list (max ${MAX_CUSTOM})`);
  }
  const cleaned = [];
  for (const row of items) {
    const h = sanitizeHighlight(row);
    if (!h) throw new Error("Invalid highlight entry");
    cleaned.push(h);
  }
  writeFileSync(HIGHLIGHTS_CUSTOM_JSON, JSON.stringify(cleaned, null, 2), "utf8");
}
