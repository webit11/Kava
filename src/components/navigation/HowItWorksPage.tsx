import React, { useState } from 'react';
import { 
  QrCode, 
  Tv, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Play, 
  Smartphone, 
  Monitor, 
  Lock, 
  Zap, 
  Clock, 
  Check,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';

interface HowItWorksPageProps {
  initialTab?: 'qr' | 'projection' | 'moderation' | 'vault';
  initialStep?: number;
  onBackToHome: () => void;
  onCreateEvent: () => void;
  onTryDemo: () => void;
  onNavigateSubView: (view: string) => void;
}

export default function HowItWorksPage({
  initialTab = 'qr',
  onBackToHome,
  onCreateEvent,
  onTryDemo,
  onNavigateSubView
}: HowItWorksPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'qr' | 'projection' | 'moderation' | 'vault'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSelect = (tabId: 'qr' | 'projection' | 'moderation' | 'vault') => {
    setActiveTab(tabId);
    if (onNavigateSubView) {
      const subViewMap: Record<string, string> = {
        qr: 'how-it-works-qr',
        projection: 'how-it-works-projection',
        moderation: 'how-it-works-moderation',
        vault: 'how-it-works-vault'
      };
      onNavigateSubView(subViewMap[tabId]);
    }
  };

  const [interactiveStep, setInteractiveStep] = useState<number>(1);
  const [simulatedApprovalStatus, setSimulatedApprovalStatus] = useState<Record<string, 'pending' | 'approved' | 'rejected'>>({
    'item-1': 'approved',
    'item-2': 'pending',
    'item-3': 'approved'
  });

  const handleSimulateApproval = (id: string, status: 'approved' | 'rejected') => {
    setSimulatedApprovalStatus(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300/60 text-slate-800 text-[11px] font-mono font-extrabold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-slate-900 shrink-0" />
            <span>{t('how_it_works_page.engine_label', '4-Pillar Memory Preservation Engine')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t('how_it_works_page.hero_title', 'How KAVA Preserves Raw, Unfiltered Event Memories')}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            {t('how_it_works_page.hero_desc', 'From instant guest QR code access to 60fps venue projection streams and lossless 4K vault archiving — explore the zero-friction architecture built for weddings, galas, and milestones.')}
          </p>
        </div>

        {/* Core Pillar Selection Tabs */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'qr', title: t('how_it_works_page.tab_qr_title', '1. QR Guest Access'), desc: t('how_it_works_page.tab_qr_desc', 'No app download needed'), icon: QrCode },
            { id: 'projection', title: t('how_it_works_page.tab_proj_title', '2. 4K Live Stream'), desc: t('how_it_works_page.tab_proj_desc', 'Real-time venue display'), icon: Tv },
            { id: 'moderation', title: t('how_it_works_page.tab_mod_title', '3. Host Moderation'), desc: t('how_it_works_page.tab_mod_desc', 'Privacy & approval rules'), icon: ShieldCheck },
            { id: 'vault', title: t('how_it_works_page.tab_vault_title', '4. 4K Lossless Vault'), desc: t('how_it_works_page.tab_vault_desc', 'Original quality ZIP export'), icon: Download },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabSelect(tab.id as any)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                  isActive 
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-slate-900/10' 
                    : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <tab.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-900'}`} />
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </div>
                <h2 className="font-extrabold text-sm tracking-tight">{tab.title}</h2>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{tab.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dynamic Pillar Content Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* PILLAR 1: QR GUEST ACCESS */}
        {activeTab === 'qr' && (
          <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('how_it_works_page.qr_badge', 'Zero App Download Barrier')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  {t('how_it_works_page.qr_title', 'Instant Guest Contribution via Web QR')}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {t('how_it_works_page.qr_desc', 'Guests simply open their native camera app on iOS or Android and scan your venue standee QR code. Within 2 seconds, they enter the event space with zero registration forms or app store downloads.')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase">{t('how_it_works_page.qr_c1_tag', 'Native Camera Scan')}</p>
                    <p className="text-sm font-extrabold text-slate-900">{t('how_it_works_page.qr_c1_title', '100% Device Compatibility')}</p>
                    <p className="text-xs text-slate-500">{t('how_it_works_page.qr_c1_desc', 'Works on Safari, Chrome, Samsung Internet & Edge.')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase">{t('how_it_works_page.qr_c2_tag', 'Offline Resiliency')}</p>
                    <p className="text-sm font-extrabold text-slate-900">{t('how_it_works_page.qr_c2_title', 'Weak Venue Signal Cache')}</p>
                    <p className="text-xs text-slate-500">{t('how_it_works_page.qr_c2_desc', 'Uploads queue locally if venue Wi-Fi drops momentarily.')}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigateSubView('resources-help')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {t('how_it_works_page.btn_download_templates', 'Download Printable QR Templates')}
                  </button>
                </div>
              </div>

              {/* Interactive Demo Standee Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 space-y-5 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <QrCode className="w-12 h-12 text-white mx-auto" />
                </div>
                <div>
                  <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">{t('how_it_works_page.standee_tag', 'Sample Table Standee')}</p>
                  <h4 className="text-xl font-bold text-white mt-1">{t('how_it_works_page.standee_title', 'Scan to Share Wishes & Photos')}</h4>
                  <p className="text-xs text-slate-400 mt-1">{t('how_it_works_page.standee_sub', 'No login required • Instant 4K upload')}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl max-w-[180px] mx-auto shadow-md">
                  <div className="w-32 h-32 bg-slate-900 rounded-xl flex items-center justify-center p-2">
                    <QrCode className="w-full h-full text-white" />
                  </div>
                  <p className="text-[10px] font-mono font-bold text-slate-800 mt-2">PIN: 2026-KAVA</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PILLAR 2: 4K LIVE PROJECTION STREAM */}
        {activeTab === 'projection' && (
          <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  <Tv className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t('how_it_works_page.proj_badge', 'Real-Time Venue Display Engine')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  {t('how_it_works_page.proj_title', 'Live Venue Wall & Projection Stream')}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {t('how_it_works_page.proj_desc', "Transform your venue's TVs, projectors, or LED walls into a living memory gallery. As guests submit photos and audio wishes, KAVA animates them live with hardware-accelerated 60fps transitions.")}
                </p>

                <div className="space-y-3">
                  {[
                    t('how_it_works_page.proj_f1', 'Automatic full-screen slideshow with smart aspect ratio fitting.'),
                    t('how_it_works_page.proj_f2', 'Embedded QR corner overlay so new guests can join anytime.'),
                    t('how_it_works_page.proj_f3', 'Audio wish audio waveforms played with visual sound bars.'),
                    t('how_it_works_page.proj_f4', 'Multi-monitor synchronized output with zero lag.')
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onTryDemo}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
                  >
                    <Tv className="w-4 h-4" />
                    <span>{t('how_it_works_page.btn_launch_sim', 'Launch Live Projection Simulator')}</span>
                  </button>
                </div>
              </div>

              {/* Display Simulator Frame */}
              <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-bold">{t('how_it_works_page.live_active', 'LIVE STREAM ACTIVE')}</span>
                  </span>
                  <span>4K 60FPS</span>
                </div>

                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center p-4 border border-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" 
                    alt="Wedding Sample" 
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-lg border border-white/10 flex items-center justify-between text-white">
                    <div>
                      <p className="text-xs font-bold">"Congratulations from Table 4!"</p>
                      <p className="text-[10px] text-slate-400">— Marcus & Elena</p>
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span>{t('how_it_works_page.auto_slide', 'Auto Slideshow: 8s')}</span>
                  <span>{t('how_it_works_page.layout_grid', 'Layout: Elegant Grid')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PILLAR 3: HOST MODERATION */}
        {activeTab === 'moderation' && (
          <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('how_it_works_page.mod_badge', 'Host Authority & Peace of Mind')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  {t('how_it_works_page.mod_title', 'Granular Approval & Privacy Controls')}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {t('how_it_works_page.mod_desc', 'Maintain total control over what appears on your venue display. Enable pre-approval mode to review photos before they hit the screen, set PIN codes, or toggle anonymous wishes.')}
                </p>

                {/* Interactive Moderation Simulator */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase">{t('how_it_works_page.mod_sandbox_tag', 'Try Interactive Moderation Sandbox:')}</p>
                  
                  {[
                    { id: 'item-1', name: 'Sophia C.', text: 'Cheers to the bride and groom! 🥂', time: 'Just now' },
                    { id: 'item-2', name: 'Anonymous Guest', text: 'Best party of 2026 hands down!', time: '1 min ago' },
                  ].map((item) => {
                    const status = simulatedApprovalStatus[item.id] || 'pending';
                    return (
                      <div key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-extrabold text-slate-900">{item.name} <span className="font-normal text-slate-400">({item.time})</span></p>
                          <p className="text-slate-600 truncate">{item.text}</p>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSimulateApproval(item.id, 'approved')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              status === 'approved' 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            {status === 'approved' ? t('common.approved', 'Approved') : t('common.approve', 'Approve')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateApproval(item.id, 'rejected')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              status === 'rejected' 
                                ? 'bg-rose-600 text-white' 
                                : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            {status === 'rejected' ? t('common.declined', 'Declined') : t('common.decline', 'Decline')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm">{t('how_it_works_page.privacy_matrix_title', 'Privacy Options Matrix')}</h4>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-center justify-between">
                      <span>{t('how_it_works_page.opt_pin', 'Event Access PIN')}</span>
                      <span className="font-mono text-emerald-400 font-bold">{t('how_it_works_page.opt_enabled', 'Enabled')}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>{t('how_it_works_page.opt_queue', 'Host Pre-Approval Queue')}</span>
                      <span className="font-mono text-emerald-400 font-bold">{t('how_it_works_page.opt_instant_strict', 'Instant / Strict')}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>{t('how_it_works_page.opt_scope', 'Guest Download Scope')}</span>
                      <span className="font-mono text-emerald-400 font-bold">{t('how_it_works_page.opt_all_own', 'All / Own Only')}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>{t('how_it_works_page.opt_watermark', 'Custom Watermark')}</span>
                      <span className="font-mono text-emerald-400 font-bold">{t('how_it_works_page.opt_optional', 'Optional')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PILLAR 4: 4K LOSSLESS VAULT */}
        {activeTab === 'vault' && (
          <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span>{t('how_it_works_page.vault_badge', 'Permanent Master Archive')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  {t('how_it_works_page.vault_title', '4K Lossless Vault & 1-Click ZIP Export')}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {t('how_it_works_page.vault_desc', 'Unlike messaging apps that compress your memories down to low-res thumbnails, KAVA stores raw photos, 4K video clips, and high-bitrate voice audio in original quality. Export everything in one click anytime.')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase">{t('how_it_works_page.photos_lbl', 'Photos')}</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{t('how_it_works_page.uncompressed_exif', 'Uncompressed EXIF')}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase">{t('how_it_works_page.videos_lbl', 'Videos')}</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{t('how_it_works_page.uhd_master', '4K UHD Master')}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase">{t('how_it_works_page.audio_wishes_lbl', 'Audio Wishes')}</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{t('how_it_works_page.lossless_rate', '320kbps Lossless')}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onCreateEvent}
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                  >
                    {t('how_it_works_page.btn_start_vault', 'Start Your Event Vault Now')}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800 shadow-lg">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{t('how_it_works_page.master_pkg_title', 'Master Event Package .ZIP')}</h4>
                    <p className="text-xs text-slate-400">{t('how_it_works_page.master_pkg_sub', 'Ready for offline backup')}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>📁 /Photos_Raw_EXIF/</span>
                    <span className="text-emerald-400">248 items</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>📁 /Videos_4K_Master/</span>
                    <span className="text-emerald-400">32 items</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>📁 /Audio_Voice_Wishes/</span>
                    <span className="text-emerald-400">18 clips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Host Setup Timeline */}
      <section className="mt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{t('how_it_works_page.host_journey_tag', 'Host Journey')}</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">{t('how_it_works_page.timeline_title', 'Set Up Your Event in 60 Seconds')}</h3>
            <p className="text-sm text-slate-600">{t('how_it_works_page.timeline_desc', 'No technical knowledge required — KAVA handles streaming, formatting, and storage.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: t('how_it_works_page.step1_title', 'Create Capsule'), desc: t('how_it_works_page.step1_desc', 'Choose template and set event name') },
              { step: '02', title: t('how_it_works_page.step2_title', 'Print QR Code'), desc: t('how_it_works_page.step2_desc', 'Download standee PDF or project on screen') },
              { step: '03', title: t('how_it_works_page.step3_title', 'Guests Upload'), desc: t('how_it_works_page.step3_desc', 'Guests scan and share photos & voice notes') },
              { step: '04', title: t('how_it_works_page.step4_title', 'Download Archive'), desc: t('how_it_works_page.step4_desc', 'Export full 4K ZIP vault after event') }
            ].map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative">
                <span className="text-2xl font-mono font-black text-slate-300">{st.step}</span>
                <h4 className="font-extrabold text-sm text-slate-900">{st.title}</h4>
                <p className="text-xs text-slate-600">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-[28px] p-8 sm:p-12 text-center space-y-5 shadow-xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{t('how_it_works_page.cta_title', 'Preserve Your Next Celebration with KAVA')}</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium">
            {t('how_it_works_page.cta_desc', 'Start free with 50 guests. Upgrade anytime for 4K video, live projector streaming, and audio wishes.')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCreateEvent}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold text-slate-950 bg-white hover:bg-slate-100 transition-all cursor-pointer shadow-md"
            >
              {t('how_it_works_page.btn_create_free', 'Create Free Event Capsule')}
            </button>
            <button
              type="button"
              onClick={() => onNavigateSubView('pricing')}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer border border-slate-700"
            >
              {t('how_it_works_page.btn_view_plans', 'View Regional Plans')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
