"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { EntityInteractionPanel } from "@/components/interactions/EntityInteractionPanel";
import type { InteractionKind } from "@/lib/interactions/types";

export type DetailSheetInteraction = {
  kind: InteractionKind;
  id: string;
  shareUrl?: string;
};

type Props = {
  open: boolean;
  title: string;
  meta?: string;
  description?: string;
  bullets?: string[];
  primaryHref?: string;
  primaryLabel?: string;
  headerImageSrc?: string;
  headerImageAlt?: string;
  /** `brand` = employer-style mark (invert in dark). `media` = full-color badge art. */
  headerImageTone?: "brand" | "media";
  /** Like, comment, and optional share — same behavior as blog / repositories. */
  interaction?: DetailSheetInteraction | null;
  onClose: () => void;
};

export function DetailSheet({
  open,
  title,
  meta,
  description,
  bullets,
  primaryHref,
  primaryLabel,
  headerImageSrc,
  headerImageAlt,
  headerImageTone = "brand",
  interaction,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-sheet-title"
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 bg-[var(--ig-overlay)]" aria-label="Close" onClick={onClose} />
          <motion.article
            className="relative z-10 max-h-[min(88dvh,720px)] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-[var(--ig-surface)] p-5 shadow-2xl ring-1 ring-[var(--ig-border)] sm:rounded-2xl"
            initial={{ y: 36, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            {headerImageSrc && (
              <div className="ig-brand-logo-header mb-4 flex justify-center rounded-xl py-3 ring-1 ring-[var(--ig-border)]">
                <Image
                  src={headerImageSrc}
                  alt={headerImageAlt ?? ""}
                  width={440}
                  height={220}
                  sizes="(max-width: 640px) 85vw, 400px"
                  loading="lazy"
                  decoding="async"
                  className={`object-contain ${
                    headerImageTone === "media"
                      ? "h-auto max-h-48 w-auto max-w-[min(100%,220px)] sm:max-h-52"
                      : "ig-brand-logo h-9 w-auto max-w-[min(100%,220px)]"
                  }`}
                />
              </div>
            )}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="detail-sheet-title" className="text-lg font-semibold leading-snug">
                  {title}
                </h2>
                {meta && <p className="mt-1 text-sm text-[var(--ig-text-muted)]">{meta}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full bg-[var(--ig-bg)] px-3 py-1 text-xs font-semibold ring-1 ring-[var(--ig-border)]"
              >
                Close
              </button>
            </div>
            {description && (
              <p className="mt-4 text-sm leading-relaxed text-[var(--ig-text-secondary)]">{description}</p>
            )}
            {bullets && bullets.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--ig-text-secondary)]">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
            {interaction && (
              <div className="mt-6 border-t border-[var(--ig-border)] pt-4">
                <EntityInteractionPanel kind={interaction.kind} id={interaction.id} shareUrl={interaction.shareUrl} />
              </div>
            )}
            {primaryHref && primaryLabel && (
              <a
                href={primaryHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-lg bg-[var(--ig-link)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                {primaryLabel}
              </a>
            )}
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
