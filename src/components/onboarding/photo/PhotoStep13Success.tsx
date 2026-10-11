import React, { useState, useEffect } from 'react';
import {
  Check,
  Download,
  Copy,
  ArrowRight,
  Share2,
  ExternalLink,
  Sparkles,
  QrCode,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { getPhotoModeContext } from '../../../lib/photoModeContext';

interface PhotoStep13SuccessProps {
  eventType: string;
  eventName: string;
  onGoToDashboard: () => void;
  onOpenGuestGallery?: (url: string) => void;
  eventCode?: string;
  appearance?: 'light' | 'dark';
}

export default function PhotoStep13Success({
  eventType,
  eventName,
  onGoToDashboard,
  onOpenGuestGallery,
  eventCode,
  appearance = 'light',
}: PhotoStep13SuccessProps) {
  const isDark = appearance === 'dark';
  const [copiedLink, setCopiedLink] = useState<'link' | 'code' | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const ctx = getPhotoModeContext(eventType);

  const cleanSlug = (eventName || ctx.defaultName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 8);

  const displayCode = eventCode || (cleanSlug ? `${cleanSlug.toUpperCase()}-26` : 'MAYA30');
  const slugPath = (eventName || ctx.defaultName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'maya-30th';

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kava.app';
  const fullGuestUrl = `${origin}/album/${slugPath}`;
  const displayGuestUrl = `kava.app/${slugPath}`;

  // Generate crisp QR code
  useEffect(() => {
    QRCode.toDataURL(
      fullGuestUrl,
      {
        width: 440,
        margin: 2,
        color: {
          dark: '#0B132B',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [fullGuestUrl]);

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(type);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  const downloadQrCode = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `kava-qr-${slugPath}.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventName || ctx.defaultName,
          text: `Snap and share photos for ${eventName || ctx.defaultName} with KAVA!`,
          url: fullGuestUrl,
        });
      } catch {
        copyToClipboard(fullGuestUrl, 'link');
      }
    } else {
      copyToClipboard(fullGuestUrl, 'link');
    }
  };

  return (
    <div className="space-y-6 text-center max-w-md mx-auto" id="photo-step-8-success">
      {/* Celebratory Icon & Heading */}
      <div className="space-y-2 flex flex-col items-center">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] dark:bg-[#0E7A6B]/20 border border-[#99F6E4] dark:border-[#0E7A6B]/40 text-[#0E7A6B] dark:text-[#5EEAD4] text-xs font-bold tracking-tight mb-1">
          <span>🎉 Album Ready!</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B132B] dark:text-white font-sans">
          Your photo album is <span className="text-[#0E7A6B] dark:text-[#5EEAD4]">ready!</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-sm mx-auto">
          Share the QR code or link with your guests so they can start contributing.
        </p>
      </div>

      {/* Large Crisp QR Code Card */}
      <div
        className={`p-6 rounded-3xl border transition-all duration-300 shadow-xl ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        <div className="bg-white p-4 rounded-2xl inline-block shadow-inner border border-slate-100 mb-4">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Event QR Code"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-50 text-slate-400 font-mono text-xs">
              Generating QR...
            </div>
          )}
        </div>

        {/* Event Code & Guest Link Info Boxes */}
        <div className="grid grid-cols-2 gap-3 text-left">
          
          {/* EVENT CODE */}
          <div
            className={`p-3 rounded-xl border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              EVENT CODE
            </span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-mono font-bold text-sm sm:text-base text-[#0B132B] dark:text-white">
                {displayCode}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(displayCode, 'code')}
                className="text-slate-400 hover:text-[#0E7A6B] p-1 cursor-pointer"
                title="Copy code"
              >
                {copiedLink === 'code' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* GUEST LINK */}
          <div
            className={`p-3 rounded-xl border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              GUEST LINK
            </span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-mono text-xs sm:text-sm font-semibold text-[#0B132B] dark:text-white truncate max-w-[100px]">
                {displayGuestUrl}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(fullGuestUrl, 'link')}
                className="text-slate-400 hover:text-[#0E7A6B] p-1 cursor-pointer"
                title="Copy link"
              >
                {copiedLink === 'link' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Primary and Secondary Action CTAs */}
      <div className="space-y-2.5 pt-1">
        {/* Primary CTA: Share Album */}
        <button
          type="button"
          onClick={handleShare}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-base py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#0E7A6B]/25 cursor-pointer min-h-[54px]"
          id="btn-success-share-album"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Album ↗</span>
        </button>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => copyToClipboard(fullGuestUrl, 'link')}
            className={`py-3 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
            id="btn-success-copy-link"
          >
            {copiedLink === 'link' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={downloadQrCode}
            className={`py-3 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
            id="btn-success-download-qr"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                <span className="text-emerald-500">Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download QR</span>
              </>
            )}
          </button>
        </div>

        {/* Open Dashboard Link */}
        <button
          type="button"
          onClick={onGoToDashboard}
          className="w-full py-3 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#0E7A6B] dark:hover:text-[#5EEAD4] transition-colors cursor-pointer"
          id="btn-success-dashboard"
        >
          Open Dashboard →
        </button>
      </div>
    </div>
  );
}
