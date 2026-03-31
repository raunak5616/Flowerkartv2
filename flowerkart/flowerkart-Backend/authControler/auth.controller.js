import User from "../mongodb/models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

{
  /** SIGN_UP */
}
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      name,
      role: "user", // Correct role
      email,
      phone,
      password: hashedPassword,
    });

    console.log("Saved user id:", user._id);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

{
  /**LOGIN */
}

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log("REQ BODY 👉", req.body);

    // 1️⃣ Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Verify Role
    if (user.role !== "user") {
        return res.status(403).json({ message: "Access denied. Role mismatch." });
    }

    // 4️⃣ Compare password
    const isPasswordValid = await bcryptjs.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 6️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
