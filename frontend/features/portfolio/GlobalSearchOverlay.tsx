"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { GlobalSearchHit } from "@/lib/globalSearch";
import { GlobalSearchResults } from "./GlobalSearchResults";

type Props = {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  hits: GlobalSearchHit[];
  onPick: (hit: GlobalSearchHit) => void;
};

export function GlobalSearchOverlay({ open, onClose, query, onQueryChange, hits, onPick }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handlePick = (hit: GlobalSearchHit) => {
    onPick(hit);
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex justify-center px-3 pt-[max(3.5rem,env(safe-area-inset-top)+2.5rem)] lg:pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
            aria-label="Close search"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
            className="relative z-[1] h-max w-full max-w-[20rem] overflow-hidden rounded-2xl border border-[var(--ig-border)] bg-[var(--ig-surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-0.5 border-b border-[var(--ig-border)] px-2">
              <span className="shrink-0 pl-0.5 text-[var(--ig-text-muted)]" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search…"
                className="min-w-0 flex-1 bg-transparent py-2.5 pl-1 pr-2 text-sm text-[var(--ig-text)] outline-none placeholder:text-[var(--ig-text-muted)]"
                aria-label="Search site"
              />
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg px-2 py-2 text-xs font-semibold text-[var(--ig-link)] hover:opacity-80"
              >
                Close
              </button>
            </div>
            <div className="max-h-[min(42vh,16rem)] overflow-y-auto px-1">
              {query.trim() ? (
                <GlobalSearchResults query={query} hits={hits} onPick={handlePick} />
              ) : (
                <p className="px-2 py-3 text-xs leading-relaxed text-[var(--ig-text-secondary)]">
                  Repos, projects, blogs, stack, profile, and contact — type to filter.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
