
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color, trend }) => {
  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{label}</h3>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
