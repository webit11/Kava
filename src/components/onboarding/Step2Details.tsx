import React from 'react';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';
import { getEventContext } from '../../lib/onboardingContext';

interface Step2DetailsProps {
  eventName: string;
  setEventName: (name: string) => void;
  eventDate: string;
  setEventDate: (date: string) => void;
  eventLocation: string;
  setEventLocation: (location: string) => void;
  eventType: string;
  appearance?: 'light' | 'dark';
}

export default function Step2Details({
  eventName,
  setEventName,
  eventDate,
  setEventDate,
  eventLocation,
  setEventLocation,
  eventType,
  appearance = 'light',
}: Step2DetailsProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';
  const ctx = getEventContext(eventType);

  return (
    <div className="space-y-4 sm:space-y-6 text-left" id="step-2-details-content">
      {/* Header with context-aware tag */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3 py-0.5 rounded-full inline-block">
            {t('onboarding.step2_tag', 'Step 2 • Occasion Details')}
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${ctx.badgeBg} ${ctx.badgeText} ${ctx.badgeBorder}`}
          >
            {ctx.badgeTag}
          </span>
        </div>
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#0B132B]'
          }`}
        >
          {ctx.step2Title}
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {ctx.step2Subtitle}
        </p>
      </div>

      <div className="space-y-3.5 sm:space-y-5">
        {/* Capsule Title Input */}
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('onboarding.capsule_title_label', 'Capsule Title')} <span className="text-[#00A88F]">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {eventName.length}/60
            </span>
          </div>
          <input
            type="text"
            maxLength={60}
            placeholder={ctx.placeholderTitle}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className={`w-full rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 text-sm sm:text-base font-semibold focus:outline-none transition-all ${
              isDark
                ? 'bg-[#17223D] border border-slate-800 focus:border-[#00A88F] text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#00A88F]/20'
                : 'bg-slate-50/80 border border-slate-200/90 focus:border-[#00A88F] text-[#0B132B] placeholder:text-slate-400 focus:ring-2 focus:ring-[#00A88F]/20'
            }`}
            id="input-onboarding-name"
            autoFocus
          />
        </div>

        {/* Date & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Event Date */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <Calendar className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('onboarding.date_label', 'Event Date')}</span>
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={`w-full rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:outline-none transition-all ${
                isDark
                  ? 'bg-[#17223D] border border-slate-800 focus:border-[#00A88F] text-white'
                  : 'bg-slate-50/80 border border-slate-200/90 focus:border-[#00A88F] text-[#0B132B]'
              }`}
              id="input-onboarding-date"
            />
          </div>

          {/* Location */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <MapPin className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('onboarding.venue_label', 'Venue / Location')}</span>
            </label>
            <input
              type="text"
              placeholder={ctx.placeholderLocation}
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className={`w-full rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:outline-none transition-all ${
                isDark
                  ? 'bg-[#17223D] border border-slate-800 focus:border-[#00A88F] text-white placeholder:text-slate-600'
                  : 'bg-slate-50/80 border border-slate-200/90 focus:border-[#00A88F] text-[#0B132B] placeholder:text-slate-400'
              }`}
              id="input-onboarding-location"
            />
          </div>
        </div>

        {/* Dynamic Context Guidance Banner */}
        <div
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex items-start space-x-2.5 sm:space-x-3 ${
            isDark
              ? 'bg-[#17223D]/50 border-slate-800 text-slate-300'
              : 'bg-[#00A88F]/5 border-[#00A88F]/20 text-[#0B132B]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#00A88F] shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold">{t('onboarding.context_tip_title', 'Contextual Tip')}: {ctx.name}</p>
            <p className="text-slate-500 dark:text-slate-400 font-normal leading-relaxed text-[11px] sm:text-xs">
              {ctx.step1Desc} Guests will see this banner when they open your invitation link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

