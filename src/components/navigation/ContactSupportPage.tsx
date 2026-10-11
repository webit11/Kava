import React, { useState } from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  Zap, 
  Send,
  AlertCircle,
  PhoneCall
} from 'lucide-react';
import { useTranslation } from '../../lib/useTranslation';

interface ContactSupportPageProps {
  onBackToHome: () => void;
  onCreateEvent: () => void;
  onNavigateSubView: (view: string) => void;
}

export default function ContactSupportPage({
  onBackToHome,
  onCreateEvent,
  onNavigateSubView
}: ContactSupportPageProps) {
  const { t } = useTranslation();
  
  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [category, setCategory] = useState('Event Setup');
  const [priority, setPriority] = useState('Normal');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `KAVA-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedTicketId(generatedId);
      setIsSubmitting(false);

      // Save ticket to localStorage for Admin Ticket Sync
      try {
        const existing = JSON.parse(localStorage.getItem('kava_admin_tickets') || '[]');
        const newTicket = {
          id: generatedId,
          subject: ticketSubject || `${category} Inquiry`,
          user: userName,
          userEmail: userEmail,
          category,
          priority,
          status: 'Open',
          created: new Date().toISOString(),
          message
        };
        localStorage.setItem('kava_admin_tickets', JSON.stringify([newTicket, ...existing]));
        window.dispatchEvent(new Event('kava_admin_tickets_updated'));
      } catch (err) {
        console.error('Failed to sync ticket to admin store', err);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-end mb-2">
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems 99.99% Operational</span>
          </span>
        </div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300/60 text-slate-800 text-[11px] font-mono font-extrabold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-slate-900 shrink-0" />
          <span>24/7 Host Peace of Mind</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          We Are Here for Your Event's Success
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl leading-relaxed">
          Need technical help setting up venue projectors, customizing QR cards, or managing plan upgrades? Submit a ticket below for immediate assistance.
        </p>
      </section>

      {/* Main Support Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Ticket Submission Form */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-950">Submit a Support Inquiry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Average host response time: under 12 minutes.</p>
            </div>

            {submittedTicketId ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-black text-slate-950">Support Ticket Created Successfully!</h3>
                  <p className="text-xs font-mono font-bold text-emerald-800 mt-1">Ticket Reference: #{submittedTicketId}</p>
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Our event specialists have received your details and dispatched an email notification to <span className="font-bold text-slate-900">{userEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedTicketId(null);
                    setMessage('');
                    setTicketSubject('');
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-950 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Sophia Chen"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="e.g. sophia@wedding.com"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Inquiry Topic</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900 font-medium"
                    >
                      <option value="Event Setup">Event Setup & QR Printing</option>
                      <option value="Live Screen">Live 4K Screen Display</option>
                      <option value="Billing & Plans">Billing & Regional Pricing</option>
                      <option value="Download Archive">4K ZIP Archive Export</option>
                      <option value="Enterprise">Enterprise Guild Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Priority Level</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900 font-medium"
                    >
                      <option value="Normal">Normal Inquiry</option>
                      <option value="High">High Priority</option>
                      <option value="Urgent">URGENT: Event Today!</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Event Code (Optional)</label>
                    <input
                      type="text"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      placeholder="e.g. WEDDING-2026"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Subject Summary</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief headline of what you need help with"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Detailed Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your event venue, display setup, or questions..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl font-extrabold text-xs text-white bg-slate-950 hover:bg-slate-800 transition-all cursor-pointer shadow-md flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Transmitting Ticket...' : 'Dispatch Support Ticket'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Right Direct Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-950">Direct Contact Options</h3>
              
              <div className="space-y-3 text-xs">
                <a 
                  href="mailto:hello@kava.com" 
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center space-x-3 transition-colors block text-slate-900"
                >
                  <Mail className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <p className="font-bold">Email Host Desk</p>
                    <p className="text-[11px] text-slate-500">hello@kava.com</p>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigateSubView('resources-help')}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center space-x-3 transition-colors cursor-pointer text-slate-900"
                >
                  <HelpCircle className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <p className="font-bold">Knowledge Base Guides</p>
                    <p className="text-[11px] text-slate-500">Read setup articles & FAQs</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Emergency Hotline for Enterprise */}
            <div className="bg-slate-950 text-white rounded-[28px] p-6 shadow-lg space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold">
                <PhoneCall className="w-4 h-4" />
                <span>ENTERPRISE EVENT DAY HOTLINE</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Enterprise Guild members receive direct phone dispatch for real-time venue streaming assistance on the day of their celebration.
              </p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
