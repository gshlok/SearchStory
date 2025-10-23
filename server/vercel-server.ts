import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import fs from "fs";

// Create express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), "dist", "public")));

// Register API routes
registerRoutes(app);

// Serve static files and handle all routes
app.use("*", (req, res) => {
  // Try to serve static file first
  const staticPath = path.join(process.cwd(), "dist", "public", req.path);
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    return res.sendFile(staticPath);
  }
  
  // Otherwise serve index.html for client-side routing
  res.sendFile(path.join(process.cwd(), "dist", "public", "index.html"));
});

// Export the app for Vercel as a function handler
export default app;