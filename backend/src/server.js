import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDb } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** `backend/.env` (preferred), then repo-root `.env` — paths are not cwd-dependent. */
dotenv.config({ path: join(__dirname, "..", ".env") });
dotenv.config({ path: join(__dirname, "..", "..", ".env") });

const PORT = process.env.PORT ?? 5001;
const app = createApp();

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
