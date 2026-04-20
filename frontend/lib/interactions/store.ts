import { configureStore } from "@reduxjs/toolkit";
import { interactionsSlice } from "./interactionsSlice";

export const store = configureStore({
  reducer: {
    interactions: interactionsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
