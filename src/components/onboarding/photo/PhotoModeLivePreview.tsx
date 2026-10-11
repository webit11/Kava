import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { 
  getPhotoModeContext, 
  PHOTO_CAMERA_STYLES, 
  PHOTO_FRAME_STYLES,
  CameraStylePreset,
  PhotoFramePreset 
} from '../../../lib/photoModeContext';

interface PhotoModeLivePreviewProps {
  eventType: string;
  eventName: string;
  eventDate?: string;
  cameraStyleId: string;
  frameStyleId: string;
  frameCaption?: string;
  compact?: boolean;
  appearance?: 'light' | 'dark';
}

export default function PhotoModeLivePreview({
  eventType,
  eventName,
  eventDate = '2026-06-20',
  cameraStyleId,
  frameStyleId,
  frameCaption,
  compact = false,
  appearance = 'light',
}: PhotoModeLivePreviewProps) {
  const isDark = appearance === 'dark';
  const ctx = getPhotoModeContext(eventType);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const selectedCamera = PHOTO_CAMERA_STYLES.find((c) => c.id === cameraStyleId) || PHOTO_CAMERA_STYLES[0];
  const selectedFrame = PHOTO_FRAME_STYLES.find((f) => f.id === frameStyleId) || PHOTO_FRAME_STYLES[0];

  const currentPhoto = ctx.samplePhotos[activePhotoIndex] || ctx.samplePhotos[0];

  // Derive display caption
  const displayCaption = frameCaption?.trim() || eventName?.trim() || ctx.defaultFrameCaption;

  // Format date for vintage stamp: e.g. '26 06 20
  const formattedDateStamp = React.useMemo(() => {
    try {
      if (!eventDate) return "'26 06 20";
      const parts = eventDate.split('-');
      if (parts.length === 3) {
        return `'${parts[0].slice(2)} ${parts[1]} ${parts[2]}`;
      }
      return "'26 06 20";
    } catch {
      return "'26 06 20";
    }
  }, [eventDate]);

  return (
    <div className={`w-full flex flex-col items-center justify-center ${compact ? 'py-1' : 'py-3'}`}>
      {/* Live Preview Card Frame */}
      <div 
        className={`relative w-full max-w-[340px] sm:max-w-[380px] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border transition-all duration-300 ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 shadow-2xl shadow-black/40' 
            : 'bg-white/95 border-slate-200/80 shadow-xl shadow-slate-200/50'
        }`}
      >
        {/* Top Mini Header: Live Camera Simulator indicator */}
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-300">
              Live Album Preview
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {selectedCamera.name}
            </span>
          </div>
        </div>

        {/* The Live Photo Container with dynamic Frame and dynamic Filter */}
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center">
          
          {/* Frame Style: POLAROID */}
          {selectedFrame.id === 'polaroid' && (
            <div className="w-full bg-white p-2.5 sm:p-3.5 pb-6 sm:pb-8 shadow-2xl rounded-sm transition-all duration-300">
              <div className="relative w-full aspect-square overflow-hidden bg-slate-900 rounded-[2px]">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.alt}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{ filter: selectedCamera.cssFilter }}
                  referrerPolicy="no-referrer"
                />
                {/* Subtle analog grain effect */}
                {selectedCamera.grainIntensity ? (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)',
                      backgroundSize: '3px 3px'
                    }}
                  />
                ) : null}
              </div>
              {/* Polaroid Bottom Note */}
              <div className="pt-2 sm:pt-3 text-center">
                <p className="font-serif text-xs sm:text-sm font-semibold tracking-wide text-slate-800 truncate px-2">
                  {displayCaption}
                </p>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                  KAVA SNAP • {eventDate.slice(0, 4)}
                </p>
              </div>
            </div>
          )}

          {/* Frame Style: 35MM FILMSTRIP */}
          {selectedFrame.id === 'filmstrip_35mm' && (
            <div className="w-full bg-zinc-950 p-2 sm:p-3 border-y-4 sm:border-y-[6px] border-zinc-900 shadow-2xl transition-all duration-300">
              {/* Film Sprocket Holes Top */}
              <div className="flex justify-between items-center px-1 pb-1.5 text-[8px] font-mono text-zinc-500 tracking-widest select-none">
                <span>KODAK 400</span>
                <span>▶ 24A</span>
                <span>SAFETY FILM</span>
              </div>
              
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-900 rounded-[2px] border border-zinc-800">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.alt}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{ filter: selectedCamera.cssFilter }}
                  referrerPolicy="no-referrer"
                />
                {/* Film Date Stamp */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs font-mono text-[10px] text-amber-400 font-bold tracking-widest">
                  {formattedDateStamp}
                </div>
              </div>

              {/* Film Sprocket Holes Bottom */}
              <div className="flex justify-between items-center px-1 pt-1.5 text-[8px] font-mono text-zinc-500 tracking-widest select-none">
                <span className="truncate max-w-[160px]">{displayCaption}</span>
                <span>• • •</span>
              </div>
            </div>
          )}

          {/* Frame Style: MINIMAL GALLERY MAT */}
          {selectedFrame.id === 'minimal_white' && (
            <div className="w-full bg-stone-100 dark:bg-stone-900 p-3 sm:p-4 shadow-xl border border-stone-200 dark:border-stone-800 transition-all duration-300">
              <div className="relative w-full aspect-square overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-inner">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.alt}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{ filter: selectedCamera.cssFilter }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-2 text-center">
                <p className="font-sans text-[11px] font-bold tracking-wider uppercase text-stone-700 dark:text-stone-300 truncate">
                  {displayCaption}
                </p>
              </div>
            </div>
          )}

          {/* Frame Style: CHAMPAGNE GOLD LUXURY */}
          {selectedFrame.id === 'gold_luxury' && (
            <div className="w-full p-2.5 bg-gradient-to-br from-amber-50 via-white to-amber-50/70 dark:from-zinc-900 dark:via-zinc-950 dark:to-amber-950/20 border-2 border-amber-400/80 shadow-2xl transition-all duration-300 rounded-sm">
              <div className="relative w-full aspect-square overflow-hidden border border-amber-300/40">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.alt}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{ filter: selectedCamera.cssFilter }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center px-2 py-1 bg-black/40 backdrop-blur-xs rounded border border-amber-400/40">
                  <span className="font-serif text-[10px] text-amber-200 font-medium truncate">
                    {displayCaption}
                  </span>
                  <span className="text-[8px] font-mono text-amber-300/80">
                    KAVA
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Frame Style: VINTAGE DATE STAMP */}
          {selectedFrame.id === 'vintage_stamp' && (
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-900 transition-all duration-300">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.alt}
                className="w-full h-full object-cover transition-all duration-500"
                style={{ filter: selectedCamera.cssFilter }}
                referrerPolicy="no-referrer"
              />
              {/* Glowing Vintage 90s Orange Timestamp */}
              <div className="absolute bottom-3 right-3 px-2 py-0.5 font-mono text-xs sm:text-sm font-black text-amber-400 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none">
                {formattedDateStamp}
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-[9px] font-sans text-white/90">
                {displayCaption}
              </div>
            </div>
          )}

          {/* Frame Style: NONE (Edge-to-edge Clean) */}
          {selectedFrame.id === 'none' && (
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-900 transition-all duration-300">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.alt}
                className="w-full h-full object-cover transition-all duration-500"
                style={{ filter: selectedCamera.cssFilter }}
                referrerPolicy="no-referrer"
              />
              {/* Clean Subtle Corner Stamp */}
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white shadow-lg flex items-center space-x-1">
                <span className="truncate max-w-[140px]">{displayCaption}</span>
              </div>
            </div>
          )}
        </div>

        {/* Photo Switcher Dots & Scene Preview */}
        <div className="flex items-center justify-between mt-2.5 px-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Sample scene:
            </span>
            <div className="flex space-x-1">
              {ctx.samplePhotos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                    activePhotoIndex === idx
                      ? 'bg-[#00A88F] text-white font-bold shadow-xs'
                      : isDark
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title={photo.caption}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic truncate max-w-[130px]">
            {currentPhoto.caption}
          </span>
        </div>
      </div>
    </div>
  );
}
