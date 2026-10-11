import React, { useState } from 'react';
import { 
  Camera, 
  Tv, 
  Mic, 
  Heart, 
  Layers, 
  Sliders, 
  HardDrive, 
  Download, 
  Sparkles, 
  Check, 
  Image as ImageIcon,
  ShieldCheck,
  Eye,
  Settings2,
  RefreshCw,
  Sun,
  Palette,
  Maximize2
} from 'lucide-react';
import { ContributionType, ExperienceMode } from '../../types';
import { useTranslation } from '../../lib/useTranslation';
import { PHOTO_FILTER_PRESETS } from '../../lib/photoProcessing';
import { getEventContext } from '../../lib/onboardingContext';

interface Step6FormatsProps {
  experienceMode: ExperienceMode;
  eventName: string;
  allowedTypes: ContributionType[];
  toggleType: (type: ContributionType) => void;
  onboardingPhotoLimit: number;
  setOnboardingPhotoLimit: (val: number) => void;
  onboardingVideoLimit: number;
  setOnboardingVideoLimit: (val: number) => void;
  onboardingVoiceLimit: number;
  setOnboardingVoiceLimit: (val: number) => void;
  onboardingWishLimit: number;
  setOnboardingWishLimit: (val: number) => void;
  photoWatermarkEnabled: boolean;
  setPhotoWatermarkEnabled: (val: boolean) => void;
  photoWatermarkText: string;
  setPhotoWatermarkText: (val: string) => void;
  photoWatermarkUrl?: string;
  setPhotoWatermarkUrl?: (url: string) => void;
  photoWatermarkPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  setPhotoWatermarkPosition: (pos: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center') => void;
  photoWatermarkOpacity: number;
  setPhotoWatermarkOpacity: (val: number) => void;
  photoWatermarkSize?: number;
  setPhotoWatermarkSize?: (val: number) => void;
  photoFilter: string;
  setPhotoFilter: (filter: string) => void;
  photoFrameStyle?: string;
  setPhotoFrameStyle?: (style: string) => void;
  cameraCaptureMode?: 'both' | 'camera_only' | 'upload_only' | 'burst';
  setCameraCaptureMode?: (mode: 'both' | 'camera_only' | 'upload_only' | 'burst') => void;
  photoQualityMode?: 'original_lossless' | 'smart_web_optimized' | 'ultra_hd';
  setPhotoQualityMode?: (mode: 'original_lossless' | 'smart_web_optimized' | 'ultra_hd') => void;
  downloadOriginalQuality: boolean;
  setDownloadOriginalQuality: (val: boolean) => void;
  allowGuestDownloads: boolean;
  setAllowGuestDownloads: (val: boolean) => void;
  applyWatermarkToDownloads?: boolean;
  setApplyWatermarkToDownloads?: (val: boolean) => void;
  guestDownloadScope: 'all' | 'own';
  setGuestDownloadScope: (scope: 'all' | 'own') => void;
  maxPhotoSizeMB: number;
  setMaxPhotoSizeMB: (size: number) => void;
  requireApproval: boolean;
  setRequireApproval: (val: boolean) => void;
  onboardingGuestVisibility?: 'all' | 'own' | 'none';
  setOnboardingGuestVisibility?: (vis: 'all' | 'own' | 'none') => void;
  eventType?: string;
  appearance?: 'light' | 'dark';
}

const SAMPLE_PREVIEW_PHOTOS = [
  {
    id: 'sample1',
    label: 'Ceremony / Party',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample2',
    label: 'Celebration Toast',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample3',
    label: 'Intimate Gathering',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
  },
];

const FRAME_PRESETS = [
  { id: 'none', label: 'Clean / Borderless', desc: 'Edge-to-edge photograph', icon: '🖼️' },
  { id: 'polaroid', label: 'Classic Polaroid', desc: 'White border with bottom caption strip', icon: '📸' },
  { id: 'gold_luxury', label: 'Gold Elegance', desc: 'Champagne foil gilded rim', icon: '✨' },
  { id: 'filmstrip', label: '35mm Filmstrip', desc: 'Vintage perforated edge', icon: '🎞️' },
  { id: 'festive', label: 'Festive Garland', desc: 'Subtle celebration confetti rim', icon: '🎉' },
];

export default function Step6Formats({
  experienceMode,
  eventName,
  allowedTypes,
  toggleType,
  onboardingPhotoLimit,
  setOnboardingPhotoLimit,
  onboardingVideoLimit,
  setOnboardingVideoLimit,
  onboardingVoiceLimit,
  setOnboardingVoiceLimit,
  onboardingWishLimit,
  setOnboardingWishLimit,
  photoWatermarkEnabled,
  setPhotoWatermarkEnabled,
  photoWatermarkText,
  setPhotoWatermarkText,
  photoWatermarkUrl = '',
  setPhotoWatermarkUrl,
  photoWatermarkPosition,
  setPhotoWatermarkPosition,
  photoWatermarkOpacity,
  setPhotoWatermarkOpacity,
  photoWatermarkSize = 18,
  setPhotoWatermarkSize,
  photoFilter,
  setPhotoFilter,
  photoFrameStyle = 'none',
  setPhotoFrameStyle,
  cameraCaptureMode = 'both',
  setCameraCaptureMode,
  photoQualityMode = 'original_lossless',
  setPhotoQualityMode,
  downloadOriginalQuality,
  setDownloadOriginalQuality,
  allowGuestDownloads,
  setAllowGuestDownloads,
  applyWatermarkToDownloads = true,
  setApplyWatermarkToDownloads,
  guestDownloadScope,
  setGuestDownloadScope,
  maxPhotoSizeMB,
  setMaxPhotoSizeMB,
  requireApproval,
  setRequireApproval,
  onboardingGuestVisibility = 'all',
  setOnboardingGuestVisibility,
  eventType = 'Wedding',
  appearance = 'light',
}: Step6FormatsProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';
  const ctx = getEventContext(eventType);

  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const samplePhoto = SAMPLE_PREVIEW_PHOTOS[activeSampleIndex];

  // Active filter CSS style for live preview
  const activePreset = PHOTO_FILTER_PRESETS.find(p => p.id === photoFilter) || PHOTO_FILTER_PRESETS[0];

  // Helper for watermark positioning in preview
  const getWatermarkPositionClasses = (pos: string) => {
    switch (pos) {
      case 'bottom-left': return 'bottom-4 left-4 text-left';
      case 'top-right': return 'top-4 right-4 text-right';
      case 'top-left': return 'top-4 left-4 text-left';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center';
      case 'bottom-right':
      default: return 'bottom-4 right-4 text-right';
    }
  };

  // Helper for frame styling in preview
  const getFrameContainerClasses = (frame: string) => {
    switch (frame) {
      case 'polaroid':
        return 'p-3 pb-9 bg-white shadow-2xl rounded-sm text-slate-900 border border-slate-200';
      case 'gold_luxury':
        return 'p-3 bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 shadow-xl rounded-xl border border-amber-300';
      case 'filmstrip':
        return 'p-3 bg-slate-950 shadow-2xl rounded-md border-x-4 border-dashed border-white/40';
      case 'festive':
        return 'p-2.5 bg-gradient-to-r from-rose-400 via-purple-400 to-amber-300 shadow-xl rounded-2xl';
      case 'none':
      default:
        return 'rounded-2xl overflow-hidden shadow-md';
    }
  };

  // =========================================================================
  // VIEW 1: PHOTO COLLECTION MODE (Dedicated Photography-First Branding Studio)
  // =========================================================================
  if (experienceMode === 'photo_collection') {
    return (
      <div className="space-y-7 text-left animate-fade-in" id="step-6-photo-studio-content">
        {/* Header with context badge */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Camera className="w-3 h-3 text-[#00A88F]" />
              <span>Step 6 • Photo Studio & Branding</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${ctx.badgeBg} ${ctx.badgeText} ${ctx.badgeBorder}`}>
              {ctx.name} Photography
            </span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-[#0B132B]'
            }`}
          >
            {t('onboarding.step6_photo_title', 'Photo Branding & Capture Studio')}
          </h2>
          <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('onboarding.step6_photo_desc', 'Configure live photo watermarks, frames, color filters, camera modes, and download permissions.')}
          </p>
        </div>

        {/* 1. INTERACTIVE LIVE PHOTO BRANDING PREVIEW */}
        <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-[24px] border space-y-3 ${
          isDark ? 'bg-[#17223D]/80 border-slate-800' : 'bg-slate-50/90 border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#00A88F]" />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                Live Photo Result Preview
              </span>
            </div>
            {/* Sample Photo Switcher */}
            <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {SAMPLE_PREVIEW_PHOTOS.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSampleIndex(idx)}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    activeSampleIndex === idx 
                      ? 'bg-[#00A88F] text-white shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                  title={s.label}
                >
                  Sample {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Render Canvas */}
          <div className="relative flex items-center justify-center p-3 sm:p-5 bg-slate-900/90 rounded-2xl overflow-hidden min-h-[260px] sm:min-h-[300px]">
            <div className={`relative max-w-sm w-full transition-all duration-300 ${getFrameContainerClasses(photoFrameStyle)}`}>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40">
                <img
                  src={samplePhoto.url}
                  alt="Sample event preview"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: activePreset.cssFilter }}
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Event Watermark / Logo */}
                {photoWatermarkEnabled && (
                  <div
                    className={`absolute z-10 pointer-events-none transition-all duration-200 ${getWatermarkPositionClasses(photoWatermarkPosition)}`}
                    style={{ opacity: (photoWatermarkOpacity || 65) / 100 }}
                  >
                    {photoWatermarkUrl ? (
                      <img 
                        src={photoWatermarkUrl} 
                        alt="Watermark Logo" 
                        className="max-h-8 object-contain drop-shadow-md inline-block"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 text-white font-mono text-[11px] font-bold tracking-wider shadow-lg flex items-center space-x-1.5">
                        <Camera className="w-3 h-3 text-emerald-400" />
                        <span>{photoWatermarkText || eventName || 'KAVA Photo Collection'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Polaroid Frame Caption Label */}
              {photoFrameStyle === 'polaroid' && (
                <div className="pt-2 text-center">
                  <p className="font-serif italic text-xs font-semibold text-slate-800 truncate px-2">
                    {photoWatermarkText || eventName || 'Unforgettable Memories'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono pt-1 px-1">
            <span>Filter: <strong className="text-[#00A88F]">{activePreset.name}</strong></span>
            <span>Frame: <strong className="text-slate-700 dark:text-slate-300 capitalize">{photoFrameStyle.replace('_', ' ')}</strong></span>
            <span>Watermark: <strong className={photoWatermarkEnabled ? "text-emerald-600" : "text-slate-400"}>{photoWatermarkEnabled ? 'Active' : 'Off'}</strong></span>
          </div>
        </div>

        {/* 2. PHOTO FRAME SELECTION */}
        <div className="space-y-2.5">
          <label className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
            Visual Photo Frame
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {FRAME_PRESETS.map((f) => {
              const isSelected = photoFrameStyle === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPhotoFrameStyle && setPhotoFrameStyle(f.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#00A88F] bg-[#00A88F]/10 shadow-2xs ring-1 ring-[#00A88F]/40'
                      : isDark
                      ? 'border-slate-800 bg-[#17223D]/50 hover:border-slate-700'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{f.icon}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#00A88F] stroke-[3]" />}
                  </div>
                  <div className="mt-2">
                    <p className={`text-[11px] font-bold leading-tight ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                      {f.label}
                    </p>
                    <p className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{f.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. EVENT WATERMARK & LOGO EDITOR */}
        <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-[22px] border space-y-4 ${
          isDark ? 'bg-[#17223D]/50 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                Event Watermark & Brand Overlay
              </h4>
              <p className="text-[11px] text-slate-500">
                Imprint your celebration name or logo onto photos automatically
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPhotoWatermarkEnabled(!photoWatermarkEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                photoWatermarkEnabled ? 'bg-[#00A88F]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              id="btn-toggle-watermark"
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                photoWatermarkEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {photoWatermarkEnabled && (
            <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
              {/* Watermark Text Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Watermark Text
                </label>
                <input
                  type="text"
                  placeholder={eventName || "e.g., Sofia & Leo's Wedding"}
                  value={photoWatermarkText}
                  onChange={(e) => setPhotoWatermarkText(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white focus:border-[#00A88F]'
                      : 'bg-slate-50 border border-slate-200 text-[#0B132B] focus:border-[#00A88F]'
                  }`}
                  id="input-watermark-text"
                />
              </div>

              {/* Watermark Position Segmented Buttons */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Watermark Position
                </label>
                <div className="grid grid-cols-5 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['bottom-right', 'bottom-left', 'top-right', 'top-left', 'center'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setPhotoWatermarkPosition(pos)}
                      className={`py-1.5 text-center text-[10px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                        photoWatermarkPosition === pos
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark Opacity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span>Watermark Opacity</span>
                  <span className="font-mono text-[#00A88F]">{photoWatermarkOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={photoWatermarkOpacity}
                  onChange={(e) => setPhotoWatermarkOpacity(parseInt(e.target.value))}
                  className="w-full accent-[#00A88F] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. PHOTO FILTER PRESETS */}
        <div className="space-y-2.5">
          <label className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
            Photo Color Filter Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PHOTO_FILTER_PRESETS.map((filter) => {
              const isSelected = photoFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setPhotoFilter(filter.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#00A88F] bg-[#00A88F]/10 shadow-2xs ring-1 ring-[#00A88F]/40'
                      : isDark
                      ? 'border-slate-800 bg-[#17223D]/50 hover:border-slate-700'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                  id={`btn-photo-filter-${filter.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {filter.tag}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#00A88F] stroke-[3]" />}
                  </div>
                  <div className="mt-2">
                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                      {filter.name}
                    </p>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{filter.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. CAMERA CAPTURE MODE & UPLOAD LIMITS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Camera Capture Mode */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-[#17223D]/50 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            <label className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
              Camera Capture Mode
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'both', label: 'Camera & Gallery Upload' },
                { id: 'camera_only', label: 'Instant Live Camera Only' },
                { id: 'upload_only', label: 'Photo Library Only' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCameraCaptureMode && setCameraCaptureMode(m.id as any)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                    cameraCaptureMode === m.id
                      ? 'bg-[#00A88F]/15 text-[#00A88F] border border-[#00A88F]/30 font-bold'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800/80'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{m.label}</span>
                  {cameraCaptureMode === m.id && <Check className="w-3.5 h-3.5 text-[#00A88F]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Limit & Quality */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-[#17223D]/50 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            <label className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
              Photo Upload Limit per Guest
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                placeholder="Unlimited (0)"
                value={onboardingPhotoLimit || ''}
                onChange={(e) => setOnboardingPhotoLimit(parseInt(e.target.value) || 0)}
                className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none ${
                  isDark
                    ? 'bg-slate-800 border border-slate-700 text-white focus:border-[#00A88F]'
                    : 'bg-slate-50 border border-slate-200 text-[#0B132B] focus:border-[#00A88F]'
                }`}
              />
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {onboardingPhotoLimit === 0 ? 'Unlimited' : `${onboardingPhotoLimit} max`}
              </span>
            </div>

            {/* Max File Size */}
            <div className="pt-1 space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Max File Size</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {[10, 25, 50].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setMaxPhotoSizeMB(size)}
                    className={`py-1 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      maxPhotoSizeMB === size
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {size} MB
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. GUEST DOWNLOADS & PRIVACY SETTINGS */}
        <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-[22px] border space-y-3.5 ${
          isDark ? 'bg-[#17223D]/50 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <h4 className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
            Guest Download & Moderation Rules
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Allow Guest Downloads */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
              <div className="pr-2 space-y-0.5">
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>Guest Downloads</p>
                <p className="text-[10px] text-slate-500">Allow guests to download photos</p>
              </div>
              <button
                type="button"
                onClick={() => setAllowGuestDownloads(!allowGuestDownloads)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowGuestDownloads ? 'bg-[#00A88F]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  allowGuestDownloads ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Moderation Requirement */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
              <div className="pr-2 space-y-0.5">
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>Host Approval</p>
                <p className="text-[10px] text-slate-500">Require review before publishing</p>
              </div>
              <button
                type="button"
                onClick={() => setRequireApproval(!requireApproval)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  requireApproval ? 'bg-[#00A88F]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  requireApproval ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL MEMORY CAPSULE MODE (Complete 4-Modality KAVA Experience)
  // =========================================================================
  return (
    <div className="space-y-6 text-left animate-fade-in" id="step-6-formats-content">
      {/* Header with context badge */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#00A88F]" />
            <span>Step 6 • Memory Modalities & Rules</span>
          </span>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${ctx.badgeBg} ${ctx.badgeText} ${ctx.badgeBorder}`}>
            {ctx.badgeTag}
          </span>
        </div>
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#0B132B]'
          }`}
        >
          {t('onboarding.step6_title', 'Memory Capsule Contribution Formats')}
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('onboarding.step6_desc', 'Enable up to 4 interactive contribution types for {event}. Set optional per-guest limit caps (0 = unlimited).', { event: ctx.name })}
        </p>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Photo */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => toggleType('photo')}
            className={`p-4.5 rounded-[22px] text-left border transition-all flex flex-col justify-between h-32 w-full cursor-pointer ${
              allowedTypes.includes('photo')
                ? 'border-[#00A88F] bg-[#00A88F]/10 shadow-2xs ring-1 ring-[#00A88F]/30'
                : isDark
                ? 'border-slate-800 opacity-50 bg-[#17223D]/30'
                : 'border-slate-200/90 opacity-60 bg-white'
            }`}
            id="btn-allow-photos"
          >
            <div className="flex justify-between items-center w-full">
              <Camera className={`w-5 h-5 ${allowedTypes.includes('photo') ? 'text-[#00A88F]' : 'text-slate-400'}`} />
              {allowedTypes.includes('photo') && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00A88F] text-white">
                  Enabled
                </span>
              )}
            </div>
            <div className="text-left mt-2">
              <h4 className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                {t('onboarding.fmt_photos_title', 'Photos & Live Captures')}
              </h4>
              <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                {t('onboarding.fmt_photos_subtext', 'JPEG, PNG, HEIC formats with live stream projection')}
              </p>
            </div>
          </button>
          {allowedTypes.includes('photo') && (
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-2xl text-xs font-semibold border ${
                isDark ? 'bg-[#17223D]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200/90'
              }`}
            >
              <span className="text-[11px] text-slate-500 font-mono font-bold">{t('onboarding.limit_per_guest', 'Limit / guest')}</span>
              <input
                type="number"
                min="0"
                placeholder={t('onboarding.limit_unlimited', 'Unlimited')}
                value={onboardingPhotoLimit || ''}
                onChange={(e) => setOnboardingPhotoLimit(parseInt(e.target.value) || 0)}
                className={`rounded-xl px-2.5 py-1 text-center text-xs font-bold w-20 focus:outline-none ${
                  isDark
                    ? 'bg-[#17223D] border border-slate-700 text-white'
                    : 'bg-white border border-slate-200 text-[#0B132B] focus:border-[#00A88F]'
                }`}
              />
            </div>
          )}
        </div>

        {/* Video */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => toggleType('video')}
            className={`p-4.5 rounded-[22px] text-left border transition-all flex flex-col justify-between h-32 w-full cursor-pointer ${
              allowedTypes.includes('video')
                ? 'border-[#00A88F] bg-[#00A88F]/10 shadow-2xs ring-1 ring-[#00A88F]/30'
                : isDark
                ? 'border-slate-800 opacity-50 bg-[#17223D]/30'
                : 'border-slate-200/90 opacity-60 bg-white'
            }`}
            id="btn-allow-videos"
          >
            <div className="flex justify-between items-center w-full">
              <Tv className={`w-5 h-5 ${allowedTypes.includes('video') ? 'text-[#00A88F]' : 'text-slate-400'}`} />
              {allowedTypes.includes('video') && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00A88F] text-white">
                  Enabled
                </span>
              )}
            </div>
            <div className="text-left mt-2">
              <h4 className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                {t('onboarding.fmt_videos_title', 'Video Greetings & Toasts')}
              </h4>
              <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                {t('onboarding.fmt_videos_subtext', 'HD video recording directly from guest phone')}
              </p>
            </div>
          </button>
          {allowedTypes.includes('video') && (
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-2xl text-xs font-semibold border ${
                isDark ? 'bg-[#17223D]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200/90'
              }`}
            >
              <span className="text-[11px] text-slate-500 font-mono font-bold">{t('onboarding.limit_per_guest', 'Limit / guest')}</span>
              <input
                type="number"
                min="0"
                placeholder={t('onboarding.limit_unlimited', 'Unlimited')}
                value={onboardingVideoLimit || ''}
                onChange={(e) => setOnboardingVideoLimit(parseInt(e.target.value) || 0)}
                className={`rounded-xl px-2.5 py-1 text-center text-xs font-bold w-20 focus:outline-none ${
                  isDark
                    ? 'bg-[#17223D] border border-slate-700 text-white'
                    : 'bg-white border border-slate-200 text-[#0B132B] focus:border-[#00A88F]'
                }`}
              />
            </div>
          )}
        </div>

        {/* Voice */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => toggleType('voice')}
            className={`p-4.5 rounded-[22px] text-left border transition-all flex flex-col justify-between h-32 w-full cursor-pointer ${
              allowedTypes.includes('voice')
                ? 'border-[#00A88F] bg-[#00A88F]/10 shadow-2xs ring-1 ring-[#00A88F]/30'
                : isDark
                ? 'border-slate-800 opacity-50 bg-[#17223D]/30'
                : 'border-slate-200/90 opacity-60 bg-white'
            }`}
            id="btn-allow-voice"
          >
            <div className="flex justify-between items-center w-full">
              <Mic className={`w-5 h-5 ${allowedTypes.includes('voice') ? 'text-[#00A88F]' : 'text-slate-400'}`} />
              {allowedTypes.includes('voice') && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00A88F] text-white">
                  Enabled
                </span>
              )}
            </div>
            <div className="text-left mt-2">
              <h4 className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                {t('onboarding.fmt_voice_title', 'Audio Voicemail Guestbook')}
              </h4>
              <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                {t('onboarding.fmt_voice_subtext', 'Record spoken memories with vintage telephone prompts')}
              </p>
            </div>
          </button>
          {allowedTypes.includes('voice') && (
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-2xl text-xs font-semibold border ${
                isDark ? 'bg-[#17223D]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200/90'
              }`}
            >
              <span className="text-[11px] text-slate-500 font-mono font-bold">{t('onboarding.limit_per_guest', 'Limit / guest')}</span>
              <input
                type="number"
                min="0"
                placeholder={t('onboarding.limit_unlimited', 'Unlimited')}
                value={onboardingVoiceLimit || ''}
                onChange={(e) => setOnboardingVoiceLimit(parseInt(e.target.value) || 0)}
                className={`rounded-xl px-2.5 py-1 text-center text-xs font-bold w-20 focus:outline-none ${
                  isDark
                    ? 'bg-[#17223D] border border-slate-700 text-white'
                    : 'bg-white border border-slate-200 text-[#0B132B] focus:border-[#00A88F]'
                }`}
              />
            </div>
          )}
        </div>

        {/* Wish */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => toggleType('wish')}
            className={`p-4.5 rounded-[22px] text-left border transition-all flex flex-col justify-between h-32 w-full cursor-pointer ${
              allowedTypes.includes('wish')
                ? 'border-[#00A88F] bg-[#00A88F]/10 shadow-2xs ring-1 ring-[#00A88F]/30'
                : isDark
                ? 'border-slate-800 opacity-50 bg-[#17223D]/30'
                : 'border-slate-200/90 opacity-60 bg-white'
            }`}
            id="btn-allow-wishes"
          >
            <div className="flex justify-between items-center w-full">
              <Heart className={`w-5 h-5 ${allowedTypes.includes('wish') ? 'text-[#00A88F]' : 'text-slate-400'}`} />
              {allowedTypes.includes('wish') && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00A88F] text-white">
                  Enabled
                </span>
              )}
            </div>
            <div className="text-left mt-2">
              <h4 className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                {t('onboarding.fmt_wishes_title', 'Written Guestbook Wishes')}
              </h4>
              <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                {t('onboarding.fmt_wishes_subtext', 'Text messages, advice & blessings for the hosts')}
              </p>
            </div>
          </button>
          {allowedTypes.includes('wish') && (
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-2xl text-xs font-semibold border ${
                isDark ? 'bg-[#17223D]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200/90'
              }`}
            >
              <span className="text-[11px] text-slate-500 font-mono font-bold">{t('onboarding.limit_per_guest', 'Limit / guest')}</span>
              <input
                type="number"
                min="0"
                placeholder={t('onboarding.limit_unlimited', 'Unlimited')}
                value={onboardingWishLimit || ''}
                onChange={(e) => setOnboardingWishLimit(parseInt(e.target.value) || 0)}
                className={`rounded-xl px-2.5 py-1 text-center text-xs font-bold w-20 focus:outline-none ${
                  isDark
                    ? 'bg-[#17223D] border border-slate-700 text-white'
                    : 'bg-white border border-slate-200 text-[#0B132B] focus:border-[#00A88F]'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Suggested Wishes Helper Card for this Event */}
      <div
        className={`p-4 rounded-[22px] border space-y-2 ${
          isDark ? 'bg-[#17223D]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200/90'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#00A88F]" />
          <p className="text-xs font-bold text-[#0B132B] dark:text-white">
            Suggested Prompts for {ctx.name} Guestbook
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {(ctx.suggestedWishes || [
            "Best wishes for a lifetime of love and happiness!",
            "Thank you for letting us share in your special day!",
            "May your joining together bring you more joy than you can imagine."
          ]).map((wish, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-2xs"
            >
              "{wish}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
