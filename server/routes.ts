import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import ExcelJS from "exceljs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Incomes
  app.get(api.incomes.list.path, async (req, res) => {
    const incomes = await storage.getIncomes();
    res.json(incomes);
  });

  app.post(api.incomes.create.path, async (req, res) => {
    try {
      // Coerce numeric fields to string for database compatibility
      const input = api.incomes.create.input.parse({
        ...req.body,
        amount: String(req.body.amount || "0"),
        productAmount: String(req.body.productAmount || "0"),
        materialCost: String(req.body.materialCost || "0"),
        laborCost: String(req.body.laborCost || "0"),
        gasolineCost: String(req.body.gasolineCost || "0"),
        utilitiesCost: String(req.body.utilitiesCost || "0"),
      });
      const income = await storage.createIncome(input);
      res.status(201).json(income);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.incomes.delete.path, async (req, res) => {
    await storage.deleteIncome(Number(req.params.id));
    res.status(204).end();
  });

  // Costs
  app.get(api.costs.list.path, async (req, res) => {
    const costs = await storage.getCosts();
    res.json(costs);
  });

  app.post(api.costs.create.path, async (req, res) => {
    try {
      const input = api.costs.create.input.parse({
        ...req.body,
        materialCost: String(req.body.materialCost || "0"),
        laborCost: String(req.body.laborCost || "0"),
      });
      const cost = await storage.createCost(input);
      res.status(201).json(cost);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.costs.delete.path, async (req, res) => {
    await storage.deleteCost(Number(req.params.id));
    res.status(204).end();
  });

  // Summary
  app.get(api.summary.get.path, async (req, res) => {
    const summary = await storage.getSummary();
    res.json(summary);
  });

  app.get(api.summary.download.path, async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    
    // Entradas
    const wsIncomes = workbook.addWorksheet('Entradas');
    wsIncomes.columns = [
      { header: 'Data', key: 'date', width: 15 },
      { header: 'Descrição', key: 'description', width: 30 },
      { header: 'Valor Entrada', key: 'amount', width: 15 },
    ];
    const allIncomes = await storage.getIncomes();
    allIncomes.forEach(i => wsIncomes.addRow({ ...i, amount: Number(i.amount) }));

    // Custos
    const wsCosts = workbook.addWorksheet('Custos');
    wsCosts.columns = [
      { header: 'Data', key: 'date', width: 15 },
      { header: 'Descrição', key: 'description', width: 30 },
      { header: 'Custo Material', key: 'materialCost', width: 15 },
      { header: 'Custo Mão de Obra', key: 'laborCost', width: 15 },
    ];
    const allCosts = await storage.getCosts();
    allCosts.forEach(c => wsCosts.addRow({ ...c, materialCost: Number(c.materialCost), laborCost: Number(c.laborCost) }));

    // Resumo
    const wsSummary = workbook.addWorksheet('Resumo');
    wsSummary.columns = [
      { header: 'Mês', key: 'month', width: 10 },
      { header: 'Total Entradas', key: 'totalIncome', width: 15 },
      { header: 'Total Custos', key: 'totalCost', width: 15 },
      { header: 'Lucro', key: 'profit', width: 15 },
    ];
    const summary = await storage.getSummary();
    summary.forEach((s: any) => wsSummary.addRow(s));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Controle_Financeiro_MEI.xlsx');

    await workbook.xlsx.write(res);
    res.status(200).end();
  });

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const incomes = await storage.getIncomes();
  if (incomes.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    
    // Seed Incomes
    await storage.createIncome({ date: today, description: "Serviço Consultoria", amount: "1500.00" });
    await storage.createIncome({ date: today, description: "Venda Produto A", amount: "300.50" });
    
    // Seed Costs
    await storage.createCost({ date: today, description: "Compra Material X", materialCost: "200.00", laborCost: "0.00" });
    await storage.createCost({ date: today, description: "Mão de Obra Extra", materialCost: "0.00", laborCost: "150.00" });
  }
}

// Add to startup
import { db } from "./db";
// We can't easily run seed here without causing issues in some setups, but we'll try to expose it or run it once.
// Ideally, we run it after DB connection.
seedDatabase().catch(console.error);
