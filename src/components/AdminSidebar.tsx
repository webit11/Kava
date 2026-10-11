import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  HardDrive,
  Calendar,
  Quote,
  Megaphone,
  Layout,
  HelpCircle,
  Compass,
  Globe,
  DollarSign,
  Ticket,
  Shield,
  Bell,
  Sliders,
  FileText,
  Database,
  Settings,
  Mail,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sparkles,
  Layers,
  QrCode
} from 'lucide-react';
import { useTranslation } from '../lib/useTranslation';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  openTicketsCount?: number;
  handleLogout: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  setSearchQuery,
  openTicketsCount = 0,
  handleLogout,
  isMobile = false,
  onCloseMobile,
  isCollapsed = false
}) => {
  const { t } = useTranslation();

  const secondaryTabIds = [
    'qr_branding', 'landing_banner', 'footer_manager', 'faqs', 'onboarding_guides', 'tooltips_manager',
    'trust_safety', 'broadcast', 'flags', 'permissions',
    'audit', 'backup', 'system_config', 'emails'
  ];

  const isSecondaryActive = secondaryTabIds.includes(activeTab);
  const [isMoreOpen, setIsMoreOpen] = useState(isSecondaryActive);

  useEffect(() => {
    if (isSecondaryActive && !isMoreOpen) {
      setIsMoreOpen(true);
    }
  }, [activeTab, isSecondaryActive]);

  const primaryItems: Array<{ id: string; label: string; icon: any; badgeNum?: number; badgeText?: string }> = [
    { id: 'dashboard', label: t('admin.dashboard', 'Dashboard Control'), icon: LayoutDashboard },
    { id: 'users', label: t('admin.users', 'User Operations'), icon: Users },
    { id: 'workspaces', label: t('admin.workspaces', 'Workspaces'), icon: HardDrive },
    { id: 'events', label: t('admin.capsules', 'Memory Capsules'), icon: Calendar },
    { id: 'testimonials', label: t('admin.landing', 'Landing Testimonials'), icon: Quote },
    { id: 'subscriptions', label: t('admin.billing', 'Billing & Plans'), icon: DollarSign },
    { id: 'support', label: t('admin.support', 'Support Queue'), icon: Ticket, badgeNum: openTicketsCount }
  ];

  const secondaryGroups = [
    {
      title: 'Branding & Content CMS',
      items: [
        { id: 'qr_branding', label: 'QR Invitation Branding', icon: QrCode },
        { id: 'landing_banner', label: 'Promo Banners', icon: Megaphone },
        { id: 'footer_manager', label: 'Footer Links', icon: Layout },
        { id: 'faqs', label: 'FAQ Manager', icon: HelpCircle },
        { id: 'onboarding_guides', label: 'Onboarding Guides', icon: Compass },
        { id: 'tooltips_manager', label: 'Tooltip Manager', icon: HelpCircle }
      ]
    },
    {
      title: 'Compliance & Safety',
      items: [
        { id: 'trust_safety', label: 'Trust & Safety', icon: Shield },
        { id: 'broadcast', label: 'Broadcasts', icon: Bell },
        { id: 'flags', label: 'Feature Flags', icon: Sliders },
        { id: 'permissions', label: 'Roles Matrix', icon: Shield }
      ]
    },
    {
      title: 'System & Audits',
      items: [
        { id: 'audit', label: 'Audit Trail', icon: FileText },
        { id: 'backup', label: 'Database Backup', icon: Database },
        { id: 'system_config', label: 'System Properties', icon: Settings },
        { id: 'emails', label: 'Email Templates', icon: Mail }
      ]
    }
  ];

  return (
    <aside className={`h-screen sticky top-0 bg-slate-950 text-slate-400 flex flex-col shrink-0 border-r border-slate-800/80 font-sans z-30 select-none overflow-hidden transition-all duration-200 ease-in-out ${
      isMobile 
        ? 'flex w-full h-full border-r-0 p-0' 
        : `hidden md:flex ${isCollapsed ? 'w-[76px] p-2' : 'w-[270px]'}`
    }`}>
      
      {/* Brand Header */}
      {isCollapsed && !isMobile ? (
        <div className="p-3 border-b border-slate-800/80 shrink-0 bg-slate-950/90 flex items-center justify-center">
          <div className="w-9 h-9 bg-gradient-to-tr from-slate-100 to-slate-300 text-slate-950 rounded-xl flex items-center justify-center font-black text-xs tracking-widest shadow-sm" title="KAVA Admin">
            K
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-slate-800/80 shrink-0 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-slate-100 to-slate-300 text-slate-950 rounded-xl flex items-center justify-center font-black text-xs tracking-widest shadow-sm">
              K
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-white font-black text-xs tracking-tight uppercase leading-none">KAVA ADMIN</h2>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono font-bold tracking-widest">SUPER ADMINISTRATOR</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Middle Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3 scrollbar-none">
        
        {/* Fixed Primary Modules */}
        <div className="space-y-1">
          {!isCollapsed || isMobile ? (
            <div className="px-3 pb-1 text-[9px] font-bold font-mono text-slate-600 uppercase tracking-widest">
              Core Operations
            </div>
          ) : null}
          {primaryItems.map(item => {
            const isActive = activeTab === item.id;
            if (isCollapsed && !isMobile) {
              return (
                <div key={item.id} className="relative group/adminitem flex justify-center py-0.5">
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSearchQuery('');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    title={item.label}
                    aria-label={item.label}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700/60'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {item.badgeNum !== undefined && item.badgeNum > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black font-mono w-4 h-4 rounded-full flex items-center justify-center border border-slate-950">
                        {item.badgeNum}
                      </span>
                    )}
                  </button>
                  <div className="absolute left-full ml-3 top-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover/adminitem:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                    {item.label}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery('');
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700/60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badgeNum !== undefined && item.badgeNum > 0 && (
                  <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono shadow-xs">
                    {item.badgeNum}
                  </span>
                )}
                {item.badgeText && (
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold">
                    {item.badgeText}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Accordion Group: Secondary Tools */}
        <div className="pt-1 border-t border-slate-900">
          {isCollapsed && !isMobile ? (
            <div className="relative group/adminmore flex justify-center py-1">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                title="More Tools & Governance"
                aria-label="More Tools & Governance"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isSecondaryActive
                    ? 'bg-slate-900 text-slate-200 border border-slate-800'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
                }`}
              >
                <Layers className="w-4 h-4 text-slate-400" />
              </button>
              <div className="absolute left-full ml-3 top-0 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover/adminmore:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                More Tools & Governance
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSecondaryActive
                  ? 'bg-slate-900 text-slate-200 border border-slate-800'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="w-4 h-4 text-slate-500" />
                <span>More Tools & Governance</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-mono font-bold text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded-md">12</span>
                {isMoreOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
            </button>
          )}

          {isMoreOpen && (!isCollapsed || isMobile) && (
            <div className="mt-1.5 pl-2 space-y-2.5 animate-fade-in border-l border-slate-800/80 ml-3">
              {secondaryGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-0.5">
                  <div className="px-2.5 py-1 text-[8px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                    {group.title}
                  </div>
                  {group.items.map(subItem => {
                    const isSubActive = activeTab === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveTab(subItem.id);
                          setSearchQuery('');
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        <subItem.icon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate text-[11px]">{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* User Footer Account details (Pinned) */}
      {isCollapsed && !isMobile ? (
        <div className="p-2 border-t border-slate-800/80 shrink-0 bg-slate-950 flex flex-col items-center justify-center space-y-2">
          <div className="relative group/adminuser">
            <div className="w-8 h-8 bg-amber-500 text-slate-950 font-bold rounded-lg flex items-center justify-center text-xs shadow-sm cursor-pointer">
              SA
            </div>
            <div className="absolute left-full ml-3 bottom-0 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover/adminuser:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
              <p className="font-bold">Super Administrator</p>
              <p className="text-[10px] text-slate-400 font-mono">admin@kava.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-slate-900 text-slate-500 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Log Out Staff"
            aria-label="Log Out Staff"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3.5 border-t border-slate-800/80 shrink-0 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 bg-amber-500 text-slate-950 font-bold rounded-lg flex items-center justify-center text-xs shadow-sm shrink-0">
              SA
            </div>
            <div className="truncate max-w-[130px]">
              <p className="text-white text-xs font-bold leading-none truncate">Super Administrator</p>
              <span className="text-[9px] text-slate-500 font-mono truncate block">admin@kava.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-slate-900 text-slate-500 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
            title="Log Out Staff"
            aria-label="Log Out Staff"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

    </aside>
  );
};
