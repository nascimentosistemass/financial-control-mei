import { db } from "./db";
import {
  incomes, costs,
  type InsertIncome, type InsertCost,
  type Income, type Cost,
  type SummaryStats
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getIncomes(): Promise<Income[]>;
  createIncome(income: InsertIncome): Promise<Income>;
  deleteIncome(id: number): Promise<void>;

  getCosts(): Promise<Cost[]>;
  createCost(cost: InsertCost): Promise<Cost>;
  deleteCost(id: number): Promise<void>;

  getSummary(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getIncomes(): Promise<Income[]> {
    return await db.select().from(incomes).orderBy(desc(incomes.date));
  }

  async createIncome(income: InsertIncome): Promise<Income> {
    const [newIncome] = await db.insert(incomes).values(income).returning();
    return newIncome;
  }

  async deleteIncome(id: number): Promise<void> {
    await db.delete(incomes).where(eq(incomes.id, id));
  }

  async getCosts(): Promise<Cost[]> {
    return await db.select().from(costs).orderBy(desc(costs.date));
  }

  async createCost(cost: InsertCost): Promise<Cost> {
    const [newCost] = await db.insert(costs).values(cost).returning();
    return newCost;
  }

  async deleteCost(id: number): Promise<void> {
    await db.delete(costs).where(eq(costs.id, id));
  }

  async getSummary(): Promise<any> {
    const allIncomes = await this.getIncomes();
    const allCosts = await this.getCosts();

    const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const summary = months.map((mes, index) => {
      const monthIndex = index;

      const monthlyIncomes = allIncomes.filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === monthIndex;
      });
      
      const monthlyCostsFromTab = allCosts.filter(c => {
         const d = new Date(c.date);
         return d.getMonth() === monthIndex;
      });

      const totalIncome = monthlyIncomes.reduce((sum, i) => sum + Number(i.amount), 0);
      
      // Calculate costs: material, gasoline, extras. EXCLUDE labor.
      const incomeCosts = monthlyIncomes.reduce((sum, i) => 
        sum + Number(i.materialCost || 0) + Number(i.gasolineCost || 0) + Number(i.utilitiesCost || 0), 0
      );
      
      const tabCosts = monthlyCostsFromTab.reduce((sum, c) => 
        sum + Number(c.materialCost) + Number(c.laborCost), 0
      );

      const totalCost = incomeCosts + tabCosts;

      // Labor specifically from income entries
      const totalLabor = monthlyIncomes.reduce((sum, i) => sum + Number(i.laborCost || 0), 0);
      
      // Products specifically from income entries
      const totalProducts = monthlyIncomes.reduce((sum, i) => sum + Number(i.productAmount || 0), 0);

      return {
        month: mes,
        totalIncome,
        totalCost,
        totalLabor,
        totalProducts,
        profit: totalIncome - totalCost
      };
    });

    return summary;
  }
}

export const storage = new DatabaseStorage();
