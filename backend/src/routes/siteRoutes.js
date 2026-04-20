import { Router } from "express";
import { randomUUID } from "node:crypto";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";
import multer from "multer";
import { ensureUploadsDir, RESUME_FS_PATH, UPLOADS_DIR } from "../config/resumeStorage.js";
import {
  HIGHLIGHT_ASSETS_DIR,
  readCustomHighlightsFromDisk,
  writeCustomHighlightsToDisk,
} from "../highlights/highlightPersistence.js";
import { validateTokenHandler } from "../middleware/validateTokenHandler.js";

const router = Router();

ensureUploadsDir();
mkdirSync(HIGHLIGHT_ASSETS_DIR, { recursive: true });

const TMP_RESUME = "resume.tmp";
const TMP_PROFILE = "profile.tmp";

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, _file, cb) => cb(null, TMP_RESUME),
});

const resumeUpload = multer({
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

const profileUpload = multer({
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

const highlightAssetUpload = multer({
  storage: highlightAssetStorage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error("Only JPEG, PNG, or WebP images are allowed"));
  },
});

function resumeMeta() {
  if (!existsSync(RESUME_FS_PATH)) {
    return { available: false, updatedAt: null };
  }
  const st = statSync(RESUME_FS_PATH);
  return { available: true, updatedAt: st.mtimeMs };
}

const PROFILE_EXT_MIME = [
  ["jpg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
];

function profilePhotoMeta() {
  for (const [ext] of PROFILE_EXT_MIME) {
    const p = join(UPLOADS_DIR, `profile-photo.${ext}`);
    if (existsSync(p)) {
      const st = statSync(p);
      return { available: true, updatedAt: st.mtimeMs };
    }
  }
  return { available: false, updatedAt: null };
}

function profilePhotoDiskPath() {
  for (const [ext, mime] of PROFILE_EXT_MIME) {
    const p = join(UPLOADS_DIR, `profile-photo.${ext}`);
    if (existsSync(p)) return { path: p, mime };
  }
  return null;
}

function removeExistingProfilePhotos() {
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

function extForImageMime(mimetype) {
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  return "jpg";
}

router.get("/settings", (_req, res) => {
  try {
    const resume = resumeMeta();
    const profile = profilePhotoMeta();
    return res.json({
      resumeAvailable: resume.available,
      updatedAt: resume.updatedAt,
      profilePhotoAvailable: profile.available,
      profilePhotoUpdatedAt: profile.updatedAt,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not read settings" });
  }
});

router.get("/resume", (_req, res) => {
  if (!existsSync(RESUME_FS_PATH)) {
    return res.status(404).json({ message: "No resume uploaded yet" });
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');
  res.setHeader("Cache-Control", "private, max-age=3600");
  createReadStream(RESUME_FS_PATH).pipe(res);
});

router.get("/profile-photo", (_req, res) => {
  const found = profilePhotoDiskPath();
  if (!found) {
    return res.status(404).json({ message: "No profile photo uploaded yet" });
  }
  res.setHeader("Content-Type", found.mime);
  res.setHeader("Cache-Control", "private, max-age=3600");
  createReadStream(found.path).pipe(res);
});

router.get("/highlights", (_req, res) => {
  try {
    const customItems = readCustomHighlightsFromDisk();
    return res.json({ customItems });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not load highlights" });
  }
});

router.put("/highlights", validateTokenHandler, (req, res) => {
  try {
    const raw = req.body?.customItems;
    if (!Array.isArray(raw)) {
      return res.status(400).json({ message: "Expected { customItems: Highlight[] }" });
    }
    writeCustomHighlightsToDisk(raw);
    return res.json({ ok: true, customItems: readCustomHighlightsFromDisk() });
  } catch (e) {
    return res.status(400).json({ message: e instanceof Error ? e.message : "Save failed" });
  }
});

function mimeFromHighlightAssetName(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function isHighlightAssetFilename(name) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i.test(name);
}

router.get("/highlight-asset/:name", (req, res) => {
  const name = req.params.name;
  if (!isHighlightAssetFilename(name)) {
    return res.status(400).json({ message: "Invalid asset name" });
  }
  const assetPath = join(HIGHLIGHT_ASSETS_DIR, name);
  if (!existsSync(assetPath)) {
    return res.status(404).json({ message: "Not found" });
  }
  res.setHeader("Content-Type", mimeFromHighlightAssetName(name));
  res.setHeader("Cache-Control", "public, max-age=86400");
  createReadStream(assetPath).pipe(res);
});

router.delete("/highlight-asset/:name", validateTokenHandler, (req, res) => {
  const name = req.params.name;
  if (!isHighlightAssetFilename(name)) {
    return res.status(400).json({ message: "Invalid asset name" });
  }
  const assetPath = join(HIGHLIGHT_ASSETS_DIR, name);
  if (!existsSync(assetPath)) {
    return res.status(204).end();
  }
  try {
    unlinkSync(assetPath);
    return res.status(204).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not delete file" });
  }
});

function finalizeHighlightAssetSync(tmpPath, mimetype) {
  const ext = extForImageMime(mimetype);
  const id = randomUUID();
  const finalName = `${id}.${ext}`;
  const finalPath = join(HIGHLIGHT_ASSETS_DIR, finalName);
  renameSync(tmpPath, finalPath);
  return finalName;
}

router.post("/highlight-asset", validateTokenHandler, (req, res) => {
  highlightAssetUpload.single("file")(req, res, (err) => {
    if (err) {
      const msg =
        err.code === "LIMIT_FILE_SIZE"
          ? "File too large (max 4 MB)"
          : err.message || "Upload failed";
      return res.status(400).json({ message: msg });
    }
    if (!req.file?.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    try {
      const filename = finalizeHighlightAssetSync(req.file.path, req.file.mimetype);
      return res.status(201).json({ filename });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Could not save image" });
    }
  });
});

function finalizeResumeUploadSync() {
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

router.post("/resume", validateTokenHandler, (req, res) => {
  resumeUpload.single("resume")(req, res, (err) => {
    if (err) {
      const msg =
        err.code === "LIMIT_FILE_SIZE"
          ? "File too large (max 12 MB)"
          : err.message || "Upload failed";
      return res.status(400).json({ message: msg });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    try {
      finalizeResumeUploadSync();
      const st = statSync(RESUME_FS_PATH);
      return res.status(201).json({ ok: true, updatedAt: st.mtimeMs });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Could not save resume" });
    }
  });
});

function finalizeProfileUploadSync(mimetype) {
  const tmp = join(UPLOADS_DIR, TMP_PROFILE);
  if (!existsSync(tmp)) {
    throw new Error("Upload temp file missing");
  }
  removeExistingProfilePhotos();
  const ext = extForImageMime(mimetype);
  renameSync(tmp, join(UPLOADS_DIR, `profile-photo.${ext}`));
  return join(UPLOADS_DIR, `profile-photo.${ext}`);
}

router.post("/profile-photo", validateTokenHandler, (req, res) => {
  profileUpload.single("photo")(req, res, (err) => {
    if (err) {
      const msg =
        err.code === "LIMIT_FILE_SIZE"
          ? "File too large (max 4 MB)"
          : err.message || "Upload failed";
      return res.status(400).json({ message: msg });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    try {
      const saved = finalizeProfileUploadSync(req.file.mimetype);
      const st = statSync(saved);
      return res.status(201).json({ ok: true, updatedAt: st.mtimeMs });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Could not save profile photo" });
    }
  });
});

export default router;
