"use client";

import { useCallback, useLayoutEffect } from "react";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { readAdminToken } from "@/lib/admin/token";
import { addCommentRemote, deleteCommentRemote, loadInteractions, toggleLikeRemote } from "./interactionsSlice";
import { compositeKey } from "./key";
import type { InteractionComment, InteractionKind } from "./types";
import type { AppDispatch, RootState } from "./store";

/** Stable fallback so `useSelector` does not see a new `[]` reference each run. */
const EMPTY_COMMENTS: InteractionComment[] = [];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Loads likes + comments from the portfolio API (`NEXT_PUBLIC_API_URL`).
 */
export function useInteractionTarget(kind: InteractionKind, id: string | null | undefined) {
  const dispatch = useAppDispatch();
  const key = id ? compositeKey(kind, id) : "";

  useLayoutEffect(() => {
    if (!id) return;
    dispatch(loadInteractions({ kind, id }));
  }, [dispatch, kind, id]);

  const liked = useAppSelector((s) => (key ? (s.interactions.likes[key] ?? false) : false));
  const likeCount = useAppSelector((s) => (key ? (s.interactions.likeCounts[key] ?? 0) : 0));
  const comments = useAppSelector((s) => {
    if (!key) return EMPTY_COMMENTS;
    return s.interactions.comments[key] ?? EMPTY_COMMENTS;
  });

  const onToggleLike = useCallback(() => {
    if (!id) return;
    void dispatch(toggleLikeRemote({ kind, id }))
      .unwrap()
      .catch((err) => {
        console.error(
          "[interactions] Like request failed. Is the API running? Check CORS (FRONTEND_ORIGIN on the server) matches this page’s origin.",
          err,
        );
      });
  }, [dispatch, kind, id]);

  const onAddCommentText = useCallback(
    (text: string, authorName: string) => {
      if (!id || !text.trim()) return;
      void dispatch(
        addCommentRemote({
          kind,
          id,
          text,
          authorName: authorName.trim() || "Anonymous",
        }),
      )
        .unwrap()
        .catch((err) => {
          console.error(
            "[interactions] Comment request failed. Is the API running and MongoDB connected?",
            err,
          );
        });
    },
    [dispatch, kind, id],
  );

  const onRemoveComment = useCallback(
    (commentId: string) => {
      if (!id) {
        return Promise.reject(new Error("No entity id"));
      }
      const token = readAdminToken();
      if (!token) {
        return Promise.reject(new Error("Admin token missing"));
      }
      return dispatch(deleteCommentRemote({ kind, id, commentId, token })).unwrap();
    },
    [dispatch, kind, id],
  );

  return {
    liked,
    likeCount,
    comments,
    toggleLike: onToggleLike,
    addCommentText: onAddCommentText,
    removeComment: onRemoveComment,
  };
}
