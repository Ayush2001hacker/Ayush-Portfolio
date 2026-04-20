"use client";

import { motion } from "framer-motion";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { IconMoon, IconSun } from "./icons";

type Props = {
  title?: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function TopBar({ title, theme, onToggleTheme }: Props) {
  const { isAdmin, authReady, logout } = useAdminAuth();
  const showAdmin = authReady && isAdmin;

  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--ig-border)] bg-[var(--ig-bg)]/85 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-11 max-w-lg items-center gap-2 px-3 sm:h-12">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <motion.span
            layout
            className="min-w-0 shrink truncate text-lg font-semibold tracking-tight text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(45deg,#f58529,#dd2a7b,#8134af,#515bd4)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {title ?? "Portfolio"}
          </motion.span>
          {showAdmin ? (
            <>
              <span
                className="min-w-0 max-w-[7.5rem] truncate text-[10px] font-semibold text-[var(--ig-text)] sm:max-w-[10rem] sm:text-xs md:text-sm"
                role="status"
              >
                Welcome Admin
              </span>
              <button
                type="button"
                onClick={logout}
                className="shrink-0 rounded-md border border-[var(--ig-border)] bg-[var(--ig-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--ig-text)] sm:px-2.5 sm:text-xs"
              >
                Log out
              </button>
            </>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="ig-tap-scale flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--ig-text)] hover:bg-[var(--ig-elevated)]"
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
