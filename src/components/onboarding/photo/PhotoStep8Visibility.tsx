import React from 'react';
import { ArrowRight, Check, Sparkles, Globe, Key, ShieldCheck, Download } from 'lucide-react';

interface PhotoStep8VisibilityProps {
  visibility: 'everyone_with_link' | 'guests_only' | 'host_curated';
  setVisibility: (val: 'everyone_with_link' | 'guests_only' | 'host_curated') => void;
  allowDownloads: boolean;
  setAllowDownloads: (val: boolean) => void;
  onNext: () => void;
}

export default function PhotoStep8Visibility({
  visibility,
  setVisibility,
  allowDownloads,
  setAllowDownloads,
  onNext,
}: PhotoStep8VisibilityProps) {
  return (
    <div className="space-y-5 sm:space-y-6 text-left" id="photo-step-8-visibility">
      {/* Step Header */}
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-[11px] font-bold tracking-tight mb-0.5">
          <Sparkles className="w-3 h-3 text-[#0E7A6B]" />
          <span>Step 8 • Photo Visibility & Access</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight font-sans">
          Who can see and download photos?
        </h2>
        <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed">
          Control how guests view the shared photo album and manage downloading permissions.
        </p>
      </div>

      {/* Visibility Options */}
      <div className="space-y-3 pt-1">
        {/* Option 1: Everyone with the link (Default & Recommended) */}
        <div
          onClick={() => setVisibility('everyone_with_link')}
          className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start space-x-4 ${
            visibility === 'everyone_with_link'
              ? 'border-[#0E7A6B] bg-[#F0FDF9] shadow-sm ring-2 ring-[#0E7A6B]/15'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="btn-visibility-everyone"
        >
          {visibility === 'everyone_with_link' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#0E7A6B] text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}

          <div className="w-10 h-10 rounded-xl bg-[#E6FFFA] text-[#0E7A6B] flex items-center justify-center shrink-0 border border-[#99F6E4]/80">
            <Globe className="w-5 h-5" />
          </div>

          <div className="space-y-1 pr-6">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0B132B]">
                Everyone with the link
              </h3>
              <span className="text-[10px] font-bold text-[#0E7A6B] bg-white px-2 py-0.5 rounded-full border border-[#99F6E4]">
                Recommended
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Anyone who scans the QR code or receives the album link can view all shared photos.
            </p>
          </div>
        </div>

        {/* Option 2: Passcode Protected */}
        <div
          onClick={() => setVisibility('guests_only')}
          className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start space-x-4 ${
            visibility === 'guests_only'
              ? 'border-[#0E7A6B] bg-[#F0FDF9] shadow-sm ring-2 ring-[#0E7A6B]/15'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="btn-visibility-passcode"
        >
          {visibility === 'guests_only' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#0E7A6B] text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}

          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
            <Key className="w-5 h-5" />
          </div>

          <div className="space-y-1 pr-6">
            <h3 className="text-sm sm:text-base font-bold text-[#0B132B]">
              Passcode Protected
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Only guests who enter a 4-digit event PIN can unlock and view the photos.
            </p>
          </div>
        </div>

        {/* Option 3: Host Curated */}
        <div
          onClick={() => setVisibility('host_curated')}
          className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start space-x-4 ${
            visibility === 'host_curated'
              ? 'border-[#0E7A6B] bg-[#F0FDF9] shadow-sm ring-2 ring-[#0E7A6B]/15'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          id="btn-visibility-curated"
        >
          {visibility === 'host_curated' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#0E7A6B] text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}

          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="space-y-1 pr-6">
            <h3 className="text-sm sm:text-base font-bold text-[#0B132B]">
              Host Curated
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Photos uploaded by guests remain private to the host until you approve and publish them.
            </p>
          </div>
        </div>
      </div>

      {/* Guest Download Permission Toggle */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="space-y-0.5 pr-4">
          <div className="flex items-center space-x-1.5">
            <Download className="w-3.5 h-3.5 text-[#0E7A6B]" />
            <h4 className="text-xs sm:text-sm font-bold text-[#0B132B]">Allow guest downloads</h4>
          </div>
          <p className="text-xs text-[#6B7280]">Guests can save high-resolution original photos to their phones.</p>
        </div>
        <button
          type="button"
          onClick={() => setAllowDownloads(!allowDownloads)}
          className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
            allowDownloads ? 'bg-[#0E7A6B]' : 'bg-slate-200'
          }`}
          id="toggle-allow-downloads"
          aria-label="Toggle guest downloads"
        >
          <div
            className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
              allowDownloads ? 'translate-x-6 left-0' : 'translate-x-0.5 left-0'
            }`}
          />
        </button>
      </div>

      {/* Prominent Continue Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-continue-step-8"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
