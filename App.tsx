
import React, { useState, useMemo } from 'react';
import { InputGroup } from './components/InputGroup';
import { ResultCard } from './components/ResultCard';
import { DrillingProfile } from './components/DrillingProfile';
import { DrillingInputs, DrillingResults, HistoryItem } from './types';
import { getDrillingAdvice } from './services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

type CalcMode = 'barras' | 'sobrante';

const App: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('barras');
  const [inputs, setInputs] = useState<DrillingInputs>({
    fondoPozo: 0,
    largoBarril: 0,
    muerto: 0,
    barrasInput: 0
  });

  const [advice, setAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const results: DrillingResults = useMemo(() => {
    let barras = 0;
    let sobrante = 0;
    let herramienta = 0;

    if (mode === 'barras') {
      // Modo: Calcular Barras (Fórmula: (Fondo - Barril + Muerto) / 3)
      barras = (inputs.fondoPozo - inputs.largoBarril + inputs.muerto) / 3;
      sobrante = (barras * 3) + inputs.largoBarril - inputs.muerto - inputs.fondoPozo;
      herramienta = inputs.fondoPozo + inputs.muerto + sobrante;
    } else {
      // Modo: Calcular Sobrante (Barras es entrada manual)
      barras = inputs.barrasInput || 0;
      sobrante = (barras * 3) + inputs.largoBarril - inputs.muerto - inputs.fondoPozo;
      herramienta = inputs.fondoPozo + inputs.muerto + sobrante;
    }

    return { barras, sobrante, herramienta };
  }, [inputs, mode]);

  const handleInputChange = (key: keyof DrillingInputs, val: number) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const getAdvice = async () => {
    setIsLoadingAdvice(true);
    const text = await getDrillingAdvice({ ...inputs, ...results, mode });
    setAdvice(text || '');
    setIsLoadingAdvice(false);
  };

  const saveToHistory = () => {
    const newItem: HistoryItem = {
      ...inputs,
      ...results,
      mode,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 5));
  };

  const chartData = [
    { name: 'Fondo', value: inputs.fondoPozo, color: '#3b82f6' },
    { name: 'Barras (m)', value: results.barras * 3, color: '#10b981' },
    { name: 'Sobrante', value: results.sobrante, color: '#8b5cf6' },
    { name: 'Herramienta', value: results.herramienta, color: '#f59e0b' }
  ];

  return (
    <div className="min-h-screen pb-32 px-4 md:px-8 max-w-7xl mx-auto flex flex-col">
      <header className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Calculadora de Perforación
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Cálculos precisos con precisión decimal (0.00)</p>
        </div>
        <button 
          onClick={saveToHistory}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
        >
          Guardar Registro
        </button>
      </header>

      {/* Tabs Navigation */}
      <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8 w-full max-w-md mx-auto md:mx-0 border border-slate-200 shadow-inner">
        <button
          onClick={() => setMode('barras')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${mode === 'barras' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Calcular Barras
        </button>
        <button
          onClick={() => setMode('sobrante')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${mode === 'sobrante' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Calcular Sobrante
        </button>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        {/* Columna Izquierda: Entradas y AI */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
            <h2 className="text-xl font-bold mb-6 text-slate-800">
              {mode === 'barras' ? 'Entradas para Barras' : 'Entradas para Sobrante'}
            </h2>
            <div className="flex flex-col gap-5">
              {mode === 'sobrante' && (
                <InputGroup 
                  label="Cantidad de Barras" 
                  value={inputs.barrasInput || 0} 
                  onChange={(v) => handleInputChange('barrasInput', v)}
                  description="Número de barras utilizadas"
                  icon={<svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 7h10M7 12h10M7 17h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                />
              )}
              <InputGroup 
                label="Fondo del Pozo" 
                value={inputs.fondoPozo} 
                onChange={(v) => handleInputChange('fondoPozo', v)}
                description="Profundidad (m)"
                icon={<svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
              <InputGroup 
                label="Largo del Barril" 
                value={inputs.largoBarril} 
                onChange={(v) => handleInputChange('largoBarril', v)}
                description="Longitud barril (m)"
                icon={<svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
              <InputGroup 
                label="Muerto" 
                value={inputs.muerto} 
                onChange={(v) => handleInputChange('muerto', v)}
                description="Margen muerto (m)"
                icon={<svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
            </div>
            <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-400">
                {mode === 'barras' 
                  ? "Fórmula: (Fondo - Barril + Muerto) / 3" 
                  : "Fórmula: (Barras * 3) + Barril - Muerto - Fondo"}
            </div>
          </section>

          <section className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">Asistente Técnico</h2>
              <button onClick={getAdvice} disabled={isLoadingAdvice} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                {isLoadingAdvice ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" strokeWidth="2" strokeLinecap="round"/></svg>}
              </button>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {advice || "Presiona el icono para analizar los parámetros con precisión de 2 decimales."}
            </p>
          </section>
        </div>

        {/* Columna Derecha: Resultados, Perfil y Gráfico */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResultCard label="Barras" value={results.barras} unit="Und" color="border-blue-500" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6" strokeWidth="2" strokeLinecap="round"/></svg>} />
            <ResultCard label="Sobrante" value={results.sobrante} unit="m" color="border-emerald-500" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4" strokeWidth="2" strokeLinecap="round"/></svg>} />
            <ResultCard label="Herramienta" value={results.herramienta} unit="m" color="border-amber-500" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3" strokeWidth="2" strokeLinecap="round"/></svg>} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            {/* Nuevo Gráfico de Perfil Diamantino */}
            <DrillingProfile 
              herramienta={results.herramienta} 
              sobrante={results.sobrante} 
              muerto={inputs.muerto}
              fondo={inputs.fondoPozo}
            />

            {/* Gráfico de Barras de Distribución */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
              <h2 className="text-sm font-bold mb-8 text-slate-400 uppercase tracking-widest">Resumen Métrico</h2>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={80} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {history.length > 0 && (
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
              <h2 className="text-xs font-bold mb-4 text-slate-400 uppercase tracking-widest">Historial Reciente</h2>
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.mode === 'barras' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {item.mode}
                      </span>
                      <span className="text-slate-400 font-mono text-xs">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex gap-4 font-bold text-slate-700">
                      <span>{item.barras.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">Und</span></span>
                      <span>{item.sobrante.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">m</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Pie de página con créditos */}
      <footer className="mt-auto py-8 text-center border-t border-slate-200/60 hidden lg:block">
        <p className="text-slate-400 text-sm font-medium">
          Diseñado por: <span className="text-slate-600 font-bold">Intelliearth</span> - by <span className="text-blue-600 italic">Jimmy Valderrama</span>
        </p>
      </footer>

      {/* Footer / Summary Bar (Sticky on Mobile) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-2 lg:hidden z-50">
        <div className="flex justify-around mb-2">
          <div className="text-center">
            <p className="text-[8px] uppercase font-bold text-slate-400 leading-none">Barras</p>
            <p className="text-base font-bold text-blue-600 leading-tight">{results.barras.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] uppercase font-bold text-slate-400 leading-none">Sobrante</p>
            <p className="text-base font-bold text-emerald-600 leading-tight">{results.sobrante.toFixed(2)}m</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] uppercase font-bold text-slate-400 leading-none">Herram.</p>
            <p className="text-base font-bold text-amber-600 leading-tight">{results.herramienta.toFixed(2)}m</p>
          </div>
        </div>
        <div className="text-center pt-1 border-t border-slate-100">
           <p className="text-[9px] text-slate-400 font-medium">
            Diseñado por: <span className="text-slate-500 font-bold">Intelliearth</span> - by <span className="text-blue-500 italic">Jimmy Valderrama</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
