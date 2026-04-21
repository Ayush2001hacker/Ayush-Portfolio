"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = ["repos", "blogs", "stack", "work", "certs", "contact"] as const;

type Props = {
  className?: string;
};

/** “Search” + one rotating word; tight inline layout (no ellipsis, no reserved gap). */
export function AnimatedSearchHint({ className = "" }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={`inline-flex select-none items-center gap-1 whitespace-nowrap ${className}`}
      aria-hidden
    >
      <span className="shrink-0 text-[var(--ig-text-muted)]">Search</span>
      <span className="relative inline-flex text-left font-semibold text-[var(--ig-link)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={WORDS[i]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-nowrap"
          >
            {WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
