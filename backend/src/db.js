import mongoose from "mongoose";

/**
 * Reads `CONNECTION_STRING` (same as your other project) or `MONGODB_URI` as fallback.
 * Logs host + database name on success; exits the process on failure.
 */
export async function connectDb() {
  const uri =
    (typeof process.env.CONNECTION_STRING === "string" && process.env.CONNECTION_STRING.trim()) ||
    (typeof process.env.MONGODB_URI === "string" && process.env.MONGODB_URI.trim()) ||
    "";

  if (!uri) {
    console.log(
      "MongoDB connection failed: set CONNECTION_STRING or MONGODB_URI in .env (see .env.example)",
    );
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    const connect = await mongoose.connect(uri);
    console.log(
      `MongoDB connected: ${connect.connection.host} ${connect.connection.name}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`MongoDB connection failed: ${message}`);
    process.exit(1);
  }
}
