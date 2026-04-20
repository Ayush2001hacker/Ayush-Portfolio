"use client";

import { useCallback } from "react";
import { loadInteractions } from "@/lib/interactions/interactionsSlice";
import { useAppDispatch, useInteractionTarget } from "@/lib/interactions/hooks";
import { formatCommentTime } from "@/lib/interactions/formatCommentTime";
import type { InteractionComment } from "@/lib/interactions/types";

export type BlogComment = InteractionComment;

export { formatCommentTime };

/** @deprecated No longer used — interactions are API-only. */
export const BLOG_SYNC_EVENT = "ayush-interactions-sync";

export function dispatchBlogSync() {
  /* no-op: kept for any stale imports */
}

/** Blog posts use the shared interactions store (`blog` kind) + API. */
export function useBlogPostInteractions(postId: string | null | undefined) {
  const dispatch = useAppDispatch();
  const id = postId ?? null;
  const { liked, toggleLike, comments, addCommentText } = useInteractionTarget("blog", id);

  const reload = useCallback(() => {
    if (!id) return;
    dispatch(loadInteractions({ kind: "blog", id }));
  }, [dispatch, id]);

  return { liked, toggleLike, comments, addCommentText, reload };
}
