"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { navHomeBrandTitle, profile } from "@/lib/site-content";
import { searchSiteContent, type GlobalSearchHit } from "@/lib/globalSearch";
import { BottomNav, type NavKey } from "./BottomNav";
import { ContactView } from "./ContactView";
import { DesktopSidebar } from "./DesktopSidebar";
import { DesktopTopBar } from "./DesktopTopBar";
import { GlobalSearchOverlay } from "./GlobalSearchOverlay";
import { HighlightsStrip } from "./HighlightsStrip";
import { BlogsView } from "./BlogsView";
import { ProfileHeader } from "./ProfileHeader";
import { AdminView } from "./AdminView";
import { ProjectFeed, type ProjectFeedHomeDock } from "./ProjectFeed";
import { StackView } from "./StackView";
import { TopBar } from "./TopBar";
import { useIgTheme } from "./useIgTheme";

const titles: Record<NavKey, string> = {
  home: navHomeBrandTitle,
  stack: "Stack",
  blogs: "Blogs",
  contact: "Contact",
  admin: "Admin",
};

function Section({
  nav,
  feedDock,
  onFeedDockConsumed,
}: {
  nav: NavKey;
  feedDock?: ProjectFeedHomeDock | null;
  onFeedDockConsumed?: () => void;
}) {
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
          <ProjectFeed
            initialDock={feedDock ?? null}
            onInitialDockConsumed={onFeedDockConsumed}
          />
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
  const router = useRouter();
  const { theme, toggle } = useIgTheme();
  const searchParams = useSearchParams();
  const [nav, setNav] = useState<NavKey>("home");
  const [deskQuery, setDeskQuery] = useState("");
  const [feedDock, setFeedDock] = useState<ProjectFeedHomeDock | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchHits = useMemo(
    () => searchSiteContent(deskQuery, 24),
    [deskQuery],
  );

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setDeskQuery("");
  }, []);

  const onSearchPick = useCallback(
    (hit: GlobalSearchHit) => {
      setDeskQuery("");
      switch (hit.pick.kind) {
        case "repository":
          setNav("home");
          setFeedDock({ tab: "repositories", openRepositoryId: hit.pick.id });
          break;
        case "portfolioWork":
          setNav("home");
          setFeedDock({ tab: "projects", openWorkId: hit.pick.id });
          break;
        case "certification":
          setNav("home");
          setFeedDock({ tab: "certifications", openCertId: hit.pick.id });
          break;
        case "experience":
          setNav("home");
          setFeedDock({ tab: "experience", openExpId: hit.pick.id });
          break;
        case "blog":
          router.push(`/?blog=${encodeURIComponent(hit.pick.slug)}`, {
            scroll: false,
          });
          setNav("blogs");
          break;
        case "stack":
          setNav("stack");
          break;
        case "profile":
          setNav("home");
          break;
        case "contact":
          setNav("contact");
          break;
        default:
          break;
      }
    },
    [router],
  );

  const onFeedDockConsumed = useCallback(() => {
    setFeedDock(null);
  }, []);

  useEffect(() => {
    const blog = searchParams.get("blog");
    const navParam = searchParams.get("nav");
    if (blog || navParam === "blogs") {
      setNav("blogs");
    }
  }, [searchParams]);

  useEffect(() => {
    if (nav !== "home") setFeedDock(null);
  }, [nav]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => {
          if (prev) {
            setDeskQuery("");
            return false;
          }
          return true;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--ig-bg)] text-[var(--ig-text)] lg:flex-row lg:bg-[var(--ig-desktop-canvas)]">
      <DesktopSidebar active={nav} onChange={setNav} />

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <div className="hidden lg:block">
          <DesktopTopBar
            theme={theme}
            onToggleTheme={toggle}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:bg-[var(--ig-surface)]">
          <div className="mx-auto w-full max-w-lg sm:my-4 sm:min-h-[calc(100dvh-2rem)] sm:overflow-hidden sm:rounded-2xl sm:ring-1 sm:ring-[var(--ig-border)] sm:shadow-2xl lg:mx-0 lg:my-0 lg:max-w-none lg:rounded-none lg:ring-0 lg:shadow-none lg:w-full lg:px-4 xl:px-6 2xl:px-8">
            <div className="lg:hidden">
              <TopBar
                title={titles[nav]}
                theme={theme}
                onToggleTheme={toggle}
                onOpenSearch={() => setSearchOpen(true)}
              />
            </div>

            <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-12">
              <Section
                nav={nav}
                feedDock={feedDock}
                onFeedDockConsumed={onFeedDockConsumed}
              />
            </div>
          </div>
        </div>

        <BottomNav active={nav} onChange={setNav} className="lg:hidden" />

        <GlobalSearchOverlay
          open={searchOpen}
          onClose={closeSearch}
          query={deskQuery}
          onQueryChange={setDeskQuery}
          hits={searchHits}
          onPick={onSearchPick}
        />
      </div>
    </div>
  );
}
