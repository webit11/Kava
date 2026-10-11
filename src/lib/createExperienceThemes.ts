export type CreateExperienceThemeId = 'clean_minimal' | 'editorial_photo' | 'cinematic_memory' | 'soft_celebration';
export type CreateAppearanceMode = 'light' | 'dark';

export interface CreateExperienceTheme {
  id: CreateExperienceThemeId;
  themeNumber: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: string;
  swatchGradient: string;
  accentBadge: string;
  previewClass: string;
}

export const CREATE_EXPERIENCE_THEMES: CreateExperienceTheme[] = [
  {
    id: 'clean_minimal',
    themeNumber: 'Theme 01',
    name: 'Clean Minimal',
    subtitle: 'Pure modern structure',
    description: 'Crisp neutral surfaces, Apple-inspired whitespace, clean borders & balanced typography.',
    iconName: 'Layout',
    swatchGradient: 'linear-gradient(135deg, #0F172A 0%, #334155 50%, #94A3B8 100%)',
    accentBadge: 'Default',
    previewClass: 'border-slate-300'
  },
  {
    id: 'editorial_photo',
    themeNumber: 'Theme 02',
    name: 'Editorial Photo',
    subtitle: 'Contextual magazine layout',
    description: 'Large contextual background photography, frosted translucent glass, photo-led framing & mint accents.',
    iconName: 'Camera',
    swatchGradient: 'linear-gradient(135deg, #0D9488 0%, #0284C7 50%, #0369A1 100%)',
    accentBadge: 'Visual',
    previewClass: 'border-teal-400'
  },
  {
    id: 'cinematic_memory',
    themeNumber: 'Theme 03',
    name: 'Cinematic Memory',
    subtitle: 'Nostalgic gold & film grain',
    description: 'Rich dramatic lighting, antique gold accents, vignette framing & warm luxury atmosphere.',
    iconName: 'Film',
    swatchGradient: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #78350F 100%)',
    accentBadge: 'Luxury',
    previewClass: 'border-amber-400'
  },
  {
    id: 'soft_celebration',
    themeNumber: 'Theme 04',
    name: 'Soft Celebration',
    subtitle: 'Radiant champagne & joy',
    description: 'Warm festive radiance, subtle emerald undertones, soft pill shapes & celebratory micro-glows.',
    iconName: 'Sparkles',
    swatchGradient: 'linear-gradient(135deg, #00A88F 0%, #00E5C0 50%, #34D399 100%)',
    accentBadge: 'Festive',
    previewClass: 'border-emerald-400'
  }
];

export const CATEGORY_BACKGROUND_IMAGES: Record<string, string> = {
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
  reunion: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80',
  birthday: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=80',
  anniversary: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
  graduation: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
  other: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
};

export function getCategoryBackgroundImage(typeId: string): string {
  const normalized = (typeId || 'wedding').toLowerCase();
  if (normalized.includes('wedding')) return CATEGORY_BACKGROUND_IMAGES.wedding;
  if (normalized.includes('reunion')) return CATEGORY_BACKGROUND_IMAGES.reunion;
  if (normalized.includes('birthday')) return CATEGORY_BACKGROUND_IMAGES.birthday;
  if (normalized.includes('anniversary')) return CATEGORY_BACKGROUND_IMAGES.anniversary;
  if (normalized.includes('graduation')) return CATEGORY_BACKGROUND_IMAGES.graduation;
  return CATEGORY_BACKGROUND_IMAGES.other;
}
