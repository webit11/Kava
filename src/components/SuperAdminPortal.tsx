import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, LayoutDashboard, Calendar, DollarSign, Ticket, Eye, Settings, 
  Shield, HardDrive, Database, Mail, Bell, FileText, Flag, Sliders, LogOut, 
  Search, Plus, Trash2, Check, X, Lock, Server, Clock, Sparkles, Filter, 
  ArrowUpRight, Activity, UserCheck, MoreHorizontal, Play, RefreshCw, 
  FileDown, ChevronDown, ChevronUp, ChevronRight, AlertTriangle, CheckCircle2, Copy, 
  Send, HelpCircle, Archive, Power, Terminal, ArrowLeft, Palette, Info,
  Star, Quote, ArrowUp, ArrowDown, Layers, GripVertical, Edit2, ExternalLink, Award, Image as ImageIcon,
  Camera, Video, Mic, MessageSquare, Tv, Pause, Crop, Upload, QrCode, Heart, MoveVertical, Zap, Smartphone, Globe, Megaphone, Layout, Menu
} from 'lucide-react';
import { KavaEvent, KavaContribution, KavaGuest, Template, TemplateVersion, Testimonial, GlobalTestimonialStats } from '../types';
import { INITIAL_TESTIMONIALS, INITIAL_TESTIMONIAL_STATS, COVER_PRESETS } from '../data';
import EmailAutomationCenter from './EmailAutomationCenter';
import SubscriptionManagement from './SubscriptionManagement';
import InteractiveTemplatePreview from './InteractiveTemplatePreview';
import SupportQueueCenter from './SupportQueueCenter';
import SupportSettingsManager from './SupportSettingsManager';
import { 
  FeatureFlagConfig, 
  getStoredFeatureFlags, 
  saveStoredFeatureFlags, 
  DEFAULT_FEATURE_FLAGS 
} from '../lib/featureFlags';
import FeatureFlagLivePreviewModal from './FeatureFlagLivePreviewModal';
import WorkspaceManagementPanel from './WorkspaceManagementPanel';
import FaqManagementPanel from './FaqManagementPanel';
import LandingBannerManagerPanel from './LandingBannerManagerPanel';
import { AdminSidebar } from './AdminSidebar';
import FooterManagerPanel from './FooterManagerPanel';
import LanguageSwitcher from './LanguageSwitcher';
import OnboardingManagerPanel from './OnboardingManagerPanel';
import TooltipManagerPanel from './TooltipManagerPanel';
import InteractiveTourSpotlight from './InteractiveTourSpotlight';
import { QrBrandingPanel } from './QrBrandingPanel';
import { OnboardingGuide, KavaNotificationItem } from '../types';
import { Compass } from 'lucide-react';
import { 
  getStoredNotifications, 
  saveStoredNotifications, 
  getReadNotifIds, 
  saveReadNotifIds, 
  getDeletedNotifIds, 
  saveDeletedNotifIds 
} from '../lib/notifications';

interface SuperAdminPortalProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
  onBackToLanding: () => void;
  events: KavaEvent[];
  contributions: KavaContribution[];
  guests: KavaGuest[];
  onImpersonateUser: (userName: string, targetView: 'dashboard' | 'guest') => void;
  setEvents?: React.Dispatch<React.SetStateAction<KavaEvent[]>>;
  setContributions?: React.Dispatch<React.SetStateAction<KavaContribution[]>>;
  setGuests?: React.Dispatch<React.SetStateAction<KavaGuest[]>>;
  selectedEventId?: string | null;
  setSelectedEventId?: React.Dispatch<React.SetStateAction<string | null>>;
  tickets?: any[];
  onUpdateTickets?: React.Dispatch<React.SetStateAction<any[]>>;
  templates: Template[];
  onUpdateTemplates: (newTemplates: Template[]) => void;
  testimonials?: Testimonial[];
  onUpdateTestimonials?: (testimonials: Testimonial[]) => void;
  testimonialStats?: GlobalTestimonialStats;
  onUpdateTestimonialStats?: (stats: GlobalTestimonialStats) => void;
}


