import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addComment, toggleLike } from "./interactionsSlice";
import { compositeKey, writeCommentsToStorage, writeLikeToStorage } from "./storage";
import type { InteractionBranchState } from "./interactionsSlice";

type WithInteractions = { interactions: InteractionBranchState };

export const interactionListenerMiddleware = createListenerMiddleware();

interactionListenerMiddleware.startListening({
  matcher: isAnyOf(toggleLike, addComment),
  effect: (action, api) => {
    const st = (api.getState() as WithInteractions).interactions;
    if (toggleLike.match(action) || addComment.match(action)) {
      const { kind, id } = action.payload;
      const key = compositeKey(kind, id);
      writeLikeToStorage(kind, id, st.likes[key] ?? false);
      writeCommentsToStorage(kind, id, st.comments[key] ?? []);
    }
  },
});
