import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

// Inline the registerRoutes function directly to avoid import issues
async function registerRoutes(app: express.Application): Promise<void> {
  // Health check endpoint for deployment verification
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "SearchStory API",
      deployment: process.env.VERCEL ? "Vercel" : (process.env.NODE_ENV === "production" ? "Production" : "Development")
    });
  });

  // Vercel specific endpoint for deployment verification
  app.get("/api/vercel", (_req, res) => {
    res.status(200).json({
      status: "ok",
      platform: "Vercel",
      timestamp: new Date().toISOString(),
      service: "SearchStory API"
    });
  });

  // Serve the latest problem statement from the repository root
  app.get("/api/problem-statement", async (_req, res) => {
    try {
      // Try multiple possible paths for the problem statement file
      const possiblePaths = [
        path.resolve(import.meta.dirname, "..", "problem_statement.txt"),
        path.resolve(import.meta.dirname, "..", "client", "public", "problem_statement.txt"),
        path.resolve(import.meta.dirname, "..", "dist", "public", "problem_statement.txt")
      ];

      let filePath = "";
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          filePath = possiblePath;
          break;
        }
      }

      if (!filePath) {
        console.error("Problem statement file not found at any expected location");
        return res.type("text/plain").status(404).send("Problem statement file not found.");
      }

      console.log("Attempting to read problem statement from:", filePath);
      const text = await fs.promises.readFile(filePath, "utf-8");
      console.log("Successfully read problem statement, length:", text.length);
      res.type("text/plain").send(text);
    } catch (err) {
      console.error("Error reading problem statement:", err);
      res.type("text/plain").status(500).send("Failed to load problem statement.");
    }
  });
}

// Create express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app); // Removed await since we're not in an async context

// Serve static files and handle all routes
app.use("*", (req, res) => {
  // Use the correct path resolution for Vercel deployment
  const staticPath = path.resolve(import.meta.dirname, "public", req.path);
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    return res.sendFile(staticPath);
  }
  
  // Otherwise serve index.html for client-side routing
  res.sendFile(path.resolve(import.meta.dirname, "public", "index.html"));
});

// Export the app for Vercel as a function handler
export default app;