import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  QrCode, 
  Tv, 
  Palette, 
  UploadCloud, 
  Users, 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ThumbsUp, 
  ThumbsDown, 
  X, 
  Compass, 
  HelpCircle, 
  ChevronRight,
  Lightbulb,
  ShieldAlert,
  Play,
  Share2,
  FileText
} from 'lucide-react';

export interface GuideArticle {
  id: string;
  title: string;
  category: 'getting-started' | 'qr-studio' | 'live-screen' | 'brand-kit' | 'media-uploads' | 'team-collaboration' | 'billing-storage';
  categoryLabel: string;
  summary: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  updatedAt: string;
  featured?: boolean;
  steps: {
    title: string;
    description: string;
    tip?: string;
  }[];
  actionLink?: {
    label: string;
    tab: string;
  };
  tags: string[];
}

export const KAVA_GUIDES: GuideArticle[] = [
  {
    id: 'guide-getting-started',
    title: 'Getting Started: Launch Your First Event Capsule in 3 Minutes',
    category: 'getting-started',
    categoryLabel: 'Getting Started',
    summary: 'A complete step-by-step walkthrough to setting up your workspace, configuring guest upload permissions, and launching an interactive event.',
    readTime: '3 min read',
    difficulty: 'Beginner',
    updatedAt: 'August 2026',
    featured: true,
    steps: [
      {
        title: '1. Create and Name Your Event Capsule',
        description: 'From your Host Overview, click "Create Capsule". Choose your event type (Wedding, Birthday, Gala, Conference), enter the official dates, and set the event title.',
        tip: 'Set your event code to something memorable (e.g., #RODRIGUEZ26) so guests can join in one click.'
      },
      {
        title: '2. Select Cover Photo and Theme',
        description: 'Upload a high-resolution cover photo or choose from our curated aesthetic presets. The theme colors will automatically style the guest upload lounge.',
      },
      {
        title: '3. Enable Desired Media Formats',
        description: 'Toggle which formats guests can submit: Photos, 4K Videos, Audio/Voice Greetings, and Digital Guestbook Notes.',
        tip: 'For weddings and galas, enabling Audio Greetings creates high-sentiment keepsake voice notes.'
      },
      {
        title: '4. Print QR Stand Cards & Share Live Link',
        description: 'Head to the Guest Studio tab to download print-ready table stand QR cards in PDF or PNG format, or copy the direct upload URL to your event invitation.',
      }
    ],
    actionLink: {
      label: 'Open Host Overview',
      tab: 'overview'
    },
    tags: ['setup', 'quickstart', 'capsule', 'onboarding', 'guest lounge']
  },
  {
    id: 'guide-qr-table-stands',
    title: 'QR Studio: Designing & Printing Luxury Table Stand Cards',
    category: 'qr-studio',
    categoryLabel: 'QR Studio & Table Cards',
    summary: 'How to generate vector-sharp QR codes, customize table number identifiers, choose luxury card stock templates, and batch export print files.',
    readTime: '4 min read',
    difficulty: 'Beginner',
    updatedAt: 'August 2026',
    featured: true,
    steps: [
      {
        title: '1. Open the Guest Experience & QR Studio',
        description: 'Navigate to the Guest Studio tab in your event console. You will see the interactive live mockup of your guest upload interface and QR stands.',
      },
      {
        title: '2. Customize QR Stand Branding',
        description: 'Select your preferred layout format: Tent Card (4x6"), Flat Card (5x7"), or Acrylic Display Stand. Choose border accents, gold foil trims, or minimal typography.',
        tip: 'Ensure high contrast between the QR code pattern and background for effortless smartphone scanning under dim event lighting.'
      },
      {
        title: '3. Assign Table Numbers & Custom Deep Links',
        description: 'Generate numbered batch cards (e.g. Table 1 through Table 30). When guests scan from Table 4, their photos are automatically tagged with their table identifier.',
      },
      {
        title: '4. Download Print-Ready High-Res Assets',
        description: 'Export as vector PDF with 300 DPI crop marks or high-resolution PNG for direct printing or sending to professional print houses.',
      }
    ],
    actionLink: {
      label: 'Open Guest Experience Studio',
      tab: 'experience'
    },
    tags: ['qr code', 'table cards', 'print', 'pdf', 'stationery', 'guest studio']
  },
  {
    id: 'guide-live-screen-projection',
    title: 'Live Screen Wall: Venue HDMI Setup & Real-Time Moderation',
    category: 'live-screen',
    categoryLabel: 'Live Screen & Wall',
    summary: 'Maximize guest engagement by projecting real-time uploads onto venue screens, projectors, and video walls with instant moderation.',
    readTime: '4 min read',
    difficulty: 'Intermediate',
    updatedAt: 'August 2026',
    featured: true,
    steps: [
      {
        title: '1. Connect Venue Projector via HDMI or AirPlay',
        description: 'Open the Live Screen in a separate browser tab or secondary display window. Press F11 (or ⌘+Shift+F on Mac) for immersive full-screen presentation.',
      },
      {
        title: '2. Choose Display Layout & Transition Style',
        description: 'Select between Dynamic Mosaic, Cinematic Spotlight, Polaroid Masonry, or Smooth Grid transitions. Configure slide rotation speeds between 4s and 12s.',
        tip: 'For wedding receptions, Cinematic Spotlight highlights guest voice recordings with waveform animations.'
      },
      {
        title: '3. Configure Instant Reveal vs Moderation Mode',
        description: 'Enable "Instant Reveal" for trusted private crowds, or enable "Live Moderation" where co-hosts can approve or reject uploads in 1-tap from their smartphone.',
      },
      {
        title: '4. On-Screen QR Overlay Corner',
        description: 'Ensure the persistent corner QR code is visible so arriving guests can scan the projector screen directly from their seats and start uploading.',
      }
    ],
    actionLink: {
      label: 'Open Live Screen Settings',
      tab: 'live'
    },
    tags: ['live screen', 'projector', 'hdmi', 'slideshow', 'moderation', 'realtime']
  },
  {
    id: 'guide-brand-kit-styling',
    title: 'Workspace Brand Kit: Centralized Visual Identity & Custom Fonts',
    category: 'brand-kit',
    categoryLabel: 'Brand Kit & Styling',
    summary: 'Set your corporate or personal brand colors, typography pairings, custom logos, and watermarks across all guest-facing touchpoints.',
    readTime: '3 min read',
    difficulty: 'Intermediate',
    updatedAt: 'August 2026',
    featured: false,
    steps: [
      {
        title: '1. Navigate to Workspace Brand Kit',
        description: 'From your main Workspace sidebar, select "Brand Kit & Assets". This centralized control updates Guest Room, Invitations, Live Screen, and Emails.',
      },
      {
        title: '2. Define Primary & Accent Color Palette',
        description: 'Input your exact hex codes or select from luxury curated presets. The system mathematically computes accessible contrast ratios automatically.',
      },
      {
        title: '3. Choose Google Fonts Typography Pairing',
        description: 'Select your display headline font (e.g. Cormorant Garamond, Plus Jakarta Sans, Playfair Display) and refined body typeface.',
        tip: 'Preview your changes live across all device simulators before saving.'
      },
      {
        title: '4. Save & Propagate Across Workspace',
        description: 'Click "Save Brand Kit". All current and future event capsules in this workspace inherit your bespoke styling instantly.',
      }
    ],
    actionLink: {
      label: 'Open Workspace Brand Kit',
      tab: 'brand'
    },
    tags: ['brand kit', 'colors', 'typography', 'google fonts', 'white-label', 'styling']
  },
  {
    id: 'guide-media-uploads-4k',
    title: 'Media Handling: 4K Video Transcoding, Original Archival & ZIP Export',
    category: 'media-uploads',
    categoryLabel: 'Media & 4K Uploads',
    summary: 'Understand KAVA lossless storage, automated mobile compression, live video greetings, and one-click all-media ZIP downloads.',
    readTime: '3 min read',
    difficulty: 'Beginner',
    updatedAt: 'August 2026',
    featured: false,
    steps: [
      {
        title: '1. Uploading from Mobile Devices',
        description: 'Guests can upload directly from their mobile Safari or Chrome browsers without installing any app or creating an account.',
      },
      {
        title: '2. High-Fidelity 4K Video Retention',
        description: 'Videos uploaded by guests are preserved in pristine original resolution while creating an ultra-fast streaming proxy for live venue playback.',
      },
      {
        title: '3. Pinning and Organizing Top Contributions',
        description: 'Mark your favorite photos with the Star icon to feature them prominently on the event overview and live rotation.',
      },
      {
        title: '4. Batch Exporting All Full-Res Memories',
        description: 'When the event concludes, click "Download All Memories" from the Contributions tab to receive a structured ZIP package organized by format and guest.',
      }
    ],
    actionLink: {
      label: 'Open Contributions Gallery',
      tab: 'contributions'
    },
    tags: ['media', 'photos', '4k video', 'zip download', 'archival', 'storage']
  },
  {
    id: 'guide-team-roles-permissions',
    title: 'Team Management: Inviting Co-Hosts, Planners & Photographers',
    category: 'team-collaboration',
    categoryLabel: 'Team & Permissions',
    summary: 'Collaborate with event organizers, wedding planners, and official photographers with role-based access control.',
    readTime: '3 min read',
    difficulty: 'Intermediate',
    updatedAt: 'August 2026',
    featured: false,
    steps: [
      {
        title: '1. Open Team Management Tab',
        description: 'Navigate to "Team" in your Workspace navigation. You will see current active members, pending invitations, and role assignments.',
      },
      {
        title: '2. Select the Appropriate Role',
        description: 'Choose between Workspace Admin (full permissions), Event Co-Host (capsule settings & moderation), or Official Contributor (upload only, no settings).',
        tip: 'Assign Event Planners as Co-Hosts so they can manage live moderation without seeing billing details.'
      },
      {
        title: '3. Send Email Invitation',
        description: 'Enter the collaborator\'s email address. They receive an instant secure invitation link to join your workspace.',
      },
      {
        title: '4. Audit Logs and Activity Tracking',
        description: 'Review real-time audit logs of which team member approved uploads or updated capsule settings.',
      }
    ],
    actionLink: {
      label: 'Open Team Management',
      tab: 'team'
    },
    tags: ['team', 'co-host', 'permissions', 'collaboration', 'planner', 'photographer']
  },
  {
    id: 'guide-billing-storage-quotas',
    title: 'Billing & Storage: Managing Quotas, Upgrades & Add-Ons',
    category: 'billing-storage',
    categoryLabel: 'Billing & Quotas',
    summary: 'How to monitor your workspace media storage, upgrade plans for larger events, unlock 4K video capabilities, and manage invoices.',
    readTime: '2 min read',
    difficulty: 'Beginner',
    updatedAt: 'August 2026',
    featured: false,
    steps: [
      {
        title: '1. Review Current Storage Utilization',
        description: 'Head to "Subscription & Billing" in the sidebar. Inspect your visual breakdown of Photo storage, Video storage, and guest contribution counts.',
      },
      {
        title: '2. Upgrading for Large Event Galas',
        description: 'Upgrade to Premium or Enterprise for unlimited event capsules, 100GB+ high-speed storage, lossless 4K video transcoding, and custom domains.',
      },
      {
        title: '3. Applying Promotional Discount Codes',
        description: 'Enter special partner promo codes in the coupon box to unlock discounted tiers or extended media archival.',
      },
      {
        title: '4. Downloading Invoices & Receipts',
        description: 'Access complete billing history with downloadable PDF receipts for corporate expensing and tax records.',
      }
    ],
    actionLink: {
      label: 'Open Billing & Plans',
      tab: 'billing'
    },
    tags: ['billing', 'plans', 'storage quota', 'upgrade', 'invoices', 'pricing']
  }
];

