"use client";

import { IconTrash } from "@/features/portfolio/icons";
import { formatCommentTime } from "@/lib/interactions/formatCommentTime";
import type { InteractionComment } from "@/lib/interactions/types";

export type CommentCardProps = {
  comment: InteractionComment;
  showDelete?: boolean;
  deletePending?: boolean;
  onDelete?: (commentId: string) => void;
};

export function CommentCard({ comment, showDelete, deletePending, onDelete }: CommentCardProps) {
  return (
    <li className="rounded-xl border border-[var(--ig-border)] bg-[var(--ig-bg)] px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--ig-text)]">{comment.authorName}</p>
        {showDelete && onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            disabled={deletePending}
            aria-label="Delete comment"
            title="Delete comment"
            className="ig-tap-scale shrink-0 rounded-md p-1.5 text-red-600 ring-1 ring-red-600/35 hover:bg-red-600/10 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:ring-red-400/35"
          >
            <IconTrash />
          </button>
        ) : null}
      </div>
      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ig-text)]">{comment.text}</p>
      <p className="mt-1.5 text-[11px] text-[var(--ig-text-muted)]">{formatCommentTime(comment.at)}</p>
    </li>
  );
}
