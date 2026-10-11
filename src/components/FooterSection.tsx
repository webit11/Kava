import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Lock, 
  Users,
  Check, 
  ArrowRight, 
  PlayCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';
import { FooterConfig, SocialLink, TrustBadgeItem } from '../types';
import { getStoredFooterConfig } from '../lib/footerConfig';
import { useTranslation } from '../lib/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import { KavaWordmark, KavaPetalIcon } from './KavaLogo';

interface FooterSectionProps {
  config?: FooterConfig;
  onCreateEvent?: () => void;
  onTryDemo?: () => void;
  onOpenCheckout?: (planName?: string, featureName?: string) => void;
  onOpenSupportModal?: () => void;
  onNavigateSubView?: (view: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  config: initialConfig,
  onCreateEvent,
  onTryDemo,
  onOpenCheckout,
  onOpenSupportModal,
  onNavigateSubView,
}) => {
  const { t, lang } = useTranslation();
  const [config, setConfig] = useState<FooterConfig>(initialConfig || getStoredFooterConfig());
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    col_product: false,
    col_resources: false,
    col_company: false,
  });

  // Keep state in sync with localStorage or prop updates
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    } else {
      setConfig(getStoredFooterConfig());
    }
  }, [initialConfig]);

  useEffect(() => {
    const handleSync = (e: CustomEvent<FooterConfig> | Event) => {
      if ('detail' in e && e.detail) {
        setConfig(e.detail as FooterConfig);
      } else {
        setConfig(getStoredFooterConfig());
      }
    };

    window.addEventListener('kava_footer_config_updated', handleSync as EventListener);
    return () => {
      window.removeEventListener('kava_footer_config_updated', handleSync as EventListener);
    };
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    if (link.actionType === 'modal') {
      e.preventDefault();
      if (onNavigateSubView) {
        onNavigateSubView('support');
      } else {
        onOpenSupportModal?.();
      }
    } else if (link.actionType === 'demo') {
      e.preventDefault();
      onTryDemo?.();
    } else if (link.actionType === 'scroll' && link.href.startsWith('#')) {
      e.preventDefault();
      const targetId = link.href.substring(1);
      
      const targetToSubViewMap: Record<string, string> = {
        'how-it-works': 'how-it-works',
        'memory-types': 'capsule-types',
        'capsule-types': 'capsule-types',
        'pricing': 'pricing',
        'faq': 'resources-help',
        'privacy': 'privacy',
        'terms': 'terms',
        'trust-safety': 'trust-safety',
        'about': 'about',
        'support': 'support',
        'templates': 'capsule-types',
        'integrations': 'how-it-works'
      };

      if (onNavigateSubView && targetToSubViewMap[targetId]) {
        onNavigateSubView(targetToSubViewMap[targetId]);
      } else {
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handlePrimaryCta = () => {
    if (config.primaryCtaAction === 'create') {
      onCreateEvent?.();
    } else if (config.primaryCtaAction === 'checkout') {
      onOpenCheckout?.('Premium');
    } else {
      onCreateEvent?.();
    }
  };

  const handleSecondaryCta = () => {
    if (config.secondaryCtaAction === 'demo') {
      onTryDemo?.();
    } else if (config.secondaryCtaAction === 'support') {
      onOpenSupportModal?.();
    } else {
      onTryDemo?.();
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4000);
  };

  // Structured Columns Matching the Reference Design: Product, Resources, Company
  const productLinks = [
    { id: 'p_1', label: t('footer.link_features', 'Features'), href: '#how-it-works', actionType: 'scroll' },
    { id: 'p_2', label: t('footer.link_for_events', 'For Events'), href: '#capsule-types', actionType: 'scroll' },
    { id: 'p_3', label: t('footer.link_templates', 'Templates'), href: '#capsule-types', actionType: 'scroll' },
    { id: 'p_4', label: t('nav.pricing', 'Pricing'), href: '#pricing', actionType: 'scroll' },
    { id: 'p_5', label: t('nav.how_it_works', 'How It Works'), href: '#how-it-works', actionType: 'scroll' },
    { id: 'p_6', label: t('footer.link_integrations', 'Integrations'), href: '#how-it-works', actionType: 'scroll' },
  ];

  const resourcesLinks = [
    { id: 'r_1', label: t('footer.link_help_center', 'Help Center'), href: '#faq', actionType: 'scroll' },
    { id: 'r_2', label: t('footer.host_guide', 'Guides'), href: '#faq', actionType: 'scroll' },
    { id: 'r_3', label: t('footer.link_blog', 'Blog'), href: '#faq', actionType: 'scroll' },
    { id: 'r_4', label: t('footer.link_use_cases', 'Use Cases'), href: '#capsule-types', actionType: 'scroll' },
    { id: 'r_5', label: t('footer.link_api_docs', 'API Documentation'), href: '#support', actionType: 'modal' },
    { id: 'r_6', label: t('footer.link_status', 'Status'), href: '#support', actionType: 'modal' },
  ];

  const companyLinks = [
    { id: 'c_1', label: t('footer.about_kava', 'About KAVA'), href: '#how-it-works', actionType: 'scroll' },
    { id: 'c_2', label: t('footer.link_our_story', 'Our Story'), href: '#how-it-works', actionType: 'scroll' },
    { id: 'c_3', label: t('footer.link_careers', 'Careers'), href: '#support', actionType: 'modal' },
    { id: 'c_4', label: t('footer.link_press_kit', 'Press Kit'), href: '#support', actionType: 'modal' },
    { id: 'c_5', label: t('footer.link_contact_us', 'Contact Us'), href: '#support', actionType: 'modal' },
  ];

  return (
    <div className="bg-[#F8FAFC]/70 text-slate-900 font-sans selection:bg-[#00A88F]/20 selection:text-slate-950">
      
      {/* FINAL CTA SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="cta-section">
        
        {/* Main CTA Card Container */}
        <div className="max-w-6xl mx-auto bg-white rounded-[32px] sm:rounded-[36px] p-8 sm:p-14 lg:p-16 relative z-10 text-center shadow-[0_20px_60px_-15px_rgba(11,19,43,0.06)] border border-slate-100 overflow-hidden">
          
          {/* Subtle Organic Mint/Teal Leaf Watermarks in Corners */}
          <div className="absolute -bottom-10 -left-10 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-40 select-none">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M40 180C40 180 30 110 90 70C150 30 170 80 140 130C110 180 40 180 40 180Z" fill="url(#cta-leaf-grad-1)" />
              <path d="M10 140C10 140 20 80 70 50C120 20 140 60 110 100C80 140 10 140 10 140Z" fill="url(#cta-leaf-grad-2)" opacity="0.6" />
              <defs>
                <linearGradient id="cta-leaf-grad-1" x1="40" y1="180" x2="160" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2DD4BF" stopOpacity="0.4" />
                  <stop stopColor="#00A88F" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="cta-leaf-grad-2" x1="10" y1="140" x2="130" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00A88F" stopOpacity="0.35" />
                  <stop stopColor="#06B6D4" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute -top-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-40 select-none">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-180">
              <path d="M40 180C40 180 30 110 90 70C150 30 170 80 140 130C110 180 40 180 40 180Z" fill="url(#cta-leaf-grad-3)" />
              <defs>
                <linearGradient id="cta-leaf-grad-3" x1="40" y1="180" x2="160" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00A88F" stopOpacity="0.3" />
                  <stop stopColor="#2DD4BF" stopOpacity="0.08" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Top Pill Badge: ✨ Ready to Create Unforgettable Memories? */}
          <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#ECFDF5] border border-emerald-200/60 text-emerald-700 text-xs sm:text-sm font-medium shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t('cta.badge_ready', 'Ready to Create Unforgettable Memories?')}</span>
          </div>

          {/* Centered Headline: Start Your Memory Capsule Today */}
          <div className="space-y-3 max-w-2xl mx-auto pt-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B132B] font-sans leading-tight">
              {t('cta.start_headline_prefix', 'Start Your Memory Capsule')}{' '}
              <span className="text-[#00A88F]">{t('cta.start_headline_highlight', 'Today')}</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-lg mx-auto">
              {t('cta.start_description', 'Join thousands of amazing hosts who trust KAVA to capture, share, and relive their most cherished moments.')}
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="w-full sm:w-auto bg-[#0B132B] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              id="btn-footer-primary-cta"
            >
              <span>{t('cta.primary_create_event', 'Create Your Event')}</span>
              <ArrowRight className="w-4 h-4 text-white shrink-0" />
            </button>

            <button
              type="button"
              onClick={handleSecondaryCta}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full transition-all shadow-2xs flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              id="btn-footer-secondary-cta"
            >
              <span>{t('cta.view_demo', 'View Demo')}</span>
              <PlayCircle className="w-4 h-4 text-slate-700 shrink-0" />
            </button>
          </div>

          {/* 4 Key Benefits Compact Row */}
          <div className="pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Benefit 1 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0B132B]">
                  {t('cta.benefit_free_title', 'Free to Get Started')}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                  {t('cta.benefit_free_desc', 'No credit card required. Start creating your first capsule now.')}
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0B132B]">
                  {t('cta.benefit_private_title', 'Private & Secure')}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                  {t('cta.benefit_private_desc', 'Your memories are safe with us. Only you decide who can access.')}
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0B132B]">
                  {t('cta.benefit_easy_title', 'Easy to Use')}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                  {t('cta.benefit_easy_desc', 'Simple setup in minutes. Designed for everyone.')}
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0B132B]">
                  {t('cta.benefit_memories_title', 'Memories That Last')}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                  {t('cta.benefit_memories_desc', 'Capture, share, and relive every special moment forever.')}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* MODERN MULTI-COLUMN SAAS FOOTER */}
      <footer className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 relative bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* COLUMN 1: KAVA Wordmark, Tagline, Petal Icon & Language Switcher */}
            <div className="lg:col-span-3 space-y-3.5">
              <div>
                <KavaWordmark height={26} color="#0B132B" />
              </div>

              <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xs">
                {t('footer.brand_mission', 'The memory capsule for every moment. Capture. Share. Relive.')}
              </p>

              {/* 4-Petal Floral Emblem */}
              <div className="pt-1">
                <KavaPetalIcon size={44} />
              </div>

              {/* Language Switcher Pill */}
              <div className="pt-4">
                <LanguageSwitcher variant="default" />
              </div>

              {/* Copyright (Desktop Left) */}
              <p className="text-[11px] text-slate-400 font-sans pt-2">
                © 2024 KAVA. All rights reserved.
              </p>
            </div>

            {/* COLUMN 2: Product */}
            <div className="lg:col-span-2 space-y-3">
              <button
                type="button"
                onClick={() => toggleAccordion('col_product')}
                className="w-full flex items-center justify-between sm:cursor-default text-left font-bold text-xs uppercase tracking-wider text-[#0B132B]"
              >
                <span>{t('footer.col_product', 'Product')}</span>
                <span className="sm:hidden text-slate-400">
                  {openAccordions.col_product ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <div className={`${openAccordions.col_product ? 'block' : 'hidden'} sm:block space-y-2.5`}>
                {productLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="block text-xs text-slate-500 hover:text-[#0B132B] transition-colors py-0.5 cursor-pointer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* COLUMN 3: Resources */}
            <div className="lg:col-span-2 space-y-3">
              <button
                type="button"
                onClick={() => toggleAccordion('col_resources')}
                className="w-full flex items-center justify-between sm:cursor-default text-left font-bold text-xs uppercase tracking-wider text-[#0B132B]"
              >
                <span>{t('footer.col_resources', 'Resources')}</span>
                <span className="sm:hidden text-slate-400">
                  {openAccordions.col_resources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <div className={`${openAccordions.col_resources ? 'block' : 'hidden'} sm:block space-y-2.5`}>
                {resourcesLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="block text-xs text-slate-500 hover:text-[#0B132B] transition-colors py-0.5 cursor-pointer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* COLUMN 4: Company */}
            <div className="lg:col-span-2 space-y-3">
              <button
                type="button"
                onClick={() => toggleAccordion('col_company')}
                className="w-full flex items-center justify-between sm:cursor-default text-left font-bold text-xs uppercase tracking-wider text-[#0B132B]"
              >
                <span>{t('footer.col_company', 'Company')}</span>
                <span className="sm:hidden text-slate-400">
                  {openAccordions.col_company ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <div className={`${openAccordions.col_company ? 'block' : 'hidden'} sm:block space-y-2.5`}>
                {companyLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="block text-xs text-slate-500 hover:text-[#0B132B] transition-colors py-0.5 cursor-pointer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* COLUMN 5: Stay in the Loop (Newsletter & Social Media) */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B132B]">
                {t('footer.stay_in_loop', 'Stay in the Loop')}
              </h3>

              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                {t('footer.newsletter_subtitle', 'Get tips, inspiration, and product updates delivered to your inbox.')}
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('footer.enter_email', 'Enter your email')}
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A88F]/20 focus:border-[#00A88F] shadow-2xs"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#0B132B] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 shadow-2xs cursor-pointer"
                >
                  {newsletterSubscribed ? t('common.done', 'Subscribed!') : t('footer.subscribe', 'Subscribe')}
                </button>
              </form>

              {/* 6 Social Media Round Icon Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-slate-100/90 text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-slate-100/90 text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* X / Twitter */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="w-8 h-8 rounded-full bg-slate-100/90 text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-8 h-8 rounded-full bg-slate-100/90 text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47V10.81a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2-.66 4.83 4.83 0 0 1-1-1.58z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-slate-100/90 text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-slate-100/90 text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

              </div>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT & LEGAL BAR */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
            <p className="sm:hidden text-center">
              © 2024 KAVA. All rights reserved.
            </p>

            <div className="hidden sm:block">
              {/* Spacer or extra notes */}
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-500 font-medium">
              <button 
                onClick={(e) => handleLinkClick(e, { href: '#privacy', actionType: 'scroll' })} 
                className="hover:text-[#0B132B] transition-colors cursor-pointer"
              >
                {t('footer.privacy_policy', 'Privacy Policy')}
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, { href: '#terms', actionType: 'scroll' })} 
                className="hover:text-[#0B132B] transition-colors cursor-pointer"
              >
                {t('footer.terms_of_service', 'Terms of Service')}
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, { href: '#privacy', actionType: 'scroll' })} 
                className="hover:text-[#0B132B] transition-colors cursor-pointer"
              >
                {t('footer.cookie_policy', 'Cookie Policy')}
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default FooterSection;

