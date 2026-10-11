import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Camera,
  Heart,
  QrCode,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  X,
  ScanLine,
  ChevronDown,
  KeyRound,
  Check,
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';
import { KavaEvent } from '../../types';
import { validateEventJoinCode } from '../../lib/eventValidation';

interface HeroSectionProps {
  onCreateEvent: () => void;
  onEnterCode: (code: string) => void;
  onOpenQrScanner?: () => void;
  isVerifying?: boolean;
  onTryDemo: () => void;
  events?: KavaEvent[];
}

export default function HeroSection({
  onCreateEvent,
  onEnterCode,
  onOpenQrScanner,
  isVerifying = false,
  onTryDemo,
  events = [],
}: HeroSectionProps) {
  const { t } = useTranslation();

  // Interactive phone preview state
  const [likeCount, setLikeCount] = useState<number>(56);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [showHeartPop, setShowHeartPop] = useState<boolean>(false);
  const [highlightNewPhoto, setHighlightNewPhoto] = useState<boolean>(true);
  const [recentPhotosCount, setRecentPhotosCount] = useState<number>(142);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Guest Code Input state in Hero
  const [guestCode, setGuestCode] = useState<string>('');
  const [guestCodeError, setGuestCodeError] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [showDirectCameraModal, setShowDirectCameraModal] = useState<boolean>(false);

  // Subtle photo addition micro-interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightNewPhoto((prev) => !prev);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleLike = () => {
    if (hasLiked) {
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 1000);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = guestCode.trim();
    if (!clean) {
      setGuestCodeError('Please enter an event code.');
      return;
    }

    const valRes = validateEventJoinCode(clean, events, []);
    if (valRes.status === 'invalid_code') {
      setGuestCodeError('Event code not found. Please check and try again.');
      return;
    }

    setGuestCodeError(null);
    onEnterCode(clean.toUpperCase());
  };

  const handleScanQrClick = () => {
    if (onOpenQrScanner) {
      onOpenQrScanner();
    } else {
      setShowDirectCameraModal(true);
    }
  };

  return (
    <section className="relative pt-6 sm:pt-10 md:pt-14 pb-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Soft Ambient Backdrop Accent (Light & Understated) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-b from-[#0E7A6B]/6 via-[#00A88F]/4 to-transparent blur-3xl pointer-events-none rounded-full -z-10" />

      {/* ========================================================================= */}
      {/* Two-Column Modern Editorial Hero Layout                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
        
        {/* LEFT COLUMN: Eyebrow, Headline, Description, Dual CTAs & Trust Proof */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-7 max-w-xl mx-auto lg:mx-0 w-full">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-xs font-bold tracking-wider uppercase shadow-2xs w-fit">
            <Camera className="w-3.5 h-3.5 text-[#0E7A6B]" />
            <span>PHOTO COLLECTION</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-black tracking-tight text-[#0B132B] leading-[1.06] font-sans">
            Collect every moment, <br />
            <span className="text-[#0E7A6B]">as it happens.</span>
          </h1>

          {/* Concise Supporting Description */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
            Guests scan your QR, capture or upload photos, and every memory appears in one beautiful event album — no app, no sign up.
          </p>

          {/* ===================================================================== */}
          {/* Dual Audience CTA Strategy (Host + Guest Entry)                        */}
          {/* ===================================================================== */}
          <div className="space-y-4 pt-1">
            
            {/* Host Primary Action & Quick QR Action */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onCreateEvent}
                className="bg-[#0B132B] hover:bg-[#152244] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-md shadow-[#0B132B]/10 flex items-center justify-center space-x-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
                id="btn-hero-create-photo-album"
              >
                <span>Create Photo Album</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={handleScanQrClick}
                className="bg-white hover:bg-slate-50 text-[#0B132B] border border-slate-200/90 font-bold text-sm sm:text-base px-5 py-3.5 rounded-full transition-all shadow-2xs flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
                id="btn-hero-scan-qr"
                title="Scan QR code using camera"
              >
                <QrCode className="w-4 h-4 text-[#0E7A6B]" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Guest Entry Box (High Visibility, Compact & Functional) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs max-w-md">
              <div className="flex items-center justify-between px-1 pb-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                  <KeyRound className="w-3 h-3 text-[#0E7A6B]" />
                  <span>Attending as a Guest?</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Instant Access</span>
              </div>

              <form onSubmit={handleGuestSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter event code (e.g. SOFIA-LEO)"
                    value={guestCode}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onChange={(e) => {
                      setGuestCode(e.target.value.toUpperCase().trimStart());
                      if (guestCodeError) setGuestCodeError(null);
                    }}
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold uppercase rounded-xl border transition-all ${
                      isInputFocused
                        ? 'border-[#0E7A6B] bg-white ring-2 ring-[#0E7A6B]/15'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
                    } focus:outline-none text-[#0B132B] placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400`}
                    id="input-hero-guest-code"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2.5 bg-[#0E7A6B] hover:bg-[#096357] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 shrink-0 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 min-h-[40px]"
                  id="btn-hero-join-event"
                >
                  <span>{isVerifying ? 'Joining...' : 'Join Event'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {guestCodeError && (
                <p className="text-xs font-semibold text-rose-600 mt-2 px-1 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{guestCodeError}</span>
                </p>
              )}
            </div>

          </div>

          {/* Subtle Trust Indicator */}
          <div className="flex items-center space-x-3 pt-1 text-slate-600">
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Host avatar"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Host avatar"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Host avatar"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Host avatar"
              />
              <div className="inline-flex h-8 w-8 rounded-full bg-[#0E7A6B] text-white text-[11px] font-bold items-center justify-center ring-2 ring-white">
                2k+
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              Trusted by 2,000+ hosts worldwide
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Hero Product Visual (Photo Album Smartphone Mockup + Realistic Floating Cards) */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center py-4 lg:py-6 w-full max-w-md sm:max-w-lg mx-auto">
          
          {/* Subtle Background Glow behind phone */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0E7A6B]/15 via-emerald-100/25 to-teal-50/20 rounded-full blur-3xl -z-10 scale-95 pointer-events-none" />

          {/* ========================================================================= */}
          {/* 1. MAIN PHOTO ALBUM SMARTPHONE DEVICE MOCKUP                              */}
          {/* ========================================================================= */}
          <div className="relative w-full max-w-[320px] sm:max-w-[350px] bg-[#0B132B] p-3 sm:p-3.5 rounded-[44px] sm:rounded-[48px] shadow-[0_30px_70px_-15px_rgba(11,19,43,0.3)] border-4 border-slate-800/90 z-20">
            
            {/* Screen Inner Frame */}
            <div className="bg-white rounded-[34px] sm:rounded-[38px] overflow-hidden border border-slate-200/80 text-[#1F2937] flex flex-col min-h-[530px] sm:min-h-[570px] select-none">
              
              {/* Dynamic Island / Speaker Notch & Status */}
              <div className="pt-2.5 px-6 pb-1.5 bg-white border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-800 font-mono">9:41</span>
                <div className="w-16 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-800 mr-1" />
                </div>
                <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>5G</span>
                </div>
              </div>

              {/* Album Event Header Bar */}
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=120&q=80"
                    alt="Event hosts Sofia & Leo"
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="text-xs font-extrabold text-[#0B132B] tracking-tight leading-tight">
                        Sofia & Leo's Wedding
                      </h3>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-slate-500">
                      <span>May 20, 2026</span>
                      <span>•</span>
                      <span className="inline-flex items-center text-emerald-600 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Album Stats Row (Photos, Guests, Interactive Likes) */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-100 py-2.5 text-center">
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-[#0B132B]">{recentPhotosCount}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Photos</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-[#0B132B]">24</p>
                  <p className="text-[10px] text-slate-500 font-medium">Guests</p>
                </div>
                <button
                  type="button"
                  onClick={handleLike}
                  className="cursor-pointer hover:bg-slate-100/80 transition-colors group relative"
                  title="Click to like"
                >
                  <p className="text-xs sm:text-sm font-extrabold text-[#0B132B] flex items-center justify-center space-x-1">
                    <Heart
                      className={`w-3 h-3 transition-colors ${
                        hasLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400 group-hover:text-rose-500'
                      }`}
                    />
                    <span>{likeCount}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Likes</p>

                  {/* Micro Heart Pop on Like */}
                  {showHeartPop && (
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -20, scale: 1.4 }}
                      transition={{ duration: 0.8 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none text-rose-500 text-xs"
                    >
                      ❤️
                    </motion.div>
                  )}
                </button>
              </div>

              {/* Photo Section Header */}
              <div className="px-3.5 pt-3 pb-1.5 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Recent Photos</span>
                <button
                  type="button"
                  onClick={onTryDemo}
                  className="text-[11px] font-bold text-[#0E7A6B] hover:text-[#096357] transition-colors cursor-pointer"
                >
                  View all
                </button>
              </div>

              {/* 3x2 High-Resolution Photo Collection Grid */}
              <div className="px-3 pb-3 flex-1 overflow-hidden">
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    {
                      id: 1,
                      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
                      alt: 'Couple dance',
                      isNew: highlightNewPhoto,
                    },
                    {
                      id: 2,
                      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=400&q=80',
                      alt: 'Floral bouquet',
                    },
                    {
                      id: 3,
                      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
                      alt: 'Bride and groom smiling',
                    },
                    {
                      id: 4,
                      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80',
                      alt: 'Banquet table flower decor',
                    },
                    {
                      id: 5,
                      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
                      alt: 'Bride and groom portrait',
                    },
                    {
                      id: 6,
                      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80',
                      alt: 'Guests dinner celebration and lights',
                    },
                  ].map((photo, pIdx) => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ scale: 1.04 }}
                      onClick={() => setActivePhotoIndex(pIdx)}
                      className={`relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 group cursor-pointer shadow-2xs ${
                        photo.isNew ? 'ring-2 ring-[#0E7A6B]' : ''
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      {photo.isNew && (
                        <div className="absolute top-1 left-1 bg-[#0E7A6B] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                          New
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom In-Phone Action Button: "Scan to Add Photo" */}
              <div className="p-3 bg-white border-t border-slate-100 text-center space-y-1">
                <button
                  type="button"
                  onClick={onTryDemo}
                  className="w-full py-2.5 bg-[#0E7A6B] hover:bg-[#096357] text-white rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <span>Scan to Add Photo</span>
                </button>
                <p className="text-[10px] text-slate-400 font-medium">
                  Guests can scan & add photos
                </p>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. SUBTLE FLOATING UI ELEMENTS (Realistic product notifications)           */}
          {/* ========================================================================= */}
          
          {/* FLOATING CARD 1: "Sarah added a photo" (Top-Left) */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            className="hidden sm:block absolute -top-4 -left-6 lg:-left-10 z-30 w-44 bg-white p-2.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 pointer-events-auto cursor-pointer"
            onClick={onTryDemo}
          >
            <div className="flex items-center space-x-2 mb-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Sarah avatar"
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-900 leading-none truncate">Sarah</p>
                <p className="text-[10px] text-slate-500 leading-tight">added a photo</p>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Just now</span>
            </div>
            
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
                alt="Sarah wedding photo contribution"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center space-x-0.5">
                <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                <span>8</span>
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARD 2: "24 guests contributing" (Top-Right) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.6 }}
            className="hidden sm:block absolute top-6 -right-6 lg:-right-10 z-30 bg-white p-3 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 pointer-events-auto cursor-pointer text-left"
          >
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0E7A6B] border border-emerald-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900 leading-none">24</p>
                <p className="text-[10px] text-slate-500 font-medium">guests contributing</p>
              </div>
            </div>

            <div className="flex -space-x-1.5 overflow-hidden pt-0.5">
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Guest"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Guest"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Guest"
              />
              <div className="inline-flex h-6 w-6 rounded-full bg-slate-900 text-white text-[9px] font-bold items-center justify-center ring-2 ring-white">
                +16
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARD 3: "+12 new photos in the last 5 min" (Bottom-Right) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 1.2 }}
            className="hidden sm:block absolute -bottom-4 -right-4 lg:-right-8 z-30 w-44 bg-white p-3 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 pointer-events-auto cursor-pointer text-left"
          >
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shrink-0 shadow-2xs">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none">+12</p>
                <p className="text-[10px] text-slate-500 leading-tight">new photos</p>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-medium mb-1">in the last 5 min</p>

            {/* Smooth purple wavy activity line */}
            <div className="w-full h-4 text-purple-400">
              <svg viewBox="0 0 120 20" className="w-full h-full stroke-purple-500 fill-none" strokeWidth="2.5" strokeLinecap="round">
                <path d="M 0 14 Q 20 2, 40 12 T 80 8 T 120 6" />
              </svg>
            </div>
          </motion.div>

          {/* FLOATING CARD 4: Small QR Visual Beside Phone (Mid/Bottom-Left) */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 0.8 }}
            className="hidden md:flex absolute bottom-12 -left-8 lg:-left-14 z-30 bg-white p-2.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 items-center space-x-2.5 -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 pointer-events-auto cursor-pointer"
            onClick={handleScanQrClick}
            title="Click to scan event QR"
          >
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xl shrink-0">
              {/* Realistic clean QR code SVG */}
              <svg className="w-9 h-9 text-[#0B132B]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm0-4h2v2h-2v-2zm4-4h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2z" />
              </svg>
            </div>
            <div className="text-left pr-1">
              <p className="text-[11px] font-extrabold text-[#0B132B] leading-tight">Scan to</p>
              <p className="text-[10px] text-[#0E7A6B] font-bold leading-tight">add your photo</p>
              {/* Curved playful pointer indicator */}
              <div className="text-[#0E7A6B] text-[10px] font-mono leading-none mt-0.5">⤷</div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* "HOW KAVA WORKS" STRIP (Simple, Beautiful, Meaningful)                     */}
      {/* ========================================================================= */}
      <div className="mt-16 sm:mt-24 pt-4" id="how-kava-works">
        <div className="bg-white border border-slate-200/90 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-12 shadow-xs">
          
          {/* Strip Header */}
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#0E7A6B] uppercase tracking-widest bg-[#E6FFFA] border border-[#99F6E4] px-3 py-1 rounded-full inline-block shadow-2xs">
              SIMPLE, BEAUTIFUL, MEANINGFUL
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B132B] tracking-tight font-sans">
              How KAVA works
            </h2>
          </div>

          {/* 3 Steps Process with connecting arrows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-center relative">
            
            {/* Step 1: Create your album */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] flex items-center justify-center shadow-2xs shrink-0">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#0E7A6B] font-mono bg-[#E6FFFA] px-2 py-0.5 rounded-md">01</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0B132B]">
                    Create your album
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Set up your event in minutes and generate your QR code.
                </p>
              </div>
            </div>

            {/* Step 2: Guests scan & contribute */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start gap-4 text-left relative">
              {/* Chevron connector for desktop */}
              <div className="hidden md:flex absolute -left-5 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 items-center justify-center text-slate-400">
                <ChevronRight className="w-4 h-4" />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-600 flex items-center justify-center shadow-2xs shrink-0">
                <Camera className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-sky-600 font-mono bg-sky-50 px-2 py-0.5 rounded-md">02</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0B132B]">
                    Guests scan & contribute
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Guests scan the QR, take or upload photos — instantly.
                </p>
              </div>
            </div>

            {/* Step 3: Relive every photo */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start gap-4 text-left relative">
              {/* Chevron connector for desktop */}
              <div className="hidden md:flex absolute -left-5 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 items-center justify-center text-slate-400">
                <ChevronRight className="w-4 h-4" />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-500 flex items-center justify-center shadow-2xs shrink-0">
                <Heart className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-rose-500 font-mono bg-rose-50 px-2 py-0.5 rounded-md">03</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0B132B]">
                    Relive every photo
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Every photo is saved in one beautiful album to relive forever.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* Direct Camera / QR Scan Fallback Modal                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showDirectCameraModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E6FFFA] text-[#0E7A6B] flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B132B]">Scan Event QR</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDirectCameraModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-center p-4">
                <ScanLine className="w-12 h-12 text-[#0E7A6B] animate-pulse mb-3" />
                <p className="text-xs text-slate-300 font-medium">Point your camera at the event QR code table card</p>
                <div className="absolute inset-4 border-2 border-dashed border-[#0E7A6B]/50 rounded-xl pointer-events-none" />
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Or enter the event code manually in the hero box above.
              </p>

              <button
                type="button"
                onClick={() => setShowDirectCameraModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Scanner
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}

