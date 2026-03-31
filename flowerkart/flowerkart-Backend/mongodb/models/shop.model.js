import mongoose from "mongoose";

const signupModel = mongoose.Schema({
    name: { type: String, required: true },
    category:{type: String },
    shop: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'seller' },
    images: {
  url: String,
  public_id: String
},
address: String,
location: {
  lat: Number,
  lng: Number
},
rating: { type: Number, default: 0 },
numReviews: { type: Number, default: 0 }
});
const Shop = mongoose.model("Shop", signupModel, "sellers");

export default Shop;