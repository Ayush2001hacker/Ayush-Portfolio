import { Router } from "express";
import {
  getInteractions,
  postComment,
  toggleLike,
} from "../controllers/interactions.controller.js";

const router = Router();

router.get("/:kind/:entityId", getInteractions);
router.post("/:kind/:entityId/comments", postComment);
router.post("/:kind/:entityId/like/toggle", toggleLike);

export default router;
