import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {
  try {
    console.log("🔁 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
