'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  LogIn,
  UserPlus,
  BookOpen,
  Calendar,
  Volume2,
  FileText,
  Award,
  ShieldCheck,
  Quote,
  CheckCircle2,
  ChevronRight,
  Landmark,
  Compass,
  ScrollText
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function LandingPage({ onOpenAuth }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C8102E] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#F8F5F0]/95 backdrop-blur-md border-b-2 border-[#1A1A1A] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C8102E] text-white flex items-center justify-center font-black text-lg border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              🇹🇷
            </div>
            <div>
              <span className="text-xs font-black tracking-widest uppercase block text-[#C8102E]">
                1919 — 1923
              </span>
              <h1 className="text-sm sm:text-base font-black uppercase tracking-tight m-0 leading-none">
                ATATÜRK İLE RÖPORTAJ
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('login')}
              className="brutal-btn-light px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#8B1824]" />
              <span>Giriş Yap</span>
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="brutal-btn-red px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Kayıt Ol</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-2 border-[#1A1A1A] bg-[#F4EFE6] py-12 md:py-20 px-4 sm:px-6">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none select-none text-[220px] font-serif font-black">
          1923
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E8E2D6] border-2 border-[#1A1A1A] text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-6 shadow-[2px_2px_0px_#1A1A1A]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>Millî Mücadele Tarihi İnteraktif Deneyimi</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight md:leading-none font-sans text-[#1A1A1A]"
          >
            GAZİ MUSTAFA KEMAL İLE <br />
            <span className="text-[#C8102E] underline decoration-[#1A1A1A] decoration-4">BİRİNCİ AĞIZDAN</span> MÜLAKAT
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mt-6 text-sm sm:text-base md:text-lg text-stone-700 font-serif-classic font-normal leading-relaxed"
          >
            1919 Samsun&apos;a çıkıştan Lozan Barış Antlaşması ve Cumhuriyet&apos;in kuruluşuna kadar uzanan bağımsızlık destanını bizzat Başkomutan Gazi Mustafa Kemal Paşa&apos;ya sorular sorarak öğrenin.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto brutal-btn-red px-6 py-3.5 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#1A1A1A] text-white"
            >
              <LogIn className="w-4 h-4" />
              <span>Giriş Yap ve Söyleşiye Başla</span>
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto brutal-btn-dark px-6 py-3.5 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#C8102E] text-white"
            >
              <UserPlus className="w-4 h-4 text-[#E4C87F]" />
              <span>Yeni Araştırmacı Hesabı Aç</span>
            </button>
          </motion.div>

          {/* Quote Callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-4 max-w-xl mx-auto bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex items-center gap-3 text-left"
          >
            <Quote className="w-8 h-8 text-[#C8102E] shrink-0" />
            <p className="text-xs sm:text-sm font-serif-italic text-stone-800">
              &quot;Tarihini bilmeyen bir millet, yok olmaya mahkûmdur.&quot;
              <span className="block text-[10px] font-black uppercase text-[#C8102E] font-sans mt-1">
                — Mustafa Kemal Atatürk
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Preview Teaser Card */}
      <section className="py-12 md:py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#C8102E] block">
            Canlı Arayüz Önizlemesi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
            Söyleşi Ekranı Nasıl Çalışır?
          </h2>
        </div>

        <div className="relative brutal-card p-6 md:p-8 bg-white overflow-hidden">
          {/* Mock Chat Conversation */}
          <div className="space-y-4 filter blur-[1px] opacity-80 select-none pointer-events-none">
            {/* Student Message */}
            <div className="flex justify-end">
              <div className="chat-bubble-student p-4 max-w-lg text-xs md:text-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-600 block mb-1">
                  Araştırmacı Öğrenci
                </span>
                Paşam, 1919&apos;da Samsun&apos;a çıktığınızda orduların dağıtılmış ve cephanelerin teslim edilmiş olduğu o karanlık tabloda bağımsızlık inancınızı diri tutan en temel güç neydi?
              </div>
            </div>

            {/* Atatürk Response */}
            <div className="flex justify-start">
              <div className="chat-bubble-ataturk p-4 max-w-xl text-xs md:text-sm">
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-stone-200">
                  <div className="w-5 h-5 bg-[#C8102E] text-white flex items-center justify-center text-[10px] font-black">
                    🇹🇷
                  </div>
                  <span className="text-xs font-black uppercase text-[#C8102E]">
                    Gazi Mustafa Kemal Paşa (1919 - Samsun & Kongreler)
                  </span>
                </div>
                Evladım, o günlerde düşman donanmaları İstanbul&apos;u sarmış, ordular terhis edilmişti. Fakat benim dayandığım yegâne kuvvet, Türk milletinin esaret kabul etmez yüksek karakteri ve bağımsız yaşama azmiydi...
              </div>
            </div>
          </div>

          {/* Overlay CTA Lock */}
          <div className="absolute inset-0 bg-[#F8F5F0]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mb-3 shadow-[3px_3px_0px_#C8102E]">
              <ScrollText className="w-6 h-6 text-[#E4C87F]" />
            </div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
              Sohbeti Başlatmak İçin Giriş Yapın
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mt-1 mb-5">
              Gazi Mustafa Kemal Atatürk ile mülakat yapmak, notlar almak ve ödev çıktısı oluşturmak için ücretsiz giriş yapın.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="brutal-btn-red px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#1A1A1A]"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="brutal-btn-light px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#8B1824]" />
                <span>Kayıt Ol</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-[#E8E2D6] border-t-2 border-b-2 border-[#1A1A1A] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C8102E] block">
              Öğrenci & Tarih Meraklıları İçin
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
              Öne Çıkan Özellikler
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="brutal-card p-6 bg-white">
              <div className="w-10 h-10 bg-[#C8102E] text-white flex items-center justify-center font-bold mb-4 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase text-[#1A1A1A] mb-2">
                Sesli Anlatım & Dikte
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Atatürk&apos;ün yanıtlarını Türkçe sesli olarak dinleyin; mikrofon butonuyla sesli olarak sorularınızı doğrudan dikte edin.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="brutal-card p-6 bg-white">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-bold mb-4 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#C8102E]">
                <Calendar className="w-5 h-5 text-[#E4C87F]" />
              </div>
              <h3 className="text-base font-black uppercase text-[#1A1A1A] mb-2">
                6 Kritik Tarihsel Dönem
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                1919 Samsun & Kongreler, 1920 TBMM, 1921 Sakarya, 1922 Büyük Taarruz ve 1923 Lozan dönemlerini filtreleyerek derinlemesine öğrenin.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="brutal-card p-6 bg-white">
              <div className="w-10 h-10 bg-[#C8102E] text-white flex items-center justify-center font-bold mb-4 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase text-[#1A1A1A] mb-2">
                Sokratik & Düşünme Soruları
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Gazi Paşa&apos;nın her cevabın ardında size yönelttiği tarihsel düşünme sorularına yanıt vererek rozetler ve puanlar kazanın.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="brutal-card p-6 bg-white">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-bold mb-4 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#C8102E]">
                <BookOpen className="w-5 h-5 text-[#E4C87F]" />
              </div>
              <h3 className="text-base font-black uppercase text-[#1A1A1A] mb-2">
                İnteraktif Not Defteri
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Önemli vecizeleri ve ders notlarını tek tıkla not defterinize iğneleyin, kendi araştırmacı notlarınızı düzenleyin.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="brutal-card p-6 bg-white">
              <div className="w-10 h-10 bg-[#C8102E] text-white flex items-center justify-center font-bold mb-4 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase text-[#1A1A1A] mb-2">
                Resmî Ödev Çıktısı (PDF / Yazdır)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tarih ödevi ve proje göreviniz için adınız, okulunuz ve söyleşi dökümünü içeren şık A4 ödev raporunu hazır formatta indirin.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="brutal-card p-6 bg-white">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-bold mb-4 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#C8102E]">
                <ShieldCheck className="w-5 h-5 text-[#E4C87F]" />
              </div>
              <h3 className="text-base font-black uppercase text-[#1A1A1A] mb-2">
                Tarihsel Sadakat & Belgesel
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nutuk ve tarihsel resmî arşiv belgelerine dayalı, dönemin dil ve üslubunu yansıtan özgün pedagojik diyaloglar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full text-center">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#C8102E] block">
          Kolay ve Hızlı
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A] mb-10">
          3 Adımda Söyleşiye Katılın
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
            <div className="text-3xl font-black text-[#C8102E] mb-2 font-mono">01.</div>
            <h4 className="text-sm font-black uppercase text-[#1A1A1A] mb-1">Hesap Açın</h4>
            <p className="text-xs text-stone-600">
              E-posta adresinizle saniyeler içinde ücretsiz araştırmacı hesabınızı oluşturun.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
            <div className="text-3xl font-black text-[#C8102E] mb-2 font-mono">02.</div>
            <h4 className="text-sm font-black uppercase text-[#1A1A1A] mb-1">Soru Sorun</h4>
            <p className="text-xs text-stone-600">
              Tarih dönemini seçip aklınızdaki soruları Gazi Mustafa Kemal Paşa&apos;ya yöneltin.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
            <div className="text-3xl font-black text-[#C8102E] mb-2 font-mono">03.</div>
            <h4 className="text-sm font-black uppercase text-[#1A1A1A] mb-1">Raporunuzu Alın</h4>
            <p className="text-xs text-stone-600">
              Cevapları notlarınıza ekleyin ve tarih dersiniz için resmî ödev çıktınızı hazırlayın.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12">
          <button
            onClick={() => onOpenAuth('register')}
            className="brutal-btn-red px-8 py-4 text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-[4px_4px_0px_#1A1A1A]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Şimdi Ücretsiz Başla</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t-2 border-[#1A1A1A] bg-[#E8E2D6] text-center text-xs text-[#1A1A1A] mt-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-serif-italic text-sm sm:text-base font-semibold">
            &quot;Gençler! Vatanın bütün ümidi ve geleceği size, genç nesillerin anlayış ve enerjisine bağlanmıştır.&quot;
          </p>
          <span className="block text-[10px] font-black uppercase tracking-widest text-[#C8102E]">
            — Gazi Mustafa Kemal Atatürk
          </span>
          <p className="text-[10px] text-stone-500 pt-2 font-mono">
            Atatürk ile Röportaj • Millî Mücadele Tarihi Eğitim Platformu
          </p>
        </div>
      </footer>
    </div>
  );
}
