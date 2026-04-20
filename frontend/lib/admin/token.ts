export const ADMIN_TOKEN_STORAGE_KEY = "ayush-admin-token";

export function readAdminToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeAdminToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
