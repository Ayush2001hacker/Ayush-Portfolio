const STORAGE_KEY = "ayush-interaction-client-id";

let memoryFallbackId: string | null = null;

function randomId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Stable id for this browser (for like toggle API). Not used for comment bodies.
 * Uses `localStorage`, or an in-memory id if storage is blocked (private mode).
 */
export function getClientId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    if (!memoryFallbackId) {
      memoryFallbackId = randomId();
      console.warn(
        "[portfolio] localStorage unavailable — using a temporary session id for likes (resets on full page reload).",
      );
    }
    return memoryFallbackId;
  }
}
