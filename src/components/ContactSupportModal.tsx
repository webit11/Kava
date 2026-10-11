import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, Globe, Mail, Phone, Send, MessageSquare, MessageCircle, 
  Smartphone, Facebook, Instagram, Clock, ShieldCheck, CheckCircle2,
  Sparkles, HelpCircle, ChevronRight
} from 'lucide-react';
import { SupportChannelConfig } from '../types';
import { getStoredSupportChannels, resolveChannelUrl } from '../lib/support';
import { useTranslation } from '../lib/useTranslation';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTicketForm?: () => void;
  title?: string;
  subtitle?: string;
}

export default function ContactSupportModal({
  isOpen,
  onClose,
  onOpenTicketForm,
  title,
  subtitle
}: ContactSupportModalProps) {
  const { t } = useTranslation();
  const modalTitle = title || t('modal.support_title', 'Contact KAVA Support & Live Channels');
  const modalSubtitle = subtitle || t('modal.support_subtitle', 'Reach our support concierge directly via your preferred channel or submit a help request ticket.');
  const [channels, setChannels] = useState<SupportChannelConfig[]>(getStoredSupportChannels);

  useEffect(() => {
    const syncChannels = () => {
      setChannels(getStoredSupportChannels());
    };
    window.addEventListener('storage', syncChannels);
    window.addEventListener('kava_support_channels_updated', syncChannels);
    return () => {
      window.removeEventListener('storage', syncChannels);
      window.removeEventListener('kava_support_channels_updated', syncChannels);
    };
  }, []);

  if (!isOpen) return null;

  const activeChannels = channels
    .filter(c => c.enabled)
    .sort((a, b) => a.order - b.order);

  const getChannelIcon = (type: string, customIcon?: string) => {
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
        return <HelpCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case '24/7 Live':
      case 'Online':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{status}</span>
          </span>
        );
      case 'Away':
      case 'Busy':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>{status}</span>
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>Offline</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Available</span>
          </span>
        );
    }
  };

  const handleConnect = (chan: SupportChannelConfig) => {
    const url = resolveChannelUrl(chan.type, chan.value);
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{modalTitle}</h3>
              <p className="text-xs text-slate-500 font-medium">{modalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Ticket Action Banner */}
          {onOpenTicketForm && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider font-mono text-amber-300">In-App Help Desk</span>
                </div>
                <h4 className="text-sm font-bold text-white">Prefer to open a tracked support ticket?</h4>
                <p className="text-xs text-slate-300 font-medium">Submit diagnostic logs, upload attachments, and chat in real-time with assigned engineers.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenTicketForm();
                }}
                className="bg-white text-slate-950 hover:bg-slate-100 font-extrabold px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <span>Submit Ticket</span>
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          )}

          {/* Channels Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
                Official Contact Channels ({activeChannels.length})
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Configured by KAVA Support Ops</span>
            </div>

            {activeChannels.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No public support channels currently active.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Please submit an in-app support ticket or try again shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {activeChannels.map((chan) => (
                  <div 
                    key={chan.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-4 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            {getChannelIcon(chan.type, chan.icon)}
                          </div>
                          <div>
                            <h5 className="text-xs font-extrabold text-slate-900">{chan.name}</h5>
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">
                              {chan.type} • {chan.regionalVisibility || 'Global'}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(chan.availabilityStatus)}
                      </div>

                      {chan.description && (
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {chan.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <div className="flex items-center space-x-1 truncate max-w-[170px]">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{chan.businessHours || '24/7 Live'}</span>
                      </div>

                      <button
                        onClick={() => handleConnect(chan)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-3xs"
                      >
                        <span>Connect</span>
                        <ExternalLink className="w-3 h-3 text-slate-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted & Verified KAVA Support Channels</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
