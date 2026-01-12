
import React from 'react';

interface DrillingProfileProps {
  herramienta: number;
  sobrante: number;
  muerto: number;
  fondo: number;
}

export const DrillingProfile: React.FC<DrillingProfileProps> = ({ herramienta, sobrante, muerto, fondo }) => {
  const total = Math.max(fondo + muerto + sobrante, 1); // Evitar división por cero
  
  // Calculamos porcentajes para el gráfico vertical
  const hPct = (herramienta / total) * 100;
  const sPct = (sobrante / total) * 100;
  const mPct = (muerto / total) * 100;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 h-full flex flex-col">
      <h2 className="text-sm font-bold mb-6 text-slate-400 uppercase tracking-widest">Perfil de Sondaje</h2>
      
      <div className="flex flex-row h-full gap-8 items-stretch pb-4">
        {/* El Pozo Visual */}
        <div className="w-16 bg-slate-100 rounded-full relative overflow-hidden border-4 border-slate-200 flex flex-col-reverse shadow-inner">
          <div 
            style={{ height: `${hPct}%` }} 
            className="bg-amber-500 w-full transition-all duration-500 ease-out border-t border-amber-600/20"
            title="Herramienta"
          />
          <div 
            style={{ height: `${sPct}%` }} 
            className="bg-emerald-500 w-full transition-all duration-500 ease-out border-t border-emerald-600/20"
            title="Sobrante"
          />
          <div 
            style={{ height: `${mPct}%` }} 
            className="bg-rose-500 w-full transition-all duration-500 ease-out"
            title="Muerto"
          />
        </div>

        {/* Leyendas y Metrajes */}
        <div className="flex flex-col justify-between flex-1 py-2 font-mono text-xs">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="flex flex-col">
                <span className="text-slate-400">Muerto</span>
                <span className="text-slate-900 font-bold">{muerto.toFixed(2)}m</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div className="flex flex-col">
                <span className="text-slate-400">Sobrante</span>
                <span className="text-slate-900 font-bold">{sobrante.toFixed(2)}m</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="flex flex-col">
                <span className="text-slate-400">Herramienta</span>
                <span className="text-slate-900 font-bold">{herramienta.toFixed(2)}m</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-auto">
             <div className="flex flex-col">
                <span className="text-slate-400 uppercase text-[10px]">Prof. Total (Fondo)</span>
                <span className="text-blue-600 text-lg font-black">{fondo.toFixed(2)}m</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
