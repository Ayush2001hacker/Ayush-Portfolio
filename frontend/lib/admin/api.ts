import { getPublicApiBase } from "@/lib/apiBase";

type LoginJson = { accessToken?: string; message?: string; error?: string };

export async function adminLogin(email: string, password: string): Promise<{ token: string }> {
  const base = getPublicApiBase();
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  const res = await fetch(`${base}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const data = (await res.json().catch(() => ({}))) as LoginJson;
  if (!res.ok) {
    const msg = data.message ?? data.error ?? `Login failed (${res.status})`;
    throw new Error(msg);
  }
  if (!data.accessToken) throw new Error("Invalid response from server");
  return { token: data.accessToken };
}

export async function adminMe(token: string): Promise<boolean> {
  const base = getPublicApiBase();
  if (!base || !token) return false;
  const res = await fetch(`${base}/api/users/current`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}
