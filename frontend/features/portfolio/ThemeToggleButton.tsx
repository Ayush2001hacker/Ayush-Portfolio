"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconMoon, IconSun } from "./icons";

type Props = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  className?: string;
};

const btnClass =
  "ig-tap-scale flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--ig-text)] hover:bg-[var(--ig-elevated)]";

export function ThemeToggleButton({ theme, onToggleTheme, className }: Props) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className={className ?? btnClass}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="relative flex h-[22px] w-[22px] items-center justify-center overflow-visible">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -75, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 75, scale: 0.5 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center will-change-transform"
          >
            {isDark ? <IconSun /> : <IconMoon />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
