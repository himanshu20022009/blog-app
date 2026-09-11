import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import fs from "fs";
import os from "os";
import path from "path";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";

import cors from "cors";
const app = express();
dotenv.config();

const port = process.env.PORT || 4001;
const MONOGO_URL = process.env.MONOG_URI;
const uploadTempDir = path.join(os.tmpdir(), "blog-app-uploads");
fs.mkdirSync(uploadTempDir, { recursive: true });
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const isLocalOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin?.replace(/\/$/, "");
      if (
        !origin ||
        allowedOrigins.includes(normalizedOrigin) ||
        isLocalOrigin(normalizedOrigin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin is not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: `${uploadTempDir}${path.sep}`,
  })
);

// defining routes
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);
// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const startServer = async () => {
  try {
    await mongoose.connect(MONOGO_URL);
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error);
    process.exitCode = 1;
  }
};

startServer();
