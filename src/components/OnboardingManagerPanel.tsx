import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  Play, 
  Pause, 
  CheckCircle, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Compass, 
  Activity, 
  Settings,
  X,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { OnboardingGuide, OnboardingStep, OnboardingAnalytics } from '../types';
import { 
  getStoredGuides, 
  saveStoredGuides, 
  getStoredAnalytics, 
  DEFAULT_ONBOARDING_GUIDE 
} from '../lib/onboarding';

interface OnboardingManagerPanelProps {
  onTestTourPreview?: (guide: OnboardingGuide) => void;
  triggerToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export default function OnboardingManagerPanel({
  onTestTourPreview,
  triggerToast
}: OnboardingManagerPanelProps) {
  const [guides, setGuides] = useState<OnboardingGuide[]>(getStoredGuides);
  const [analytics, setAnalytics] = useState<OnboardingAnalytics>(getStoredAnalytics);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal State
  const [editingGuide, setEditingGuide] = useState<OnboardingGuide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setGuides(getStoredGuides());
    setAnalytics(getStoredAnalytics());

    const handleUpdate = () => {
      setGuides(getStoredGuides());
      setAnalytics(getStoredAnalytics());
    };

    window.addEventListener('kava_guides_updated', handleUpdate);
    window.addEventListener('kava_analytics_updated', handleUpdate);
    return () => {
      window.removeEventListener('kava_guides_updated', handleUpdate);
      window.removeEventListener('kava_analytics_updated', handleUpdate);
    };
  }, []);

  const handleSaveGuidesList = (updated: OnboardingGuide[]) => {
    setGuides(updated);
    saveStoredGuides(updated);
  };

  const handleToggleStatus = (id: string) => {
    const updated = guides.map(g => {
      if (g.id === id) {
        return {
          ...g,
          status: (g.status === 'active' ? 'draft' : 'active') as any,
          updatedAt: new Date().toISOString()
        };
      }
      return g;
    });
    handleSaveGuidesList(updated);
    triggerToast?.('Status Updated', 'Onboarding guide status changed.', 'info');
  };

  const handleDuplicateGuide = (source: OnboardingGuide) => {
    const copy: OnboardingGuide = {
      ...source,
      id: `guide_${Date.now()}`,
      name: `${source.name} (Copy)`,
      version: `${parseFloat(source.version || '1.0') + 0.1}`,
      status: 'draft',
      updatedAt: new Date().toISOString()
    };
    const updated = [copy, ...guides];
    handleSaveGuidesList(updated);
    triggerToast?.('Guide Duplicated', `Created draft copy of "${source.name}".`, 'success');
  };

  const handleDeleteGuide = (id: string) => {
    if (guides.length <= 1) {
      triggerToast?.('Action Denied', 'At least one onboarding guide must remain in system.', 'error');
      return;
    }
    const guideToDelete = guides.find(g => g.id === id);
    if (!window.confirm(`Are you sure you want to delete the onboarding guide "${guideToDelete?.name || id}"?`)) {
      return;
    }
    const updated = guides.filter(g => g.id !== id);
    handleSaveGuidesList(updated);
    triggerToast?.('Guide Removed', 'Onboarding guide deleted.', 'info');
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Are you sure you want to reset all onboarding guides to system defaults? Any custom guides will be replaced.')) {
      return;
    }
    saveStoredGuides([DEFAULT_ONBOARDING_GUIDE]);
    setGuides([DEFAULT_ONBOARDING_GUIDE]);
    triggerToast?.('Defaults Restored', 'Reset onboarding guides to system factory default.', 'success');
  };

  const handleOpenCreateModal = () => {
    const newGuide: OnboardingGuide = {
      id: `guide_${Date.now()}`,
      name: 'New Custom Product Tour',
      version: '1.0',
      status: 'draft',
      targetRole: 'Host',
      triggerType: 'first_login',
      requiredPlan: 'All',
      language: 'en',
      steps: [
        {
          id: `step_${Date.now()}_1`,
          targetId: '#nav-workspace',
          title: 'Welcome Step Title',
          description: 'Explain the core functionality of this section in one or two clear sentences.',
          position: 'bottom',
          ctaText: 'Next'
        }
      ],
      updatedAt: new Date().toISOString()
    };
    setEditingGuide(newGuide);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (g: OnboardingGuide) => {
    setEditingGuide(JSON.parse(JSON.stringify(g)));
    setIsModalOpen(true);
  };

  const handleSaveModalGuide = () => {
    if (!editingGuide) return;
    const exists = guides.some(g => g.id === editingGuide.id);
    let updated: OnboardingGuide[];
    if (exists) {
      updated = guides.map(g => g.id === editingGuide.id ? { ...editingGuide, updatedAt: new Date().toISOString() } : g);
    } else {
      updated = [{ ...editingGuide, updatedAt: new Date().toISOString() }, ...guides];
    }
    handleSaveGuidesList(updated);
    setIsModalOpen(false);
    setEditingGuide(null);
    triggerToast?.('Guide Saved', `Saved changes for "${editingGuide.name}".`, 'success');
  };

  // Step reordering inside modal
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (!editingGuide) return;
    const newSteps = [...editingGuide.steps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    setEditingGuide({ ...editingGuide, steps: newSteps });
  };

  const handleAddStepToModal = () => {
    if (!editingGuide) return;
    const newStep: OnboardingStep = {
      id: `step_${Date.now()}`,
      targetId: '#btn-create-capsule',
      title: 'New Feature Highlight',
      description: 'Describe what the user can accomplish with this specific control or metric.',
      position: 'bottom',
      ctaText: 'Next'
    };
    setEditingGuide({
      ...editingGuide,
      steps: [...editingGuide.steps, newStep]
    });
  };

  const handleRemoveStepFromModal = (stepId: string) => {
    if (!editingGuide) return;
    if (editingGuide.steps.length <= 1) {
      triggerToast?.('Cannot Delete', 'A tour guide must have at least one step.', 'error');
      return;
    }
    setEditingGuide({
      ...editingGuide,
      steps: editingGuide.steps.filter(s => s.id !== stepId)
    });
  };

  const filteredGuides = guides.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.version.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || g.targetRole.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const completionRate = analytics.totalTourStarts > 0 
    ? Math.round((analytics.totalTourCompletions / analytics.totalTourStarts) * 100)
    : 100;

  return (
    <div className="space-y-6 text-left">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Product Tours</span>
            <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{guides.length}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Guides</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              {guides.filter(g => g.status === 'active').length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Play className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Tour Completion Rate</span>
            <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{completionRate}%</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Tour Starts</span>
            <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{analytics.totalTourStarts}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides by name or version..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="host">Host</option>
              <option value="guest">Guest</option>
              <option value="workspace admin">Workspace Admin</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Reset to default tour guide"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Tour</span>
          </button>
        </div>
      </div>

      {/* Guides List Table / Cards */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                <th className="py-3.5 px-5">Tour Name & Version</th>
                <th className="py-3.5 px-4">Target Role</th>
                <th className="py-3.5 px-4">Trigger Condition</th>
                <th className="py-3.5 px-4">Steps Count</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredGuides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No onboarding guides match search criteria.
                  </td>
                </tr>
              ) : (
                filteredGuides.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-extrabold text-slate-950 text-xs">{g.name}</h4>
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-extrabold bg-slate-100 border border-slate-200 text-slate-900">
                              v{g.version}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {g.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-800">
                        {g.targetRole}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                      {g.triggerType === 'first_login' ? 'First Login' :
                       g.triggerType === 'major_update' ? 'Major Update' :
                       g.triggerType === 'manual_help' ? 'Manual Help' : 'Plan Based'}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-extrabold text-slate-900">{g.steps.length}</span> Steps
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(g.id)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          g.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {g.status === 'active' ? <Play className="w-3 h-3 text-emerald-600" /> : <Pause className="w-3 h-3" />}
                        <span>{g.status}</span>
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onTestTourPreview?.(g)}
                          className="p-1.5 hover:bg-slate-100 text-slate-800 rounded-xl transition-colors cursor-pointer"
                          title="Live Preview Tour"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateGuide(g)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
                          title="Duplicate Guide"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(g)}
                          className="p-1.5 hover:bg-slate-100 text-slate-900 rounded-xl transition-colors cursor-pointer"
                          title="Edit Guide"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuide(g.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors cursor-pointer"
                          title="Delete Guide"
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

      {/* Full Guide Editor Modal */}
      {isModalOpen && editingGuide && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden text-left flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950">
                    {editingGuide.id ? 'Edit Onboarding Tour' : 'Create Onboarding Tour'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Configure tour properties and step-by-step elements</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Core Guide Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tour Name</label>
                  <input
                    type="text"
                    value={editingGuide.name}
                    onChange={(e) => setEditingGuide({ ...editingGuide, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={editingGuide.version}
                    onChange={(e) => setEditingGuide({ ...editingGuide, version: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target User Role</label>
                  <select
                    value={editingGuide.targetRole}
                    onChange={(e) => setEditingGuide({ ...editingGuide, targetRole: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                  >
                    <option value="Host">Host</option>
                    <option value="Guest">Guest</option>
                    <option value="Workspace Admin">Workspace Admin</option>
                    <option value="All">All Roles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Trigger Condition</label>
                  <select
                    value={editingGuide.triggerType}
                    onChange={(e) => setEditingGuide({ ...editingGuide, triggerType: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                  >
                    <option value="first_login">First Login / Signup</option>
                    <option value="major_update">Major Product Update</option>
                    <option value="manual_help">Manual Help Launch</option>
                    <option value="plan_based">Plan Based Trigger</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={editingGuide.status}
                    onChange={(e) => setEditingGuide({ ...editingGuide, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                  >
                    <option value="active">Active (Live)</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              {/* Steps Editor Section */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider font-mono">
                      Tour Step Sequence ({editingGuide.steps.length} Steps)
                    </h4>
                    <p className="text-[11px] text-slate-500">Target UI element IDs, headings, and instructional content</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStepToModal}
                    className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editingGuide.steps.map((st, idx) => (
                    <div key={st.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-black text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">{st.title || 'Untitled Step'}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'down')}
                            disabled={idx === editingGuide.steps.length - 1}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStepFromModal(st.id)}
                            className="p-1 hover:bg-red-100 text-red-600 rounded cursor-pointer"
                            title="Remove Step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Target Element ID / Selector</label>
                          <input
                            type="text"
                            value={st.targetId}
                            onChange={(e) => {
                              const updated = [...editingGuide.steps];
                              updated[idx].targetId = e.target.value;
                              setEditingGuide({ ...editingGuide, steps: updated });
                            }}
                            placeholder="#btn-create-capsule"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Step Heading Title</label>
                          <input
                            type="text"
                            value={st.title}
                            onChange={(e) => {
                              const updated = [...editingGuide.steps];
                              updated[idx].title = e.target.value;
                              setEditingGuide({ ...editingGuide, steps: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Step Description</label>
                          <textarea
                            rows={2}
                            value={st.description}
                            onChange={(e) => {
                              const updated = [...editingGuide.steps];
                              updated[idx].description = e.target.value;
                              setEditingGuide({ ...editingGuide, steps: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">CTA Button Label</label>
                          <input
                            type="text"
                            value={st.ctaText || ''}
                            onChange={(e) => {
                              const updated = [...editingGuide.steps];
                              updated[idx].ctaText = e.target.value;
                              setEditingGuide({ ...editingGuide, steps: updated });
                            }}
                            placeholder="Next"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tooltip Position</label>
                          <select
                            value={st.position || 'bottom'}
                            onChange={(e) => {
                              const updated = [...editingGuide.steps];
                              updated[idx].position = e.target.value as any;
                              setEditingGuide({ ...editingGuide, steps: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                          >
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                            <option value="auto">Auto Detect</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <button
                type="button"
                onClick={() => onTestTourPreview?.(editingGuide)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Test Live Preview</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalGuide}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  Save Tour Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
