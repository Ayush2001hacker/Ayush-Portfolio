import { Router } from "express";
import {
  deleteComment,
  getInteractions,
  postComment,
  toggleLike,
} from "../controllers/interactions.controller.js";
import { validateTokenHandler } from "../middleware/validateTokenHandler.js";

const router = Router();

router.get("/:kind/:entityId", getInteractions);
router.post("/:kind/:entityId/comments", postComment);
router.delete("/:kind/:entityId/comments/:commentId", validateTokenHandler, deleteComment);
router.post("/:kind/:entityId/like/toggle", toggleLike);

export default router;
