"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IgFeedTileProps } from "./IgFeedTile";
import type {
  CertificationItem,
  ExperienceRole,
  PortfolioWorkItem,
  Project,
} from "@/lib/site-content";
import {
  certifications,
  experienceRoles,
  GITHUB_REPOS_URL,
  portfolioWorkItems,
  projects,
} from "@/lib/site-content";
import { useInteractionTarget } from "@/lib/interactions/hooks";
import type { InteractionKind } from "@/lib/interactions/types";
import { IconBriefcase, IconCertificate, IconGrid, IconLayers } from "./icons";
import { DetailSheet } from "./DetailSheet";
import { IgFeedTile } from "./IgFeedTile";
import { ProjectModal } from "./ProjectModal";

type Tab = "repositories" | "projects" | "certifications" | "experience";

type Props = {
  filterQuery?: string;
};

type Sheet =
  | null
  | { kind: "work"; item: PortfolioWorkItem }
  | { kind: "cert"; cert: CertificationItem }
  | { kind: "exp"; role: ExperienceRole };

type PortfolioGridTileProps = Omit<IgFeedTileProps, "liked" | "likeCount" | "onClick"> & {
  kind: InteractionKind;
  entityId: string;
  onOpen: () => void;
  onBurst: (id: string, x: number, y: number) => void;
};

function PortfolioGridTile({ kind, entityId, onOpen, onBurst, ...tile }: PortfolioGridTileProps) {
  const { liked, likeCount, toggleLike } = useInteractionTarget(kind, entityId);
  const lastTapRef = useRef(0);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const now = Date.now();
      const prev = lastTapRef.current ?? 0;
      if (now - prev < 320) {
        if (openTimerRef.current) {
          clearTimeout(openTimerRef.current);
          openTimerRef.current = null;
        }
        lastTapRef.current = 0;
        toggleLike();
        onBurst(entityId, e.clientX, e.clientY);
        return;
      }
      lastTapRef.current = now;
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;
        onOpen();
      }, 280);
    },
    [entityId, onBurst, onOpen, toggleLike],
  );

  return (
    <IgFeedTile {...tile} liked={liked} likeCount={likeCount} onClick={onClick} />
  );
}

