import mongoose from "mongoose";

/** One document per (kind, entityId, clientId) — presence = liked for that client. */
const likeRecordSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true },
    entityId: { type: String, required: true },
    clientId: { type: String, required: true, maxlength: 128 },
  },
  { timestamps: true },
);

likeRecordSchema.index({ kind: 1, entityId: 1, clientId: 1 }, { unique: true });

export const LikeRecord =
  mongoose.models.LikeRecord || mongoose.model("LikeRecord", likeRecordSchema);
