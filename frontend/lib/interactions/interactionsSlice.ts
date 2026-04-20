import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { compositeKey, newCommentId } from "./storage";
import type { InteractionComment, InteractionKind } from "./types";

export type InteractionBranchState = {
  likes: Record<string, boolean>;
  comments: Record<string, InteractionComment[]>;
  /** First client read from `localStorage` applied once per entity key. */
  hydrated: Record<string, true>;
};

const initialState: InteractionBranchState = {
  likes: {},
  comments: {},
  hydrated: {},
};

type EntityPayload = {
  kind: InteractionKind;
  id: string;
  like: boolean;
  comments: InteractionComment[];
};

export const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {
    hydrateEntity(state, { payload }: PayloadAction<EntityPayload>) {
      const key = compositeKey(payload.kind, payload.id);
      if (state.hydrated[key]) return;
      state.hydrated[key] = true;
      state.likes[key] = payload.like;
      state.comments[key] = payload.comments;
    },
    resyncEntity(state, { payload }: PayloadAction<EntityPayload>) {
      const key = compositeKey(payload.kind, payload.id);
      state.hydrated[key] = true;
      state.likes[key] = payload.like;
      state.comments[key] = payload.comments;
    },
    toggleLike(state, { payload }: PayloadAction<{ kind: InteractionKind; id: string }>) {
      const key = compositeKey(payload.kind, payload.id);
      const prev = state.likes[key] ?? false;
      state.likes[key] = !prev;
      state.hydrated[key] = true;
    },
    addComment(
      state,
      { payload }: PayloadAction<{ kind: InteractionKind; id: string; text: string; authorName: string }>,
    ) {
      const key = compositeKey(payload.kind, payload.id);
      const text = payload.text.trim();
      const authorName = payload.authorName.trim() || "Anonymous";
      if (!text) return;
      if (!state.comments[key]) state.comments[key] = [];
      state.comments[key].push({
        id: newCommentId(),
        text,
        at: Date.now(),
        authorName,
      });
      state.hydrated[key] = true;
    },
  },
});

export const { hydrateEntity, resyncEntity, toggleLike, addComment } = interactionsSlice.actions;
