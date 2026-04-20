import type { InteractionComment, InteractionKind } from "./types";

const LEGACY_BLOG_COMMENT_PREFIX = "ayush-blog-comments:";
const LEGACY_BLOG_LIKE_PREFIX = "ayush-blog-like:";

export const INTERACTIONS_SYNC_EVENT = "ayush-interactions-sync";

export function compositeKey(kind: InteractionKind, id: string) {
  return `${kind}:${id}` as const;
}

function likeKey(kind: InteractionKind, id: string) {
  return `ayush-like:${kind}:${id}`;
}

function commentsKey(kind: InteractionKind, id: string) {
  return `ayush-comments:${kind}:${id}`;
}

export function dispatchInteractionsSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(INTERACTIONS_SYNC_EVENT));
  }
}

function normalizeCommentEntry(c: unknown): InteractionComment | null {
  if (typeof c !== "object" || c === null) return null;
  const o = c as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.text !== "string" || typeof o.at !== "number") return null;
  const rawName = o.authorName;
  const authorName =
    typeof rawName === "string" && rawName.trim().length > 0 ? rawName.trim() : "Anonymous";
  return { id: o.id, text: o.text, at: o.at, authorName };
}

function parseCommentsJson(raw: string | null): InteractionComment[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeCommentEntry).filter((c): c is InteractionComment => c !== null);
  } catch {
    return [];
  }
}

/** Read like from unified keys, with legacy blog keys supported. */
export function readLikeFromStorage(kind: InteractionKind, id: string): boolean {
  if (typeof window === "undefined") return false;
  const u = localStorage.getItem(likeKey(kind, id));
  if (u === "1") return true;
  if (u === "0") return false;
  if (kind === "blog") {
    return localStorage.getItem(LEGACY_BLOG_LIKE_PREFIX + id) === "1";
  }
  return false;
}

export function writeLikeToStorage(kind: InteractionKind, id: string, liked: boolean) {
  try {
    const v = liked ? "1" : "0";
    localStorage.setItem(likeKey(kind, id), v);
    if (kind === "blog") {
      localStorage.setItem(LEGACY_BLOG_LIKE_PREFIX + id, v);
    }
    dispatchInteractionsSync();
  } catch {
    /* quota */
  }
}

export function readCommentsFromStorage(kind: InteractionKind, id: string): InteractionComment[] {
  if (typeof window === "undefined") return [];
  const unified = parseCommentsJson(localStorage.getItem(commentsKey(kind, id)));
  if (unified.length > 0) return unified;
  if (kind === "blog") {
    return parseCommentsJson(localStorage.getItem(LEGACY_BLOG_COMMENT_PREFIX + id));
  }
  return [];
}

export function writeCommentsToStorage(
  kind: InteractionKind,
  id: string,
  list: InteractionComment[],
) {
  try {
    const raw = JSON.stringify(list);
    localStorage.setItem(commentsKey(kind, id), raw);
    if (kind === "blog") {
      localStorage.setItem(LEGACY_BLOG_COMMENT_PREFIX + id, raw);
    }
    dispatchInteractionsSync();
  } catch {
    /* quota */
  }
}

export function newCommentId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatCommentTime(at: number) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(at));
  } catch {
    return new Date(at).toLocaleString();
  }
}

export function tryParseLikeStorageKey(
  key: string | null,
): { kind: InteractionKind; id: string } | null {
  if (!key) return null;
  const m = key.match(/^ayush-like:([^:]+):(.+)$/);
  if (m && isInteractionKind(m[1])) return { kind: m[1], id: m[2] };
  const legacy = key.match(/^ayush-blog-like:(.+)$/);
  if (legacy) return { kind: "blog", id: legacy[1] };
  return null;
}

export function tryParseCommentsStorageKey(
  key: string | null,
): { kind: InteractionKind; id: string } | null {
  if (!key) return null;
  const m = key.match(/^ayush-comments:([^:]+):(.+)$/);
  if (m && isInteractionKind(m[1])) return { kind: m[1], id: m[2] };
  const legacy = key.match(/^ayush-blog-comments:(.+)$/);
  if (legacy) return { kind: "blog", id: legacy[1] };
  return null;
}

function isInteractionKind(s: string): s is InteractionKind {
  return (
    s === "blog" ||
    s === "repository" ||
    s === "portfolioWork" ||
    s === "certification" ||
    s === "experience"
  );
}
