import { OnboardingGuide, TooltipItem, OnboardingAnalytics } from '../types';

export const DEFAULT_ONBOARDING_GUIDE: OnboardingGuide = {
  id: 'guide_host_master_v1',
  name: 'Host Workspace Master Tour',
  version: '1.0',
  status: 'active',
  targetRole: 'Host',
  triggerType: 'first_login',
  requiredPlan: 'All',
  language: 'en',
  steps: [
    {
      id: 'step_1',
      targetId: '#nav-workspace',
      title: 'Welcome to your Workspace Hub',
      description: 'This is your centralized command center for managing event capsules, team seats, brand kits, and domain settings.',
      position: 'bottom',
      ctaText: 'Explore Workspace',
      ctaAction: 'navigate_workspace'
    },
    {
      id: 'step_2',
      targetId: '#btn-create-capsule',
      title: 'Create Your First Memory Capsule',
      description: 'Click here anytime to start a new event capsule, select a custom cover theme, and set guest upload permissions in seconds.',
      position: 'bottom',
      ctaText: 'Got It'
    },
    {
      id: 'step_3',
      targetId: '#nav-events',
      title: 'Capsules Catalog & Media Stats',
      description: 'Track all active and archived event capsules, inspect live uploads, and review total guest contributions.',
      position: 'bottom',
      ctaText: 'Next'
    },
    {
      id: 'step_4',
      targetId: '#nav-guest-studio',
      title: 'Guest Experience & QR Studio',
      description: 'Customize guest upload landing pages, print luxury table stand QR cards, and record digital video greetings.',
      position: 'bottom',
      ctaText: 'View Studio'
    },
    {
      id: 'step_5',
      targetId: '#nav-live-screen',
      title: 'Live Projection Wall',
      description: 'Launch real-time slideshow walls for venue projectors with custom backgrounds, music mixing, and moderation rules.',
      position: 'bottom',
      ctaText: 'Next'
    },
    {
      id: 'step_6',
      targetId: '#nav-billing',
      title: 'Subscription & Cloud Quotas',
      description: 'Manage active plans, upgrade video storage, unlock 4K streaming, and claim promotional coupons.',
      position: 'bottom',
      ctaText: 'Check Billing'
    },
    {
      id: 'step_7',
      targetId: '#nav-team',
      title: 'Collaborative Team Seats',
      description: 'Invite co-hosts, event planners, and official photographers with granular workspace access controls.',
      position: 'bottom',
      ctaText: 'Next'
    },
    {
      id: 'step_8',
      targetId: '#nav-help',
      title: 'Help Center & Guided Assistant',
      description: 'Access complete documentation, re-trigger product tours, inspect tooltips, and contact live support 24/7.',
      position: 'bottom',
      ctaText: 'Finish Tour'
    }
  ],
  updatedAt: new Date().toISOString()
};

export const DEFAULT_TOOLTIPS: TooltipItem[] = [
  {
    id: 'btn-create-capsule',
    title: 'Create Event Capsule',
    content: 'Launch a new interactive memory capsule for weddings, celebrations, or corporate galas.',
    position: 'top',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'nav-workspace',
    title: 'Workspace Management',
    content: 'Switch workspaces, view team members, and check domain configurations.',
    position: 'bottom',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'nav-events',
    title: 'Events Catalog',
    content: 'Manage all active memory capsules and track live guest contribution counts.',
    position: 'bottom',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'nav-guest-studio',
    title: 'Guest Studio & QR Cards',
    content: 'Customize upload forms, print QR stand cards, and enable voice greetings.',
    position: 'bottom',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'nav-live-screen',
    title: 'Live Slideshow Projection',
    content: 'Broadcast real-time photo and video walls on venue projectors.',
    position: 'bottom',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'nav-billing',
    title: 'Subscription & Billing',
    content: 'View current plan limits, upgrade storage quotas, and claim promo coupons.',
    position: 'bottom',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'nav-team',
    title: 'Team Management',
    content: 'Invite co-hosts, photographers, and assign workspace administrative roles.',
    position: 'bottom',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'nav-help',
    title: 'Help & Product Tours',
    content: 'Access interactive guides, documentation, and live 24/7 support.',
    position: 'bottom',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'btn-export-json',
    title: 'Export Capsule Data',
    content: 'Download all capsule metadata, guest records, and configuration settings in standard JSON format.',
    position: 'top',
    enabled: true,
    roleRestriction: 'host'
  },
  {
    id: 'btn-share-invite',
    title: 'Share Invite Link',
    content: 'Copy the instant guest upload link to share via WhatsApp, email, or SMS.',
    position: 'top',
    enabled: true,
    roleRestriction: 'all'
  },
  {
    id: 'btn-live-wall-launch',
    title: 'Launch Live Screen',
    content: 'Open the full-screen interactive slideshow window ready for venue HDMI connection.',
    position: 'top',
    enabled: true,
    roleRestriction: 'host'
  },
  {
    id: 'toggle-instant-reveal',
    title: 'Instant Reveal',
    content: 'When enabled, guest uploads appear immediately on the live wall without manual moderation.',
    position: 'top',
    enabled: true,
    roleRestriction: 'host'
  },
  {
    id: 'btn-brand-kit',
    title: 'Custom Brand Kit',
    content: 'Apply custom logos, color schemes, and fonts to all guest-facing interfaces.',
    position: 'top',
    enabled: true,
    roleRestriction: 'host'
  },
  {
    id: 'btn-download-all',
    title: 'Download All Memories',
    content: 'Export high-resolution photos, 4K videos, and voice recordings as a single ZIP archive.',
    position: 'top',
    enabled: true,
    roleRestriction: 'host'
  }
];

