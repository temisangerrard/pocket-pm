import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFeatureSchema, insertPrdSchema } from "@shared/schema";
import { generatePrdTemplate } from "./utils/openai";
import { generateBacklogItems } from "./utils/backlog";

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

  // PRD routes
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

  app.post("/api/prds", async (req, res) => {
    const result = insertPrdSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const prd = await storage.createPrd(result.data);
    res.json(prd);
  });

  app.get("/api/prds", async (_req, res) => {
    const prds = await storage.getPrds();
    res.json(prds);
  });

  // New backlog generation endpoint
  app.post("/api/backlog/generate", async (req, res) => {
    try {
      const { prdId, description } = req.body;

      if (!prdId && !description) {
        return res.status(400).json({ error: "Either PRD ID or description is required" });
      }

      let input = description;
      if (prdId) {
        const prd = await storage.getPrd(prdId);
        if (!prd) {
          return res.status(404).json({ error: "PRD not found" });
        }
        // Combine PRD sections into a single description
        input = `${prd.description}\n\n${prd.sections.map(s => `${s.title}:\n${s.content}`).join('\n\n')}`;
      }

      const features = await generateBacklogItems(input);

      // Save generated features
      for (const feature of features) {
        await storage.createFeature(feature);
      }

      res.json({ message: "Backlog items generated successfully" });
    } catch (error: any) {
      console.error('Error in backlog generation:', error);
      res.status(500).json({ error: "Failed to generate backlog items" });
    }
  });

  return createServer(app);
}