interface GuidesTabProps {
  onNavigateTab: (tab: string) => void;
  onStartTour?: () => void;
  onContactSupport?: () => void;
}

export default function GuidesTab({
  onNavigateTab,
  onStartTour,
  onContactSupport
}: GuidesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<GuideArticle | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kava_bookmarked_guides');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'helpful' | 'unhelpful'>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('kava_bookmarked_guides', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleFeedback = (guideId: string, type: 'helpful' | 'unhelpful') => {
    setFeedbackGiven(prev => ({ ...prev, [guideId]: type }));
  };

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'qr-studio', label: 'QR & Table Cards' },
    { id: 'live-screen', label: 'Live Screen Wall' },
    { id: 'brand-kit', label: 'Brand Kit & Styling' },
    { id: 'media-uploads', label: 'Media & 4K Uploads' },
    { id: 'team-collaboration', label: 'Team & Permissions' },
    { id: 'billing-storage', label: 'Billing & Quotas' },
    { id: 'bookmarked', label: `Saved Guides (${bookmarkedIds.length})` }
  ];

  const filteredGuides = useMemo(() => {
    return KAVA_GUIDES.filter(guide => {
      const matchesSearch = 
        searchQuery === '' ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        guide.steps.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory === 'bookmarked') {
        matchesCat = bookmarkedIds.includes(guide.id);
      } else if (selectedCategory !== 'all') {
        matchesCat = guide.category === selectedCategory;
      }

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory, bookmarkedIds]);

  const featuredGuides = useMemo(() => {
    return KAVA_GUIDES.filter(g => g.featured);
  }, []);

  return (
    <div className="space-y-8 font-sans text-slate-900 animate-fadeIn" id="guides-library-root">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-[32px] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KAVA Knowledge & Guides Library</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Master Every Feature in Your Event Workspace
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Explore step-by-step documentation, pro configuration tips, and interactive tutorials for Live Screen, QR Studio, Brand Kit, and Guest Experience.
          </p>

          {/* Search Bar */}
          <div className="pt-2 relative max-w-xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, tutorials, or keywords (e.g., 'QR', 'Live Screen', 'HDMI', '4K')..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400/80 focus:bg-white/15 backdrop-blur-md transition-all shadow-inner"
              id="input-guides-search"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Actions:</span>
            {onStartTour && (
              <button
                type="button"
                onClick={onStartTour}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                id="btn-launch-tour-from-guides"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Launch Interactive Product Tour</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigateTab('experience')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>QR Studio</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('live')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>Live Projection</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('brand')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>Brand Kit</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-xs'
              }`}
              id={`cat-filter-${cat.id}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Featured Guides Grid (Shown when 'all' is selected and no search) */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Essential Quick-Start Guides</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Recommended for new hosts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredGuides.map((guide) => {
              const isSaved = bookmarkedIds.includes(guide.id);
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group text-left relative overflow-hidden"
                  id={`card-featured-guide-${guide.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-[10px] font-extrabold font-mono uppercase tracking-wider border border-amber-200/60">
                        {guide.categoryLabel}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(guide.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                        title={isSaved ? "Remove bookmark" : "Save guide"}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-3">
                      {guide.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{guide.readTime}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 text-slate-900 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Read Guide</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Guides List / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            {selectedCategory === 'all' ? 'All Documentation & Tutorials' : categories.find(c => c.id === selectedCategory)?.label}
          </h2>
          <span className="text-xs text-slate-500 font-medium font-mono">
            {filteredGuides.length} {filteredGuides.length === 1 ? 'Article' : 'Articles'}
          </span>
        </div>

        {filteredGuides.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
              <Search className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Guides Found</h3>
              <p className="text-xs text-slate-500 font-light">
                We couldn't find any articles matching "{searchQuery}". Try searching for another topic, or contact our support team.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Clear Search Filters
              </button>
              {onContactSupport && (
                <button
                  type="button"
                  onClick={onContactSupport}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Contact Support 24/7
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGuides.map((guide) => {
              const isSaved = bookmarkedIds.includes(guide.id);
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group text-left relative"
                  id={`card-guide-${guide.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold font-mono uppercase tracking-wider">
                          {guide.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {guide.difficulty}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(guide.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                        title={isSaved ? "Remove bookmark" : "Save guide"}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      {guide.summary}
                    </p>

                    {/* Step count pills */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {guide.steps.length} Steps:
                      </span>
                      <div className="flex items-center space-x-1">
                        {guide.steps.map((_, idx) => (
                          <span
                            key={idx}
                            className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-amber-300 transition-colors"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-medium">{guide.readTime}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400">{guide.updatedAt}</span>
                    </div>

                    <div className="inline-flex items-center space-x-1 text-slate-900 font-extrabold group-hover:translate-x-1 transition-transform text-xs">
                      <span>Open Guide</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guide Detail Reader Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col justify-between text-left font-sans"
              id="modal-guide-reader"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="space-y-1.5 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-[10px] font-extrabold font-mono uppercase tracking-wider border border-amber-200/60">
                      {selectedGuide.categoryLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {selectedGuide.readTime} • {selectedGuide.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {selectedGuide.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Steps */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
                <p className="text-sm text-slate-600 font-light leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedGuide.summary}
                </p>

                <div className="space-y-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Step-by-Step Instructions
                  </h3>

                  {selectedGuide.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:border-slate-300 transition-all"
                    >
                      <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step.title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 font-light leading-relaxed pl-7">
                        {step.description}
                      </p>
                      {step.tip && (
                        <div className="ml-7 mt-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 flex items-start space-x-2">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="font-medium text-[11px] leading-relaxed">{step.tip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <span className="font-bold text-slate-400 uppercase">Tags:</span>
                  {selectedGuide.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Article Feedback */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-slate-900">Was this guide helpful?</h5>
                    <p className="text-[11px] text-slate-500">Your feedback helps us refine our documentation.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {feedbackGiven[selectedGuide.id] ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Thanks for your feedback!</span>
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleFeedback(selectedGuide.id, 'helpful')}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-slate-600" />
                          <span>Yes</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(selectedGuide.id, 'unhelpful')}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <ThumbsDown className="w-3.5 h-3.5 text-slate-600" />
                          <span>No</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedGuide(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close Guide
                </button>

                {selectedGuide.actionLink && (
                  <button
                    type="button"
                    onClick={() => {
                      const tab = selectedGuide.actionLink!.tab;
                      setSelectedGuide(null);
                      onNavigateTab(tab);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95"
                    id="btn-guide-action-cta"
                  >
                    <span>{selectedGuide.actionLink.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
