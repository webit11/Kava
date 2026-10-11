import React, { useState } from 'react';
import { 
  HelpCircle, 
  Play, 
  Star, 
  Download, 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Printer, 
  Tv, 
  ShieldCheck, 
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';

interface ResourcesPageProps {
  initialTab?: 'guides' | 'demo' | 'release-notes' | 'templates';
  onBackToHome: () => void;
  onCreateEvent: () => void;
  onTryDemo: () => void;
  onNavigateSubView: (view: string) => void;
}

export default function ResourcesPage({
  initialTab = 'guides',
  onBackToHome,
  onCreateEvent,
  onTryDemo,
  onNavigateSubView
}: ResourcesPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'guides' | 'demo' | 'release-notes' | 'templates'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSelectTab = (tabId: 'guides' | 'demo' | 'release-notes' | 'templates') => {
    setActiveTab(tabId);
    if (onNavigateSubView) {
      const subViewMap: Record<string, string> = {
        guides: 'resources-help',
        demo: 'resources-demo',
        'release-notes': 'resources-release-notes',
        templates: 'resources-templates'
      };
      onNavigateSubView(subViewMap[tabId] || `resources-${tabId}`);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<string | null>(null);

  const guideArticles = [
    {
      id: 'art-1',
      title: 'How to Print High-Resolution QR Standees for Tables & Bars',
      category: 'Print & Venue Setup',
      desc: 'Learn the exact dimensions (4x6", 5x7") and acrylic standee frames that get 95%+ guest scan rates.',
      readTime: '3 min read',
      icon: Printer
    },
    {
      id: 'art-2',
      title: 'Connecting KAVA Live Screen to Venue HDMI Projectors & TVs',
      category: 'Live Projection',
      desc: 'Step-by-step hardware guide for ChromeCast, Apple TV AirPlay, or direct HDMI cable projection.',
      readTime: '4 min read',
      icon: Tv
    },
    {
      id: 'art-3',
      title: 'Host Moderation 101: Keeping Your Memory Vault Safe',
      category: 'Privacy & Security',
      desc: 'How to configure pre-approval queues, event PIN codes, and watermarks before your party begins.',
      readTime: '3 min read',
      icon: ShieldCheck
    },
    {
      id: 'art-4',
      title: '5 Proven Prompts to Get Guests to Record Spoken Audio Wishes',
      category: 'Guest Engagement',
      desc: 'Creative signage techniques that turn shy guests into enthusiastic audio storytellers.',
      readTime: '2 min read',
      icon: FileText
    }
  ];

  const releaseNotes = [
    {
      version: 'v2.4.0 (August 2026)',
      highlights: [
        'Added 4K 60fps WebGL Live Projection Sync for ultra-smooth venue displays',
        'Multi-currency pricing engine supporting USD, EUR, GBP, JPY, IDR, VND, TWD',
        'Enhanced voice wish audio waveforms with noise cancellation filtering',
        'Offline QR upload queue caching for weak venue Wi-Fi zones'
      ]
    },
    {
      version: 'v2.3.2 (June 2026)',
      highlights: [
        'Added guest anonymity toggles and instant host moderation approval buttons',
        '1-Click Master ZIP export structure with raw camera EXIF preservation',
        'Custom white-label branding options for Enterprise Guild workspaces'
      ]
    }
  ];

  const filteredArticles = guideArticles.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300/60 text-slate-800 text-[11px] font-mono font-extrabold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-slate-900 shrink-0" />
          <span>KAVA Knowledge Base & Media Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Master Event Capsule Setup & Host Excellence
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl leading-relaxed">
          Guides, printable QR templates, live sandbox demos, release notes, and setup checklists to make your event memory collection flawless.
        </p>

        {/* Tab Selection */}
        <div className="pt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'guides', label: 'Help Guides & Setup', icon: HelpCircle },
            { id: 'demo', label: 'Live Sandbox Gallery', icon: Play },
            { id: 'release-notes', label: 'System Release Notes', icon: Star },
            { id: 'templates', label: 'Printable QR Assets', icon: Download }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id as any)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer flex items-center space-x-3 ${
                  isActive 
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md' 
                    : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <tab.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-900'}`} />
                <span className="font-extrabold text-xs sm:text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Tab View Content */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6 space-y-8">
        
        {/* TAB 1: HELP GUIDES & SETUP */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs flex items-center space-x-3">
              <Search className="w-5 h-5 text-slate-400 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guide articles, QR printing, projector setups..."
                className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent"
              />
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((art) => (
                <div key={art.id} className="bg-white border border-slate-200/90 rounded-[28px] p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">{art.category}</span>
                      <span className="text-slate-400">{art.readTime}</span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-950">{art.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{art.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateSubView('support')}
                    className="self-start text-xs font-extrabold text-slate-900 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer pt-2"
                  >
                    <span>Read Article Guide</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE DEMO SANDBOX */}
        {activeTab === 'demo' && (
          <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm text-center space-y-6">
            <div className="p-4 rounded-full bg-slate-100 text-slate-950 inline-block mx-auto">
              <Play className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Interactive KAVA Sandbox Gallery</h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
              Experience both guest upload perspectives and host live screen displays in real time without creating an account.
            </p>
            <div>
              <button
                type="button"
                onClick={onTryDemo}
                className="px-6 py-3 rounded-full text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 transition-all cursor-pointer shadow-md inline-flex items-center space-x-2"
              >
                <span>Launch Interactive Demo Sandbox</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM RELEASE NOTES */}
        {activeTab === 'release-notes' && (
          <div className="space-y-6">
            {releaseNotes.map((rel, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-black text-slate-950">{rel.version}</h3>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Production Build</span>
                </div>
                <div className="space-y-2">
                  {rel.highlights.map((item, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs sm:text-sm font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PRINTABLE QR ASSETS */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '4x6" Dining Table Standee', size: '1200 x 1800 px (300 DPI)', desc: 'High-visibility QR design with elegant border for wedding dining tables.' },
              { title: '18x24" Venue Entrance Poster', size: '5400 x 7200 px (300 DPI)', desc: 'Large format greeting sign guiding arriving guests to scan and contribute.' },
              { title: '3.5x2" Host QR Cards', size: '1050 x 600 px (300 DPI)', desc: 'Pocket-sized cards for bridal party or event hosts to hand out to guests.' }
            ].map((tmpl, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-[28px] p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{tmpl.size}</span>
                  <h3 className="text-base font-extrabold text-slate-950">{tmpl.title}</h3>
                  <p className="text-xs text-slate-600 font-medium">{tmpl.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setDownloadSuccessModal(tmpl.title)}
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Print Template</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Download Confirmation Toast */}
      {downloadSuccessModal && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Template Download Started</p>
            <p className="text-slate-400">{downloadSuccessModal}</p>
          </div>
          <button
            type="button"
            onClick={() => setDownloadSuccessModal(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
