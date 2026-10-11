import { useState, useEffect } from 'react';

export interface FeatureFlagDependency {
  key: string;
  name: string;
  statusRequired: string;
}

export interface FeatureFlagWhereUsed {
  page: string;
  component: string;
  description: string;
}

export interface FeatureFlagTestMode {
  enabled: boolean;
  allowedUsers: string[];
  allowedWorkspaces: string[];
  allowedEvents: string[];
  internalOnly: boolean;
}

export interface FeatureFlagConfig {
  key: string;
  name: string;
  category: 'Core Media' | 'AI & Processing' | 'Live Projection' | 'Collaboration & Access' | 'Support & Commerce';
  desc: string;
  enabled: boolean;
  rollout: number; // 0 to 100
  status: 'Enabled' | 'Disabled' | 'Beta' | 'Gradual Rollout';
  affectedModules: ('Host Dashboard' | 'Guest Experience' | 'Landing Page' | 'Live Screen' | 'Super Admin Portal')[];
  whereUsed: FeatureFlagWhereUsed[];
  dependencies: FeatureFlagDependency[];
  testMode: FeatureFlagTestMode;
  lastUpdated?: string;
  updatedBy?: string;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlagConfig[] = [
  {
    key: 'video_greetings',
    name: 'Video Guestbook Greetings',
    category: 'Core Media',
    desc: 'Allow hosts and guests to record visual video introduction greetings with face filters and voice prompts.',
    enabled: true,
    rollout: 100,
    status: 'Enabled',
    affectedModules: ['Host Dashboard', 'Guest Experience', 'Live Screen'],
    whereUsed: [
      { page: 'Guest Experience', component: 'VideoGreetingRecorder.tsx', description: 'Webcam recording booth & greeting preview player' },
      { page: 'Host Dashboard', component: 'HostDashboard.tsx', description: 'Video Greetings tab & host intro setup' },
      { page: 'Live Screen', component: 'LiveExperience.tsx', description: 'Video contribution overlay on live projection wall' }
    ],
    dependencies: [],
    testMode: {
      enabled: false,
      allowedUsers: ['arthawibawa777@gmail.com', 'sofia.chen@weddingmail.com'],
      allowedWorkspaces: ['ws-wedding-2026', 'ws-vip-demo'],
      allowedEvents: ['KAVA-2026', 'VIP-WEDDING'],
      internalOnly: false
    }
  },
  {
    key: 'high_fidelity_zip',
    name: 'RAW ZIP Media Compilation',
    category: 'Core Media',
    desc: 'Package and export all media contributions in pristine native RAW resolutions without lossy compression.',
    enabled: true,
    rollout: 100,
    status: 'Enabled',
    affectedModules: ['Host Dashboard', 'Super Admin Portal'],
    whereUsed: [
      { page: 'Host Dashboard', component: 'HostDashboard.tsx', description: 'Export Media Archive modal with RAW uncompressed ZIP toggle' },
      { page: 'Super Admin Portal', component: 'SuperAdminPortal.tsx', description: 'System Storage & Batch Media Exporter' }
    ],
    dependencies: [],
    testMode: {
      enabled: false,
      allowedUsers: [],
      allowedWorkspaces: [],
      allowedEvents: [],
      internalOnly: false
    }
  },
  {
    key: 'ai_audio_ducking',
    name: 'Smart Voice BGM Ducking',
    category: 'AI & Processing',
    desc: 'Utilize AI frequency compression to automatically lower background music volume when audio/video wishes play.',
    enabled: false,
    rollout: 25,
    status: 'Gradual Rollout',
    affectedModules: ['Host Dashboard', 'Live Screen'],
    whereUsed: [
      { page: 'Live Screen', component: 'LiveExperience.tsx', description: 'Live Projection audio engine with auto ducking equalizer' },
      { page: 'Host Dashboard', component: 'HostDashboard.tsx', description: 'Voice Wish preview audio player' }
    ],
    dependencies: [
      { key: 'video_greetings', name: 'Video Guestbook Greetings', statusRequired: 'Enabled' }
    ],
    testMode: {
      enabled: true,
      allowedUsers: ['arthawibawa777@gmail.com'],
      allowedWorkspaces: ['ws-vip-demo'],
      allowedEvents: ['KAVA-2026'],
      internalOnly: true
    }
  },
  {
    key: 'custom_luts',
    name: 'Creative LUT Color Filters',
    category: 'Core Media',
    desc: 'Enable guests to apply professional retro color mapping formulas and vintage film LUTs onto camera captures.',
    enabled: true,
    rollout: 50,
    status: 'Gradual Rollout',
    affectedModules: ['Guest Experience', 'Host Dashboard'],
    whereUsed: [
      { page: 'Guest Experience', component: 'GuestFlow.tsx', description: 'Photo camera capture booth with retro film preset sliders' },
      { page: 'Host Dashboard', component: 'BrandKitTab.tsx', description: 'Brand Kit default camera filter preset picker' }
    ],
    dependencies: [],
    testMode: {
      enabled: false,
      allowedUsers: [],
      allowedWorkspaces: [],
      allowedEvents: [],
      internalOnly: false
    }
  },
  {
    key: 'multi_user_collab',
    name: 'Real-Time Co-hosting Channels',
    category: 'Collaboration & Access',
    desc: 'Permit multiple admin hosts to co-manage live event workspaces and guest moderation queues simultaneously.',
    enabled: false,
    rollout: 10,
    status: 'Beta',
    affectedModules: ['Host Dashboard', 'Super Admin Portal'],
    whereUsed: [
      { page: 'Host Dashboard', component: 'WorkspaceSettingsTab.tsx', description: 'Team Members & Co-Host Inviter panel' },
      { page: 'Super Admin Portal', component: 'SuperAdminPortal.tsx', description: 'Cross-workspace admin privilege auditor' }
    ],
    dependencies: [],
    testMode: {
      enabled: true,
      allowedUsers: ['arthawibawa777@gmail.com', 'admin@kava.co'],
      allowedWorkspaces: ['ws-kava-internal'],
      allowedEvents: ['ALPHA-TEST'],
      internalOnly: true
    }
  },
  {
    key: 'live_screen_ai_moderation',
    name: 'AI Real-time Safety Guard',
    category: 'AI & Processing',
    desc: 'Automatically scan incoming guest photos and text wishes for NSFW/profanity before projecting on the live wall.',
    enabled: true,
    rollout: 75,
    status: 'Gradual Rollout',
    affectedModules: ['Host Dashboard', 'Live Screen', 'Super Admin Portal'],
    whereUsed: [
      { page: 'Live Screen', component: 'LiveExperience.tsx', description: 'Live Wall contribution stream & AI Safety Status Badge' },
      { page: 'Host Dashboard', component: 'HostDashboard.tsx', description: 'Moderation Queue AI Auto-Approve thresholds' },
      { page: 'Super Admin Portal', component: 'SuperAdminPortal.tsx', description: 'Trust & Safety Moderation Desk' }
    ],
    dependencies: [],
    testMode: {
      enabled: false,
      allowedUsers: [],
      allowedWorkspaces: [],
      allowedEvents: [],
      internalOnly: false
    }
  },
  {
    key: 'support_concierge_widget',
    name: 'Live Support Concierge Widget',
    category: 'Support & Commerce',
    desc: 'Display a floating multi-channel live support concierge button for instant help across all public pages.',
    enabled: true,
    rollout: 100,
    status: 'Enabled',
    affectedModules: ['Landing Page', 'Host Dashboard', 'Guest Experience'],
    whereUsed: [
      { page: 'Landing Page', component: 'LandingPage.tsx', description: 'Floating Support Concierge launcher & contact options' },
      { page: 'Host Dashboard', component: 'HostDashboard.tsx', description: 'Workspace header Live Support button & ticket creator' },
      { page: 'Guest Experience', component: 'GuestFlow.tsx', description: 'Guest help modal trigger in navigation footer' }
    ],
    dependencies: [],
    testMode: {
      enabled: false,
      allowedUsers: [],
      allowedWorkspaces: [],
      allowedEvents: [],
      internalOnly: false
    }
  },
  {
    key: 'currency_multi_support',
    name: 'Multi-Currency Dynamic Billing',
    category: 'Support & Commerce',
    desc: 'Support multi-currency switching (USD, EUR, GBP, IDR, JPY, AUD) across subscription plans and guest gifts.',
    enabled: true,
    rollout: 100,
    status: 'Enabled',
    affectedModules: ['Landing Page', 'Host Dashboard', 'Super Admin Portal'],
    whereUsed: [
      { page: 'Landing Page', component: 'CurrencySelector.tsx', description: 'Header currency dropdown switcher' },
      { page: 'Host Dashboard', component: 'SubscriptionManagement.tsx', description: 'Plan upgrade currency price calculator' },
      { page: 'Super Admin Portal', component: 'SuperAdminPortal.tsx', description: 'Revenue analytics & multi-currency plan editor' }
    ],
    dependencies: [],
    testMode: {
      enabled: false,
      allowedUsers: [],
      allowedWorkspaces: [],
      allowedEvents: [],
      internalOnly: false
    }
  }
];

const STORAGE_KEY = 'kava_admin_flags_v2';

export function getStoredFeatureFlags(): FeatureFlagConfig[] {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing fields if defaults updated
        return DEFAULT_FEATURE_FLAGS.map(def => {
          const found = parsed.find((p: FeatureFlagConfig) => p.key === def.key);
          if (found) {
            return {
              ...def,
              ...found,
              testMode: { ...def.testMode, ...(found.testMode || {}) },
              whereUsed: found.whereUsed || def.whereUsed,
              dependencies: found.dependencies || def.dependencies
            };
          }
          return def;
        });
      }
    }
  } catch (e) {
    console.error('Failed to parse stored feature flags', e);
  }
  return DEFAULT_FEATURE_FLAGS;
}

