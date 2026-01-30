
import type { Agent, GeminiMessage } from '../types';

const API_BASE = 'http://localhost:3001/api';

export const getGeminiResponse = async (agent: Agent, history: GeminiMessage[]) => {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, history })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server error');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
