import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  // No token provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

    // Find user and exclude sensitive fields
    const user = await User.findById(decoded.id).select("-passwordHash -pinHash");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Account is suspended or closed" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
