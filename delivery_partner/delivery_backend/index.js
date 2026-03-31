import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./mongodb/connection.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(cors({ 
  origin: function (origin, callback) {
    // dynamically allow any origin
    callback(null, true);
  }, 
  credentials: true 
}));

app.use("/api/auth", authRoutes);
app.use("/api/delivery/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Delivery API running 🚀");
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

startServer();