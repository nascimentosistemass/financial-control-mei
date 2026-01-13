import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  delay?: number;
}

export function MetricCard({ title, value, icon, trend, className, delay = 0 }: MetricCardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 animate-in",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold font-display text-foreground">{value}</h3>
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          trend === "up" ? "bg-green-100 text-green-700" :
          trend === "down" ? "bg-red-100 text-red-700" :
          "bg-blue-100 text-primary"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
