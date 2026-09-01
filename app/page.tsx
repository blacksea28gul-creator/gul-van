'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Calendar,
  FileText,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Mic,
  MicOff,
  Sparkles,
  HelpCircle,
  Award,
  ChevronDown,
  Quote,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTION_CATEGORIES } from '@/lib/kurtulus-savasi-data';
import TimelineModal from '@/components/TimelineModal';
import NotesDrawer, { PinnedNote } from '@/components/NotesDrawer';
import HomeworkExportModal, { ChatMessage } from '@/components/HomeworkExportModal';
import AuthModal from '@/components/AuthModal';
import { speechService } from '@/lib/speech-service';
import { useAuth } from '@/lib/auth-context';

const HISTORICAL_PERIODS = [
  { id: 'Tüm Dönem (1919-1923)', label: 'Tüm Millî Mücadele (1919-1923)', desc: 'Samsun\'dan Lozan\'a genel bakış' },
  { id: 'Samsun ve Kongreler (1919)', label: 'Samsun & Kongreler (1919)', desc: 'Amasya, Erzurum, Sivas' },
  { id: 'TBMM ve Teşkilatlanma (1920)', label: 'TBMM\'nin Açılışı (1920)', desc: 'Millet meclisi ve Sevr\'in reddi' },
  { id: 'İnönü ve Sakarya Muharebeleri (1921)', label: 'İnönü & Sakarya (1921)', desc: 'Tekâlif-i Milliye ve savunma' },
  { id: 'Büyük Taarruz ve Zafer (1922)', label: 'Büyük Taarruz & Zafer (1922)', desc: 'Kocatepe, Dumlupınar, İzmir' },
  { id: 'Lozan ve Barış (1923)', label: 'Lozan ve Barış (1923)', desc: 'Tam bağımsızlık ve Cumhuriyet' },
];

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting-msg',
  role: 'assistant',
  timestamp: '1919 - Millî Mücadele Başlangıcı',
  period: 'Tüm Millî Mücadele (1919-1923)',
  content: `Hoş geldin evladım, genç arkadaşım! 

Ben Gazi Mustafa Kemal. 1919 yılının 19 Mayıs'ında Samsun'a ayak bastığımız o meşakkatli günden Mudanya'ya, Lozan'a ve Cumhuriyet'in temellerini attığımız günlere kadar aziz milletimizle birlikte verdiğimiz bağımsızlık mücadelesi hakkında merak ettiğin her suali bana sorabilirsin. 

Unutma ki **"Tarihini bilmeyen bir millet, yok olmaya mahkûmdur."** 

Seninle burada bir tarih dersi mülakatı yapmaktan büyük bahtiyarlık duyarım. Sorularınla hem o günleri konuşacağız hem de geleceğe dair fikirlerimizi paylaşacağız.

### 🇹🇷 Sana Bir Sorum Var Genç Arkadaşım:
19 Mayıs 1919'da Samsun'a ayak bastığımızda orduları dağıtılmış, silahları elinden alınmış ve yurdu dört bir yandan işgal edilmiş bir vaziyetteydik. Sence hiçbir maddi gücümüz ve cephanemiz yokken bizi ayağa kaldıran, zafere olan inancımızı diri tutan asıl manevi kuvvet neydi?`,
};

