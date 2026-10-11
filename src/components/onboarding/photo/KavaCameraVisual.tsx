import React from 'react';
import { motion } from 'motion/react';

interface KavaCameraVisualProps {
  cameraStyleId: string;
  className?: string;
}

export default function KavaCameraVisual({ cameraStyleId, className = '' }: KavaCameraVisualProps) {
  if (cameraStyleId === 'funsaver') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Retro Disposable Camera (KAVA FUNSAVER) */}
        <div className="relative w-[240px] sm:w-[280px] h-[150px] sm:h-[170px] bg-gradient-to-b from-[#148A7A] via-[#0E7A6B] to-[#0A5C50] rounded-3xl p-3 shadow-[0_16px_36px_rgba(14,122,107,0.28)] border-4 border-[#07473E] flex flex-col justify-between overflow-hidden">
          
          {/* Top Bezel / Viewfinder & Flash */}
          <div className="flex items-center justify-between px-2 pt-1">
            {/* Viewfinder */}
            <div className="w-8 h-6 bg-slate-900 rounded-md border-2 border-slate-700 flex items-center justify-center">
              <div className="w-4 h-3 bg-teal-400/30 rounded-xs" />
            </div>

            {/* Top Winder & Flash Ready Indicator */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#F59E0B]" />
                <span className="text-[8px] font-mono font-bold text-amber-200 uppercase">Flash</span>
              </div>
              {/* Flash Glass */}
              <div className="w-10 h-7 bg-gradient-to-br from-amber-100 to-amber-300 rounded-lg border-2 border-amber-400/60 shadow-inner flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/90 via-amber-200/50 to-amber-400/60" />
                <div className="w-6 h-4 border border-amber-500/40 rounded-xs grid grid-cols-3 gap-0.5 opacity-60">
                  <div className="bg-amber-300/40" />
                  <div className="bg-amber-300/40" />
                  <div className="bg-amber-300/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Center Graphic & Lens */}
          <div className="relative flex items-center justify-center py-1">
            {/* Camera Branding */}
            <div className="absolute left-2 top-0 text-left">
              <div className="text-[10px] font-black tracking-widest text-white uppercase font-sans">KAVA</div>
              <div className="text-[8px] font-mono font-bold text-emerald-200 tracking-wider">FUNSAVER</div>
            </div>

            {/* Central Lens System */}
            <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-[#073D35] border-4 border-[#149B89] flex items-center justify-center shadow-lg">
              {/* Lens Outer Ring */}
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center">
                {/* Lens Glass Reflection */}
                <div className="relative w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-br from-teal-900 via-slate-950 to-emerald-950 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-1 left-2 w-4 h-2 bg-white/40 rounded-full rotate-[-30deg] blur-[0.5px]" />
                  <div className="w-5 h-5 rounded-full bg-black border border-teal-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-400/80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shutter Button Mock */}
            <div className="absolute right-3 top-1 text-center">
              <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-amber-600 shadow-md flex items-center justify-center active:scale-95 transition-transform cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-amber-300" />
              </div>
            </div>
          </div>

          {/* Bottom Grip Lines */}
          <div className="flex items-center justify-between px-2 pb-0.5 text-[7px] font-mono text-emerald-200/80 uppercase">
            <span>35mm Color Film</span>
            <div className="flex space-x-1">
              <span className="w-1 h-2 bg-white/20 rounded-full" />
              <span className="w-1 h-2 bg-white/20 rounded-full" />
              <span className="w-1 h-2 bg-white/20 rounded-full" />
              <span className="w-1 h-2 bg-white/20 rounded-full" />
            </div>
            <span>27 Exposures</span>
          </div>

        </div>
      </div>
    );
  }

  if (cameraStyleId === 'polaroid') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Instant Polaroid Camera */}
        <div className="relative w-[240px] sm:w-[280px] h-[150px] sm:h-[170px] bg-stone-100 rounded-3xl p-3 shadow-[0_16px_36px_rgba(0,0,0,0.12)] border-4 border-stone-300 flex flex-col justify-between overflow-hidden">
          {/* Top Strip */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="w-7 h-5 bg-slate-900 rounded-md border-2 border-slate-700" />
            <div className="flex items-center space-x-1 h-2 w-16 rounded-full overflow-hidden">
              <div className="flex-1 bg-red-400 h-full" />
              <div className="flex-1 bg-amber-400 h-full" />
              <div className="flex-1 bg-teal-400 h-full" />
              <div className="flex-1 bg-sky-400 h-full" />
            </div>
          </div>

          {/* Lens */}
          <div className="relative flex items-center justify-center">
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-stone-300 border-4 border-stone-400 flex items-center justify-center shadow-md">
              <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600/40 via-slate-800 to-teal-500/40" />
              </div>
            </div>
            <div className="absolute right-3 top-2 w-7 h-7 rounded-full bg-red-500 border-2 border-red-700 shadow-md" />
          </div>

          <div className="flex items-center justify-between px-2 text-[8px] font-bold text-stone-500 uppercase tracking-widest font-sans">
            <span>KAVA INSTANT</span>
            <span>AUTO-PRINT</span>
          </div>
        </div>
      </div>
    );
  }

  if (cameraStyleId === 'film') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Vintage 35mm Rangefinder Camera */}
        <div className="relative w-[240px] sm:w-[280px] h-[150px] sm:h-[170px] bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-3xl p-3 shadow-[0_16px_36px_rgba(0,0,0,0.25)] border-4 border-zinc-700 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex space-x-1.5">
              <div className="w-6 h-4 bg-zinc-900 rounded-xs border border-zinc-600" />
              <div className="w-4 h-4 bg-amber-500/40 rounded-full border border-amber-600" />
            </div>
            <div className="text-[9px] font-mono font-bold text-amber-400 tracking-wider">35mm CLASSIC</div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-zinc-700 border-4 border-zinc-600 flex items-center justify-center shadow-lg">
              <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-zinc-900 border-2 border-amber-500/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 via-zinc-950 to-orange-500/30" />
              </div>
            </div>
            <div className="absolute right-3 top-2 w-7 h-7 rounded-full bg-zinc-400 border-2 border-zinc-600 shadow-md" />
          </div>

          <div className="flex items-center justify-between px-2 text-[8px] font-mono text-zinc-400 uppercase">
            <span>F/2.8 LEICA GLASS</span>
            <span>PORTRA 400</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Original Clean HD Camera
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <div className="relative w-[240px] sm:w-[280px] h-[150px] sm:h-[170px] bg-gradient-to-b from-slate-100 to-slate-200 rounded-3xl p-3 shadow-[0_16px_36px_rgba(0,0,0,0.08)] border-4 border-slate-300 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="w-7 h-5 bg-slate-900 rounded-md border-2 border-slate-700" />
          <div className="text-[9px] font-mono font-bold text-[#0E7A6B] uppercase tracking-wider">ULTRA HD RAW</div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-slate-300 border-4 border-slate-400 flex items-center justify-center shadow-md">
            <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-slate-900 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/30 via-slate-950 to-cyan-500/30" />
            </div>
          </div>
          <div className="absolute right-3 top-2 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-700 shadow-md" />
        </div>

        <div className="flex items-center justify-between px-2 text-[8px] font-bold text-slate-600 uppercase font-sans">
          <span>ORIGINAL SENSOR</span>
          <span>NO FILTER</span>
        </div>
      </div>
    </div>
  );
}
