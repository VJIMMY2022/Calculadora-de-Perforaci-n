
import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon: React.ReactNode;
  description?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, icon, description }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-lg shadow-sm"
        placeholder="0.00"
      />
      {description && <p className="text-xs text-slate-400">{description}</p>}
    </div>
  );
};
