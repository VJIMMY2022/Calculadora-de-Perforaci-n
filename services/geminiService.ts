
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDrillingAdvice = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un ingeniero experto en perforación. Analiza los siguientes datos calculados:
      Fondo del Pozo: ${data.fondoPozo}m,
      Largo del Barril: ${data.largoBarril}m,
      Muerto: ${data.muerto}m.
      Resultados calculados: Barras: ${data.barras}, Sobrante: ${data.sobrante}m, Herramienta: ${data.herramienta}m.
      Proporciona un consejo técnico breve (máximo 100 palabras) sobre la seguridad o eficiencia basada en estas medidas.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "No se pudo obtener el consejo técnico en este momento.";
  }
};
