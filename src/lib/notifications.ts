import { KavaNotificationItem, NotificationCategory, KavaContribution, KavaGuest, KavaEvent, SupportTicket } from '../types';

export const NOTIFICATIONS_STORAGE_KEY = 'kava_notifications_v3';
export const DELETED_NOTIF_IDS_KEY = 'kava_deleted_notif_ids_v3';
export const READ_NOTIF_IDS_KEY = 'kava_read_notif_ids_v3';

export function getDeletedNotifIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_NOTIF_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

export function saveDeletedNotifIds(ids: Set<string>): void {
  try {
    localStorage.setItem(DELETED_NOTIF_IDS_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {}
}

export function getReadNotifIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_NOTIF_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

export function saveReadNotifIds(ids: Set<string>): void {
  try {
    localStorage.setItem(READ_NOTIF_IDS_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {}
}

export function getStoredNotifications(): KavaNotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

export function saveStoredNotifications(items: KavaNotificationItem[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('kava_notifications_updated', { detail: items }));
      }, 0);
    }
  } catch (e) {}
}

export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${Math.max(1, diffMin)}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export async function requestBrowserPushPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return Notification.permission;
  }
}

export function sendBrowserPushNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      return true;
    } catch (e) {
      console.warn('Browser push notification failed:', e);
    }
  }
  return false;
}

export function dispatchKavaNotification(item: Partial<KavaNotificationItem>): KavaNotificationItem | null {
  const deletedIds = getDeletedNotifIds();
  const notifId = item.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  if (deletedIds.has(notifId)) {
    return null;
  }

  const readIds = getReadNotifIds();
  const timestamp = item.timestamp || Date.now();

  const fullNotif: KavaNotificationItem = {
    id: notifId,
    category: item.category || 'System',
    title: item.title || 'Platform Notification',
    description: item.description || '',
    time: item.time || formatRelativeTime(timestamp),
    timestamp,
    unread: item.unread !== undefined ? item.unread : !readIds.has(notifId),
    targetTab: item.targetTab || 'notifications',
    eventId: item.eventId,
    iconType: item.iconType || 'announcement',
    actionLabel: item.actionLabel || 'View Details'
  };

  const currentList = getStoredNotifications();
  const existingIdx = currentList.findIndex(n => n.id === notifId);

  let updatedList: KavaNotificationItem[];
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...fullNotif };
  } else {
    updatedList = [fullNotif, ...currentList];
  }

  saveStoredNotifications(updatedList);

  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('kava_add_notification', { detail: fullNotif }));
    }, 0);
  }

  // Optional Browser Push Notification if granted
  sendBrowserPushNotification(fullNotif.title, {
    body: fullNotif.description,
    tag: fullNotif.id
  });

  return fullNotif;
}

export interface PlatformEventParams {
  contributions: KavaContribution[];
  guests: KavaGuest[];
  tickets: SupportTicket[];
  events: KavaEvent[];
  teamMembers?: Array<{ id: string; name: string; email: string; role: string; addedAt?: string }>;
  invoices?: Array<{ id: string; amount: string; status: string; date: string; description?: string }>;
  broadcasts?: Array<{ id: string; title: string; content?: string; type?: string; status: string; createdAt?: string }>;
  workspaceName?: string;
  isLiveScreenActive?: boolean;
}

/**
 * Synchronizes real platform activities with stored notifications.
 * Evaluates contributions, guest RSVPs/joins, moderation requests, support tickets,
 * broadcasts, team member updates, storage alerts, and live screen status.
 */
