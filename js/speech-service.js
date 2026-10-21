/**
 * Servicio de Síntesis de Voz (Text-to-Speech) para SMAKBOT
 * Proporciona reproducción de voz en español y generación de notas de voz estilo WhatsApp
 */

export class SpeechService {
  static currentController = null;
  static voices = [];

  static isSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  static getVoices() {
    if (!this.isSupported()) return [];
    if (!this.voices.length) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
    return this.voices;
  }

  /**
   * Obtiene la mejor voz en español disponible en el navegador
   */
  static getBestSpanishVoice() {
    const voices = this.getVoices();
    if (!voices.length) return null;

    // 1. Preferir voces en español latinoamericano (es-MX, es-US, es-CO, etc.) o naturales
    const naturalVoice = voices.find(v => 
      v.lang.startsWith("es") && (
        v.name.toLowerCase().includes("natural") || 
        v.name.toLowerCase().includes("sabina") ||
        v.name.toLowerCase().includes("dalia") ||
        v.name.toLowerCase().includes("jorge") ||
        v.name.toLowerCase().includes("google español") ||
        v.name.toLowerCase().includes("mexico")
      )
    );
    if (naturalVoice) return naturalVoice;

    // 2. Cualquier voz en español
    const anyEs = voices.find(v => v.lang.toLowerCase().startsWith("es"));
    if (anyEs) return anyEs;

    // 3. Fallback voz por defecto
    return voices[0] || null;
  }

  /**
   * Limpia el texto de formato Markdown, emojis y abreviaturas para una locución natural
   */
  static cleanTextForSpeech(text) {
    if (!text) return "";
    let clean = String(text)
      // Quitar bloques de enlaces markdown [texto](url) -> texto
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      // Quitar negritas y cursivas
      .replace(/(\*\*|\*|__|_)/g, "")
      // Convertir precios en lempiras (ej: L.1,050 o L. 1050 -> 1050 lempiras)
      .replace(/L\.\s*([\d,]+)/g, "$1 lempiras")
      // Quitar asteriscos, numerales y viñetas
      .replace(/[#•\-—]/g, " ")
      // Sustituir SKU por "código"
      .replace(/\bSKU\b/gi, "código")
      // Quitar emojis comunes
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      // Reducir espacios múltiples
      .replace(/\s+/g, " ")
      .trim();

    return clean;
  }

  /**
   * Estima la duración de reproducción en segundos según cantidad de palabras
   */
  static estimateDuration(text, rate = 1.0) {
    const clean = this.cleanTextForSpeech(text);
    const words = clean.split(/\s+/).filter(Boolean).length;
    // Promedio de locución en español: ~140 palabras por minuto (~2.3 palabras por segundo)
    const seconds = Math.max(2, Math.round((words / 2.3) / rate));
    return seconds;
  }

  /**
   * Genera alturas para visualizador de onda de audio (waveform) de WhatsApp
   */
  static generateWaveform(count = 28) {
    const bars = [];
    for (let i = 0; i < count; i++) {
      // Patrón pseudo-aleatorio armónico
      const val = 20 + Math.round(Math.abs(Math.sin(i * 0.45) * 60) + Math.abs(Math.cos(i * 0.9) * 20));
      bars.push(Math.min(100, Math.max(20, val)));
    }
    return bars;
  }

  /**
   * Reproduce el texto usando SpeechSynthesis con eventos y actualización de progreso
   */
  static speak(text, { onStart, onProgress, onEnd, onError, rate = 1.0 } = {}) {
    if (!this.isSupported()) {
      onError?.(new Error("Tu navegador no soporta síntesis de voz (SpeechSynthesis)."));
      return null;
    }

    // Detener cualquier locución activa
    this.stop();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) {
      onEnd?.();
      return null;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "es-MX";
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voice = this.getBestSpanishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "es-MX";
    }

    const estDuration = this.estimateDuration(cleanText, rate);
    let startTime = 0;
    let progressTimer = null;
    let isPlaying = false;

    // Retener referencia para evitar garbage collection prematuro en Chrome/Edge
    SpeechService.activeUtterance = utterance;

    const startPlayback = () => {
      if (isPlaying) return;
      isPlaying = true;
      startTime = Date.now();
      onStart?.({ duration: estDuration });

      // Emular avance de onda de audio
      progressTimer = setInterval(() => {
        if (!isPlaying) return;
        const elapsed = (Date.now() - startTime) / 1000;
        const percent = Math.min(100, Math.round((elapsed / estDuration) * 100));
        onProgress?.({ elapsed: Math.min(estDuration, elapsed), percent, duration: estDuration });
        if (elapsed >= estDuration + 1) {
          clearInterval(progressTimer);
        }
      }, 100);
    };

    utterance.onstart = startPlayback;

    utterance.onend = () => {
      isPlaying = false;
      if (progressTimer) clearInterval(progressTimer);
      onProgress?.({ elapsed: estDuration, percent: 100, duration: estDuration });
      onEnd?.();
      SpeechService.currentController = null;
      SpeechService.activeUtterance = null;
    };

    utterance.onerror = (e) => {
      isPlaying = false;
      if (progressTimer) clearInterval(progressTimer);
      onError?.(e);
      SpeechService.currentController = null;
      SpeechService.activeUtterance = null;
    };

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
      // Fallback si el evento onstart tarda en dispararse
      setTimeout(() => {
        if (!isPlaying) startPlayback();
      }, 150);
    } catch (err) {
      if (progressTimer) clearInterval(progressTimer);
      onError?.(err);
      return null;
    }

    const controller = {
      utterance,
      duration: estDuration,
      pause() {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          isPlaying = false;
        }
      },
      resume() {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          isPlaying = true;
        }
      },
      stop() {
        isPlaying = false;
        if (progressTimer) clearInterval(progressTimer);
        window.speechSynthesis.cancel();
        SpeechService.currentController = null;
        onEnd?.();
      },
      setRate(newRate) {
        // Para cambiar velocidad, reiniciar locución con nuevo rate
        this.stop();
        return SpeechService.speak(text, { onStart, onProgress, onEnd, onError, rate: newRate });
      }
    };

    SpeechService.currentController = controller;
    return controller;
  }

  static stop() {
    if (this.currentController) {
      this.currentController.stop();
      this.currentController = null;
    }
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }
}

// Inicializar lista de voces en navegadores basados en Chromium
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    SpeechService.voices = window.speechSynthesis.getVoices() || [];
  };
}
