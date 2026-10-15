// Audio, Sound Effects & Text-to-Speech Engine for E-Smart English Kids
// Optimized for primary school students (Grade 1 & 2) with British English (en-GB) priority

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Cheerful correct answer ding
  playDing() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  // Star ding
  playStar() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  // Coin collect sound
  playCoin() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  // Try again gentle bump
  playBuzzer() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  // Unit completion victory celebration
  playVictory() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.15 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.5, d: 0.4 },  // C6
      ];
      let t = now;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = n.f;
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + n.d + 0.05);
        t += n.d;
      });
    } catch {
      // ignore
    }
  }

  // Bridge speakText method on soundManager for convenience
  speakText(text: string, rateOrOptions?: number | string | { rate?: number; pitch?: number; lang?: string }): Promise<void> {
    return speakText(text, rateOrOptions);
  }
}

export const soundManager = new SoundEffectsManager();

// ==========================================
// TEACHER CUSTOM AUDIO REPOSITORY (LOCALSTORAGE)
// ==========================================
const CUSTOM_AUDIO_STORAGE_KEY = 'esmart_custom_audio_map';
const TTS_RATE_STORAGE_KEY = 'esmart_tts_rate';

export function getAllCustomAudios(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CUSTOM_AUDIO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getCustomAudio(text: string): string | null {
  const all = getAllCustomAudios();
  const normalized = text.trim().toLowerCase();
  return all[normalized] || null;
}

export function setCustomAudio(text: string, audioUrlOrBase64: string): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllCustomAudios();
    all[text.trim().toLowerCase()] = audioUrlOrBase64;
    localStorage.setItem(CUSTOM_AUDIO_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save custom audio:', e);
  }
}

export function removeCustomAudio(text: string): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllCustomAudios();
    delete all[text.trim().toLowerCase()];
    localStorage.setItem(CUSTOM_AUDIO_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to remove custom audio:', e);
  }
}

// User-configurable speech rate helper (default 0.82 for Grade 1 & 2 clarity)
export function getSavedSpeechRate(): number {
  if (typeof window === 'undefined') return 0.82;
  try {
    const r = localStorage.getItem(TTS_RATE_STORAGE_KEY);
    if (r) {
      const parsed = parseFloat(r);
      if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 1.5) return parsed;
    }
  } catch {}
  return 0.82;
}

export function setSavedSpeechRate(rate: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TTS_RATE_STORAGE_KEY, rate.toString());
  } catch {}
}

// ==========================================
// SPEECH SYNTHESIS ENGINE (BRITISH ENGLISH PRIORITY)
// ==========================================
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const available = window.speechSynthesis.getVoices();
    if (available && available.length > 0) {
      cachedVoices = available;
      voicesLoaded = true;
      resolve(cachedVoices);
      return;
    }

    // Wait for onvoiceschanged event (WebKit / Chrome / Edge)
    const onVoicesChanged = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
        voicesLoaded = true;
        window.speechSynthesis.onvoiceschanged = null;
        resolve(cachedVoices);
      }
    };

    window.speechSynthesis.onvoiceschanged = onVoicesChanged;

    // Fallback timeout in case onvoiceschanged does not fire
    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 500);
  });
}

// Initialize voices listener early
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
}

/**
 * Select the most natural British English (en-GB) voice, falling back gracefully
 */
export function getBestEnglishVoice(voices: SpeechSynthesisVoice[], preferLang: string = 'en-GB'): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // British voice names highly rated for clarity
  const preferredUkNames = [
    'Daniel', 'Serena', 'Oliver', 'George', 'Hazel', 'Stephanie', 
    'Google UK English Female', 'Google UK English Male', 'Arthur', 'Martha'
  ];

  if (preferLang.startsWith('en-GB') || preferLang === 'en-GB') {
    // 1. Look for preferred UK voices
    for (const name of preferredUkNames) {
      const match = voices.find((v) => v.lang.startsWith('en-GB') && v.name.includes(name));
      if (match) return match;
    }

    // 2. Any en-GB voice
    const anyUk = voices.find((v) => v.lang.replace('_', '-').toLowerCase().startsWith('en-gb'));
    if (anyUk) return anyUk;
  }

  // 3. Fallback to US English friendly voices (Samantha, Alex, Victoria, Google US English)
  const preferredUsNames = ['Samantha', 'Alex', 'Victoria', 'Google US English', 'Zira'];
  for (const name of preferredUsNames) {
    const match = voices.find((v) => v.lang.startsWith('en-US') && v.name.includes(name));
    if (match) return match;
  }

  // 4. Any en-US voice
  const anyUs = voices.find((v) => v.lang.replace('_', '-').toLowerCase().startsWith('en-us'));
  if (anyUs) return anyUs;

  // 5. Any English voice
  const anyEn = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  if (anyEn) return anyEn;

  return voices[0] || null;
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  forceTTS?: boolean;
}

/**
 * Plays teacher-uploaded custom audio first, or falls back to TTS.
 */
export async function playWordAudio(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!text) return;
  const cleanText = text.trim();

  // 1. Check if teacher provided custom recording or audio file
  if (!options.forceTTS) {
    const customUrl = getCustomAudio(cleanText);
    if (customUrl) {
      try {
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(customUrl);
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error('Custom audio play error'));
          audio.play().catch(reject);
        });
        return;
      } catch (err) {
        console.warn('Custom audio playback failed, falling back to TTS:', err);
      }
    }
  }

  // 2. Fall back to SpeakText
  return speakText(cleanText, options);
}

/**
 * Text-to-Speech using native Web Speech Synthesis with natural British/US voice
 */
export function speakText(
  text: string, 
  rateOrOptions?: number | string | SpeakOptions
): Promise<void> {
  return new Promise(async (resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    if (!text || text.trim() === '') {
      resolve();
      return;
    }

    // Parse options
    let rate = getSavedSpeechRate();
    let pitch = 1.05; // Slightly cheerful, friendly child pitch
    let lang = 'en-GB'; // Default to British English as requested

    if (typeof rateOrOptions === 'number') {
      rate = rateOrOptions;
    } else if (typeof rateOrOptions === 'string') {
      if (rateOrOptions.includes('-') || rateOrOptions.length === 2) {
        lang = rateOrOptions;
      }
    } else if (typeof rateOrOptions === 'object' && rateOrOptions !== null) {
      if (typeof rateOrOptions.rate === 'number') rate = rateOrOptions.rate;
      if (typeof rateOrOptions.pitch === 'number') pitch = rateOrOptions.pitch;
      if (rateOrOptions.lang) lang = rateOrOptions.lang;
    }

    window.speechSynthesis.cancel();

    // Ensure voices are loaded
    let voices = cachedVoices;
    if (!voicesLoaded || voices.length === 0) {
      voices = await loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate; // Clear pacing for Vietnamese Grade 1 & 2
    utterance.pitch = pitch;

    const chosenVoice = getBestEnglishVoice(voices, lang);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Speech Recognition helper with fallback simulation for testing without mic
 */
export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onError: (err: any) => void
) {
  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRec) {
    return null;
  }

  const recognition = new SpeechRec();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  return recognition;
}
