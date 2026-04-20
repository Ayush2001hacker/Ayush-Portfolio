import { timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";

function safePasswordMatch(given, expected) {
  if (typeof given !== "string" || typeof expected !== "string") return false;
  const a = Buffer.from(given, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Portfolio admin only — credentials from env (no DB user collection). */
export async function loginUser(req, res) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@portfolio.local").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!adminPassword) {
    return res.status(503).json({ message: "Admin login is not configured (set ADMIN_PASSWORD)." });
  }
  if (!secret) {
    return res.status(503).json({ message: "ACCESS_TOKEN_SECRET is not set" });
  }

  if (String(email).trim().toLowerCase() !== adminEmail) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (!safePasswordMatch(password, adminPassword)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const expiresIn = process.env.ADMIN_ACCESS_EXPIRES_IN || "30m";
  const accessToken = jwt.sign(
    {
      user: {
        id: "portfolio-admin",
        username: "Admin",
        email: adminEmail,
      },
    },
    secret,
    { expiresIn },
  );

  return res.status(200).json({ accessToken });
}

export async function currentUser(req, res) {
  res.json(req.user);
}
