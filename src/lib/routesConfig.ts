import React from 'react';
import { 
  QrCode, 
  Tv, 
  ShieldCheck, 
  Download, 
  Heart, 
  Sparkles, 
  Users, 
  Camera, 
  CheckCircle2, 
  Award, 
  Globe, 
  Tag, 
  HelpCircle, 
  Play, 
  MessageSquare, 
  Star,
  Lock,
  FileText,
  Info
} from 'lucide-react';

export interface MegaSubMenuItem {
  id: string;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  iconName: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  subViewKey: string;
  action?: 'route' | 'demo';
}

export interface MegaCategoryConfig {
  id: 'how_it_works' | 'capsule_types' | 'pricing' | 'resources';
  labelKey: string;
  defaultLabel: string;
  headerKey: string;
  defaultHeader: string;
  mainPath: string;
  items: MegaSubMenuItem[];
}

export const MEGA_MENU_CONFIG: MegaCategoryConfig[] = [
  {
    id: 'how_it_works',
    labelKey: 'nav.how_it_works',
    defaultLabel: 'How It Works',
    headerKey: 'megamenu.how_it_works',
    defaultHeader: 'How KAVA Preserves Memories',
    mainPath: '/how-it-works',
    items: [
      {
        id: 'qr-access',
        titleKey: 'megamenu.how_qr_title',
        defaultTitle: 'Instant QR Guest Access',
        descKey: 'megamenu.how_qr_desc',
        defaultDesc: 'Zero app downloads required — guests point camera & share.',
        iconName: 'QrCode',
        icon: QrCode,
        path: '/how-it-works/qr-access',
        subViewKey: 'how-it-works-qr'
      },
      {
        id: 'projection-stream',
        titleKey: 'megamenu.how_proj_title',
        defaultTitle: 'Real-Time 4K Projection Stream',
        descKey: 'megamenu.how_proj_desc',
        defaultDesc: 'Watch memories compile live on venue projection displays.',
        iconName: 'Tv',
        icon: Tv,
        path: '/how-it-works/projection-stream',
        subViewKey: 'how-it-works-projection'
      },
      {
        id: 'moderation',
        titleKey: 'megamenu.how_mod_title',
        defaultTitle: 'Host Moderation & Privacy Controls',
        descKey: 'megamenu.how_mod_desc',
        defaultDesc: 'Full approval workflows, guest codes, and privacy levels.',
        iconName: 'ShieldCheck',
        icon: ShieldCheck,
        path: '/how-it-works/moderation',
        subViewKey: 'how-it-works-moderation'
      },
      {
        id: 'vault',
        titleKey: 'megamenu.how_vault_title',
        defaultTitle: '4K Vault Lossless Archiving',
        descKey: 'megamenu.how_vault_desc',
        defaultDesc: 'Export high-res photos, 4K videos, and spoken audio wishes.',
        iconName: 'Download',
        icon: Download,
        path: '/how-it-works/vault',
        subViewKey: 'how-it-works-vault'
      }
    ]
  },
  {
    id: 'capsule_types',
    labelKey: 'nav.capsule_types',
    defaultLabel: 'Capsule Types',
    headerKey: 'megamenu.capsule_types',
    defaultHeader: 'Memory Capsule Collections',
    mainPath: '/capsule-types',
    items: [
      {
        id: 'weddings',
        titleKey: 'megamenu.cap_wedding_title',
        defaultTitle: 'Weddings & Anniversaries',
        descKey: 'megamenu.cap_wedding_desc',
        defaultDesc: 'Digital guestbook with audio wishes, photo stream & QR cards.',
        iconName: 'Heart',
        icon: Heart,
        path: '/capsule-types/weddings',
        subViewKey: 'capsule-weddings'
      },
      {
        id: 'birthdays',
        titleKey: 'megamenu.cap_bday_title',
        defaultTitle: 'Birthdays & Milestone Galas',
        descKey: 'megamenu.cap_bday_desc',
        defaultDesc: 'Interactive countdowns, party voice notes & photo challenges.',
        iconName: 'Sparkles',
        icon: Sparkles,
        path: '/capsule-types/birthdays',
        subViewKey: 'capsule-birthdays'
      },
      {
        id: 'corporate',
        titleKey: 'megamenu.cap_corp_title',
        defaultTitle: 'Corporate & Event Galas',
        descKey: 'megamenu.cap_corp_desc',
        defaultDesc: 'Branded event spaces, QR check-in & presenter screens.',
        iconName: 'Users',
        icon: Users,
        path: '/capsule-types/corporate',
        subViewKey: 'capsule-corporate'
      },
      {
        id: 'family',
        titleKey: 'megamenu.cap_family_title',
        defaultTitle: 'Private Family Circles',
        descKey: 'megamenu.cap_family_desc',
        defaultDesc: 'Encrypted memory vaults for reunions & intimate gatherings.',
        iconName: 'Camera',
        icon: Camera,
        path: '/capsule-types/family',
        subViewKey: 'capsule-family'
      }
    ]
  },
  {
    id: 'pricing',
    labelKey: 'nav.pricing',
    defaultLabel: 'Pricing',
    headerKey: 'megamenu.pricing',
    defaultHeader: 'Plans & Regional Pricing',
    mainPath: '/pricing',
    items: [
      {
        id: 'starter',
        titleKey: 'megamenu.price_starter_title',
        defaultTitle: 'Starter Free Tier',
        descKey: 'megamenu.price_starter_desc',
        defaultDesc: '1 Event, 50 Guests, HD Photos, Unlimited Downloads.',
        iconName: 'CheckCircle2',
        icon: CheckCircle2,
        path: '/pricing/starter',
        subViewKey: 'pricing-starter'
      },
      {
        id: 'premium',
        titleKey: 'megamenu.price_prem_title',
        defaultTitle: 'Premium Celebration',
        descKey: 'megamenu.price_prem_desc',
        defaultDesc: 'Unlimited Guests, 4K Video, Live Screen Display & Audio.',
        iconName: 'Award',
        icon: Award,
        path: '/pricing/premium',
        subViewKey: 'pricing-premium'
      },
      {
        id: 'enterprise',
        titleKey: 'megamenu.price_ent_title',
        defaultTitle: 'Enterprise Guild',
        descKey: 'megamenu.price_ent_desc',
        defaultDesc: 'Custom domain, custom branding, dedicated manager.',
        iconName: 'Globe',
        icon: Globe,
        path: '/pricing/enterprise',
        subViewKey: 'pricing-enterprise'
      },
      {
        id: 'calculator',
        titleKey: 'megamenu.price_calc_title',
        defaultTitle: 'Currency & Regional Calculator',
        descKey: 'megamenu.price_calc_desc',
        defaultDesc: 'Compare rates in USD, EUR, GBP, JPY, IDR, VND, TWD.',
        iconName: 'Tag',
        icon: Tag,
        path: '/pricing/calculator',
        subViewKey: 'pricing-calculator'
      }
    ]
  },
  {
    id: 'resources',
    labelKey: 'nav.resources',
    defaultLabel: 'Resources',
    headerKey: 'megamenu.resources',
    defaultHeader: 'Resources & Support',
    mainPath: '/resources',
    items: [
      {
        id: 'help-center',
        titleKey: 'megamenu.res_help_title',
        defaultTitle: 'Help Center & Setup Guides',
        descKey: 'megamenu.res_help_desc',
        defaultDesc: 'Step-by-step setup guides, QR printing & host tips.',
        iconName: 'HelpCircle',
        icon: HelpCircle,
        path: '/resources/help-center',
        subViewKey: 'resources-help'
      },
      {
        id: 'live-demo',
        titleKey: 'megamenu.res_demo_title',
        defaultTitle: 'Live Demo Gallery',
        descKey: 'megamenu.res_demo_desc',
        defaultDesc: 'Experience guest contribution & host controls in real time.',
        iconName: 'Play',
        icon: Play,
        path: '/resources/live-demo',
        subViewKey: 'resources-demo',
        action: 'demo'
      },
      {
        id: 'support',
        titleKey: 'megamenu.res_supp_title',
        defaultTitle: 'Contact Dedicated Support',
        descKey: 'megamenu.res_supp_desc',
        defaultDesc: '24/7 dedicated support for peace of mind at your event.',
        iconName: 'MessageSquare',
        icon: MessageSquare,
        path: '/contact-support',
        subViewKey: 'support'
      },
      {
        id: 'release-notes',
        titleKey: 'megamenu.res_rel_title',
        defaultTitle: 'System Release Notes v2.4',
        descKey: 'megamenu.res_rel_desc',
        defaultDesc: 'Discover what is new in KAVA 2026 memory capsules.',
        iconName: 'Star',
        icon: Star,
        path: '/resources/release-notes',
        subViewKey: 'resources-release-notes'
      }
    ]
  }
];

