"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="mb-4 mt-0 text-2xl font-bold tracking-tight text-[var(--ig-text)]" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mb-3 mt-10 border-b border-[var(--ig-border)] pb-2 text-xl font-semibold text-[var(--ig-text)] first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-2 mt-6 text-lg font-semibold text-[var(--ig-text)]" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 text-[15px] leading-relaxed text-[var(--ig-text)] last:mb-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 list-disc space-y-1 pl-5 text-[15px] text-[var(--ig-text)]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 list-decimal space-y-1 pl-5 text-[15px] text-[var(--ig-text)]" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed text-[var(--ig-text-secondary)] marker:text-[var(--ig-text-muted)]" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-[var(--ig-text)]" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-[var(--ig-text)]" {...props}>
      {children}
    </em>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="font-medium text-[var(--ig-link)] underline-offset-2 hover:underline"
      {...(href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-4 border-l-4 border-[var(--ig-link)] bg-[var(--ig-bg)] py-2 pl-4 pr-3 text-[15px] text-[var(--ig-text-secondary)]"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-0 border-t border-[var(--ig-border)]" />,
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className?.includes("language-"));
    if (isBlock) {
      return (
        <code className={`block w-full font-mono text-[13px] leading-relaxed ${className ?? ""}`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-[var(--ig-bg)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--ig-text)] ring-1 ring-[var(--ig-border)]"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="mb-4 overflow-x-auto rounded-xl bg-[#0d1117] p-4 text-[13px] leading-relaxed text-zinc-100 ring-1 ring-[var(--ig-border)]"
      {...props}
    >
      {children}
    </pre>
  ),
};

type Props = { source: string };

export function BlogMarkdown({ source }: Props) {
  return (
    <article className="blog-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </article>
  );
}
