import { KavaEvent, KavaContribution, KavaGuest, EventJoinLog } from '../types';
import { INITIAL_EVENTS, INITIAL_CONTRIBUTIONS, INITIAL_GUESTS } from '../data';

const API_BASE = '/api';

/**
 * Get active auth headers for API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('kava_auth_token') || 'kava_admin_default';
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }
    const savedUser = localStorage.getItem('kava_active_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.email) headers['x-user-email'] = user.email;
        if (user.id) headers['x-user-id'] = user.id;
        if (user.workspaceId) headers['x-workspace-id'] = user.workspaceId;
      } catch (e) {}
    }
  }

  return headers;
}

/**
 * Fetch all events from backend with LocalStorage fallback / cache
 */
export async function fetchEvents(): Promise<KavaEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('kava_events', JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch events from API, falling back to cache:', err);
  }

  // Fallback to localStorage or INITIAL_EVENTS
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('kava_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
  }
  return INITIAL_EVENTS;
}

/**
 * Fetch a single event by ID or code or invitation token
 */
export async function fetchEventByIdOrCode(idOrCode: string): Promise<KavaEvent | null> {
  if (!idOrCode) return null;
  try {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(idOrCode)}`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Failed to fetch event for ${idOrCode}:`, err);
  }
  return null;
}

/**
 * Create a new event
 */
export async function createEventApi(eventData: Partial<KavaEvent>): Promise<KavaEvent> {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to create event on server:', err);
  }

  // Fallback: construct locally
  const cleanCode = eventData.code || `CAP-${Math.floor(1000 + Math.random() * 9000)}`;
  const localEvent: KavaEvent = {
    id: eventData.id || `evt-${Date.now()}`,
    name: eventData.name || 'New Capsule',
    type: eventData.type || 'Celebration',
    date: eventData.date || new Date().toISOString().split('T')[0],
    location: eventData.location || 'Gathering',
    code: cleanCode.toUpperCase(),
    coverUrl: eventData.coverUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    coverPositionY: eventData.coverPositionY ?? 50,
    guestCount: 0,
    status: 'active',
    settings: {
      guestUploadAllowed: true,
      instantReveal: true,
      allowedTypes: ['photo', 'video', 'voice', 'wish'],
      requireApproval: false,
      invitationToken: cleanCode.toUpperCase(),
      ...(eventData.settings || {}),
    },
    ...eventData,
  };
  return localEvent;
}

/**
 * Update an existing event
 */
export async function updateEventApi(id: string, updates: Partial<KavaEvent>): Promise<KavaEvent | null> {
  try {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`Failed to update event ${id}:`, err);
  }
  return null;
}

/**
 * Regenerate unique invitation code and token for an event
 */
export async function regenerateEventCodeApi(id: string): Promise<{ event: KavaEvent; newCode: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(id)}/regenerate-code`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`Failed to regenerate code for event ${id}:`, err);
  }
  return null;
}

/**
 * Delete an event
 */
export async function deleteEventApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.success;
    }
  } catch (err) {
    console.error(`Failed to delete event ${id}:`, err);
  }
  return false;
}

/**
 * Server-authoritative Join Validation
 */
export async function joinEventApi(
  code: string,
  password?: string,
  joinMethod: 'code' | 'qr' | 'invitation_link' = 'code',
  guestInfo?: { name?: string; email?: string; device?: string; browser?: string; country?: string }
): Promise<{
  success: boolean;
  status: 'valid' | 'invalid_code' | 'archived' | 'disabled' | 'not_open' | 'expired' | 'full' | 'password_required';
  event?: KavaEvent;
  guest?: KavaGuest;
  joinLog?: EventJoinLog;
  errorMessage?: string;
  startDate?: string;
  expirationDate?: string;
  maxGuests?: number;
  currentGuests?: number;
}> {
  try {
    const res = await fetch(`${API_BASE}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, password, joinMethod, guestInfo }),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to validate join via API:', err);
    return {
      success: false,
      status: 'invalid_code',
      errorMessage: 'Network error connecting to server. Please try again.',
    };
  }
}

/**
 * Fetch contributions
 */
export async function fetchContributions(eventId?: string): Promise<KavaContribution[]> {
  try {
    const url = eventId ? `${API_BASE}/contributions?eventId=${encodeURIComponent(eventId)}` : `${API_BASE}/contributions`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (!eventId && typeof localStorage !== 'undefined') {
          localStorage.setItem('kava_contributions', JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch contributions from API:', err);
  }

  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('kava_contributions');
    if (saved) {
      try {
        const parsed: KavaContribution[] = JSON.parse(saved);
        return eventId ? parsed.filter((c) => c.eventId === eventId) : parsed;
      } catch (e) {}
    }
  }
  return eventId ? INITIAL_CONTRIBUTIONS.filter((c) => c.eventId === eventId) : INITIAL_CONTRIBUTIONS;
}

/**
 * Add a contribution
 */
export async function addContributionApi(
  data: Omit<KavaContribution, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): Promise<KavaContribution | null> {
  try {
    const res = await fetch(`${API_BASE}/contributions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to add contribution to API:', err);
  }
  return null;
}

/**
 * Update contribution (approve, pin, hide, reject, etc.)
 */
export async function updateContributionApi(id: string, updates: Partial<KavaContribution>): Promise<KavaContribution | null> {
  try {
    const res = await fetch(`${API_BASE}/contributions/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`Failed to update contribution ${id}:`, err);
  }
  return null;
}

/**
 * Delete contribution
 */
export async function deleteContributionApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/contributions/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.success;
    }
  } catch (err) {
    console.error(`Failed to delete contribution ${id}:`, err);
  }
  return false;
}

