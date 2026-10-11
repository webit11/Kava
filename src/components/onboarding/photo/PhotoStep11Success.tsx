import React, { useState } from 'react';
import {
  Check,
  Download,
  Copy,
  ArrowRight,
  Share2,
  Sparkles,
  MessageCircle,
  Instagram,
  Send,
  ExternalLink,
} from 'lucide-react';
import { getPhotoModeContext } from '../../../lib/photoModeContext';

interface PhotoStep11SuccessProps {
  eventType?: string;
  eventName?: string;
  eventCode?: string;
  qrCodeUrl?: string;
  onGoToDashboard: () => void;
}

export default function PhotoStep11Success({
  eventType = 'Wedding',
  eventName = '',
  eventCode = '',
  qrCodeUrl,
  onGoToDashboard,
}: PhotoStep11SuccessProps) {
  const [copiedLink, setCopiedLink] = useState<'guest' | 'custom' | null>(null);
  const ctx = getPhotoModeContext(eventType);

  const slug = (eventName || ctx.defaultName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const guestLink = `kava.app/album/${slug || 'event-2026'}`;
  const customLink = `kava.app/${slug || 'my-event'}`;

  const copyToClipboard = (text: string, type: 'guest' | 'custom') => {
    navigator.clipboard.writeText(`https://${text}`);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="space-y-6 text-left" id="photo-step-11-success">
      {/* 2-Column Responsive Layout for Step 11 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Card & Celebration (7 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col items-center text-center space-y-4">
          {/* Green Checkmark Circle with Confetti Sparkles */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-[#E6FFFA] border-2 border-[#99F6E4] text-[#0E7A6B] flex items-center justify-center shadow-xs">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <span className="absolute -top-1 -right-1 text-sm select-none">✨</span>
            <span className="absolute -bottom-1 -left-1 text-sm select-none">🎉</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0E7A6B] uppercase tracking-wider">
              All set!
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight font-sans">
              Your photo album is ready
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto">
              Invite your guests to capture and share amazing moments.
            </p>
          </div>

          {/* High-Resolution Clean QR Code Card */}
          <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm relative group">
            {/* SVG Vector QR Code */}
            <svg
              className="w-40 h-40 sm:w-44 sm:h-44"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Position Markers */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#0B132B" />
              <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="13" width="10" height="10" rx="1" fill="#0E7A6B" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#0B132B" />
              <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="77" y="13" width="10" height="10" rx="1" fill="#0E7A6B" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#0B132B" />
              <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="77" width="10" height="10" rx="1" fill="#0E7A6B" />

              {/* Data Blocks Grid */}
              <rect x="36" y="8" width="5" height="5" fill="#0B132B" />
              <rect x="44" y="8" width="5" height="5" fill="#0B132B" />
              <rect x="52" y="8" width="5" height="5" fill="#0B132B" />
              <rect x="60" y="8" width="5" height="5" fill="#0B132B" />

              <rect x="36" y="16" width="5" height="5" fill="#0B132B" />
              <rect x="48" y="16" width="5" height="5" fill="#0B132B" />
              <rect x="56" y="16" width="5" height="5" fill="#0B132B" />

              <rect x="36" y="24" width="5" height="5" fill="#0B132B" />
              <rect x="44" y="24" width="5" height="5" fill="#0B132B" />
              <rect x="60" y="24" width="5" height="5" fill="#0B132B" />

              <rect x="8" y="36" width="5" height="5" fill="#0B132B" />
              <rect x="16" y="36" width="5" height="5" fill="#0B132B" />
              <rect x="24" y="36" width="5" height="5" fill="#0B132B" />
              <rect x="32" y="36" width="5" height="5" fill="#0B132B" />
              <rect x="68" y="36" width="5" height="5" fill="#0B132B" />
              <rect x="76" y="36" width="5" height="5" fill="#0B132B" />
              <rect x="84" y="36" width="5" height="5" fill="#0B132B" />

              <rect x="8" y="44" width="5" height="5" fill="#0B132B" />
              <rect x="20" y="44" width="5" height="5" fill="#0B132B" />
              <rect x="68" y="44" width="5" height="5" fill="#0B132B" />
              <rect x="80" y="44" width="5" height="5" fill="#0B132B" />

              <rect x="8" y="52" width="5" height="5" fill="#0B132B" />
              <rect x="16" y="52" width="5" height="5" fill="#0B132B" />
              <rect x="28" y="52" width="5" height="5" fill="#0B132B" />
              <rect x="72" y="52" width="5" height="5" fill="#0B132B" />
              <rect x="84" y="52" width="5" height="5" fill="#0B132B" />

              <rect x="36" y="68" width="5" height="5" fill="#0B132B" />
              <rect x="44" y="68" width="5" height="5" fill="#0B132B" />
              <rect x="52" y="68" width="5" height="5" fill="#0B132B" />
              <rect x="60" y="68" width="5" height="5" fill="#0B132B" />

              <rect x="36" y="76" width="5" height="5" fill="#0B132B" />
              <rect x="48" y="76" width="5" height="5" fill="#0B132B" />
              <rect x="60" y="76" width="5" height="5" fill="#0B132B" />

              <rect x="40" y="84" width="5" height="5" fill="#0B132B" />
              <rect x="52" y="84" width="5" height="5" fill="#0B132B" />
              <rect x="84" y="84" width="5" height="5" fill="#0B132B" />

              {/* Central KAVA Petal Logo Badge */}
              <circle cx="50" cy="50" r="13" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="9" fill="#0E7A6B" />
              <path d="M47 50C47 47 50 44 50 44C50 44 53 47 53 50C53 53 50 56 50 56C50 56 47 53 47 50Z" fill="white" />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                alert('Table cards and PDF QR kit downloaded!');
              }}
              className="w-full bg-[#E6FFFA] hover:bg-[#CCFBF1] text-[#0E7A6B] font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-[#99F6E4] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
              id="btn-download-qr-template"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Template</span>
            </button>

            <button
              type="button"
              onClick={onGoToDashboard}
              className="w-full bg-[#0E7A6B] hover:bg-[#096357] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer"
              id="btn-goto-dashboard-left"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Share with Guests & Links (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#1F2937]">
              Share with your guests
            </h3>
            <p className="text-xs text-[#6B7280]">
              Send these links via chat or post them on your wedding/event site.
            </p>
          </div>

          {/* Guest Link Card */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1F2937]">
              Guest Link
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono font-medium text-[#1F2937] truncate pr-2">
                {guestLink}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(guestLink, 'guest')}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0E7A6B] hover:border-[#0E7A6B] transition-colors cursor-pointer shrink-0"
                id="btn-copy-guest-link"
                title="Copy link"
              >
                {copiedLink === 'guest' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copiedLink === 'guest' && (
              <p className="text-[11px] font-semibold text-emerald-600">Copied to clipboard!</p>
            )}
          </div>

          {/* Custom Link (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1F2937]">
              Custom Link (Optional)
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono font-medium text-[#1F2937] truncate pr-2">
                {customLink}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(customLink, 'custom')}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0E7A6B] hover:border-[#0E7A6B] transition-colors cursor-pointer shrink-0"
                id="btn-copy-custom-link"
                title="Copy link"
              >
                {copiedLink === 'custom' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copiedLink === 'custom' && (
              <p className="text-[11px] font-semibold text-emerald-600">Copied to clipboard!</p>
            )}
          </div>

          {/* Quick Share Social Icons */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-[#6B7280]">
              Quick Share
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => window.open(`https://api.whatsapp.com/send?text=Join%20our%20photo%20album%20at%20https://${guestLink}`, '_blank')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#E6FFFA] hover:border-[#99F6E4] text-[#1F2937] hover:text-[#0E7A6B] flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-bold">WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(guestLink, 'guest')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-[#1F2937] hover:text-rose-600 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-bold">Story</span>
              </button>

              <button
                type="button"
                onClick={() => window.open(`sms:?&body=Check%20out%20our%20photo%20album%20at%20https://${guestLink}`, '_blank')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 text-[#1F2937] hover:text-sky-600 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-sky-600" />
                <span className="text-[10px] font-bold">Messages</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(guestLink, 'guest')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#1F2937] flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span className="text-[10px] font-bold">More</span>
              </button>
            </div>
          </div>

          {/* Bottom Primary Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onGoToDashboard}
              className="w-full bg-[#0E7A6B] hover:bg-[#096357] text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer"
              id="btn-goto-dashboard-right"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-[#6B7280] text-center mt-2">
              You can manage your album anytime in the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
