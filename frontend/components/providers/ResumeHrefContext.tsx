"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getPublicApiBase } from "@/lib/apiBase";
import { profile, RESUME_PDF } from "@/lib/site-content";
import { fetchSiteSettings } from "@/lib/site/siteSettingsApi";

type SiteMediaContextValue = {
  resumeHref: string;
  profilePhotoSrc: string;
  refreshSiteMedia: () => Promise<void>;
};

const SiteMediaContext = createContext<SiteMediaContextValue | null>(null);

export function ResumeHrefProvider({ children }: { children: ReactNode }) {
  const [resumeHref, setResumeHref] = useState(RESUME_PDF);
  const [profilePhotoSrc, setProfilePhotoSrc] = useState(profile.photoSrc);

  const refreshSiteMedia = useCallback(async () => {
    const base = getPublicApiBase();
    if (!base) {
      setResumeHref(RESUME_PDF);
      setProfilePhotoSrc(profile.photoSrc);
      return;
    }
    const data = await fetchSiteSettings();
    if (data.resumeAvailable && data.updatedAt != null) {
      setResumeHref(`${base}/api/site/resume?t=${Math.floor(data.updatedAt)}`);
    } else {
      setResumeHref(RESUME_PDF);
    }
    if (data.profilePhotoAvailable && data.profilePhotoUpdatedAt != null) {
      setProfilePhotoSrc(`${base}/api/site/profile-photo?t=${Math.floor(data.profilePhotoUpdatedAt)}`);
    } else {
      setProfilePhotoSrc(profile.photoSrc);
    }
  }, []);

  useEffect(() => {
    void refreshSiteMedia();
  }, [refreshSiteMedia]);

  useEffect(() => {
    const on = () => void refreshSiteMedia();
    window.addEventListener("site-settings-changed", on);
    return () => window.removeEventListener("site-settings-changed", on);
  }, [refreshSiteMedia]);

  const value = useMemo(
    () => ({ resumeHref, profilePhotoSrc, refreshSiteMedia }),
    [resumeHref, profilePhotoSrc, refreshSiteMedia],
  );

  return <SiteMediaContext.Provider value={value}>{children}</SiteMediaContext.Provider>;
}

/** Resume link + refresh (used across portfolio). */
export function useResumeHref() {
  const ctx = useContext(SiteMediaContext);
  if (!ctx) {
    throw new Error("useResumeHref must be used within ResumeHrefProvider");
  }
  return { resumeHref: ctx.resumeHref, refreshResume: ctx.refreshSiteMedia };
}

/** Resume URL, profile image URL, and combined refresh after uploads. */
export function useSiteMedia(): SiteMediaContextValue {
  const ctx = useContext(SiteMediaContext);
  if (!ctx) {
    throw new Error("useSiteMedia must be used within ResumeHrefProvider");
  }
  return ctx;
}
