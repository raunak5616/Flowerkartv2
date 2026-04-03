import { Login, signup } from "../authControler/auth.controller.js";
import express from "express";
import {getProducts, getProductsByShopId, getShop } from "../authControler/productController.js";
import { getProfile, updateProfile } from "../authControler/profile.controller.js";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.js";
import { submitReview } from "../authControler/reviewController.js";
import { createOrder, verifyPayment, updatePaymentStatus } from "../authControler/payment.controller.js";
import { getUserData, updateUserData, getUserOrders } from "../authControler/user.controller.js";

const router = express.Router();
router.use((req, res, next) => {
  console.log(`[ROUTER HIT] ${req.method} ${req.url}`);
  next();
});
router.get("/products", getProducts);
router.get("/profile/:id", verifyToken, getProfile);
router.get("/productsById/:id", getProductsByShopId);
router.get("/shop", getShop);
router.post("/signup",signup);
router.post("/login",Login);
router.post("/profileUpdate",verifyToken,upload.single("images"),updateProfile);
router.post("/review/:orderId", verifyToken, submitReview);

// Razorpay Routes
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/update-payment-status", updatePaymentStatus);

// User Data & Profile Sync
router.get("/user-data/:userId", getUserData);
router.post("/user-data/:userId", updateUserData);
router.get("/orders/:userId", verifyToken, getUserOrders);

export default router;