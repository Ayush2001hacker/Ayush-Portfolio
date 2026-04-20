"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { AdminAuthProvider } from "@/lib/admin/AdminAuthContext";
import { HighlightsProvider } from "@/lib/highlights/HighlightsContext";
import { store } from "@/lib/interactions/store";
import { ResumeHrefProvider } from "./ResumeHrefContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AdminAuthProvider>
        <ResumeHrefProvider>
          <HighlightsProvider>{children}</HighlightsProvider>
        </ResumeHrefProvider>
      </AdminAuthProvider>
    </Provider>
  );
}
