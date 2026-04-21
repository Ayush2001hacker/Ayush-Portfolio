"use client";

import { useCallback, useId, useState } from "react";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import {
  formatCommentTime,
  useBlogPostInteractions,
} from "@/lib/blog-post-interactions";
import type { BlogPost } from "@/lib/site-content";
import { IconCompose, IconHeart, IconShare } from "@/features/portfolio/icons";

type Props = {
  post: BlogPost;
  markdown: string;
};

function absoluteArticleUrl(post: BlogPost) {
  if (!post.slug) return typeof window !== "undefined" ? window.location.href : "";
  if (typeof window === "undefined") return `/blog/${post.slug}`;
  return new URL(`/blog/${post.slug}`, window.location.origin).href;
}

export function BlogArticleBody({ post, markdown }: Props) {
  const { liked, toggleLike, comments, addCommentText } = useBlogPostInteractions(post.id);
  const [shareLabel, setShareLabel] = useState("Share");
  const [commentOpen, setCommentOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const nameFieldId = useId();
  const commentFieldId = useId();
  const composerRegionId = useId();
  const commentCount = comments.length;

  const copyShareLink = useCallback(async () => {
    const url = absoluteArticleUrl(post);
    if (!url) return;
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

  return (
    <>
      {post.feedThumbSrc && (
        <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-[var(--ig-bg)] ring-1 ring-[var(--ig-border)]">
          <img
            src={post.feedThumbSrc}
            alt=""
            className="h-full w-full object-cover object-center"
            decoding="async"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight text-[var(--ig-text)] sm:text-3xl">
        {post.title}
      </h1>
      {post.date && (
        <p className="mt-1 text-sm text-[var(--ig-text-muted)]">{post.date}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-[var(--ig-border)] pb-3">
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
          className="mt-4 rounded-xl bg-[var(--ig-bg)] p-3 ring-1 ring-[var(--ig-border)]"
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
        <p className="mt-6 text-sm leading-relaxed text-[var(--ig-text-secondary)]">{post.summary}</p>
      )}

      <div className={post.summary ? "mt-6" : "mt-8"}>
        <BlogMarkdown source={markdown} />
      </div>

      <section
        className="mt-10 border-t border-[var(--ig-border)] pt-6"
        aria-label={`Comments, ${commentCount} total`}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--ig-text-muted)]">
          Comments
        </h2>
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
    </>
  );
}
