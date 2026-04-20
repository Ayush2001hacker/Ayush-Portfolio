"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const PERMISSION_DENIED_MESSAGE = "You don't have permissions.";

type Props = {
  /** When true, clicks pass through to children. */
  allowed: boolean;
  /** Until true, denied clicks are ignored (no flash for admins during session check). */
  authReady: boolean;
  message?: string;
  className?: string;
  children: ReactNode;
};

type TipCoords = { top: number; left: number };

/**
 * Wraps a control that is visible to everyone; non-allowed users see a tooltip on tap/click.
 * Tooltip is portaled with position:fixed so parent overflow (e.g. horizontal scroll strips) cannot clip it.
 */
export function PermissionDeniedWrap({
  allowed,
  authReady,
  message = PERMISSION_DENIED_MESSAGE,
  className = "",
  children,
}: Props) {
  const [tip, setTip] = useState<TipCoords | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!tip) return;
    const el = rootRef.current;
    if (!el) return;
    const sync = () => {
      const r = el.getBoundingClientRect();
      const next = { top: r.bottom + 8, left: r.left + r.width / 2 };
      setTip((prev) => {
        if (!prev) return null;
        if (prev.top === next.top && prev.left === next.left) return prev;
        return next;
      });
    };
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [tip]);

  useEffect(() => {
    if (!tip) return;
    const hideTimer = window.setTimeout(() => setTip(null), 2800);
    const onDocPointer = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setTip(null);
    };
    document.addEventListener("pointerdown", onDocPointer, true);
    return () => {
      window.clearTimeout(hideTimer);
      document.removeEventListener("pointerdown", onDocPointer, true);
    };
  }, [tip]);

  const blockIfDenied = (e: React.SyntheticEvent) => {
    if (!authReady || allowed) return;
    e.preventDefault();
    e.stopPropagation();
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTip({ top: r.bottom + 8, left: r.left + r.width / 2 });
  };

  const tooltip =
    tip &&
    typeof document !== "undefined" &&
    createPortal(
      <span
        role="status"
        style={{
          position: "fixed",
          top: tip.top,
          left: tip.left,
          transform: "translateX(-50%)",
          zIndex: 10000,
        }}
        className="pointer-events-none w-max max-w-[min(260px,calc(100vw-2rem))] rounded-lg bg-[var(--ig-text)] px-3 py-2 text-center text-xs font-semibold leading-snug text-[var(--ig-bg)] shadow-lg ring-1 ring-black/10 dark:ring-white/10"
      >
        {message}
      </span>,
      document.body,
    );

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <div onPointerDownCapture={blockIfDenied} onClickCapture={blockIfDenied}>
        {children}
      </div>
      {tooltip}
    </div>
  );
}
