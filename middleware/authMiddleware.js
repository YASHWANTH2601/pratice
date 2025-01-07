import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import crypto from "crypto";

// Use a consistent secret key (stored in environment variables)
const secretkey =
  process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: "Forbidden 🛑🛑" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  console.log(token);
  jwt.verify(token, secretkey, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" }); // Respond immediately for invalid token
    }

    try {
      // Find the user associated with the token
      const user = await User.findOne({ _id: payload._id }).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      req.user = user; // Attach the user object to the request
      next(); // Proceed to the next middleware or route
    } catch (error) {
      console.error("Error in authMiddleware:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export default authMiddleware;
