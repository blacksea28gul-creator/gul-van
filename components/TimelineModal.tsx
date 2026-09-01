'use client';

import React, { useState } from 'react';
import { TIMELINE_EVENTS, TimelineEvent } from '@/lib/kurtulus-savasi-data';
import { X, Calendar, MessageSquarePlus, Quote, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEventQuestion: (question: string, eventTitle: string) => void;
}

export default function TimelineModal({ isOpen, onClose, onSelectEventQuestion }: TimelineModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  if (!isOpen) return null;

  const filteredEvents = TIMELINE_EVENTS.filter((ev) => {
    const matchCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchYear = selectedYear === 'all' || ev.year === selectedYear;
    return matchCategory && matchYear;
  });

  const categories = [
    { id: 'all', label: 'Tüm Olaylar' },
    { id: 'kongre', label: 'Kongreler & Başlangıç' },
    { id: 'meclis', label: 'Meclis & Teşkilat' },
    { id: 'savas', label: 'Muharebeler & Zaferler' },
    { id: 'seferberlik', label: 'Topyekûn Seferberlik' },
    { id: 'diplomasi', label: 'Diplomasi & Barış' },
  ];

  const years = [
    { id: 'all', label: 'Tüm Yıllar' },
    { id: 1919, label: '1919' },
    { id: 1920, label: '1920' },
    { id: 1921, label: '1921' },
    { id: 1922, label: '1922' },
    { id: 1923, label: '1923' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#F8F5F0] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] overflow-hidden text-[#1A1A1A]"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b-2 border-[#1A1A1A] bg-[#E8E2D6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#C8102E]">
                <Compass className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight font-sans text-[#1A1A1A]">
                  Kurtuluş Savaşı Kronolojisi (1919 - 1923)
                </h2>
                <p className="text-xs font-medium text-[#6B6359] font-serif-italic">
                  Tarihî olayları inceleyin, doğrudan Gazi Paşa&apos;ya röportaj sorusu yöneltin.
                </p>
              </div>
            </div>
            <button
              id="close-timeline-modal-btn"
              onClick={onClose}
              className="brutal-btn-light p-1.5 cursor-pointer text-[#1A1A1A] hover:text-[#C8102E]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters Bar */}
          <div className="px-6 py-3 bg-[#F8F5F0] border-b-2 border-[#1A1A1A] flex flex-wrap gap-2 items-center justify-between text-xs">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[#1A1A1A] font-black uppercase tracking-wider text-[11px] mr-1">Kategori:</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 font-bold text-[11px] uppercase tracking-wide transition-all border-2 border-[#1A1A1A] cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#C8102E]'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#E8E2D6]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 items-center mt-2 sm:mt-0">
              <span className="text-[#1A1A1A] font-black uppercase tracking-wider text-[11px] mr-1">Yıl:</span>
              {years.map((yr) => (
                <button
                  key={String(yr.id)}
                  id={`year-filter-${yr.id}`}
                  onClick={() => setSelectedYear(yr.id as number | 'all')}
                  className={`px-2.5 py-1 font-bold text-[11px] transition-all border-2 border-[#1A1A1A] cursor-pointer ${
                    selectedYear === yr.id
                      ? 'bg-[#C8102E] text-white shadow-[2px_2px_0px_#1A1A1A]'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#E8E2D6]'
                  }`}
                >
                  {yr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Event List */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="py-12 text-center text-[#6B6359] font-serif-italic">
                Bu filtrelere uygun tarihsel olay bulunamadı.
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-[#1A1A1A] space-y-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="relative group">
                    {/* Timeline node marker */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 bg-[#C8102E] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] group-hover:scale-125 transition-transform" />

                    <div className="p-4 sm:p-5 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[5px_5px_0px_#C8102E] transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 border border-[#1A1A1A] text-xs font-black bg-[#E8E2D6] text-[#1A1A1A] flex items-center gap-1 uppercase tracking-wide">
                            <Calendar className="w-3.5 h-3.5 text-[#C8102E]" />
                            {event.date}
                          </span>
                          <span className="text-xs uppercase tracking-wider text-[#6B6359] font-bold">
                            {event.keyFigure}
                          </span>
                        </div>
                        <span className="text-xs px-2.5 py-0.5 bg-[#1A1A1A] text-white font-mono font-bold">
                          {event.year}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-[#1A1A1A] uppercase tracking-tight mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-[#1A1A1A] leading-relaxed mb-3">
                        {event.description}
                      </p>

                      {event.quote && (
                        <div className="mb-3 p-3 bg-[#F8F5F0] border-l-4 border-[#C8102E] border-y border-r border-[#1A1A1A] flex items-start gap-2 text-xs italic font-serif-italic text-[#1A1A1A]">
                          <Quote className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                          <span>&quot;{event.quote}&quot;</span>
                        </div>
                      )}

                      <div className="pt-3 border-t-2 border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs text-[#6B6359] font-serif-italic line-clamp-1">
                          Önerilen Soru: &quot;{event.suggestedQuestion}&quot;
                        </span>
                        <button
                          id={`ask-timeline-${event.id}-btn`}
                          onClick={() => {
                            onSelectEventQuestion(event.suggestedQuestion, event.title);
                            onClose();
                          }}
                          className="brutal-btn-red shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider cursor-pointer"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          <span>Atatürk&apos;e Sor</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 border-t-2 border-[#1A1A1A] bg-[#E8E2D6] flex items-center justify-between text-xs text-[#1A1A1A]">
            <span className="font-bold">Toplam {filteredEvents.length} tarihsel dönüm noktası listelendi.</span>
            <button
              id="timeline-footer-close-btn"
              onClick={onClose}
              className="brutal-btn-dark px-4 py-1.5 text-xs font-black uppercase tracking-widest cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
