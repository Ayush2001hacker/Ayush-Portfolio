import { randomUUID } from "node:crypto";
import { existsSync, readdirSync, renameSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { RESUME_FS_PATH, UPLOADS_DIR } from "../config/resumeStorage.js";
import { HIGHLIGHT_ASSETS_DIR } from "./highlightPersistence.js";

export const TMP_RESUME = "resume.tmp";
export const TMP_PROFILE = "profile.tmp";

const PROFILE_EXT_MIME = [
  ["jpg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
];

export function resumeMeta() {
  if (!existsSync(RESUME_FS_PATH)) {
    return { available: false, updatedAt: null };
  }
  const st = statSync(RESUME_FS_PATH);
  return { available: true, updatedAt: st.mtimeMs };
}

export function profilePhotoMeta() {
  for (const [ext] of PROFILE_EXT_MIME) {
    const p = join(UPLOADS_DIR, `profile-photo.${ext}`);
    if (existsSync(p)) {
      const st = statSync(p);
      return { available: true, updatedAt: st.mtimeMs };
    }
  }
  return { available: false, updatedAt: null };
}

export function profilePhotoDiskPath() {
  for (const [ext, mime] of PROFILE_EXT_MIME) {
    const p = join(UPLOADS_DIR, `profile-photo.${ext}`);
    if (existsSync(p)) return { path: p, mime };
  }
  return null;
}

export function removeExistingProfilePhotos() {
  for (const name of readdirSync(UPLOADS_DIR)) {
    if (name.startsWith("profile-photo.")) {
      try {
        unlinkSync(join(UPLOADS_DIR, name));
      } catch {
        /* ignore */
      }
    }
  }
}

export function extForImageMime(mimetype) {
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  return "jpg";
}

export function mimeFromHighlightAssetName(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export function isHighlightAssetFilename(name) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i.test(name);
}

export function finalizeHighlightAssetSync(tmpPath, mimetype) {
  const ext = extForImageMime(mimetype);
  const id = randomUUID();
  const finalName = `${id}.${ext}`;
  const finalPath = join(HIGHLIGHT_ASSETS_DIR, finalName);
  renameSync(tmpPath, finalPath);
  return finalName;
}

export function finalizeResumeUploadSync() {
  const tmp = join(UPLOADS_DIR, TMP_RESUME);
  if (!existsSync(tmp)) {
    throw new Error("Upload temp file missing");
  }
  if (existsSync(RESUME_FS_PATH)) {
    try {
      unlinkSync(RESUME_FS_PATH);
    } catch {
      /* ignore */
    }
  }
  renameSync(tmp, RESUME_FS_PATH);
}

export function finalizeProfileUploadSync(mimetype) {
  const tmp = join(UPLOADS_DIR, TMP_PROFILE);
  if (!existsSync(tmp)) {
    throw new Error("Upload temp file missing");
  }
  removeExistingProfilePhotos();
  const ext = extForImageMime(mimetype);
  renameSync(tmp, join(UPLOADS_DIR, `profile-photo.${ext}`));
  return join(UPLOADS_DIR, `profile-photo.${ext}`);
}
