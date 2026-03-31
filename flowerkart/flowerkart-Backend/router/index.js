import { Login, signup } from "../authControler/auth.controller.js";
import express from "express";
import {getProducts, getProductsByShopId, getShop } from "../authControler/productController.js";
import { getProfile, updateProfile } from "../authControler/profile.controller.js";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.js";
import { submitReview } from "../authControler/reviewController.js";

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

export default router;