import express from "express";
import Order from "../mongodb/models/paymentModel.js";

const router = express.Router();

// Get live/pending orders for a specific partner
router.get("/live", async (req, res) => {
  try {
    const { partnerId } = req.query;
    if (!partnerId) return res.status(400).json({ error: "Partner ID required" });

    const liveStatuses = ["Accepted", "Shipped", "Out for delivery"];
    const orders = await Order.find({ 
      status: { $in: liveStatuses },
      assignedPartner: partnerId
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch live orders" });
  }
});

// Get new order requests (not yet assigned)
router.get("/requests", async (req, res) => {
  try {
    const orders = await Order.find({ 
      status: { $in: ["Accepted", "Shipped"] }, 
      assignedPartner: { $exists: false } 
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order requests" });
  }
});

// Accept an order request
router.post("/accept-order", async (req, res) => {
  try {
    const { orderId, partnerId } = req.body;
    
    // Ensure order is still available
    const existingOrder = await Order.findOne({ _id: orderId, assignedPartner: { $exists: false } });
    if (!existingOrder) {
      return res.status(400).json({ error: "Order already taken or unavailable" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId, 
      { assignedPartner: partnerId, status: "Accepted" }, 
      { new: true }
    );
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to accept order" });
  }
});

// Get delivery history (delivered orders for a partner)
router.get("/history", async (req, res) => {
  try {
    const { partnerId } = req.query;
    const orders = await Order.find({ 
      status: "Delivered",
      assignedPartner: partnerId
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch delivery history" });
  }
});

// Update order status
router.post("/update-status", async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalDeliveries = await Order.countDocuments({ status: "Delivered" });
    const liveStatuses = ["Accepted", "Shipped", "Out for delivery"];
    const activeOrders = await Order.countDocuments({ status: { $in: liveStatuses } });
    
    res.json({ totalDeliveries, activeOrders, earnings: totalDeliveries * 50 }); // Mock earnings
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
