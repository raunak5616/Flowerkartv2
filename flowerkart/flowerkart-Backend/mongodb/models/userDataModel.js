import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cart: { type: Array, default: [] },
  favourite: { type: Array, default: [] }
}, { timestamps: true });

export default mongoose.model("UserData", userDataSchema);