/**
 * Maps a URL path to its corresponding subView identifier.
 */
export function getSubViewFromPath(pathname: string): string {
  const cleanPath = (pathname || '/').replace(/\/$/, '') || '/';
  
  if (cleanPath === '') return 'home';
  if (cleanPath === '/how-it-works') return 'how-it-works';
  if (cleanPath === '/how-it-works/qr-access' || cleanPath === '/how-it-works/qr') return 'how-it-works-qr';
  if (cleanPath === '/how-it-works/projection-stream' || cleanPath === '/how-it-works/projection') return 'how-it-works-projection';
  if (cleanPath === '/how-it-works/moderation') return 'how-it-works-moderation';
  if (cleanPath === '/how-it-works/vault') return 'how-it-works-vault';

  if (cleanPath === '/capsule-types') return 'capsule-types';
  if (cleanPath === '/capsule-types/weddings') return 'capsule-weddings';
  if (cleanPath === '/capsule-types/birthdays') return 'capsule-birthdays';
  if (cleanPath === '/capsule-types/corporate') return 'capsule-corporate';
  if (cleanPath === '/capsule-types/family') return 'capsule-family';

  if (cleanPath === '/pricing') return 'pricing';
  if (cleanPath === '/pricing/starter') return 'pricing-starter';
  if (cleanPath === '/pricing/premium') return 'pricing-premium';
  if (cleanPath === '/pricing/enterprise') return 'pricing-enterprise';
  if (cleanPath === '/pricing/calculator') return 'pricing-calculator';

  if (cleanPath === '/resources') return 'resources';
  if (cleanPath === '/resources/help-center' || cleanPath === '/resources/help') return 'resources-help';
  if (cleanPath === '/resources/live-demo' || cleanPath === '/resources/demo') return 'resources-demo';
  if (cleanPath === '/resources/release-notes' || cleanPath === '/resources/releases') return 'resources-release-notes';

  if (cleanPath === '/contact-support' || cleanPath === '/support') return 'support';

  if (cleanPath === '/legal') return 'privacy';
  if (cleanPath === '/legal/privacy') return 'privacy';
  if (cleanPath === '/legal/terms') return 'terms';
  if (cleanPath === '/legal/trust-safety') return 'trust-safety';
  if (cleanPath === '/legal/about') return 'about';

  return 'home';
}

