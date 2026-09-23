import { loadUserApiKey, loadSelectedModel } from '../utils/storage';
import { GeminiModelId, PraiseLetter } from '../types/user';

export const FALLBACK_MODELS: GeminiModelId[] = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
];

/**
 * Executes a Gemini prompt with automatic fallback across the 3 models defined in AI_INSTRUCTIONS.md:
 * 1. gemini-3-flash-preview
 * 2. gemini-3-pro-preview
 * 3. gemini-2.5-flash
 */
export async function callGeminiWithFallback(
  prompt: string,
  options?: {
    systemInstruction?: string;
    responseMimeType?: string;
    preferredModel?: GeminiModelId;
    apiKey?: string;
  }
): Promise<{ text: string; modelUsed: GeminiModelId }> {
  const apiKey = (options?.apiKey || loadUserApiKey() || '').trim();

  if (!apiKey) {
    throw new Error(
      'API_KEY_REQUIRED: Chưa có API key. Vui lòng nhấn nút "Lấy API key để sử dụng app" trên Header để nhập key từ aistudio.google.com/api-keys.'
    );
  }

  const preferred = options?.preferredModel || loadSelectedModel() || 'gemini-3-flash-preview';

  // Build model priority queue with preferred model first, then remaining
  const queue: GeminiModelId[] = [
    preferred,
    ...FALLBACK_MODELS.filter((m) => m !== preferred),
  ];

  let lastErrorText = '';

  for (let i = 0; i < queue.length; i++) {
    const currentModel = queue[i];
    try {
      // 1. Try local server endpoint if running
      try {
        const serverRes = await fetch('/api/ai/raw-generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-api-key': apiKey,
          },
          body: JSON.stringify({
            prompt,
            model: currentModel,
            responseMimeType: options?.responseMimeType,
          }),
        });

        // Check if server returned valid JSON (not SPA index.html rewrite)
        const contentType = serverRes.headers.get('content-type') || '';
        if (serverRes.ok && contentType.includes('application/json')) {
          const json = await serverRes.json();
          if (json.success && json.text) {
            return { text: json.text, modelUsed: currentModel };
          }
        }
      } catch {
        // Fall back to direct Gemini client API
      }

      // 2. Direct Gemini REST API in browser (Works on Vercel static deployments without backend)
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

      const payload: any = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      if (options?.systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: options.systemInstruction }],
        };
      }

      if (options?.responseMimeType === 'application/json') {
        payload.generationConfig = {
          responseMimeType: 'application/json',
        };
      }

      const directRes = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await directRes.json();

      if (!directRes.ok) {
        const errStatus = resData?.error?.status || `HTTP_${directRes.status}`;
        const errMsg = resData?.error?.message || 'Lỗi không xác định từ Gemini API';
        throw new Error(`${errStatus}: ${errMsg}`);
      }

      const candidateText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        return { text: candidateText, modelUsed: currentModel };
      }

      throw new Error(`Model ${currentModel} returned empty response.`);
    } catch (err: any) {
      lastErrorText = err?.message || String(err);
      console.warn(`[E-SMART AI] Model ${currentModel} error: ${lastErrorText}. Retrying next model...`);
      // Retry step with next model as per AI_INSTRUCTIONS.md
    }
  }

  // All 3 models failed - display exact raw error as required
  throw new Error(`Tất cả các model AI đều thất bại. Nguyên văn lỗi: ${lastErrorText}`);
}

/**
 * AI Speech Evaluation
 */
export async function evaluateSpeechAI(
  targetText: string,
  recognizedText: string,
  grade: 1 | 2 = 1,
  unitTitle: string = 'General English'
): Promise<{
  pronunciationScore: number;
  fluencyScore: number;
  accuracyScore: number;
  rating: 'Excellent' | 'Good Job' | 'Try Again';
  tips: string;
  modelUsed?: GeminiModelId;
}> {
  const cleanTarget = (targetText || '').trim().toLowerCase().replace(/[.,!?:;]/g, '');
  const cleanRecognized = (recognizedText || '').trim().toLowerCase().replace(/[.,!?:;]/g, '');

  const prompt = `You are a warm, supportive primary school English speech coach for Vietnamese children (Grade ${grade}).
Evaluate the student's spoken attempt against the target English sentence or word.
Unit: "${unitTitle}"
Target sentence/word: "${targetText}"
Student recognized speech: "${recognizedText || '(Silence or unclear sound)'}"

Return ONLY valid JSON with this exact schema:
{
  "pronunciationScore": <integer 40-100>,
  "fluencyScore": <integer 40-100>,
  "accuracyScore": <integer 40-100>,
  "rating": "<one of 'Excellent' | 'Good Job' | 'Try Again'>",
  "tips": "<a short, warm, motivating tip in Vietnamese for Grade ${grade} child (max 20 words)>"
}`;

  try {
    const { text, modelUsed } = await callGeminiWithFallback(prompt, {
      responseMimeType: 'application/json',
    });

    const parsed = JSON.parse(text);
    return {
      pronunciationScore: Number(parsed.pronunciationScore) || 90,
      fluencyScore: Number(parsed.fluencyScore) || 88,
      accuracyScore: Number(parsed.accuracyScore) || 90,
      rating: parsed.rating || 'Good Job',
      tips: parsed.tips || 'Con phát âm rất to và rõ ràng! Hãy tiếp tục phát huy nhé!',
      modelUsed,
    };
  } catch (err: any) {
    // If exact API error (e.g. 429 RESOURCE_EXHAUSTED or API_KEY_REQUIRED), bubble up
    if (err?.message?.includes('429') || err?.message?.includes('API_KEY')) {
      throw err;
    }

    // Heuristic fallback for speech matching
    const isExact = cleanTarget === cleanRecognized;
    const isPartial = cleanRecognized.includes(cleanTarget) || cleanTarget.includes(cleanRecognized);
    const score = isExact ? 96 : isPartial ? 88 : 72;
    const rating = score >= 90 ? 'Excellent' : score >= 80 ? 'Good Job' : 'Try Again';

    return {
      pronunciationScore: score,
      fluencyScore: score - 4,
      accuracyScore: score,
      rating: rating as any,
      tips:
        score >= 90
          ? 'Con phát âm tuyệt vời! Chuẩn âm bản xứ!'
          : 'Con chú ý bật hơi rõ âm cuối nhé! Cố lên nào!',
    };
  }
}

