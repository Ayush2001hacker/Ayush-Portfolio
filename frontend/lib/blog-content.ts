import fs from "node:fs";
import path from "node:path";

const blogDir = path.join(process.cwd(), "content", "blogs");

export function getBlogMarkdown(slug: string): string | null {
  const file = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}
