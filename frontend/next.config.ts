import type { NextConfig } from "next";

type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  pathname: string;
  port?: string;
};

/** Allow optimized loading of profile photo, highlight assets, etc. from the public API. */
function siteApiRemotePatterns(): RemotePattern[] {
  const patterns: RemotePattern[] = [
    { protocol: "http", hostname: "localhost", port: "5001", pathname: "/api/site/**" },
    { protocol: "http", hostname: "127.0.0.1", port: "5001", pathname: "/api/site/**" },
  ];
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return patterns;
  try {
    const u = new URL(raw.replace(/\/$/, ""));
    const protocol = u.protocol === "https:" ? "https" : "http";
    const entry: RemotePattern = {
      protocol,
      hostname: u.hostname,
      pathname: "/api/site/**",
      ...(u.port ? { port: u.port } : {}),
    };
    const key = `${entry.protocol}://${entry.hostname}:${entry.port ?? ""}`;
    const dup = patterns.some((p) => `${p.protocol}://${p.hostname}:${p.port ?? ""}` === key);
    if (!dup) patterns.push(entry);
  } catch {
    /* ignore invalid env */
  }
  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: siteApiRemotePatterns(),
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
