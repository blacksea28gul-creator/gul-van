'use client';

import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  period?: string;
  isError?: boolean;
  errorQuery?: string;
}

interface HomeworkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

export default function HomeworkExportModal({
  isOpen,
  onClose,
  messages,
}: HomeworkExportModalProps) {
  const [studentName, setStudentName] = useState('Ahmet Yılmaz');
  const [studentClass, setStudentClass] = useState('11-A / 452');
  const [schoolName, setSchoolName] = useState('Atatürk Anadolu Lisesi');
  const [teacherName, setTeacherName] = useState('Tarih Zümre Öğretmeni');
  const [studentConclusion, setStudentConclusion] = useState(
    'Bu röportaj sayesinde Kurtuluş Savaşı\'nın sadece askeri bir mücadele değil; Türk milletinin kadını, erkeği, genci ve yaşlısıyla topyekûn bir varoluş ve bağımsızlık destanı olduğunu Gazi Paşa\'nın kendi sözleriyle doğrudan idrak ettim.'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const validInterviewMessages = messages.filter((m) => m.content.trim().length > 0);

  const handlePrint = () => {
    window.print();
  };

  const generateFullText = () => {
    let output = `========================================================================\n`;
    output += `T.C. MİLLÎ EĞİTİM BAKANLIĞI TARİH DERSİ PROJE ÖDEVİ\n`;
    output += `"GAZİ MUSTAFA KEMAL ATATÜRK İLE KURTULUŞ SAVAŞI RÖPORTAJI"\n`;
    output += `========================================================================\n\n`;
    output += `Okul: ${schoolName}\n`;
    output += `Öğrenci: ${studentName}\n`;
    output += `Sınıf / No: ${studentClass}\n`;
    output += `Ders Öğretmeni: ${teacherName}\n`;
    output += `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\n`;
    output += `------------------------------------------------------------------------\n`;
    output += `RÖPORTAJ METNİ\n`;
    output += `------------------------------------------------------------------------\n\n`;

    validInterviewMessages.forEach((msg, idx) => {
      if (msg.role === 'user') {
        output += `[Soru ${idx + 1}] ${studentName} (Öğrenci):\n"${msg.content}"\n\n`;
      } else {
        output += `[Cevap] Gazi Mustafa Kemal Atatürk:\n${msg.content}\n\n------------------------------------------------------------------------\n\n`;
      }
    });

    output += `\n========================================================================\n`;
    output += `ÖĞRENCİNİN KİŞİSEL TARİHSEL DEĞERLENDİRMESİ VE ÇIKARDIĞI DERSLER:\n`;
    output += `${studentConclusion}\n`;
    output += `========================================================================\n`;

    return output;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateFullText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const text = generateFullText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ataturk_Roportaji_Tarih_Odevi_${studentName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#F8F5F0] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] overflow-hidden text-[#1A1A1A]"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#E8E2D6] border-b-2 border-[#1A1A1A] flex items-center justify-between no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#C8102E]">
                <FileText className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight font-sans text-[#1A1A1A]">
                  Tarih Dersi Ödev & Röportaj Raporu
                </h2>
                <p className="text-xs text-[#6B6359] font-serif-italic">
                  Röportajı resmi ödev formatında yazdırın veya dijital olarak indirin.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="print-assignment-btn"
                onClick={handlePrint}
                className="brutal-btn-red px-3.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Yazdır / PDF
              </button>
              <button
                id="close-assignment-modal-btn"
                onClick={onClose}
                className="brutal-btn-light p-1.5 cursor-pointer text-[#1A1A1A] hover:text-[#C8102E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form & Preview Split */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#F8F5F0]">
            {/* Student Info Inputs (Only visible on screen, styled cleanly) */}
            <div className="p-4 bg-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-3 no-print">
              <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
                Ödev Kapak ve Öğrenci Bilgileri:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label htmlFor="student-name-input" className="block text-[#1A1A1A] font-black uppercase text-[10px] mb-1">Öğrenci Adı Soyadı:</label>
                  <input
                    id="student-name-input"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#F8F5F0] border-2 border-[#1A1A1A] font-bold focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="student-class-input" className="block text-[#1A1A1A] font-black uppercase text-[10px] mb-1">Sınıfı / Numarası:</label>
                  <input
                    id="student-class-input"
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#F8F5F0] border-2 border-[#1A1A1A] font-bold focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="school-name-input" className="block text-[#1A1A1A] font-black uppercase text-[10px] mb-1">Okul Adı:</label>
                  <input
                    id="school-name-input"
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#F8F5F0] border-2 border-[#1A1A1A] font-bold focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="teacher-name-input" className="block text-[#1A1A1A] font-black uppercase text-[10px] mb-1">Ders Öğretmeni:</label>
                  <input
                    id="teacher-name-input"
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#F8F5F0] border-2 border-[#1A1A1A] font-bold focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label htmlFor="student-conclusion-input" className="block text-[#1A1A1A] font-black uppercase text-[10px] mb-1">
                  Öğrencinin Çıkardığı Sonuç / Proje Özeti:
                </label>
                <textarea
                  id="student-conclusion-input"
                  rows={2}
                  value={studentConclusion}
                  onChange={(e) => setStudentConclusion(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#F8F5F0] border-2 border-[#1A1A1A] focus:outline-none focus:bg-white placeholder:italic font-serif-italic"
                  placeholder="Röportajdan edindiğiniz tarihî kazanımları buraya yazabilirsiniz..."
                />
              </div>
            </div>

            {/* Document Sheet (Printable A4 Preview) */}
            <div
              id="printable-assignment-document"
              className="p-8 sm:p-12 bg-white border-2 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] max-w-3xl mx-auto space-y-6 text-[#1A1A1A]"
            >
              {/* Report Header */}
              <div className="text-center border-b-2 border-[#1A1A1A] pb-6 space-y-2">
                <div className="inline-block px-3 py-1 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-sans font-black mb-1">
                  Tarih Dersi Proje Ödevi
                </div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
                  Gazi Mustafa Kemal Atatürk ile Röportaj
                </h1>
                <p className="text-sm italic font-serif-italic text-[#6B6359]">
                  Millî Mücadele ve Kurtuluş Savaşı Dönemi Tarihî Söyleşisi
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 text-xs font-sans text-left bg-[#F8F5F0] p-3 border-2 border-[#1A1A1A]">
                  <div>
                    <span className="font-bold text-[#6B6359] text-[10px] uppercase">Öğrenci:</span>
                    <p className="font-black text-[#1A1A1A]">{studentName}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#6B6359] text-[10px] uppercase">Sınıf/No:</span>
                    <p className="font-black text-[#1A1A1A]">{studentClass}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#6B6359] text-[10px] uppercase">Okul:</span>
                    <p className="font-black text-[#1A1A1A]">{schoolName}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#6B6359] text-[10px] uppercase">Öğretmen:</span>
                    <p className="font-black text-[#1A1A1A]">{teacherName}</p>
                  </div>
                </div>
              </div>

              {/* Interview Content */}
              <div className="space-y-6 text-sm leading-relaxed">
                {validInterviewMessages.map((msg, index) => (
                  <div key={msg.id || index} className="space-y-2">
                    {msg.role === 'user' ? (
                      <div className="p-3.5 bg-[#E8E2D6] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                        <p className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A] mb-1">
                          Soru ({studentName}):
                        </p>
                        <p className="font-semibold text-[#1A1A1A] italic">
                          &quot;{msg.content}&quot;
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#C8102E] space-y-2">
                        <p className="text-xs font-black uppercase tracking-wider text-[#C8102E] mb-1 flex items-center gap-1.5">
                          <span>🇹🇷</span> Gazi Mustafa Kemal Atatürk:
                        </p>
                        <div className="text-[#1A1A1A] font-serif whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Conclusion Section */}
              {studentConclusion && (
                <div className="pt-6 border-t-2 border-[#1A1A1A] space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
                    Öğrencinin Tarihsel Kazanım & Değerlendirmesi:
                  </h3>
                  <p className="text-xs font-serif-italic text-[#1A1A1A] leading-relaxed bg-[#F8F5F0] p-4 border-2 border-[#1A1A1A]">
                    {studentConclusion}
                  </p>
                </div>
              )}

              {/* Document Footer */}
              <div className="pt-6 border-t-2 border-[#1A1A1A] flex items-center justify-between text-[11px] font-mono text-[#6B6359]">
                <span>Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}</span>
                <span className="font-serif-italic font-bold text-[#1A1A1A]">&quot;Tarih yazmak, tarih yapmak kadar mühimdir.&quot;</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="px-6 py-4 bg-[#E8E2D6] border-t-2 border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <button
                id="copy-assignment-txt-btn"
                onClick={handleCopyText}
                className="brutal-btn-light px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#C8102E]" />
                    <span className="text-[#C8102E]">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Metni Kopyala</span>
                  </>
                )}
              </button>

              <button
                id="download-assignment-txt-btn"
                onClick={handleDownload}
                className="brutal-btn-light px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Dosya İndir (.txt)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="close-assignment-bottom-btn"
                onClick={onClose}
                className="brutal-btn-light px-4 py-2 text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Kapat
              </button>
              <button
                id="print-assignment-bottom-btn"
                onClick={handlePrint}
                className="brutal-btn-red px-5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Yazdır / PDF Kaydet
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
