import UserData from "../mongodb/models/userDataModel.js";
import Order from "../mongodb/models/paymentModel.js";
import mongoose from "mongoose";

export const getUserData = async (req, res) => {
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
};

export const updateUserData = async (req, res) => {
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
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; 
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - User ID not found in token" });
    }
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
