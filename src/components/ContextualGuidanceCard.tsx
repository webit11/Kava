import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

interface GuidanceStep {
  number: number;
  title: string;
  description: string;
}

interface ContextualGuidanceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  steps?: GuidanceStep[];
  primaryCtaLabel: string;
  onPrimaryCta: () => void;
  secondaryCtaLabel?: string;
  onSecondaryCta?: () => void;
  className?: string;
}

export default function ContextualGuidanceCard({
  title,
  description,
  icon,
  steps,
  primaryCtaLabel,
  onPrimaryCta,
  secondaryCtaLabel,
  onSecondaryCta,
  className = ''
}: ContextualGuidanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`w-full max-w-2xl mx-auto bg-white border border-slate-100 rounded-[28px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] text-left ${className}`}
    >
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shrink-0 shadow-xs">
          {icon || <Sparkles className="w-6 h-6" />}
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-black text-slate-950">{title}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Guidance Card
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {steps && steps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6">
          {steps.map((st) => (
            <div key={st.number} className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 space-y-1">
              <div className="w-6 h-6 rounded-xl bg-slate-900 text-white text-[11px] font-black font-mono flex items-center justify-center mb-2">
                0{st.number}
              </div>
              <h5 className="text-xs font-bold text-slate-900">{st.title}</h5>
              <p className="text-[11px] font-normal text-slate-500 leading-normal">{st.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 flex items-center space-x-3 flex-wrap gap-2">
        <button
          onClick={onPrimaryCta}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all flex items-center space-x-2 shadow-sm cursor-pointer active:scale-95"
        >
          <span>{primaryCtaLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {secondaryCtaLabel && onSecondaryCta && (
          <button
            onClick={onSecondaryCta}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{secondaryCtaLabel}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
