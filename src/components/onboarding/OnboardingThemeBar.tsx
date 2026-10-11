import React from 'react';
import { Sun, Moon, Sparkles, Camera, Film, Layout, Check, Palette } from 'lucide-react';
import { CreateExperienceThemeId, CreateAppearanceMode, CREATE_EXPERIENCE_THEMES } from '../../lib/createExperienceThemes';
import { useTranslation } from '../../lib/useTranslation';

interface OnboardingThemeBarProps {
  currentTheme: CreateExperienceThemeId;
  onThemeChange: (themeId: CreateExperienceThemeId) => void;
  appearance: CreateAppearanceMode;
  onToggleAppearance: () => void;
}

export default function OnboardingThemeBar({
  currentTheme,
  onThemeChange,
  appearance,
  onToggleAppearance,
}: OnboardingThemeBarProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';

  const getThemeIcon = (id: CreateExperienceThemeId) => {
    switch (id) {
      case 'editorial_photo':
        return <Camera className="w-3.5 h-3.5 shrink-0" />;
      case 'cinematic_memory':
        return <Film className="w-3.5 h-3.5 shrink-0" />;
      case 'soft_celebration':
        return <Sparkles className="w-3.5 h-3.5 shrink-0" />;
      case 'clean_minimal':
      default:
        return <Layout className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <div
      className={`w-full py-2.5 px-4 rounded-2xl border transition-all duration-300 flex flex-wrap items-center justify-between gap-3 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/80 shadow-md backdrop-blur-md text-slate-200'
          : 'bg-white/90 border-slate-200/80 shadow-xs backdrop-blur-md text-slate-800'
      }`}
      id="onboarding-theme-bar"
    >
      {/* Theme Selector Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-0.5">
        <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">{t('onboarding.theme_label', 'Experience Theme')}:</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {CREATE_EXPERIENCE_THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onThemeChange(theme.id)}
                className={`group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? isDark
                      ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                      : 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : isDark
                    ? 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    : 'bg-slate-100/80 text-slate-600 border-transparent hover:bg-slate-200/60 hover:text-slate-900'
                }`}
                id={`btn-theme-${theme.id}`}
                title={theme.description}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: theme.swatchGradient }}
                />
                <span className="hidden md:inline text-[10px] font-mono text-slate-400 group-hover:text-slate-300">
                  {theme.themeNumber.replace('Theme ', 'T')} •
                </span>
                <span>{theme.name}</span>
                {isSelected && <Check className="w-3 h-3 ml-0.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Appearance Switch (Light / Dark) */}
      <div className="flex items-center space-x-2 ml-auto">
        <button
          type="button"
          onClick={onToggleAppearance}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 border-slate-200 shadow-2xs'
          }`}
          id="btn-onboarding-appearance-toggle"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <>
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] font-mono font-bold">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-mono font-bold">Light</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
