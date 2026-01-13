import { Link, useLocation } from "wouter";
import { LayoutDashboard, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Resumo", icon: LayoutDashboard },
    { href: "/incomes", label: "Entradas", icon: TrendingUp },
    { href: "/costs", label: "Custos", icon: TrendingDown },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Controle MEI
            </span>
          </div>
          <div className="flex space-x-1 sm:space-x-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={cn(
                    "inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-colors cursor-pointer h-full",
                    isActive 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  )}>
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
