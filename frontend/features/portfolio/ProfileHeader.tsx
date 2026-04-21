"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSiteMedia } from "@/components/providers/ResumeHrefContext";
import { uploadProfilePhoto } from "@/lib/admin/siteUploadApi";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { PermissionDeniedWrap } from "./PermissionDeniedWrap";
import { IconGitHub, IconInstagramVerified, IconLinkedIn, IconMail, IconPencil, IconPhone } from "./icons";
import { homeContact, profile as siteProfile } from "@/lib/site-content";

type Props = { profile: typeof siteProfile };

function VerifiedBadge() {
  return (
    <span className="inline-flex shrink-0 items-center" title="Verified" aria-label="Verified">
      <IconInstagramVerified className="h-5 w-5 shrink-0 text-[var(--ig-link)] sm:h-6 sm:w-6" />
    </span>
  );
}

/** Below `lg`: clamp bio; tap more / less to expand or collapse (desktop shows full bio separately). */
function CollapsibleBioMobile({ bio, className }: { bio: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);
  const [showToggle, setShowToggle] = useState(false);

  const updateToggle = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setShowToggle(false);
      return;
    }
    const el = pRef.current;
    if (!el) return;
    if (expanded) {
      setShowToggle(true);
      return;
    }
    setShowToggle(el.scrollHeight > el.clientHeight + 2);
  }, [expanded]);

  useLayoutEffect(() => {
    setExpanded(false);
  }, [bio]);

  useLayoutEffect(() => {
    updateToggle();
    const id = requestAnimationFrame(updateToggle);
    const el = pRef.current;
    const ro = el ? new ResizeObserver(() => updateToggle()) : null;
    ro?.observe(el!);
    window.addEventListener("resize", updateToggle);
    return () => {
      cancelAnimationFrame(id);
      ro?.disconnect();
      window.removeEventListener("resize", updateToggle);
    };
  }, [bio, expanded, updateToggle]);

  return (
    <div className={className}>
      <p
        ref={pRef}
        className={`whitespace-pre-line text-sm leading-relaxed text-[var(--ig-text)] ${expanded ? "" : "line-clamp-3"}`}
      >
        {bio}
      </p>
      {showToggle && (
        <button
          type="button"
          className="mt-0.5 text-sm font-semibold text-[var(--ig-text-secondary)] hover:text-[var(--ig-text)]"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
}

function ProfileContactIconRow() {
  const iconWrap =
    "ig-tap-scale inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ig-border)] bg-[var(--ig-surface)] text-[var(--ig-text)] shadow-sm hover:bg-[var(--ig-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ig-link)]";
  return (
    <>
      <a
        href={homeContact.linkedinUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`LinkedIn — open profile (${homeContact.linkedinUrl})`}
        title="LinkedIn"
        className={iconWrap}
      >
        <IconLinkedIn />
      </a>
      <a
        href={homeContact.githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`GitHub — open profile (${homeContact.githubUrl})`}
        title="GitHub"
        className={iconWrap}
      >
        <IconGitHub />
      </a>
      <a
        href={homeContact.phoneTel}
        aria-label={`Phone — ${homeContact.phoneDisplay}`}
        title={homeContact.phoneDisplay}
        className={iconWrap}
      >
        <IconPhone />
      </a>
      <a
        href={homeContact.gmailHref}
        aria-label={`Email — ${homeContact.gmailDisplay}`}
        title={homeContact.gmailDisplay}
        className={iconWrap}
      >
        <IconMail />
      </a>
    </>
  );
}

export function ProfileHeader({ profile: p }: Props) {
  const { resumeHref, profilePhotoSrc, refreshSiteMedia } = useSiteMedia();
  const { isAdmin, authReady } = useAdminAuth();
  const canEditPhoto = authReady && isAdmin;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarPhotoRootRef = useRef<HTMLDivElement>(null);
  const permissionDeniedAnchorRef = useRef<HTMLDivElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  /** Below `lg`: first tap reveals pencil overlay; tap again (pencil) opens picker. */
  const [mobilePhotoOverlay, setMobilePhotoOverlay] = useState(false);

  const openPhotoPicker = useCallback(() => {
    setPhotoError(null);
    setMobilePhotoOverlay(false);
    fileInputRef.current?.click();
  }, []);

  const onProfilePhotoSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setPhotoError(null);
      setPhotoBusy(true);
      try {
        await uploadProfilePhoto(file);
        await refreshSiteMedia();
        window.dispatchEvent(new Event("site-settings-changed"));
      } catch (err) {
        setPhotoError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setPhotoBusy(false);
      }
    },
    [refreshSiteMedia],
  );

  useEffect(() => {
    if (!mobilePhotoOverlay) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onDocPointer = (e: PointerEvent) => {
      if (mq.matches) return;
      if (avatarPhotoRootRef.current?.contains(e.target as Node)) return;
      setMobilePhotoOverlay(false);
    };
    document.addEventListener("pointerdown", onDocPointer, true);
    return () => document.removeEventListener("pointerdown", onDocPointer, true);
  }, [mobilePhotoOverlay]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const clear = () => {
      if (mq.matches) setMobilePhotoOverlay(false);
    };
    mq.addEventListener("change", clear);
    return () => mq.removeEventListener("change", clear);
  }, []);

  useEffect(() => {
    if (!canEditPhoto) setMobilePhotoOverlay(false);
  }, [canEditPhoto]);

  const remotePhoto = profilePhotoSrc.startsWith("http");

  return (
    <section className="border-b border-[var(--ig-border)] px-3 pb-4 pt-2 sm:px-4 lg:px-0 lg:pb-10 lg:pt-8">
      <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-16">
        <div className="shrink-0 lg:pt-0">
          <PermissionDeniedWrap
            allowed={canEditPhoto}
            authReady={authReady}
            tooltipAnchor="trailing"
            anchorRef={permissionDeniedAnchorRef}
            className="flex flex-col items-center"
          >
            <div ref={permissionDeniedAnchorRef} className="ig-story-ring ig-tap-scale">
              <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[var(--ig-bg)] p-[2px] sm:h-[104px] sm:w-[104px] lg:h-[150px] lg:w-[150px]">
                <div
                  ref={avatarPhotoRootRef}
                  className="group relative h-full w-full overflow-hidden rounded-full ring-offset-2 ring-offset-[var(--ig-bg)] focus-within:ring-2 focus-within:ring-[var(--ig-link)]"
                >
                  {remotePhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element -- dynamic API URL
                    <img
                      src={profilePhotoSrc}
                      alt={`${p.fullName} — profile photo`}
                      className="absolute inset-0 h-full w-full object-cover object-[center_15%]"
                    />
                  ) : (
                    <Image
                      src={profilePhotoSrc}
                      alt={`${p.fullName} — profile photo`}
                      fill
                      className="object-cover object-[center_15%]"
                      sizes="(max-width: 639px) 92px, (max-width: 1023px) 104px, 150px"
                      priority
                    />
                  )}
                  {canEditPhoto ? (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                        className="sr-only"
                        onChange={onProfilePhotoSelected}
                      />
                      {/* Mobile: invisible tap target opens pencil overlay (no hover on touch). */}
                      <button
                        type="button"
                        aria-label="Show change photo"
                        disabled={photoBusy || mobilePhotoOverlay}
                        onClick={() => setMobilePhotoOverlay(true)}
                        className="absolute inset-0 z-[9] cursor-pointer lg:hidden disabled:cursor-not-allowed disabled:opacity-0"
                      />
                      <button
                        type="button"
                        onClick={openPhotoPicker}
                        disabled={photoBusy}
                        className={`absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full transition-[opacity,background-color] duration-200 disabled:cursor-not-allowed disabled:opacity-50 lg:pointer-events-none lg:bg-black/0 lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:bg-black/45 lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:bg-black/45 lg:group-focus-within:opacity-100 lg:disabled:group-hover:pointer-events-none lg:disabled:group-hover:opacity-0 ${
                          mobilePhotoOverlay
                            ? "max-lg:pointer-events-auto max-lg:bg-black/45 max-lg:opacity-100"
                            : "max-lg:pointer-events-none max-lg:bg-transparent max-lg:opacity-0"
                        }`}
                        aria-label={photoBusy ? "Uploading photo…" : "Change profile photo"}
                        title={canEditPhoto ? "Change profile photo" : undefined}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 shadow-md ring-1 ring-white/35 sm:h-10 sm:w-10 lg:h-11 lg:w-11">
                          <IconPencil className="h-[18px] w-[18px] text-white sm:h-5 sm:w-5" />
                        </span>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </PermissionDeniedWrap>
          {photoError ? (
            <p className="mt-1 max-w-[10rem] text-center text-[10px] font-medium leading-tight text-rose-600 lg:max-w-[9rem]">
              {photoError}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-2 text-left lg:space-y-4">
          <div className="hidden flex-wrap items-center gap-3 lg:flex">
            <h1 className="text-xl font-light tracking-tight">{p.name}</h1>
            {p.verified && <VerifiedBadge />}
            <a
              href={p.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on LinkedIn"
              className="rounded-lg bg-[var(--ig-link)] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Follow
            </a>
            <a
              href={p.links.email}
              className="rounded-lg border border-[var(--ig-border-strong)] bg-transparent px-4 py-1.5 text-sm font-semibold text-[var(--ig-text)] hover:bg-[var(--ig-elevated)]"
            >
              Message
            </a>
            <a
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[var(--ig-border-strong)] bg-transparent px-4 py-1.5 text-sm font-semibold text-[var(--ig-text)] hover:bg-[var(--ig-elevated)]"
            >
              Resume
            </a>
          </div>

          <div className="hidden flex-wrap gap-8 text-base lg:flex">
            {p.stats.map((s) => (
              <span key={s.label} className="text-[var(--ig-text)]">
                <span className="font-semibold">{s.value}</span>{" "}
                <span className="text-[var(--ig-text)] lowercase">{s.label}</span>
              </span>
            ))}
          </div>

          <p className="hidden text-base font-semibold lg:block">{p.fullName}</p>

          <div className="lg:hidden">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="min-w-0 truncate text-xl font-normal tracking-tight">{p.name}</h1>
              {p.verified && <VerifiedBadge />}
              <span className="rounded-md bg-[var(--ig-elevated)] px-2 py-0.5 text-xs font-medium text-[var(--ig-text-secondary)] ring-1 ring-[var(--ig-border)]">
                @{p.handle}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--ig-text-secondary)]">{p.title}</p>
            <div className="mt-2 flex w-full max-w-full justify-between gap-2 text-left sm:justify-start sm:gap-8 sm:text-center">
              {p.stats.map((s) => (
                <div key={s.label} className="min-w-0 flex-1 sm:flex-none sm:text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base font-semibold leading-none sm:text-lg"
                  >
                    {s.value}
                  </motion.div>
                  <div className="mt-0.5 text-xs capitalize text-[var(--ig-text-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="hidden text-sm font-medium text-[var(--ig-text-secondary)] lg:block">{p.title}</p>

          <p className="mt-3 hidden whitespace-pre-line text-sm leading-relaxed text-[var(--ig-text)] lg:mt-0 lg:block">
            {p.bio}
          </p>
          <div className="mt-3 hidden flex-wrap items-center gap-2 lg:flex">
            <ProfileContactIconRow />
          </div>
          <p className="mt-3 hidden text-xs text-[var(--ig-text-muted)] lg:block">{p.location}</p>
        </div>
      </div>

      {/* Mobile: bio + actions span full section width (Instagram — not indented under stats). */}
      <div className="mt-3 w-full text-left lg:hidden">
        <CollapsibleBioMobile bio={p.bio} className="mt-0" />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ProfileContactIconRow />
        </div>
        <p className="mt-3 text-xs text-[var(--ig-text-muted)]">{p.location}</p>
        <div className="mt-3 flex gap-2">
          <a
            href={p.links.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Follow on LinkedIn"
            className="ig-tap-scale flex-1 rounded-lg bg-[var(--ig-link)] py-1.5 text-center text-sm font-semibold text-white hover:opacity-90"
          >
            Follow
          </a>
          <a
            href={p.links.email}
            className="ig-tap-scale flex-1 rounded-lg bg-[var(--ig-elevated)] py-1.5 text-center text-sm font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-border)]/40"
          >
            Message
          </a>
          <a
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="ig-tap-scale flex-1 rounded-lg bg-[var(--ig-elevated)] py-1.5 text-center text-sm font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-border)]/40"
          >
            Resume
          </a>
        </div>
      </div>

      <div className="mt-4 hidden items-center gap-2 text-sm text-[var(--ig-text-secondary)] lg:flex">
        <span className="font-semibold text-[var(--ig-text)]">@{p.handle}</span>
        <span aria-hidden>·</span>
        <span>Portfolio &amp; selected work</span>
      </div>
    </section>
  );
}
