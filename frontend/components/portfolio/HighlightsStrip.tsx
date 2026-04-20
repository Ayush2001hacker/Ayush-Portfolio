"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { useHighlights } from "@/lib/highlights/HighlightsContext";
import type { Highlight } from "@/lib/highlights/types";
import { AddHighlightModal } from "./AddHighlightModal";
import { HighlightDetailModal } from "./HighlightDetailModal";
import { IconPlus } from "./icons";
import { PermissionDeniedWrap } from "./PermissionDeniedWrap";

function HighlightOrb({ h }: { h: Highlight }) {
  const hasImage = Boolean(h.imageSrc);
  return (
    <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[var(--ig-elevated)] text-2xl ring-1 ring-[var(--ig-border)] md:text-[26px]">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- includes data URLs for custom highlights
        <img src={h.imageSrc} alt="" className="h-full w-full object-cover object-center" />
      ) : (
        h.emoji
      )}
    </span>
  );
}

export function HighlightsStrip() {
  const { highlights: list, addHighlight } = useHighlights();
  const { isAdmin, authReady } = useAdminAuth();
  const canAdd = authReady && isAdmin;
  const scroller = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Highlight | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const scrollBy = (dx: number) => {
    scroller.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <LayoutGroup id="highlight-stories">
      <div className="relative border-b border-[var(--ig-border)] py-3">
        <div
          ref={scroller}
          className="flex gap-4 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:px-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {list.map((h, i) => (
            <motion.button
              key={h.id}
              type="button"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              className="flex shrink-0 flex-col items-center gap-1"
              style={{ scrollSnapAlign: "start" }}
              aria-label={`${h.label}. Open details.`}
              aria-haspopup="dialog"
              onClick={() => setOpen(h)}
            >
              <span className="ig-story-ring-animated-wrap ig-tap-scale">
                <span className="ig-story-ring-animated-spin" aria-hidden />
                <motion.span
                  layoutId={`highlight-orb-${h.id}`}
                  className="ig-story-ring-animated-inner"
                >
                  <HighlightOrb h={h} />
                </motion.span>
              </span>
              <span className="max-w-[72px] truncate text-[11px] text-[var(--ig-text)] md:max-w-[84px]">{h.label}</span>
            </motion.button>
          ))}
          <PermissionDeniedWrap
            allowed={canAdd}
            authReady={authReady}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <motion.button
              key="highlight-add"
              type="button"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: list.length * 0.04 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1"
              style={{ scrollSnapAlign: "start" }}
              aria-label="Add new highlight"
              aria-haspopup="dialog"
              onClick={() => setAddOpen(true)}
            >
              <span className="ig-story-ring-animated-wrap ig-tap-scale">
                <span className="ig-story-ring-animated-spin opacity-40" aria-hidden />
                <span className="ig-story-ring-animated-inner border border-dashed border-[var(--ig-border)] bg-[var(--ig-bg)]">
                  <span className="flex h-full w-full items-center justify-center rounded-full text-[var(--ig-text-secondary)]">
                    <IconPlus className="text-[var(--ig-text)]" />
                  </span>
                </span>
              </span>
              <span className="max-w-[72px] truncate text-[11px] font-medium text-[var(--ig-text-secondary)] md:max-w-[84px]">
                New
              </span>
            </motion.button>
          </PermissionDeniedWrap>
        </div>
        <button
          type="button"
          onClick={() => scrollBy(220)}
          className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--ig-border)] bg-[var(--ig-surface)] text-[var(--ig-text)] shadow-sm hover:bg-[var(--ig-elevated)] lg:flex"
          aria-label="Scroll highlights"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <HighlightDetailModal highlight={open} onClose={() => setOpen(null)} />
        <AddHighlightModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={async (item) => {
            await addHighlight(item);
          }}
        />
      </div>
    </LayoutGroup>
  );
}
