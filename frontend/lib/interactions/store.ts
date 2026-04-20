import { configureStore } from "@reduxjs/toolkit";
import { interactionListenerMiddleware } from "./interactionListeners";
import { interactionsSlice } from "./interactionsSlice";

export const store = configureStore({
  reducer: {
    interactions: interactionsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(interactionListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
