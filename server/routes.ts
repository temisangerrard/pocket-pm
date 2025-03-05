import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFeatureSchema, insertPrdTemplateSchema } from "@shared/schema";
import { generatePrdTemplate } from "./utils/openai";

export async function registerRoutes(app: Express) {
  // Existing feature routes
  app.get("/api/features", async (_req, res) => {
    const features = await storage.getFeatures();
    res.json(features);
  });

  app.post("/api/features", async (req, res) => {
    const result = insertFeatureSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const feature = await storage.createFeature(result.data);
    res.json(feature);
  });

  app.patch("/api/features/:id/order", async (req, res) => {
    const id = parseInt(req.params.id);
    const order = req.body.order;

    if (isNaN(id) || typeof order !== "number") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const feature = await storage.updateFeatureOrder(id, order);
    res.json(feature);
  });

  app.delete("/api/features/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    await storage.deleteFeature(id);
    res.status(204).send();
  });

  // New PRD template routes
  app.post("/api/prd/generate", async (req, res) => {
    try {
      const { description, industry } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Product description is required" });
      }

      const sections = await generatePrdTemplate(description, industry);
      res.json({ sections });
    } catch (error) {
      console.error('Error in PRD generation:', error);
      res.status(500).json({ error: "Failed to generate PRD template" });
    }
  });

  app.post("/api/prd/templates", async (req, res) => {
    const result = insertPrdTemplateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const template = await storage.createPrdTemplate(result.data);
    res.json(template);
  });

  app.get("/api/prd/templates", async (_req, res) => {
    const templates = await storage.getPrdTemplates();
    res.json(templates);
  });

  return createServer(app);
}