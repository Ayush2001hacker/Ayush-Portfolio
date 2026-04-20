"use client";

import { useCallback, useId, useState } from "react";
import { IconCompose, IconHeart, IconShare } from "@/components/portfolio/icons";
import { useInteractionTarget } from "@/lib/interactions/hooks";
import { formatCommentTime } from "@/lib/interactions/storage";
import type { InteractionKind } from "@/lib/interactions/types";

export type EntityInteractionPanelProps = {
  kind: InteractionKind;
  id: string;
  /** When set, shows Share and copies this URL to the clipboard. */
  shareUrl?: string;
};

export function EntityInteractionPanel({ kind, id, shareUrl }: EntityInteractionPanelProps) {
  const { liked, comments, toggleLike, addCommentText } = useInteractionTarget(kind, id);
  const [shareLabel, setShareLabel] = useState("Share");
  const [commentOpen, setCommentOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const nameFieldId = useId();
  const commentFieldId = useId();
  const composerRegionId = useId();
  const commentCount = comments.length;

  const copyShare = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareLabel("Copied!");
      window.setTimeout(() => setShareLabel("Share"), 2000);
    } catch {
      setShareLabel("Copy failed");
      window.setTimeout(() => setShareLabel("Share"), 2000);
    }
  }, [shareUrl]);

  const submitComment = useCallback(() => {
    if (!nameDraft.trim() || !commentDraft.trim()) return;
    addCommentText(commentDraft, nameDraft);
    setNameDraft("");
    setCommentDraft("");
    setCommentOpen(false);
  }, [commentDraft, nameDraft, addCommentText]);

  return (
    <div className="space-y-4">
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
        {shareUrl ? (
          <button
            type="button"
            onClick={copyShare}
            className="ig-tap-scale flex items-center gap-1.5 text-sm font-semibold text-[var(--ig-text)] hover:opacity-80"
            aria-label="Copy link"
          >
            <IconShare />
            {shareLabel}
          </button>
        ) : null}
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

      <section aria-label={`Comments, ${commentCount} total`}>
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
  );
}
