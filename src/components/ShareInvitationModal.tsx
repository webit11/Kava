import React, { useState, useEffect } from 'react';
import { KavaEvent } from '../types';
import { X, Copy, Check, QrCode, Download, Share2, Send, Mail, MessageSquare, ExternalLink, Sparkles, Smartphone, Link as LinkIcon, CheckCircle2, Eye, RefreshCw } from 'lucide-react';
import { getEventGuestLink, generateQrCodeDataUrl } from '../lib/qrUtils';

interface ShareInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: KavaEvent;
  onRegenerateCode?: (eventId: string) => Promise<void> | void;
}

export default function ShareInvitationModal({
  isOpen,
  onClose,
  event,
  onRegenerateCode,
}: ShareInvitationModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isQrViewModalOpen, setIsQrViewModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Construct guest invitation link dynamically
  const guestLink = event ? getEventGuestLink(event) : '';

  useEffect(() => {
    if (event && guestLink) {
      generateQrCodeDataUrl(guestLink, 500).then((dataUrl) => {
        setQrDataUrl(dataUrl);
      });
    }
  }, [event, guestLink]);

  if (!isOpen || !event) return null;

  const handleRegenerate = async () => {
    if (!onRegenerateCode) return;
    if (confirm('Regenerate a new guest access code and QR code? Previous invitation links with the old code will be replaced.')) {
      try {
        setIsRegenerating(true);
        await onRegenerateCode(event.id);
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const invitationMessage = `🎉 You are invited to join the memory capsule for "${event.name}"!\n\n📍 Location: ${event.location || 'Online'}\n📅 Date: ${event.date || 'Active'}\n🔑 Capsule Code: ${event.code}\n\nUpload your photos, videos, and voice messages directly here:\n${guestLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(event.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyFullMsg = () => {
    navigator.clipboard.writeText(invitationMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(invitationMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(guestLink)}&text=${encodeURIComponent(`You're invited to ${event.name}! Use code ${event.code}`)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Invitation: ${event.name}`)}&body=${encodeURIComponent(invitationMessage)}`;
    window.location.href = mailtoUrl;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${event.name}`,
          text: `Upload your photos and memories to ${event.name}`,
          url: guestLink,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQrCode = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-${event.code || 'invitation'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-[32px] border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Close Modal"
            id="btn-close-share-modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 text-left pt-1">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center shrink-0 shadow-md">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 inline-block mb-1">
                Guest Capsule Access
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                Share Event Invitation
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                {event.name}
              </p>
            </div>
          </div>

          {/* 1. Direct Guest Link Bar */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between font-mono">
              <span>Direct Guest Link</span>
              {copiedLink && (
                <span className="text-emerald-600 text-[11px] font-bold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Copied!</span>
                </span>
              )}
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-slate-900 transition-all">
              <div className="pl-3 pr-2 text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                readOnly
                value={guestLink}
                className="w-full text-xs font-mono font-bold text-slate-900 bg-transparent focus:outline-none truncate pr-2"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 shadow-2xs min-h-[40px]"
                id="btn-copy-guest-link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* 2. Invitation Code & Dynamic QR Code Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Invitation Passcode Card */}
            <div className="bg-slate-950 text-white rounded-2xl p-4 flex flex-col justify-between text-left space-y-3 relative overflow-hidden shadow-md">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Capsule Code</span>
                  {onRegenerateCode && (
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className="text-[10px] text-slate-400 hover:text-emerald-400 font-mono flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
                      title="Regenerate unique guest code and QR"
                      id="btn-regenerate-code-modal"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin text-emerald-400' : ''}`} />
                      <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
                    </button>
                  )}
                </div>
                <p className="text-2xl font-black font-mono text-emerald-400 tracking-wider mt-1">{event.code}</p>
                <p className="text-[11px] text-slate-300 font-sans mt-1">Guests enter this code on KAVA home page to join.</p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5 font-mono border border-white/10"
                id="btn-copy-code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Dynamic Real QR Code Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-3">
              <button
                type="button"
                onClick={() => setIsQrViewModalOpen(true)}
                className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs group relative hover:border-slate-900 transition-all cursor-pointer"
                title="Click to View QR Full Screen"
              >
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Event QR Code" className="w-20 h-20 object-contain rounded-lg" />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-extrabold space-x-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </div>
              </button>

              <div className="w-full">
                <p className="text-xs font-bold text-slate-900">Event QR Code</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Scan to open guest room</p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 w-full">
                <button
                  type="button"
                  onClick={() => setIsQrViewModalOpen(true)}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1"
                  id="btn-view-qr"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQrCode}
                  className="py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1"
                  id="btn-download-qr"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

          </div>

          {/* 3. One-Click Social Sharing Options */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 font-mono uppercase tracking-wider block">
                Instant Social Share
              </label>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="text-xs font-bold text-slate-900 hover:text-emerald-600 flex items-center space-x-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>More Apps</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl text-emerald-950 flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer group min-h-[64px]"
                id="btn-share-whatsapp"
              >
                <MessageSquare className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-extrabold">WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={handleShareTelegram}
                className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-2xl text-sky-950 flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer group min-h-[64px]"
                id="btn-share-telegram"
              >
                <Send className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-extrabold">Telegram</span>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={handleShareEmail}
                className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-slate-950 flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer group min-h-[64px]"
                id="btn-share-email"
              >
                <Mail className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-extrabold">Email</span>
              </button>
            </div>
          </div>

          {/* 4. Full Invitation Text Copy */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Need full text for invite card?</span>
            <button
              type="button"
              onClick={handleCopyFullMsg}
              className="text-xs font-extrabold text-slate-900 hover:text-emerald-600 flex items-center space-x-1 transition-colors cursor-pointer"
              id="btn-copy-full-msg"
            >
              {copiedMsg ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMsg ? 'Message Copied!' : 'Copy Full Message'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Full-Screen View QR Code Modal */}
      {isQrViewModalOpen && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-5 relative">
            <button
              onClick={() => setIsQrViewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 inline-block mb-1">
                Event QR Code
              </span>
              <h3 className="text-xl font-black text-slate-950">{event.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Code: {event.code}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-md inline-block">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Event QR Code Large" className="w-64 h-64 object-contain mx-auto rounded-lg" />
              ) : (
                <div className="w-64 h-64 bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Guests scan this QR code with their mobile phone camera to automatically open the capsule guest room.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadQrCode}
                className="flex-1 py-3 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
