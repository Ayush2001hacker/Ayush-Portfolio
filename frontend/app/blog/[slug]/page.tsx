import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";
import { getBlogMarkdown } from "@/lib/blog-content";
import { portfolioReturnFromBlogHref } from "@/lib/blog-nav";
import { blogPosts } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.filter((p) => p.slug).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Blog" };
  return {
    title: `${post.title} · Ayush`,
    description: post.summary ?? post.title,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post?.slug) notFound();

  const markdown = getBlogMarkdown(slug);
  if (!markdown) notFound();

  return (
    <div className="min-h-dvh bg-[var(--ig-bg)] text-[var(--ig-text)]">
      <header className="border-b border-[var(--ig-border)] bg-[var(--ig-surface)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
          <Link
            href={portfolioReturnFromBlogHref(post.slug)}
            className="text-sm font-semibold text-[var(--ig-link)] hover:underline"
          >
            ← Back
          </Link>
          {post.date && (
            <span className="text-xs font-medium text-[var(--ig-text-muted)]">
              {post.date}
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <BlogArticleBody post={post} markdown={markdown} />
      </main>
    </div>
  );
}
