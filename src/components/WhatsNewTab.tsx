import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  ArrowRight, 
  Search, 
  Filter, 
  Rocket, 
  ShieldCheck, 
  Tv, 
  QrCode, 
  Palette, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  Flame,
  Layers,
  Clock,
  Compass
} from 'lucide-react';

export interface ReleaseNote {
  version: string;
  releaseDate: string;
  title: string;
  isLatest?: boolean;
  type: 'Major' | 'Feature' | 'Improvement' | 'Security';
  summary: string;
  highlights: {
    badge: string;
    title: string;
    description: string;
    actionTab?: string;
    actionLabel?: string;
  }[];
  fixesAndImprovements: string[];
}

export const KAVA_RELEASES: ReleaseNote[] = [
  {
    version: 'v2.4.2',
    releaseDate: 'August 2026',
    title: 'Centralized Brand Kit, Google Fonts Typography & Real-Time Sync',
    isLatest: true,
    type: 'Major',
    summary: 'Configure your brand once and propagate logos, luxury Google Font pairings, and color palettes across Guest Room, Invitation, Live Screen, and QR Landing.',
    highlights: [
      {
        badge: 'New Engine',
        title: 'Unified Workspace Brand Kit',
        description: 'Brand settings now automatically synchronize across all guest interfaces and email templates in real time with zero latency.',
        actionTab: 'brand',
        actionLabel: 'Open Brand Kit'
      },
      {
        badge: 'Typography',
        title: 'Google Fonts Typography Library',
        description: 'Choose from luxury display fonts like Cormorant Garamond, Plus Jakarta Sans, and Playfair Display with instant live device preview.',
        actionTab: 'brand',
        actionLabel: 'Preview Fonts'
      },
      {
        badge: 'Device Simulator',
        title: 'Interactive Multi-Surface Live Preview',
        description: 'Toggle between Guest Room, Invitation, Live Projection, QR Card, and Dashboard previews to test your styling instantly.',
        actionTab: 'brand',
        actionLabel: 'Test Simulator'
      }
    ],
    fixesAndImprovements: [
      'Added WCAG AA color contrast verification for brand primary and accent colors.',
      'Optimized asset loading speeds on mobile 3G/4G networks by 38%.',
      'Enhanced SVG vector logo rendering on ultra-high resolution retina screens.'
    ]
  },
  {
    version: 'v2.4.1',
    releaseDate: 'July 2026',
    title: 'Ultra-Low Latency Live Screen, Dynamic QR Table Stands & Moderation',
    isLatest: false,
    type: 'Feature',
    summary: 'Project real-time guest uploads onto venue screens with sub-second delay, print vector table stands with automated table numbering, and moderate on the fly.',
    highlights: [
      {
        badge: 'Live Projection',
        title: 'Cinematic Live Screen Presentation Wall',
        description: 'Venue projectors now support 4 dynamic layout styles (Cinematic, Masonry, Mosaic, Grid) with custom background audio mixing.',
        actionTab: 'live',
        actionLabel: 'Open Live Screen'
      },
      {
        badge: 'QR Studio',
        title: 'Print-Ready Vector Table Stand Cards',
        description: 'Export 300 DPI tent cards, acrylic stand templates, and numbered table markers with high-contrast QR codes.',
        actionTab: 'experience',
        actionLabel: 'Configure QR Cards'
      },
      {
        badge: 'Moderation',
        title: 'One-Tap Host Moderation Stream',
        description: 'Hosts and co-hosts can approve or hide incoming photos directly from their smartphone without interrupting venue projection.',
        actionTab: 'contributions',
        actionLabel: 'View Moderation'
      }
    ],
    fixesAndImprovements: [
      'Resolved Safari layout jitter when rendering animated photo transitions on fullscreen Live Screen.',
      'Added multi-select batch moderation actions in Host Contributions view.',
      'Improved WebSocket reconnection resiliency during venue Wi-Fi network drops.'
    ]
  },
  {
    version: 'v2.4.0',
    releaseDate: 'June 2026',
    title: 'High-Fidelity 4K Video Retention & Lossless ZIP Archival',
    isLatest: false,
    type: 'Feature',
    summary: 'Preserve pristine 4K video recordings from guests with automated fast web transcoding and 1-click full-resolution ZIP bulk downloads.',
    highlights: [
      {
        badge: 'Media Engine',
        title: 'Pristine 4K Video Archival',
        description: 'Store full raw video recordings up to 250MB per file with hardware-accelerated proxy transcoding for instant streaming.',
        actionTab: 'contributions',
        actionLabel: 'Explore Media'
      },
      {
        badge: 'AudioKeepsakes',
        title: 'Digital Voice Greeting Keepsakes',
        description: 'Guests can record voice messages with real-time waveform visualizers and sentimental greeting playback.',
        actionTab: 'experience',
        actionLabel: 'Test Greetings'
      },
      {
        badge: 'Bulk Export',
        title: 'One-Click Structured ZIP Downloads',
        description: 'Download all photos, videos, and guestbook notes organized neatly in folders by date and guest name.',
        actionTab: 'contributions',
        actionLabel: 'Export Memories'
      }
    ],
    fixesAndImprovements: [
      'Added automatic EXIF orientation rotation fix for iPhone portrait photos.',
      'Enhanced HEIC/HEIF image transcoding to standard high-quality WebP format on guest upload.',
      'Reduced memory footprint during large multi-gigabyte ZIP compression jobs.'
    ]
  },
  {
    version: 'v2.3.8',
    releaseDate: 'May 2026',
    title: 'Granular Team Collaboration & Multi-Role Permissions',
    isLatest: false,
    type: 'Improvement',
    summary: 'Invite event planners, wedding coordinators, and official photographers with customized workspace security and moderation rights.',
    highlights: [
      {
        badge: 'Collaboration',
        title: 'Role-Based Access Control',
        description: 'Assign Workspace Admin, Event Co-Host, or Contributor roles to protect billing and workspace settings.',
        actionTab: 'team',
        actionLabel: 'Manage Team'
      },
      {
        badge: 'Activity Log',
        title: 'Real-Time Collaborator Audit Trail',
        description: 'Track which team member approved guest uploads, changed theme settings, or added new event capsules.',
        actionTab: 'support',
        actionLabel: 'Audit Logs'
      }
    ],
    fixesAndImprovements: [
      'Added instant email invitation deep-links for seamless team onboarding.',
      'Fixed co-host session persistence across multi-tab browser windows.',
      'Improved seat quota tracking on Team Management page.'
    ]
  },
  {
    version: 'v2.3.5',
    releaseDate: 'April 2026',
    title: 'Interactive Guided Onboarding Tour & In-App Help System',
    isLatest: false,
    type: 'Improvement',
    summary: 'Master the workspace with spotlight walkthroughs, keyboard shortcuts, contextual tooltip triggers, and 24/7 ticket support.',
    highlights: [
      {
        badge: 'Onboarding',
        title: 'Spotlight Guided Product Tour',
        description: 'Interactive 8-step walkthrough guiding new hosts from capsule creation to QR card printing and live wall setup.',
        actionTab: 'overview',
        actionLabel: 'Start Tour'
      },
      {
        badge: 'Support',
        title: 'Direct Ticket Help Center',
        description: 'Log support tickets with automatic system diagnostics and communicate in real time with our support desk.',
        actionTab: 'support',
        actionLabel: 'Open Help Center'
      }
    ],
    fixesAndImprovements: [
      'Added keyboard navigation (Arrow keys, Enter, Escape) for all guided tour steps.',
      'Implemented offline-first progress memory for completed tours.'
    ]
  }
];

