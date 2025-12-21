import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerObjectStorageRoutes(app);

  // Report Routes
  app.get(api.reports.list.path, async (req, res) => {
    const reports = await storage.getReports();
    res.json(reports);
  });

  app.get(api.reports.get.path, async (req, res) => {
    const report = await storage.getReport(Number(req.params.id));
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  });

  // Protected Routes (Create/Update/Delete)
  app.post(api.reports.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.reports.create.input.parse(req.body);
      // Inject userId from auth
      const userId = (req.user as any).claims.sub;
      const report = await storage.createReport({ ...input, userId });
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.patch(api.reports.updateStatus.path, isAuthenticated, async (req, res) => {
    const { status } = req.body;
    const report = await storage.updateReportStatus(Number(req.params.id), status);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  });

  app.delete(api.reports.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteReport(Number(req.params.id));
    res.status(204).send();
  });

  // Seeding Logic (Optional, for demo)
  const existingReports = await storage.getReports();
  if (existingReports.length === 0) {
    console.log("Seeding initial reports...");
    await storage.createReport({
      title: "Pothole on Main St",
      description: "Large pothole causing traffic slowdown.",
      category: "pothole",
      latitude: 12.9716,
      longitude: 77.5946,
      status: "new",
      mediaUrls: [],
      address: "Main Street, City Center"
    });
    await storage.createReport({
      title: "Garbage Pileup",
      description: "Trash not collected for 3 days.",
      category: "garbage",
      latitude: 12.9720,
      longitude: 77.5950,
      status: "in_progress",
      mediaUrls: [],
      address: "2nd Cross, Market Road"
    });
  }

  return httpServer;
}
