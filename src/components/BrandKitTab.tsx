import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Upload, Camera, Check, Search, Heart, History, Sparkles, 
  ChevronDown, X, Eye, Palette, Trash2, Copy,
  Signal, Wifi, Smartphone, Monitor, Mail, LayoutDashboard, QrCode,
  Layers, ArrowRight, RotateCcw, CheckCircle2,
  Share2, Sliders, ShieldCheck, Zap, Globe, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveWorkspaceBrandKit, DEFAULT_BRAND_KIT, applyBrandKitCSSVariables, loadGoogleFont } from '../lib/brandKit';

// Font definition interface
interface FontDefinition {
  name: string;
  category: 'Sans Serif' | 'Serif' | 'Display' | 'Monospace' | 'Handwriting';
  fallback: 'sans-serif' | 'serif' | 'monospace' | 'cursive';
  weights: number[];
}

const GOOGLE_FONTS: FontDefinition[] = [
  // Sans Serif
  { name: 'Inter', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Plus Jakarta Sans', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'DM Sans', category: 'Sans Serif', fallback: 'sans-serif', weights: [400, 500, 700] },
  { name: 'Montserrat', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'Poppins', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Outfit', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Work Sans', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Rubik', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Nunito', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Raleway', category: 'Sans Serif', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },

  // Serif
  { name: 'Playfair Display', category: 'Serif', fallback: 'serif', weights: [400, 500, 600, 700, 800, 900] },
  { name: 'Cormorant Garamond', category: 'Serif', fallback: 'serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Cinzel', category: 'Serif', fallback: 'serif', weights: [400, 500, 600, 700, 800, 900] },
  { name: 'Lora', category: 'Serif', fallback: 'serif', weights: [400, 500, 600, 700] },
  { name: 'Merriweather', category: 'Serif', fallback: 'serif', weights: [300, 400, 700, 900] },
  { name: 'EB Garamond', category: 'Serif', fallback: 'serif', weights: [400, 500, 600, 700, 800] },
  { name: 'Libre Baskerville', category: 'Serif', fallback: 'serif', weights: [400, 700] },
  { name: 'Noto Serif', category: 'Serif', fallback: 'serif', weights: [300, 400, 500, 600, 700, 800] },

  // Display
  { name: 'Space Grotesk', category: 'Display', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Syne', category: 'Display', fallback: 'sans-serif', weights: [400, 500, 600, 700, 800] },
  { name: 'Unbounded', category: 'Display', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Righteous', category: 'Display', fallback: 'sans-serif', weights: [400] },
  { name: 'Comfortaa', category: 'Display', fallback: 'sans-serif', weights: [300, 400, 500, 600, 700] },

  // Monospace
  { name: 'JetBrains Mono', category: 'Monospace', fallback: 'monospace', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Space Mono', category: 'Monospace', fallback: 'monospace', weights: [400, 700] },
  { name: 'Fira Code', category: 'Monospace', fallback: 'monospace', weights: [300, 400, 500, 600, 700] },
  { name: 'Source Code Pro', category: 'Monospace', fallback: 'monospace', weights: [300, 400, 500, 600, 700, 800] },

  // Handwriting
  { name: 'Caveat', category: 'Handwriting', fallback: 'cursive', weights: [400, 500, 600, 700] },
  { name: 'Great Vibes', category: 'Handwriting', fallback: 'cursive', weights: [400] },
  { name: 'Dancing Script', category: 'Handwriting', fallback: 'cursive', weights: [400, 500, 600, 700] },
  { name: 'Sacramento', category: 'Handwriting', fallback: 'cursive', weights: [400] }
];

// Curated Palettes for instant 1-click styling
const CURATED_PALETTES = [
  { name: 'Obsidian & Champagne', primary: '#0F172A', accent: '#C19A2E', font: 'Playfair Display' },
  { name: 'Emerald Velvet', primary: '#064E3B', accent: '#10B981', font: 'Plus Jakarta Sans' },
  { name: 'Sapphire Indigo', primary: '#1E1B4B', accent: '#4F46E5', font: 'Inter' },
  { name: 'Crimson Rose', primary: '#4C0519', accent: '#E11D48', font: 'Cormorant Garamond' },
  { name: 'Nordic Cyber', primary: '#09090B', accent: '#06B6D4', font: 'Space Grotesk' },
  { name: 'Warm Terracotta', primary: '#431407', accent: '#EA580C', font: 'Outfit' },
];

const LOGO_PRESETS = [
  { 
    label: 'KAVA Minimal Wordmark', 
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&h=80&q=80' 
  },
  { 
    label: 'Luxe Monogram Crest', 
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=240&h=80&q=80' 
  },
  { 
    label: 'Studio Atelier Signature', 
    url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=240&h=80&q=80' 
  }
];

// Color utility helpers
function parseColorToRgba(colorStr: string): { r: number, g: number, b: number, a: number } {
  const fallback = { r: 15, g: 23, b: 42, a: 1 };
  if (!colorStr) return fallback;
  
  const str = colorStr.trim().toLowerCase();
  
  if (str.startsWith('#')) {
    let hex = str.substring(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length === 4) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    let a = 1;
    if (hex.length === 8) {
      a = Math.round((parseInt(hex.substring(6, 8), 16) / 255) * 100) / 100;
    }
    return { r, g, b, a };
  }
  
  if (str.startsWith('rgb')) {
    const parts = str.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      const r = parseInt(parts[0], 10);
      const g = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      const a = parts[3] ? parseFloat(parts[3]) : 1;
      return { r, g, b, a };
    }
  }

  if (str.startsWith('hsl')) {
    const parts = str.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      const h = parseInt(parts[0], 10);
      const s = parseInt(parts[1], 10);
      const l = parseInt(parts[2], 10);
      const a = parts[3] ? parseFloat(parts[3]) : 1;
      const { r, g, b } = hslToRgb(h, s, l);
      return { r, g, b, a };
    }
  }
  
  return fallback;
}

function hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4))
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (x: number) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  if (a < 1) {
    const alphaHex = toHex(a * 255);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`.toLowerCase();
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

interface CustomColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  description: string;
  badge: string;
  badgeColor: string;
}

function CustomColorPicker({ color, onChange, label, description, badge, badgeColor }: CustomColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'below' | 'above'>('below');
  const [colorMode, setColorMode] = useState<'HEX' | 'RGB' | 'HSL'>('HEX');
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  const { r, g, b, a: alpha } = parseColorToRgba(color);
  const { h, s, l } = rgbToHsl(r, g, b);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 340 && rect.top > 340) {
        setPosition('above');
      } else {
        setPosition('below');
      }
    }
  }, [isOpen]);

  const handleSliderChange = (type: 'h' | 's' | 'l' | 'a', value: number) => {
    let newColor = '';
    if (type === 'h') {
      const { r: nr, g: ng, b: nb } = hslToRgb(value, s, l);
      newColor = rgbaToHex(nr, ng, nb, alpha);
    } else if (type === 's') {
      const { r: nr, g: ng, b: nb } = hslToRgb(h, value, l);
      newColor = rgbaToHex(nr, ng, nb, alpha);
    } else if (type === 'l') {
      const { r: nr, g: ng, b: nb } = hslToRgb(h, s, value);
      newColor = rgbaToHex(nr, ng, nb, alpha);
    } else if (type === 'a') {
      newColor = rgbaToHex(r, g, b, value);
    }
    onChange(newColor);
  };

  const formattedColorString = () => {
    if (colorMode === 'RGB') {
      return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
    }
    if (colorMode === 'HSL') {
      return alpha < 1 ? `hsla(${h}, ${s}%, ${l}%, ${alpha})` : `hsl(${h}, ${s}%, ${l}%)`;
    }
    return color.toUpperCase();
  };

  const PRESET_SWATCHES = [
    '#0F172A', '#1E293B', '#09090B', '#1E1B4B', '#064E3B', 
    '#4C0519', '#C19A2E', '#10B981', '#4F46E5', '#E11D48',
    '#06B6D4', '#EA580C', '#A855F7', '#F59E0B', '#3B82F6'
  ];

  return (
    <div className="relative w-full" ref={popoverRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-slate-800 tracking-tight">{label}</label>
        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className="text-[11px] text-slate-500 mb-2 leading-tight">{description}</p>
      
      <div 
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 cursor-pointer shadow-xs hover:border-slate-300 transition-all select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="relative h-6 w-6 rounded-lg shadow-inner overflow-hidden flex-shrink-0 border border-slate-200">
            <div className="absolute inset-0 bg-slate-100" />
            <div className="absolute inset-0" style={{ backgroundColor: color }} />
          </div>
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">{color}</span>
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: position === 'above' ? 8 : -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'above' ? 8 : -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 w-80 space-y-4 right-0 lg:left-0 ${
              position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            {/* Header & Mode Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg shadow-inner overflow-hidden border border-slate-200 shrink-0" style={{ backgroundColor: color }} />
                <input
                  type="text"
                  value={formattedColorString()}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:bg-white"
                />
              </div>
              <div className="flex p-0.5 bg-slate-100 rounded-md gap-0.5">
                {(['HEX', 'RGB', 'HSL'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setColorMode(m)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      colorMode === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                  <span>HUE</span>
                  <span>{h}°</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="360"
                  value={h}
                  onChange={(e) => handleSliderChange('h', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                  }}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                  <span>SATURATION</span>
                  <span>{s}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={s}
                  onChange={(e) => handleSliderChange('s', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`
                  }}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                  <span>LIGHTNESS</span>
                  <span>{l}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={l}
                  onChange={(e) => handleSliderChange('l', parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #000 0%, hsl(${h}, ${s}%, 50%) 50%, #fff 100%)`
                  }}
                />
              </div>
            </div>

            {/* Quick Swatches */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Preset Swatches</span>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => onChange(swatch)}
                    className={`h-6 rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer relative flex items-center justify-center border border-black/10 ${
                      color.toLowerCase() === swatch.toLowerCase() ? 'ring-2 ring-slate-900' : ''
                    }`}
                    style={{ backgroundColor: swatch }}
                  >
                    {color.toLowerCase() === swatch.toLowerCase() && (
                      <Check className="w-3 h-3 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TypographySelectionProps {
  value: string;
  onChange: (font: string) => void;
  weight: string;
  onWeightChange: (weight: string) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  fallback: string;
  onFallbackChange: (fallback: string) => void;
}

function ProfessionalFontPicker({
  value,
  onChange,
  weight,
  onWeightChange,
  scale,
  onScaleChange,
  fallback,
  onFallbackChange
}: TypographySelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Sans Serif' | 'Serif' | 'Display' | 'Monospace' | 'Handwriting'>('All');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kava_brand_favorite_fonts');
      return saved ? JSON.parse(saved) : ['Playfair Display', 'Plus Jakarta Sans', 'Space Grotesk'];
    } catch {
      return ['Playfair Display', 'Plus Jakarta Sans', 'Space Grotesk'];
    }
  });

  const toggleFavorite = (fontName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(fontName)) {
      updated = favorites.filter(f => f !== fontName);
    } else {
      updated = [...favorites, fontName];
    }
    setFavorites(updated);
    localStorage.setItem('kava_brand_favorite_fonts', JSON.stringify(updated));
  };

  const selectFont = (font: FontDefinition) => {
    onChange(font.name);
    onFallbackChange(font.fallback);
    const defaultWeight = font.weights.includes(600) ? '600' : font.weights.includes(500) ? '500' : font.weights[0].toString();
    onWeightChange(defaultWeight);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadGoogleFont(value);
    favorites.forEach(loadGoogleFont);
  }, [value, favorites]);

  useEffect(() => {
    if (isOpen) {
      GOOGLE_FONTS.forEach(font => loadGoogleFont(font.name));
    }
  }, [isOpen]);

  const activeFontDef = GOOGLE_FONTS.find(f => f.name === value) || GOOGLE_FONTS[0];

  const filteredFonts = GOOGLE_FONTS.filter(font => {
    const matchesSearch = font.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-3 relative w-full" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 tracking-tight">Typography Family</label>
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          Google Fonts System
        </span>
      </div>

      {/* Trigger button */}
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 cursor-pointer shadow-xs transition-all select-none"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
            Aa
          </div>
          <div className="text-left min-w-0">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
              {activeFontDef.category}
            </span>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate mt-0.5" style={{ fontFamily: `"${value}", ${activeFontDef.fallback}` }}>
              {value}
            </h4>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>

      {/* Weight & Scale Sub-Controls */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Font Weight</label>
          <select
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white"
          >
            {activeFontDef.weights.map((w) => (
              <option key={w} value={w.toString()}>
                {w === 300 ? '300 - Light' : w === 400 ? '400 - Regular' : w === 500 ? '500 - Medium' : w === 600 ? '600 - Semi-Bold' : w === 700 ? '700 - Bold' : w === 800 ? '800 - Extra Bold' : `${w}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Heading Scale</label>
            <span className="text-[10px] font-mono font-bold text-slate-600">{(scale * 100).toFixed(0)}%</span>
          </div>
          <input 
            type="range"
            min="0.85"
            max="1.25"
            step="0.05"
            value={scale}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-200 appearance-none cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* Font Picker Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[9998]"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full md:w-[700px] max-w-[95vw] bg-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden max-h-[80vh] border border-slate-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Select Brand Typeface</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Applied to titles, guest greetings, and presentation screens.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search & Category Tabs */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-3 shrink-0">
                  <div className="flex items-center space-x-2 bg-white rounded-xl px-3 py-2 border border-slate-200">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Google Fonts (e.g. Playfair, Inter, Syne)..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-transparent border-none text-xs font-medium text-slate-800 focus:outline-none flex-1"
                      autoFocus
                    />
                    {search && (
                      <button type="button" onClick={() => setSearch('')} className="p-0.5 hover:bg-slate-100 rounded">
                        <X className="w-3 h-3 text-slate-400" />
                      </button>
                    )}
                  </div>

                  <div className="flex p-1 bg-slate-200/60 rounded-xl overflow-x-auto gap-1">
                    {(['All', 'Sans Serif', 'Serif', 'Display', 'Monospace', 'Handwriting'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {filteredFonts.map((font) => (
                    <div 
                      key={font.name}
                      onClick={() => selectFont(font)}
                      className={`flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer border ${
                        value === font.name 
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' 
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                      }`}
                    >
                      <div className="min-w-[150px] text-left">
                        <span className="text-xs font-bold text-slate-900">{font.name}</span>
                        <span className="text-[9px] font-mono text-slate-400 block">{font.category}</span>
                      </div>
                      <div className="flex-1 text-left min-w-0 px-4">
                        <p 
                          className="text-base text-slate-800 truncate"
                          style={{ fontFamily: `"${font.name}", ${font.fallback}` }}
                        >
                          The quick brown fox jumps over the lazy dog
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button 
                          type="button"
                          onClick={(e) => toggleFavorite(font.name, e)}
                          className="text-slate-300 hover:text-rose-500 p-1"
                        >
                          <Heart className={`w-3.5 h-3.5 ${favorites.includes(font.name) ? 'text-rose-500 fill-rose-500' : ''}`} />
                        </button>
                        {value === font.name && (
                          <div className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface BrandKitTabProps {
  currentWorkspace: { id: string; name: string; host: string };
  events: any[];
  onUpdateEventSettings: (eventId: string, settings: any) => void;
  setToast: (toast: any) => void;
  workspaceBrandLogo: string;
  setWorkspaceBrandLogo: (logo: string) => void;
  workspaceBrandPrimaryColor: string;
  setWorkspaceBrandPrimaryColor: (color: string) => void;
  workspaceBrandAccentColor: string;
  setWorkspaceBrandAccentColor: (color: string) => void;
  workspaceBrandTypography: string;
  setWorkspaceBrandTypography: (font: string) => void;
  isWorkspaceBrandDirty: boolean;
  setIsWorkspaceBrandDirty: (dirty: boolean) => void;
  brandPreviewTab: 'guest_room' | 'invitation' | 'live_screen' | 'qr_landing' | 'email' | 'dashboard';
  setBrandPreviewTab: (tab: any) => void;
  logoInputRef: React.RefObject<HTMLInputElement>;
}

export default function BrandKitTab({
  currentWorkspace,
  events,
  onUpdateEventSettings,
  setToast,
  workspaceBrandLogo,
  setWorkspaceBrandLogo,
  workspaceBrandPrimaryColor,
  setWorkspaceBrandPrimaryColor,
  workspaceBrandAccentColor,
  setWorkspaceBrandAccentColor,
  workspaceBrandTypography,
  setWorkspaceBrandTypography,
  isWorkspaceBrandDirty,
  setIsWorkspaceBrandDirty,
  brandPreviewTab,
  setBrandPreviewTab,
  logoInputRef
}: BrandKitTabProps) {

  // Load typography details from LocalStorage
  const [typographyWeight, setTypographyWeight] = useState<string>(() => {
    return localStorage.getItem(`kava_brand_typography_weight_${currentWorkspace.id}`) || '600';
  });
  const [typographyScale, setTypographyScale] = useState<number>(() => {
    return parseFloat(localStorage.getItem(`kava_brand_typography_scale_${currentWorkspace.id}`) || '1.0');
  });
  const [typographyFallback, setTypographyFallback] = useState<string>(() => {
    return localStorage.getItem(`kava_brand_typography_fallback_${currentWorkspace.id}`) || 'serif';
  });

  // Device orientation / mockup style toggle: phone vs tablet/desktop card
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  // Micro-interaction state inside the phone preview
  const [previewGuestWish, setPreviewGuestWish] = useState('');
  const [hasInteractedUpload, setHasInteractedUpload] = useState(false);
  const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState('');

  // Whenever values change, raise dirty flag and notify preview panels instantly
  const triggerLiveUpdate = (
    logo: string,
    primary: string,
    accent: string,
    typo: string,
    weight: string,
    scaleVal: number,
    fallbackVal: string
  ) => {
    setIsWorkspaceBrandDirty(true);

    applyBrandKitCSSVariables({
      logoUrl: logo,
      primaryColor: primary,
      accentColor: accent,
      typography: typo,
      typographyWeight: weight,
      typographyScale: scaleVal,
      typographyFallback: fallbackVal,
    });

    window.dispatchEvent(new CustomEvent('kava_brand_kit_updated', {
      detail: {
        workspaceId: currentWorkspace.id,
        brandKit: {
          logoUrl: logo,
          primaryColor: primary,
          accentColor: accent,
          typography: typo,
          typographyWeight: weight,
          typographyScale: scaleVal,
          typographyFallback: fallbackVal
        }
      }
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB.',
        items: []
      });
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (!dataUrl) return;
        setWorkspaceBrandLogo(dataUrl);
        triggerLiveUpdate(
          dataUrl,
          workspaceBrandPrimaryColor,
          workspaceBrandAccentColor,
          workspaceBrandTypography,
          typographyWeight,
          typographyScale,
          typographyFallback
        );
        setToast({
          title: 'Logo Updated in Preview',
          description: 'Your brand logo has been updated and synchronized in the preview.',
          items: ['Click "Save Brand Kit" to persist changes to the workspace database']
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setToast({
        title: 'Upload Error',
        description: 'Failed to process uploaded logo image.',
        items: []
      });
    }
  };

  const handleApplyPalette = (palette: typeof CURATED_PALETTES[0]) => {
    setWorkspaceBrandPrimaryColor(palette.primary);
    setWorkspaceBrandAccentColor(palette.accent);
    setWorkspaceBrandTypography(palette.font);
    triggerLiveUpdate(
      workspaceBrandLogo,
      palette.primary,
      palette.accent,
      palette.font,
      typographyWeight,
      typographyScale,
      typographyFallback
    );
    setToast({
      title: `Applied "${palette.name}" Palette`,
      description: 'Brand colors and typography updated in real-time preview.',
      items: ['Primary: ' + palette.primary, 'Accent: ' + palette.accent, 'Font: ' + palette.font]
    });
  };

  const handleApplyLogoPreset = (preset: typeof LOGO_PRESETS[0]) => {
    setWorkspaceBrandLogo(preset.url);
    triggerLiveUpdate(
      preset.url,
      workspaceBrandPrimaryColor,
      workspaceBrandAccentColor,
      workspaceBrandTypography,
      typographyWeight,
      typographyScale,
      typographyFallback
    );
  };

  const handleApplyCustomUrl = () => {
    if (!customLogoUrl) return;
    setWorkspaceBrandLogo(customLogoUrl);
    triggerLiveUpdate(
      customLogoUrl,
      workspaceBrandPrimaryColor,
      workspaceBrandAccentColor,
      workspaceBrandTypography,
      typographyWeight,
      typographyScale,
      typographyFallback
    );
    setIsUrlInputOpen(false);
  };

  const handleSaveBrandKit = () => {
    try {
      saveWorkspaceBrandKit(currentWorkspace.id, {
        logoUrl: workspaceBrandLogo,
        primaryColor: workspaceBrandPrimaryColor,
        accentColor: workspaceBrandAccentColor,
        typography: workspaceBrandTypography,
        typographyWeight,
        typographyScale,
        typographyFallback,
      });

      setIsWorkspaceBrandDirty(false);

      // Synchronize across all workspace events that do not override branding
      let updatedCount = 0;
      events.forEach(evt => {
        if (evt.settings?.overrideWorkspaceBrand) {
          return;
        }
        updatedCount++;
        onUpdateEventSettings(evt.id, {
          settings: {
            ...evt.settings,
            globalBrandLogo: workspaceBrandLogo,
            globalColorAccent: workspaceBrandAccentColor,
            presentationFontFamily: workspaceBrandTypography,
          }
        });
      });

      setToast({
        title: 'Brand Kit Saved Successfully',
        description: 'Workspace branding is persisted and propagated across all surfaces.',
        items: [
          `Active single source of truth for workspace: ${currentWorkspace.name}`,
          `Propagated to ${updatedCount} event capsule(s)`,
          'Design tokens applied to Guest Room, Invitation, Live Screen, QR Landing, Email, and Dashboard'
        ]
      });
    } catch (err) {
      console.error(err);
      setToast({
        title: 'Database Save Error',
        description: 'Failed to write workspace branding parameters to storage.',
        items: []
      });
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Are you sure you want to restore workspace branding to default KAVA settings?")) {
      setWorkspaceBrandLogo(DEFAULT_BRAND_KIT.logoUrl);
      setWorkspaceBrandPrimaryColor(DEFAULT_BRAND_KIT.primaryColor);
      setWorkspaceBrandAccentColor(DEFAULT_BRAND_KIT.accentColor);
      setWorkspaceBrandTypography(DEFAULT_BRAND_KIT.typography);
      setTypographyWeight(DEFAULT_BRAND_KIT.typographyWeight);
      setTypographyScale(DEFAULT_BRAND_KIT.typographyScale);
      setTypographyFallback(DEFAULT_BRAND_KIT.typographyFallback);

      saveWorkspaceBrandKit(currentWorkspace.id, DEFAULT_BRAND_KIT);
      setIsWorkspaceBrandDirty(false);

      setToast({
        title: 'Restored to KAVA Defaults',
        description: 'Branding options have been reset to default values.',
        items: []
      });
    }
  };

  const handleCopyCssTokens = () => {
    const tokens = `/* KAVA Workspace Brand Tokens (${currentWorkspace.name}) */
:root {
  --brand-primary: ${workspaceBrandPrimaryColor};
  --brand-accent: ${workspaceBrandAccentColor};
  --brand-font: "${workspaceBrandTypography}", ${typographyFallback};
  --brand-logo: url("${workspaceBrandLogo}");
  --brand-typography-scale: ${typographyScale};
  --brand-typography-weight: ${typographyWeight};
}`;
    navigator.clipboard.writeText(tokens);
    setToast({
      title: 'CSS Tokens Copied',
      description: 'CSS variables copied to your clipboard.',
      items: ['--brand-primary', '--brand-accent', '--brand-font']
    });
  };

  // Previews typographer style generator
  const getBrandTypographyStyle = () => {
    return {
      fontFamily: `"${workspaceBrandTypography}", ${typographyFallback}`,
      fontWeight: typographyWeight,
    };
  };

  // Calculation of event branding inheritance statistics
  const eventsInheriting = useMemo(() => {
    return events.filter(e => !e.settings?.overrideWorkspaceBrand);
  }, [events]);

  const eventsOverridden = useMemo(() => {
    return events.filter(e => e.settings?.overrideWorkspaceBrand);
  }, [events]);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Top Banner: Master Branding Architecture & Cascade Purpose */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-slate-200 border border-white/10">
                Workspace Central Brand Hub
              </span>
              <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Single Source of Truth</span>
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Workspace Brand Kit & Assets
            </h2>
            
            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              <strong className="text-white font-semibold">Configure your workspace branding once</strong>, and it automatically applies across <span className="underline decoration-slate-600 underline-offset-4 font-medium text-slate-100">Guest Room, Invitation, Live Screen, QR Landing, Email, and Dashboard</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopyCssTokens}
              className="flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy CSS Tokens</span>
            </button>

            <button
              type="button"
              onClick={handleSaveBrandKit}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Save Brand Kit</span>
            </button>
          </div>
        </div>

        {/* Surface Cascade Matrix Chips */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase mr-1">Cascades to:</span>
          {[
            { id: 'guest_room', label: 'Guest Room', icon: Smartphone },
            { id: 'invitation', label: 'Invitation', icon: Share2 },
            { id: 'live_screen', label: 'Live Screen', icon: Monitor },
            { id: 'qr_landing', label: 'QR Landing', icon: QrCode },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setBrandPreviewTab(item.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                brandPreviewTab === item.id 
                  ? 'bg-white text-slate-950 font-bold shadow-xs' 
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Settings & Controls vs Right Device Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Brand Kit Controls (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Style Presets Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Curated Brand Palettes</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">1-Click Theme Sync</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CURATED_PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => handleApplyPalette(palette)}
                  className="flex items-center space-x-2.5 p-2 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group cursor-pointer"
                >
                  <div className="flex -space-x-1 shrink-0">
                    <span className="w-4 h-4 rounded-full border border-white shadow-2xs" style={{ backgroundColor: palette.primary }} />
                    <span className="w-4 h-4 rounded-full border border-white shadow-2xs" style={{ backgroundColor: palette.accent }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-slate-950">{palette.name}</p>
                    <p className="text-[9px] text-slate-400 truncate">{palette.font}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Setting 1: Workspace Brand Logo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Workspace Brand Logo</h3>
                <p className="text-xs text-slate-500 mt-0.5">Primary vector mark or wordmark rendered across all workspace capsules.</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                All Surfaces
              </span>
            </div>

            <input 
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {/* Logo Preview Card & Uploader */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light background preview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col items-center justify-center text-center space-y-2 relative group min-h-[110px]">
                <span className="absolute top-2 left-2 text-[9px] font-mono font-bold text-slate-400 uppercase">On Light Surface</span>
                {workspaceBrandLogo ? (
                  <img 
                    src={workspaceBrandLogo} 
                    alt="Logo Light" 
                    className="h-10 max-h-10 max-w-[140px] object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs font-black tracking-widest text-slate-800">KAVA</span>
                )}
              </div>

              {/* Dark background preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2 relative min-h-[110px]">
                <span className="absolute top-2 left-2 text-[9px] font-mono font-bold text-slate-500 uppercase">On Dark Surface</span>
                {workspaceBrandLogo ? (
                  <img 
                    src={workspaceBrandLogo} 
                    alt="Logo Dark" 
                    className="h-10 max-h-10 max-w-[140px] object-contain brightness-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs font-black tracking-widest text-white">KAVA</span>
                )}
              </div>
            </div>

            {/* Upload Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo File (PNG/SVG)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUrlInputOpen(!isUrlInputOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>URL Link</span>
              </button>

              {workspaceBrandLogo !== DEFAULT_BRAND_KIT.logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceBrandLogo(DEFAULT_BRAND_KIT.logoUrl);
                    triggerLiveUpdate(
                      DEFAULT_BRAND_KIT.logoUrl,
                      workspaceBrandPrimaryColor,
                      workspaceBrandAccentColor,
                      workspaceBrandTypography,
                      typographyWeight,
                      typographyScale,
                      typographyFallback
                    );
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ml-auto"
                >
                  Reset Logo
                </button>
              )}
            </div>

            {/* URL Input dropdown */}
            {isUrlInputOpen && (
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="url"
                  placeholder="https://your-domain.com/logo.png"
                  value={customLogoUrl}
                  onChange={(e) => setCustomLogoUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Quick Logo Style Presets */}
            <div className="pt-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Preset Logo Styles</span>
              <div className="flex flex-wrap gap-2">
                {LOGO_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyLogoPreset(preset)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Setting 2: Color Design Tokens */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Color Design Tokens</h3>
                <p className="text-xs text-slate-500 mt-0.5">Primary controls headers and structural backgrounds; Accent controls CTAs, highlights, and QR marks.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const p = workspaceBrandPrimaryColor;
                  const a = workspaceBrandAccentColor;
                  setWorkspaceBrandPrimaryColor(a);
                  setWorkspaceBrandAccentColor(p);
                  triggerLiveUpdate(
                    workspaceBrandLogo,
                    a,
                    p,
                    workspaceBrandTypography,
                    typographyWeight,
                    typographyScale,
                    typographyFallback
                  );
                }}
                className="flex items-center space-x-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Swap Tokens</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CustomColorPicker 
                label="Primary Brand Color"
                description="Controls navigation headers, sidebars, email top-bands, and live wall frames."
                badge="Structural"
                badgeColor="bg-slate-100 text-slate-800"
                color={workspaceBrandPrimaryColor}
                onChange={(c) => {
                  setWorkspaceBrandPrimaryColor(c);
                  triggerLiveUpdate(
                    workspaceBrandLogo,
                    c,
                    workspaceBrandAccentColor,
                    workspaceBrandTypography,
                    typographyWeight,
                    typographyScale,
                    typographyFallback
                  );
                }}
              />

              <CustomColorPicker 
                label="Accent Color"
                description="Controls buttons, upload dropzone active states, QR code markers, and pills."
                badge="Interactive & CTAs"
                badgeColor="bg-amber-100 text-amber-800"
                color={workspaceBrandAccentColor}
                onChange={(c) => {
                  setWorkspaceBrandAccentColor(c);
                  triggerLiveUpdate(
                    workspaceBrandLogo,
                    workspaceBrandPrimaryColor,
                    c,
                    workspaceBrandTypography,
                    typographyWeight,
                    typographyScale,
                    typographyFallback
                  );
                }}
              />
            </div>
          </div>

          {/* Setting 3: Typography System */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Typography System</h3>
              <p className="text-xs text-slate-500 mt-0.5">Google Fonts typeface loaded dynamically for headlines, guest greetings, and invitations.</p>
            </div>

            <ProfessionalFontPicker 
              value={workspaceBrandTypography}
              onChange={(f) => {
                setWorkspaceBrandTypography(f);
                triggerLiveUpdate(
                  workspaceBrandLogo,
                  workspaceBrandPrimaryColor,
                  workspaceBrandAccentColor,
                  f,
                  typographyWeight,
                  typographyScale,
                  typographyFallback
                );
              }}
              weight={typographyWeight}
              onWeightChange={(w) => {
                setTypographyWeight(w);
                triggerLiveUpdate(
                  workspaceBrandLogo,
                  workspaceBrandPrimaryColor,
                  workspaceBrandAccentColor,
                  workspaceBrandTypography,
                  w,
                  typographyScale,
                  typographyFallback
                );
              }}
              scale={typographyScale}
              onScaleChange={(s) => {
                setTypographyScale(s);
                triggerLiveUpdate(
                  workspaceBrandLogo,
                  workspaceBrandPrimaryColor,
                  workspaceBrandAccentColor,
                  workspaceBrandTypography,
                  typographyWeight,
                  s,
                  typographyFallback
                );
              }}
              fallback={typographyFallback}
              onFallbackChange={(fb) => {
                setTypographyFallback(fb);
                triggerLiveUpdate(
                  workspaceBrandLogo,
                  workspaceBrandPrimaryColor,
                  workspaceBrandAccentColor,
                  workspaceBrandTypography,
                  typographyWeight,
                  typographyScale,
                  fb
                );
              }}
            />
          </div>

          {/* Workspace Baseline vs Event Custom Override Clarification Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Hierarchy: Workspace Baseline vs Event Overrides
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Workspace Master Kit</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Default</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-snug">
                  Configured on this page. All current ({eventsInheriting.length}) and newly created events automatically inherit these brand tokens.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Event Custom Overrides</span>
                  <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">{eventsOverridden.length} Active</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-snug">
                  Configured individually inside Event Settings for unique clients or themes without altering the workspace baseline.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Reset to Default KAVA Settings
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              {isWorkspaceBrandDirty ? (
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Unsaved changes</span>
                </span>
              ) : (
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Brand Kit Synced</span>
                </span>
              )}

              <button
                type="button"
                onClick={handleSaveBrandKit}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Save Brand Kit
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Device Live Preview (5 cols on lg, sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          
          {/* Header Bar with Live Indicator & Mode Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                  Device Live Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                ⚡ Real-Time Sync
              </span>
            </div>

            {/* 6 Realistic Preview Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'guest_room', label: 'Guest Room' },
                { id: 'invitation', label: 'Invitation' },
                { id: 'live_screen', label: 'Live Wall' },
                { id: 'qr_landing', label: 'QR Landing' },
                { id: 'email', label: 'Email' },
                { id: 'dashboard', label: 'Dashboard' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBrandPreviewTab(tab.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer truncate ${
                    brandPreviewTab === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* The Live Interactive Frame Container */}
          <div className="w-full flex justify-center items-center py-4 bg-slate-100/70 rounded-3xl border border-slate-200/60 relative overflow-hidden">
            
            {/* The Smartphone container */}
            <div className="relative w-[300px] h-[580px] rounded-[44px] bg-slate-950 shadow-2xl overflow-hidden flex flex-col border-[8px] border-slate-900 ring-1 ring-slate-800/80">
              
              {/* Phone Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-950" />
              </div>

              {/* Status Bar */}
              <div className="h-10 pt-2 px-5 flex justify-between items-center bg-transparent text-[10px] font-extrabold font-mono text-slate-800 z-30 select-none">
                <span>9:41</span>
                <div className="flex items-center space-x-1.5">
                  <Signal className="w-3 h-3 text-slate-800" />
                  <Wifi className="w-3 h-3 text-slate-800" />
                  <div className="w-4 h-2 bg-slate-800 rounded-xs p-0.5 flex items-center">
                    <div className="h-full w-full bg-white rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Viewport contents with active preview render */}
              <div className="flex-1 bg-white relative flex flex-col overflow-hidden text-slate-800">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={brandPreviewTab}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex flex-col p-4 overflow-y-auto"
                    style={getBrandTypographyStyle()}
                  >
                    
                    {/* TAB 1: GUEST ROOM VIEW */}
                    {brandPreviewTab === 'guest_room' && (
                      <div className="flex flex-col space-y-3.5 text-center justify-between min-h-full flex-1">
                        
                        {/* Branded Header Bar */}
                        <div 
                          className="p-2.5 rounded-xl shadow-xs flex justify-between items-center text-white transition-colors"
                          style={{ backgroundColor: workspaceBrandPrimaryColor }}
                        >
                          {workspaceBrandLogo ? (
                            <img src={workspaceBrandLogo} alt="Logo" className="h-4 max-h-4 max-w-[90px] object-contain rounded" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-xs font-black tracking-wider font-mono">KAVA</span>
                          )}
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>

                        {/* Event Title & Greeting */}
                        <div className="space-y-1 my-auto">
                          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400">PRIVATE CAPSULE</span>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">The Wedding of Sofia & Leo</h4>
                          <p className="text-[10px] text-slate-500 leading-tight">Capture photos, voice notes, and warm wishes into this memory vault.</p>
                        </div>

                        {/* Interactive Drag/Drop Upload Area */}
                        <div 
                          onClick={() => setHasInteractedUpload(!hasInteractedUpload)}
                          className="border-2 border-dashed rounded-xl p-3 bg-slate-50 flex flex-col items-center justify-center space-y-1.5 cursor-pointer hover:bg-slate-100/80 transition-all"
                          style={{ borderColor: workspaceBrandAccentColor }}
                        >
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-xs"
                            style={{ backgroundColor: workspaceBrandAccentColor }}
                          >
                            <Upload className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-800">
                              {hasInteractedUpload ? '1 Photo Ready for Upload' : 'Tap to Select Media'}
                            </p>
                            <p className="text-[8px] text-slate-400 font-mono">Photos or Videos up to 25MB</p>
                          </div>
                        </div>

                        {/* Written Wish Input */}
                        <input
                          type="text"
                          placeholder="Write a message to Sofia & Leo..."
                          value={previewGuestWish}
                          onChange={(e) => setPreviewGuestWish(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-[10px] text-slate-800 placeholder-slate-400 focus:outline-none"
                        />

                        {/* Primary Action Button styled with Accent Color */}
                        <button 
                          type="button"
                          onClick={() => {
                            setHasInteractedUpload(true);
                            setToast({
                              title: 'Guest Preview Action',
                              description: 'Guest room button clicked! Tokens are actively bound.',
                              items: []
                            });
                          }}
                          className="w-full text-white py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase shadow-sm transition-all cursor-pointer hover:opacity-90 mt-auto"
                          style={{ backgroundColor: workspaceBrandAccentColor }}
                        >
                          Upload to Capsule
                        </button>
                      </div>
                    )}

                    {/* TAB 2: INVITATION VIEW */}
                    {brandPreviewTab === 'invitation' && (
                      <div className="flex flex-col text-center justify-between min-h-full flex-1 p-3.5 rounded-2xl bg-[#FCFAF6] border border-slate-200 relative overflow-hidden">
                        <div 
                          className="absolute inset-1.5 border border-dashed rounded-xl pointer-events-none opacity-40" 
                          style={{ borderColor: workspaceBrandAccentColor }} 
                        />
                        
                        <div className="my-auto space-y-3 z-10">
                          {/* Logo Monogram */}
                          <div className="flex justify-center">
                            {workspaceBrandLogo ? (
                              <img src={workspaceBrandLogo} alt="Logo" className="h-5 max-h-5 max-w-[110px] object-contain rounded" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="h-7 w-7 rounded-full text-white flex items-center justify-center font-extrabold text-xs" style={{ backgroundColor: workspaceBrandPrimaryColor }}>
                                K
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-[7px] uppercase tracking-[0.2em] font-mono font-bold text-slate-400">YOU ARE CORDIALLY INVITED</p>
                            <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">Sofia & Leo's Celebration</h4>
                            <p className="text-[10px] text-slate-500 italic leading-normal">Join us for a beautiful ceremony and reception in Big Sur, California.</p>
                          </div>

                          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs inline-block mx-auto">
                            <p className="text-[8px] font-bold text-slate-800 font-mono uppercase tracking-wider">SATURDAY • JUNE 20, 2026</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">The Glasshouse • Big Sur, CA</p>
                          </div>
                        </div>

                        <button 
                          type="button"
                          className="w-full text-white py-2.5 rounded-xl text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-xs z-10" 
                          style={{ backgroundColor: workspaceBrandAccentColor }}
                        >
                          RSVP & Upload Memories
                        </button>
                      </div>
                    )}

                    {/* TAB 3: LIVE SCREEN WALL VIEW */}
                    {brandPreviewTab === 'live_screen' && (
                      <div className="flex flex-col text-center justify-between min-h-full flex-1 bg-[#090D16] text-white p-3.5 rounded-2xl overflow-hidden">
                        
                        {/* Live Feed Header Bar */}
                        <div 
                          className="flex justify-between items-center p-2 rounded-xl border border-white/10"
                          style={{ backgroundColor: workspaceBrandPrimaryColor }}
                        >
                          <div className="flex items-center space-x-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[7px] font-bold tracking-widest font-mono text-rose-400">LIVE FEED</span>
                          </div>
                          {workspaceBrandLogo ? (
                            <img src={workspaceBrandLogo} alt="Logo" className="h-3.5 max-h-3.5 max-w-[65px] object-contain rounded brightness-125" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-[8px] font-bold font-mono text-slate-300">KAVA</span>
                          )}
                        </div>

                        {/* Live Memory Polaroids */}
                        <div className="grid grid-cols-2 gap-2 my-auto">
                          <div className="bg-white p-1 rounded-lg shadow-md text-slate-900 rotate-[-2deg]">
                            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&h=100&q=80" alt="Memory" className="w-full h-12 object-cover rounded" />
                            <p className="text-[6px] font-bold text-slate-800 font-mono mt-1 text-left">Elena: Incredible day! ❤️</p>
                          </div>
                          <div className="bg-white p-1 rounded-lg shadow-md text-slate-900 rotate-[3deg]">
                            <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=150&h=100&q=80" alt="Memory" className="w-full h-12 object-cover rounded" />
                            <p className="text-[6px] font-bold text-slate-800 font-mono mt-1 text-left">Marcus: Cheers to both! 🎉</p>
                          </div>
                        </div>

                        {/* Live Scan Overlay */}
                        <div className="bg-white/10 rounded-xl p-2 flex items-center justify-between text-left border border-white/10">
                          <div className="space-y-0.5">
                            <p className="text-[6px] text-slate-400 font-mono uppercase tracking-widest">SCAN TO CAPTURE</p>
                            <h5 className="text-[8px] font-bold text-white">kava.co/sofia-leo</h5>
                          </div>
                          <div 
                            className="h-7 w-7 bg-white p-0.5 rounded-lg flex items-center justify-center border"
                            style={{ borderColor: workspaceBrandAccentColor }}
                          >
                            <QrCode className="w-5 h-5 text-slate-900" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: QR LANDING VIEW */}
                    {brandPreviewTab === 'qr_landing' && (
                      <div className="flex flex-col space-y-3 text-center justify-between min-h-full flex-1 pt-1 pb-1">
                        <div className="flex justify-center">
                          {workspaceBrandLogo ? (
                            <img src={workspaceBrandLogo} alt="Logo" className="h-5 max-h-5 max-w-[110px] object-contain rounded" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="h-7 w-7 rounded-xl text-white flex items-center justify-center font-bold text-xs" style={{ backgroundColor: workspaceBrandPrimaryColor }}>
                              K
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-slate-50 rounded-xl p-3 space-y-1 my-auto border border-slate-200/80">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">Verified Capsule Scanner</h4>
                          <p className="text-[10px] text-slate-500">Connected to Sofia & Leo's wedding gallery.</p>
                        </div>

                        {/* Interactive Shutter Camera Button */}
                        <div 
                          className="h-14 w-14 rounded-full bg-white border-2 flex items-center justify-center mx-auto shadow-md cursor-pointer hover:scale-105 transition-all"
                          style={{ borderColor: workspaceBrandAccentColor }}
                        >
                          <Camera className="w-6 h-6" style={{ color: workspaceBrandAccentColor }} />
                        </div>

                        <div className="space-y-1 mt-auto">
                          <button 
                            type="button"
                            className="w-full text-white py-2.5 rounded-xl text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-xs" 
                            style={{ backgroundColor: workspaceBrandAccentColor }}
                          >
                            Open Device Camera
                          </button>
                          <p className="text-[7px] text-slate-400 font-mono">Direct Browser Access • Zero Installs</p>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: EMAIL NOTIFICATION VIEW */}
                    {brandPreviewTab === 'email' && (
                      <div className="flex flex-col text-left min-h-full flex-1 rounded-xl overflow-hidden border border-slate-200 bg-white">
                        {/* Branded Top Banner */}
                        <div className="p-3.5 text-center transition-colors" style={{ backgroundColor: workspaceBrandPrimaryColor }}>
                          {workspaceBrandLogo ? (
                            <img src={workspaceBrandLogo} alt="Logo" className="h-4.5 max-h-4.5 max-w-[100px] object-contain mx-auto rounded brightness-110" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-[9px] font-bold text-white tracking-widest font-mono">KAVA SYSTEM</span>
                          )}
                        </div>

                        <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">Your event received 84 new memories!</h4>
                            <p className="text-[10px] text-slate-600 leading-relaxed">
                              Hi Sofia,<br />
                              Guests have contributed 84 high-resolution photos and voicemail wishes to your wedding capsule!
                            </p>
                          </div>

                          <div className="text-center my-2">
                            <button 
                              type="button"
                              className="px-4 py-2 text-white rounded-lg text-[9px] font-bold uppercase shadow-2xs transition-all" 
                              style={{ backgroundColor: workspaceBrandAccentColor }}
                            >
                              Open Moderation Console
                            </button>
                          </div>

                          <p className="text-[7px] text-slate-400 pt-2 border-t border-slate-100 font-mono uppercase tracking-wider">
                            SECURED BY KAVA WORKSPACE VAULT
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TAB 6: DASHBOARD CONSOLE VIEW */}
                    {brandPreviewTab === 'dashboard' && (
                      <div className="flex min-h-full flex-1 rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                        {/* Sidebar Mockup */}
                        <div 
                          className="w-10 p-1.5 flex flex-col items-center space-y-3 border-r border-slate-200 shrink-0" 
                          style={{ backgroundColor: workspaceBrandPrimaryColor }}
                        >
                          {workspaceBrandLogo ? (
                            <img src={workspaceBrandLogo} alt="Logo" className="h-3 max-h-3 max-w-[30px] object-contain rounded brightness-110" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="h-3.5 w-3.5 rounded-full bg-white/20" />
                          )}
                          <div className="h-2.5 w-2.5 rounded bg-white/10" />
                          <div className="h-2.5 w-2.5 rounded bg-white/10" />
                          <div className="h-2.5 w-2.5 rounded bg-white/10" />
                        </div>

                        {/* Content Area */}
                        <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                            <span className="text-[7px] font-bold text-slate-400 font-mono">WORKSPACE HUB</span>
                            <span className="text-[6px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: workspaceBrandAccentColor }}>
                              Active
                            </span>
                          </div>

                          <div className="space-y-1.5 my-auto">
                            <h5 className="text-[9px] font-bold text-slate-800">Sofia & Leo Capsule</h5>
                            <div className="bg-white p-1.5 rounded-lg border border-slate-200 flex items-center space-x-1.5">
                              <div className="h-3.5 w-3.5 rounded-full flex items-center justify-center text-[6px] text-white shrink-0" style={{ backgroundColor: workspaceBrandAccentColor }}>
                                ✓
                              </div>
                              <div className="space-y-0.5 flex-1">
                                <div className="h-1 w-10 bg-slate-300 rounded" />
                                <div className="h-1 w-14 bg-slate-200 rounded" />
                              </div>
                            </div>
                          </div>

                          <div className="pt-1 border-t border-slate-200 text-[6px] font-mono font-bold text-slate-400">
                            BRAND TOKENS: APPLIED
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Physical Home Indicator bar */}
              <div className="h-5 bg-white flex justify-center items-center z-30 select-none pb-0.5 shrink-0">
                <div className="w-24 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
