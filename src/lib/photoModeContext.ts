export interface PhotoModeEventType {
  id: string;
  name: string;
  badgeTag: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: string;
  tagline: string;
  defaultName: string;
  smartNameSuggestions: string[];
  placeholderLocation: string;
  imageUrl: string;
  samplePhotos: {
    url: string;
    caption: string;
    alt: string;
  }[];
  defaultCameraStyle: string;
  defaultFrameStyle: string;
  defaultFrameCaption: string;
  defaultRevealTiming: 'instant_live' | 'time_capsule_midnight' | 'time_capsule_morning' | 'custom_reveal';
  defaultDurationDays: number;
}

export interface CameraStylePreset {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  desc: string;
  cssFilter: string;
  temperature: string;
  vibe: string;
  grainIntensity?: number;
  previewGradient: string;
  thumbnailUrl: string;
}

export interface PhotoFramePreset {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  desc: string;
  aspectRatio: string;
  borderStyle: string;
  previewBorder: string;
}

export const PHOTO_CAMERA_STYLES: CameraStylePreset[] = [
  {
    id: 'original',
    name: 'Original',
    subtitle: 'True-to-life, unfiltered high-definition clarity.',
    badge: 'Clean HD',
    desc: 'Crisp, natural camera output with zero filter or color modification.',
    cssFilter: 'none',
    temperature: 'Natural',
    vibe: 'Clean & Modern',
    grainIntensity: 0,
    previewGradient: 'from-slate-400/15 via-slate-500/10 to-slate-600/15',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'funsaver',
    name: 'Funsaver',
    subtitle: 'Golden flash, rich grain, and that nostalgic vibe.',
    badge: 'Most Popular',
    desc: 'Iconic 90s disposable camera aesthetic with warm flash warmth and authentic analog grain.',
    cssFilter: 'contrast(1.18) saturate(1.25) brightness(1.05) sepia(0.12)',
    temperature: 'Warm Flash',
    vibe: 'Candid & Nostalgic',
    grainIntensity: 0.18,
    previewGradient: 'from-emerald-500/20 via-teal-500/15 to-amber-500/20',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    subtitle: 'Soft instant warmth with gentle contrast and creamy highlights.',
    badge: 'Instant Magic',
    desc: 'Dreamy instant photo aesthetic with lifted shadows and soft pastel tones.',
    cssFilter: 'sepia(0.2) saturate(1.15) contrast(1.08) brightness(1.04) hue-rotate(-4deg)',
    temperature: 'Creamy Warm',
    vibe: 'Dreamy & Retro',
    grainIntensity: 0.12,
    previewGradient: 'from-amber-400/20 via-orange-400/15 to-rose-400/15',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'film',
    name: 'Film',
    subtitle: 'Classic 35mm analog grain and rich cinematic colors.',
    badge: '35mm Classic',
    desc: 'Timeless analog emulsion with golden skin tones and deep vintage contrast.',
    cssFilter: 'sepia(0.16) saturate(1.18) contrast(1.12) brightness(1.02)',
    temperature: 'Golden Amber',
    vibe: 'Cinematic & Timeless',
    grainIntensity: 0.15,
    previewGradient: 'from-orange-500/20 via-amber-500/15 to-stone-500/20',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=250',
  },
];

export const PHOTO_FRAME_STYLES: PhotoFramePreset[] = [
  {
    id: 'none',
    name: 'None',
    subtitle: 'Full-bleed borderless clean look',
    badge: 'Standard',
    desc: 'Modern borderless edge-to-edge photo with zero frame overlay.',
    aspectRatio: 'aspect-[4/5]',
    borderStyle: 'border-0',
    previewBorder: 'border border-slate-200 shadow-xs',
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    subtitle: 'Classic white instant border with bottom note',
    badge: 'Most Popular',
    desc: 'Iconic instant camera border with bottom handwritten text space.',
    aspectRatio: 'aspect-[4/5]',
    borderStyle: 'border-[8px] sm:border-[10px] border-white pb-8 sm:pb-10 bg-white shadow-xl',
    previewBorder: 'p-1.5 pb-4 bg-white border border-slate-200 shadow-sm rounded-xs',
  },
  {
    id: 'floral',
    name: 'Floral',
    subtitle: 'Delicate watercolor botanical corners',
    badge: 'Romantic',
    desc: 'Gentle eucalyptus and botanical leaf accents at the corners.',
    aspectRatio: 'aspect-[4/5]',
    borderStyle: 'border-[6px] border-emerald-50/80 bg-white shadow-xl relative',
    previewBorder: 'p-1.5 bg-emerald-50/50 border border-emerald-200 shadow-sm rounded-xs',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    subtitle: 'Refined gallery mat with clean caption',
    badge: 'Editorial',
    desc: 'Crisp museum matting with subtle typography and generous borders.',
    aspectRatio: 'aspect-[4/5]',
    borderStyle: 'border-[8px] border-stone-50 bg-stone-50 shadow-lg',
    previewBorder: 'p-1.5 bg-stone-50 border border-stone-200 shadow-xs rounded-xs',
  },
  {
    id: 'classic',
    name: 'Classic',
    subtitle: 'Timeless portrait frame with subtle gold rim',
    badge: 'Timeless',
    desc: 'Elegant champagne border with fine double-lined corner accents.',
    aspectRatio: 'aspect-[4/5]',
    borderStyle: 'border-[4px] border-amber-200/90 p-1 bg-white shadow-xl',
    previewBorder: 'p-1 bg-amber-50/30 border border-amber-200 shadow-xs rounded-xs',
  },
];

