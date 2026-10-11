import React from 'react';
import { Camera, Check, ArrowRight, Package } from 'lucide-react';
import { ExperienceMode } from '../../../types';

interface PhotoStep1ExperienceProps {
  experienceMode: ExperienceMode;
  onSelectExperienceMode: (mode: ExperienceMode) => void;
  onNext: () => void;
  appearance?: 'light' | 'dark';
}

export default function PhotoStep1Experience({
  experienceMode,
  onSelectExperienceMode,
  onNext,
  appearance = 'light',
}: PhotoStep1ExperienceProps) {
  const isDark = appearance === 'dark';
  const isPhotoSelected = experienceMode === 'photo_collection';

  return (
    <div className="space-y-6 text-left max-w-lg mx-auto" id="photo-step-1-experience">
      {/* Step Heading */}
      <div className="space-y-1.5">
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#1F2937]'
          }`}
        >
          What would you like to create?
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#6B7280]'}`}>
          Choose the experience that best fits your event.
        </p>
      </div>

      {/* Two Experience Cards */}
      <div className="space-y-3.5 pt-2">
        {/* CARD 1: Photo Album (Active / Selected) */}
        <div
          onClick={() => onSelectExperienceMode('photo_collection')}
          className={`relative p-5 sm:p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group ${
            isPhotoSelected
              ? isDark
                ? 'border-[#0E7A6B] bg-[#0E7A6B]/15 shadow-sm ring-1 ring-[#0E7A6B]/30'
                : 'border-[#0E7A6B] bg-[#F0FDF9] shadow-xs ring-1 ring-[#0E7A6B]/20'
              : isDark
              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="card-choice-photo-album"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FFFA] dark:bg-[#0E7A6B]/25 border border-[#99F6E4] dark:border-[#0E7A6B]/40 flex items-center justify-center text-[#0E7A6B] dark:text-[#5EEAD4]">
              <Camera className="w-5 h-5" />
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

          <div className="space-y-1">
            <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1F2937]'}`}>
              Photo Album
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#6B7280]'}`}>
              Collect photos from your guests in one beautiful shared album.
            </p>
          </div>
        </div>

        {/* CARD 2: Full Event (Coming Soon) */}
        <div
          onClick={() => {
            // Can show a soft feedback or allow selection if user explicitly clicks
            onSelectExperienceMode('memory_capsule');
          }}
          className={`relative p-5 sm:p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group opacity-85 hover:opacity-100 ${
            !isPhotoSelected
              ? isDark
                ? 'border-purple-500 bg-purple-950/20 shadow-sm'
                : 'border-purple-500 bg-purple-50/50 shadow-xs'
              : isDark
              ? 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
              : 'border-slate-200/80 bg-white hover:border-slate-300'
          }`}
          id="card-choice-full-event"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <Package className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Coming Soon
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1F2937]'}`}>
                Full Event
              </h3>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#6B7280]'}`}>
              Photos, videos, voice messages, wishes and more.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Teal CTA Button */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-experience-continue"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

