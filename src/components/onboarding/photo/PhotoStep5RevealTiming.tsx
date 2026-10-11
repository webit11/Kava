import React from 'react';
import { Check, ArrowRight, Calendar, Clock } from 'lucide-react';

export type RevealTimingOption = 'instant_live' | 'time_capsule_midnight' | 'custom_reveal';

interface PhotoStep5RevealTimingProps {
  revealTiming: RevealTimingOption;
  setRevealTiming: (timing: RevealTimingOption) => void;
  customRevealDate?: string;
  setCustomRevealDate?: (date: string) => void;
  onNext: () => void;
  appearance?: 'light' | 'dark';
}

export default function PhotoStep5RevealTiming({
  revealTiming = 'instant_live',
  setRevealTiming,
  customRevealDate = '2026-06-21T09:00',
  setCustomRevealDate,
  onNext,
  appearance = 'light',
}: PhotoStep5RevealTimingProps) {
  const isDark = appearance === 'dark';

  return (
    <div className="space-y-6 text-left max-w-lg mx-auto" id="photo-step-5-reveal">
      {/* Step Heading */}
      <div className="space-y-1.5">
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#1F2937]'
          }`}
        >
          When should photos be revealed?
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#6B7280]'}`}>
          You can change this later if you want.
        </p>
      </div>

      {/* 3 Option Cards */}
      <div className="space-y-3 pt-1">
        {/* OPTION 1: During Event */}
        <div
          onClick={() => setRevealTiming('instant_live')}
          className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start justify-between ${
            revealTiming === 'instant_live'
              ? isDark
                ? 'border-[#0E7A6B] bg-[#0E7A6B]/15 shadow-sm ring-1 ring-[#0E7A6B]/30'
                : 'border-[#0E7A6B] bg-[#F0FDF9] shadow-xs ring-1 ring-[#0E7A6B]/20'
              : isDark
              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="card-reveal-during"
        >
          <div className="space-y-1 pr-4">
            <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1F2937]'}`}>
              During Event
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#6B7280]'}`}>
              Guests can see photos as they're uploaded.
            </p>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
              revealTiming === 'instant_live'
                ? 'bg-[#0E7A6B] text-white shadow-xs'
                : 'border-2 border-slate-300 dark:border-slate-700 text-transparent'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* OPTION 2: After Event */}
        <div
          onClick={() => setRevealTiming('time_capsule_midnight')}
          className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start justify-between ${
            revealTiming === 'time_capsule_midnight'
              ? isDark
                ? 'border-[#0E7A6B] bg-[#0E7A6B]/15 shadow-sm ring-1 ring-[#0E7A6B]/30'
                : 'border-[#0E7A6B] bg-[#F0FDF9] shadow-xs ring-1 ring-[#0E7A6B]/20'
              : isDark
              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="card-reveal-after"
        >
          <div className="space-y-1 pr-4">
            <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1F2937]'}`}>
              After Event
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#6B7280]'}`}>
              Reveal all photos when the event ends.
            </p>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
              revealTiming === 'time_capsule_midnight'
                ? 'bg-[#0E7A6B] text-white shadow-xs'
                : 'border-2 border-slate-300 dark:border-slate-700 text-transparent'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* OPTION 3: Custom */}
        <div
          onClick={() => setRevealTiming('custom_reveal')}
          className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col space-y-3 ${
            revealTiming === 'custom_reveal'
              ? isDark
                ? 'border-[#0E7A6B] bg-[#0E7A6B]/15 shadow-sm ring-1 ring-[#0E7A6B]/30'
                : 'border-[#0E7A6B] bg-[#F0FDF9] shadow-xs ring-1 ring-[#0E7A6B]/20'
              : isDark
              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="card-reveal-custom"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1 pr-4">
              <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1F2937]'}`}>
                Custom
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#6B7280]'}`}>
                Set a specific date & time to reveal photos.
              </p>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                revealTiming === 'custom_reveal'
                  ? 'bg-[#0E7A6B] text-white shadow-xs'
                  : 'border-2 border-slate-300 dark:border-slate-700 text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* If Custom is selected, show time input */}
          {revealTiming === 'custom_reveal' && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <input
                  type="datetime-local"
                  value={customRevealDate}
                  onChange={(e) => setCustomRevealDate && setCustomRevealDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Teal CTA Button */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-reveal-continue"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
