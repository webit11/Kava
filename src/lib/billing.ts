import { SubscriptionPlan, PromotionItem, OfferPopupConfig, UserSubscriptionState, LandingBannerConfig, MegaMenuCampaign } from '../types';
export type { SubscriptionPlan, PromotionItem, OfferPopupConfig, UserSubscriptionState, LandingBannerConfig, MegaMenuCampaign };

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'prefix' | 'suffix';
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', symbolPosition: 'prefix' },
  { code: 'EUR', name: 'Euro', symbol: '€', symbolPosition: 'prefix' },
  { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: 'prefix' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolPosition: 'prefix' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', symbolPosition: 'prefix' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', symbolPosition: 'suffix' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', symbolPosition: 'prefix' }
];

export function getStoredCurrency(): string {
  if (typeof window === 'undefined') return 'USD';
  const saved = localStorage.getItem('kava_currency');
  if (saved && SUPPORTED_CURRENCIES.some(c => c.code === saved)) {
    return saved;
  }
  return 'USD';
}

export function saveStoredCurrency(currencyCode: string): void {
  localStorage.setItem('kava_currency', currencyCode);
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_currency_updated', { detail: currencyCode }));
}

export function formatCurrencyAmount(amount: number, currencyCode: string = 'USD'): string {
  const curr = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  let formattedNumber = amount.toLocaleString('en-US');

  if (['IDR', 'VND', 'JPY', 'TWD'].includes(curr.code)) {
    formattedNumber = Math.round(amount).toLocaleString('en-US');
  } else if (Number.isInteger(amount)) {
    formattedNumber = amount.toLocaleString('en-US');
  } else {
    formattedNumber = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  if (curr.symbolPosition === 'suffix') {
    return `${formattedNumber} ${curr.symbol}`;
  }
  if (['IDR', 'TWD'].includes(curr.code)) {
    return `${curr.symbol} ${formattedNumber}`;
  }
  return `${curr.symbol}${formattedNumber}`;
}

export function getPlanPricesForCurrency(plan: SubscriptionPlan, currencyCode: string = 'USD') {
  if (plan.monthlyPrice === 0 && plan.yearlyPrice === 0) {
    return { monthly: 0, yearly: 0, perEvent: 0, isFree: true };
  }

  const regional = (plan.regionalPricing || []).find(r => r.currency === currencyCode);
  if (regional && (regional.monthly > 0 || regional.yearly > 0 || regional.perEvent > 0)) {
    return {
      monthly: regional.monthly,
      yearly: regional.yearly,
      perEvent: regional.perEvent,
      isFree: false
    };
  }

  if (currencyCode === 'USD') {
    return {
      monthly: plan.monthlyPrice,
      yearly: plan.yearlyPrice,
      perEvent: plan.perEventPrice,
      isFree: false
    };
  }

  const defaultRatios: Record<string, number> = {
    EUR: 0.92,
    GBP: 0.80,
    JPY: 150,
    IDR: 15500,
    VND: 25000,
    TWD: 32
  };
  const ratio = defaultRatios[currencyCode] || 1;
  return {
    monthly: Math.round(plan.monthlyPrice * ratio),
    yearly: Math.round(plan.yearlyPrice * ratio),
    perEvent: Math.round(plan.perEventPrice * ratio),
    isFree: false
  };
}

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'Free',
    name: 'Free Starter',
    monthlyPrice: 0,
    yearlyPrice: 0,
    perEventPrice: 0,
    freeTrialDays: 0,
    storageQuotaGb: 0.5,
    maxEvents: 1,
    maxGuestsPerEvent: 50,
    maxUploads: 100,
    allowedMediaTypes: ['photo', 'wish'],
    
    liveScreenAvailable: false,
    invitationDesigner: false,
    guestStudioCustomization: false,
    analytics: false,
    archiveDownloads: false,
    customBranding: false,
    watermarkRemoval: false,
    frameCustomization: false,
    musicUpload: false,
    videoGreeting: false,
    qrCustomization: false,
    apiAccess: false,
    teamMembersCount: 1,
    customDomain: false,
    prioritySupport: false,
    moderationTools: false,
    aiFeatures: false,

    featureFlags: {
      'custom-effects': false,
      'slideshow-music': false,
      'live-reactions': false
    },

    exportQuality: '720p',
    uploadSizeLimitMb: 20,
    retentionPeriodDays: 30,
    bandwidthLimitGb: 2,
    
    overagePolicies: {
      storageOveragePricePerGb: 5,
      uploadsOveragePricePerHundred: 2,
      allowOverages: false
    },
    upgradePaths: ['Premium', 'Enterprise'],
    downgradeRules: 'Auto-freeze uploads above quota',
    gracePeriodDays: 3,
    renewalBehavior: 'expire',
    couponCompatibility: false,
    regionalPricing: [
      { currency: 'USD', monthly: 0, yearly: 0, perEvent: 0 },
      { currency: 'EUR', monthly: 0, yearly: 0, perEvent: 0 },
      { currency: 'GBP', monthly: 0, yearly: 0, perEvent: 0 },
      { currency: 'JPY', monthly: 0, yearly: 0, perEvent: 0 },
      { currency: 'IDR', monthly: 0, yearly: 0, perEvent: 0 },
      { currency: 'VND', monthly: 0, yearly: 0, perEvent: 0 },
      { currency: 'TWD', monthly: 0, yearly: 0, perEvent: 0 }
    ],
    active: true,
    archived: false,
    displayOrder: 1,
    version: 1,
    updatedAt: new Date().toISOString(),
    isPopular: false,
    ctaText: 'Start Free Capsule',
    tagline: 'Ideal for small intimate gatherings and testing KAVA features.'
  },
  {
    id: 'Premium',
    name: 'Pro Studio',
    monthlyPrice: 29,
    yearlyPrice: 290,
    perEventPrice: 49,
    freeTrialDays: 14,
    storageQuotaGb: 10,
    maxEvents: 10,
    maxGuestsPerEvent: 500,
    maxUploads: 2000,
    allowedMediaTypes: ['photo', 'video', 'voice', 'wish'],
    
    liveScreenAvailable: true,
    invitationDesigner: true,
    guestStudioCustomization: true,
    analytics: true,
    archiveDownloads: true,
    customBranding: true,
    watermarkRemoval: true,
    frameCustomization: true,
    musicUpload: true,
    videoGreeting: true,
    qrCustomization: true,
    apiAccess: false,
    teamMembersCount: 5,
    customDomain: false,
    prioritySupport: true,
    moderationTools: true,
    aiFeatures: true,

    featureFlags: {
      'custom-effects': true,
      'slideshow-music': true,
      'live-reactions': true
    },

    exportQuality: '1080p',
    uploadSizeLimitMb: 250,
    retentionPeriodDays: 365,
    bandwidthLimitGb: 50,
    
    overagePolicies: {
      storageOveragePricePerGb: 3,
      uploadsOveragePricePerHundred: 1,
      allowOverages: true
    },
    upgradePaths: ['Enterprise'],
    downgradeRules: 'Grace period lock after 14 days',
    gracePeriodDays: 14,
    renewalBehavior: 'auto_renew',
    couponCompatibility: true,
    regionalPricing: [
      { currency: 'USD', monthly: 29, yearly: 290, perEvent: 49 },
      { currency: 'EUR', monthly: 27, yearly: 270, perEvent: 45 },
      { currency: 'GBP', monthly: 23, yearly: 230, perEvent: 39 },
      { currency: 'JPY', monthly: 4200, yearly: 42000, perEvent: 7000 },
      { currency: 'IDR', monthly: 450000, yearly: 4500000, perEvent: 750000 },
      { currency: 'VND', monthly: 720000, yearly: 7200000, perEvent: 1200000 },
      { currency: 'TWD', monthly: 920, yearly: 9200, perEvent: 1500 }
    ],
    active: true,
    archived: false,
    displayOrder: 2,
    version: 1,
    updatedAt: new Date().toISOString(),
    isPopular: true,
    popularBadgeText: 'MOST POPULAR',
    ctaText: 'Start 14-Day Free Trial',
    promoLabel: 'Save 17% Yearly',
    trialLabel: '14 Days Free',
    tagline: 'Full power for weddings, birthday galas, and corporate events.'
  },
  {
    id: 'Enterprise',
    name: 'Enterprise Guild',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    perEventPrice: 199,
    freeTrialDays: 30,
    storageQuotaGb: 100,
    maxEvents: 9999,
    maxGuestsPerEvent: 9999,
    maxUploads: 99999,
    allowedMediaTypes: ['photo', 'video', 'voice', 'wish'],
    
    liveScreenAvailable: true,
    invitationDesigner: true,
    guestStudioCustomization: true,
    analytics: true,
    archiveDownloads: true,
    customBranding: true,
    watermarkRemoval: true,
    frameCustomization: true,
    musicUpload: true,
    videoGreeting: true,
    qrCustomization: true,
    apiAccess: true,
    teamMembersCount: 50,
    customDomain: true,
    prioritySupport: true,
    moderationTools: true,
    aiFeatures: true,

    featureFlags: {
      'custom-effects': true,
      'slideshow-music': true,
      'live-reactions': true
    },

    exportQuality: '4K raw',
    uploadSizeLimitMb: 2048,
    retentionPeriodDays: -1,
    bandwidthLimitGb: 1000,
    
    overagePolicies: {
      storageOveragePricePerGb: 1,
      uploadsOveragePricePerHundred: 0.5,
      allowOverages: true
    },
    upgradePaths: [],
    downgradeRules: 'Custom SLA negotiation required',
    gracePeriodDays: 30,
    renewalBehavior: 'invoice',
    couponCompatibility: true,
    regionalPricing: [
      { currency: 'USD', monthly: 299, yearly: 2990, perEvent: 199 },
      { currency: 'EUR', monthly: 279, yearly: 2790, perEvent: 189 },
      { currency: 'GBP', monthly: 239, yearly: 2390, perEvent: 159 },
      { currency: 'JPY', monthly: 42000, yearly: 420000, perEvent: 28000 },
      { currency: 'IDR', monthly: 4500000, yearly: 45000000, perEvent: 3000000 },
      { currency: 'VND', monthly: 7200000, yearly: 72000000, perEvent: 4800000 },
      { currency: 'TWD', monthly: 9200, yearly: 92000, perEvent: 6200 }
    ],
    active: true,
    archived: false,
    displayOrder: 3,
    version: 1,
    updatedAt: new Date().toISOString(),
    isPopular: false,
    ctaText: 'Contact Enterprise Sales',
    trialLabel: '30 Days VIP Trial',
    tagline: 'Unlimited scale, white-label branding, API access & dedicated SLA.'
  }
];

