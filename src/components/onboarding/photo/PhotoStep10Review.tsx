import React from 'react';
import { Sparkles, Calendar, Users, Camera, Image, Heart, Clock, Tag } from 'lucide-react';
import { getPhotoModeContext, PHOTO_CAMERA_STYLES, PHOTO_FRAME_STYLES } from '../../../lib/photoModeContext';

interface PhotoStep10ReviewProps {
  eventType: string;
  eventName: string;
  cameraStyleId: string;
  frameStyleId: string;
  revealTiming: string;
  allowLikes: boolean;
  endDate: string;
  endTime: string;
  guestLimit: number;
  photoLimitPerGuest: number;
  onCreateAlbum: () => void;
}

export default function PhotoStep10Review({
  eventType,
  eventName,
  cameraStyleId,
  frameStyleId,
  revealTiming,
  allowLikes,
  endDate,
  endTime,
  guestLimit,
  photoLimitPerGuest,
  onCreateAlbum,
}: PhotoStep10ReviewProps) {
  const ctx = getPhotoModeContext(eventType);
  const cameraPreset = PHOTO_CAMERA_STYLES.find((c) => c.id === cameraStyleId) || PHOTO_CAMERA_STYLES[1];
  const framePreset = PHOTO_FRAME_STYLES.find((f) => f.id === frameStyleId) || PHOTO_FRAME_STYLES[1];

  const revealLabel =
    revealTiming === 'instant_live'
      ? 'During Event'
      : revealTiming === 'time_capsule_midnight'
      ? 'After Event'
      : 'Custom Reveal';

  return (
    <div className="space-y-6 text-left" id="photo-step-10-review">
      {/* Step Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight font-sans">
          Review your album
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] font-normal leading-relaxed">
          Almost there! Here's a quick summary of your settings.
        </p>
      </div>

      {/* Review Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
        {/* Row 1: Event Type */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg select-none">{ctx.icon}</span>
            <span className="text-xs sm:text-sm text-[#6B7280] font-medium">Event Type</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1F2937]">{ctx.name}</span>
        </div>

        {/* Row 2: Event Name */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Tag className="w-4 h-4 text-[#0E7A6B]" />
            <span className="text-xs sm:text-sm text-[#6B7280] font-medium">Event Name</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1F2937] max-w-[200px] truncate">
            {eventName || ctx.defaultName}
          </span>
        </div>

        {/* Row 3: Camera Style */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="w-4 h-4 text-[#0E7A6B]" />
            <span className="text-xs sm:text-sm text-[#6B7280] font-medium">Camera Style</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1F2937]">{cameraPreset.name}</span>
        </div>

        {/* Row 4: Photo Reveal */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-[#0E7A6B]" />
            <span className="text-xs sm:text-sm text-[#6B7280] font-medium">Photo Reveal</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1F2937]">{revealLabel}</span>
        </div>

        {/* Row 5: Photo Frame */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image className="w-4 h-4 text-[#0E7A6B]" />
            <span className="text-xs sm:text-sm text-[#6B7280] font-medium">Photo Frame</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1F2937]">{framePreset.name}</span>
        </div>

        {/* Row 6: Likes */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="w-4 h-4 text-[#0E7A6B]" />
            <span className="text-xs sm:text-sm text-[#6B7280] font-medium">Likes</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1F2937]">{allowLikes ? 'On' : 'Off'}</span>
        </div>

        {/* Row 7: End Date & Time */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-4 h-4 text-[#0E7A6B]" />
            <span className="text-xs sm:text-sm text-[#6B7280] font-medium">End Date</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1F2937]">
            {endDate || 'Aug 25, 2026'} {endTime || '10:00 PM'}
          </span>
        </div>

        {/* Row 8: Guests & Limits */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-4 h-4 text-[#0E7A6B]" />
            <span className="text-xs sm:text-sm text-[#6B7280] font-medium">Guests & Limits</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1F2937]">
            {guestLimit} guests • {photoLimitPerGuest} photos each
          </span>
        </div>
      </div>

      {/* Prominent Teal Create Album CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onCreateAlbum}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/25 cursor-pointer min-h-[48px]"
          id="btn-create-album-final"
        >
          <span>Create Album</span>
          <Sparkles className="w-4 h-4 text-emerald-200" />
        </button>
      </div>
    </div>
  );
}
