import Constants from 'expo-constants';

// Stable, recommended model for general tasks
const DEFAULT_MODEL = 'gemini-2.5-flash';
const SCOPE_REFUSAL_MESSAGE =
  'Maaf, saya hanya dapat membantu topik masakan Nusantara dan arsitektur Nusantara. Silakan ajukan pertanyaan dalam konteks tersebut.';

const NUSANTARA_SCOPE_INSTRUCTION =
  'Anda adalah asisten AKSANUSA. Hanya jawab topik masakan Nusantara dan arsitektur Nusantara. '
  + 'Topik yang diizinkan: makanan tradisional Indonesia, bahan, bumbu, teknik memasak, sejarah kuliner daerah, '
  + 'rumah adat, elemen arsitektur tradisional Indonesia, filosofi dan sejarah arsitektur Nusantara. '
  + 'Topik di luar itu (politik, matematika umum, hukum, kesehatan, coding, dan topik lain) harus ditolak dengan sopan '
  + 'dengan kalimat singkat dan ajakan untuk kembali ke topik Nusantara. Jangan berikan jawaban substantif untuk topik di luar konteks.';

function formatGeminiResponse(text) {
  // Mulai dengan membersihkan teks secara umum
  let formatted = (text || '').trim();

  // 1. Bersihkan tanda bintang berlebihan dan malformed headers
  formatted = formatted.replace(/\*{3,}/g, '');
  formatted = formatted.replace(/([^:]+):\*+/g, '<strong>$1:</strong>');

  // 2. Format bold text dengan asterisk
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*([^*]+)\*(?!\*)/g, '<strong>$1</strong>');

  // 3. Bersihkan asterisk yang tersisa
  formatted = formatted.replace(/\*(?![a-zA-Z0-9])/g, '');

  // 4. Format mathematical expressions
  formatted = formatted.replace(/\\theta/g, 'θ');
  formatted = formatted.replace(/\\sin/g, 'sin');
  formatted = formatted.replace(/\\cos/g, 'cos');
  formatted = formatted.replace(/\\tan/g, 'tan');
  formatted = formatted.replace(/\\cdot/g, '·');

  formatted = formatted.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="formula">($1)/($2)</span>');

  formatted = formatted.replace(/([a-zA-Z])_\{([^}]+)\}/g, '$1<sub>$2</sub>');
  formatted = formatted.replace(/([a-zA-Z])_([a-zA-Z0-9])/g, '$1<sub>$2</sub>');
  formatted = formatted.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  formatted = formatted.replace(/\^([0-9]+)/g, '<sup>$1</sup>');

  formatted = formatted.replace(/\$([^$]+)\$/g, '<span class="formula">$1</span>');

  // 5. Format struktur teks
  formatted = formatted.replace(/•\s*/g, '<br>• ');
  formatted = formatted.replace(/\n•/g, '<br>•');

  formatted = formatted.replace(/(\d+)\.\s*/g, '<br>$1. ');

  formatted = formatted.replace(/\n([A-Za-z\s]+):/g, '<br><strong>$1:</strong>');
  formatted = formatted.replace(/^([A-Za-z\s]+):/g, '<strong>$1:</strong>');

  // 6. Format line breaks
  formatted = formatted.replace(/\n\n/g, '<br><br>');
  formatted = formatted.replace(/\n/g, '<br>');

  // 7. Pembersihan akhir
  formatted = formatted.replace(/(<br>){3,}/g, '<br><br>');
  formatted = formatted.replace(/^(<br>)+/, '');
  formatted = formatted.replace(/(<br>)+$/, '');
  formatted = formatted.replace(/\s*<span class="formula">/g, ' <span class="formula">');
  formatted = formatted.replace(/<\/span>\s*/g, '</span> ');

  // React Native Text tidak merender HTML, jadi konversi kembali ke plain text.
  formatted = formatted.replace(/<br>/g, '\n');
  formatted = formatted.replace(/<\/?.*?>/g, '');

  return formatted.trim();
}

function getApiKey() {
  const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (envKey) return envKey;
  const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;
  if (extra && extra.geminiApiKey) return extra.geminiApiKey;
  return null;
}

function isPromptInScope(prompt) {
  const text = (prompt || '').toLowerCase();

  // Keep basic greetings available so the bot can guide user to allowed topics.
  const greetingRegex = /^(halo|hai|hi|selamat\s+(pagi|siang|sore|malam)|permisi|assalamualaikum)/;
  if (greetingRegex.test(text.trim())) return true;

  const allowedKeywords = [
    'nusantara',
    'indonesia',
    'masakan',
    'makanan',
    'kuliner',
    'resep',
    'bumbu',
    'hidangan',
    'sambal',
    'soto',
    'rendang',
    'gudeg',
    'sate',
    'arsitektur',
    'rumah adat',
    'joglo',
    'gadang',
    'tongkonan',
    'honai',
    'candi',
    'budaya',
    'tradisional',
  ];

  return allowedKeywords.some((keyword) => text.includes(keyword));
}

export async function sendMessage(prompt, apiKeyParam) {
  const cleanPrompt = (prompt || '').trim();
  const apiKey = apiKeyParam || getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not found. Set EXPO_PUBLIC_GEMINI_API_KEY in .env.local or expo Config `extra.geminiApiKey`.');
  }

  if (!isPromptInScope(cleanPrompt)) {
    return SCOPE_REFUSAL_MESSAGE;
  }

  // 1. Updated to standard v1 endpoint and switched from generateText to generateContent
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;
  const scopedPrompt = `${NUSANTARA_SCOPE_INSTRUCTION}\n\nPertanyaan pengguna: ${cleanPrompt}\n\nJawab hanya jika konteksnya masakan Nusantara atau arsitektur Nusantara. Jika pertanyaan di luar konteks, tolak dengan sopan.`;
  
  // 2. Updated the body to match the current Content/Parts schema
  const body = {
    contents: [
      {
        parts: [
          { text: scopedPrompt }
        ]
      }
    ]
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
  return formatGeminiResponse(text);
}

export default { sendMessage };