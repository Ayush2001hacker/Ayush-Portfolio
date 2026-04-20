import jwt from "jsonwebtoken";

/**
 * Validates `Authorization: Bearer <token>` and attaches `req.user` from the JWT payload (same shape as your other app).
 */
export function validateTokenHandler(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return res.status(503).json({ message: "ACCESS_TOKEN_SECRET is not configured" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!decoded?.user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded.user;
    next();
  });
}
