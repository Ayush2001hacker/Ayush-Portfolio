"use client";

import { motion } from "framer-motion";

export const feedGradients = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#30cfd0,#330867)",
];

export type IgFeedTileProps = {
  index: number;
  topLabel: string;
  bottomTitle: string;
  overlayCaption?: string;
  centerImageSrc?: string;
  badgeImageSrc?: string;
  coverImageSrc?: string;
  repositoryImageSrc?: string;
  liked: boolean;
  /** Total likes from the interactions API (hover overlay on large screens). */
  likeCount: number;
  ariaLabel: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function IgFeedTile({
  index,
  topLabel,
  bottomTitle,
  overlayCaption = bottomTitle,
  centerImageSrc,
  badgeImageSrc,
  coverImageSrc,
  repositoryImageSrc,
  liked,
  likeCount,
  ariaLabel,
  onClick,
}: IgFeedTileProps) {
  const fillSrc = coverImageSrc ?? repositoryImageSrc;
  const tileCoverFill = Boolean(fillSrc);
  const neutralSurface =
    Boolean(centerImageSrc) || Boolean(badgeImageSrc) || Boolean(coverImageSrc) || Boolean(repositoryImageSrc);
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative aspect-square overflow-hidden outline-none ${
        neutralSurface ? "ig-experience-brand-tile" : "bg-[var(--ig-elevated)]"
      }`}
      style={neutralSurface ? undefined : { background: feedGradients[index % feedGradients.length] }}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {neutralSurface && tileCoverFill ? (
        <>
          <img
            src={fillSrc}
            alt=""
            decoding="async"
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover object-center"
          />
          <span className="ig-experience-brand-overlay pointer-events-none absolute inset-0 z-[2]" />
        </>
      ) : neutralSurface ? (
        <span className="ig-experience-brand-overlay pointer-events-none absolute inset-0" />
      ) : (
        <span className="pointer-events-none absolute inset-0 bg-black/20 transition-opacity duration-150 group-hover:opacity-70 lg:group-hover:opacity-100" />
      )}
      <span
        className={`pointer-events-none absolute left-2 top-2 max-w-[min(94%,15rem)] text-left lg:left-2.5 lg:top-2.5 ${
          tileCoverFill ? "z-[12]" : "z-10"
        } ${
          neutralSurface
            ? tileCoverFill
              ? ""
              : "ig-feed-timeline-label text-[11px] font-medium uppercase leading-snug tracking-[0.1em] sm:text-[12px] lg:text-[13px] lg:tracking-[0.12em]"
            : "text-[11px] font-medium uppercase leading-snug tracking-[0.1em] text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)] sm:text-[12px] lg:text-[13px] lg:tracking-[0.12em]"
        }`}
      >
        {tileCoverFill ? (
          <span className="ig-project-cover-chip inline-block rounded-md px-2 py-0.5 text-[11px] font-medium uppercase leading-snug tracking-[0.1em] sm:text-[12px] lg:px-2.5 lg:py-1 lg:text-[13px] lg:tracking-[0.12em]">
            {topLabel}
          </span>
        ) : (
          topLabel
        )}
      </span>
      <span
        className={`pointer-events-none absolute bottom-1.5 left-1.5 right-1.5 max-lg:hidden text-left lg:opacity-0 lg:transition-opacity lg:duration-150 lg:group-hover:opacity-0 ${
          tileCoverFill ? "z-[12]" : "z-10"
        } ${
          neutralSurface
            ? tileCoverFill
              ? "text-[10px] font-semibold leading-tight lg:text-[9px]"
              : "ig-experience-brand-label text-[10px] font-semibold leading-tight lg:text-[9px]"
            : "text-[10px] font-semibold leading-tight text-white drop-shadow lg:text-[9px]"
        }`}
      >
        {tileCoverFill ? (
          <span className="ig-project-cover-chip inline-block max-w-full rounded-md px-2 py-1 lg:px-2.5 lg:py-1.5">
            <span className="line-clamp-2">{bottomTitle}</span>
          </span>
        ) : (
          <span className="line-clamp-2">{bottomTitle}</span>
        )}
      </span>
      {centerImageSrc && (
        <span className="pointer-events-none absolute inset-0 z-[1] flex w-full items-center justify-center px-2 pt-7 pb-9 lg:pt-8 lg:pb-10">
          <img
            src={centerImageSrc}
            alt=""
            decoding="async"
            className="ig-brand-logo max-h-[42%] max-w-[80%] object-contain"
          />
        </span>
      )}
      {badgeImageSrc && (
        <span className="pointer-events-none absolute inset-0 z-[1] flex w-full items-center justify-center px-2 pt-7 pb-10 lg:pt-8 lg:pb-11">
          <img
            src={badgeImageSrc}
            alt=""
            decoding="async"
            className="max-h-[54%] max-w-[82%] object-contain object-center"
          />
        </span>
      )}
      <div
        className={`pointer-events-none absolute inset-0 hidden flex-col items-center justify-center gap-0.5 bg-black/50 text-[10px] font-semibold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 lg:flex lg:text-[9px] ${
          tileCoverFill ? "z-[13]" : "z-[8]"
        }`}
      >
        <span className="flex items-center gap-1.5 lg:text-[10px]">
          <span className="text-base leading-none text-white lg:text-sm">♥</span>
          {likeCount}
        </span>
        <span className="max-w-[92%] truncate px-1 text-center text-[9px] font-semibold uppercase tracking-wide">
          {overlayCaption}
        </span>
      </div>
      {liked && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`pointer-events-none absolute right-1.5 top-1.5 text-base lg:text-sm ${
            tileCoverFill ? "z-[14]" : ""
          } ${neutralSurface ? "text-rose-600 drop-shadow-sm" : "text-white drop-shadow"}`}
        >
          ♥
        </motion.span>
      )}
    </motion.button>
  );
}
