"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/lib/site-content";
import { BottomNav, type NavKey } from "./BottomNav";
import { ContactView } from "./ContactView";
import { DesktopSidebar } from "./DesktopSidebar";
import { DesktopTopBar } from "./DesktopTopBar";
import { HighlightsStrip } from "./HighlightsStrip";
import { BlogsView } from "./BlogsView";
import { ProfileHeader } from "./ProfileHeader";
import { AdminView } from "./AdminView";
import { ProjectFeed } from "./ProjectFeed";
import { StackView } from "./StackView";
import { TopBar } from "./TopBar";
import { useResumeHref } from "@/components/providers/ResumeHrefContext";
import { useIgTheme } from "./useIgTheme";

const titles: Record<NavKey, string> = {
  home: "Ayush",
  stack: "Stack",
  blogs: "Blogs",
  contact: "Contact",
  admin: "Admin",
};

function Section({ nav, projectQuery = "" }: { nav: NavKey; projectQuery?: string }) {
  return (
    <AnimatePresence mode="wait">
      {nav === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <ProfileHeader profile={profile} />
          <HighlightsStrip />
          <ProjectFeed filterQuery={projectQuery} />
        </motion.div>
      )}
      {nav === "stack" && (
        <motion.div
          key="stack"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <StackView />
        </motion.div>
      )}
      {nav === "blogs" && (
        <motion.div
          key="blogs"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <BlogsView />
        </motion.div>
      )}
      {nav === "admin" && (
        <motion.div
          key="admin"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <AdminView />
        </motion.div>
      )}
      {nav === "contact" && (
        <motion.div
          key="contact"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <ContactView />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PortfolioApp() {
  const { resumeHref } = useResumeHref();
  const { theme, toggle } = useIgTheme();
  const searchParams = useSearchParams();
  const [nav, setNav] = useState<NavKey>("home");
  const [deskQuery, setDeskQuery] = useState("");

  useEffect(() => {
    const blog = searchParams.get("blog");
    const navParam = searchParams.get("nav");
    if (blog || navParam === "blogs") {
      setNav("blogs");
    }
  }, [searchParams]);

  useEffect(() => {
    if (nav !== "home") setDeskQuery("");
  }, [nav]);

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--ig-bg)] text-[var(--ig-text)] lg:flex-row lg:bg-[var(--ig-desktop-canvas)]">
      <DesktopSidebar active={nav} onChange={setNav} />

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <div className="hidden lg:block">
          <DesktopTopBar
            theme={theme}
            onToggleTheme={toggle}
            query={deskQuery}
            onQueryChange={setDeskQuery}
            resumeHref={resumeHref}
            onContact={() => setNav("contact")}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:bg-[var(--ig-surface)]">
          <div className="mx-auto w-full max-w-lg sm:my-4 sm:min-h-[calc(100dvh-2rem)] sm:overflow-hidden sm:rounded-2xl sm:ring-1 sm:ring-[var(--ig-border)] sm:shadow-2xl lg:mx-0 lg:my-0 lg:max-w-none lg:rounded-none lg:ring-0 lg:shadow-none lg:w-full lg:px-4 xl:px-6 2xl:px-8">
            <div className="lg:hidden">
              <TopBar title={titles[nav]} theme={theme} onToggleTheme={toggle} />
            </div>

            <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-12">
              <Section nav={nav} projectQuery={deskQuery} />
            </div>
          </div>
        </div>

        <BottomNav active={nav} onChange={setNav} className="lg:hidden" />
      </div>
    </div>
  );
}
