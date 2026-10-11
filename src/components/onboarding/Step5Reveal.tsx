import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';
import { getEventContext } from '../../lib/onboardingContext';

interface Step5RevealProps {
  eventDate: string;
  onboardingRevealMode: 'live' | 'after_event' | 'scheduled';
  setOnboardingRevealMode: (mode: 'live' | 'after_event' | 'scheduled') => void;
  setInstantReveal: (val: boolean) => void;
  onboardingUploadStartTime: string;
  setOnboardingUploadStartTime: (time: string) => void;
  onboardingUploadDeadline: string;
  setOnboardingUploadDeadline: (time: string) => void;
  onboardingDeadlineMode: 'same_day' | 'plus_1_day' | 'plus_3_days' | 'plus_7_days' | 'custom';
  setOnboardingDeadlineMode: (mode: 'same_day' | 'plus_1_day' | 'plus_3_days' | 'plus_7_days' | 'custom') => void;
  handleSelectDeadlinePreset: (mode: 'same_day' | 'plus_1_day' | 'plus_3_days' | 'plus_7_days' | 'custom') => void;
  isDateRangeInvalid: boolean;
  formatDisplayDate: (str: string) => string;
  eventType?: string;
  appearance?: 'light' | 'dark';
}

export default function Step5Reveal({
  eventDate,
  onboardingRevealMode,
  setOnboardingRevealMode,
  setInstantReveal,
  onboardingUploadStartTime,
  setOnboardingUploadStartTime,
  onboardingUploadDeadline,
  setOnboardingUploadDeadline,
  onboardingDeadlineMode,
  setOnboardingDeadlineMode,
  handleSelectDeadlinePreset,
  isDateRangeInvalid,
  formatDisplayDate,
  eventType = 'Wedding',
  appearance = 'light',
}: Step5RevealProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';
  const ctx = getEventContext(eventType);

  return (
    <div className="space-y-6 text-left" id="step-5-reveal-content">
      {/* Header with context badge */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3 py-1 rounded-full inline-block">
            {t('onboarding.step5_tag', 'Step 5 • Timeline & Reveal')}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${ctx.badgeBg} ${ctx.badgeText} ${ctx.badgeBorder}`}>
            {ctx.badgeTag}
          </span>
        </div>
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#0B132B]'
          }`}
        >
          {ctx.step5TimelineTitle}
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {ctx.step5TimelineSubtitle}
        </p>
      </div>

      <div className="space-y-5">
        {/* Reveal Mode Grid Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-mono">
            {t('onboarding.reveal_mode_header', 'Reveal Mode Strategy')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'live',
                title: t('onboarding.reveal_live_title', 'Live Stream Feed'),
                desc: t('onboarding.reveal_live_desc', 'Photos & wishes appear instantly on shared feeds.'),
              },
              {
                id: 'after_event',
                title: t('onboarding.reveal_after_title', 'Time Capsule Vault'),
                desc: t('onboarding.reveal_after_desc', 'Memories stay locked until host manually reveals them.'),
              },
              {
                id: 'scheduled',
                title: t('onboarding.reveal_scheduled_title', 'Scheduled Reveal'),
                desc: t('onboarding.reveal_scheduled_desc', 'Feeds unlock automatically at a specific time.'),
              },
            ].map((mode) => {
              const isSelected = onboardingRevealMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setOnboardingRevealMode(mode.id as any);
                    setInstantReveal(mode.id === 'live');
                  }}
                  className={`p-4 rounded-[20px] text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#00A88F] bg-[#00A88F]/10 shadow-2xs ring-1 ring-[#00A88F]/30'
                      : isDark
                      ? 'border-slate-800 bg-[#17223D]/60 hover:border-slate-700'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>{mode.title}</h4>
                    <p className={`text-[11px] font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{mode.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scheduled Reveal Date Picker */}
        {onboardingRevealMode === 'scheduled' && (
          <div
            className={`space-y-2 p-4.5 rounded-[20px] border ${
              isDark ? 'border-slate-800 bg-[#17223D]/60' : 'border-slate-200/90 bg-slate-50/80'
            }`}
          >
            <label className="text-[11px] font-bold uppercase tracking-wider font-mono flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('onboarding.reveal_scheduled_label', 'Specify Scheduled Reveal Timestamp')}</span>
            </label>
            <input
              type="datetime-local"
              value={onboardingUploadDeadline}
              onChange={(e) => setOnboardingUploadDeadline(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all ${
                isDark
                  ? 'bg-[#17223D] border border-slate-700 text-white'
                  : 'bg-white border border-slate-200 focus:border-[#00A88F] text-[#0B132B]'
              }`}
            />
            <p className="text-[10px] text-slate-400 font-normal">
              {t('onboarding.reveal_scheduled_subtext', 'Guests will see a live countdown clock until this exact timestamp is reached.')}
            </p>
          </div>
        )}

        {/* Upload Time Constraints */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              {t('onboarding.upload_constraints_header', 'Upload Time Window')}
            </p>
            {eventDate && (
              <span className="text-[11px] font-mono text-slate-500 flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-[#00A88F] shrink-0" />
                <span>Event Date: {eventDate}</span>
              </span>
            )}
          </div>

          {/* Quick Time Presets */}
          <div
            className={`space-y-2 p-3.5 rounded-[20px] border ${
              isDark ? 'border-slate-800 bg-[#17223D]/60' : 'border-slate-200/90 bg-slate-50/80'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00A88F]" />
                <span>{t('onboarding.quick_presets_label', 'Quick Upload Deadline Presets')}</span>
              </span>
              {onboardingDeadlineMode !== 'custom' && (
                <span className="text-[10px] text-[#00A88F] font-bold lowercase tracking-normal flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-[#00A88F]" />
                  <span>Preset synced</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none sm:flex-wrap md:flex-nowrap">
              {[
                { id: 'same_day' as const, label: t('onboarding.preset_same_day', 'Same Day'), badge: 'Event Day' },
                { id: 'plus_1_day' as const, label: t('onboarding.preset_h1', '+1 Day'), badge: '+1d' },
                { id: 'plus_3_days' as const, label: t('onboarding.preset_h3', '+3 Days'), badge: '+3d' },
                { id: 'plus_7_days' as const, label: t('onboarding.preset_h7', '+1 Week'), badge: '+7d' },
                { id: 'custom' as const, label: t('onboarding.preset_custom', 'Custom'), badge: 'Manual' },
              ].map((preset) => {
                const isActive = onboardingDeadlineMode === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectDeadlinePreset(preset.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#00A88F] text-white border-[#00A88F] shadow-2xs'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{preset.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${
                        isActive
                          ? 'bg-black/20 text-white'
                          : isDark
                          ? 'bg-slate-900 text-slate-400'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upload Start Time */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300">
                {t('onboarding.upload_start_label', 'Upload Start Time')}
              </label>
              <input
                type="datetime-local"
                value={onboardingUploadStartTime}
                onChange={(e) => setOnboardingUploadStartTime(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all ${
                  isDateRangeInvalid
                    ? 'border-amber-400 bg-amber-50/20 text-amber-900'
                    : isDark
                    ? 'bg-[#17223D] border border-slate-800 focus:border-[#00A88F] text-white'
                    : 'bg-slate-50/80 border border-slate-200/90 focus:border-[#00A88F] text-[#0B132B]'
                }`}
              />
              <p className="text-[10px] text-slate-400 font-normal">
                {t('onboarding.upload_start_subtext', 'Leave blank to start accepting contributions immediately.')}
              </p>
            </div>

            {/* Upload Deadline */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300">
                  {t('onboarding.upload_deadline_label', 'Upload Deadline')}
                </label>
                {onboardingDeadlineMode !== 'custom' && onboardingUploadDeadline && (
                  <span className="text-[10px] font-mono text-[#00A88F] font-bold bg-[#00A88F]/10 px-2 py-0.5 rounded-md">
                    {formatDisplayDate(onboardingUploadDeadline)}
                  </span>
                )}
              </div>
              <input
                type="datetime-local"
                value={onboardingUploadDeadline}
                onChange={(e) => {
                  setOnboardingDeadlineMode('custom');
                  setOnboardingUploadDeadline(e.target.value);
                }}
                className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all ${
                  isDateRangeInvalid
                    ? 'border-amber-400 bg-amber-50/20 text-amber-900'
                    : isDark
                    ? 'bg-[#17223D] border border-slate-800 focus:border-[#00A88F] text-white'
                    : 'bg-slate-50/80 border border-slate-200/90 focus:border-[#00A88F] text-[#0B132B]'
                }`}
              />
              {onboardingDeadlineMode !== 'custom' && onboardingUploadDeadline ? (
                <p className="text-[10px] text-[#00A88F] font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>Calculated from event date ({eventDate}). Click input to customize.</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 font-normal">
                  {t('onboarding.upload_deadline_subtext', 'Leave blank to keep uploads open indefinitely.')}
                </p>
              )}
            </div>
          </div>

          {/* Validation Error Banner */}
          {isDateRangeInvalid && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{t('onboarding.err_deadline_before_start', 'Upload deadline cannot be earlier than upload start time.')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

