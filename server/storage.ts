import { users, features, prds, type Feature, type InsertFeature, type Prd, type InsertPrd, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import memorystore from "memorystore";
import session from "express-session";

const MemoryStore = memorystore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Feature methods
  getFeatures(): Promise<Feature[]>;
  getFeature(id: number): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature & { userId: number }): Promise<Feature>;
  updateFeatureOrder(id: number, order: number): Promise<Feature>;
  deleteFeature(id: number): Promise<void>;

  // PRD methods
  getPrds(): Promise<Prd[]>;
  getPrd(id: number): Promise<Prd | undefined>;
  createPrd(prd: InsertPrd & { userId: number }): Promise<Prd>;

  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
      stale: false, // Don't serve stale data
      noDisposeOnSet: true, // Don't dispose old data on set
      dispose: (key: string) => {
        // Optional: Add cleanup logic when sessions are disposed
        console.log(`Session disposed: ${key}`);
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Feature methods
  async getFeatures(): Promise<Feature[]> {
    return db.select().from(features).orderBy(features.order);
  }

  async getFeature(id: number): Promise<Feature | undefined> {
    const [feature] = await db.select().from(features).where(eq(features.id, id));
    return feature;
  }

  async createFeature(insertFeature: InsertFeature & { userId: number }): Promise<Feature> {
    const score = (insertFeature.reach * insertFeature.impact * insertFeature.confidence) / insertFeature.effort;
    const allFeatures = await this.getFeatures();
    const order = allFeatures.length;

    const [feature] = await db
      .insert(features)
      .values({
        ...insertFeature,
        score,
        order,
      })
      .returning();

    return feature;
  }

  async updateFeatureOrder(id: number, newOrder: number): Promise<Feature> {
    const [feature] = await db
      .update(features)
      .set({ order: newOrder })
      .where(eq(features.id, id))
      .returning();

    if (!feature) throw new Error("Feature not found");
    return feature;
  }

  async deleteFeature(id: number): Promise<void> {
    await db.delete(features).where(eq(features.id, id));
  }

  // PRD methods
  async getPrds(): Promise<Prd[]> {
    return db.select().from(prds);
  }

  async getPrd(id: number): Promise<Prd | undefined> {
    const [prd] = await db.select().from(prds).where(eq(prds.id, id));
    return prd;
  }

  async createPrd(insertPrd: InsertPrd & { userId: number }): Promise<Prd> {
    const [prd] = await db.insert(prds).values(insertPrd).returning();
    return prd;
  }
}

export const storage = new DatabaseStorage();