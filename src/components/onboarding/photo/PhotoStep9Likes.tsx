import React from 'react';
import { ArrowRight, Sparkles, Heart, Flame, Smile } from 'lucide-react';

interface PhotoStep9LikesProps {
  allowLikes: boolean;
  setAllowLikes: (val: boolean) => void;
  showLikeCount: boolean;
  setShowLikeCount: (val: boolean) => void;
  allowReactions?: boolean;
  setAllowReactions?: (val: boolean) => void;
  onNext: () => void;
}

export default function PhotoStep9Likes({
  allowLikes,
  setAllowLikes,
  showLikeCount,
  setShowLikeCount,
  allowReactions = true,
  setAllowReactions,
  onNext,
}: PhotoStep9LikesProps) {
  return (
    <div className="space-y-5 sm:space-y-6 text-left" id="photo-step-9-likes">
      {/* Step Header */}
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-[11px] font-bold tracking-tight mb-0.5">
          <Sparkles className="w-3 h-3 text-[#0E7A6B]" />
          <span>Step 9 • Photo Likes & Reactions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight font-sans">
          Enable guest likes & reactions
        </h2>
        <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed">
          Let your guests double-tap to like their favorite snapshots and send live celebration reactions.
        </p>
      </div>

      {/* Toggles Container */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-2xs">
        {/* Toggle 1: Photo likes */}
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h4 className="text-sm font-bold text-[#0B132B]">Photo Likes</h4>
            </div>
            <p className="text-xs text-[#4B5563]">
              Guests can tap the heart icon on any photo in the album.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAllowLikes(!allowLikes)}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
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
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-[#0B132B]">Show Like Counter</h4>
            </div>
            <p className="text-xs text-[#4B5563]">
              Display the public count of likes on each photo card.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLikeCount(!showLikeCount)}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
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

        {/* Toggle 3: Live Floating Reactions */}
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center space-x-2">
              <Smile className="w-4 h-4 text-[#0E7A6B]" />
              <h4 className="text-sm font-bold text-[#0B132B]">Live Emoji Reactions</h4>
            </div>
            <p className="text-xs text-[#4B5563]">
              Floating celebration emojis (🥂, 🎉, ✨, ❤️) when guests view live photo drops.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAllowReactions && setAllowReactions(!allowReactions)}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              allowReactions ? 'bg-[#0E7A6B]' : 'bg-slate-200'
            }`}
            id="toggle-allow-reactions"
            aria-label="Toggle live emoji reactions"
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                allowReactions ? 'translate-x-6 left-0' : 'translate-x-0.5 left-0'
              }`}
            />
          </button>
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
