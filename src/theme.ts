import React from 'react';

export interface ThemePreset {
  id: 'wedding' | 'minimal_light' | 'minimal_dark' | 'elegant' | 'corporate' | 'cyber' | 'custom';
  name: string;
  bgType: 'solid' | 'gradient' | 'image' | 'blur_glass' | 'minimal_light' | 'minimal_dark' | 'elegant' | 'wedding' | 'corporate' | 'custom';
  bgColor: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  wedding: {
    id: 'wedding',
    name: 'Classic Wedding Blush',
    bgType: 'gradient',
    bgColor: '#FAF5F5',
    bgGradient: 'linear-gradient(135deg, #FFF5F5, #FFF0F5, #FDF5E6)',
    textColor: '#3A2828',
    accentColor: '#C19A2E',
    fontFamily: 'serif',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: '1px solid rgba(193, 154, 46, 0.25)',
    badgeBg: 'rgba(193, 154, 46, 0.1)',
  },
  minimal_dark: {
    id: 'minimal_dark',
    name: 'Modern Matte Dark',
    bgType: 'solid',
    bgColor: '#0A0A0A',
    bgGradient: 'linear-gradient(180deg, #0F0F0F, #050505)',
    textColor: '#F5F5F5',
    accentColor: '#94A3B8',
    fontFamily: 'sans',
    cardBg: 'rgba(23, 23, 23, 0.75)',
    cardBorder: '1px solid rgba(255, 255, 255, 0.08)',
    badgeBg: 'rgba(255, 255, 255, 0.12)',
  },
  minimal_light: {
    id: 'minimal_light',
    name: 'Modern Matte Light',
    bgType: 'solid',
    bgColor: '#FAFAFA',
    bgGradient: 'linear-gradient(180deg, #FAFAFA, #F4F4F5)',
    textColor: '#171717',
    accentColor: '#475569',
    fontFamily: 'sans',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    cardBorder: '1px solid rgba(0, 0, 0, 0.06)',
    badgeBg: 'rgba(0, 0, 0, 0.05)',
  },
  elegant: {
    id: 'elegant',
    name: 'Editorial Champagne',
    bgType: 'gradient',
    bgColor: '#FDFBF7',
    bgGradient: 'linear-gradient(180deg, #FAF7F0, #F3ECE0)',
    textColor: '#1A1813',
    accentColor: '#9C824A',
    fontFamily: 'serif',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    cardBorder: '1px solid rgba(156, 130, 74, 0.25)',
    badgeBg: 'rgba(156, 130, 74, 0.12)',
  },
  corporate: {
    id: 'corporate',
    name: 'Executive Corporate Navy',
    bgType: 'gradient',
    bgColor: '#0B132B',
    bgGradient: 'linear-gradient(135deg, #0B132B, #1C2541, #3A506B)',
    textColor: '#F8FAFC',
    accentColor: '#38BDF8',
    fontFamily: 'sans',
    cardBg: 'rgba(28, 37, 65, 0.8)',
    cardBorder: '1px solid rgba(56, 189, 248, 0.25)',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
  },
  cyber: {
    id: 'cyber',
    name: 'Neon Cyber Lounge',
    bgType: 'gradient',
    bgColor: '#080510',
    bgGradient: 'linear-gradient(135deg, #090514, #120A2A, #1C0A35)',
    textColor: '#E0E7FF',
    accentColor: '#10B981',
    fontFamily: 'mono',
    cardBg: 'rgba(18, 10, 42, 0.65)',
    cardBorder: '1px solid rgba(168, 85, 247, 0.35)',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
  },
};

export const getFontClass = (family?: 'sans' | 'serif' | 'mono'): string => {
  switch (family) {
    case 'serif':
      return 'font-serif tracking-tight';
    case 'mono':
      return 'font-mono tracking-tight';
    case 'sans':
    default:
      return 'font-sans tracking-tight';
  }
};

export function getBackgroundStyle(
  bgType?: string,
  bgColor?: string,
  bgGradient?: string,
  bgImageUrl?: string,
  bgOpacity?: number,
  bgBlur?: number,
  themeId?: string
): React.CSSProperties {
  const op = bgOpacity !== undefined ? bgOpacity / 100 : 0.8;
  const blurPx = bgBlur !== undefined ? bgBlur : 10;
  
  // If we are using a specific theme background preset
  if (themeId && themeId !== 'custom' && (!bgType || bgType === themeId)) {
    const preset = THEME_PRESETS[themeId];
    if (preset) {
      if (preset.bgType === 'solid') {
        return { backgroundColor: preset.bgColor };
      }
      return { backgroundImage: preset.bgGradient };
    }
  }

  switch (bgType) {
    case 'solid':
      return { backgroundColor: bgColor || '#0A0A0A' };
    case 'gradient':
      return { backgroundImage: bgGradient || 'linear-gradient(135deg, #0F172A, #1E1B4B)' };
    case 'image':
      return {
        backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: op,
        filter: `blur(${blurPx}px)`,
      };
    case 'blur_glass':
      return {
        background: 'rgba(15, 23, 42, 0.15)',
        backdropFilter: `blur(${blurPx}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(180%)`,
      };
    case 'minimal_light':
      return { backgroundColor: '#FAFAFA' };
    case 'minimal_dark':
      return { backgroundColor: '#0A0A0A' };
    case 'elegant':
      return { backgroundImage: 'linear-gradient(180deg, #FAF7F0, #F3ECE0)' };
    case 'wedding':
      return { backgroundImage: 'linear-gradient(135deg, #FFF5F5, #FFF0F5, #FDF5E6)' };
    case 'corporate':
      return { backgroundImage: 'linear-gradient(135deg, #0B132B, #1C2541, #3A506B)' };
    case 'custom':
    default:
      if (bgImageUrl) {
        return {
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      return { backgroundImage: bgGradient || 'linear-gradient(135deg, #0F172A, #1E1B4B)' };
  }
}
