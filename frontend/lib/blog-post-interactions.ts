"use client";

import { useCallback } from "react";
import { resyncEntity } from "@/lib/interactions/interactionsSlice";
import { useAppDispatch, useInteractionTarget } from "@/lib/interactions/hooks";
import {
  readCommentsFromStorage,
  readLikeFromStorage,
} from "@/lib/interactions/storage";
import type { InteractionComment } from "@/lib/interactions/types";

/** @deprecated Use `INTERACTIONS_SYNC_EVENT` from `@/lib/interactions/storage`. */
export { INTERACTIONS_SYNC_EVENT as BLOG_SYNC_EVENT } from "@/lib/interactions/storage";

export type BlogComment = InteractionComment;

export {
  dispatchInteractionsSync as dispatchBlogSync,
  formatCommentTime,
  newCommentId,
  readCommentsFromStorage as readStoredComments,
  readLikeFromStorage as readLike,
} from "@/lib/interactions/storage";

export { writeCommentsToStorage as writeStoredComments, writeLikeToStorage as writeLike } from "@/lib/interactions/storage";

function readBlogPair(id: string) {
  return {
    kind: "blog" as const,
    id,
    like: readLikeFromStorage("blog", id),
    comments: readCommentsFromStorage("blog", id),
  };
}

/** Blog posts use the shared interactions store (`blog` kind). */
export function useBlogPostInteractions(postId: string | null | undefined) {
  const dispatch = useAppDispatch();
  const id = postId ?? null;
  const { liked, toggleLike, comments, addCommentText } = useInteractionTarget("blog", id);

  const reload = useCallback(() => {
    if (!id) return;
    dispatch(resyncEntity(readBlogPair(id)));
  }, [dispatch, id]);

  return { liked, toggleLike, comments, addCommentText, reload };
}
