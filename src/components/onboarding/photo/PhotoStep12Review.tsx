import React from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Check,
  Edit2,
  ArrowRight,
  Sparkle,
  Camera,
  Layers,
  Clock,
  Eye,
  Lock,
} from 'lucide-react';
import { getPhotoModeContext } from '../../../lib/photoModeContext';

interface PhotoStep12ReviewProps {
  eventType: string;
  eventName: string;
  eventDate?: string;
  eventLocation?: string;
  captureMode?: string;
  frameStyleId: string;
  revealTiming: string;
  selectedCover?: string;
  onEditStep?: (step: number) => void;
  onBack?: () => void;
  onCreateAlbum: () => void;
  isCreating?: boolean;
  appearance?: 'light' | 'dark';
}

export default function PhotoStep12Review({
  eventType,
  eventName,
  eventDate = '2026-06-20',
  eventLocation,
  captureMode = 'both',
  frameStyleId = 'polaroid',
  revealTiming = 'instant_live',
  selectedCover,
  onEditStep,
  onBack,
  onCreateAlbum,
  isCreating = false,
  appearance = 'light',
}: PhotoStep12ReviewProps) {
  const isDark = appearance === 'dark';
  const ctx = getPhotoModeContext(eventType);

  const displayCover =
    selectedCover ||
    ctx.imageUrl ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

  const formatDisplayDate = (dString: string) => {
    if (!dString) return '20 June 2026';
    try {
      const parts = dString.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${day} ${months[monthIndex] || 'June'} ${year}`;
      }
      return dString;
    } catch {
      return dString;
    }
  };

  const getCaptureLabel = (mode: string) => {
    if (mode === 'upload_only') return 'Guest Upload';
    if (mode === 'camera_only') return 'Camera Capture';
    return 'Guest Upload + Camera';
  };

  const getFrameLabel = (id: string) => {
    if (id === 'polaroid') return 'Polaroid Frame';
    if (id === 'minimal') return 'Minimal Frame';
    if (id === 'floral') return 'Floral Frame';
    if (id === 'classic') return 'Classic Frame';
    if (id === 'custom') return 'Vintage Frame';
    return 'No Frame';
  };

  const getRevealLabel = (timing: string) => {
    if (timing === 'time_capsule_midnight') return 'After Event';
    if (timing === 'custom_reveal') return 'Scheduled Reveal';
    return 'Live Reveal';
  };

  const displayName = eventName || ctx.defaultName || 'Maya’s 30th Birthday';

  return (
    <div className="space-y-6 text-left" id="photo-step-7-review">
      {/* Context Label & Headline */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] dark:bg-[#0E7A6B]/20 border border-[#99F6E4] dark:border-[#0E7A6B]/40 text-[#0E7A6B] dark:text-[#5EEAD4] text-[11px] font-bold tracking-tight mb-1">
          <Sparkles className="w-3 h-3" />
          <span>REVIEW & LAUNCH</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B132B] dark:text-white font-sans">
          Review & launch your <span className="text-[#0E7A6B] dark:text-[#5EEAD4]">photo album</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Almost there! Review your settings and launch your album.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Summary Checklist with direct Edit triggers */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Header Card with Event Title and Date */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B132B] dark:text-white leading-tight">
                  {displayName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatDisplayDate(eventDate)} {eventLocation ? `• ${eventLocation}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEditStep && onEditStep(3)}
                className="text-xs font-semibold text-[#0E7A6B] dark:text-[#5EEAD4] hover:underline flex items-center space-x-1 cursor-pointer p-1"
                id="btn-edit-step-3"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Section 1: Occasion */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-[#E6FFFA] dark:bg-[#0E7A6B]/30 text-[#0E7A6B] dark:text-[#5EEAD4] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0B132B] dark:text-white">
                {eventType || 'Wedding'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep && onEditStep(2)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0E7A6B] dark:hover:text-[#5EEAD4] flex items-center space-x-1 cursor-pointer p-1"
              id="btn-edit-step-2"
            >
              <span>Edit</span>
            </button>
          </div>

          {/* Section 2: Capture Mode */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-[#E6FFFA] dark:bg-[#0E7A6B]/30 text-[#0E7A6B] dark:text-[#5EEAD4] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0B132B] dark:text-white">
                {getCaptureLabel(captureMode)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep && onEditStep(4)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0E7A6B] dark:hover:text-[#5EEAD4] flex items-center space-x-1 cursor-pointer p-1"
              id="btn-edit-step-4"
            >
              <span>Edit</span>
            </button>
          </div>

          {/* Section 3: Frame Style */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-[#E6FFFA] dark:bg-[#0E7A6B]/30 text-[#0E7A6B] dark:text-[#5EEAD4] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0B132B] dark:text-white">
                {getFrameLabel(frameStyleId)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep && onEditStep(5)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0E7A6B] dark:hover:text-[#5EEAD4] flex items-center space-x-1 cursor-pointer p-1"
              id="btn-edit-step-5"
            >
              <span>Edit</span>
            </button>
          </div>

          {/* Section 4: Reveal Timing */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-[#E6FFFA] dark:bg-[#0E7A6B]/30 text-[#0E7A6B] dark:text-[#5EEAD4] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0B132B] dark:text-white">
                {getRevealLabel(revealTiming)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep && onEditStep(6)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0E7A6B] dark:hover:text-[#5EEAD4] flex items-center space-x-1 cursor-pointer p-1"
              id="btn-edit-step-6"
            >
              <span>Edit</span>
            </button>
          </div>

        </div>

        {/* Right Column: Album Live Preview */}
        <div className="lg:col-span-5">
          <div className="space-y-1.5 mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkle className="w-3 h-3 text-[#0E7A6B] dark:text-[#5EEAD4]" />
              <span>ALBUM PREVIEW</span>
            </span>
          </div>

          <div
            className={`rounded-2xl border p-4 shadow-md transition-all ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-900">
              <img
                src={displayCover}
                alt={displayName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#0E7A6B] text-[10px] font-bold">
                {eventType}
              </div>

              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <p className="text-[10px] opacity-80">{formatDisplayDate(eventDate)}</p>
                <h4 className="text-sm font-bold truncate leading-tight drop-shadow-xs">
                  {displayName}
                </h4>
              </div>
            </div>

            <div className="space-y-1 text-center py-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Ready for guest QR drops & instant sharing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="pt-3 space-y-2">
        <button
          type="button"
          onClick={onCreateAlbum}
          disabled={isCreating}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-base py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#0E7A6B]/25 cursor-pointer disabled:opacity-70 min-h-[54px]"
          id="btn-launch-photo-album"
        >
          <span>{isCreating ? 'Launching Album...' : 'Launch Photo Album ✨'}</span>
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            id="btn-review-back"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
