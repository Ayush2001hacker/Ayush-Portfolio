"use client";

import { motion } from "framer-motion";
import type { NavKey } from "@/lib/navigation/types";
import { primaryNavItems } from "./nav-items";

export type { NavKey } from "@/lib/navigation/types";

type Props = {
  active: NavKey;
  onChange: (key: NavKey) => void;
  className?: string;
};

export function BottomNav({ active, onChange, className = "" }: Props) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--ig-border)] bg-[var(--ig-bg)]/90 backdrop-blur-lg ${className}`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 pt-2">
        {primaryNavItems.map(({ key, label, icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className="ig-tap-scale relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium text-[var(--ig-text-muted)]"
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-pip"
                  className="absolute -top-0.5 h-1 w-1 rounded-full bg-[var(--ig-link)]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className={isActive ? "opacity-100" : "opacity-75"}>{icon(isActive)}</span>
              <span className={isActive ? "text-[var(--ig-text)]" : ""}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