interface WhatsNewTabProps {
  onNavigateTab: (tab: string) => void;
  onStartTour?: () => void;
}

export default function WhatsNewTab({
  onNavigateTab,
  onStartTour
}: WhatsNewTabProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { id: 'all', label: 'All Updates' },
    { id: 'Major', label: 'Major Releases' },
    { id: 'Feature', label: 'New Features' },
    { id: 'Improvement', label: 'Enhancements' }
  ];

  const filteredReleases = useMemo(() => {
    return KAVA_RELEASES.filter(rel => {
      const matchesSearch = 
        searchQuery === '' ||
        rel.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rel.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rel.highlights.some(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()) || h.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'all' || rel.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  return (
    <div className="space-y-8 font-sans text-slate-900 animate-fadeIn" id="whats-new-root">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-[32px] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300">
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Product Updates & Changelog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            What's New in KAVA Workspace
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Discover the latest features, performance improvements, and luxury design tools continuously added to power your event capsules.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-2 relative max-w-xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search release notes, features, or updates..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400/80 focus:bg-white/15 backdrop-blur-md transition-all shadow-inner"
              id="input-changelog-search"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-xs'
              }`}
              id={`filter-release-${tab.id}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Release Notes Timeline List */}
      <div className="space-y-8 relative">
        {filteredReleases.map((release) => (
          <div
            key={release.version}
            className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-6 text-left relative overflow-hidden"
            id={`release-card-${release.version}`}
          >
            {/* Version & Date Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1.5 rounded-2xl bg-slate-900 text-white font-mono text-xs font-extrabold shadow-xs">
                  {release.version}
                </span>
                {release.isLatest && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-extrabold font-mono uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Current Release</span>
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium">
                  {release.releaseDate}
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold font-mono uppercase tracking-wider ${
                release.type === 'Major' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                release.type === 'Feature' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                'bg-slate-100 text-slate-700'
              }`}>
                {release.type} Update
              </span>
            </div>

            {/* Title & Summary */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {release.title}
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed max-w-3xl">
                {release.summary}
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Key Feature Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {release.highlights.map((highlight, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-[10px] font-extrabold font-mono uppercase tracking-wider">
                        {highlight.badge}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {highlight.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>

                    {highlight.actionTab && (
                      <button
                        type="button"
                        onClick={() => {
                          if (highlight.actionTab === 'overview' && onStartTour) {
                            onStartTour();
                          } else {
                            onNavigateTab(highlight.actionTab!);
                          }
                        }}
                        className="pt-2 text-xs font-bold text-slate-900 hover:text-amber-600 flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <span>{highlight.actionLabel || 'Try this feature'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fixes and Polish */}
            {release.fixesAndImprovements.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Fixes & Enhancements:</h4>
                <ul className="space-y-1 text-xs text-slate-600 font-light">
                  {release.fixesAndImprovements.map((fix, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {filteredReleases.length === 0 && (
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">No Releases Found</h3>
            <p className="text-xs text-slate-500">
              No product updates matched your search query "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Roadmap Sneak Peek Banner */}
      <div className="bg-slate-100 rounded-[28px] p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Rocket className="w-4 h-4 text-slate-900" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">
              Upcoming on the KAVA Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-light max-w-xl leading-relaxed">
            Upcoming next: AI-powered guest face grouping, instant multi-language translation for international guest lounges, and native Apple TV Live Screen client app.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('support')}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs"
        >
          Submit Feature Request
        </button>
      </div>

    </div>
  );
}
