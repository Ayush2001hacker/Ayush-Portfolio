"use client";

import { motion } from "framer-motion";
import { IconMoon, IconSun } from "./icons";

type Props = {
  title?: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function TopBar({ title, theme, onToggleTheme }: Props) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--ig-border)] bg-[var(--ig-bg)]/85 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-11 max-w-lg items-center justify-between px-3 sm:h-12">
        <div className="flex min-w-0 items-center gap-2">
          <motion.span
            layout
            className="truncate text-lg font-semibold tracking-tight text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(45deg,#f58529,#dd2a7b,#8134af,#515bd4)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {title ?? "Portfolio"}
          </motion.span>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="ig-tap-scale flex h-9 w-9 items-center justify-center rounded-full text-[var(--ig-text)] hover:bg-[var(--ig-elevated)]"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </button>
      </div>
    </header>
  );
}
