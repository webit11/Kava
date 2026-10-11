import React from 'react';
import { Sparkles, ArrowRight, Camera, Image, Heart, Check, QrCode } from 'lucide-react';
import { getPhotoModeContext } from '../../../lib/photoModeContext';

interface PhotoStep5GuestWelcomeProps {
  eventType: string;
  eventName: string;
  welcomeMessage: string;
  setWelcomeMessage: (msg: string) => void;
  selectedCover: string;
  setSelectedCover: (url: string) => void;
  onNext: () => void;
}

export default function PhotoStep5GuestWelcome({
  eventType,
  eventName,
  welcomeMessage,
  setWelcomeMessage,
  selectedCover,
  setSelectedCover,
  onNext,
}: PhotoStep5GuestWelcomeProps) {
  const ctx = getPhotoModeContext(eventType);
  const displayTitle = eventName || ctx.defaultName;

  const defaultMsg = `Welcome! Capture your favorite moments and share them in our shared photo album 📸`;

  React.useEffect(() => {
    if (!welcomeMessage) {
      setWelcomeMessage(defaultMsg);
    }
  }, [defaultMsg]);

  const coverOptions = ctx.samplePhotos.map((p) => p.url);

  return (
    <div className="space-y-5 sm:space-y-6 text-left" id="photo-step-5-guest-welcome">
      {/* Step Header */}
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-[11px] font-bold tracking-tight mb-0.5">
          <Sparkles className="w-3 h-3 text-[#0E7A6B]" />
          <span>Step 5 • Guest Welcome & Invitation Page</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight font-sans">
          Customize the guest welcome screen
        </h2>
        <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed">
          This is the first screen guests see when they scan your QR code on their phones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Input Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Welcome Message Input */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-[#0B132B]">
              Welcome Note for Guests
            </label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
              placeholder={defaultMsg}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-[#0B132B] bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0E7A6B] focus:ring-2 focus:ring-[#0E7A6B]/20 transition-all shadow-2xs resize-none"
              id="input-guest-welcome-message"
            />
          </div>

          {/* Cover Photo Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#0B132B] flex items-center space-x-1.5">
              <Image className="w-3.5 h-3.5 text-[#0E7A6B]" />
              <span>Select Album Cover Photo</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {coverOptions.map((url, idx) => {
                const isSelected = selectedCover === url || (!selectedCover && idx === 0);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCover(url)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-[#0E7A6B] ring-2 ring-[#0E7A6B]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Cover option ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0E7A6B] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Mobile Guest Preview (5 cols) */}
        <div className="lg:col-span-5 bg-[#F9FAFB] border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-2xs">
          <div className="text-[11px] font-bold text-[#0E7A6B] uppercase tracking-wider mb-2 flex items-center space-x-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>Live Guest Screen Preview</span>
          </div>

          {/* Mock Mobile Screen */}
          <div className="w-full max-w-[240px] bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden text-left">
            {/* Header Cover */}
            <div className="relative aspect-[16/9] bg-slate-900">
              <img
                src={selectedCover || coverOptions[0]}
                alt="Guest cover"
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#5EEAD4] block">KAVA ALBUM</span>
                <h4 className="text-xs font-bold truncate">{displayTitle}</h4>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-3 space-y-2">
              <p className="text-[11px] text-slate-600 leading-snug">
                {welcomeMessage || defaultMsg}
              </p>

              {/* Guest Action Button */}
              <div className="w-full bg-[#0E7A6B] text-white rounded-lg py-2 px-3 flex items-center justify-center space-x-1.5 text-xs font-bold shadow-xs">
                <Camera className="w-3.5 h-3.5" />
                <span>Open Camera & Add Photos</span>
              </div>
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
          id="btn-continue-step-guest-welcome"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
