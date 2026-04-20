"use client";

import { useCallback, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { addComment, hydrateEntity, resyncEntity, toggleLike } from "./interactionsSlice";
import {
  compositeKey,
  INTERACTIONS_SYNC_EVENT,
  readCommentsFromStorage,
  readLikeFromStorage,
  tryParseCommentsStorageKey,
  tryParseLikeStorageKey,
} from "./storage";
import type { InteractionComment, InteractionKind } from "./types";
import type { AppDispatch, RootState } from "./store";

/** Stable fallback so `useSelector` does not see a new `[]` reference each run. */
const EMPTY_COMMENTS: InteractionComment[] = [];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function readPair(kind: InteractionKind, id: string) {
  return {
    kind,
    id,
    like: readLikeFromStorage(kind, id),
    comments: readCommentsFromStorage(kind, id),
  };
}

/**
 * Hydrates from `localStorage` once per entity, then keeps Redux in sync with
 * same-tab events and `storage` (other tabs).
 */
export function useInteractionTarget(kind: InteractionKind, id: string | null | undefined) {
  const dispatch = useAppDispatch();
  const key = id ? compositeKey(kind, id) : "";

  useLayoutEffect(() => {
    if (!id) return;
    dispatch(hydrateEntity(readPair(kind, id)));
  }, [dispatch, kind, id]);

  useEffect(() => {
    if (!id) return;
    const sync = () => dispatch(resyncEntity(readPair(kind, id)));
    window.addEventListener(INTERACTIONS_SYNC_EVENT, sync);
    const onStorage = (e: StorageEvent) => {
      const lk = tryParseLikeStorageKey(e.key);
      const ck = tryParseCommentsStorageKey(e.key);
      if (lk && lk.kind === kind && lk.id === id) sync();
      if (ck && ck.kind === kind && ck.id === id) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(INTERACTIONS_SYNC_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [dispatch, kind, id]);

  const liked = useAppSelector((s) => (key ? (s.interactions.likes[key] ?? false) : false));
  const comments = useAppSelector((s) => {
    if (!key) return EMPTY_COMMENTS;
    return s.interactions.comments[key] ?? EMPTY_COMMENTS;
  });

  const onToggleLike = useCallback(() => {
    if (!id) return;
    dispatch(toggleLike({ kind, id }));
  }, [dispatch, kind, id]);

  const onAddCommentText = useCallback(
    (text: string, authorName: string) => {
      if (!id || !text.trim()) return;
      dispatch(addComment({ kind, id, text, authorName: authorName.trim() || "Anonymous" }));
    },
    [dispatch, kind, id],
  );

  return {
    liked,
    comments,
    toggleLike: onToggleLike,
    addCommentText: onAddCommentText,
  };
}
