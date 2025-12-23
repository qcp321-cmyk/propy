import { GoogleGenAI } from "@google/genai";
import { Property } from '../types';

/**
 * Handle PERMISSION_DENIED (403) by prompting key selection if in a supported environment.
 */
const handleGenAiError = async (error: any) => {
    console.error("GenAI Error context:", error);
    const errorMsg = error?.message || "";
    if (errorMsg.includes("PERMISSION_DENIED") || errorMsg.includes("403") || errorMsg.includes("Requested entity was not found")) {
        if (typeof window.aistudio !== 'undefined') {
            await window.aistudio.openSelectKey();
            // Guidelines: assume success and let the next retry use process.env.API_KEY
        }
    }
    throw error;
};

export const generateRouteSteps = async (from: string, to: string): Promise<string[]> => {
  if (!process.env.API_KEY) return ["Start from " + from, "Head North on Airport Rd", "Turn right at Hebbal Flyover", "Reach destination"];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a 10-step driving route from ${from}, Bengaluru to ${to}, Bengaluru. Be specific with road names like 'Outer Ring Road' or 'Bellary Road'. Include distance for each step. Format as bullet points.`,
      config: {
        systemInstruction: "You are a professional Bengaluru navigation engineer. Provide clear, turn-by-turn directions suitable for a luxury property brochure."
      }
    });

    const raw = response.text || "";
    const lines = raw.split('\n')
      .map(l => l.trim().replace(/^[\*\-\d\.\s]+/, ''))
      .filter(l => l.length > 5)
      .slice(0, 10);
      
    if (lines.length === 0) return [`Direct route from ${from} to ${to} via NH44`];
    return lines;
  } catch (error) {
    return handleGenAiError(error).catch(() => [`Commute from ${from} to ${to} via main corridor.`]);
  }
};

export const searchTopProperties = async (query: string): Promise<{ properties: any[], sources: any[] }> => {
  if (!process.env.API_KEY) return { properties: [], sources: [] };
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';

  const systemInstruction = `
    You are 'Propertyfie Intel Unit', a high-level real estate audit engine for North Bengaluru. 
    Use Google Search to perform deep due diligence on properties matching the user's query.
    
    CRITICAL INSTRUCTIONS:
    1. Identify 'BUY' recommendations: Verified, RERA-approved, clean title projects (Embassy, Godrej, Prestige, Purva, Provident, Bhartiya, Brigade).
    2. Identify 'AVOID' recommendations: Properties with active litigations or RERA complaints.
    3. Return your findings strictly as a JSON array of objects inside a markdown code block.
    
    JSON Schema:
    {
      "id": "string",
      "title": "string",
      "price": number,
      "address": "string",
      "beds": number,
      "baths": number,
      "sqft": number,
      "type": "string",
      "description": "string",
      "developer": "string",
      "features": ["string"],
      "reraId": "string",
      "recommendation": "BUY" | "AVOID",
      "riskReason": "string (required for AVOID)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Search and audit real estate in Bengaluru for: ${query}. Include at least one high-risk 'AVOID' property if any litigations are found.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    const properties = jsonMatch ? JSON.parse(jsonMatch[1]) : [];
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      ?.filter(Boolean) || [];

    return { properties, sources };
  } catch (error) {
    return handleGenAiError(error).catch(() => ({ properties: [], sources: [] }));
  }
};

export const generateChatResponse = async (message: string, properties: Property[]): Promise<string> => {
  if (!process.env.API_KEY) return "API Key is missing.";
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are Propertyfie AI, expert in North Bengaluru real estate. Provide financial audits and investment advice.",
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    return handleGenAiError(error).catch(() => "Error connecting to AI terminal. Check API Key permissions.");
  }
};