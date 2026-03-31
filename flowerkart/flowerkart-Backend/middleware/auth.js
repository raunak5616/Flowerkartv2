import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    console.log("AUTH HEADER 👉", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
console.log("EXTRACTED TOKEN 👉", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT Payload 👉", decoded);

    req.user = decoded; // ✅ THIS IS CRITICAL

    next();
  } catch (error) {
    console.log("Token verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};