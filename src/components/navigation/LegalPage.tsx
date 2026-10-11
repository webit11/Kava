import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Info, 
  Heart
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';

interface LegalPageProps {
  initialSubView?: 'privacy' | 'terms' | 'trust-safety' | 'about';
  onBackToHome: () => void;
  onCreateEvent: () => void;
}

export default function LegalPage({
  initialSubView = 'privacy',
  onBackToHome,
  onCreateEvent
}: LegalPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'trust-safety' | 'about'>(initialSubView);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'trust-safety', label: 'Trust & Safety', icon: ShieldCheck },
            { id: 'about', label: 'About KAVA', icon: Info }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-2 ${
                  isActive 
                    ? 'bg-slate-950 text-white shadow-sm' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Legal Content Card */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
          
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-slate-950">KAVA Privacy Policy & Memory Protection</h1>
              <p className="text-slate-400 font-mono text-[11px]">Last Updated: August 2026</p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-extrabold text-slate-900">Our Fundamental Promise:</p>
                <p className="italic text-slate-600">
                  "We do not sell your personal data, train external public AI models on your private event photos, or serve third-party ads in your memory capsules."
                </p>
              </div>

              <h2 className="text-base font-extrabold text-slate-950 pt-2">1. Data Collection & Guest Submissions</h2>
              <p>
                When guests contribute photos, videos, or spoken audio wishes to a KAVA memory capsule via QR code, we store these digital assets securely to enable venue live streaming and host vault archiving.
              </p>

              <h2 className="text-base font-extrabold text-slate-950 pt-2">2. Encryption & Access Control</h2>
              <p>
                All uploads are encrypted in transit via TLS 1.3 and at rest using AES-256 cloud vault encryption. Hosts can enforce guest PIN codes and pre-approval moderation rules.
              </p>

              <h2 className="text-base font-extrabold text-slate-950 pt-2">3. Master Export & Erasure Rights</h2>
              <p>
                Hosts maintain 100% ownership of all uploaded content. Hosts can request complete data deletion or export their entire event memory package in a lossless ZIP archive at any time.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-slate-950">Terms of Service</h1>
              <p className="text-slate-400 font-mono text-[11px]">Last Updated: August 2026</p>

              <h2 className="text-base font-extrabold text-slate-950 pt-2">1. Platform Usage</h2>
              <p>
                By creating or joining a KAVA memory capsule, you agree to respect event hosts, refrain from uploading offensive material, and follow all host moderation guidelines.
              </p>

              <h2 className="text-base font-extrabold text-slate-950 pt-2">2. Content Licensing</h2>
              <p>
                You retain all copyright to your photos and audio recordings. You grant KAVA a limited license solely to display your uploads on the host’s venue stream and package them for host archive downloads.
              </p>
            </div>
          )}

          {activeTab === 'trust-safety' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-slate-950">Trust & Safety Guidelines</h1>
              <p className="text-slate-400 font-mono text-[11px]">Last Updated: August 2026</p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-950">Pre-Approval Moderation</p>
                    <p className="text-xs text-slate-600">Hosts can require approval for all uploaded items before they appear on the public venue screen display.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-950">Encrypted PIN Codes</p>
                    <p className="text-xs text-slate-600">Restrict guest uploads and views to invited party guests using 4-digit or custom string access keys.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-slate-950">About KAVA</h1>
              <p className="text-slate-600 leading-relaxed font-medium">
                KAVA was created with a simple belief: events are meant to be lived, not spent managing file uploads or forcing guests to download bulky apps. We built a collaborative memory capsule engine that makes capturing candid wedding photos, audio blessings, and milestone memories effortless.
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-bold text-slate-900">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Preserving memories for weddings, anniversaries, and milestones worldwide.</span>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
