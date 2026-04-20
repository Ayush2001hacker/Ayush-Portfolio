import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Directory for uploaded site assets (resume PDF). */
export const UPLOADS_DIR = join(__dirname, "..", "..", "uploads");

/** Single canonical resume file on disk (replaced on each upload). */
export const RESUME_FILENAME = "resume.pdf";
export const RESUME_FS_PATH = join(UPLOADS_DIR, RESUME_FILENAME);

export function ensureUploadsDir() {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}
