import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchInteractions, postComment, toggleLikeRequest } from "./api";
import { getClientId } from "./clientId";
import { compositeKey } from "./key";
import type { InteractionComment, InteractionKind } from "./types";

export type InteractionBranchState = {
  likes: Record<string, boolean>;
  likeCounts: Record<string, number>;
  comments: Record<string, InteractionComment[]>;
  hydrated: Record<string, true>;
};

const initialState: InteractionBranchState = {
  likes: {},
  likeCounts: {},
  comments: {},
  hydrated: {},
};

export const loadInteractions = createAsyncThunk(
  "interactions/load",
  async (args: { kind: InteractionKind; id: string }) => {
    try {
      const clientId = typeof window !== "undefined" ? getClientId() : "";
      return await fetchInteractions(args.kind, args.id, clientId);
    } catch (err) {
      console.warn("[interactions] load failed", err);
      return { comments: [] as InteractionComment[], liked: false, likeCount: 0 };
    }
  },
);

export const toggleLikeRemote = createAsyncThunk(
  "interactions/toggleLike",
  async (args: { kind: InteractionKind; id: string }, { dispatch }) => {
    const clientId = getClientId();
    if (!clientId) {
      throw new Error("Client id unavailable for like toggle");
    }
    try {
      return await toggleLikeRequest(args.kind, args.id, clientId);
    } catch (e) {
      await dispatch(loadInteractions(args));
      throw e;
    }
  },
);

export const addCommentRemote = createAsyncThunk(
  "interactions/addComment",
  async (
    args: { kind: InteractionKind; id: string; text: string; authorName: string },
    { dispatch },
  ) => {
    try {
      return await postComment(args.kind, args.id, args.authorName, args.text);
    } catch (e) {
      await dispatch(loadInteractions({ kind: args.kind, id: args.id }));
      throw e;
    }
  },
);

export const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadInteractions.fulfilled, (state, action) => {
        const { kind, id } = action.meta.arg;
        const key = compositeKey(kind, id);
        state.hydrated[key] = true;
        state.likes[key] = action.payload.liked;
        state.likeCounts[key] = action.payload.likeCount;
        state.comments[key] = action.payload.comments;
      })
      .addCase(toggleLikeRemote.fulfilled, (state, action) => {
        const { kind, id } = action.meta.arg;
        const key = compositeKey(kind, id);
        state.likes[key] = action.payload.liked;
        state.likeCounts[key] = action.payload.likeCount;
      })
      .addCase(addCommentRemote.fulfilled, (state, action) => {
        const { kind, id } = action.meta.arg;
        const key = compositeKey(kind, id);
        if (!state.comments[key]) state.comments[key] = [];
        state.comments[key].push(action.payload.comment);
        state.hydrated[key] = true;
      });
  },
});