export function synchronizePlatformNotifications({
  contributions,
  guests,
  tickets,
  events,
  teamMembers = [],
  invoices = [],
  broadcasts = [],
  workspaceName = 'Workspace',
  isLiveScreenActive = false
}: PlatformEventParams): KavaNotificationItem[] {
  const deletedIds = getDeletedNotifIds();
  const readIds = getReadNotifIds();
  const currentStored = getStoredNotifications();
  const storedMap = new Map<string, KavaNotificationItem>(currentStored.map(n => [n.id, n]));

  const generated: KavaNotificationItem[] = [];

  // Helper to add if not deleted
  const registerNotif = (notif: KavaNotificationItem) => {
    if (deletedIds.has(notif.id)) return;

    const existing = storedMap.get(notif.id);
    if (readIds.has(notif.id)) {
      notif.unread = false;
    } else if (existing !== undefined) {
      notif.unread = existing.unread;
    }

    generated.push(notif);
  };

  // 1. Contributions (Photos, Videos, Voice, Wishes) + Moderation Requests
  contributions.forEach(c => {
    const ev = events.find(e => e.id === c.eventId);
    const timeMs = typeof c.timestamp === 'number' ? c.timestamp : new Date(c.timestamp || Date.now()).getTime();
    const eventName = ev ? ev.name : workspaceName;

    // Direct Upload Notification
    const notifId = `notif-con-${c.id}`;
    const typeTitle = c.type.charAt(0).toUpperCase() + c.type.slice(1);
    registerNotif({
      id: notifId,
      category: 'Guest Activity',
      title: `New ${typeTitle} uploaded`,
      description: `${c.contributorName || 'A guest'} uploaded a ${c.type}${c.text ? `: "${c.text.slice(0, 40)}..."` : ''} to ${eventName}.`,
      time: formatRelativeTime(timeMs),
      timestamp: timeMs,
      unread: true,
      targetTab: 'contributions',
      eventId: c.eventId,
      iconType: c.type === 'wish' ? 'comment' : 'upload',
      actionLabel: 'View Contributions'
    });

    // Moderation Request Notification (if pending host approval)
    if (c.status === 'pending') {
      const modNotifId = `notif-mod-${c.id}`;
      registerNotif({
        id: modNotifId,
        category: 'Event Activity',
        title: `Moderation required for ${c.type}`,
        description: `${c.contributorName || 'A guest'} uploaded a ${c.type} pending host approval for the Live Screen in ${eventName}.`,
        time: formatRelativeTime(timeMs),
        timestamp: timeMs + 10,
        unread: true,
        targetTab: 'contributions',
        eventId: c.eventId,
        iconType: 'approval',
        actionLabel: 'Review Pending'
      });
    }
  });

  // 2. Guest Joins & RSVPs
  guests.forEach(g => {
    const ev = events.find(e => e.id === g.eventId);
    const timeMs = typeof g.joinedAt === 'number' ? g.joinedAt : new Date(g.joinedAt || Date.now()).getTime();
    const eventName = ev ? ev.name : workspaceName;

    const notifId = `notif-gst-${g.id}`;
    registerNotif({
      id: notifId,
      category: 'Guest Activity',
      title: 'Guest joined & confirmed RSVP',
      description: `${g.name} joined ${eventName} and entered the guest portal.`,
      time: formatRelativeTime(timeMs),
      timestamp: timeMs,
      unread: true,
      targetTab: 'guests',
      eventId: g.eventId,
      iconType: 'rsvp',
      actionLabel: 'View Guests'
    });
  });

  // 3. Support Tickets
  tickets.forEach(t => {
    const timeMs = typeof t.created === 'number' ? t.created : new Date(t.created || Date.now()).getTime();
    const notifId = `notif-tkt-${t.id}`;
    registerNotif({
      id: notifId,
      category: 'System',
      title: `Support Ticket: ${t.subject}`,
      description: `Ticket status is now ${t.status.toUpperCase()} (${t.category}). ${t.messages && t.messages.length > 0 ? `Latest reply from support team available.` : 'Under review by KAVA support.'}`,
      time: formatRelativeTime(timeMs),
      timestamp: timeMs,
      unread: t.unreadByHost !== undefined ? t.unreadByHost : true,
      targetTab: 'support',
      iconType: 'announcement',
      actionLabel: 'View Ticket'
    });
  });

  // 4. Team Members & Workspace Invitations
  teamMembers.forEach(tm => {
    const timeMs = tm.addedAt ? new Date(tm.addedAt).getTime() : Date.now() - 3600000;
    const notifId = `notif-team-${tm.id}`;
    registerNotif({
      id: notifId,
      category: 'Team',
      title: 'Team member active in workspace',
      description: `${tm.name} (${tm.role}) is active in ${workspaceName}.`,
      time: formatRelativeTime(timeMs),
      timestamp: timeMs,
      unread: true,
      targetTab: 'team',
      iconType: 'team',
      actionLabel: 'View Team'
    });
  });

  // 5. Invoices & Billing Updates
  invoices.forEach(inv => {
    const timeMs = inv.date ? new Date(inv.date).getTime() : Date.now() - 7200000;
    const notifId = `notif-inv-${inv.id}`;
    registerNotif({
      id: notifId,
      category: 'Billing',
      title: `Billing update: ${inv.description || 'Invoice processed'}`,
      description: `Invoice #${inv.id} for ${inv.amount} was marked ${inv.status}.`,
      time: formatRelativeTime(timeMs),
      timestamp: timeMs,
      unread: true,
      targetTab: 'billing',
      iconType: 'billing',
      actionLabel: 'View Billing'
    });
  });

  // 6. Super Admin Broadcasts & System Announcements
  broadcasts.forEach(bc => {
    if (bc.status !== 'Published') return;
    const timeMs = bc.createdAt ? new Date(bc.createdAt).getTime() : Date.now() - 1800000;
    const notifId = `notif-bc-${bc.id}`;

    const isSecurity = bc.type === 'security_alert' || bc.type === 'emergency_notification';
    const isBilling = bc.type === 'billing_reminder';

    registerNotif({
      id: notifId,
      category: isBilling ? 'Billing' : isSecurity ? 'System' : 'System',
      title: bc.title,
      description: bc.content || 'System update broadcasted across workspace network.',
      time: formatRelativeTime(timeMs),
      timestamp: timeMs,
      unread: true,
      targetTab: isBilling ? 'billing' : 'notifications',
      iconType: isSecurity ? 'announcement' : isBilling ? 'billing' : 'announcement',
      actionLabel: 'Read Announcement'
    });
  });

  // 7. Storage Capacity Monitor (Automated Storage Usage Warning)
  const totalUploads = contributions.length;
  if (totalUploads >= 10) {
    const estimatedMb = Math.round(totalUploads * 4.2);
    const notifId = 'notif-storage-usage-status';
    registerNotif({
      id: notifId,
      category: 'System',
      title: 'Storage usage report',
      description: `${totalUploads} media files (~${estimatedMb} MB) uploaded across your active event capsules. Storage is optimal.`,
      time: formatRelativeTime(Date.now() - 3600000 * 4),
      timestamp: Date.now() - 3600000 * 4,
      unread: false,
      targetTab: 'billing',
      iconType: 'storage',
      actionLabel: 'Check Storage'
    });
  }

  // 8. Live Screen Activity
  if (isLiveScreenActive) {
    const notifId = 'notif-live-screen-active';
    registerNotif({
      id: notifId,
      category: 'Event Activity',
      title: 'Live Screen slideshow running',
      description: `The live projector stream is currently active and presenting real-time guest media.`,
      time: 'Just now',
      timestamp: Date.now(),
      unread: false,
      targetTab: 'live',
      iconType: 'live',
      actionLabel: 'Open Live Screen'
    });
  }

  // Keep any manually injected custom notifications from currentStored
  currentStored.forEach(st => {
    if (!deletedIds.has(st.id) && !generated.some(g => g.id === st.id)) {
      if (readIds.has(st.id)) {
        st.unread = false;
      }
      generated.push(st);
    }
  });

  // If no notifications exist yet, seed default platform notifications
  if (generated.length === 0) {
    DEFAULT_PLATFORM_NOTIFICATIONS.forEach(defNotif => {
      registerNotif({ ...defNotif });
    });
  }

  // Sort descending by timestamp
  generated.sort((a, b) => b.timestamp - a.timestamp);

  // Save merged result back to local storage
  saveStoredNotifications(generated);

  return generated;
}

