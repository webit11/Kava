import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { PhotoModeEventType, getPhotoModeContext } from '../../../lib/photoModeContext';

export interface EventTypeItem {
  id: string;
  name: string;
  imageUrl: string;
}

export const EVENT_TYPE_ITEMS: EventTypeItem[] = [
  {
    id: 'wedding',
    name: 'Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'birthday',
    name: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'reunion',
    name: 'Family Reunion',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'baby_shower',
    name: 'Baby Shower',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'travel',
    name: 'Travel',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'custom',
    name: 'Other / Custom',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400',
  },
];

interface PhotoStep2EventTypeProps {
  selectedType: string;
  onSelectEventType: (type: PhotoModeEventType) => void;
  onNext: () => void;
  appearance?: 'light' | 'dark';
}

export default function PhotoStep2EventType({
  selectedType,
  onSelectEventType,
  onNext,
  appearance = 'light',
}: PhotoStep2EventTypeProps) {
  const isDark = appearance === 'dark';

  const handleSelect = (item: EventTypeItem) => {
    const fullCtx = getPhotoModeContext(item.id);
    onSelectEventType({
      ...fullCtx,
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
    });
  };

  return (
    <div className="space-y-6 text-left max-w-lg mx-auto" id="photo-step-2-event-type">
      {/* Step Heading */}
      <div className="space-y-1.5">
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#1F2937]'
          }`}
        >
          What kind of event is this?
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#6B7280]'}`}>
          We'll customize the experience just for you.
        </p>
      </div>

      {/* 2-Column Grid of Photographic Event Type Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-3.5 pt-1">
        {EVENT_TYPE_ITEMS.map((item) => {
          const isSelected =
            selectedType.toLowerCase() === item.id.toLowerCase() ||
            selectedType.toLowerCase() === item.name.toLowerCase() ||
            (item.id === 'reunion' && (selectedType.toLowerCase().includes('family') || selectedType.toLowerCase().includes('reunion'))) ||
            (item.id === 'custom' && (selectedType.toLowerCase() === 'other' || selectedType.toLowerCase() === 'custom'));

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer h-24 sm:h-28 text-left flex flex-col justify-end p-3 ${
                isSelected
                  ? 'border-[#0E7A6B] ring-2 ring-[#0E7A6B]/25 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              id={`card-event-type-${item.id}`}
            >
              {/* Background Photographic Image */}
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient Mask for High Contrast Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

              {/* Selected Checkmark Badge in KAVA Teal */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#0E7A6B] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Text Label */}
              <div className="relative z-10">
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight drop-shadow-xs">
                  {item.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Prominent Teal CTA Button */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-event-type-continue"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
