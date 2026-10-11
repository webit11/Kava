import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getPhotoModeContext } from '../../../lib/photoModeContext';

export interface FrameOption {
  id: string;
  name: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  { id: 'none', name: 'None' },
  { id: 'polaroid', name: 'Polaroid' },
  { id: 'floral', name: 'Floral' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'classic', name: 'Classic' },
  { id: 'custom', name: 'Custom' },
];

interface PhotoStep6PhotoFrameProps {
  eventType: string;
  eventName: string;
  eventDate?: string;
  frameStyleId: string;
  setFrameStyleId: (id: string) => void;
  selectedCover?: string;
  onNext: () => void;
  appearance?: 'light' | 'dark';
}

export default function PhotoStep6PhotoFrame({
  eventType,
  eventName,
  eventDate = '2026-06-20',
  frameStyleId = 'polaroid',
  setFrameStyleId,
  selectedCover,
  onNext,
  appearance = 'light',
}: PhotoStep6PhotoFrameProps) {
  const isDark = appearance === 'dark';
  const ctx = getPhotoModeContext(eventType);

  const displayPhoto =
    selectedCover ||
    ctx.imageUrl ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

  const displayName = eventName || ctx.defaultName || 'Sofia & Leo’s Wedding';

  return (
    <div className="space-y-6 text-left max-w-lg mx-auto" id="photo-step-6-frame">
      {/* Step Heading */}
      <div className="space-y-1.5">
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#1F2937]'
          }`}
        >
          Add a photo frame?
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#6B7280]'}`}>
          Make every photo feel special with your event frame.
        </p>
      </div>

      {/* Frame Live Preview Card */}
      <div
        className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col items-center justify-center ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200/90 shadow-xs'
        }`}
      >
        <div className="w-full max-w-[260px] sm:max-w-[280px] transition-all duration-300">
          {/* POLAROID FRAME */}
          {frameStyleId === 'polaroid' && (
            <div className="bg-white p-3 pb-7 shadow-lg rounded-xs border border-slate-200 rotate-[-1deg] transition-all">
              <div className="w-full aspect-[4/3] overflow-hidden bg-slate-900 rounded-xs">
                <img
                  src={displayPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-3 text-center px-1">
                <p className="font-serif italic text-sm sm:text-base text-[#1F2937] font-semibold truncate">
                  {displayName} 🤍
                </p>
              </div>
            </div>
          )}

          {/* FLORAL FRAME */}
          {frameStyleId === 'floral' && (
            <div className="bg-[#FAF5F0] p-3 pb-6 shadow-lg rounded-xl border-2 border-emerald-200/70 relative">
              <div className="absolute top-1 left-2 text-xs select-none">🌿</div>
              <div className="absolute top-1 right-2 text-xs select-none">🌸</div>
              <div className="w-full aspect-[4/3] overflow-hidden bg-slate-900 rounded-lg">
                <img
                  src={displayPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2.5 text-center px-1">
                <p className="font-serif italic text-sm font-bold text-emerald-950 truncate">
                  {displayName}
                </p>
              </div>
            </div>
          )}

          {/* MINIMAL FRAME */}
          {frameStyleId === 'minimal' && (
            <div className="bg-white p-2.5 pb-4 shadow-md rounded-md border border-slate-200">
              <div className="w-full aspect-[4/3] overflow-hidden bg-slate-900 rounded-xs">
                <img
                  src={displayPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-slate-700 tracking-wide truncate uppercase">
                  {displayName}
                </p>
              </div>
            </div>
          )}

          {/* CLASSIC FRAME */}
          {frameStyleId === 'classic' && (
            <div className="bg-white p-3.5 pb-5 shadow-lg rounded-sm border-4 border-slate-900">
              <div className="w-full aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={displayPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2.5 text-center">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-widest truncate">
                  {displayName}
                </p>
              </div>
            </div>
          )}

          {/* CUSTOM FRAME */}
          {frameStyleId === 'custom' && (
            <div className="bg-stone-900 p-3 pb-5 shadow-lg rounded-md border border-amber-500/40">
              <div className="w-full aspect-[4/3] overflow-hidden rounded-xs">
                <img
                  src={displayPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2.5 text-center">
                <p className="font-mono text-xs text-amber-300 font-bold tracking-wider truncate">
                  {displayName}
                </p>
              </div>
            </div>
          )}

          {/* NONE (BORDERLESS) */}
          {(frameStyleId === 'none' || frameStyleId === 'no_frame') && (
            <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-md border border-slate-200">
              <img
                src={displayPhoto}
                alt={displayName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Frame Selectors */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {FRAME_OPTIONS.map((opt) => {
          const isSelected =
            frameStyleId === opt.id ||
            (opt.id === 'none' && frameStyleId === 'no_frame');

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFrameStyleId(opt.id === 'none' ? 'none' : opt.id)}
              className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                isSelected
                  ? 'border-[#0E7A6B] bg-[#F0FDF9] dark:bg-[#0E7A6B]/15 ring-1 ring-[#0E7A6B]/30'
                  : isDark
                  ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              id={`btn-frame-${opt.id}`}
            >
              <span
                className={`text-[11px] sm:text-xs font-bold truncate ${
                  isSelected ? 'text-[#0E7A6B] dark:text-[#5EEAD4]' : isDark ? 'text-white' : 'text-[#1F2937]'
                }`}
              >
                {opt.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skip button and Continue */}
      <div className="pt-2 space-y-2 text-center">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-frame-continue"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>

        <button
          type="button"
          onClick={() => {
            setFrameStyleId('none');
            onNext();
          }}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors py-1 cursor-pointer"
        >
          Skip this step
        </button>
      </div>
    </div>
  );
}
