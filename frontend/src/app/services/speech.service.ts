import { Injectable } from '@angular/core';

export interface SpeechPlaybackOptions {
  rate?: number;
  onStart?: (info: { duration: number }) => void;
  onProgress?: (info: { elapsed: number; percent: number; duration: number }) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface SpeechController {
  duration: number;
  pause(): void;
  resume(): void;
  stop(): void;
  setRate(rate: number): SpeechController | null;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  private currentController: SpeechController | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initVoices();
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  private initVoices(): void {
    if (this.isSupported()) {
      this.voices = window.speechSynthesis.getVoices() || [];
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
      };
    }
  }

  getBestSpanishVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length && this.isSupported()) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
    if (!this.voices.length) return null;

    // 1. Preferir voces naturales en español latinoamericano
    const naturalVoice = this.voices.find(v =>
      v.lang.startsWith('es') && (
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('sabina') ||
        v.name.toLowerCase().includes('dalia') ||
        v.name.toLowerCase().includes('jorge') ||
        v.name.toLowerCase().includes('google español') ||
        v.name.toLowerCase().includes('mexico')
      )
    );
    if (naturalVoice) return naturalVoice;

    // 2. Cualquier voz en español
    const anyEs = this.voices.find(v => v.lang.toLowerCase().startsWith('es'));
    if (anyEs) return anyEs;

    // 3. Fallback
    return this.voices[0] || null;
  }

  /**
   * Limpia el texto de formato Markdown, emojis y abreviaturas para una locución fluida
   */
  cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return String(text)
      // Quitar enlaces markdown [texto](url) -> texto
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Quitar negritas y cursivas
      .replace(/(\*\*|\*|__|_)/g, '')
      // Convertir precios en lempiras (ej: L. 2,950 -> 2950 lempiras)
      .replace(/L\.\s*([\d,]+)/g, '$1 lempiras')
      // Quitar caracteres especiales
      .replace(/[#•\-—]/g, ' ')
      // Sustituir SKU por "código"
      .replace(/\bSKU\b/gi, 'código')
      // Quitar emojis
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Estima duración en segundos (aprox 2.3 palabras por segundo en español)
   */
  estimateDuration(text: string, rate: number = 1.0): number {
    const clean = this.cleanTextForSpeech(text);
    const words = clean.split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.round((words / 2.3) / rate));
  }

  /**
   * Genera alturas para visualizador de onda (waveform) estilo WhatsApp (26 barras)
   */
  generateWaveform(count: number = 26): number[] {
    const bars: number[] = [];
    for (let i = 0; i < count; i++) {
      const val = 20 + Math.round(Math.abs(Math.sin(i * 0.45) * 60) + Math.abs(Math.cos(i * 0.9) * 20));
      bars.push(Math.min(100, Math.max(20, val)));
    }
    return bars;
  }

  /**
   * Reproduce el texto mediante SpeechSynthesisUtterance con progreso de onda
   */
  speak(text: string, options: SpeechPlaybackOptions = {}): SpeechController | null {
    if (!this.isSupported()) {
      options.onError?.(new Error('SpeechSynthesis no está soportado en este navegador.'));
      return null;
    }

    this.stop();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) {
      options.onEnd?.();
      return null;
    }

    const rate = options.rate || 1.0;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-MX';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voice = this.getBestSpanishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'es-MX';
    }

    const estDuration = this.estimateDuration(cleanText, rate);
    let startTime = 0;
    let progressTimer: any = null;
    let isPlaying = false;

    this.activeUtterance = utterance;

    const startPlayback = () => {
      if (isPlaying) return;
      isPlaying = true;
      startTime = Date.now();
      options.onStart?.({ duration: estDuration });

      progressTimer = setInterval(() => {
        if (!isPlaying) return;
        const elapsed = (Date.now() - startTime) / 1000;
        const percent = Math.min(100, Math.round((elapsed / estDuration) * 100));
        options.onProgress?.({ elapsed: Math.min(estDuration, elapsed), percent, duration: estDuration });
        if (elapsed >= estDuration + 1) {
          clearInterval(progressTimer);
        }
      }, 100);
    };

    utterance.onstart = startPlayback;

    utterance.onend = () => {
      isPlaying = false;
      if (progressTimer) clearInterval(progressTimer);
      options.onProgress?.({ elapsed: estDuration, percent: 100, duration: estDuration });
      options.onEnd?.();
      this.currentController = null;
      this.activeUtterance = null;
    };

    utterance.onerror = (e) => {
      isPlaying = false;
      if (progressTimer) clearInterval(progressTimer);
      options.onError?.(e);
      this.currentController = null;
      this.activeUtterance = null;
    };

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
      setTimeout(() => {
        if (!isPlaying) startPlayback();
      }, 150);
    } catch (err) {
      if (progressTimer) clearInterval(progressTimer);
      options.onError?.(err);
      return null;
    }

    const controller: SpeechController = {
      duration: estDuration,
      pause: () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          isPlaying = false;
        }
      },
      resume: () => {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          isPlaying = true;
        }
      },
      stop: () => {
        isPlaying = false;
        if (progressTimer) clearInterval(progressTimer);
        window.speechSynthesis.cancel();
        this.currentController = null;
        options.onEnd?.();
      },
      setRate: (newRate: number) => {
        controller.stop();
        return this.speak(text, { ...options, rate: newRate });
      }
    };

    this.currentController = controller;
    return controller;
  }

  stop(): void {
    if (this.currentController) {
      this.currentController.stop();
      this.currentController = null;
    }
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }
}
