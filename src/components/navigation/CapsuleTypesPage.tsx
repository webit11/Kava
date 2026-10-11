import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Users, 
  Camera, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Mic, 
  Tv, 
  QrCode, 
  ShieldCheck, 
  Award, 
  Globe, 
  Plus
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';

interface CapsuleTypesPageProps {
  initialType?: 'weddings' | 'birthdays' | 'corporate' | 'family';
  onBackToHome: () => void;
  onCreateEvent: () => void;
  onTryDemo: () => void;
  onNavigateSubView: (view: string) => void;
}

export default function CapsuleTypesPage({
  initialType = 'weddings',
  onBackToHome,
  onCreateEvent,
  onTryDemo,
  onNavigateSubView
}: CapsuleTypesPageProps) {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState<'weddings' | 'birthdays' | 'corporate' | 'family'>(initialType);

  React.useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
    }
  }, [initialType]);

  const handleSelectType = (typeId: 'weddings' | 'birthdays' | 'corporate' | 'family') => {
    setActiveType(typeId);
    if (onNavigateSubView) {
      onNavigateSubView(`capsule-${typeId}`);
    }
  };

  const capsuleDetails = {
    weddings: {
      title: 'Weddings & Anniversaries',
      badge: 'DIGITAL GUESTBOOK & AUDIO TOASTS',
      desc: 'Replace physical guestbooks with a live audio/photo memory wall. Guests scan table cards, record heartfelt audio wishes, and stream candid reception photos live on venue screens.',
      heroImg: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      icon: Heart,
      features: [
        'Audio wish voice booth for spoken toasts and wedding blessings',
        'Custom QR standee PDFs tailored for dining tables and bar tops',
        'Moderated 4K photo slideshow for reception screen projection',
        'Lossless 4K ZIP vault export for the newlyweds to keep forever'
      ],
      samplePrompts: [
        '“Share your favorite memory with the couple or record a 30-second blessing!”',
        '“Snap a photo of Table #5 during the first dance!”',
        '“What is your #1 piece of marriage advice for the newlyweds?”'
      ],
      recommendedPlan: 'Premium Celebration Pass'
    },
    birthdays: {
      title: 'Birthdays & Milestone Galas',
      badge: 'PARTY VOICE BOOTH & PHOTO CHALLENGES',
      desc: 'Inject energy into 21st, 30th, 50th, or 80th milestone birthdays. Prompt guests with hilarious photo challenges, party voice notes, and live age countdown timers.',
      heroImg: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      icon: Sparkles,
      features: [
        'Roast & toast audio booth for funny memories and voice notes',
        'Photo challenge prompt generator for guests on the dance floor',
        'Live age countdown and party timeline ticker on screen',
        'Instant guest download pass so everyone keeps the party photos'
      ],
      samplePrompts: [
        '“Leave a funny 15-second birthday roast or memory!”',
        '“Take a selfie with someone you met at tonight’s party!”',
        '“Describe the birthday host in 3 words on audio!”'
      ],
      recommendedPlan: 'Starter or Premium Celebration'
    },
    corporate: {
      title: 'Corporate & Event Galas',
      badge: 'BRANDED SPONSOR WALL & PRESENTER DISPLAY',
      desc: 'Elevate product launches, annual galas, and developer summits. Add company logos, sponsor header banners, presenter stage screens, and QR badge check-ins.',
      heroImg: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      icon: Users,
      features: [
        'Custom sponsor logos and corporate brand color customization',
        'Presenter stage screen control with live moderation queues',
        'Team spotlight gallery and attendee networking photo wall',
        'Enterprise SLA, custom domain, and dedicated account manager'
      ],
      samplePrompts: [
        '“Share your key takeaway from today’s keynote session!”',
        '“Post a photo with team members at the interactive booth!”',
        '“Drop a message for the event organizers and sponsors!”'
      ],
      recommendedPlan: 'Enterprise Guild Workspace'
    },
    family: {
      title: 'Private Family Circles & Reunions',
      badge: 'ENCRYPTED FAMILY VAULT & STORY ARCHIVE',
      desc: 'Connect generations across reunions, anniversaries, and memorial celebrations. Encrypted memory vaults protect intimate family photos and oral history audio recordings.',
      heroImg: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
      icon: Camera,
      features: [
        'Granular PIN code protection for intimate family privacy',
        'Multi-generational story audio notes to preserve family history',
        'Timeline view organizing old historic scans alongside new photos',
        'Permanent cloud vault backup with high-bitrate audio retention'
      ],
      samplePrompts: [
        '“Record Grandma’s favorite childhood story on audio!”',
        '“Upload classic historic family photos from the archive album!”',
        '“Leave a sweet note for the next generation family vault!”'
      ],
      recommendedPlan: 'Starter Free or Premium Pass'
    }
  };

  const currentCapsule = capsuleDetails[activeType];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Hero Title */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300/60 text-slate-800 text-[11px] font-mono font-extrabold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-slate-900 shrink-0" />
          <span>{t('capsule_types_page.badge', 'Tailored Memory Vault Architectures')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          {t('capsule_types_page.hero_title', 'Memory Capsules Built for Every Milestone')}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl leading-relaxed">
          Select your event category below to explore specialized guest prompts, venue display layouts, audio wish booths, and printing setup guides.
        </p>

        {/* Category Selector Tabs */}
        <div className="pt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'weddings', label: 'Weddings & Anniversaries', icon: Heart },
            { id: 'birthdays', label: 'Birthdays & Milestones', icon: Sparkles },
            { id: 'corporate', label: 'Corporate & Galas', icon: Users },
            { id: 'family', label: 'Family Circles & Reunions', icon: Camera }
          ].map((cat) => {
            const isActive = activeType === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectType(cat.id as any)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer flex items-center space-x-3 ${
                  isActive 
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md' 
                    : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <cat.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-900'}`} />
                <span className="font-extrabold text-xs sm:text-sm">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Detail Display Card */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                <currentCapsule.icon className="w-3.5 h-3.5 text-slate-900" />
                <span>{currentCapsule.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
                {currentCapsule.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                {currentCapsule.desc}
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Key Capability Highlights:</p>
                {currentCapsule.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Sample Prompts Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-mono font-bold text-slate-500 uppercase">Preset Guest Prompts Included:</p>
                <div className="space-y-1.5">
                  {currentCapsule.samplePrompts.map((prompt, idx) => (
                    <p key={idx} className="text-xs text-slate-700 italic font-medium">
                      {prompt}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCreateEvent}
                  className="px-6 py-3 rounded-full text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 transition-all cursor-pointer shadow-md flex items-center space-x-2"
                >
                  <span>Start {currentCapsule.title} Capsule</span>
                  <Plus className="w-3.5 h-3.5 text-white" />
                </button>

                <button
                  type="button"
                  onClick={onTryDemo}
                  className="px-5 py-3 rounded-full text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Explore Demo Sandbox
                </button>
              </div>
            </div>

            {/* Right Visual Image Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md group">
                <img 
                  src={currentCapsule.heroImg} 
                  alt={currentCapsule.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Recommended Plan</span>
                    <p className="text-sm font-bold">{currentCapsule.recommendedPlan}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Comparison Grid across Capsule Types */}
      <section className="mt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Capsule Specs Comparison</span>
            <h3 className="text-2xl font-black text-slate-950">How KAVA Adapts To Your Event</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">Weddings</th>
                  <th className="py-3 px-4">Birthdays</th>
                  <th className="py-3 px-4">Corporate</th>
                  <th className="py-3 px-4">Family Circles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-950">Audio Wish Booth</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">Included (60s)</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">Included (30s)</td>
                  <td className="py-3 px-4 text-slate-500">Optional</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">Included (120s)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-950">Live Projection Stream</td>
                  <td className="py-3 px-4">Elegant Theme</td>
                  <td className="py-3 px-4">Party Grid</td>
                  <td className="py-3 px-4">Branded Sponsors</td>
                  <td className="py-3 px-4">Timeline View</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-950">Guest Access PIN</td>
                  <td className="py-3 px-4">Optional</td>
                  <td className="py-3 px-4">Open QR</td>
                  <td className="py-3 px-4">Domain / Code</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">Encrypted PIN</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-950">Master 4K ZIP Export</td>
                  <td className="py-3 px-4">Lossless EXIF</td>
                  <td className="py-3 px-4">Lossless EXIF</td>
                  <td className="py-3 px-4">Bulk Asset ZIP</td>
                  <td className="py-3 px-4">Lossless Vault</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-[28px] p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Ready to Build Your Custom Memory Capsule?</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium">
            Setting up takes under 60 seconds. Customize your guest prompts and launch your live screen display instantly.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCreateEvent}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold text-slate-950 bg-white hover:bg-slate-100 transition-all cursor-pointer shadow-md"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
