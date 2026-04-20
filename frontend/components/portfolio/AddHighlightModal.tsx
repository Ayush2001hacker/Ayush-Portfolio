"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useState } from "react";
import { uploadHighlightAsset } from "@/lib/highlights/api";
import type { Highlight } from "@/lib/highlights/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: Highlight) => Promise<void>;
};

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function newHighlightId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `custom-${crypto.randomUUID()}`;
  }
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AddHighlightModal({ open, onClose, onSave }: Props) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setError(null);
    setPending(false);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

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

  const onImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, or WebP).");
      setImageFile(null);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large — max 4 MB.");
      setImageFile(null);
      return;
    }
    setImageFile(file);
    setError(null);
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const t = title.trim();
      if (!t) {
        setError("Enter a title.");
        return;
      }
      const desc = description.trim();
      if (!desc) {
        setError("Enter a description.");
        return;
      }
      setError(null);
      setPending(true);
      try {
        let imageSrc: string | undefined;
        if (imageFile) {
          imageSrc = await uploadHighlightAsset(imageFile);
        }
        const label = t.length > 14 ? `${t.slice(0, 13)}…` : t;
        const item: Highlight = {
          id: newHighlightId(),
          label,
          emoji: "✨",
          title: t,
          summary: desc,
          imageSrc,
          imageAlt: t,
        };
        await onSave(item);
        reset();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save highlight");
      } finally {
        setPending(false);
      }
    },
    [description, imageFile, onClose, onSave, reset, title],
  );

  const spring = reduceMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.85 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[65] flex items-stretch justify-center sm:items-center sm:p-5"
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
          <motion.div
            className="relative z-10 flex max-h-[100dvh] w-full max-w-[min(100vw,420px)] flex-col overflow-hidden bg-[var(--ig-surface)] shadow-2xl sm:max-h-[min(92dvh,720px)] sm:rounded-2xl sm:ring-1 sm:ring-[var(--ig-border)]"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            transition={spring}
          >
            <div className="flex items-center justify-between border-b border-[var(--ig-border)] px-4 py-3">
              <h2 id={titleId} className="text-base font-bold text-[var(--ig-text)]">
                New highlight
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[var(--ig-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-elevated)]"
              >
                Cancel
              </button>
            </div>

            <form className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4" onSubmit={onSubmit}>
              <div>
                <label htmlFor="hl-title" className="mb-1 block text-xs font-semibold text-[var(--ig-text-secondary)]">
                  Title
                </label>
                <input
                  id="hl-title"
                  value={title}
                  onChange={(ev) => setTitle(ev.target.value)}
                  placeholder="Enter title"
                  disabled={pending}
                  className="w-full rounded-lg border border-[var(--ig-border)] bg-[var(--ig-bg)] px-3 py-2.5 text-sm text-[var(--ig-text)] outline-none ring-[var(--ig-link)] placeholder:text-[var(--ig-text-muted)] focus:ring-2 disabled:opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="hl-desc"
                  className="mb-1 block text-xs font-semibold text-[var(--ig-text-secondary)]"
                >
                  Description
                </label>
                <textarea
                  id="hl-desc"
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                  placeholder="Enter description"
                  rows={5}
                  disabled={pending}
                  className="w-full resize-y rounded-lg border border-[var(--ig-border)] bg-[var(--ig-bg)] px-3 py-2.5 text-sm text-[var(--ig-text)] outline-none ring-[var(--ig-link)] placeholder:text-[var(--ig-text-muted)] focus:ring-2 disabled:opacity-50"
                />
              </div>
              <div>
                <span className="mb-1 block text-xs font-semibold text-[var(--ig-text-secondary)]">Image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  disabled={pending}
                  onChange={onImageChange}
                  className="text-xs text-[var(--ig-text-secondary)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--ig-link)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white disabled:opacity-50"
                />
                {previewUrl ? (
                  <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-[var(--ig-border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt=""
                      className="max-h-48 w-full object-contain object-center bg-[var(--ig-elevated)]"
                    />
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-[var(--ig-text-muted)]">
                    Optional — stored on the API (max 4 MB). Sign in as admin.
                  </p>
                )}
              </div>
              {error ? (
                <p className="text-xs font-medium text-rose-600" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={pending}
                className="mt-auto rounded-lg bg-[var(--ig-link)] py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {pending ? "Saving…" : "Add highlight"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