export const DEFAULT_PROMOTIONS: PromotionItem[] = [
  {
    id: 'promo-welcome20',
    name: 'Welcome Special Discount',
    code: 'WELCOME20',
    type: 'welcome',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    targetPlans: ['all'],
    discountType: 'percentage',
    discountValue: 20,
    usageLimit: 1000,
    usedCount: 142,
    ctaText: 'Claim 20% Off Pro',
    landingVisibility: true,
    dashboardVisibility: true,
    active: true,
    badgeLabel: '20% OFF FIRST YEAR'
  },
  {
    id: 'promo-earlybird',
    name: 'Early Bird Wedding Season',
    code: 'EARLYBIRD30',
    type: 'early_bird',
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    targetPlans: ['Premium'],
    discountType: 'percentage',
    discountValue: 30,
    usageLimit: 500,
    usedCount: 89,
    ctaText: 'Save 30% on Pro Studio',
    landingVisibility: true,
    dashboardVisibility: true,
    active: true,
    badgeLabel: 'SUMMER SPECIAL'
  },
  {
    id: 'promo-bf50',
    name: 'Black Friday Grand Upgrade',
    code: 'BLACKFRIDAY50',
    type: 'black_friday',
    startDate: '2026-11-20',
    endDate: '2026-11-30',
    targetPlans: ['Premium', 'Enterprise'],
    discountType: 'percentage',
    discountValue: 50,
    usageLimit: 2000,
    usedCount: 640,
    ctaText: 'Get 50% Off Lifetime Pro',
    landingVisibility: true,
    dashboardVisibility: true,
    active: false,
    badgeLabel: '50% FLASH SALE'
  }
];

