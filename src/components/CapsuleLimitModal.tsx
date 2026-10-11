import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../lib/useTranslation';

interface CapsuleLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (targetPlan?: string, reason?: string) => void;
  planName?: string;
  maxEvents?: number;
  currentEvents?: number;
}

export default function CapsuleLimitModal({
  isOpen,
  onClose,
  onUpgrade,
  planName = 'Free Starter',
  maxEvents = 1,
  currentEvents = 1
}: CapsuleLimitModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
        id="capsule-limit-modal-backdrop"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 overflow-hidden"
          id="capsule-limit-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="capsule-limit-title"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
            id="btn-close-limit-modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>

          {/* Title & Context */}
          <h3 id="capsule-limit-title" className="text-lg font-bold text-slate-900 tracking-tight">
            {t('limits.reached_title', "You've reached your capsule limit")}
          </h3>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Your workspace currently has{' '}
            <strong className="text-slate-900 font-semibold">{currentEvents} active capsule{currentEvents !== 1 ? 's' : ''}</strong>{' '}
            on the <strong className="text-slate-900 font-semibold">{planName}</strong> plan (limit of {maxEvents}).
          </p>

          {/* Plan Limit Pill */}
          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Capsules in use:</span>
            </div>
            <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              {currentEvents} / {maxEvents}
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Upgrade your plan to unlock more concurrent event capsules, unlimited guest contributions, high-res downloads, and live screen displays.
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onUpgrade('Premium', `Plan upgrade requested from capsule creation limit (${currentEvents}/${maxEvents} capsules).`);
              }}
              className="w-full sm:flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              id="btn-limit-upgrade-action"
            >
              <span>{t('limits.view_plans', 'View Plans & Upgrade')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-2xl transition-colors cursor-pointer"
              id="btn-limit-cancel-action"
            >
              {t('common.cancel', 'Cancel / Back')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
