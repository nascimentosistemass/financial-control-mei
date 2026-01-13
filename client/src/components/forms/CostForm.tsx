import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCostSchema, type InsertCost } from "@shared/schema";
import { useCreateCost } from "@/hooks/use-finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = insertCostSchema.extend({
  materialCost: z.coerce.number().min(0, "Valor deve ser positivo"),
  laborCost: z.coerce.number().min(0, "Valor deve ser positivo"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
});

interface CostFormProps {
  onSuccess?: () => void;
}

export function CostForm({ onSuccess }: CostFormProps) {
  const { toast } = useToast();
  const createCost = useCreateCost();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      materialCost: 0,
      laborCost: 0,
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await createCost.mutateAsync({
        ...data,
        materialCost: data.materialCost.toString(),
        laborCost: data.laborCost.toString(),
      } as InsertCost);
      toast({
        title: "Sucesso!",
        description: "Custo registrado com sucesso.",
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
                <Input placeholder="Ex: Compra de material" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="materialCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Material (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="laborCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Mão de Obra (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <Button 
          type="submit" 
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          disabled={createCost.isPending}
        >
          {createCost.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Registrar Custo"
          )}
        </Button>
      </form>
    </Form>
  );
}
