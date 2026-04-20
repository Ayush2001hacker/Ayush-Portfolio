import { getPublicApiBase } from "@/lib/apiBase";
import { readAdminToken } from "@/lib/admin/token";
import type { Highlight } from "./types";

export async function fetchHighlightCustom(): Promise<Highlight[]> {
  const base = getPublicApiBase();
  if (!base) return [];
  try {
    const res = await fetch(`${base}/api/site/highlights`);
    if (!res.ok) return [];
    const data = (await res.json()) as { customItems?: unknown };
    if (!Array.isArray(data.customItems)) return [];
    return data.customItems as Highlight[];
  } catch {
    return [];
  }
}

export async function putHighlightCustom(items: Highlight[]): Promise<void> {
  const base = getPublicApiBase();
  const token = readAdminToken();
  if (!base || !token) {
    throw new Error("Not signed in");
  }
  const res = await fetch(`${base}/api/site/highlights`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ customItems: items }),
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    throw new Error(data.message || `Save failed (${res.status})`);
  }
}

/** Uploads a highlight image; returns absolute URL for `imageSrc`. */
export async function uploadHighlightAsset(file: File): Promise<string> {
  const base = getPublicApiBase();
  const token = readAdminToken();
  if (!base || !token) {
    throw new Error("Not signed in");
  }
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${base}/api/site/highlight-asset`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = (await res.json().catch(() => ({}))) as { filename?: string; message?: string };
  if (!res.ok || !data.filename) {
    throw new Error(data.message || "Image upload failed");
  }
  return `${base}/api/site/highlight-asset/${data.filename}`;
}

/** If `imageSrc` points at our highlight-asset API, delete that file (admin token). */
export async function deleteHighlightAssetByUrl(imageSrc: string): Promise<void> {
  const base = getPublicApiBase();
  const token = readAdminToken();
  if (!base || !token) return;
  const marker = "/api/site/highlight-asset/";
  const i = imageSrc.indexOf(marker);
  if (i === -1) return;
  const name = imageSrc.slice(i + marker.length).split("?")[0];
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i.test(name)) {
    return;
  }
  await fetch(`${base}/api/site/highlight-asset/${encodeURIComponent(name)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
