import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Check, X, MoveUp, MoveDown, ExternalLink, Globe, Mail, 
  Phone, Send, MessageSquare, MessageCircle, Smartphone, Facebook, Instagram, 
  Shield, Clock, Sparkles, RefreshCw, AlertCircle, ToggleLeft, ToggleRight, CheckCircle2
} from 'lucide-react';
import { SupportChannelConfig } from '../types';
import { getStoredSupportChannels, saveStoredSupportChannels, DEFAULT_SUPPORT_CHANNELS, resolveChannelUrl } from '../lib/support';

interface SupportSettingsManagerProps {
  onTriggerToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function SupportSettingsManager({ onTriggerToast }: SupportSettingsManagerProps) {
  const [channels, setChannels] = useState<SupportChannelConfig[]>(getStoredSupportChannels);
  const [editingChannel, setEditingChannel] = useState<SupportChannelConfig | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state for creating / editing channel
  const [formData, setFormData] = useState<Partial<SupportChannelConfig>>({
    type: 'whatsapp',
    name: '',
    value: '',
    icon: 'MessageSquare',
    description: '',
    businessHours: '24/7 Live Support',
    availabilityStatus: 'Online',
    regionalVisibility: 'Global',
    order: 1,
    badgeText: '',
    enabled: true
  });

  useEffect(() => {
    const handleSync = () => {
      setChannels(getStoredSupportChannels());
    };
    window.addEventListener('kava_support_channels_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('kava_support_channels_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleToggleEnable = (id: string) => {
    const updated = channels.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c);
    setChannels(updated);
    saveStoredSupportChannels(updated);
    if (onTriggerToast) {
      const item = updated.find(c => c.id === id);
      onTriggerToast('Channel Toggled', `${item?.name} is now ${item?.enabled ? 'Enabled' : 'Disabled'}.`, 'info');
    }
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= channels.length) return;

    const copy = [...channels];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Recalculate order index
    const reordered = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    setChannels(reordered);
    saveStoredSupportChannels(reordered);
  };

  const handleDeleteChannel = (id: string) => {
    const updated = channels.filter(c => c.id !== id);
    setChannels(updated);
    saveStoredSupportChannels(updated);
    if (onTriggerToast) {
      onTriggerToast('Channel Removed', 'Support channel configuration has been deleted.', 'warning');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all customer support channels to original platform defaults?')) {
      setChannels(DEFAULT_SUPPORT_CHANNELS);
      saveStoredSupportChannels(DEFAULT_SUPPORT_CHANNELS);
      if (onTriggerToast) {
        onTriggerToast('Settings Reset', 'Support channels reset to default configuration.', 'success');
      }
    }
  };

  const handleStartEdit = (chan: SupportChannelConfig) => {
    setEditingChannel(chan);
    setFormData({ ...chan });
    setIsAddingNew(false);
  };

  const handleStartAdd = () => {
    setEditingChannel(null);
    setFormData({
      id: `chan-custom-${Date.now()}`,
      type: 'custom',
      name: '',
      value: '',
      icon: 'Globe',
      description: '',
      businessHours: 'Mon-Fri 9:00 AM - 5:00 PM EST',
      availabilityStatus: 'Online',
      regionalVisibility: 'Global',
      order: channels.length + 1,
      badgeText: '',
      enabled: true
    });
    setIsAddingNew(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.value) {
      alert('Please provide a channel name/label and contact value/URL.');
      return;
    }

    let updated: SupportChannelConfig[];
    if (isAddingNew) {
      const newChan: SupportChannelConfig = {
        id: formData.id || `chan-${Date.now()}`,
        type: formData.type || 'custom',
        name: formData.name || 'Support Link',
        enabled: formData.enabled !== undefined ? formData.enabled : true,
        value: formData.value || '',
        icon: formData.icon || 'Globe',
        description: formData.description || '',
        businessHours: formData.businessHours || '24/7 Live',
        availabilityStatus: formData.availabilityStatus || 'Online',
        regionalVisibility: formData.regionalVisibility || 'Global',
        order: formData.order || channels.length + 1,
        badgeText: formData.badgeText || ''
      };
      updated = [...channels, newChan];
    } else if (editingChannel) {
      updated = channels.map(c => c.id === editingChannel.id ? ({ ...c, ...formData } as SupportChannelConfig) : c);
    } else {
      return;
    }

    // Sort by order
    updated.sort((a, b) => a.order - b.order);

    setChannels(updated);
    saveStoredSupportChannels(updated);
    setEditingChannel(null);
    setIsAddingNew(false);

    if (onTriggerToast) {
      onTriggerToast('Channel Saved', `Support channel "${formData.name}" configuration updated.`, 'success');
    }
  };

  const getChannelIcon = (type: string, iconKey?: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case 'zalo':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-500" />;
      case 'line':
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      case 'email':
        return <Mail className="w-5 h-5 text-amber-500" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-slate-700" />;
      case 'website':
        return <Globe className="w-5 h-5 text-teal-500" />;
      default:
        return <Globe className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner & Control Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase font-mono text-slate-800 tracking-wider mb-1">
            <Shield className="w-4 h-4 text-slate-900" />
            <span>Super Admin Settings</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Public Customer Support Channels</h2>
          <p className="text-xs text-slate-500 font-medium max-w-2xl mt-0.5">
            Configure official live contact methods (WhatsApp, Zalo, Messenger, Instagram, Telegram, LINE, Email, Phone, Website, and Custom links).
            Changes update automatically across all Host Dashboards and Guest Experiences in real time.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleStartAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Support Channel</span>
          </button>
        </div>
      </div>

      {/* Main List & Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono">
            Active Support Channels ({channels.length})
          </h3>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ● Real-Time Platform Broadcast Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {channels.map((chan, idx) => (
            <div 
              key={chan.id} 
              className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                !chan.enabled ? 'bg-slate-50/60 opacity-60' : 'hover:bg-slate-50/40'
              }`}
            >
              {/* Channel Meta */}
              <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200/60 shrink-0">
                  {getChannelIcon(chan.type, chan.icon)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">{chan.name}</h4>
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {chan.type}
                    </span>
                    {chan.badgeText && (
                      <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                        {chan.badgeText}
                      </span>
                    )}
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      chan.availabilityStatus === '24/7 Live' || chan.availabilityStatus === 'Online'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {chan.availabilityStatus || 'Online'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
                    {chan.value}
                  </p>

                  <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-400 font-mono">
                    <span>Hours: {chan.businessHours || '24/7'}</span>
                    <span>•</span>
                    <span>Region: {chan.regionalVisibility || 'Global'}</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                
                {/* Order Up / Down */}
                <div className="flex items-center space-x-1 border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                  <button
                    onClick={() => handleMoveOrder(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 hover:bg-white text-slate-500 rounded-lg disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(idx, 'down')}
                    disabled={idx === channels.length - 1}
                    className="p-1 hover:bg-white text-slate-500 rounded-lg disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Test Link */}
                <a
                  href={resolveChannelUrl(chan.type, chan.value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  title="Test Link Redirection"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Toggle Enable */}
                <button
                  onClick={() => handleToggleEnable(chan.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    chan.enabled ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {chan.enabled ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                  <span>{chan.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleStartEdit(chan)}
                  className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Edit Configuration"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteChannel(chan.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                  title="Delete Channel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {(editingChannel || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {isAddingNew ? 'Add Support Channel' : `Edit Channel: ${editingChannel?.name}`}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Configure link destinations, label, hours, and regional availability.</p>
              </div>
              <button
                onClick={() => {
                  setEditingChannel(null);
                  setIsAddingNew(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Channel Type</label>
                <select
                  value={formData.type || 'whatsapp'}
                  onChange={(e) => {
                    const newType = e.target.value as any;
                    setFormData(prev => ({
                      ...prev,
                      type: newType,
                      name: prev.name || `${newType.toUpperCase()} Support`
                    }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-slate-400"
                >
                  <option value="whatsapp">WhatsApp (wa.me)</option>
                  <option value="zalo">Zalo (zalo.me)</option>
                  <option value="facebook">Facebook Messenger (m.me)</option>
                  <option value="instagram">Instagram Direct</option>
                  <option value="telegram">Telegram (t.me)</option>
                  <option value="line">LINE Official Account</option>
                  <option value="email">Email Support (mailto:)</option>
                  <option value="phone">Phone Hotline (tel:)</option>
                  <option value="website">Website / Knowledge Base</option>
                  <option value="custom">Custom Support Link</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Display Label / Title</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., VIP WhatsApp Desk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Value / Target URL / Phone / Email
                </label>
                <input
                  type="text"
                  required
                  value={formData.value || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="e.g., https://wa.me/18005550199 or support@kava.co or +18005550199"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description / Subtitle</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Average response time: < 5 mins"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Availability Status</label>
                  <select
                    value={formData.availabilityStatus || 'Online'}
                    onChange={(e) => setFormData(prev => ({ ...prev, availabilityStatus: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="24/7 Live">24/7 Live</option>
                    <option value="Online">Online</option>
                    <option value="Away">Away</option>
                    <option value="Busy">Busy</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Regional Scope</label>
                  <select
                    value={formData.regionalVisibility || 'Global'}
                    onChange={(e) => setFormData(prev => ({ ...prev, regionalVisibility: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Global">Global</option>
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="Latin America">Latin America</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Hours</label>
                  <input
                    type="text"
                    value={formData.businessHours || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessHours: e.target.value }))}
                    placeholder="e.g., Mon-Fri 9:00 AM - 6:00 PM EST"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    value={formData.badgeText || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                    placeholder="e.g., Instant, Priority SLA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="chan-enabled-check"
                  checked={formData.enabled !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                />
                <label htmlFor="chan-enabled-check" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Enable this channel publicly
                </label>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs pt-3">
                <span className="font-mono text-[11px] text-slate-500">Preview Redirection Link:</span>
                <a
                  href={resolveChannelUrl(formData.type || 'custom', formData.value || '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingChannel(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer shadow-sm"
                >
                  Save Channel Configuration
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
