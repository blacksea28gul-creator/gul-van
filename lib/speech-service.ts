// Turkish Text-to-Speech service using Web Speech API

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private activeMessageId: string | null = null;
  private listeners: ((speaking: boolean, activeId: string | null) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (speaking: boolean, activeId: string | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isSpeakingState, this.activeMessageId));
  }

  public speak(text: string, messageId: string) {
    if (!this.synth) return;

    this.stop();

    // Clean markdown symbols for cleaner speech
    const cleanText = text
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/🇹🇷/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95; // Slightly measured, dignified pace for Atatürk's speech
    utterance.pitch = 0.9;

    // Pick best Turkish voice if available
    const voices = this.synth.getVoices();
    const trVoice = voices.find(
      (v) => v.lang.toLowerCase().includes('tr') || v.name.toLowerCase().includes('turkish')
    );
    if (trVoice) {
      utterance.voice = trVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.activeMessageId = messageId;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.activeMessageId = null;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.activeMessageId = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.activeMessageId = null;
    this.notify();
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getActiveId(): string | null {
    return this.activeMessageId;
  }
}

export const speechService = new SpeechService();
