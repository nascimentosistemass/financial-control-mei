import { useSummary } from "@/hooks/use-finance";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/MetricCard";
import { FinanceChart } from "@/components/FinanceChart";
import { Navigation } from "@/components/Navigation";
import { Wallet, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api } from "@shared/routes";

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export default function Dashboard() {
  const { data: summary, isLoading, error } = useSummary();

  const handleDownload = async () => {
    try {
      const response = await fetch(api.summary.download.path);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Controle_Financeiro_MEI.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-destructive">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalIncome = summary?.reduce((acc, curr) => acc + Number(curr.totalIncome), 0) || 0;
  const totalCost = summary?.reduce((acc, curr) => acc + Number(curr.totalCost), 0) || 0;
  const totalLabor = summary?.reduce((acc, curr) => acc + Number(curr.totalLabor), 0) || 0;
  const totalProducts = summary?.reduce((acc, curr) => acc + Number(curr.totalProducts), 0) || 0;
  const totalProfit = summary?.reduce((acc, curr) => acc + Number(curr.profit), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Visão Geral</h1>
            <p className="text-muted-foreground mt-1">Acompanhe a saúde financeira do seu negócio.</p>
          </div>
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Baixar Excel (XLSX)
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </>
          ) : (
            <>
              <MetricCard 
                title="Total Entradas" 
                value={formatCurrency(totalIncome)} 
                icon={<ArrowUpRight className="w-5 h-5" />}
                trend="up"
                delay={100}
              />
              <MetricCard 
                title="Total Custos" 
                value={formatCurrency(totalCost)} 
                icon={<ArrowDownRight className="w-5 h-5" />}
                trend="down"
                delay={200}
              />
              <MetricCard 
                title="Total Produtos" 
                value={formatCurrency(totalProducts)} 
                icon={<Wallet className="w-5 h-5" />}
                trend="up"
                delay={300}
              />
              <MetricCard 
                title="Total Mão Obra" 
                value={formatCurrency(totalLabor)} 
                icon={<Wallet className="w-5 h-5" />}
                trend="up"
                delay={400}
              />
              <MetricCard 
                title="Lucro Líquido" 
                value={formatCurrency(totalProfit)} 
                icon={<DollarSign className="w-5 h-5" />}
                trend={totalProfit >= 0 ? "up" : "down"}
                delay={500}
              />
            </>
          )}
        </div>

        {/* Chart Section */}
        {isLoading ? (
          <Skeleton className="h-[400px] rounded-2xl" />
        ) : (
          <FinanceChart data={summary || []} />
        )}

        {/* Summary Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold font-display">Detalhamento Mensal</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>Total Entradas</TableHead>
                  <TableHead>Custos</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Mão de Obra</TableHead>
                  <TableHead className="text-right">Lucro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  summary?.map((item) => (
                    <TableRow key={item.month} className="hover:bg-gray-50 text-sm">
                      <TableCell className="font-medium">{item.month}</TableCell>
                      <TableCell className="text-blue-600">{formatCurrency(item.totalIncome)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(item.totalCost)}</TableCell>
                      <TableCell className="text-blue-500">{formatCurrency(item.totalProducts)}</TableCell>
                      <TableCell className="text-orange-600">{formatCurrency(item.totalLabor)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-bold",
                        item.profit >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {formatCurrency(item.profit)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </main>
    </div>
  );
}
