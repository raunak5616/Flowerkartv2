import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { connectDB } from "./mongodb/connection/connection.js";
import auth from "./router/index.js";
import ShopAccount from "./mongodb/models/shop.model.js";
import cloudinary from "./config/cloudinary.js";
import Product from "./mongodb/models/productModel.js";
import Order from "./mongodb/models/paymentModel.js";
import UserData from "./mongodb/models/userDataModel.js";
import UserAccount from "./mongodb/models/userModel.js";

dotenv.config();
console.log("MONGO_URI LOADED:", !!process.env.MONGO_URI, "Length:", process.env.MONGO_URI?.length);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use("/api/auth", auth)
app.get("/", (req, res) => {
  res.send("API running 🚀");
});
// Admin APIs
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await UserAccount.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    await UserAccount.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.get("/api/admin/shops", async (req, res) => {
  try {
    const shops = await ShopAccount.find().sort({ createdAt: -1 });
    console.log("SHOPS (MODEL):", shops.length);
    res.json(shops);
  } catch (err) {
    console.error("FAILED MODEL FETCH:", err);
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

app.delete("/api/admin/shops/:id", async (req, res) => {
  try {
    const shopId = req.params.id;
    
    // 1. Fetch products to get public_ids for Cloudinary cleanup before deletion
    const productsForCleanup = await Product.find({ shopId });
    const productPublicIds = productsForCleanup.flatMap(p => p.images?.filter(img => img.public_id).map(img => img.public_id) || []);
    
    // 2. Delete all products from database
    const deletedProducts = await Product.deleteMany({ shopId });
    console.log(`[ADMIN] Deleted ${deletedProducts.deletedCount} products for shop ${shopId}`);
    
    // 3. Delete the shop itself from database
    const shopToDelete = await ShopAccount.findById(shopId);
    if (!shopToDelete) {
      return res.status(404).json({ error: "Shop not found" });
    }
    const shopPublicId = shopToDelete.images?.public_id;
    await ShopAccount.findByIdAndDelete(shopId);
    
    // 4. Cleanup Cloudinary Images (Background cleanup)
    if (productPublicIds.length > 0 || shopPublicId) {
      (async () => {
        try {
          if (productPublicIds.length > 0) {
            await cloudinary.api.delete_resources(productPublicIds);
            console.log(`[ADMIN] Cleaned up ${productPublicIds.length} product images from Cloudinary`);
          }
          if (shopPublicId) {
            await cloudinary.uploader.destroy(shopPublicId);
            console.log(`[ADMIN] Cleaned up shop image from Cloudinary`);
          }
        } catch (cloudinaryErr) {
          console.error("[ADMIN] Cloudinary Cleanup Warning:", cloudinaryErr.message || cloudinaryErr);
        }
      })();
    }

    res.json({ success: true, message: "Shop and associated products deleted successfully" });
  } catch (err) {
    console.error("Error deleting shop and products:", err);
    res.status(500).json({ error: "Failed to delete shop and its products" });
  }
});

app.get("/api/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.delete("/api/admin/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});
/* server */
async function startServer() {
  try {
    await connectDB();
    console.log("Connected to DB:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });

    // Global Error Handler
    app.use((err, req, res, next) => {
      console.error("GLOBAL ERROR HANDLER 👉", err);
      res.status(500).json({ 
        message: "Internal Server Error", 
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
      });
    });

  } catch (error) {
    console.log("Error in starting server:", error);
  }
}

startServer();
