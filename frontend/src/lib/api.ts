const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/tts';

export interface Voice {
  name: string;
  shortName: string;
  gender: 'Female' | 'Male' | string;
  locale: string;
  friendlyName: string;
  suggestedCodec?: string;
}

export interface SynthesisRequest {
  text: string;
  voice: string;
  rate?: number | string;
  pitch?: number | string;
  volume?: number | string;
}

export interface SynthesisResponse {
  success: boolean;
  data?: {
    fileName: string;
    filePath: string;
    fileSize: number;
    voice: string;
    textLength: number;
    createdAt: string;
    audioUrl: string;
  };
  message?: string;
}

/**
 * Fetch available voices from the backend
 */
export async function getVoices(): Promise<Voice[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/voices`);
    if (!res.ok) {
      throw new Error(`Failed to load voices: ${res.statusText}`);
    }
    const data = await res.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error in getVoices:', error);
    throw error;
  }
}

/**
 * Synthesize text into audio
 */
export async function synthesizeSpeech(payload: SynthesisRequest): Promise<SynthesisResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Speech synthesis failed');
    }
    return data;
  } catch (error) {
    console.error('Error in synthesizeSpeech:', error);
    throw error;
  }
}
