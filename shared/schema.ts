import { pgTable, text, serial, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // Valor cobrado (TOTAL)
  productAmount: decimal("product_amount", { precision: 10, scale: 2 }).default("0.00"), // Valor dos produtos vendidos
  materialCost: decimal("material_cost", { precision: 10, scale: 2 }).default("0.00"),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }).default("0.00"),
  gasolineCost: decimal("gasoline_cost", { precision: 10, scale: 2 }).default("0.00"),
  utilitiesCost: decimal("utilities_cost", { precision: 10, scale: 2 }).default("0.00"),
});

export const costs = pgTable("costs", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  description: text("description").notNull(),
  materialCost: decimal("material_cost", { precision: 10, scale: 2 }).notNull(),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }).notNull(),
});

// === SCHEMAS ===
export const insertIncomeSchema = createInsertSchema(incomes).omit({ id: true });
export const insertCostSchema = createInsertSchema(costs).omit({ id: true });

// === EXPLICIT TYPES ===
export type Income = typeof incomes.$inferSelect;
export type InsertIncome = z.infer<typeof insertIncomeSchema>;

export type Cost = typeof costs.$inferSelect;
export type InsertCost = z.infer<typeof insertCostSchema>;

// Request types
export type CreateIncomeRequest = InsertIncome;
export type CreateCostRequest = InsertCost;

// Response types
export type SummaryStats = {
  month: string;
  totalIncome: number;
  totalCost: number;
  totalLabor: number;
  totalProducts: number;
  profit: number;
}[];