/**
 * Maps a subView identifier to its canonical clean route path.
 */
export function getRoutePathFromSubView(subView: string): string {
  if (!subView || subView === 'home') return '/';
  if (subView === 'how-it-works') return '/how-it-works';
  if (subView === 'capsule-types') return '/capsule-types';
  if (subView === 'pricing') return '/pricing';
  if (subView === 'resources') return '/resources';
  if (subView === 'support' || subView === 'contact-support') return '/contact-support';
  if (subView === 'legal') return '/legal/privacy';

  for (const cat of MEGA_MENU_CONFIG) {
    for (const item of cat.items) {
      if (item.subViewKey === subView || item.id === subView || item.path === subView) {
        return item.path;
      }
    }
  }

  if (subView.startsWith('how-it-works-')) {
    const tab = subView.replace('how-it-works-', '');
    if (tab === 'qr') return '/how-it-works/qr-access';
    if (tab === 'projection') return '/how-it-works/projection-stream';
    if (tab === 'moderation') return '/how-it-works/moderation';
    if (tab === 'vault') return '/how-it-works/vault';
    return `/how-it-works/${tab}`;
  }

  if (subView.startsWith('capsule-')) {
    const tab = subView.replace('capsule-', '');
    return `/capsule-types/${tab}`;
  }

  if (subView.startsWith('pricing-')) {
    const plan = subView.replace('pricing-', '');
    return `/pricing/${plan}`;
  }

  if (subView.startsWith('resources-')) {
    const tab = subView.replace('resources-', '');
    if (tab === 'help') return '/resources/help-center';
    if (tab === 'demo') return '/resources/live-demo';
    if (tab === 'release-notes') return '/resources/release-notes';
    return `/resources/${tab}`;
  }

  if (subView.startsWith('legal-') || ['privacy', 'terms', 'trust-safety', 'about'].includes(subView)) {
    const tab = subView.replace('legal-', '');
    return `/legal/${tab}`;
  }

  if (subView.startsWith('/')) return subView;

  return `/${subView}`;
}
