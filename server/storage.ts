import { features, type Feature, type InsertFeature } from "@shared/schema";
import { prdTemplates, type PrdTemplate, type InsertPrdTemplate } from "@shared/schema";

export interface IStorage {
  // Feature methods
  getFeatures(): Promise<Feature[]>;
  getFeature(id: number): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeatureOrder(id: number, order: number): Promise<Feature>;
  deleteFeature(id: number): Promise<void>;

  // PRD Template methods
  getPrdTemplates(): Promise<PrdTemplate[]>;
  getPrdTemplate(id: number): Promise<PrdTemplate | undefined>;
  createPrdTemplate(template: InsertPrdTemplate): Promise<PrdTemplate>;
}

export class MemStorage implements IStorage {
  private features: Map<number, Feature>;
  private prdTemplates: Map<number, PrdTemplate>;
  private currentFeatureId: number;
  private currentTemplateId: number;

  constructor() {
    this.features = new Map();
    this.prdTemplates = new Map();
    this.currentFeatureId = 1;
    this.currentTemplateId = 1;
  }

  // Existing Feature methods
  private calculateScore(feature: InsertFeature): number {
    return (feature.reach * feature.impact * feature.confidence) / feature.effort;
  }

  async getFeatures(): Promise<Feature[]> {
    return Array.from(this.features.values()).sort((a, b) => a.order - b.order);
  }

  async getFeature(id: number): Promise<Feature | undefined> {
    return this.features.get(id);
  }

  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const id = this.currentFeatureId++;
    const order = this.features.size;
    const score = this.calculateScore(insertFeature);

    const feature: Feature = {
      ...insertFeature,
      id,
      score,
      order,
    };

    this.features.set(id, feature);
    return feature;
  }

  async updateFeatureOrder(id: number, newOrder: number): Promise<Feature> {
    const feature = this.features.get(id);
    if (!feature) throw new Error("Feature not found");

    const updatedFeature = { ...feature, order: newOrder };
    this.features.set(id, updatedFeature);
    return updatedFeature;
  }

  async deleteFeature(id: number): Promise<void> {
    this.features.delete(id);
  }

  // New PRD Template methods
  async getPrdTemplates(): Promise<PrdTemplate[]> {
    return Array.from(this.prdTemplates.values());
  }

  async getPrdTemplate(id: number): Promise<PrdTemplate | undefined> {
    return this.prdTemplates.get(id);
  }

  async createPrdTemplate(template: InsertPrdTemplate): Promise<PrdTemplate> {
    const id = this.currentTemplateId++;
    const now = new Date();

    const prdTemplate: PrdTemplate = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.prdTemplates.set(id, prdTemplate);
    return prdTemplate;
  }
}

export const storage = new MemStorage();