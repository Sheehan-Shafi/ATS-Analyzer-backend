// Write your code here
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const user = await User.create({ name, email, password });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    const message = err?.message || "Registration failed";
    if (message.includes("Mongoose") || message.includes("connect") || message.includes("Mongo")) {
      return res.status(503).json({ error: "Database connection is not available. Please configure MongoDB first." });
    }
    return res.status(400).json({ error: message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "1d" });

    return res.json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Login failed" });
  }
};