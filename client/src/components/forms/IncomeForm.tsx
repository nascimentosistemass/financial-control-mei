import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIncomeSchema, type InsertIncome } from "@shared/schema";
import { useCreateIncome } from "@/hooks/use-finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.coerce.number().min(0, "Valor cobrado deve ser positivo"),
  materialCost: z.coerce.number().min(0, "Custo deve ser positivo"),
  laborCost: z.coerce.number().min(0, "Valor deve ser positivo"),
  gasolineCost: z.coerce.number().min(0, "Custo deve ser positivo"),
  utilitiesCost: z.coerce.number().min(0, "Custo deve ser positivo"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
});

interface IncomeFormProps {
  onSuccess?: () => void;
}

export function IncomeForm({ onSuccess }: IncomeFormProps) {
  const { toast } = useToast();
  const createIncome = useCreateIncome();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      materialCost: 0,
      laborCost: 0,
      gasolineCost: 0,
      utilitiesCost: 0,
      date: new Date().toLocaleDateString('en-CA'), // Correct YYYY-MM-DD format for input date
    },
  });

  const { watch } = form;
  const amount = watch("amount") || 0;
  const material = watch("materialCost") || 0;
  const labor = watch("laborCost") || 0;
  const gasoline = watch("gasolineCost") || 0;
  const utilities = watch("utilitiesCost") || 0;

  const totalCosts = Number(material) + Number(gasoline) + Number(utilities);
  const estimatedProfit = Number(amount) - totalCosts;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await createIncome.mutateAsync({
        ...data,
        amount: data.amount.toString(),
        materialCost: data.materialCost.toString(),
        laborCost: data.laborCost.toString(),
        gasolineCost: data.gasolineCost.toString(),
        utilitiesCost: data.utilitiesCost.toString(),
        productAmount: data.materialCost.toString(), // We treat material cost as product value for dashboard
      } as InsertIncome);
      toast({
        title: "Sucesso!",
        description: "Entrada registrada com sucesso.",
        variant: "default",
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Reforma de armário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Cobrado (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h4 className="font-semibold text-sm">Custos Inclusos</h4>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="materialCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Custo Material (Produto)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="h-8" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="laborCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Valor Mão de Obra</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="h-8" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gasolineCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Custo Gasolina</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="h-8" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="utilitiesCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Despesas Extras</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="h-8" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between p-3 bg-primary/10 rounded-lg text-xs font-bold">
          <div className="text-destructive">Total Custos: R$ {totalCosts.toFixed(2)}</div>
          <div className="text-orange-600">Mão de Obra: R$ {Number(labor).toFixed(2)}</div>
          <div className="text-green-600">Lucro: R$ {estimatedProfit.toFixed(2)}</div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={createIncome.isPending}
        >
          {createIncome.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
          ) : (
            "Registrar Entrada"
          )}
        </Button>
      </form>
    </Form>
  );
}
