import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import multer from "multer";
import { ensureUploadsDir, UPLOADS_DIR } from "./resumeStorage.js";
import { HIGHLIGHT_ASSETS_DIR } from "../services/highlightPersistence.js";
import { TMP_PROFILE, TMP_RESUME } from "../services/site-upload.service.js";

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, _file, cb) => cb(null, TMP_RESUME),
});

export const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

const profileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, _file, cb) => cb(null, TMP_PROFILE),
});

export const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error("Only JPEG, PNG, or WebP images are allowed"));
  },
});

const highlightAssetStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    mkdirSync(HIGHLIGHT_ASSETS_DIR, { recursive: true });
    cb(null, HIGHLIGHT_ASSETS_DIR);
  },
  filename: (_req, _file, cb) => {
    cb(null, `tmp-${randomUUID()}`);
  },
});

export const highlightAssetUpload = multer({
  storage: highlightAssetStorage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error("Only JPEG, PNG, or WebP images are allowed"));
  },
});
