import React, { useState } from 'react';
import {
  X, Check, AlertTriangle, Play, Sliders, Shield, Users,
  Globe, Layout, Sparkles, Video, FileArchive, Volume2, Palette,
  UserPlus, MessageSquare, DollarSign, Smartphone, Laptop, Tv, ArrowRight,
  Eye, RefreshCw, Zap
} from 'lucide-react';
import { FeatureFlagConfig } from '../lib/featureFlags';

interface FeatureFlagLivePreviewModalProps {
  flag: FeatureFlagConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateFlag: (updated: FeatureFlagConfig) => void;
  allFlags: FeatureFlagConfig[];
}

export default function FeatureFlagLivePreviewModal({
  flag,
  isOpen,
  onClose,
  onUpdateFlag,
  allFlags
}: FeatureFlagLivePreviewModalProps) {
  if (!isOpen || !flag) return null;

  const [activeModuleTab, setActiveModuleTab] = useState<string>(
    flag.affectedModules[0] || 'Host Dashboard'
  );
  const [previewMode, setPreviewMode] = useState<'live' | 'split'>('live');
  const [selectedLut, setSelectedLut] = useState<string>('vintage');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [newUserTag, setNewUserTag] = useState('');
  const [audioDuckingSim, setAudioDuckingSim] = useState(false);

  // Check dependencies
  const unmetDependencies = flag.dependencies.filter(dep => {
    const parent = allFlags.find(f => f.key === dep.key);
    return !parent || !parent.enabled;
  });

  const handleToggleEnable = () => {
    const nextState = !flag.enabled;
    const nextStatus = nextState ? (flag.rollout === 100 ? 'Enabled' : 'Gradual Rollout') : 'Disabled';
    onUpdateFlag({
      ...flag,
      enabled: nextState,
      status: nextStatus,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'SuperAdmin'
    });
  };

  const handleRolloutSlider = (percent: number) => {
    let nextStatus = flag.status;
    if (flag.enabled) {
      nextStatus = percent === 100 ? 'Enabled' : percent === 0 ? 'Disabled' : 'Gradual Rollout';
    }
    onUpdateFlag({
      ...flag,
      rollout: percent,
      status: nextStatus,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleTestModeToggle = () => {
    onUpdateFlag({
      ...flag,
      testMode: {
        ...flag.testMode,
        enabled: !flag.testMode.enabled
      }
    });
  };

  const handleAddAllowedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserTag.trim()) return;
    if (!flag.testMode.allowedUsers.includes(newUserTag.trim())) {
      onUpdateFlag({
        ...flag,
        testMode: {
          ...flag.testMode,
          allowedUsers: [...flag.testMode.allowedUsers, newUserTag.trim()]
        }
      });
    }
    setNewUserTag('');
  };

  const handleRemoveAllowedUser = (email: string) => {
    onUpdateFlag({
      ...flag,
      testMode: {
        ...flag.testMode,
        allowedUsers: flag.testMode.allowedUsers.filter(u => u !== email)
      }
    });
  };

  const handleEnablePrerequisite = (depKey: string) => {
    const depFlag = allFlags.find(f => f.key === depKey);
    if (depFlag) {
      onUpdateFlag({
        ...depFlag,
        enabled: true,
        status: depFlag.rollout === 100 ? 'Enabled' : 'Gradual Rollout'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold tracking-tight">{flag.name}</h2>
                <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                  key: {flag.key}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  flag.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {flag.enabled ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{flag.desc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Control Strip */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            {/* Live Toggle Switch */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-extrabold text-slate-700">Global Status:</span>
              <button
                onClick={handleToggleEnable}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${
                  flag.enabled ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    flag.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-xs font-extrabold font-mono ${flag.enabled ? 'text-slate-900' : 'text-slate-400'}`}>
                {flag.enabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>

            {/* Rollout percentage slider */}
            <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xl">
              <span className="text-xs font-bold text-slate-500">Rollout:</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={flag.rollout}
                onChange={(e) => handleRolloutSlider(parseInt(e.target.value))}
                disabled={!flag.enabled}
                className="w-24 accent-slate-900 disabled:opacity-40 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-800 w-9 text-right">
                {flag.rollout}%
              </span>
            </div>

            {/* Test mode badge */}
            <button
              onClick={handleTestModeToggle}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                flag.testMode?.enabled
                  ? 'bg-amber-500/10 text-amber-700 border border-amber-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Test Mode: {flag.testMode?.enabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Viewport switch: Single Preview vs Split Compare */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl space-x-1">
            <button
              onClick={() => setPreviewMode('live')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                previewMode === 'live' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Simulation</span>
            </button>
            <button
              onClick={() => setPreviewMode('split')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                previewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Split Comparison</span>
            </button>
          </div>
        </div>

        {/* Dependency Warnings Banner */}
        {unmetDependencies.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between flex-wrap gap-2 text-amber-900">
            <div className="flex items-center space-x-2 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Dependency Warning:</strong> This feature requires{' '}
                {unmetDependencies.map(d => `"${d.name}" (${d.statusRequired})`).join(', ')}.
              </span>
            </div>
            {unmetDependencies.map(d => (
              <button
                key={d.key}
                onClick={() => handleEnablePrerequisite(d.key)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
              >
                Enable {d.name}
              </button>
            ))}
          </div>
        )}

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100/50">
          
          {/* Affected Module Selector Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Affected Module View:</span>
              <div className="flex space-x-1.5 overflow-x-auto">
                {flag.affectedModules.map(mod => (
                  <button
                    key={mod}
                    onClick={() => setActiveModuleTab(mod)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      activeModuleTab === mod
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {mod === 'Host Dashboard' && <Laptop className="w-3.5 h-3.5" />}
                    {mod === 'Guest Experience' && <Smartphone className="w-3.5 h-3.5" />}
                    {mod === 'Live Screen' && <Tv className="w-3.5 h-3.5" />}
                    {mod === 'Landing Page' && <Globe className="w-3.5 h-3.5" />}
                    {mod === 'Super Admin Portal' && <Shield className="w-3.5 h-3.5" />}
                    <span>{mod}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-xl">
              Target Audience: {flag.testMode?.enabled ? 'Test Mode Whitelist' : `${flag.rollout}% Global Percentile`}
            </div>
          </div>

          {/* REALISTIC INTERACTIVE PREVIEW PANEL */}
          <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Interactive Live KAVA Interface Simulation ({activeModuleTab})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Changes update in real-time as flags modify
              </span>
            </div>

            {/* PREVIEW CONTAINER */}
            {previewMode === 'live' ? (
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-900/5 relative overflow-hidden">
                <RenderFeaturePreview
                  flagKey={flag.key}
                  module={activeModuleTab}
                  isEnabled={flag.enabled}
                  rollout={flag.rollout}
                  selectedLut={selectedLut}
                  setSelectedLut={setSelectedLut}
                  selectedCurrency={selectedCurrency}
                  setSelectedCurrency={setSelectedCurrency}
                  audioDuckingSim={audioDuckingSim}
                  setAudioDuckingSim={setAudioDuckingSim}
                />
              </div>
            ) : (
              /* SPLIT COMPARISON VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-200 rounded-2xl p-4 bg-red-50/20 relative">
                  <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">
                    BEFORE (Feature Disabled)
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mb-3">Disabled State</h4>
                  <RenderFeaturePreview
                    flagKey={flag.key}
                    module={activeModuleTab}
                    isEnabled={false}
                    rollout={flag.rollout}
                    selectedLut={selectedLut}
                    setSelectedLut={setSelectedLut}
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrency={setSelectedCurrency}
                    audioDuckingSim={false}
                    setAudioDuckingSim={() => {}}
                  />
                </div>

                <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/20 relative">
                  <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    AFTER (Feature Enabled)
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mb-3">Enabled State</h4>
                  <RenderFeaturePreview
                    flagKey={flag.key}
                    module={activeModuleTab}
                    isEnabled={true}
                    rollout={flag.rollout}
                    selectedLut={selectedLut}
                    setSelectedLut={setSelectedLut}
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrency={setSelectedCurrency}
                    audioDuckingSim={audioDuckingSim}
                    setAudioDuckingSim={setAudioDuckingSim}
                  />
                </div>
              </div>
            )}
          </div>

          {/* TWO COLUMN GRID: WHERE THIS FEATURE IS USED & TEST MODE CONFIG */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* WHERE THIS FEATURE IS USED */}
            <div className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                <Layout className="w-4 h-4 text-slate-900" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Where This Feature Is Used
                </h3>
              </div>

              <div className="space-y-3">
                {flag.whereUsed.map((loc, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-xs flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-900">{loc.page}</span>
                        <span className="text-[10px] font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                          {loc.component}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                        {loc.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEST MODE & USER TARGETING */}
            <div className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Test Mode & Audience Targeting
                    </h3>
                  </div>
                  <button
                    onClick={handleTestModeToggle}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      flag.testMode?.enabled
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {flag.testMode?.enabled ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 font-medium mb-4 leading-relaxed">
                  Enable this feature exclusively for specific internal tester accounts, target workspaces, or beta events before releasing globally.
                </p>

                {/* Whitelisted emails */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Whitelisted User Accounts ({flag.testMode?.allowedUsers?.length || 0}):
                  </label>
                  
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {flag.testMode?.allowedUsers?.map(email => (
                      <span key={email} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-white border border-slate-300 text-slate-800">
                        <span>{email}</span>
                        <button
                          onClick={() => handleRemoveAllowedUser(email)}
                          className="hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {(!flag.testMode?.allowedUsers || flag.testMode.allowedUsers.length === 0) && (
                      <span className="text-[10px] text-slate-400 italic">No user accounts whitelisted</span>
                    )}
                  </div>

                  <form onSubmit={handleAddAllowedUser} className="flex space-x-2">
                    <input
                      type="email"
                      value={newUserTag}
                      onChange={(e) => setNewUserTag(e.target.value)}
                      placeholder="Add email (e.g. tester@kava.co)..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                </div>

                {/* Internal only checkbox */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="internalOnlyCheck"
                    checked={flag.testMode?.internalOnly || false}
                    onChange={(e) => {
                      onUpdateFlag({
                        ...flag,
                        testMode: {
                          ...flag.testMode,
                          internalOnly: e.target.checked
                        }
                      });
                    }}
                    className="rounded accent-slate-900 cursor-pointer"
                  />
                  <label htmlFor="internalOnlyCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Enable automatically for all @kava.co internal staff accounts
                  </label>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900 text-slate-400 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <div>
            Last updated: {flag.lastUpdated ? new Date(flag.lastUpdated).toLocaleTimeString() : 'Never'}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-sans font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm border border-slate-700"
          >
            Done Testing
          </button>
        </div>

      </div>
    </div>
  );
}

{/* SUBCOMPONENT: REALISTIC INTERACTIVE KAVA UI PREVIEWS FOR SPECIFIC FLAGS */}
function RenderFeaturePreview({
  flagKey,
  module,
  isEnabled,
  rollout,
  selectedLut,
  setSelectedLut,
  selectedCurrency,
  setSelectedCurrency,
  audioDuckingSim,
  setAudioDuckingSim
}: {
  flagKey: string;
  module: string;
  isEnabled: boolean;
  rollout: number;
  selectedLut: string;
  setSelectedLut: (s: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (s: string) => void;
  audioDuckingSim: boolean;
  setAudioDuckingSim: (b: boolean) => void;
}) {
  switch (flagKey) {
    case 'video_greetings':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Preview: {module}</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
              {isEnabled ? 'Video Recording Activated' : 'Standard Text/Photo Mode'}
            </span>
          </div>

          {isEnabled ? (
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-extrabold">Video Guestbook Booth</span>
                </div>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>WEBCAM READY</span>
                </span>
              </div>
              
              <div className="h-36 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-3">
                  <div className="text-[11px] font-medium text-slate-300">
                    "Welcome guests! Leave a 15-sec video greeting for Sofia & Leo..."
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Features: HD WebCam capture, Voice filter, Auto-captioning</span>
                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-lg font-bold text-xs">
                  Record 15s Video
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">Standard Memory Capsule Wish Entry</p>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-left text-xs text-slate-500 italic">
                "Type your written wish for the hosts here..."
              </div>
              <p className="text-[10px] text-slate-400">Video greetings feature is currently disabled by administrator.</p>
            </div>
          )}
        </div>
      );

    case 'high_fidelity_zip':
      return (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileArchive className="w-4 h-4 text-slate-900" />
                <span className="text-xs font-extrabold text-slate-900">Export Capsule Media Archive</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Total: 412 Media Files (3.8 GB)</span>
            </div>

            <div className="space-y-2">
              <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                isEnabled ? 'bg-slate-100/90 border-slate-300' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">PRISTINE RAW ZIP Export (Uncompressed)</span>
                    {isEnabled ? (
                      <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded font-extrabold">RAW 4K</span>
                    ) : (
                      <span className="text-[9px] bg-slate-300 text-slate-700 px-2 py-0.5 rounded font-extrabold">DISABLED</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Original native resolutions, EXIF camera metadata, uncompressed PCM audio.
                  </p>
                </div>
                <input type="radio" checked={isEnabled} readOnly className="accent-slate-900" />
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">Standard Web Compressed ZIP</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Optimized 1080p WebP/H.264 images for faster download.</p>
                </div>
                <input type="radio" checked={!isEnabled} readOnly className="accent-slate-900" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'ai_audio_ducking':
      return (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold">Live Projection Audio Controller</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                isEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {isEnabled ? 'AI Voice Ducking Active' : 'Manual Audio Mixing'}
              </span>
            </div>

            {isEnabled ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Background Music Level:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {audioDuckingSim ? '20% (Ducked for Voice)' : '100% (Full BGM)'}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: audioDuckingSim ? '20%' : '100%' }}
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">Simulate incoming guest voice message:</span>
                  <button
                    onClick={() => setAudioDuckingSim(!audioDuckingSim)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                  >
                    {audioDuckingSim ? 'Stop Voice Wish' : 'Trigger Voice Wish'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                AI Audio ducking is disabled. Background music plays at constant volume during voice clips.
              </p>
            )}
          </div>
        </div>
      );

    case 'custom_luts':
      return (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-slate-900" />
                <span className="text-xs font-extrabold text-slate-900">Camera Color Mapping (LUTs)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">5 Custom Filters</span>
            </div>

            {isEnabled ? (
              <div className="space-y-3">
                <div className={`h-28 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                  selectedLut === 'vintage' ? 'bg-amber-900/40 backdrop-sepia' :
                  selectedLut === 'teal' ? 'bg-teal-900/40 backdrop-hue-rotate-90' :
                  selectedLut === 'mono' ? 'bg-slate-900 grayscale' : 'bg-slate-900/80'
                }`}>
                  <div className="text-center text-white z-10">
                    <span className="text-xs font-extrabold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/20">
                      Active LUT Filter: {selectedLut.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 overflow-x-auto">
                  {['original', 'vintage', 'teal', 'mono'].map(lut => (
                    <button
                      key={lut}
                      onClick={() => setSelectedLut(lut)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedLut === lut ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lut.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Custom LUT color mapping is disabled. Guests capture un-filtered camera photos.
              </p>
            )}
          </div>
        </div>
      );

    case 'multi_user_collab':
      return (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-extrabold">Co-hosting Collaboration Channel</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isEnabled ? 'bg-slate-800 text-slate-200' : 'bg-slate-800 text-slate-400'}`}>
                {isEnabled ? 'Co-hosting Enabled' : 'Single Host Mode'}
              </span>
            </div>

            {isEnabled ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-slate-800 rounded-xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Aris Thorne (Owner) - Online</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-slate-800 rounded-xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Sofia Chen (Co-Host) - Editing Brand Kit</span>
                </div>
                <button className="w-full py-1.5 border border-dashed border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                  + Invite Co-Host Administrator
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Multi-user co-hosting disabled. Workspace is restricted to the workspace owner.
              </p>
            )}
          </div>
        </div>
      );

    case 'support_concierge_widget':
      return (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">Floating Live Support Concierge</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                {isEnabled ? 'Widget Visible' : 'Hidden'}
              </span>
            </div>

            {isEnabled ? (
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900">Live Support Channels</span>
                    <p className="text-[10px] text-slate-600">Instant Help • WhatsApp • Email Ticket</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer">
                  Open Widget
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Support Concierge widget is hidden on public pages.
              </p>
            )}
          </div>
        </div>
      );

    case 'currency_multi_support':
      return (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-extrabold text-slate-900">Multi-Currency Tier Selector</span>
              </div>
              {isEnabled && (
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="text-xs font-bold font-mono px-2 py-1 bg-slate-100 border border-slate-300 rounded-lg"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="IDR">IDR (Rp)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              )}
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-300">KAVA Golden Pass (Pro)</span>
                <p className="text-[10px] text-slate-400">Unlimited Guests & RAW Exports</p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold font-mono text-emerald-400">
                  {!isEnabled ? '$49.00 / mo' :
                   selectedCurrency === 'EUR' ? '€45.00 / mo' :
                   selectedCurrency === 'GBP' ? '£39.00 / mo' :
                   selectedCurrency === 'IDR' ? 'Rp 750,000 / mo' :
                   selectedCurrency === 'JPY' ? '¥7,200 / mo' : '$49.00 / mo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-slate-100 rounded-xl text-center text-xs text-slate-600">
          Standard Feature Flag State: {isEnabled ? 'ENABLED' : 'DISABLED'} ({rollout}% Rollout)
        </div>
      );
  }
}
