import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
console.log("☁️ CLOUD NAME =", process.env.CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
