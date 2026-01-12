
export interface DrillingInputs {
  fondoPozo: number;
  largoBarril: number;
  muerto: number;
  barrasInput?: number; // Para el cálculo manual de sobrante
}

export interface DrillingResults {
  barras: number;
  sobrante: number;
  herramienta: number;
}

export interface HistoryItem extends DrillingInputs, DrillingResults {
  id: string;
  timestamp: number;
  mode: 'barras' | 'sobrante';
}