let messageCounter = 0;
function createUniqueId(prefix: string) {
  messageCounter += 1;
  return `${prefix}-${Date.now()}-${messageCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AtaturkInterviewPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tüm Dönem (1919-1923)');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Auth State
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Modals & Drawers
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isHomeworkOpen, setIsHomeworkOpen] = useState(false);
  const [notes, setNotes] = useState<PinnedNote[]>([]);
  const [answeredCount, setAnsweredCount] = useState<number>(0);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('ataturk_interview_notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (err) {
      console.error('Failed to load notes', err);
    }

    try {
      const savedCount = localStorage.getItem('ataturk_answered_count');
      if (savedCount) {
        setAnsweredCount(parseInt(savedCount, 10));
      }
    } catch (err) {
      console.error('Failed to load answered count', err);
    }
  }, []);

  // Audio & Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking, activeId) => {
      setIsSpeaking(speaking);
      setActiveSpeechId(activeId);
    });

    return () => {
      speechService.stop();
      unsubscribe();
    };
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ataturk_interview_notes', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('ataturk_answered_count', answeredCount.toString());
    } catch {
      // ignore
    }
  }, [answeredCount]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition (Dictation for Turkish)
  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

    interface ISpeechRecognitionInstance {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    }
    interface IWindowWithSpeech extends Window {
      SpeechRecognition?: new () => ISpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => ISpeechRecognitionInstance;
    }
    const win = window as unknown as IWindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tarayıcınız sesle yazmayı (Speech Recognition) desteklemiyor. Lütfen klavye ile yazınız.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current && typeof (recognitionRef.current as { stop: () => void }).stop === 'function') {
        (recognitionRef.current as { stop: () => void }).stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: { results: { 0: { 0: { transcript: string } } } }) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // Send message to Gemini API
  const handleSendMessage = async (customQuery?: string) => {
    const queryToSend = (customQuery || inputQuery).trim();
    if (!queryToSend || isLoading) return;

    const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: createUniqueId('user'),
      role: 'user',
      content: queryToSend,
      timestamp: timeStr,
    };

    // Filter out previous trailing error message if retrying
    const cleanedMessages = messages.filter((m) => !m.isError);
    const newMessagesList = [...cleanedMessages, userMessage];
    setMessages(newMessagesList);
    setInputQuery('');
    setIsLoading(true);

    // If student answers Atatürk's question, trigger a small celebratory encouragement
    if (
      queryToSend.toLowerCase().includes('bence') ||
      queryToSend.toLowerCase().includes('millet') ||
      queryToSend.toLowerCase().includes('çünkü') ||
      queryToSend.toLowerCase().includes('inan') ||
      queryToSend.length > 25
    ) {
      setAnsweredCount((prev) => prev + 1);
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#e11d48', '#b45309', '#f59e0b', '#dc2626'],
        });
      } catch {
        // ignore
      }
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessagesList.map((m) => ({ role: m.role, content: m.content })),
          periodContext: selectedPeriod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Cevap alınamadı.');
      }

      const reply = data.text || 'Tarihî hakikatler üzerine düşünürken bir duraksama oldu evladım, lütfen tekrar sor.';

      const botMessage: ChatMessage = {
        id: createUniqueId('assistant'),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        period: selectedPeriod,
      };

      setMessages((prev) => [...prev.filter((m) => !m.isError), botMessage]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: createUniqueId('assistant-err'),
        role: 'assistant',
        content: 'Milli Mücadele hatıralarını naklederken bağlantıda geçici bir yoğunluk meydana geldi evladım. Lütfen soruyu tekrar yöneltmeyi dene.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        errorQuery: queryToSend,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Röportajı sıfırlamak ve baştan başlamak istediğinize emin misiniz?')) {
      speechService.stop();
      setMessages([INITIAL_GREETING]);
    }
  };

  const handleToggleSpeak = (msg: ChatMessage) => {
    if (isSpeaking && activeSpeechId === msg.id) {
      speechService.stop();
    } else {
      speechService.speak(msg.content, msg.id);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handlePinToNotes = (msg: ChatMessage) => {
    const isAlreadyPinned = notes.some((n) => n.content === msg.content);
    if (isAlreadyPinned) {
      alert('Bu cevap zaten not defterinizde kayıtlı.');
      return;
    }

    const dateStr = new Date().toLocaleDateString('tr-TR');
    const newNote: PinnedNote = {
      id: createUniqueId('note'),
      content: msg.content,
      timestamp: `${dateStr} ${msg.timestamp}`,
      type: msg.role === 'assistant' ? 'ataturk_quote' : 'student_note',
      topic: msg.period || selectedPeriod,
    };

    setNotes((prev) => [newNote, ...prev]);
    setIsNotesOpen(true);
  };

  // Extract Atatürk's trailing question from response for distinct callout card
  const splitContentAndQuestion = (fullText: string) => {
    const questionHeaderRegex = /### 🇹🇷 Sana Bir Sorum Var Genç Arkadaşım:([\s\S]*)$/i;
    const match = fullText.match(questionHeaderRegex);

    if (match && match.index !== undefined) {
      const mainBody = fullText.substring(0, match.index).trim();
      const questionText = match[1].trim();
      return { mainBody, questionText };
    }

    // Fallback if no markdown header was preserved
    return { mainBody: fullText, questionText: null };
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C8102E] selection:text-white">
      {/* Top Banner / Navigation */}
      <header className="sticky top-0 z-30 bg-[#F8F5F0]/95 backdrop-blur-md border-b-2 border-[#1A1A1A] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2">
          {/* Eyebrow sub-header */}
          <div className="flex justify-between items-baseline text-[10px] sm:text-xs font-black tracking-widest uppercase opacity-70 mb-1">
            <span>Tarih Dersleri: Kurtuluş Savaşı Serisi</span>
            <span>Bölüm 01 / 1919-1923</span>
          </div>

          {/* Historical Line & Main Bold Title */}
          <div className="historical-line py-2 my-1 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none font-sans m-0">
                ATATÜRK <span className="text-[#C8102E]">İLE</span> RÖPORTAJ
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-[#6B6359] mt-1 font-serif-italic">
                Gazi Mustafa Kemal Paşa ile Birinci Şahıs Ağzından Tarihsel Söyleşi
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 self-start md:self-auto">
              {/* Answered badge */}
              <div
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#E8E2D6] border-2 border-[#1A1A1A] text-xs font-black text-[#1A1A1A] uppercase tracking-wider"
                title="Cevapladığınız tarihsel düşünme soruları"
              >
                <Award className="w-3.5 h-3.5 text-[#C8102E]" />
                <span>{answeredCount} Cevap</span>
              </div>

              {/* Timeline button */}
              <button
                id="open-timeline-btn"
                onClick={() => setIsTimelineOpen(true)}
                className="brutal-btn-light px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C8102E]" />
                <span className="hidden sm:inline">Takvim</span>
              </button>

              {/* Notes button with badge */}
              <button
                id="open-notes-btn"
                onClick={() => setIsNotesOpen(true)}
                className="brutal-btn-light relative px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span className="hidden sm:inline">Notlar</span>
                {notes.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#C8102E] text-white text-[10px] font-black">
                    {notes.length}
                  </span>
                )}
              </button>

              {/* Homework export */}
              <button
                id="open-homework-btn"
                onClick={() => setIsHomeworkOpen(true)}
                className="brutal-btn-red px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ödev Çıktısı</span>
              </button>

              {/* User Auth Profile / Login */}
              {isAuthLoading ? (
                <div className="px-3 py-1.5 bg-[#E8E2D6] border-2 border-[#1A1A1A] text-xs font-medium animate-pulse">
                  ...
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="brutal-btn-light px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-[#FFFDF9]"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#8B1824] text-white flex items-center justify-center text-[9px] font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.name || user.email.split('@')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-stone-600" />
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] z-50 p-2 text-left"
                      >
                        <div className="p-2 border-b border-stone-200">
                          <p className="text-xs font-bold text-stone-900 truncate">{user.name || 'Araştırmacı'}</p>
                          <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={async () => {
                            setIsUserMenuOpen(false);
                            await logout();
                          }}
                          className="w-full mt-1.5 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Çıkış Yap</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="brutal-btn-light px-2.5 sm:px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#8B1824]" />
                    <span>Giriş</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="hidden sm:flex brutal-btn-red px-2.5 sm:px-3 py-1.5 text-xs font-black uppercase tracking-wider items-center gap-1 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Kayıt Ol</span>
                  </button>
                </div>
              )}

              {/* Reset chat */}
              <button
                id="reset-chat-btn"
                onClick={handleResetChat}
                className="brutal-btn-light p-1.5 text-[#1A1A1A] hover:text-[#C8102E] cursor-pointer"
                title="Sohbeti Baştan Başlat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Historical Period Sub-header Filter */}
        <div className="bg-[#E8E2D6] border-t-2 border-[#1A1A1A] px-4 sm:px-6 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto custom-scrollbar text-xs gap-3">
            <div className="flex items-center gap-1.5 shrink-0 text-[#1A1A1A] font-black uppercase tracking-wider text-[10px] sm:text-xs">
              <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
              <span>Dönem Filtresi:</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {HISTORICAL_PERIODS.map((period) => (
                <button
                  key={period.id}
                  id={`period-btn-${period.id.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide transition-all shrink-0 cursor-pointer border-2 border-[#1A1A1A] ${
                    selectedPeriod === period.id
                      ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#C8102E]'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#F8F5F0]'
                  }`}
                  title={period.desc}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Conversation Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Messages List */}
        <div className="space-y-6 flex-1">
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              const { mainBody, questionText } = isAssistant
                ? splitContentAndQuestion(message.content)
                : { mainBody: message.content, questionText: null };

              const isPinned = notes.some((n) => n.content === message.content);
              const isCurrentSpeaking = isSpeaking && activeSpeechId === message.id;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 sm:gap-4 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center font-black text-sm shrink-0 border-2 border-[#1A1A1A] ${
                      isAssistant
                        ? 'bg-[#1A1A1A] text-white shadow-[3px_3px_0px_#C8102E]'
                        : 'bg-[#C8102E] text-white shadow-[3px_3px_0px_#1A1A1A]'
                    }`}
                  >
                    {isAssistant ? 'GA' : 'Ö'}
                  </div>

                  {/* Bubble Container */}
                  <div className={`max-w-[92%] sm:max-w-[85%] space-y-2 ${isAssistant ? 'text-left' : 'text-right'}`}>
                    {/* Header line */}
                    <div className={`flex items-center gap-2 text-xs text-[#6B6359] ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                      <span className="font-black uppercase tracking-wider text-[#1A1A1A]">
                        {isAssistant ? 'Gazi Mustafa Kemal Paşa' : 'Öğrenci (Genç Tarihçi)'}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] font-mono">{message.timestamp}</span>
                      {message.period && isAssistant && (
                        <span className="hidden sm:inline-block px-2 py-0.5 bg-[#E8E2D6] border border-[#1A1A1A] text-[#1A1A1A] text-[9px] font-black uppercase tracking-wider">
                          {message.period}
                        </span>
                      )}
                    </div>

                    {/* Message Bubble Body */}
                    <div
                      className={`p-5 sm:p-6 ${
                        message.isError
                          ? 'bg-[#FFF5F5] border-2 border-[#C8102E] shadow-[4px_4px_0px_#C8102E] text-[#1A1A1A]'
                          : isAssistant
                          ? 'chat-bubble-ataturk text-[#1A1A1A]'
                          : 'chat-bubble-student text-[#1A1A1A]'
                      }`}
                    >
                      {message.isError ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[#C8102E] font-black text-xs uppercase tracking-wider">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Bağlantı Bildirimi</span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed font-serif-italic text-[#1A1A1A]">
                            {message.content}
                          </p>
                          {message.errorQuery && (
                            <div className="pt-2 flex items-center justify-start">
                              <button
                                id={`retry-msg-${message.id}-btn`}
                                onClick={() => handleSendMessage(message.errorQuery)}
                                disabled={isLoading}
                                className="brutal-btn-red px-3.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                                <span>Soruyu Tekrar Yönelt</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : isAssistant ? (
                        <div className="space-y-4">
                          {/* Main narrative text in serif-italic typography */}
                          <div className="prose prose-sm sm:prose-base max-w-none text-[#1A1A1A] font-serif-italic leading-relaxed prose-headings:font-sans prose-headings:font-black prose-strong:text-[#C8102E] prose-strong:font-bold prose-p:my-2">
                            <ReactMarkdown>{mainBody}</ReactMarkdown>
                          </div>

                          {/* Highlighted Question from Atatürk */}
                          {questionText && (
                            <div className="mt-4 p-4 sm:p-5 bg-[#F8F5F0] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                                <span className="flex items-center gap-1.5 text-xs font-black text-[#C8102E] uppercase tracking-wider font-sans">
                                  <span>🇹🇷</span> Gazi Paşa&apos;nın Öğrenciye Sorusu
                                </span>
                                <span className="text-[10px] px-2 py-0.5 bg-[#1A1A1A] text-white font-black uppercase tracking-widest">
                                  Tarihsel Muhakeme
                                </span>
                              </div>

                              <p className="text-base sm:text-lg font-bold text-[#1A1A1A] font-serif-classic leading-snug pl-3 border-l-4 border-[#C8102E]">
                                &quot;{questionText}&quot;
                              </p>

                              <div className="flex items-center justify-end pt-1">
                                <button
                                  id={`answer-question-${message.id}-btn`}
                                  onClick={() => {
                                    setInputQuery('Paşam, bu sorunuza dair fikrim şudur: ');
                                    inputRef.current?.focus();
                                  }}
                                  className="brutal-btn-red px-3.5 py-1.5 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Bu Soruya Yanıt Ver</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap font-medium italic text-base leading-relaxed">
                          &quot;{message.content}&quot;
                        </p>
                      )}
                    </div>

                    {/* Action buttons on message */}
                    {isAssistant && !message.isError && (
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        {/* Audio Speak */}
                        <button
                          id={`speak-msg-${message.id}-btn`}
                          onClick={() => handleToggleSpeak(message)}
                          className={`px-2.5 py-1 border-2 border-[#1A1A1A] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            isCurrentSpeaking
                              ? 'bg-[#C8102E] text-white shadow-[2px_2px_0px_#1A1A1A]'
                              : 'bg-white text-[#1A1A1A] hover:bg-[#E8E2D6] shadow-[2px_2px_0px_#1A1A1A]'
                          }`}
                          title="Sesli Dinle"
                        >
                          {isCurrentSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{isCurrentSpeaking ? 'Durdur' : 'Sesli Dinle'}</span>
                        </button>

                        {/* Pin Note */}
                        <button
                          id={`pin-msg-${message.id}-btn`}
                          onClick={() => handlePinToNotes(message)}
                          className={`px-2.5 py-1 border-2 border-[#1A1A1A] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            isPinned
                              ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#C8102E]'
                              : 'bg-white text-[#1A1A1A] hover:bg-[#E8E2D6] shadow-[2px_2px_0px_#1A1A1A]'
                          }`}
                          title="Ders Notlarına Ekle"
                        >
                          {isPinned ? <BookmarkCheck className="w-3.5 h-3.5 text-[#C8102E]" /> : <Bookmark className="w-3.5 h-3.5" />}
                          <span>{isPinned ? 'Kaydedildi' : 'Not Al'}</span>
                        </button>

                        {/* Copy */}
                        <button
                          id={`copy-msg-${message.id}-btn`}
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className="px-2.5 py-1 bg-white border-2 border-[#1A1A1A] hover:bg-[#E8E2D6] shadow-[2px_2px_0px_#1A1A1A] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Metni Kopyala"
                        >
                          {copiedMessageId === message.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#C8102E]" />
                              <span className="text-[#C8102E]">Kopyalandı</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Kopyala</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading state indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-start"
            >
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-sm shrink-0 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#C8102E]">
                GA
              </div>
              <div className="p-4 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex items-center gap-3 text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#C8102E] animate-bounce" />
                  <span className="w-2.5 h-2.5 bg-[#1A1A1A] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2.5 h-2.5 bg-[#C8102E] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="font-serif-italic normal-case text-sm">Gazi Mustafa Kemal Paşa tarihi vesikaları ve hatıralarını naklediyor...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Historical Questions Explorer */}
        <div className="brutal-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#1A1A1A] uppercase tracking-widest">
              <Quote className="w-4 h-4 text-[#C8102E]" />
              <span>Tarih Dersi Röportaj Soru Rehberi:</span>
            </div>
            <span className="text-[11px] text-[#6B6359] hidden sm:inline font-serif-italic">
              Bir soruya tıklayarak Gazi Paşa&apos;ya doğrudan yöneltebilirsiniz
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {QUESTION_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border-2 border-[#1A1A1A] cursor-pointer ${
                  activeCategoryIndex === idx
                    ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#C8102E]'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#E8E2D6]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {QUESTION_CATEGORIES[activeCategoryIndex].questions.map((question, qIdx) => (
              <button
                key={qIdx}
                id={`suggested-q-${activeCategoryIndex}-${qIdx}`}
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
                className="text-left p-3 bg-[#F8F5F0] hover:bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:shadow-[3px_3px_0px_#C8102E] text-xs font-medium text-[#1A1A1A] leading-snug transition-all group flex items-start justify-between gap-2 cursor-pointer"
              >
                <span className="group-hover:text-[#C8102E] font-serif-italic text-xs">&quot;{question}&quot;</span>
                <Send className="w-3.5 h-3.5 text-[#1A1A1A] group-hover:text-[#C8102E] shrink-0 mt-0.5 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-4 z-20 bg-white border-2 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] p-3 sm:p-4 space-y-2 focus-within:shadow-[6px_6px_0px_#C8102E] transition-all">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            {/* Voice Dictation Button */}
            <button
              type="button"
              id="mic-dictation-btn"
              onClick={toggleRecording}
              className={`p-3 border-2 border-[#1A1A1A] transition-all shrink-0 cursor-pointer ${
                isRecording
                  ? 'bg-[#C8102E] text-white shadow-[2px_2px_0px_#1A1A1A] animate-pulse'
                  : 'bg-[#F8F5F0] text-[#1A1A1A] hover:bg-[#E8E2D6] shadow-[2px_2px_0px_#1A1A1A]'
              }`}
              title={isRecording ? 'Dinleme durduruluyor...' : 'Mikrofon ile Türkçe Sor'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Query Text Area */}
            <div className="flex-1">
              <textarea
                ref={inputRef}
                id="interview-input-textarea"
                rows={2}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Gazi Paşa'ya bir soru yöneltin veya sorusuna cevap verin... (Enter ile gönder)"
                className="w-full text-xs sm:text-sm bg-transparent border-0 resize-none p-1 text-[#1A1A1A] placeholder:text-[#6B6359] placeholder:italic focus:outline-none custom-scrollbar font-medium"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              id="send-interview-btn"
              disabled={!inputQuery.trim() || isLoading}
              className="brutal-btn-dark px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>GÖNDER</span>
              <Send className="w-4 h-4 text-[#C8102E]" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-[#6B6359] px-1 pt-2 border-t-2 border-[#1A1A1A]">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
              <span className="text-[#C8102E]">■</span>
              <span>Aktif Dönem: {selectedPeriod}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="ask-nutuk-quote-btn"
                onClick={() => handleSendMessage('Paşam, Nutuk\'ta bu döneme dair en çok vurguladığınız tarihî öğüt nedir?')}
                className="font-bold text-[#1A1A1A] hover:text-[#C8102E] uppercase tracking-wider text-[10px] underline decoration-2 cursor-pointer transition-colors"
              >
                Nutuk&apos;tan Bir İlke Sor
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 border-t-2 border-[#1A1A1A] bg-[#E8E2D6] text-center text-xs text-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-serif-italic text-sm sm:text-base font-semibold">
            &quot;Gençler! Vatanın bütün ümidi ve geleceği size, genç nesillerin anlayış ve enerjisine bağlanmıştır.&quot;
          </p>
          <span className="block text-[10px] font-black uppercase tracking-widest mt-1 text-[#C8102E]">
            — Gazi Mustafa Kemal Atatürk
          </span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        onSelectEventQuestion={(q) => handleSendMessage(q)}
      />

      <NotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={notes}
        onAddNote={(content) => {
          const dateStr = new Date().toLocaleDateString('tr-TR');
          const newNote: PinnedNote = {
            id: createUniqueId('note'),
            content,
            timestamp: dateStr,
            type: 'student_note',
            topic: selectedPeriod,
          };
          setNotes((prev) => [newNote, ...prev]);
        }}
        onDeleteNote={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
        onClearAll={() => setNotes([])}
      />

      <HomeworkExportModal
        isOpen={isHomeworkOpen}
        onClose={() => setIsHomeworkOpen(false)}
        messages={messages}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}
