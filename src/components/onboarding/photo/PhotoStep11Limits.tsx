import React from 'react';
import { ArrowRight, Sparkles, Users, Camera, Infinity } from 'lucide-react';

interface PhotoStep11LimitsProps {
  guestLimit: number;
  setGuestLimit: (limit: number) => void;
  photoLimitPerGuest: number;
  setPhotoLimitPerGuest: (limit: number) => void;
  onNext: () => void;
}

export default function PhotoStep11Limits({
  guestLimit = 100,
  setGuestLimit,
  photoLimitPerGuest = 25,
  setPhotoLimitPerGuest,
  onNext,
}: PhotoStep11LimitsProps) {
  const guestPresets = [25, 50, 100, 250, 500];
  const photoPresets = [10, 25, 50, 100];

  return (
    <div className="space-y-5 sm:space-y-6 text-left" id="photo-step-11-limits">
      {/* Step Header */}
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-[11px] font-bold tracking-tight mb-0.5">
          <Sparkles className="w-3 h-3 text-[#0E7A6B]" />
          <span>Step 11 • Guest Capacity & Photo Limit</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight font-sans">
          Set guest & upload limits
        </h2>
        <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed">
          Easily manage your event capacity and cap how many photos each guest can upload.
        </p>
      </div>

      <div className="space-y-4 pt-1">
        {/* Guest Limit Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#0E7A6B]" />
              <h3 className="text-sm sm:text-base font-bold text-[#0B132B]">
                Expected Guest Count
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0E7A6B] bg-[#E6FFFA] px-3 py-1 rounded-full border border-[#99F6E4]">
              {guestLimit >= 500 ? '500+ Guests' : `${guestLimit} Guests`}
            </span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={guestLimit}
            onChange={(e) => setGuestLimit(Number(e.target.value))}
            className="w-full accent-[#0E7A6B] cursor-pointer h-2 bg-slate-100 rounded-lg"
            id="slider-guest-limit"
          />

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {guestPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setGuestLimit(preset)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  guestLimit === preset
                    ? 'bg-[#0E7A6B] text-white border-[#0E7A6B]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Limit Per Guest Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-[#0E7A6B]" />
              <h3 className="text-sm sm:text-base font-bold text-[#0B132B]">
                Photos Allowed per Guest
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0E7A6B] bg-[#E6FFFA] px-3 py-1 rounded-full border border-[#99F6E4]">
              {photoLimitPerGuest === 0 ? 'Unlimited' : `${photoLimitPerGuest} photos`}
            </span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={photoLimitPerGuest}
            onChange={(e) => setPhotoLimitPerGuest(Number(e.target.value))}
            className="w-full accent-[#0E7A6B] cursor-pointer h-2 bg-slate-100 rounded-lg"
            id="slider-photo-limit"
          />

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {photoPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPhotoLimitPerGuest(preset)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  photoLimitPerGuest === preset
                    ? 'bg-[#0E7A6B] text-white border-[#0E7A6B]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {preset} photos
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPhotoLimitPerGuest(0)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                photoLimitPerGuest === 0
                  ? 'bg-[#0E7A6B] text-white border-[#0E7A6B]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Unlimited
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Continue Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-continue-step-11"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