export const DEFAULT_PLATFORM_NOTIFICATIONS: KavaNotificationItem[] = [
  {
    id: 'ntf-1',
    category: 'Guest Activity',
    title: 'New guest RSVP received',
    description: "Alex Rivera RSVP'd for Sofia & Leo Wedding and confirmed attendance.",
    time: '5m ago',
    timestamp: Date.now() - 5 * 60 * 1000,
    unread: true,
    targetTab: 'guests',
    iconType: 'rsvp',
    actionLabel: 'View Guests'
  },
  {
    id: 'ntf-2',
    category: 'Guest Activity',
    title: 'New guest photos uploaded',
    description: 'Elena Rostova uploaded 4 high-res photos to Sofia & Leo Wedding.',
    time: '18m ago',
    timestamp: Date.now() - 18 * 60 * 1000,
    unread: true,
    targetTab: 'contributions',
    iconType: 'upload',
    actionLabel: 'View Photos'
  },
  {
    id: 'ntf-3',
    category: 'Guest Activity',
    title: 'New guest wish comment',
    description: "Marcus Vance left a memory wish: 'Wishing you a lifetime of happiness!'",
    time: '42m ago',
    timestamp: Date.now() - 42 * 60 * 1000,
    unread: true,
    targetTab: 'contributions',
    iconType: 'comment',
    actionLabel: 'View Wish'
  },
  {
    id: 'ntf-4',
    category: 'Event Activity',
    title: 'Approval required for 3 items',
    description: '3 guest contributions are pending host approval for the Live Screen.',
    time: '1h ago',
    timestamp: Date.now() - 60 * 60 * 1000,
    unread: true,
    targetTab: 'contributions',
    iconType: 'approval',
    actionLabel: 'Review Pending'
  },
  {
    id: 'ntf-5',
    category: 'Event Activity',
    title: 'Live Screen projector launched',
    description: 'The interactive slideshow display was started for Sofia & Leo Wedding.',
    time: '3h ago',
    timestamp: Date.now() - 3 * 3600 * 1000,
    unread: false,
    targetTab: 'live',
    iconType: 'live',
    actionLabel: 'Open Live Screen'
  },
  {
    id: 'ntf-6',
    category: 'Team',
    title: 'Team invitation accepted',
    description: 'Sarah Jenkins joined your workspace as an Event Co-Host.',
    time: '1d ago',
    timestamp: Date.now() - 24 * 3600 * 1000,
    unread: false,
    targetTab: 'team',
    iconType: 'team',
    actionLabel: 'View Team'
  },
  {
    id: 'ntf-7',
    category: 'Billing',
    title: 'Billing update: Invoice processed',
    description: 'Your Pro Studio subscription monthly renewal ($29.00) was successfully processed.',
    time: '2d ago',
    timestamp: Date.now() - 2 * 24 * 3600 * 1000,
    unread: false,
    targetTab: 'billing',
    iconType: 'billing',
    actionLabel: 'View Invoices'
  },
  {
    id: 'ntf-8',
    category: 'Billing',
    title: 'Subscription tier upgraded',
    description: 'Original quality photo downloads and custom watermark controls are now active.',
    time: '3d ago',
    timestamp: Date.now() - 3 * 24 * 3600 * 1000,
    unread: false,
    targetTab: 'billing',
    iconType: 'subscription',
    actionLabel: 'Manage Plan'
  },
  {
    id: 'ntf-9',
    category: 'System',
    title: 'Storage alert: 15% consumed',
    description: 'Your personal workspace has used 1.5 GB out of 10.0 GB available storage.',
    time: '4d ago',
    timestamp: Date.now() - 4 * 24 * 3600 * 1000,
    unread: false,
    targetTab: 'workspace_settings',
    iconType: 'storage',
    actionLabel: 'Storage Settings'
  },
  {
    id: 'ntf-10',
    category: 'System',
    title: 'Platform announcement: Cyber Horizon',
    description: 'Experience the new guest studio design suite now live in Experience Settings.',
    time: '5d ago',
    timestamp: Date.now() - 5 * 24 * 3600 * 1000,
    unread: false,
    targetTab: 'workspace_settings',
    iconType: 'announcement',
    actionLabel: 'View Announcement'
  }
];
