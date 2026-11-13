import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CHAT_WIDGET_REPOSITORY_PORT, ChatWidgetRepositoryPort } from '../../ports/chat-widget.repository.port';
import { ChatMessage, QuickButtonDTO, LocationPayload, OrderDTO } from '../../models/chat.models';
import { TranscriptionService, AudioRecorderController } from '../../services/transcription.service';
import { SpeechService, SpeechController } from '../../services/speech.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  tenantId: string = 'tenant-hn-muebles';
  sessionId: string = 'session-web-' + Math.random().toString(36).substring(2, 9);
  messages: ChatMessage[] = [];
  inputMessage: string = '';
  isTyping: boolean = false;
  trackingCodeInput: string = '';
  showTrackingModal: boolean = false;
  trackedOrder: OrderDTO | null = null;
  trackingError: string | null = null;

  // Estados de Audio y Grabación
  isRecordingAudio: boolean = false;
  private activeRecorder: AudioRecorderController | null = null;
  private activeSpeechController: SpeechController | null = null;
  private activePlayingMsgId: string | null = null;

  quickSuggestions: string[] = [
    'Quiero comprar la silla Wynn',
    '¿Qué colores tienen de la silla Wynn?',
    '¿Cuánto cuesta la silla Wynn?',
    '¿Hacen envíos a San Pedro Sula?'
  ];

  constructor(
    @Inject(CHAT_WIDGET_REPOSITORY_PORT) private readonly chatRepo: ChatWidgetRepositoryPort,
    private readonly transcriptionService: TranscriptionService,
    private readonly speechService: SpeechService
  ) {}

  ngOnInit(): void {
    // Saludo inicial de bienvenida con soporte de audio
    this.addBotMessage(
      'Hola, bienvenido a SMAK Muebles HN.\n\n' +
      'Soy tu asistente de compras. Puedes consultarme por:\n' +
      '- Catálogo: Sillas ergonómicas, escritorios y muebles de oficina.\n' +
      '- Logística: Envíos a todo Honduras con Cargo Expreso.\n' +
      '- Forma de pago: Efectivo contra entrega al recibir tu paquete.\n\n' +
      '¿En qué producto estás interesado hoy?'
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.speechService.stop();
    if (this.activeRecorder && this.activeRecorder.isRecording()) {
      this.activeRecorder.stop().catch(() => {});
    }
  }

  sendMessage(textToSend?: string, isAudioReplyPrompt: boolean = false): void {
    const text = (textToSend || this.inputMessage).trim();
    if (!text || this.isTyping) return;

    // Agregar mensaje del usuario
    this.messages.push({
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date()
    });

    this.inputMessage = '';
    this.isTyping = true;

    this.chatRepo.sendMessage(this.tenantId, this.sessionId, text).subscribe({
      next: (reply) => {
        this.isTyping = false;
        const botMsg: ChatMessage = {
          id: 'msg-bot-' + Date.now(),
          sender: 'bot',
          text: reply.text,
          timestamp: new Date(),
          step: reply.step,
          imageUrl: reply.imageUrl,
          images: reply.images,
          product: reply.product,
          order: reply.order,
          buttons: reply.buttons,
          // Habilitar nota de voz interactiva estilo WhatsApp
          audioVoiceNote: true,
          audioWaveform: this.speechService.generateWaveform(26),
          audioDuration: this.speechService.estimateDuration(reply.text),
          playbackElapsed: 0,
          playbackPercent: 0,
          playbackSpeed: 1.0,
          isPlaying: false
        };
        this.messages.push(botMsg);
      },
      error: (err) => {
        this.isTyping = false;
        this.messages.push({
          id: 'msg-err-' + Date.now(),
          sender: 'system',
          text: '⚠️ No pudimos conectar con el servidor. Reintentando...',
          timestamp: new Date()
        });
        console.error('Error enviando mensaje:', err);
      }
    });
  }

  // --- MÉTODOS DE AUDIO Y TRANSCRIPCIÓN (STT / TTS) ---

  async toggleRecordAudio(): Promise<void> {
    if (this.isRecordingAudio && this.activeRecorder) {
      // Detener grabación y transcribir
      this.isRecordingAudio = false;
      try {
        const { blob } = await this.activeRecorder.stop();
        this.activeRecorder = null;
        await this.processRecordedAudio(blob, 'grabacion-microfono.webm');
      } catch (err: any) {
        console.error('Error al detener grabación:', err);
      }
      return;
    }

    // Iniciar grabación con micrófono
    try {
      this.activeRecorder = this.transcriptionService.createRecorder();
      await this.activeRecorder.start();
      this.isRecordingAudio = true;
    } catch (err: any) {
      console.warn('No se pudo acceder al micrófono:', err);
      alert('No se pudo acceder al micrófono: ' + (err.message || 'Permiso denegado.'));
      this.isRecordingAudio = false;
    }
  }

  cancelRecordingAudio(): void {
    if (this.activeRecorder && this.activeRecorder.isRecording()) {
      this.activeRecorder.stop().catch(() => {});
      this.activeRecorder = null;
    }
    this.isRecordingAudio = false;
  }

  /**
   * Ejecuta un escenario de prueba con los audios pregrabados del Oráculo
   */
  async testSampleAudio(sampleName: 'perchero' | 'regadera'): Promise<void> {
    const fileName = sampleName === 'perchero' ? 'audio_1_perchero.ogg' : 'audio_2_regadera.ogg';
    const fakeBlob = new Blob([], { type: 'audio/ogg' });
    await this.processRecordedAudio(fakeBlob, fileName);
  }

  private async processRecordedAudio(blob: Blob, fileName: string): Promise<void> {
    const msgId = 'msg-audio-' + Date.now();
    const userAudioMsg: ChatMessage = {
      id: msgId,
      sender: 'user',
      text: '🎙️ Nota de voz enviada',
      timestamp: new Date(),
      isTranscribing: true
    };
    this.messages.push(userAudioMsg);
    this.scrollToBottom();

    try {
      const result = await this.transcriptionService.transcribeAudio(blob, fileName);
      userAudioMsg.isTranscribing = false;
      userAudioMsg.transcriptionText = result.fullText;

      if (result.fullText) {
        this.sendMessage(result.fullText, true);
      } else {
        this.addBotMessage('Disculpa, no logré escuchar palabras claras en este audio. ¿Podrías escribir tu consulta o repetirlo?');
      }
    } catch (err: any) {
      userAudioMsg.isTranscribing = false;
      userAudioMsg.text = '⚠️ Error en transcripción: ' + (err.message || 'Servidor Whisper no disponible.');
    }
  }

  togglePlayVoiceNote(msg: ChatMessage): void {
    if (msg.isPlaying) {
      this.speechService.stop();
      msg.isPlaying = false;
      this.activePlayingMsgId = null;
      return;
    }

    // Detener cualquier audio previo
    this.speechService.stop();
    this.messages.forEach(m => m.isPlaying = false);

    msg.isPlaying = true;
    this.activePlayingMsgId = msg.id;
    const speed = msg.playbackSpeed || 1.0;

    this.activeSpeechController = this.speechService.speak(msg.text, {
      rate: speed,
      onStart: () => {
        msg.isPlaying = true;
      },
      onProgress: ({ elapsed, percent }) => {
        msg.playbackElapsed = elapsed;
        msg.playbackPercent = percent;
      },
      onEnd: () => {
        msg.isPlaying = false;
        msg.playbackElapsed = msg.audioDuration || 0;
        msg.playbackPercent = 100;
        this.activePlayingMsgId = null;
      },
      onError: () => {
        msg.isPlaying = false;
        this.activePlayingMsgId = null;
      }
    });
  }

  changeVoiceSpeed(msg: ChatMessage, event: MouseEvent): void {
    event.stopPropagation();
    let nextSpeed = 1.0;
    if (msg.playbackSpeed === 1.0) nextSpeed = 1.5;
    else if (msg.playbackSpeed === 1.5) nextSpeed = 2.0;
    else nextSpeed = 1.0;

    msg.playbackSpeed = nextSpeed;

    if (msg.isPlaying && this.activeSpeechController) {
      this.speechService.stop();
      this.togglePlayVoiceNote(msg);
    }
  }

  sendQuickButton(btn: QuickButtonDTO): void {
    this.sendMessage(btn.title);
  }

  onTenantChange(newTenantId: string): void {
    this.tenantId = newTenantId;
    this.resetChat();
  }

  resetChat(): void {
    this.speechService.stop();
    this.isRecordingAudio = false;
    this.messages = [];
    this.sessionId = 'session-web-' + Math.random().toString(36).substring(2, 9);
    this.chatRepo.resetSession(this.tenantId, this.sessionId).subscribe({
      next: () => {
        const welcome = this.tenantId === 'tenant-hn-muebles' || this.tenantId === 'smak'
          ? 'Hola, bienvenido a SMAK Muebles HN.\n\n¿En qué producto estás interesado hoy?'
          : 'Hola, bienvenido a Calzado y Moda HN.\n\nTenemos tenis deportivos, botas y calzado casual con envío nacional vía Cargo Expreso.\n\n¿Qué talla o estilo buscas?';
        this.addBotMessage(welcome);
      },
      error: () => {
        this.addBotMessage('¡Hola! Sesión reiniciada con éxito.');
      }
    });
  }

  shareLocation(): void {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: LocationPayload = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: 'Ubicación GPS compartida por el cliente'
        };

        this.messages.push({
          id: 'msg-' + Date.now(),
          sender: 'user',
          text: `📍 *Ubicación GPS:* Lat ${loc.lat.toFixed(4)}, Lng ${loc.lng.toFixed(4)}`,
          timestamp: new Date(),
          location: loc
        });

        this.chatRepo.sendMessage(this.tenantId, this.sessionId, 'Ubicación GPS compartida', loc).subscribe({
          next: (reply: any) => {
            this.addBotMessage(reply.text);
          }
        });
      },
      (err) => {
        console.warn('Error obteniendo ubicación:', err);
        this.messages.push({
          id: 'msg-' + Date.now(),
          sender: 'user',
          text: 'Col. Palmira, frente a Plaza San Martín, Tegucigalpa',
          timestamp: new Date()
        });
        this.sendMessage('Col. Palmira, frente a Plaza San Martín, Tegucigalpa');
      }
    );
  }

  openTrackingModal(): void {
    this.showTrackingModal = true;
    this.trackingError = null;
    this.trackedOrder = null;
  }

  closeTrackingModal(): void {
    this.showTrackingModal = false;
  }

  searchTracking(): void {
    if (!this.trackingCodeInput.trim()) return;

    this.trackingError = null;
    this.trackedOrder = null;

    this.chatRepo.trackOrder(this.tenantId, this.trackingCodeInput.trim()).subscribe({
      next: (order) => {
        this.trackedOrder = order;
      },
      error: () => {
        this.trackingError = 'No se encontró ninguna orden o guía con ese código.';
      }
    });
  }

  formatMarkdown(text: string): string {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  }

  private addBotMessage(text: string): void {
    this.messages.push({
      id: 'msg-bot-' + Date.now(),
      sender: 'bot',
      text,
      timestamp: new Date(),
      audioVoiceNote: true,
      audioWaveform: this.speechService.generateWaveform(26),
      audioDuration: this.speechService.estimateDuration(text),
      playbackElapsed: 0,
      playbackPercent: 0,
      playbackSpeed: 1.0,
      isPlaying: false
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch {}
  }
}
