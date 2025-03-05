import { features, type Feature, type InsertFeature } from "@shared/schema";

export interface IStorage {
  getFeatures(): Promise<Feature[]>;
  getFeature(id: number): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeatureOrder(id: number, order: number): Promise<Feature>;
  deleteFeature(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private features: Map<number, Feature>;
  private currentId: number;

  constructor() {
    this.features = new Map();
    this.currentId = 1;
  }

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
    const id = this.currentId++;
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
}

export const storage = new MemStorage();
