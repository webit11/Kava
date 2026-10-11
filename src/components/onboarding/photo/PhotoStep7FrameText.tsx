import React from 'react';
import { ArrowRight, Sparkles, Type, Calendar as CalendarIcon, Check } from 'lucide-react';
import { getPhotoModeContext } from '../../../lib/photoModeContext';

interface PhotoStep7FrameTextProps {
  eventType: string;
  eventName: string;
  frameCaption: string;
  setFrameCaption: (caption: string) => void;
  showDateOnFrame: boolean;
  setShowDateOnFrame: (val: boolean) => void;
  frameFont: 'serif' | 'handwriting' | 'sans' | 'mono';
  setFrameFont: (font: 'serif' | 'handwriting' | 'sans' | 'mono') => void;
  eventDate?: string;
  onNext: () => void;
}

export default function PhotoStep7FrameText({
  eventType,
  eventName,
  frameCaption,
  setFrameCaption,
  showDateOnFrame,
  setShowDateOnFrame,
  frameFont = 'serif',
  setFrameFont,
  eventDate = '2026-08-25',
  onNext,
}: PhotoStep7FrameTextProps) {
  const ctx = getPhotoModeContext(eventType);
  const displayCaption = frameCaption || eventName || ctx.defaultName;

  const fontOptions: { id: 'serif' | 'handwriting' | 'sans' | 'mono'; name: string; sample: string; css: string }[] = [
    { id: 'serif', name: 'Romantic Serif', sample: 'Sarah & David', css: 'font-serif italic' },
    { id: 'handwriting', name: 'Handwritten Script', sample: 'Sarah & David', css: 'font-serif tracking-wide' },
    { id: 'sans', name: 'Modern Clean', sample: 'SARAH & DAVID', css: 'font-sans font-bold uppercase tracking-wider' },
    { id: 'mono', name: 'Editorial Mono', sample: 'sarah + david · 26', css: 'font-mono' },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 text-left" id="photo-step-7-frame-text">
      {/* Step Header */}
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-[11px] font-bold tracking-tight mb-0.5">
          <Sparkles className="w-3 h-3 text-[#0E7A6B]" />
          <span>Step 7 • Frame Caption & Date</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight font-sans">
          Customize your frame text
        </h2>
        <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed">
          Add an elegant title, date, and typography to appear on the bottom of guests' prints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Input Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Caption Input */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-[#0B132B] flex items-center space-x-1.5">
              <Type className="w-3.5 h-3.5 text-[#0E7A6B]" />
              <span>Frame Caption</span>
            </label>
            <input
              type="text"
              value={frameCaption}
              onChange={(e) => setFrameCaption(e.target.value)}
              placeholder={eventName || ctx.defaultName}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-[#0B132B] bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0E7A6B] focus:ring-2 focus:ring-[#0E7A6B]/20 transition-all shadow-2xs"
              id="input-frame-caption"
            />
          </div>

          {/* Show Date Toggle */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center space-x-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#0E7A6B]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#0B132B]">Display event date</h4>
              </div>
              <p className="text-xs text-[#6B7280]">Print the date below the event name on the frame.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowDateOnFrame(!showDateOnFrame)}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                showDateOnFrame ? 'bg-[#0E7A6B]' : 'bg-slate-200'
              }`}
              id="toggle-show-date-on-frame"
              aria-label="Toggle show date on frame"
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                  showDateOnFrame ? 'translate-x-6 left-0' : 'translate-x-0.5 left-0'
                }`}
              />
            </button>
          </div>

          {/* Font Style Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#0B132B]">
              Typography Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fontOptions.map((opt) => {
                const isSelected = frameFont === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFrameFont(opt.id)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#0E7A6B] bg-[#F0FDF9] ring-2 ring-[#0E7A6B]/15'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#0B132B]">{opt.name}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#0E7A6B] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs text-[#0E7A6B] truncate block ${opt.css}`}>
                      {opt.sample}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Frame Text Preview (5 cols) */}
        <div className="lg:col-span-5 bg-[#F9FAFB] border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-2xs">
          <span className="text-[10px] font-bold text-[#0E7A6B] uppercase tracking-wider mb-2">
            Live Frame Preview
          </span>

          <div className="w-[180px] bg-white p-2.5 pb-6 shadow-xl rounded-xs border border-slate-200 rotate-[1deg]">
            <div className="w-full aspect-square overflow-hidden bg-slate-900 rounded-xs mb-2">
              <img
                src={ctx.samplePhotos[0]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600'}
                alt="Sample photo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center px-1">
              <p
                className={`text-xs text-[#0B132B] truncate ${
                  frameFont === 'serif'
                    ? 'font-serif italic'
                    : frameFont === 'sans'
                    ? 'font-sans font-bold uppercase tracking-wider text-[10px]'
                    : frameFont === 'mono'
                    ? 'font-mono text-[10px]'
                    : 'font-serif'
                }`}
              >
                {displayCaption}
              </p>
              {showDateOnFrame && (
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {eventDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Continue Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-continue-step-7"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