export const DEFAULT_OFFER_POPUPS: OfferPopupConfig[] = [
  {
    id: 'popup-welcome-30',
    title: '⚡ Unlock KAVA Pro Studio at 20% Off!',
    subtitle: 'Upgrade today to unlock 10GB cloud vault, Live Venue Screen, custom QR codes, and 4K raw downloads for your upcoming event.',
    heroIllustration: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    highlightedPlanId: 'Premium',
    ctaButtonText: 'Upgrade to Pro — Save 20%',
    secondaryButtonText: 'Continue with Free Plan',
    countdownEndTime: '2026-08-15T23:59:59Z',
    promotionBadge: 'LIMITED TIME OFFER',
    closeBehavior: 'dismiss_session',
    displayRules: {
      triggerOnFirstLogin: true,
      triggerOnFreePlanOnly: true,
      triggerOnStorageNearFull: true,
      triggerOnFeatureLocked: true,
      customAudience: 'free_hosts'
    },
    frequency: 'once',
    active: true
  },
  {
    id: 'popup-storage-80',
    title: '⚠️ Storage Capacity Reaching Quota (80%+)',
    subtitle: 'Your memory capsule has used over 80% of its available cloud storage. Upgrade to Pro Studio now to prevent guest upload interruptions during your event.',
    heroIllustration: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    highlightedPlanId: 'Premium',
    ctaButtonText: 'Expand Vault to 10GB',
    secondaryButtonText: 'Remind Me Later',
    promotionBadge: 'STORAGE WARNING',
    closeBehavior: 'remind_later',
    displayRules: {
      triggerOnStorageNearFull: true,
      triggerOnGuestLimitReached: true,
      triggerOnEventLimitReached: true
    },
    frequency: 'daily',
    active: true
  }
];

export const DEFAULT_USER_SUBSCRIPTION: UserSubscriptionState = {
  planId: 'Free',
  billingCycle: 'monthly',
  status: 'active',
  startDate: '2026-01-01T00:00:00.000Z',
  renewalDate: '2026-08-27T00:00:00.000Z',
  trialEndsAt: undefined
};

// Functions to retrieve synced data
export function getStoredPlans(): SubscriptionPlan[] {
  const saved = localStorage.getItem('kava_plans');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error('Error parsing stored kava_plans:', e);
    }
  }
  localStorage.setItem('kava_plans', JSON.stringify(DEFAULT_PLANS));
  return DEFAULT_PLANS;
}

export function saveStoredPlans(plans: SubscriptionPlan[]): void {
  localStorage.setItem('kava_plans', JSON.stringify(plans));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_plans_updated', { detail: plans }));
}

export function getStoredPromotions(): PromotionItem[] {
  const saved = localStorage.getItem('kava_promotions');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Error parsing kava_promotions:', e);
    }
  }
  localStorage.setItem('kava_promotions', JSON.stringify(DEFAULT_PROMOTIONS));
  return DEFAULT_PROMOTIONS;
}

