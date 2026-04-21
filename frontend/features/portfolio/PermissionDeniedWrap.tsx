"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

export const PERMISSION_DENIED_MESSAGE = "You don't have permissions.";

export type PermissionTooltipAnchor = "center" | "trailing" | "leading";

type Props = {
  allowed: boolean;
  authReady: boolean;
  message?: string;
  className?: string;
  tooltipAnchor?: PermissionTooltipAnchor;
  /** Element whose box is used for placement (avatar ring, highlight button). Falls back to the wrap root. */
  anchorRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

type TipLayout = {
  top: number;
  left?: number;
  transform: string;
  arrow: "west" | "east" | "none";
};

const VIEW_MARGIN_PX = 14;
const GAP_PX = 10;
const ARROW_W = 8;
const ARROW_H = 12;

function clampTooltipCenterX(cx: number): number {
  if (typeof window === "undefined") return cx;
  const vw = window.innerWidth;
  const half = Math.min(130, (vw - 2 * VIEW_MARGIN_PX) / 2);
  const minCx = VIEW_MARGIN_PX + half;
  const maxCx = vw - VIEW_MARGIN_PX - half;
  if (minCx >= maxCx) return vw / 2;
  return Math.min(maxCx, Math.max(minCx, cx));
}

function measureEl(anchorRef: RefObject<HTMLElement | null> | undefined, rootEl: HTMLElement | null): HTMLElement | null {
  return anchorRef?.current ?? rootEl;
}

/** Tooltip to the **right** of anchor, vertically centered; arrow on left points at anchor. */
function tipTrailingSide(r: DOMRect, vw: number): TipLayout {
  const maxW = Math.min(260, vw - 2 * VIEW_MARGIN_PX);
  let left = r.right + GAP_PX;
  left = Math.min(vw - VIEW_MARGIN_PX - maxW, left);
  left = Math.max(VIEW_MARGIN_PX, left);
  const top = r.top + r.height / 2;
  return { top, left, transform: "translateY(-50%)", arrow: "west" };
}

/** Tooltip to the **left** of anchor; `translate(-100%,-50%)` so the bubble’s right edge sits near `r.left`. */
function tipLeadingSide(r: DOMRect, vw: number): TipLayout {
  const maxW = Math.min(260, vw - 2 * VIEW_MARGIN_PX);
  let left = r.left - GAP_PX;
  left = Math.max(VIEW_MARGIN_PX + maxW, left);
  left = Math.min(vw - VIEW_MARGIN_PX, left);
  const top = r.top + r.height / 2;
  return { top, left, transform: "translate(-100%, -50%)", arrow: "east" };
}

function tipBelowCenter(r: DOMRect): TipLayout {
  return {
    top: r.bottom + GAP_PX,
    left: clampTooltipCenterX(r.left + r.width / 2),
    transform: "translateX(-50%)",
    arrow: "none",
  };
}

function tipLayoutForElement(
  measureEl: HTMLElement,
  anchor: PermissionTooltipAnchor,
): TipLayout {
  const r = measureEl.getBoundingClientRect();
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  if (anchor === "trailing") return tipTrailingSide(r, vw);
  if (anchor === "leading") return tipLeadingSide(r, vw);
  return tipBelowCenter(r);
}

function sameTip(a: TipLayout, b: TipLayout) {
  return a.top === b.top && a.left === b.left && a.transform === b.transform && a.arrow === b.arrow;
}

function TooltipArrow({ dir }: { dir: "west" | "east" }) {
  if (dir === "west") {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 z-[1] -translate-x-full -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: `${ARROW_H / 2}px solid transparent`,
          borderBottom: `${ARROW_H / 2}px solid transparent`,
          borderRight: `${ARROW_W}px solid var(--ig-text)`,
        }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-0 top-1/2 z-[1] translate-x-full -translate-y-1/2"
      style={{
        width: 0,
        height: 0,
        borderTop: `${ARROW_H / 2}px solid transparent`,
        borderBottom: `${ARROW_H / 2}px solid transparent`,
        borderLeft: `${ARROW_W}px solid var(--ig-text)`,
      }}
    />
  );
}

export function PermissionDeniedWrap({
  allowed,
  authReady,
  message = PERMISSION_DENIED_MESSAGE,
  className = "",
  tooltipAnchor = "center",
  anchorRef,
  children,
}: Props) {
  const [tip, setTip] = useState<TipLayout | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRefProp = useRef(anchorRef);
  anchorRefProp.current = anchorRef;

  const resolveMeasure = () => measureEl(anchorRefProp.current, rootRef.current);

  useLayoutEffect(() => {
    if (!tip) return;
    const sync = () => {
      const el = resolveMeasure();
      if (!el) return;
      const next = tipLayoutForElement(el, tooltipAnchor);
      setTip((prev) => {
        if (!prev) return null;
        if (sameTip(prev, next)) return prev;
        return next;
      });
    };
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [tip, tooltipAnchor, anchorRef]);

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
    const el = resolveMeasure();
    if (!el) return;
    setTip(tipLayoutForElement(el, tooltipAnchor));
  };

  const tooltip =
    tip &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        role="status"
        style={{
          position: "fixed",
          top: tip.top,
          ...(tip.left != null ? { left: tip.left } : {}),
          transform: tip.transform,
          zIndex: 10000,
        }}
        className="pointer-events-none w-max max-w-[min(260px,calc(100vw-2rem))]"
      >
        <div className="relative inline-block">
          {tip.arrow === "west" ? <TooltipArrow dir="west" /> : null}
          <span className="block rounded-lg bg-[var(--ig-text)] px-3 py-2 text-center text-xs font-semibold leading-snug text-[var(--ig-bg)] shadow-lg ring-1 ring-black/10 dark:ring-white/10">
            {message}
          </span>
          {tip.arrow === "east" ? <TooltipArrow dir="east" /> : null}
        </div>
      </div>,
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
