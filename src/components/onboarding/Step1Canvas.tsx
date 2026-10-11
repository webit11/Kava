import React from 'react';
import {
  Camera,
  Layers,
  Check,
  Sparkles,
  Lock,
  Image as ImageIcon,
  Video,
  Mic,
  Heart,
} from 'lucide-react';
import { ExperienceMode } from '../../types';
import { useTranslation } from '../../lib/useTranslation';

interface Step1CanvasProps {
  eventType?: string;
  onSelectEventType?: (typeId: string, typeName: string, defaultName: string) => void;
  experienceMode: ExperienceMode;
  onSelectExperienceMode: (mode: ExperienceMode) => void;
  appearance?: 'light' | 'dark';
}

export default function Step1Canvas({
  experienceMode,
  onSelectExperienceMode,
  appearance = 'light',
}: Step1CanvasProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';
  const isPhotoSelected = experienceMode === 'photo_collection';
  const isCapsuleSelected = experienceMode === 'memory_capsule';

  return (
    <div className="space-y-5 sm:space-y-6 text-left" id="step-1-canvas-content">
      {/* Centered / Upper-Aligned Step Heading */}
      <div className="space-y-1.5 text-center sm:text-left max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-[11px] font-bold tracking-tight mb-0.5">
          <Sparkles className="w-3 h-3 text-[#0E7A6B]" />
          <span>{t('onboarding.step1_tag', 'Step 1 • Experience Selection')}</span>
        </div>
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#0B132B]'
          }`}
        >
          {t('onboarding.step1_title_clean', 'What would you like to create?')}
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#4B5563]'}`}>
          {t(
            'onboarding.step1_desc_clean',
            'Choose the experience that fits your event. You can always create another experience later.'
          )}
        </p>
      </div>

      {/* Two Large Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
        
        {/* CARD 01: Photo Album (Primary / Recommended) */}
        <div
          onClick={() => onSelectExperienceMode('photo_collection')}
          className={`relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group ${
            isPhotoSelected
              ? isDark
                ? 'border-[#0E7A6B] bg-[#0E7A6B]/10 shadow-md ring-2 ring-[#0E7A6B]/30'
                : 'border-[#0E7A6B] bg-[#F0FDF9] shadow-md ring-2 ring-[#0E7A6B]/15'
              : isDark
              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
          }`}
          id="card-choice-photo-album"
        >
          {/* Card Top Row: Number, Badge & Selection Checkmark */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#0E7A6B] bg-[#E6FFFA] px-2 py-0.5 rounded-md border border-[#99F6E4]/80">
                01
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#0E7A6B] bg-white px-2.5 py-0.5 rounded-full border border-[#99F6E4] shadow-2xs">
                Recommended for collecting photos
              </span>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isPhotoSelected
                  ? 'bg-[#0E7A6B] text-white shadow-xs'
                  : 'border-2 border-slate-300 dark:border-slate-700 text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5 mb-3">
            <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
              Photo Album
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#4B5563]'}`}>
              Collect every photo from your guests in one beautiful shared album.
            </p>
          </div>

          {/* Tasteful Photography Preview Visual */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 mb-3.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs group-hover:scale-[1.01] transition-transform">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
              alt="Photo Album Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Live Camera Badge Over Image */}
            <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-medium">
              <Camera className="w-3 h-3 text-[#5EEAD4]" />
              <span>Live Guest Photo Drops</span>
            </div>
          </div>

          {/* 3-4 Simple Capability Tags */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-1.5 text-[11px] font-medium text-[#4B5563]">
            <span className={`px-2 py-0.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700'}`}>
              Guest Photo Upload
            </span>
            <span className={`px-2 py-0.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700'}`}>
              Camera Capture
            </span>
            <span className={`px-2 py-0.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700'}`}>
              Photo Frames
            </span>
            <span className={`px-2 py-0.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700'}`}>
              QR Sharing
            </span>
          </div>
        </div>

        {/* CARD 02: Full Memory Capsule (Secondary / All-in-One) */}
        <div
          onClick={() => onSelectExperienceMode('memory_capsule')}
          className={`relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group ${
            isCapsuleSelected
              ? isDark
                ? 'border-[#0E7A6B] bg-[#0E7A6B]/10 shadow-md ring-2 ring-[#0E7A6B]/30'
                : 'border-[#0E7A6B] bg-[#F0FDF9] shadow-md ring-2 ring-[#0E7A6B]/15'
              : isDark
              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
          }`}
          id="card-choice-full-capsule"
        >
          {/* Card Top Row: Number, Badge & Selection Checkmark */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                02
              </span>
              <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                All-in-One Memory
              </span>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isCapsuleSelected
                  ? 'bg-[#0E7A6B] text-white shadow-xs'
                  : 'border-2 border-slate-300 dark:border-slate-700 text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5 mb-3">
            <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
              Full Memory Capsule
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#4B5563]'}`}>
              Bring together photos, videos, voice messages, and wishes in one complete event memory.
            </p>
          </div>

          {/* Subtle Multimedia Preview Tiles */}
          <div className={`aspect-[16/9] rounded-xl overflow-hidden p-2.5 grid grid-cols-2 gap-2 mb-3.5 border shadow-2xs group-hover:scale-[1.01] transition-transform ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/90'
          }`}>
            <div className={`rounded-lg p-2 border flex items-center space-x-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#0E7A6B] flex items-center justify-center">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Photos</span>
            </div>
            <div className={`rounded-lg p-2 border flex items-center space-x-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="w-6 h-6 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 flex items-center justify-center">
                <Video className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Videos</span>
            </div>
            <div className={`rounded-lg p-2 border flex items-center space-x-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 flex items-center justify-center">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Voice Notes</span>
            </div>
            <div className={`rounded-lg p-2 border flex items-center space-x-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Wishes</span>
            </div>
          </div>

          {/* Simple Capability Tags */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-1.5 text-[11px] font-medium text-[#4B5563]">
            <span className={`px-2 py-0.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700'}`}>
              Photos
            </span>
            <span className={`px-2 py-0.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700'}`}>
              Videos
            </span>
            <span className={`px-2 py-0.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700'}`}>
              Voice
            </span>
            <span className={`px-2 py-0.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700'}`}>
              Wishes
            </span>
          </div>
        </div>

      </div>

      {/* Subtle Privacy Assurance */}
      <div className="pt-2 flex items-center justify-center space-x-1.5 text-[11px] text-[#6B7280]">
        <Lock className="w-3 h-3 text-[#0E7A6B]" />
        <span>Private & secure by default. You control guest visibility and access.</span>
      </div>
    </div>
  );
}
