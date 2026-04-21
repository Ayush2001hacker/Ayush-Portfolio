"use client";

import { motion } from "framer-motion";
import type { GlobalSearchHit } from "@/lib/globalSearch";

type Props = {
  query: string;
  hits: GlobalSearchHit[];
  onPick: (hit: GlobalSearchHit) => void;
};

export function GlobalSearchResults({ query, hits, onPick }: Props) {
  const q = query.trim();
  if (!q) return null;

  if (hits.length === 0) {
    return (
      <p className="px-1 py-2 text-sm text-[var(--ig-text-muted)]" role="status">
        No results for &quot;{q}&quot;.
      </p>
    );
  }

  return (
    <ul className="space-y-0.5 py-1" role="listbox" aria-label="Search results">
      {hits.map((hit, i) => (
        <li key={hit.key}>
          <motion.button
            type="button"
            layout
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.12) }}
            onClick={() => onPick(hit)}
            className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left hover:bg-[var(--ig-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ig-link)]"
          >
            <span className="mt-0.5 shrink-0 rounded-md bg-[var(--ig-bg)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--ig-text-muted)] ring-1 ring-[var(--ig-border)]">
              {hit.category}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[var(--ig-text)]">{hit.title}</span>
              {hit.subtitle ? (
                <span className="mt-0.5 line-clamp-2 text-xs text-[var(--ig-text-secondary)]">{hit.subtitle}</span>
              ) : null}
            </span>
          </motion.button>
        </li>
      ))}
    </ul>
  );
}
