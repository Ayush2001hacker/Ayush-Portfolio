"use client";

import { useCallback, useEffect, useState } from "react";

export type IgTheme = "light" | "dark";

const STORAGE_KEY = "ayush-portfolio-theme";

function applyTheme(theme: IgTheme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useIgTheme() {
  const [theme, setTheme] = useState<IgTheme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as IgTheme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: IgTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
