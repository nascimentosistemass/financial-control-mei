import { z } from 'zod';
import { insertIncomeSchema, insertCostSchema, incomes, costs, type InsertIncome, type InsertCost } from './schema';

export { type InsertIncome, type InsertCost };

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  incomes: {
    list: {
      method: 'GET' as const,
      path: '/api/incomes',
      responses: {
        200: z.array(z.custom<typeof incomes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/incomes',
      input: insertIncomeSchema,
      responses: {
        201: z.custom<typeof incomes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/incomes/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  costs: {
    list: {
      method: 'GET' as const,
      path: '/api/costs',
      responses: {
        200: z.array(z.custom<typeof costs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/costs',
      input: insertCostSchema,
      responses: {
        201: z.custom<typeof costs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/costs/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  summary: {
    get: {
      method: 'GET' as const,
      path: '/api/summary',
      responses: {
        200: z.array(z.object({
          month: z.string(),
          totalIncome: z.number(),
          totalCost: z.number(),
          totalLabor: z.number(),
          totalProducts: z.number(),
          profit: z.number(),
        })),
      },
    },
    download: {
      method: 'GET' as const,
      path: '/api/summary/download',
      responses: {
        200: z.any(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
