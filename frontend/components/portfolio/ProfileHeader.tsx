"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useSiteMedia } from "@/components/providers/ResumeHrefContext";
import { uploadProfilePhoto } from "@/lib/admin/siteUploadApi";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { PermissionDeniedWrap } from "./PermissionDeniedWrap";
import { IconLinkedIn, IconMail, IconPencil, IconPhone } from "./icons";
import { homeContact, profile as siteProfile } from "@/lib/site-content";

type Props = { profile: typeof siteProfile };

function VerifiedBadge() {
  return (
    <span className="inline-flex shrink-0 text-[#0095f6]" title="Verified" aria-label="Verified">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <path
          d="M7.2 12.4 10.4 15.6 16.8 9.2"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ProfileHeader({ profile: p }: Props) {
  const { resumeHref, profilePhotoSrc, refreshSiteMedia } = useSiteMedia();
  const { isAdmin, authReady } = useAdminAuth();
  const canEditPhoto = authReady && isAdmin;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const openPhotoPicker = useCallback(() => {
    setPhotoError(null);
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

  const remotePhoto = profilePhotoSrc.startsWith("http");

  return (
    <section className="border-b border-[var(--ig-border)] px-4 pb-4 pt-2 lg:px-0 lg:pb-10 lg:pt-8">
      <div className="flex gap-5 lg:gap-16">
        <div className="shrink-0 pt-1 lg:pt-0">
          <PermissionDeniedWrap allowed={canEditPhoto} authReady={authReady} className="flex flex-col items-center">
            <div className="ig-story-ring ig-tap-scale">
              <div className="relative flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[var(--ig-bg)] p-[2px] sm:h-[96px] sm:w-[96px] lg:h-[150px] lg:w-[150px]">
                <div className="group relative h-full w-full overflow-hidden rounded-full ring-offset-2 ring-offset-[var(--ig-bg)] focus-within:ring-2 focus-within:ring-[var(--ig-link)]">
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
                      sizes="(max-width: 1023px) 96px, 150px"
                      priority
                    />
                  )}
                  {canEditPhoto ? (
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      className="sr-only"
                      onChange={onProfilePhotoSelected}
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={canEditPhoto ? openPhotoPicker : undefined}
                    disabled={photoBusy}
                    className="pointer-events-none absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-black/0 opacity-0 transition-[opacity,background-color] duration-200 group-hover:pointer-events-auto group-hover:bg-black/45 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:bg-black/45 group-focus-within:opacity-100 disabled:cursor-not-allowed disabled:group-hover:pointer-events-none disabled:group-hover:opacity-0"
                    aria-label={photoBusy ? "Uploading photo…" : "Change profile photo"}
                    title={canEditPhoto ? "Change profile photo" : undefined}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 shadow-md ring-1 ring-white/35 sm:h-10 sm:w-10 lg:h-11 lg:w-11">
                      <IconPencil className="h-[18px] w-[18px] text-white sm:h-5 sm:w-5" />
                    </span>
                  </button>
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

        <div className="min-w-0 flex-1 space-y-2 lg:space-y-4">
          <div className="hidden flex-wrap items-center gap-3 lg:flex">
            <h1 className="text-xl font-light tracking-tight">{p.name}</h1>
            {p.verified && <VerifiedBadge />}
            <a
              href={p.links.github}
              target="_blank"
              rel="noreferrer"
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
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-normal tracking-tight">{p.name}</h1>
              {p.verified && <VerifiedBadge />}
              <span className="rounded-md bg-[var(--ig-elevated)] px-2 py-0.5 text-xs font-medium text-[var(--ig-text-secondary)] ring-1 ring-[var(--ig-border)]">
                @{p.handle}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--ig-text-secondary)]">{p.title}</p>
            <div className="mt-2 flex gap-6 text-center sm:gap-8">
              {p.stats.map((s) => (
                <div key={s.label}>
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

          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--ig-text)] lg:mt-0">
            {p.bio}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={homeContact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`LinkedIn — open profile (${homeContact.linkedinUrl})`}
              title="LinkedIn"
              className="ig-tap-scale inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ig-border)] bg-[var(--ig-surface)] text-[var(--ig-text)] shadow-sm hover:bg-[var(--ig-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ig-link)]"
            >
              <IconLinkedIn />
            </a>
            <a
              href={homeContact.phoneTel}
              aria-label={`Phone — ${homeContact.phoneDisplay}`}
              title={homeContact.phoneDisplay}
              className="ig-tap-scale inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ig-border)] bg-[var(--ig-surface)] text-[var(--ig-text)] shadow-sm hover:bg-[var(--ig-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ig-link)]"
            >
              <IconPhone />
            </a>
            <a
              href={homeContact.gmailHref}
              aria-label={`Email — ${homeContact.gmailDisplay}`}
              title={homeContact.gmailDisplay}
              className="ig-tap-scale inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ig-border)] bg-[var(--ig-surface)] text-[var(--ig-text)] shadow-sm hover:bg-[var(--ig-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ig-link)]"
            >
              <IconMail />
            </a>
          </div>
          <p className="mt-3 text-xs text-[var(--ig-text-muted)]">{p.location}</p>

          <div className="mt-3 flex gap-2 lg:hidden">
            <a
              href={p.links.github}
              target="_blank"
              rel="noreferrer"
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
      </div>

      <div className="mt-4 hidden items-center gap-2 text-sm text-[var(--ig-text-secondary)] lg:flex">
        <span className="font-semibold text-[var(--ig-text)]">@{p.handle}</span>
        <span aria-hidden>·</span>
        <span>Portfolio &amp; selected work</span>
      </div>
    </section>
  );
}
