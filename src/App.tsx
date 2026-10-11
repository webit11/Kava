import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { AppView, KavaEvent, KavaContribution, KavaGuest, Template, Testimonial, GlobalTestimonialStats } from './types';
import { INITIAL_EVENTS, INITIAL_CONTRIBUTIONS, INITIAL_GUESTS, INITIAL_TESTIMONIALS, INITIAL_TESTIMONIAL_STATS } from './data';
import { INITIAL_MARKETPLACE_TEMPLATES } from './initialTemplates';
import LandingPage from './components/LandingPage';
import OnboardingFlow from './components/OnboardingFlow';
import HostDashboard from './components/HostDashboard';
import GuestFlow from './components/GuestFlow';
import LiveExperience from './components/LiveExperience';
import SuperAdminPortal from './components/SuperAdminPortal';
import CheckoutModal from './components/CheckoutModal';
import CapsuleLimitModal from './components/CapsuleLimitModal';
import OfferPopupModal from './components/OfferPopupModal';
import JoinEventModal from './components/JoinEventModal';
import AuthPage from './components/AuthPage';
import { getActiveUser, logoutUser, HostUser } from './lib/auth';
import { validateEventJoinCode, recordGuestJoinSession } from './lib/eventValidation';
import { 
  fetchEvents, 
  fetchContributions, 
  fetchGuests, 
  createEventApi, 
  updateEventApi, 
  addContributionApi, 
  deleteContributionApi, 
  updateContributionApi, 
  addGuestApi, 
  joinEventApi,
  checkCapsuleCreationEntitlement
} from './lib/api';
import { Sparkles, Tv, Users, LayoutDashboard, Home, ArrowLeftRight, Shield } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // User Auth & State Synchronization
  const [currentUser, setCurrentUser] = useState<HostUser | null>(() => getActiveUser());

  useEffect(() => {
    const handleAuthSync = () => {
      setCurrentUser(getActiveUser());
    };
    window.addEventListener('kava_active_user_updated', handleAuthSync);
    window.addEventListener('storage', handleAuthSync);
    return () => {
      window.removeEventListener('kava_active_user_updated', handleAuthSync);
      window.removeEventListener('storage', handleAuthSync);
    };
  }, []);

  // Capsule Limit Contextual Modal state
  const [limitModalState, setLimitModalState] = useState<{
    isOpen: boolean;
    planName: string;
    maxEvents: number;
    currentEvents: number;
  }>({
    isOpen: false,
    planName: 'Free Starter',
    maxEvents: 1,
    currentEvents: 1,
  });

  const handleCreateCapsuleClick = async () => {
    const activeUser = getActiveUser();
    if (!activeUser || !activeUser.email) {
      navigate('/signup?redirect=/create-capsule/step/1&intendedAction=create_capsule');
      return;
    }

    try {
      const entitlement = await checkCapsuleCreationEntitlement();
      if (entitlement && !entitlement.canCreate && entitlement.isOverLimit) {
        setLimitModalState({
          isOpen: true,
          planName: entitlement.planName,
          maxEvents: entitlement.maxEvents,
          currentEvents: entitlement.currentEvents,
        });
        return;
      }
    } catch (err) {
      console.warn('Entitlement check error, continuing to onboarding:', err);
    }

    // Always navigate to Step 1 of onboarding flow
    navigate('/create-capsule/step/1');
  };

  // Checkout & Upgrade Modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutSelectedPlanId, setCheckoutSelectedPlanId] = useState<string>('Premium');
  const [checkoutTriggerReason, setCheckoutTriggerReason] = useState<string | undefined>(undefined);

  const handleOpenCheckout = (planId: string = 'Premium', reason?: string) => {
    setCheckoutSelectedPlanId(planId);
    setCheckoutTriggerReason(reason);
    setIsCheckoutOpen(true);
  };

  // Dynamic Template Marketplace State
  const [templates, setTemplates] = useState<Template[]>(() => {
    const local = localStorage.getItem('kava_marketplace_templates');
    return local ? JSON.parse(local) : INITIAL_MARKETPLACE_TEMPLATES;
  });

  useEffect(() => {
    localStorage.setItem('kava_marketplace_templates', JSON.stringify(templates));
  }, [templates]);

  // State Initialization with LocalStorage persistence
  const [events, setEvents] = useState<KavaEvent[]>(() => {
    const local = localStorage.getItem('kava_events');
    return local ? JSON.parse(local) : INITIAL_EVENTS;
  });

  const [contributions, setContributions] = useState<KavaContribution[]>(() => {
    const local = localStorage.getItem('kava_contributions');
    return local ? JSON.parse(local) : INITIAL_CONTRIBUTIONS;
  });

  const [guests, setGuests] = useState<KavaGuest[]>(() => {
    const local = localStorage.getItem('kava_guests');
    return local ? JSON.parse(local) : INITIAL_GUESTS;
  });

  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    const local = localStorage.getItem('kava_selected_event_id');
    return local || INITIAL_EVENTS[0].id;
  });

  // Testimonials CMS & Landing Page State
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const local = localStorage.getItem('kava_testimonials');
    return local ? JSON.parse(local) : INITIAL_TESTIMONIALS;
  });

  useEffect(() => {
    localStorage.setItem('kava_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  const [testimonialStats, setTestimonialStats] = useState<GlobalTestimonialStats>(() => {
    const local = localStorage.getItem('kava_testimonial_stats');
    return local ? JSON.parse(local) : INITIAL_TESTIMONIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem('kava_testimonial_stats', JSON.stringify(testimonialStats));
  }, [testimonialStats]);

  // Unified Support Tickets
  const [tickets, setTickets] = useState(() => {
    const local = localStorage.getItem('kava_admin_tickets');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return [
      {
        id: 'tkt-101',
        subject: 'Custom QR placement shifting on Safari',
        user: 'Sophia Chen',
        userEmail: 'sofia.chen@weddingmail.com',
        workspaceId: 'ws-1',
        workspaceName: 'Rodriguez-Chen Wedding',
        eventId: 'evt-wedding',
        category: 'Live Screen',
        priority: 'High',
        status: 'Open',
        created: '2026-07-18T19:46:00.000Z',
        lastActivity: '2026-07-18T19:46:00.000Z',
        assignedTo: 'Sarah Connor',
        unreadByHost: false,
        unreadByAdmin: true,
        tags: ['safari', 'css-bug'],
        systemDetails: {
          browser: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
          device: 'MacBook Pro (Apple Silicon)',
          appVersion: 'v2.4.1-prod',
          hasLogsAttached: true,
          systemLogs: [
            '[SYSTEM] WebSocket connected to ws://kava.co/live/evt-wedding',
            '[INFO] Preloaded 12 official wedding photos in 340ms',
            '[WARN] Detected Safari engine layout rendering shift on relative elements'
          ]
        },
        attachments: [
          { name: 'safari_rendering_error.png', size: '2.4 MB', url: '#', type: 'image/png' }
        ],
        messages: [
          {
            id: 'msg-1',
            sender: 'user',
            senderName: 'Sophia Chen',
            text: 'When I view the live screen on my Safari browser, the QR code overlaps with the footer text. It works fine on Chrome though.',
            timestamp: '2026-07-18T19:46:00.000Z'
          }
        ],
        auditLogs: [
          { id: 'log-1', actor: 'Sophia Chen', action: 'Created ticket with high priority', timestamp: '2026-07-18T19:46:00.000Z' },
          { id: 'log-2', actor: 'System', action: 'Assigned automatically to Sarah Connor', timestamp: '2026-07-18T19:46:05.000Z' }
        ]
      },
      {
        id: 'tkt-102',
        subject: 'Invoice download returns blank PDF',
        user: 'Devon Webb',
        userEmail: 'devon.webb@webbcorp.com',
        workspaceId: 'ws-4',
        workspaceName: 'Webb Corp Conferences',
        category: 'Billing',
        priority: 'Medium',
        status: 'In Progress',
        created: '2026-07-17T11:20:00.000Z',
        lastActivity: '2026-07-17T15:30:00.000Z',
        assignedTo: 'Artha Wibawa',
        unreadByHost: true,
        unreadByAdmin: false,
        tags: ['invoice', 'pdf-error'],
        systemDetails: {
          browser: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          device: 'Windows Desktop',
          appVersion: 'v2.4.1-prod',
          hasLogsAttached: false
        },
        messages: [
          {
            id: 'msg-2',
            sender: 'user',
            senderName: 'Devon Webb',
            text: 'I am trying to download my last corporate invoice but it comes out as a blank white page.',
            timestamp: '2026-07-17T11:20:00.000Z'
          },
          {
            id: 'msg-3',
            sender: 'admin',
            senderName: 'Artha Wibawa',
            text: 'Hello Devon, our billing team is checking the PDF template layout. We will update you shortly.',
            timestamp: '2026-07-17T15:30:00.000Z'
          }
        ],
        auditLogs: [
          { id: 'log-3', actor: 'Devon Webb', action: 'Created ticket', timestamp: '2026-07-17T11:20:00.000Z' },
          { id: 'log-4', actor: 'Artha Wibawa', action: 'Assigned ticket to self & set status to In Progress', timestamp: '2026-07-17T15:30:00.000Z' }
        ]
      },
      {
        id: 'tkt-103',
        subject: 'Can I upload high-fidelity 4K raw video?',
        user: 'Arthur Dent',
        userEmail: 'dent.arthur@galaxy.net',
        workspaceId: 'ws-3',
        workspaceName: 'Marcus Birthday Lounge',
        category: 'Technical Support',
        priority: 'Low',
        status: 'Resolved',
        created: '2026-07-15T09:00:00.000Z',
        lastActivity: '2026-07-16T10:00:00.000Z',
        assignedTo: 'Alex Chen',
        unreadByHost: false,
        unreadByAdmin: false,
        tags: ['4k-video', 'compression'],
        systemDetails: {
          browser: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15',
          device: 'MacBook Air',
          appVersion: 'v2.4.1-prod',
          hasLogsAttached: true,
          systemLogs: [
            '[INFO] Video compression hardware acceleration enabled',
            '[INFO] User tier is Free'
          ]
        },
        messages: [
          {
            id: 'msg-4',
            sender: 'user',
            senderName: 'Arthur Dent',
            text: 'Does KAVA compress the raw video from guests or is it stored pristine?',
            timestamp: '2026-07-15T09:00:00.000Z'
          },
          {
            id: 'msg-5',
            sender: 'admin',
            senderName: 'Alex Chen',
            text: 'Hi Arthur, we preserve pristine files for Premium workspaces up to 250MB per video. For free users, we transcode videos down to high-quality 1080p MP4 to save memory.',
            timestamp: '2026-07-16T10:00:00.000Z'
          }
        ],
        auditLogs: [
          { id: 'log-5', actor: 'Arthur Dent', action: 'Created ticket', timestamp: '2026-07-15T09:00:00.000Z' },
          { id: 'log-6', actor: 'Alex Chen', action: 'Resolved ticket with response', timestamp: '2026-07-16T10:00:00.000Z' }
        ],
        satisfactionRating: {
          score: 5,
          feedback: 'Perfect explanation, upgrading my account now!',
          timestamp: '2026-07-16T12:00:00.000Z'
        }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kava_admin_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Track show/hide of visual sandbox switcher controller
  const [showSandboxControls, setShowSandboxControls] = useState(true);

  // Impersonating User state
  const [impersonatingUser, setImpersonatingUser] = useState<string | null>(null);

  // Synchronize state from API Backend on initial mount
  useEffect(() => {
    let isMounted = true;
    async function initDataFromBackend() {
      try {
        const [apiEvents, apiContributions, apiGuests] = await Promise.all([
          fetchEvents(),
          fetchContributions(),
          fetchGuests(),
        ]);
        if (isMounted) {
          if (apiEvents && apiEvents.length > 0) {
            setEvents(apiEvents);
          }
          if (apiContributions && apiContributions.length > 0) {
            setContributions(apiContributions);
          }
          if (apiGuests && apiGuests.length > 0) {
            setGuests(apiGuests);
          }
        }
      } catch (err) {
        console.warn('Initial API sync warning (using cached data):', err);
      }
    }
    initDataFromBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state changes to LocalStorage as cache
  useEffect(() => {
    localStorage.setItem('kava_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('kava_contributions', JSON.stringify(contributions));
  }, [contributions]);

  useEffect(() => {
    localStorage.setItem('kava_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('kava_selected_event_id', selectedEventId);
  }, [selectedEventId]);

  // Derived active event
  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || INITIAL_EVENTS[0];
  }, [events, selectedEventId]);

  // Callbacks
  const handleCreateEventComplete = async (newEvent: KavaEvent) => {
    try {
      const persisted = await createEventApi(newEvent);
      const finalEvent = persisted || newEvent;
      setEvents((prev) => [finalEvent, ...prev.filter((e) => e.id !== finalEvent.id)]);
      setSelectedEventId(finalEvent.id);
      navigate(`/dashboard/events/${finalEvent.id}/overview`);
    } catch (err) {
      console.error('Create event API error:', err);
      setEvents((prev) => [newEvent, ...prev]);
      setSelectedEventId(newEvent.id);
      navigate(`/dashboard/events/${newEvent.id}/overview`);
    }
  };

  // Join Modal & Verification State
  const [joinModalState, setJoinModalState] = useState<{
    isOpen: boolean;
    mode: 'password' | 'expired' | 'not_open' | 'full' | 'qr_scanner' | 'disabled' | 'archived';
    event?: KavaEvent;
    errorMessage?: string;
    startDate?: string;
    expirationDate?: string;
    maxGuests?: number;
    currentGuests?: number;
    pendingCode?: string;
    joinMethod?: 'code' | 'qr' | 'invitation_link';
  }>({
    isOpen: false,
    mode: 'password',
  });
  const [isJoinVerifying, setIsJoinVerifying] = useState<boolean>(false);

  // Deep link parameter & direct invitation link handler (?code=XYZ, ?join=XYZ)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const queryCode = urlParams.get('code') || urlParams.get('join') || urlParams.get('c');
    
    let hashCode = '';
    if (window.location.hash) {
      const match = window.location.hash.match(/(?:join|code)\/([A-Za-z0-9\-_]+)/i);
      if (match) hashCode = match[1];
    }

    const targetCode = queryCode || hashCode;
    if (targetCode) {
      handleExecuteJoin(targetCode, undefined, 'invitation_link');
    }
  }, []);

  const handleExecuteJoin = async (
    rawCode: string,
    password?: string,
    joinMethod: 'code' | 'qr' | 'invitation_link' = 'code'
  ) => {
    setIsJoinVerifying(true);

    try {
      // Authoritative join verification against database
      const res = await joinEventApi(rawCode, password, joinMethod);

      if (res.success && res.event) {
        const targetEvent = res.event;

        // Synchronize in state
        setEvents((prev) => {
          const exists = prev.some((e) => e.id === targetEvent.id);
          if (exists) {
            return prev.map((e) => (e.id === targetEvent.id ? targetEvent : e));
          }
          return [targetEvent, ...prev];
        });

        if (res.guest) {
          setGuests((prev) => {
            const exists = prev.some((g) => g.id === res.guest!.id);
            if (exists) return prev;
            return [res.guest!, ...prev];
          });
        }

        setSelectedEventId(targetEvent.id);
        setJoinModalState({ isOpen: false, mode: 'password' });
        setIsJoinVerifying(false);

        navigate(`/guest/${targetEvent.code || targetEvent.id}`);
      } else {
        setIsJoinVerifying(false);

        if (res.status === 'invalid_code') {
          setJoinModalState({
            isOpen: false,
            mode: 'password',
          });
          alert(res.errorMessage || `No capsule found for code "${rawCode}". Please check your spelling and try again.`);
        } else if (res.status === 'password_required') {
          setJoinModalState({
            isOpen: true,
            mode: 'password',
            event: res.event,
            errorMessage: password ? 'Incorrect password. Please try again.' : res.errorMessage,
            pendingCode: rawCode,
            joinMethod,
          });
        } else {
          setJoinModalState({
            isOpen: true,
            mode: res.status as any,
            event: res.event,
            errorMessage: res.errorMessage,
            startDate: res.startDate,
            expirationDate: res.expirationDate,
            maxGuests: res.maxGuests,
            currentGuests: res.currentGuests,
            pendingCode: rawCode,
            joinMethod,
          });
        }
      }
    } catch (err) {
      console.warn('Execute join API fallback to local check:', err);
      const localRes = validateEventJoinCode(rawCode, events, guests, password);
      setIsJoinVerifying(false);

      if (localRes.success && localRes.event) {
        setSelectedEventId(localRes.event.id);
        setJoinModalState({ isOpen: false, mode: 'password' });
        navigate(`/guest/${localRes.event.code || localRes.event.id}`);
      } else {
        alert(localRes.errorMessage || 'Unable to verify invitation. Please check your connection and try again.');
      }
    }
  };

  const handleAddContribution = async (newCon: Omit<KavaContribution, 'id' | 'timestamp' | 'isPinned'>) => {
    const contributionId = `con-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // Evaluate initial status based on Event Contribution Approval Mode
    const activeEv = events.find((e) => e.id === (newCon.eventId || selectedEventId)) || events[0];
    const mode = activeEv?.settings?.contributionApprovalMode || (activeEv?.settings?.moderationApprovedOnly ? 'manual' : 'auto');
    const mixedConfig = activeEv?.settings?.mixedApprovalTypes || { photo: true, video: true, voice: false, wish: false };

    let initialStatus: 'approved' | 'pending' = 'approved';
    if (mode === 'manual') {
      initialStatus = 'pending';
    } else if (mode === 'mixed') {
      const typeKey = newCon.type;
      const requiresApproval = mixedConfig[typeKey] ?? (typeKey === 'photo' || typeKey === 'video');
      initialStatus = requiresApproval ? 'pending' : 'approved';
    } else {
      initialStatus = 'approved';
    }

    const finalCon: KavaContribution = {
      ...newCon,
      id: contributionId,
      timestamp,
      isPinned: false,
      status: initialStatus,
    };

    setContributions((prev) => [finalCon, ...prev]);

    // Persist contribution to backend API
    addContributionApi(finalCon).catch(console.error);

    // If auto-approved, synchronize with approvedConIds in event settings if present
    if (initialStatus === 'approved') {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === activeEv.id) {
            const currentApproved = e.settings?.approvedConIds || [];
            if (!currentApproved.includes(contributionId)) {
              const updatedSettings = {
                ...e.settings,
                approvedConIds: [...currentApproved, contributionId],
              };
              updateEventApi(e.id, { settings: updatedSettings }).catch(console.error);
              return {
                ...e,
                settings: updatedSettings,
              };
            }
          }
          return e;
        })
      );
    }

    // Check if guest is already registered, otherwise register them
    const guestExists = guests.some(
      (g) => g.eventId === selectedEventId && g.name.toLowerCase() === newCon.contributorName.toLowerCase()
    );

    if (!guestExists) {
      const newGuest: KavaGuest = {
        id: `gst-${Date.now()}`,
        eventId: selectedEventId,
        name: newCon.contributorName,
        contributionsCount: 1,
        joinedAt: timestamp,
      };
      setGuests((prev) => [newGuest, ...prev]);
      addGuestApi(newGuest).catch(console.error);
    } else {
      setGuests((prev) =>
        prev.map((g) =>
          g.eventId === selectedEventId && g.name.toLowerCase() === newCon.contributorName.toLowerCase()
            ? { ...g, contributionsCount: g.contributionsCount + 1 }
            : g
        )
      );
    }
  };

  const handleTogglePin = (id: string) => {
    setContributions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextPinned = !c.isPinned;
          updateContributionApi(id, { isPinned: nextPinned }).catch(console.error);
          return { ...c, isPinned: nextPinned };
        }
        return c;
      })
    );
  };

  const handleApprove = (id: string) => {
    updateContributionApi(id, { status: 'approved' }).catch(console.error);
    setContributions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c))
    );
  };

  const handleDeleteContribution = (id: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== id));
    deleteContributionApi(id).catch(console.error);
  };

  const handleUpdateEventSettings = (id: string, updates: Partial<KavaEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    updateEventApi(id, updates).catch(console.error);
  };

  const handleResetSandbox = () => {
    if (confirm("Are you sure you want to reset all data and re-initialize KAVA with default wedding seeds?")) {
      localStorage.clear();
      setEvents(INITIAL_EVENTS);
      setContributions(INITIAL_CONTRIBUTIONS);
      setGuests(INITIAL_GUESTS);
      setSelectedEventId(INITIAL_EVENTS[0].id);
      navigate('/');
    }
  };

  // Route Wrappers to guarantee URL/route parameters and state consistency
  const LandingRoute = () => {
    const isPricing = location.pathname === '/pricing';

    useEffect(() => {
      if (isPricing) {
        setTimeout(() => {
          const elem = document.getElementById('pricing');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }, [isPricing]);

    return (
      <LandingPage
        onCreateEvent={handleCreateCapsuleClick}
        onEnterCode={(code) => handleExecuteJoin(code, undefined, 'code')}
        onOpenQrScanner={() => setJoinModalState({ isOpen: true, mode: 'qr_scanner' })}
        isVerifying={isJoinVerifying}
        onTryDemo={() => {
          setSelectedEventId('evt-1');
          navigate('/dashboard/events/evt-1');
        }}
        onOpenCheckout={(planId) => handleOpenCheckout(planId)}
        testimonials={testimonials}
        testimonialStats={testimonialStats}
        events={events}
        contributions={contributions}
        currentUser={currentUser}
        onOpenAuth={(mode = 'signin') => {
          navigate(mode === 'signup' ? '/signup?redirect=/dashboard' : '/login?redirect=/dashboard');
        }}
        onOpenDashboard={() => navigate('/dashboard')}
        onLogout={() => {
          logoutUser();
          setCurrentUser(null);
        }}
      />
    );
  };

  const OnboardingRoute = () => {
    const { stepId } = useParams();
    const stepNum = Math.max(parseInt(stepId || '1', 10), 1);

    return (
      <OnboardingFlow
        initialStep={stepNum}
        onStepChange={(nextStep) => navigate(`/create-capsule/step/${nextStep}`)}
        onComplete={handleCreateEventComplete}
        onCancel={() => navigate('/')}
        onRequireAuth={() => {
          navigate(`/signup?redirect=/create-capsule/step/${stepNum}&intendedAction=create_capsule`);
        }}
      />
    );
  };

  const DashboardRoute = ({ initialTab }: { initialTab: string }) => {
    const { eventId } = useParams();
    const activeUser = getActiveUser();

    if (!activeUser && !impersonatingUser) {
      const redirectTarget = location.pathname + location.search;
      return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTarget)}`} replace />;
    }

    useEffect(() => {
      if (eventId) {
        const found = events.find((e) => e.id === eventId);
        if (found && found.id !== selectedEventId) {
          setSelectedEventId(found.id);
        }
      }
    }, [eventId, events, selectedEventId]);

    const targetEvent = useMemo(() => {
      if (eventId) {
        return events.find((e) => e.id === eventId) || activeEvent;
      }
      return activeEvent;
    }, [eventId, events, activeEvent]);

    const handleTabChange = (tab: string, currentEvId?: string) => {
      const activeEvId = currentEvId || targetEvent.id;
      const eventTabs = ['overview', 'guests', 'contributions', 'live', 'invitation', 'experience', 'analytics', 'settings'];
      
      if (eventTabs.includes(tab)) {
        navigate(`/dashboard/events/${activeEvId}/${tab}`);
      } else if (tab === 'events') {
        navigate('/dashboard/events');
      } else if (tab === 'home') {
        navigate('/dashboard');
      } else {
        const routeTab = tab === 'brand' ? 'brand-kit' : tab === 'workspace_settings' ? 'workspace-settings' : tab === 'whats_new' ? 'whats-new' : tab;
        navigate(`/dashboard/${routeTab}`);
      }
    };

    return (
      <HostDashboard
        initialTab={initialTab}
        onTabChange={handleTabChange}
        events={events}
        selectedEvent={targetEvent}
        onSelectEvent={(ev) => {
          setSelectedEventId(ev.id);
          navigate(`/dashboard/events/${ev.id}/overview`);
        }}
        contributions={contributions}
        guests={guests}
        setGuests={setGuests}
        onTogglePin={handleTogglePin}
        onApprove={handleApprove}
        onDeleteContribution={handleDeleteContribution}
        onLaunchLive={() => navigate(`/dashboard/events/${targetEvent.id}/live-screen`)}
        onLaunchGuestFlow={() => navigate(`/guest/${targetEvent.code || targetEvent.id}`)}
        onUpdateEventSettings={handleUpdateEventSettings}
        setEvents={setEvents}
        setContributions={setContributions}
        onCreateEvent={handleCreateCapsuleClick}
        onOpenCheckout={(planId, reason) => handleOpenCheckout(planId, reason)}
        impersonatingUser={impersonatingUser}
        tickets={tickets}
        onUpdateTickets={setTickets}
        templates={templates}
        onUpdateTemplates={setTemplates}
      />
    );
  };

  const JoinRoute = () => {
    const { eventCode } = useParams();
    const location = useLocation();

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const queryCode = eventCode || urlParams.get('code') || urlParams.get('join') || urlParams.get('c');

      if (queryCode) {
        handleExecuteJoin(queryCode, undefined, 'invitation_link');
      } else {
        setJoinModalState({ isOpen: true, mode: 'qr_scanner' });
      }
    }, [eventCode, location.search]);

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-md w-full space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto text-lg font-bold">
            K
          </div>
          <h2 className="text-xl font-bold text-slate-900">Connecting to Capsule...</h2>
          <p className="text-xs text-slate-500 font-light">Verifying your invitation code and accessing the guest lounge.</p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GuestRoute = () => {
    const { eventCode } = useParams();

    const matchedEvent = useMemo(() => {
      if (!eventCode) return activeEvent;
      return events.find((e) => e.code.toLowerCase() === eventCode.toLowerCase() || e.id === eventCode) || activeEvent;
    }, [eventCode, events, activeEvent]);

    return (
      <GuestFlow
        key={matchedEvent.id}
        event={matchedEvent}
        contributions={contributions}
        onSubmitContribution={handleAddContribution}
        onBackToLanding={() => navigate('/')}
      />
    );
  };

  const LiveRoute = () => {
    const { eventId } = useParams();

    const matchedEvent = useMemo(() => {
      if (!eventId) return activeEvent;
      return events.find((e) => e.id === eventId || e.code.toLowerCase() === eventId.toLowerCase()) || null;
    }, [eventId, events, activeEvent]);

    if (!matchedEvent) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl mb-4 shadow-xl">
            <Tv className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Live Screen Unavailable</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            The event capsule you are trying to view on the Live Screen was not found or is currently unavailable.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/events')}
              className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all cursor-pointer shadow-md"
            >
              Return to Host Dashboard
            </button>
            {activeEvent && (
              <button
                onClick={() => navigate(`/dashboard/events/${activeEvent.id}/live-screen`)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Open Active Capsule: {activeEvent.name}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <LiveExperience
        event={matchedEvent}
        contributions={contributions}
        onClose={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate(`/dashboard/events/${matchedEvent.id}/overview`);
          }
        }}
      />
    );
  };

  const AdminRoute = () => {
    const { tab } = useParams();

    return (
      <SuperAdminPortal
        initialTab={tab || 'dashboard'}
        onTabChange={(newTab) => navigate(`/admin/${newTab}`)}
        onBackToLanding={() => navigate('/')}
        events={events}
        contributions={contributions}
        guests={guests}
        onImpersonateUser={(userName, targetView) => {
          setImpersonatingUser(userName);
          if (targetView === 'guest') {
            navigate(`/guest/${activeEvent.code || activeEvent.id}`);
          } else {
            navigate('/dashboard');
          }
        }}
        setEvents={setEvents}
        setContributions={setContributions}
        setGuests={setGuests}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        tickets={tickets}
        onUpdateTickets={setTickets}
        templates={templates}
        onUpdateTemplates={setTemplates}
        testimonials={testimonials}
        onUpdateTestimonials={setTestimonials}
        testimonialStats={testimonialStats}
        onUpdateTestimonialStats={setTestimonialStats}
      />
    );
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-sans flex flex-col">
      
      {/* Impersonation Alert Banner */}
      {impersonatingUser && !location.pathname.startsWith('/admin') && (
        <div className="bg-slate-900 text-white px-6 py-3 text-xs flex items-center justify-between z-[9999] font-sans shadow-md border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="font-semibold text-slate-200">
              Impersonation Mode Active: Logged in as Host <strong className="text-white">"{impersonatingUser}"</strong> (Super Admin Bypass).
            </span>
          </div>
          <button
            onClick={() => {
              setImpersonatingUser(null);
              navigate('/admin/dashboard');
            }}
            className="bg-slate-100 hover:bg-white text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wide transition-all cursor-pointer shadow-sm"
          >
            Exit Impersonation & Return to Admin
          </button>
        </div>
      )}

      {/* Dynamic Routes */}
      <div className="flex-1">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/signup" element={<AuthPage mode="signup" onAuthSuccess={(u) => setCurrentUser(u)} />} />
          <Route path="/login" element={<AuthPage mode="login" onAuthSuccess={(u) => setCurrentUser(u)} />} />

          {/* Landing Page & Submenu Dynamic Routes */}
          <Route path="/" element={<LandingRoute />} />
          <Route path="/how-it-works" element={<LandingRoute />} />
          <Route path="/how-it-works/:tab" element={<LandingRoute />} />
          <Route path="/capsule-types" element={<LandingRoute />} />
          <Route path="/capsule-types/:tab" element={<LandingRoute />} />
          <Route path="/pricing" element={<LandingRoute />} />
          <Route path="/pricing/:tab" element={<LandingRoute />} />
          <Route path="/resources" element={<LandingRoute />} />
          <Route path="/resources/:tab" element={<LandingRoute />} />
          <Route path="/contact-support" element={<LandingRoute />} />
          <Route path="/support" element={<LandingRoute />} />
          <Route path="/legal" element={<LandingRoute />} />
          <Route path="/legal/:tab" element={<LandingRoute />} />

          {/* Shortcuts */}
          <Route path="/capsules" element={<Navigate to="/dashboard/events" replace />} />

          {/* Onboarding / Create Capsule */}
          <Route path="/create-capsule" element={<Navigate to="/create-capsule/step/1" replace />} />
          <Route path="/create-capsule/step/:stepId" element={<OnboardingRoute />} />

          {/* Host Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardRoute initialTab="home" />} />
          <Route path="/dashboard/events" element={<DashboardRoute initialTab="events" />} />
          <Route path="/dashboard/events/:eventId" element={<DashboardRoute initialTab="overview" />} />
          <Route path="/dashboard/events/:eventId/overview" element={<DashboardRoute initialTab="overview" />} />
          <Route path="/dashboard/events/:eventId/guests" element={<DashboardRoute initialTab="guests" />} />
          <Route path="/dashboard/events/:eventId/contributions" element={<DashboardRoute initialTab="contributions" />} />
          <Route path="/dashboard/events/:eventId/live" element={<DashboardRoute initialTab="live" />} />
          <Route path="/dashboard/events/:eventId/live-screen" element={<LiveRoute />} />
          <Route path="/dashboard/events/:eventId/settings" element={<DashboardRoute initialTab="settings" />} />
          <Route path="/dashboard/events/:eventId/experience" element={<DashboardRoute initialTab="experience" />} />
          <Route path="/dashboard/events/:eventId/invitation" element={<DashboardRoute initialTab="invitation" />} />
          <Route path="/dashboard/events/:eventId/analytics" element={<DashboardRoute initialTab="analytics" />} />
          <Route path="/dashboard/events/:eventId/support" element={<DashboardRoute initialTab="support" />} />

          {/* Host & Event URL Aliases */}
          <Route path="/host" element={<Navigate to="/dashboard" replace />} />
          <Route path="/host/events" element={<Navigate to="/dashboard/events" replace />} />
          <Route path="/host/events/:eventId" element={<Navigate to="/dashboard/events/:eventId/overview" replace />} />
          <Route path="/host/events/:eventId/live-screen" element={<LiveRoute />} />
          <Route path="/host/events/:eventId/live" element={<LiveRoute />} />
          <Route path="/host/events/:eventId/overview" element={<DashboardRoute initialTab="overview" />} />
          <Route path="/host/events/:eventId/guests" element={<DashboardRoute initialTab="guests" />} />
          <Route path="/host/events/:eventId/contributions" element={<DashboardRoute initialTab="contributions" />} />
          <Route path="/host/events/:eventId/settings" element={<DashboardRoute initialTab="settings" />} />
          <Route path="/host/events/:eventId/experience" element={<DashboardRoute initialTab="experience" />} />
          <Route path="/host/events/:eventId/invitation" element={<DashboardRoute initialTab="invitation" />} />
          <Route path="/host/events/:eventId/analytics" element={<DashboardRoute initialTab="analytics" />} />
          <Route path="/host/events/:eventId/support" element={<DashboardRoute initialTab="support" />} />

          <Route path="/events/:eventId/live-screen" element={<LiveRoute />} />
          <Route path="/events/:eventId/live" element={<LiveRoute />} />
          <Route path="/events/:eventId" element={<Navigate to="/dashboard/events/:eventId/overview" replace />} />

          <Route path="/dashboard/team" element={<DashboardRoute initialTab="team" />} />
          <Route path="/dashboard/brand-kit" element={<DashboardRoute initialTab="brand" />} />
          <Route path="/dashboard/templates" element={<DashboardRoute initialTab="templates" />} />
          <Route path="/dashboard/billing" element={<DashboardRoute initialTab="billing" />} />
          <Route path="/dashboard/profile" element={<DashboardRoute initialTab="profile" />} />
          <Route path="/dashboard/support" element={<DashboardRoute initialTab="support" />} />
          <Route path="/dashboard/help" element={<DashboardRoute initialTab="support" />} />
          <Route path="/dashboard/help-center" element={<DashboardRoute initialTab="support" />} />
          <Route path="/dashboard/guides" element={<DashboardRoute initialTab="guides" />} />
          <Route path="/dashboard/docs" element={<DashboardRoute initialTab="guides" />} />
          <Route path="/dashboard/whats-new" element={<DashboardRoute initialTab="whats_new" />} />
          <Route path="/dashboard/changelog" element={<DashboardRoute initialTab="whats_new" />} />
          <Route path="/dashboard/workspace-settings" element={<DashboardRoute initialTab="workspace_settings" />} />
          <Route path="/dashboard/notifications" element={<DashboardRoute initialTab="notifications" />} />

          {/* Guest Flow Routes */}
          <Route path="/join" element={<JoinRoute />} />
          <Route path="/join/:eventCode" element={<JoinRoute />} />
          <Route path="/c/:eventCode" element={<JoinRoute />} />
          <Route path="/guest/:eventCode" element={<GuestRoute />} />
          <Route path="/guest/:eventCode/step/:guestStep" element={<GuestRoute />} />

          {/* Dedicated Live Screen Routes */}
          <Route path="/live/:eventId" element={<LiveRoute />} />
          <Route path="/live-screen/:eventId" element={<LiveRoute />} />

          {/* Super Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/:tab" element={<AdminRoute />} />

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Interactive Sandbox Role Switcher */}
      {showSandboxControls && (
        <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md border border-[#EAEAEA] p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] max-w-sm hidden sm:block text-left transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAFAFA] mb-3">
            <div className="flex items-center space-x-2 text-[#111111]">
              <ArrowLeftRight className="w-4 h-4 text-[#C19A2E]" />
              <span className="font-bold text-xs tracking-tight uppercase font-mono">Sandbox Controller</span>
            </div>
            <button 
              onClick={() => setShowSandboxControls(false)}
              className="text-[10px] text-gray-400 hover:text-black font-semibold font-mono"
            >
              Hide
            </button>
          </div>

          <p className="text-[10px] text-gray-500 font-light mb-3 leading-relaxed">
            Switch between KAVA roles on the fly to test the collaborative full-loop sandbox experience!
          </p>

          <div className="grid grid-cols-2 gap-2 text-left">
            <button
              onClick={() => navigate('/')}
              className={`p-2 rounded-xl border text-[10px] font-bold flex items-center space-x-1.5 transition-all ${location.pathname === '/' || location.pathname === '/pricing' ? 'bg-[#111111] border-transparent text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-[#FAFAFA]/50'}`}
              id="switch-to-landing"
            >
              <Home className="w-3 h-3" />
              <span>Landing Page</span>
            </button>

            <button
              onClick={() => navigate('/create-capsule/step/1')}
              className={`p-2 rounded-xl border text-[10px] font-bold flex items-center space-x-1.5 transition-all ${location.pathname.startsWith('/create-capsule') ? 'bg-[#111111] border-transparent text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-[#FAFAFA]/50'}`}
              id="switch-to-onboarding"
            >
              <Sparkles className="w-3 h-3" />
              <span>Create Capsule</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-xl border text-[10px] font-bold flex items-center space-x-1.5 transition-all ${location.pathname.startsWith('/dashboard') ? 'bg-[#111111] border-transparent text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-[#FAFAFA]/50'}`}
              id="switch-to-dashboard"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Host Console</span>
            </button>

            <button
              onClick={() => navigate(`/guest/${activeEvent.code || activeEvent.id}`)}
              className={`p-2 rounded-xl border text-[10px] font-bold flex items-center space-x-1.5 transition-all ${location.pathname.startsWith('/guest') ? 'bg-[#111111] border-transparent text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-[#FAFAFA]/50'}`}
              id="switch-to-guest"
            >
              <Users className="w-3 h-3" />
              <span>Guest Room</span>
            </button>

            {/* Super Admin Portal shortcut */}
            <button
              onClick={() => navigate('/admin/dashboard')}
              className={`p-2 rounded-xl border text-[10px] font-bold flex items-center space-x-1.5 transition-all col-span-2 mt-1 ${location.pathname.startsWith('/admin') ? 'bg-amber-600 border-amber-700 text-white shadow-sm' : 'border-amber-100 bg-amber-50/70 text-amber-800 hover:bg-amber-100/70 hover:border-amber-300'}`}
              id="switch-to-admin"
            >
              <Shield className="w-3.5 h-3.5 text-current" />
              <span>Super Admin Portal</span>
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 mt-3 flex justify-between items-center">
            <span className="text-[9px] text-gray-400 font-mono">Active Code: {activeEvent.code}</span>
            <button
              onClick={handleResetSandbox}
              className="text-[9px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider font-mono cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      )}

      {/* Floating button to restore controller when hidden */}
      {!showSandboxControls && (
        <button
          onClick={() => setShowSandboxControls(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white p-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
          title="Show Sandbox Controller"
          id="btn-restore-sandbox"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      )}

      {/* Global Modals */}
      <CapsuleLimitModal
        isOpen={limitModalState.isOpen}
        onClose={() => setLimitModalState((prev) => ({ ...prev, isOpen: false }))}
        onUpgrade={(targetPlan, reason) => {
          setLimitModalState((prev) => ({ ...prev, isOpen: false }));
          handleOpenCheckout(targetPlan || 'Premium', reason);
        }}
        planName={limitModalState.planName}
        maxEvents={limitModalState.maxEvents}
        currentEvents={limitModalState.currentEvents}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlanId={checkoutSelectedPlanId}
        triggerReason={checkoutTriggerReason}
        onSuccess={() => {
          setIsCheckoutOpen(false);
          window.dispatchEvent(new Event('kava_subscription_changed'));
        }}
      />

      <OfferPopupModal
        onOpenCheckout={(planId) => handleOpenCheckout(planId, 'Promotional Offer Popup')}
      />

      <JoinEventModal
        isOpen={joinModalState.isOpen}
        onClose={() => setJoinModalState((prev) => ({ ...prev, isOpen: false }))}
        mode={joinModalState.mode}
        event={joinModalState.event}
        events={events}
        guests={guests}
        errorMessage={joinModalState.errorMessage}
        startDate={joinModalState.startDate}
        expirationDate={joinModalState.expirationDate}
        maxGuests={joinModalState.maxGuests}
        currentGuests={joinModalState.currentGuests}
        isLoading={isJoinVerifying}
        onSubmitPassword={(pass) => {
          if (joinModalState.pendingCode) {
            handleExecuteJoin(joinModalState.pendingCode, pass, joinModalState.joinMethod || 'code');
          }
        }}
        onSelectQrCode={(scannedCode) => {
          setJoinModalState({ isOpen: false, mode: 'password' });
          handleExecuteJoin(scannedCode, undefined, 'qr');
        }}
      />

    </div>
  );
}
