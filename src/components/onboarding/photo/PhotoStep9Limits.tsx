import React from 'react';
import { Minus, Plus, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface PhotoStep9LimitsProps {
  guestLimit: number;
  setGuestLimit: (limit: number) => void;
  photoLimitPerGuest: number;
  setPhotoLimitPerGuest: (limit: number) => void;
  onNext: () => void;
}

export default function PhotoStep9Limits({
  guestLimit,
  setGuestLimit,
  photoLimitPerGuest,
  setPhotoLimitPerGuest,
  onNext,
}: PhotoStep9LimitsProps) {
  const handleGuestChange = (delta: number) => {
    setGuestLimit(Math.max(5, Math.min(500, guestLimit + delta)));
  };

  const handlePhotoLimitChange = (delta: number) => {
    setPhotoLimitPerGuest(Math.max(1, Math.min(100, photoLimitPerGuest + delta)));
  };

  return (
    <div className="space-y-5 text-left" id="photo-step-9-limits">
      {/* Step Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight font-sans">
          Set guest & photo limits
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] font-normal leading-relaxed">
          These limits help you keep your album organized and manageable.
        </p>
      </div>

      {/* Limits Controls */}
      <div className="space-y-4 pt-1">
        {/* Section 1: Guest Limit */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-[#1F2937]">
              Guest limit
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleGuestChange(-10)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                id="btn-decrement-guests"
                aria-label="Decrease guest limit"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-[#1F2937] min-w-[110px] text-center font-mono">
                Up to {guestLimit} guests
              </span>
              <button
                type="button"
                onClick={() => handleGuestChange(10)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                id="btn-increment-guests"
                aria-label="Increase guest limit"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={guestLimit}
              onChange={(e) => setGuestLimit(Number(e.target.value))}
              className="w-full accent-[#0E7A6B] cursor-pointer"
              id="slider-guests"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>5</span>
              <span>100</span>
              <span>200+</span>
            </div>
          </div>
        </div>

        {/* Section 2: Photos per Guest */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-[#1F2937]">
              Photos per guest
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handlePhotoLimitChange(-5)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                id="btn-decrement-photos"
                aria-label="Decrease photos per guest"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-[#1F2937] min-w-[110px] text-center font-mono">
                Up to {photoLimitPerGuest} photos
              </span>
              <button
                type="button"
                onClick={() => handlePhotoLimitChange(5)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                id="btn-increment-photos"
                aria-label="Increase photos per guest"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={photoLimitPerGuest}
              onChange={(e) => setPhotoLimitPerGuest(Number(e.target.value))}
              className="w-full accent-[#0E7A6B] cursor-pointer"
              id="slider-photos"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>1</span>
              <span>20</span>
              <span>50</span>
            </div>
          </div>
        </div>

        {/* Plan Info Card at bottom */}
        <div className="p-4 rounded-2xl bg-[#F0FDF9] border border-[#99F6E4]/80 flex items-start space-x-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-[#E6FFFA] text-[#0E7A6B] flex items-center justify-center shrink-0 border border-[#99F6E4]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#0E7A6B]">
              Your Plan: Free
            </h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Upgrade anytime for more storage and higher limits.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Continue Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-continue-step-9"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
