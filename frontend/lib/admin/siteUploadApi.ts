import { getPublicApiBase } from "@/lib/apiBase";
import { readAdminToken } from "./token";

export async function uploadResumePdf(file: File): Promise<{ updatedAt: number }> {
  const base = getPublicApiBase();
  const token = readAdminToken();
  if (!base || !token) {
    throw new Error("Not signed in");
  }
  const body = new FormData();
  body.append("resume", file);

  const res = await fetch(`${base}/api/site/resume`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string; updatedAt?: number };
  if (!res.ok) {
    throw new Error(data.message || `Upload failed (${res.status})`);
  }
  if (typeof data.updatedAt !== "number") {
    throw new Error("Invalid response from server");
  }
  return { updatedAt: data.updatedAt };
}

export async function uploadProfilePhoto(file: File): Promise<{ updatedAt: number }> {
  const base = getPublicApiBase();
  const token = readAdminToken();
  if (!base || !token) {
    throw new Error("Not signed in");
  }
  const body = new FormData();
  body.append("photo", file);

  const res = await fetch(`${base}/api/site/profile-photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string; updatedAt?: number };
  if (!res.ok) {
    throw new Error(data.message || `Upload failed (${res.status})`);
  }
  if (typeof data.updatedAt !== "number") {
    throw new Error("Invalid response from server");
  }
  return { updatedAt: data.updatedAt };
}
