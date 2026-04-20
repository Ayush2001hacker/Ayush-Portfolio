"use client";

import { motion } from "framer-motion";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { IconMoon, IconSun } from "./icons";

type Props = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  resumeHref: string;
  onContact: () => void;
};

export function DesktopTopBar({
  theme,
  onToggleTheme,
  query,
  onQueryChange,
  resumeHref,
  onContact,
}: Props) {
  const { isAdmin, authReady, logout } = useAdminAuth();
  const showAdmin = authReady && isAdmin;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ig-border)] bg-[var(--ig-surface)]">
      <div className="mx-auto grid h-[54px] w-full max-w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-5 lg:px-8">
        <motion.span
          layout
          className="justify-self-start text-xl font-semibold tracking-tight text-transparent"
          style={{
            backgroundImage: "linear-gradient(45deg,#f58529,#dd2a7b,#8134af,#515bd4)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          Ayush
        </motion.span>

        <div className="flex min-w-0 max-w-full items-center justify-center gap-3 justify-self-center">
          {showAdmin ? (
            <span className="shrink-0 text-sm font-semibold text-[var(--ig-text)]" role="status">
              Welcome Admin
            </span>
          ) : null}
          <div className="relative w-[min(215px,calc(100vw-14rem))] max-w-full min-w-[8rem]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ig-text-muted)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search"
              className="w-full rounded-lg border border-transparent bg-[#efefef] py-2 pl-9 pr-3 text-sm text-[var(--ig-text)] outline-none ring-0 placeholder:text-[var(--ig-text-muted)] focus:border-[var(--ig-border)] dark:bg-[#262626]"
              aria-label="Search projects"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 justify-self-end">
          {showAdmin ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-[var(--ig-border)] bg-[var(--ig-elevated)] px-3 py-1.5 text-sm font-semibold text-[var(--ig-text)] hover:bg-[var(--ig-border)]/30"
            >
              Log out
            </button>
          ) : null}
          <a
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[var(--ig-link)] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Resume
          </a>
          <button
            type="button"
            onClick={onContact}
            className="text-sm font-semibold text-[var(--ig-link)] hover:opacity-80"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="ig-tap-scale flex h-9 w-9 items-center justify-center rounded-full text-[var(--ig-text)] hover:bg-[var(--ig-elevated)]"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </div>
    </header>
  );
}
