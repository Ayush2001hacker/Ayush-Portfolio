"use client";

import { motion } from "framer-motion";
import { stackSections } from "@/lib/site-content";

export function StackView() {
  return (
    <div className="space-y-4 px-4 py-4 lg:px-0">
      <p className="text-sm text-[var(--ig-text-secondary)]">
        Core technologies, tooling, and practices I use day to day.
      </p>
      <div className="space-y-3">
        {stackSections.map((section, gi) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05 }}
            className="rounded-2xl bg-[var(--ig-elevated)] p-4 ring-1 ring-[var(--ig-border)]"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--ig-text-muted)]">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ig-text)]">{section.body}</p>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
