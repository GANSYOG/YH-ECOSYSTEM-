
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
        let errorMessage = 'Server error';
        try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            // Handle cases where response is not JSON (e.g. 502/504 errors from a proxy)
            errorMessage = `HTTP error! status: ${res.status}${res.statusText ? ` (${res.statusText})` : ''}`;
        }
        throw new Error(errorMessage);
    }

    try {
        const data = await res.json();
        return data;
    } catch (e) {
        throw new Error('Failed to parse response as JSON');
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
