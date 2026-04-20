"use client";

import Image from "next/image";
import { useSiteMedia } from "@/components/providers/ResumeHrefContext";
import { profile } from "@/lib/site-content";
import type { NavKey } from "./nav-items";
import { primaryNavItems } from "./nav-items";

type Props = {
  active: NavKey;
  onChange: (key: NavKey) => void;
};

export function DesktopSidebar({ active, onChange }: Props) {
  const { profilePhotoSrc } = useSiteMedia();
  const remotePhoto = profilePhotoSrc.startsWith("http");

  return (
    <aside
      className="sticky top-0 z-40 hidden h-dvh w-[72px] shrink-0 border-r border-[var(--ig-border)] bg-[var(--ig-surface)] px-2 py-4 lg:flex lg:flex-col xl:w-56 xl:px-3"
      aria-label="Primary"
    >
      <div className="mb-6 flex justify-center xl:justify-start xl:px-2">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-[var(--ig-border)]">
          {remotePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element -- same dynamic API URL as profile header
            <img
              src={profilePhotoSrc}
              alt={profile.name}
              className="absolute inset-0 h-full w-full object-cover object-[center_15%]"
            />
          ) : (
            <Image
              src={profilePhotoSrc}
              alt={profile.name}
              fill
              className="object-cover object-[center_15%]"
              sizes="44px"
            />
          )}
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {primaryNavItems.map(({ key, label, icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={label}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              className={`ig-tap-scale flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-colors xl:px-3 ${
                isActive
                  ? "bg-[var(--ig-bg)] text-[var(--ig-text)] shadow-sm ring-1 ring-[var(--ig-border)]"
                  : "text-[var(--ig-text-muted)] hover:bg-[var(--ig-bg)] hover:text-[var(--ig-text)]"
              } ${isActive ? "justify-center xl:justify-start" : "justify-center xl:justify-start"}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">{icon(isActive)}</span>
              <span className="hidden truncate xl:inline">{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