/**
 * AI Story Generation
 */
export async function generateStoryAI(
  topic: string,
  grade: 1 | 2 = 1,
  unitNumber: number = 1,
  targetWords: string[] = []
): Promise<{ story: any; modelUsed?: GeminiModelId }> {
  const prompt = `Create a short, child-friendly 3-scene comic story in English for Vietnamese Grade ${grade} students.
Curriculum: Global Success English Grade ${grade}, Unit ${unitNumber}.
Topic: "${topic}".
Vocabulary to include: ${targetWords.join(', ')}.

Return ONLY valid JSON matching this schema:
{
  "id": "story-${Date.now()}",
  "title": "<Catchy English story title>",
  "topic": "${topic}",
  "scenes": [
    {
      "sceneIndex": 1,
      "characterName": "Smarty the Owl",
      "characterAvatar": "🦉",
      "backgroundDescription": "<short description of setting>",
      "dialogueEn": "<Simple English sentence with vocabulary word>",
      "dialogueVi": "<Vietnamese translation for child>",
      "challengePrompt": "<Quick speaking challenge for the child>"
    },
    {
      "sceneIndex": 2,
      "characterName": "Bill",
      "characterAvatar": "👦",
      "backgroundDescription": "<setting>",
      "dialogueEn": "<Simple English dialogue>",
      "dialogueVi": "<Vietnamese translation>",
      "challengePrompt": "<Speaking challenge>"
    },
    {
      "sceneIndex": 3,
      "characterName": "Ba",
      "characterAvatar": "🧒",
      "backgroundDescription": "<setting>",
      "dialogueEn": "<Conclusion dialogue>",
      "dialogueVi": "<Vietnamese translation>",
      "challengePrompt": "<Speaking challenge>"
    }
  ]
}`;

  const { text, modelUsed } = await callGeminiWithFallback(prompt, {
    responseMimeType: 'application/json',
  });

  const parsed = JSON.parse(text);
  return { story: parsed, modelUsed };
}

/**
 * AI Praise Letter Generation
 */
export async function generatePraiseLetterAI(
  studentName: string,
  grade: 1 | 2,
  completedUnitsCount: number,
  speakingScore: number,
  listeningScore: number,
  badgesCount: number,
  teacherName: string
): Promise<{ praiseLetter: PraiseLetter; modelUsed?: GeminiModelId }> {
  const prompt = `You are primary school English teacher "${teacherName}" teaching Grade ${grade} in Vietnam.
Write a formal, encouraging Commendation Letter (Praise Letter) in English for student "${studentName}".
Achievements:
- Completed ${completedUnitsCount} full units of Global Success English.
- Speaking Fluency Score: ${speakingScore}%.
- Listening Comprehension: ${listeningScore}%.
- Badges Earned: ${badgesCount}.

Return ONLY valid JSON:
{
  "headline": "<Inspiring commendation headline>",
  "letterBody": "<A heartfelt 3-paragraph letter celebrating communicative confidence, phonics, and digital ethics>",
  "keyHighlights": [
    "<Highlight 1>",
    "<Highlight 2>",
    "<Highlight 3>"
  ],
  "encouragementQuote": "<A short memorable quote inspiring the child>"
}`;

  const { text, modelUsed } = await callGeminiWithFallback(prompt, {
    responseMimeType: 'application/json',
  });

  const parsed = JSON.parse(text);
  const letter: PraiseLetter = {
    id: 'pl-' + Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    recipient: studentName,
    headline: parsed.headline || 'Commendation of Extraordinary English Communicative Competence',
    letterBody: parsed.letterBody,
    keyHighlights: parsed.keyHighlights || [
      `Mastered ${completedUnitsCount} units with ${listeningScore}% listening comprehension`,
      `Achieved ${speakingScore}% in AI Speaking Coach oral roleplays`,
      `Earned ${badgesCount} achievement badges in the 2018 General Education Curriculum`,
    ],
    encouragementQuote:
      parsed.encouragementQuote || 'When you speak English with confidence, the whole world listens with a smile!',
    signOff: `Best wishes,\n${teacherName}`,
    verifiedBy: `${teacherName} - E-Smart English Kids Lead Educator`,
  };

  return { praiseLetter: letter, modelUsed };
}

/**
 * Directly validates a user-provided Gemini API key
 */
export async function testGeminiApiKey(
  apiKey: string,
  model: GeminiModelId = 'gemini-3-flash-preview'
): Promise<{ success: boolean; error?: string }> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { success: false, error: 'Vui lòng nhập API key!' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errStatus = data?.error?.status || `HTTP_${res.status}`;
      const errMsg = data?.error?.message || 'Lỗi xác thực API key';
      return { success: false, error: `${errStatus}: ${errMsg}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Không thể kết nối đến máy chủ Google AI Studio.' };
  }
}
