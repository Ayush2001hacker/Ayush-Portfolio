"use client";

import { motion } from "framer-motion";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { navHomeBrandTitle } from "@/lib/site-content";
import { AnimatedSearchHint } from "./AnimatedSearchHint";
import { IconSearch } from "./icons";
import { ThemeToggleButton } from "./ThemeToggleButton";

type Props = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSearch: () => void;
};

export function DesktopTopBar({
  theme,
  onToggleTheme,
  onOpenSearch,
}: Props) {
  const { isAdmin, authReady, logout } = useAdminAuth();
  const showAdmin = authReady && isAdmin;

  return (
    <header className="sticky top-0 z-50 h-[54px] border-b border-[var(--ig-border)] bg-[var(--ig-surface)]">
      <div className="mx-auto flex h-full w-full max-w-full items-center justify-between gap-3 px-5 lg:px-8">
        <motion.span
          layout
          className="shrink-0 text-xl font-semibold tracking-tight text-transparent"
          style={{
            backgroundImage: "linear-gradient(45deg,#f58529,#dd2a7b,#8134af,#515bd4)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {navHomeBrandTitle}
        </motion.span>

        {showAdmin ? (
          <div className="flex min-w-0 flex-1 justify-center px-2">
            <span className="truncate text-sm font-semibold text-[var(--ig-text)]" role="status">
              Welcome Admin
            </span>
          </div>
        ) : (
          <div className="min-w-0 flex-1" aria-hidden />
        )}

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          {showAdmin ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-[var(--ig-border)] bg-[var(--ig-elevated)] px-3 py-1.5 text-sm font-semibold text-[var(--ig-text)] hover:bg-[var(--ig-border)]/30"
            >
              Log out
            </button>
          ) : null}
          <button
            type="button"
            onClick={onOpenSearch}
            className="ig-tap-scale flex items-center gap-1.5 rounded-full border border-transparent py-0.5 pl-2.5 pr-0.5 text-[var(--ig-text)] hover:border-[var(--ig-border)] hover:bg-[var(--ig-elevated)]"
            aria-label="Open search"
          >
            <AnimatedSearchHint className="text-[11px] sm:text-xs" />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <IconSearch />
            </span>
          </button>
          <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
