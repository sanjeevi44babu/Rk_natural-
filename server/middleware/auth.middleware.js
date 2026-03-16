import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    // Attach user
    req.user = user;

    next();

  } catch (err) {
    console.error("Auth middleware error:", err);

    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};