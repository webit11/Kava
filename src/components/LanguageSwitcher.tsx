import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../lib/useTranslation';
import { SupportedLanguageCode } from '../types';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'minimal' | 'dark';
  showLabel?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'default',
  showLabel = true,
  className = ''
}: LanguageSwitcherProps) {
  const { lang, setLanguage, supportedLanguages, currentLanguageObj } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Styling variant definitions
  const getButtonStyles = () => {
    switch (variant) {
      case 'dark':
        return 'px-2 sm:px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-full text-xs font-extrabold';
      case 'minimal':
        return 'px-1.5 sm:px-2 py-1 text-slate-600 hover:text-slate-900 text-xs font-bold hover:bg-slate-100 rounded-lg';
      case 'compact':
      case 'default':
      default:
        return 'px-2 sm:px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-2xs rounded-full text-xs font-extrabold tracking-wide';
    }
  };

  return (
    <div className={`relative inline-block text-left shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${getButtonStyles()}`}
        aria-label="Select Language"
        title="Change Language"
      >
        <span className="text-sm leading-none shrink-0">{currentLanguageObj.flag}</span>
        
        {/* Flag + Short Code ALWAYS visible on all screen sizes */}
        <span className="font-mono text-xs font-extrabold tracking-wider uppercase">
          {currentLanguageObj.displayCode || currentLanguageObj.code.toUpperCase()}
        </span>

        {/* Chevron down */}
        <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 py-2 z-50 animate-fade-in divide-y divide-slate-100">
          <div className="px-3.5 py-2 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'id' ? 'Pilih Bahasa' : lang === 'vi' ? 'Chọn ngôn ngữ' : lang === 'zh' ? '选择语言' : lang === 'ja' ? '言語を選択' : lang === 'th' ? 'เลือกภาษา' : lang === 'ko' ? '언어 선택' : 'Language'}</span>
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold">
              7 Languages
            </span>
          </div>

          <div className="py-1.5 max-h-72 overflow-y-auto scrollbar-thin">
            {supportedLanguages.map((l) => {
              const isSelected = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate pr-2">
                    <span className="text-base leading-none">{l.flag}</span>
                    <div className="flex flex-col truncate">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold truncate">{l.nativeName}</span>
                        <span className={`font-mono text-[10px] px-1 py-0.2 rounded ${isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'}`}>
                          {l.displayCode || l.code.toUpperCase()}
                        </span>
                      </div>
                      <span className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {l.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
