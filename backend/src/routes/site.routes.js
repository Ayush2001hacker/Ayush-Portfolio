import { mkdirSync } from "node:fs";
import { Router } from "express";
import { ensureUploadsDir } from "../config/resumeStorage.js";
import {
  deleteHighlightAsset,
  getHighlightAsset,
  getHighlights,
  getProfilePhoto,
  getResumePdf,
  getSiteSettings,
  postHighlightAsset,
  postProfilePhoto,
  postResume,
  putHighlights,
} from "../controllers/site.controller.js";
import { HIGHLIGHT_ASSETS_DIR } from "../services/highlightPersistence.js";
import { validateTokenHandler } from "../middleware/validateTokenHandler.js";

ensureUploadsDir();
mkdirSync(HIGHLIGHT_ASSETS_DIR, { recursive: true });

const router = Router();

router.get("/settings", getSiteSettings);
router.get("/resume", getResumePdf);
router.get("/profile-photo", getProfilePhoto);
router.get("/highlights", getHighlights);
router.put("/highlights", validateTokenHandler, putHighlights);
router.get("/highlight-asset/:name", getHighlightAsset);
router.delete("/highlight-asset/:name", validateTokenHandler, deleteHighlightAsset);
router.post("/highlight-asset", validateTokenHandler, postHighlightAsset);
router.post("/resume", validateTokenHandler, postResume);
router.post("/profile-photo", validateTokenHandler, postProfilePhoto);

export default router;
