"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IconLinkedIn, IconMail, IconPhone } from "./icons";
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
  const resumeHref = p.links.resume;

  return (
    <section className="border-b border-[var(--ig-border)] px-4 pb-4 pt-2 lg:px-0 lg:pb-10 lg:pt-8">
      <div className="flex gap-5 lg:gap-16">
        <div className="shrink-0 pt-1 lg:pt-0">
          <div className="ig-story-ring ig-tap-scale">
            <div className="relative flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[var(--ig-bg)] p-[2px] sm:h-[96px] sm:w-[96px] lg:h-[150px] lg:w-[150px]">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src={p.photoSrc}
                  alt={`${p.fullName} — profile photo`}
                  fill
                  className="object-cover object-[center_15%]"
                  sizes="(max-width: 1023px) 96px, 150px"
                  priority
                />
              </div>
            </div>
          </div>
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