/**
 * Fetch guests
 */
export async function fetchGuests(eventId?: string): Promise<KavaGuest[]> {
  try {
    const url = eventId ? `${API_BASE}/guests?eventId=${encodeURIComponent(eventId)}` : `${API_BASE}/guests`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (!eventId && typeof localStorage !== 'undefined') {
          localStorage.setItem('kava_guests', JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch guests from API:', err);
  }

  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('kava_guests');
    if (saved) {
      try {
        const parsed: KavaGuest[] = JSON.parse(saved);
        return eventId ? parsed.filter((g) => g.eventId === eventId) : parsed;
      } catch (e) {}
    }
  }
  return eventId ? INITIAL_GUESTS.filter((g) => g.eventId === eventId) : INITIAL_GUESTS;
}

/**
 * Add or update guest
 */
export async function addGuestApi(guestData: Partial<KavaGuest> & { eventId: string }): Promise<KavaGuest | null> {
  try {
    const res = await fetch(`${API_BASE}/guests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(guestData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to add guest to API:', err);
  }
  return null;
}

export interface WorkspaceEntitlementResult {
  userId: string;
  userEmail: string;
  workspaceId: string;
  planId: string;
  planName: string;
  activeEventsCount: number;
  maxEvents: number;
  isUnlimitedEvents: boolean;
  canCreateCapsule: boolean;
  isOverLimit: boolean;
  storageQuotaGb: number;
  usedStorageGb: number;
  maxGuestsPerEvent: number;
  maxUploads: number;
  allowedMediaTypes: string[];
  features: Record<string, boolean>;
}

/**
 * Fetch workspace entitlement from authoritative backend
 */
export async function fetchWorkspaceEntitlement(): Promise<WorkspaceEntitlementResult | null> {
  try {
    const res = await fetch(`${API_BASE}/subscription/entitlement`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch workspace entitlement from backend:', err);
  }
  return null;
}

/**
 * Check if the user is allowed to create another capsule based on backend source of truth
 */
export async function checkCapsuleCreationEntitlement(): Promise<{
  canCreate: boolean;
  isOverLimit: boolean;
  planName: string;
  planId: string;
  maxEvents: number;
  currentEvents: number;
}> {
  const entitlement = await fetchWorkspaceEntitlement();
  if (entitlement) {
    return {
      canCreate: entitlement.canCreateCapsule,
      isOverLimit: entitlement.isOverLimit,
      planName: entitlement.planName,
      planId: entitlement.planId,
      maxEvents: entitlement.maxEvents,
      currentEvents: entitlement.activeEventsCount,
    };
  }

  // Fallback to local plan calculation if network fails
  try {
    const savedActiveUser = typeof localStorage !== 'undefined' ? localStorage.getItem('kava_active_user') : null;
    const user = savedActiveUser ? JSON.parse(savedActiveUser) : null;
    const savedEvents = typeof localStorage !== 'undefined' ? localStorage.getItem('kava_events') : null;
    const events: any[] = savedEvents ? JSON.parse(savedEvents) : INITIAL_EVENTS;
    const planId = user?.plan || 'Premium';
    
    // Pro/Premium/Enterprise defaults
    const isPro = planId.toLowerCase() === 'premium' || planId.toLowerCase() === 'starter' || planId.toLowerCase() === 'enterprise';
    const maxEvents = planId.toLowerCase() === 'enterprise' ? 9999 : (isPro ? 10 : 1);
    const currentEvents = events.filter(e => e.status !== 'archived').length;
    const isOverLimit = maxEvents < 9999 && currentEvents >= maxEvents;

    return {
      canCreate: !isOverLimit,
      isOverLimit,
      planName: isPro ? 'Pro Studio' : 'Free Starter',
      planId,
      maxEvents,
      currentEvents,
    };
  } catch (e) {
    return {
      canCreate: true,
      isOverLimit: false,
      planName: 'Pro Studio',
      planId: 'Premium',
      maxEvents: 10,
      currentEvents: 1,
    };
  }
}

/**
 * Fetch subscription plans from backend
 */
export async function fetchSubscriptionPlans(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/subscription/plans`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch subscription plans from backend:', err);
  }
  return [];
}

/**
 * Upgrade user plan on backend
 */
export async function upgradePlanApi(planId: string, userId?: string): Promise<{ success: boolean; user?: any; entitlement?: any }> {
  try {
    const res = await fetch(`${API_BASE}/subscription/upgrade`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ planId, userId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user && typeof localStorage !== 'undefined') {
        const savedUser = localStorage.getItem('kava_active_user');
        const user = savedUser ? JSON.parse(savedUser) : {};
        localStorage.setItem('kava_active_user', JSON.stringify({ ...user, plan: data.user.plan }));
        window.dispatchEvent(new Event('kava_active_user_updated'));
      }
      return data;
    }
  } catch (err) {
    console.error('Failed to upgrade plan on API:', err);
  }
  return { success: false };
}

