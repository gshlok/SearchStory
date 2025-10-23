import type { Express } from "express";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<void> {
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

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Serve the latest problem statement from the repository root
  app.get("/api/problem-statement", async (_req, res) => {
    try {
      const filePath = path.resolve(import.meta.dirname, "..", "problem_statement.txt");
      console.log("Attempting to read problem statement from:", filePath);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error("Problem statement file not found at:", filePath);
        // Return a clear error message as plain text
        return res.type("text/plain").status(404).send("Problem statement file not found.");
      }

      const text = await fs.promises.readFile(filePath, "utf-8");
      console.log("Successfully read problem statement, length:", text.length);
      res.type("text/plain").send(text);
    } catch (err) {
      console.error("Error reading problem statement:", err);
      // Always return plain text even in error cases
      res.type("text/plain").status(500).send("Failed to load problem statement.");
    }
  });
}