import express from "express";
import { upload } from "../middleware/upload.js";
import { createProduct, getProductsByShop, updateProduct, deleteProduct, getBillsByShop, getOrdersByShop, updateOrderStatus } from "../controllers/productControllers.js";
import { Login, Signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createProduct);
router.get("/:shopId", getProductsByShop);
router.get("/bills/:shopId", getBillsByShop);
router.get("/orders/:shopId", getOrdersByShop);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/signup",upload.single("images"), Signup);
router.post("/login", Login);

export default router;