export const PHOTO_EVENT_TYPES: Record<string, PhotoModeEventType> = {
  wedding: {
    id: 'wedding',
    name: 'Wedding',
    badgeTag: 'WEDDING',
    badgeBg: 'bg-[#E6FFFA]',
    badgeText: 'text-[#00A88F]',
    badgeBorder: 'border-[#99F6E4]',
    icon: '💍',
    tagline: 'Capture candid ceremony glances, guest table selfies, sparkler exit, and dance floor toasts in one shared album.',
    defaultName: "Sofia & Leo's Wedding",
    smartNameSuggestions: [
      "Sofia & Leo's Wedding",
      'The Big Day',
      'Our Wedding Day',
      'Love, L & S',
      'Sofia & Leo',
    ],
    placeholderLocation: 'e.g. The Glasshouse, Big Sur',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    samplePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
        caption: "Sofia & Leo's Wedding 🤎",
        alt: 'Wedding couple celebrating together',
      },
      {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
        caption: 'First Dance Golden Moment',
        alt: 'Couple dancing together under chandelier lights',
      },
      {
        url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1000',
        caption: 'Champagne Toast at Table 4',
        alt: 'Guests clinking champagne glasses in celebration',
      },
    ],
    defaultCameraStyle: 'funsaver',
    defaultFrameStyle: 'polaroid',
    defaultFrameCaption: "Sofia & Leo's Wedding 🤎",
    defaultRevealTiming: 'instant_live',
    defaultDurationDays: 3,
  },
  birthday: {
    id: 'birthday',
    name: 'Birthday',
    badgeTag: 'BIRTHDAY',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    icon: '🎂',
    tagline: 'Collect every cake-blowing laugh, confetti burst, party toast, and late-night snapshot from your birthday crew.',
    defaultName: "Marcus' 30th Birthday",
    smartNameSuggestions: [
      "Marcus' 30th Birthday",
      'The Birthday Bash',
      '30 & Thriving',
      'Cheers to Marcus',
      "Marcus' Big Day",
    ],
    placeholderLocation: 'e.g. Sunset Rooftop Lounge, NYC',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
    samplePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1000',
        caption: "Marcus' 30th Birthday 🎉",
        alt: 'Birthday celebration with cake and sparklers',
      },
      {
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1000',
        caption: 'Confetti Canon Pop!',
        alt: 'Party guests laughing under colorful confetti',
      },
    ],
    defaultCameraStyle: 'funsaver',
    defaultFrameStyle: 'polaroid',
    defaultFrameCaption: "Marcus' 30th Birthday 🎉",
    defaultRevealTiming: 'instant_live',
    defaultDurationDays: 2,
  },
  reunion: {
    id: 'reunion',
    name: 'Family Reunion',
    badgeTag: 'REUNION',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    icon: '🏡',
    tagline: 'Bring cousins, grandparents, and old classmates together into one shared photo archive across generations.',
    defaultName: 'The Miller Family Reunion',
    smartNameSuggestions: [
      'The Miller Family Reunion',
      'Family Gathering 2026',
      'Generations Together',
      'Miller Family Tree',
      'Homecoming 2026',
    ],
    placeholderLocation: 'e.g. Lake Tahoe Lodge, California',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600',
    samplePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1000',
        caption: 'Miller Family Reunion 🏡',
        alt: 'Big happy family group portrait outdoors',
      },
      {
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000',
        caption: 'Backyard Barbecue Hugs',
        alt: 'Cousins laughing and hugging in sunlight',
      },
    ],
    defaultCameraStyle: 'film',
    defaultFrameStyle: 'minimal',
    defaultFrameCaption: 'Miller Family • 2026',
    defaultRevealTiming: 'instant_live',
    defaultDurationDays: 7,
  },
  baby_shower: {
    id: 'baby_shower',
    name: 'Baby Shower',
    badgeTag: 'BABY SHOWER',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    icon: '👶',
    tagline: 'Preserve nursery wishes, pastel decor, bump photos, and joyful hugs celebrating the little one.',
    defaultName: "Maya's Baby Shower",
    smartNameSuggestions: [
      "Maya's Baby Shower",
      'Baby Henderson Shower',
      'Welcome Little One',
      'Oh Baby! Celebration',
      'A New Adventure Begins',
    ],
    placeholderLocation: 'e.g. Botanical Garden Conservatory',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600',
    samplePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1000',
        caption: "Welcome Little One 🍼",
        alt: 'Baby shower celebration and pastel balloons',
      },
      {
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1000',
        caption: 'Celebrating Baby Henderson',
        alt: 'Friends toasting and celebrating with gifts',
      },
    ],
    defaultCameraStyle: 'polaroid',
    defaultFrameStyle: 'floral',
    defaultFrameCaption: "Baby Shower • 2026 🍼",
    defaultRevealTiming: 'instant_live',
    defaultDurationDays: 3,
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    badgeTag: 'CORPORATE',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    icon: '💼',
    tagline: 'Seamless attendee photo sharing for summits, keynote talks, team offsites, and product launches.',
    defaultName: 'TechSummit 2026',
    smartNameSuggestions: [
      'TechSummit 2026',
      'Annual Company Gala',
      'Global Kickoff 2026',
      'Innovate Summit',
      'Team Offsite & Retreat',
    ],
    placeholderLocation: 'e.g. Moscone Convention Center, SF',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
    samplePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000',
        caption: 'TechSummit 2026 Keynote',
        alt: 'Conference hall audience and keynote presentation',
      },
      {
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1000',
        caption: 'Networking Dinner Toast',
        alt: 'Colleagues laughing during networking dinner',
      },
    ],
    defaultCameraStyle: 'original',
    defaultFrameStyle: 'minimal',
    defaultFrameCaption: 'TechSummit • SF 2026',
    defaultRevealTiming: 'instant_live',
    defaultDurationDays: 3,
  },
  travel: {
    id: 'travel',
    name: 'Travel',
    badgeTag: 'TRAVEL',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    icon: '✈️',
    tagline: 'A single shared album for roadtrips, beach getaways, camping weekends, and group adventures.',
    defaultName: 'Amalfi Coast Roadtrip',
    smartNameSuggestions: [
      'Amalfi Coast Roadtrip',
      'Eurotrip Chronicles',
      'Bali Adventures 2026',
      'Summer Getaway',
      'Wanderlust 2026',
    ],
    placeholderLocation: 'e.g. Positano & Capri, Italy',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600',
    samplePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000',
        caption: 'Amalfi Coast Roadtrip 🚗',
        alt: 'Friends roadtripping through mountain vistas',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
        caption: 'Sunset Beach Walk',
        alt: 'Golden beach ocean waves sunset view',
      },
    ],
    defaultCameraStyle: 'film',
    defaultFrameStyle: 'polaroid',
    defaultFrameCaption: 'Amalfi Coast • 2026',
    defaultRevealTiming: 'instant_live',
    defaultDurationDays: 7,
  },
  graduation: {
    id: 'graduation',
    name: 'Graduation',
    badgeTag: 'GRADUATION',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    icon: '🎓',
    tagline: 'Capture the cap toss, proud family hugs, diploma smiles, and commencement celebrations.',
    defaultName: 'Stanford Class of 2026',
    smartNameSuggestions: [
      'Stanford Class of 2026',
      'Caps Off! Class of 2026',
      "Maya's Commencement",
      'Future Leaders 2026',
      'Graduation Celebration',
    ],
    placeholderLocation: 'e.g. Stanford University Quad',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
    samplePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000',
        caption: 'Class of 2026 Graduation 🎓',
        alt: 'Graduates throwing mortarboards in the air',
      },
      {
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000',
        caption: 'Proud Graduate with Diploma',
        alt: 'Smiling graduate in gown holding diploma',
      },
    ],
    defaultCameraStyle: 'funsaver',
    defaultFrameStyle: 'classic',
    defaultFrameCaption: 'Class of 2026 • Stanford',
    defaultRevealTiming: 'instant_live',
    defaultDurationDays: 3,
  },
  custom: {
    id: 'custom',
    name: 'Other / Custom',
    badgeTag: 'CUSTOM',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    icon: '✨',
    tagline: 'Customize every detail for your unique community gathering, exhibition, or intimate milestone.',
    defaultName: 'Special Celebration 2026',
    smartNameSuggestions: [
      'Special Celebration 2026',
      'Summer Gathering',
      'Celebration of Moments',
      'Our Memory Capsule',
      'Unforgettable Days',
    ],
    placeholderLocation: 'e.g. Private Venue',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
    samplePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
        caption: 'Memories Together ✨',
        alt: 'Celebration moment with friends',
      },
    ],
    defaultCameraStyle: 'funsaver',
    defaultFrameStyle: 'polaroid',
    defaultFrameCaption: 'Celebration • 2026',
    defaultRevealTiming: 'instant_live',
    defaultDurationDays: 3,
  },
};

export function getPhotoModeContext(eventTypeId: string): PhotoModeEventType {
  const normalized = (eventTypeId || 'wedding').toLowerCase().trim();
  for (const [key, val] of Object.entries(PHOTO_EVENT_TYPES)) {
    if (normalized === key || normalized.includes(key) || val.name.toLowerCase().includes(normalized)) {
      return val;
    }
  }
  return PHOTO_EVENT_TYPES.wedding;
}