export const DEFAULT_ANALYTICS: OnboardingAnalytics = {
  totalTourStarts: 142,
  totalTourCompletions: 118,
  totalTourSkips: 24,
  totalTooltipViews: 860,
  stepDropOffs: {
    'step_1': 142,
    'step_2': 138,
    'step_3': 134,
    'step_4': 130,
    'step_5': 126,
    'step_6': 124,
    'step_7': 120,
    'step_8': 118
  },
  updatedAt: new Date().toISOString()
};

// Storage keys
const GUIDES_STORAGE_KEY = 'kava_onboarding_guides';
const TOOLTIPS_STORAGE_KEY = 'kava_tooltips_config';
const ANALYTICS_STORAGE_KEY = 'kava_onboarding_analytics';
const USER_COMPLETED_TOURS_KEY = 'kava_completed_tours';

export function getStoredGuides(): OnboardingGuide[] {
  try {
    const data = localStorage.getItem(GUIDES_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse onboarding guides:', e);
  }
  saveStoredGuides([DEFAULT_ONBOARDING_GUIDE]);
  return [DEFAULT_ONBOARDING_GUIDE];
}

export function saveStoredGuides(guides: OnboardingGuide[]): void {
  try {
    localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(guides));
    window.dispatchEvent(new CustomEvent('kava_guides_updated', { detail: guides }));
  } catch (e) {
    console.error('Failed to save onboarding guides:', e);
  }
}

export function getStoredTooltips(): TooltipItem[] {
  try {
    const data = localStorage.getItem(TOOLTIPS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse tooltips:', e);
  }
  saveStoredTooltips(DEFAULT_TOOLTIPS);
  return DEFAULT_TOOLTIPS;
}

export function saveStoredTooltips(tooltips: TooltipItem[]): void {
  try {
    localStorage.setItem(TOOLTIPS_STORAGE_KEY, JSON.stringify(tooltips));
    window.dispatchEvent(new CustomEvent('kava_tooltips_updated', { detail: tooltips }));
  } catch (e) {
    console.error('Failed to save tooltips:', e);
  }
}

export function getStoredAnalytics(): OnboardingAnalytics {
  try {
    const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse onboarding analytics:', e);
  }
  saveStoredAnalytics(DEFAULT_ANALYTICS);
  return DEFAULT_ANALYTICS;
}

export function saveStoredAnalytics(analytics: OnboardingAnalytics): void {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    window.dispatchEvent(new CustomEvent('kava_analytics_updated', { detail: analytics }));
  } catch (e) {
    console.error('Failed to save onboarding analytics:', e);
  }
}

export function trackTourEvent(eventType: 'start' | 'complete' | 'skip' | 'step', stepId?: string): void {
  const analytics = getStoredAnalytics();
  if (eventType === 'start') {
    analytics.totalTourStarts += 1;
  } else if (eventType === 'complete') {
    analytics.totalTourCompletions += 1;
  } else if (eventType === 'skip') {
    analytics.totalTourSkips += 1;
  }
  if (stepId) {
    analytics.stepDropOffs[stepId] = (analytics.stepDropOffs[stepId] || 0) + 1;
  }
  analytics.updatedAt = new Date().toISOString();
  saveStoredAnalytics(analytics);
}

export function trackTooltipView(tooltipId: string): void {
  const analytics = getStoredAnalytics();
  analytics.totalTooltipViews += 1;
  analytics.updatedAt = new Date().toISOString();
  saveStoredAnalytics(analytics);
}

export function isTourCompleted(guideId: string, version: string): boolean {
  try {
    const data = localStorage.getItem(USER_COMPLETED_TOURS_KEY);
    if (data) {
      const completed: Record<string, string> = JSON.parse(data);
      return completed[guideId] === version;
    }
  } catch (e) {
    console.error('Failed to check completed tour state:', e);
  }
  return false;
}

export function markTourCompleted(guideId: string, version: string): void {
  try {
    const data = localStorage.getItem(USER_COMPLETED_TOURS_KEY);
    let completed: Record<string, string> = {};
    if (data) {
      completed = JSON.parse(data);
    }
    completed[guideId] = version;
    localStorage.setItem(USER_COMPLETED_TOURS_KEY, JSON.stringify(completed));
  } catch (e) {
    console.error('Failed to mark tour as completed:', e);
  }
}
