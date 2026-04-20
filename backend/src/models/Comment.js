import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    authorName: { type: String, required: true, trim: true, maxlength: 120 },
    text: { type: String, required: true, trim: true, maxlength: 8000 },
  },
  { timestamps: true },
);

commentSchema.index({ kind: 1, entityId: 1, createdAt: 1 });

export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
