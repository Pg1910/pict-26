import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // The frontend connects directly to an external API (VITE_API_BASE_URL).
  // This server primarily serves the static frontend assets.
  
  // We can add a simple health check or configuration endpoint if needed.
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: "frontend_proxy" });
  });

  return httpServer;
}
