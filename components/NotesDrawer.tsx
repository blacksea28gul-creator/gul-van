'use client';

import React, { useState } from 'react';
import { X, Bookmark, Trash2, Copy, Check, Download, Plus, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PinnedNote {
  id: string;
  topic?: string;
  content: string;
  timestamp: string;
  type: 'ataturk_quote' | 'student_note' | 'question_answer';
}

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: PinnedNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
  onClearAll: () => void;
}

export default function NotesDrawer({
  isOpen,
  onClose,
  notes,
  onAddNote,
  onDeleteNote,
  onClearAll,
}: NotesDrawerProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText.trim());
    setNewNoteText('');
  };

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadNotes = () => {
    if (notes.length === 0) return;
    const header = `TÜRKİYE CUMHURİYETİ TARİH DERSİ - ATATÜRK İLE RÖPORTAJ DERS NOTLARI\nOluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n=======================================================\n\n`;
    const body = notes
      .map(
        (n, idx) =>
          `[${idx + 1}] (${n.type === 'ataturk_quote' ? 'Gazi Paşa Sözü' : 'Öğrenci Notu'} - ${n.timestamp})\n${n.content}\n`
      )
      .join('\n-------------------------------------------------------\n\n');

    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ataturk_Roportaj_Ders_Notlari_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="w-full max-w-md h-full bg-[#F8F5F0] border-l-2 border-[#1A1A1A] shadow-2xl flex flex-col text-[#1A1A1A]"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b-2 border-[#1A1A1A] bg-[#E8E2D6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#C8102E]">
                <BookOpen className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h2 className="font-black uppercase tracking-tight text-[#1A1A1A] text-base">
                  Öğrenci Not Defteri
                </h2>
                <p className="text-xs text-[#6B6359] font-serif-italic">Röportajdan çıkarılan ders ve özetler</p>
              </div>
            </div>
            <button
              id="close-notes-drawer-btn"
              onClick={onClose}
              className="brutal-btn-light p-1.5 cursor-pointer text-[#1A1A1A] hover:text-[#C8102E]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Note Form */}
          <div className="p-4 bg-white border-b-2 border-[#1A1A1A]">
            <form onSubmit={handleCreateNote} className="space-y-2">
              <label htmlFor="new-note-input" className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
                Kendi Tarih Notunu Ekle:
              </label>
              <div className="flex gap-2">
                <input
                  id="new-note-input"
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Örn: Tekâlif-i Milliye milletin fedakarlık belgesidir..."
                  className="flex-1 px-3 py-2 text-xs bg-[#F8F5F0] border-2 border-[#1A1A1A] text-[#1A1A1A] placeholder:text-[#6B6359] placeholder:italic focus:outline-none focus:bg-white"
                />
                <button
                  type="submit"
                  id="add-note-btn"
                  disabled={!newNoteText.trim()}
                  className="brutal-btn-dark px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ekle
                </button>
              </div>
            </form>
          </div>

          {/* Notes List */}
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {notes.length === 0 ? (
              <div className="py-16 text-center text-[#6B6359] space-y-2">
                <Bookmark className="w-10 h-10 mx-auto text-[#1A1A1A]/30" />
                <p className="text-sm font-black uppercase tracking-wider text-[#1A1A1A]">Henüz kaydedilmiş not yok</p>
                <p className="text-xs text-[#6B6359] max-w-xs mx-auto font-serif-italic">
                  Sohbet sırasında Atatürk&apos;ün cevaplarının yanındaki &quot;Not Al&quot; butonuna basarak kaydedebilirsiniz.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-2 relative group hover:shadow-[4px_4px_0px_#C8102E] transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-0.5 border border-[#1A1A1A] font-black text-[10px] uppercase tracking-wider ${
                        note.type === 'ataturk_quote'
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-[#E8E2D6] text-[#1A1A1A]'
                      }`}
                    >
                      {note.type === 'ataturk_quote' ? '🇹🇷 Gazi Paşa Sözü' : '✏️ Öğrenci Notu'}
                    </span>
                    <span className="text-[10px] font-mono text-[#6B6359]">{note.timestamp}</span>
                  </div>

                  <p className="text-xs text-[#1A1A1A] leading-relaxed font-serif-italic whitespace-pre-wrap">
                    &quot;{note.content}&quot;
                  </p>

                  <div className="pt-2 border-t-2 border-[#1A1A1A] flex items-center justify-end gap-1.5">
                    <button
                      id={`copy-note-${note.id}-btn`}
                      onClick={() => handleCopyNote(note.id, note.content)}
                      className="px-2 py-1 bg-white border border-[#1A1A1A] hover:bg-[#E8E2D6] text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                      title="Kopyala"
                    >
                      {copiedId === note.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#C8102E]" />
                          <span className="text-[10px] text-[#C8102E]">Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Kopyala</span>
                        </>
                      )}
                    </button>
                    <button
                      id={`delete-note-${note.id}-btn`}
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#C8102E] hover:text-white cursor-pointer transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Actions */}
          {notes.length > 0 && (
            <div className="p-4 border-t-2 border-[#1A1A1A] bg-[#E8E2D6] flex items-center justify-between gap-2">
              <button
                id="clear-all-notes-btn"
                onClick={onClearAll}
                className="brutal-btn-light px-3 py-2 text-xs font-black uppercase tracking-wider text-[#C8102E] flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Temizle
              </button>

              <button
                id="download-notes-txt-btn"
                onClick={handleDownloadNotes}
                className="brutal-btn-dark px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Notları İndir (.txt)
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
