import express from "express";
import DeliveryPartner from "../mongodb/models/deliveryPartnerModel.js";

const router = express.Router();

// Get all delivery partners
router.get("/delivery-partners", async (req, res) => {
  try {
    const partners = await DeliveryPartner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch delivery partners" });
  }
});

// Delete a delivery partner
router.delete("/delivery-partners/:id", async (req, res) => {
  try {
    await DeliveryPartner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete delivery partner" });
  }
});

export default router;
