import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { connectDB } from "./mongodb/connection/connection.js";
import auth from "./router/index.js";
import razorpay from "./utils/razorpay.js";
import crypto from "crypto";
import Order from "./mongodb/models/paymentModel.js";
import UserData from "./mongodb/models/userDataModel.js";
import Product from "./mongodb/models/productModel.js";
import UserAccount from "./mongodb/models/userModel.js";
import ShopAccount from "./mongodb/models/shop.model.js";

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

app.post("/create-order", async (req, res) => {
  try {
    const { amount, userId, cartItems, deliveryAddress, coordinates } = req.body;

    // Fetch shop details for delivery
    let shopInfo = { id: null, address: "", location: null };
    if (cartItems && cartItems.length > 0) {
      const firstItem = cartItems[0];
      const shopId = firstItem.shopId || firstItem.sellerId; // Handle both schemas
      if (shopId) {
        const shop = await ShopAccount.findById(shopId);
        if (shop) {
          shopInfo = {
            id: shop._id,
            address: shop.address || "Shop Address",
            location: shop.location || null
          };
        }
      }
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    const newOrder = new Order({
      userId,
      items: cartItems,
      amount,
      deliveryAddress,
      coordinates,
      shopId: shopInfo.id,
      shopAddress: shopInfo.address,
      shopLocation: shopInfo.location,
      razorpay_order_id: order.id,
      status: "Pending"
    });
    console.log("Captured Order with Shop Info:", shopInfo);
    await newOrder.save();

    res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/update-payment-status", async (req, res) => {
  try {
    const { razorpay_order_id, status } = req.body;
    await Order.findOneAndUpdate({ razorpay_order_id }, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    const existingOrder = await Order.findOne({ razorpay_order_id });
    if (existingOrder) {
      existingOrder.razorpay_payment_id = razorpay_payment_id;
      existingOrder.razorpay_signature = razorpay_signature;
      existingOrder.status = isAuthentic ? "Success" : "Failed";
      await existingOrder.save();
    }

    if (isAuthentic) {
      // Decrement stock for each item in the order
      if (existingOrder && existingOrder.items) {
        for (const item of existingOrder.items) {
          const productId = item._id || item.id;
          if (productId) {
            await Product.findByIdAndUpdate(productId, {
              $inc: { stock: -(item.qty || 1) }
            });
          }
        }
      }
      res.json({ success: true, message: "Payment verified", order: existingOrder });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature", order: existingOrder });
    }
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Sync Cart & Favorites
app.get("/user-data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let userData = await UserData.findOne({ userId });
    
    if (!userData) {
      userData = await UserData.create({ userId, cart: [], favourite: [] });
    }
    
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.post("/user-data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart, favourite } = req.body;
    
    const updatedData = await UserData.findOneAndUpdate(
      { userId },
      { cart, favourite },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync user data" });
  }
});

// Fetch Orders for Profile
app.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
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
    await ShopAccount.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete shop" });
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
