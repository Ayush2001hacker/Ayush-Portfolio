"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { EntityInteractionPanel } from "@/components/interactions/EntityInteractionPanel";
import { GITHUB_REPOS_URL, type Project } from "@/lib/site-content";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
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
  }, [project, onClose]);

  const shareUrl = useMemo(() => {
    if (!project) return undefined;
    return project.links?.[0]?.href ?? GITHUB_REPOS_URL;
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[var(--ig-overlay)]"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.article
            className="relative z-10 flex max-h-[min(92dvh,820px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-[var(--ig-surface)] shadow-2xl ring-1 ring-[var(--ig-border)] sm:max-h-[85dvh] sm:rounded-2xl"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div
              className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-video"
              style={
                project.thumbSrc
                  ? undefined
                  : {
                      background: `linear-gradient(135deg, rgba(245,133,41,0.35), rgba(221,42,123,0.35), rgba(129,52,175,0.35))`,
                    }
              }
            >
              {project.thumbSrc ? (
                <img
                  src={project.thumbSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/25">
                  {project.title.slice(0, 1)}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              >
                Close
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="project-modal-title" className="text-lg font-semibold leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-sm text-[var(--ig-text-muted)]">
                    {project.subtitle} · {project.year}
                  </p>
                </div>
              </div>
              <EntityInteractionPanel kind="repository" id={project.id} shareUrl={shareUrl} />
              <p className="text-sm leading-relaxed text-[var(--ig-text-secondary)]">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--ig-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--ig-text-secondary)] ring-1 ring-[var(--ig-border)]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              {project.links && project.links.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {project.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="ig-tap-scale rounded-lg bg-[var(--ig-link)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
              <p className="text-xs leading-relaxed text-[var(--ig-text-muted)]">
                Full list of public work:{" "}
                <a
                  href={GITHUB_REPOS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--ig-link)] hover:underline"
                >
                  github.com/Ayush2001hacker/repositories
                </a>
                .
              </p>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
