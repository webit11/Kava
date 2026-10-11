import React from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { getPhotoModeContext } from '../../../lib/photoModeContext';

interface PhotoStep3NameProps {
  eventType: string;
  eventName: string;
  setEventName: (name: string) => void;
  eventDate?: string;
  setEventDate?: (date: string) => void;
  eventLocation?: string;
  setEventLocation?: (loc: string) => void;
  selectedCover?: string;
  onNext: () => void;
  appearance?: 'light' | 'dark';
}

export default function PhotoStep3Name({
  eventType,
  eventName,
  setEventName,
  onNext,
  appearance = 'light',
}: PhotoStep3NameProps) {
  const isDark = appearance === 'dark';
  const ctx = getPhotoModeContext(eventType);

  // Suggested names based on selected event type
  const suggestions = [
    ctx.defaultName || 'Maya & Liam’s Wedding',
    `${eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) : 'Special'} Celebration`,
    'Summer Vibes 2026',
    'Golden Hour Memories',
  ];

  return (
    <div className="space-y-6 text-left max-w-lg mx-auto" id="photo-step-3-name">
      {/* Step Heading */}
      <div className="space-y-1.5">
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#1F2937]'
          }`}
        >
          What's your event called?
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#6B7280]'}`}>
          Guests will see this name on your photo album.
        </p>
      </div>

      {/* Main Form Card with subtle leaf styling */}
      <div
        className={`relative p-6 sm:p-7 rounded-2xl border transition-all duration-200 overflow-hidden ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200/90 shadow-xs'
        }`}
      >
        {/* Subtle Decorative Botanical Leaf in top-right */}
        <div className="absolute -top-3 -right-3 opacity-15 pointer-events-none text-[#0E7A6B]">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
            <path d="M70 10C50 10 30 30 30 60C30 80 50 90 70 90C90 90 90 70 90 50C90 30 80 10 70 10ZM55 75C45 65 45 45 65 35C65 45 65 65 55 75Z" />
          </svg>
        </div>

        <div className="space-y-4 relative z-10">
          {/* Label */}
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Event Name
          </label>

          {/* Clean Input Field with clear (X) button */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Maya & Liam's Wedding"
              className={`w-full px-4 py-3.5 pr-10 rounded-xl border text-sm sm:text-base font-semibold transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#0E7A6B] focus:ring-2 focus:ring-[#0E7A6B]/20'
                  : 'bg-[#F9FAFB] border-slate-200 text-[#1F2937] placeholder:text-slate-400 focus:border-[#0E7A6B] focus:bg-white focus:ring-2 focus:ring-[#0E7A6B]/15'
              }`}
              id="input-photo-event-name"
              autoFocus
            />
            {eventName.length > 0 && (
              <button
                type="button"
                onClick={() => setEventName('')}
                className="absolute right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Clear name"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick suggestions pills */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Suggestions
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEventName(sug)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                    eventName === sug
                      ? 'bg-[#E6FFFA] border-[#99F6E4] text-[#0E7A6B] font-semibold'
                      : isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Teal CTA Button */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => {
            if (!eventName.trim()) {
              setEventName(ctx.defaultName || 'My Photo Event');
            }
            onNext();
          }}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-name-continue"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