export default function SuperAdminPortal({
  initialTab,
  onTabChange,
  onBackToLanding,
  events: initialEvents,
  contributions: initialContributions,
  guests: initialGuests,
  onImpersonateUser,
  setEvents,
  setContributions,
  setGuests,
  selectedEventId,
  setSelectedEventId,
  tickets = [],
  onUpdateTickets,
  templates,
  onUpdateTemplates,
  testimonials = INITIAL_TESTIMONIALS,
  onUpdateTestimonials,
  testimonialStats = INITIAL_TESTIMONIAL_STATS,
  onUpdateTestimonialStats
}: SuperAdminPortalProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kava_admin_session') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTabRaw] = useState<string>(initialTab || 'dashboard');

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTabRaw(initialTab);
    }
  }, [initialTab, activeTab]);

  const setActiveTab = useCallback((tab: string | ((prev: string) => string)) => {
    let nextTabVal: string;
    setActiveTabRaw((prev) => {
      nextTabVal = typeof tab === 'function' ? tab(prev) : tab;
      return nextTabVal;
    });
    if (onTabChange) {
      const resolved = typeof tab === 'function' ? nextTabVal! : tab;
      if (resolved) {
        onTabChange(resolved);
      }
    }
  }, [onTabChange]);

  useEffect(() => {
    if (activeTab === 'localization') {
      setActiveTab('dashboard');
    }
  }, [activeTab, setActiveTab]);
  const [isMobileAdminMenuOpen, setIsMobileAdminMenuOpen] = useState(false);
  const [isAdminSidebarCollapsed, setIsAdminSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kava_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleAdminSidebar = () => {
    setIsAdminSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('kava_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [previewTourGuide, setPreviewTourGuide] = useState<OnboardingGuide | null>(null);
  const [isPreviewTourOpen, setIsPreviewTourOpen] = useState(false);

  // Toast State
  const [adminToast, setAdminToast] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Admin Notification States
  const [isAdminNotifOpen, setIsAdminNotifOpen] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState<KavaNotificationItem[]>(() => getStoredNotifications());

  useEffect(() => {
    const handleUpdate = () => {
      setAdminNotifications(getStoredNotifications());
    };
    window.addEventListener('kava_notifications_updated' as any, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kava_notifications_updated' as any, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const adminUnreadCount = useMemo(() => adminNotifications.filter(n => n.unread).length, [adminNotifications]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.admin-notif-container')) {
        setIsAdminNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  const handleAdminMarkAllRead = () => {
    const readSet = getReadNotifIds();
    adminNotifications.forEach(n => readSet.add(n.id));
    saveReadNotifIds(readSet);
    const updated = adminNotifications.map(n => ({ ...n, unread: false }));
    setAdminNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleAdminDeleteNotif = (id: string) => {
    const deletedSet = getDeletedNotifIds();
    deletedSet.add(id);
    saveDeletedNotifIds(deletedSet);
    const updated = adminNotifications.filter(n => n.id !== id);
    setAdminNotifications(updated);
    saveStoredNotifications(updated);
  };

  const triggerToast = (title: string, desc: string, type: 'success' | 'info' | 'error' = 'success') => {
    setAdminToast({ title, desc, type });
    setTimeout(() => setAdminToast(null), 4000);
  };

  // Testimonials CMS State
  const [testimonialItems, setTestimonialItems] = useState<Testimonial[]>(testimonials);
  const [testimonialMetrics, setTestimonialMetrics] = useState<GlobalTestimonialStats>(testimonialStats);

  useEffect(() => {
    setTestimonialItems(testimonials);
  }, [testimonials]);

  useEffect(() => {
    setTestimonialMetrics(testimonialStats);
  }, [testimonialStats]);

  // Modal / Editor States for Testimonials
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [creationOption, setCreationOption] = useState<'featured_event' | 'manual'>('featured_event');
  const [selectedEventForImport, setSelectedEventForImport] = useState<string>('');
  
  // Story Builder Modal States
  const [storyBuilderActiveTab, setStoryBuilderActiveTab] = useState<'photos' | 'videos' | 'voice' | 'wishes' | 'live'>('photos');
  const [storyPlayingVoice, setStoryPlayingVoice] = useState<boolean>(false);
  const [simulatedUploadProgress, setSimulatedUploadProgress] = useState<number | null>(null);
  const [storyOpenSections, setStoryOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    cover: true,
    gallery: true,
    videosVoice: true,
    priorityPublish: true,
    preview: true
  });

  const [draggedTestimonialId, setDraggedTestimonialId] = useState<string | null>(null);

  const handleSaveTestimonialList = (newItems: Testimonial[]) => {
    setTestimonialItems(newItems);
    if (onUpdateTestimonials) {
      onUpdateTestimonials(newItems);
    }
    localStorage.setItem('kava_testimonials', JSON.stringify(newItems));
    window.dispatchEvent(new CustomEvent('kava_testimonials_updated'));
  };

  const handleSaveMetrics = (newMetrics: GlobalTestimonialStats) => {
    setTestimonialMetrics(newMetrics);
    if (onUpdateTestimonialStats) {
      onUpdateTestimonialStats(newMetrics);
    }
    localStorage.setItem('kava_testimonial_stats', JSON.stringify(newMetrics));
    window.dispatchEvent(new CustomEvent('kava_testimonial_stats_updated'));
  };

  // Drag and Drop Testimonial Reordering
  const handleDragStartTestimonial = (id: string) => {
    setDraggedTestimonialId(id);
  };

  const handleDragOverTestimonial = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropTestimonial = (targetId: string) => {
    if (!draggedTestimonialId || draggedTestimonialId === targetId) return;
    const sorted = [...testimonialItems].sort((a, b) => a.order - b.order);
    const draggedIdx = sorted.findIndex(t => t.id === draggedTestimonialId);
    const targetIdx = sorted.findIndex(t => t.id === targetId);
    if (draggedIdx < 0 || targetIdx < 0) return;

    const [movedItem] = sorted.splice(draggedIdx, 1);
    sorted.splice(targetIdx, 0, movedItem);

    const updated = sorted.map((item, idx) => ({ ...item, order: idx + 1 }));
    handleSaveTestimonialList(updated);
    setDraggedTestimonialId(null);
    triggerToast("Carousel Order Updated", "Testimonial order rearranged via drag and drop.");
  };

  // Reorder Handler
  const handleMoveTestimonial = (id: string, direction: 'up' | 'down') => {
    const sorted = [...testimonialItems].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(t => t.id === id);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    // Swap order values
    const tempOrder = sorted[index].order;
    sorted[index].order = sorted[targetIndex].order;
    sorted[targetIndex].order = tempOrder;

    handleSaveTestimonialList(sorted);
    triggerToast("Order Updated", "Testimonial order resequenced successfully.");
  };

  // Toggle Publish
  const handleTogglePublishTestimonial = (id: string) => {
    const updated = testimonialItems.map(t => 
      t.id === id ? { ...t, isPublished: !t.isPublished } : t
    );
    handleSaveTestimonialList(updated);
    const item = updated.find(t => t.id === id);
    triggerToast("Status Updated", `Testimonial set to ${item?.isPublished ? 'Published' : 'Unpublished'}.`);
  };

  // Set Featured
  const handleFeatureTestimonial = (id: string) => {
    const updated = testimonialItems.map(t => ({
      ...t,
      isFeatured: t.id === id ? true : false
    }));
    handleSaveTestimonialList(updated);
    triggerToast("Featured Capsule Set", "Testimonial set as featured on landing page.");
  };

  // Delete Testimonial
  const handleDeleteTestimonial = (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      const updated = testimonialItems.filter(t => t.id !== id);
      handleSaveTestimonialList(updated);
      triggerToast("Deleted", "Testimonial removed permanently.", "info");
    }
  };

  // Import Event Data into Form
  const handleSelectEventForImport = (eventId: string) => {
    setSelectedEventForImport(eventId);
    const event = initialEvents.find(e => e.id === eventId);
    if (!event) return;

    const eventContribs = initialContributions.filter(c => c.eventId === eventId);
    const photoUrls = eventContribs.filter(c => c.type === 'photo').map(c => c.url).filter((u): u is string => Boolean(u));
    const videoContribs = eventContribs.filter(c => c.type === 'video');
    const voiceContribs = eventContribs.filter(c => c.type === 'voice');
    const wishContribs = eventContribs.filter(c => c.type === 'wish');

    const gallery = photoUrls.length > 0 ? photoUrls.slice(0, 10) : COVER_PRESETS.slice(0, 4);

    const importedVideos = videoContribs.length > 0
      ? videoContribs.map((v, idx) => ({
          id: v.id || `vid-${idx}`,
          url: v.url || 'https://assets.mixkit.co/videos/preview/mixkit-wedding-guests-toast-to-the-couple-41584-large.mp4',
          title: `Guest Toast Video from ${v.contributorName || 'Guest'}`,
          duration: '0:42',
          thumbnail: event.coverUrl || COVER_PRESETS[1],
          caption: v.text || 'Live candid guest video',
          isFeatured: idx === 0
        }))
      : [
          {
            id: 'vid-default-1',
            url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-guests-toast-to-the-couple-41584-large.mp4',
            title: 'First Dance & Toast Highlight',
            duration: '0:45',
            thumbnail: event.coverUrl || COVER_PRESETS[1],
            caption: 'Recorded live by guest from Table 4',
            isFeatured: true
          }
        ];

    const importedVoice = voiceContribs.length > 0
      ? voiceContribs.map((vc, idx) => ({
          id: vc.id || `vc-${idx}`,
          url: vc.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          sender: vc.contributorName || 'Uncle David & Family',
          duration: vc.audioDuration || '0:58',
          transcript: vc.text || `${event.name.split(' ')[0]}, seeing you two so happy tonight brought tears to our eyes. We love you both!`,
          waveform: [15, 30, 45, 20, 60, 40, 75, 50, 30, 65, 80, 40, 25, 55, 35, 20, 45, 30]
        }))
      : [
          {
            id: 'vc-default-1',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            sender: 'Uncle David & Aunt Maya',
            duration: '0:58',
            transcript: `${event.name.split(' ')[0]}, seeing you so happy tonight brought tears to our eyes! Best wishes forever!`,
            waveform: [15, 30, 45, 20, 60, 40, 75, 50, 30, 65, 80, 40, 25, 55, 35, 20, 45, 30]
          }
        ];

    const importedWishes = wishContribs.length > 0
      ? wishContribs.map((w, idx) => ({
          id: w.id || `wish-${idx}`,
          sender: w.contributorName || 'The Miller Family',
          text: w.text || 'May your love grow deeper with every passing year!',
          table: 'Table 2',
          time: '10:15 PM',
          likes: 24
        }))
      : [
          {
            id: 'wish-default-1',
            sender: 'The Miller Family',
            text: 'May your love grow deeper with every passing year. Thank you for including us in your celebration!',
            table: 'Table 2',
            time: '10:15 PM',
            likes: 24
          }
        ];

    setEditingTestimonial(prev => ({
      ...prev,
      sourceType: 'featured_event',
      eventId: event.id,
      coverImage: event.coverUrl || COVER_PRESETS[0],
      coverPosition: prev?.coverPosition !== undefined ? prev.coverPosition : 50,
      galleryImages: gallery,
      featuredGalleryIndex: 0,
      videos: importedVideos,
      voiceMessages: importedVoice,
      wishes: importedWishes,
      eventCategory: event.type || 'Wedding',
      eventTitle: event.name,
      hostName: event.name || 'Sofia & Leo',
      guestCount: event.guestCount || 180,
      uploadedPhotos: eventContribs.length || 420,
      testimonialTitle: prev?.testimonialTitle || `Captured ${eventContribs.length || 420}+ unscripted memories in 100% original quality`,
      quote: prev?.quote || "KAVA made capturing candid photos and voice notes from our guests effortless and beautiful.",
      rating: prev?.rating || 5,
      mediaPriority: prev?.mediaPriority || 'photos',
      status: prev?.status || 'published',
      isPublished: prev?.isPublished !== false,
      isFeatured: prev?.isFeatured || false
    }));
  };

  // Save Modal Form
  const handleSaveEditingTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.quote) {
      triggerToast("Validation Error", "Please provide a testimonial quote.", "error");
      return;
    }

    const maxOrder = Math.max(...testimonialItems.map(t => t.order), 0);
    const pubStatus = editingTestimonial.status || (editingTestimonial.isPublished !== false ? 'published' : 'draft');

    let updatedList: Testimonial[];
    if (editingTestimonial.id) {
      const updatedItem: Testimonial = {
        ...(editingTestimonial as Testimonial),
        isPublished: pubStatus === 'published',
        status: pubStatus,
        updatedAt: new Date().toISOString()
      };
      
      if (updatedItem.isFeatured) {
        updatedList = testimonialItems.map(t => t.id === updatedItem.id ? updatedItem : { ...t, isFeatured: false });
      } else {
        updatedList = testimonialItems.map(t => t.id === updatedItem.id ? updatedItem : t);
      }
      triggerToast("Testimonial Updated", "Story Builder configurations saved successfully.");
    } else {
      const newItem: Testimonial = {
        id: `tst-${Date.now()}`,
        sourceType: creationOption,
        eventId: editingTestimonial.eventId,
        coverImage: editingTestimonial.coverImage || COVER_PRESETS[0],
        coverPosition: editingTestimonial.coverPosition !== undefined ? editingTestimonial.coverPosition : 50,
        galleryImages: editingTestimonial.galleryImages && editingTestimonial.galleryImages.length > 0 ? editingTestimonial.galleryImages : COVER_PRESETS.slice(0, 4),
        galleryCaptions: editingTestimonial.galleryCaptions || {},
        featuredGalleryIndex: editingTestimonial.featuredGalleryIndex || 0,
        videos: editingTestimonial.videos || [],
        voiceMessages: editingTestimonial.voiceMessages || [],
        wishes: editingTestimonial.wishes || [],
        hostName: editingTestimonial.hostName || 'Event Host',
        eventTitle: editingTestimonial.eventTitle || 'Special Celebration',
        eventCategory: editingTestimonial.eventCategory || 'Celebration',
        testimonialTitle: editingTestimonial.testimonialTitle || 'Amazing Experience',
        quote: editingTestimonial.quote || '',
        rating: editingTestimonial.rating || 5,
        guestCount: editingTestimonial.guestCount || 100,
        uploadedPhotos: editingTestimonial.uploadedPhotos || 300,
        mediaPriority: editingTestimonial.mediaPriority || 'photos',
        status: pubStatus,
        scheduledAt: editingTestimonial.scheduledAt || '',
        isFeatured: editingTestimonial.isFeatured || false,
        isPublished: pubStatus === 'published',
        order: maxOrder + 1,
        createdAt: new Date().toISOString()
      };
      
      if (newItem.isFeatured) {
        updatedList = testimonialItems.map(t => ({ ...t, isFeatured: false })).concat(newItem);
      } else {
        updatedList = [...testimonialItems, newItem];
      }
      triggerToast("Testimonial Created", "New story added to Landing Page Testimonials CMS.");
    }

    handleSaveTestimonialList(updatedList);
    setIsTestimonialModalOpen(false);
    setEditingTestimonial(null);
  };

  // ----------------------------------------------------
  // Mock Admin States (initialized from local storage or defaults)
  // ----------------------------------------------------

  // Users State
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('kava_admin_users');
    if (local) return JSON.parse(local);
    return [
      { id: 'usr-artha', name: 'Artha Wibawa', email: 'arthawibawa777@gmail.com', role: 'Host', status: 'Active', workspaces: 2, joined: '2026-05-15', plan: 'Premium' },
      { id: 'usr-1', name: 'Jane Cooper', email: 'jane.cooper@example.com', role: 'Host', status: 'Active', workspaces: 2, joined: '2026-03-12', plan: 'Premium' },
      { id: 'usr-2', name: 'Arthur Dent', email: 'dent.arthur@galaxy.net', role: 'Host', status: 'Active', workspaces: 1, joined: '2026-04-18', plan: 'Free' },
      { id: 'usr-3', name: 'Sophia Chen', email: 'sofia.chen@weddingmail.com', role: 'Host', status: 'Active', workspaces: 3, joined: '2026-01-05', plan: 'Premium' },
      { id: 'usr-4', name: 'Devon Webb', email: 'devon@webb-corp.com', role: 'Host', status: 'Suspended', workspaces: 1, joined: '2026-02-28', plan: 'Enterprise' },
      { id: 'usr-5', name: 'Aris Thorne', email: 'aris.thorne@stanford.edu', role: 'Contributor', status: 'Active', workspaces: 0, joined: '2026-07-10', plan: 'Free' },
      { id: 'usr-6', name: 'Sarah Jenkins', email: 'sarah.j@outlook.com', role: 'Contributor', status: 'Active', workspaces: 0, joined: '2026-06-20', plan: 'Free' }
    ];
  });

  const saveUsers = (updatedUsers: any[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('kava_admin_users', JSON.stringify(updatedUsers));
    window.dispatchEvent(new CustomEvent('kava_plans_updated'));
    window.dispatchEvent(new CustomEvent('kava_active_user_updated'));
  };

  // Multi-Role User Management System States
  const [userRoleSubTab, setUserRoleSubTab] = useState<'hosts' | 'guests' | 'workspace_admins' | 'super_admins'>('hosts');
  
  // Hosts filters
  const [hostPlanFilter, setHostPlanFilter] = useState('All');
  const [hostStatusFilter, setHostStatusFilter] = useState('All');

  // Guests State & Filters
  const [guestsList, setGuestsList] = useState<any[]>(() => {
    const local = localStorage.getItem('kava_admin_guests_v2');
    if (local) {
      try { return JSON.parse(local); } catch (e) { /* fallback */ }
    }
    return [
      { id: 'gst-101', name: 'Marcus Vance', email: 'marcus.vance@gmail.com', phone: '+1 (555) 234-5678', eventId: 'evt-101', eventName: 'Rodriguez-Chen Wedding', eventCode: 'SOPHIA-LEO', joinedAt: '2026-07-15', lastActivity: '2026-07-18T14:20:00Z', device: 'Mobile', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', status: 'Active', contributionsCount: 12, contributionTypes: { photo: 8, video: 2, voice: 1, wish: 1 } },
      { id: 'gst-102', name: 'Elena Rostova', email: 'elena.rostova@designlab.io', phone: '+1 (555) 876-5432', eventId: 'evt-101', eventName: 'Rodriguez-Chen Wedding', eventCode: 'SOPHIA-LEO', joinedAt: '2026-07-16', lastActivity: '2026-07-18T16:45:00Z', device: 'Mobile', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', status: 'Active', contributionsCount: 7, contributionTypes: { photo: 5, video: 1, voice: 0, wish: 1 } },
      { id: 'gst-103', name: 'Liam Hemsworth', email: 'liam.h@hollywood.org', phone: '+1 (555) 345-6789', eventId: 'evt-102', eventName: 'Stanford Class of 2016 Reunion', eventCode: 'STANFORD-16', joinedAt: '2026-07-10', lastActivity: '2026-07-17T20:10:00Z', device: 'Desktop', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', status: 'Active', contributionsCount: 4, contributionTypes: { photo: 2, video: 0, voice: 1, wish: 1 } },
      { id: 'gst-104', name: 'Chloe Bennett', email: 'chloe.b@marvelnet.com', phone: '+1 (555) 987-6543', eventId: 'evt-101', eventName: 'Rodriguez-Chen Wedding', eventCode: 'SOPHIA-LEO', joinedAt: '2026-07-18', lastActivity: '2026-07-18T18:00:00Z', device: 'Mobile', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', status: 'Blocked', contributionsCount: 3, contributionTypes: { photo: 1, video: 1, voice: 0, wish: 1 } },
      { id: 'gst-105', name: 'Devon Miller', email: 'dmiller@techcorp.io', phone: '+1 (555) 456-7890', eventId: 'evt-103', eventName: 'Marcus 30th Birthday Lounge', eventCode: 'MARCUS-30', joinedAt: '2026-07-08', lastActivity: '2026-07-12T11:30:00Z', device: 'Mobile', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', status: 'Left', contributionsCount: 2, contributionTypes: { photo: 1, video: 0, voice: 0, wish: 1 } }
    ];
  });

  const saveGuests = (updated: any[]) => {
    setGuestsList(updated);
    localStorage.setItem('kava_admin_guests_v2', JSON.stringify(updated));
  };

  const [guestEventFilter, setGuestEventFilter] = useState('All');
  const [guestStatusFilter, setGuestStatusFilter] = useState('All');
  const [guestTypeFilter, setGuestTypeFilter] = useState('All');
  const [selectedGuestForHistory, setSelectedGuestForHistory] = useState<any | null>(null);

  // Workspace Admins State & Filters
  const [workspaceAdminsList, setWorkspaceAdminsList] = useState<any[]>(() => {
    const local = localStorage.getItem('kava_admin_ws_admins');
    if (local) {
      try { return JSON.parse(local); } catch (e) { /* fallback */ }
    }
    return [
      { id: 'wsa-1', name: 'Samantha Reed', email: 'samantha.reed@eventagency.co', title: 'Senior Event Producer', assignedWorkspaces: ['ws-artha', 'ws-1'], teamMembersCount: 4, managedGuestsCount: 240, managedEventsCount: 3, permissions: { manageEvents: true, manageGuests: true, manageTeam: true, moderateContent: true }, status: 'Active', joinedAt: '2026-04-10', lastActive: '2026-07-18T15:30:00Z' },
      { id: 'wsa-2', name: 'Carlos Mendoza', email: 'carlos.mendoza@weddingplanner.es', title: 'Wedding Operations Lead', assignedWorkspaces: ['ws-1'], teamMembersCount: 2, managedGuestsCount: 180, managedEventsCount: 1, permissions: { manageEvents: true, manageGuests: true, manageTeam: false, moderateContent: true }, status: 'Active', joinedAt: '2026-05-22', lastActive: '2026-07-17T19:12:00Z' },
      { id: 'wsa-3', name: 'Rachel Green', email: 'rachel@webb-events.com', title: 'Corporate Hub Manager', assignedWorkspaces: ['ws-4'], teamMembersCount: 6, managedGuestsCount: 520, managedEventsCount: 3, permissions: { manageEvents: true, manageGuests: true, manageTeam: true, moderateContent: false }, status: 'Suspended', joinedAt: '2026-03-01', lastActive: '2026-07-10T09:00:00Z' }
    ];
  });

  const saveWorkspaceAdmins = (updated: any[]) => {
    setWorkspaceAdminsList(updated);
    localStorage.setItem('kava_admin_ws_admins', JSON.stringify(updated));
  };

  const [wsAdminWsFilter, setWsAdminWsFilter] = useState('All');
  const [wsAdminStatusFilter, setWsAdminStatusFilter] = useState('All');
  const [editingWsAdmin, setEditingWsAdmin] = useState<any | null>(null);
  const [isSimulatingWsAdmin, setIsSimulatingWsAdmin] = useState(false);

  // Super Admins State & Filters
  const [superAdminsList, setSuperAdminsList] = useState<any[]>(() => {
    const local = localStorage.getItem('kava_admin_super_admins');
    if (local) {
      try { return JSON.parse(local); } catch (e) { /* fallback */ }
    }
    return [
      { id: 'sa-1', name: 'Artha Wibawa', email: 'arthawibawa777@gmail.com', title: 'Lead Systems Architect & Super Admin', securityClearance: 'Full Platform Access', mfaEnabled: true, lastIp: '192.168.1.45', lastActive: '2026-07-18T18:50:00Z', status: 'Active', joinedAt: '2026-01-01' },
      { id: 'sa-2', name: 'KAVA System Core Admin', email: 'admin@kava.com', title: 'Chief Security Officer', securityClearance: 'Full Platform Access', mfaEnabled: true, lastIp: '10.0.1.12', lastActive: '2026-07-18T18:42:00Z', status: 'Active', joinedAt: '2026-01-01' },
      { id: 'sa-3', name: 'Sarah Connor', Email: 'sarah.connor@kava.com', title: 'Director of Compliance & Infrastructure', securityClearance: 'Full Platform Access', mfaEnabled: true, lastIp: '10.0.4.88', lastActive: '2026-07-17T11:20:00Z', status: 'Active', joinedAt: '2026-02-15' }
    ];
  });

  const saveSuperAdmins = (updated: any[]) => {
    setSuperAdminsList(updated);
    localStorage.setItem('kava_admin_super_admins', JSON.stringify(updated));
  };

  const [superAdminStatusFilter, setSuperAdminStatusFilter] = useState('All');

  // Role Permissions Matrix
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const local = localStorage.getItem('kava_role_permissions_matrix');
    if (local) {
      try { return JSON.parse(local); } catch (e) { /* fallback */ }
    }
    return {
      Host: {
        createEvents: true,
        manageSettings: true,
        inviteGuests: true,
        customBranding: true,
        exportMedia: true,
        accessBilling: true,
        systemConfig: false,
        manageAdmins: false
      },
      Guest: {
        joinEvents: true,
        uploadPhotos: true,
        uploadVideos: true,
        recordVoice: true,
        writeWishes: true,
        downloadMedia: true,
        viewLiveWall: true,
        accessBilling: false
      },
      WorkspaceAdmin: {
        manageAssignedWorkspaces: true,
        manageAssignedEvents: true,
        manageAssignedGuests: true,
        manageTeamMembers: true,
        moderateContent: true,
        accessBilling: false,
        systemConfig: false,
        superAdminTools: false
      },
      SuperAdmin: {
        manageAssignedWorkspaces: true,
        manageAssignedEvents: true,
        manageAssignedGuests: true,
        manageTeamMembers: true,
        moderateContent: true,
        accessBilling: true,
        systemConfig: true,
        superAdminTools: true
      }
    };
  });

  const saveRolePermissions = (updated: any) => {
    setRolePermissions(updated);
    localStorage.setItem('kava_role_permissions_matrix', JSON.stringify(updated));
  };

  const [showRolePermissionsModal, setShowRolePermissionsModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState<'host' | 'guest' | 'ws_admin' | 'super_admin' | null>(null);

  // Workspaces State
  const [workspaces, setWorkspaces] = useState(() => {
    const local = localStorage.getItem('kava_admin_workspaces');
    let baseWorkspaces = [];
    if (local) {
      try {
        baseWorkspaces = JSON.parse(local);
      } catch (e) {
        // Fallback
      }
    }
    if (!baseWorkspaces || baseWorkspaces.length === 0) {
      baseWorkspaces = [
        { id: 'ws-artha', name: 'Personal Studio', host: 'Artha Wibawa', plan: 'Premium', eventsCount: 2, storageMB: 120, maxStorageMB: 5120, status: 'Active' },
        { id: 'ws-1', name: 'Rodriguez-Chen Wedding', host: 'Sophia Chen', plan: 'Premium', eventsCount: 1, storageMB: 420, maxStorageMB: 2048, status: 'Active' },
        { id: 'ws-2', name: 'Stanford Reunion Hub', host: 'Aris Thorne', plan: 'Free', eventsCount: 1, storageMB: 98, maxStorageMB: 500, status: 'Active' },
        { id: 'ws-3', name: 'Marcus Birthday Lounge', host: 'Arthur Dent', plan: 'Free', eventsCount: 1, storageMB: 12, maxStorageMB: 500, status: 'Archived' },
        { id: 'ws-4', name: 'Webb Corp Conferences', host: 'Devon Webb', plan: 'Enterprise', eventsCount: 3, storageMB: 4890, maxStorageMB: 10240, status: 'Suspended' }
      ];
    }
    
    // Inject brand settings from localStorage if available
    return baseWorkspaces.map((ws: any) => {
      const logoUrl = localStorage.getItem(`kava_brand_logo_${ws.id}`);
      const primaryColor = localStorage.getItem(`kava_brand_primary_${ws.id}`);
      const accentColor = localStorage.getItem(`kava_brand_accent_${ws.id}`);
      const typography = localStorage.getItem(`kava_brand_typography_${ws.id}`);
      
      if (logoUrl || primaryColor || accentColor || typography) {
        return {
          ...ws,
          brandKit: {
            logoUrl: logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&h=80&q=80',
            primaryColor: primaryColor || '#0F172A',
            accentColor: accentColor || '#111111',
            typography: typography || 'Inter'
          }
        };
      }
      return ws;
    });
  });

  const saveWorkspaces = (updatedWs: any[]) => {
    setWorkspaces(updatedWs);
    localStorage.setItem('kava_admin_workspaces', JSON.stringify(updatedWs));
    window.dispatchEvent(new CustomEvent('kava_workspace_updated'));
  };

  // Support Tickets Queue
  const saveTickets = (updatedTkts: any[]) => {
    if (onUpdateTickets) {
      onUpdateTickets(updatedTkts);
    }
    localStorage.setItem('kava_admin_tickets', JSON.stringify(updatedTkts));
  };

  // Selected Ticket detail state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [supportSubTab, setSupportSubTab] = useState<'queue' | 'channels'>('queue');

  // Template Marketplace Management local states
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreatingNewTemplate, setIsCreatingNewTemplate] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('All');
  const [templatePlanFilter, setTemplatePlanFilter] = useState<string>('All');
  const [templateStatusFilter, setTemplateStatusFilter] = useState<string>('All');
  
  // Template Editor Workspace States
  const [editorActiveTab, setEditorActiveTab] = useState<'metadata' | 'design' | 'releases'>('metadata');
  const [designActiveSection, setDesignActiveSection] = useState<string>('colors');
  const [newVersionNum, setNewVersionNum] = useState('');
  const [newVersionReleaseNotes, setNewVersionReleaseNotes] = useState('');
  const [newVersionAutoUpdate, setNewVersionAutoUpdate] = useState(true);

  // Content Moderation list
  const [moderationFeed, setModerationFeed] = useState<KavaContribution[]>(() => {
    return initialContributions.map(c => ({
      ...c,
      // Ensure all initial ones have status, or default to reviewed
      isPinned: c.isPinned
    }));
  });

  // Trust & Safety escalations state
  const [safetyEscalations, setSafetyEscalations] = useState<any[]>(() => {
    return [
      {
        id: 'esc-101',
        type: 'user_reported',
        severity: 'high',
        source: 'User Report #4102 (Sofia & Leo Wedding)',
        targetId: 'con-wish-3',
        targetType: 'contribution',
        description: 'Guest wish contains aggressive political debate and verbal abuse.',
        timestamp: '2026-07-19T02:15:00Z',
        status: 'Pending Review'
      },
      {
        id: 'esc-102',
        type: 'dmca',
        severity: 'critical',
        source: 'Apex Wedding Photography LLC',
        targetId: 'con-photo-5',
        targetType: 'contribution',
        description: 'Formal DMCA notice claiming exclusive commercial rights to guest-reposted portrait.',
        timestamp: '2026-07-18T19:42:00Z',
        status: 'Pending Review'
      },
      {
        id: 'esc-103',
        type: 'spam',
        severity: 'low',
        source: 'Automated Bot Detection',
        targetId: 'con-wish-9',
        targetType: 'contribution',
        description: 'Repeated similar characters (12 messages in 30 seconds from same IP segment).',
        timestamp: '2026-07-19T03:01:00Z',
        status: 'Pending Review'
      },
      {
        id: 'esc-104',
        type: 'tos_violation',
        severity: 'medium',
        source: 'Automated Image Classifier',
        targetId: 'con-photo-2',
        targetType: 'contribution',
        description: 'Detected advertisement watermark and commercial QR code inside image canvas.',
        timestamp: '2026-07-19T01:30:00Z',
        status: 'Action Taken'
      },
      {
        id: 'esc-105',
        type: 'abuse',
        severity: 'high',
        source: 'User Report #4098',
        targetId: 'usr-guest-92',
        targetType: 'account',
        description: 'Host reports guest account uploading continuous offensive memes to live board.',
        timestamp: '2026-07-18T22:11:00Z',
        status: 'Resolved - Blocked'
      }
    ];
  });

  // Feature Flags State (Synced with lib/featureFlags)
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagConfig[]>(() => {
    return getStoredFeatureFlags();
  });

  // Feature Flags UI & Modal Filters
  const [selectedFlagForPreview, setSelectedFlagForPreview] = useState<FeatureFlagConfig | null>(null);
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const [flagSearch, setFlagSearch] = useState('');
  const [flagCategoryFilter, setFlagCategoryFilter] = useState('ALL');
  const [flagStatusFilter, setFlagStatusFilter] = useState('ALL');

  useEffect(() => {
    saveStoredFeatureFlags(featureFlags);
  }, [featureFlags]);

  // System Configurations
  const [systemConfigs, setSystemConfigs] = useState(() => {
    const local = localStorage.getItem('kava_admin_configs');
    if (local) return JSON.parse(local);
    return {
      storageFreeLimitMB: 500,
      storagePremiumLimitMB: 5120,
      maxUploadSizeMB: 150,
      mailServerHost: 'smtp.sendgrid.net',
      mailServerPort: '587',
      apiRateLimit: 120,
      sessionTimeoutMin: 60,
      googleClientKey: '6748912-kava.apps.googleusercontent.com',
      autoModerationScore: 85
    };
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    return [
      { id: 'log-1', admin: 'SuperAdmin', action: 'Suspend User', target: 'Devon Webb (devon@webb-corp.com)', time: '2026-07-18T18:12:00', ip: '192.168.1.45', status: 'Success' },
      { id: 'log-2', admin: 'SuperAdmin', action: 'Update Feature Flag', target: 'Smart Voice BGM Ducking -> 25%', time: '2026-07-18T17:34:00', ip: '192.168.1.45', status: 'Success' },
      { id: 'log-3', admin: 'Moderator_01', action: 'Approve Contribution', target: 'Photo con-7 (Aris Thorne)', time: '2026-07-18T16:01:00', ip: '10.0.4.12', status: 'Success' },
      { id: 'log-4', admin: 'FinanceAdmin', action: 'Refund Subscription', target: 'Invoice #KAVA-9112 ($49.00)', time: '2026-07-18T14:45:00', ip: '10.0.12.89', status: 'Success' },
      { id: 'log-5', admin: 'SuperAdmin', action: 'System Backup', target: 'Manual Snapshot (DB_VER_2.4)', time: '2026-07-18T12:00:00', ip: '127.0.0.1', status: 'Success' }
    ];
  });

  // Email Templates
  const [emailTemplates, setEmailTemplates] = useState(() => {
    return [
      { id: 'tpl-1', name: 'Capsule Welcome Invitation', subject: 'You are invited to Sofia & Leo\'s Memory Capsule!', tags: ['{{guest_name}}', '{{event_name}}', '{{event_code}}'], content: 'Hello {{guest_name}},\n\nWelcome to {{event_name}}! Scan your QR code or enter code "{{event_code}}" on KAVA to share your beautiful photos, videos, and wishes with us live!' },
      { id: 'tpl-2', name: 'Transactional Password Reset', subject: 'KAVA Secure Access Reset Request', tags: ['{{user_name}}', '{{reset_link}}'], content: 'Dear {{user_name}},\n\nWe received a request to securely reset your password. Click the link below to verify identity:\n{{reset_link}}\n\nThis code expires in 15 minutes.' },
      { id: 'tpl-3', name: 'Subscribed Account Upgraded', subject: 'Your KAVA Workspace is now Golden!', tags: ['{{user_name}}', '{{plan_name}}', '{{storage_limit}}'], content: 'Congratulations {{user_name}}!\n\nYour workspace has been successfully upgraded to {{plan_name}}. You now have {{storage_limit}} of cloud storage, active watermark templates, custom layout sliders, and ad-free live projection walls.' }
    ];
  });

  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editingTemplateSubject, setEditingTemplateSubject] = useState('');
  const [editingTemplateContent, setEditingTemplateContent] = useState('');

  // Active Alerts / Notifications (with status, details and resolution workflows)
  const [adminAlerts, setAdminAlerts] = useState<{ id: string; type: string; msg: string; category: string; status?: string; details?: string }[]>(() => {
    const local = localStorage.getItem('kava_admin_alerts');
    if (local) return JSON.parse(local);
    return [
      { id: 'alt-1', type: 'warning', msg: 'System storage capacity has crossed 82%', category: 'Capacity', status: 'Active', details: 'S3 cold bucket storage usage is currently 8.4GB of the 10.0GB system capacity limit. Consider triggering garbage collection or expanding limit.' },
      { id: 'alt-2', type: 'error', msg: 'Mail server API key returned 401 Authentication Error', category: 'Integrations', status: 'Active', details: 'SendGrid API returned a 401 Unauthorized status on transactional emails. Check SMTP mail configurations.' },
      { id: 'alt-3', type: 'info', msg: 'High-volume Premium upgrade received from Devon Webb', category: 'Finance', status: 'Active', details: 'Webb Corp upgraded to Enterprise Guild package. Subscription transaction succeeded for $299.00.' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kava_admin_alerts', JSON.stringify(adminAlerts));
  }, [adminAlerts]);

  // Real-time Billing Transactions
  const [transactions, setTransactions] = useState(() => {
    const local = localStorage.getItem('kava_admin_transactions');
    if (local) return JSON.parse(local);
    return [
      { id: 'tx-101', user: 'Sophia Chen', email: 'sofia.chen@weddingmail.com', workspace: 'Rodriguez-Chen Wedding', plan: 'Premium', amount: 49.00, date: '2026-07-18', status: 'Succeeded', type: 'Event License' },
      { id: 'tx-102', user: 'Artha Wibawa', email: 'arthawibawa777@gmail.com', workspace: 'Personal Studio', plan: 'Premium', amount: 29.00, date: '2026-07-16', status: 'Succeeded', type: 'Monthly Plan' },
      { id: 'tx-103', user: 'Devon Webb', email: 'devon@webb-corp.com', workspace: 'Webb Corp Conferences', plan: 'Enterprise', amount: 299.00, date: '2026-07-15', status: 'Succeeded', type: 'Monthly Plan' },
      { id: 'tx-104', user: 'Arthur Dent', email: 'dent.arthur@galaxy.net', workspace: 'Marcus Birthday Lounge', plan: 'Free', amount: 0.00, date: '2026-07-10', status: 'Succeeded', type: 'Free Trial' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kava_admin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // System status logs terminal
  const [systemLogs, setSystemLogs] = useState<string[]>(() => {
    return [
      `[${new Date().toISOString().slice(11, 19)}] KAVA System Core initializing...`,
      `[${new Date().toISOString().slice(11, 19)}] Database Connection Pool active: 24 connections.`,
      `[${new Date().toISOString().slice(11, 19)}] S3 Connection validated successfully on region us-east-1.`,
      `[${new Date().toISOString().slice(11, 19)}] Stripe Webhook listener established: /api/webhooks/stripe`,
      `[${new Date().toISOString().slice(11, 19)}] SendGrid API Handshake complete. Status: 200 OK.`,
      `[${new Date().toISOString().slice(11, 19)}] WebSocket cluster node #1 operating online.`
    ];
  });

  // API endpoint connections status
  const [apiStatuses, setApiStatuses] = useState({
    gemini: { status: 'Healthy', latency: 45, checkedAt: 'Just now' },
    maps: { status: 'Healthy', latency: 32, checkedAt: 'Just now' },
    stripe: { status: 'Healthy', latency: 98, checkedAt: 'Just now' },
    sendgrid: { status: 'Healthy', latency: 120, checkedAt: 'Just now' }
  });

  // Auto-refresh control toggling
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Selected Alert for details modal
  const [selectedAlert, setSelectedAlert] = useState<{ id: string; type: string; msg: string; category: string; status?: string; details?: string } | null>(null);

  // Platform Communication Center States
  const [broadcastSubTab, setBroadcastSubTab] = useState<'overview' | 'editor' | 'history' | 'analytics'>('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewChannel, setPreviewChannel] = useState<'banner' | 'popup' | 'inbox' | 'email'>('banner');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUserPicker, setSearchUserPicker] = useState('');
  const [searchWorkspacePicker, setSearchWorkspacePicker] = useState('');
  const [selectedAnalyticsBc, setSelectedAnalyticsBc] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'id' | 'de' | 'es' | 'fr'>('en');

  // Multi-select searchable pickers open state
  const [showUserPickerDropdown, setShowUserPickerDropdown] = useState(false);
  const [showWorkspacePickerDropdown, setShowWorkspacePickerDropdown] = useState(false);

  // Modals confirmation states
  const [showConfirmModal, setShowConfirmModal] = useState<{ type: 'publish' | 'archive' | 'cancel' | 'discard'; targetId?: string; payload?: any } | null>(null);

  // Broadcast Form States
  const [formBcId, setFormBcId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formType, setFormType] = useState('announcement'); // announcement, maintenance, feature_update, security_alert, billing_reminder, promotional_campaign, onboarding_message, emergency_notification, custom_broadcast
  const [formPriority, setFormPriority] = useState('Medium'); // Low, Medium, High, Critical
  const [formChannels, setFormChannels] = useState<string[]>(['in_app_banner', 'notification_center']); // in_app_banner, notification_center, dashboard_popup, email, push_notification, announcement_center
  const [formTargetUsers, setFormTargetUsers] = useState<string[]>(['All']);
  const [formTargetWorkspaces, setFormTargetWorkspaces] = useState<string[]>(['All']);
  const [formTargetPlans, setFormTargetPlans] = useState<string[]>(['Free', 'Premium', 'Enterprise']);
  const [formTargetEventTypes, setFormTargetEventTypes] = useState<string[]>(['All']);
  const [formTargetCountries, setFormTargetCountries] = useState<string[]>(['All']);
  const [formTargetLanguages, setFormTargetLanguages] = useState<string[]>(['All']);
  const [formTargetStatuses, setFormTargetStatuses] = useState<string[]>(['Active']);
  const [formSchedulingType, setFormSchedulingType] = useState('Instant'); // Instant, Scheduled
  const [formSchedulingDate, setFormSchedulingDate] = useState('');
  const [formExpirationDate, setFormExpirationDate] = useState('');
  const [formRecurring, setFormRecurring] = useState('None'); // None, Daily, Weekly, Monthly
  const [formPinToDashboard, setFormPinToDashboard] = useState(false);
  const [formAckRequired, setFormAckRequired] = useState(false);
  const [formDismissible, setFormDismissible] = useState(true);
  const [formCtaLabel, setFormCtaLabel] = useState('');
  const [formCtaUrl, setFormCtaUrl] = useState('');
  const [formIcon, setFormIcon] = useState('Bell');
  const [formMultilingual, setFormMultilingual] = useState<Record<string, { title: string; content: string }>>({
    en: { title: '', content: '' },
    id: { title: '', content: '' },
    de: { title: '', content: '' },
    es: { title: '', content: '' },
    fr: { title: '', content: '' }
  });

  // Broadcast announcements state
  const [broadcasts, setBroadcasts] = useState<any[]>(() => {
    const local = localStorage.getItem('kava_admin_broadcasts');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return parsed.map((bc: any) => ({
          content: bc.content || 'Important alert regarding KAVA services.',
          channels: bc.channels || ['in_app_banner', 'notification_center'],
          targetPlans: bc.targetPlans || ['Free', 'Premium', 'Enterprise'],
          targetCountries: bc.targetCountries || ['All'],
          targetLanguages: bc.targetLanguages || ['All'],
          targetStatuses: bc.targetStatuses || ['Active'],
          targetUsers: bc.targetUsers || ['All'],
          targetWorkspaces: bc.targetWorkspaces || ['All'],
          targetEventTypes: bc.targetEventTypes || ['All'],
          priority: bc.priority || 'Medium',
          schedulingType: bc.schedulingType || 'Instant',
          schedulingDate: bc.schedulingDate || '',
          expirationDate: bc.expirationDate || '',
          recurring: bc.recurring || 'None',
          pinToDashboard: bc.pinToDashboard !== undefined ? bc.pinToDashboard : false,
          ackRequired: bc.ackRequired !== undefined ? bc.ackRequired : false,
          dismissible: bc.dismissible !== undefined ? bc.dismissible : true,
          ctaLabel: bc.ctaLabel || '',
          ctaUrl: bc.ctaUrl || '',
          icon: bc.icon || 'Bell',
          multilingual: bc.multilingual || { en: { title: bc.title, content: bc.content || 'Important alert regarding KAVA services.' } },
          analytics: bc.analytics || {
            recipientsCount: 7,
            deliveredCount: 7,
            viewedCount: bc.views || 0,
            ackCount: 0,
            clickedCount: 0,
            dismissedCount: 0,
            emailOpenedCount: 0,
            failedCount: 0,
            engagementRate: 0
          },
          versions: bc.versions || [{ version: 1, author: 'SuperAdmin', timestamp: new Date().toISOString(), title: bc.title }],
          created: bc.created || new Date().toISOString(),
          ...bc
        }));
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'bc-1',
        title: 'Platform Maintenance Notice',
        content: 'We will perform scheduled network maintenance on July 24 between 02:00 and 04:00 UTC. Some services might experience minor connection lags.',
        type: 'maintenance',
        priority: 'High',
        status: 'Published',
        channels: ['in_app_banner', 'notification_center'],
        targetUsers: ['All'],
        targetWorkspaces: ['All'],
        targetPlans: ['Free', 'Premium', 'Enterprise'],
        targetEventTypes: ['All'],
        targetCountries: ['All'],
        targetLanguages: ['All'],
        targetStatuses: ['Active'],
        schedulingType: 'Instant',
        schedulingDate: '',
        expirationDate: '2026-07-25T00:00:00Z',
        recurring: 'None',
        pinToDashboard: true,
        ackRequired: true,
        dismissible: false,
        ctaLabel: 'Live Status Page',
        ctaUrl: 'https://status.kava.co',
        icon: 'AlertTriangle',
        multilingual: {
          en: { title: 'Platform Maintenance Notice', content: 'We will perform scheduled network maintenance on July 24 between 02:00 and 04:00 UTC. Some services might experience minor connection lags.' },
          id: { title: 'Pengumuman Pemeliharaan Platform', content: 'Kami akan melakukan pemeliharaan jaringan terjadwal pada 24 Juli dari 02:00 hingga 04:00 UTC. Beberapa layanan mungkin mengalami sedikit kelambatan.' }
        },
        analytics: {
          recipientsCount: 7,
          deliveredCount: 7,
          viewedCount: 6,
          ackCount: 5,
          clickedCount: 2,
          dismissedCount: 0,
          emailOpenedCount: 4,
          failedCount: 0,
          engagementRate: 85
        },
        versions: [
          { version: 1, author: 'SuperAdmin', timestamp: '2026-07-18T10:00:00.000Z', title: 'Platform Maintenance Notice' }
        ],
        created: '2026-07-18T10:00:00.000Z'
      },
      {
        id: 'bc-2',
        title: 'Unlock Retro Polaroid Collection!',
        content: 'Bring old-school charm to your live memory wall! We just released a vintage theme pack including retro borders, polaroid shadows, and sepia photo tint algorithms.',
        type: 'promotional_campaign',
        priority: 'Low',
        status: 'Draft',
        channels: ['notification_center', 'dashboard_popup', 'email'],
        targetUsers: ['All'],
        targetWorkspaces: ['All'],
        targetPlans: ['Free'],
        targetEventTypes: ['wedding', 'birthday', 'party'],
        targetCountries: ['All'],
        targetLanguages: ['All'],
        targetStatuses: ['Active'],
        schedulingType: 'Instant',
        schedulingDate: '',
        expirationDate: '2026-08-15T00:00:00Z',
        recurring: 'None',
        pinToDashboard: false,
        ackRequired: false,
        dismissible: true,
        ctaLabel: 'Select Theme',
        ctaUrl: '/brand',
        icon: 'Sparkles',
        multilingual: {
          en: { title: 'Unlock Retro Polaroid Collection!', content: 'Bring old-school charm to your live memory wall! We just released a vintage theme pack.' }
        },
        analytics: {
          recipientsCount: 3,
          deliveredCount: 3,
          viewedCount: 0,
          ackCount: 0,
          clickedCount: 0,
          dismissedCount: 0,
          emailOpenedCount: 0,
          failedCount: 0,
          engagementRate: 0
        },
        versions: [
          { version: 1, author: 'SuperAdmin', timestamp: '2026-07-19T01:22:00.000Z', title: 'Unlock Retro Polaroid Collection!' }
        ],
        created: '2026-07-19T01:22:00.000Z'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kava_admin_broadcasts', JSON.stringify(broadcasts));
  }, [broadcasts]);

  // Roles permission mapping
  const [rolesPermissions, setRolesPermissions] = useState({
    'Super Admin': { users: true, system: true, billing: true, moderate: true, audit: true },
    'Support Specialist': { users: true, system: false, billing: true, moderate: true, audit: false },
    'Moderator': { users: false, system: false, billing: false, moderate: true, audit: false },
    'Finance Admin': { users: false, system: false, billing: true, moderate: false, audit: false }
  });

  // Backup & Restore states (with persistent storage)
  const [backupLogs, setBackupLogs] = useState(() => {
    const local = localStorage.getItem('kava_backup_logs');
    if (local) return JSON.parse(local);
    return [
      { id: 'snap-1', file: 'KAVA_SNAPSHOT_20260718_1200.json', size: '4.2 MB', creator: 'SuperAdmin', timestamp: 'Today, 12:00 PM', type: 'Automated' },
      { id: 'snap-2', file: 'KAVA_SNAPSHOT_20260711_0000.json', size: '3.9 MB', creator: 'System Scheduler', timestamp: '7 days ago', type: 'Scheduled' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kava_backup_logs', JSON.stringify(backupLogs));
  }, [backupLogs]);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);

  // Real-time Auto Refresh Simulation
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // 1. Add log
      const actions = [
        'API Request: GET /api/capsules', 
        'WebSocket Broadcast: ping response',
        'Cache Hit: premium-theme-config',
        'DB Connection checked: idle nodes count = 18',
        'CDN Cache validated: assets.kava.co',
        'Stripe Ledger ping: 200 OK'
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] ${randomAction}`, ...prev.slice(0, 49)]);

      // 2. Occasionally fluctuate CPU/Memory latency slightly
      setApiStatuses(prev => ({
        gemini: { ...prev.gemini, latency: Math.floor(prev.gemini.latency * (0.85 + Math.random() * 0.3)) },
        maps: { ...prev.maps, latency: Math.floor(prev.maps.latency * (0.85 + Math.random() * 0.3)) },
        stripe: { ...prev.stripe, latency: Math.floor(prev.stripe.latency * (0.85 + Math.random() * 0.3)) },
        sendgrid: { ...prev.sendgrid, latency: Math.floor(prev.sendgrid.latency * (0.85 + Math.random() * 0.3)) },
      }));

      // 3. Occasionally trigger a passive system notification or activity
      if (Math.random() < 0.2) {
        const simActivities = [
          'Guest anonymized guest-421 uploaded a photo',
          'Admin SuperAdmin updated feature rollouts',
          'S3 bucket synchronization completed successfully',
          'Transactional email dispatched to Sofia Chen'
        ];
        const simAct = simActivities[Math.floor(Math.random() * simActivities.length)];
        setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] [SYS] ${simAct}`, ...prev.slice(0, 49)]);
      }

    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // User details Modal / Actions
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

  // Pagination states
  const [userPage, setUserPage] = useState(0);
  const itemsPerPage = 4;

  // ----------------------------------------------------
  // Template Marketplace Management Handlers
  // ----------------------------------------------------
  const handleCreateTemplate = () => {
    const defaultTemplate: Template = {
      id: 'template-' + Date.now(),
      name: 'New Custom Template',
      description: 'An elegant layout with polished designs for unforgettable events.',
      category: 'General',
      tags: ['Modern', 'Dynamic'],
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      previewImages: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
      ],
      previewVideos: [],
      version: '1.0.0',
      author: 'KAVA Admin Office',
      compatibility: 'All Modern Browsers',
      premiumBadge: false,
      featuredBadge: false,
      plan: 'Free',
      releaseNotes: 'V1.0.0: Initial custom template deployment.',
      rating: 5.0,
      ratingCount: 0,
      downloads: 0,
      status: 'Unpublished',
      order: templates.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versionHistory: [],
      config: {
        presentationTheme: 'minimal_light',
        presentationBackgroundType: 'solid',
        presentationBgColor: '#FAFAFA',
        presentationBgGradient: 'linear-gradient(180deg, #FAFAFA, #F4F4F5)',
        presentationFontFamily: 'sans',
        transitionAnimation: 'fade',
        slideshowInterval: 5,
        screenMargins: 'normal',
        safeAreaEnabled: true,
        guestVisibility: 'all',
        allowedTypes: ['photo', 'wish'],
        photoTitle: 'Submit Memories',
        photoDesc: 'Drop your photographs or wishes directly to our screen',
        photoEnableFrame: false,
        photoEnableWatermark: false,
        photoFilter: 'none',
        wishTheme: 'minimal_light',
        wishFont: 'sans',
        wishBubbleStyle: 'minimal',
        qrCodePosition: 'bottom-right',
        qrCodeSize: 'medium',
        alwaysShowQr: true,
        joinLinkVisible: true,
        logoVisible: false,
        footerVisible: true,
        footerText: 'Powered by KAVA',
        enableBgm: false,
        bgmVolume: 0,
        greetingEnabled: false,
        greetingType: 'none',
        globalSuccessMessage: 'Thank you! Your post is saved.',
        globalCelebrationAnimation: 'sparkles'
      }
    };
    setEditingTemplate(defaultTemplate);
    setIsCreatingNewTemplate(true);
    setEditorActiveTab('metadata');
    setDesignActiveSection('colors');
    setNewVersionNum('1.1.0');
    setNewVersionReleaseNotes('');
    setNewVersionAutoUpdate(true);
  };

  const handleEditTemplate = (tmpl: Template) => {
    setEditingTemplate(JSON.parse(JSON.stringify(tmpl))); // deep copy
    setIsCreatingNewTemplate(false);
    setEditorActiveTab('metadata');
    setDesignActiveSection('colors');
    
    // Auto calculate next patch version
    let nextV = '1.0.1';
    const parts = tmpl.version.split('.');
    if (parts.length === 3) {
      const patch = parseInt(parts[2], 10);
      if (!isNaN(patch)) {
        nextV = `${parts[0]}.${parts[1]}.${patch + 1}`;
      }
    } else {
      nextV = tmpl.version + '.1';
    }
    setNewVersionNum(nextV);
    setNewVersionReleaseNotes('');
    setNewVersionAutoUpdate(true);
  };

  const handleSaveEditedTemplate = (tplToSave?: Template) => {
    const activeTpl = tplToSave || editingTemplate;
    if (!activeTpl) return;
    if (!activeTpl.name.trim()) {
      triggerToast('Validation Error', 'Template name is required.', 'error');
      return;
    }

    let updatedList: Template[];
    if (isCreatingNewTemplate) {
      updatedList = [...templates, { ...activeTpl, updatedAt: new Date().toISOString() }];
      triggerToast('Template Created', `"${activeTpl.name}" has been added as a new template draft.`, 'success');
    } else {
      updatedList = templates.map(t => t.id === activeTpl.id ? { ...activeTpl, updatedAt: new Date().toISOString() } : t);
      triggerToast('Template Saved', `"${activeTpl.name}" configurations have been updated successfully.`, 'success');
    }

    onUpdateTemplates(updatedList);
    setEditingTemplate(null);
    setIsCreatingNewTemplate(false);
  };

  const handlePushNewVersionTemplate = () => {
    if (!editingTemplate) return;
    if (!newVersionNum.trim()) {
      triggerToast('Validation Error', 'New version number is required (e.g. 1.2.0).', 'error');
      return;
    }

    const newVersionObj: TemplateVersion = {
      version: newVersionNum,
      releaseNotes: newVersionReleaseNotes || `Updated to version ${newVersionNum}`,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Super Admin',
      autoUpdate: newVersionAutoUpdate,
      config: JSON.parse(JSON.stringify(editingTemplate.config))
    };

    const updatedTemplate: Template = {
      ...editingTemplate,
      version: newVersionNum,
      releaseNotes: newVersionReleaseNotes || `Updated to version ${newVersionNum}`,
      versionHistory: [...(editingTemplate.versionHistory || []), newVersionObj],
      updatedAt: new Date().toISOString()
    };

    // Save template changes in list
    const updatedTemplatesList = templates.map(t => t.id === editingTemplate.id ? updatedTemplate : t);
    onUpdateTemplates(updatedTemplatesList);

    // Apply auto-updates to existing active events if toggle is checked
    if (setEvents && newVersionAutoUpdate) {
      setEvents(prevEvents => {
        const updatedEvents = prevEvents.map(ev => {
          if (ev.templateId === editingTemplate.id) {
            return {
              ...ev,
              templateVersion: newVersionNum,
              settings: {
                ...ev.settings,
                ...editingTemplate.config
              }
            };
          }
          return ev;
        });
        localStorage.setItem('kava_events', JSON.stringify(updatedEvents));
        return updatedEvents;
      });
      triggerToast('Version Pushed & Deployed', `Version ${newVersionNum} pushed. Existing active events using this template were upgraded automatically.`, 'success');
    } else {
      triggerToast('Version Pushed (Manual)', `Version ${newVersionNum} pushed successfully. Hosts will receive an "Update Available" alert on their dashboard.`, 'success');
    }

    // Update local editing state to match the newly pushed version
    setEditingTemplate(updatedTemplate);
    
    // Increment version suggestion for next push
    let nextV = '1.0.1';
    const parts = newVersionNum.split('.');
    if (parts.length === 3) {
      const patch = parseInt(parts[2], 10);
      if (!isNaN(patch)) {
        nextV = `${parts[0]}.${parts[1]}.${patch + 1}`;
      }
    }
    setNewVersionNum(nextV);
    setNewVersionReleaseNotes('');
  };

  const handleDuplicateTemplate = (tmpl: Template) => {
    const duplicated: Template = {
      ...JSON.parse(JSON.stringify(tmpl)),
      id: tmpl.id + '-copy-' + Date.now(),
      name: `${tmpl.name} (Copy)`,
      order: templates.length + 1,
      downloads: 0,
      rating: 5.0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...templates, duplicated];
    onUpdateTemplates(updated);
    triggerToast('Template Duplicated', `"${duplicated.name}" cloned successfully.`, 'success');
  };

  const handleTogglePublishTemplate = (tmpl: Template) => {
    const newStatus = tmpl.status === 'Published' ? 'Unpublished' : 'Published';
    const updated = templates.map(t => {
      if (t.id === tmpl.id) {
        return { ...t, status: newStatus as any, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    onUpdateTemplates(updated);
    triggerToast(
      newStatus === 'Published' ? 'Template Published' : 'Template Unpublished',
      `"${tmpl.name}" is now ${newStatus.toLowerCase()} and ${newStatus === 'Published' ? 'visible to hosts' : 'hidden from marketplace'}.`,
      newStatus === 'Published' ? 'success' : 'info'
    );
  };

  const handleArchiveTemplate = (tmpl: Template) => {
    const updated = templates.map(t => {
      if (t.id === tmpl.id) {
        return { ...t, status: 'Archived' as any, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    onUpdateTemplates(updated);
    triggerToast('Template Archived', `"${tmpl.name}" moved to archives. Hosts can no longer see or apply it.`, 'info');
  };

  const handleReorderTemplate = (id: string, direction: 'up' | 'down') => {
    const idx = templates.findIndex(t => t.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === templates.length - 1) return;

    const updated = [...templates];
    const swapWith = direction === 'up' ? idx - 1 : idx + 1;
    const temp = updated[idx];
    updated[idx] = updated[swapWith];
    updated[swapWith] = temp;

    // re-index order field
    const reordered = updated.map((t, index) => ({
      ...t,
      order: index + 1
    }));

    onUpdateTemplates(reordered);
    triggerToast('Order Updated', 'Template display priority adjusted.', 'success');
  };

  const handleSaveTemplate = (updatedTmpl: Template) => {
    if (!updatedTmpl.name.trim()) {
      triggerToast('Validation Error', 'Template name is required.', 'error');
      return;
    }
    if (!updatedTmpl.description.trim()) {
      triggerToast('Validation Error', 'Template description is required.', 'error');
      return;
    }

    let updatedList: Template[];
    if (isCreatingNewTemplate) {
      // Check if ID already exists
      const exists = templates.some(t => t.id === updatedTmpl.id);
      const safeId = exists ? `template-${Date.now()}` : updatedTmpl.id;
      const finalTmpl = { ...updatedTmpl, id: safeId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      updatedList = [...templates, finalTmpl];
      triggerToast('Template Created', `"${finalTmpl.name}" successfully designed and deployed.`, 'success');
    } else {
      updatedList = templates.map(t => (t.id === updatedTmpl.id ? { ...updatedTmpl, updatedAt: new Date().toISOString() } : t));
      triggerToast('Template Updated', `"${updatedTmpl.name}" configurations updated.`, 'success');
    }

    onUpdateTemplates(updatedList);
    setEditingTemplate(null);
  };

  const handlePushNewVersion = (tmpl: Template, nextVersion: string, notes: string, autoUpdate: boolean) => {
    if (!nextVersion.trim()) {
      triggerToast('Validation Error', 'Version string (e.g. 1.3.0) is required.', 'error');
      return;
    }

    const currentHistory = tmpl.versionHistory || [];
    const newVersionObj: TemplateVersion = {
      version: tmpl.version,
      releaseNotes: tmpl.releaseNotes,
      updatedAt: tmpl.updatedAt,
      updatedBy: 'Sarah Connor (Super Admin)',
      autoUpdate: autoUpdate,
      config: JSON.parse(JSON.stringify(tmpl.config))
    };

    const updatedTmpl: Template = {
      ...tmpl,
      version: nextVersion,
      releaseNotes: notes || `V${nextVersion} deployment update.`,
      updatedAt: new Date().toISOString(),
      versionHistory: [newVersionObj, ...currentHistory]
    };

    const updatedList = templates.map(t => (t.id === tmpl.id ? updatedTmpl : t));
    onUpdateTemplates(updatedList);
    setEditingTemplate(updatedTmpl);

    triggerToast(
      'New Version Released',
      `Version ${nextVersion} pushed. Existing users will ${autoUpdate ? 'automatically receive this design update' : 'see update notes in their dashboard'}.`,
      'success'
    );
  };

  // ----------------------------------------------------
  // Authentication Action
  // ----------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    // Simulate database lookup delay
    setTimeout(() => {
      if ((email === 'admin@kava.com' || email === 'admin') && (password === 'admin' || password === 'kavaadmin')) {
        setIsAuthenticated(true);
        localStorage.setItem('kava_admin_session', 'true');
        triggerToast('Authentication Successful', 'Welcome back to the Super Admin cockpit.', 'success');
      } else {
        setLoginError('Invalid administrator credentials. Access Denied.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kava_admin_session');
    triggerToast('Logged Out', 'Your administrator session has been safely closed.', 'info');
  };

  // ----------------------------------------------------
  // User Management Actions
  // ----------------------------------------------------
  const handleToggleSuspendUser = (id: string) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Suspended' ? 'Active' : 'Suspended';
        // Add audit trail log
        const newLog = {
          id: `log-${Date.now()}`,
          admin: 'SuperAdmin',
          action: nextStatus === 'Suspended' ? 'Suspend User' : 'Activate User',
          target: `${u.name} (${u.email})`,
          time: new Date().toISOString(),
          ip: '192.168.1.45',
          status: 'Success'
        };
        setAuditLogs(prev => [newLog, ...prev]);
        triggerToast(
          nextStatus === 'Suspended' ? 'User Suspended' : 'User Activated',
          `"${u.name}" has been ${nextStatus.toLowerCase()} globally.`,
          nextStatus === 'Suspended' ? 'error' : 'success'
        );
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveUsers(updated);
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete && confirm(`Are you absolutely sure you want to permanently delete user "${userToDelete.name}"? This action cannot be undone.`)) {
      const updated = users.filter(u => u.id !== id);
      saveUsers(updated);
      const newLog = {
        id: `log-${Date.now()}`,
        admin: 'SuperAdmin',
        action: 'Delete User',
        target: `${userToDelete.name} (${userToDelete.email})`,
        time: new Date().toISOString(),
        ip: '192.168.1.45',
        status: 'Success'
      };
      setAuditLogs(prev => [newLog, ...prev]);
      triggerToast('User Purged', `"${userToDelete.name}" and all associated tokens have been deleted.`, 'error');
    }
  };

  const handleResetPassword = () => {
    if (!selectedUserId || !newPasswordValue) return;
    const target = users.find(u => u.id === selectedUserId);
    if (target) {
      triggerToast('Security Reset Complete', `A secure random hash has replaced the password for "${target.name}". Notification dispatched.`, 'success');
      setShowPasswordResetModal(false);
      setNewPasswordValue('');
      
      const newLog = {
        id: `log-${Date.now()}`,
        admin: 'SuperAdmin',
        action: 'Reset Password',
        target: `${target.name} (${target.email})`,
        time: new Date().toISOString(),
        ip: '192.168.1.45',
        status: 'Success'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // ----------------------------------------------------
  // Workspace Actions
  // ----------------------------------------------------
  const handleToggleWorkspace = (id: string) => {
    const updated = workspaces.map(ws => {
      if (ws.id === id) {
        const nextStatus = ws.status === 'Suspended' ? 'Active' : 'Suspended';
        triggerToast(
          nextStatus === 'Suspended' ? 'Workspace Isolated' : 'Workspace Restored',
          `"${ws.name}" uploads and views have been ${nextStatus.toLowerCase()}ed.`,
          nextStatus === 'Suspended' ? 'error' : 'success'
        );
        return { ...ws, status: nextStatus };
      }
      return ws;
    });
    saveWorkspaces(updated);
  };

  const handleDeleteWorkspace = (id: string) => {
    const ws = workspaces.find(w => w.id === id);
    if (ws && confirm(`DANGER: Are you sure you want to completely wipe the workspace "${ws.name}"? This removes all active events and media assets.`)) {
      saveWorkspaces(workspaces.filter(w => w.id !== id));
      triggerToast('Workspace Purged', `All cloud tracks for "${ws.name}" were removed.`, 'error');
    }
  };

  // ----------------------------------------------------
  // Ticket Actions
  // ----------------------------------------------------
  const handleSendTicketReply = () => {
    if (!selectedTicketId || !newTicketMessage.trim()) return;
    
    const updated = tickets.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: 'In Progress',
          messages: [...t.messages, { sender: 'admin', text: newTicketMessage }]
        };
      }
      return t;
    });
    saveTickets(updated);
    setNewTicketMessage('');
    triggerToast('Reply Sent', 'Customer received response on host dashboard.', 'success');
  };

  const handleResolveTicket = (id: string) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        triggerToast('Ticket Resolved', `Support Ticket #${id} has been resolved and closed.`, 'success');
        return { ...t, status: 'Resolved' };
      }
      return t;
    });
    saveTickets(updated);
  };

  // ----------------------------------------------------
  // Moderation Actions
  // ----------------------------------------------------
  const handleModerateContribution = (id: string, action: 'approve' | 'flag' | 'delete' | 'blur') => {
    let title = '';
    let desc = '';
    let type: 'success' | 'info' | 'error' = 'success';

    if (action === 'approve') {
      title = 'Approved';
      desc = 'Media asset has been verified and whitelisted live.';
      type = 'success';
    } else if (action === 'flag') {
      title = 'Flagged';
      desc = 'Media is temporarily hidden pending reviewer sign-off.';
      type = 'info';
    } else if (action === 'delete') {
      title = 'Taken Down';
      desc = 'Asset was permanently deleted from AWS/CloudRun buffers.';
      type = 'error';
    } else if (action === 'blur') {
      title = 'Safety Blur Applied';
      desc = 'An aesthetic visual blur filter has been forced on guest walls.';
      type = 'info';
    }

    triggerToast(title, desc, type);

    const newLog = {
      id: `log-${Date.now()}`,
      admin: 'SuperAdmin',
      action: `Moderate Contribution (${action})`,
      target: `ID: ${id}`,
      time: new Date().toISOString(),
      ip: '192.168.1.45',
      status: 'Success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleResolveEscalation = (id: string, resolution: 'block' | 'dismiss' | 'warning') => {
    let title = '';
    let desc = '';
    let type: 'success' | 'info' | 'error' = 'success';

    if (resolution === 'block') {
      title = 'Escalation Blocked';
      desc = 'Target has been globally disabled/deleted, and escalation marked resolved.';
      type = 'error';
    } else if (resolution === 'dismiss') {
      title = 'Escalation Dismissed';
      desc = 'Report dismissed as a false positive. No further action taken.';
      type = 'info';
    } else if (resolution === 'warning') {
      title = 'Warning Dispatched';
      desc = 'System warning sent to the account owner/contributor.';
      type = 'success';
    }

    triggerToast(title, desc, type);

    setSafetyEscalations(prev => prev.map(esc => {
      if (esc.id === id) {
        return {
          ...esc,
          status: resolution === 'block' ? 'Resolved - Blocked' : resolution === 'dismiss' ? 'Resolved - Dismissed' : 'Action Taken'
        };
      }
      return esc;
    }));

    const newLog = {
      id: `log-${Date.now()}`,
      admin: 'SuperAdmin',
      action: `Trust & Safety Resolution (${resolution})`,
      target: `Escalation: ${id}`,
      time: new Date().toISOString(),
      ip: '192.168.1.45',
      status: 'Success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // ----------------------------------------------------
  // Feature Flag & System Config Actions
  // ----------------------------------------------------
  const handleToggleFlag = (key: string) => {
    setFeatureFlags(prev => prev.map(f => {
      if (f.key === key) {
        const nextState = !f.enabled;
        const nextStatus = nextState ? (f.rollout === 100 ? 'Enabled' : 'Gradual Rollout') : 'Disabled';
        triggerToast(
          nextState ? 'Feature Rolled Out' : 'Feature Isolated',
          `Global flag "${f.name}" has been set to ${nextState ? 'ENABLED' : 'DISABLED'}.`,
          nextState ? 'success' : 'info'
        );
        return {
          ...f,
          enabled: nextState,
          status: nextStatus,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'SuperAdmin'
        };
      }
      return f;
    }));
  };

  const handleRolloutChange = (key: string, percent: number) => {
    setFeatureFlags(prev => prev.map(f => {
      if (f.key === key) {
        let nextStatus = f.status;
        if (f.enabled) {
          nextStatus = percent === 100 ? 'Enabled' : percent === 0 ? 'Disabled' : 'Gradual Rollout';
        }
        return {
          ...f,
          rollout: percent,
          status: nextStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return f;
    }));
  };

  const handleUpdateSingleFlag = (updatedFlag: FeatureFlagConfig) => {
    setFeatureFlags(prev => prev.map(f => f.key === updatedFlag.key ? updatedFlag : f));
    if (selectedFlagForPreview?.key === updatedFlag.key) {
      setSelectedFlagForPreview(updatedFlag);
    }
    triggerToast('Feature Flag Updated', `Saved configurations for "${updatedFlag.name}".`, 'success');
  };

  const handleResetDefaultFlags = () => {
    setFeatureFlags(DEFAULT_FEATURE_FLAGS);
    saveStoredFeatureFlags(DEFAULT_FEATURE_FLAGS);
    triggerToast('Flags Reset', 'Restored default platform feature flags matrix.', 'info');
  };

  const handleEnableAllStableFlags = () => {
    setFeatureFlags(prev => prev.map(f => ({
      ...f,
      enabled: true,
      rollout: 100,
      status: 'Enabled',
      lastUpdated: new Date().toISOString()
    })));
    triggerToast('All Flags 100%', 'Rolled out all feature flags globally at 100%.', 'success');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('kava_admin_configs', JSON.stringify(systemConfigs));
    triggerToast('Configuration Applied', 'Dynamic platform properties synced to live node clusters.', 'success');
    
    const newLog = {
      id: `log-${Date.now()}`,
      admin: 'SuperAdmin',
      action: 'Update System Config',
      target: 'Core cluster parameters',
      time: new Date().toISOString(),
      ip: '192.168.1.45',
      status: 'Success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // ----------------------------------------------------
  // Backup & Restore Simulation
  // ----------------------------------------------------
  const triggerBackup = () => {
    setIsBackingUp(true);
    triggerToast('Backup Initiated', 'Capturing relational databases and storage manifests...', 'info');
    setTimeout(() => {
      setIsBackingUp(false);
      const newSnap = {
        id: `snap-${Date.now()}`,
        file: `KAVA_SNAPSHOT_${new Date().toISOString().slice(0,10).replace(/-/g,'')}_MANUAL.json`,
        size: '4.1 MB',
        creator: 'SuperAdmin',
        timestamp: 'Just now',
        type: 'Manual'
      };
      setBackupLogs(prev => [newSnap, ...prev]);
      triggerToast('Database Snapshot Created', 'Backup encrypted and secured on offline Cold Storage.', 'success');
      
      const newLog = {
        id: `log-${Date.now()}`,
        admin: 'SuperAdmin',
        action: 'Create System Backup',
        target: newSnap.file,
        time: new Date().toISOString(),
        ip: '192.168.1.45',
        status: 'Success'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }, 2000);
  };

  const triggerRestore = (filename: string) => {
    if (!confirm(`CRITICAL WARNING: Restoring "${filename}" will roll back all live workspace settings, guest messages, and events to this exact state. Proceed?`)) return;
    
    setIsRestoring(true);
    setRestoreProgress(0);
    triggerToast('Restoring Snapshot', `System locks active. Loading snapshot matrices from "${filename}"...`, 'info');
    
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          triggerToast('Restore Successful', 'Offline cache populated. Live Screen and host consoles updated.', 'success');
          
          const newLog = {
            id: `log-${Date.now()}`,
            admin: 'SuperAdmin',
            action: 'Restore Backup System',
            target: filename,
            time: new Date().toISOString(),
            ip: '192.168.1.45',
            status: 'Success'
          };
          setAuditLogs(prev => [newLog, ...prev]);
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  };

  // ----------------------------------------------------
  // Platform Communication Center Actions
  // ----------------------------------------------------
  
  // Calculate matching recipients based on current real-time state
  const getMatchingRecipientsList = (rules: {
    targetUsers: string[];
    targetWorkspaces: string[];
    targetPlans: string[];
    targetCountries: string[];
    targetLanguages: string[];
    targetStatuses: string[];
  }) => {
    let list = [...users];

    // 1. Filter by specific selected users if we aren't targeting 'All'
    if (rules.targetUsers && rules.targetUsers.length > 0 && !rules.targetUsers.includes('All')) {
      list = list.filter(u => rules.targetUsers.includes(u.id) || rules.targetUsers.includes(u.email));
    }

    // 2. Filter by subscription plans
    if (rules.targetPlans && rules.targetPlans.length > 0 && !rules.targetPlans.includes('All')) {
      list = list.filter(u => rules.targetPlans.includes(u.plan));
    }

    // 3. Filter by account status
    if (rules.targetStatuses && rules.targetStatuses.length > 0 && !rules.targetStatuses.includes('All')) {
      list = list.filter(u => rules.targetStatuses.includes(u.status));
    }

    // 4. Filter by specific workspaces if any selected
    if (rules.targetWorkspaces && rules.targetWorkspaces.length > 0 && !rules.targetWorkspaces.includes('All')) {
      const hostsOfWorkspaces = workspaces
        .filter(w => rules.targetWorkspaces.includes(w.id))
        .map(w => w.host.toLowerCase());
      
      list = list.filter(u => hostsOfWorkspaces.includes(u.name.toLowerCase()));
    }

    return list;
  };

  const handleClearForm = () => {
    setFormBcId(null);
    setFormTitle('');
    setFormContent('');
    setFormType('announcement');
    setFormPriority('Medium');
    setFormChannels(['in_app_banner', 'notification_center']);
    setFormTargetUsers(['All']);
    setFormTargetWorkspaces(['All']);
    setFormTargetPlans(['Free', 'Premium', 'Enterprise']);
    setFormTargetEventTypes(['All']);
    setFormTargetCountries(['All']);
    setFormTargetLanguages(['All']);
    setFormTargetStatuses(['Active']);
    setFormSchedulingType('Instant');
    setFormSchedulingDate('');
    setFormExpirationDate('');
    setFormRecurring('None');
    setFormPinToDashboard(false);
    setFormAckRequired(false);
    setFormDismissible(true);
    setFormCtaLabel('');
    setFormCtaUrl('');
    setFormIcon('Bell');
    setFormMultilingual({
      en: { title: '', content: '' },
      id: { title: '', content: '' },
      de: { title: '', content: '' },
      es: { title: '', content: '' },
      fr: { title: '', content: '' }
    });
    setHasUnsavedChanges(false);
  };

  const handleSaveBroadcastDraft = () => {
    if (!formTitle.trim()) {
      triggerToast('Validation Error', 'A broadcast campaign title is required.', 'error');
      return;
    }

    const matchedRecipients = getMatchingRecipientsList({
      targetUsers: formTargetUsers,
      targetWorkspaces: formTargetWorkspaces,
      targetPlans: formTargetPlans,
      targetCountries: formTargetCountries,
      targetLanguages: formTargetLanguages,
      targetStatuses: formTargetStatuses
    });

    const isEditing = !!formBcId;
    const finalId = isEditing ? formBcId! : `bc-${Date.now()}`;
    const previousVersions = isEditing ? (broadcasts.find(b => b.id === finalId)?.versions || []) : [];

    const draftBc = {
      id: finalId,
      title: formTitle,
      content: formContent || 'No text content provided.',
      type: formType,
      priority: formPriority,
      status: 'Draft',
      channels: formChannels,
      targetUsers: formTargetUsers,
      targetWorkspaces: formTargetWorkspaces,
      targetPlans: formTargetPlans,
      targetEventTypes: formTargetEventTypes,
      targetCountries: formTargetCountries,
      targetLanguages: formTargetLanguages,
      targetStatuses: formTargetStatuses,
      schedulingType: formSchedulingType,
      schedulingDate: formSchedulingDate,
      expirationDate: formExpirationDate,
      recurring: formRecurring,
      pinToDashboard: formPinToDashboard,
      ackRequired: formAckRequired,
      dismissible: formDismissible,
      ctaLabel: formCtaLabel,
      ctaUrl: formCtaUrl,
      icon: formIcon,
      multilingual: {
        ...formMultilingual,
        en: { title: formTitle, content: formContent }
      },
      analytics: {
        recipientsCount: matchedRecipients.length,
        deliveredCount: 0,
        viewedCount: 0,
        ackCount: 0,
        clickedCount: 0,
        dismissedCount: 0,
        emailOpenedCount: 0,
        failedCount: 0,
        engagementRate: 0
      },
      versions: [
        ...previousVersions,
        { version: previousVersions.length + 1, author: 'SuperAdmin', timestamp: new Date().toISOString(), title: formTitle }
      ],
      created: isEditing ? (broadcasts.find(b => b.id === finalId)?.created || new Date().toISOString()) : new Date().toISOString()
    };

    if (isEditing) {
      setBroadcasts(prev => prev.map(b => b.id === finalId ? draftBc : b));
    } else {
      setBroadcasts(prev => [draftBc, ...prev]);
    }

    // Add audit log
    const auditLog = {
      id: `log-${Date.now()}`,
      admin: 'SuperAdmin',
      action: isEditing ? 'Edit Broadcast Draft' : 'Create Broadcast Draft',
      target: `"${draftBc.title}" (Estimated reach: ${matchedRecipients.length})`,
      time: new Date().toISOString(),
      ip: '192.168.1.104',
      status: 'Success'
    };
    setAuditLogs(prev => [auditLog, ...prev]);

    triggerToast('Draft Saved', `Campaign "${draftBc.title}" stored in workspace repositories.`, 'success');
    handleClearForm();
    setBroadcastSubTab('history');
  };

  const handlePublishBroadcast = () => {
    if (!formTitle.trim()) {
      triggerToast('Validation Error', 'A broadcast campaign title is required.', 'error');
      return;
    }

    const matchedRecipients = getMatchingRecipientsList({
      targetUsers: formTargetUsers,
      targetWorkspaces: formTargetWorkspaces,
      targetPlans: formTargetPlans,
      targetCountries: formTargetCountries,
      targetLanguages: formTargetLanguages,
      targetStatuses: formTargetStatuses
    });

    const isEditing = !!formBcId;
    const finalId = isEditing ? formBcId! : `bc-${Date.now()}`;
    const previousVersions = isEditing ? (broadcasts.find(b => b.id === finalId)?.versions || []) : [];
    const targetStatus = formSchedulingType === 'Scheduled' ? 'Scheduled' : 'Published';

    const finalBc = {
      id: finalId,
      title: formTitle,
      content: formContent || 'No text content provided.',
      type: formType,
      priority: formPriority,
      status: targetStatus,
      channels: formChannels,
      targetUsers: formTargetUsers,
      targetWorkspaces: formTargetWorkspaces,
      targetPlans: formTargetPlans,
      targetEventTypes: formTargetEventTypes,
      targetCountries: formTargetCountries,
      targetLanguages: formTargetLanguages,
      targetStatuses: formTargetStatuses,
      schedulingType: formSchedulingType,
      schedulingDate: formSchedulingDate,
      expirationDate: formExpirationDate,
      recurring: formRecurring,
      pinToDashboard: formPinToDashboard,
      ackRequired: formAckRequired,
      dismissible: formDismissible,
      ctaLabel: formCtaLabel,
      ctaUrl: formCtaUrl,
      icon: formIcon,
      multilingual: {
        ...formMultilingual,
        en: { title: formTitle, content: formContent }
      },
      analytics: {
        recipientsCount: matchedRecipients.length,
        deliveredCount: targetStatus === 'Published' ? matchedRecipients.length : 0,
        viewedCount: 0,
        ackCount: 0,
        clickedCount: 0,
        dismissedCount: 0,
        emailOpenedCount: 0,
        failedCount: 0,
        engagementRate: 0
      },
      versions: [
        ...previousVersions,
        { version: previousVersions.length + 1, author: 'SuperAdmin', timestamp: new Date().toISOString(), title: formTitle }
      ],
      created: isEditing ? (broadcasts.find(b => b.id === finalId)?.created || new Date().toISOString()) : new Date().toISOString()
    };

    if (isEditing) {
      setBroadcasts(prev => prev.map(b => b.id === finalId ? finalBc : b));
    } else {
      setBroadcasts(prev => [finalBc, ...prev]);
    }

    // Add audit log
    const auditLog = {
      id: `log-${Date.now()}`,
      admin: 'SuperAdmin',
      action: targetStatus === 'Scheduled' ? 'Schedule Campaign' : 'Publish Broadcast',
      target: `"${finalBc.title}" (Reached: ${matchedRecipients.length} hosts)`,
      time: new Date().toISOString(),
      ip: '192.168.1.104',
      status: 'Success'
    };
    setAuditLogs(prev => [auditLog, ...prev]);

    // Triggers instant simulated SMTP logs if email is enabled
    if (formChannels.includes('email') && targetStatus === 'Published') {
      const mailLog = `[${new Date().toISOString().slice(11, 19)}] SMTP queue dispatched: Sent ${matchedRecipients.length} campaign digests matching filters.`;
      setSystemLogs(prev => [mailLog, ...prev]);
    }

    triggerToast(
      targetStatus === 'Scheduled' ? 'Campaign Scheduled' : 'Broadcast Launched',
      targetStatus === 'Scheduled' 
        ? `Broadcast scheduled for delivery on ${formSchedulingDate}.`
        : `Synchronized message across ${matchedRecipients.length} host dashboard nodes live.`,
      'success'
    );

    handleClearForm();
    setBroadcastSubTab('history');
  };

  const handleEditBroadcast = (bc: any) => {
    setFormBcId(bc.id);
    setFormTitle(bc.title);
    setFormContent(bc.content);
    setFormType(bc.type);
    setFormPriority(bc.priority);
    setFormChannels(bc.channels);
    setFormTargetUsers(bc.targetUsers || ['All']);
    setFormTargetWorkspaces(bc.targetWorkspaces || ['All']);
    setFormTargetPlans(bc.targetPlans || ['Free', 'Premium', 'Enterprise']);
    setFormTargetEventTypes(bc.targetEventTypes || ['All']);
    setFormTargetCountries(bc.targetCountries || ['All']);
    setFormTargetLanguages(bc.targetLanguages || ['All']);
    setFormTargetStatuses(bc.targetStatuses || ['Active']);
    setFormSchedulingType(bc.schedulingType || 'Instant');
    setFormSchedulingDate(bc.schedulingDate || '');
    setFormExpirationDate(bc.expirationDate || '');
    setFormRecurring(bc.recurring || 'None');
    setFormPinToDashboard(bc.pinToDashboard || false);
    setFormAckRequired(bc.ackRequired || false);
    setFormDismissible(bc.dismissible !== undefined ? bc.dismissible : true);
    setFormCtaLabel(bc.ctaLabel || '');
    setFormCtaUrl(bc.ctaUrl || '');
    setFormIcon(bc.icon || 'Bell');
    setFormMultilingual(bc.multilingual || {
      en: { title: bc.title, content: bc.content },
      id: { title: '', content: '' },
      de: { title: '', content: '' },
      es: { title: '', content: '' },
      fr: { title: '', content: '' }
    });

    setBroadcastSubTab('editor');
    setHasUnsavedChanges(true);
    triggerToast('Editor Loaded', `Configured forms with parameters of "${bc.title}".`, 'info');
  };

  const handleDuplicateBroadcast = (bc: any) => {
    const duplicated = {
      ...bc,
      id: `bc-${Date.now()}`,
      title: `${bc.title} (Copy)`,
      status: 'Draft',
      analytics: {
        recipientsCount: bc.analytics?.recipientsCount || 0,
        deliveredCount: 0,
        viewedCount: 0,
        ackCount: 0,
        clickedCount: 0,
        dismissedCount: 0,
        emailOpenedCount: 0,
        failedCount: 0,
        engagementRate: 0
      },
      versions: [{ version: 1, author: 'SuperAdmin', timestamp: new Date().toISOString(), title: `${bc.title} (Copy)` }],
      created: new Date().toISOString()
    };

    setBroadcasts(prev => [duplicated, ...prev]);
    triggerToast('Broadcast Duplicated', `Created new Draft copy "${duplicated.title}".`, 'success');
    
    // Switch to editor with duplicated item
    handleEditBroadcast(duplicated);
  };

  const handleArchiveBroadcast = (id: string) => {
    setBroadcasts(prev => prev.map(b => b.id === id ? { ...b, status: 'Archived' } : b));
    triggerToast('Broadcast Archived', 'Message moved to administrative archives.', 'info');
    
    setAuditLogs(prev => [{
      id: `log-${Date.now()}`,
      admin: 'SuperAdmin',
      action: 'Archive Broadcast',
      target: `Broadcast ID #${id}`,
      time: new Date().toISOString(),
      ip: '192.168.1.104',
      status: 'Success'
    }, ...prev]);
  };

  const handleCancelBroadcast = (id: string) => {
    setBroadcasts(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    triggerToast('Broadcast Cancelled', 'Scheduled delivery stream deactivated.', 'info');
    
    setAuditLogs(prev => [{
      id: `log-${Date.now()}`,
      admin: 'SuperAdmin',
      action: 'Cancel Scheduled Broadcast',
      target: `Broadcast ID #${id}`,
      time: new Date().toISOString(),
      ip: '192.168.1.104',
      status: 'Success'
    }, ...prev]);
  };

  const handleResendBroadcast = (id: string) => {
    setBroadcasts(prev => prev.map(b => {
      if (b.id === id) {
        const matched = getMatchingRecipientsList({
          targetUsers: b.targetUsers || ['All'],
          targetWorkspaces: b.targetWorkspaces || ['All'],
          targetPlans: b.targetPlans || ['Free', 'Premium', 'Enterprise'],
          targetCountries: b.targetCountries || ['All'],
          targetLanguages: b.targetLanguages || ['All'],
          targetStatuses: b.targetStatuses || ['Active']
        });

        return {
          ...b,
          status: 'Published',
          analytics: {
            ...b.analytics,
            recipientsCount: matched.length,
            deliveredCount: matched.length,
            viewedCount: 0,
            ackCount: 0,
            clickedCount: 0,
            dismissedCount: 0,
            emailOpenedCount: 0,
            failedCount: 0,
            engagementRate: 0
          },
          versions: [
            ...(b.versions || []),
            { version: (b.versions?.length || 1) + 1, author: 'SuperAdmin', timestamp: new Date().toISOString(), title: `${b.title} (Resent)` }
          ]
        };
      }
      return b;
    }));

    triggerToast('Broadcast Re-launched', 'Repopulated active banner indicators and email channels.', 'success');
  };

  const handleDeleteBroadcast = (id: string) => {
    setBroadcasts(prev => prev.filter(b => b.id !== id));
    triggerToast('Broadcast Purged', 'Campaign removed permanently from local database repositories.', 'info');
  };

  const handleRecalculateSync = () => {
    // Dynamically update recipient metrics across all published broadcasts based on current active user state
    setBroadcasts(prev => prev.map(bc => {
      if (bc.status === 'Published') {
        const matched = getMatchingRecipientsList({
          targetUsers: bc.targetUsers || ['All'],
          targetWorkspaces: bc.targetWorkspaces || ['All'],
          targetPlans: bc.targetPlans || ['Free', 'Premium', 'Enterprise'],
          targetCountries: bc.targetCountries || ['All'],
          targetLanguages: bc.targetLanguages || ['All'],
          targetStatuses: bc.targetStatuses || ['Active']
        });

        // Add some simulated views and clicks based on real hosts for visual richness
        const newDelivered = matched.length;
        const newViewed = Math.min(newDelivered, Math.round(newDelivered * 0.85));
        const newAck = bc.ackRequired ? Math.min(newViewed, Math.round(newViewed * 0.7)) : 0;
        const newClicked = bc.ctaLabel ? Math.min(newViewed, Math.round(newViewed * 0.35)) : 0;
        const engagement = newDelivered > 0 ? Math.round(((newViewed + newClicked) / (newDelivered * 2)) * 100) : 0;

        return {
          ...bc,
          analytics: {
            ...bc.analytics,
            recipientsCount: matched.length,
            deliveredCount: newDelivered,
            viewedCount: newViewed,
            ackCount: newAck,
            clickedCount: newClicked,
            engagementRate: engagement
          }
        };
      }
      return bc;
    }));

    setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Recalculated matching target vectors. Synced platform dashboards with 100% database coherence.`, ...prev]);
    triggerToast('Data Synchronized', 'Re-evaluated all audience targets. Refreshed delivery matrix.', 'success');
  };

  // ----------------------------------------------------
  // Filtering & Pagination Calculations
  // ----------------------------------------------------
  const totalStorageMB = useMemo(() => {
    const photoCount = initialContributions.filter(c => c.type === 'photo').length;
    const videoCount = initialContributions.filter(c => c.type === 'video').length;
    const voiceCount = initialContributions.filter(c => c.type === 'voice').length;
    const wishCount = initialContributions.filter(c => c.type === 'wish').length;

    const photoMB = photoCount * 2.5;
    const videoMB = videoCount * 12.0;
    const voiceMB = voiceCount * 1.5;
    const wishMB = wishCount * 0.05;
    
    return photoMB + videoMB + voiceMB + wishMB;
  }, [initialContributions]);

  const revenueStats = useMemo(() => {
    const totalPaid = transactions
      .filter(t => t.status === 'Succeeded')
      .reduce((sum, t) => sum + t.amount, 0);

    const mrr = workspaces
      .filter(w => w.status === 'Active')
      .reduce((sum, w) => {
        if (w.plan === 'Premium') return sum + 29;
        if (w.plan === 'Enterprise') return sum + 299;
        return sum;
      }, 0);

    return {
      totalPaid,
      mrr: mrr || 4820,
      premiumCount: workspaces.filter(w => w.plan === 'Premium').length,
      enterpriseCount: workspaces.filter(w => w.plan === 'Enterprise').length,
      freeCount: workspaces.filter(w => w.plan === 'Free').length
    };
  }, [transactions, workspaces]);

  const dynamicStorageBreakdown = useMemo(() => {
    const photoCount = initialContributions.filter(c => c.type === 'photo').length;
    const videoCount = initialContributions.filter(c => c.type === 'video').length;
    const voiceCount = initialContributions.filter(c => c.type === 'voice').length;
    const wishCount = initialContributions.filter(c => c.type === 'wish').length;

    const photoMB = photoCount * 2.5;
    const videoMB = videoCount * 12.0;
    const voiceMB = voiceCount * 1.5;
    const wishMB = wishCount * 0.05;
    
    const totalMB = photoMB + videoMB + voiceMB + wishMB || 1;

    return [
      { type: 'Photos (JPG/PNG)', size: photoMB >= 1024 ? `${(photoMB / 1024).toFixed(1)} GB` : `${photoMB.toFixed(1)} MB`, pct: Math.round((photoMB / totalMB) * 100), color: 'bg-blue-500' },
      { type: 'Videos (MP4)', size: videoMB >= 1024 ? `${(videoMB / 1024).toFixed(1)} GB` : `${videoMB.toFixed(1)} MB`, pct: Math.round((videoMB / totalMB) * 100), color: 'bg-slate-700' },
      { type: 'Voice Messages (MP3)', size: voiceMB >= 1024 ? `${(voiceMB / 1024).toFixed(1)} GB` : `${voiceMB.toFixed(1)} MB`, pct: Math.round((voiceMB / totalMB) * 100), color: 'bg-amber-500' },
      { type: 'Wish Book Texts', size: wishMB >= 1024 ? `${(wishMB / 1024).toFixed(1)} GB` : `${wishMB.toFixed(1)} MB`, pct: Math.round((wishMB / totalMB) * 100), color: 'bg-emerald-500' }
    ];
  }, [initialContributions]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const filteredHosts = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlan = hostPlanFilter === 'All' || u.plan === hostPlanFilter;
      const matchStatus = hostStatusFilter === 'All' || u.status === hostStatusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [users, searchQuery, hostPlanFilter, hostStatusFilter]);

  const filteredGuests = useMemo(() => {
    return guestsList.filter(g => {
      const matchSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.email.toLowerCase().includes(searchQuery.toLowerCase()) || g.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || g.eventCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchEvent = guestEventFilter === 'All' || g.eventId === guestEventFilter;
      const matchStatus = guestStatusFilter === 'All' || g.status === guestStatusFilter;
      let matchType = true;
      if (guestTypeFilter === 'photo') matchType = g.contributionTypes?.photo > 0;
      if (guestTypeFilter === 'video') matchType = g.contributionTypes?.video > 0;
      if (guestTypeFilter === 'voice') matchType = g.contributionTypes?.voice > 0;
      if (guestTypeFilter === 'wish') matchType = g.contributionTypes?.wish > 0;
      return matchSearch && matchEvent && matchStatus && matchType;
    });
  }, [guestsList, searchQuery, guestEventFilter, guestStatusFilter, guestTypeFilter]);

  const filteredWsAdmins = useMemo(() => {
    return workspaceAdminsList.filter(wa => {
      const matchSearch = wa.name.toLowerCase().includes(searchQuery.toLowerCase()) || wa.email.toLowerCase().includes(searchQuery.toLowerCase()) || wa.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchWs = wsAdminWsFilter === 'All' || wa.assignedWorkspaces.includes(wsAdminWsFilter);
      const matchStatus = wsAdminStatusFilter === 'All' || wa.status === wsAdminStatusFilter;
      return matchSearch && matchWs && matchStatus;
    });
  }, [workspaceAdminsList, searchQuery, wsAdminWsFilter, wsAdminStatusFilter]);

  const filteredSuperAdmins = useMemo(() => {
    return superAdminsList.filter(sa => {
      const matchSearch = sa.name.toLowerCase().includes(searchQuery.toLowerCase()) || sa.email.toLowerCase().includes(searchQuery.toLowerCase()) || sa.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = superAdminStatusFilter === 'All' || sa.status === superAdminStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [superAdminsList, searchQuery, superAdminStatusFilter]);

  const paginatedUsers = useMemo(() => {
    const start = userPage * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, userPage]);

  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter(w => 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workspaces, searchQuery]);

  // Support alert badge totals
  const openTicketsCount = tickets.filter(t => t.status === 'Open').length;

  // Render Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 selection:bg-slate-900 selection:text-white" id="super-admin-login-screen">
        <div className="max-w-md w-full bg-white rounded-[32px] border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900" />
          
          <div className="mb-6">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center font-bold text-lg mb-3 tracking-widest shadow-md">
              K
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">KAVA Administrator Portal</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Authorized staff clearance only. All activities are securely logged.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Staff Email Address</label>
              <input
                type="text"
                required
                placeholder="admin@kava.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Administrator Keycard Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-700 text-[11px] font-bold p-3.5 rounded-xl border border-red-200/50 flex items-center space-x-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Clearing Access Tokens...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Verify Credentials & Enter</span>
                </>
              )}
            </button>
          </form>

          {/* Quick sandbox bypass credentials */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-left">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Sandbox Quick Credentials</h4>
            <div className="flex flex-col space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@kava.com');
                  setPassword('admin');
                }}
                className="text-[11px] text-slate-800 hover:text-slate-900 font-bold bg-slate-100 p-2 rounded-lg border border-slate-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Bypass (Email: admin@kava.com / Pass: admin)</span>
                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToLanding}
            className="mt-6 text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center space-x-1.5 mx-auto cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>Return to Landing Page</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex selection:bg-slate-900 selection:text-white" id="super-admin-root">
      
      {/* MOBILE SIDEBAR DRAWER OVERLAY (≤768px) */}
      <AnimatePresence>
        {isMobileAdminMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileAdminMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[280px] max-w-[85vw] h-full bg-slate-950 z-10 flex flex-col"
            >
              <div className="absolute top-3 right-3 z-20">
                <button
                  type="button"
                  onClick={() => setIsMobileAdminMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setSearchQuery={setSearchQuery}
                openTicketsCount={openTicketsCount}
                handleLogout={handleLogout}
                isMobile={true}
                onCloseMobile={() => setIsMobileAdminMenuOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REDESIGNED SIDEBAR NAVIGATION (DESKTOP) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
        openTicketsCount={openTicketsCount}
        handleLogout={handleLogout}
        isCollapsed={isAdminSidebarCollapsed}
      />

      {/* CORE WORKSPACE CONSOLE HEADER & MAIN CANVAS */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP INTEGRATION BAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth >= 768) {
                  toggleAdminSidebar();
                } else {
                  setIsMobileAdminMenuOpen(prev => !prev);
                }
              }}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200/60 shadow-xs transition-colors cursor-pointer shrink-0"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
              id="btn-admin-sidebar-toggle"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            <span className="font-black text-base md:text-lg text-slate-900 tracking-wider">KAVA ADMIN</span>
            <div className="h-5 w-[1px] bg-slate-200 hidden md:block" />
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-full">
              <Server className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Cluster State: Healthy (100% SLA)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Quick Back to App & Mobile Preview launcher */}
            <button
              onClick={onBackToLanding}
              className="px-2.5 sm:px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-all flex items-center space-x-1.5 cursor-pointer bg-slate-50"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Mobile Preview</span>
            </button>
            <button
              onClick={onBackToLanding}
              className="hidden lg:flex px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-all items-center space-x-1.5 cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
              <span>Launch Sandbox Host</span>
            </button>
            
            <LanguageSwitcher variant="default" />

            <div className="relative admin-notif-container">
              <button
                type="button"
                onClick={() => setIsAdminNotifOpen(prev => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsAdminNotifOpen(prev => !prev);
                  }
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer relative focus:outline-none"
                title="System Notifications"
                aria-label="System Notifications"
                id="btn-superadmin-bell"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                {adminUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                    {adminUnreadCount > 9 ? '9+' : adminUnreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isAdminNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200/90 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-[100] overflow-hidden text-left pointer-events-auto"
                  >
                    <div className="p-3.5 px-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">System Notifications</span>
                        {adminUnreadCount > 0 ? (
                          <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-100">
                            {adminUnreadCount} unread
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-100/80">
                            All caught up
                          </span>
                        )}
                      </div>
                      {adminUnreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleAdminMarkAllRead}
                          className="text-[11px] font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100/80 scrollbar-thin">
                      {adminNotifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-xs font-medium space-y-2">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center border border-emerald-100/80">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <p className="font-extrabold text-slate-900 text-sm">System Normal</p>
                          <p className="text-[11px] text-slate-400">No active cluster notifications.</p>
                        </div>
                      ) : (
                        adminNotifications.map(ntf => (
                          <div
                            key={ntf.id}
                            className={`p-3.5 px-4 flex items-start space-x-3 hover:bg-slate-50 transition-colors cursor-pointer group relative ${
                              ntf.unread ? 'bg-slate-50/90' : ''
                            }`}
                          >
                            <div className="p-2 rounded-xl shrink-0 mt-0.5 border bg-slate-100 text-slate-700 border-slate-200">
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0 pr-1">
                              <div className="flex items-center justify-between space-x-2">
                                <p className={`text-xs truncate ${ntf.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                  {ntf.title}
                                </p>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{ntf.time}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                                {ntf.description}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAdminDeleteNotif(ntf.id)}
                              className="p-1 text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 rounded-md hover:bg-rose-50 cursor-pointer self-center"
                              title="Delete notification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminNotifOpen(false);
                          setActiveTab('system_logs');
                        }}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center space-x-1 w-full py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <span>View System Logs</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* MAIN OPERATIONS PANEL */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-left">
          
          {/* HEADER INTRO TITLE CARD */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">Admin Control Room</span>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans mt-0.5 capitalize">
                {activeTab === 'trust_safety' ? 'Trust & Safety' : activeTab.replace('_', ' ')} Panel
              </h1>
            </div>

            {/* Global Search element */}
            {['users', 'workspaces', 'events'].includes(activeTab) && (
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Global database query..."
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs font-semibold"
                />
              </div>
            )}
          </div>

          {/* TAB CONTENT 1: DASHBOARD ANALYTICS OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in" id="admin-operations-cockpit">
              
              {/* MAINTENANCE & MONITORING TOP PANEL */}
              {maintenanceMode && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-amber-800 text-xs">
                    <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
                    <div>
                      <p className="font-bold">System Maintenance Mode Active</p>
                      <p className="font-medium text-amber-700/90">Platform API responses are locked to read-only for hosts. Databases are currently under active indexing.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setMaintenanceMode(false);
                      setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Maintenance Mode turned OFF by SuperAdmin`, ...prev]);
                      triggerToast('Maintenance Released', 'Platform features unlocked and live syncing restored.', 'success');
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Disable Mode
                  </button>
                </div>
              )}

              {/* ACTIONABLE ALERTS PANEL */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Infrastructure Health Center</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Manage active cluster notifications, resolve errors, or inject test events.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        const newId = `alt-${Date.now()}`;
                        const simAlerts = [
                          { msg: 'AWS S3 Glacier replication delay has crossed threshold', category: 'Storage', type: 'warning', details: 'S3 cold storage queue exceeded 1200 operations. Media access remains functional but archives download latency may temporarily increase.' },
                          { msg: 'Host webhooks reporting 504 Gateway Timeouts on custom domains', category: 'Network', type: 'error', details: 'DNS routing engine is lagging. Triggering failover to AWS backup gateway resolves connection instantly.' },
                          { msg: 'GenAI text transcribing rate limit warning detected', category: 'Integrations', type: 'info', details: 'Platform transcribers are hitting Gemini API burst constraints. Auto fallback to system transcoder active.' }
                        ];
                        const chosen = simAlerts[Math.floor(Math.random() * simAlerts.length)];
                        setAdminAlerts(prev => [...prev, { ...chosen, id: newId, status: 'Active' }]);
                        setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] simulated alert injected: ${chosen.msg}`, ...prev]);
                        triggerToast('Alert Injected', 'New simulated infrastructure state registered.', 'info');
                      }}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Simulate Incident</span>
                    </button>
                    {adminAlerts.length > 0 && (
                      <button 
                        onClick={() => {
                          setAdminAlerts([]);
                          setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] All active alerts acknowledged`, ...prev]);
                          triggerToast('All Clear', 'All cluster alerts successfully dismissed.', 'success');
                        }}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                      >
                        Acknowledge All
                      </button>
                    )}
                  </div>
                </div>

                {adminAlerts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminAlerts.map(alt => (
                      <div 
                        key={alt.id} 
                        className={`p-4 border rounded-2xl flex flex-col justify-between transition-all relative overflow-hidden ${
                          alt.status === 'Acknowledged' 
                            ? 'bg-slate-50 border-slate-200/60 opacity-60' 
                            : alt.type === 'error' 
                            ? 'bg-rose-50/50 border-rose-200' 
                            : alt.type === 'warning' 
                            ? 'bg-amber-50/50 border-amber-200' 
                            : 'bg-blue-50/50 border-blue-200'
                        }`}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1.5" />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                              alt.type === 'error' ? 'bg-rose-100 text-rose-800' :
                              alt.type === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {alt.category} • {alt.type}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">#{alt.id}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight pr-4">{alt.msg}</h4>
                          {alt.status === 'Acknowledged' && (
                            <p className="text-[9px] text-slate-400 font-bold">✓ Acknowledged by Staff</p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => setSelectedAlert(alt)}
                            className="text-[10px] font-bold text-slate-900 hover:underline cursor-pointer"
                          >
                            View Details
                          </button>
                          {alt.status !== 'Acknowledged' && (
                            <button 
                              onClick={() => {
                                setAdminAlerts(prev => prev.map(a => a.id === alt.id ? { ...a, status: 'Acknowledged' } : a));
                                setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Alert ${alt.id} Acknowledged`, ...prev]);
                                triggerToast('Alert Acknowledged', 'Notification has been flagged as reviewed.', 'info');
                              }}
                              className="text-[10px] font-bold text-slate-600 hover:underline cursor-pointer"
                            >
                              Acknowledge
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setAdminAlerts(prev => prev.filter(a => a.id !== alt.id));
                              setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Alert ${alt.id} Resolved`, ...prev]);
                              triggerToast('Alert Resolved', 'Incident marked as fixed and cleared from ledger.', 'success');
                            }}
                            className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-bold text-slate-700">Cluster Is Operating Pristine</p>
                    <p className="text-[10px] text-slate-400 font-medium">All servers online, zero incident thresholds breached.</p>
                  </div>
                )}
              </div>

              {/* 8-STAT DYNAMIC CONTROL MODULE CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: 'Registered Hosts', value: users.length, change: `+${users.filter(u => u.status === 'Active').length} active`, sub: 'Switch to Users operations', icon: Users, tab: 'users', color: 'text-blue-600 bg-blue-50 border-blue-100' },
                  { title: 'Operational Workspaces', value: workspaces.length, change: `MRR: $${revenueStats.mrr}`, sub: 'Switch to Workspace control', icon: HardDrive, tab: 'workspaces', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  { title: 'Memory Capsules', value: initialEvents.length, change: `${initialEvents.filter(e => e.status === 'active').length} active pipeline`, sub: 'Switch to Capsule manager', icon: Calendar, tab: 'events', color: 'text-amber-600 bg-amber-50 border-amber-100' },
                  { title: 'Total Media Assets', value: initialContributions.length, change: `+${initialContributions.filter(c => new Date(c.timestamp).getTime() > Date.now() - 24 * 3600 * 1000).length} uploaded today`, sub: 'Review Safety metrics', icon: Shield, tab: 'trust_safety', color: 'text-slate-900 bg-slate-100 border-slate-200' },
                  { title: 'Asset S3 Storage', value: totalStorageMB >= 1024 ? `${(totalStorageMB / 1024).toFixed(2)} GB` : `${totalStorageMB.toFixed(1)} MB`, change: `Limit: 10.00 GB`, sub: 'Configure limits properties', icon: Database, tab: 'system_config', color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
                  { title: 'Merchant Revenue', value: `$${revenueStats.totalPaid.toFixed(2)}`, change: `Succeeded tx: ${transactions.filter(t => t.status === 'Succeeded').length}`, sub: 'Switch to billing stream', icon: DollarSign, tab: 'subscriptions', color: 'text-slate-900 bg-slate-100 border-slate-200' },
                  { title: 'Support Open Queue', value: openTicketsCount, change: `${tickets.length} total tickets`, sub: 'Switch to support center', icon: Ticket, tab: 'support', color: 'text-rose-600 bg-rose-50 border-rose-100' },
                  { title: 'Auto Refresh Engine', value: autoRefresh ? 'ACTIVE' : 'STANDBY', change: '5s self-status update', sub: 'Click to toggle auto-run', icon: Activity, tab: 'toggle_refresh', color: autoRefresh ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-50 border-slate-100' }
                ].map((kpi, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (kpi.tab === 'toggle_refresh') {
                        setAutoRefresh(prev => !prev);
                        triggerToast(autoRefresh ? 'Auto Sync Paused' : 'Real-time Refresh Enabled', autoRefresh ? 'Control Room dashboard updates are now on demand.' : 'Dashboard stats are now streaming automatically.', 'info');
                      } else {
                        setActiveTab(kpi.tab);
                        setSearchQuery('');
                      }
                    }}
                    className="bg-white border border-slate-200/80 hover:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase leading-none">{kpi.title}</span>
                      <div className={`p-2 rounded-xl border ${kpi.color}`}>
                        <kpi.icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 leading-none">{kpi.value}</h3>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[9px] text-slate-500 font-semibold leading-none">{kpi.change}</span>
                        <span className="text-[8px] text-slate-900 font-mono font-bold uppercase tracking-wider hover:underline leading-none">{kpi.sub} →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SECOND ROW: DETAILED PLATFORM ANALYTICS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Storage Allocation breakdown */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between lg:col-span-2">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Storage S3 Allocation Breakdown</h3>
                        <p className="text-[11px] text-slate-500 font-medium">AWS S3 live cloud buckets & guest raw media allocation streams.</p>
                      </div>
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Synchronized</span>
                    </div>

                    <div className="space-y-4 mt-6">
                      {dynamicStorageBreakdown.map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-700">{item.type}</span>
                            <span className="text-slate-900">{item.size} ({item.pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Total Storage Usage: {(totalStorageMB / 1024).toFixed(3)} GB / 10.00 GB Limit</span>
                    <button 
                      onClick={() => {
                        // Purge unattached indexes action
                        const countBefore = initialContributions.length;
                        // Let's filter out empty text contributions as a simulated garbage collector run
                        const filtered = initialContributions.filter(c => c.type !== 'wish' || (c.text && c.text.trim().length > 0));
                        const removed = countBefore - filtered.length;
                        if (setContributions && removed > 0) {
                          setContributions(filtered);
                        }
                        setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Storage GC ran. Purged ${removed || 2} unlinked/temporary blobs.`, ...prev]);
                        triggerToast('Storage Optimisation Completed', `Purged ${removed || 2} empty cached blobs. Recovered 24.5 KB of indexes.`, 'success');
                      }}
                      className="text-slate-900 hover:underline font-bold cursor-pointer"
                    >
                      Run S3 Garbage Collector
                    </button>
                  </div>
                </div>

                {/* Subscriptions Revenue Distribution */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Live Stripe Ledger</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Active billing streams, recurring subscriptions, and manual upgrades.</p>
                      </div>
                      <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                    </div>

                    <div className="py-6 text-center bg-slate-50 border border-slate-100 rounded-2xl mt-4">
                      <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Monthly Recurring Revenue (MRR)</span>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight mt-1">$ {revenueStats.mrr.toFixed(2)}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold mt-1">▲ +14.2% since previous week</p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-xs font-semibold p-2 bg-slate-50 rounded-lg border border-slate-100/40">
                        <span className="text-slate-500">Pro Studios (Premium)</span>
                        <span className="text-slate-900 font-bold">{revenueStats.premiumCount} Active (${revenueStats.premiumCount * 29}/mo)</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold p-2 bg-slate-50 rounded-lg border border-slate-100/40">
                        <span className="text-slate-500">Enterprise Guilds</span>
                        <span className="text-slate-900 font-bold">{revenueStats.enterpriseCount} Active (${revenueStats.enterpriseCount * 299}/mo)</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold p-2 bg-slate-50 rounded-lg border border-slate-100/40">
                        <span className="text-slate-500">Free Starters</span>
                        <span className="text-slate-900 font-bold">{revenueStats.freeCount} Workspaces (Ad-Supported)</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      // Stripe sync action
                      setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Stripe reconciliation finished. Synchronized ${transactions.length} invoices.`, ...prev]);
                      triggerToast('Stripe Reconciliation Completed', `Verified ${transactions.length} active merchant transactions securely.`, 'success');
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs mt-4 transition-all text-center cursor-pointer shadow-sm"
                  >
                    Verify Stripe Reconciliation
                  </button>
                </div>

              </div>

              {/* THREE COLUMN ADVANCED COCKPIT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* COLUMN 1: LIVE ACTIVITY FEED & PENDING APPROVALS */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                      Live Operations & Approvals
                    </h3>
                    
                    {/* Pending approvals section */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-widest block mb-1">
                        Pending Content Moderation ({initialContributions.filter(c => !c.isPinned).slice(0, 3).length})
                      </span>
                      {initialContributions.filter(c => !c.isPinned).length > 0 ? (
                        <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                          {initialContributions.filter(c => !c.isPinned).slice(0, 3).map(contrib => (
                            <div key={contrib.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                              <div className="truncate flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-slate-950 truncate">{contrib.contributorName}</span>
                                  <span className="text-[8px] font-mono font-bold bg-slate-100 text-slate-800 px-1 py-0.2 rounded uppercase">
                                    {contrib.type}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium truncate italic mt-0.5">
                                  {contrib.type === 'photo' ? 'Photo Asset Uploaded' : `"${contrib.text}"`}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 shrink-0">
                                <button 
                                  onClick={() => {
                                    // Approve and Pin
                                    if (setContributions) {
                                      setContributions(prev => prev.map(c => c.id === contrib.id ? { ...c, isPinned: true } : c));
                                    }
                                    setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] approved pending photo contribution ${contrib.id}`, ...prev]);
                                    triggerToast('Approved & Pinned', `"${contrib.contributorName}" asset was approved globally.`, 'success');
                                  }}
                                  className="w-5 h-5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                                  title="Approve Asset"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => {
                                    // Take Down
                                    if (setContributions) {
                                      setContributions(prev => prev.filter(c => c.id !== contrib.id));
                                    }
                                    setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] deleted pending contribution ${contrib.id}`, ...prev]);
                                    triggerToast('Asset Rejected', 'Upload rejected and deleted from cluster.', 'error');
                                  }}
                                  className="w-5 h-5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                                  title="Reject & Delete Asset"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-semibold italic p-3 bg-slate-50 rounded-xl text-center">
                          ✓ Moderation queue completely clear.
                        </p>
                      )}
                    </div>

                    {/* Live Recent Feed */}
                    <div className="mt-6 space-y-3">
                      <span className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-widest block mb-1">
                        Real-Time Platform Transactions
                      </span>
                      <div className="divide-y divide-slate-100 max-h-[170px] overflow-y-auto">
                        {transactions.slice(0, 3).map(tx => (
                          <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs font-semibold">
                            <div>
                              <p className="text-slate-900 leading-none mb-1">{tx.workspace}</p>
                              <span className="text-[9px] text-slate-400 font-mono">{tx.user} • {tx.type}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-900 font-bold block leading-none mb-1">${tx.amount.toFixed(2)}</span>
                              <span className="text-[8px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">Succeeded</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('trust_safety')}
                    className="w-full text-slate-900 hover:text-slate-800 text-[11px] font-bold mt-4 pt-3 border-t border-slate-100 text-center cursor-pointer"
                  >
                    Go to Trust & Safety Board →
                  </button>
                </div>

                {/* COLUMN 2: SYSTEM LOGS TERMINAL & OPERATIONS */}
                <div className="bg-slate-950 border border-slate-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-white font-mono">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/40 pb-3 mb-4">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>CLUSTER TERMINAL LOGS</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSystemLogs([`[${new Date().toISOString().slice(11, 19)}] Terminal logs flushed by administrator`]);
                          triggerToast('Logs Cleared', 'Terminal buffers purged.', 'info');
                        }}
                        className="text-[9px] text-slate-500 hover:text-white font-bold transition-all cursor-pointer"
                      >
                        Flush
                      </button>
                    </div>

                    <div className="text-[10px] leading-relaxed space-y-2 h-[220px] overflow-y-auto pr-1 text-slate-300 font-medium">
                      {systemLogs.map((log, idx) => (
                        <p key={idx} className="break-all">
                          <span className="text-emerald-500 mr-1.5">$</span>{log}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900 space-y-3">
                    <div className="flex items-center justify-between text-xs font-sans text-slate-400">
                      <span className="font-semibold">Operations Cockpit</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider">Maintenance Mode</span>
                        <input 
                          type="checkbox"
                          checked={maintenanceMode}
                          onChange={(e) => {
                            setMaintenanceMode(e.target.checked);
                            setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Maintenance Mode toggled: ${e.target.checked ? 'ACTIVE' : 'INACTIVE'}`, ...prev]);
                            triggerToast(e.target.checked ? 'Platform Locked' : 'Platform Unlocked', e.target.checked ? 'Maintenance lock initialized.' : 'Maintenance lock released.', e.target.checked ? 'info' : 'success');
                          }}
                          className="w-3.5 h-3.5 bg-slate-900 accent-amber-500 rounded border-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sans font-semibold">
                      <button 
                        onClick={triggerBackup}
                        className="py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer text-center font-sans"
                      >
                        Trigger Snapshot
                      </button>
                      <button 
                        onClick={() => {
                          // Purge suspended users
                          const suspendedCount = users.filter(u => u.status === 'Suspended').length;
                          if (suspendedCount > 0) {
                            if (confirm(`Are you sure you want to permanently delete ${suspendedCount} suspended user(s)? This will clean up databases.`)) {
                              const updated = users.filter(u => u.status !== 'Suspended');
                              saveUsers(updated);
                              setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Database purge completed. Deleted ${suspendedCount} suspended profiles.`, ...prev]);
                              triggerToast('Database Purged', `Deleted ${suspendedCount} suspended host accounts successfully.`, 'error');
                            }
                          } else {
                            triggerToast('No Suspended Accounts', 'Database directory is already clean.', 'info');
                          }
                        }}
                        className="py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-300 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer text-center font-sans"
                      >
                        Purge Suspended
                      </button>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: API CONNECTION TESTS & BACKUP METADATA */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                      API Gateway & Integrity Logs
                    </h3>

                    <div className="space-y-4">
                      {Object.entries(apiStatuses).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between text-xs font-semibold border-b border-slate-50 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${value.status === 'Healthy' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                            <span className="font-bold text-slate-900 capitalize font-mono text-[11px]">{key === 'sendgrid' ? 'SMTP (SendGrid)' : key + ' Gateway'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-slate-500 text-[10px]">{value.latency} ms</span>
                            <button 
                              onClick={() => {
                                // Simulate testing connection
                                setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Pinging ${key} integration endpoints...`, ...prev]);
                                setTimeout(() => {
                                  const simulatedLatency = Math.floor(value.latency * (0.8 + Math.random() * 0.4));
                                  setApiStatuses(prev => ({
                                    ...prev,
                                    [key]: { status: 'Healthy', latency: simulatedLatency, checkedAt: 'Just now' }
                                  }));
                                  setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Ping response for ${key}: 200 OK (${simulatedLatency}ms)`, ...prev]);
                                }, 600);
                                triggerToast('Endpoint Pinged', `Sent keepalive trace to ${key} servers.`, 'info');
                              }}
                              className="text-[9px] text-slate-900 hover:underline cursor-pointer font-bold uppercase font-mono"
                            >
                              Test API
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Snapshot Metadata Card */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/60 mt-6 text-xs font-semibold">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-500">Backups Available</span>
                        <span className="text-slate-900 font-bold">{backupLogs.length} Snapshots</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Latest Archival</span>
                        <span className="text-slate-900 font-mono text-[10px] truncate max-w-[150px]">{backupLogs[0]?.file || 'None'}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('backup')}
                    className="w-full text-slate-900 hover:text-slate-800 text-[11px] font-bold mt-4 pt-3 border-t border-slate-100 text-center cursor-pointer font-sans"
                  >
                    Manage Storage Snapshots →
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB CONTENT 2: USER OPERATIONS & MULTI-ROLE MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in" id="kava-user-operations-portal">
              
              {/* Simulation Banner if Workspace Admin preview mode is on */}
              {isSimulatingWsAdmin && (
                <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800/40 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-200 shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-wide uppercase font-mono text-slate-300">Workspace Admin Simulation Mode</p>
                      <p className="text-xs text-slate-300/90 font-medium">Viewing console scope restricted to assigned workspaces & event guests. Platform billing, global system parameters, and Super Admin controls are isolated.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsSimulatingWsAdmin(false);
                      triggerToast('Preview Terminated', 'Restored full Super Admin platform clearance.', 'info');
                    }}
                    className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Exit Simulation Mode
                  </button>
                </div>
              )}

              {/* TOP MULTI-ROLE NAVIGATION BAR & GLOBAL CONTROLS */}
              <div className="bg-white border border-slate-200/80 rounded-[28px] p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-1.5 overflow-x-auto p-1 bg-slate-100/70 rounded-2xl">
                  <button
                    onClick={() => setUserRoleSubTab('hosts')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                      userRoleSubTab === 'hosts' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Hosts & Owners</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${userRoleSubTab === 'hosts' ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-600'}`}>
                      {users.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setUserRoleSubTab('guests')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                      userRoleSubTab === 'guests' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Event Guests</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${userRoleSubTab === 'guests' ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-600'}`}>
                      {guestsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setUserRoleSubTab('workspace_admins')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                      userRoleSubTab === 'workspace_admins' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Workspace Admins</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${userRoleSubTab === 'workspace_admins' ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-600'}`}>
                      {workspaceAdminsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setUserRoleSubTab('super_admins')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                      userRoleSubTab === 'super_admins' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Super Admins</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${userRoleSubTab === 'super_admins' ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-600'}`}>
                      {superAdminsList.length}
                    </span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowRolePermissionsModal(true)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-900" />
                    <span>Role Permissions Matrix</span>
                  </button>

                  <button
                    onClick={() => {
                      if (userRoleSubTab === 'hosts') setShowCreateAccountModal('host');
                      else if (userRoleSubTab === 'guests') setShowCreateAccountModal('guest');
                      else if (userRoleSubTab === 'workspace_admins') setShowCreateAccountModal('ws_admin');
                      else if (userRoleSubTab === 'super_admins') setShowCreateAccountModal('super_admin');
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {userRoleSubTab === 'hosts' ? 'Add Host' :
                       userRoleSubTab === 'guests' ? 'Register Guest' :
                       userRoleSubTab === 'workspace_admins' ? 'Add Workspace Admin' : 'Add Super Admin'}
                    </span>
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SUB-SECTION 1: HOSTS & EVENT OWNERS                  */}
              {/* ---------------------------------------------------- */}
              {userRoleSubTab === 'hosts' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Hosts Stats Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Total Registered Hosts</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{users.length} Hosts</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% active license ratio</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Premium & Enterprise</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{users.filter(u => u.plan !== 'Free').length} Licenses</h4>
                      <p className="text-[11px] text-slate-900 font-semibold mt-1">High-value host tier</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Owned Memory Capsules</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{workspaces.reduce((acc, w) => acc + (w.eventsCount || 1), 0)} Events</h4>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">Across all workspaces</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Host Cloud Storage</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{(workspaces.reduce((acc, w) => acc + (w.storageMB || 0), 0) / 1024).toFixed(2)} GB</h4>
                      <p className="text-[11px] text-amber-600 font-semibold mt-1">AWS S3 / CloudRun Buffer</p>
                    </div>
                  </div>

                  {/* Hosts Table Card */}
                  <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Hosts Directory</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Event owners with subscription tier, storage quotas, and workspace authority.</p>
                      </div>

                      {/* Filters */}
                      <div className="flex items-center space-x-2">
                        <select
                          value={hostPlanFilter}
                          onChange={(e) => setHostPlanFilter(e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                        >
                          <option value="All">All Plans</option>
                          <option value="Free">Free</option>
                          <option value="Premium">Premium</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>

                        <select
                          value={hostStatusFilter}
                          onChange={(e) => setHostStatusFilter(e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-600">
                        <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4">Host Identity</th>
                            <th className="px-6 py-4">Subscription Plan</th>
                            <th className="px-6 py-4">Storage Usage & Quota</th>
                            <th className="px-6 py-4">Workspaces & Events</th>
                            <th className="px-6 py-4">Joined Date</th>
                            <th className="px-6 py-4">Security Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {filteredHosts.map(host => {
                            const hostWs = workspaces.filter(w => w.host === host.name || host.name.includes(w.host));
                            const usedStorage = hostWs.reduce((acc, w) => acc + (w.storageMB || 120), 120);
                            const maxStorage = host.plan === 'Enterprise' ? 10240 : host.plan === 'Premium' ? 5120 : 500;
                            const storagePct = Math.min(100, Math.round((usedStorage / maxStorage) * 100));

                            return (
                              <tr key={host.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                                      {host.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900">{host.name}</p>
                                      <span className="text-[10px] text-slate-400 font-mono">{host.email}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                    host.plan === 'Enterprise' ? 'bg-slate-900 text-white border border-slate-800/40' :
                                    host.plan === 'Premium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    {host.plan}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="max-w-[140px]">
                                    <div className="flex justify-between text-[10px] font-mono font-bold mb-1">
                                      <span>{usedStorage} MB</span>
                                      <span className="text-slate-400">{maxStorage} MB</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${storagePct > 85 ? 'bg-rose-500' : storagePct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${storagePct}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-mono">
                                  <span className="text-slate-900 font-bold">{host.workspaces || hostWs.length || 1} Workspaces</span>
                                  <p className="text-[10px] text-slate-400">Active Host</p>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">{host.joined}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    host.status === 'Active' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                                  }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${host.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <span>{host.status}</span>
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => {
                                        onImpersonateUser(host.name, 'dashboard');
                                        triggerToast('Host Context Activated', `Impersonating Host "${host.name}".`, 'info');
                                      }}
                                      className="p-1.5 hover:bg-slate-100 text-slate-900 rounded-lg transition-all cursor-pointer"
                                      title="Impersonate (Login as Host)"
                                    >
                                      <UserCheck className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() => {
                                        setSelectedUserId(host.id);
                                        setShowPasswordResetModal(true);
                                      }}
                                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-all cursor-pointer"
                                      title="Reset Password"
                                    >
                                      <Lock className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() => handleToggleSuspendUser(host.id)}
                                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                        host.status === 'Suspended' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'
                                      }`}
                                      title={host.status === 'Suspended' ? 'Unsuspend Access' : 'Suspend Access'}
                                    >
                                      <Power className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteUser(host.id)}
                                      className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all cursor-pointer"
                                      title="Purge Host Account"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SUB-SECTION 2: EVENT GUESTS & PARTICIPANTS           */}
              {/* ---------------------------------------------------- */}
              {userRoleSubTab === 'guests' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Guest Stats Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Total Event Guests</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{guestsList.length} Participants</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">Across all memory capsules</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Active Contributors</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{guestsList.filter(g => g.status === 'Active').length} Guests</h4>
                      <p className="text-[11px] text-slate-900 font-semibold mt-1">Live upload permissions</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Total Submissions</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{guestsList.reduce((acc, g) => acc + (g.contributionsCount || 0), 0)} Media Assets</h4>
                      <p className="text-[11px] text-amber-600 font-semibold mt-1">Photos, videos, audio & wishes</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Moderated / Blocked</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{guestsList.filter(g => g.status === 'Blocked').length} Guests</h4>
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">Safety actions taken</p>
                    </div>
                  </div>

                  {/* Guests Table Card */}
                  <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Event Guests & Participants</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Manage event attendees, inspect contributions, view activity history, and take moderation actions.</p>
                      </div>

                      {/* Filters */}
                      <div className="flex items-center space-x-2">
                        <select
                          value={guestEventFilter}
                          onChange={(e) => setGuestEventFilter(e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                        >
                          <option value="All">All Events</option>
                          <option value="evt-101">Rodriguez-Chen Wedding</option>
                          <option value="evt-102">Stanford Class of 2016 Reunion</option>
                          <option value="evt-103">Marcus 30th Birthday Lounge</option>
                        </select>

                        <select
                          value={guestTypeFilter}
                          onChange={(e) => setGuestTypeFilter(e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                        >
                          <option value="All">All Contribution Types</option>
                          <option value="photo">Has Photos</option>
                          <option value="video">Has Videos</option>
                          <option value="voice">Has Voice Notes</option>
                          <option value="wish">Has Wishes</option>
                        </select>

                        <select
                          value={guestStatusFilter}
                          onChange={(e) => setGuestStatusFilter(e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Blocked">Blocked</option>
                          <option value="Left">Left</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-600">
                        <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4">Guest Identity</th>
                            <th className="px-6 py-4">Joined Event</th>
                            <th className="px-6 py-4">Contributions Breakdown</th>
                            <th className="px-6 py-4">Last Activity</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Moderation & Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {filteredGuests.map(guest => (
                            <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={guest.avatar}
                                    alt={guest.name}
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                  />
                                  <div>
                                    <p className="font-bold text-slate-900">{guest.name}</p>
                                    <span className="text-[10px] text-slate-400 font-mono">{guest.email || guest.phone}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-bold text-slate-900">{guest.eventName}</p>
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[9px] uppercase font-bold">
                                    {guest.eventCode}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold text-[10px]">
                                    📷 {guest.contributionTypes?.photo || 0}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono font-bold text-[10px]">
                                    🎥 {guest.contributionTypes?.video || 0}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono font-bold text-[10px]">
                                    🎙️ {guest.contributionTypes?.voice || 0}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px]">
                                    💌 {guest.contributionTypes?.wish || 0}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">
                                {new Date(guest.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(guest.lastActivity).toLocaleDateString()})
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  guest.status === 'Active' ? 'text-emerald-700 bg-emerald-50' :
                                  guest.status === 'Blocked' ? 'text-rose-700 bg-rose-50' : 'text-slate-600 bg-slate-100'
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${
                                    guest.status === 'Active' ? 'bg-emerald-500' :
                                    guest.status === 'Blocked' ? 'bg-rose-500' : 'bg-slate-400'
                                  }`} />
                                  <span>{guest.status}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => setSelectedGuestForHistory(guest)}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center space-x-1"
                                    title="Inspect Activity History & Contributions"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-900" />
                                    <span>Inspect Media</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      const nextStatus = guest.status === 'Blocked' ? 'Active' : 'Blocked';
                                      const updated = guestsList.map(g => g.id === guest.id ? { ...g, status: nextStatus } : g);
                                      saveGuests(updated);
                                      triggerToast(nextStatus === 'Blocked' ? 'Guest Blocked' : 'Guest Unblocked', `"${guest.name}" has been ${nextStatus.toLowerCase()}.`, nextStatus === 'Blocked' ? 'error' : 'success');
                                    }}
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                      guest.status === 'Blocked' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-rose-600 hover:bg-rose-50'
                                    }`}
                                    title={guest.status === 'Blocked' ? 'Unblock Guest' : 'Block Guest'}
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Remove guest "${guest.name}" from event "${guest.eventName}"?`)) {
                                        const updated = guestsList.filter(g => g.id !== guest.id);
                                        saveGuests(updated);
                                        triggerToast('Guest Removed', `Removed "${guest.name}" from capsule.`, 'error');
                                      }
                                    }}
                                    className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all cursor-pointer"
                                    title="Remove from Event"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SUB-SECTION 3: WORKSPACE ADMINS                      */}
              {/* ---------------------------------------------------- */}
              {userRoleSubTab === 'workspace_admins' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Workspace Admin Stats Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Workspace Admins</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{workspaceAdminsList.length} Officers</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">Delegated workspace managers</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Assigned Workspaces</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{workspaces.length} Managed Hubs</h4>
                      <p className="text-[11px] text-slate-900 font-semibold mt-1">Scoped workspace control</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Managed Team Members</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{workspaceAdminsList.reduce((acc, wa) => acc + (wa.teamMembersCount || 0), 0)} Staff</h4>
                      <p className="text-[11px] text-amber-600 font-semibold mt-1">Delegated event teams</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Security isolation</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">100% Restricted</h4>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">No platform billing access</p>
                    </div>
                  </div>

                  {/* Workspace Admins Table Card */}
                  <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Workspace Administrators Directory</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Workspace Admins can manage assigned workspaces, events, guests, and team members, but cannot access platform settings, billing, or Super Admin tools.</p>
                      </div>

                      {/* Filters */}
                      <div className="flex items-center space-x-2">
                        <select
                          value={wsAdminWsFilter}
                          onChange={(e) => setWsAdminWsFilter(e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                        >
                          <option value="All">All Assigned Workspaces</option>
                          {workspaces.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>

                        <select
                          value={wsAdminStatusFilter}
                          onChange={(e) => setWsAdminStatusFilter(e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-600">
                        <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4">Admin Officer</th>
                            <th className="px-6 py-4">Assigned Workspaces</th>
                            <th className="px-6 py-4">Permission Matrix</th>
                            <th className="px-6 py-4">Managed Team</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {filteredWsAdmins.map(wa => (
                            <tr key={wa.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-bold text-slate-900">{wa.name}</p>
                                  <span className="text-[10px] text-slate-400 font-mono">{wa.email} • {wa.title}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1 max-w-[220px]">
                                  {wa.assignedWorkspaces.map((wsId: string) => {
                                    const ws = workspaces.find(w => w.id === wsId);
                                    return (
                                      <span key={wsId} className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-bold">
                                        {ws?.name || wsId}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${wa.permissions?.manageEvents ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                    Events {wa.permissions?.manageEvents ? '✓' : '✗'}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${wa.permissions?.manageGuests ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                    Guests {wa.permissions?.manageGuests ? '✓' : '✗'}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${wa.permissions?.manageTeam ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                    Team {wa.permissions?.manageTeam ? '✓' : '✗'}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${wa.permissions?.moderateContent ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                    Moderate {wa.permissions?.moderateContent ? '✓' : '✗'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono">
                                <span className="font-bold text-slate-900">{wa.teamMembersCount} Members</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  wa.status === 'Active' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${wa.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                  <span>{wa.status}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      setIsSimulatingWsAdmin(true);
                                      triggerToast('Simulation Active', `Simulating Workspace Admin view for "${wa.name}".`, 'info');
                                    }}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center space-x-1"
                                    title="Test Workspace Admin Console Perspective"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Test View</span>
                                  </button>

                                  <button
                                    onClick={() => setEditingWsAdmin(wa)}
                                    className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg transition-all cursor-pointer"
                                    title="Edit Workspaces & Permissions"
                                  >
                                    <Sliders className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      const nextStatus = wa.status === 'Suspended' ? 'Active' : 'Suspended';
                                      const updated = workspaceAdminsList.map(a => a.id === wa.id ? { ...a, status: nextStatus } : a);
                                      saveWorkspaceAdmins(updated);
                                      triggerToast('Status Updated', `Workspace Admin "${wa.name}" set to ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'error');
                                    }}
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                      wa.status === 'Suspended' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'
                                    }`}
                                    title={wa.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Purge Workspace Admin account "${wa.name}"?`)) {
                                        const updated = workspaceAdminsList.filter(a => a.id !== wa.id);
                                        saveWorkspaceAdmins(updated);
                                        triggerToast('Account Purged', `Deleted Workspace Admin "${wa.name}".`, 'error');
                                      }
                                    }}
                                    className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all cursor-pointer"
                                    title="Delete Account"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SUB-SECTION 4: SUPER ADMINS                          */}
              {/* ---------------------------------------------------- */}
              {userRoleSubTab === 'super_admins' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Super Admin Stats Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Super Admin Officers</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">{superAdminsList.length} Administrators</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">Full platform authority</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Security Health Score</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">100% Verified</h4>
                      <p className="text-[11px] text-slate-900 font-semibold mt-1">Zero vulnerabilities detected</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">MFA Enforcement</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">100% Enforced</h4>
                      <p className="text-[11px] text-amber-600 font-semibold mt-1">Hardware & TOTP keys required</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Audit Trail Integrity</p>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">Active Logging</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">Immutable CloudWatch buffers</p>
                    </div>
                  </div>

                  {/* Super Admins Table Card */}
                  <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Super Administrators Staff</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Super Admins maintain unrestricted access across all platform configurations, billing engines, system clusters, and audit logs.</p>
                      </div>

                      {/* Filters */}
                      <div className="flex items-center space-x-2">
                        <select
                          value={superAdminStatusFilter}
                          onChange={(e) => setSuperAdminStatusFilter(e.target.value)}
                          className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Revoked">Revoked</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-600">
                        <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4">Officer Identity & Title</th>
                            <th className="px-6 py-4">Security Clearance</th>
                            <th className="px-6 py-4">Two-Factor Authentication</th>
                            <th className="px-6 py-4">Last Active IP & Time</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {filteredSuperAdmins.map(sa => (
                            <tr key={sa.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-xs">
                                    <Award className="w-4 h-4 text-amber-400" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{sa.name}</p>
                                    <span className="text-[10px] text-slate-400 font-mono">{sa.email} • {sa.title}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono font-bold text-[9px] uppercase tracking-wider shadow-xs">
                                  {sa.securityClearance}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Enforced (MFA ✓)</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                                {sa.lastIp} • {new Date(sa.lastActive).toLocaleTimeString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  sa.status === 'Active' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${sa.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                  <span>{sa.status}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      triggerToast('Security Keycard Reset', `Dispatched MFA key re-authentication to "${sa.name}".`, 'success');
                                    }}
                                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-all cursor-pointer"
                                    title="Reset MFA & Keycard Credentials"
                                  >
                                    <Lock className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Revoke Super Admin privileges for "${sa.name}"?`)) {
                                        const updated = superAdminsList.map(a => a.id === sa.id ? { ...a, status: 'Revoked' } : a);
                                        saveSuperAdmins(updated);
                                        triggerToast('Clearance Revoked', `Super Admin access revoked for "${sa.name}".`, 'error');
                                      }
                                    }}
                                    className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all cursor-pointer"
                                    title="Revoke Super Admin Privileges"
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* MODAL 1: GUEST ACTIVITY & CONTRIBUTION HISTORY        */}
              {/* ---------------------------------------------------- */}
              {selectedGuestForHistory && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 border border-slate-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <img src={selectedGuestForHistory.avatar} alt={selectedGuestForHistory.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900">{selectedGuestForHistory.name}</h4>
                          <p className="text-xs text-slate-500 font-mono">{selectedGuestForHistory.email || selectedGuestForHistory.phone} • Joined {selectedGuestForHistory.joinedAt}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedGuestForHistory(null)} className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer">
                        ✕
                      </button>
                    </div>

                    <div>
                      <h5 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">Joined Capsule Details</h5>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{selectedGuestForHistory.eventName}</p>
                          <span className="text-[10px] font-mono text-slate-500">Access Code: {selectedGuestForHistory.eventCode}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                          Verified Participant
                        </span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-3">Live Submissions & Memory Media Activity</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 border border-slate-200 rounded-2xl flex items-center justify-between bg-white shadow-xs">
                          <div className="flex items-center space-x-3">
                            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=120&q=80" alt="sample" className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                              <p className="text-xs font-bold text-slate-900">Wedding Cake Toast</p>
                              <span className="text-[10px] text-slate-400 font-mono">Photo • Approved</span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button onClick={() => triggerToast('Approved', 'Asset verified', 'success')} className="p-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">✓</button>
                            <button onClick={() => triggerToast('Taken Down', 'Asset removed', 'error')} className="p-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold">✕</button>
                          </div>
                        </div>

                        <div className="p-3 border border-slate-200 rounded-2xl flex items-center justify-between bg-white shadow-xs">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center font-bold text-xs">
                              🎙️ Audio
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Voice Wish Note</p>
                              <span className="text-[10px] text-slate-400 font-mono">34s MP3 Voice</span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button onClick={() => triggerToast('Approved', 'Voice note approved', 'success')} className="p-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">✓</button>
                            <button onClick={() => triggerToast('Taken Down', 'Voice note removed', 'error')} className="p-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold">✕</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button onClick={() => setSelectedGuestForHistory(null)} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">
                        Close Inspection
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* MODAL 2: EDIT WORKSPACE ADMIN SCOPE & PERMISSIONS    */}
              {/* ---------------------------------------------------- */}
              {editingWsAdmin && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[28px] max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4 text-left">
                    <h4 className="text-sm font-bold text-slate-900">Configure Workspace Admin Permissions</h4>
                    <p className="text-xs text-slate-500">Edit assigned workspaces and permission toggles for "{editingWsAdmin.name}":</p>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Workspaces</label>
                      <div className="space-y-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                        {workspaces.map(w => {
                          const isAssigned = editingWsAdmin.assignedWorkspaces?.includes(w.id);
                          return (
                            <label key={w.id} className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={(e) => {
                                  const current = editingWsAdmin.assignedWorkspaces || [];
                                  const updatedWs = e.target.checked ? [...current, w.id] : current.filter((id: string) => id !== w.id);
                                  setEditingWsAdmin({ ...editingWsAdmin, assignedWorkspaces: updatedWs });
                                }}
                                className="rounded text-slate-900 focus:ring-0"
                              />
                              <span>{w.name} ({w.host})</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Permission Matrix Controls</label>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                        {['manageEvents', 'manageGuests', 'manageTeam', 'moderateContent'].map(perm => (
                          <label key={perm} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                            <span className="capitalize">{perm.replace(/([A-Z])/g, ' $1')}</span>
                            <input
                              type="checkbox"
                              checked={editingWsAdmin.permissions?.[perm] ?? true}
                              onChange={(e) => {
                                setEditingWsAdmin({
                                  ...editingWsAdmin,
                                  permissions: { ...editingWsAdmin.permissions, [perm]: e.target.checked }
                                });
                              }}
                              className="rounded text-slate-900"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button onClick={() => setEditingWsAdmin(null)} className="flex-1 border border-slate-200 text-slate-600 font-bold py-2 rounded-xl text-xs cursor-pointer">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const updated = workspaceAdminsList.map(a => a.id === editingWsAdmin.id ? editingWsAdmin : a);
                          saveWorkspaceAdmins(updated);
                          setEditingWsAdmin(null);
                          triggerToast('Permissions Saved', 'Workspace Admin scope updated successfully.', 'success');
                        }}
                        className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* MODAL 3: GLOBAL ROLE PERMISSIONS MATRIX CONTROL       */}
              {/* ---------------------------------------------------- */}
              {showRolePermissionsModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 border border-slate-100 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Platform Role Permissions Matrix</h4>
                        <p className="text-xs text-slate-500 font-medium">Customize capability flags across Hosts, Guests, Workspace Admins, and Super Admins.</p>
                      </div>
                      <button onClick={() => setShowRolePermissionsModal(false)} className="text-slate-400 hover:text-slate-800 text-sm font-bold cursor-pointer">✕</button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                          <tr>
                            <th className="p-3">Capability / Feature</th>
                            <th className="p-3 text-center">Host</th>
                            <th className="p-3 text-center">Guest</th>
                            <th className="p-3 text-center">Workspace Admin</th>
                            <th className="p-3 text-center">Super Admin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {[
                            { key: 'createEvents', label: 'Create Memory Capsules' },
                            { key: 'manageSettings', label: 'Custom Branding & Themes' },
                            { key: 'uploadPhotos', label: 'Upload Media Submissions' },
                            { key: 'writeWishes', label: 'Submit Guest Wish Notes' },
                            { key: 'moderateContent', label: 'Moderate Media & Wishes' },
                            { key: 'accessBilling', label: 'Manage Platform Billing' },
                            { key: 'systemConfig', label: 'System Configuration' }
                          ].map(item => (
                            <tr key={item.key} className="hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-slate-900">{item.label}</td>
                              {['Host', 'Guest', 'WorkspaceAdmin', 'SuperAdmin'].map(role => (
                                <td key={role} className="p-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={rolePermissions[role]?.[item.key] ?? false}
                                    onChange={(e) => {
                                      const updated = {
                                        ...rolePermissions,
                                        [role]: { ...rolePermissions[role], [item.key]: e.target.checked }
                                      };
                                      saveRolePermissions(updated);
                                    }}
                                    className="rounded text-slate-900 cursor-pointer"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setShowRolePermissionsModal(false);
                          triggerToast('Role Matrix Synced', 'Global permissions matrix synced live to core router.', 'success');
                        }}
                        className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Save Matrix Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* MODAL 4: CREATE ACCOUNT MODAL FOR ALL ROLES          */}
              {/* ---------------------------------------------------- */}
              {showCreateAccountModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[28px] max-w-sm w-full p-6 border border-slate-100 shadow-2xl space-y-4 text-left">
                    <h4 className="text-sm font-bold text-slate-900 capitalize">
                      Create New {showCreateAccountModal.replace('_', ' ')} Account
                    </h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const name = formData.get('name') as string;
                        const email = formData.get('email') as string;

                        if (showCreateAccountModal === 'host') {
                          const newHost = { id: `usr-${Date.now()}`, name, email, role: 'Host', status: 'Active', workspaces: 1, joined: new Date().toISOString().slice(0, 10), plan: 'Free' };
                          saveUsers([newHost, ...users]);
                        } else if (showCreateAccountModal === 'guest') {
                          const newGuest = { id: `gst-${Date.now()}`, name, email, phone: '+1 (555) 000-0000', eventId: 'evt-101', eventName: 'Rodriguez-Chen Wedding', eventCode: 'SOPHIA-LEO', joinedAt: new Date().toISOString().slice(0, 10), lastActivity: new Date().toISOString(), device: 'Mobile', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', status: 'Active', contributionsCount: 0, contributionTypes: { photo: 0, video: 0, voice: 0, wish: 0 } };
                          saveGuests([newGuest, ...guestsList]);
                        } else if (showCreateAccountModal === 'ws_admin') {
                          const newWsAdmin = { id: `wsa-${Date.now()}`, name, email, title: 'Workspace Producer', assignedWorkspaces: ['ws-artha'], teamMembersCount: 1, managedGuestsCount: 0, managedEventsCount: 1, permissions: { manageEvents: true, manageGuests: true, manageTeam: true, moderateContent: true }, status: 'Active', joinedAt: new Date().toISOString().slice(0, 10), lastActive: new Date().toISOString() };
                          saveWorkspaceAdmins([newWsAdmin, ...workspaceAdminsList]);
                        } else if (showCreateAccountModal === 'super_admin') {
                          const newSa = { id: `sa-${Date.now()}`, name, email, title: 'Platform Officer', securityClearance: 'Full Platform Access', mfaEnabled: true, lastIp: '192.168.1.1', lastActive: new Date().toISOString(), status: 'Active', joinedAt: new Date().toISOString().slice(0, 10) };
                          saveSuperAdmins([newSa, ...superAdminsList]);
                        }

                        setShowCreateAccountModal(null);
                        triggerToast('Account Provisioned', `New ${showCreateAccountModal} account established.`, 'success');
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Full Identity Name</label>
                        <input name="name" required placeholder="e.g. Alex Morgan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none" />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                        <input name="email" type="email" required placeholder="alex@kava.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none" />
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <button type="button" onClick={() => setShowCreateAccountModal(null)} className="flex-1 border border-slate-200 text-slate-600 font-bold py-2 rounded-xl text-xs cursor-pointer">
                          Cancel
                        </button>
                        <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">
                          Create Account
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Password Reset Modal dialog overlay */}
              {showPasswordResetModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-100 shadow-xl">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Initialize Security Override Reset</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">You are forcing a credential override on user accounts. Type the replacement secure password:</p>
                    <input
                      type="text"
                      placeholder="e.g. TempKava2026!"
                      value={newPasswordValue}
                      onChange={(e) => setNewPasswordValue(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none mb-4"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowPasswordResetModal(false)}
                        className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2 rounded-xl text-xs transition-all"
                      >
                        Abort
                      </button>
                      <button
                        onClick={handleResetPassword}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition-all"
                      >
                        Confirm Override
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actionable Incident Inspector Modal */}
              {selectedAlert && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[28px] max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          selectedAlert.type === 'error' ? 'bg-rose-500 animate-ping' :
                          selectedAlert.type === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'
                        }`} />
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono">
                          {selectedAlert.category} Incident Tracer
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{selectedAlert.id}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-black text-slate-900 leading-snug">
                        {selectedAlert.msg}
                      </h3>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {selectedAlert.details || 'No trace diagnostic details provided.'}
                        </p>
                        <div className="bg-slate-950 text-emerald-400 font-mono text-[9px] p-3 rounded-xl overflow-x-auto max-h-[120px] leading-relaxed">
                          <p className="text-slate-500">// CLUSTER TRACE DUMP //</p>
                          <p>TIMESTAMP: {new Date().toISOString()}</p>
                          <p>GATEWAY_IP: 10.0.1.48</p>
                          <p>CLUSTER_ID: kava-core-east-01</p>
                          <p>STATUS_CODE: {selectedAlert.type === 'error' ? '500_SYS_FAIL' : '200_WARN_LOG'}</p>
                          <p className="text-slate-400 mt-1">Ready for administrative override.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => setSelectedAlert(null)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Close Diagnostics
                      </button>
                      
                      {selectedAlert.status !== 'Acknowledged' && (
                        <button
                          onClick={() => {
                            setAdminAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, status: 'Acknowledged' } : a));
                            setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Incident ${selectedAlert.id} marked Reviewed`, ...prev]);
                            triggerToast('Incident Acknowledged', 'Logged staff review on incident ticket.', 'info');
                            setSelectedAlert(null);
                          }}
                          className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setAdminAlerts(prev => prev.filter(a => a.id !== selectedAlert.id));
                          setSystemLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Incident ${selectedAlert.id} resolved manually`, ...prev]);
                          triggerToast('Incident Resolved', 'Cleared error alerts matrices globally.', 'success');
                          setSelectedAlert(null);
                        }}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                      >
                        Resolve Issue
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB CONTENT 3: WORKSPACE MANAGEMENT */}
          {activeTab === 'workspaces' && (
            <WorkspaceManagementPanel
              workspaces={workspaces}
              onSaveWorkspaces={saveWorkspaces}
              onTriggerToast={triggerToast}
              onImpersonateUser={onImpersonateUser}
            />
          )}

          {/* TAB CONTENT 4: EVENT/CAPSULE MANAGEMENT */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Active Capsules / Events</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Archive pipelines, enforce file caps, or analyze global guest uploads.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Capsule Detail</th>
                        <th className="px-6 py-4">Format Theme</th>
                        <th className="px-6 py-4">Passcode</th>
                        <th className="px-6 py-4">Guest Count</th>
                        <th className="px-6 py-4">Moderation Rule</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">System Override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {initialEvents.map(evt => (
                        <tr key={evt.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-slate-900">{evt.name}</p>
                              <span className="text-[10px] text-slate-400 font-medium">{evt.location} • {evt.date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 capitalize">{evt.type}</td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">{evt.code}</td>
                          <td className="px-6 py-4 font-mono">{evt.guestCount} contributors</td>
                          <td className="px-6 py-4">
                            <span className="text-[10px]">
                              {evt.settings.requireApproval ? 'Manual Approved Required' : 'Instant Live Stream'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              evt.status === 'active' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                            }`}>
                              <span>{evt.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  alert(`Enforcing cold-archival freeze on "${evt.name}". Guests can no longer upload assets.`);
                                  triggerToast('Capsule Archived', 'Active file pipelines paused.', 'info');
                                }}
                                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                              >
                                Freeze Uploads
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: LANDING PAGE TESTIMONIALS & METRICS CMS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8 animate-fade-in">
              {/* Header Banner & Global Actions */}
              <div className="bg-slate-900 text-white border border-slate-800/40 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Public Landing Page CMS</span>
                  </div>
                  <h2 className="text-2xl font-black text-white font-sans tracking-tight">Host Stories & Testimonials</h2>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-xl font-light">
                    Manage testimonials displayed on the public KAVA landing page. Auto-import data directly from real live events or craft manual testimonials.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setCreationOption('featured_event');
                      setSelectedEventForImport(initialEvents[0]?.id || '');
                      const ev = initialEvents[0];
                      const eventContribs = ev ? initialContributions.filter(c => c.eventId === ev.id) : [];
                      const photoUrls = eventContribs.map(c => c.url).filter((u): u is string => Boolean(u));
                      
                      setEditingTestimonial({
                        sourceType: 'featured_event',
                        eventId: ev?.id || '',
                        coverImage: ev?.coverUrl || COVER_PRESETS[0],
                        galleryImages: photoUrls.length > 0 ? photoUrls.slice(0, 6) : COVER_PRESETS.slice(0, 4),
                        hostName: ev?.name || 'Sofia & Leo',
                        eventTitle: ev?.name || 'Sofia & Leo Wedding',
                        eventCategory: ev?.type || 'Wedding',
                        testimonialTitle: 'Captured 800+ unscripted memories seamlessly',
                        quote: 'KAVA made capturing candid photos from our guests effortless and beautiful.',
                        rating: 5,
                        guestCount: ev?.guestCount || 180,
                        uploadedPhotos: eventContribs.length || 420,
                        isFeatured: false,
                        isPublished: true
                      });
                      setIsTestimonialModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Testimonial</span>
                  </button>

                  <button
                    onClick={() => setIsStatsModalOpen(true)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-slate-400" />
                    <span>Global Metrics</span>
                  </button>

                  <button
                    onClick={onBackToLanding}
                    className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700/60 transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>View Landing Page</span>
                  </button>
                </div>
              </div>

              {/* Status Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Total Testimonials</p>
                  <p className="text-2xl font-black text-slate-900">{testimonialItems.length}</p>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1">
                  <p className="text-[10px] text-emerald-600 font-mono font-bold uppercase tracking-wider">Published</p>
                  <p className="text-2xl font-black text-emerald-600">
                    {testimonialItems.filter(t => t.isPublished).length}
                  </p>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1">
                  <p className="text-[10px] text-amber-600 font-mono font-bold uppercase tracking-wider">Featured Capsule</p>
                  <p className="text-2xl font-black text-amber-600">
                    {testimonialItems.filter(t => t.isFeatured).length > 0 ? 1 : 0}
                  </p>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1">
                  <p className="text-[10px] text-sky-600 font-mono font-bold uppercase tracking-wider">Event Auto-Imports</p>
                  <p className="text-2xl font-black text-sky-600">
                    {testimonialItems.filter(t => t.sourceType === 'featured_event').length}
                  </p>
                </div>
              </div>

              {/* Testimonial Items List */}
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden space-y-0">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Manage Landing Page Testimonials</h3>
                    <p className="text-xs text-slate-400 font-medium">Use order controls to arrange display sequence on the landing page.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {testimonialItems.length} Stories
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {testimonialItems
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <div 
                        key={item.id} 
                        draggable
                        onDragStart={() => handleDragStartTestimonial(item.id)}
                        onDragOver={handleDragOverTestimonial}
                        onDrop={() => handleDropTestimonial(item.id)}
                        className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors cursor-grab active:cursor-grabbing ${
                          draggedTestimonialId === item.id ? 'opacity-40 bg-amber-100/50 border-2 border-dashed border-amber-400' :
                          item.isFeatured ? 'bg-amber-500/5' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Left Info Column */}
                        <div className="flex items-center space-x-3">
                          {/* Drag Handle & Reorder Up/Down Buttons */}
                          <div className="flex items-center space-x-1.5 text-slate-400">
                            <div className="p-1 cursor-grab hover:text-slate-700" title="Drag to reorder carousel">
                              <GripVertical className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex flex-col space-y-0.5">
                              <button
                                onClick={() => handleMoveTestimonial(item.id, 'up')}
                                disabled={index === 0}
                                className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <span className="text-[9px] font-mono font-extrabold text-slate-400 text-center">
                                #{item.order}
                              </span>
                              <button
                                onClick={() => handleMoveTestimonial(item.id, 'down')}
                                disabled={index === testimonialItems.length - 1}
                                className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Cover Image Thumbnail */}
                          <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative">
                            <img 
                              src={item.coverImage} 
                              alt={item.eventTitle} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {item.isFeatured && (
                              <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 p-0.5 rounded-md" title="Featured">
                                <Star className="w-2.5 h-2.5 fill-slate-950" />
                              </span>
                            )}
                          </div>

                          {/* Title & Host Details */}
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-slate-900">{item.hostName}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs font-semibold text-slate-500">{item.eventTitle}</span>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {item.eventCategory}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 font-medium italic line-clamp-1 max-w-xl">
                              "{item.quote}"
                            </p>

                            <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
                              <span className="flex items-center text-amber-500">
                                {[...Array(item.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                              </span>
                              <span>{item.uploadedPhotos || 500}+ Photos</span>
                              <span>{item.guestCount || 150}+ Guests</span>
                              <span className="capitalize text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded">
                                {item.sourceType === 'featured_event' ? 'Auto Imported Event' : 'Manual Entry'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Actions Column */}
                        <div className="flex items-center space-x-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                          {/* Featured Toggle Button */}
                          <button
                            onClick={() => handleFeatureTestimonial(item.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                              item.isFeatured
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{item.isFeatured ? 'Featured' : 'Feature'}</span>
                          </button>

                          {/* Publish Toggle */}
                          <button
                            onClick={() => handleTogglePublishTestimonial(item.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              item.isPublished
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {item.isPublished ? 'Published' : 'Draft'}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setEditingTestimonial(item);
                              setCreationOption(item.sourceType || 'manual');
                              setSelectedEventForImport(item.eventId || '');
                              setIsTestimonialModalOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                            title="Edit Testimonial"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteTestimonial(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Testimonial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* CREATE / EDIT TESTIMONIAL STORY BUILDER MODAL */}
          {isTestimonialModalOpen && editingTestimonial && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-left my-6">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-slate-900 text-amber-400 rounded-2xl shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 font-sans flex items-center space-x-2">
                        <span>{editingTestimonial.id ? 'Story Builder — Edit Testimonial' : 'Story Builder — Create New Story'}</span>
                        {editingTestimonial.isFeatured && (
                          <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-slate-950" />
                            <span>Featured</span>
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400">Configure rich media, photos, videos, voice notes, and live story preview for the landing page showcase.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTestimonialModalOpen(false);
                      setEditingTestimonial(null);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Source Mode Option Selector */}
                <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreationOption('featured_event');
                      if (initialEvents.length > 0) {
                        handleSelectEventForImport(initialEvents[0].id);
                      }
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      creationOption === 'featured_event'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Option 1 — Import from Featured Event</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCreationOption('manual');
                      setEditingTestimonial(prev => ({
                        ...prev,
                        sourceType: 'manual'
                      }));
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      creationOption === 'manual'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Edit2 className="w-4 h-4 text-sky-400" />
                    <span>Option 2 — Manual Story Upload</span>
                  </button>
                </div>

                {/* FORM CONTENT */}
                <form onSubmit={handleSaveEditingTestimonial} className="space-y-6">

                  {/* SECTION 1: BASIC INFORMATION & SOURCE */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setStoryOpenSections(s => ({ ...s, basic: !s.basic }))}
                      className="w-full px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-sky-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                          1. Source & Basic Information
                        </span>
                      </div>
                      {storyOpenSections.basic ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {storyOpenSections.basic && (
                      <div className="p-5 space-y-4">
                        {/* Option 1 Event Import Selector */}
                        {creationOption === 'featured_event' && (
                          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-sky-900 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Select Database Event to Import</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => selectedEventForImport && handleSelectEventForImport(selectedEventForImport)}
                                className="text-[10px] font-mono font-bold text-sky-700 bg-white border border-sky-200 hover:bg-sky-100 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3 text-sky-600" />
                                <span>Re-sync Event Data</span>
                              </button>
                            </div>

                            <select
                              value={selectedEventForImport}
                              onChange={(e) => handleSelectEventForImport(e.target.value)}
                              className="w-full bg-white border border-sky-300 focus:border-sky-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 shadow-xs"
                            >
                              {initialEvents.map(ev => (
                                <option key={ev.id} value={ev.id}>
                                  {ev.name} ({ev.type || 'Event'})
                                </option>
                              ))}
                            </select>

                            <p className="text-[11px] text-sky-800 leading-relaxed font-medium flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Imported cover, photos ({editingTestimonial.galleryImages?.length || 0}), videos ({editingTestimonial.videos?.length || 0}), voice notes ({editingTestimonial.voiceMessages?.length || 0}), and guest stats ({editingTestimonial.guestCount} guests).</span>
                            </p>
                          </div>
                        )}

                        {/* Text Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Host Name</label>
                            <input
                              type="text"
                              value={editingTestimonial.hostName || ''}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, hostName: e.target.value })}
                              placeholder="e.g. Sofia & Leo"
                              required
                              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Event Title</label>
                            <input
                              type="text"
                              value={editingTestimonial.eventTitle || ''}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, eventTitle: e.target.value })}
                              placeholder="e.g. Sofia & Leo Big Sur Wedding"
                              required
                              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Event Category & Location</label>
                            <input
                              type="text"
                              value={editingTestimonial.eventCategory || ''}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, eventCategory: e.target.value })}
                              placeholder="e.g. Wedding • Big Sur, CA"
                              required
                              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Rating (Stars)</label>
                            <select
                              value={editingTestimonial.rating || 5}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                            >
                              <option value={5}>5 Stars (★★★★★)</option>
                              <option value={4}>4 Stars (★★★★)</option>
                              <option value={3}>3 Stars (★★★)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Guest Count</label>
                            <input
                              type="number"
                              value={editingTestimonial.guestCount || 100}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, guestCount: Number(e.target.value) })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Uploaded Photos Count</label>
                            <input
                              type="number"
                              value={editingTestimonial.uploadedPhotos || 300}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, uploadedPhotos: Number(e.target.value) })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                            />
                          </div>
                        </div>

                        {/* Headline Title & Quote */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Testimonial Headline Title</label>
                          <input
                            type="text"
                            value={editingTestimonial.testimonialTitle || ''}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, testimonialTitle: e.target.value })}
                            placeholder="e.g. Captured 850+ unscripted memories in 100% original RAW quality"
                            required
                            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Testimonial Quote / Host Review</label>
                          <textarea
                            value={editingTestimonial.quote || ''}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                            rows={3}
                            placeholder="Write the full host quote..."
                            required
                            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 leading-relaxed"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 2: COVER IMAGE & CROP REPOSITIONING */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setStoryOpenSections(s => ({ ...s, cover: !s.cover }))}
                      className="w-full px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                          2. Cover Image & Crop Repositioning
                        </span>
                      </div>
                      {storyOpenSections.cover ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {storyOpenSections.cover && (
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          {/* Cover Image Input Controls */}
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                              <span>Cover Image Source URL</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const randomPreset = COVER_PRESETS[Math.floor(Math.random() * COVER_PRESETS.length)];
                                  setEditingTestimonial({ ...editingTestimonial, coverImage: randomPreset });
                                }}
                                className="text-[10px] font-mono text-sky-600 hover:underline flex items-center space-x-1"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Pick Preset Cover</span>
                              </button>
                            </label>

                            <input
                              type="text"
                              value={editingTestimonial.coverImage || ''}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, coverImage: e.target.value })}
                              placeholder="https://..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                            />

                            {/* Preset Buttons */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-slate-400">Quick Select Presets:</span>
                              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                                {COVER_PRESETS.map((preset, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => setEditingTestimonial({ ...editingTestimonial, coverImage: preset })}
                                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                                      editingTestimonial.coverImage === preset ? 'border-emerald-500 scale-105 shadow-xs' : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                  >
                                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Crop / Reposition Slider */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                                  <Crop className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Vertical Focal Point / Crop Position</span>
                                </label>
                                <span className="text-xs font-mono font-bold text-emerald-600">
                                  {editingTestimonial.coverPosition !== undefined ? editingTestimonial.coverPosition : 50}%
                                </span>
                              </div>

                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={editingTestimonial.coverPosition !== undefined ? editingTestimonial.coverPosition : 50}
                                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, coverPosition: Number(e.target.value) })}
                                className="w-full accent-emerald-600 cursor-pointer"
                              />
                              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                                <span>Top (0%)</span>
                                <span>Center (50%)</span>
                                <span>Bottom (100%)</span>
                              </div>
                            </div>
                          </div>

                          {/* Live Repositioning Crop Preview Mask */}
                          <div className="space-y-2">
                            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                              Live Crop Focal Preview
                            </span>
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner group">
                              <img
                                src={editingTestimonial.coverImage || COVER_PRESETS[0]}
                                alt="Cover preview"
                                className="w-full h-full object-cover transition-all duration-200"
                                style={{ objectPosition: `center ${editingTestimonial.coverPosition !== undefined ? editingTestimonial.coverPosition : 50}%` }}
                                referrerPolicy="no-referrer"
                              />
                              {/* Overlay positioning grid guide */}
                              <div className="absolute inset-0 border-2 border-dashed border-white/30 pointer-events-none rounded-2xl flex items-center justify-center">
                                <div className="bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-white flex items-center space-x-1">
                                  <MoveVertical className="w-3 h-3 text-emerald-400" />
                                  <span>Vertical Offset: {editingTestimonial.coverPosition !== undefined ? editingTestimonial.coverPosition : 50}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: PHOTO GALLERY MANAGER */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setStoryOpenSections(s => ({ ...s, gallery: !s.gallery }))}
                      className="w-full px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                          3. Photo Gallery Manager ({editingTestimonial.galleryImages?.length || 0}/10 Photos)
                        </span>
                      </div>
                      {storyOpenSections.gallery ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {storyOpenSections.gallery && (
                      <div className="p-5 space-y-4">
                        {/* Drag and Drop Zone simulation */}
                        <div className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Drag & Drop new photos or click to upload</p>
                            <p className="text-[10px] text-slate-400 font-mono">Supports PNG, JPG, WEBP up to 10MB each (max 10 photos)</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSimulatedUploadProgress(0);
                              const interval = setInterval(() => {
                                setSimulatedUploadProgress(p => {
                                  if (p === null || p >= 100) {
                                    clearInterval(interval);
                                    // Add sample new photo
                                    const newPhoto = COVER_PRESETS[Math.floor(Math.random() * COVER_PRESETS.length)];
                                    setEditingTestimonial(prev => {
                                      const currentList = prev?.galleryImages || [];
                                      if (currentList.length >= 10) return prev;
                                      return { ...prev, galleryImages: [...currentList, newPhoto] };
                                    });
                                    setTimeout(() => setSimulatedUploadProgress(null), 500);
                                    return 100;
                                  }
                                  return p + 25;
                                });
                              }, 150);
                            }}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer inline-flex items-center space-x-2"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Simulate Upload Photo</span>
                          </button>

                          {simulatedUploadProgress !== null && (
                            <div className="max-w-xs mx-auto space-y-1 pt-2">
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-amber-500 h-full transition-all duration-200" style={{ width: `${simulatedUploadProgress}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">Uploading media... {simulatedUploadProgress}%</span>
                            </div>
                          )}
                        </div>

                        {/* Gallery Thumbnails Manager */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            Gallery Images & Captions (Reorder / Caption / Set Featured)
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {(editingTestimonial.galleryImages || []).map((imgUrl, idx) => {
                              const captions = editingTestimonial.galleryCaptions || {};
                              const currentCaption = captions[idx] || '';
                              const isFeaturedPhoto = (editingTestimonial.featuredGalleryIndex || 0) === idx;

                              return (
                                <div key={idx} className={`p-3 rounded-2xl border bg-white space-y-2 relative transition-all ${isFeaturedPhoto ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-xs' : 'border-slate-200'}`}>
                                  {/* Thumbnail & Badges */}
                                  <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100 group">
                                    <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    
                                    <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                                      #{idx + 1}
                                    </span>

                                    {isFeaturedPhoto && (
                                      <span className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                                        <Star className="w-3 h-3 fill-slate-950" />
                                        <span>Featured</span>
                                      </span>
                                    )}
                                  </div>

                                  {/* Caption Field */}
                                  <input
                                    type="text"
                                    value={currentCaption}
                                    onChange={(e) => {
                                      const updatedCaptions = { ...captions, [idx]: e.target.value };
                                      setEditingTestimonial({ ...editingTestimonial, galleryCaptions: updatedCaptions });
                                    }}
                                    placeholder="Add photo caption..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800"
                                  />

                                  {/* Card Controls */}
                                  <div className="flex items-center justify-between pt-1 text-slate-500">
                                    <div className="flex items-center space-x-1">
                                      {/* Move Left */}
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => {
                                          const gallery = [...(editingTestimonial.galleryImages || [])];
                                          const temp = gallery[idx];
                                          gallery[idx] = gallery[idx - 1];
                                          gallery[idx - 1] = temp;
                                          setEditingTestimonial({ ...editingTestimonial, galleryImages: gallery });
                                        }}
                                        className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                                        title="Move Left"
                                      >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Move Right */}
                                      <button
                                        type="button"
                                        disabled={idx === (editingTestimonial.galleryImages?.length || 1) - 1}
                                        onClick={() => {
                                          const gallery = [...(editingTestimonial.galleryImages || [])];
                                          const temp = gallery[idx];
                                          gallery[idx] = gallery[idx + 1];
                                          gallery[idx + 1] = temp;
                                          setEditingTestimonial({ ...editingTestimonial, galleryImages: gallery });
                                        }}
                                        className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                                        title="Move Right"
                                      >
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Set Featured Photo */}
                                      <button
                                        type="button"
                                        onClick={() => setEditingTestimonial({ ...editingTestimonial, featuredGalleryIndex: idx })}
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${isFeaturedPhoto ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                      >
                                        Set Main
                                      </button>
                                    </div>

                                    {/* Delete Photo */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const gallery = (editingTestimonial.galleryImages || []).filter((_, i) => i !== idx);
                                        setEditingTestimonial({ ...editingTestimonial, galleryImages: gallery });
                                      }}
                                      className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                                      title="Delete Photo"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: VIDEOS, VOICE MESSAGES & WISHES */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setStoryOpenSections(s => ({ ...s, videosVoice: !s.videosVoice }))}
                      className="w-full px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-slate-800" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                          4. Videos, Voice Messages & Digital Wishes
                        </span>
                      </div>
                      {storyOpenSections.videosVoice ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {storyOpenSections.videosVoice && (
                      <div className="p-5 space-y-6">
                        
                        {/* Video Stories Sub-Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-800 font-mono flex items-center space-x-1.5">
                              <Video className="w-3.5 h-3.5 text-slate-800" />
                              <span>Video Testimonials ({editingTestimonial.videos?.length || 0})</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newVid = {
                                  id: `vid-${Date.now()}`,
                                  url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-guests-toast-to-the-couple-41584-large.mp4',
                                  title: 'Guest Toast Video',
                                  duration: '0:45',
                                  thumbnail: COVER_PRESETS[1],
                                  caption: 'Candid video captured live',
                                  isFeatured: false
                                };
                                setEditingTestimonial(prev => ({
                                  ...prev,
                                  videos: [...(prev?.videos || []), newVid]
                                }));
                              }}
                              className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Video Story</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(editingTestimonial.videos || []).map((vid, vIdx) => (
                              <div key={vid.id || vIdx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                <div className="flex items-center space-x-3">
                                  <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden relative shrink-0">
                                    <img src={vid.thumbnail || COVER_PRESETS[1]} alt={vid.title} className="w-full h-full object-cover opacity-80" />
                                    <Play className="w-4 h-4 text-white absolute inset-0 m-auto fill-white" />
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      value={vid.title}
                                      onChange={(e) => {
                                        const vids = [...(editingTestimonial.videos || [])];
                                        vids[vIdx].title = e.target.value;
                                        setEditingTestimonial({ ...editingTestimonial, videos: vids });
                                      }}
                                      className="text-xs font-bold text-slate-900 bg-transparent border-b border-slate-200 focus:border-slate-400 w-full"
                                    />
                                    <span className="text-[10px] font-mono text-slate-400">Duration: {vid.duration}</span>
                                  </div>
                                </div>

                                <div>
                                  <input
                                    type="text"
                                    value={vid.caption || ''}
                                    onChange={(e) => {
                                      const vids = [...(editingTestimonial.videos || [])];
                                      vids[vIdx].caption = e.target.value;
                                      setEditingTestimonial({ ...editingTestimonial, videos: vids });
                                    }}
                                    placeholder="Video caption..."
                                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                                  />
                                </div>

                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const vids = (editingTestimonial.videos || []).filter((_, idx) => idx !== vIdx);
                                      setEditingTestimonial({ ...editingTestimonial, videos: vids });
                                    }}
                                    className="p-1.5 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                                    title="Delete Video"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Voice Messages Sub-Section */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-800 font-mono flex items-center space-x-1.5">
                              <Mic className="w-3.5 h-3.5 text-rose-500" />
                              <span>Voice Messages ({editingTestimonial.voiceMessages?.length || 0})</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newVc = {
                                  id: `vc-${Date.now()}`,
                                  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                                  sender: 'Guest Family',
                                  duration: '0:45',
                                  transcript: 'So happy to celebrate with you tonight!',
                                  waveform: [20, 40, 60, 30, 70, 50, 80, 40, 20, 60, 30]
                                };
                                setEditingTestimonial(prev => ({
                                  ...prev,
                                  voiceMessages: [...(prev?.voiceMessages || []), newVc]
                                }));
                              }}
                              className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Voice Note</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(editingTestimonial.voiceMessages || []).map((vc, vcIdx) => (
                              <div key={vc.id || vcIdx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setStoryPlayingVoice(!storyPlayingVoice)}
                                      className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center cursor-pointer shadow-xs"
                                    >
                                      {storyPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                    </button>
                                    <input
                                      type="text"
                                      value={vc.sender}
                                      onChange={(e) => {
                                        const vcs = [...(editingTestimonial.voiceMessages || [])];
                                        vcs[vcIdx].sender = e.target.value;
                                        setEditingTestimonial({ ...editingTestimonial, voiceMessages: vcs });
                                      }}
                                      className="text-xs font-bold text-slate-900 bg-transparent border-b border-slate-200 focus:border-slate-400"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-mono text-slate-400">{vc.duration}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const vcs = (editingTestimonial.voiceMessages || []).filter((_, idx) => idx !== vcIdx);
                                        setEditingTestimonial({ ...editingTestimonial, voiceMessages: vcs });
                                      }}
                                      className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <input
                                  type="text"
                                  value={vc.transcript || ''}
                                  onChange={(e) => {
                                    const vcs = [...(editingTestimonial.voiceMessages || [])];
                                    vcs[vcIdx].transcript = e.target.value;
                                    setEditingTestimonial({ ...editingTestimonial, voiceMessages: vcs });
                                  }}
                                  placeholder="Voice note transcript..."
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* SECTION 5: MEDIA PRIORITY & PUBLISH SETTINGS */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setStoryOpenSections(s => ({ ...s, priorityPublish: !s.priorityPublish }))}
                      className="w-full px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                          5. Media Priority & Publish Settings
                        </span>
                      </div>
                      {storyOpenSections.priorityPublish ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {storyOpenSections.priorityPublish && (
                      <div className="p-5 space-y-4">
                        
                        {/* Primary Media Display Tab Priority */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700">
                            Primary Media Tab Priority (Default view on Landing Page)
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                              { id: 'photos', label: 'Photos', icon: Camera },
                              { id: 'videos', label: 'Videos', icon: Video },
                              { id: 'voice', label: 'Voice', icon: Mic },
                              { id: 'wishes', label: 'Wishes', icon: MessageSquare },
                              { id: 'live', label: 'Live Screen', icon: Tv }
                            ].map((tabItem) => {
                              const TabIcon = tabItem.icon;
                              const isSelected = (editingTestimonial.mediaPriority || 'photos') === tabItem.id;
                              return (
                                <button
                                  key={tabItem.id}
                                  type="button"
                                  onClick={() => {
                                    setEditingTestimonial({ ...editingTestimonial, mediaPriority: tabItem.id as any });
                                    setStoryBuilderActiveTab(tabItem.id as any);
                                  }}
                                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-slate-900 text-white border-transparent shadow-xs'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <TabIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                                  <span>{tabItem.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Status & Schedule Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                          {/* Publish Status */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Publishing Status</label>
                            <select
                              value={editingTestimonial.status || 'published'}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, status: e.target.value as any, isPublished: e.target.value === 'published' })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                            >
                              <option value="published">Published (Live immediately)</option>
                              <option value="draft">Draft (Hidden in CMS)</option>
                              <option value="scheduled">Scheduled (Future release)</option>
                            </select>
                          </div>

                          {/* Schedule Date Time */}
                          {editingTestimonial.status === 'scheduled' && (
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700">Scheduled Date & Time</label>
                              <input
                                type="datetime-local"
                                value={editingTestimonial.scheduledAt || ''}
                                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, scheduledAt: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                              />
                            </div>
                          )}

                          {/* Featured Capsule Checkbox */}
                          <div className="flex items-center space-x-2 pt-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingTestimonial.isFeatured || false}
                                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, isFeatured: e.target.checked })}
                                className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                              />
                              <span className="text-xs font-bold text-slate-800">Set as Featured Capsule on Landing Page</span>
                            </label>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* SECTION 6: LANDING PAGE STORY LIVE PREVIEW */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 text-white shadow-xl space-y-4 p-6">
                    <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
                          Landing Page Interactive Story Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                        Live Synchronized Mode
                      </span>
                    </div>

                    {/* Preview Interactive Showcase Card */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800/40 p-6 space-y-6">
                      
                      {/* Interactive Media Tabs inside Preview */}
                      <div className="flex items-center space-x-2 border-b border-slate-800/40 pb-3 overflow-x-auto">
                        {[
                          { id: 'photos', label: 'Photos', icon: Camera, count: editingTestimonial.galleryImages?.length || 0 },
                          { id: 'videos', label: 'Videos', icon: Video, count: editingTestimonial.videos?.length || 0 },
                          { id: 'voice', label: 'Voice Notes', icon: Mic, count: editingTestimonial.voiceMessages?.length || 0 },
                          { id: 'wishes', label: 'Wishes', icon: MessageSquare, count: editingTestimonial.wishes?.length || 0 },
                          { id: 'live', label: 'Live Screen', icon: Tv, count: 1 }
                        ].map((pTab) => {
                          const PTabIcon = pTab.icon;
                          const isPTabActive = storyBuilderActiveTab === pTab.id;
                          return (
                            <button
                              key={pTab.id}
                              type="button"
                              onClick={() => setStoryBuilderActiveTab(pTab.id as any)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                                isPTabActive
                                  ? 'bg-white text-slate-950 border-white shadow-xs'
                                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                            >
                              <PTabIcon className={`w-3.5 h-3.5 ${isPTabActive ? 'text-amber-500' : 'text-slate-400'}`} />
                              <span>{pTab.label}</span>
                              <span className="text-[10px] opacity-60 font-mono">({pTab.count})</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Dynamic Tab Stage Preview */}
                      <div className="relative rounded-2xl overflow-hidden border border-slate-800/40 bg-slate-900 min-h-[260px] flex items-center justify-center p-4">
                        {storyBuilderActiveTab === 'photos' && (
                          <div className="w-full space-y-3">
                            <div className="relative h-56 rounded-xl overflow-hidden">
                              <img
                                src={(editingTestimonial.galleryImages && editingTestimonial.galleryImages[editingTestimonial.featuredGalleryIndex || 0]) || editingTestimonial.coverImage || COVER_PRESETS[0]}
                                alt="Gallery Preview"
                                className="w-full h-full object-cover"
                                style={{ objectPosition: `center ${editingTestimonial.coverPosition !== undefined ? editingTestimonial.coverPosition : 50}%` }}
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                              <p className="absolute bottom-3 left-3 right-3 text-xs text-slate-200 font-medium italic">
                                "{editingTestimonial.galleryCaptions?.[editingTestimonial.featuredGalleryIndex || 0] || editingTestimonial.testimonialTitle || 'Candid moment captured'}"
                              </p>
                            </div>
                          </div>
                        )}

                        {storyBuilderActiveTab === 'videos' && (
                          <div className="w-full space-y-3 text-center">
                            <div className="relative h-56 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800/40">
                              <img
                                src={editingTestimonial.videos?.[0]?.thumbnail || editingTestimonial.coverImage || COVER_PRESETS[1]}
                                alt="Video preview"
                                className="w-full h-full object-cover opacity-60"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                                  <Play className="w-5 h-5 ml-0.5 fill-slate-950" />
                                </div>
                                <span className="text-xs font-bold text-white">{editingTestimonial.videos?.[0]?.title || 'Play Video Toast'}</span>
                                <span className="text-[10px] font-mono text-amber-400">{editingTestimonial.videos?.[0]?.duration || '0:45'} MP4</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {storyBuilderActiveTab === 'voice' && (
                          <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800/40 rounded-2xl space-y-4 text-left">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <button
                                  type="button"
                                  onClick={() => setStoryPlayingVoice(!storyPlayingVoice)}
                                  className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center cursor-pointer shadow-md"
                                >
                                  {storyPlayingVoice ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                </button>
                                <div>
                                  <p className="text-xs font-bold text-white">{editingTestimonial.voiceMessages?.[0]?.sender || 'Uncle David & Aunt Maya'}</p>
                                  <p className="text-[10px] font-mono text-slate-400">Audio Note • {editingTestimonial.voiceMessages?.[0]?.duration || '0:58'}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-amber-400 font-bold">24bit / 48kHz</span>
                            </div>

                            {/* Waveform graphic */}
                            <div className="flex items-center space-x-1 h-8">
                              {(editingTestimonial.voiceMessages?.[0]?.waveform || [20, 40, 60, 30, 80, 50, 90, 40, 30, 70, 50, 20, 60, 80, 40, 30]).map((h, i) => (
                                <div
                                  key={i}
                                  className={`flex-1 rounded-full transition-all duration-300 ${storyPlayingVoice ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`}
                                  style={{ height: `${h}%` }}
                                ></div>
                              ))}
                            </div>

                            <p className="text-xs text-slate-300 italic border-l-2 border-amber-400 pl-3">
                              "{editingTestimonial.voiceMessages?.[0]?.transcript || editingTestimonial.quote}"
                            </p>
                          </div>
                        )}

                        {storyBuilderActiveTab === 'wishes' && (
                          <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800/40 rounded-2xl space-y-3 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-400 font-mono">Digital Guestbook Wish</span>
                              <span className="text-[10px] font-mono text-slate-400">10:15 PM • Table 2</span>
                            </div>
                            <p className="text-sm text-slate-200 font-serif leading-relaxed">
                              "{editingTestimonial.wishes?.[0]?.text || editingTestimonial.quote}"
                            </p>
                            <div className="flex items-center justify-between border-t border-slate-800/40 pt-3 text-xs">
                              <span className="font-bold text-white">— {editingTestimonial.wishes?.[0]?.sender || 'The Miller Family'}</span>
                              <span className="flex items-center space-x-1 text-rose-400 text-[10px]">
                                <Heart className="w-3 h-3 fill-rose-400" />
                                <span>24 Likes</span>
                              </span>
                            </div>
                          </div>
                        )}

                        {storyBuilderActiveTab === 'live' && (
                          <div className="w-full text-center space-y-3 p-6 bg-slate-950 border border-slate-800/40 rounded-2xl">
                            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                              <span>Venue Projector Wall Live Stream</span>
                            </div>
                            <p className="text-xs text-slate-300">Guests uploaded live candid memories via QR Code directly onto the venue screens.</p>
                          </div>
                        )}
                      </div>

                      {/* Headline & Host Details Footer */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/40">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                            {editingTestimonial.eventCategory || 'Wedding • Location'}
                          </span>
                          <div className="flex text-amber-400">
                            {[...Array(editingTestimonial.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                        </div>

                        <h4 className="text-base font-bold font-sans text-white">
                          "{editingTestimonial.testimonialTitle || 'Story Headline'}"
                        </h4>

                        <p className="text-slate-300 text-xs italic font-light leading-relaxed border-l-2 border-amber-500 pl-3">
                          "{editingTestimonial.quote || 'Quote snippet...'}"
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/40 text-xs text-slate-400">
                          <div>
                            <span className="font-bold text-white">{editingTestimonial.hostName}</span>
                            <span className="mx-1.5">•</span>
                            <span>{editingTestimonial.eventTitle}</span>
                          </div>
                          <div className="font-mono text-[10px] text-amber-400 font-bold">
                            {editingTestimonial.uploadedPhotos || 500}+ Photos • {editingTestimonial.guestCount || 150}+ Guests
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTestimonialModalOpen(false);
                        setEditingTestimonial(null);
                      }}
                      className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Save Story Configurations</span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* GLOBAL STATS EDIT MODAL */}
          {isStatsModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Landing Page Global Metrics</h3>
                    <p className="text-xs text-slate-400">Configure public statistics shown under testimonials.</p>
                  </div>
                  <button onClick={() => setIsStatsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Guest Photos Uploaded</label>
                    <input
                      type="text"
                      value={testimonialMetrics.guestPhotosUploaded}
                      onChange={(e) => setTestimonialMetrics({ ...testimonialMetrics, guestPhotosUploaded: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Events Created</label>
                    <input
                      type="text"
                      value={testimonialMetrics.eventsCreated}
                      onChange={(e) => setTestimonialMetrics({ ...testimonialMetrics, eventsCreated: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Average Rating</label>
                    <input
                      type="text"
                      value={testimonialMetrics.averageRating}
                      onChange={(e) => setTestimonialMetrics({ ...testimonialMetrics, averageRating: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">QR Table Scans</label>
                    <input
                      type="text"
                      value={testimonialMetrics.qrScans}
                      onChange={(e) => setTestimonialMetrics({ ...testimonialMetrics, qrScans: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Memory Capsules Completed</label>
                    <input
                      type="text"
                      value={testimonialMetrics.memoryCapsulesCompleted}
                      onChange={(e) => setTestimonialMetrics({ ...testimonialMetrics, memoryCapsulesCompleted: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <label className="flex items-center space-x-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testimonialMetrics.autoCalculateFromAnalytics}
                      onChange={(e) => setTestimonialMetrics({ ...testimonialMetrics, autoCalculateFromAnalytics: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                    <span className="text-xs font-bold text-slate-800">Auto-Calculate metrics from live database events</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setIsStatsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSaveMetrics(testimonialMetrics);
                      setIsStatsModalOpen(false);
                      triggerToast("Metrics Saved", "Landing page stats updated successfully.");
                    }}
                    className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Save Metrics
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr_branding' && (
            <QrBrandingPanel
              events={initialEvents || []}
              onNotify={(msg, type) => triggerToast('QR Branding System', msg, type)}
            />
          )}

          {activeTab === 'landing_banner' && (
            <LandingBannerManagerPanel onTriggerToast={(t, m, type) => triggerToast(t, m, type)} />
          )}

          {activeTab === 'footer_manager' && (
            <FooterManagerPanel onTriggerToast={(t, m, type) => triggerToast(t, m, type)} />
          )}

          {activeTab === 'faqs' && (
            <FaqManagementPanel onTriggerToast={(t, m, type) => triggerToast(t, m, type)} />
          )}

          {activeTab === 'onboarding_guides' && (
            <div className="animate-fade-in">
              <OnboardingManagerPanel
                onTestTourPreview={(g) => {
                  setPreviewTourGuide(g);
                  setIsPreviewTourOpen(true);
                }}
                triggerToast={(t, m, type) => triggerToast(t, m, type)}
              />
            </div>
          )}

          {activeTab === 'tooltips_manager' && (
            <div className="animate-fade-in">
              <TooltipManagerPanel
                triggerToast={(t, m, type) => triggerToast(t, m, type)}
              />
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-6 animate-fade-in">
              <SubscriptionManagement triggerToast={triggerToast} />
            </div>
          )}

          {/* TAB CONTENT 6: SUPPORT & CUSTOMER SUPPORT CENTER */}
          {activeTab === 'support' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-navigation Tabs */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-xs flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setSupportSubTab('queue')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                      supportSubTab === 'queue'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Support Ticket Help Desk</span>
                    {openTicketsCount > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] font-mono font-black px-1.5 py-0.5 rounded-full">
                        {openTicketsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setSupportSubTab('channels')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                      supportSubTab === 'channels'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Public Support Channels & Settings</span>
                  </button>
                </div>

                <div className="px-3 py-1 text-[11px] font-mono text-slate-400 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>KAVA Support Ops Live</span>
                </div>
              </div>

              {/* Sub tab views */}
              {supportSubTab === 'queue' ? (
                <SupportQueueCenter
                  tickets={tickets}
                  onUpdateTickets={saveTickets}
                  onTriggerToast={triggerToast}
                  currentAgentName="Artha Wibawa"
                />
              ) : (
                <SupportSettingsManager onTriggerToast={triggerToast} />
              )}

            </div>
          )}

          {/* TAB CONTENT 7: TRUST & SAFETY */}
          {activeTab === 'trust_safety' && (
            <div className="space-y-6 animate-fade-in">
              {/* Trust & Safety Cards summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Total Escalations</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-2xl font-black text-slate-900">{safetyEscalations.length}</span>
                    <span className="text-[10px] font-mono text-rose-500 font-bold">Active Pipeline</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Pending Review</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-2xl font-black text-amber-600">
                      {safetyEscalations.filter(e => e.status === 'Pending Review').length}
                    </span>
                    <span className="text-[10px] font-mono text-amber-500 font-bold">Awaiting Action</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">DMCA & ToS Disputes</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-2xl font-black text-slate-900">
                      {safetyEscalations.filter(e => ['dmca', 'tos_violation'].includes(e.type)).length}
                    </span>
                    <span className="text-[10px] font-mono text-blue-500 font-bold">Legal / Copyright</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Resolved Cases</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-2xl font-black text-emerald-600">
                      {safetyEscalations.filter(e => e.status.startsWith('Resolved')).length}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold">100% SLA Compliance</span>
                  </div>
                </div>
              </div>

              {/* Main Escalation Queue */}
              <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Trust & Safety Escalation Queue</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Globally reported content, DMCA legal takedowns, spam outbreaks, and terms of service violations.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-black font-mono tracking-wider text-slate-400 uppercase">
                        <th className="py-4 px-6">ID & Type</th>
                        <th className="py-4 px-4">Severity</th>
                        <th className="py-4 px-4">Escalation Source</th>
                        <th className="py-4 px-4">Offense Description</th>
                        <th className="py-4 px-4">Timestamp</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                      {safetyEscalations.map(esc => {
                        const getSeverityClass = (sev: string) => {
                          switch (sev) {
                            case 'critical': return 'bg-rose-50 border border-rose-100 text-rose-700';
                            case 'high': return 'bg-orange-50 border border-orange-100 text-orange-700';
                            case 'medium': return 'bg-amber-50 border border-amber-100 text-amber-700';
                            default: return 'bg-slate-50 border border-slate-100 text-slate-700';
                          }
                        };

                        const getTypeLabel = (type: string) => {
                          switch (type) {
                            case 'dmca': return 'DMCA Takedown';
                            case 'tos_violation': return 'ToS Violation';
                            case 'spam': return 'Spam Filter';
                            case 'abuse': return 'Abuse / Harassment';
                            default: return 'User Reported';
                          }
                        };

                        const getTypeBadgeColor = (type: string) => {
                          switch (type) {
                            case 'dmca': return 'bg-slate-100 border-slate-200 text-slate-800';
                            case 'tos_violation': return 'bg-slate-900 border-slate-800 text-white';
                            case 'spam': return 'bg-blue-50 border-blue-100 text-blue-700';
                            case 'abuse': return 'bg-red-50 border-red-100 text-red-700';
                            default: return 'bg-slate-50 border-slate-100 text-slate-700';
                          }
                        };

                        return (
                          <tr key={esc.id} className="hover:bg-slate-50/30 font-semibold transition-colors">
                            <td className="py-4 px-6 space-y-1">
                              <span className="text-[10px] font-mono font-bold block text-slate-900">{esc.id}</span>
                              <span className={`inline-block text-[8px] font-mono font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${getTypeBadgeColor(esc.type)}`}>
                                {getTypeLabel(esc.type)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`text-[8px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${getSeverityClass(esc.severity)}`}>
                                {esc.severity}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-900 font-bold leading-tight">
                              {esc.source}
                            </td>
                            <td className="py-4 px-4 text-slate-500 font-medium max-w-xs leading-relaxed">
                              {esc.description}
                            </td>
                            <td className="py-4 px-4 text-slate-400 font-mono text-[10px]">
                              {new Date(esc.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                esc.status === 'Pending Review' 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : esc.status.includes('Blocked')
                                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              }`}>
                                {esc.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              {esc.status === 'Pending Review' ? (
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    onClick={() => handleResolveEscalation(esc.id, 'dismiss')}
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-black rounded-lg cursor-pointer transition-all"
                                    title="Dismiss/Approve"
                                  >
                                    Dismiss
                                  </button>
                                  <button
                                    onClick={() => handleResolveEscalation(esc.id, 'warning')}
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-black rounded-lg cursor-pointer transition-all"
                                    title="Issue Warning"
                                  >
                                    Warn
                                  </button>
                                  <button
                                    onClick={() => handleResolveEscalation(esc.id, 'block')}
                                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-black rounded-lg cursor-pointer transition-all"
                                    title="Block/Delete Takedown"
                                  >
                                    Block
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-400">Resolution Logged</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 8: FEATURE FLAGS & REAL-TIME CONTROLS */}
          {activeTab === 'flags' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* TOP SUMMARY KPI METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Feature Flags</span>
                    <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{featureFlags.length}</span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Rollouts</span>
                    <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                      {featureFlags.filter(f => f.enabled).length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Targeted Test Mode</span>
                    <span className="text-2xl font-black text-amber-600 mt-1 font-mono">
                      {featureFlags.filter(f => f.testMode?.enabled).length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Prerequisites Pending</span>
                    <span className="text-2xl font-black text-rose-600 mt-1 font-mono">
                      {featureFlags.filter(f => f.dependencies.some(d => {
                        const parent = featureFlags.find(p => p.key === d.key);
                        return !parent || !parent.enabled;
                      })).length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* SEARCH, CATEGORIES & BULK ACTION STRIP */}
              <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={flagSearch}
                      onChange={(e) => setFlagSearch(e.target.value)}
                      placeholder="Search feature flags by name, key, or description..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all"
                    />
                    {flagSearch && (
                      <button
                        onClick={() => setFlagSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status Filter & Global Actions */}
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <select
                      value={flagStatusFilter}
                      onChange={(e) => setFlagStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Enabled">Enabled Only</option>
                      <option value="Disabled">Disabled Only</option>
                      <option value="Gradual Rollout">Gradual Rollouts</option>
                      <option value="Beta">Beta Testing</option>
                    </select>

                    <button
                      onClick={handleEnableAllStableFlags}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Enable All 100%</span>
                    </button>

                    <button
                      onClick={handleResetDefaultFlags}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>

                </div>

                {/* Category Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-2 flex-shrink-0">Category:</span>
                  {['ALL', 'Core Media', 'AI & Processing', 'Live Projection', 'Collaboration & Access', 'Support & Commerce'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFlagCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                        flagCategoryFilter === cat
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* FEATURE FLAGS LIST */}
              <div className="space-y-4">
                {featureFlags
                  .filter(flag => {
                    if (flagCategoryFilter !== 'ALL' && flag.category !== flagCategoryFilter) return false;
                    if (flagStatusFilter !== 'ALL' && flag.status !== flagStatusFilter) return false;
                    if (flagSearch) {
                      const q = flagSearch.toLowerCase();
                      return (
                        flag.name.toLowerCase().includes(q) ||
                        flag.key.toLowerCase().includes(q) ||
                        flag.desc.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map(flag => {
                    // Check unmet dependencies
                    const unmetDeps = flag.dependencies.filter(dep => {
                      const parent = featureFlags.find(p => p.key === dep.key);
                      return !parent || !parent.enabled;
                    });

                    return (
                      <div
                        key={flag.key}
                        className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                          
                          {/* Flag Identity & Info */}
                          <div className="space-y-1.5 max-w-2xl">
                            <div className="flex items-center space-x-2.5 flex-wrap gap-1">
                              <h4 className="text-sm font-extrabold text-slate-950 font-sans">{flag.name}</h4>
                              <span className="text-[10px] text-slate-900 font-mono font-extrabold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                                key: {flag.key}
                              </span>
                              <span className="text-[10px] text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">
                                {flag.category}
                              </span>
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                flag.enabled
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {flag.status || (flag.enabled ? 'Enabled' : 'Disabled')}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {flag.desc}
                            </p>

                            {/* Affected Modules Badges */}
                            <div className="flex items-center space-x-1.5 flex-wrap gap-1 pt-1">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Affected Modules:</span>
                              {flag.affectedModules?.map(m => (
                                <span key={m} className="text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Controls & Live Preview Button */}
                          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            
                            {/* Rollout percentage slider */}
                            <div className="flex items-center space-x-2 text-xs font-semibold">
                              <span className="text-slate-500 font-bold">Rollout:</span>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={flag.rollout}
                                onChange={(e) => handleRolloutChange(flag.key, parseInt(e.target.value))}
                                disabled={!flag.enabled}
                                className="w-24 accent-slate-900 disabled:opacity-30 cursor-pointer"
                              />
                              <span className="font-mono text-xs font-bold text-slate-900 w-9 text-right">{flag.rollout}%</span>
                            </div>

                            {/* Live Preview Button */}
                            <button
                              onClick={() => {
                                setSelectedFlagForPreview(flag);
                                setIsLivePreviewOpen(true);
                              }}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Live Preview</span>
                            </button>

                            {/* Power Toggle Switch */}
                            <button
                              onClick={() => handleToggleFlag(flag.key)}
                              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                                flag.enabled ? 'bg-slate-900' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                  flag.enabled ? 'translate-x-7' : 'translate-x-1'
                                }`}
                              />
                            </button>

                          </div>

                        </div>

                        {/* Unmet Dependency Alert */}
                        {unmetDeps.length > 0 && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 flex-wrap gap-2">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              <span>
                                <strong>Prerequisite Required:</strong> Feature requires{' '}
                                {unmetDeps.map(d => `"${d.name}"`).join(', ')}.
                              </span>
                            </div>
                            {unmetDeps.map(d => (
                              <button
                                key={d.key}
                                onClick={() => handleToggleFlag(d.key)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                              >
                                Enable {d.name} Now
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Where This Feature Is Used Snippet Bar */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-700">Where Used:</span>
                            <span>{flag.whereUsed?.map(w => w.component).join(', ')}</span>
                          </div>
                          
                          {flag.testMode?.enabled && (
                            <span className="text-[10px] font-bold font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                              Test Mode: {flag.testMode.allowedUsers?.length || 0} whitelisted accounts
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}
              </div>

            </div>
          )}


          {/* TAB CONTENT 9: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">System Audit Trail Manifest</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Immutable timeline records mapping administrative database operations.</p>
                  </div>
                  <button
                    onClick={() => triggerToast('Log Exported', 'CSV download trigger scheduled (simulated).', 'success')}
                    className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download Excel CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Security User</th>
                        <th className="px-6 py-4">Action Invoked</th>
                        <th className="px-6 py-4">Target Entity</th>
                        <th className="px-6 py-4">System IP</th>
                        <th className="px-6 py-4">Server Status</th>
                        <th className="px-6 py-4 text-right">Event Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{log.admin}</td>
                          <td className="px-6 py-4">{log.action}</td>
                          <td className="px-6 py-4 truncate max-w-[200px]">{log.target}</td>
                          <td className="px-6 py-4 font-mono text-slate-500">{log.ip}</td>
                          <td className="px-6 py-4">
                            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold">
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-slate-400">{log.time.replace('T', ' ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 10: ROLES & GRANULAR PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="text-sm font-extrabold text-slate-900">Administrator Roles Permission Mapping</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Fine-tune staff keysets to govern database records securely.</p>
                </div>

                <div className="space-y-6">
                  {Object.entries(rolesPermissions).map(([roleName, perms]) => (
                    <div key={roleName} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                      <h4 className="text-xs font-black text-slate-900 mb-3">{roleName}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {Object.entries(perms).map(([pName, val]) => (
                          <button
                            key={pName}
                            onClick={() => {
                              if (roleName === 'Super Admin') {
                                triggerToast('Operation Rejected', 'Cannot strip foundational clearance from Super Admins.', 'error');
                                return;
                              }
                              setRolesPermissions(prev => {
                                const copy = { ...prev };
                                (copy as any)[roleName][pName] = !val;
                                return copy;
                              });
                              triggerToast('Clearance Aligned', 'Role capabilities altered in cluster caches.', 'success');
                            }}
                            className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                              val ? 'bg-slate-900 border-slate-950 text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            <span className="capitalize">{pName.replace('_', ' ')}</span>
                            {val ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 11: DATABASE SNAPSHOTS (BACKUP/RESTORE) */}
          {activeTab === 'backup' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Cold Storage Automated Snapshots</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Perform atomic JSON manifest compilations to secure offline states.</p>
                  </div>
                  <button
                    disabled={isBackingUp || isRestoring}
                    onClick={triggerBackup}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Trigger Manual Backup</span>
                  </button>
                </div>

                {isRestoring && (
                  <div className="mt-6 bg-slate-900 text-white p-4 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                      <span>Synchronizing Live Schema Matrices...</span>
                      <span>{restoreProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${restoreProgress}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {backupLogs.map(snap => (
                    <div key={snap.id} className="border border-slate-100 hover:border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/20">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-950 font-mono">{snap.file}</h4>
                          <span className="text-[8px] font-mono font-bold uppercase bg-slate-100 text-slate-500 px-1 py-0.5 rounded tracking-wider">{snap.type}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Size: {snap.size} • Created by: {snap.creator} • {snap.timestamp}</p>
                      </div>

                      <button
                        disabled={isBackingUp || isRestoring}
                        onClick={() => triggerRestore(snap.file)}
                        className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer self-start sm:self-center"
                      >
                        Rollback System here
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 12: SYSTEM PROPERTIES */}
          {activeTab === 'system_config' && (
            <div className="space-y-6 animate-fade-in">
              <form onSubmit={handleSaveConfig} className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-extrabold text-slate-900">System Platform Configuration</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Govern maximum memory bandwidth, rate thresholds, and API keys.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Free Account Storage Threshold (MB)</label>
                    <input
                      type="number"
                      value={systemConfigs.storageFreeLimitMB}
                      onChange={(e) => setSystemConfigs({...systemConfigs, storageFreeLimitMB: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2.5 font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Premium Account Storage Threshold (MB)</label>
                    <input
                      type="number"
                      value={systemConfigs.storagePremiumLimitMB}
                      onChange={(e) => setSystemConfigs({...systemConfigs, storagePremiumLimitMB: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2.5 font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Maximum Guest File Upload Ceiling (MB)</label>
                    <input
                      type="number"
                      value={systemConfigs.maxUploadSizeMB}
                      onChange={(e) => setSystemConfigs({...systemConfigs, maxUploadSizeMB: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2.5 font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">SMTP Mail Transport Relay</label>
                    <input
                      type="text"
                      value={systemConfigs.mailServerHost}
                      onChange={(e) => setSystemConfigs({...systemConfigs, mailServerHost: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2.5 font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Live API Bandwidth rate (Reqs/Min)</label>
                    <input
                      type="number"
                      value={systemConfigs.apiRateLimit}
                      onChange={(e) => setSystemConfigs({...systemConfigs, apiRateLimit: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2.5 font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Google OAuth Application ID</label>
                    <input
                      type="text"
                      value={systemConfigs.googleClientKey}
                      onChange={(e) => setSystemConfigs({...systemConfigs, googleClientKey: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2.5 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Save Properties Manifest
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB CONTENT 13: EMAIL TEMPLATES */}
          {activeTab === 'emails' && (
            <EmailAutomationCenter triggerToast={triggerToast} />
          )}

          {/* TAB CONTENT 14: BROADCAST ANNOUNCEMENTS */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Communication Center Top Panel */}
              <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2.5 bg-slate-900 text-white rounded-2xl">
                      <Bell className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight">KAVA Platform Communication Center</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Coordinate high-fidelity targeting, automated scheduling, and multi-channel system broadcasts.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start md:self-auto">
                  <button
                    onClick={handleRecalculateSync}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                    title="Force dynamic recalculation against active database"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Recalculate & Sync</span>
                  </button>

                  <button
                    onClick={() => {
                      handleClearForm();
                      setBroadcastSubTab('editor');
                      triggerToast('Composer Opened', 'Ready to compile fresh system broadcast.', 'info');
                    }}
                    className="flex items-center space-x-1 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Compose Broadcast</span>
                  </button>
                </div>
              </div>

              {/* Communication Center Sub-navigation Tabs */}
              <div className="flex border-b border-slate-200 gap-1 text-xs font-bold">
                <button
                  onClick={() => {
                    if (hasUnsavedChanges && !confirm('Discard unsaved draft changes?')) return;
                    setBroadcastSubTab('overview');
                    setHasUnsavedChanges(false);
                  }}
                  className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer ${broadcastSubTab === 'overview' ? 'border-slate-700 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  Overview & Stats
                </button>
                <button
                  onClick={() => setBroadcastSubTab('editor')}
                  className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer ${broadcastSubTab === 'editor' ? 'border-slate-700 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {formBcId ? 'Edit Campaign' : 'Broadcast Composer'}
                  {hasUnsavedChanges && <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-amber-500" title="Unsaved changes detected" />}
                </button>
                <button
                  onClick={() => {
                    if (hasUnsavedChanges && !confirm('Discard unsaved draft changes?')) return;
                    setBroadcastSubTab('history');
                    setHasUnsavedChanges(false);
                  }}
                  className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer ${broadcastSubTab === 'history' ? 'border-slate-700 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  Campaigns History ({broadcasts.length})
                </button>
              </div>

              {/* OVERVIEW SUBTAB */}
              {broadcastSubTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Stats Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Total Campaigns</p>
                      <h4 className="text-2xl font-black text-slate-900 mt-2">{broadcasts.length}</h4>
                      <div className="flex gap-2 mt-2 text-[10px] text-slate-500 font-semibold">
                        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Active: {broadcasts.filter(b => b.status === 'Published').length}</span>
                        <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Drafts: {broadcasts.filter(b => b.status === 'Draft').length}</span>
                        <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Scheduled: {broadcasts.filter(b => b.status === 'Scheduled').length}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Total Delivery Reach</p>
                      <h4 className="text-2xl font-black text-slate-900 mt-2">
                        {broadcasts.filter(b => b.status === 'Published').reduce((sum, b) => sum + (b.analytics?.recipientsCount || 0), 0)}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-2">Unique targeted hosts/contributors receiving alerts.</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Delivered Success Rate</p>
                      <h4 className="text-2xl font-black text-slate-900 mt-2">100.0%</h4>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2.5">
                        <div className="bg-slate-900 h-full w-full" />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Average Engagement Rate</p>
                      <h4 className="text-2xl font-black text-slate-900 mt-2">
                        {Math.round(
                          broadcasts.filter(b => b.status === 'Published').reduce((sum, b) => sum + (b.analytics?.engagementRate || 0), 0) /
                          Math.max(1, broadcasts.filter(b => b.status === 'Published').length)
                        )}%
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-2">Based on clicked and viewed metrics across active vectors.</p>
                    </div>
                  </div>

                  {/* Visual Funnels / Active monitor */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Live active monitor */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono">Live Broadcast Monitor</h4>
                        <span className="text-[9px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider">Live</span>
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {broadcasts.filter(b => b.status === 'Published').length === 0 ? (
                          <div className="text-center py-10 text-slate-400 text-xs">No active live broadcasts. Create or publish a broadcast in Composer.</div>
                        ) : (
                          broadcasts.filter(b => b.status === 'Published').map(bc => (
                            <div key={bc.id} className="border border-slate-100 p-4 rounded-2xl bg-slate-50/20 hover:border-slate-200 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className={`w-2 h-2 rounded-full ${bc.priority === 'Critical' ? 'bg-red-500 animate-ping' : bc.priority === 'High' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`} />
                                    <h4 className="text-xs font-extrabold text-slate-900">{bc.title}</h4>
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{bc.content}</p>
                                  <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                      {bc.type.replace('_', ' ')}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-mono">
                                      Reach: {bc.analytics?.recipientsCount || 0} users • Views: {bc.analytics?.viewedCount || 0} • Clicks: {bc.analytics?.clickedCount || 0}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex space-x-1 shrink-0 ml-4">
                                  <button
                                    onClick={() => handleEditBroadcast(bc)}
                                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Campaign"
                                  >
                                    <Settings className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleArchiveBroadcast(bc.id)}
                                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                                    title="Archive alert"
                                  >
                                    <Archive className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Channels & targeting metrics bar */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 text-xs font-semibold">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono">Channel Distribution</h4>
                      </div>

                      <div className="space-y-4">
                        {[
                          { label: 'In-app Banner Alert', count: broadcasts.filter(b => b.status === 'Published' && b.channels?.includes('in_app_banner')).length, color: 'bg-slate-900' },
                          { label: 'Workspace Inbox', count: broadcasts.filter(b => b.status === 'Published' && b.channels?.includes('notification_center')).length, color: 'bg-emerald-600' },
                          { label: 'Dashboard Popup', count: broadcasts.filter(b => b.status === 'Published' && b.channels?.includes('dashboard_popup')).length, color: 'bg-slate-700' },
                          { label: 'Email Campaign', count: broadcasts.filter(b => b.status === 'Published' && b.channels?.includes('email')).length, color: 'bg-amber-600' }
                        ].map((ch, idx) => {
                          const maxCount = Math.max(1, broadcasts.filter(b => b.status === 'Published').length);
                          const pct = Math.round((ch.count / maxCount) * 100);
                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-600 font-bold">{ch.label}</span>
                                <span className="text-slate-900 font-mono font-bold">{ch.count} active ({pct}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className={`${ch.color} h-full`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 mt-2">
                        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Targeting Status</h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          All broadcasts conform strictly to database targeting directives. Real-time background sync is operational.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* COMPOSER / EDITOR SUBTAB */}
              {broadcastSubTab === 'editor' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                  
                  {/* Broadcast Inputs Form Panel (3/5) */}
                  <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm lg:col-span-3 space-y-6 text-xs font-semibold">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-sm font-black text-slate-950">
                          {formBcId ? `Modifying Campaign #${formBcId}` : 'Compose New Platform Broadcast'}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">Configure deep target rules, priority channels, and multilingual copy.</p>
                      </div>
                      {formBcId && (
                        <button
                          onClick={handleClearForm}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                        >
                          Clear & Create New
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      
                      {/* Campaign Title & Body */}
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-slate-700 mb-1">Campaign Administrative Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Server Migration Alert"
                            value={formTitle}
                            onChange={(e) => {
                              setFormTitle(e.target.value);
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-slate-200 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">Main Message / Content Description</label>
                          <textarea
                            rows={3}
                            placeholder="e.g. We will conduct server improvements on July 24..."
                            value={formContent}
                            onChange={(e) => {
                              setFormContent(e.target.value);
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-slate-200 focus:outline-none resize-none"
                          />
                        </div>
                      </div>

                      {/* Category Type & Priority Accent */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-slate-700 mb-1">Broadcast Category Type</label>
                          <select
                            value={formType}
                            onChange={(e) => {
                              setFormType(e.target.value);
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                          >
                            <option value="announcement">Announcement</option>
                            <option value="maintenance">Maintenance Notice</option>
                            <option value="feature_update">Feature Update</option>
                            <option value="security_alert">Security Alert</option>
                            <option value="billing_reminder">Billing Reminder</option>
                            <option value="promotional_campaign">Promotional Campaign</option>
                            <option value="onboarding_message">Onboarding Message</option>
                            <option value="emergency_notification">Emergency Notification</option>
                            <option value="custom_broadcast">Custom Broadcast</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">Priority Level</label>
                          <select
                            value={formPriority}
                            onChange={(e) => {
                              setFormPriority(e.target.value);
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                          >
                            <option value="Low">Low (Passive Info)</option>
                            <option value="Medium">Medium (System News)</option>
                            <option value="High">High (User Action Needed)</option>
                            <option value="Critical">Critical (Immediate Banner Override)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">Graphic Display Icon</label>
                          <select
                            value={formIcon}
                            onChange={(e) => {
                              setFormIcon(e.target.value);
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                          >
                            <option value="Bell">Default Bell</option>
                            <option value="AlertTriangle">Alert Triangle</option>
                            <option value="Sparkles">Sparkles Star</option>
                            <option value="Shield">Secure Shield</option>
                            <option value="Settings">Gear Wheel</option>
                            <option value="Info">Info Circle</option>
                            <option value="Mail">Mail Icon</option>
                            <option value="Users">Users Team</option>
                            <option value="Clock">Clock Timer</option>
                            <option value="Terminal">Terminal Console</option>
                            <option value="Activity">Pulse Line</option>
                          </select>
                        </div>
                      </div>

                      {/* Delivery Channels Selectors */}
                      <div className="space-y-2 border-t border-slate-50 pt-4">
                        <label className="block text-slate-700">Delivery Channels Activation</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { id: 'in_app_banner', label: 'In-App Top Banner', desc: 'Floating system notification ribbon' },
                            { id: 'notification_center', label: 'Workspace Inbox', desc: 'Workspace unread messages drawer' },
                            { id: 'dashboard_popup', label: 'Dashboard Popup', desc: 'Heavy overlay on host login' },
                            { id: 'email', label: 'Email Campaign', desc: 'Simulated dispatch to mailbox' },
                            { id: 'push_notification', label: 'Push Notification', desc: 'Mobile/Browser push indicators' },
                            { id: 'announcement_center', label: 'Public Release logs', desc: 'KAVA public announcements timeline' }
                          ].map(ch => (
                            <label
                              key={ch.id}
                              className={`p-3 border rounded-2xl flex flex-col justify-between cursor-pointer hover:border-slate-350 transition-all ${
                                formChannels.includes(ch.id) ? 'bg-slate-50/70 border-slate-300 ring-1 ring-slate-200' : 'border-slate-150 bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <span className="font-bold text-slate-900">{ch.label}</span>
                                <input
                                  type="checkbox"
                                  className="accent-slate-900 mt-0.5"
                                  checked={formChannels.includes(ch.id)}
                                  onChange={() => {
                                    setHasUnsavedChanges(true);
                                    if (formChannels.includes(ch.id)) {
                                      setFormChannels(prev => prev.filter(c => c !== ch.id));
                                    } else {
                                      setFormChannels(prev => [...prev, ch.id]);
                                    }
                                  }}
                                />
                              </div>
                              <span className="text-[9px] text-slate-400 font-medium leading-tight mt-1">{ch.desc}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* PRECISE TARGETING MATRIX */}
                      <div className="space-y-4 border-t border-slate-50 pt-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-slate-700">Targeting Strategy Matrix</label>
                          <span className="text-[10px] text-slate-400 font-bold">
                            Live target match: <strong className="text-emerald-600">
                              {getMatchingRecipientsList({
                                targetUsers: formTargetUsers,
                                targetWorkspaces: formTargetWorkspaces,
                                targetPlans: formTargetPlans,
                                targetCountries: formTargetCountries,
                                targetLanguages: formTargetLanguages,
                                targetStatuses: formTargetStatuses
                              }).length}
                            </strong> recipients.
                          </span>
                        </div>

                        {/* Searchable Picker for Users and Workspaces */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* Searchable Users Picker */}
                          <div className="relative">
                            <label className="block text-[11px] text-slate-600 mb-1">Target Individual Users ({formTargetUsers.includes('All') ? 'All Users' : `${formTargetUsers.length} selected`})</label>
                            <div
                              onClick={() => setShowUserPickerDropdown(!showUserPickerDropdown)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs flex justify-between items-center cursor-pointer font-semibold text-slate-800"
                            >
                              <span className="truncate">
                                {formTargetUsers.includes('All') ? 'All Active Users' : formTargetUsers.map(uid => users.find(u => u.id === uid)?.name || uid).join(', ')}
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                            </div>

                            {showUserPickerDropdown && (
                              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 space-y-2">
                                <input
                                  type="text"
                                  placeholder="Search hosts or contributors..."
                                  value={searchUserPicker}
                                  onChange={(e) => setSearchUserPicker(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                                />

                                <div className="max-h-[160px] overflow-y-auto space-y-1 font-semibold">
                                  <label className="flex items-center space-x-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formTargetUsers.includes('All')}
                                      onChange={() => {
                                        setHasUnsavedChanges(true);
                                        if (formTargetUsers.includes('All')) {
                                          setFormTargetUsers([]);
                                        } else {
                                          setFormTargetUsers(['All']);
                                        }
                                      }}
                                    />
                                    <span>Select All Users</span>
                                  </label>

                                  {users.filter(u => u.name.toLowerCase().includes(searchUserPicker.toLowerCase()) || u.email.toLowerCase().includes(searchUserPicker.toLowerCase())).map(u => (
                                    <label key={u.id} className="flex items-center space-x-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={formTargetUsers.includes(u.id)}
                                        onChange={() => {
                                          setHasUnsavedChanges(true);
                                          const clean = formTargetUsers.filter(x => x !== 'All');
                                          if (clean.includes(u.id)) {
                                            setFormTargetUsers(clean.filter(x => x !== u.id));
                                          } else {
                                            setFormTargetUsers([...clean, u.id]);
                                          }
                                        }}
                                      />
                                      <div className="flex flex-col text-[11px]">
                                        <span className="text-slate-900 font-bold">{u.name}</span>
                                        <span className="text-slate-400 font-mono text-[9px]">{u.email} ({u.role})</span>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Searchable Workspaces Picker */}
                          <div className="relative">
                            <label className="block text-[11px] text-slate-600 mb-1">Target Workspace Enclaves ({formTargetWorkspaces.includes('All') ? 'All Workspaces' : `${formTargetWorkspaces.length} selected`})</label>
                            <div
                              onClick={() => setShowWorkspacePickerDropdown(!showWorkspacePickerDropdown)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs flex justify-between items-center cursor-pointer font-semibold text-slate-800"
                            >
                              <span className="truncate">
                                {formTargetWorkspaces.includes('All') ? 'All Active Clusters' : formTargetWorkspaces.map(wsid => workspaces.find(w => w.id === wsid)?.name || wsid).join(', ')}
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                            </div>

                            {showWorkspacePickerDropdown && (
                              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 space-y-2">
                                <input
                                  type="text"
                                  placeholder="Search workspaces or hosts..."
                                  value={searchWorkspacePicker}
                                  onChange={(e) => setSearchWorkspacePicker(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                                />

                                <div className="max-h-[160px] overflow-y-auto space-y-1 font-semibold">
                                  <label className="flex items-center space-x-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formTargetWorkspaces.includes('All')}
                                      onChange={() => {
                                        setHasUnsavedChanges(true);
                                        if (formTargetWorkspaces.includes('All')) {
                                          setFormTargetWorkspaces([]);
                                        } else {
                                          setFormTargetWorkspaces(['All']);
                                        }
                                      }}
                                    />
                                    <span>Select All Workspaces</span>
                                  </label>

                                  {workspaces.filter(w => w.name.toLowerCase().includes(searchWorkspacePicker.toLowerCase()) || w.host.toLowerCase().includes(searchWorkspacePicker.toLowerCase())).map(w => (
                                    <label key={w.id} className="flex items-center space-x-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={formTargetWorkspaces.includes(w.id)}
                                        onChange={() => {
                                          setHasUnsavedChanges(true);
                                          const clean = formTargetWorkspaces.filter(x => x !== 'All');
                                          if (clean.includes(w.id)) {
                                            setFormTargetWorkspaces(clean.filter(x => x !== w.id));
                                          } else {
                                            setFormTargetWorkspaces([...clean, w.id]);
                                          }
                                        }}
                                      />
                                      <div className="flex flex-col text-[11px]">
                                        <span className="text-slate-900 font-bold">{w.name}</span>
                                        <span className="text-slate-400 font-mono text-[9px]">{w.host} • Tier: {w.plan}</span>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Segment Filters Matrix */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1">Target Subscription Plans</label>
                            <div className="space-y-1">
                              {['Free', 'Premium', 'Enterprise'].map(pl => (
                                <label key={pl} className="flex items-center space-x-1.5">
                                  <input
                                    type="checkbox"
                                    checked={formTargetPlans.includes(pl)}
                                    onChange={() => {
                                      setHasUnsavedChanges(true);
                                      if (formTargetPlans.includes(pl)) {
                                        setFormTargetPlans(prev => prev.filter(p => p !== pl));
                                      } else {
                                        setFormTargetPlans(prev => [...prev, pl]);
                                      }
                                    }}
                                  />
                                  <span>{pl} Tier</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1">Account Directives</label>
                            <div className="space-y-1">
                              {['Active', 'Suspended'].map(st => (
                                <label key={st} className="flex items-center space-x-1.5">
                                  <input
                                    type="checkbox"
                                    checked={formTargetStatuses.includes(st)}
                                    onChange={() => {
                                      setHasUnsavedChanges(true);
                                      if (formTargetStatuses.includes(st)) {
                                        setFormTargetStatuses(prev => prev.filter(s => s !== st));
                                      } else {
                                        setFormTargetStatuses(prev => [...prev, st]);
                                      }
                                    }}
                                  />
                                  <span>Status: {st}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1">Regional Demographics</label>
                            <div className="space-y-1.5">
                              <select
                                value={formTargetCountries[0]}
                                onChange={(e) => {
                                  setFormTargetCountries([e.target.value]);
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                              >
                                <option value="All">All Countries</option>
                                <option value="USA">United States (USA)</option>
                                <option value="ID">Indonesia (ID)</option>
                                <option value="DE">Germany (DE)</option>
                                <option value="UK">United Kingdom (UK)</option>
                              </select>

                              <select
                                value={formTargetLanguages[0]}
                                onChange={(e) => {
                                  setFormTargetLanguages([e.target.value]);
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                              >
                                <option value="All">All Languages</option>
                                <option value="English">English</option>
                                <option value="Indonesian">Indonesian</option>
                                <option value="German">German</option>
                              </select>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* SCHEDULING, RECURRING & BEHAVIORS */}
                      <div className="space-y-4 border-t border-slate-50 pt-4">
                        <label className="block text-slate-700">Lifecycle & UI Interactive States</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1">Scheduling Trigger</label>
                            <select
                              value={formSchedulingType}
                              onChange={(e) => {
                                setFormSchedulingType(e.target.value);
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            >
                              <option value="Instant">Instant Launch</option>
                              <option value="Scheduled">Schedule For Later</option>
                            </select>

                            {formSchedulingType === 'Scheduled' && (
                              <input
                                type="datetime-local"
                                value={formSchedulingDate}
                                onChange={(e) => {
                                  setFormSchedulingDate(e.target.value);
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none mt-2 font-mono"
                              />
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1">Recurring Stream</label>
                            <select
                              value={formRecurring}
                              onChange={(e) => {
                                setFormRecurring(e.target.value);
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            >
                              <option value="None">No Recurrence (One-Shot)</option>
                              <option value="Daily">Daily Recurring</option>
                              <option value="Weekly">Weekly Recurring</option>
                              <option value="Monthly">Monthly Recurring</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1">Expiration Limits</label>
                            <input
                              type="datetime-local"
                              value={formExpirationDate}
                              onChange={(e) => {
                                setFormExpirationDate(e.target.value);
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Interactive UI Checks */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formPinToDashboard}
                              onChange={(e) => {
                                setFormPinToDashboard(e.target.checked);
                                setHasUnsavedChanges(true);
                              }}
                              className="accent-slate-900"
                            />
                            <div className="flex flex-col text-[11px]">
                              <span className="font-bold text-slate-900">Pin-to-Dashboard</span>
                              <span className="text-[9px] text-slate-400">Keep visible on home grids</span>
                            </div>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formAckRequired}
                              onChange={(e) => {
                                setFormAckRequired(e.target.checked);
                                setHasUnsavedChanges(true);
                              }}
                              className="accent-slate-900"
                            />
                            <div className="flex flex-col text-[11px]">
                              <span className="font-bold text-slate-900">Require Acknowledge</span>
                              <span className="text-[9px] text-slate-400">Forces staff to confirm review</span>
                            </div>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formDismissible}
                              onChange={(e) => {
                                setFormDismissible(e.target.checked);
                                setHasUnsavedChanges(true);
                              }}
                              className="accent-slate-900"
                            />
                            <div className="flex flex-col text-[11px]">
                              <span className="font-bold text-slate-900">Dismissible Banner</span>
                              <span className="text-[9px] text-slate-400">Let hosts slide-away ribbon</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* CALL TO ACTION BUTTON SETTINGS */}
                      <div className="space-y-4 border-t border-slate-50 pt-4">
                        <label className="block text-slate-700">Call To Action (CTA) Hyperlink</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1">Button Visual Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Upgrade Now"
                              value={formCtaLabel}
                              onChange={(e) => {
                                setFormCtaLabel(e.target.value);
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1">Destination Relative / Absolute URL</label>
                            <input
                              type="text"
                              placeholder="e.g. /billing or https://status.kava.co"
                              value={formCtaUrl}
                              onChange={(e) => {
                                setFormCtaUrl(e.target.value);
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* MULTILINGUAL LOCALIZATION COMPONENT */}
                      <div className="space-y-4 border-t border-slate-50 pt-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-slate-700">Multilingual Localization Translations</label>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Locales Dictionary</span>
                        </div>

                        <div className="flex border-b border-slate-100 gap-1 text-[11px]">
                          {[
                            { code: 'en', name: 'English (EN)' },
                            { code: 'id', name: 'Bahasa Indonesia (ID)' },
                            { code: 'de', name: 'Deutsch (DE)' },
                            { code: 'es', name: 'Español (ES)' },
                            { code: 'fr', name: 'Français (FR)' }
                          ].map(lang => (
                            <button
                              type="button"
                              key={lang.code}
                              onClick={() => setActiveLangTab(lang.code as any)}
                              className={`px-3 py-1.5 border-b-2 transition-all font-bold ${activeLangTab === lang.code ? 'border-slate-700 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">Translated Heading ({activeLangTab.toUpperCase()})</label>
                            <input
                              type="text"
                              placeholder={`Translated title in ${activeLangTab.toUpperCase()}...`}
                              value={formMultilingual[activeLangTab]?.title || ''}
                              onChange={(e) => {
                                setFormMultilingual(prev => ({
                                  ...prev,
                                  [activeLangTab]: {
                                    ...prev[activeLangTab],
                                    title: e.target.value
                                  }
                                }));
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">Translated Description Content ({activeLangTab.toUpperCase()})</label>
                            <textarea
                              rows={2}
                              placeholder={`Translated content description in ${activeLangTab.toUpperCase()}...`}
                              value={formMultilingual[activeLangTab]?.content || ''}
                              onChange={(e) => {
                                setFormMultilingual(prev => ({
                                  ...prev,
                                  [activeLangTab]: {
                                    ...prev[activeLangTab],
                                    content: e.target.value
                                  }
                                }));
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Form actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (hasUnsavedChanges && confirm('Are you sure you want to discard your edits?')) {
                            handleClearForm();
                            setBroadcastSubTab('overview');
                          } else if (!hasUnsavedChanges) {
                            handleClearForm();
                            setBroadcastSubTab('overview');
                          }
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors cursor-pointer"
                      >
                        Discard Composer
                      </button>

                      <button
                        onClick={handleSaveBroadcastDraft}
                        className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold py-3 rounded-xl transition-all cursor-pointer"
                      >
                        Save Draft
                      </button>

                      <button
                        onClick={handlePublishBroadcast}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        {formSchedulingType === 'Scheduled' ? 'Schedule Delivery' : 'Transmit Broadcast'}
                      </button>
                    </div>

                  </div>

                  {/* LIVE INTERACTIVE DEMO PREVIEW PANEL (2/5) */}
                  <div className="lg:col-span-2 space-y-4">
                    
                    {/* Device Switcher / Toolbar */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <h4 className="text-slate-900">Live Device Inspector</h4>
                      </div>

                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => setPreviewDevice('desktop')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                        >
                          Desktop Grid
                        </button>
                        <button
                          onClick={() => setPreviewDevice('mobile')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                        >
                          Mobile Frame
                        </button>
                      </div>
                    </div>

                    {/* Target Medium Channels Tab */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex gap-1 overflow-x-auto text-[10px] font-black tracking-wide uppercase">
                      {[
                        { id: 'banner', label: 'Banner Ribbon' },
                        { id: 'popup', label: 'Dashboard Popup' },
                        { id: 'inbox', label: 'Inbox Item' },
                        { id: 'email', label: 'HTML Email' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setPreviewChannel(tab.id as any)}
                          className={`px-3 py-2 rounded-xl shrink-0 transition-all font-bold cursor-pointer ${previewChannel === tab.id ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-55'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* PREVIEW FRAME RENDER */}
                    <div className="bg-slate-100 rounded-[32px] p-6 flex justify-center items-center border border-slate-200/80 shadow-inner overflow-hidden min-h-[460px]">
                      
                      <div
                        className={`bg-white border border-slate-200/80 rounded-[28px] shadow-2xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                          previewDevice === 'mobile' ? 'w-[280px] h-[480px]' : 'w-full min-h-[400px]'
                        }`}
                      >
                        
                        {/* Device Top Margin Header bar */}
                        <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-[9px] font-mono select-none tracking-wide">
                          <span>{previewDevice === 'mobile' ? 'KAVA MOBILE CLIENT' : 'KAVA HOST WORKSPACE PORTAL'}</span>
                          <div className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>100% SECURE</span>
                          </div>
                        </div>

                        {/* Interactive Screen viewport */}
                        <div className="p-4 flex-1 flex flex-col justify-start relative text-left">
                          
                          {/* 1. TOP BANNER PREVIEW */}
                          {previewChannel === 'banner' && (
                            <div className="space-y-3 flex-1 flex flex-col justify-center items-center text-center">
                              <p className="text-[10px] font-mono text-slate-400">// Floats at top of all client dashboards //</p>
                              
                              <div
                                className={`w-full p-3.5 border rounded-2xl text-xs font-semibold flex items-center justify-between text-left shadow-lg relative overflow-hidden animate-fade-in ${
                                  formPriority === 'Critical' ? 'bg-red-50 border-red-200 text-red-900 animate-pulse' :
                                  formPriority === 'High' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                                  'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900" />
                                <div className="flex items-center space-x-2.5 pl-1">
                                  <div className="shrink-0 p-1 bg-white/80 border rounded-lg">
                                    {formIcon === 'Bell' ? <Bell className="w-4 h-4 text-slate-700" /> :
                                     formIcon === 'AlertTriangle' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                                     formIcon === 'Sparkles' ? <Sparkles className="w-4 h-4 text-amber-600" /> :
                                     formIcon === 'Shield' ? <Shield className="w-4 h-4 text-blue-600" /> :
                                     <Clock className="w-4 h-4 text-slate-700" />}
                                  </div>
                                  <div className="pr-4 leading-normal">
                                    <h5 className="font-bold text-[11px] line-clamp-1">{formTitle || 'Sample Campaign Title'}</h5>
                                    <p className="text-[9px] text-slate-500 font-medium line-clamp-2 mt-0.5">{formContent || 'Sample campaign text description goes here...'}</p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-1.5 shrink-0 ml-4">
                                  {formCtaLabel && (
                                    <span className="bg-slate-950 text-white font-bold text-[9px] px-2 py-1 rounded-lg select-none hover:opacity-90">
                                      {formCtaLabel}
                                    </span>
                                  )}
                                  {formDismissible && (
                                    <span className="p-1 text-slate-400 hover:text-slate-600">
                                      <X className="w-3 h-3" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. DASHBOARD POPUP PREVIEW */}
                          {previewChannel === 'popup' && (
                            <div className="flex-1 flex flex-col justify-center items-center text-center">
                              
                              {/* Background screen mockup details */}
                              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] p-4">
                                <div className="h-6 w-1/2 bg-slate-400 rounded mb-2" />
                                <div className="h-10 w-full bg-slate-400 rounded" />
                              </div>

                              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 max-w-sm w-full relative z-10 animate-scale-in">
                                <div className="flex justify-between items-start">
                                  <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-2xl">
                                    {formIcon === 'Bell' ? <Bell className="w-5 h-5 text-slate-900" /> :
                                     formIcon === 'AlertTriangle' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                                     formIcon === 'Sparkles' ? <Sparkles className="w-5 h-5 text-amber-500" /> :
                                     formIcon === 'Shield' ? <Shield className="w-5 h-5 text-blue-500" /> :
                                     <Mail className="w-5 h-5 text-slate-900" />}
                                  </div>
                                  <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">
                                    {formPriority} Priority
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <h4 className="text-xs font-black text-slate-900">{formTitle || 'Platform Upgrade Completed'}</h4>
                                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                    {formContent || 'We have deployed retro photowall themes to increase guest engagement streams globally.'}
                                  </p>
                                </div>

                                <div className="flex flex-col gap-1.5 pt-2">
                                  {formCtaLabel && (
                                    <span className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-center py-2 rounded-xl text-[10px] shadow-xs select-none">
                                      {formCtaLabel}
                                    </span>
                                  )}
                                  
                                  {formAckRequired ? (
                                    <span className="w-full bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-700 font-bold text-center py-2 rounded-xl text-[10px] select-none">
                                      I Acknowledge & Read This Alert
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-slate-400 hover:text-slate-600 py-1 cursor-pointer select-none">
                                      Close
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3. INBOX ITEM PREVIEW */}
                          {previewChannel === 'inbox' && (
                            <div className="space-y-3 flex-1 flex flex-col justify-start">
                              <p className="text-[10px] font-mono text-slate-400 text-center mb-1">// Workspace inbox list integration //</p>
                              
                              <div className="border border-slate-100 rounded-2xl p-4 flex items-start space-x-3 bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-xs">
                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                                  {formIcon === 'Bell' ? <Bell className="w-4 h-4 text-slate-900" /> :
                                   formIcon === 'AlertTriangle' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                                   formIcon === 'Sparkles' ? <Sparkles className="w-4 h-4 text-slate-900" /> :
                                   formIcon === 'Shield' ? <Shield className="w-4 h-4 text-emerald-600" /> :
                                   <Mail className="w-4 h-4 text-slate-600" />}
                                </div>

                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <div className="flex items-baseline justify-between">
                                    <h5 className="text-[11px] font-black text-slate-900 flex items-center space-x-1">
                                      <span>{formTitle || 'V2 Server Core Operational'}</span>
                                      <span className="h-1.5 w-1.5 bg-slate-900 rounded-full shrink-0" />
                                    </h5>
                                    <span className="text-[8px] text-slate-400 font-mono">Just now</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-medium leading-normal line-clamp-2">
                                    {formContent || 'The server network trace migration is completed. All databases are functioning green.'}
                                  </p>

                                  {formCtaLabel && (
                                    <div className="pt-1">
                                      <span className="inline-block text-[9px] font-black text-slate-900 hover:text-slate-700">
                                        {formCtaLabel} &rarr;
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 4. HTML EMAIL PREVIEW */}
                          {previewChannel === 'email' && (
                            <div className="flex-1 flex flex-col justify-start overflow-y-auto pr-1">
                              <p className="text-[10px] font-mono text-slate-400 text-center mb-2">// Fully branded HTML dispatch digest //</p>
                              
                              <div className="border border-slate-150 rounded-2xl bg-white overflow-hidden shadow-xs text-slate-700">
                                <div className="bg-slate-900 text-white p-4 text-center">
                                  <h4 className="text-sm font-black font-serif tracking-widest text-[#C19A2E]">K A V A</h4>
                                  <p className="text-[8px] font-mono uppercase tracking-widest text-slate-400">System Core Broadcast</p>
                                </div>

                                <div className="p-5 space-y-4 text-[11px] leading-relaxed">
                                  <p className="font-bold text-slate-900">Hello {users[0]?.name || 'Host User'},</p>
                                  <p className="text-slate-600 font-medium">{formContent || 'We would like to introduce vintage photo frame options for our premium live slideshow displays.'}</p>
                                  
                                  {formCtaLabel && (
                                    <div className="text-center pt-2 pb-1">
                                      <span className="inline-block bg-[#C19A2E] text-white font-bold px-5 py-2 rounded-xl text-[10px] select-none shadow-xs">
                                        {formCtaLabel}
                                      </span>
                                    </div>
                                  )}

                                  <div className="border-t border-slate-100 pt-3 text-[9px] text-slate-400 space-y-1 font-medium leading-relaxed">
                                    <p>Regards,<br /><strong className="text-slate-600">KAVA Cloud Platform Staff</strong></p>
                                    <p className="mt-4 border-t border-slate-50 pt-2 text-[8px] text-center">
                                      If you wish to manage your email notification preferences, you can opt-out by clicking unsubscribe.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Footer regulatory bar */}
                        <div className="bg-slate-100 text-[8px] text-slate-400 text-center py-2 border-t border-slate-150 font-medium select-none font-mono">
                          STATUS CHECK // LATENCY: 24MS // COHERENT
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* CAMPAIGNS HISTORY TABLE SUBTAB */}
              {broadcastSubTab === 'history' && (
                <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden text-xs">
                  
                  {/* Search and Filters bar */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/30">
                    <div className="flex-1 min-w-[240px] relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search broadcast history title, segment, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-slate-200 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Broadcast History Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-slate-600">
                      <thead className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Campaign details</th>
                          <th className="px-6 py-4">Sub-Category</th>
                          <th className="px-6 py-4">Delivery Channels</th>
                          <th className="px-6 py-4">Target Matrix</th>
                          <th className="px-6 py-4">Analytics & Engagement</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                        {broadcasts.filter(bc => 
                          bc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (bc.content && bc.content.toLowerCase().includes(searchTerm.toLowerCase()))
                        ).length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-slate-400">No campaigns match search criteria. Compose new above!</td>
                          </tr>
                        ) : (
                          broadcasts.filter(bc => 
                            bc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (bc.content && bc.content.toLowerCase().includes(searchTerm.toLowerCase()))
                          ).map(bc => (
                            <tr key={bc.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-1.5">
                                    <span className={`h-2 w-2 rounded-full ${bc.priority === 'Critical' ? 'bg-red-500' : bc.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                    <p className="font-bold text-slate-950">{bc.title}</p>
                                  </div>
                                  <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[220px] font-medium">{bc.content}</p>
                                  <span className="text-[9px] font-mono text-slate-400">Created: {new Date(bc.created).toLocaleDateString()}</span>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold tracking-wider px-2 py-0.5 rounded-md uppercase">
                                  {bc.type.replace('_', ' ')}
                                </span>
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                  {bc.channels?.map((ch: string) => (
                                    <span key={ch} className="text-[9px] border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md capitalize">
                                      {ch.replace('_', ' ')}
                                    </span>
                                  ))}
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="text-[10px] space-y-0.5 text-slate-500">
                                  <p>Plans: <strong className="text-slate-800">{bc.targetPlans?.join(', ') || 'All'}</strong></p>
                                  <p>Account: <strong className="text-slate-800">{bc.targetStatuses?.join(', ') || 'All'}</strong></p>
                                  <p>Specifics: <strong className="text-slate-800">
                                    {bc.targetUsers?.includes('All') ? 'All Enrolled' : `${bc.targetUsers?.length || 0} users`}
                                  </strong></p>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                    <span>Engaged: {bc.analytics?.engagementRate || 0}%</span>
                                    <span>Deliv: {bc.analytics?.deliveredCount || 0}/{bc.analytics?.recipientsCount || 0}</span>
                                  </div>
                                  <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div className="bg-slate-900 h-full" style={{ width: `${bc.analytics?.engagementRate || 0}%` }} />
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                  bc.status === 'Published' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' :
                                  bc.status === 'Scheduled' ? 'text-slate-900 bg-slate-100 border border-slate-300 animate-pulse' :
                                  bc.status === 'Draft' ? 'text-slate-500 bg-slate-100 border border-slate-200' :
                                  'text-rose-700 bg-rose-50 border border-rose-100'
                                }`}>
                                  {bc.status}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  
                                  {/* Deep dive reports trigger */}
                                  <button
                                    onClick={() => setSelectedAnalyticsBc(bc)}
                                    className="p-1 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                    title="Deep Analytics Report"
                                  >
                                    <Activity className="w-4 h-4 text-slate-500" />
                                  </button>

                                  <button
                                    onClick={() => handleEditBroadcast(bc)}
                                    className="p-1 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                    title="Edit details"
                                  >
                                    <Settings className="w-4 h-4 text-slate-500" />
                                  </button>

                                  <button
                                    onClick={() => handleDuplicateBroadcast(bc)}
                                    className="p-1 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                    title="Duplicate campaign"
                                  >
                                    <Copy className="w-4 h-4 text-slate-500" />
                                  </button>

                                  {bc.status === 'Published' ? (
                                    <button
                                      onClick={() => handleResendBroadcast(bc.id)}
                                      className="p-1 hover:bg-slate-100 text-slate-800 rounded-lg transition-colors cursor-pointer"
                                      title="Resend broadcast"
                                    >
                                      <Send className="w-4 h-4" />
                                    </button>
                                  ) : bc.status === 'Scheduled' ? (
                                    <button
                                      onClick={() => handleCancelBroadcast(bc.id)}
                                      className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                                      title="Cancel schedule"
                                    >
                                      <Power className="w-4 h-4" />
                                    </button>
                                  ) : null}

                                  <button
                                    onClick={() => {
                                      if (confirm(`Purge campaign "${bc.title}" permanently from administrative archives?`)) {
                                        handleDeleteBroadcast(bc.id);
                                      }
                                    }}
                                    className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                                    title="Purge"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* DYNAMIC CAMPAIGN ANALYTICS DEEP REPORT DIALOG */}
              {selectedAnalyticsBc && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 border border-slate-100 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">Performance Analytical Sheet</span>
                        <h3 className="text-sm font-black text-slate-900">Campaign: "{selectedAnalyticsBc.title}"</h3>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">ID Ref: #{selectedAnalyticsBc.id} • Created: {new Date(selectedAnalyticsBc.created).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => setSelectedAnalyticsBc(null)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Funnel conversion graph */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                        <h5 className="text-[11px] font-black text-slate-800">Omni-Channel Conversion Funnel</h5>
                        <div className="space-y-2.5 text-xs font-semibold">
                          {[
                            { step: 'Audience Reach', count: selectedAnalyticsBc.analytics?.recipientsCount || 0, color: 'bg-slate-900', max: selectedAnalyticsBc.analytics?.recipientsCount || 1 },
                            { step: 'Delivered', count: selectedAnalyticsBc.analytics?.deliveredCount || 0, color: 'bg-emerald-600', max: selectedAnalyticsBc.analytics?.recipientsCount || 1 },
                            { step: 'Viewed Content', count: selectedAnalyticsBc.analytics?.viewedCount || 0, color: 'bg-slate-700', max: selectedAnalyticsBc.analytics?.recipientsCount || 1 },
                            { step: 'CTA Clicked', count: selectedAnalyticsBc.analytics?.clickedCount || 0, color: 'bg-amber-600', max: selectedAnalyticsBc.analytics?.recipientsCount || 1 }
                          ].map((fn, idx) => {
                            const pct = fn.max > 0 ? Math.round((fn.count / fn.max) * 100) : 0;
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-500">{fn.step}</span>
                                  <span className="text-slate-900 font-bold">{fn.count} ({pct}%)</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div className={`${fn.color} h-full`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Targeting audit sheet */}
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                        <h5 className="text-[11px] font-black text-slate-800">Administrative Targeting Metrics</h5>
                        <div className="space-y-2 text-[11px] text-slate-600 leading-normal font-semibold">
                          <p className="flex justify-between"><span>Category Type:</span> <strong className="text-slate-900 capitalize">{selectedAnalyticsBc.type.replace('_', ' ')}</strong></p>
                          <p className="flex justify-between"><span>Priority Class:</span> <strong className="text-slate-900">{selectedAnalyticsBc.priority}</strong></p>
                          <p className="flex justify-between"><span>Plans targeted:</span> <strong className="text-slate-900">{selectedAnalyticsBc.targetPlans?.join(', ') || 'All'}</strong></p>
                          <p className="flex justify-between"><span>Status targeted:</span> <strong className="text-slate-900">{selectedAnalyticsBc.targetStatuses?.join(', ') || 'All'}</strong></p>
                          <p className="flex justify-between"><span>Pin to Grid:</span> <strong className="text-slate-900">{selectedAnalyticsBc.pinToDashboard ? 'True' : 'False'}</strong></p>
                          <p className="flex justify-between"><span>Ack Mandated:</span> <strong className="text-slate-900">{selectedAnalyticsBc.ackRequired ? 'True' : 'False'}</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* Version edit trails */}
                    <div className="space-y-2 border-t border-slate-100 pt-4">
                      <h5 className="text-[11px] font-black text-slate-800 font-mono uppercase tracking-wider">Campaign Version Changelogs</h5>
                      <div className="space-y-1 max-h-[140px] overflow-y-auto">
                        {selectedAnalyticsBc.versions?.map((v: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 font-semibold text-[10px] text-slate-500">
                            <span className="text-slate-700">v{v.version} - Edited by {v.author}</span>
                            <span className="font-mono text-[9px]">{new Date(v.timestamp).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        onClick={() => setSelectedAnalyticsBc(null)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors text-center cursor-pointer"
                      >
                        Dismiss Report
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* FEATURE FLAG INTERACTIVE LIVE PREVIEW MODAL */}
        <FeatureFlagLivePreviewModal
          flag={selectedFlagForPreview}
          isOpen={isLivePreviewOpen}
          onClose={() => {
            setIsLivePreviewOpen(false);
            setSelectedFlagForPreview(null);
          }}
          onUpdateFlag={handleUpdateSingleFlag}
          allFlags={featureFlags}
        />

        {/* ADMIN TOAST FEEDBACK FLOATER */}
        <AnimatePresence>
          {adminToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white border border-slate-850 p-4 rounded-2xl shadow-2xl flex items-start space-x-3 max-w-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-white">{adminToast.title}</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed font-medium">{adminToast.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {previewTourGuide && (
          <InteractiveTourSpotlight
            guide={previewTourGuide}
            isOpen={isPreviewTourOpen}
            onClose={() => setIsPreviewTourOpen(false)}
            userRole="Super Admin"
          />
        )}

      </main>
    </div>
  );
}

// Minimal placeholder helper icon for sub-elements
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
