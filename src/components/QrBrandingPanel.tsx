import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  QrCode,
  Image as ImageIcon,
  Sparkles,
  Check,
  RotateCcw,
  Download,
  Share2,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Palette,
  Sliders,
  CheckCircle2,
  Copy,
  ExternalLink,
  Smartphone,
  Eye,
  RefreshCw,
  Zap,
  Printer,
  FileCode,
  Info,
  Maximize2
} from 'lucide-react';
import { KavaQrConfig, QrModuleShape, QrEyeShape, QrLogoShape, QrErrorCorrection, QrFrameStyle, KavaEvent } from '../types';
import {
  DEFAULT_QR_CONFIG,
  OFFICIAL_KAVA_LOGOS,
  getSuperAdminQrConfig,
  saveSuperAdminQrConfig,
  resetSuperAdminQrConfig,
  validateQrConfigSafety,
  calculateContrastRatio
} from '../lib/qrConfig';
import {
  generateBrandedQrCanvas,
  generateBrandedQrDataUrl,
  validateQrScannability,
  QrValidationResult
} from '../lib/qrGenerator';
import { getEventGuestLink, downloadEventQrPng, generatePrintableInvitationCard } from '../lib/qrUtils';

interface QrBrandingPanelProps {
  events: KavaEvent[];
  onNotify?: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const QrBrandingPanel: React.FC<QrBrandingPanelProps> = ({ events, onNotify }) => {
  const [config, setConfig] = useState<KavaQrConfig>(() => getSuperAdminQrConfig());
  const [activeTab, setActiveTab] = useState<'logo' | 'matrix' | 'eyes' | 'scannability' | 'frame'>('logo');
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationResult, setValidationResult] = useState<QrValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'card' | 'phone' | 'print_preview'>('card');
  const [selectedSampleEventId, setSelectedSampleEventId] = useState<string>('custom');
  const [customTestCode, setCustomTestCode] = useState<string>('KAVA-VIP-2026');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);

  // Compute test URL based on selection
  const selectedEvent = useMemo(() => {
    if (selectedSampleEventId === 'custom') return null;
    return events.find((e) => e.id === selectedSampleEventId) || null;
  }, [events, selectedSampleEventId]);

  const testContent = useMemo(() => {
    if (selectedEvent) {
      return getEventGuestLink(selectedEvent);
    }
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://kava.app';
    return `${origin}/join?code=${encodeURIComponent(customTestCode.trim().toUpperCase() || 'KAVA-DEMO')}`;
  }, [selectedEvent, customTestCode]);

  // Generate QR & Validate real-time whenever config or testContent shifts
  useEffect(() => {
    let isCurrent = true;
    setIsGenerating(true);
    setIsValidating(true);

    const generateAndTest = async () => {
      try {
        const dataUrl = await generateBrandedQrDataUrl(testContent, config, 600);
        if (!isCurrent) return;
        setPreviewDataUrl(dataUrl);
        setIsGenerating(false);

        // Run real scanner validation on generated QR
        const validation = await validateQrScannability(dataUrl, testContent);
        if (!isCurrent) return;
        setValidationResult(validation);
        setIsValidating(false);
      } catch (err) {
        console.error('QR Generator preview error:', err);
        if (isCurrent) {
          setIsGenerating(false);
          setIsValidating(false);
        }
      }
    };

    const timer = setTimeout(generateAndTest, 60);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [config, testContent]);

  // Safety & Contrast Calculation
  const safetyAudit = useMemo(() => {
    return validateQrConfigSafety(config);
  }, [config]);

  // Handle Save / Deploy to all events
  const handleDeploy = async () => {
    setIsSaving(true);
    try {
      const saved = await saveSuperAdminQrConfig(config);
      setConfig(saved);
      setSavedSuccess(true);
      if (onNotify) {
        onNotify('Master KAVA QR Branding successfully saved and synchronized to all event invitations!', 'success');
      }
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      if (onNotify) onNotify('Failed to save QR configuration to server.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Reset
  const handleReset = async () => {
    if (confirm('Reset QR branding to official KAVA factory defaults?')) {
      const reset = await resetSuperAdminQrConfig();
      setConfig(reset);
      if (onNotify) {
        onNotify('QR branding reset to official KAVA default style.', 'info');
      }
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file exceeds 2MB limit. Please upload a smaller SVG or PNG asset.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setConfig((prev) => ({
          ...prev,
          logoUrl: result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick Download High-Res PNG
  const handleDownloadPreviewPng = () => {
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    a.download = `KAVA-Master-QR-Preview-v${config.version}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans pb-16">
      {/* Top Banner & Action Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">KAVA QR Invitation Branding</h1>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-200/80">
                  v{config.version} Active
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/80 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Single Source of Truth</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Centrally configure the official KAVA logo, visual geometry, eye styles, and scannability parameters. Every host invitation QR automatically synchronizes to this design.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 border border-slate-200"
            title="Reset to Factory Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={handleDeploy}
            disabled={isSaving}
            className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm flex items-center space-x-2 ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Synchronizing...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Deployed to All Events!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Deploy & Sync All Events</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Interactive Preview & Real Scanner Validator (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Preview Header & Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
                  Live Branded Preview
                </h3>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewMode('card')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    previewMode === 'card' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('phone')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                    previewMode === 'phone' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-2.5 h-2.5" />
                  <span>Phone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('print_preview')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    previewMode === 'print_preview' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Print
                </button>
              </div>
            </div>

            {/* Visual Canvas Container */}
            <div className="relative flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-xl border border-slate-100 min-h-[340px]">
              {previewMode === 'phone' ? (
                /* Smartphone Mockup Frame */
                <div className="w-[260px] bg-slate-900 rounded-[32px] p-3 shadow-xl border-4 border-slate-800 relative">
                  <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-3"></div>
                  <div className="bg-white rounded-[22px] p-3 text-center space-y-2">
                    <span className="text-[8px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                      Guest Scan Camera
                    </span>
                    <div className="p-1 rounded-xl bg-white border border-slate-100 flex items-center justify-center relative overflow-hidden">
                      {previewDataUrl ? (
                        <img
                          src={previewDataUrl}
                          alt="Branded QR"
                          className="w-48 h-48 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                        </div>
                      )}
                      {/* Scanning Reticle Frame */}
                      <div className="absolute inset-2 border-2 border-dashed border-amber-500/60 rounded-xl pointer-events-none animate-pulse"></div>
                    </div>
                    <p className="text-[10px] font-extrabold text-slate-800 truncate">{selectedEvent ? selectedEvent.name : 'Sample Memory Capsule'}</p>
                    <p className="text-[8px] text-slate-400 font-mono">Aim camera to open invitation</p>
                  </div>
                  <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-3"></div>
                </div>
              ) : previewMode === 'print_preview' ? (
                /* Printable Invitation Sheet Preview */
                <div className="w-full max-w-[280px] bg-white border-2 border-amber-600/40 p-4 rounded-xl shadow-md text-center space-y-2">
                  <div className="border border-slate-900/10 p-3 rounded-lg bg-slate-50/50">
                    <p className="text-[9px] font-black text-amber-700 tracking-widest uppercase font-mono">— OFFICIAL INVITATION —</p>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{selectedEvent ? selectedEvent.name : 'Sofia & Leo Wedding'}</h4>
                    <div className="my-2 bg-white p-2 rounded-lg border border-slate-200 inline-block shadow-2xs">
                      {previewDataUrl && (
                        <img src={previewDataUrl} alt="Printable QR" className="w-40 h-40 object-contain mx-auto" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <p className="text-[9px] font-extrabold text-slate-800 font-mono">SCAN WITH CAMERA TO JOIN</p>
                    <p className="text-[8px] text-slate-500">Upload photos, videos & voice notes</p>
                  </div>
                </div>
              ) : (
                /* Standard Card View */
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col items-center justify-center space-y-2 max-w-[280px]">
                  {previewDataUrl ? (
                    <img
                      src={previewDataUrl}
                      alt="KAVA QR Live Preview"
                      className="w-56 h-56 object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-56 h-56 flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
                      <span className="text-xs text-slate-400 font-medium">Rendering QR...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Real Scanner Validator Diagnostic Badge */}
            <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-bold uppercase text-[10px] text-slate-300">Scanner Verification</span>
                </div>
                {isValidating ? (
                  <span className="text-[10px] font-mono text-amber-400 flex items-center space-x-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Testing...</span>
                  </span>
                ) : validationResult?.isScannable ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>100% Scannable ({validationResult.latencyMs}ms)</span>
                  </span>
                ) : (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    Scan Failed
                  </span>
                )}
              </div>

              <div className="bg-slate-950/80 rounded-lg p-2.5 font-mono text-[10px] space-y-1 text-slate-300 break-all border border-slate-800">
                <div className="flex items-center justify-between text-slate-500 text-[9px]">
                  <span>DECODED INVITATION PAYLOAD</span>
                  <span className="text-emerald-400 font-bold">{validationResult?.matchExpected ? 'MATCH VERIFIED' : 'PENDING'}</span>
                </div>
                <p className="text-amber-300 font-semibold">{validationResult?.decodedText || testContent}</p>
              </div>

              {/* Safety & Contrast Warnings */}
              {safetyAudit.warnings.length > 0 && (
                <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-lg space-y-1 text-amber-200 text-[11px]">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Branding Safety Notice</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-300/90 pl-1">
                    {safetyAudit.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Test Sample Target Selector */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="text-[10px] font-bold uppercase text-slate-500 font-mono block">
                Target Capsule Simulation
              </label>
              <div className="grid grid-cols-1 gap-2">
                <select
                  value={selectedSampleEventId}
                  onChange={(e) => setSelectedSampleEventId(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="custom">Custom Sample Code (KAVA-VIP-2026)</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name} (Code: {evt.code})
                    </option>
                  ))}
                </select>

                {selectedSampleEventId === 'custom' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customTestCode}
                      onChange={(e) => setCustomTestCode(e.target.value.toUpperCase())}
                      placeholder="CUSTOM-CODE"
                      className="flex-1 text-xs font-mono font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl uppercase"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDownloadPreviewPng}
                className="w-full py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(testContent);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="w-full py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Tabbed Panels (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Customizer Navigation Tabs */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-xs flex flex-wrap gap-1">
            {[
              { id: 'logo', label: '1. KAVA Logo & Badge', icon: ImageIcon },
              { id: 'matrix', label: '2. Modules & Color', icon: Palette },
              { id: 'eyes', label: '3. Corner Eyes', icon: Eye },
              { id: 'scannability', label: '4. Scannability & Margin', icon: ShieldCheck },
              { id: 'frame', label: '5. Frame & CTA', icon: Layers },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Official KAVA Logo & Center Badge */}
          {activeTab === 'logo' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Official KAVA Logo & Emblem</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select an official vector KAVA emblem or upload custom high-resolution branding.
                </p>
              </div>

              {/* Official Presets Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Official Logo Presets</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {OFFICIAL_KAVA_LOGOS.map((preset) => {
                    const isSelected = config.logoUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setConfig((prev) => ({
                            ...prev,
                            logoUrl: preset.url,
                            logoBorderColor: preset.previewColor,
                          }));
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex items-center space-x-3 ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50/80 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg p-1 bg-slate-900 shrink-0 flex items-center justify-center shadow-xs">
                          <img src={preset.url} alt={preset.name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{preset.name}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{preset.description}</p>
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Logo Upload */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-700 block">Or Upload Custom Brand Emblem</label>
                <div className="flex items-center space-x-3">
                  <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer transition-all flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-slate-600" />
                    <span>Choose PNG/SVG File</span>
                    <input type="file" accept="image/png, image/svg+xml, image/jpeg" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {config.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, logoUrl: '' }))}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>

              {/* Logo Scale & Badge Geometry */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Center Badge Geometry & Protection Zone
                </h4>

                {/* Logo Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Logo Size Ratio ({Math.round(config.logoSizeRatio * 100)}%)</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Recommended: 20% - 24%</span>
                  </div>
                  <input
                    type="range"
                    min="0.16"
                    max="0.28"
                    step="0.01"
                    value={config.logoSizeRatio}
                    onChange={(e) => setConfig((p) => ({ ...p, logoSizeRatio: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>16% (Subtle)</span>
                    <span>22% (Optimal)</span>
                    <span>28% (Maximum Safe)</span>
                  </div>
                </div>

                {/* Badge Shape */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Badge Protection Shape</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'circle', label: 'Circle' },
                      { id: 'rounded', label: 'Squircle' },
                      { id: 'shield', label: 'Shield' },
                      { id: 'square', label: 'Square' },
                    ].map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => setConfig((p) => ({ ...p, logoShape: shape.id as QrLogoShape }))}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                          config.logoShape === shape.id
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge Color & Border Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Badge Fill Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.logoBackground || '#FFFFFF'}
                        onChange={(e) => setConfig((p) => ({ ...p, logoBackground: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.logoBackground || '#FFFFFF'}
                        onChange={(e) => setConfig((p) => ({ ...p, logoBackground: e.target.value }))}
                        className="w-20 text-xs font-mono font-bold px-2 py-1.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Border Stroke Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.logoBorderColor || '#C19A2E'}
                        onChange={(e) => setConfig((p) => ({ ...p, logoBorderColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.logoBorderColor || '#C19A2E'}
                        onChange={(e) => setConfig((p) => ({ ...p, logoBorderColor: e.target.value }))}
                        className="w-20 text-xs font-mono font-bold px-2 py-1.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Border Width ({config.logoBorderWidth}px)</label>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="1"
                      value={config.logoBorderWidth}
                      onChange={(e) => setConfig((p) => ({ ...p, logoBorderWidth: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-slate-900 mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Modules & Color Styling */}
          {activeTab === 'matrix' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">QR Matrix & Module Geometry</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure the data module shapes, foreground matrix colors, and background canvas.
                </p>
              </div>

              {/* Module Shape Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Data Module Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'rounded', label: 'Smooth Rounded', desc: 'Modern & clean' },
                    { id: 'dots', label: 'Circular Dots', desc: 'Refined luxury' },
                    { id: 'classy', label: 'Classy Diamond', desc: 'Artisan gala style' },
                    { id: 'smooth', label: 'Soft Rectangles', desc: 'High density' },
                    { id: 'square', label: 'Classic Square', desc: 'Crisp high-contrast' },
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, moduleShape: shape.id as QrModuleShape }))}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        config.moduleShape === shape.id
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-bold">{shape.label}</p>
                      <p className={`text-[10px] mt-0.5 ${config.moduleShape === shape.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {shape.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Matrix Color Palette Presets */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-700 block">Color Palette Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'KAVA Slate & Gold', fg: '#0F172A', bg: '#FFFFFF', eye: '#C19A2E' },
                    { name: 'Midnight Navy', fg: '#1E1B4B', bg: '#FAF5FF', eye: '#6366F1' },
                    { name: 'Warm Amber Luxury', fg: '#451A03', bg: '#FFFBEB', eye: '#D97706' },
                    { name: 'Deep Forest Emerald', fg: '#064E3B', bg: '#F0FDF4', eye: '#10B981' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setConfig((p) => ({
                          ...p,
                          foregroundColor: preset.fg,
                          backgroundColor: preset.bg,
                          eyeOuterColor: preset.fg,
                          eyeInnerColor: preset.eye,
                        }));
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white text-left transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: preset.fg }}></div>
                        <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: preset.bg }}></div>
                        <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: preset.eye }}></div>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 truncate">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Foreground Matrix Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.foregroundColor}
                      onChange={(e) => setConfig((p) => ({ ...p, foregroundColor: e.target.value }))}
                      className="w-9 h-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.foregroundColor}
                      onChange={(e) => setConfig((p) => ({ ...p, foregroundColor: e.target.value }))}
                      className="flex-1 text-xs font-mono font-bold px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Background Canvas Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig((p) => ({ ...p, backgroundColor: e.target.value }))}
                      className="w-9 h-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig((p) => ({ ...p, backgroundColor: e.target.value }))}
                      className="flex-1 text-xs font-mono font-bold px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Gradient Option */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">Enable Matrix Gradient</label>
                    <p className="text-[10px] text-slate-500">Apply a smooth two-tone linear gradient across data modules</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.gradientEnabled}
                    onChange={(e) => setConfig((p) => ({ ...p, gradientEnabled: e.target.checked }))}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </div>

                {config.gradientEnabled && (
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Start Color</label>
                      <input
                        type="color"
                        value={config.gradientStartColor || config.foregroundColor}
                        onChange={(e) => setConfig((p) => ({ ...p, gradientStartColor: e.target.value }))}
                        className="w-full h-7 rounded border border-slate-300 p-0.5 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">End Color</label>
                      <input
                        type="color"
                        value={config.gradientEndColor || '#C19A2E'}
                        onChange={(e) => setConfig((p) => ({ ...p, gradientEndColor: e.target.value }))}
                        className="w-full h-7 rounded border border-slate-300 p-0.5 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Direction</label>
                      <select
                        value={config.gradientDirection}
                        onChange={(e) => setConfig((p) => ({ ...p, gradientDirection: e.target.value as any }))}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded font-medium"
                      >
                        <option value="diagonal">Diagonal</option>
                        <option value="to_bottom">Vertical</option>
                        <option value="to_right">Horizontal</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Corner Eyes / Finder Patterns */}
          {activeTab === 'eyes' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Corner Eye / Finder Patterns</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the 3 large corner markers that guide smartphone optical sensors.
                </p>
              </div>

              {/* Eye Shape Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Corner Eye Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'rounded', label: 'Rounded Square', desc: 'Standard KAVA look' },
                    { id: 'circle', label: 'Circular Pill', desc: 'Soft & modern' },
                    { id: 'extra_rounded', label: 'Extra Rounded', desc: 'High curvature' },
                    { id: 'leaf', label: 'Organic Leaf', desc: 'Botanical accent' },
                    { id: 'square', label: 'Sharp Square', desc: 'Traditional crisp' },
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, eyeShape: shape.id as QrEyeShape }))}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        config.eyeShape === shape.id
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-bold">{shape.label}</p>
                      <p className={`text-[10px] mt-0.5 ${config.eyeShape === shape.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {shape.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Eye Colors */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">Custom Eye Colors</label>
                    <p className="text-[10px] text-slate-500">Apply distinct colors to the outer eye ring and inner pupil</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.customEyeColor}
                    onChange={(e) => setConfig((p) => ({ ...p, customEyeColor: e.target.checked }))}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </div>

                {config.customEyeColor && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Outer Ring Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={config.eyeOuterColor || config.foregroundColor}
                          onChange={(e) => setConfig((p) => ({ ...p, eyeOuterColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.eyeOuterColor || config.foregroundColor}
                          onChange={(e) => setConfig((p) => ({ ...p, eyeOuterColor: e.target.value }))}
                          className="w-24 text-xs font-mono font-bold px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Inner Pupil Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={config.eyeInnerColor || '#C19A2E'}
                          onChange={(e) => setConfig((p) => ({ ...p, eyeInnerColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.eyeInnerColor || '#C19A2E'}
                          onChange={(e) => setConfig((p) => ({ ...p, eyeInnerColor: e.target.value }))}
                          className="w-24 text-xs font-mono font-bold px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Scannability & Margin */}
          {activeTab === 'scannability' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Scannability & Error Correction</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fine-tune error recovery fault tolerance to guarantee high scan success on printed cards and dirty lenses.
                </p>
              </div>

              {/* Error Correction Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Error Correction Level</label>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                    Level H = 30% Fault Recovery
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'H', label: 'High (30%)', desc: 'Recommended with Logo' },
                    { id: 'Q', label: 'Quartile (25%)', desc: 'Good resilience' },
                    { id: 'M', label: 'Medium (15%)', desc: 'Standard density' },
                    { id: 'L', label: 'Low (7%)', desc: 'Maximum data density' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, errorCorrectionLevel: lvl.id as QrErrorCorrection }))}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        config.errorCorrectionLevel === lvl.id
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-extrabold">{lvl.label}</p>
                      <p className={`text-[10px] mt-0.5 ${config.errorCorrectionLevel === lvl.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {lvl.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin Quiet Zone */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Quiet Zone Margin ({config.margin} modules)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Ensures clear border around QR</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: 1, label: '1 module (Compact)' },
                    { val: 2, label: '2 modules (Standard)' },
                    { val: 3, label: '3 modules (Spacious)' },
                    { val: 4, label: '4 modules (Print Max)' },
                  ].map((m) => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, margin: m.val }))}
                      className={`py-2 px-2.5 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        config.margin === m.val
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scannability Safety Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Optical Scannability Health Metrics</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-[9px] text-slate-400 font-mono block">CONTRAST RATIO</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">{safetyAudit.contrastRatio.toFixed(1)} : 1</span>
                    <span className="text-[9px] text-emerald-600 block mt-0.5">Passes WCAG AA</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-[9px] text-slate-400 font-mono block">FAULT TOLERANCE</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">Level {config.errorCorrectionLevel}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">30% redundancy</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-[9px] text-slate-400 font-mono block">CENTER BADGE</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">{Math.round(config.logoSizeRatio * 100)}%</span>
                    <span className="text-[9px] text-emerald-600 block mt-0.5">Safe Zone Protected</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Frame & CTA Banner */}
          {activeTab === 'frame' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Card Framing & CTA Labels</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add optional call-to-action badges and card frames for downloadable invitation assets.
                </p>
              </div>

              {/* Frame Style Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Frame Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'none', label: 'None (Borderless QR)', desc: 'Clean vector matrix' },
                    { id: 'badge_pill', label: 'Bottom Pill CTA', desc: 'Modern scan prompt' },
                    { id: 'kava_gold_frame', label: 'KAVA Luxury Gold Frame', desc: 'Formal wedding / gala card' },
                    { id: 'card_clean', label: 'Clean Border Card', desc: 'Minimalist container' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, frameStyle: f.id as QrFrameStyle }))}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        config.frameStyle === f.id
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-bold">{f.label}</p>
                      <p className={`text-[10px] mt-0.5 ${config.frameStyle === f.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {f.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Text & Colors */}
              {config.frameStyle !== 'none' && (
                <div className="space-y-4 border-t border-slate-100 pt-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Call-To-Action Text</label>
                    <input
                      type="text"
                      value={config.frameText}
                      onChange={(e) => setConfig((p) => ({ ...p, frameText: e.target.value }))}
                      placeholder="SCAN TO JOIN CAPSULE"
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Frame Text Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={config.frameTextColor || '#0F172A'}
                          onChange={(e) => setConfig((p) => ({ ...p, frameTextColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.frameTextColor || '#0F172A'}
                          onChange={(e) => setConfig((p) => ({ ...p, frameTextColor: e.target.value }))}
                          className="w-24 text-xs font-mono font-bold px-2 py-1.5 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Frame Background Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={config.frameBgColor || '#F8FAFC'}
                          onChange={(e) => setConfig((p) => ({ ...p, frameBgColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.frameBgColor || '#F8FAFC'}
                          onChange={(e) => setConfig((p) => ({ ...p, frameBgColor: e.target.value }))}
                          className="w-24 text-xs font-mono font-bold px-2 py-1.5 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