export function saveStoredFeatureFlags(flags: FeatureFlagConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    // Dispatch real-time cross-component sync event
    window.dispatchEvent(new Event('kava_feature_flags_updated'));
  } catch (e) {
    console.error('Failed to save feature flags', e);
  }
}

export function isFeatureEnabled(
  key: string,
  context?: {
    userEmail?: string;
    workspaceId?: string;
    eventCode?: string;
    isInternalAdmin?: boolean;
  }
): boolean {
  const flags = getStoredFeatureFlags();
  const flag = flags.find(f => f.key === key);
  if (!flag) return true; // Default fallback if flag not found

  // 1. If global toggle is completely off and test mode is off -> disabled
  if (!flag.enabled && !flag.testMode?.enabled) {
    return false;
  }

  // 2. Check Test Mode overrides if enabled
  if (flag.testMode?.enabled) {
    if (context) {
      // Check internal staff rule
      if (flag.testMode.internalOnly) {
        if (context.isInternalAdmin || (context.userEmail && (context.userEmail.endsWith('@kava.co') || context.userEmail === 'arthawibawa777@gmail.com'))) {
          return true;
        }
      }
      // Check user email whitelist
      if (context.userEmail && flag.testMode.allowedUsers?.some(u => u.toLowerCase() === context.userEmail?.toLowerCase())) {
        return true;
      }
      // Check workspace whitelist
      if (context.workspaceId && flag.testMode.allowedWorkspaces?.includes(context.workspaceId)) {
        return true;
      }
      // Check event code whitelist
      if (context.eventCode && flag.testMode.allowedEvents?.includes(context.eventCode)) {
        return true;
      }
    }
    // If flag itself is disabled globally and test mode didn't match -> false
    if (!flag.enabled) return false;
  }

  // 3. Rollout percentage check
  if (flag.rollout >= 100) return true;
  if (flag.rollout <= 0) return false;

  // Simple deterministic percentile based on user string or random seed
  if (context?.userEmail) {
    let hash = 0;
    for (let i = 0; i < context.userEmail.length; i++) {
      hash = (hash << 5) - hash + context.userEmail.charCodeAt(i);
      hash |= 0;
    }
    const score = Math.abs(hash) % 100;
    return score < flag.rollout;
  }

  return true;
}

export function useFeatureFlag(
  key: string,
  context?: {
    userEmail?: string;
    workspaceId?: string;
    eventCode?: string;
    isInternalAdmin?: boolean;
  }
): boolean {
  const [enabled, setEnabled] = useState(() => isFeatureEnabled(key, context));

  useEffect(() => {
    const handleSync = () => {
      setEnabled(isFeatureEnabled(key, context));
    };

    window.addEventListener('kava_feature_flags_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('kava_feature_flags_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [key, JSON.stringify(context)]);

  return enabled;
}

export function useAllFeatureFlags(): FeatureFlagConfig[] {
  const [flags, setFlags] = useState<FeatureFlagConfig[]>(() => getStoredFeatureFlags());

  useEffect(() => {
    const handleSync = () => {
      setFlags(getStoredFeatureFlags());
    };

    window.addEventListener('kava_feature_flags_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('kava_feature_flags_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  return flags;
}
