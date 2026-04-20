"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useResumeHref } from "@/components/providers/ResumeHrefContext";
import { homeContact, profile } from "@/lib/site-content";
import { IconLinkedIn, IconMail, IconPhone } from "./icons";

function ChevronRight() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-[var(--ig-text-muted)]"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactView() {
  const { resumeHref } = useResumeHref();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(homeContact.gmailDisplay);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const linkedinLabel = homeContact.linkedinUrl.replace(
    /^https?:\/\/(www\.)?linkedin\.com\//i,
    "",
  );

  const rows = [
    {
      key: "phone",
      href: homeContact.phoneTel,
      label: "Phone",
      value: homeContact.phoneDisplay,
      icon: <IconPhone />,
      external: false,
    },
    {
      key: "email",
      href: homeContact.gmailHref,
      label: "Email",
      value: homeContact.gmailDisplay,
      icon: <IconMail />,
      external: false,
    },
    {
      key: "linkedin",
      href: homeContact.linkedinUrl,
      label: "LinkedIn",
      value: linkedinLabel,
      icon: <IconLinkedIn />,
      external: true,
    },
  ] as const;

  return (
    <div className="space-y-4 px-4 py-4 lg:px-0">
      <div className="rounded-2xl bg-[var(--ig-elevated)] p-4 ring-1 ring-[var(--ig-border)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ig-text-muted)]">
          Contact
        </p>
        <p className="mt-2 text-sm text-[var(--ig-text-secondary)]">
          Open to fullstack/product engineering roles, collaborations, and
          system design discussions.
        </p>

        <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-[var(--ig-border)]">
          {rows.map((row, i) => (
            <motion.a
              key={row.key}
              href={row.href}
              {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
              whileTap={{ scale: 0.995 }}
              className={`flex items-center gap-3 bg-[var(--ig-surface)] px-4 py-3.5 transition-colors hover:bg-[var(--ig-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ig-link)] ${i > 0 ? "border-t border-[var(--ig-border)]" : ""}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--ig-border)] bg-[var(--ig-elevated)] text-[var(--ig-text)]">
                {row.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ig-text-muted)]">
                  {row.label}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-[var(--ig-text)]">
                  {row.value}
                </p>
              </div>
              <ChevronRight />
            </motion.a>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={copyEmail}
            className="rounded-lg bg-[var(--ig-bg)] px-4 py-2 text-sm font-semibold text-[var(--ig-text)] ring-1 ring-[var(--ig-border)] hover:bg-[var(--ig-border)]/30"
          >
            {copied ? "Copied email" : "Copy email"}
          </motion.button>
          <motion.a
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.98 }}
            className="rounded-lg bg-[var(--ig-link)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Resume PDF
          </motion.a>
        </div>
      </div>

      <motion.a
        href={profile.links.github}
        target="_blank"
        rel="noreferrer"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="block rounded-2xl bg-[var(--ig-elevated)] p-4 text-center text-sm font-semibold ring-1 ring-[var(--ig-border)]"
      >
        GitHub
      </motion.a>
    </div>
  );
}
