import React from 'react';
import { ShieldCheck, Eye, Lock, User, Sparkles } from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';
import { getEventContext } from '../../lib/onboardingContext';

interface Step4PermissionsProps {
  guestUploadAllowed: boolean;
  setGuestUploadAllowed: (val: boolean) => void;
  requireApproval: boolean;
  setRequireApproval: (val: boolean) => void;
  onboardingHideContributorNames: boolean;
  setOnboardingHideContributorNames: (val: boolean) => void;
  onboardingAllowAnonymousWishes: boolean;
  setOnboardingAllowAnonymousWishes: (val: boolean) => void;
  onboardingGuestVisibility: 'all' | 'own' | 'none';
  setOnboardingGuestVisibility: (val: 'all' | 'own' | 'none') => void;
  eventType?: string;
  appearance?: 'light' | 'dark';
}

export default function Step4Permissions({
  guestUploadAllowed,
  setGuestUploadAllowed,
  requireApproval,
  setRequireApproval,
  onboardingHideContributorNames,
  setOnboardingHideContributorNames,
  onboardingAllowAnonymousWishes,
  setOnboardingAllowAnonymousWishes,
  onboardingGuestVisibility,
  setOnboardingGuestVisibility,
  eventType = 'Wedding',
  appearance = 'light',
}: Step4PermissionsProps) {
  const { t } = useTranslation();
  const isDark = appearance === 'dark';
  const ctx = getEventContext(eventType);

  return (
    <div className="space-y-6 text-left" id="step-4-permissions-content">
      {/* Header with context badge */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3 py-1 rounded-full inline-block">
            {t('onboarding.step4_tag', 'Step 4 • Permissions')}
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
          {t('onboarding.step4_title', 'Guest Permissions & Privacy')}
        </h2>
        <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {ctx.step4Subtitle}
        </p>
      </div>

      {/* Contextual Tip Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start space-x-3 ${
          isDark
            ? 'bg-[#17223D]/60 border-slate-800 text-slate-300'
            : 'bg-[#00A88F]/5 border-[#00A88F]/20 text-[#0B132B]'
        }`}
      >
        <Sparkles className="w-4 h-4 text-[#00A88F] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-bold">{ctx.name} Privacy Advice</p>
          <p className="text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            {ctx.step4Tip}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Toggle 1: Guest Uploads */}
        <div
          className={`flex items-start justify-between p-4.5 rounded-[20px] border transition-all ${
            isDark ? 'border-slate-800 bg-[#17223D]/60' : 'border-slate-200/90 bg-slate-50/80'
          }`}
        >
          <div className="space-y-1 pr-4 text-left">
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
              {t('onboarding.perm_contributions_title', 'Allow Guest Contributions')}
            </h4>
            <p className={`text-xs font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('onboarding.perm_contributions_desc', 'Anyone with the invitation link or QR code can upload photos and leave wishes.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGuestUploadAllowed(!guestUploadAllowed)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              guestUploadAllowed ? 'bg-[#00A88F]' : (isDark ? 'bg-slate-700' : 'bg-slate-200')
            }`}
            id="btn-toggle-upload"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                guestUploadAllowed ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Host Moderation */}
        <div
          className={`flex items-start justify-between p-4.5 rounded-[20px] border transition-all ${
            isDark ? 'border-slate-800 bg-[#17223D]/60' : 'border-slate-200/90 bg-slate-50/80'
          }`}
        >
          <div className="space-y-1 pr-4 text-left">
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
              {t('onboarding.perm_moderation_title', 'Host Moderation Required')}
            </h4>
            <p className={`text-xs font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('onboarding.perm_moderation_desc', 'Contributions remain private until you approve them in your Host Dashboard.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRequireApproval(!requireApproval)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              requireApproval ? 'bg-[#00A88F]' : (isDark ? 'bg-slate-700' : 'bg-slate-200')
            }`}
            id="btn-toggle-moderation"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                requireApproval ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Privacy Controls Header */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            {t('onboarding.privacy_settings_header', 'Privacy & Anonymity Controls')}
          </p>

          {/* Toggle 3: Anonymize Names */}
          <div
            className={`flex items-start justify-between p-4.5 rounded-[20px] border transition-all ${
              isDark ? 'border-slate-800 bg-[#17223D]/60' : 'border-slate-200/90 bg-slate-50/80'
            }`}
          >
            <div className="space-y-1 pr-4 text-left">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                {t('onboarding.privacy_anonymize_title', 'Anonymize Contributor Names')}
              </h4>
              <p className={`text-xs font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('onboarding.privacy_anonymize_desc', 'Hide names from other guests on public feeds while retaining full host visibility.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOnboardingHideContributorNames(!onboardingHideContributorNames)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                onboardingHideContributorNames ? 'bg-[#00A88F]' : (isDark ? 'bg-slate-700' : 'bg-slate-200')
              }`}
              id="btn-toggle-hide-names"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  onboardingHideContributorNames ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 4: Anonymous Wishes */}
          <div
            className={`flex items-start justify-between p-4.5 rounded-[20px] border transition-all ${
              isDark ? 'border-slate-800 bg-[#17223D]/60' : 'border-slate-200/90 bg-slate-50/80'
            }`}
          >
            <div className="space-y-1 pr-4 text-left">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                {t('onboarding.privacy_anon_wishes_title', 'Allow Anonymous Wishes')}
              </h4>
              <p className={`text-xs font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('onboarding.privacy_anon_wishes_desc', 'Guests can submit written wishes and messages anonymously without signing in.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOnboardingAllowAnonymousWishes(!onboardingAllowAnonymousWishes)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                onboardingAllowAnonymousWishes ? 'bg-[#00A88F]' : (isDark ? 'bg-slate-700' : 'bg-slate-200')
              }`}
              id="btn-toggle-anon-wishes"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  onboardingAllowAnonymousWishes ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Guest Visibility Control */}
          <div
            className={`p-4.5 rounded-[20px] border space-y-2.5 ${
              isDark ? 'border-slate-800 bg-[#17223D]/60' : 'border-slate-200/90 bg-slate-50/80'
            }`}
          >
            <div className="text-left space-y-0.5">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
                {t('onboarding.privacy_visibility_title', 'Guest Feed Visibility Scope')}
              </h4>
              <p className={`text-xs font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('onboarding.privacy_visibility_desc', 'Choose what guests can view on the interactive capsule feed.')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold">
              {(['all', 'own', 'none'] as const).map((mode) => {
                const isActive = onboardingGuestVisibility === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setOnboardingGuestVisibility(mode)}
                    className={`px-3 py-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#00A88F] bg-[#00A88F] text-white shadow-2xs'
                        : isDark
                        ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {mode === 'all' && t('onboarding.visibility_all', 'Show All')}
                    {mode === 'own' && t('onboarding.visibility_own', 'Own Only')}
                    {mode === 'none' && t('onboarding.visibility_none', 'Vault (Host Only)')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