export function saveStoredPromotions(promos: PromotionItem[]): void {
  localStorage.setItem('kava_promotions', JSON.stringify(promos));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_promotions_updated', { detail: promos }));
}

export function getStoredOfferPopups(): OfferPopupConfig[] {
  const saved = localStorage.getItem('kava_offer_popups');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Error parsing kava_offer_popups:', e);
    }
  }
  localStorage.setItem('kava_offer_popups', JSON.stringify(DEFAULT_OFFER_POPUPS));
  return DEFAULT_OFFER_POPUPS;
}

export function saveStoredOfferPopups(popups: OfferPopupConfig[]): void {
  localStorage.setItem('kava_offer_popups', JSON.stringify(popups));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_popups_updated', { detail: popups }));
}

export function getUserSubscription(): UserSubscriptionState {
  const saved = localStorage.getItem('kava_user_subscription');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing kava_user_subscription:', e);
    }
  }
  localStorage.setItem('kava_user_subscription', JSON.stringify(DEFAULT_USER_SUBSCRIPTION));
  return DEFAULT_USER_SUBSCRIPTION;
}

export function saveUserSubscription(sub: UserSubscriptionState): void {
  localStorage.setItem('kava_user_subscription', JSON.stringify(sub));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_subscription_updated', { detail: sub }));
}

// Check feature availability for active user plan
export function isFeatureAvailableInUserPlan(featureKey: keyof SubscriptionPlan): boolean {
  const userSub = getUserSubscription();
  const plans = getStoredPlans();
  const activePlan = plans.find(p => p.id === userSub.planId) || plans.find(p => p.id === 'Free') || DEFAULT_PLANS[0];
  const val = activePlan[featureKey];
  return Boolean(val);
}

// Find required plan for a locked feature
export function getRequiredPlanForFeature(featureKey: keyof SubscriptionPlan): SubscriptionPlan | null {
  const plans = getStoredPlans().filter(p => !p.archived && p.active);
  const matched = plans.find(p => p[featureKey] === true || (typeof p[featureKey] === 'number' && (p[featureKey] as number) > 1));
  return matched || plans.find(p => p.id === 'Premium') || DEFAULT_PLANS[1];
}

export const DEFAULT_LANDING_BANNER: LandingBannerConfig = {
  id: 'banner-default',
  enabled: true,
  text: '🎉 Preserving moments as they happen. Introducing KAVA 2026 Memory Capsules!',
  ctaText: 'Explore Demo',
  destinationUrl: 'demo',
  actionType: 'demo',
  theme: 'slate',
  startDate: '',
  endDate: '',
  updatedAt: new Date().toISOString()
};

export function getLandingBannerConfig(): LandingBannerConfig {
  const saved = localStorage.getItem('kava_landing_banner');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing kava_landing_banner:', e);
    }
  }
  return DEFAULT_LANDING_BANNER;
}

export function saveLandingBannerConfig(config: LandingBannerConfig): void {
  localStorage.setItem('kava_landing_banner', JSON.stringify(config));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_landing_banner_updated', { detail: config }));
}

export const DEFAULT_MEGA_MENU_CAMPAIGNS: MegaMenuCampaign[] = [
  {
    id: 'mmc-how-it-works',
    title: '4K Live Projection Wall v2.4',
    description: 'Transform any venue display into a real-time photo stream with automatic AI moderation.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    badgeText: 'NEW FEATURE',
    badgeStyle: 'amber',
    categoryTarget: 'how_it_works',
    ctaText: 'Explore Demo →',
    ctaAction: 'demo',
    priority: 10,
    targetLanguage: 'all',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mmc-capsule-types',
    title: 'Luxury Wedding Guest Studio',
    description: 'Custom QR cards, audio guestbook recordings, and high-resolution photo archives.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    badgeText: 'MOST POPULAR',
    badgeStyle: 'emerald',
    categoryTarget: 'capsule_types',
    ctaText: 'Create Capsule →',
    ctaAction: 'create',
    priority: 10,
    targetLanguage: 'all',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mmc-pricing',
    title: 'Annual Guild Pass — Save 17%',
    description: 'Unlock unlimited event capsules, 4K downloads, and priority support.',
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
    badgeText: 'LIMITED SEASON',
    badgeStyle: 'rose',
    categoryTarget: 'pricing',
    ctaText: 'View Plans →',
    ctaAction: 'scroll',
    ctaUrl: '#pricing',
    countdownEndTime: '2026-12-31T23:59:59Z',
    priority: 10,
    targetLanguage: 'all',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mmc-resources',
    title: '2026 Event Host Handbook',
    description: 'Free comprehensive guide to setting up guest QR cards and live event displays.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    badgeText: 'FREE GUIDE',
    badgeStyle: 'slate',
    categoryTarget: 'resources',
    ctaText: 'Read Guide →',
    ctaAction: 'demo',
    priority: 10,
    targetLanguage: 'all',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getStoredMegaMenuCampaigns(): MegaMenuCampaign[] {
  const saved = localStorage.getItem('kava_mega_menu_campaigns');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error('Error parsing kava_mega_menu_campaigns:', e);
    }
  }
  return DEFAULT_MEGA_MENU_CAMPAIGNS;
}

