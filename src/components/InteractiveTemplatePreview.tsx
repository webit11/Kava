import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Tablet as TabletIcon, 
  Smartphone, 
  Sun, 
  Moon, 
  Sparkles, 
  Upload, 
  Mic, 
  Volume2, 
  Play, 
  Pause, 
  Tv, 
  Heart, 
  Send, 
  CheckCircle2, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  Camera,
  Music,
  QrCode,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventSettings } from '../types';
import { getFontClass, getBackgroundStyle } from '../theme';

interface InteractiveTemplatePreviewProps {
  config: Partial<EventSettings>;
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
}

export default function InteractiveTemplatePreview({
  config,
  eventName = "Sofia & Leo's Wedding",
  eventDate = "June 20, 2026",
  eventLocation = "Château de Villa, Sierre"
}: InteractiveTemplatePreviewProps) {
  // Shell Display State
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'phone'>('phone');
  const [ambientTheme, setAmbientTheme] = useState<'light' | 'dark'>('dark');
  const [view, setView] = useState<'invitation' | 'guest_room' | 'live_screen' | 'photo_upload' | 'voice_guestbook' | 'wishes' | 'success_screen'>('invitation');

  // Interactive Live States
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [filter, setFilter] = useState<string>(config.photoFilter || 'none');
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [newWishAuthor, setNewWishAuthor] = useState('');
  const [newWishText, setNewWishText] = useState('');
  const [wishesList, setWishesList] = useState<Array<{ id: string; author: string; text: string; date: string }>>([
    { id: 'w-1', author: 'Aunt Clara', text: 'Wishing you both a lifetime of love, laughter, and endless adventure together! Perfect night!', date: 'Just now' },
    { id: 'w-2', author: 'Julian & Sam', text: 'This digital capsule is amazing! Congratulations on this beautiful union. Cheers!', date: '5 mins ago' },
    { id: 'w-3', author: 'Nico (Cousin)', text: 'Best party ever! Let the dance floor heat up. Ready to upload a thousand photos!', date: '15 mins ago' }
  ]);

  // Slideshow simulation for Live Screen
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const slideshowImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800'
  ];

  // Auto update filter state if config changes
  useEffect(() => {
    if (config.photoFilter) {
      setFilter(config.photoFilter);
    }
  }, [config.photoFilter]);

  // Slideshow transition simulation
  useEffect(() => {
    if (view !== 'live_screen') return;
    const intervalTime = (config.slideshowInterval || 5) * 1000;
    const timer = setInterval(() => {
      setSlideshowIndex(prev => (prev + 1) % slideshowImages.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [view, config.slideshowInterval]);

  // Voice recording simulation timer
  useEffect(() => {
    let timer: any;
    if (voiceRecording) {
      timer = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(timer);
  }, [voiceRecording]);

  // Dynamic CSS helper for Font styling
  const fontClass = getFontClass(config.presentationFontFamily as any || 'sans');
  const wishFontClass = getFontClass(config.wishFont as any || 'sans');

  // Get current background styles from config
  const bgStyles = getBackgroundStyle(
    config.presentationBackgroundType || 'gradient',
    config.presentationBgColor || '#FAF5F5',
    config.presentationBgGradient || 'linear-gradient(135deg, #FFF5F5, #FFF0F5, #FDF5E6)',
    config.presentationBgImageUrl,
    config.presentationBgOpacity,
    config.presentationBgBlur,
    config.presentationTheme
  );

  // Filter effect styling mapping
  const getFilterStyle = (f: string) => {
    switch (f) {
      case 'warm':
        return 'sepia(0.3) saturate(1.2) contrast(1.1)';
      case 'retro':
        return 'sepia(0.65) contrast(0.95) brightness(1.05) saturate(0.85)';
      case 'cyberpunk':
        return 'hue-rotate(180deg) saturate(2) contrast(1.2) brightness(1.1)';
      case 'bw':
        return 'grayscale(1) contrast(1.2)';
      case 'none':
        return 'none';
      default:
        return 'none';
    }
  };

  // Wish Bubble Style Mapping
  const getWishBubbleClasses = () => {
    const style = config.wishBubbleStyle || 'clean';
    switch (style) {
      case 'elegant':
        return 'bg-white/95 border border-amber-200 shadow-lg p-5 rounded-tr-[32px] rounded-bl-[32px] rounded-tl-lg rounded-br-lg font-serif';
      case 'vintage':
        return 'bg-[#FCF9F2] border-2 border-[#D6C5A0] shadow-md p-5 rounded-2xl font-serif text-[#3D2C1E]';
      case 'cyber':
        return 'bg-black/80 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)] p-5 rounded-none font-mono text-emerald-400';
      case 'minimal':
        return 'bg-neutral-50 border border-neutral-200 p-5 rounded-lg font-sans';
      case 'clean':
      default:
        return 'bg-white/90 border border-slate-100 shadow-sm p-5 rounded-3xl font-sans';
    }
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishText.trim() || !newWishAuthor.trim()) return;
    setWishesList([
      {
        id: 'w-' + Date.now(),
        author: newWishAuthor.trim(),
        text: newWishText.trim(),
        date: 'Just now'
      },
      ...wishesList
    ]);
    setNewWishText('');
    setNewWishAuthor('');
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl`}>
      {/* 1. Preview Controller Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950 border-b border-slate-800 gap-4">
        {/* Device Mode Switchers */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              device === 'desktop' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              device === 'tablet' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TabletIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('phone')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              device === 'phone' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Phone</span>
          </button>
        </div>

        {/* Ambient Dark/Light Switcher */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Ambient</span>
          <div className="flex bg-slate-900 p-1 rounded-full border border-slate-800">
            <button
              type="button"
              onClick={() => setAmbientTheme('light')}
              className={`p-1.5 rounded-full transition-all ${ambientTheme === 'light' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-300'}`}
              title="Light Mode Preview"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAmbientTheme('dark')}
              className={`p-1.5 rounded-full transition-all ${ambientTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              title="Dark Mode Preview"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Component View Switcher Tab bar */}
      <div className="flex items-center overflow-x-auto px-4 py-2 bg-slate-950/80 border-b border-slate-800 scrollbar-none gap-1.5">
        {[
          { id: 'invitation', label: 'Invitation Card', icon: FileText },
          { id: 'guest_room', label: 'Guest Room', icon: Heart },
          { id: 'live_screen', label: 'Live Screen', icon: Tv },
          { id: 'photo_upload', label: 'Photo Upload', icon: Camera },
          { id: 'voice_guestbook', label: 'Voice Guestbook', icon: Mic },
          { id: 'wishes', label: 'Wishes', icon: Sparkles },
          { id: 'success_screen', label: 'Success Screen', icon: CheckCircle2 }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-tight shrink-0 transition-all flex items-center space-x-1.5 ${
                isActive 
                  ? 'bg-slate-900 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Render Canvas Box */}
      <div className={`flex-1 overflow-auto p-6 flex items-center justify-center transition-colors duration-300 ${
        ambientTheme === 'light' ? 'bg-slate-50' : 'bg-slate-900'
      }`}>
        {/* Responsive Frame Container */}
        <div 
          className={`relative transition-all duration-300 bg-white shadow-2xl border flex flex-col justify-between overflow-hidden ${
            device === 'phone' 
              ? 'w-[320px] h-[580px] rounded-[36px] border-slate-300' 
              : device === 'tablet' 
              ? 'w-[520px] h-[640px] rounded-[28px] border-slate-300' 
              : 'w-full max-w-[840px] h-[520px] rounded-2xl border-slate-200'
          }`}
          style={bgStyles}
        >
          {/* Inner Content Area */}
          <div className="flex-1 overflow-y-auto flex flex-col justify-between p-5 relative">
            <div className={`w-full flex-1 flex flex-col ${fontClass} text-left`}>
              
              {/* Header Branding elements if specified */}
              {config.logoVisible && config.logoUrl && (
                <div className="flex items-center space-x-2 mb-4 justify-center">
                  <img src={config.logoUrl} alt="Logo" className="h-6 object-contain" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                </div>
              )}

              {/* VIEW 1: INVITATION VIEW */}
              {view === 'invitation' && (
                <div className="flex-1 flex flex-col justify-between py-4 text-center animate-fade-in space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold">You are cordially invited to</span>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 leading-tight mt-1">{eventName}</h1>
                    <div className="h-0.5 w-12 bg-slate-300 mx-auto my-3" />
                    <p className="text-xs text-slate-600 font-medium">{eventLocation}</p>
                    <p className="text-xs font-bold text-slate-900">{eventDate}</p>
                  </div>

                  {/* Greeting Audio Section if configured */}
                  {config.greetingEnabled && (
                    <div className="mx-auto max-w-[240px] w-full bg-white/70 backdrop-blur border border-slate-100 p-3 rounded-2xl shadow-sm text-left flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 text-slate-900 rounded-xl">
                        <Music className="w-4 h-4 animate-spin-slow" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold font-mono uppercase text-slate-400">Greeting Audio</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{config.greetingVoiceName || 'WeddingChimeIntro.mp3'}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setIsPlayingMusic(!isPlayingMusic)} 
                        className="p-1 text-slate-600 hover:text-slate-900 rounded"
                      >
                        {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {/* Simulated Action */}
                  <div className="space-y-2 max-w-[240px] mx-auto w-full pt-4">
                    <button 
                      type="button"
                      onClick={() => setView('guest_room')}
                      className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Enter Memory Capsule
                    </button>
                    <button 
                      type="button"
                      onClick={() => alert("Simulated RSVP: Guest marked as Attending!")}
                      className="w-full py-2 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      RSVP / Send Wishes
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 2: GUEST ROOM VIEW */}
              {view === 'guest_room' && (
                <div className="flex-1 flex flex-col justify-between animate-fade-in space-y-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800 leading-tight">
                      {config.photoTitle || 'Share Your Best Moments'}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                      {config.photoDesc || 'Help us capture every angle of our special day. Send us your snaps, videos, and wishes.'}
                    </p>
                  </div>

                  {/* Interactive Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button"
                      onClick={() => setView('photo_upload')}
                      className="bg-white/80 hover:bg-white border border-slate-100 p-2.5 rounded-xl text-center shadow-sm transition-all flex flex-col items-center justify-center space-y-1 group"
                    >
                      <Camera className="w-4 h-4 text-slate-900 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-bold text-slate-700">Add Photo</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setView('voice_guestbook')}
                      className="bg-white/80 hover:bg-white border border-slate-100 p-2.5 rounded-xl text-center shadow-sm transition-all flex flex-col items-center justify-center space-y-1 group"
                    >
                      <Mic className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-bold text-slate-700">Record Voice</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setView('wishes')}
                      className="bg-white/80 hover:bg-white border border-slate-100 p-2.5 rounded-xl text-center shadow-sm transition-all flex flex-col items-center justify-center space-y-1 group"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-bold text-slate-700">Write Wish</span>
                    </button>
                  </div>

                  {/* Simulated Guest Feed */}
                  <div className="flex-1 min-h-[160px] max-h-[220px] overflow-y-auto space-y-3 mt-2 pr-1 custom-scrollbar">
                    <div className="bg-white/80 border border-slate-100/50 p-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=120" alt="Post" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-800">Cynthia Watson</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Uploaded a moment</p>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 shrink-0">2m ago</span>
                    </div>

                    <div className="bg-white/80 border border-slate-100/50 p-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
                      <div className="h-8 w-8 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center shrink-0">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-800">Robert Chen</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Recorded 35s voice toast</p>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 shrink-0">12m ago</span>
                    </div>

                    {wishesList.slice(0, 1).map((w) => (
                      <div key={w.id} className="bg-white/80 border border-slate-100/50 p-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
                        <div className="h-8 w-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-slate-800">{w.author}</p>
                          <p className="text-[9px] text-slate-500 truncate mt-0.5">"{w.text}"</p>
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 shrink-0">{w.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 3: LIVE SCREEN VIEW */}
              {view === 'live_screen' && (
                <div className="flex-1 flex flex-col justify-between py-2 text-center animate-fade-in relative h-full">
                  {/* Status Overlay */}
                  <div className="absolute top-1 left-1 bg-slate-900/80 backdrop-blur text-[8px] text-white px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Slideshow Live View</span>
                  </div>

                  {/* Rotator Stage */}
                  <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={slideshowIndex}
                        initial={
                          config.transitionAnimation === 'slide' ? { x: 50, opacity: 0 } :
                          config.transitionAnimation === 'zoom' ? { scale: 0.8, opacity: 0 } :
                          { opacity: 0 }
                        }
                        animate={{ x: 0, scale: 1, opacity: 1 }}
                        exit={
                          config.transitionAnimation === 'slide' ? { x: -50, opacity: 0 } :
                          config.transitionAnimation === 'zoom' ? { scale: 1.1, opacity: 0 } :
                          { opacity: 0 }
                        }
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg border border-white/20 bg-black/10"
                      >
                        <img 
                          src={slideshowImages[slideshowIndex]} 
                          alt="Slideshow" 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left">
                          <p className="text-[10px] font-bold text-white">Guests are uploading live...</p>
                          <p className="text-[8px] text-slate-300 font-medium">Sofia & Leo Ceremony</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* QR Position Simulator */}
                  {config.qrCodePosition && config.qrCodePosition !== 'none' && (
                    <div 
                      className={`absolute bg-white/95 backdrop-blur p-1.5 rounded-xl border border-slate-200/50 flex flex-col items-center justify-center shadow-md ${
                        config.qrCodePosition === 'top-left' ? 'top-1 left-1' :
                        config.qrCodePosition === 'top-right' ? 'top-1 right-1' :
                        config.qrCodePosition === 'bottom-left' ? 'bottom-1 left-1' :
                        config.qrCodePosition === 'bottom-right' ? 'bottom-1 right-1' :
                        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                      }`}
                    >
                      <QrCode className="w-6 h-6 text-slate-800" />
                      <span className="text-[6px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">Scan to Join</span>
                    </div>
                  )}

                  {/* Footer Text if configured */}
                  {config.footerVisible && config.footerText && (
                    <p className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest mt-2">{config.footerText}</p>
                  )}
                </div>
              )}

              {/* VIEW 4: PHOTO UPLOAD VIEW (WITH MOCK CAMERA / OVERLAYS / FILTERS) */}
              {view === 'photo_upload' && (
                <div className="flex-1 flex flex-col justify-between animate-fade-in space-y-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-slate-900" />
                      <span>Photo Experience Studio</span>
                    </h2>
                    <p className="text-[10px] text-slate-400">Review frame, watermark, overlays, and filter configurations.</p>
                  </div>

                  {/* Camera Simulator Display Container */}
                  <div className="flex-1 aspect-[4/3] max-h-[190px] rounded-2xl overflow-hidden relative border border-slate-100 bg-slate-900 group">
                    <img 
                      src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400" 
                      alt="Camera Preview" 
                      className="w-full h-full object-cover transition-all"
                      style={{ filter: getFilterStyle(filter) }}
                    />

                    {/* Template Photo Frame Overlay */}
                    {config.photoEnableFrame && (
                      <div 
                        className="absolute inset-0 border-[10px] pointer-events-none transition-all flex items-center justify-center"
                        style={{ 
                          borderColor: config.presentationBgColor || '#C19A2E',
                          borderStyle: 'solid',
                          opacity: (config.photoFrameOpacity || 100) / 100 
                        }}
                      >
                        {/* Simulated fancy frame content */}
                        <div className="absolute inset-1 border border-white/40 pointer-events-none" />
                      </div>
                    )}

                    {/* Watermark Overlay */}
                    {config.photoEnableWatermark && (
                      <div 
                        className={`absolute bg-black/40 backdrop-blur-sm text-[8px] font-mono text-white py-1 px-1.5 rounded border border-white/20 uppercase tracking-widest pointer-events-none transition-all ${
                          config.photoWatermarkPosition === 'top-left' ? 'top-2 left-2' :
                          config.photoWatermarkPosition === 'top-right' ? 'top-2 right-2' :
                          config.photoWatermarkPosition === 'bottom-left' ? 'bottom-2 left-2' :
                          'bottom-2 right-2'
                        }`}
                        style={{ 
                          opacity: (config.photoWatermarkOpacity || 80) / 100,
                          transform: `scale(${config.photoWatermarkSize ? config.photoWatermarkSize / 15 : 1})`
                        }}
                      >
                        {config.photoOverlayText || '★ KAVA GALLERY ★'}
                      </div>
                    )}
                  </div>

                  {/* Filter controls */}
                  <div className="flex items-center justify-between bg-white/70 backdrop-blur p-2 rounded-xl border border-slate-100 gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">Visual Filter</span>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                      {['none', 'warm', 'retro', 'cyberpunk', 'bw'].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFilter(f)}
                          className={`px-2 py-1 rounded-lg text-[9px] capitalize font-bold transition-all shrink-0 ${
                            filter === f ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setView('success_screen')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl text-center"
                  >
                    Simulate Upload
                  </button>
                </div>
              )}

              {/* VIEW 5: VOICE GUESTBOOK */}
              {view === 'voice_guestbook' && (
                <div className="flex-1 flex flex-col justify-between animate-fade-in space-y-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-rose-500" />
                      <span>Voice Guestbook Telephony</span>
                    </h2>
                    <p className="text-[10px] text-slate-400">Record customized voicemail congratulations or speeches.</p>
                  </div>

                  <div className="bg-white/70 backdrop-blur border border-slate-100 rounded-2xl p-4 text-center space-y-3 flex-1 flex flex-col justify-center items-center">
                    {/* Ringing / Waveform simulation */}
                    <div className="flex items-center justify-center space-x-1.5 h-12 w-full max-w-[180px]">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => {
                        const randomHeight = voiceRecording 
                          ? Math.floor(Math.random() * 32) + 8 
                          : Math.floor(Math.random() * 6) + 3;
                        return (
                          <motion.div
                            key={bar}
                            animate={{ height: randomHeight }}
                            transition={{ repeat: Infinity, duration: 0.3, ease: 'easeInOut' }}
                            className={`w-1 rounded-full ${voiceRecording ? 'bg-rose-500' : 'bg-slate-300'}`}
                          />
                        );
                      })}
                    </div>

                    <div>
                      {voiceRecording ? (
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-rose-500 font-mono animate-pulse uppercase tracking-wider">● Recording Toast</p>
                          <p className="text-lg font-extrabold text-slate-900 font-mono">{Math.floor(voiceSeconds / 60)}:{(voiceSeconds % 60).toString().padStart(2, '0')}</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">Voice Booth Idle</p>
                          <p className="text-xs font-bold text-slate-700 leading-relaxed">Press record to leave a 60s message</p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setVoiceRecording(!voiceRecording)}
                      className={`h-11 w-11 rounded-full flex items-center justify-center transition-all shadow ${
                        voiceRecording ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-rose-500 text-white hover:bg-rose-600'
                      }`}
                    >
                      {voiceRecording ? <Check className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>

                  <p className="text-[9px] text-slate-400 text-center">Notification tone: <span className="font-bold text-slate-900 capitalize">{config.greetingNotificationTone || 'Classic chime'}</span></p>
                </div>
              )}

              {/* VIEW 6: WISHES VIEW */}
              {view === 'wishes' && (
                <div className="flex-1 flex flex-col justify-between animate-fade-in space-y-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Interactive Guest Wishes</span>
                    </h2>
                    <p className="text-[10px] text-slate-400">Custom wish cards rendering with selected bubble preset.</p>
                  </div>

                  {/* Wishes Render list */}
                  <div className={`flex-1 overflow-y-auto max-h-[180px] space-y-3 pr-1 custom-scrollbar ${wishFontClass}`}>
                    {wishesList.map((w) => (
                      <div key={w.id} className={getWishBubbleClasses()}>
                        <div className="flex justify-between items-start mb-1.5 border-b border-slate-100/50 pb-1 font-sans">
                          <span className="text-[11px] font-extrabold text-slate-800">{w.author}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{w.date}</span>
                        </div>
                        <p className="text-xs leading-relaxed italic">"{w.text}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Live submission simulator */}
                  <form onSubmit={handleAddWish} className="flex gap-2">
                    <input 
                      type="text"
                      value={newWishAuthor}
                      onChange={(e) => setNewWishAuthor(e.target.value)}
                      placeholder="Your Name"
                      className="w-1/3 bg-white/90 border border-slate-150 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-slate-800 focus:outline-none"
                    />
                    <input 
                      type="text"
                      value={newWishText}
                      onChange={(e) => setNewWishText(e.target.value)}
                      placeholder="Write your beautiful wish..."
                      className="flex-1 bg-white/90 border border-slate-150 rounded-xl px-3 py-1.5 text-[10px] font-bold text-slate-800 focus:outline-none"
                    />
                    <button 
                      type="submit"
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* VIEW 7: SUCCESS SCREEN VIEW */}
              {view === 'success_screen' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in space-y-4">
                  {/* Floating celebration particles */}
                  {config.globalCelebrationAnimation && config.globalCelebrationAnimation !== 'none' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                      <motion.div
                        animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
                        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                        className="opacity-20 text-slate-400"
                      >
                        <Sparkles className="w-32 h-32" />
                      </motion.div>
                    </div>
                  )}

                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md border border-emerald-100">
                    <Check className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 max-w-[240px] z-10">
                    <h3 className="text-base font-extrabold text-slate-800">Contribution Added!</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {config.globalSuccessMessage || 'Your beautiful memory was successfully sent to the digital capsule. Thank you!'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setView('guest_room')}
                    className="py-1.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-xl transition-colors z-10"
                  >
                    Back to Capsule
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Footer branding details */}
          <div className="p-3 border-t border-slate-100 bg-white/70 backdrop-blur-sm flex items-center justify-between text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest z-10">
            <span>PLATFORM PREVIEW MODE</span>
            {config.footerVisible && config.footerText ? (
              <span>{config.footerText}</span>
            ) : (
              <span>POWERED BY KAVA PLATFORM</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
