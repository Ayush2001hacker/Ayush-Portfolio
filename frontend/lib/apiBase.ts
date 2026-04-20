let warnedMissingApiUrl = false;

/**
 * Public API base (`NEXT_PUBLIC_API_URL`). Dev fallback matches interactions client.
 */
export function getPublicApiBase(): string {
  const trimmed = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (trimmed) return trimmed;

  if (process.env.NODE_ENV === "development") {
    if (typeof window !== "undefined" && !warnedMissingApiUrl) {
      warnedMissingApiUrl = true;
      console.warn(
        "[portfolio] NEXT_PUBLIC_API_URL is not set — using http://localhost:5001 for this dev session. " +
          "Set NEXT_PUBLIC_API_URL in frontend/.env.local to your API base (e.g. http://localhost:5001) and restart `next dev`.",
      );
    }
    return "http://localhost:5001";
  }

  return "";
}

export function assertPublicApiUrl(): string {
  const base = getPublicApiBase();
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. For production, set it before `next build` (e.g. in .env.production).",
    );
  }
  return base;
}
