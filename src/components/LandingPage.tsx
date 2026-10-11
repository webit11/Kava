import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSubViewFromPath, getRoutePathFromSubView } from '../lib/routesConfig';
import { validateEventJoinCode } from '../lib/eventValidation';
import { 
  Camera, 
  Heart, 
  Mic, 
  Sparkles, 
  Users, 
  Tv, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  QrCode, 
  Plus, 
  Volume2, 
  MessageSquare,
  HelpCircle,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Award,
  Image as ImageIcon,
  Video,
  Play,
  Pause,
  Radio,
  Eye,
  Share2,
  AlertCircle,
  Search,
  Tag,
  Globe,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  X,
  Clock,
  ChevronDown,
  Lock,
  Layers,
  Calendar,
  Check
} from 'lucide-react';
import KavaLogo, { KavaPetalIcon } from './KavaLogo';
import { FAQ_ITEMS, INITIAL_FAQ_ITEMS, INITIAL_TESTIMONIALS, INITIAL_TESTIMONIAL_STATS, INITIAL_EVENTS, INITIAL_CONTRIBUTIONS } from '../data';
import { Testimonial, GlobalTestimonialStats, KavaEvent, KavaContribution, SubscriptionPlan, PromotionItem, FAQItem, UnansweredSearchTerm, LandingBannerConfig, MegaMenuCampaign } from '../types';
import { 
  getStoredPlans, 
  getStoredPromotions, 
  getStoredCurrency, 
  getPlanPricesForCurrency, 
  formatCurrencyAmount, 
  getLandingBannerConfig, 
  getActiveCampaignForCategory, 
  getActiveCampaignsForCategory,
  getStoredComparisonCategories,
  ComparisonCategory,
  PlanFeatureValue
} from '../lib/billing';
import SpotlightCampaignCarousel from './SpotlightCampaignCarousel';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../lib/useTranslation';
import CurrencySelector from './CurrencySelector';
import ContactSupportModal from './ContactSupportModal';
import FooterSection from './FooterSection';
import HowItWorksPage from './navigation/HowItWorksPage';
import CapsuleTypesPage from './navigation/CapsuleTypesPage';
import PricingPage from './navigation/PricingPage';
import ResourcesPage from './navigation/ResourcesPage';
import ContactSupportPage from './navigation/ContactSupportPage';
import LegalPage from './navigation/LegalPage';
import HeroSection from './hero/HeroSection';
import { HostUser } from '../lib/auth';

interface LandingPageProps {
  onCreateEvent: () => void;
  onEnterCode: (code: string) => void;
  onOpenQrScanner?: () => void;
  isVerifying?: boolean;
  onTryDemo: () => void;
  onOpenCheckout?: (planId?: string) => void;
  testimonials?: Testimonial[];
  testimonialStats?: GlobalTestimonialStats;
  events?: KavaEvent[];
  contributions?: KavaContribution[];
  currentUser?: HostUser | null;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onOpenDashboard?: () => void;
  onLogout?: () => void;
}

