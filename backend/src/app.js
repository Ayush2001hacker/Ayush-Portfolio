import express from "express";
import cors from "cors";
import interactionsRouter from "./routes/interactions.routes.js";
import userRoutes from "./routes/userRoutes.js";
import siteRoutes from "./routes/site.routes.js";

export function createApp() {
  const app = express();

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

  return app;
}
