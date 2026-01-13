import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { type SummaryStats } from '@shared/schema';

interface FinanceChartProps {
  data: SummaryStats;
}

export function FinanceChart({ data }: FinanceChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">Resultado Mensal</h3>
        <p className="text-sm text-muted-foreground">Comparativo de entradas vs custos</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `R$${value/1000}k`}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar 
              dataKey="totalIncome" 
              name="Entradas" 
              fill="hsl(221 83% 53%)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
            <Bar 
              dataKey="totalCost" 
              name="Custos" 
              fill="hsl(346 84% 60%)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
            <Bar 
              dataKey="profit" 
              name="Lucro" 
              fill="hsl(150 80% 40%)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
