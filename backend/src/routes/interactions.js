import { Router } from "express";
import { KIND_SET } from "../constants.js";
import { Comment } from "../models/Comment.js";
import { LikeRecord } from "../models/LikeRecord.js";

const router = Router();

function badKind(res) {
  return res.status(400).json({
    error: "invalid_kind",
    message: `kind must be one of: ${[...KIND_SET].join(", ")}`,
  });
}

function validateKind(kind) {
  return typeof kind === "string" && KIND_SET.has(kind);
}

function validateEntityId(entityId) {
  return typeof entityId === "string" && entityId.length > 0 && entityId.length <= 200;
}

/** GET /api/interactions/:kind/:entityId?clientId=… */
router.get("/:kind/:entityId", async (req, res) => {
  const { kind, entityId } = req.params;
  if (!validateKind(kind)) return badKind(res);
  if (!validateEntityId(entityId)) {
    return res.status(400).json({ error: "invalid_entity_id", message: "entityId is required" });
  }

  const clientId = typeof req.query.clientId === "string" ? req.query.clientId.trim() : "";

  try {
    const [comments, likeCount, likedDoc] = await Promise.all([
      Comment.find({ kind, entityId }).sort({ createdAt: 1 }).lean().exec(),
      LikeRecord.countDocuments({ kind, entityId }),
      clientId
        ? LikeRecord.findOne({ kind, entityId, clientId }).select("_id").lean().exec()
        : Promise.resolve(null),
    ]);

    const list = comments.map((c) => ({
      id: String(c._id),
      authorName: c.authorName,
      text: c.text,
      at: c.createdAt ? new Date(c.createdAt).getTime() : Date.now(),
    }));

    return res.json({
      comments: list,
      likeCount,
      liked: Boolean(likedDoc),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: "Failed to load interactions" });
  }
});

/** POST /api/interactions/:kind/:entityId/comments  body: { authorName, text } */
router.post("/:kind/:entityId/comments", async (req, res) => {
  const { kind, entityId } = req.params;
  if (!validateKind(kind)) return badKind(res);
  if (!validateEntityId(entityId)) {
    return res.status(400).json({ error: "invalid_entity_id", message: "entityId is required" });
  }

  const authorName = typeof req.body?.authorName === "string" ? req.body.authorName.trim() : "";
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

  if (!authorName) {
    return res.status(400).json({ error: "validation_error", message: "authorName is required" });
  }
  if (!text) {
    return res.status(400).json({ error: "validation_error", message: "text is required" });
  }

  try {
    const doc = await Comment.create({ kind, entityId, authorName, text });
    return res.status(201).json({
      comment: {
        id: String(doc._id),
        authorName: doc.authorName,
        text: doc.text,
        at: doc.createdAt.getTime(),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: "Failed to save comment" });
  }
});

/** POST /api/interactions/:kind/:entityId/like/toggle  body: { clientId } */
router.post("/:kind/:entityId/like/toggle", async (req, res) => {
  const { kind, entityId } = req.params;
  if (!validateKind(kind)) return badKind(res);
  if (!validateEntityId(entityId)) {
    return res.status(400).json({ error: "invalid_entity_id", message: "entityId is required" });
  }

  const clientId = typeof req.body?.clientId === "string" ? req.body.clientId.trim() : "";
  if (!clientId || clientId.length > 128) {
    return res.status(400).json({
      error: "validation_error",
      message: "clientId is required (stable id per browser, e.g. from localStorage)",
    });
  }

  try {
    const existing = await LikeRecord.findOne({ kind, entityId, clientId }).exec();
    if (existing) {
      await existing.deleteOne();
    } else {
      await LikeRecord.create({ kind, entityId, clientId });
    }

    const [likeCount, liked] = await Promise.all([
      LikeRecord.countDocuments({ kind, entityId }),
      LikeRecord.exists({ kind, entityId, clientId }),
    ]);

    return res.json({
      likeCount,
      liked: Boolean(liked),
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "conflict", message: "Duplicate like toggle" });
    }
    console.error(err);
    return res.status(500).json({ error: "server_error", message: "Failed to toggle like" });
  }
});

export default router;
