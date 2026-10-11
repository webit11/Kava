import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  X,
  Sparkles, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  ChevronDown,
  Info,
  Check,
  Layers,
  Award
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';
import CurrencySelector from '../CurrencySelector';
import { 
  getStoredPlans, 
  getStoredCurrency, 
  getPlanPricesForCurrency, 
  formatCurrencyAmount, 
  SUPPORTED_CURRENCIES,
  getStoredComparisonCategories,
  ComparisonCategory,
  PlanFeatureValue
} from '../../lib/billing';
import { SubscriptionPlan } from '../../types';

interface PricingPageProps {
  initialPlan?: 'starter' | 'premium' | 'enterprise';
  onBackToHome?: () => void;
  onCreateEvent: () => void;
  onOpenCheckout?: (planId?: string) => void;
  onNavigateSubView: (view: string) => void;
}

export default function PricingPage({
  initialPlan = 'premium',
  onBackToHome,
  onCreateEvent,
  onOpenCheckout,
  onNavigateSubView
}: PricingPageProps) {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [currency, setCurrency] = useState<string>(getStoredCurrency);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(getStoredPlans);
  const [categories, setCategories] = useState<ComparisonCategory[]>(getStoredComparisonCategories);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Sync plans & comparison categories in real-time with Superadmin updates
  useEffect(() => {
    const handlePlansUpdate = () => setPlans(getStoredPlans());
    const handleComparisonUpdate = () => setCategories(getStoredComparisonCategories());
    const handleCurrencyUpdate = () => setCurrency(getStoredCurrency());

    window.addEventListener('kava_plans_updated', handlePlansUpdate);
    window.addEventListener('kava_comparison_updated', handleComparisonUpdate);
    window.addEventListener('kava_currency_updated', handleCurrencyUpdate);
    window.addEventListener('storage', handlePlansUpdate);
    window.addEventListener('storage', handleComparisonUpdate);

    return () => {
      window.removeEventListener('kava_plans_updated', handlePlansUpdate);
      window.removeEventListener('kava_comparison_updated', handleComparisonUpdate);
      window.removeEventListener('kava_currency_updated', handleCurrencyUpdate);
      window.removeEventListener('storage', handlePlansUpdate);
      window.removeEventListener('storage', handleComparisonUpdate);
    };
  }, []);

  const activeCurrencyObj = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0];
  const activePlans = plans.filter(p => !p.archived && p.active).sort((a, b) => a.displayOrder - b.displayOrder);

  // Compute maximum annual discount percentage dynamically from active paid plans
  const annualDiscountPercent = useMemo(() => {
    let maxDisc = 0;
    activePlans.forEach(p => {
      if (p.monthlyPrice > 0 && p.yearlyPrice > 0) {
        const annualMonthlyTotal = p.monthlyPrice * 12;
        const disc = Math.round(((annualMonthlyTotal - p.yearlyPrice) / annualMonthlyTotal) * 100);
        if (disc > maxDisc) maxDisc = disc;
      }
    });
    return maxDisc > 0 ? maxDisc : 20;
  }, [activePlans]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const pricingFaqs = [
    {
      q: t('pricing_page.faq_q0', 'Do guests have to pay anything to upload photos or audio wishes?'),
      a: t('pricing_page.faq_a0', 'Zero! Guests never pay anything, create accounts, or download apps. They simply scan your venue QR code and upload instantly.')
    },
    {
      q: t('pricing_page.faq_q1', 'How long are my event memories stored in the vault?'),
      a: t('pricing_page.faq_a1', 'All plans include high-definition cloud storage. You can access, stream, and download your full-resolution 4K ZIP archives anytime indefinitely.')
    },
    {
      q: t('pricing_page.faq_q2', 'Can I purchase a single-event pass instead of a subscription?'),
      a: t('pricing_page.faq_a2', 'Yes! The Premium Celebration plan is available as a single one-time event pass or an annual multi-event host pass with savings.')
    },
    {
      q: t('pricing_page.faq_q3', 'What happens if my event guest count exceeds expectations?'),
      a: t('pricing_page.faq_a3', 'Our Premium and Enterprise plans feature unlimited guest contributions with no per-guest overage fees or unexpected charges.')
    }
  ];

  const renderValueBadge = (valObj?: PlanFeatureValue) => {
    if (!valObj) return <span className="text-slate-300">—</span>;
    if (valObj.status === 'not_available') {
      return (
        <div className="flex items-center justify-center text-slate-300 font-normal">
          <X className="w-4 h-4 text-slate-300" />
        </div>
      );
    }
    if (valObj.status === 'included') {
      return (
        <div className="flex items-center justify-center space-x-1.5 text-emerald-600 font-extrabold">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          {valObj.value && <span className="text-xs text-slate-800">{valObj.value}</span>}
        </div>
      );
    }
    if (valObj.status === 'unlimited') {
      return (
        <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200">
          <Sparkles className="w-3 h-3 text-emerald-500 mr-1" />
          <span>{valObj.value || t('pricing_page.unlimited', 'UNLIMITED')}</span>
        </div>
      );
    }
    return <span className="text-xs font-semibold text-slate-800">{valObj.value || '—'}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-200/70 border border-slate-300/60 text-slate-800 text-[11px] font-mono font-extrabold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-slate-900 shrink-0" />
          <span>{t('pricing_page.badge', 'Transparent Global Rates')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          {t('pricing_page.hero_title', 'Simple, Honest Pricing for Timeless Memories')}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          {t('pricing_page.hero_desc', 'One-time event passes or host memberships. No hidden fees, zero per-guest charges, and unlimited guest downloads.')}
        </p>

        {/* Toolbar Controls: Centered Segmented Billing Control & Currency Selector */}
        <div className="pt-6 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Billing Cycle Segmented Control */}
          <div className="inline-flex items-center p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl border border-slate-300/70 shadow-2xs h-11 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 sm:flex-initial px-5 py-2 h-full rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('pricing.monthly', 'Monthly')}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 sm:flex-initial px-5 py-2 h-full rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
                billingCycle === 'yearly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{t('pricing.annual', 'Annual')}</span>
              {annualDiscountPercent > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider leading-none ${
                  billingCycle === 'yearly'
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {t('pricing.save_pct', 'Save {pct}%', { pct: annualDiscountPercent })}
                </span>
              )}
            </button>
          </div>

          {/* Currency Selector */}
          <CurrencySelector
            currentCurrency={currency}
            onCurrencyChange={setCurrency}
            className="h-11 w-full sm:w-auto shrink-0"
          />
        </div>
      </section>

      {/* Dynamic Pricing Cards Grid (100% Sourced from Superadmin getStoredPlans) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {activePlans.map((plan) => {
            const prices = getPlanPricesForCurrency(plan, currency);
            const displayPrice = billingCycle === 'yearly' ? prices.yearly : prices.monthly;
            const formattedPriceStr = formatCurrencyAmount(displayPrice, currency);
            const isPopular = plan.isPopular;
            const isFree = plan.monthlyPrice === 0 && plan.yearlyPrice === 0;

            // Calculate card specific savings if yearly
            const planSavingsPct = (prices.monthly > 0 && prices.yearly > 0)
              ? Math.round(((prices.monthly * 12 - prices.yearly) / (prices.monthly * 12)) * 100)
              : annualDiscountPercent;

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between h-full p-6 sm:p-8 rounded-[32px] transition-all duration-300 relative ${
                  isPopular 
                    ? 'bg-slate-950 text-white border border-slate-900 shadow-xl scale-[1.01] z-10' 
                    : 'bg-white border border-slate-200/90 shadow-2xs hover:shadow-md'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-mono font-black text-[10px] px-3.5 py-0.5 rounded-full uppercase tracking-widest border border-amber-300 shadow-xs flex items-center space-x-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>{plan.popularBadgeText || t('pricing.popular_badge', 'MOST POPULAR')}</span>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="flex items-center justify-between min-h-[28px]">
                    <span className={`text-xs font-mono font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                      isPopular 
                        ? 'bg-white/10 text-white border-white/15' 
                        : 'bg-slate-100 text-slate-900 border-slate-200/80'
                    }`}>
                      {plan.name}
                    </span>
                    {plan.trialLabel && (
                      <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full border ${
                        isPopular 
                          ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      }`}>
                        {plan.trialLabel}
                      </span>
                    )}
                  </div>

                  <div className="min-h-[72px] flex flex-col justify-end pt-1">
                    {isFree ? (
                      <span className="text-4xl sm:text-5xl font-black tracking-tight">{t('pricing.free', 'FREE')}</span>
                    ) : (
                      <div>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-4xl sm:text-5xl font-black tracking-tight">{formattedPriceStr}</span>
                          <span className={`text-xs font-mono ${isPopular ? 'text-slate-400' : 'text-slate-400'}`}>
                            /{billingCycle === 'yearly' ? t('pricing.per_year_short', 'yr') : t('pricing.per_month_short', 'mo')}
                          </span>
                        </div>
                        {billingCycle === 'yearly' && planSavingsPct > 0 && (
                          <p className={`text-[11px] font-bold mt-1 font-mono ${isPopular ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            {t('pricing.save_vs_monthly', 'Save {pct}% vs monthly billing', { pct: planSavingsPct })}
                          </p>
                        )}
                      </div>
                    )}
                    {plan.promoLabel && (
                      <p className={`text-[11px] font-bold mt-1 font-mono ${isPopular ? 'text-emerald-400' : 'text-emerald-600'}`}>{plan.promoLabel}</p>
                    )}
                  </div>

                  <p className={`text-xs font-medium leading-relaxed min-h-[36px] ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {plan.tagline || t('pricing_page.default_tagline', 'Essential tools for capturing and hosting event memories.')}
                  </p>

                  <div className={`pt-5 border-t space-y-3 ${isPopular ? 'border-white/10' : 'border-slate-100'}`}>
                    <div className="flex items-center space-x-2.5 text-xs font-medium">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPopular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span>{t('pricing_page.vault_storage', '{storage} GB Cloud Storage Vault', { storage: plan.storageQuotaGb })}</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-xs font-medium">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPopular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span>{t('pricing_page.active_capsules', '{count} Active Event Capsule{s}', { count: plan.maxEvents, s: plan.maxEvents > 1 ? 's' : '' })}</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-xs font-medium">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPopular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span>{t('pricing_page.max_guests', 'Max {count} Guests / Event', { count: plan.maxGuestsPerEvent })}</span>
                    </div>

                    {/* Features list configured in plan */}
                    {plan.features?.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2.5 text-xs font-medium">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPopular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (isFree) {
                        onCreateEvent();
                      } else {
                        onOpenCheckout?.(plan.id);
                      }
                    }}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                      isPopular 
                        ? 'bg-white text-slate-950 hover:bg-slate-100' 
                        : isFree 
                          ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                          : 'bg-slate-950 text-white hover:bg-slate-800'
                    }`}
                  >
                    {plan.ctaLabel || (isFree ? t('pricing_page.start_free', 'Start Free Capsule') : t('pricing_page.choose_plan', 'Choose {name}', { name: plan.name }))}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive 100% Configurable Feature Comparison Table */}
      <section className="mt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                {t('pricing_page.matrix_tag', 'Plan Comparison Matrix')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-2">
                {t('pricing_page.matrix_title', 'Detailed Feature Comparison')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              {t('pricing_page.matrix_sub', '100% synchronized live specifications for guest quotas, live presentation engines, cloud vaults, and host controls.')}
            </p>
          </div>

          {/* Desktop & Tablet Table Matrix */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-4 w-2/5 text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                    {t('pricing_page.features_specs', 'Features & Specifications')}
                  </th>
                  {activePlans.map(plan => (
                    <th key={plan.id} className="py-4 px-4 text-center text-xs font-black text-slate-900 font-mono">
                      <span className="block text-sm font-extrabold text-slate-950">{plan.name}</span>
                      <span className="text-[10px] font-normal text-slate-400 font-sans">
                        {plan.monthlyPrice === 0 
                          ? t('pricing.free', 'FREE') 
                          : `${formatCurrencyAmount(billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice, currency)}/${billingCycle === 'yearly' ? t('pricing.per_year_short', 'yr') : t('pricing.per_month_short', 'mo')}`}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => {
                  const visibleFeats = cat.features?.filter(f => f.visibleOnPublicTable) || [];
                  if (visibleFeats.length === 0) return null;

                  return (
                    <React.Fragment key={cat.id}>
                      {/* Category Header Row */}
                      <tr className="bg-slate-50/80">
                        <td colSpan={activePlans.length + 1} className="py-3 px-4 font-black text-xs text-slate-900 tracking-wide font-mono uppercase border-y border-slate-200/60">
                          {cat.name}
                          {cat.description && <span className="text-[10px] font-normal text-slate-400 font-sans ml-2 lowercase">({cat.description})</span>}
                        </td>
                      </tr>

                      {/* Feature Rows */}
                      {visibleFeats.map((feat) => (
                        <tr key={feat.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                            <div className="flex items-center space-x-2">
                              <span>{feat.name}</span>
                              {feat.description && (
                                <span className="text-[10px] text-slate-400 font-normal hidden lg:inline" title={feat.description}>
                                  — {feat.description}
                                </span>
                              )}
                            </div>
                          </td>
                          {activePlans.map((plan) => (
                            <td key={plan.id} className="py-3.5 px-4 text-center">
                              {renderValueBadge(feat.planValues?.[plan.id] || feat.planValues?.[plan.name])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Accordion & Card Stack View */}
          <div className="block md:hidden space-y-4">
            {categories.map((cat) => {
              const visibleFeats = cat.features?.filter(f => f.visibleOnPublicTable) || [];
              if (visibleFeats.length === 0) return null;

              const isExpanded = expandedCategories[cat.id] !== false; // expanded by default

              return (
                <div key={cat.id} className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full p-4 text-left font-black text-xs font-mono uppercase bg-slate-50 flex items-center justify-between text-slate-900 cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="p-4 space-y-4 divide-y divide-slate-100">
                      {visibleFeats.map((feat) => (
                        <div key={feat.id} className="pt-3 first:pt-0 space-y-2">
                          <p className="text-xs font-bold text-slate-900">{feat.name}</p>
                          {feat.description && (
                            <p className="text-[10px] text-slate-400">{feat.description}</p>
                          )}
                          <div className="grid grid-cols-3 gap-2 pt-1 text-center bg-slate-50/80 p-2 rounded-xl">
                            {activePlans.map((plan) => (
                              <div key={plan.id} className="space-y-1">
                                <p className="text-[9px] font-mono font-bold text-slate-500 uppercase">{plan.name}</p>
                                <div className="text-[11px]">
                                  {renderValueBadge(feat.planValues?.[plan.id] || feat.planValues?.[plan.name])}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mt-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            {t('pricing_page.faq_tag', 'Pricing FAQ')}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
            {t('pricing_page.faq_title', 'Billing Questions Answered')}
          </h3>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div key={i} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 text-left font-extrabold text-sm sm:text-base text-slate-950 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-slate-950' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 font-medium leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