export function saveMegaMenuCampaigns(campaigns: MegaMenuCampaign[]): void {
  localStorage.setItem('kava_mega_menu_campaigns', JSON.stringify(campaigns));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_mega_menu_campaigns_updated', { detail: campaigns }));
}

export function getActiveCampaignsForCategory(category: string, langTarget: string = 'all', deviceTargetFilter: 'all' | 'desktop' | 'mobile_tablet' = 'all'): MegaMenuCampaign[] {
  const allCampaigns = getStoredMegaMenuCampaigns();
  const now = new Date().toISOString();

  const activeFiltered = allCampaigns.filter(c => {
    if (!c.active) return false;
    if (c.status && c.status === 'draft') return false;
    if (c.startDate && c.startDate > now) return false;
    if (c.endDate && c.endDate < now) return false;
    if (c.targetLanguage && c.targetLanguage !== 'all' && langTarget !== 'all' && c.targetLanguage !== langTarget) return false;
    if (c.deviceTarget && c.deviceTarget !== 'all' && deviceTargetFilter !== 'all' && c.deviceTarget !== deviceTargetFilter) return false;
    return c.categoryTarget === category || c.categoryTarget === 'all' || c.categoryTarget === 'navbar';
  });

  // Sort by priority descending, then by updatedAt descending
  return activeFiltered.sort((a, b) => {
    if ((b.priority || 0) !== (a.priority || 0)) {
      return (b.priority || 0) - (a.priority || 0);
    }
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });
}

export function getActiveCampaignForCategory(category: string, langTarget: string = 'all'): MegaMenuCampaign | null {
  const activeCampaigns = getActiveCampaignsForCategory(category, langTarget);
  return activeCampaigns.length > 0 ? activeCampaigns[0] : null;
}

// INVOICE & RECEIPT MANAGEMENT ENGINE
export interface KavaInvoice {
  id: string;
  workspaceId?: string;
  workspaceName: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly' | 'per_event' | 'one_time';
  amount: string;
  amountRaw: number;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  discountCode?: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  paymentMethod: string;
  transactionId: string;
  issueDate: string;
  timestamp: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  notes?: string;
  refundReason?: string;
  reissuedAt?: string;
  emailSentAt?: string;
}

export interface ReceiptTemplateSettings {
  companyName: string;
  companyLogoUrl: string;
  legalAddress: string;
  taxVatId: string;
  supportEmail: string;
  supportPhone: string;
  enableTax: boolean;
  taxRatePercent: number;
  taxLabel: string;
  invoicePrefix: string;
  invoiceNumberFormat: string;
  nextSequenceNumber: number;
  footerText: string;
  paymentInstructions: string;
  pdfHeaderColor: string;
  emailReceiptSubject: string;
  emailReceiptGreeting: string;
  emailReceiptFooter: string;
  defaultCurrency: string;
}

export interface BillingAuditLog {
  id: string;
  timestamp: string;
  action: string;
  adminEmail: string;
  workspaceName?: string;
  invoiceId?: string;
  amount?: string;
  details: string;
  status: 'Success' | 'Failed' | 'Warning';
}

export const DEFAULT_RECEIPT_SETTINGS: ReceiptTemplateSettings = {
  companyName: 'KAVA Event Technologies Inc.',
  companyLogoUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200&q=80',
  legalAddress: '742 Cybernetics Way, Suite 400, San Francisco, CA 94107, USA',
  taxVatId: 'US-VAT-98421049-X',
  supportEmail: 'billing@kava.app',
  supportPhone: '+1 (800) 555-KAVA',
  enableTax: true,
  taxRatePercent: 10,
  taxLabel: 'VAT (10%)',
  invoicePrefix: 'INV-',
  invoiceNumberFormat: 'INV-YYYY-XXXXX',
  nextSequenceNumber: 10042,
  footerText: 'Thank you for choosing KAVA Event Capsules! For billing inquiries, contact billing@kava.app. All digital plan subscriptions are non-transferable.',
  paymentInstructions: 'Automatic credit card billing via KAVA Payment Engine. For manual wire transfers, contact billing@kava.app.',
  pdfHeaderColor: '#0f172a',
  emailReceiptSubject: 'Your KAVA Subscription Receipt & Invoice',
  emailReceiptGreeting: 'Thank you for subscribing to KAVA!',
  emailReceiptFooter: 'Need help? Reply to this email or visit our help center at support.kava.app',
  defaultCurrency: 'USD'
};

export function getStoredReceiptSettings(): ReceiptTemplateSettings {
  if (typeof window === 'undefined') return DEFAULT_RECEIPT_SETTINGS;
  const saved = localStorage.getItem('kava_receipt_settings');
  if (saved) {
    try {
      return { ...DEFAULT_RECEIPT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error parsing kava_receipt_settings:', e);
    }
  }
  return DEFAULT_RECEIPT_SETTINGS;
}

export function saveStoredReceiptSettings(settings: ReceiptTemplateSettings): void {
  localStorage.setItem('kava_receipt_settings', JSON.stringify(settings));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_receipt_settings_updated', { detail: settings }));
}

export function getStoredInvoices(): KavaInvoice[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('kava_invoices');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Error parsing kava_invoices:', e);
    }
  }
  return [];
}

