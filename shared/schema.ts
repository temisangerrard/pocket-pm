import { pgTable, text, serial, integer, numeric, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default('product_manager'),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reach: integer("reach").notNull(),
  impact: integer("impact").notNull(),
  confidence: integer("confidence").notNull(),
  effort: integer("effort").notNull(),
  score: numeric("score", { precision: 10, scale: 2 }).notNull(),
  order: integer("order").notNull(),
  priority: text("priority").notNull().default('should'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prds = pgTable("prds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sections: jsonb("sections").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, updatedAt: true, isSubscribed: true, subscriptionEndsAt: true })
  .extend({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum([
      'product_manager',
      'product_owner',
      'scrum_master',
      'technical_lead',
      'developer',
      'designer',
      'qa_engineer',
      'business_analyst',
      'stakeholder',
      'project_manager',
      'ux_researcher',
      'data_analyst',
      'marketing_specialist',
      'sales_representative',
      'customer_success',
      'operations_manager',
      'executive',
      'consultant',
      'other'
    ]).default('product_manager'),
  });

export const insertFeatureSchema = createInsertSchema(features)
  .omit({ id: true, score: true, order: true, userId: true, createdAt: true, updatedAt: true })
  .extend({
    reach: z.number().min(1).max(10),
    impact: z.number().min(1).max(10),
    confidence: z.number().min(1).max(10),
    effort: z.number().min(1).max(10),
    priority: z.enum(['must', 'should', 'could', 'wont']).default('should'),
  });

export const insertPrdSchema = createInsertSchema(prds)
  .omit({ id: true, userId: true, createdAt: true, updatedAt: true })
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
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;