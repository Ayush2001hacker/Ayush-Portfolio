"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/lib/site-content";
import { blogPosts } from "@/lib/site-content";
import { useInteractionTarget } from "@/lib/interactions/hooks";
import { BlogModal } from "./BlogModal";
import { IgFeedTile } from "./IgFeedTile";

function BlogGridTile({
  post,
  index,
  onOpen,
  onBurst,
}: {
  post: BlogPost;
  index: number;
  onOpen: () => void;
  onBurst: (id: string, x: number, y: number) => void;
}) {
  const { liked, likeCount, toggleLike } = useInteractionTarget("blog", post.id);
  const lastTapRef = useRef(0);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const now = Date.now();
      const prev = lastTapRef.current ?? 0;
      if (now - prev < 320) {
        if (openTimerRef.current) {
          clearTimeout(openTimerRef.current);
          openTimerRef.current = null;
        }
        lastTapRef.current = 0;
        toggleLike();
        onBurst(post.id, e.clientX, e.clientY);
        return;
      }
      lastTapRef.current = now;
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;
        onOpen();
      }, 280);
    },
    [onBurst, onOpen, post.id, toggleLike],
  );

  return (
    <IgFeedTile
      index={index}
      topLabel={post.date ?? "Blog"}
      bottomTitle={post.title}
      overlayCaption={post.title}
      repositoryImageSrc={post.feedThumbSrc}
      liked={liked}
      likeCount={likeCount}
      ariaLabel={`Open preview for ${post.title}. Double-tap to like.`}
      onClick={onClick}
    />
  );
}

export function BlogsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);
  const [burst, setBurst] = useState<{ id: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const slug = searchParams.get("blog");
    if (!slug) return;
    const post = blogPosts.find((p) => p.slug === slug || p.id === slug);
    if (post) setOpenPost(post);
  }, [searchParams]);

  const clearBlogDeepLink = useCallback(() => {
    if (!searchParams.has("blog") && searchParams.get("nav") !== "blogs") return;
    const next = new URLSearchParams(searchParams.toString());
    next.delete("blog");
    next.delete("nav");
    const q = next.toString();
    router.replace(q ? `/?${q}` : "/", { scroll: false });
  }, [router, searchParams]);

  const closeModal = useCallback(() => {
    setOpenPost(null);
    clearBlogDeepLink();
  }, [clearBlogDeepLink]);

  const onBurst = useCallback((id: string, x: number, y: number) => {
    setBurst({ id, x, y });
    window.setTimeout(() => setBurst(null), 900);
  }, []);

  return (
    <div>
      <div className="border-b border-[var(--ig-border)] bg-[var(--ig-bg)] px-2 py-2 text-center text-[11px] leading-snug text-[var(--ig-text-secondary)] lg:bg-[var(--ig-elevated)]/40 lg:text-xs">
        Articles on this site — tap a tile for a preview. Double-tap to like.
      </div>

      {blogPosts.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-[var(--ig-text-muted)] lg:px-0">
          New posts will appear here soon.
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-3 gap-[2px] bg-[var(--ig-bg)] pb-8 lg:grid-cols-4 lg:gap-2 lg:bg-transparent lg:pb-10 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-2.5"
          >
            <AnimatePresence mode="popLayout">
              {blogPosts.map((post, index) => (
                <BlogGridTile
                  key={post.id}
                  post={post}
                  index={index}
                  onOpen={() => {
                    setOpenPost(post);
                    clearBlogDeepLink();
                  }}
                  onBurst={onBurst}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {burst && (
            <span
              key={`${burst.id}-${burst.x}-${burst.y}`}
              className="ig-heart-burst pointer-events-none fixed z-[70] text-5xl text-[var(--ig-like)]"
              style={{ left: burst.x, top: burst.y }}
              aria-hidden
            >
              ♥
            </span>
          )}
        </>
      )}

      <BlogModal
        post={openPost}
        onClose={closeModal}
        onLeaveForArticle={() => setOpenPost(null)}
      />
    </div>
  );
}
