import React from 'react';
import { Camera, Check, Plus, Trash2, Calendar, MapPin, Sparkles, MessageSquare, Mic, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';
import { COVER_PRESETS } from '../../data';
import { getEventContext } from '../../lib/onboardingContext';

interface Step3CoverProps {
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
  eventType?: string;
  selectedCover: string;
  setSelectedCover: (url: string) => void;
  customCoverUrl: string;
  setCustomCoverUrl: (url: string) => void;
  uploadedCoverUrl: string;
  setUploadedCoverUrl: (url: string) => void;
  onboardingCoverPositionY: number;
  setOnboardingCoverPositionY: (y: number) => void;
  appearance?: 'light' | 'dark';
}

export default function Step3Cover({
  eventName = '',
  eventDate = '2026-06-20',
  eventLocation = '',
  eventType = 'Wedding',
  selectedCover,
  setSelectedCover,
  customCoverUrl,
  setCustomCoverUrl,
  uploadedCoverUrl,
  setUploadedCoverUrl,
  onboardingCoverPositionY,
  setOnboardingCoverPositionY,
  appearance = 'light',
}: Step3CoverProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';
  const ctx = getEventContext(eventType);

  const coverPreview = customCoverUrl.trim() || uploadedCoverUrl || selectedCover || ctx.recommendedCovers[0] || COVER_PRESETS[0];

  const handleCoverUploadLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        if (re.target?.result) {
          setUploadedCoverUrl(re.target.result as string);
          setSelectedCover('');
          setCustomCoverUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setSelectedCover('');
    setCustomCoverUrl('');
    setUploadedCoverUrl('');
  };

  const displayTitle = eventName.trim() || ctx.defaultTitle;
  const displayLocation = eventLocation.trim() || ctx.placeholderLocation.replace('e.g. ', '');

  const formattedDate = React.useMemo(() => {
    if (!eventDate) return 'Jun 20, 2026';
    try {
      const [year, month, day] = eventDate.split('-').map(Number);
      if (year && month && day) {
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return eventDate;
  }, [eventDate]);

  return (
    <div className="space-y-6 text-left" id="step-3-cover-content">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3 py-1 rounded-full inline-block">
            {t('onboarding.step3_tag', 'Step 3 • Capsule Cover')}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${ctx.badgeBg} ${ctx.badgeText} ${ctx.badgeBorder}`}>
            {ctx.badgeTag}
          </span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
          {t('onboarding.step3_title', 'Select capsule cover image')}
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {ctx.step3Subtitle}
        </p>
      </div>

      {/* REAL GUEST-PAGE PREVIEW CONTAINER */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00A88F] flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('onboarding.cover_live_preview', 'Real Guest Invitation Preview')}</span>
          </label>
          {coverPreview && (
            <button
              type="button"
              onClick={handleRemoveCover}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('onboarding.cover_reset', 'Reset Cover')}</span>
            </button>
          )}
        </div>

        {/* Guest Room Preview Card */}
        <div
          className={`rounded-[24px] border overflow-hidden transition-all duration-300 shadow-sm ${
            isDark
              ? 'bg-[#0E162B] border-slate-800'
              : 'bg-white border-slate-200/90'
          }`}
        >
          {/* Cover Header Banner */}
          <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full overflow-hidden bg-slate-900">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Capsule cover"
                className="w-full h-full object-cover transition-all duration-150"
                style={{ objectPosition: `center ${onboardingCoverPositionY}%` }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                <Camera className="w-8 h-8 opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Event Badge Tag */}
            <div className="absolute top-3 left-3">
              <span className="bg-[#00A88F] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-xs">
                {ctx.badgeTag}
              </span>
            </div>

            {/* Reposition Y badge indicator */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/20">
              Y: {onboardingCoverPositionY}%
            </div>

            {/* Overlaid Title on Cover */}
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <h3 className="text-lg sm:text-xl font-extrabold leading-tight drop-shadow-md">
                {displayTitle}
              </h3>
            </div>
          </div>

          {/* Guest Page Details & Interactive Action Mockup */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Date & Location Info Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#00A88F]" />
                <span>{formattedDate}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center space-x-1.5 font-medium truncate max-w-[220px]">
                <MapPin className="w-3.5 h-3.5 text-[#00A88F]" />
                <span className="truncate">{displayLocation}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Hosted by You
              </span>
            </div>

            {/* Action Bar Preview */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                Guest Interactive Controls Preview
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <ImageIcon className="w-4 h-4 mx-auto text-[#00A88F] mb-1" />
                  <span className="text-[11px] font-bold block text-[#0B132B] dark:text-slate-200">Upload Photo</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <Mic className="w-4 h-4 mx-auto text-[#00A88F] mb-1" />
                  <span className="text-[11px] font-bold block text-[#0B132B] dark:text-slate-200">Record Toast</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <MessageSquare className="w-4 h-4 mx-auto text-[#00A88F] mb-1" />
                  <span className="text-[11px] font-bold block text-[#0B132B] dark:text-slate-200">Leave Wish</span>
                </div>
              </div>
            </div>

            {/* Live Activity Stream Mockup */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Live Memory Feed Preview ({ctx.name})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ctx.sampleGuests.map((sample, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start space-x-2.5 text-xs"
                  >
                    <img
                      src={sample.avatar}
                      alt={sample.author}
                      className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-[#00A88F]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B132B] dark:text-slate-200 text-[11px] truncate">{sample.author}</span>
                        <span className="text-[9px] font-mono text-slate-400">{sample.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{sample.message}</p>
                      {sample.photoUrl && (
                        <div className="mt-1.5 rounded-lg overflow-hidden h-16 w-full bg-slate-200">
                          <img src={sample.photoUrl} alt="Sample contribution" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REPOSITION VERTICAL SLIDER */}
      <div
        className={`p-4 rounded-2xl border space-y-2 ${
          isDark
            ? 'bg-[#17223D] border-slate-800'
            : 'bg-slate-50/80 border-slate-200/90'
        }`}
      >
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {t('onboarding.cover_reposition_label', 'Reposition Image Frame (Vertical Y-Offset)')}
          </label>
          <span className="text-xs font-bold font-mono text-[#00A88F] bg-[#00A88F]/10 px-2 py-0.5 rounded-md">
            {onboardingCoverPositionY}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={onboardingCoverPositionY}
          onChange={(e) => setOnboardingCoverPositionY(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#00A88F] bg-slate-200 dark:bg-slate-700"
          id="slider-cover-position-y"
        />
        <p className="text-[10px] text-slate-400 font-normal">
          {t('onboarding.cover_reposition_subtext', 'Drag to adjust the crop center for mobile & desktop screens.')}
        </p>
      </div>

      {/* PRESETS GRID */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
          {t('onboarding.cover_preset_label', 'Select Recommended Preset Cover')}
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ctx.recommendedCovers.concat(COVER_PRESETS.filter(p => !ctx.recommendedCovers.includes(p))).slice(0, 6).map((preset, index) => {
            const isPresetActive = selectedCover === preset && !customCoverUrl && !uploadedCoverUrl;
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSelectedCover(preset);
                  setCustomCoverUrl('');
                  setUploadedCoverUrl('');
                }}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isPresetActive
                    ? 'border-[#00A88F] scale-[0.98] shadow-sm ring-2 ring-[#00A88F]/30'
                    : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                }`}
                id={`btn-cover-preset-${index}`}
              >
                <img
                  src={preset}
                  alt={t('onboarding.preset_alt', 'Preset {index}', { index })}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isPresetActive && (
                  <div className="absolute inset-0 bg-[#00A88F]/40 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 text-[#00A88F] stroke-[3]" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CUSTOM URL & FILE UPLOAD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* Custom URL Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
            {t('onboarding.cover_url_label', 'Or paste custom image URL')}
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={customCoverUrl}
            onChange={(e) => {
              setCustomCoverUrl(e.target.value);
              setSelectedCover('');
              setUploadedCoverUrl('');
            }}
            className={`w-full rounded-2xl px-4 py-3 text-xs font-mono focus:outline-none transition-all ${
              isDark
                ? 'bg-[#17223D] border border-slate-800 focus:border-[#00A88F] text-white placeholder:text-slate-600'
                : 'bg-slate-50/80 border border-slate-200/90 focus:border-[#00A88F] text-[#0B132B] placeholder:text-slate-400'
            }`}
            id="input-onboarding-custom-cover"
          />
        </div>

        {/* Local File Upload */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
            {t('onboarding.cover_file_label', 'Or upload image file')}
          </label>
          <div
            className={`relative w-full h-[42px] border rounded-2xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'bg-[#17223D] hover:bg-slate-800 border-slate-800 text-slate-300'
                : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200/90 text-[#0B132B]'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUploadLocal}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#00A88F]" />
              <span>{uploadedCoverUrl ? t('onboarding.cover_file_replace', 'Replace Local File') : t('onboarding.cover_file_choose', 'Choose Cover File')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
