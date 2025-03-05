import { pgTable, text, serial, integer, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reach: integer("reach").notNull(),
  impact: integer("impact").notNull(),
  confidence: integer("confidence").notNull(),
  effort: integer("effort").notNull(),
  score: numeric("score", { precision: 10, scale: 2 }).notNull(),
  order: integer("order").notNull(),
  priority: text("priority").notNull().default('should'), // MoSCoW priority: must, should, could, wont
});

export const prds = pgTable("prds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sections: jsonb("sections").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFeatureSchema = createInsertSchema(features)
  .omit({ id: true, score: true, order: true })
  .extend({
    reach: z.number().min(1).max(10),
    impact: z.number().min(1).max(10),
    confidence: z.number().min(1).max(10),
    effort: z.number().min(1).max(10),
    priority: z.enum(['must', 'should', 'could', 'wont']).default('should'),
  });

export const insertPrdSchema = createInsertSchema(prds)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    sections: z.array(z.object({
      title: z.string(),
      content: z.string(),
      order: z.number(),
    })),
  });

export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;
export type InsertPrd = z.infer<typeof insertPrdSchema>;
export type Prd = typeof prds.$inferSelect;