export function ProjectFeed({ filterQuery = "" }: Props) {
  const [tab, setTab] = useState<Tab>("repositories");
  const [openRepo, setOpenRepo] = useState<Project | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [burst, setBurst] = useState<{ id: string; x: number; y: number } | null>(null);
  const [siteOrigin, setSiteOrigin] = useState("");

  useEffect(() => {
    setSiteOrigin(window.location.origin);
  }, []);

  const repoFiltered = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [filterQuery]);

  const sheetInteraction = useMemo(() => {
    if (!sheet || !siteOrigin) return null;
    if (sheet.kind === "work") {
      return { kind: "portfolioWork" as const, id: sheet.item.id, shareUrl: `${siteOrigin}/` };
    }
    if (sheet.kind === "cert") {
      return { kind: "certification" as const, id: sheet.cert.id, shareUrl: sheet.cert.href };
    }
    if (sheet.kind === "exp") {
      return { kind: "experience" as const, id: sheet.role.id, shareUrl: `${siteOrigin}/` };
    }
    return null;
  }, [sheet, siteOrigin]);

  const onBurst = useCallback((id: string, x: number, y: number) => {
    setBurst({ id, x, y });
    window.setTimeout(() => setBurst(null), 900);
  }, []);

  const tabs = useMemo(
    () =>
      [
        {
          key: "repositories" as const,
          a11y: "Repositories",
          short: "Repos",
          desktop: "Repositories",
          icon: (a: boolean) => <IconGrid active={a} />,
        },
        {
          key: "experience" as const,
          a11y: "Experience",
          short: "Exp",
          desktop: "Experience",
          icon: (a: boolean) => <IconBriefcase active={a} />,
        },
        {
          key: "certifications" as const,
          a11y: "Certifications",
          short: "Certs",
          desktop: "Certifications",
          icon: (a: boolean) => <IconCertificate active={a} />,
        },
        {
          key: "projects" as const,
          a11y: "Projects",
          short: "Work",
          desktop: "Projects",
          icon: (a: boolean) => <IconLayers active={a} />,
        },
      ] as const,
    [],
  );

  return (
    <div>
      <div className="grid grid-cols-4 border-b border-[var(--ig-border)] lg:mt-10 lg:flex lg:justify-center lg:gap-8 lg:border-b-0 lg:border-t lg:border-[var(--ig-border)] xl:gap-12">
        {tabs.map(({ key, a11y, short, desktop, icon }) => {
          const isActive = tab === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              aria-label={a11y}
              onClick={() => setTab(key)}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-0.5 py-2.5 lg:flex-row lg:gap-2 lg:px-4 lg:py-4 lg:text-xs lg:font-bold lg:tracking-wide ${
                isActive ? "text-[var(--ig-text)]" : "text-[var(--ig-text-muted)]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="feed-tab"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-[var(--ig-text)] lg:bottom-auto lg:top-0 lg:left-3 lg:right-3 lg:h-0.5"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className={isActive ? "opacity-100" : "opacity-55"}>{icon(isActive)}</span>
              <span className="max-w-full truncate px-0.5 text-[9px] font-medium lg:hidden">{short}</span>
              <span className="hidden max-w-[10rem] truncate lg:inline">{desktop}</span>
            </button>
          );
        })}
      </div>

      {tab === "repositories" && (
        <div className="border-b border-[var(--ig-border)] bg-[var(--ig-bg)] px-2 py-2 text-center text-[11px] leading-snug text-[var(--ig-text-secondary)] lg:bg-[var(--ig-elevated)]/40 lg:text-xs">
          Public repos from my GitHub —{" "}
          <a
            href={GITHUB_REPOS_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--ig-link)] hover:underline"
          >
            view all repositories
          </a>
          .
        </div>
      )}

      {tab === "repositories" && (
        <motion.div
          layout
          className="grid grid-cols-3 gap-[2px] bg-[var(--ig-border)] pb-8 lg:grid-cols-4 lg:gap-2 lg:bg-transparent lg:pb-10 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-2.5"
        >
          <AnimatePresence mode="popLayout">
            {repoFiltered.map((project, index) => (
              <PortfolioGridTile
                key={project.id}
                kind="repository"
                entityId={project.id}
                index={index}
                topLabel={project.year}
                bottomTitle={project.title}
                repositoryImageSrc={project.thumbSrc}
                ariaLabel={`Open repository ${project.title}. Double-tap to like.`}
                onOpen={() => setOpenRepo(project)}
                onBurst={onBurst}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {tab === "experience" && (
        <motion.div
          layout
          className="grid grid-cols-3 gap-[2px] bg-[var(--ig-border)] pb-8 lg:grid-cols-4 lg:gap-2 lg:bg-transparent lg:pb-10 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-2.5"
        >
          <AnimatePresence mode="popLayout">
            {experienceRoles.map((role, index) => (
              <PortfolioGridTile
                key={role.id}
                kind="experience"
                entityId={role.id}
                index={index}
                topLabel={role.period}
                bottomTitle={role.title}
                overlayCaption={`${role.title} · ${role.company}`}
                centerImageSrc={role.companyLogoSrc}
                ariaLabel={`Open role ${role.title} at ${role.company}. Double-tap to like.`}
                onOpen={() => setSheet({ kind: "exp", role })}
                onBurst={onBurst}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {tab === "certifications" && (
        <motion.div
          layout
          className="grid grid-cols-3 gap-[2px] bg-[var(--ig-border)] pb-8 lg:grid-cols-4 lg:gap-2 lg:bg-transparent lg:pb-10 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-2.5"
        >
          <AnimatePresence mode="popLayout">
            {certifications.map((c, index) => (
              <PortfolioGridTile
                key={c.id}
                kind="certification"
                entityId={c.id}
                index={index}
                topLabel={c.year}
                bottomTitle={c.title}
                overlayCaption={c.title}
                badgeImageSrc={c.badgeSrc}
                ariaLabel={`Open certification ${c.title}. Double-tap to like.`}
                onOpen={() => setSheet({ kind: "cert", cert: c })}
                onBurst={onBurst}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {tab === "projects" && (
        <motion.div
          layout
          className="grid grid-cols-3 gap-[2px] bg-[var(--ig-border)] pb-8 lg:grid-cols-4 lg:gap-2 lg:bg-transparent lg:pb-10 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-2.5"
        >
          <AnimatePresence mode="popLayout">
            {portfolioWorkItems.map((item, index) => (
              <PortfolioGridTile
                key={item.id}
                kind="portfolioWork"
                entityId={item.id}
                index={index}
                topLabel={item.period}
                bottomTitle={item.title}
                overlayCaption={item.title}
                coverImageSrc={item.thumbSrc}
                ariaLabel={`Open project ${item.title}. Double-tap to like.`}
                onOpen={() => setSheet({ kind: "work", item })}
                onBurst={onBurst}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {tab === "repositories" && repoFiltered.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-[var(--ig-text-muted)]">No repositories match your search.</p>
      )}

      {burst && (
        <span
          key={`${burst.id}-${burst.x}-${burst.y}`}
          className="ig-heart-burst pointer-events-none fixed z-[70] text-5xl text-[var(--ig-like)]"
          style={{ left: burst.x, top: burst.y }}
          aria-hidden
        >
          ♥
        </span>
      )}

      <ProjectModal project={openRepo} onClose={() => setOpenRepo(null)} />

      <DetailSheet
        open={sheet !== null}
        title={
          sheet?.kind === "work"
            ? sheet.item.title
            : sheet?.kind === "cert"
              ? sheet.cert.title
              : sheet?.kind === "exp"
                ? `${sheet.role.title} · ${sheet.role.company}`
                : ""
        }
        meta={
          sheet?.kind === "work"
            ? sheet.item.period
            : sheet?.kind === "cert"
              ? sheet.cert.year
              : sheet?.kind === "exp"
                ? sheet.role.period
                : undefined
        }
        description={sheet?.kind === "work" ? sheet.item.description : undefined}
        bullets={sheet?.kind === "exp" ? sheet.role.bullets : undefined}
        primaryHref={sheet?.kind === "cert" ? sheet.cert.href : undefined}
        primaryLabel={sheet?.kind === "cert" ? sheet.cert.ctaLabel : undefined}
        headerImageSrc={
          sheet?.kind === "exp"
            ? sheet.role.companyLogoSrc
            : sheet?.kind === "cert"
              ? sheet.cert.badgeSrc
              : sheet?.kind === "work"
                ? sheet.item.thumbSrc
                : undefined
        }
        headerImageAlt={
          sheet?.kind === "exp"
            ? "Data Axle"
            : sheet?.kind === "cert"
              ? sheet.cert.title
              : sheet?.kind === "work"
                ? sheet.item.title
                : undefined
        }
        headerImageTone={sheet?.kind === "cert" || sheet?.kind === "work" ? "media" : "brand"}
        interaction={sheetInteraction}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}