export default function LandingPage({ 
  onCreateEvent, 
  onEnterCode, 
  onOpenQrScanner,
  isVerifying = false,
  onTryDemo,
  onOpenCheckout,
  testimonials = INITIAL_TESTIMONIALS,
  testimonialStats = INITIAL_TESTIMONIAL_STATS,
  events = [],
  contributions = [],
  currentUser,
  onOpenAuth,
  onOpenDashboard,
  onLogout
}: LandingPageProps) {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Active Event & Real Data Bindings for Live Stage Preview
  const activeLiveEvent = useMemo(() => {
    if (events && events.length > 0) {
      return events.find(e => e.id === 'evt-1' || e.code === 'SOFIA-LEO') || events[0];
    }
    return INITIAL_EVENTS[0];
  }, [events]);

  const activeLiveContributions = useMemo(() => {
    if (contributions && contributions.length > 0) {
      const matched = contributions.filter(c => c.eventId === activeLiveEvent.id);
      if (matched.length > 0) return matched;
    }
    return INITIAL_CONTRIBUTIONS.filter(c => c.eventId === 'evt-1');
  }, [contributions, activeLiveEvent]);

  const photoContribution = useMemo(() => {
    return activeLiveContributions.find(c => c.type === 'photo') || INITIAL_CONTRIBUTIONS.find(c => c.type === 'photo');
  }, [activeLiveContributions]);

  const wishContribution = useMemo(() => {
    return activeLiveContributions.find(c => c.type === 'wish') || INITIAL_CONTRIBUTIONS.find(c => c.type === 'wish');
  }, [activeLiveContributions]);

  const voiceContribution = useMemo(() => {
    return activeLiveContributions.find(c => c.type === 'voice') || INITIAL_CONTRIBUTIONS.find(c => c.type === 'voice');
  }, [activeLiveContributions]);

  const guestJoinUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kava.app';
    return `${origin}/guest/${activeLiveEvent.code || 'SOFIA-LEO'}`;
  }, [activeLiveEvent.code]);

  const handleLaunchLiveDemo = () => {
    if (onTryDemo) {
      onTryDemo();
    }
    navigate(`/live/${activeLiveEvent.id}`);
  };

  const handleImageError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  const [eventCodeInput, setEventCodeInput] = useState('');
  const [joinInputError, setJoinInputError] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeMemoryType, setActiveMemoryType] = useState<'photo' | 'video' | 'voice' | 'wish'>('photo');
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(3);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordionTab, setMobileAccordionTab] = useState<string | null>('how_it_works');
  
  const location = useLocation();

  // Destination Page SubView derived directly from current URL path
  const landingSubView = useMemo(() => {
    return getSubViewFromPath(location.pathname);
  }, [location.pathname]);

  const navigateSubView = (subView: string) => {
    setActiveMegaMenuTab(null);
    setIsMobileMenuOpen(false);
    const targetPath = getRoutePathFromSubView(subView);
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Rich Navigation / Mega Menu State
  const [activeMegaMenuTab, setActiveMegaMenuTab] = useState<'how_it_works' | 'capsule_types' | 'pricing' | 'resources' | null>(null);
  const megaMenuTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [megaMenuCampaignVersion, setMegaMenuCampaignVersion] = useState(0);

  // Mobile Preview Switcher State (Allows testing breakpoints 390px, 430px, 768px, 1024px, 100%)
  const [previewDevice, setPreviewDevice] = useState<'responsive' | '390px' | '430px' | '768px' | '1024px'>('responsive');

  // Subscription Plans, Promotions & Banner State
  const [billingPlans, setBillingPlans] = useState<SubscriptionPlan[]>(getStoredPlans);
  const [activePromos, setActivePromos] = useState<PromotionItem[]>(getStoredPromotions);
  const [bannerConfig, setBannerConfig] = useState<LandingBannerConfig>(getLandingBannerConfig);
  const [landingBillingCycle, setLandingBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedCurrency, setSelectedCurrency] = useState<string>(getStoredCurrency);
  const [isPromoExpanded, setIsPromoExpanded] = useState(true);
  const [isPromoDismissed, setIsPromoDismissed] = useState(false);
  const [comparisonCategories, setComparisonCategories] = useState<ComparisonCategory[]>(getStoredComparisonCategories);
  const [showFullComparison, setShowFullComparison] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Dynamic annual discount calculated from active paid plans
  const landingAnnualDiscount = useMemo(() => {
    let maxDisc = 0;
    const activePlans = billingPlans.filter(p => !p.archived && p.active);
    activePlans.forEach(p => {
      if (p.monthlyPrice > 0 && p.yearlyPrice > 0) {
        const annualMonthlyTotal = p.monthlyPrice * 12;
        const disc = Math.round(((annualMonthlyTotal - p.yearlyPrice) / annualMonthlyTotal) * 100);
        if (disc > maxDisc) maxDisc = disc;
      }
    });
    return maxDisc > 0 ? maxDisc : 20;
  }, [billingPlans]);

  // Sync Mega Menu & Banner configs from admin updates
  useEffect(() => {
    const handleSyncAdminData = () => {
      setBannerConfig(getLandingBannerConfig());
      setMegaMenuCampaignVersion(v => v + 1);
    };
    window.addEventListener('kava_landing_banner_updated', handleSyncAdminData);
    window.addEventListener('kava_mega_menu_campaigns_updated', handleSyncAdminData);
    window.addEventListener('storage', handleSyncAdminData);
    return () => {
      window.removeEventListener('kava_landing_banner_updated', handleSyncAdminData);
      window.removeEventListener('kava_mega_menu_campaigns_updated', handleSyncAdminData);
      window.removeEventListener('storage', handleSyncAdminData);
    };
  }, []);

  // Dynamic FAQ State (Synced with Super Admin Panel)
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const local = localStorage.getItem('kava_admin_faqs');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FAQ_ITEMS;
  });

  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('ALL');
  const [selectedFaqLanguage, setSelectedFaqLanguage] = useState('ALL');
  const [userFeedbackState, setUserFeedbackState] = useState<Record<string, 'yes' | 'no'>>({});

  // Sync FAQs from localStorage / admin updates
  useEffect(() => {
    const syncFaqs = () => {
      try {
        const local = localStorage.getItem('kava_admin_faqs');
        if (local) setFaqs(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('kava_faqs_updated', syncFaqs);
    window.addEventListener('storage', syncFaqs);
    return () => {
      window.removeEventListener('kava_faqs_updated', syncFaqs);
      window.removeEventListener('storage', syncFaqs);
    };
  }, []);

  // Record unanswered search terms if query yields 0 results
  useEffect(() => {
    if (!faqSearchQuery || faqSearchQuery.trim().length < 3) return;

    const publishedFaqs = faqs.filter(f => f.status === 'Published');
    const matches = publishedFaqs.filter(f => 
      f.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
    );

    if (matches.length === 0) {
      const timer = setTimeout(() => {
        try {
          const localTerms: UnansweredSearchTerm[] = JSON.parse(localStorage.getItem('kava_unanswered_search_terms') || '[]');
          const termObj = localTerms.find(t => t.term.toLowerCase() === faqSearchQuery.trim().toLowerCase());
          
          let updated: UnansweredSearchTerm[];
          if (termObj) {
            updated = localTerms.map(t => t.id === termObj.id ? { ...t, count: t.count + 1, lastSearched: new Date().toISOString() } : t);
          } else {
            updated = [
              {
                id: `term-${Date.now()}`,
                term: faqSearchQuery.trim(),
                count: 1,
                lastSearched: new Date().toISOString()
              },
              ...localTerms
            ];
          }
          localStorage.setItem('kava_unanswered_search_terms', JSON.stringify(updated));
          window.dispatchEvent(new Event('kava_faqs_updated'));
        } catch (e) {
          console.error(e);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [faqSearchQuery, faqs]);

  // Expand FAQ item and record expansion analytics
  const handleToggleFaq = (index: number, faqItem: FAQItem) => {
    const nextState = activeFaq === index ? null : index;
    setActiveFaq(nextState);

    if (nextState !== null && faqItem) {
      const updatedFaqs = faqs.map(f => {
        if (f.id === faqItem.id) {
          const prevAnalytics = f.analytics || { views: 0, expansions: 0, helpfulYes: 0, helpfulNo: 0 };
          return {
            ...f,
            analytics: {
              ...prevAnalytics,
              expansions: prevAnalytics.expansions + 1
            }
          };
        }
        return f;
      });
      setFaqs(updatedFaqs);
      localStorage.setItem('kava_admin_faqs', JSON.stringify(updatedFaqs));
      window.dispatchEvent(new Event('kava_faqs_updated'));
    }
  };

  // Close mega menu and mobile menu on click outside header
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setActiveMegaMenuTab(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track Helpful Feedback
  const handleFeedback = (faqId: string, rating: 'yes' | 'no') => {
    if (userFeedbackState[faqId]) return;

    setUserFeedbackState(prev => ({ ...prev, [faqId]: rating }));
    const updatedFaqs = faqs.map(f => {
      if (f.id === faqId) {
        const prevAnalytics = f.analytics || { views: 0, expansions: 0, helpfulYes: 0, helpfulNo: 0 };
        return {
          ...f,
          analytics: {
            ...prevAnalytics,
            helpfulYes: rating === 'yes' ? prevAnalytics.helpfulYes + 1 : prevAnalytics.helpfulYes,
            helpfulNo: rating === 'no' ? prevAnalytics.helpfulNo + 1 : prevAnalytics.helpfulNo
          }
        };
      }
      return f;
    });
    setFaqs(updatedFaqs);
    localStorage.setItem('kava_admin_faqs', JSON.stringify(updatedFaqs));
    window.dispatchEvent(new Event('kava_faqs_updated'));
  };

  // Listen for storage / admin updates to plans and currency
  useEffect(() => {
    const syncData = () => {
      setBillingPlans(getStoredPlans());
      setActivePromos(getStoredPromotions());
      setSelectedCurrency(getStoredCurrency());
      setBannerConfig(getLandingBannerConfig());
      setComparisonCategories(getStoredComparisonCategories());
    };
    window.addEventListener('storage', syncData);
    window.addEventListener('kava_plans_updated', syncData);
    window.addEventListener('kava_promotions_updated', syncData);
    window.addEventListener('kava_currency_updated', syncData);
    window.addEventListener('kava_landing_banner_updated', syncData);
    window.addEventListener('kava_comparison_updated', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('kava_plans_updated', syncData);
      window.removeEventListener('kava_promotions_updated', syncData);
      window.removeEventListener('kava_currency_updated', syncData);
      window.removeEventListener('kava_landing_banner_updated', syncData);
      window.removeEventListener('kava_comparison_updated', syncData);
    };
  }, []);

  // Active Testimonials & Stats State (Synced with Super Admin Panel & LocalStorage)
  const [activeTestimonials, setActiveTestimonials] = useState<Testimonial[]>(() => {
    try {
      const local = localStorage.getItem('kava_testimonials');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
    return testimonials && testimonials.length > 0 ? testimonials : INITIAL_TESTIMONIALS;
  });

  const [activeStats, setActiveStats] = useState<GlobalTestimonialStats>(() => {
    try {
      const local = localStorage.getItem('kava_testimonial_stats');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
    return testimonialStats || INITIAL_TESTIMONIAL_STATS;
  });

  useEffect(() => {
    const syncTestimonialsData = () => {
      try {
        const localT = localStorage.getItem('kava_testimonials');
        if (localT) setActiveTestimonials(JSON.parse(localT));
        const localS = localStorage.getItem('kava_testimonial_stats');
        if (localS) setActiveStats(JSON.parse(localS));
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('kava_testimonials_updated', syncTestimonialsData);
    window.addEventListener('kava_testimonial_stats_updated', syncTestimonialsData);
    window.addEventListener('storage', syncTestimonialsData);
    return () => {
      window.removeEventListener('kava_testimonials_updated', syncTestimonialsData);
      window.removeEventListener('kava_testimonial_stats_updated', syncTestimonialsData);
      window.removeEventListener('storage', syncTestimonialsData);
    };
  }, []);

  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setActiveTestimonials(testimonials);
    }
  }, [testimonials]);

  useEffect(() => {
    if (testimonialStats) {
      setActiveStats(testimonialStats);
    }
  }, [testimonialStats]);

  // Filter published testimonials & calculate ordering
  const publishedList = activeTestimonials
    .filter(t => t.isPublished)
    .sort((a, b) => a.order - b.order);

  const defaultFeatured = publishedList.find(t => t.isFeatured) || publishedList[0] || INITIAL_TESTIMONIALS[0];

  // Selected Testimonial & Interactive Preview States
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string>(() => defaultFeatured?.id || 'tst-1');
  const [previewMediaType, setPreviewMediaType] = useState<'photos' | 'videos' | 'voice' | 'wishes' | 'live'>('photos');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);

  // Selected testimonial (or fallback)
  const selectedTestimonial = publishedList.find(t => t.id === selectedTestimonialId) || defaultFeatured;

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = eventCodeInput.trim();
    if (!clean) {
      setJoinInputError('Please enter an event code.');
      return;
    }

    const valRes = validateEventJoinCode(clean, events, []);
    if (valRes.status === 'invalid_code') {
      setJoinInputError('This invitation code is invalid or has expired.');
      return;
    }

    setJoinInputError(null);
    onEnterCode(clean.toUpperCase());
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen w-full selection:bg-slate-900 selection:text-white flex flex-col font-sans">
      
      {/* Landing Promotion Banner (Native KAVA Brand Identity) */}
      {bannerConfig && bannerConfig.enabled && (
        <div 
          className="w-full bg-[#0B132B] text-white py-2.5 px-4 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 sm:gap-3 relative z-50 shadow-xs border-b border-white/10 transition-colors"
        >
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-[#00A88F]/20 text-[#00A88F] border border-[#00A88F]/30 shrink-0">
            <Sparkles className="w-3 h-3 text-[#00A88F]" />
            <span>KAVA 2026</span>
          </span>
          <span className="text-slate-200 tracking-tight">{t('banner.text', bannerConfig.text)}</span>
          {bannerConfig.ctaLabel && (bannerConfig.ctaUrl || bannerConfig.destinationUrl) && (
            <button
              type="button"
              onClick={() => {
                if (bannerConfig.actionType === 'demo' || bannerConfig.destinationUrl === 'demo') {
                  onTryDemo();
                } else if (bannerConfig.actionType === 'create' || bannerConfig.destinationUrl === 'create') {
                  onCreateEvent();
                } else if (bannerConfig.ctaUrl && bannerConfig.ctaUrl.startsWith('#')) {
                  const el = document.querySelector(bannerConfig.ctaUrl);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else if (bannerConfig.ctaUrl) {
                  window.open(bannerConfig.ctaUrl, '_blank');
                }
              }}
              className="font-extrabold text-[#00A88F] hover:text-teal-300 transition-colors whitespace-nowrap ml-1 inline-flex items-center space-x-1 cursor-pointer group"
            >
              <span>{t('banner.cta_label', bannerConfig.ctaLabel || 'Explore Demo')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00A88F] group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}

      {/* Sub-Header Notification Bar if banner not present */}
      {(!bannerConfig || !bannerConfig.enabled) && (
        <div className="bg-[#0B132B] text-white py-2 px-4 text-center text-xs tracking-wider font-mono uppercase border-b border-white/10">
          {t('hero.badge', 'Preserving moments as they happen. Introducing KAVA 2026.')}
        </div>
      )}

      {/* Header / Modern Floating Navigation with Attached Mega Menu */}
      <header className="sticky top-4 sm:top-6 z-50 max-w-6xl mx-auto px-4 sm:px-6 w-full mt-4 sm:mt-6 relative">
        
        {/* Main Floating Container (Navbar & Mega Menu in One Card) */}
        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[28px] sm:rounded-[32px] shadow-[0_16px_48px_rgba(0,0,0,0.10)] transition-all duration-300 relative">
          
          {/* Top Bar Row */}
          <div className="px-5 sm:px-7 py-3 flex items-center justify-between">
            
            {/* Left: Brand Logo */}
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                navigateSubView('home');
              }}
              className="flex items-center space-x-2.5 group shrink-0"
            >
              <KavaLogo variant="wordmark" size="md" />
            </a>

            {/* Center: Nav Links with Mega Menu Hover Handlers (Desktop & Tablet) */}
            <nav className="hidden md:flex items-center space-x-5 sm:space-x-7 text-sm font-semibold text-slate-700 shrink-0">
              {[
                { id: 'how_it_works', label: t('nav.features', 'Features'), subView: 'how-it-works' },
                { id: 'capsule_types', label: t('nav.for_events', 'For Events'), subView: 'capsule-types' },
                { id: 'templates', label: t('nav.templates', 'Templates'), subView: 'resources-templates', isDirect: true },
                { id: 'pricing', label: t('nav.pricing', 'Pricing'), subView: 'pricing' },
                { id: 'resources', label: t('nav.resources', 'Resources'), subView: 'resources' }
              ].map((navItem) => (
                <div 
                  key={navItem.id} 
                  className="relative group py-1 shrink-0"
                  onMouseEnter={() => {
                    if (navItem.isDirect) {
                      setActiveMegaMenuTab(null);
                      return;
                    }
                    if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
                    setActiveMegaMenuTab(navItem.id as any);
                  }}
                  onMouseLeave={() => {
                    if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
                    megaMenuTimerRef.current = setTimeout(() => setActiveMegaMenuTab(null), 180);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      navigateSubView(navItem.subView);
                    }}
                    className={`hover:text-[#00A88F] transition-colors cursor-pointer flex items-center space-x-1 py-1 font-bold text-sm whitespace-nowrap ${
                      activeMegaMenuTab === navItem.id || landingSubView.startsWith(navItem.subView) ? 'text-[#00A88F] font-extrabold' : 'text-[#0B132B]'
                    }`}
                  >
                    <span className="whitespace-nowrap">{navItem.label}</span>
                    {!navItem.isDirect && (
                      <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${activeMegaMenuTab === navItem.id ? 'rotate-180 text-[#00A88F]' : 'text-slate-400 group-hover:text-slate-700'}`} />
                    )}
                  </button>
                </div>
              ))}
            </nav>

            {/* Right: Language Switcher, Compact Authenticated Avatar / Auth & Primary CTA */}
            <div className="hidden sm:flex items-center space-x-3 shrink-0">
              <LanguageSwitcher variant="default" />
              
              {currentUser ? (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="relative group p-1 bg-slate-100 hover:bg-slate-200/90 text-[#0B132B] rounded-full transition-all flex items-center justify-center cursor-pointer border border-slate-200/90 shadow-2xs hover:scale-105 active:scale-95 shrink-0 min-w-[40px] min-h-[40px]"
                  title={currentUser.name ? `${currentUser.name} (${t('nav.workspace', 'Workspace')})` : t('nav.workspace', 'Workspace')}
                  aria-label={currentUser.name ? `${currentUser.name} Workspace` : 'User Workspace'}
                >
                  {currentUser.avatar || (currentUser as any).photoUrl ? (
                    <img 
                      src={currentUser.avatar || (currentUser as any).photoUrl} 
                      alt={currentUser.name || 'User Profile'} 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center text-xs font-black font-mono tracking-tight shadow-xs">
                      {currentUser.name ? currentUser.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'H'}
                    </div>
                  )}
                  
                  {/* Active host status indicator dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('signin') : navigate('/login')}
                  className="text-xs sm:text-sm font-bold text-[#0B132B] hover:text-[#00A88F] px-3 py-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t('auth.login', 'Log in')}
                </button>
              )}

              <button 
                type="button"
                onClick={onCreateEvent}
                className="text-xs sm:text-sm font-bold text-white bg-[#0B132B] hover:bg-slate-800 px-5 sm:px-6 py-2.5 rounded-full transition-all shadow-md flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap min-h-[40px]"
                id="btn-create-capsule-header"
              >
                <span className="whitespace-nowrap">{t('nav.get_started_free', 'Get Started Free')}</span>
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-2 md:hidden">
              {currentUser && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center text-xs font-black font-mono border border-slate-200 cursor-pointer shrink-0"
                  title={currentUser.name || 'Workspace'}
                >
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'H'}
                </button>
              )}

              <button 
                type="button"
                onClick={onCreateEvent}
                className="text-xs font-extrabold text-white bg-[#0B132B] px-3.5 py-2 rounded-full flex items-center space-x-1 cursor-pointer shadow-2xs whitespace-nowrap min-h-[40px]"
              >
                <span>{t('nav.create', 'Create')}</span>
                <Plus className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer border border-slate-200/80 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

              </div>

              {/* Floating Desktop Mega Menu Overlay (Positioned Absolute so landing page content never shifts) */}
              <AnimatePresence>
                {activeMegaMenuTab && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onMouseEnter={() => {
                      if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
                    }}
                    onMouseLeave={() => {
                      if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
                      megaMenuTimerRef.current = setTimeout(() => setActiveMegaMenuTab(null), 180);
                    }}
                    className="absolute top-full left-0 right-0 mt-2.5 z-50 bg-white/94 backdrop-blur-[16px] border border-slate-200/80 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.14)] rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 hidden md:block before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
                      {(() => {
                        const activeCampaigns = activeMegaMenuTab ? getActiveCampaignsForCategory(activeMegaMenuTab, lang) : [];
                        const hasCampaigns = activeCampaigns.length > 0;

                        return (
                          <>
                            {/* Left Side: Grouped Category Navigation Links */}
                            <div className={`${
                              hasCampaigns 
                                ? 'lg:col-span-7 md:col-span-1 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-100/80 pb-6 lg:pb-0' 
                                : 'lg:col-span-12 md:col-span-1 pr-0 border-b-0 border-r-0 pb-0'
                            } space-y-3`}>
                              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                  {activeMegaMenuTab === 'how_it_works' && t('megamenu.how_it_works', 'How KAVA Preserves Memories')}
                                  {activeMegaMenuTab === 'capsule_types' && t('megamenu.capsule_types', 'Memory Capsule Collections')}
                                  {activeMegaMenuTab === 'pricing' && t('megamenu.pricing', 'Plans & Regional Pricing')}
                                  {activeMegaMenuTab === 'resources' && t('megamenu.resources', 'Resources & Support')}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-400">
                                  {t('megamenu.navigation', 'Navigation')}
                                </span>
                              </div>

                              <div className={`grid grid-cols-1 ${hasCampaigns ? '' : 'sm:grid-cols-2'} gap-1.5`}>
                                {activeMegaMenuTab === 'how_it_works' && [
                                  { title: t('megamenu.how_qr_title', 'Instant QR Guest Access'), desc: t('megamenu.how_qr_desc', 'Zero app downloads required — guests point camera & share.'), icon: QrCode, subView: 'how-it-works-qr' },
                                  { title: t('megamenu.how_proj_title', 'Real-Time 4K Projection Stream'), desc: t('megamenu.how_proj_desc', 'Watch memories compile live on venue projection displays.'), icon: Tv, subView: 'how-it-works-projection' },
                                  { title: t('megamenu.how_mod_title', 'Host Moderation & Privacy Controls'), desc: t('megamenu.how_mod_desc', 'Full approval workflows, guest codes, and privacy levels.'), icon: ShieldCheck, subView: 'how-it-works-moderation' },
                                  { title: t('megamenu.how_vault_title', '4K Vault Lossless Archiving'), desc: t('megamenu.how_vault_desc', 'Export high-res photos, 4K videos, and spoken audio wishes.'), icon: Download, subView: 'how-it-works-vault' }
                                ].map((sub, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      navigateSubView(sub.subView);
                                    }}
                                    className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-50 transition-all flex items-start space-x-3 group cursor-pointer border border-transparent hover:border-slate-100 min-h-[44px]"
                                  >
                                    <div className="p-2 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-colors shrink-0">
                                      <sub.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-0.5">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-extrabold text-slate-950">{sub.title}</p>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <p className="text-[11px] text-slate-500 leading-tight">{sub.desc}</p>
                                    </div>
                                  </button>
                                ))}

                                {activeMegaMenuTab === 'capsule_types' && [
                                  { title: t('megamenu.cap_wedding_title', 'Weddings & Anniversaries'), desc: t('megamenu.cap_wedding_desc', 'Digital guestbook with audio wishes, photo stream & QR cards.'), icon: Heart, subView: 'capsule-weddings' },
                                  { title: t('megamenu.cap_bday_title', 'Birthdays & Milestone Galas'), desc: t('megamenu.cap_bday_desc', 'Interactive countdowns, party voice notes & photo challenges.'), icon: Sparkles, subView: 'capsule-birthdays' },
                                  { title: t('megamenu.cap_corp_title', 'Corporate & Event Galas'), desc: t('megamenu.cap_corp_desc', 'Branded event spaces, QR check-in & presenter screens.'), icon: Users, subView: 'capsule-corporate' },
                                  { title: t('megamenu.cap_family_title', 'Private Family Circles'), desc: t('megamenu.cap_family_desc', 'Encrypted memory vaults for reunions & intimate gatherings.'), icon: Camera, subView: 'capsule-family' }
                                ].map((sub, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      navigateSubView(sub.subView);
                                    }}
                                    className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-50 transition-all flex items-start space-x-3 group cursor-pointer border border-transparent hover:border-slate-100 min-h-[44px]"
                                  >
                                    <div className="p-2 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-colors shrink-0">
                                      <sub.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-0.5">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-extrabold text-slate-950">{sub.title}</p>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <p className="text-[11px] text-slate-500 leading-tight">{sub.desc}</p>
                                    </div>
                                  </button>
                                ))}

                                {activeMegaMenuTab === 'pricing' && [
                                  { title: t('megamenu.price_starter_title', 'Starter Free Tier'), desc: t('megamenu.price_starter_desc', '1 Event, 50 Guests, HD Photos, Unlimited Downloads.'), icon: CheckCircle2, subView: 'pricing-starter' },
                                  { title: t('megamenu.price_prem_title', 'Premium Celebration'), desc: t('megamenu.price_prem_desc', 'Unlimited Guests, 4K Video, Live Screen Display & Audio.'), icon: Award, subView: 'pricing-premium' },
                                  { title: t('megamenu.price_ent_title', 'Enterprise Guild'), desc: t('megamenu.price_ent_desc', 'Custom domain, custom branding, dedicated manager.'), icon: Globe, subView: 'pricing-enterprise' },
                                  { title: t('megamenu.price_calc_title', 'Currency & Regional Calculator'), desc: t('megamenu.price_calc_desc', 'Compare rates in USD, EUR, GBP, JPY, IDR, VND, TWD.'), icon: Tag, subView: 'pricing-calculator' }
                                ].map((sub, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      navigateSubView(sub.subView);
                                    }}
                                    className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-50 transition-all flex items-start space-x-3 group cursor-pointer border border-transparent hover:border-slate-100 min-h-[44px]"
                                  >
                                    <div className="p-2 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-colors shrink-0">
                                      <sub.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-0.5">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-extrabold text-slate-950">{sub.title}</p>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <p className="text-[11px] text-slate-500 leading-tight">{sub.desc}</p>
                                    </div>
                                  </button>
                                ))}

                                {activeMegaMenuTab === 'resources' && [
                                  { title: t('megamenu.res_help_title', 'Help Center & Setup Guides'), desc: t('megamenu.res_help_desc', 'Step-by-step setup guides, QR printing & host tips.'), icon: HelpCircle, subView: 'resources-help', action: 'subView' },
                                  { title: t('megamenu.res_demo_title', 'Live Demo Gallery'), desc: t('megamenu.res_demo_desc', 'Experience guest contribution & host controls in real time.'), icon: Play, subView: 'resources-demo', action: 'demo' },
                                  { title: t('megamenu.res_supp_title', 'Contact Dedicated Support'), desc: t('megamenu.res_supp_desc', '24/7 dedicated support for peace of mind at your event.'), icon: MessageSquare, subView: 'support', action: 'subView' },
                                  { title: t('megamenu.res_rel_title', 'System Release Notes v2.4'), desc: t('megamenu.res_rel_desc', 'Discover what is new in KAVA 2026 memory capsules.'), icon: Star, subView: 'resources-release-notes', action: 'subView' }
                                ].map((sub, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      if (sub.action === 'demo') {
                                        setActiveMegaMenuTab(null);
                                        onTryDemo();
                                      } else {
                                        navigateSubView(sub.subView);
                                      }
                                    }}
                                    className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-50 transition-all flex items-start space-x-3 group cursor-pointer border border-transparent hover:border-slate-100 min-h-[44px]"
                                  >
                                    <div className="p-2 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-colors shrink-0">
                                      <sub.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-0.5">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-extrabold text-slate-950">{sub.title}</p>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <p className="text-[11px] text-slate-500 leading-tight">{sub.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Right Side: Super Admin Managed Campaign Banner Card (5 cols on lg, 1 col on md, hidden if no active campaigns) */}
                            {hasCampaigns && (
                              <div className="lg:col-span-5 md:col-span-1 pl-0 lg:pl-4 flex flex-col justify-between">
                                <SpotlightCampaignCarousel
                                  campaigns={activeCampaigns}
                                  onCloseMegaMenu={() => setActiveMegaMenuTab(null)}
                                  onTryDemo={onTryDemo}
                                  onCreateEvent={onCreateEvent}
                                />
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Mobile Navigation Drawer Overlay (Positioned Absolute) */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/94 backdrop-blur-[16px] border border-slate-200/90 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.16)] rounded-[28px] p-5 md:hidden text-left space-y-4 max-h-[80vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{t('nav.navigation_menu', 'Navigation Menu')}</span>
                    <LanguageSwitcher variant="default" />
                  </div>

                  {/* Accordion Primary Navigation Groups */}
                  <div className="space-y-2">
                    {[
                      {
                        id: 'how_it_works',
                        label: t('nav.how_it_works', 'How It Works'),
                        subView: 'how-it-works',
                        items: [
                          { title: t('megamenu.how_qr_title', 'Instant QR Guest Access'), desc: t('megamenu.how_qr_desc', 'Zero app downloads required — guests point camera & share.'), icon: QrCode, subView: 'how-it-works-qr' },
                          { title: t('megamenu.how_proj_title', 'Real-Time 4K Projection Stream'), desc: t('megamenu.how_proj_desc', 'Watch memories compile live on venue projection displays.'), icon: Tv, subView: 'how-it-works-projection' },
                          { title: t('megamenu.how_mod_title', 'Host Moderation & Privacy Controls'), desc: t('megamenu.how_mod_desc', 'Full approval workflows, guest codes, and privacy levels.'), icon: ShieldCheck, subView: 'how-it-works-moderation' },
                          { title: t('megamenu.how_vault_title', '4K Vault Lossless Archiving'), desc: t('megamenu.how_vault_desc', 'Export high-res photos, 4K videos, and audio wishes.'), icon: Download, subView: 'how-it-works-vault' }
                        ]
                      },
                      {
                        id: 'capsule_types',
                        label: t('nav.capsule_types', 'Capsule Types'),
                        subView: 'capsule-types',
                        items: [
                          { title: t('megamenu.cap_wedding_title', 'Weddings & Anniversaries'), desc: t('megamenu.cap_wedding_desc', 'Digital guestbook with audio wishes, photo stream & QR cards.'), icon: Heart, subView: 'capsule-weddings' },
                          { title: t('megamenu.cap_bday_title', 'Birthdays & Milestone Galas'), desc: t('megamenu.cap_bday_desc', 'Interactive countdowns, party voice notes & photo challenges.'), icon: Sparkles, subView: 'capsule-birthdays' },
                          { title: t('megamenu.cap_corp_title', 'Corporate & Event Galas'), desc: t('megamenu.cap_corp_desc', 'Branded event spaces, QR check-in & presenter screens.'), icon: Users, subView: 'capsule-corporate' },
                          { title: t('megamenu.cap_family_title', 'Private Family Circles'), desc: t('megamenu.cap_family_desc', 'Encrypted memory vaults for reunions & intimate gatherings.'), icon: Camera, subView: 'capsule-family' }
                        ]
                      },
                      {
                        id: 'pricing',
                        label: t('nav.pricing', 'Pricing'),
                        subView: 'pricing',
                        items: [
                          { title: t('megamenu.price_starter_title', 'Starter Free Tier'), desc: t('megamenu.price_starter_desc', '1 Event, 50 Guests, HD Photos, Unlimited Downloads.'), icon: CheckCircle2, subView: 'pricing-starter' },
                          { title: t('megamenu.price_prem_title', 'Premium Celebration'), desc: t('megamenu.price_prem_desc', 'Unlimited Guests, 4K Video, Live Screen Display & Audio.'), icon: Award, subView: 'pricing-premium' },
                          { title: t('megamenu.price_ent_title', 'Enterprise Guild'), desc: t('megamenu.price_ent_desc', 'Custom domain, custom branding, dedicated manager.'), icon: Globe, subView: 'pricing-enterprise' },
                          { title: t('megamenu.price_calc_title', 'Currency & Regional Calculator'), desc: t('megamenu.price_calc_desc', 'Compare rates in USD, EUR, GBP, JPY, IDR, VND, TWD.'), icon: Tag, subView: 'pricing-calculator' }
                        ]
                      },
                      {
                        id: 'resources',
                        label: t('nav.resources', 'Resources'),
                        subView: 'resources',
                        items: [
                          { title: t('megamenu.res_help_title', 'Help Center & Setup Guides'), desc: t('megamenu.res_help_desc', 'Step-by-step setup guides, QR printing & host tips.'), icon: HelpCircle, subView: 'resources-help', action: 'subView' },
                          { title: t('megamenu.res_demo_title', 'Live Demo Gallery'), desc: t('megamenu.res_demo_desc', 'Experience guest contribution & host controls in real time.'), icon: Play, subView: 'resources-demo', action: 'demo' },
                          { title: t('megamenu.res_supp_title', 'Contact Dedicated Support'), desc: t('megamenu.res_supp_desc', '24/7 dedicated support for peace of mind at your event.'), icon: MessageSquare, subView: 'support', action: 'subView' }
                        ]
                      }
                    ].map((navGroup) => {
                      const isExpanded = mobileAccordionTab === navGroup.id;
                      const campaign = getActiveCampaignForCategory(navGroup.id, lang);
                      return (
                        <div key={navGroup.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/60 transition-all">
                          <button
                            type="button"
                            onClick={() => setMobileAccordionTab(isExpanded ? null : navGroup.id)}
                            className="w-full px-4 py-3.5 flex items-center justify-between font-extrabold text-sm text-slate-900 cursor-pointer min-h-[48px]"
                          >
                            <span>{navGroup.label}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-950' : ''}`} />
                          </button>

                          {isExpanded && (
                            <div className="px-3 pb-3 space-y-2 border-t border-slate-200/60 pt-2 bg-white">
                              {navGroup.items.map((sub, sIdx) => (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    if (sub.action === 'demo') onTryDemo();
                                    else {
                                      navigateSubView(sub.subView);
                                    }
                                  }}
                                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-all flex items-start space-x-3 cursor-pointer min-h-[44px]"
                                >
                                  <div className="p-1.5 rounded-lg bg-slate-200 text-slate-900 shrink-0">
                                    <sub.icon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-900">{sub.title}</p>
                                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{sub.desc}</p>
                                  </div>
                                </button>
                              ))}

                              {/* Spotlight Campaign Banner inside Mobile Accordion */}
                              {campaign && (
                                <div className="mt-2 bg-slate-950 text-white rounded-xl p-3 space-y-2 text-left">
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                    <span>{t('megamenu.spotlight_campaign', 'Spotlight Campaign')}</span>
                                    {campaign.badgeText && <span className="text-amber-400 font-bold">{campaign.badgeText}</span>}
                                  </div>
                                  <p className="text-xs font-bold">{campaign.title}</p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      if (campaign.ctaAction === 'demo') onTryDemo();
                                      else if (campaign.ctaAction === 'create') onCreateEvent();
                                      else if (campaign.ctaAction === 'scroll') {
                                        const el = document.querySelector(campaign.ctaUrl || '#pricing');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }}
                                    className="w-full py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-extrabold flex items-center justify-center space-x-1 cursor-pointer min-h-[44px]"
                                  >
                                    <span>{campaign.ctaText}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Direct Mobile Links & Actions */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <button 
                      type="button"
                      onClick={() => { setIsMobileMenuOpen(false); setIsSupportModalOpen(true); }}
                      className="w-full py-3 px-4 rounded-xl text-left font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between cursor-pointer min-h-[44px]"
                    >
                      <span>{t('nav.contact_support', 'Contact Support')}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => { setIsMobileMenuOpen(false); onTryDemo(); }}
                        className="w-full py-3 bg-slate-100 text-slate-900 font-extrabold text-xs rounded-full hover:bg-slate-200 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
                      >
                        {t('nav.explore_demo', 'Explore Demo')}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsMobileMenuOpen(false); onCreateEvent(); }}
                        className="w-full py-3 bg-slate-950 text-white font-extrabold text-xs rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer min-h-[44px]"
                      >
                        <span>{t('nav.create_capsule', 'Create Capsule')}</span>
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

      {/* Conditional Destination SubView vs Home Landing Page Content */}
      {landingSubView !== 'home' ? (
        <main className="w-full flex-1 min-h-[60vh]">
          {landingSubView.startsWith('how-it-works') && (
            <HowItWorksPage
              initialStep={
                landingSubView === 'how-it-works-qr' ? 1 :
                landingSubView === 'how-it-works-projection' ? 2 :
                landingSubView === 'how-it-works-moderation' ? 3 :
                landingSubView === 'how-it-works-vault' ? 4 : 1
              }
              onBackToHome={() => navigateSubView('home')}
              onCreateEvent={onCreateEvent}
              onTryDemo={onTryDemo}
              onNavigateSubView={navigateSubView}
            />
          )}

          {(landingSubView.startsWith('capsule') || landingSubView === 'capsule_types') && (
            <CapsuleTypesPage
              initialType={
                landingSubView === 'capsule-birthdays' ? 'birthdays' :
                landingSubView === 'capsule-corporate' ? 'corporate' :
                landingSubView === 'capsule-family' ? 'family' : 'weddings'
              }
              onBackToHome={() => navigateSubView('home')}
              onCreateEvent={onCreateEvent}
              onTryDemo={onTryDemo}
              onNavigateSubView={navigateSubView}
            />
          )}

          {landingSubView.startsWith('pricing') && (
            <PricingPage
              initialPlan={
                landingSubView === 'pricing-starter' ? 'starter' :
                landingSubView === 'pricing-enterprise' ? 'enterprise' : 'premium'
              }
              onBackToHome={() => navigateSubView('home')}
              onCreateEvent={onCreateEvent}
              onOpenCheckout={onOpenCheckout}
              onNavigateSubView={navigateSubView}
            />
          )}

          {landingSubView.startsWith('resources') && (
            <ResourcesPage
              initialTab={
                landingSubView === 'resources-demo' ? 'demo' :
                landingSubView === 'resources-release-notes' ? 'release-notes' :
                landingSubView === 'resources-templates' ? 'templates' : 'guides'
              }
              onBackToHome={() => navigateSubView('home')}
              onCreateEvent={onCreateEvent}
              onTryDemo={onTryDemo}
              onNavigateSubView={navigateSubView}
            />
          )}

          {landingSubView === 'support' && (
            <ContactSupportPage
              onBackToHome={() => navigateSubView('home')}
              onCreateEvent={onCreateEvent}
              onNavigateSubView={navigateSubView}
            />
          )}

          {['privacy', 'terms', 'trust-safety', 'about'].includes(landingSubView) && (
            <LegalPage
              initialSubView={landingSubView as any}
              onBackToHome={() => navigateSubView('home')}
              onCreateEvent={onCreateEvent}
            />
          )}
        </main>
      ) : (
        <>
          {/* Dedicated High-Craft Interactive Hero Section & Feature Cards */}
          <HeroSection
            onCreateEvent={onCreateEvent}
            onEnterCode={onEnterCode}
            onOpenQrScanner={onOpenQrScanner}
            isVerifying={isVerifying}
            onTryDemo={onTryDemo}
            events={events}
          />

      {/* Problem & Solution Section — Modern Side-by-Side Comparison */}
      <section className="bg-white border-t border-slate-100 py-24 sm:py-28 px-4 sm:px-6 relative overflow-hidden" id="how-it-works">
        <div className="max-w-6xl mx-auto space-y-14 relative z-10">
          
          {/* Section Headers */}
          <div className="text-center max-w-2xl mx-auto space-y-3.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('how_it_works.problem_label', 'The Memory Crisis')}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B132B] font-sans leading-tight">
              {t('how_it_works.problem_title', 'Why traditional folders destroy human stories.')}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed max-w-lg mx-auto">
              {t('how_it_works.problem_subtitle', 'Group chat compression and corporate storage links turn authentic human laughter into silent, forgotten files.')}
            </p>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* LEFT SIDE: Traditional Way (Visually Muted Light Off-White Card) */}
            <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/70 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-2xs">
                    {t('how_it_works.traditional_way', 'Traditional Way')}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500">
                    <X className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0B132B] font-sans">
                    {t('how_it_works.old_way_title', 'The Old Way: Cold storage')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mt-1">
                    {t('how_it_works.old_way_desc', 'Nameless file directories where authentic moments turn into digital dust.')}
                  </p>
                </div>

                <div className="pt-3 space-y-3 border-t border-slate-200/60 text-xs font-medium text-slate-600">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✕</span>
                    <span>{t('how_it_works.old_way_bullet1', 'Frustrating app downloads & account sign-ins')}</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✕</span>
                    <span>{t('how_it_works.old_way_bullet2', 'Cold file names devoid of laughter or written emotion')}</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✕</span>
                    <span>{t('how_it_works.old_way_bullet3', 'Grainy compression destroys original photo & video resolution')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/70 rounded-2xl p-3 text-[11px] font-mono text-slate-400 flex items-center justify-between shadow-2xs">
                <span>IMG_4819.CR2 • 2.1MB</span>
                <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded text-[10px]">{t('how_it_works.unsorted', 'Unsorted')}</span>
              </div>
            </div>

            {/* RIGHT SIDE: The KAVA Way (Midnight Navy + Mint Accents) */}
            <div className="lg:col-span-7 bg-[#0B132B] text-white border border-slate-800 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left relative overflow-hidden shadow-xl">
              
              {/* Subtle Mint Glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#00A88F]/15 blur-3xl pointer-events-none rounded-full" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00A88F] bg-[#00A88F]/15 border border-[#00A88F]/30 px-3 py-1 rounded-full shadow-2xs">
                    {t('how_it_works.kava_standard', 'The KAVA Standard')}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#00A88F] animate-pulse" />
                    <span>{t('hero.capsule_active', 'Active Capsule')}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight">
                    {t('how_it_works.kava_way_title', 'The KAVA Way: Active Preservation')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mt-1">
                    {t('how_it_works.kava_way_desc', 'An interactive memory capsule where photos, voice wishes, and heartfelt notes live together.')}
                  </p>
                </div>

                {/* Embedded Mini Supporting Visual Illustration */}
                <div className="bg-slate-900/90 border border-slate-700/60 rounded-2xl p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#00A88F] text-[#0B132B] flex items-center justify-center font-bold text-[10px]">
                        ★
                      </div>
                      <span className="text-xs font-bold text-white">{t('how_it_works.sample_reception', "Sofia & Leo's Reception")}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#00A88F] bg-[#00A88F]/15 border border-[#00A88F]/30 px-2 py-0.5 rounded-full">
                      {t('how_it_works.zero_downloads', 'Zero Downloads')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl flex items-center space-x-2 border border-slate-700/50">
                      <Camera className="w-3.5 h-3.5 text-[#00A88F] shrink-0" />
                      <span className="truncate">{t('how_it_works.raw_resolution', 'RAW Resolution')}</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl flex items-center space-x-2 border border-slate-700/50">
                      <Mic className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{t('how_it_works.spoken_voicemail', 'Spoken Voicemail')}</span>
                    </div>
                  </div>
                </div>

                {/* 3 Key Benefits */}
                <div className="pt-2 space-y-2.5 text-xs sm:text-sm font-medium text-slate-200">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00A88F] shrink-0" />
                    <span>{t('how_it_works.kava_bullet1', 'Zero download mobile web flow (iOS & Android)')}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00A88F] shrink-0" />
                    <span>{t('how_it_works.kava_bullet2', 'Photos, HD Videos, Spoken Voicemails & Heartfelt Wishes')}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00A88F] shrink-0" />
                    <span>{t('how_it_works.kava_bullet3', 'Live venue screen presentation for TVs and Projectors')}</span>
                  </div>
                </div>
              </div>

              {/* Single CTA Button */}
              <div className="pt-2 relative z-10">
                <button
                  type="button"
                  onClick={onTryDemo}
                  className="w-full sm:w-auto bg-[#00A88F] hover:bg-[#00937d] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  id="btn-kava-demo-comparison"
                >
                  <span>{t('how_it_works.see_live_demo', 'See Live Demo')}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Visual Step-by-Step Flow — The Guest Blueprint */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-slate-50/60 border-t border-slate-100 relative overflow-hidden" id="blueprint">
        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-14 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1.5 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('how_it_works.blueprint_label', 'THE GUEST BLUEPRINT')}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B132B] font-sans leading-tight">
              {t('how_it_works.blueprint_title', 'How simple it actually is.')}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed max-w-lg mx-auto">
              {t('how_it_works.blueprint_desc', 'Three effortless steps from venue setup to preserving raw memories forever.')}
            </p>
          </div>

          {/* 2-Column Composition: Steps (Left ~55%) + Live Preview Proof (Right ~45%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-5xl mx-auto">
            
            {/* LEFT COLUMN: 3 Compact Stepper Cards */}
            <div className="lg:col-span-7 space-y-3.5">

              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setActiveTimelineStep(1)}
                className={`w-full text-left p-4 sm:p-5 rounded-[24px] transition-all duration-200 cursor-pointer flex items-center space-x-4 border ${
                  activeTimelineStep === 1
                    ? 'bg-white border-[#00A88F]/40 shadow-sm ring-2 ring-[#00A88F]/15'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                  activeTimelineStep === 1
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                }`}>
                  01
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#0B132B] font-sans">
                    {t('how_it_works.step1_title', 'Host Creates Capsule')}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {t('how_it_works.step1_desc', 'Set up your event in 60 seconds and generate your custom venue QR poster.')}
                  </p>
                </div>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => setActiveTimelineStep(2)}
                className={`w-full text-left p-4 sm:p-5 rounded-[24px] transition-all duration-200 cursor-pointer flex items-center space-x-4 border ${
                  activeTimelineStep === 2
                    ? 'bg-white border-[#00A88F]/40 shadow-sm ring-2 ring-[#00A88F]/15'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                  activeTimelineStep === 2
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                }`}>
                  02
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#0B132B] font-sans">
                    {t('how_it_works.step2_title', 'Guests Scan & Contribute')}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {t('how_it_works.step2_desc', 'Guests point their phone camera, take photos, or speak voice wishes with zero app downloads.')}
                  </p>
                </div>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => setActiveTimelineStep(3)}
                className={`w-full text-left p-4 sm:p-5 rounded-[24px] transition-all duration-200 cursor-pointer flex items-center space-x-4 border ${
                  activeTimelineStep === 3
                    ? 'bg-white border-[#00A88F]/40 shadow-sm ring-2 ring-[#00A88F]/15'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                  activeTimelineStep === 3
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                }`}>
                  03
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#0B132B] font-sans">
                    {t('how_it_works.step3_title', 'Relive Forever Together')}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {t('how_it_works.step3_desc', 'Contributions appear live on venue screens and save automatically in original quality.')}
                  </p>
                </div>
              </button>

            </div>

            {/* RIGHT COLUMN: Live Venue Screen / Memory Vault Preview Proof */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-7 shadow-sm flex flex-col justify-center overflow-hidden relative min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTimelineStep === 1 && (
                  <motion.div
                    key="step-1-preview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="w-full space-y-4 text-left"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00A88F]" />
                        <span className="text-xs font-mono font-bold text-[#0B132B]">{t('how_it_works.sample_sofia_created', 'SOFIA-LEO Capsule Created')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{t('how_it_works.step1_proof', 'Step 1 Proof')}</span>
                    </div>

                    <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#0B132B]">{t('hero.sample_wedding_title', "Sofia & Leo's Wedding")}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{t('how_it_works.sample_sofia_code', 'Code: SOFIA-LEO • Big Sur, CA')}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <QrCode className="w-7 h-7 text-[#0B132B]" />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onCreateEvent}
                        className="w-full bg-[#0B132B] hover:bg-slate-900 text-white text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px] shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#00A88F]" />
                        <span>{t('how_it_works.print_qr_stand', 'Print QR Table Stand')}</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTimelineStep === 2 && (
                  <motion.div
                    key="step-2-preview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="w-full space-y-4 text-left"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-[#00A88F]" />
                        <span className="text-xs font-mono font-bold text-[#0B132B]">{t('how_it_works.guest_browser', 'Guest Browser • Zero Download')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{t('how_it_works.step2_proof', 'Step 2 Proof')}</span>
                    </div>

                    <div className="bg-[#0B132B] text-white rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>kava.app/sofia-leo</span>
                        <span className="text-[#00A88F] font-bold">● {t('how_it_works.connected', 'Connected')}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <button
                          type="button"
                          onClick={onTryDemo}
                          className="bg-slate-800/90 hover:bg-slate-800 text-white p-3 rounded-xl font-bold flex flex-col items-center justify-center space-y-1.5 transition-colors cursor-pointer border border-slate-700/60"
                        >
                          <Camera className="w-4 h-4 text-[#00A88F]" />
                          <span>{t('how_it_works.take_photo', 'Take Photo')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={onTryDemo}
                          className="bg-slate-800/90 hover:bg-slate-800 text-white p-3 rounded-xl font-bold flex flex-col items-center justify-center space-y-1.5 transition-colors cursor-pointer border border-slate-700/60"
                        >
                          <Mic className="w-4 h-4 text-rose-400" />
                          <span>{t('how_it_works.voice_wish', 'Voice Wish')}</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-400 font-mono text-center">
                        {t('how_it_works.instant_upload_desc', 'Instant upload in full original resolution')}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTimelineStep === 3 && (
                  <motion.div
                    key="step-3-preview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full space-y-4 text-left"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <Tv className="w-4 h-4 text-[#00A88F]" />
                        <span className="text-xs font-mono font-bold text-[#0B132B]">{t('how_it_works.live_screen_vault', 'Live Venue Screen & Memory Vault')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{t('how_it_works.step3_proof', 'Step 3 Proof')}</span>
                    </div>

                    <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0B132B]">84 {t('hero.live_contributions', 'Live Contributions')}</span>
                        <span className="text-[10px] font-mono font-bold text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-2.5 py-0.5 rounded-full">
                          {t('how_it_works.sync_active', 'Sync Active')}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 flex items-center space-x-3 text-xs shadow-2xs">
                        <div className="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          ES
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0B132B] truncate">{t('how_it_works.emma_photo_uploaded', 'Emma Stone uploaded photo')}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{t('how_it_works.original_quality_meta', '1m ago • Original Quality')}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onTryDemo}
                        className="w-full bg-[#0B132B] hover:bg-slate-900 text-white text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center justify-center shadow-xs"
                      >
                        {t('how_it_works.enter_memory_vault', 'Enter Interactive Memory Vault')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Memory Types Section */}
      <section className="bg-white border-y border-slate-100 py-24 sm:py-28 px-4 sm:px-6" id="memory-types">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Explanations and selectors */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="space-y-3.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#00A88F]" />
                  <span>{t('memory_types.badge', 'No More Silent Images')}</span>
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B132B] font-sans leading-tight">
                  {t('memory_types.title', 'Preserve the full sensory spectrum.')}
                </h2>
                <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
                  {t('memory_types.desc', "A wedding isn't just photos. It's the crackle of laughter, the heavy sigh of deep emotion, the written confessions of friends, and the high-energy video dancing.")}
                </p>
              </div>

              {/* Selector Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  type="button"
                  onClick={() => setActiveMemoryType('photo')}
                  className={`flex items-center space-x-4 p-4 sm:p-4.5 rounded-[22px] text-left border transition-all cursor-pointer ${
                    activeMemoryType === 'photo' 
                      ? 'bg-[#0B132B] border-[#0B132B] text-white shadow-md' 
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${activeMemoryType === 'photo' ? 'bg-[#00A88F] text-white' : 'bg-white text-[#0B132B] border border-slate-200/60 shadow-2xs'}`}>
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">{t('memory_types.photos_title', 'Photos & Polaroids')}</h4>
                    <p className={`text-xs ${activeMemoryType === 'photo' ? 'text-slate-300' : 'text-slate-500'} font-normal mt-0.5`}>{t('memory_types.photos_desc', 'Original quality raw pictures, without social media filters or compression.')}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMemoryType('video')}
                  className={`flex items-center space-x-4 p-4 sm:p-4.5 rounded-[22px] text-left border transition-all cursor-pointer ${
                    activeMemoryType === 'video' 
                      ? 'bg-[#0B132B] border-[#0B132B] text-white shadow-md' 
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${activeMemoryType === 'video' ? 'bg-[#00A88F] text-white' : 'bg-white text-[#0B132B] border border-slate-200/60 shadow-2xs'}`}>
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">{t('memory_types.videos_title', 'High-Resolution Videos')}</h4>
                    <p className={`text-xs ${activeMemoryType === 'video' ? 'text-slate-300' : 'text-slate-500'} font-normal mt-0.5`}>{t('memory_types.videos_desc', 'Candid moments in motion. Ideal for toast snippets, sparklers, and dances.')}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMemoryType('voice')}
                  className={`flex items-center space-x-4 p-4 sm:p-4.5 rounded-[22px] text-left border transition-all cursor-pointer ${
                    activeMemoryType === 'voice' 
                      ? 'bg-[#0B132B] border-[#0B132B] text-white shadow-md' 
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${activeMemoryType === 'voice' ? 'bg-[#00A88F] text-white' : 'bg-white text-[#0B132B] border border-slate-200/60 shadow-2xs'}`}>
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">{t('memory_types.voice_title', 'Spoken Voice Messages')}</h4>
                    <p className={`text-xs ${activeMemoryType === 'voice' ? 'text-slate-300' : 'text-slate-500'} font-normal mt-0.5`}>{t('memory_types.voice_desc', 'A voicemail for the couple, recorded via the mobile browser. Kept forever.')}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMemoryType('wish')}
                  className={`flex items-center space-x-4 p-4 sm:p-4.5 rounded-[22px] text-left border transition-all cursor-pointer ${
                    activeMemoryType === 'wish' 
                      ? 'bg-[#0B132B] border-[#0B132B] text-white shadow-md' 
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${activeMemoryType === 'wish' ? 'bg-[#00A88F] text-white' : 'bg-white text-[#0B132B] border border-slate-200/60 shadow-2xs'}`}>
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">{t('memory_types.wishes_title', 'Heartfelt Wishes')}</h4>
                    <p className={`text-xs ${activeMemoryType === 'wish' ? 'text-slate-300' : 'text-slate-500'} font-normal mt-0.5`}>{t('memory_types.wishes_desc', 'A modern, elegant digital guestbook where friends write real long stories.')}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Live Mock Preview of the chosen type */}
            <div className="lg:col-span-6 bg-slate-50/90 border border-slate-200/80 rounded-[32px] p-6 sm:p-10 flex items-center justify-center min-h-[420px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A88F]/10 blur-3xl pointer-events-none rounded-full" />
              
              {activeMemoryType === 'photo' && (
                <div className="space-y-4 max-w-sm w-full bg-white p-4.5 rounded-[24px] border border-slate-200/80 shadow-sm relative z-10">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80" 
                      alt="Laughing wedding" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#00A88F]/15 text-[#00A88F] font-bold text-xs flex items-center justify-center">E</div>
                      <span className="text-xs font-bold text-[#0B132B]">{t('hero.sample_guest_emma', 'Emma Stone')}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-2 py-0.5 rounded-full font-bold">{t('memory_types.raw_12mb', 'RAW • 12MB')}</span>
                  </div>
                </div>
              )}

              {activeMemoryType === 'video' && (
                <div className="space-y-4 max-w-sm w-full bg-white p-4.5 rounded-[24px] border border-slate-200/80 shadow-sm relative z-10">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#0B132B] relative flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80" 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/95 text-[#0B132B] backdrop-blur-sm flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all">
                        <div className="w-0 h-0 border-y-8 border-y-transparent border-l-14 border-l-[#0B132B] ml-1"></div>
                      </div>
                    </div>
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold">0:15</span>
                  </div>
                  <div className="flex items-center justify-between text-left pt-1">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">L</div>
                      <span className="text-xs font-bold text-[#0B132B]">{t('memory_types.lucas_gray', 'Lucas Gray')}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">MP4 • 1080P</span>
                  </div>
                </div>
              )}

              {activeMemoryType === 'wish' && (
                <div className="max-w-sm w-full bg-white p-7 rounded-[28px] border border-slate-200/80 shadow-sm space-y-4 text-center relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-xl shadow-2xs border border-rose-100">
                    ❤
                  </div>
                  <blockquote className="text-[#0B132B] text-sm sm:text-base font-medium italic leading-relaxed">
                    {t('memory_types.wish_quote', '"Hearing your vows today made me believe in true destiny. You looked at each other like there was no one else in the room."')}
                  </blockquote>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-[#0B132B]">{t('memory_types.sarah_jenkins', 'Sarah Jenkins')}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t('memory_types.sent_at_612', 'Sent at 6:12 PM')}</p>
                  </div>
                </div>
              )}

              {activeMemoryType === 'voice' && (
                <div className="max-w-sm w-full bg-[#0B132B] text-white p-6 sm:p-7 rounded-[28px] shadow-md space-y-5 text-left relative z-10 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00A88F] bg-[#00A88F]/15 border border-[#00A88F]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">{t('memory_types.spoken_wish_badge', 'Spoken Wish')}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{t('memory_types.042_mins', '0:42 mins')}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button type="button" className="w-12 h-12 rounded-2xl bg-[#00A88F] hover:bg-[#00937d] text-white flex items-center justify-center hover:scale-105 transition-all shadow-sm cursor-pointer shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{t('hero.sample_guest_marcus', 'Uncle Marcus')}</p>
                      {/* Waveform graphic */}
                      <div className="flex items-end space-x-0.5 h-6">
                        {[0.6, 0.3, 0.8, 0.5, 0.9, 0.4, 0.7, 0.2, 0.6, 0.8, 0.3, 0.5, 0.9, 0.7, 0.4, 0.8].map((val, i) => (
                          <div 
                            key={i} 
                            style={{ height: `${val * 100}%` }} 
                            className="bg-[#00A88F] w-1 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-[11px] text-slate-300 font-normal leading-relaxed shadow-inner">
                    {t('memory_types.voice_quote', '"Sofia, Leo... I\'m speaking from the lounge. Sofia, you look exactly like your grandmother did... We are so proud of you."')}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* The Live Experience Highlight */}
      <section className="py-24 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto" id="live-stage">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Live Experience Workspace Product Preview */}
          <div className="order-2 lg:order-1 relative">
            {/* Subtle Mint Glow behind card */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#00A88F]/15 via-indigo-500/10 to-[#00A88F]/10 rounded-[38px] blur-2xl opacity-70 pointer-events-none" />

            <div className="bg-[#0B132B] rounded-[32px] p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-slate-800 flex flex-col justify-between min-h-[440px] sm:min-h-[480px]">
              
              {/* Header Bar */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A88F] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A88F]" />
                  </span>
                  <span className="font-bold tracking-wider text-[#00A88F] uppercase text-[10px] sm:text-xs">
                    {t('live_wall.workspace_label', 'LIVE EXPERIENCE WORKSPACE')}
                  </span>
                  <span className="hidden sm:inline-block bg-white/10 text-white/70 px-2 py-0.5 rounded text-[9px] font-mono">
                    60 FPS • LIVE
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="bg-[#00A88F]/15 text-[#00A88F] border border-[#00A88F]/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase">
                    {activeLiveEvent.code || 'SOFIA-LEO'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 hidden xs:inline">
                    {activeLiveContributions.length} {activeLiveContributions.length === 1 ? 'Memory' : 'Memories'}
                  </span>
                </div>
              </div>

              {/* Dynamic Live Stage Grid showing Photo, Wish, Voice Note Cards */}
              <div className="relative z-10 my-5 flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Photo Memory Card */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900/90 border border-white/10 group shadow-lg flex flex-col justify-end min-h-[160px] sm:min-h-[200px]">
                  {photoContribution && !failedImages[photoContribution.id] ? (
                    <img 
                      src={photoContribution.url || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'} 
                      alt={photoContribution.contributorName || 'Photo Memory'} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(photoContribution.id)}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center p-4 text-center">
                      <Camera className="w-7 h-7 text-[#00A88F] mb-2" />
                      <span className="text-[10px] font-bold text-white">Photo Memory</span>
                      <span className="text-[9px] text-white/60">{photoContribution?.contributorName || 'Emma Stone'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                  <div className="relative z-10 p-3 text-left">
                    <div className="flex items-center justify-between text-white text-[9px] font-bold mb-0.5">
                      <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        {photoContribution?.contributorName || 'Emma Stone'}
                      </span>
                      <span className="text-[#00A88F] font-mono text-[8px] bg-[#00A88F]/20 px-1.5 py-0.5 rounded border border-[#00A88F]/40 font-bold">
                        Photo
                      </span>
                    </div>
                    {photoContribution?.text && (
                      <p className="text-[9px] text-slate-200 line-clamp-2 italic mt-1 font-light leading-snug">
                        "{photoContribution.text}"
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Written Wish Note Card */}
                <div className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between text-left shadow-lg relative overflow-hidden group min-h-[160px] sm:min-h-[200px]">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/30">
                        Wish Note
                      </span>
                      <Quote className="w-3.5 h-3.5 text-amber-400/60" />
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-200 line-clamp-4 italic font-light leading-relaxed">
                      "{wishContribution?.text || 'Dearest Sofia & Leo, hearing your vows today made me believe in true destiny. We love you both so much!'}"
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px]">
                    <span className="font-bold text-slate-300">
                      — {wishContribution?.contributorName || 'Sarah Jenkins'}
                    </span>
                    <span className="text-slate-500 font-mono text-[8px]">Live Wish</span>
                  </div>
                </div>

                {/* 3. Voice Recording / Audio Card */}
                <div className="bg-gradient-to-br from-indigo-950/90 to-slate-900/90 border border-indigo-500/20 p-3.5 rounded-2xl flex flex-col justify-between text-left shadow-lg relative overflow-hidden group min-h-[160px] sm:min-h-[200px]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-400/30 flex items-center gap-1">
                        <Mic className="w-2.5 h-2.5 text-indigo-300 animate-pulse" />
                        Voice Note
                      </span>
                      <span className="text-[9px] font-mono text-indigo-300 font-semibold bg-black/40 px-1.5 py-0.5 rounded">
                        {voiceContribution?.audioDuration || '0:42'}
                      </span>
                    </div>
                    
                    {/* Audio Waveform Visualization */}
                    <div className="my-2 bg-black/30 p-2 rounded-xl border border-white/5 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#00A88F] text-white flex items-center justify-center shrink-0">
                        <Volume2 className="w-3 h-3 animate-bounce" />
                      </div>
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[40, 70, 30, 90, 60, 100, 45, 80, 65, 30, 85, 50, 75, 40, 90, 60].map((h, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-[#00A88F] rounded-full transition-all duration-300" 
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-300 line-clamp-2 italic font-light">
                      "{voiceContribution?.text || 'Sofia, Leo... speaking from the lounge. We are so proud of you both!'}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px]">
                    <span className="font-bold text-slate-300">
                      — {voiceContribution?.contributorName || 'Uncle Marcus'}
                    </span>
                    <span className="text-[#00A88F] font-mono text-[8px] flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A88F] animate-ping" />
                      Audio Live
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Glassmorphic QR Join Dock */}
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl border border-white/15 p-3.5 rounded-2xl flex items-center justify-between text-left shadow-2xl gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white p-1 rounded-xl shadow-md flex items-center justify-center shrink-0 border border-slate-200">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(guestJoinUrl)}&size=150x150&format=svg`}
                      alt="Guest QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent && !parent.querySelector('.fallback-qr')) {
                          const icon = document.createElement('div');
                          icon.className = 'fallback-qr text-[#0B132B] font-bold text-[10px] text-center font-mono';
                          icon.innerText = 'QR';
                          parent.appendChild(icon);
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-white text-xs sm:text-sm font-bold leading-tight truncate">
                      {t('live_wall.scan_to_contribute', 'Scan to Contribute')}
                    </h5>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-mono mt-0.5 truncate">
                      No app download required • Code: <span className="text-[#00A88F] font-bold">{activeLiveEvent.code || 'SOFIA-LEO'}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchLiveDemo}
                  className="bg-white hover:bg-slate-100 text-[#0B132B] text-[10px] sm:text-xs font-mono font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl uppercase tracking-wider shrink-0 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>kava.app/join</span>
                  <ExternalLink className="w-3 h-3 text-[#0B132B]" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Copy & Feature Points */}
          <div className="order-1 lg:order-2 space-y-6 text-left">
            <span className="inline-flex items-center space-x-2 bg-[#00A88F]/10 border border-[#00A88F]/20 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#00A88F] shadow-2xs">
              <Tv className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('live_wall.stage_mode', 'Live Stage Mode')}</span>
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B132B] leading-tight font-sans">
              {t('live_wall.title', 'An interactive wall for TVs and Projectors.')}
            </h2>

            <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
              {t('live_wall.desc', 'Open the Live Screen on any smart TV or projector during your wedding or birthday. Watch guest photos and heartwarming messages fill the room in real-time, sparking conversation and warmth among the crowd.')}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-[#00A88F] shrink-0 mt-0.5" />
                <span className="leading-normal">
                  <strong className="font-bold text-[#0B132B]">{t('live_wall.wish_wall_label', 'Wish Wall:')}</strong>{' '}
                  {t('live_wall.wish_wall_desc', 'Alternates rotating wishes with stunning guest captures.')}
                </span>
              </div>
              
              <div className="flex items-start space-x-3.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-[#00A88F] shrink-0 mt-0.5" />
                <span className="leading-normal">
                  <strong className="font-bold text-[#0B132B]">{t('live_wall.qr_overlay_label', 'Live QR Join Overlay:')}</strong>{' '}
                  {t('live_wall.qr_overlay_desc', 'Always keeps the QR code readable and docked.')}
                </span>
              </div>

              <div className="flex items-start space-x-3.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-[#00A88F] shrink-0 mt-0.5" />
                <span className="leading-normal">
                  <strong className="font-bold text-[#0B132B]">{t('live_wall.host_moderation_label', 'Host Moderation:')}</strong>{' '}
                  {t('live_wall.host_moderation_desc', 'Approve memories from your phone before they hit the big screen.')}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="button"
                onClick={handleLaunchLiveDemo}
                className="bg-[#0B132B] hover:bg-slate-900 text-white px-7 py-3.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-xl inline-flex items-center space-x-2.5 cursor-pointer group"
                id="btn-live-wall-demo"
              >
                <span>{t('live_wall.launch_demo', 'Launch Live Experience Demo')}</span>
                <Tv className="w-4 h-4 text-[#00A88F] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Bento Grid Highlights */}
      <section className="bg-white border-y border-slate-100 py-24 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('features.section_label', 'Fine Crafted Features')}</span>
            </span>
            <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B132B]">{t('features.section_title', 'Everything is built premium.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Item 1 */}
            <div className="bg-slate-50/80 border border-slate-200/70 p-8 rounded-[28px] text-left space-y-4 shadow-xs hover:border-[#00A88F]/40 transition-all hover:bg-white">
              <div className="w-12 h-12 rounded-2xl bg-[#00A88F]/15 border border-[#00A88F]/25 flex items-center justify-center text-[#00A88F] shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-[#0B132B]">{t('features.moderation_title', 'Full Moderation Control')}</h4>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {t('features.moderation_desc', 'Approve or reject guest photos, messages, and voice recordings on the fly from your host phone before showing them on the TV projector wall.')}
              </p>
            </div>

            {/* Item 2 */}
            <div className="bg-slate-50/80 border border-slate-200/70 p-8 rounded-[28px] text-left space-y-4 shadow-xs hover:border-[#0284C7]/40 transition-all hover:bg-white">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shadow-2xs">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-[#0B132B]">{t('features.downloads_title', 'Original Quality Downloads')}</h4>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {t('features.downloads_desc', 'No downscaled images. Download your entire Memory Capsule in original uncompressed, high-fidelity files anytime in one massive ZIP archive.')}
              </p>
            </div>

            {/* Item 3 */}
            <div className="bg-slate-50/80 border border-slate-200/70 p-8 rounded-[28px] text-left space-y-4 shadow-xs hover:border-purple-300 transition-all hover:bg-white">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-[#0B132B]">{t('features.poster_title', 'Automatic Custom Poster')}</h4>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {t('features.poster_desc', "Instantly download ready-to-print luxury tabletop posters embedded with your Capsule's unique QR code, styled for minimal wedding tables.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — Apple-Inspired Minimalist Story Showcase */}
      <section className="bg-white py-20 sm:py-24 px-4 sm:px-6 relative border-t border-slate-100" id="testimonials">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('testimonials.badge', 'Host Stories')}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B132B] font-sans leading-tight">
              {t('testimonials.title', 'Preserved in Their Own Words.')}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed max-w-lg mx-auto">
              {t('testimonials.subtitle', 'Real hosts and wedding couples share how KAVA captured candid unscripted moments seamlessly.')}
            </p>
          </div>

          {/* BALANCED TWO-COLUMN FEATURED TESTIMONIAL */}
          {selectedTestimonial && (
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-[28px] p-6 sm:p-10 transition-all duration-300 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTestimonial.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  {/* LEFT COLUMN: Host Details, Rating, Short Quote */}
                  <div className="lg:col-span-6 space-y-5 text-left flex flex-col justify-center">
                    
                    {/* Rating & Event Category Pill */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(selectedTestimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-mono font-bold text-[#00A88F] uppercase tracking-wider bg-[#00A88F]/10 border border-[#00A88F]/20 px-3 py-1 rounded-full shadow-2xs">
                        {selectedTestimonial.eventCategory || 'Wedding'}
                      </span>
                    </div>

                    {/* Short Testimonial Quote */}
                    <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic text-[#0B132B] leading-relaxed tracking-tight">
                      "{selectedTestimonial.quote}"
                    </blockquote>

                    {/* Host Name & Event Title */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-[#0B132B] font-sans">
                          {selectedTestimonial.hostName}
                        </h3>
                        <p className="text-xs font-medium text-slate-500">
                          {selectedTestimonial.eventTitle}
                        </p>
                      </div>
                      {selectedTestimonial.isFeatured && (
                        <span className="bg-[#0B132B] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
                          {t('testimonials.featured_story', 'Featured Story')}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Large Cover Photo or Video Thumbnail with subtle rounded corners */}
                  <div className="lg:col-span-6">
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-[24px] overflow-hidden bg-slate-200 border border-slate-200/80 shadow-xs group">
                      {selectedTestimonial.videos && selectedTestimonial.videos.length > 0 && selectedTestimonial.mediaPriority === 'videos' ? (
                        <div className="w-full h-full relative bg-[#0B132B] flex items-center justify-center">
                          <img
                            src={selectedTestimonial.videos[0].thumbnail || selectedTestimonial.coverImage}
                            alt={selectedTestimonial.eventTitle}
                            className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/95 text-[#0B132B] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                              <Play className="w-6 h-6 fill-[#0B132B] ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={selectedTestimonial.coverImage}
                          alt={selectedTestimonial.eventTitle}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ objectPosition: `center ${selectedTestimonial.coverPosition !== undefined ? selectedTestimonial.coverPosition : 50}%` }}
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* HORIZONTALLY SCROLLABLE CAROUSEL OF COMPACT TESTIMONIAL CARDS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                {t('testimonials.memory_vaults_count', 'Host Memory Vaults ({count})', { count: publishedList.length })}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('testimonials-carousel');
                    if (el) el.scrollBy({ left: -280, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('testimonials-carousel');
                    if (el) el.scrollBy({ left: 280, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              id="testimonials-carousel"
              className="flex items-stretch space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth"
            >
              {publishedList.map((item) => {
                const isSelected = item.id === selectedTestimonial?.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedTestimonialId(item.id);
                      setActivePhotoIndex(0);
                    }}
                    className={`w-[240px] shrink-0 border rounded-[22px] p-3 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#00A88F]/50 ring-2 ring-[#00A88F]/20 bg-white shadow-md'
                        : 'border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] w-full rounded-[16px] overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.coverImage}
                        alt={item.eventTitle}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Event Title, Host Name & Rating */}
                    <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-[#0B132B] truncate">
                          {item.eventTitle}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 truncate">
                          {item.hostName}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 pt-2 border-t border-slate-100">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-[10px] font-mono font-bold text-slate-500 ml-1">
                          {(item.rating || 5).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* THREE MINIMAL INLINE TRUST INDICATORS */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-center">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-600 text-xs sm:text-sm font-sans">
              <div className="flex items-center space-x-2">
                <span className="font-black text-[#0B132B] text-base sm:text-lg">
                  {activeStats?.eventsCreated || '12K+'}
                </span>
                <span className="text-slate-500 font-medium">{t('testimonials.events_hosted', 'Events Hosted')}</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="flex items-center space-x-2">
                <span className="font-black text-[#0B132B] text-base sm:text-lg">
                  {activeStats?.guestPhotosUploaded || '1.4M'}
                </span>
                <span className="text-slate-500 font-medium">{t('testimonials.photos_preserved', 'Photos Preserved')}</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-amber-400 mr-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="font-black text-[#0B132B] text-base sm:text-lg">
                  {activeStats?.averageRating || '4.98'} / 5.0
                </span>
                <span className="text-slate-500 font-medium">{t('testimonials.host_rating', 'Host Rating')}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Pricing Section */}
      <section className="bg-slate-50/60 border-y border-slate-100 py-24 px-4 sm:px-6 w-full overflow-x-hidden relative" id="pricing">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          
          {/* Header & Title - Polished, Centered, Editorial Rhythm */}
          <div className="max-w-2xl mx-auto space-y-3.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00A88F]" />
              <span>{t('pricing.label', 'Transparent Pricing')}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B132B] font-sans leading-tight">
              {t('pricing.title', 'Honest Plans for Every Memory Capsule')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-lg mx-auto">
              {t('pricing.subtitle', 'Zero hidden fees. Unlimited guest uploads and lifetime memory hosting included across all plans.')}
            </p>
          </div>

          {/* Unified Centered Toolbar: Promotion Banner + Billing Cycle Switch + Currency Selector */}
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Collapsible Active Promo Banner */}
            {activePromos.some(p => p.active && p.landingVisibility) && !isPromoDismissed && (() => {
              const promo = activePromos.find(p => p.active && p.landingVisibility);
              if (!promo) return null;

              if (!isPromoExpanded) {
                return (
                  <button
                    onClick={() => setIsPromoExpanded(true)}
                    className="w-full min-h-[44px] px-4 py-2.5 bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs font-bold rounded-2xl flex items-center justify-between hover:bg-amber-100/90 transition-colors cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-sm">🎁</span>
                      <span className="truncate">{promo.badgeLabel || t('pricing.special_promotion', 'SPECIAL PROMOTION')}: Use code <strong className="font-mono bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900">{promo.code}</strong></span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-800 underline shrink-0 ml-2 flex items-center">
                      {t('pricing.view_offer', 'View offer')} <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </button>
                );
              }

              return (
                <div className="bg-[#0B132B] text-white border border-slate-800 rounded-2xl p-3.5 sm:p-4 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-lg transition-all">
                  <div className="flex items-center space-x-3.5 w-full sm:w-auto">
                    <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      🎁
                    </span>
                    <div className="text-xs">
                      <p className="font-mono font-extrabold uppercase text-amber-300 tracking-wider text-[11px]">
                        {promo.badgeLabel || t('pricing.promo_badge', 'SPECIAL PROMOTION ACTIVE')}
                      </p>
                      <p className="text-slate-300 font-medium mt-0.5">
                        {t('pricing.use_code', 'Use code')} <span className="font-mono font-bold text-slate-950 bg-amber-300 px-1.5 py-0.5 rounded text-[11px]">{promo.code}</span> {t('pricing.at_checkout', 'at checkout for instant savings!')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/10 pt-2.5 sm:pt-0">
                    <button
                      onClick={() => onOpenCheckout?.('Premium')}
                      className="min-h-[42px] px-5 py-2 bg-[#00A88F] hover:bg-[#00937d] text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer whitespace-nowrap transition-colors"
                    >
                      {promo.ctaText || t('pricing.claim_discount', 'Claim Discount')}
                    </button>
                    <button
                      onClick={() => setIsPromoExpanded(false)}
                      className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                      title="Collapse promo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Centered Controls Toolbar: Billing Cycle Switch & Currency Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
              {/* Billing Cycle Segmented Control */}
              <div className="inline-flex items-center p-1 bg-slate-200/80 rounded-2xl border border-slate-300/70 shadow-2xs h-11 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setLandingBillingCycle('monthly')}
                  className={`flex-1 sm:flex-initial px-5 py-2 h-full rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                    landingBillingCycle === 'monthly'
                      ? 'bg-[#0B132B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('pricing.monthly', 'Monthly')}
                </button>
                <button
                  type="button"
                  onClick={() => setLandingBillingCycle('yearly')}
                  className={`flex-1 sm:flex-initial px-5 py-2 h-full rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
                    landingBillingCycle === 'yearly'
                      ? 'bg-[#0B132B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{t('pricing.yearly', 'Yearly')}</span>
                  {landingAnnualDiscount > 0 && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider leading-none ${
                        landingBillingCycle === 'yearly'
                          ? 'bg-[#00E5C0] text-slate-950'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t('pricing.save_pct', 'Save {pct}%', { pct: landingAnnualDiscount })}
                    </span>
                  )}
                </button>
              </div>

              {/* Currency Selector Control */}
              <CurrencySelector
                currentCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                className="w-full sm:w-auto h-11 shrink-0"
              />
            </div>
          </div>

          {/* Equal Height, Balanced Responsive Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto text-left w-full pt-4">
            {billingPlans.filter(p => !p.archived && p.active).map((plan) => {
              const currPrices = getPlanPricesForCurrency(plan, selectedCurrency);
              const priceVal = landingBillingCycle === 'yearly' ? currPrices.yearly : currPrices.monthly;
              const isPopular = plan.isPopular;
              const formattedPriceStr = formatCurrencyAmount(priceVal, selectedCurrency);

              const isFree = plan.monthlyPrice === 0 && plan.yearlyPrice === 0;
              const cardOrder = isPopular 
                ? 'order-1 md:order-2' 
                : isFree 
                  ? 'order-2 md:order-1' 
                  : 'order-3 md:order-3';

              return (
                <div 
                  key={plan.id}
                  className={`flex flex-col justify-between h-full p-7 sm:p-8 rounded-[28px] transition-all duration-300 relative ${cardOrder} ${
                    isPopular 
                      ? 'bg-gradient-to-b from-[#0B132B] via-[#0D1836] to-[#080E21] text-white shadow-xl shadow-[#0B132B]/25 border border-slate-700/80 scale-[1.02] md:scale-100 lg:scale-[1.03] z-10' 
                      : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00A88F] text-white font-mono font-bold text-[10px] px-4 py-1 rounded-full uppercase tracking-widest border border-teal-400/40 shadow-sm flex items-center space-x-1.5 whitespace-nowrap">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{plan.popularBadgeText || t('pricing.most_popular', 'MOST POPULAR')}</span>
                    </div>
                  )}

                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between min-h-[28px]">
                        <span className={`text-xs font-mono font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                          isPopular 
                            ? 'bg-white/10 text-white border-white/15' 
                            : 'bg-slate-100 text-[#0B132B] border-slate-200/80'
                        }`}>
                          {plan.name}
                        </span>
                        {plan.trialLabel && (
                          <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full border ${
                            isPopular 
                              ? 'bg-emerald-400/20 text-[#00E5C0] border-emerald-400/30' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                          }`}>
                            {plan.trialLabel}
                          </span>
                        )}
                      </div>

                      <div className="min-h-[64px] flex flex-col justify-end pt-3">
                        {plan.monthlyPrice === 0 && plan.yearlyPrice === 0 ? (
                          <span className="text-4xl sm:text-5xl font-black tracking-tight">{t('pricing.free', 'FREE')}</span>
                        ) : (
                          <div className="flex items-baseline space-x-1">
                            <span className="text-4xl sm:text-5xl font-black tracking-tight">{formattedPriceStr}</span>
                            <span className={`text-xs font-mono ${isPopular ? 'text-slate-400' : 'text-slate-400'}`}>/{landingBillingCycle === 'yearly' ? t('pricing.per_year_short', 'yr') : t('pricing.per_month_short', 'mo')}</span>
                          </div>
                        )}
                        {plan.promoLabel && (
                          <p className={`text-[11px] font-bold mt-1 font-mono ${isPopular ? 'text-[#00E5C0]' : 'text-emerald-600'}`}>{plan.promoLabel}</p>
                        )}
                      </div>

                      <p className={`text-xs font-medium leading-relaxed min-h-[36px] mt-2 ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                        {plan.tagline || t('pricing_page.default_tagline', 'Essential tools for capturing and hosting event memories.')}
                      </p>
                    </div>

                    <div className={`pt-5 border-t ${isPopular ? 'border-white/10' : 'border-slate-100'}`}>
                      <ul className={`space-y-3 text-xs font-medium ${isPopular ? 'text-slate-200' : 'text-slate-700'}`}>
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPopular ? 'text-[#00E5C0]' : 'text-[#00A88F]'}`} />
                          <span><strong>{plan.storageQuotaGb}GB</strong> {t('pricing.feature_vault', 'High-Def Digital Vault')}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPopular ? 'text-[#00E5C0]' : 'text-[#00A88F]'}`} />
                          <span>{t('pricing.feature_up_to', 'Up to')} <strong>{plan.maxGuestsPerEvent}</strong> {t('pricing.feature_guests_per_event', 'Guests per Event')}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                            plan.liveScreenAvailable 
                              ? isPopular ? 'text-[#00E5C0]' : 'text-[#00A88F]' 
                              : 'text-slate-300'
                          }`} />
                          <span className={plan.liveScreenAvailable ? "" : "line-through opacity-40"}>
                            {t('pricing.feature_live_screen', 'Projector Live Screen Mode')}
                          </span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                            plan.customBranding 
                              ? isPopular ? 'text-[#00E5C0]' : 'text-[#00A88F]' 
                              : 'text-slate-300'
                          }`} />
                          <span className={plan.customBranding ? "" : "line-through opacity-40"}>
                            {t('pricing.feature_custom_branding', 'Custom Host Branding & Watermark Removal')}
                          </span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                            plan.allowedMediaTypes.includes('voice') 
                              ? isPopular ? 'text-[#00E5C0]' : 'text-[#00A88F]' 
                              : 'text-slate-300'
                          }`} />
                          <span className={plan.allowedMediaTypes.includes('voice') ? "" : "line-through opacity-40"}>
                            {t('pricing.feature_audio_notes', 'Audio Voice Notes & Wishes')}
                          </span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPopular ? 'text-[#00E5C0]' : 'text-[#00A88F]'}`} />
                          <span>{plan.exportQuality} {t('pricing.feature_download_quality', 'Download Quality')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 space-y-2.5">
                    <button 
                      onClick={() => {
                        if (plan.monthlyPrice === 0) {
                          onCreateEvent();
                        } else if (onOpenCheckout) {
                          onOpenCheckout(plan.id);
                        } else {
                          onCreateEvent();
                        }
                      }}
                      className={`w-full min-h-[48px] py-3.5 rounded-2xl font-extrabold text-xs tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm ${
                        isPopular 
                          ? 'bg-[#00A88F] hover:bg-[#00937d] text-white shadow-md' 
                          : 'bg-[#0B132B] hover:bg-slate-900 text-white'
                      }`}
                    >
                      <span>{plan.ctaText || t('pricing.get_started', 'Get Started')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className={`text-[10px] font-mono text-center ${isPopular ? 'text-slate-400' : 'text-slate-400'}`}>
                      {plan.freeTrialDays > 0 ? t('pricing.free_trial_days', '{days}-Day Free Trial Included', { days: plan.freeTrialDays }) : t('pricing.instant_setup_no_cc', 'Instant Setup • No Credit Card Required')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Feature Comparison Matrix Toggle & Section */}
          <div className="max-w-6xl mx-auto pt-10">
            <button
              type="button"
              onClick={() => setShowFullComparison(!showFullComparison)}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-[#0B132B] px-6 py-3.5 rounded-2xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#00A88F]" />
              <span>{showFullComparison ? t('pricing.hide_detailed_comparison', 'Hide Detailed Plan Comparison') : t('pricing.view_detailed_comparison', 'Compare All Features & Capabilities in Detail')}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showFullComparison ? 'rotate-180' : ''}`} />
            </button>

            {/* Collapsible Full Feature Comparison Matrix */}
            <AnimatePresence>
              {showFullComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 overflow-hidden text-left"
                >
                  <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                      <div>
                        <h3 className="text-xl font-bold text-[#0B132B]">
                          {t('pricing.comparison_title', 'Full Feature Comparison Matrix')}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {t('pricing.comparison_subtitle', 'Explore complete technical specs, guest allowances, and hosting guarantees across all KAVA tiers.')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[11px] font-mono text-slate-400">All features included in 14-day trials</span>
                      </div>
                    </div>

                    {/* Comparison Table / Accordions */}
                    <div className="space-y-6">
                      {comparisonCategories.map((cat) => {
                        const isExpanded = expandedCategories[cat.id] !== false; // default expanded
                        return (
                          <div key={cat.id} className="border border-slate-200/70 rounded-2xl overflow-hidden bg-slate-50/40">
                            <button
                              type="button"
                              onClick={() => setExpandedCategories(prev => ({ ...prev, [cat.id]: !isExpanded }))}
                              className="w-full px-5 py-3.5 bg-slate-100/70 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                            >
                              <div className="flex items-center space-x-2.5">
                                <div className="w-2 h-2 rounded-full bg-[#00A88F]" />
                                <span className="font-bold text-xs uppercase tracking-wider text-[#0B132B] font-mono">
                                  {cat.name}
                                </span>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {isExpanded && (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="border-b border-slate-200/60 bg-white/60">
                                      <th className="py-3 px-5 font-bold text-slate-500 w-1/3">Feature</th>
                                      {billingPlans.filter(p => !p.archived && p.active).map(plan => (
                                        <th key={plan.id} className={`py-3 px-4 font-extrabold text-center ${plan.isPopular ? 'text-[#00A88F] bg-[#00A88F]/5' : 'text-slate-800'}`}>
                                          {plan.name}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 bg-white">
                                    {cat.features.map((feat) => (
                                      <tr key={feat.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-5">
                                          <div className="font-semibold text-slate-900">{feat.name}</div>
                                          {feat.tooltip && (
                                            <p className="text-[10px] text-slate-400 font-light mt-0.5">{feat.tooltip}</p>
                                          )}
                                        </td>
                                        {billingPlans.filter(p => !p.archived && p.active).map(plan => {
                                          const val = feat.values?.[plan.id] ?? feat.values?.[plan.name] ?? '-';
                                          return (
                                            <td key={plan.id} className={`py-3.5 px-4 text-center ${plan.isPopular ? 'bg-[#00A88F]/5 font-semibold text-[#0B132B]' : 'text-slate-600'}`}>
                                              {typeof val === 'boolean' ? (
                                                val ? (
                                                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                  </div>
                                                ) : (
                                                  <span className="text-slate-300 font-mono">—</span>
                                                )
                                              ) : val === 'true' || val === 'yes' ? (
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                </div>
                                              ) : val === 'false' || val === 'no' ? (
                                                <span className="text-slate-300 font-mono">—</span>
                                              ) : (
                                                <span className="font-medium">{val}</span>
                                              )}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Dynamic FAQ Section */}
      <section className="py-24 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto space-y-8" id="faq">
        <div className="text-center space-y-3.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00A88F] bg-[#00A88F]/10 border border-[#00A88F]/20 px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00A88F]" />
            <span>{t('faq.label', 'Frequently Asked Questions')}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B132B]">{t('faq.title', 'Got a question?')}</h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-normal leading-relaxed">{t('faq.subtitle', 'Find answers to common questions about guest access, media quality, live display setup, and storage security.')}</p>
        </div>

        {/* Live Search Input */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
            placeholder={t('faq.search_placeholder', 'Search questions (e.g. app download, voice notes, live display)...')}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-[#00A88F]/20 focus:border-[#00A88F]"
          />
        </div>

        {/* Categories & Language Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedFaqCategory('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedFaqCategory === 'ALL' ? 'bg-[#0B132B] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t('faq.all_topics', 'All Topics')}
          </button>
          
          {Array.from(new Set(faqs.filter(f => f.status === 'Published').map(f => f.category || 'General'))).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFaqCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFaqCategory === cat ? 'bg-[#0B132B] text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Language Selector if multiple languages exist */}
          {Array.from(new Set(faqs.map(f => f.language || 'English'))).length > 1 && (
            <select
              value={selectedFaqLanguage}
              onChange={(e) => setSelectedFaqLanguage(e.target.value)}
              className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="ALL">{t('faq.lang_all', 'Language: All')}</option>
              {Array.from(new Set(faqs.map(f => f.language || 'English'))).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5 pt-2">
          {(() => {
            const publishedList = faqs
              .filter(f => f.status === 'Published')
              .filter(f => selectedFaqCategory === 'ALL' || f.category === selectedFaqCategory)
              .filter(f => selectedFaqLanguage === 'ALL' || (f.language || 'English') === selectedFaqLanguage)
              .filter(f => {
                if (!faqSearchQuery) return true;
                const q = faqSearchQuery.toLowerCase();
                return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || (f.category && f.category.toLowerCase().includes(q));
              })
              .sort((a, b) => a.displayOrder - b.displayOrder);

            if (publishedList.length === 0) {
              return (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-600">{t('faq.no_answers', `No answers found for "${faqSearchQuery}".`, { query: faqSearchQuery })}</p>
                  <p className="text-xs text-slate-400">{t('faq.logged_support', 'Your query has been logged for our support team to create an answer soon!')}</p>
                </div>
              );
            }

            return publishedList.map((faq, index) => (
              <div 
                key={faq.id} 
                className="bg-white border border-slate-200/80 rounded-[20px] overflow-hidden transition-all duration-200 shadow-xs hover:border-[#00A88F]/40"
              >
                <button
                  onClick={() => handleToggleFaq(index, faq)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-base hover:bg-slate-50/70 transition-all cursor-pointer text-[#0B132B]"
                  id={`btn-faq-trigger-${index}`}
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span>{faq.question}</span>
                    {faq.category && (
                      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#00A88F]/10 text-[#00A88F] text-[10px] font-mono font-bold uppercase">
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <span className="text-[#0B132B] text-xl font-mono shrink-0">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </button>
                
                {activeFaq === index && (
                  <div className="px-6 pb-5 text-sm text-slate-600 text-left leading-relaxed border-t border-slate-100 pt-4 space-y-4">
                    
                    {/* Formatted Answer Output */}
                    <div className="space-y-2">
                      {faq.answer.split('\n\n').map((paragraph, pIdx) => {
                        if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
                          return (
                            <pre key={pIdx} className="bg-[#0B132B] text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                              <code>{paragraph.replace(/^```/, '').replace(/```$/, '').trim()}</code>
                            </pre>
                          );
                        }
                        if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                          const items = paragraph.split('\n- ').map(i => i.replace(/^- /, '')).filter(Boolean);
                          return (
                            <ul key={pIdx} className="list-disc list-inside space-y-1 pl-2">
                              {items.map((item, iIdx) => <li key={iIdx}>{item}</li>)}
                            </ul>
                          );
                        }
                        return <p key={pIdx}>{paragraph}</p>;
                      })}
                    </div>

                    {/* Helpful Feedback Toolbar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>{t('faq.helpful_question', 'Was this answer helpful?')}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleFeedback(faq.id, 'yes')}
                          disabled={!!userFeedbackState[faq.id]}
                          className={`px-3 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                            userFeedbackState[faq.id] === 'yes' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{t('faq.yes', 'Yes')} {userFeedbackState[faq.id] === 'yes' ? `• ${t('faq.thanks', 'Thanks!')}` : ''}</span>
                        </button>

                        <button
                          onClick={() => handleFeedback(faq.id, 'no')}
                          disabled={!!userFeedbackState[faq.id]}
                          className={`px-3 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                            userFeedbackState[faq.id] === 'no' 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>{t('faq.no', 'No')}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ));
          })()}
        </div>
      </section>
        </>
      )}

      {/* Redesigned Footer & Final CTA Section */}
      <FooterSection
        onCreateEvent={onCreateEvent}
        onTryDemo={onTryDemo}
        onOpenCheckout={(planName) => onOpenCheckout?.(planName)}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
        onNavigateSubView={navigateSubView}
      />

      {/* Public Contact Support Channels Modal */}
      <ContactSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
