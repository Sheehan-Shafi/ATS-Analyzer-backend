import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectToDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === "your_mongodb_connection_string") {
    console.warn("MongoDB URI not configured. Continuing without database connection.");
    return;
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.warn("MongoDB URI is invalid. Continuing without database connection.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
  }
};

connectToDatabase();

// Routes - Add your routes here as you build them
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);

app.get("/", (req, res) => res.send("API Running"));

const PORT = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => console.log(`Server running on port ${port}`));

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
};

startServer(PORT);
