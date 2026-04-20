import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** `backend/.env` (preferred), then repo-root `.env` — paths are not cwd-dependent. */
dotenv.config({ path: join(__dirname, "..", ".env") });
dotenv.config({ path: join(__dirname, "..", "..", ".env") });
import { connectDb } from "./db.js";
import interactionsRouter from "./routes/interactions.js";
import userRoutes from "./routes/userRoutes.js";
import siteRoutes from "./routes/siteRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 5001;

const corsOrigins = (process.env.FRONTEND_ORIGIN ??
  "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "64kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ayush-portfolio-api" });
});

app.use("/api/interactions", interactionsRouter);
app.use("/api/users", userRoutes);
app.use("/api/site", siteRoutes);

async function main() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
