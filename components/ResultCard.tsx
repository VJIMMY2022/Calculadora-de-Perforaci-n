
import React from 'react';

interface ResultCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit, color, icon }) => {
  return (
    <div className={`p-6 rounded-2xl bg-white border-l-8 ${color} shadow-lg shadow-slate-200/50 flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold text-slate-800">{value.toFixed(2)}</span>
        <span className="text-slate-400 font-medium">{unit}</span>
      </div>
    </div>
  );
};
