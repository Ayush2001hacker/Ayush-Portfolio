"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useState } from "react";
import type { BlogPost } from "@/lib/site-content";
import { formatCommentTime, useBlogPostInteractions } from "@/lib/blog-post-interactions";
import { IconCompose, IconHeart, IconShare } from "./icons";

type Props = {
  post: BlogPost | null;
  onClose: () => void;
  /** In-app “Read article” only — avoid `router.replace` here so it does not race with navigation to `/blog/...`. */
  onLeaveForArticle?: () => void;
};

function articleHref(post: BlogPost) {
  if (post.slug) return `/blog/${post.slug}`;
  return post.href ?? "#";
}

function isExternal(post: BlogPost) {
  return Boolean(post.href?.startsWith("http") && !post.slug);
}

function absoluteArticleUrl(post: BlogPost) {
  const path = articleHref(post);
  if (path.startsWith("http")) return path;
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).href;
}

export function BlogModal({ post, onClose, onLeaveForArticle = onClose }: Props) {
  const { liked, toggleLike, comments, addCommentText } = useBlogPostInteractions(post?.id);
  const [shareLabel, setShareLabel] = useState("Share");
  const [commentOpen, setCommentOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const nameFieldId = useId();
  const commentFieldId = useId();
  const composerRegionId = useId();

  useEffect(() => {
    if (!post) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [post, onClose]);

  useEffect(() => {
    setShareLabel("Share");
    setCommentOpen(false);
    setNameDraft("");
    setCommentDraft("");
  }, [post?.id]);

  const copyShareLink = useCallback(async () => {
    if (!post) return;
    const url = absoluteArticleUrl(post);
    try {
      await navigator.clipboard.writeText(url);
      setShareLabel("Copied!");
      window.setTimeout(() => setShareLabel("Share"), 2000);
    } catch {
      setShareLabel("Copy failed");
      window.setTimeout(() => setShareLabel("Share"), 2000);
    }
  }, [post]);

  const submitComment = useCallback(() => {
    if (!nameDraft.trim() || !commentDraft.trim()) return;
    addCommentText(commentDraft, nameDraft);
    setNameDraft("");
    setCommentDraft("");
    setCommentOpen(false);
  }, [commentDraft, nameDraft, addCommentText]);

  const commentCount = comments.length;

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-modal-title"
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[var(--ig-overlay)]"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.article
            className="relative z-10 flex max-h-[min(92dvh,820px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-[var(--ig-surface)] shadow-2xl ring-1 ring-[var(--ig-border)] sm:max-h-[85dvh] sm:rounded-2xl"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div
              className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-video"
              style={
                post.feedThumbSrc
                  ? undefined
                  : {
                      background: `linear-gradient(135deg, rgba(245,133,41,0.35), rgba(221,42,123,0.35), rgba(129,52,175,0.35))`,
                    }
              }
            >
              {post.feedThumbSrc ? (
                <Image
                  src={post.feedThumbSrc}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, 32rem"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/25">
                  {post.title.slice(0, 1)}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              >
                Close
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="blog-modal-title" className="text-lg font-semibold leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--ig-text-muted)]">{post.date ?? "Article"}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 border-b border-[var(--ig-border)] pb-3">
                <button
                  type="button"
                  onClick={toggleLike}
                  className="ig-tap-scale flex items-center gap-1.5 text-sm font-semibold"
                  aria-pressed={liked}
                >
                  <IconHeart filled={liked} />
                  <span className="text-[var(--ig-text)]">{liked ? "Liked" : "Like"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCommentOpen((v) => !v)}
                  className="ig-tap-scale flex items-center gap-2 text-sm font-semibold text-[var(--ig-text)] hover:opacity-80"
                  aria-expanded={commentOpen}
                  aria-controls={composerRegionId}
                >
                  <span className="flex items-center gap-1.5">
                    <IconCompose />
                    Comment
                  </span>
                  <span
                    className="min-w-[1.25rem] rounded-full bg-[var(--ig-bg)] px-1.5 py-0.5 text-center text-[11px] font-bold tabular-nums text-[var(--ig-text-secondary)] ring-1 ring-[var(--ig-border)]"
                    aria-label={`${commentCount} comments`}
                  >
                    {commentCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="ig-tap-scale flex items-center gap-1.5 text-sm font-semibold text-[var(--ig-text)] hover:opacity-80"
                  aria-label="Copy link to this article"
                >
                  <IconShare />
                  {shareLabel}
                </button>
              </div>

              {commentOpen && (
                <div
                  id={composerRegionId}
                  className="rounded-xl bg-[var(--ig-bg)] p-3 ring-1 ring-[var(--ig-border)]"
                >
                  <label htmlFor={nameFieldId} className="mb-1.5 block text-xs font-semibold text-[var(--ig-text-secondary)]">
                    Name
                  </label>
                  <input
                    id={nameFieldId}
                    type="text"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    autoComplete="name"
                    placeholder="Your name"
                    className="mb-3 w-full rounded-lg border border-[var(--ig-border)] bg-[var(--ig-surface)] px-3 py-2 text-sm text-[var(--ig-text)] placeholder:text-[var(--ig-text-muted)] focus:border-[var(--ig-link)] focus:outline-none focus:ring-1 focus:ring-[var(--ig-link)]"
                  />
                  <label htmlFor={commentFieldId} className="mb-1.5 block text-xs font-semibold text-[var(--ig-text-secondary)]">
                    Comment
                  </label>
                  <textarea
                    id={commentFieldId}
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    rows={4}
                    placeholder="Write a comment…"
                    className="w-full resize-y rounded-lg border border-[var(--ig-border)] bg-[var(--ig-surface)] px-3 py-2 text-sm text-[var(--ig-text)] placeholder:text-[var(--ig-text-muted)] focus:border-[var(--ig-link)] focus:outline-none focus:ring-1 focus:ring-[var(--ig-link)]"
                  />
                  <div className="mt-2 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCommentOpen(false);
                        setNameDraft("");
                        setCommentDraft("");
                      }}
                      className="rounded-lg bg-[var(--ig-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-border)]/30"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!nameDraft.trim() || !commentDraft.trim()}
                      onClick={submitComment}
                      className="rounded-lg bg-[var(--ig-link)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

              {post.summary && (
                <p className="text-sm leading-relaxed text-[var(--ig-text-secondary)]">{post.summary}</p>
              )}
              <div className="mt-1 flex flex-wrap gap-2">
                {isExternal(post) ? (
                  <a
                    href={articleHref(post)}
                    target="_blank"
                    rel="noreferrer"
                    className="ig-tap-scale rounded-lg bg-[var(--ig-link)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Read article
                  </a>
                ) : (
                  <Link
                    href={articleHref(post)}
                    onClick={onLeaveForArticle}
                    className="ig-tap-scale rounded-lg bg-[var(--ig-link)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Read article
                  </Link>
                )}
              </div>
              <p className="text-xs leading-relaxed text-[var(--ig-text-muted)]">
                Full formatting, code blocks, and diagrams are on the article page.
              </p>

              <section
                className="mt-2 border-t border-[var(--ig-border)] pt-4"
                aria-label={`Comments, ${commentCount} total`}
              >
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--ig-text-muted)]">
                  Comments
                </h3>
                {comments.length === 0 ? (
                  <p className="mt-2 text-sm text-[var(--ig-text-secondary)]">No comments yet. Be the first.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {comments.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-xl border border-[var(--ig-border)] bg-[var(--ig-bg)] px-3 py-2.5"
                      >
                        <p className="text-sm font-semibold text-[var(--ig-text)]">{c.authorName}</p>
                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ig-text)]">{c.text}</p>
                        <p className="mt-1.5 text-[11px] text-[var(--ig-text-muted)]">{formatCommentTime(c.at)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
