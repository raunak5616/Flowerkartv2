import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DeliveryPartner from "../mongodb/models/deliveryPartnerModel.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, shop } = req.body;
    
    // Check if exists
    const existing = await DeliveryPartner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Delivery Partner already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = new DeliveryPartner({ name, email, phone, password: hashedPassword, shop });
    await partner.save();

    res.status(201).json({ message: "Delivery Partner Registered Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find
    const partner = await DeliveryPartner.findOne({ email });
    if (!partner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate Token
    const token = jwt.sign({ id: partner._id, email: partner.email }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(200).json({ message: "Login Successful", token, id: partner._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
