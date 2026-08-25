import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";

import connectDB from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

import os from "os";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    createParentPath: true,
    limits: {
      fileSize: 15 * 1024 * 1024, // 15MB max file size
    },
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
  const distPath = fs.existsSync(path.join(__dirname, "../frontend/dist"))
    ? path.join(__dirname, "../frontend/dist")
    : path.join(__dirname, "frontend/dist");

  app.use(express.static(distPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// error handler
app.use((err, req, res, next) => {
  console.error("Express Error Handler:", err);
  res
    .status(err.status || 500)
    .json({
      message: err.message || "Internal server error",
    });
});

httpServer.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});