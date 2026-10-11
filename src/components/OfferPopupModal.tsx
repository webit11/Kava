import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Clock, ArrowRight, ShieldCheck, Zap, Gift } from 'lucide-react';
import { OfferPopupConfig, SubscriptionPlan } from '../types';
import { getStoredOfferPopups, getUserSubscription } from '../lib/billing';

interface OfferPopupModalProps {
  onOpenCheckout: (planId?: string) => void;
  storageUsageMb?: number;
  triggerToast?: (title: string, desc: string, type?: 'success' | 'info' | 'error') => void;
}

export default function OfferPopupModal({
  onOpenCheckout,
  storageUsageMb = 0,
  triggerToast
}: OfferPopupModalProps) {
  const [activePopup, setActivePopup] = useState<OfferPopupConfig | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    // Check pop-up display rules
    const popups = getStoredOfferPopups().filter(p => p.active);
    if (popups.length === 0) return;

    const userSub = getUserSubscription();
    const dismissed = JSON.parse(sessionStorage.getItem('kava_dismissed_popups') || '[]');

    // Evaluate rules
    for (const popup of popups) {
      if (dismissed.includes(popup.id)) continue;

      const rules = popup.displayRules;
      let shouldShow = false;

      // Free plan rule
      if (rules.triggerOnFreePlanOnly && userSub.planId === 'Free') {
        shouldShow = true;
      }

      // Storage near full rule (>80% of 500MB = 400MB)
      if (rules.triggerOnStorageNearFull && storageUsageMb > 400) {
        shouldShow = true;
      }

      // Trial ending rule
      if (rules.triggerOnTrialEnding && userSub.status === 'trialing') {
        shouldShow = true;
      }

      // First login rule
      if (rules.triggerOnFirstLogin) {
        shouldShow = true;
      }

      if (shouldShow) {
        setActivePopup(popup);
        // Small delay to prevent jarring popup on initial mount
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [storageUsageMb]);

  // Countdown clock tick
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !activePopup) return null;

  const handleDismiss = () => {
    if (activePopup) {
      const dismissed = JSON.parse(sessionStorage.getItem('kava_dismissed_popups') || '[]');
      sessionStorage.setItem('kava_dismissed_popups', JSON.stringify([...dismissed, activePopup.id]));
    }
    setIsOpen(false);
  };

  const handleCTA = () => {
    setIsOpen(false);
    onOpenCheckout(activePopup.highlightedPlanId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white border border-slate-200 rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden text-left relative"
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-900 bg-white/80 backdrop-blur rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Illustration Header */}
          <div className="h-48 relative overflow-hidden bg-slate-900">
            <img 
              src={activePopup.heroIllustration} 
              alt="Promotion banner" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-md">
                <Gift className="w-3.5 h-3.5" />
                <span>{activePopup.promotionBadge}</span>
              </span>

              {/* Live countdown */}
              <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 px-3 py-1 rounded-full text-[11px] font-mono text-amber-300 font-bold flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 font-sans leading-snug">
                {activePopup.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {activePopup.subtitle}
              </p>
            </div>

            {/* Features callout pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Instant Pro Unlocks Included:</span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 pl-6 list-disc font-medium">
                <li>10GB High-Definition Storage Vault</li>
                <li>Live Venue Screen Projector View</li>
                <li>Custom QR Codes & Table Stand Cards</li>
                <li>Voice Messages & Guest Audio Notes</li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleCTA}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <span>{activePopup.ctaButtonText}</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDismiss}
                className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-center"
              >
                {activePopup.secondaryButtonText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
