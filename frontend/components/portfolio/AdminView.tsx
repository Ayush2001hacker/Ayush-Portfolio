"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useResumeHref } from "@/components/providers/ResumeHrefContext";
import { uploadResumePdf } from "@/lib/admin/siteUploadApi";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { PermissionDeniedWrap } from "./PermissionDeniedWrap";
import { fetchSiteSettings, type SiteSettingsResponse } from "@/lib/site/siteSettingsApi";
import { RESUME_PDF } from "@/lib/site-content";

function AdminResumeSection() {
  const { isAdmin, authReady } = useAdminAuth();
  const { resumeHref, refreshResume } = useResumeHref();
  const [settings, setSettings] = useState<SiteSettingsResponse | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSettings = useCallback(async () => {
    try {
      setSettings(await fetchSiteSettings());
      setStatusError(null);
    } catch {
      setStatusError("Could not load resume status from the API.");
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const onPickFile = useCallback(() => {
    setUploadError(null);
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setUploadError(null);
      setUploading(true);
      try {
        await uploadResumePdf(file);
        await refreshResume();
        await loadSettings();
        window.dispatchEvent(new Event("site-settings-changed"));
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [loadSettings, refreshResume],
  );

  const usingApiResume = Boolean(settings?.resumeAvailable);
  const builtInLabel = RESUME_PDF.replace(/^\//, "");

  return (
    <section
      className="mt-8 border-t border-[var(--ig-border)] pt-6 text-left"
      aria-labelledby="admin-resume-heading"
    >
      <h2 id="admin-resume-heading" className="text-sm font-bold uppercase tracking-wide text-[var(--ig-text)]">
        Resume
      </h2>
      <p className="mt-1 text-xs text-[var(--ig-text-secondary)]">
        PDF served from the API when uploaded; otherwise visitors use the built-in file{" "}
        <span className="font-mono text-[var(--ig-text-muted)]">{builtInLabel}</span> from the site.
      </p>

      {statusError ? (
        <p className="mt-3 text-xs font-medium text-rose-600" role="alert">
          {statusError}
        </p>
      ) : null}

      <div className="mt-4 rounded-xl border border-[var(--ig-border)] bg-[var(--ig-bg)] p-4">
        <p className="text-xs font-semibold text-[var(--ig-text-secondary)]">Active resume</p>
        <p className="mt-1 text-sm font-medium text-[var(--ig-text)]">
          {usingApiResume ? "Uploaded PDF (API)" : `Built-in (${builtInLabel})`}
        </p>
        <a
          href={resumeHref}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm font-semibold text-[var(--ig-link)] hover:underline"
        >
          Open in new tab
        </a>
        {settings?.updatedAt != null ? (
          <p className="mt-2 text-[11px] text-[var(--ig-text-muted)]">
            Last upload: {new Date(settings.updatedAt).toLocaleString()}
          </p>
        ) : null}
      </div>

      <PermissionDeniedWrap allowed={Boolean(isAdmin)} authReady={authReady}>
        <div className="mt-4">
          {isAdmin ? (
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={onFileChange}
            />
          ) : null}
          <button
            type="button"
            onClick={onPickFile}
            disabled={uploading}
            className="rounded-lg bg-[var(--ig-link)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uploading ? "Uploading…" : "Upload new PDF"}
          </button>
          <p className="mt-2 text-[11px] text-[var(--ig-text-muted)]">Max 12 MB. Replaces the current API resume.</p>
          {uploadError ? (
            <p className="mt-2 text-xs font-medium text-rose-600" role="alert">
              {uploadError}
            </p>
          ) : null}
        </div>
      </PermissionDeniedWrap>
    </section>
  );
}

export function AdminView() {
  const { isAdmin, login, logout } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setPending(true);
      try {
        await login(email, password);
        setPassword("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not sign in");
      } finally {
        setPending(false);
      }
    },
    [email, login, password],
  );

  return (
    <div className="min-h-[40vh] px-4 py-6 lg:px-0" aria-label="Admin">
      <div className="mx-auto max-w-sm rounded-2xl border border-[var(--ig-border)] bg-[var(--ig-surface)] p-6 shadow-sm">
        <h1 className="text-center text-lg font-bold text-[var(--ig-text)]">Admin</h1>
        <p className="mt-1 text-center text-xs text-[var(--ig-text-secondary)]">
          Email and password — same flow as your other app (POST /api/users/login, Bearer token, GET
          /api/users/current). No sign-up.
        </p>

        {isAdmin ? (
          <div className="mt-6 space-y-4 text-center">
            <p className="text-sm font-medium text-[var(--ig-text)]">You are signed in.</p>
            <p className="text-xs text-[var(--ig-text-secondary)]">
              Welcome Admin and Log out appear in the top bar on every tab.
            </p>
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-lg border border-[var(--ig-border)] bg-[var(--ig-elevated)] py-2.5 text-sm font-semibold text-[var(--ig-text)] hover:bg-[var(--ig-border)]/30"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="admin-email" className="mb-1 block text-xs font-semibold text-[var(--ig-text-secondary)]">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="admin@portfolio.local"
                className="w-full rounded-lg border border-[var(--ig-border)] bg-[var(--ig-bg)] px-3 py-2.5 text-sm text-[var(--ig-text)] outline-none ring-[var(--ig-link)] placeholder:text-[var(--ig-text-muted)] focus:ring-2"
                disabled={pending}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-xs font-semibold text-[var(--ig-text-secondary)]">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-[var(--ig-border)] bg-[var(--ig-bg)] px-3 py-2.5 text-sm text-[var(--ig-text)] outline-none ring-[var(--ig-link)] placeholder:text-[var(--ig-text-muted)] focus:ring-2"
                disabled={pending}
              />
            </div>
            {error ? (
              <p className="text-center text-xs font-medium text-rose-600" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending || !email.trim() || !password.trim()}
              className="w-full rounded-lg bg-[var(--ig-link)] py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}

        <AdminResumeSection />
      </div>
    </div>
  );
}
