import User from "../mongodb/model/singup.User.Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= SIGNUP ================= */

export const Signup = async (req, res) => {
  try {
    const { name, shop, email, phone, password, address, lat, lng } = req.body;
    console.log("REQ BODY 🔍", req.body);

    if (!name || !shop || !email || !phone || !password || !address || !lat || !lng) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const hashedPassword = await bcrypt.hash(password, 10);
    let images = null;

    if (req.file) {
      images = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const user = await User.create({
      name,
      email,
      role: "seller",
      shop,
      phone,
      password: hashedPassword,
      images,
      address,
      location: {
        lat: Number(lat),
        lng: Number(lng)
      }
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      role: user.role
    });

  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


/* ================= LOGIN ================= */

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify Role
    if (user.role !== "seller") {
      return res.status(403).json({ message: "Access denied. Role mismatch." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      id: user._id,
      role: user.role,
      shop: user.shop
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};