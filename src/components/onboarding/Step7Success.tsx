import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Share2, 
  Copy, 
  CheckCheck, 
  Download, 
  RefreshCw, 
  ArrowRight,
  ExternalLink,
  Calendar, 
  MapPin, 
  Tag,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';
import { ExperienceMode } from '../../types';
import { getEventContext } from '../../lib/onboardingContext';
import { getEventGuestLink, generateQrCodeDataUrl, downloadEventQrPng } from '../../lib/qrUtils';
import { validateQrScannability } from '../../lib/qrGenerator';

interface Step7SuccessProps {
  eventName: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  experienceMode: ExperienceMode;
  generatedEventCode: string;
  qrDataUrl: string;
  onQrRegenerated?: (dataUrl: string) => void;
  appearance?: 'light' | 'dark';
  onRevealDashboard?: () => void;
}

export default function Step7Success({
  eventName,
  eventType,
  eventDate,
  eventLocation,
  experienceMode,
  generatedEventCode,
  qrDataUrl,
  onQrRegenerated,
  appearance = 'light',
  onRevealDashboard,
}: Step7SuccessProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';
  const ctx = getEventContext(eventType);

  // Fallback / Normalized Code & Link
  const safeCode = generatedEventCode || 'KAVA-EVENT';
  const guestLink = useMemo(() => getEventGuestLink(safeCode), [safeCode]);

  // States
  const [localQrUrl, setLocalQrUrl] = useState<string>(qrDataUrl || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(!qrDataUrl);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Sync with prop if updated from outside
  useEffect(() => {
    if (qrDataUrl) {
      setLocalQrUrl(qrDataUrl);
      setIsGenerating(false);
      setGenerationError(null);
    }
  }, [qrDataUrl]);

  // Generate QR if missing on mount
  useEffect(() => {
    if (!localQrUrl && !generationError) {
      handleGenerateQr();
    }
  }, [guestLink, localQrUrl]);

  const handleGenerateQr = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      // Generate clean high-contrast branded QR data URL
      const dataUrl = await generateQrCodeDataUrl(guestLink, 600, {
        foregroundColor: '#0F172A',
        backgroundColor: '#FFFFFF',
        errorCorrectionLevel: 'H',
        margin: 2,
      });

      if (!dataUrl) {
        throw new Error('Failed to generate QR image');
      }

      // Validate scannability
      try {
        const validation = await validateQrScannability(dataUrl, guestLink);
        if (!validation.isScannable) {
          console.warn('QR scannability check notice:', validation.error);
        }
      } catch (valErr) {
        // Scannability test non-blocking
        console.warn('QR scannability probe skipped:', valErr);
      }

      setLocalQrUrl(dataUrl);
      if (onQrRegenerated) {
        onQrRegenerated(dataUrl);
      }
    } catch (err: any) {
      console.error('QR generation error:', err);
      setGenerationError(err?.message || 'Unable to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (safeCode) {
      navigator.clipboard.writeText(safeCode).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2200);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = safeCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2200);
      });
    }
  };

  const handleCopyLink = () => {
    if (guestLink) {
      navigator.clipboard.writeText(guestLink).then(() => {
        setCopiedLink(true);
        setShareFeedback(t('onboarding.step7_link_copied_notice', 'Guest invitation link copied to clipboard!'));
        setTimeout(() => {
          setCopiedLink(false);
          setShareFeedback(null);
        }, 3000);
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = guestLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      });
    }
  };

  const handleShare = async () => {
    const title = eventName || ctx.defaultTitle;
    const shareText = `Join ${title} on KAVA to share photos and memories!`;

    if (navigator.share && typeof navigator.canShare === 'function') {
      const shareData = {
        title,
        text: shareText,
        url: guestLink,
      };

      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          setShareFeedback(t('onboarding.step7_share_success', 'Capsule shared successfully!'));
          setTimeout(() => setShareFeedback(null), 3000);
          return;
        } catch (err: any) {
          if (err?.name === 'AbortError') {
            // User cancelled native share sheet; do not treat as error
            return;
          }
          console.warn('Native share failed, falling back to copy:', err);
        }
      }
    }

    // Graceful fallback to copy link
    handleCopyLink();
  };

  const handleDownloadQr = async () => {
    setIsDownloading(true);
    try {
      const success = await downloadEventQrPng({
        code: safeCode,
        name: eventName || ctx.defaultTitle,
      });

      if (!success && localQrUrl) {
        // Fallback standard direct download
        const a = document.createElement('a');
        a.href = localQrUrl;
        const cleanName = (eventName || 'KAVA-Capsule').replace(/[^a-zA-Z0-9_-]/g, '_');
        a.download = `KAVA-QR-${cleanName}-${safeCode}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Download QR error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDisplayDate = (d: string) => {
    if (!d) return '';
    try {
      const dateObj = new Date(d.includes('T') ? d : `${d}T00:00:00`);
      if (isNaN(dateObj.getTime())) return d;
      return dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  const displayTitle = eventName.trim() || ctx.defaultTitle;

  return (
    <div className="space-y-4 sm:space-y-5 text-center py-0.5 max-w-xl mx-auto w-full" id="step-7-success-content">
      {/* 1. Subtle Success Indicator & Header */}
      <motion.div 
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-1.5"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{t('onboarding.step7_capsule_created', 'Capsule Created')}</span>
        </div>

        <h2 className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
          {t('onboarding.step7_title_ready', 'Your capsule is ready.')}
        </h2>

        <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('onboarding.step7_desc_clean', 'Share the QR code or link below with your guests so they can start contributing photos and memories.')}
        </p>
      </motion.div>

      {/* 2. QR Code Hero Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-3"
      >
        {/* QR Code Canvas Frame */}
        <div className="flex flex-col items-center justify-center">
          <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs inline-block mx-auto relative group">
            {isGenerating ? (
              <div className="w-36 h-36 sm:w-48 sm:h-48 flex flex-col items-center justify-center space-y-2 bg-slate-50 rounded-xl">
                <RefreshCw className="w-6 h-6 text-[#00A88F] animate-spin" />
                <span className="text-[11px] font-medium text-slate-400">
                  {t('onboarding.step7_generating_qr', 'Generating QR Code...')}
                </span>
              </div>
            ) : generationError ? (
              <div className="w-36 h-36 sm:w-48 sm:h-48 flex flex-col items-center justify-center p-3 text-center space-y-2 bg-red-50/60 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
                <p className="text-[11px] text-red-600 font-medium leading-tight">{generationError}</p>
                <button
                  type="button"
                  onClick={handleGenerateQr}
                  className="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-[11px] font-semibold text-red-700 hover:bg-red-50 transition-all flex items-center space-x-1 cursor-pointer shadow-2xs"
                  id="btn-regenerate-qr-error"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{t('onboarding.step7_regenerate_qr', 'Regenerate QR')}</span>
                </button>
              </div>
            ) : (
              localQrUrl && (
                <img
                  src={localQrUrl}
                  alt={`QR code to join ${displayTitle}`}
                  className="w-36 h-36 sm:w-48 sm:h-48 md:w-52 md:h-52 object-contain rounded-lg mx-auto block max-w-full"
                  id="hero-qr-image"
                />
              )
            )}
          </div>

          <p className="text-[11px] text-slate-400 font-medium mt-2">
            {t('onboarding.step7_scan_hint', 'Scan with any smartphone camera to open the guest portal')}
          </p>
        </div>

        {/* Event Access Code Block */}
        <div className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
          isDark 
            ? 'bg-[#17223D]/70 border-slate-800' 
            : 'bg-slate-50/90 border-slate-200/80'
        }`}>
          <div className="text-left min-w-0 pr-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              {t('onboarding.access_code_label', 'EVENT ACCESS CODE')}
            </span>
            <span className={`text-base sm:text-xl md:text-2xl font-black font-mono tracking-wider truncate block ${
              isDark ? 'text-white' : 'text-[#0B132B]'
            }`} id="display-event-access-code">
              {safeCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer min-h-[38px] ${
              copiedCode
                ? 'bg-emerald-500 text-white border-emerald-500'
                : isDark
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-2xs'
            }`}
            title="Copy access code"
            id="btn-copy-access-code"
          >
            {copiedCode ? (
              <>
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t('common.copied', 'Copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t('common.copy', 'Copy')}</span>
              </>
            )}
          </button>
        </div>

        {/* Compact Event Metadata Summary */}
        <div className={`pt-2.5 border-t flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs ${
          isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-100 text-slate-600'
        }`}>
          <span className={`font-semibold px-2.5 py-0.5 rounded-lg border text-[11px] sm:text-xs ${
            isDark ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-slate-100/70 border-slate-200/60 text-[#0B132B]'
          }`}>
            {displayTitle}
          </span>

          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] sm:text-xs ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-100/70 border-slate-200/60'
          }`}>
            <Tag className="w-3 h-3 text-[#00A88F]" />
            <span>{ctx.name}</span>
          </span>

          {eventDate && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] sm:text-xs ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-100/70 border-slate-200/60'
            }`}>
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatDisplayDate(eventDate)}</span>
            </span>
          )}

          {eventLocation && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border truncate max-w-[140px] sm:max-w-[180px] text-[11px] sm:text-xs ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-100/70 border-slate-200/60'
            }`}>
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{eventLocation}</span>
            </span>
          )}
        </div>

        {/* Feedback message banner */}
        {shareFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 py-1.5 px-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50"
          >
            {shareFeedback}
          </motion.div>
        )}

        {/* 3. Primary Sharing Actions */}
        <div className="pt-2 space-y-2.5">
          {/* Primary CTA: Share Capsule */}
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-xl sm:rounded-2xl bg-[#00A88F] hover:bg-[#00937D] text-white font-bold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer min-h-[44px]"
            id="btn-step7-share-capsule"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('onboarding.step7_share_capsule', 'Share Capsule')}</span>
          </button>

          {/* Secondary Actions: Copy Link & Download QR */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[40px] ${
                copiedLink
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : isDark
                  ? 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              id="btn-step7-copy-link"
            >
              {copiedLink ? (
                <>
                  <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('common.copied', 'Copied!')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>{t('onboarding.step7_copy_link', 'Copy Link')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={isDownloading || !localQrUrl}
              className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[40px] disabled:opacity-50 ${
                isDark
                  ? 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              id="btn-step7-download-qr"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00A88F]" />
                  <span>{t('onboarding.step7_downloading', 'Downloading...')}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>{t('onboarding.step7_download_qr', 'Download QR')}</span>
                </>
              )}
            </button>
          </div>

          {/* Reveal Capsule Dashboard Action */}
          {onRevealDashboard && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onRevealDashboard}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer border min-h-[42px] ${
                  isDark
                    ? 'bg-[#0B132B] hover:bg-[#152244] text-white border-slate-700'
                    : 'bg-[#0B132B] hover:bg-[#152244] text-white border-transparent'
                }`}
                id="btn-step7-reveal-dashboard"
              >
                <span>{t('onboarding.nav_reveal', 'Reveal Capsule Dashboard')}</span>
                <ArrowRight className="w-4 h-4 text-[#00A88F]" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
