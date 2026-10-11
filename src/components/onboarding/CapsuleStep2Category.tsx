import React from 'react';
import {
  Sparkles,
  Heart,
  Cake,
  GlassWater,
  GraduationCap,
  Users,
  Flame,
  PartyPopper,
  Briefcase,
  Layers,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';

export interface CapsuleCategoryOption {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  tagline: string;
  description: string;
  defaultName: string;
}

export const CAPSULE_CATEGORIES: CapsuleCategoryOption[] = [
  {
    id: 'wedding',
    name: 'Wedding',
    badge: 'WEDDING',
    icon: Heart,
    colorBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    colorBorder: 'border-emerald-200 dark:border-emerald-800/60',
    colorText: 'text-[#0E7A6B] dark:text-[#5EEAD4]',
    tagline: 'Ceremony, Vows & Live Guest Wall',
    description: 'Collect speech audios, 4K videos, vows, ceremony photos & written blessings.',
    defaultName: "Sofia & Leo's Wedding",
  },
  {
    id: 'birthday',
    name: 'Birthday & Milestone',
    badge: 'BIRTHDAY',
    icon: Cake,
    colorBg: 'bg-rose-50 dark:bg-rose-950/40',
    colorBorder: 'border-rose-200 dark:border-rose-800/60',
    colorText: 'text-rose-600 dark:text-rose-400',
    tagline: 'Milestone Celebrations & Parties',
    description: 'Gather candle blowout clips, party snaps, audio wishes & heartfelt messages.',
    defaultName: "Maya's 30th Birthday Celebration",
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    badge: 'ANNIVERSARY',
    icon: GlassWater,
    colorBg: 'bg-amber-50 dark:bg-amber-950/40',
    colorBorder: 'border-amber-200 dark:border-amber-800/60',
    colorText: 'text-amber-700 dark:text-amber-400',
    tagline: 'Golden Memories & Lifetime Toasts',
    description: 'Celebrate continuous years of love with throwback photos, voice notes & tributes.',
    defaultName: "David & Ellen's 25th Anniversary",
  },
  {
    id: 'graduation',
    name: 'Graduation',
    badge: 'GRADUATION',
    icon: GraduationCap,
    colorBg: 'bg-blue-50 dark:bg-blue-950/40',
    colorBorder: 'border-blue-200 dark:border-blue-800/60',
    colorText: 'text-blue-600 dark:text-blue-400',
    tagline: 'Cap Toss & Commencement',
    description: 'Preserve commencement speeches, cap-toss clips & career advice for the graduate.',
    defaultName: 'Stanford Class of 2026',
  },
  {
    id: 'reunion',
    name: 'Reunion & Gathering',
    badge: 'REUNION',
    icon: Users,
    colorBg: 'bg-purple-50 dark:bg-purple-950/40',
    colorBorder: 'border-purple-200 dark:border-purple-800/60',
    colorText: 'text-purple-600 dark:text-purple-400',
    tagline: 'Family, Friends & Alumni',
    description: 'Bring together generations of memories, group snapshots & shared family stories.',
    defaultName: 'Smith Family Reunion 2026',
  },
  {
    id: 'memorial',
    name: 'Memorial & Tribute',
    badge: 'MEMORIAL',
    icon: Flame,
    colorBg: 'bg-slate-100 dark:bg-slate-800/60',
    colorBorder: 'border-slate-300 dark:border-slate-700',
    colorText: 'text-slate-700 dark:text-slate-300',
    tagline: 'Celebration of Life',
    description: 'A dignified space to preserve cherished memories, voice tributes & heartfelt stories.',
    defaultName: 'In Loving Memory of Robert',
  },
  {
    id: 'holiday_party',
    name: 'Holiday & Party',
    badge: 'PARTY',
    icon: PartyPopper,
    colorBg: 'bg-orange-50 dark:bg-orange-950/40',
    colorBorder: 'border-orange-200 dark:border-orange-800/60',
    colorText: 'text-orange-600 dark:text-orange-400',
    tagline: 'Festive Gatherings & Festivals',
    description: 'Live drop for party photos, DJ dancefloor videos & celebration highlights.',
    defaultName: 'Annual Summer Gala 2026',
  },
  {
    id: 'corporate',
    name: 'Corporate & Summit',
    badge: 'CORPORATE',
    icon: Briefcase,
    colorBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    colorBorder: 'border-indigo-200 dark:border-indigo-800/60',
    colorText: 'text-indigo-600 dark:text-indigo-400',
    tagline: 'Conferences & Team Offsites',
    description: 'Professional memory bank for keynote videos, team bonding photos & executive messages.',
    defaultName: 'Tech Summit 2026',
  },
  {
    id: 'other',
    name: 'Custom Occasion',
    badge: 'CUSTOM',
    icon: Sparkles,
    colorBg: 'bg-teal-50 dark:bg-teal-950/40',
    colorBorder: 'border-teal-200 dark:border-teal-800/60',
    colorText: 'text-[#0E7A6B] dark:text-[#5EEAD4]',
    tagline: 'Any Meaningful Gathering',
    description: 'Tailor a flexible memory capsule for any special moment, getaway or occasion.',
    defaultName: 'Special Memory Capsule',
  },
];

interface CapsuleStep2CategoryProps {
  selectedType: string;
  onSelectEventType: (typeId: string, typeName: string, defaultName: string) => void;
  onNext: () => void;
  appearance?: 'light' | 'dark';
}

export default function CapsuleStep2Category({
  selectedType,
  onSelectEventType,
  onNext,
  appearance = 'light',
}: CapsuleStep2CategoryProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';

  return (
    <div className="space-y-5 sm:space-y-6 text-left" id="capsule-step-2-category">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-[11px] font-bold tracking-tight mb-0.5">
          <Sparkles className="w-3 h-3 text-[#0E7A6B]" />
          <span>Step 2 • Occasion Category</span>
        </div>
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#0B132B]'
          }`}
        >
          What type of occasion is this?
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#4B5563]'}`}>
          Select an occasion to automatically configure tailored prompts, cover artworks, and multimedia templates.
        </p>
      </div>

      {/* Grid of Occasion Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 pt-1">
        {CAPSULE_CATEGORIES.map((cat) => {
          const isSelected = selectedType.toLowerCase() === cat.name.toLowerCase() ||
            (selectedType.toLowerCase().includes('wedding') && cat.id === 'wedding') ||
            (selectedType.toLowerCase().includes('birthday') && cat.id === 'birthday') ||
            (selectedType.toLowerCase().includes('anniversary') && cat.id === 'anniversary') ||
            (selectedType.toLowerCase().includes('graduation') && cat.id === 'graduation');
          
          const Icon = cat.icon;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectEventType(cat.id, cat.name, cat.defaultName)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group ${
                isSelected
                  ? isDark
                    ? 'border-[#0E7A6B] bg-[#0E7A6B]/15 shadow-md ring-2 ring-[#0E7A6B]/30'
                    : 'border-[#0E7A6B] bg-[#F0FDF9] shadow-md ring-2 ring-[#0E7A6B]/15'
                  : isDark
                  ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
              id={`capsule-category-${cat.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cat.colorBg} ${cat.colorBorder} ${cat.colorText}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#0E7A6B] text-white shadow-xs'
                        : 'border-2 border-slate-300 dark:border-slate-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                      {cat.name}
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#4B5563]'}`}>
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  {cat.tagline}
                </span>
                <span className="text-[#0E7A6B] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-0.5">
                  <span>Select</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue CTA */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-continue-capsule-category"
        >
          <span>Continue to Occasion Details</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
