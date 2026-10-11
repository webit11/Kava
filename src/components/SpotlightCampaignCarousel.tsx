import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { MegaMenuCampaign } from '../types';
import { useTranslation } from '../lib/useTranslation';

interface SpotlightCampaignCarouselProps {
  campaigns: MegaMenuCampaign[];
  onCloseMegaMenu: () => void;
  onTryDemo: () => void;
  onCreateEvent: () => void;
}

export const SpotlightCampaignCarousel: React.FC<SpotlightCampaignCarouselProps> = ({
  campaigns,
  onCloseMegaMenu,
  onTryDemo,
  onCreateEvent,
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Reset index if active tab changes or campaigns list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [campaigns]);

  // Auto-rotate every 5 seconds if not hovered and multiple campaigns exist
  useEffect(() => {
    if (campaigns.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [campaigns.length, isHovered]);

  if (campaigns.length === 0) return null;

  const safeIndex = currentIndex >= campaigns.length ? 0 : currentIndex;
  const currentCampaign = campaigns[safeIndex];

  if (!currentCampaign) return null;

  const handleCtaClick = () => {
    onCloseMegaMenu();
    if (currentCampaign.ctaAction === 'demo') {
      onTryDemo();
    } else if (currentCampaign.ctaAction === 'create') {
      onCreateEvent();
    } else if (currentCampaign.ctaAction === 'scroll') {
      const target = currentCampaign.ctaUrl || '#pricing';
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (currentCampaign.ctaAction === 'link' && currentCampaign.ctaUrl) {
      window.open(currentCampaign.ctaUrl, '_blank');
    }
  };

  const getBadgeStyle = (style?: string) => {
    switch (style) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'slate':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'violet':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'monochrome':
        return 'bg-white/10 text-white border-white/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div
      className="h-full flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Campaign Card Header */}
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>{t('megamenu.spotlight_campaign', 'Spotlight Campaign')}</span>
          {campaigns.length > 1 && (
            <span className="text-[10px] text-slate-400 font-mono font-normal">
              ({safeIndex + 1}/{campaigns.length})
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {currentCampaign.badgeText && (
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${getBadgeStyle(currentCampaign.badgeStyle)}`}>
              {currentCampaign.badgeText}
            </span>
          )}

          {campaigns.length > 1 && (
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
                }}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Previous Campaign"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % campaigns.length);
                }}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Next Campaign"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Content Area */}
      <div className="relative mt-3 flex-1 flex flex-col justify-between overflow-hidden min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCampaign.id || safeIndex}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate-950 text-white rounded-2xl p-4 space-y-3 shadow-md border border-slate-800 flex-1 flex flex-col justify-between h-full"
          >
            <div className="space-y-2.5">
              {/* Media Container (Video or Image) */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
                {currentCampaign.mediaType === 'video' && currentCampaign.videoUrl ? (
                  <video
                    src={currentCampaign.videoUrl}
                    poster={currentCampaign.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={currentCampaign.imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'}
                    alt={currentCampaign.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Countdown banner if end time exists */}
                {currentCampaign.countdownEndTime && (
                  <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] font-mono text-amber-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                      <span>{t('megamenu.limited_season', 'Limited Season')}</span>
                    </span>
                    <span>{t('megamenu.ends_soon', 'Ends Soon')}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-white flex items-center justify-between">
                  <span>{currentCampaign.title}</span>
                  {currentCampaign.abVariant && (
                    <span className="text-[9px] font-mono font-normal text-slate-500 uppercase">
                      [{currentCampaign.abVariant}]
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                  {currentCampaign.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCtaClick}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-1.5 mt-2 min-h-[44px]"
            >
              <span>{currentCampaign.ctaText || t('megamenu.explore_campaign', 'Explore Campaign')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      {campaigns.length > 1 && (
        <div className="flex items-center justify-center space-x-1.5 pt-3">
          {campaigns.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === safeIndex ? 'w-5 bg-amber-500' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Go to campaign ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpotlightCampaignCarousel;
