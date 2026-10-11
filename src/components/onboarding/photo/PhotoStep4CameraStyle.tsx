import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import KavaCameraVisual from './KavaCameraVisual';

export interface CameraStylePresetItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
}

export const CAMERA_PRESETS: CameraStylePresetItem[] = [
  {
    id: 'original',
    name: 'Original',
    subtitle: 'Natural & Crisp',
    description: 'Clean, true-to-life colors with optimal clarity in any lighting.',
    accentColor: '#64748B',
  },
  {
    id: 'funsaver',
    name: 'Funsaver',
    subtitle: 'Nostalgic Disposable',
    description: 'Golden flash, rich grain, and that iconic 90s disposable vibe.',
    accentColor: '#0E7A6B',
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    subtitle: 'Instant Print',
    description: 'Soft dreamy tones with classic white instant camera borders.',
    accentColor: '#F59E0B',
  },
  {
    id: 'film',
    name: 'Film',
    subtitle: 'Vintage 35mm',
    description: 'Cinematic analog contrast with gentle warmth and soft highlights.',
    accentColor: '#E11D48',
  },
];

interface PhotoStep4CameraStyleProps {
  cameraStyleId?: string;
  setCameraStyleId?: (id: string) => void;
  // Fallbacks for compatibility
  captureMode?: string;
  setCaptureMode?: (mode: any) => void;
  onNext: () => void;
  appearance?: 'light' | 'dark';
}

export default function PhotoStep4CameraStyle({
  cameraStyleId = 'funsaver',
  setCameraStyleId,
  onNext,
  appearance = 'light',
}: PhotoStep4CameraStyleProps) {
  const isDark = appearance === 'dark';
  const selectedStyle = cameraStyleId || 'funsaver';

  const currentPreset =
    CAMERA_PRESETS.find((p) => p.id === selectedStyle) || CAMERA_PRESETS[1];

  const handleSelect = (id: string) => {
    if (setCameraStyleId) {
      setCameraStyleId(id);
    }
  };

  const currentIndex = CAMERA_PRESETS.findIndex((p) => p.id === selectedStyle);

  return (
    <div className="space-y-6 text-left max-w-lg mx-auto" id="photo-step-4-camera-style">
      {/* Step Heading */}
      <div className="space-y-1.5">
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#1F2937]'
          }`}
        >
          Choose your camera style
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#6B7280]'}`}>
          This is the default look for all guests' photos.
        </p>
      </div>

      {/* Big Interactive Camera Preview Card */}
      <div
        className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col items-center text-center ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200/90 shadow-xs'
        }`}
      >
        {/* Render the realistic Camera Graphic */}
        <div className="py-2 transform transition-transform hover:scale-[1.02]">
          <KavaCameraVisual cameraStyleId={selectedStyle} />
        </div>

        {/* Camera Title & Description */}
        <div className="mt-4 space-y-1 max-w-xs">
          <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1F2937]'}`}>
            {currentPreset.name}
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#6B7280]'}`}>
            {currentPreset.description}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          {CAMERA_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset.id)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === (currentIndex >= 0 ? currentIndex : 1)
                  ? 'w-6 bg-[#0E7A6B]'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
              aria-label={`Select ${preset.name}`}
            />
          ))}
        </div>
      </div>

      {/* Horizontal Preset Selectors */}
      <div className="grid grid-cols-4 gap-2">
        {CAMERA_PRESETS.map((preset) => {
          const isSelected = selectedStyle === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset.id)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                isSelected
                  ? 'border-[#0E7A6B] bg-[#F0FDF9] dark:bg-[#0E7A6B]/15 ring-1 ring-[#0E7A6B]/30'
                  : isDark
                  ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              id={`preset-camera-${preset.id}`}
            >
              <span
                className={`text-xs font-bold tracking-tight ${
                  isSelected ? 'text-[#0E7A6B] dark:text-[#5EEAD4]' : isDark ? 'text-white' : 'text-[#1F2937]'
                }`}
              >
                {preset.name}
              </span>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#0E7A6B]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Prominent Teal CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-camera-continue"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
