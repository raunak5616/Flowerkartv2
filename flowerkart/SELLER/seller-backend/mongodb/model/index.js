import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    description: { type: String, required: true },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
     shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true
  }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
