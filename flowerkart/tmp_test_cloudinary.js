import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import path from "path";

// Load .env from the backend folder
dotenv.config({ path: "d:/flowerKart/flowerkart/flowerkart-Backend/.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  console.log("Testing with Cloud Name:", process.env.CLOUD_NAME);
  try {
    const result = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", {
      folder: "test_flowerKart"
    });
    console.log("SUCCESS! Uploaded to:", result.secure_url);
  } catch (error) {
    console.error("FAILED! Error:", error);
  }
}

testUpload();
