"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { deleteHighlightAssetByUrl, fetchHighlightCustom, putHighlightCustom } from "./api";
import { isDeletableCustomHighlightId } from "./customHighlight";
import { defaultHighlights } from "./seedHighlights";
import type { Highlight } from "./types";

type HighlightsContextValue = {
  highlights: Highlight[];
  addHighlight: (item: Highlight) => Promise<void>;
  removeHighlight: (id: string) => Promise<void>;
};

const HighlightsContext = createContext<HighlightsContextValue | null>(null);

export function HighlightsProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState<Highlight[]>([]);

  useEffect(() => {
    void (async () => {
      const c = await fetchHighlightCustom();
      setCustom(c);
    })();
  }, []);

  const highlights = useMemo(() => [...defaultHighlights, ...custom], [custom]);

  const addHighlight = useCallback(async (item: Highlight) => {
    const next = [...custom, item];
    await putHighlightCustom(next);
    setCustom(next);
  }, [custom]);

  const removeHighlight = useCallback(
    async (id: string) => {
      if (!isDeletableCustomHighlightId(id)) return;
      const target = custom.find((h) => h.id === id);
      const next = custom.filter((h) => h.id !== id);
      await putHighlightCustom(next);
      if (target?.imageSrc) {
        await deleteHighlightAssetByUrl(target.imageSrc);
      }
      setCustom(next);
    },
    [custom],
  );

  const value = useMemo(
    () => ({ highlights, addHighlight, removeHighlight }),
    [highlights, addHighlight, removeHighlight],
  );

  return <HighlightsContext.Provider value={value}>{children}</HighlightsContext.Provider>;
}

export function useHighlights(): HighlightsContextValue {
  const ctx = useContext(HighlightsContext);
  if (!ctx) {
    throw new Error("useHighlights must be used within HighlightsProvider");
  }
  return ctx;
}
