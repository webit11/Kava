import { SupportChannelConfig, SupportTicket } from '../types';

export const DEFAULT_SUPPORT_CHANNELS: SupportChannelConfig[] = [
  {
    id: 'chan-whatsapp',
    type: 'whatsapp',
    name: 'WhatsApp Live Chat',
    enabled: true,
    value: 'https://wa.me/18005550199',
    icon: 'MessageSquare',
    description: 'Instant response from our dedicated support concierge',
    businessHours: '24/7 Live Support',
    availabilityStatus: '24/7 Live',
    regionalVisibility: 'Global',
    order: 1,
    badgeText: 'Instant'
  },
  {
    id: 'chan-zalo',
    type: 'zalo',
    name: 'Zalo Official Support',
    enabled: true,
    value: 'https://zalo.me/kavastudio',
    icon: 'MessageCircle',
    description: 'Direct messaging for Southeast Asia workspace hosts',
    businessHours: 'Mon-Sat 8:00 AM - 10:00 PM ICT',
    availabilityStatus: 'Online',
    regionalVisibility: 'Asia Pacific',
    order: 2,
    badgeText: 'SEA Regional'
  },
  {
    id: 'chan-fb',
    type: 'facebook',
    name: 'Facebook Messenger',
    enabled: true,
    value: 'https://m.me/kava.studio',
    icon: 'Facebook',
    description: 'Connect with our social support & community team',
    businessHours: 'Mon-Fri 9:00 AM - 8:00 PM EST',
    availabilityStatus: 'Online',
    regionalVisibility: 'Global',
    order: 3
  },
  {
    id: 'chan-instagram',
    type: 'instagram',
    name: 'Instagram Direct',
    enabled: true,
    value: 'https://instagram.com/kavastudio',
    icon: 'Instagram',
    description: 'DM us for design advice, templates & event showcases',
    businessHours: 'Mon-Sun 10:00 AM - 10:00 PM EST',
    availabilityStatus: 'Online',
    regionalVisibility: 'Global',
    order: 4
  },
  {
    id: 'chan-telegram',
    type: 'telegram',
    name: 'Telegram Channel & Bot',
    enabled: true,
    value: 'https://t.me/kava_support_bot',
    icon: 'Send',
    description: 'Real-time alert bots & VIP event producer chat',
    businessHours: '24/7 Live Support',
    availabilityStatus: '24/7 Live',
    regionalVisibility: 'Global',
    order: 5,
    badgeText: 'Bot Ready'
  },
  {
    id: 'chan-line',
    type: 'line',
    name: 'LINE Official Account',
    enabled: true,
    value: 'https://line.me/R/ti/p/@kava',
    icon: 'Smartphone',
    description: 'Fast host assistance & automated ticket tracking',
    businessHours: 'Mon-Fri 9:00 AM - 7:00 PM JST',
    availabilityStatus: 'Online',
    regionalVisibility: 'Asia Pacific',
    order: 6
  },
  {
    id: 'chan-email',
    type: 'email',
    name: 'Email Support Queue',
    enabled: true,
    value: 'mailto:support@kava.co',
    icon: 'Mail',
    description: 'Detailed technical issues, billing disputes & enterprise SLAs',
    businessHours: '24/7 Queue • < 2 hr response',
    availabilityStatus: 'Online',
    regionalVisibility: 'Global',
    order: 7,
    badgeText: 'Priority SLA'
  },
  {
    id: 'chan-phone',
    type: 'phone',
    name: 'VIP Phone Concierge',
    enabled: true,
    value: 'tel:+18005555282',
    icon: 'Phone',
    description: 'Direct phone hotline for Enterprise & Pro Studio hosts',
    businessHours: 'Mon-Fri 8:00 AM - 6:00 PM EST',
    availabilityStatus: 'Online',
    regionalVisibility: 'North America',
    order: 8,
    badgeText: 'Enterprise Only'
  },
  {
    id: 'chan-website',
    type: 'website',
    name: 'Knowledge Base & Help Desk',
    enabled: true,
    value: 'https://help.kava.co',
    icon: 'Globe',
    description: 'Comprehensive setup guides, video tutorials & API docs',
    businessHours: 'Self-Serve 24/7',
    availabilityStatus: 'Online',
    regionalVisibility: 'Global',
    order: 9
  }
];

export function getStoredSupportChannels(): SupportChannelConfig[] {
  if (typeof window === 'undefined') return DEFAULT_SUPPORT_CHANNELS;
  const saved = localStorage.getItem('kava_support_channels');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse kava_support_channels', e);
    }
  }
  return DEFAULT_SUPPORT_CHANNELS;
}

export function saveStoredSupportChannels(channels: SupportChannelConfig[]): void {
  localStorage.setItem('kava_support_channels', JSON.stringify(channels));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('kava_support_channels_updated', { detail: channels }));
}

export function resolveChannelUrl(type: string, value: string): string {
  const val = value.trim();
  if (!val) return '#';
  if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('mailto:') || val.startsWith('tel:')) {
    return val;
  }
  
  // Format helpers
  if (type === 'whatsapp') {
    const digits = val.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
  if (type === 'zalo') {
    if (val.startsWith('zalo.me/')) return `https://${val}`;
    return `https://zalo.me/${val}`;
  }
  if (type === 'facebook') {
    if (val.startsWith('m.me/')) return `https://${val}`;
    return `https://m.me/${val}`;
  }
  if (type === 'instagram') {
    const handle = val.replace(/^@/, '');
    return `https://instagram.com/${handle}`;
  }
  if (type === 'telegram') {
    const user = val.replace(/^@/, '');
    return `https://t.me/${user}`;
  }
  if (type === 'line') {
    return `https://line.me/R/ti/p/@${val.replace(/^@/, '')}`;
  }
  if (type === 'email') {
    return `mailto:${val}`;
  }
  if (type === 'phone') {
    return `tel:${val.replace(/\s+/g, '')}`;
  }
  return val.startsWith('http') ? val : `https://${val}`;
}
