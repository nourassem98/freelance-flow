import React from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'indigo' | 'emerald' | 'amber' | 'blue';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  color = 'indigo',
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const iconColors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          
          {change && (
            <div className="mt-2 flex items-center gap-1">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Clock className="h-4 w-4 text-gray-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === 'up'
                    ? 'text-emerald-600'
                    : trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>

        <div className={`rounded-lg p-3 ${iconColors[color]}`}>
          {icon || (
            <div className="h-6 w-6">
              <div className="h-full w-full rounded-full bg-current opacity-70"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;