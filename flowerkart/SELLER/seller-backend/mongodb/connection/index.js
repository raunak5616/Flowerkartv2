
import mongoose from "mongoose";
export async function connectToDb(){
try {
    console.log("🔁 Connecting to Database...");
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is missing!");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
}