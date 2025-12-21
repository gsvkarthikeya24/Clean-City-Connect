import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";
export * from "./models/chat";

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  address: text("address"),
  status: text("status", { enum: ["new", "in_progress", "resolved"] }).default("new").notNull(),
  category: text("category", { enum: ["pothole", "garbage", "streetlight", "other"] }).notNull(),
  mediaUrls: text("media_urls").array().default([]),
  userId: text("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  userId: true
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
