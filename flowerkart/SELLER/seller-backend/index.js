import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectToDb } from "./mongodb/connection/index.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
app.get("/", (req, res) => {
  res.send("Seller API running 🚀");
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES FIRST
app.use("/api/products", productRoutes);
async function startServer() {
  const PORT = process.env.PORT;
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();

// Trigger nodemon restart
