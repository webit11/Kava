import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Calendar, 
  Link as LinkIcon, 
  Palette, 
  Save, 
  RotateCcw,
  Clock,
  ArrowRight,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Tag,
  Globe,
  Image as ImageIcon,
  Flame,
  X,
  Video,
  Monitor,
  Smartphone,
  Filter,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { LandingBannerConfig, MegaMenuCampaign } from '../types';
import { 
  getLandingBannerConfig, 
  saveLandingBannerConfig, 
  DEFAULT_LANDING_BANNER,
  getStoredMegaMenuCampaigns,
  saveMegaMenuCampaigns,
  DEFAULT_MEGA_MENU_CAMPAIGNS
} from '../lib/billing';

interface LandingBannerManagerPanelProps {
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'info' | 'error') => void;
}

export const LandingBannerManagerPanel: React.FC<LandingBannerManagerPanelProps> = ({
  onTriggerToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'top_banner' | 'mega_menu'>('mega_menu');

  // Top Banner state
  const [config, setConfig] = useState<LandingBannerConfig>(getLandingBannerConfig);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Mega Menu Campaigns state
  const [campaigns, setCampaigns] = useState<MegaMenuCampaign[]>(getStoredMegaMenuCampaigns);
  const [editingCampaign, setEditingCampaign] = useState<MegaMenuCampaign | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Campaign Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'active'>('all');

  // Sync state with storage
  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getLandingBannerConfig());
      setCampaigns(getStoredMegaMenuCampaigns());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('kava_landing_banner_updated', handleUpdate);
    window.addEventListener('kava_mega_menu_campaigns_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('kava_landing_banner_updated', handleUpdate);
      window.removeEventListener('kava_mega_menu_campaigns_updated', handleUpdate);
    };
  }, []);

  const handleSaveTopBanner = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = {
      ...config,
      updatedAt: new Date().toISOString()
    };
    saveLandingBannerConfig(updated);
    setIsSavedSuccess(true);
    onTriggerToast('Top Banner Published', 'Changes are now live across the landing page.', 'success');
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  const handleResetTopBanner = () => {
    setConfig(DEFAULT_LANDING_BANNER);
    saveLandingBannerConfig(DEFAULT_LANDING_BANNER);
    onTriggerToast('Top Banner Reset', 'Restored to default top announcement banner.', 'info');
  };

  // Mega Menu Campaign Handlers
  const handleSaveCampaignsList = (updated: MegaMenuCampaign[], toastMsg = 'Campaigns Saved') => {
    setCampaigns(updated);
    saveMegaMenuCampaigns(updated);
    onTriggerToast(toastMsg, 'Spotlight promotion campaigns updated live.', 'success');
  };

  const handleToggleCampaignActive = (id: string) => {
    const updated = campaigns.map(c => c.id === id ? { ...c, active: !c.active, updatedAt: new Date().toISOString() } : c);
    handleSaveCampaignsList(updated, 'Campaign Status Toggled');
  };

  const handleDeleteCampaign = (id: string) => {
    const updated = campaigns.filter(c => c.id !== id);
    handleSaveCampaignsList(updated, 'Campaign Removed');
  };

  const handleDuplicateCampaign = (campaign: MegaMenuCampaign) => {
    const duplicated: MegaMenuCampaign = {
      ...campaign,
      id: `mmc-${Date.now()}`,
      title: `${campaign.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    handleSaveCampaignsList([duplicated, ...campaigns], 'Campaign Duplicated');
  };

  const handleOpenCreateCampaign = () => {
    setEditingCampaign({
      id: `mmc-${Date.now()}`,
      title: 'New Spotlight Campaign',
      description: 'Highlight your latest announcement, offer, or feature in the navigation spotlight.',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
      videoUrl: '',
      mediaType: 'image',
      badgeText: 'FEATURED',
      badgeStyle: 'amber',
      categoryTarget: 'how_it_works',
      deviceTarget: 'all',
      ctaText: 'Explore Demo →',
      ctaAction: 'demo',
      ctaUrl: '',
      priority: 10,
      targetLanguage: 'all',
      startDate: '',
      endDate: '',
      status: 'published',
      abVariant: 'Control',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsCampaignModalOpen(true);
  };

  const handleSaveCampaignModal = () => {
    if (!editingCampaign) return;
    const exists = campaigns.some(c => c.id === editingCampaign.id);
    let updated: MegaMenuCampaign[];
    if (exists) {
      updated = campaigns.map(c => c.id === editingCampaign.id ? { ...editingCampaign, updatedAt: new Date().toISOString() } : c);
    } else {
      updated = [editingCampaign, ...campaigns];
    }
    handleSaveCampaignsList(updated, 'Spotlight Campaign Saved');
    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
  };

  const handleResetDefaultCampaigns = () => {
    handleSaveCampaignsList(DEFAULT_MEGA_MENU_CAMPAIGNS, 'Campaign Defaults Restored');
  };

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(c => {
    if (categoryFilter !== 'all' && c.categoryTarget !== categoryFilter && c.categoryTarget !== 'all') {
      return false;
    }
    if (statusFilter === 'published' && c.status === 'draft') return false;
    if (statusFilter === 'draft' && c.status !== 'draft') return false;
    if (statusFilter === 'active' && !c.active) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.badgeText && c.badgeText.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Theme styling mapping for top banner preview
  const themeClasses: Record<LandingBannerConfig['theme'], { bg: string; text: string; btn: string; border: string }> = {
    monochrome: {
      bg: 'bg-gradient-to-r from-slate-900 via-zinc-900 to-black',
      text: 'text-slate-100',
      btn: 'bg-white hover:bg-slate-100 text-slate-900 font-bold',
      border: 'border-slate-800'
    },
    slate: {
      bg: 'bg-slate-950',
      text: 'text-slate-200',
      btn: 'bg-slate-800 hover:bg-slate-700 text-white',
      border: 'border-slate-800'
    },
    emerald: {
      bg: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950',
      text: 'text-emerald-100',
      btn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
      border: 'border-emerald-800/50'
    },
    amber: {
      bg: 'bg-gradient-to-r from-amber-950 via-orange-900 to-slate-950',
      text: 'text-amber-100',
      btn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
      border: 'border-amber-700/50'
    },
    rose: {
      bg: 'bg-gradient-to-r from-rose-950 via-pink-900 to-slate-950',
      text: 'text-rose-100',
      btn: 'bg-rose-500 hover:bg-rose-400 text-white font-bold',
      border: 'border-rose-800/50'
    },
    gradient: {
      bg: 'bg-gradient-to-r from-slate-900 via-neutral-900 to-stone-900',
      text: 'text-white',
      btn: 'bg-white hover:bg-slate-100 text-slate-900 font-bold',
      border: 'border-white/20'
    }
  };

  const activeTheme = themeClasses[config.theme] || themeClasses.monochrome;

  // Badge Style Classes Helper
  const getBadgeStyleClass = (style?: string) => {
    switch (style) {
      case 'amber': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rose': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'violet': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'slate': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'monochrome': default: return 'bg-slate-900 text-white border-slate-700';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Panel Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Megaphone className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Landing Page Campaign & Navigation Studio
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Spotlight Campaign Manager</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Configure promotional cards, media banners, language targeting, device rules, and carousel behavior inside the navigation mega menu and landing sections.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-2xl z-10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('mega_menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeSubTab === 'mega_menu'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Spotlight Campaigns ({campaigns.filter(c => c.active).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('top_banner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeSubTab === 'top_banner'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top Announcement Bar</span>
          </button>
        </div>
      </div>

      {/* ==================== SUB-TAB 1: SPOTLIGHT MEGA MENU CAMPAIGNS ==================== */}
      {activeSubTab === 'mega_menu' && (
        <div className="space-y-6 animate-fade-in">
          {/* Action & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Spotlight Campaign Library</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage cards, banners, A/B variants, device visibility, and schedules. Changes sync instantly to visitors.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetDefaultCampaigns}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenCreateCampaign}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-md flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Create Campaign</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search campaign title, description, or badge..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Category Targets</option>
                  <option value="how_it_works">How It Works</option>
                  <option value="capsule_types">Capsule Types</option>
                  <option value="pricing">Pricing</option>
                  <option value="resources">Resources</option>
                  <option value="navbar">Navbar Mega Menu</option>
                  <option value="hero">Hero Banner</option>
                  <option value="footer">Footer CTA</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Toggled Only</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Campaign List Grid */}
          {filteredCampaigns.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Layers className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No campaigns match your current filters</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Try clearing search terms or reset campaign defaults to inspect preset cards.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCampaigns.map((camp) => (
                <div 
                  key={camp.id}
                  className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all relative ${
                    camp.active ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/50 opacity-60'
                  }`}
                >
                  {/* Header Badge, Category & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0 flex-wrap gap-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 truncate">
                        {camp.categoryTarget.toUpperCase().replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-extrabold uppercase ${
                        camp.status === 'draft' ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {camp.status || 'published'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        P:{camp.priority}
                      </span>
                    </div>

                    {/* Active Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={camp.active}
                        onChange={() => handleToggleCampaignActive(camp.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* Card Preview Mock inside Admin */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3.5 space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 shrink-0 bg-slate-900 relative">
                        {camp.mediaType === 'video' && camp.videoUrl ? (
                          <video src={camp.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                        )}
                        {camp.mediaType === 'video' && (
                          <div className="absolute top-1 right-1 p-0.5 bg-slate-950/80 rounded text-amber-400">
                            <Video className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        {camp.badgeText && (
                          <span className={`inline-block px-2 py-0.5 text-[9px] font-mono font-extrabold uppercase rounded border ${getBadgeStyleClass(camp.badgeStyle)}`}>
                            {camp.badgeText}
                          </span>
                        )}
                        <h4 className="text-xs font-extrabold text-white truncate">{camp.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">{camp.description}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 flex-wrap gap-1">
                      <span>Device: {camp.deviceTarget || 'all'}</span>
                      <span>A/B: {camp.abVariant || 'Control'}</span>
                      <span className="text-amber-400 font-bold">{camp.ctaText}</span>
                    </div>
                  </div>

                  {/* Card Action Controls */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <div className="text-[10px] text-slate-500 font-mono">
                      Lang: {camp.targetLanguage || 'all'}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicateCampaign(camp)}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Duplicate Campaign"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingCampaign(camp); setIsCampaignModalOpen(true); }}
                        className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 text-xs font-bold"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== SUB-TAB 2: TOP ANNOUNCEMENT BANNER ==================== */}
      {activeSubTab === 'top_banner' && (
        <div className="space-y-6 animate-fade-in">
          {/* Live Preview Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Live Top Banner Visitor Preview</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                config.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}>
                {config.enabled ? '● Active on Landing' : '○ Disabled'}
              </span>
            </div>

            <div className="border border-slate-800 rounded-2xl p-2 bg-slate-950 overflow-hidden">
              {config.enabled ? (
                <div className={`w-full py-2.5 px-4 rounded-xl border ${activeTheme.bg} ${activeTheme.border} ${activeTheme.text} flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md transition-all`}>
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
                    <span className="font-semibold truncate">{config.text || 'Announcement banner text here...'}</span>
                  </div>
                  {config.ctaText && (
                    <div className="shrink-0 flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 ${activeTheme.btn}`}>
                        <span>{config.ctaText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-500 font-mono italic">
                  Top announcement bar is currently disabled. Toggle &quot;Enable Banner&quot; below to show it.
                </div>
              )}
            </div>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleSaveTopBanner} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Banner Status & Copy</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Control visibility and main bar announcement text</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-2.5 text-xs font-bold text-slate-300">{config.enabled ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Banner Announcement Text</span>
                    <span className="text-[10px] text-slate-500 font-mono">{config.text.length} / 120 chars</span>
                  </label>
                  <textarea
                    rows={2}
                    maxLength={120}
                    value={config.text}
                    onChange={(e) => setConfig({ ...config, text: e.target.value })}
                    placeholder="e.g. 🎉 Preserving moments as they happen. Introducing KAVA 2026!"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">CTA Button Label</label>
                    <input
                      type="text"
                      value={config.ctaText || ''}
                      onChange={(e) => setConfig({ ...config, ctaText: e.target.value })}
                      placeholder="e.g. Explore Demo, Upgrade, Start Free"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Destination Action</span>
                    </label>
                    <select
                      value={config.destinationUrl || 'demo'}
                      onChange={(e) => {
                        const val = e.target.value;
                        let actionType: LandingBannerConfig['actionType'] = 'scroll';
                        if (val === 'demo') actionType = 'demo';
                        else if (val === '#pricing') actionType = 'scroll';
                        else if (val === '#create') actionType = 'scroll';
                        setConfig({ ...config, destinationUrl: val, actionType });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="demo">Interactive Demo (Launch Demo Modal)</option>
                      <option value="#pricing">Scroll to Pricing Section</option>
                      <option value="#create">Trigger Create Event</option>
                      <option value="#faq">Scroll to FAQ Section</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleResetTopBanner}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-lg flex items-center space-x-2"
                >
                  {isSavedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Published!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-slate-950" />
                      <span>Publish Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Theme Selector Column */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Theme Palette</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'monochrome', name: 'Charcoal Nocturne', bg: 'from-slate-900 to-black', desc: 'Sleek Monochromatic' },
                    { id: 'slate', name: 'Dark Slate', bg: 'from-slate-900 to-slate-950', desc: 'Clean Subtle Gray' },
                    { id: 'emerald', name: 'Mint Emerald', bg: 'from-emerald-900 to-teal-950', desc: 'Fresh Product Launch' },
                    { id: 'amber', name: 'Amber Gold', bg: 'from-amber-900 to-orange-950', desc: 'High Impact Special' },
                    { id: 'rose', name: 'Crimson Rose', bg: 'from-rose-900 to-pink-950', desc: 'Urgency & Flash Offer' }
                  ].map((themeItem) => (
                    <button
                      key={themeItem.id}
                      type="button"
                      onClick={() => setConfig({ ...config, theme: themeItem.id as LandingBannerConfig['theme'] })}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        config.theme === themeItem.id 
                          ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/30' 
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-r ${themeItem.bg} border border-white/20 shrink-0`} />
                        <div>
                          <p className="text-xs font-bold">{themeItem.name}</p>
                          <p className="text-[10px] text-slate-500">{themeItem.desc}</p>
                        </div>
                      </div>
                      {config.theme === themeItem.id && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ==================== CREATE / EDIT CAMPAIGN MODAL ==================== */}
      {isCampaignModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 text-white space-y-5 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Configure Spotlight Promotion Campaign</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize category targets, media, CTA actions, device rules, and schedule dates</p>
              </div>

              <button
                type="button"
                onClick={() => { setIsCampaignModalOpen(false); setEditingCampaign(null); }}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Fields */}
            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              
              {/* Category Assignment & Target Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Target Location / Category</label>
                  <select
                    value={editingCampaign.categoryTarget}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, categoryTarget: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="how_it_works">How It Works Menu</option>
                    <option value="capsule_types">Capsule Types Menu</option>
                    <option value="pricing">Pricing Menu</option>
                    <option value="resources">Resources Menu</option>
                    <option value="navbar">Navbar Mega Menu Spotlight</option>
                    <option value="all">All Navigation Menus</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Audience Language</label>
                  <select
                    value={editingCampaign.targetLanguage || 'all'}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, targetLanguage: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Languages</option>
                    <option value="en">English (en)</option>
                    <option value="id">Indonesian (id)</option>
                    <option value="vi">Vietnamese (vi)</option>
                    <option value="zh">Chinese (zh)</option>
                    <option value="ja">Japanese (ja)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Target Devices</label>
                  <select
                    value={editingCampaign.deviceTarget || 'all'}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, deviceTarget: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Devices (Desktop & Mobile)</option>
                    <option value="desktop">Desktop Only</option>
                    <option value="mobile_tablet">Mobile & Tablet Only</option>
                  </select>
                </div>
              </div>

              {/* Title & Badge Text & Style */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Campaign Title</label>
                  <input
                    type="text"
                    value={editingCampaign.title}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                    placeholder="e.g. 4K Live Projection Wall v2.4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Badge Label</label>
                  <input
                    type="text"
                    value={editingCampaign.badgeText || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, badgeText: e.target.value })}
                    placeholder="e.g. NEW, FEATURED, 20% OFF"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Badge Accent Style</label>
                  <select
                    value={editingCampaign.badgeStyle || 'amber'}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, badgeStyle: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="amber">Amber Gold</option>
                    <option value="emerald">Mint Emerald</option>
                    <option value="rose">Rose Crimson</option>
                    <option value="violet">Dark Slate</option>
                    <option value="slate">Slate Gray</option>
                    <option value="monochrome">Monochrome Black</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Campaign Description / Subtitle</label>
                <textarea
                  rows={2}
                  value={editingCampaign.description}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                  placeholder="Engaging concise details explaining the feature or promotion..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Media Type & URLs */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Media Cover & Preview</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingCampaign({ ...editingCampaign, mediaType: 'image' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        editingCampaign.mediaType !== 'video' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCampaign({ ...editingCampaign, mediaType: 'video' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        editingCampaign.mediaType === 'video' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Video
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-mono">Image Cover URL</label>
                    <input
                      type="text"
                      value={editingCampaign.imageUrl}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  {editingCampaign.mediaType === 'video' && (
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-mono">MP4 / Video URL</label>
                      <input
                        type="text"
                        value={editingCampaign.videoUrl || ''}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, videoUrl: e.target.value })}
                        placeholder="https://assets.example.com/video.mp4"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Text, Action & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">CTA Button Label</label>
                  <input
                    type="text"
                    value={editingCampaign.ctaText}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, ctaText: e.target.value })}
                    placeholder="e.g. Explore Demo →"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">CTA Action Behavior</label>
                  <select
                    value={editingCampaign.ctaAction}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, ctaAction: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="demo">Launch Interactive Demo Modal</option>
                    <option value="create">Open Create Event Modal</option>
                    <option value="scroll">Scroll to Section (#pricing, #faq, etc.)</option>
                    <option value="link">Navigate External URL</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Destination URL / Anchor</label>
                  <input
                    type="text"
                    value={editingCampaign.ctaUrl || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, ctaUrl: e.target.value })}
                    placeholder="e.g. #pricing or https://kava.app/special"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Scheduling: Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Start Release Date</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={editingCampaign.startDate ? editingCampaign.startDate.substring(0, 16) : ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>End Release Date</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={editingCampaign.endDate ? editingCampaign.endDate.substring(0, 16) : ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Countdown End Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={editingCampaign.countdownEndTime ? editingCampaign.countdownEndTime.substring(0, 16) : ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, countdownEndTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Status, Priority, A/B Testing & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Publish Status</label>
                  <select
                    value={editingCampaign.status || 'published'}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Priority (1-100)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editingCampaign.priority}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, priority: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">A/B Variant Tag</label>
                  <select
                    value={editingCampaign.abVariant || 'Control'}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, abVariant: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Control">Control</option>
                    <option value="A">Variant A</option>
                    <option value="B">Variant B</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-center">
                  <label className="text-xs font-bold text-slate-300">Active Status</label>
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={editingCampaign.active}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-2.5 text-xs font-bold text-slate-300">{editingCampaign.active ? 'Active' : 'Disabled'}</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => { setIsCampaignModalOpen(false); setEditingCampaign(null); }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveCampaignModal}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-lg flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>Save Campaign</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingBannerManagerPanel;
