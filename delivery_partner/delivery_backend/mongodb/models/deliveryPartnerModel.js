import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  shop: { type: String }, // To match frontend structure if needed
  status: { type: String, default: "Available" }
}, { timestamps: true });

export default mongoose.model("DeliveryPartner", deliveryPartnerSchema);
