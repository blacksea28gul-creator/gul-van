'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, AlertCircle, CheckCircle2, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  // Reset form when mode switches
  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Lütfen e-posta adresinizi giriniz.');
      return;
    }

    if (!password) {
      setError('Lütfen şifrenizi giriniz.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Şifreler birbiriyle eşleşmiyor.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await login({ email: email.trim(), password });
        if (!result.success) {
          setError(result.error || 'Giriş yapılamadı.');
        } else {
          setSuccessMessage('Başarıyla giriş yapıldı!');
          setTimeout(() => {
            onClose();
          }, 800);
        }
      } else {
        const result = await register({
          name: name.trim() || undefined,
          email: email.trim(),
          password,
        });
        if (!result.success) {
          setError(result.error || 'Kayıt oluşturulamadı.');
        } else {
          setSuccessMessage('Hesabınız başarıyla oluşturuldu!');
          setTimeout(() => {
            onClose();
          }, 800);
        }
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#FCFAF6] border border-[#D5C7B2] shadow-2xl z-10"
        >
          {/* Header Graphic */}
          <div className="bg-gradient-to-r from-[#8B1824] via-[#A61C2C] to-[#C8102E] px-6 py-6 text-white text-center relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-black/15 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 mb-3 shadow-inner">
              <Sparkles className="w-6 h-6 text-[#E4C87F]" />
            </div>

            <h2 className="text-xl font-bold font-serif tracking-wide text-[#FDFBF7]">
              {mode === 'login' ? 'Gazi ile Röportaja Giriş' : 'Yeni Araştırmacı Kaydı'}
            </h2>
            <p className="text-xs text-[#E8DCC4] mt-1 font-sans">
              {mode === 'login'
                ? 'Tarih yolculuğuna kaldığınız yerden devam edin'
                : 'Mülakatlarınızı ve notlarınızı kaydetmek için hesap açın'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#E8DFD0] bg-[#F5EFE6]/60">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${
                mode === 'login'
                  ? 'border-[#C8102E] text-[#8B1824] bg-[#FCFAF6] font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-[#EFE7DC]/50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${
                mode === 'register'
                  ? 'border-[#C8102E] text-[#8B1824] bg-[#FCFAF6] font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-[#EFE7DC]/50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Kayıt Ol
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Feedback Alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Adınız ve Soyadınız (İsteğe Bağlı)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Hasan Tahsin"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D8CCBA] rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                E-posta Adresi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@ogrenci.edu.tr"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D8CCBA] rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#D8CCBA] rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 focus:outline-none"
                  aria-label="Şifreyi göster/gizle"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Şifre Tekrarı <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Şifrenizi tekrar yazın"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D8CCBA] rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-[#8B1824] hover:bg-[#A61C2C] active:bg-[#6D121B] text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>İşlem Yapılıyor...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Giriş Yap</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Hesap Oluştur</span>
                </>
              )}
            </button>

            {/* Switch Text */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-stone-600 hover:text-[#8B1824] underline transition-colors"
              >
                {mode === 'login'
                  ? 'Henüz bir hesabınız yok mu? Hemen Kayıt Olun'
                  : 'Zaten bir hesabınız var mı? Giriş Yapın'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
