import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  ExternalLink, 
  Layers, 
  Layout, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Globe, 
  Share2, 
  Lock, 
  Smartphone, 
  Camera, 
  Tv, 
  Heart, 
  Check, 
  HelpCircle,
  Megaphone
} from 'lucide-react';
import { FooterConfig, FooterColumn, FooterColumnLink, SocialLink, TrustBadgeItem } from '../types';
import { DEFAULT_FOOTER_CONFIG, getStoredFooterConfig, saveStoredFooterConfig } from '../lib/footerConfig';
import FooterSection from './FooterSection';

interface FooterManagerPanelProps {
  onTriggerToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const FooterManagerPanel: React.FC<FooterManagerPanelProps> = ({ onTriggerToast }) => {
  const [config, setConfig] = useState<FooterConfig>(getStoredFooterConfig());
  const [activeTab, setActiveTab] = useState<'cta' | 'badges' | 'brand' | 'social' | 'columns'>('cta');
  const [activeColIndex, setActiveColIndex] = useState<number>(0);
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);

  const handleSave = () => {
    saveStoredFooterConfig(config);
    onTriggerToast('Footer Saved', 'Footer & CTA configuration updated and synchronized to Landing Page.', 'success');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the footer configuration to default settings?')) {
      setConfig(DEFAULT_FOOTER_CONFIG);
      saveStoredFooterConfig(DEFAULT_FOOTER_CONFIG);
      onTriggerToast('Footer Reset', 'Footer settings restored to system default values.', 'info');
    }
  };

  // Helper updates
  const updateField = <K extends keyof FooterConfig>(key: K, value: FooterConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Trust Badges
  const handleUpdateBadge = (index: number, key: keyof TrustBadgeItem, value: any) => {
    const updated = [...config.trustBadges];
    updated[index] = { ...updated[index], [key]: value };
    setConfig(prev => ({ ...prev, trustBadges: updated }));
  };

  const handleAddBadge = () => {
    if (config.trustBadges.length >= 6) {
      onTriggerToast('Limit Reached', 'Maximum 6 trust badges recommended.', 'info');
      return;
    }
    const newBadge: TrustBadgeItem = {
      id: `tb_${Date.now()}`,
      iconName: 'check',
      label: 'New Trust Badge',
    };
    setConfig(prev => ({ ...prev, trustBadges: [...prev.trustBadges, newBadge] }));
  };

  const handleRemoveBadge = (index: number) => {
    setConfig(prev => ({
      ...prev,
      trustBadges: prev.trustBadges.filter((_, i) => i !== index),
    }));
  };

  // Social Links
  const handleUpdateSocial = (index: number, key: keyof SocialLink, value: any) => {
    const updated = [...config.socialLinks];
    updated[index] = { ...updated[index], [key]: value };
    setConfig(prev => ({ ...prev, socialLinks: updated }));
  };

  // Columns & Links
  const handleUpdateColumnTitle = (colIndex: number, title: string) => {
    const updated = [...config.columns];
    updated[colIndex] = { ...updated[colIndex], title };
    setConfig(prev => ({ ...prev, columns: updated }));
  };

  const handleAddColumnLink = (colIndex: number) => {
    const updated = [...config.columns];
    const newLink: FooterColumnLink = {
      id: `link_${Date.now()}`,
      label: 'New Link',
      href: '#',
      actionType: 'scroll',
    };
    updated[colIndex] = {
      ...updated[colIndex],
      links: [...updated[colIndex].links, newLink],
    };
    setConfig(prev => ({ ...prev, columns: updated }));
  };

  const handleUpdateColumnLink = (colIndex: number, linkIndex: number, key: keyof FooterColumnLink, value: any) => {
    const updated = [...config.columns];
    const colLinks = [...updated[colIndex].links];
    colLinks[linkIndex] = { ...colLinks[linkIndex], [key]: value };
    updated[colIndex] = { ...updated[colIndex], links: colLinks };
    setConfig(prev => ({ ...prev, columns: updated }));
  };

  const handleRemoveColumnLink = (colIndex: number, linkIndex: number) => {
    const updated = [...config.columns];
    updated[colIndex] = {
      ...updated[colIndex],
      links: updated[colIndex].links.filter((_, i) => i !== linkIndex),
    };
    setConfig(prev => ({ ...prev, columns: updated }));
  };

  const handleMoveColumnLink = (colIndex: number, linkIndex: number, direction: 'up' | 'down') => {
    const updated = [...config.columns];
    const links = [...updated[colIndex].links];
    const targetIndex = direction === 'up' ? linkIndex - 1 : linkIndex + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const temp = links[linkIndex];
    links[linkIndex] = links[targetIndex];
    links[targetIndex] = temp;

    updated[colIndex] = { ...updated[colIndex], links };
    setConfig(prev => ({ ...prev, columns: updated }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-800">
              <Layout className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black tracking-tight text-slate-900">Footer & Final CTA Manager</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Customize the landing page's final call-to-action block, 4-column navigation, brand metadata, trust badges, and social links with real-time preview.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowLivePreview(prev => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
              showLivePreview 
                ? 'bg-slate-900 text-white border-transparent shadow-xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showLivePreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Synchronize</span>
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW BOX */}
      {showLivePreview && (
        <div className="bg-slate-900 rounded-[32px] p-2 border border-slate-800/40 shadow-xl overflow-hidden relative">
          <div className="bg-slate-950/80 px-4 py-2 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Landing Page Live Preview</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold">Instant Render Sync</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800/40">
            <FooterSection config={config} />
          </div>
        </div>
      )}

      {/* EDITOR SECTION TABS */}
      <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-sm space-y-6">
        
        {/* Sub-tab navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 overflow-x-auto">
          {[
            { id: 'cta', label: 'Final CTA Block', icon: Megaphone },
            { id: 'badges', label: 'Trust Badges', icon: ShieldCheck },
            { id: 'brand', label: 'Brand & Copyright', icon: Layers },
            { id: 'social', label: 'Social Media Links', icon: Share2 },
            { id: 'columns', label: '4-Column Navigation', icon: Layout },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: FINAL CTA BLOCK */}
        {activeTab === 'cta' && (
          <div className="space-y-5 animate-fade-in max-w-4xl">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Final Call-To-Action Banner Configuration</h3>
              <p className="text-xs text-slate-500">Edit the primary conversion section displayed immediately above the footer.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Badge Tagline</label>
                <input
                  type="text"
                  value={config.badgeTagline}
                  onChange={(e) => updateField('badgeTagline', e.target.value)}
                  placeholder="e.g. Start Preserving Today"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Small Trust Indicator</label>
                <input
                  type="text"
                  value={config.ctaTrustIndicator}
                  onChange={(e) => updateField('ctaTrustIndicator', e.target.value)}
                  placeholder="e.g. No app required • Free to start • Setup in under 60 seconds"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Main CTA Headline</label>
                <input
                  type="text"
                  value={config.ctaHeadline}
                  onChange={(e) => updateField('ctaHeadline', e.target.value)}
                  placeholder="e.g. Create a timeless memory capsule for your special event."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">CTA Description</label>
                <textarea
                  rows={2}
                  value={config.ctaDescription}
                  onChange={(e) => updateField('ctaDescription', e.target.value)}
                  placeholder="e.g. Give your wedding, graduation, or family gathering the emotional storage it deserves..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Button Text</label>
                <input
                  type="text"
                  value={config.primaryCtaText}
                  onChange={(e) => updateField('primaryCtaText', e.target.value)}
                  placeholder="e.g. Create Your Capsule"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Button Action</label>
                <select
                  value={config.primaryCtaAction}
                  onChange={(e) => updateField('primaryCtaAction', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                >
                  <option value="create">Create Capsule Trigger</option>
                  <option value="checkout">Open Checkout Flow</option>
                  <option value="demo">Explore Sandbox Demo</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Secondary Button Text</label>
                <input
                  type="text"
                  value={config.secondaryCtaText}
                  onChange={(e) => updateField('secondaryCtaText', e.target.value)}
                  placeholder="e.g. Explore Live Sandbox"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Secondary Button Action</label>
                <select
                  value={config.secondaryCtaAction}
                  onChange={(e) => updateField('secondaryCtaAction', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                >
                  <option value="demo">Explore Sandbox Demo</option>
                  <option value="scroll">Scroll to How It Works</option>
                  <option value="support">Open Contact Support</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRUST BADGES */}
        {activeTab === 'badges' && (
          <div className="space-y-5 animate-fade-in max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Compact Row of Trust Badges</h3>
                <p className="text-xs text-slate-500">Displayed directly beneath the CTA buttons to reinforce trust before conversion.</p>
              </div>
              <button
                type="button"
                onClick={handleAddBadge}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Badge</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.trustBadges.map((badge, idx) => (
                <div key={badge.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Badge #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBadge(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 rounded hover:bg-rose-50"
                      title="Remove Badge"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold mb-1">Icon</label>
                      <select
                        value={badge.iconName}
                        onChange={(e) => handleUpdateBadge(idx, 'iconName', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      >
                        <option value="camera">Camera (Photos)</option>
                        <option value="smartphone">Smartphone (Mobile Web)</option>
                        <option value="tv">TV (Live Screen)</option>
                        <option value="shield">Shield (Security)</option>
                        <option value="sparkles">Sparkles (Quality)</option>
                        <option value="heart">Heart (Wishes)</option>
                        <option value="lock">Lock (Privacy)</option>
                        <option value="check">Checkmark</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold mb-1">Label Text</label>
                      <input
                        type="text"
                        value={badge.label}
                        onChange={(e) => handleUpdateBadge(idx, 'label', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                        placeholder="e.g. Raw Photos"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BRAND & COPYRIGHT */}
        {activeTab === 'brand' && (
          <div className="space-y-5 animate-fade-in max-w-4xl">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Brand Identity & Copyright Information</h3>
              <p className="text-xs text-slate-500">Configure logo branding, slogan, concise brand summary, and bottom copyright line.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Brand Name</label>
                <input
                  type="text"
                  value={config.brandName}
                  onChange={(e) => updateField('brandName', e.target.value)}
                  placeholder="e.g. KAVA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Slogan / Tagline</label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder={`"We don't store files. We preserve memories."`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Concise Brand Description</label>
                <textarea
                  rows={2}
                  value={config.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="KAVA is the collaborative memory capsule platform for weddings, milestones, and family circles..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Copyright Line</label>
                <input
                  type="text"
                  value={config.copyrightText}
                  onChange={(e) => updateField('copyrightText', e.target.value)}
                  placeholder="© 2026 KAVA Inc. Designed with care in Big Sur."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SOCIAL MEDIA LINKS */}
        {activeTab === 'social' && (
          <div className="space-y-5 animate-fade-in max-w-4xl">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Social Media & Contact Icons</h3>
              <p className="text-xs text-slate-500">Enable or edit links to official social profiles and contact endpoints.</p>
            </div>

            <div className="space-y-3">
              {config.socialLinks.map((social, idx) => (
                <div key={social.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 w-full md:w-auto">
                    <input
                      type="checkbox"
                      checked={social.enabled}
                      onChange={(e) => handleUpdateSocial(idx, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded text-slate-900 focus:ring-0 cursor-pointer"
                    />
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {social.platform.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{social.label}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{social.platform}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-2/3">
                    <input
                      type="text"
                      value={social.url}
                      onChange={(e) => handleUpdateSocial(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 4-COLUMN NAVIGATION */}
        {activeTab === 'columns' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Structured 4-Column Navigation Layout</h3>
              <p className="text-xs text-slate-500">Configure Column titles and link lists (Product, Resources, Company, Connect). On mobile devices, these automatically collapse into smooth accordions.</p>
            </div>

            {/* Column Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {config.columns.map((col, idx) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setActiveColIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeColIndex === idx
                      ? 'bg-slate-900 text-white border-transparent shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase font-bold block text-slate-400">Column {idx + 1}</span>
                  <span className="text-xs font-extrabold truncate block mt-0.5">{col.title || 'Untitled'}</span>
                  <span className="text-[10px] opacity-70 block">{col.links.length} links</span>
                </button>
              ))}
            </div>

            {/* Active Column Editor */}
            {config.columns[activeColIndex] && (
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Editing Column #{activeColIndex + 1}</span>
                    <h4 className="text-sm font-black text-slate-900">Manage Column Links & Titles</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddColumnLink(activeColIndex)}
                    className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Column Title</label>
                  <input
                    type="text"
                    value={config.columns[activeColIndex].title}
                    onChange={(e) => handleUpdateColumnTitle(activeColIndex, e.target.value)}
                    placeholder="e.g. Product"
                    className="w-full max-w-md bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                {/* Links list */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Column Links</span>

                  {config.columns[activeColIndex].links.map((link, lIdx) => (
                    <div key={link.id} className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">Link #{lIdx + 1}</span>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleMoveColumnLink(activeColIndex, lIdx, 'up')}
                            disabled={lIdx === 0}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveColumnLink(activeColIndex, lIdx, 'down')}
                            disabled={lIdx === config.columns[activeColIndex].links.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveColumnLink(activeColIndex, lIdx)}
                            className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                            title="Delete Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold mb-1">Label</label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateColumnLink(activeColIndex, lIdx, 'label', e.target.value)}
                            placeholder="e.g. How It Works"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold mb-1">URL / Anchor</label>
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => handleUpdateColumnLink(activeColIndex, lIdx, 'href', e.target.value)}
                            placeholder="e.g. #how-it-works or https://..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-medium text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold mb-1">Badge (Optional)</label>
                          <input
                            type="text"
                            value={link.badge || ''}
                            onChange={(e) => handleUpdateColumnLink(activeColIndex, lIdx, 'badge', e.target.value)}
                            placeholder="e.g. Live or Operational"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-emerald-700"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 pt-1 text-xs">
                        <label className="flex items-center space-x-1.5 text-slate-700 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!link.isExternal}
                            onChange={(e) => handleUpdateColumnLink(activeColIndex, lIdx, 'isExternal', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-slate-900 focus:ring-0"
                          />
                          <span className="text-[11px]">External Link (New Tab)</span>
                        </label>

                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Action:</span>
                          <select
                            value={link.actionType || 'scroll'}
                            onChange={(e) => handleUpdateColumnLink(activeColIndex, lIdx, 'actionType', e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-bold text-slate-800"
                          >
                            <option value="scroll">Smooth Scroll Anchor</option>
                            <option value="modal">Open Support Modal</option>
                            <option value="demo">Launch Sandbox Demo</option>
                            <option value="link">Direct Hyperlink</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default FooterManagerPanel;