export function saveStoredInvoices(invoices: KavaInvoice[]): void {
  localStorage.setItem('kava_invoices', JSON.stringify(invoices));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_invoices_updated', { detail: invoices }));
}

export function getStoredBillingLogs(): BillingAuditLog[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('kava_billing_audit_logs');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Error parsing kava_billing_audit_logs:', e);
    }
  }
  return [
    {
      id: 'log-b-1',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      action: 'Initial Billing Engine Setup',
      adminEmail: 'finance@kava.app',
      workspaceName: 'System Core',
      details: 'Receipt template settings and automated sequence generator initialized.',
      status: 'Success'
    }
  ];
}

export function saveStoredBillingLogs(logs: BillingAuditLog[]): void {
  localStorage.setItem('kava_billing_audit_logs', JSON.stringify(logs));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_billing_logs_updated', { detail: logs }));
}

export function addBillingLog(logData: Omit<BillingAuditLog, 'id' | 'timestamp'>): void {
  const current = getStoredBillingLogs();
  const newLog: BillingAuditLog = {
    ...logData,
    id: `log-b-${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  saveStoredBillingLogs([newLog, ...current]);
}

// DETAILED FEATURE COMPARISON SYSTEM ENGINE
export interface PlanFeatureValue {
  status: 'included' | 'unlimited' | 'not_available' | 'custom';
  value?: string;
}

export interface ComparisonFeature {
  id: string;
  name: string;
  description?: string;
  tooltip?: string;
  visibleOnPublicTable: boolean;
  displayOrder: number;
  planValues: Record<string, PlanFeatureValue>;
}

export interface ComparisonCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  features: ComparisonFeature[];
}

export const DEFAULT_COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    id: 'cat-capsules-guests',
    name: 'Capsule & Guests',
    description: 'Event creation limits, guest upload access, and memory retention lifetime.',
    displayOrder: 1,
    features: [
      {
        id: 'feat-active-events',
        name: 'Active Event Capsules',
        description: 'Simultaneous active events allowed under account',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'custom', value: '1 Active Event' },
          'Premium': { status: 'custom', value: '10 Active Events' },
          'Enterprise': { status: 'unlimited', value: 'Unlimited Active Events' }
        }
      },
      {
        id: 'feat-guest-limit',
        name: 'Guest Contributors Limit',
        description: 'Max guests allowed to scan and upload per event',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'custom', value: '50 Guests' },
          'Premium': { status: 'custom', value: '500 Guests' },
          'Enterprise': { status: 'unlimited', value: 'Unlimited Guests' }
        }
      },
      {
        id: 'feat-guest-access-method',
        name: 'Guest Access Method',
        description: 'Zero app download required via QR & Web Link',
        visibleOnPublicTable: true,
        displayOrder: 3,
        planValues: {
          'Free': { status: 'included', value: 'QR Code & Web Link' },
          'Premium': { status: 'included', value: 'QR Code & Custom Event Slug' },
          'Enterprise': { status: 'included', value: 'QR, Custom Slug & White-Label Domain' }
        }
      },
      {
        id: 'feat-event-retention',
        name: 'Memory Retention Lifetime',
        description: 'How long host & guests can access files',
        visibleOnPublicTable: true,
        displayOrder: 4,
        planValues: {
          'Free': { status: 'custom', value: '30 Days Active Access' },
          'Premium': { status: 'custom', value: '365 Days Active Access' },
          'Enterprise': { status: 'unlimited', value: 'Permanent Lifetime Storage' }
        }
      }
    ]
  },
  {
    id: 'cat-storage-media',
    name: 'Storage & Media',
    description: 'Vault capacity, media resolutions, and supported format types.',
    displayOrder: 2,
    features: [
      {
        id: 'feat-storage-volume',
        name: 'High-Definition Cloud Storage Vault',
        description: 'Total cloud vault quota provided',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'custom', value: '0.5 GB Vault' },
          'Premium': { status: 'custom', value: '10 GB Vault' },
          'Enterprise': { status: 'custom', value: '100 GB Vault' }
        }
      },
      {
        id: 'feat-photo-quality',
        name: 'Photo Upload Resolution',
        description: 'Image processing and resolution scaling',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'custom', value: 'HD Quality (720p/1080p)' },
          'Premium': { status: 'custom', value: '4K Ultra HD (2160p)' },
          'Enterprise': { status: 'custom', value: 'Raw Uncompressed 4K' }
        }
      },
      {
        id: 'feat-video-uploads',
        name: '4K Video Clip Uploads',
        description: 'Video recording & upload stream support',
        visibleOnPublicTable: true,
        displayOrder: 3,
        planValues: {
          'Free': { status: 'not_available', value: 'Not Included' },
          'Premium': { status: 'included', value: 'Included (250MB per video)' },
          'Enterprise': { status: 'included', value: 'Included (2GB per video)' }
        }
      },
      {
        id: 'feat-audio-guestbook',
        name: 'Spoken Voice Wish Booth',
        description: 'Audio message recordings from venue guests',
        visibleOnPublicTable: true,
        displayOrder: 4,
        planValues: {
          'Free': { status: 'not_available', value: 'Not Included' },
          'Premium': { status: 'included', value: 'Included (Up to 300s/clip)' },
          'Enterprise': { status: 'unlimited', value: 'Unlimited Length Audio' }
        }
      }
    ]
  },
  {
    id: 'cat-live-experience',
    name: 'Live Experience',
    description: 'Real-time venue TV/projector presentation screen and interactive FX.',
    displayOrder: 3,
    features: [
      {
        id: 'feat-live-screen',
        name: '4K Venue Projection Wall',
        description: '60 FPS WebGL live slideshow for projectors & TVs',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'not_available', value: 'Not Included' },
          'Premium': { status: 'included', value: '60 FPS WebGL Engine' },
          'Enterprise': { status: 'included', value: 'Multi-Monitor Sync & Custom Themes' }
        }
      },
      {
        id: 'feat-live-reactions',
        name: 'Real-Time Reactions & Digital Toasts',
        description: 'Interactive applause and emoji floating animations on screen',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'not_available', value: 'Not Included' },
          'Premium': { status: 'included', value: 'Live Emoji & Reactions' },
          'Enterprise': { status: 'included', value: 'Custom Animated Toasts' }
        }
      },
      {
        id: 'feat-music-sync',
        name: 'Background Music & Slideshow Audio',
        description: 'Custom soundtrack playing alongside venue photo stream',
        visibleOnPublicTable: true,
        displayOrder: 3,
        planValues: {
          'Free': { status: 'not_available', value: 'Not Included' },
          'Premium': { status: 'included', value: 'Custom Audio Uploads' },
          'Enterprise': { status: 'included', value: 'Custom Audio Uploads' }
        }
      }
    ]
  },
  {
    id: 'cat-guest-contributions',
    name: 'Guest Contributions',
    description: 'Host moderation controls, guest studio tools, and printable QR standees.',
    displayOrder: 4,
    features: [
      {
        id: 'feat-moderation',
        name: 'Host Moderation Queue & PIN Lock',
        description: 'Approve guest photos before broadcasting to live screen',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'not_available', value: 'Auto-publish' },
          'Premium': { status: 'included', value: 'Real-time PIN Moderation' },
          'Enterprise': { status: 'included', value: 'AI Filter + PIN Moderation' }
        }
      },
      {
        id: 'feat-wish-cards',
        name: 'Digital Wish Notes & Guest Messages',
        description: 'Heartfelt guest text notes displayed on wall & vault',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'included', value: 'Standard Wish Cards' },
          'Premium': { status: 'included', value: 'Rich Wishes + Audio Voice' },
          'Enterprise': { status: 'included', value: 'Custom Designer Templates' }
        }
      },
      {
        id: 'feat-printable-qr',
        name: 'Custom QR Cards & Table Standees',
        description: 'Printable vector QR templates for venue tables',
        visibleOnPublicTable: true,
        displayOrder: 3,
        planValues: {
          'Free': { status: 'custom', value: 'Standard Digital QR' },
          'Premium': { status: 'included', value: 'High-Res Vector PDF Kit' },
          'Enterprise': { status: 'included', value: 'Custom Printed Acrylic Standees' }
        }
      }
    ]
  },
  {
    id: 'cat-branding',
    name: 'Branding & Customization',
    description: 'Watermark removal, custom color palettes, logos, and white-label domains.',
    displayOrder: 5,
    features: [
      {
        id: 'feat-watermark',
        name: 'Watermark Removal',
        description: 'Remove KAVA logo badge from guest portal & downloads',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'not_available', value: 'KAVA Watermark' },
          'Premium': { status: 'included', value: '100% Watermark Free' },
          'Enterprise': { status: 'included', value: '100% Watermark Free' }
        }
      },
      {
        id: 'feat-custom-logo',
        name: 'Custom Event Logo & Color Palette',
        description: 'Match capsule colors to wedding or brand theme',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'not_available', value: 'Default Palette' },
          'Premium': { status: 'included', value: 'Custom Logo & Color Palette' },
          'Enterprise': { status: 'included', value: 'Full White-Label Theme' }
        }
      },
      {
        id: 'feat-custom-domain',
        name: 'Custom White-Label Domain',
        description: 'Host capsule under your own custom domain name',
        visibleOnPublicTable: true,
        displayOrder: 3,
        planValues: {
          'Free': { status: 'not_available', value: 'Not Available' },
          'Premium': { status: 'not_available', value: 'Not Available' },
          'Enterprise': { status: 'included', value: 'Custom Domain / Subdomain' }
        }
      }
    ]
  },
  {
    id: 'cat-downloads-export',
    name: 'Downloads & Export',
    description: '1-click bulk ZIP vault archives and raw EXIF preservation.',
    displayOrder: 6,
    features: [
      {
        id: 'feat-zip-export',
        name: '1-Click Bulk ZIP Vault Export',
        description: 'Download all high-res photos and videos in one ZIP archive',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'included', value: 'Standard ZIP Download' },
          'Premium': { status: 'included', value: '1-Click 4K ZIP Vault' },
          'Enterprise': { status: 'included', value: 'Automated Cloud Vault Sync' }
        }
      },
      {
        id: 'feat-exif-data',
        name: 'Raw EXIF Metadata Preservation',
        description: 'Preserve camera specs, timestamps, and geolocation tags',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'not_available', value: 'Basic Metadata' },
          'Premium': { status: 'included', value: 'Full Original EXIF Data' },
          'Enterprise': { status: 'included', value: 'Full Original EXIF Data' }
        }
      }
    ]
  },
  {
    id: 'cat-analytics',
    name: 'Analytics',
    description: 'Guest participation metrics, download counts, and activity timelines.',
    displayOrder: 7,
    features: [
      {
        id: 'feat-analytics-dashboard',
        name: 'Guest Engagement Analytics',
        description: 'Track upload counts, peak venue activity, and guest downloads',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'not_available', value: 'Not Available' },
          'Premium': { status: 'included', value: 'Real-Time Insights Dashboard' },
          'Enterprise': { status: 'included', value: 'Advanced Analytics & Reports' }
        }
      }
    ]
  },
  {
    id: 'cat-support',
    name: 'Support',
    description: 'Host guidance, event day emergency help, and SLA guarantees.',
    displayOrder: 8,
    features: [
      {
        id: 'feat-support-level',
        name: 'Customer Support Tier',
        description: 'Dedicated support channel for hosts',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'custom', value: 'Standard Community Support' },
          'Premium': { status: 'custom', value: 'Priority Chat & Email Support' },
          'Enterprise': { status: 'custom', value: 'Dedicated Event Specialist' }
        }
      },
      {
        id: 'feat-sla-response',
        name: 'SLA Response Guarantee',
        description: 'Maximum response time during setup and event hours',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'custom', value: '48-Hour SLA' },
          'Premium': { status: 'custom', value: '4-Hour Priority SLA' },
          'Enterprise': { status: 'custom', value: '30-Minute Emergency SLA' }
        }
      }
    ]
  },
  {
    id: 'cat-security',
    name: 'Security',
    description: 'Access passcodes, encryption standards, and privacy controls.',
    displayOrder: 9,
    features: [
      {
        id: 'feat-passcode-lock',
        name: 'Event Passcode & PIN Access Lock',
        description: 'Restrict capsule access to verified guests only',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'included', value: 'Basic Event Passcode' },
          'Premium': { status: 'included', value: 'Host & Guest PIN Protection' },
          'Enterprise': { status: 'included', value: 'Role-Based PIN Access Control' }
        }
      },
      {
        id: 'feat-ssl-encryption',
        name: '256-Bit Bank-Grade Vault Encryption',
        description: 'Full end-to-end transport and storage encryption',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'included', value: '256-Bit SSL Encryption' },
          'Premium': { status: 'included', value: '256-Bit SSL + Encrypted Storage' },
          'Enterprise': { status: 'included', value: 'SOC2 Compliant Encrypted Vault' }
        }
      }
    ]
  },
  {
    id: 'cat-workspace-events',
    name: 'Workspace / Events',
    description: 'Multi-user team management, multi-event agency spaces, and API access.',
    displayOrder: 10,
    features: [
      {
        id: 'feat-team-seats',
        name: 'Team Member Seats',
        description: 'Co-hosts, planners, and photographer admin seats',
        visibleOnPublicTable: true,
        displayOrder: 1,
        planValues: {
          'Free': { status: 'custom', value: '1 Host Seat' },
          'Premium': { status: 'custom', value: 'Up to 5 Team Seats' },
          'Enterprise': { status: 'custom', value: 'Up to 50 Team Seats' }
        }
      },
      {
        id: 'feat-api-access',
        name: 'REST API & Webhook Integrations',
        description: 'Automate photo downloads and event creation via API',
        visibleOnPublicTable: true,
        displayOrder: 2,
        planValues: {
          'Free': { status: 'not_available', value: 'Not Included' },
          'Premium': { status: 'not_available', value: 'Not Included' },
          'Enterprise': { status: 'included', value: 'Full REST API & Webhooks' }
        }
      }
    ]
  }
];

export function getStoredComparisonCategories(): ComparisonCategory[] {
  if (typeof window === 'undefined') return DEFAULT_COMPARISON_CATEGORIES;
  const saved = localStorage.getItem('kava_comparison_categories');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error('Error parsing kava_comparison_categories:', e);
    }
  }
  localStorage.setItem('kava_comparison_categories', JSON.stringify(DEFAULT_COMPARISON_CATEGORIES));
  return DEFAULT_COMPARISON_CATEGORIES;
}

export function saveStoredComparisonCategories(categories: ComparisonCategory[]): void {
  localStorage.setItem('kava_comparison_categories', JSON.stringify(categories));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_comparison_updated', { detail: categories }));
}


