import mongoose from "mongoose";
import productModel from "../mongodb/models/productModel.js"
import user from "../mongodb/models/shop.model.js";

export const getProducts = async (req, res) => {
    try {
        console.log("🚀 GET PRODUCTS HIT");
        const product = await productModel.find();
        res.status(200).json(product);
    } catch (error) {
        console.log("🔥 GET PRODUCTS ERROR 🔥", error)
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
            stack: error.stack,
        });
    }
}

export const getShop = async (req, res) => {
    try {
        console.log("🚀 GET SHOP HIT");
        const shop = await user.find({ role: "seller" });
        console.log("✅ SHOPS FOUND:", shop.length);
        res.status(200).json(shop);
    } catch (error) {
        console.log("🔥 GET SHOP ERROR 🔥", error)
        res.status(500).json({
            message: "Failed to fetch shop",
            error: error.message,
            stack: error.stack,
        });
    }
}

export const getProductsByShopId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🚀 GET PRODUCTS BY SHOP ID REQUESTED:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("❌ INVALID SHOP ID:", id);
            return res.status(400).json({ message: "Invalid shop ID" });
        }

        const products = await productModel.find({
            shopId: new mongoose.Types.ObjectId(id)
        });

        console.log(`✅ FOUND ${products.length} PRODUCTS FOR SHOP:`, id);
        res.status(200).json(products);

    } catch (error) {
        console.log("🔥 GET PRODUCTS BY SHOP ERROR 🔥", error);
        res.status(500).json({
            message: "Failed to fetch shop products",
            error: error.message
        });
    }
};