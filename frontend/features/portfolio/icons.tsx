export function IconHome({ active }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "fill-[var(--ig-nav)]" : "fill-none stroke-[var(--ig-nav)]"}
      strokeWidth={active ? 0 : 1.75}
    >
      {active ? (
        <path d="M22 10.5L12 3L2 10.5V21h7v-6h6v6h7V10.5z" />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5z"
        />
      )}
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

export function IconArticle() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5h16v14H4zM8 3v4M16 3v4M8 11h8M8 15h5"
      />
    </svg>
  );
}

export function IconUser({ active }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "fill-[var(--ig-nav)]" : "stroke-[var(--ig-nav)]"}
      strokeWidth={active ? 0 : 1.75}
    >
      {active ? (
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.33 0-6 1.34-6 3v1h12v-1c0-1.66-2.67-3-6-3z" />
      ) : (
        <>
          <circle cx="12" cy="8" r="4" />
          <path strokeLinecap="round" d="M6 20v-1c0-2 2.5-3.5 6-3.5s6 1.5 6 3.5v1" />
        </>
      )}
    </svg>
  );
}

export function IconSend() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

export function IconGrid({ active }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "fill-[var(--ig-nav)]" : "stroke-[var(--ig-nav)]"}
      strokeWidth={active ? 0 : 1.75}
    >
      {active ? (
        <path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z" />
      ) : (
        <>
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
        </>
      )}
    </svg>
  );
}

export function IconPin({ active }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "fill-[var(--ig-nav)]" : "stroke-[var(--ig-nav)]"}
      strokeWidth={active ? 0 : 1.75}
    >
      {active ? (
        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12zM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      )}
    </svg>
  );
}

export function IconLayers({ active }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "fill-[var(--ig-nav)]" : "stroke-[var(--ig-nav)]"}
      strokeWidth={active ? 0 : 1.75}
    >
      {active ? (
        <path d="M12 2l10 5-10 5L2 7l10-5zm0 10l9.5 4.75L12 22l-9.5-5.25L12 12zm0 4.5L19.25 19 12 22l-7.25-3L12 16.5z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l10 5-10 5L2 7l10-5zm0 10l9.5 4.75L12 22l-9.5-5.25L12 12z" />
      )}
    </svg>
  );
}

export function IconTag({ active }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "fill-[var(--ig-nav)]" : "stroke-[var(--ig-nav)]"}
      strokeWidth={active ? 0 : 1.75}
    >
      {active ? (
        <path d="M3 5v6l9 9 9-9V5H3zm4.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v6l9 9 9-9V5H3zm4.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
      )}
    </svg>
  );
}

export function IconMoon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function IconSun() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function IconHeart({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  );
}

export function IconComment({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IconCompose({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function IconShare() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}

export function IconBriefcase({ active }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "fill-[var(--ig-nav)]" : "stroke-[var(--ig-nav)]"}
      strokeWidth={active ? 0 : 1.75}
    >
      {active ? (
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3zm4 0V5h-4v2h4z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 9h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" />
      )}
    </svg>
  );
}

export function IconCertificate({ active }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "fill-[var(--ig-nav)]" : "stroke-[var(--ig-nav)]"}
      strokeWidth={active ? 0 : 1.75}
    >
      {active ? (
        <path d="M4 4h16v16H4V4zm4 4h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm4 4h8M8 12h8M8 16h5" />
      )}
    </svg>
  );
}

export function IconLinkedIn() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#0A66C2]">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function IconGitHub() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--ig-text)]">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.481A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export function IconPhone() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}

export function IconMail() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconPlus({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      className={className ?? "text-[var(--ig-text)]"}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconPencil({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "text-white"}
    >
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

/** Filled link-colored circle with white check — simple verified indicator. */
export function IconInstagramVerified({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className ?? "h-5 w-5 shrink-0 text-[var(--ig-link)]"}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.4 12.2 10.8 15.6 16.8 8.6"
      />
    </svg>
  );
}
