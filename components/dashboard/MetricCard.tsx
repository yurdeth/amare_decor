import React from 'react';
import { TrendingUp, TrendingDown, PieChart, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: 'income' | 'expense' | 'profit' | 'events';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  const getIcon = () => {
    const iconClass = 'w-6 h-6';

    switch (icon) {
      case 'income':
        return <TrendingUp className={iconClass} />;
      case 'expense':
        return <TrendingDown className={iconClass} />;
      case 'profit':
        return <PieChart className={iconClass} />;
      case 'events':
        return <Calendar className={iconClass} />;
      default:
        return <TrendingUp className={iconClass} />;
    }
  };

  const getIconColor = () => {
    switch (icon) {
      case 'income':
        return 'bg-primary/20 text-primary';
      case 'expense':
        return 'bg-primary/10 text-primary';
      case 'profit':
        return 'bg-secondary/40 text-white';
      case 'events':
        return 'bg-accent/40 text-primary';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  return (
    <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover-elevate fade-in border border-[#8E977D]/10 hover:border-[#8E977D]/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${getIconColor()}`}>
          {getIcon()}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-500'
            }`}
          >
            <span>{trend.isPositive ? '+' : '-'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-primary/70 mb-1">{title}</h3>
      <p className="text-3xl font-display font-bold text-primary">
        {typeof value === 'number' && (icon === 'income' || icon === 'expense' || icon === 'profit')
          ? formatCurrency(value)
          : value}
      </p>
    </div>
  );
}
