"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { isDataOrBlobImageSrc } from "@/lib/images/inlineSrc";
import { isDeletableCustomHighlightId } from "@/lib/highlights/customHighlight";
import { useHighlights } from "@/lib/highlights/HighlightsContext";
import type { Highlight } from "@/lib/highlights/types";

type Props = {
  highlight: Highlight | null;
  onClose: () => void;
};

export function HighlightDetailModal({ highlight, onClose }: Props) {
  const reduceMotion = useReducedMotion();
  const { isAdmin, authReady } = useAdminAuth();
  const { removeHighlight } = useHighlights();
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const canDelete =
    highlight !== null &&
    authReady &&
    isAdmin &&
    isDeletableCustomHighlightId(highlight.id);

  useEffect(() => {
    if (!highlight) {
      setConfirmDeleteOpen(false);
      setDeleteError(null);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmDeleteOpen) {
        setConfirmDeleteOpen(false);
        setDeleteError(null);
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [highlight, onClose, confirmDeleteOpen]);

  const runDelete = async () => {
    if (!highlight || !canDelete || deleting) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await removeHighlight(highlight.id);
      setConfirmDeleteOpen(false);
      onClose();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Could not remove highlight");
    } finally {
      setDeleting(false);
    }
  };

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
                className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--ig-elevated)] text-lg ring-1 ring-[var(--ig-border)] sm:h-11 sm:w-11 sm:text-xl"
              >
                {highlight.imageSrc ? (
                  isDataOrBlobImageSrc(highlight.imageSrc) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={highlight.imageSrc}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <span className="relative block h-full w-full">
                      <Image
                        src={highlight.imageSrc}
                        alt=""
                        fill
                        sizes="44px"
                        loading="lazy"
                        className="object-cover object-center"
                      />
                    </span>
                  )
                ) : (
                  highlight.emoji
                )}
              </motion.div>
              <div className="min-w-0 flex-1">
                <h2 id="highlight-modal-title" className="truncate text-sm font-semibold leading-tight">
                  {highlight.title ?? highlight.label}
                </h2>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--ig-text-muted)]">
                  Highlight
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {canDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(null);
                      setConfirmDeleteOpen(true);
                    }}
                    disabled={deleting}
                    className="rounded-full bg-red-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-[var(--ig-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-elevated)]"
                >
                  Close
                </button>
              </div>
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
                  {isDataOrBlobImageSrc(highlight.imageSrc) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={highlight.imageSrc}
                      alt={highlight.imageAlt ?? ""}
                      className="max-h-[min(52vh,420px)] w-full bg-[var(--ig-elevated)] object-contain object-center"
                      decoding="async"
                    />
                  ) : (
                    <Image
                      src={highlight.imageSrc}
                      alt={highlight.imageAlt ?? ""}
                      width={960}
                      height={540}
                      sizes="(max-width: 640px) 100vw, 36rem"
                      loading="lazy"
                      decoding="async"
                      className="max-h-[min(52vh,420px)] w-full bg-[var(--ig-elevated)] object-contain object-center"
                    />
                  )}
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

          <AnimatePresence>
            {confirmDeleteOpen && highlight && (
              <motion.div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="highlight-delete-confirm-title"
                aria-describedby="highlight-delete-confirm-desc"
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.12 : 0.18 }}
              >
                <button
                  type="button"
                  className="absolute inset-0 bg-black/55"
                  aria-label="Cancel delete"
                  onClick={() => {
                    setConfirmDeleteOpen(false);
                    setDeleteError(null);
                  }}
                />
                <motion.div
                  className="relative z-10 w-full max-w-[320px] rounded-2xl bg-[var(--ig-surface)] p-5 shadow-2xl ring-1 ring-[var(--ig-border)]"
                  initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 6 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.15 }
                      : { type: "spring", stiffness: 520, damping: 34, mass: 0.75 }
                  }
                >
                  <h3
                    id="highlight-delete-confirm-title"
                    className="text-center text-base font-semibold text-[var(--ig-text)]"
                  >
                    Remove highlight?
                  </h3>
                  <p
                    id="highlight-delete-confirm-desc"
                    className="mt-2 text-center text-sm leading-relaxed text-[var(--ig-text-secondary)]"
                  >
                    <span className="font-medium text-[var(--ig-text)]">{highlight.title ?? highlight.label}</span>{" "}
                    will be removed. This cannot be undone.
                  </p>
                  {deleteError ? (
                    <p
                      role="alert"
                      className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs font-medium text-red-600 dark:text-red-400"
                    >
                      {deleteError}
                    </p>
                  ) : null}
                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteOpen(false);
                        setDeleteError(null);
                      }}
                      disabled={deleting}
                      className="flex-1 rounded-xl bg-[var(--ig-elevated)] py-2.5 text-sm font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-border)]/25 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void runDelete()}
                      disabled={deleting}
                      className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting ? "Removing…" : "Remove"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
