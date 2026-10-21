/**
 * Servicio de Transcripción de Audio en Línea para SMAKBOT
 * Conexión sincrónica con modelo Whisper / Transcriptor FastAPI
 */

export class TranscriptionService {
  static API_URL = "https://automatic-space-dollop-976prv4wg4ghpqqx-8000.app.github.dev/v1/transcribe/sync";
  static API_KEY = "sales-secret-api-key-change-in-prod";

  /**
   * Envía un archivo o Blob de audio al endpoint de transcripción
   * @param {Blob|File} fileOrBlob 
   * @param {string} [fileName="audio.mp3"]
   * @param {Object} [options={}]
   * @param {boolean} [options.vad_filter=false]
   * @param {string} [options.language="es"]
   * @returns {Promise<{full_text: string, duration_seconds: number, segments: Array}>}
   */
  static async transcribeAudio(fileOrBlob, fileName = "audio.mp3", options = {}) {
    const formData = new FormData();
    const finalFileName = fileOrBlob.name || fileName;
    
    // Si es un Blob sin tipo específico, asignarle mp3 o wav
    formData.append("file", fileOrBlob, finalFileName);
    formData.append("file_path", "string");
    formData.append("task_id", (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : ("task-" + Date.now()));
    formData.append("language", options.language || "es");
    formData.append("vad_filter", options.vad_filter !== undefined ? String(options.vad_filter) : "false");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "accept": "*/*",
          "X-Internal-API-Key": this.API_KEY
        },
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("El archivo de audio es demasiado grande. Prueba con una nota de voz menor a 10MB.");
        }
        if (response.status === 401) {
          throw new Error("Error 401: Verifica que el puerto 8000 en Codespaces esté en visibilidad 'Public'.");
        }
        const errText = await response.text().catch(() => "");
        throw new Error(`Error ${response.status} en transcripción: ${errText || response.statusText}`);
      }

      const data = await response.json();
      return {
        full_text: data.full_text || "",
        duration_seconds: data.duration_seconds || 0,
        segments: data.segments || [],
        language: data.language_detected || "es",
        raw: data
      };
    } catch (netErr) {
      console.warn("Fallo de conexión con transcriptor en Codespaces:", netErr);
      
      // Fallback automático para audios de demostración cuando Codespaces no esté activo
      const lowerName = String(finalFileName || "").toLowerCase();
      if (lowerName.includes("perchero")) {
        return {
          full_text: "Hola buenas tardes, quería consultar si tienen el perchero disponible y cuánto tiempo se tardan en venir a dejarlo a la casa",
          duration_seconds: 5,
          segments: [],
          language: "es",
          isFallback: true
        };
      }
      if (lowerName.includes("regadera")) {
        return {
          full_text: "Buenas tardes, mándeme fotos de las regaderas y para qué sirve el drenaje lineal",
          duration_seconds: 4,
          segments: [],
          language: "es",
          isFallback: true
        };
      }

      // Si fue una grabación o archivo no reconocido y el servidor remoto falló
      throw new Error("El transcriptor en Codespaces no está disponible en este momento. Usa los escenarios de prueba (Perchero / Regaderas) o escribe tu mensaje.");
    }
  }

  /**
   * Helper para crear un controlador de grabación con el micrófono del navegador
   */
  static createRecorder() {
    let mediaRecorder = null;
    let chunks = [];
    let stream = null;

    return {
      async start() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Tu navegador no soporta grabación con micrófono.");
        }
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = [];
        
        // Formatos soportados comúnmente en navegadores
        let mimeType = "audio/webm";
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
          mimeType = "audio/ogg;codecs=opus";
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };
        mediaRecorder.start();
      },

      async stop() {
        return new Promise((resolve, reject) => {
          if (!mediaRecorder) {
            return reject(new Error("No hay grabación activa."));
          }

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
            const url = URL.createObjectURL(blob);
            
            // Detener pistas de audio del micrófono
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }

            resolve({ blob, url, mimeType: mediaRecorder.mimeType });
          };

          mediaRecorder.stop();
        });
      },

      isRecording() {
        return mediaRecorder && mediaRecorder.state === "recording";
      }
    };
  }
}
