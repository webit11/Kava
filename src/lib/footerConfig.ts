import { FooterConfig } from '../types';

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  id: 'kava_default_footer',
  brandName: 'KAVA',
  tagline: `"We don't store files. We preserve memories."`,
  description: 'KAVA is the collaborative memory capsule platform for weddings, milestones, and family circles. Preserve raw, authentic moments together inside one beautiful vault.',
  copyrightText: '© 2026 KAVA Inc. Designed with care in Big Sur.',
  badgeTagline: 'Start Preserving Today',
  ctaHeadline: 'Create a timeless memory capsule for your special event.',
  ctaDescription: 'Give your wedding, graduation, or family gathering the emotional storage it deserves. Setting up takes less than 60 seconds.',
  ctaTrustIndicator: 'No app required • Free to start • Setup in under 60 seconds',
  primaryCtaText: 'Create Your Capsule',
  primaryCtaAction: 'create',
  secondaryCtaText: 'Explore Live Sandbox',
  secondaryCtaAction: 'demo',
  socialLinks: [
    { id: 'soc_1', platform: 'instagram', url: 'https://instagram.com/kavacapsules', label: 'Instagram', enabled: true },
    { id: 'soc_2', platform: 'facebook', url: 'https://facebook.com/kavacapsules', label: 'Facebook', enabled: true },
    { id: 'soc_3', platform: 'linkedin', url: 'https://linkedin.com/company/kava-capsules', label: 'LinkedIn', enabled: true },
    { id: 'soc_4', platform: 'twitter', url: 'https://x.com/kavacapsules', label: 'X (Twitter)', enabled: true },
    { id: 'soc_5', platform: 'email', url: 'mailto:hello@kava.com', label: 'Email Us', enabled: true },
  ],
  trustBadges: [
    { id: 'tb_1', iconName: 'camera', label: 'Raw Photos' },
    { id: 'tb_2', iconName: 'smartphone', label: 'No Guest App' },
    { id: 'tb_3', iconName: 'tv', label: 'Live Gallery' },
    { id: 'tb_4', iconName: 'shield', label: 'Secure Storage' },
  ],
  columns: [
    {
      id: 'col_product',
      title: 'Product',
      links: [
        { id: 'pl_1', label: 'How It Works', href: '#how-it-works', actionType: 'scroll' },
        { id: 'pl_2', label: 'Memory Types', href: '#memory-types', actionType: 'scroll' },
        { id: 'pl_3', label: 'Pricing Plans', href: '#pricing', actionType: 'scroll' },
        { id: 'pl_4', label: 'Interactive Sandbox', href: '#demo', actionType: 'demo', badge: 'Live' },
      ],
    },
    {
      id: 'col_resources',
      title: 'Resources',
      links: [
        { id: 'rl_1', label: 'FAQ', href: '#faq', actionType: 'scroll' },
        { id: 'rl_2', label: 'Host Guide', href: '#faq', actionType: 'scroll' },
        { id: 'rl_3', label: 'Contact Support', href: '#support', actionType: 'modal' },
        { id: 'rl_4', label: 'System Status', href: 'https://status.kava.com', isExternal: true, badge: 'Operational' },
      ],
    },
    {
      id: 'col_company',
      title: 'Company',
      links: [
        { id: 'cl_1', label: 'About KAVA', href: '#how-it-works', actionType: 'scroll' },
        { id: 'cl_2', label: 'Privacy Policy', href: '#faq', actionType: 'scroll' },
        { id: 'cl_3', label: 'Terms of Service', href: '#faq', actionType: 'scroll' },
        { id: 'cl_4', label: 'Trust & Safety', href: '#how-it-works', actionType: 'scroll' },
      ],
    },
    {
      id: 'col_connect',
      title: 'Connect',
      links: [
        { id: 'cn_1', label: 'hello@kava.com', href: 'mailto:hello@kava.com', isExternal: true },
        { id: 'cn_2', label: 'Instagram', href: 'https://instagram.com/kavacapsules', isExternal: true },
        { id: 'cn_3', label: 'Facebook', href: 'https://facebook.com/kavacapsules', isExternal: true },
        { id: 'cn_4', label: 'LinkedIn', href: 'https://linkedin.com/company/kava-capsules', isExternal: true },
      ],
    },
  ],
  updatedAt: new Date().toISOString(),
};

export function getStoredFooterConfig(): FooterConfig {
  try {
    const raw = localStorage.getItem('kava_footer_config');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_FOOTER_CONFIG,
        ...parsed,
        socialLinks: parsed.socialLinks || DEFAULT_FOOTER_CONFIG.socialLinks,
        trustBadges: parsed.trustBadges || DEFAULT_FOOTER_CONFIG.trustBadges,
        columns: parsed.columns || DEFAULT_FOOTER_CONFIG.columns,
      };
    }
  } catch (e) {
    console.error('Failed to load kava_footer_config', e);
  }
  return DEFAULT_FOOTER_CONFIG;
}

export function saveStoredFooterConfig(config: FooterConfig): void {
  try {
    const updated = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('kava_footer_config', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('kava_footer_config_updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to save kava_footer_config', e);
  }
}
