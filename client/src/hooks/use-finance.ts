import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertIncome, type InsertCost } from "@shared/routes";

// ============================================
// INCOMES (ENTRADAS)
// ============================================

export function useIncomes() {
  return useQuery({
    queryKey: [api.incomes.list.path],
    queryFn: async () => {
      const res = await fetch(api.incomes.list.path);
      if (!res.ok) throw new Error("Falha ao carregar entradas");
      return api.incomes.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertIncome) => {
      const res = await fetch(api.incomes.create.path, {
        method: api.incomes.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.incomes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Falha ao criar entrada');
      }
      return api.incomes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.incomes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.summary.get.path] });
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.incomes.delete.path, { id });
      const res = await fetch(url, { method: api.incomes.delete.method });
      if (!res.ok) throw new Error('Falha ao deletar entrada');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.incomes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.summary.get.path] });
    },
  });
}

// ============================================
// COSTS (CUSTOS)
// ============================================

export function useCosts() {
  return useQuery({
    queryKey: [api.costs.list.path],
    queryFn: async () => {
      const res = await fetch(api.costs.list.path);
      if (!res.ok) throw new Error("Falha ao carregar custos");
      return api.costs.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCost) => {
      const res = await fetch(api.costs.create.path, {
        method: api.costs.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.costs.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Falha ao criar custo');
      }
      return api.costs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.costs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.summary.get.path] });
    },
  });
}

export function useDeleteCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.costs.delete.path, { id });
      const res = await fetch(url, { method: api.costs.delete.method });
      if (!res.ok) throw new Error('Falha ao deletar custo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.costs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.summary.get.path] });
    },
  });
}

// ============================================
// SUMMARY (RESUMO)
// ============================================

export function useSummary() {
  return useQuery({
    queryKey: [api.summary.get.path],
    queryFn: async () => {
      const res = await fetch(api.summary.get.path);
      if (!res.ok) throw new Error("Falha ao carregar resumo");
      return api.summary.get.responses[200].parse(await res.json());
    },
  });
}
