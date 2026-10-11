import React, { useState, useEffect } from 'react';
import { 
  Palette, Sparkles, RefreshCw, ExternalLink, Check, AlertTriangle, 
  Layers, Upload, Type, Eye, ShieldCheck, Image as ImageIcon,
  Building, Sliders, ChevronRight, CheckCircle2, RotateCcw, Link2, Copy
} from 'lucide-react';
import { getWorkspaceBrandKit, loadGoogleFont, WorkspaceBrandKit } from '../lib/brandKit';

interface EventBrandingSettingsSectionProps {
  currentWorkspace: { id: string; name: string };
  overrideWorkspaceBrand: boolean;
  setOverrideWorkspaceBrand: (override: boolean) => void;
  brandLogo: string;
  setBrandLogo: (logo: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  presentationFontFamily: string;
  setPresentationFontFamily: (font: string) => void;
  onNavigateToWorkspaceBrandKit: () => void;
}

const PRESET_EVENT_PALETTES = [
  { name: 'Classic Onyx', primary: '#0F172A', accent: '#10B981' },
  { name: 'Champagne Gold', primary: '#18181B', accent: '#C19A2E' },
  { name: 'Velvet Midnight', primary: '#0B132B', accent: '#3A86FF' },
  { name: 'Rose Quartz', primary: '#1C1917', accent: '#E11D48' },
  { name: 'Emerald Grove', primary: '#064E3B', accent: '#34D399' },
  { name: 'Terracotta Warmth', primary: '#292524', accent: '#EA580C' },
  { name: 'Imperial Violet', primary: '#1E1B4B', accent: '#8B5CF6' },
  { name: 'Nordic Slate', primary: '#334155', accent: '#0EA5E9' }
];

const CURATED_FONTS = [
  { name: 'Inter', category: 'Modern Clean Sans' },
  { name: 'Plus Jakarta Sans', category: 'Geometric Tech Sans' },
  { name: 'Playfair Display', category: 'High-Contrast Luxury Serif' },
  { name: 'Cormorant Garamond', category: 'Classic Editorial Serif' },
  { name: 'Cinzel', category: 'Sophisticated Roman Serif' },
  { name: 'Outfit', category: 'Friendly Minimal Sans' },
  { name: 'Montserrat', category: 'Bold Architectural Sans' },
  { name: 'Syne', category: 'Avant-Garde Display' },
  { name: 'Lora', category: 'Warm Literary Serif' },
  { name: 'Space Grotesk', category: 'Brutalist Monospace Accent' }
];

const PRESET_LOGOS = [
  { name: 'KAVA Minimal Crest', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&h=80&q=80' },
  { name: 'Golden Monogram', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=240&h=80&q=80' },
  { name: 'Modern Studio Monoline', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=240&h=80&q=80' },
];

export default function EventBrandingSettingsSection({
  currentWorkspace,
  overrideWorkspaceBrand,
  setOverrideWorkspaceBrand,
  brandLogo,
  setBrandLogo,
  primaryColor,
  setPrimaryColor,
  accentColor,
  setAccentColor,
  presentationFontFamily,
  setPresentationFontFamily,
  onNavigateToWorkspaceBrandKit
}: EventBrandingSettingsSectionProps) {
  const [workspaceKit, setWorkspaceKit] = useState<WorkspaceBrandKit>(() => getWorkspaceBrandKit(currentWorkspace.id));
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [customLogoInput, setCustomLogoInput] = useState('');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Sync workspace kit if updated
  useEffect(() => {
    const kit = getWorkspaceBrandKit(currentWorkspace.id);
    setWorkspaceKit(kit);
  }, [currentWorkspace.id]);

  useEffect(() => {
    const handleUpdated = () => {
      const kit = getWorkspaceBrandKit(currentWorkspace.id);
      setWorkspaceKit(kit);
    };
    window.addEventListener('kava_brand_kit_updated', handleUpdated);
    return () => window.removeEventListener('kava_brand_kit_updated', handleUpdated);
  }, [currentWorkspace.id]);

  useEffect(() => {
    if (presentationFontFamily) {
      loadGoogleFont(presentationFontFamily);
    }
  }, [presentationFontFamily]);

  const handleResetToWorkspace = () => {
    const kit = getWorkspaceBrandKit(currentWorkspace.id);
    setBrandLogo(kit.logoUrl);
    setPrimaryColor(kit.primaryColor);
    setAccentColor(kit.accentColor);
    setPresentationFontFamily(kit.typography);
    setOverrideWorkspaceBrand(false);
  };

  const handleEnableCustomOverride = () => {
    const kit = getWorkspaceBrandKit(currentWorkspace.id);
    if (!brandLogo) setBrandLogo(kit.logoUrl);
    if (!primaryColor) setPrimaryColor(kit.primaryColor);
    if (!accentColor) setAccentColor(kit.accentColor);
    if (!presentationFontFamily) setPresentationFontFamily(kit.typography);
    setOverrideWorkspaceBrand(true);
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100 text-left" id="section-event-branding-architecture">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">Event Visual Branding</h4>
          </div>
          <p className="text-[11px] text-slate-400 font-normal mt-0.5">
            Choose whether to inherit workspace design standards or customize visual identity for this event.
          </p>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/60 text-[10px] font-semibold text-slate-600 self-start sm:self-auto">
          <Building className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate max-w-[120px]">{currentWorkspace.name}</span>
          <span className="text-slate-300">•</span>
          <span className={overrideWorkspaceBrand ? "text-amber-700 font-bold" : "text-emerald-700 font-bold"}>
            {overrideWorkspaceBrand ? 'Custom' : 'Workspace'}
          </span>
        </div>
      </div>

      {/* Two-Option Segmented Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Option A: Inherit Workspace Branding */}
        <div
          onClick={handleResetToWorkspace}
          className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
            !overrideWorkspaceBrand 
              ? 'bg-emerald-50/40 border-emerald-400/80 ring-1 ring-emerald-400/20 shadow-xs' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
          id="radio-branding-source-workspace"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                !overrideWorkspaceBrand ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
              }`}>
                {!overrideWorkspaceBrand && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <h5 className="text-xs font-bold text-slate-900">Use Workspace Branding</h5>
            </div>
            {!overrideWorkspaceBrand && (
              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed pl-5.5">
            Inherits logo, colors, and typography from <strong>{currentWorkspace.name}</strong> Brand Kit. Workspace updates synchronize automatically.
          </p>
        </div>

        {/* Option B: Custom Event Branding */}
        <div
          onClick={handleEnableCustomOverride}
          className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
            overrideWorkspaceBrand 
              ? 'bg-amber-50/40 border-amber-400/80 ring-1 ring-amber-400/20 shadow-xs' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
          id="radio-branding-source-custom"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                overrideWorkspaceBrand ? 'border-amber-600 bg-amber-600' : 'border-slate-300 bg-white'
              }`}>
                {overrideWorkspaceBrand && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <h5 className="text-xs font-bold text-slate-900">Custom Event Branding</h5>
            </div>
            {overrideWorkspaceBrand && (
              <span className="text-[9px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                Override Active
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed pl-5.5">
            Decouple this event to apply custom logo, unique color scheme, and typography tailored for this specific occasion.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE 1: WORKSPACE BRANDING INHERITED (COMPACT READ-ONLY SUMMARY) */}
      {/* ========================================================================= */}
      {!overrideWorkspaceBrand ? (
        <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5 space-y-3" id="panel-workspace-branding-inherited">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">Workspace Brand Kit Applied</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToWorkspaceBrandKit}
              className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
              id="btn-link-to-workspace-brand-kit"
            >
              <span>Edit in Brand Kit</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Logo */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center space-x-2.5">
              <div className="w-10 h-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center p-1 overflow-hidden shrink-0">
                {workspaceKit.logoUrl ? (
                  <img src={workspaceKit.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-[8px] text-slate-400">No logo</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase font-mono">Logo</p>
                <p className="text-[11px] font-medium text-slate-700 truncate">{workspaceKit.logoUrl ? 'Active Logo' : 'Default'}</p>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center space-x-2.5">
              <div className="flex items-center space-x-1 shrink-0">
                <div className="w-4 h-4 rounded-md border border-black/10" style={{ backgroundColor: workspaceKit.primaryColor }} title={`Primary: ${workspaceKit.primaryColor}`} />
                <div className="w-4 h-4 rounded-md border border-black/10" style={{ backgroundColor: workspaceKit.accentColor }} title={`Accent: ${workspaceKit.accentColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase font-mono">Palette</p>
                <p className="text-[11px] font-mono font-medium text-slate-700 truncate">{workspaceKit.primaryColor} • {workspaceKit.accentColor}</p>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center space-x-2.5">
              <Type className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase font-mono">Typography</p>
                <p className="text-[11px] font-medium text-slate-700 truncate">{workspaceKit.typography}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* CASE 2: CUSTOM EVENT OVERRIDE (STREAMLINED CONTROLS) */
        /* ========================================================================= */
        <div className="space-y-4 pt-1 animate-fade-in" id="panel-event-branding-override">
          {/* Logo Input */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Custom Event Logo</span>
              </label>
              {brandLogo && (
                <button
                  type="button"
                  onClick={() => setBrandLogo('')}
                  className="text-[10px] text-rose-600 hover:underline cursor-pointer font-semibold"
                >
                  Clear Logo
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-14 h-11 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                {brandLogo ? (
                  <img src={brandLogo} alt="Event logo" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-[9px] font-bold text-slate-400 text-center">No logo</span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  value={brandLogo}
                  onChange={(e) => setBrandLogo(e.target.value)}
                  placeholder="Enter logo image URL or choose sample"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                  id="input-event-custom-logo"
                />
                <button
                  type="button"
                  onClick={() => setShowPresetPicker(!showPresetPicker)}
                  className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md cursor-pointer"
                >
                  {showPresetPicker ? 'Hide sample logos' : 'Browse sample logos'}
                </button>
              </div>
            </div>

            {/* Sample Logos Tray */}
            {showPresetPicker && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60">
                {PRESET_LOGOS.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setBrandLogo(p.url); setShowPresetPicker(false); }}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg hover:border-slate-400 cursor-pointer text-center space-y-1 transition-all"
                  >
                    <div className="h-6 flex items-center justify-center">
                      <img src={p.url} alt={p.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <p className="text-[8px] font-medium text-slate-600 truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color Scheme */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-600" />
              <span>Accent Color & Theme</span>
            </label>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1 w-full max-w-[200px]">
                <input
                  type="color"
                  value={accentColor || '#10B981'}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                  id="picker-event-custom-accent"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#10B981"
                  className="w-full bg-transparent text-xs font-mono font-bold focus:outline-none uppercase"
                  id="input-event-custom-accent-hex"
                />
              </div>
            </div>

            {/* Curated Color Palettes */}
            <div className="space-y-1 pt-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">Curated Color Palettes</span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {PRESET_EVENT_PALETTES.map((palette, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(palette.primary);
                      setAccentColor(palette.accent);
                    }}
                    className="p-1 bg-white border border-slate-200 rounded-lg hover:border-slate-400 cursor-pointer flex flex-col items-center gap-1 transition-all"
                    title={palette.name}
                  >
                    <div className="w-full h-3.5 rounded flex overflow-hidden">
                      <div className="w-1/2 h-full" style={{ backgroundColor: palette.primary }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: palette.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Presentation Typography */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Type className="w-3.5 h-3.5 text-slate-600" />
              <span>Presentation Typography</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <select
                value={presentationFontFamily || 'Inter'}
                onChange={(e) => setPresentationFontFamily(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-slate-400 cursor-pointer"
                id="select-event-presentation-font"
              >
                {CURATED_FONTS.map((font, idx) => (
                  <option key={idx} value={font.name}>
                    {font.name} ({font.category.split(' ')[0]})
                  </option>
                ))}
              </select>

              <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
                <span className="text-[8px] font-mono uppercase text-slate-400">Preview</span>
                <p
                  className="text-xs text-slate-900 font-semibold truncate"
                  style={{ fontFamily: `"${presentationFontFamily || 'Inter'}", sans-serif` }}
                >
                  Celebrate every shared moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
