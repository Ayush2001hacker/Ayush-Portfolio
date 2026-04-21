import { createReadStream, existsSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { RESUME_FS_PATH } from "../config/resumeStorage.js";
import {
  highlightAssetUpload,
  profileUpload,
  resumeUpload,
} from "../config/siteMulter.js";
import {
  readCustomHighlightsFromDisk,
  writeCustomHighlightsToDisk,
  HIGHLIGHT_ASSETS_DIR,
} from "../services/highlightPersistence.js";
import {
  finalizeHighlightAssetSync,
  finalizeProfileUploadSync,
  finalizeResumeUploadSync,
  isHighlightAssetFilename,
  mimeFromHighlightAssetName,
  profilePhotoDiskPath,
  resumeMeta,
  profilePhotoMeta,
} from "../services/site-upload.service.js";

export function getSiteSettings(_req, res) {
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
}

export function getResumePdf(_req, res) {
  if (!existsSync(RESUME_FS_PATH)) {
    return res.status(404).json({ message: "No resume uploaded yet" });
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');
  res.setHeader("Cache-Control", "private, max-age=3600");
  createReadStream(RESUME_FS_PATH).pipe(res);
}

export function getProfilePhoto(_req, res) {
  const found = profilePhotoDiskPath();
  if (!found) {
    return res.status(404).json({ message: "No profile photo uploaded yet" });
  }
  res.setHeader("Content-Type", found.mime);
  res.setHeader("Cache-Control", "private, max-age=3600");
  createReadStream(found.path).pipe(res);
}

export function getHighlights(_req, res) {
  try {
    const customItems = readCustomHighlightsFromDisk();
    return res.json({ customItems });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not load highlights" });
  }
}

export function putHighlights(req, res) {
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
}

export function getHighlightAsset(req, res) {
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
}

export function deleteHighlightAsset(req, res) {
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
}

export function postHighlightAsset(req, res) {
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
}

export function postResume(req, res) {
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
}

export function postProfilePhoto(req, res) {
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
}
