import type { NavKey } from "@/lib/navigation/types";
import {
  blogPosts,
  certifications,
  experienceRoles,
  portfolioWorkItems,
  profile,
  projects,
  stackSections,
} from "@/lib/site-content";

export type GlobalSearchPick =
  | { kind: "repository"; id: string }
  | { kind: "blog"; id: string; slug: string }
  | { kind: "portfolioWork"; id: string }
  | { kind: "certification"; id: string }
  | { kind: "experience"; id: string }
  | { kind: "stack" }
  | { kind: "profile" }
  | { kind: "contact" };

export type GlobalSearchHit = {
  key: string;
  category: string;
  title: string;
  subtitle: string;
  nav: NavKey;
  pick: GlobalSearchPick;
};

function join(...parts: (string | undefined | null | string[])[]): string {
  const flat: string[] = [];
  for (const p of parts) {
    if (p == null) continue;
    if (Array.isArray(p)) flat.push(...p.filter(Boolean).map(String));
    else flat.push(String(p));
  }
  return flat.join(" ").toLowerCase();
}

function matches(haystack: string, q: string): boolean {
  if (!q) return false;
  return haystack.includes(q);
}

/** Client-side search across static site content (repos, work, certs, experience, blogs, stack, profile). */
export function searchSiteContent(query: string, limit = 16): GlobalSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const hits: GlobalSearchHit[] = [];

  const profileHay = join(
    profile.name,
    profile.fullName,
    profile.handle,
    profile.title,
    profile.bio,
    profile.location,
  );
  if (matches(profileHay, q)) {
    hits.push({
      key: "profile",
      category: "Profile",
      title: profile.name,
      subtitle: profile.title,
      nav: "home",
      pick: { kind: "profile" },
    });
  }

  for (const p of projects) {
    const hay = join(p.title, p.subtitle, p.description, p.tags, p.year);
    if (!matches(hay, q)) continue;
    hits.push({
      key: `repo:${p.id}`,
      category: "Repository",
      title: p.title,
      subtitle: p.subtitle || p.description.slice(0, 80),
      nav: "home",
      pick: { kind: "repository", id: p.id },
    });
  }

  for (const item of portfolioWorkItems) {
    const hay = join(item.title, item.period, item.description);
    if (!matches(hay, q)) continue;
    hits.push({
      key: `work:${item.id}`,
      category: "Project",
      title: item.title,
      subtitle: item.period,
      nav: "home",
      pick: { kind: "portfolioWork", id: item.id },
    });
  }

  for (const c of certifications) {
    const hay = join(c.title, c.year, c.ctaLabel);
    if (!matches(hay, q)) continue;
    hits.push({
      key: `cert:${c.id}`,
      category: "Certification",
      title: c.title,
      subtitle: c.year,
      nav: "home",
      pick: { kind: "certification", id: c.id },
    });
  }

  for (const role of experienceRoles) {
    const hay = join(role.title, role.company, role.period, role.bullets);
    if (!matches(hay, q)) continue;
    hits.push({
      key: `exp:${role.id}`,
      category: "Experience",
      title: role.title,
      subtitle: `${role.company} · ${role.period}`,
      nav: "home",
      pick: { kind: "experience", id: role.id },
    });
  }

  for (const post of blogPosts) {
    const hay = join(post.title, post.date, post.summary, post.slug, post.id);
    if (!matches(hay, q)) continue;
    const slug = post.slug ?? post.id;
    hits.push({
      key: `blog:${post.id}`,
      category: "Blog",
      title: post.title,
      subtitle: post.summary?.slice(0, 90) ?? (post.date ?? "Article"),
      nav: "blogs",
      pick: { kind: "blog", id: post.id, slug },
    });
  }

  let stackHit = false;
  for (const sec of stackSections) {
    const hay = join(sec.title, sec.body);
    if (!matches(hay, q)) continue;
    stackHit = true;
    break;
  }
  if (stackHit) {
    hits.push({
      key: "stack",
      category: "Stack",
      title: "Technologies & practices",
      subtitle: "Core stack page",
      nav: "stack",
      pick: { kind: "stack" },
    });
  }

  const contactHay = join("contact", "email", "linkedin", "github", "phone", "resume", "message");
  if (matches(contactHay, q)) {
    hits.push({
      key: "contact",
      category: "Contact",
      title: "Contact",
      subtitle: "Email, social links, resume",
      nav: "contact",
      pick: { kind: "contact" },
    });
  }

  return hits.slice(0, limit);
}
