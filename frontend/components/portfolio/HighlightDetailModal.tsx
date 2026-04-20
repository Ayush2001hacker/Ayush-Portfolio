"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { Highlight } from "@/lib/site-content";

type Props = {
  highlight: Highlight | null;
  onClose: () => void;
};

export function HighlightDetailModal({ highlight, onClose }: Props) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!highlight) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [highlight, onClose]);

  const spring = reduceMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.85 };

  return (
    <AnimatePresence>
      {highlight && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="highlight-modal-title"
          className="fixed inset-0 z-[60] flex items-stretch justify-center sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.22 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/88 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.article
            className="relative z-10 flex max-h-[100dvh] w-full max-w-[min(100vw,420px)] flex-col overflow-hidden bg-[var(--ig-surface)] shadow-2xl sm:max-h-[min(92dvh,820px)] sm:rounded-2xl sm:ring-1 sm:ring-[var(--ig-border)]"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.82, borderRadius: 28 }
            }
            animate={{ opacity: 1, scale: 1, borderRadius: 16 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, borderRadius: 28 }
            }
            transition={spring}
            style={{ transformOrigin: "50% 35%" }}
          >
            {/* Story-style progress (decorative) */}
            <div className="flex gap-0.5 px-2 pt-2.5 sm:pt-3">
              <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-[var(--ig-border)]">
                <motion.div
                  className="h-full w-full origin-left rounded-full bg-[var(--ig-link)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: reduceMotion ? 0.2 : 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 pb-2 pt-3 sm:px-4">
              <motion.div
                layoutId={`highlight-orb-${highlight.id}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ig-elevated)] text-lg ring-1 ring-[var(--ig-border)] sm:h-11 sm:w-11 sm:text-xl"
              >
                {highlight.emoji}
              </motion.div>
              <div className="min-w-0 flex-1">
                <h2 id="highlight-modal-title" className="truncate text-sm font-semibold leading-tight">
                  {highlight.title ?? highlight.label}
                </h2>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--ig-text-muted)]">
                  Highlight
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full bg-[var(--ig-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-elevated)]"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 sm:px-5">
              {highlight.summary && (
                <p className="text-sm leading-relaxed text-[var(--ig-text-secondary)]">{highlight.summary}</p>
              )}
              {highlight.body && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--ig-text-secondary)]">{highlight.body}</p>
              )}
              {highlight.imageSrc && (
                <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-[var(--ig-border)]">
                  <img
                    src={highlight.imageSrc}
                    alt={highlight.imageAlt ?? ""}
                    className="max-h-[min(52vh,420px)] w-full bg-[var(--ig-elevated)] object-contain object-center"
                    decoding="async"
                  />
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                {highlight.href && (
                  <a
                    href={highlight.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg bg-[var(--ig-link)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    {highlight.ctaLabel ?? "Open link"}
                  </a>
                )}
                {highlight.attachmentHref && (
                  <a
                    href={highlight.attachmentHref}
                    download
                    className="inline-flex rounded-lg bg-[var(--ig-elevated)] px-4 py-2.5 text-sm font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-border)]/30"
                  >
                    {highlight.attachmentLabel ?? "Download"}
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
