import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle, 
  Activity, 
  Eye, 
  ExternalLink, 
  Video,
  X,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { TooltipItem, OnboardingAnalytics } from '../types';
import { 
  getStoredTooltips, 
  saveStoredTooltips, 
  getStoredAnalytics, 
  DEFAULT_TOOLTIPS 
} from '../lib/onboarding';

interface TooltipManagerPanelProps {
  triggerToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export default function TooltipManagerPanel({
  triggerToast
}: TooltipManagerPanelProps) {
  const [tooltips, setTooltips] = useState<TooltipItem[]>(getStoredTooltips);
  const [analytics, setAnalytics] = useState<OnboardingAnalytics>(getStoredAnalytics);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [editingTooltip, setEditingTooltip] = useState<TooltipItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTooltips(getStoredTooltips());
    setAnalytics(getStoredAnalytics());

    const handleUpdate = () => {
      setTooltips(getStoredTooltips());
      setAnalytics(getStoredAnalytics());
    };

    window.addEventListener('kava_tooltips_updated', handleUpdate);
    window.addEventListener('kava_analytics_updated', handleUpdate);
    return () => {
      window.removeEventListener('kava_tooltips_updated', handleUpdate);
      window.removeEventListener('kava_analytics_updated', handleUpdate);
    };
  }, []);

  const handleSaveTooltipsList = (updated: TooltipItem[]) => {
    setTooltips(updated);
    saveStoredTooltips(updated);
  };

  const handleToggleEnabled = (id: string) => {
    const updated = tooltips.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t);
    handleSaveTooltipsList(updated);
    triggerToast?.('Tooltip Toggled', 'Tooltip state updated.', 'info');
  };

  const handleDeleteTooltip = (id: string) => {
    const updated = tooltips.filter(t => t.id !== id);
    handleSaveTooltipsList(updated);
    triggerToast?.('Tooltip Deleted', 'Removed component tooltip definition.', 'info');
  };

  const handleResetDefaults = () => {
    saveStoredTooltips(DEFAULT_TOOLTIPS);
    setTooltips(DEFAULT_TOOLTIPS);
    triggerToast?.('Defaults Restored', 'Reset tooltips to factory default list.', 'success');
  };

  const handleOpenCreateModal = () => {
    const newTooltip: TooltipItem = {
      id: `btn-custom-${Date.now()}`,
      title: 'Custom Feature Title',
      content: 'Concise explanation of what this component action executes.',
      position: 'top',
      enabled: true,
      roleRestriction: 'all'
    };
    setEditingTooltip(newTooltip);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: TooltipItem) => {
    setEditingTooltip({ ...t });
    setIsModalOpen(true);
  };

  const handleSaveModalTooltip = () => {
    if (!editingTooltip) return;
    const exists = tooltips.some(t => t.id === editingTooltip.id);
    let updated: TooltipItem[];
    if (exists) {
      updated = tooltips.map(t => t.id === editingTooltip.id ? editingTooltip : t);
    } else {
      updated = [editingTooltip, ...tooltips];
    }
    handleSaveTooltipsList(updated);
    setIsModalOpen(false);
    setEditingTooltip(null);
    triggerToast?.('Tooltip Saved', `Updated tooltip for component ID "${editingTooltip.id}".`, 'success');
  };

  const filteredTooltips = tooltips.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Managed Tooltips</span>
            <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{tooltips.length}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Tooltips</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              {tooltips.filter(t => t.enabled).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Impressions</span>
            <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{analytics.totalTooltipViews}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Completed Tours</span>
            <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{analytics.totalTourCompletions}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Step Drop-Off & Onboarding Analytics Funnel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider font-mono flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-slate-900" />
              <span>Onboarding Funnel & Step Drop-Off Analysis</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Tracking user progression across product tour sequence steps</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Live Telemetry Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {Object.entries(analytics.stepDropOffs).map(([stepKey, val], idx) => {
            const count = Number(val) || 0;
            const maxVal = analytics.totalTourStarts || 1;
            const pct = Math.round((count / maxVal) * 100);
            return (
              <div key={stepKey} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2 text-center">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase">Step {idx + 1}</span>
                <span className="text-lg font-black text-slate-950 block font-mono">{count}</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[9px] font-bold text-slate-500 block">{pct}% retained</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tooltips by ID, title, or content text..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Factory Tooltips</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tooltip</span>
          </button>
        </div>
      </div>

      {/* Tooltips Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                <th className="py-3.5 px-5">Component ID</th>
                <th className="py-3.5 px-4">Title & Description</th>
                <th className="py-3.5 px-4">Position</th>
                <th className="py-3.5 px-4">Role Limit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredTooltips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No component tooltips match search query.
                  </td>
                </tr>
              ) : (
                filteredTooltips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <span className="text-[11px] font-mono font-extrabold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                        #{t.id}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-sm">
                      <h5 className="font-extrabold text-slate-950 text-xs">{t.title || 'Untitled Tooltip'}</h5>
                      <p className="text-[11px] text-slate-500 font-normal leading-normal mt-0.5 line-clamp-2">
                        {t.content}
                      </p>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600 uppercase">
                      {t.position}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-800 capitalize">
                        {t.roleRestriction || 'all'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleEnabled(t.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          t.enabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {t.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(t)}
                          className="p-1.5 hover:bg-slate-100 text-slate-900 rounded-xl transition-colors cursor-pointer"
                          title="Edit Tooltip"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTooltip(t.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors cursor-pointer"
                          title="Delete Tooltip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Tooltip Editor Modal */}
      {isModalOpen && editingTooltip && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden text-left"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950">Manage Component Tooltip</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Linked to element component ID</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Component Element ID</label>
                <input
                  type="text"
                  value={editingTooltip.id}
                  onChange={(e) => setEditingTooltip({ ...editingTooltip, id: e.target.value })}
                  placeholder="btn-create-capsule"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tooltip Heading Title</label>
                <input
                  type="text"
                  value={editingTooltip.title || ''}
                  onChange={(e) => setEditingTooltip({ ...editingTooltip, title: e.target.value })}
                  placeholder="Create Event Capsule"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Content Explanation Text</label>
                <textarea
                  rows={3}
                  value={editingTooltip.content}
                  onChange={(e) => setEditingTooltip({ ...editingTooltip, content: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Position</label>
                  <select
                    value={editingTooltip.position}
                    onChange={(e) => setEditingTooltip({ ...editingTooltip, position: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="auto">Auto Detect</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Role Restriction</label>
                  <select
                    value={editingTooltip.roleRestriction || 'all'}
                    onChange={(e) => setEditingTooltip({ ...editingTooltip, roleRestriction: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Users</option>
                    <option value="host">Host Only</option>
                    <option value="guest">Guest Only</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Documentation Link (Optional)</label>
                <input
                  type="text"
                  value={editingTooltip.linkUrl || ''}
                  onChange={(e) => setEditingTooltip({ ...editingTooltip, linkUrl: e.target.value })}
                  placeholder="https://docs.kava.co/guides/capsules"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalTooltip}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                Save Tooltip
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
