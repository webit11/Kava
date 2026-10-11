import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface PhotoStep7VisibilityProps {
  allowLikes: boolean;
  setAllowLikes: (val: boolean) => void;
  showLikeCount: boolean;
  setShowLikeCount: (val: boolean) => void;
  visibility: 'everyone_with_link' | 'guests_only';
  setVisibility: (val: 'everyone_with_link' | 'guests_only') => void;
  onNext: () => void;
}

export default function PhotoStep7Visibility({
  allowLikes,
  setAllowLikes,
  showLikeCount,
  setShowLikeCount,
  visibility,
  setVisibility,
  onNext,
}: PhotoStep7VisibilityProps) {
  return (
    <div className="space-y-6 text-left" id="photo-step-7-visibility">
      {/* Step Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight font-sans">
          Likes & visibility
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] font-normal leading-relaxed">
          Control how your guests interact with the photos.
        </p>
      </div>

      {/* Toggles Container */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-2xs">
        {/* Toggle 1: Photo likes */}
        <div className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-[#1F2937]">Photo likes</h4>
            <p className="text-xs text-[#6B7280]">Guests can like photos.</p>
          </div>
          <button
            type="button"
            onClick={() => setAllowLikes(!allowLikes)}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
              allowLikes ? 'bg-[#0E7A6B]' : 'bg-slate-200'
            }`}
            id="toggle-allow-likes"
            aria-label="Toggle photo likes"
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                allowLikes ? 'translate-x-6 left-0' : 'translate-x-0.5 left-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Show like count */}
        <div className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-[#1F2937]">Show like count</h4>
            <p className="text-xs text-[#6B7280]">Display total likes on photos.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowLikeCount(!showLikeCount)}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
              showLikeCount ? 'bg-[#0E7A6B]' : 'bg-slate-200'
            }`}
            id="toggle-show-like-count"
            aria-label="Toggle show like count"
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                showLikeCount ? 'translate-x-6 left-0' : 'translate-x-0.5 left-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Visibility Section */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Who can see photos?
        </label>

        <div className="space-y-2.5">
          {/* Option 1: Everyone with the link */}
          <div
            onClick={() => setVisibility('everyone_with_link')}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start justify-between bg-white ${
              visibility === 'everyone_with_link'
                ? 'border-[#0E7A6B] bg-[#F0FDF9] shadow-2xs ring-1 ring-[#0E7A6B]/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            id="btn-visibility-everyone"
          >
            <div className="space-y-0.5 pr-4">
              <h4 className="text-sm font-bold text-[#1F2937]">
                Everyone with the link
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Anyone with the link can view and enjoy the photos.
              </p>
            </div>

            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              visibility === 'everyone_with_link'
                ? 'bg-[#0E7A6B] text-white'
                : 'border-2 border-slate-300'
            }`}>
              {visibility === 'everyone_with_link' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>

          {/* Option 2: Guests only */}
          <div
            onClick={() => setVisibility('guests_only')}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start justify-between bg-white ${
              visibility === 'guests_only'
                ? 'border-[#0E7A6B] bg-[#F0FDF9] shadow-2xs ring-1 ring-[#0E7A6B]/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            id="btn-visibility-guests-only"
          >
            <div className="space-y-0.5 pr-4">
              <h4 className="text-sm font-bold text-[#1F2937]">
                Guests only
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Only invited guests can view the photos.
              </p>
            </div>

            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              visibility === 'guests_only'
                ? 'bg-[#0E7A6B] text-white'
                : 'border-2 border-slate-300'
            }`}>
              {visibility === 'guests_only' && <Check className="w-3 h-3 stroke-[3]" />}
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
