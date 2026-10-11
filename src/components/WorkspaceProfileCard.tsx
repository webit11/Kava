import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, 
  User, 
  Building, 
  LogOut 
} from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { useTranslation } from '../lib/useTranslation';

export interface WorkspaceProfileCardProps {
  currentUser: {
    name?: string;
    email?: string;
    avatar?: string;
    plan?: string;
  };
  activePlan: SubscriptionPlan;
  computedStorageMB: number;
  storagePercentage: number;
  onNavigateTab: (tab: any) => void;
  onOpenCheckout?: (tierName?: string, message?: string) => void;
  onSignOut: () => void;
  isCollapsed?: boolean;
}

export const WorkspaceProfileCard: React.FC<WorkspaceProfileCardProps> = ({
  currentUser,
  activePlan,
  computedStorageMB,
  storagePercentage,
  onNavigateTab,
  onOpenCheckout,
  onSignOut,
  isCollapsed = false
}) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Format concise storage string e.g. "26 MB / 10 GB" or "1.5 GB / 10 GB"
  const formattedStorage = React.useMemo(() => {
    const quotaGb = activePlan?.storageQuotaGb || 10;
    if (computedStorageMB >= 1024) {
      const usedGb = (computedStorageMB / 1024).toFixed(1);
      return `${usedGb} GB / ${quotaGb} GB`;
    } else {
      const usedMb = computedStorageMB < 1 ? computedStorageMB.toFixed(1) : (computedStorageMB % 1 === 0 ? computedStorageMB.toFixed(0) : computedStorageMB.toFixed(1));
      return `${usedMb} MB / ${quotaGb} GB`;
    }
  }, [computedStorageMB, activePlan]);

  // Determine badge styling based on active subscription plan name
  const planName = currentUser?.plan || activePlan?.name || 'Free';
  const planLower = planName.toLowerCase();
  let badgeStyle = 'bg-slate-100 border-slate-200 text-slate-600';
  if (planLower.includes('enterprise')) {
    badgeStyle = 'bg-amber-50 border-amber-200 text-amber-700';
  } else if (planLower.includes('pro') || planLower.includes('premium') || planLower.includes('studio')) {
    badgeStyle = 'bg-slate-900 border-slate-950 text-white';
  }

  // Generate fallback name initials
  const nameInitials = React.useMemo(() => {
    if (!currentUser?.name) return 'U';
    const parts = currentUser.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return currentUser.name.slice(0, 2).toUpperCase();
  }, [currentUser?.name]);

  // Render for Collapsed Sidebar
  if (isCollapsed) {
    return (
      <div className="relative group/user flex justify-center mt-auto pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onNavigateTab('profile')}
          className="h-10 w-10 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs hover:scale-105 transition-all relative cursor-pointer focus:outline-none"
          title={currentUser.name || t('profile.account_settings', 'Account Settings')}
        >
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span>{nameInitials}</span>
          )}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white" />
        </button>

        {/* Hover Flyout Card */}
        <div className="absolute left-full ml-3 bottom-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 opacity-0 group-hover/user:opacity-100 pointer-events-none group-hover/user:pointer-events-auto transition-all duration-200 z-50 text-left space-y-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{nameInitials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-900 truncate">{currentUser.name || 'Anonymous'}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border shrink-0 ${badgeStyle}`}>
              {planName}
            </span>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-600">
              <span>{formattedStorage}</span>
              {onOpenCheckout && (
                <button
                  type="button"
                  onClick={() => onOpenCheckout('Premium', 'Host Storage Limit Upgrade')}
                  className="text-[9px] font-bold text-slate-900 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors"
                >
                  {t('profile.upgrade', 'Upgrade')}
                </button>
              )}
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  storagePercentage > 85 ? 'bg-rose-500' : storagePercentage > 60 ? 'bg-amber-500' : 'bg-slate-900'
                }`}
                style={{ width: `${Math.min(100, Math.max(3, storagePercentage))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3.5 space-y-3 shadow-xs hover:border-slate-300/80 transition-all text-left select-none mt-auto">
      {/* Top Row: Avatar, Name, Subscription Badge, Overflow (⋯) Menu */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Avatar with Status Dot */}
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-full bg-slate-200 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{nameInitials}</span>
              )}
            </div>
            <span 
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" 
              title="Active Session"
            />
          </div>

          {/* User Display Name & Subscription Badge */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h4 className="text-xs font-extrabold text-slate-900 truncate leading-snug" title={currentUser.name || 'Anonymous'}>
                {currentUser.name || 'Anonymous'}
              </h4>
              <span className={`shrink-0 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider font-mono border ${badgeStyle}`}>
                {planName}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate leading-none mt-0.5" title={currentUser.email}>
              {currentUser.email || 'No email set'}
            </p>
          </div>
        </div>

        {/* Compact Overflow Menu Button (⋯) */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(prev => !prev);
            }}
            className={`p-1.5 rounded-xl transition-all cursor-pointer focus:outline-none ${
              isMenuOpen 
                ? 'bg-slate-200 text-slate-900' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
            }`}
            title={t('profile.options', 'Account & Workspace Options')}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Profile Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-fade-in text-left">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-extrabold text-slate-900 truncate">{currentUser.name || 'User Profile'}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onNavigateTab('profile');
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{t('profile.account_settings', 'Account Settings')}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onNavigateTab('workspace_settings');
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{t('profile.workspace_settings', 'Workspace Settings')}</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>{t('profile.sign_out', 'Sign Out')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Storage Usage Row & Progress Bar */}
      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="font-semibold text-slate-600 truncate mr-2" title={`Storage usage: ${formattedStorage}`}>
            {formattedStorage}
          </span>
          {onOpenCheckout && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCheckout('Premium', 'Host Storage Limit Upgrade');
              }}
              className="text-[9px] font-bold text-slate-900 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer shrink-0 uppercase tracking-wider font-sans"
              title={t('profile.upgrade_storage', 'Upgrade storage plan')}
            >
              {t('profile.upgrade', 'Upgrade')}
            </button>
          )}
        </div>

        {/* Storage Progress Bar */}
        <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              storagePercentage > 85 ? 'bg-rose-500' : storagePercentage > 60 ? 'bg-amber-500' : 'bg-slate-900'
            }`} 
            style={{ width: `${Math.min(100, Math.max(3, storagePercentage))}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceProfileCard;
