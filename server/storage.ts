import { features, type Feature, type InsertFeature } from "@shared/schema";
import { prds, type Prd, type InsertPrd } from "@shared/schema";

export interface IStorage {
  // Feature methods
  getFeatures(): Promise<Feature[]>;
  getFeature(id: number): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeatureOrder(id: number, order: number): Promise<Feature>;
  deleteFeature(id: number): Promise<void>;

  // PRD methods
  getPrds(): Promise<Prd[]>;
  getPrd(id: number): Promise<Prd | undefined>;
  createPrd(prd: InsertPrd): Promise<Prd>;
}

export class MemStorage implements IStorage {
  private features: Map<number, Feature>;
  private prds: Map<number, Prd>;
  private currentFeatureId: number;
  private currentPrdId: number;

  constructor() {
    this.features = new Map();
    this.prds = new Map();
    this.currentFeatureId = 1;
    this.currentPrdId = 1;
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

  // PRD methods
  async getPrds(): Promise<Prd[]> {
    return Array.from(this.prds.values());
  }

  async getPrd(id: number): Promise<Prd | undefined> {
    return this.prds.get(id);
  }

  async createPrd(prd: InsertPrd): Promise<Prd> {
    const id = this.currentPrdId++;
    const now = new Date();

    const newPrd: Prd = {
      ...prd,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.prds.set(id, newPrd);
    return newPrd;
  }
}

export const storage = new MemStorage();