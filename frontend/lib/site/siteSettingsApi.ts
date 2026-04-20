import { getPublicApiBase } from "@/lib/apiBase";

export type SiteSettingsResponse = {
  resumeAvailable: boolean;
  updatedAt: number | null;
  profilePhotoAvailable: boolean;
  profilePhotoUpdatedAt: number | null;
};

export async function fetchSiteSettings(): Promise<SiteSettingsResponse> {
  const base = getPublicApiBase();
  if (!base) {
    return {
      resumeAvailable: false,
      updatedAt: null,
      profilePhotoAvailable: false,
      profilePhotoUpdatedAt: null,
    };
  }
  try {
    const res = await fetch(`${base}/api/site/settings`);
    if (!res.ok) {
      return {
        resumeAvailable: false,
        updatedAt: null,
        profilePhotoAvailable: false,
        profilePhotoUpdatedAt: null,
      };
    }
    const data = (await res.json()) as Partial<SiteSettingsResponse>;
    return {
      resumeAvailable: Boolean(data.resumeAvailable),
      updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : null,
      profilePhotoAvailable: Boolean(data.profilePhotoAvailable),
      profilePhotoUpdatedAt:
        typeof data.profilePhotoUpdatedAt === "number" ? data.profilePhotoUpdatedAt : null,
    };
  } catch {
    return {
      resumeAvailable: false,
      updatedAt: null,
      profilePhotoAvailable: false,
      profilePhotoUpdatedAt: null,
    };
  }
}
