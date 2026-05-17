import Constants from 'expo-constants';

// Stable, recommended model for general tasks
const DEFAULT_MODEL = 'gemini-2.5-flash';

function getApiKey() {
  const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (envKey) return envKey;
  const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;
  if (extra && extra.geminiApiKey) return extra.geminiApiKey;
  return null;
}

export async function sendMessage(prompt, apiKeyParam) {
  const apiKey = apiKeyParam || getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not found. Set EXPO_PUBLIC_GEMINI_API_KEY in .env.local or expo Config `extra.geminiApiKey`.');
  }

  // 1. Updated to standard v1 endpoint and switched from generateText to generateContent
  const url = `https://generativelanguage.googleapis.com/v1/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;
  
  // 2. Updated the body to match the current Content/Parts schema
  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 512,
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || JSON.stringify(json);
    throw new Error(`Gemini API error: ${msg}`);
  }

  // 3. Updated the response extraction to look into the modern parts array structure
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(json);
  return text;
}

export default { sendMessage };