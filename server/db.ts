import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { KavaEvent, KavaContribution, KavaGuest, EventJoinLog, EventSettings, KavaQrConfig } from '../src/types';
import { INITIAL_EVENTS, INITIAL_CONTRIBUTIONS, INITIAL_GUESTS } from '../src/data';
import { DEFAULT_QR_CONFIG } from '../src/lib/qrConfig';
import { DEFAULT_PLANS, SubscriptionPlan } from '../src/lib/billing';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const CONTRIBUTIONS_FILE = path.join(DATA_DIR, 'contributions.json');
const GUESTS_FILE = path.join(DATA_DIR, 'guests.json');
const JOIN_LOGS_FILE = path.join(DATA_DIR, 'join_logs.json');
const QR_CONFIG_FILE = path.join(DATA_DIR, 'qr_config.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');

export interface WorkspaceEntitlement {
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

export interface ServerUser {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  role: 'Workspace Owner' | 'Administrator' | 'Event Manager' | 'Team Member';
  workspaceId: string;
  workspaceName?: string;
  plan: 'Free' | 'Starter' | 'Premium' | 'Enterprise';
  status: 'Active' | 'Suspended';
  createdAt: string;
  avatar?: string;
}

export interface ServerSession {
  token: string;
  userId: string;
  email: string;
  workspaceId: string;
  createdAt: number;
  expiresAt: number;
}

const DEFAULT_USERS: ServerUser[] = [
  {
    id: 'usr-default',
    email: 'arthawibawa777@gmail.com',
    name: 'Artha Wibawa',
    displayName: 'Artha',
    role: 'Workspace Owner',
    workspaceId: 'ws-default',
    workspaceName: 'Main Production Workspace',
    plan: 'Premium',
    status: 'Active',
    createdAt: new Date().toISOString(),
    avatar: '',
  }
];

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  // Initialize with fallback
  writeJson(filePath, fallback);
  return fallback;
}

function writeJson<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// In-memory cache + persistent file storage
class Database {
  private events: KavaEvent[];
  private contributions: KavaContribution[];
  private guests: KavaGuest[];
  private joinLogs: EventJoinLog[];
  private qrConfig: KavaQrConfig;
  private users: ServerUser[];
  private sessions: ServerSession[];
  private plans: SubscriptionPlan[];

  constructor() {
    this.events = readJson<KavaEvent[]>(EVENTS_FILE, INITIAL_EVENTS);
    this.contributions = readJson<KavaContribution[]>(CONTRIBUTIONS_FILE, INITIAL_CONTRIBUTIONS);
    this.guests = readJson<KavaGuest[]>(GUESTS_FILE, INITIAL_GUESTS);
    this.joinLogs = readJson<EventJoinLog[]>(JOIN_LOGS_FILE, []);
    this.qrConfig = readJson<KavaQrConfig>(QR_CONFIG_FILE, DEFAULT_QR_CONFIG);
    this.users = readJson<ServerUser[]>(USERS_FILE, DEFAULT_USERS);
    this.sessions = readJson<ServerSession[]>(SESSIONS_FILE, []);
    this.plans = readJson<SubscriptionPlan[]>(PLANS_FILE, DEFAULT_PLANS);

    // Ensure all existing events have valid codes and invitation tokens
    let modified = false;
    this.events = this.events.map((ev) => {
      if (!ev.code) {
        ev.code = this.generateUniqueEventCode(ev.name);
        modified = true;
      }
      if (!ev.workspaceId) {
        ev.workspaceId = 'ws-default';
        modified = true;
      }
      if (!ev.hostId) {
        ev.hostId = 'usr-default';
        modified = true;
      }
      if (!ev.settings) {
        ev.settings = {
          guestUploadAllowed: true,
          instantReveal: true,
          allowedTypes: ['photo', 'video', 'voice', 'wish'],
          requireApproval: false,
          invitationToken: ev.code,
        };
        modified = true;
      } else if (!ev.settings.invitationToken) {
        ev.settings.invitationToken = ev.code;
        modified = true;
      }
      return ev;
    });

    if (modified) {
      this.saveEvents();
    }
  }

  private saveEvents() {
    writeJson(EVENTS_FILE, this.events);
  }

  private saveContributions() {
    writeJson(CONTRIBUTIONS_FILE, this.contributions);
  }

  private saveGuests() {
    writeJson(GUESTS_FILE, this.guests);
  }

  private saveJoinLogs() {
    writeJson(JOIN_LOGS_FILE, this.joinLogs);
  }

  private saveQrConfig() {
    writeJson(QR_CONFIG_FILE, this.qrConfig);
  }

  private saveUsers() {
    writeJson(USERS_FILE, this.users);
  }

  private saveSessions() {
    writeJson(SESSIONS_FILE, this.sessions);
  }

  private savePlans() {
    writeJson(PLANS_FILE, this.plans);
  }

  // --- Plans & Workspace Entitlements ---
  public getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  public updatePlans(newPlans: SubscriptionPlan[]): SubscriptionPlan[] {
    if (Array.isArray(newPlans) && newPlans.length > 0) {
      this.plans = newPlans;
      this.savePlans();
    }
    return this.plans;
  }

  public updateUserPlan(userId: string, planId: string): ServerUser | null {
    const user = this.users.find(u => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
    if (!user) return null;
    const normalizedPlan = (planId.charAt(0).toUpperCase() + planId.slice(1).toLowerCase()) as any;
    user.plan = ['Free', 'Starter', 'Premium', 'Enterprise'].includes(normalizedPlan) ? normalizedPlan : 'Premium';
    this.saveUsers();
    return user;
  }

  public getUserEntitlement(user?: ServerUser): WorkspaceEntitlement {
    const defaultUser = this.users[0] || DEFAULT_USERS[0];
    const targetUser = user || defaultUser;

    const userPlanId = targetUser.plan || 'Premium';
    const plan = this.plans.find(p => p.id.toLowerCase() === userPlanId.toLowerCase()) || 
                 this.plans.find(p => p.id === 'Premium') || 
                 DEFAULT_PLANS[1];

    const userEvents = this.getEvents(targetUser);
    const activeEvents = userEvents.filter(e => e.status !== 'archived');
    const eventsCount = activeEvents.length;

    const isUnlimited = !plan.maxEvents || plan.maxEvents >= 9999;
    const isOverLimit = !isUnlimited && eventsCount >= plan.maxEvents;
    const canCreateCapsule = isUnlimited || eventsCount < plan.maxEvents;

    return {
      userId: targetUser.id,
      userEmail: targetUser.email,
      workspaceId: targetUser.workspaceId,
      planId: plan.id,
      planName: plan.name,
      activeEventsCount: eventsCount,
      maxEvents: isUnlimited ? 9999 : plan.maxEvents,
      isUnlimitedEvents: isUnlimited,
      canCreateCapsule,
      isOverLimit,
      storageQuotaGb: plan.storageQuotaGb || 10,
      usedStorageGb: 0.12,
      maxGuestsPerEvent: plan.maxGuestsPerEvent || 500,
      maxUploads: plan.maxUploads || 2000,
      allowedMediaTypes: plan.allowedMediaTypes || ['photo', 'video', 'voice', 'wish'],
      features: {
        liveScreenAvailable: plan.liveScreenAvailable ?? true,
        invitationDesigner: plan.invitationDesigner ?? true,
        guestStudioCustomization: plan.guestStudioCustomization ?? true,
        analytics: plan.analytics ?? true,
        archiveDownloads: plan.archiveDownloads ?? true,
        customBranding: plan.customBranding ?? true,
        watermarkRemoval: plan.watermarkRemoval ?? true,
        frameCustomization: plan.frameCustomization ?? true,
        musicUpload: plan.musicUpload ?? true,
        videoGreeting: plan.videoGreeting ?? true,
        qrCustomization: plan.qrCustomization ?? true,
        apiAccess: plan.apiAccess ?? false,
        prioritySupport: plan.prioritySupport ?? true,
        aiFeatures: plan.aiFeatures ?? true,
        ...(plan.featureFlags || {}),
      }
    };
  }

  // --- Auth & Session Operations ---
  public getOrCreateUser(email: string, name?: string): ServerUser {
    const cleanEmail = email.trim().toLowerCase();
    let user = this.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      const resolvedName = name?.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Host User';
      user = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        email: cleanEmail,
        name: resolvedName,
        displayName: resolvedName.split(' ')[0],
        role: 'Workspace Owner',
        workspaceId: `ws-${Date.now().toString(36)}`,
        workspaceName: `${resolvedName}'s Workspace`,
        plan: 'Starter',
        status: 'Active',
        createdAt: new Date().toISOString(),
      };
      this.users.push(user);
      this.saveUsers();
    }
    return user;
  }

  public createSession(user: ServerUser): ServerSession {
    const token = `kava_${crypto.randomBytes(32).toString('hex')}`;
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    const session: ServerSession = {
      token,
      userId: user.id,
      email: user.email,
      workspaceId: user.workspaceId,
      createdAt: now,
      expiresAt,
    };

    // Keep active sessions, prune expired ones
    this.sessions = this.sessions.filter(s => s.expiresAt > now);
    this.sessions.push(session);
    this.saveSessions();
    return session;
  }

  public verifySession(token: string): { valid: boolean; user?: ServerUser; session?: ServerSession } {
    if (!token) return { valid: false };
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    const now = Date.now();

    const session = this.sessions.find(s => s.token === cleanToken && s.expiresAt > now);
    if (!session) {
      // If token starts with "kava_dev_" or matches default admin session, resolve default user
      if (cleanToken === 'kava_admin_default' || cleanToken.startsWith('kava_dev_')) {
        const defaultUser = this.users[0] || DEFAULT_USERS[0];
        return { valid: true, user: defaultUser };
      }
      return { valid: false };
    }

    const user = this.users.find(u => u.id === session.userId) || this.users.find(u => u.email.toLowerCase() === session.email.toLowerCase());
    if (!user || user.status === 'Suspended') {
      return { valid: false };
    }

    return { valid: true, user, session };
  }

  public invalidateSession(token: string): boolean {
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    const initialLen = this.sessions.length;
    this.sessions = this.sessions.filter(s => s.token !== cleanToken);
    if (this.sessions.length !== initialLen) {
      this.saveSessions();
      return true;
    }
    return false;
  }

  // --- Authorization & IDOR Access Checks ---
  public canUserAccessEvent(user: ServerUser, eventId: string, action: 'read' | 'write' | 'delete' = 'read'): boolean {
    if (!user) return false;
    const ev = this.events.find(e => e.id === eventId);
    if (!ev) return false;

    // Super Admin or Owner has full access
    if (user.role === 'Administrator') return true;

    // Direct owner or workspace match
    const isDirectOwner = ev.hostId === user.id || (ev.hostEmail && ev.hostEmail.toLowerCase() === user.email.toLowerCase());
    const isSameWorkspace = ev.workspaceId && user.workspaceId && ev.workspaceId === user.workspaceId;

    if (isDirectOwner) return true;

    if (isSameWorkspace) {
      if (action === 'delete') {
        return user.role === 'Workspace Owner';
      }
      if (action === 'write') {
        return user.role === 'Workspace Owner' || user.role === 'Event Manager';
      }
      return true; // Read is allowed for team members in same workspace
    }

    // Default workspace fallback for default user demo state
    if (user.id === 'usr-default' || user.email === 'arthawibawa777@gmail.com') {
      return true;
    }

    return false;
  }

  public canUserAccessContribution(user: ServerUser, contributionId: string, action: 'read' | 'write' | 'delete' = 'read'): boolean {
    const con = this.contributions.find(c => c.id === contributionId);
    if (!con) return false;
    return this.canUserAccessEvent(user, con.eventId, action);
  }

  public canUserAccessGuest(user: ServerUser, guestId: string, action: 'read' | 'write' | 'delete' = 'read'): boolean {
    const guest = this.guests.find(g => g.id === guestId);
    if (!guest) return false;
    return this.canUserAccessEvent(user, guest.eventId, action);
  }

  // --- Events API ---
  public getEvents(user?: ServerUser): KavaEvent[] {
    if (!user) return this.events;
    if (user.role === 'Administrator') return this.events;

    return this.events.filter(ev => {
      const isDirectOwner = ev.hostId === user.id || (ev.hostEmail && ev.hostEmail.toLowerCase() === user.email.toLowerCase());
      const isSameWorkspace = ev.workspaceId && user.workspaceId && ev.workspaceId === user.workspaceId;
      const isDefault = user.id === 'usr-default' || user.email === 'arthawibawa777@gmail.com';
      return isDirectOwner || isSameWorkspace || isDefault;
    });
  }

  // --- QR Branding & Configuration API ---
  public getQrConfig(): KavaQrConfig {
    return this.qrConfig;
  }

  public updateQrConfig(updates: Partial<KavaQrConfig>): KavaQrConfig {
    this.qrConfig = {
      ...this.qrConfig,
      ...updates,
      version: (this.qrConfig.version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };
    this.saveQrConfig();
    return this.qrConfig;
  }

  public resetQrConfig(): KavaQrConfig {
    this.qrConfig = {
      ...DEFAULT_QR_CONFIG,
      version: (this.qrConfig.version || 1) + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Super Administrator'
    };
    this.saveQrConfig();
    return this.qrConfig;
  }

  // --- Unique Event Code Generation ---
  public generateUniqueEventCode(eventName: string, excludeId?: string): string {
    const cleanName = (eventName || 'CAPSULE')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const prefix = cleanName.length > 6 ? cleanName.substring(0, 6) : (cleanName || 'CAPSULE');
    
    let candidate = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
    let attempts = 0;

    while (attempts < 200) {
      const exists = this.events.some(
        (e) =>
          e.id !== excludeId &&
          ((e.code && e.code.toUpperCase() === candidate) ||
            (e.settings?.invitationToken && e.settings.invitationToken.toUpperCase() === candidate))
      );
      if (!exists) {
        return candidate;
      }
      candidate = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      attempts++;
    }

    return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
  }

  public getEventByIdOrCode(idOrCode: string): KavaEvent | undefined {
    if (!idOrCode) return undefined;
    const clean = idOrCode.trim().toUpperCase();
    return this.events.find(
      (e) =>
        e.id === idOrCode ||
        (e.code && e.code.toUpperCase() === clean) ||
        (e.settings?.invitationToken && e.settings.invitationToken.toUpperCase() === clean)
    );
  }

  public createEvent(data: Partial<KavaEvent>): KavaEvent {
    const id = data.id || `evt-${Date.now()}`;
    const name = data.name || 'New Memory Capsule';
    const code = data.code || this.generateUniqueEventCode(name);
    const token = data.settings?.invitationToken || code;

    const newEvent: KavaEvent = {
      id,
      name,
      type: data.type || 'Celebration',
      date: data.date || new Date().toISOString().split('T')[0],
      location: data.location || 'Gathering',
      code: code.toUpperCase(),
      coverUrl: data.coverUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      coverPositionY: data.coverPositionY ?? 50,
      guestCount: data.guestCount || 0,
      status: data.status || 'active',
      hostId: data.hostId,
      hostName: data.hostName,
      hostEmail: data.hostEmail,
      workspaceId: data.workspaceId,
      settings: {
        guestUploadAllowed: true,
        instantReveal: true,
        allowedTypes: ['photo', 'video', 'voice', 'wish'],
        requireApproval: false,
        invitationToken: token.toUpperCase(),
        ...(data.settings || {}),
      },
      templateId: data.templateId,
      templateVersion: data.templateVersion,
      startDate: data.startDate,
      expirationDate: data.expirationDate,
      maxGuests: data.maxGuests,
    };

    this.events.unshift(newEvent);
    this.saveEvents();
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<KavaEvent>): KavaEvent | null {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const existing = this.events[idx];
    const updatedSettings = updates.settings
      ? { ...existing.settings, ...updates.settings }
      : existing.settings;

    const updatedEvent: KavaEvent = {
      ...existing,
      ...updates,
      settings: updatedSettings,
    };

    this.events[idx] = updatedEvent;
    this.saveEvents();
    return updatedEvent;
  }

  public regenerateEventCode(id: string): { event: KavaEvent; newCode: string } | null {
    const ev = this.events.find((e) => e.id === id);
    if (!ev) return null;

    const newCode = this.generateUniqueEventCode(ev.name, id);
    const updatedSettings: EventSettings = {
      ...(ev.settings || {
        guestUploadAllowed: true,
        instantReveal: true,
        allowedTypes: ['photo', 'video', 'voice', 'wish'],
        requireApproval: false,
      }),
      invitationToken: newCode,
    };

    const updatedEvent: KavaEvent = {
      ...ev,
      code: newCode,
      settings: updatedSettings,
    };

    const idx = this.events.findIndex((e) => e.id === id);
    this.events[idx] = updatedEvent;
    this.saveEvents();

    return { event: updatedEvent, newCode };
  }

  public deleteEvent(id: string): boolean {
    const initialLen = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    if (this.events.length !== initialLen) {
      this.saveEvents();
      // Clean up contributions & guests for this event
      this.contributions = this.contributions.filter((c) => c.eventId !== id);
      this.saveContributions();
      this.guests = this.guests.filter((g) => g.eventId !== id);
      this.saveGuests();
      return true;
    }
    return false;
  }

  // --- Contributions API ---
  public getContributions(eventId?: string): KavaContribution[] {
    if (eventId) {
      return this.contributions.filter((c) => c.eventId === eventId);
    }
    return this.contributions;
  }

  public addContribution(data: Omit<KavaContribution, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): KavaContribution {
    const id = data.id || `con-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = data.timestamp || new Date().toISOString();

    const targetEvent = this.events.find((e) => e.id === data.eventId);
    let initialStatus: 'approved' | 'pending' = 'approved';

    if (targetEvent?.settings) {
      const mode = targetEvent.settings.contributionApprovalMode || (targetEvent.settings.moderationApprovedOnly ? 'manual' : 'auto');
      const mixedConfig = targetEvent.settings.mixedApprovalTypes || { photo: true, video: true, voice: false, wish: false };

      if (mode === 'manual') {
        initialStatus = 'pending';
      } else if (mode === 'mixed') {
        const requiresApproval = mixedConfig[data.type] ?? (data.type === 'photo' || data.type === 'video');
        initialStatus = requiresApproval ? 'pending' : 'approved';
      } else {
        initialStatus = 'approved';
      }
    }

    const newCon: KavaContribution = {
      id,
      eventId: data.eventId,
      type: data.type,
      contributorName: data.contributorName || 'Guest Contributor',
      url: data.url,
      text: data.text,
      audioDuration: data.audioDuration,
      timestamp,
      isPinned: data.isPinned ?? false,
      status: data.status || initialStatus,
      metadata: data.metadata,
    };

    this.contributions.unshift(newCon);
    this.saveContributions();

    // Increment guest contributions count if guest identified
    if (data.metadata?.guestId) {
      const guest = this.guests.find((g) => g.id === data.metadata?.guestId);
      if (guest) {
        guest.contributionsCount = (guest.contributionsCount || 0) + 1;
        this.saveGuests();
      }
    }

    return newCon;
  }

  public updateContribution(id: string, updates: Partial<KavaContribution>): KavaContribution | null {
    const idx = this.contributions.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    this.contributions[idx] = { ...this.contributions[idx], ...updates };
    this.saveContributions();
    return this.contributions[idx];
  }

  public deleteContribution(id: string): boolean {
    const initLen = this.contributions.length;
    this.contributions = this.contributions.filter((c) => c.id !== id);
    if (this.contributions.length !== initLen) {
      this.saveContributions();
      return true;
    }
    return false;
  }

  // --- Guests API ---
  public getGuests(eventId?: string): KavaGuest[] {
    if (eventId) {
      return this.guests.filter((g) => g.eventId === eventId);
    }
    return this.guests;
  }

  public addOrUpdateGuest(guestData: Partial<KavaGuest> & { eventId: string }): KavaGuest {
    const existing = guestData.id ? this.guests.find((g) => g.id === guestData.id) : null;
    if (existing) {
      Object.assign(existing, guestData);
      this.saveGuests();
      return existing;
    }

    const newGuest: KavaGuest = {
      id: guestData.id || `gst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId: guestData.eventId,
      name: guestData.name || 'Guest Explorer',
      email: guestData.email,
      phone: guestData.phone,
      contributionsCount: guestData.contributionsCount || 0,
      joinedAt: guestData.joinedAt || new Date().toISOString(),
      status: guestData.status || 'active',
      device: guestData.device || 'Mobile',
      country: guestData.country || 'Global 🌍',
    };

    this.guests.unshift(newGuest);
    this.saveGuests();

    // Increment event guestCount
    const ev = this.events.find((e) => e.id === guestData.eventId);
    if (ev) {
      ev.guestCount = this.guests.filter((g) => g.eventId === ev.id).length;
      this.saveEvents();
    }

    return newGuest;
  }

  // --- Join & Verification API ---
  public validateAndJoin(
    rawCode: string,
    password?: string,
    joinMethod: 'code' | 'qr' | 'invitation_link' = 'code',
    guestInfo?: { name?: string; email?: string; device?: string; browser?: string; country?: string }
  ): {
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
  } {
    const cleanCode = (rawCode || '').trim().toUpperCase().replace(/[^A-Z0-9\-_]/g, '');
    if (!cleanCode) {
      return { success: false, status: 'invalid_code', errorMessage: 'Please enter a valid invitation code.' };
    }

    const event = this.events.find(
      (e) =>
        (e.code && e.code.toUpperCase() === cleanCode) ||
        (e.settings?.invitationToken && e.settings.invitationToken.toUpperCase() === cleanCode) ||
        e.id.toUpperCase() === cleanCode
    );

    if (!event) {
      return { success: false, status: 'invalid_code', errorMessage: `No active capsule found for code "${cleanCode}". Please verify your invitation code.` };
    }

    // Check status
    const isArchived = event.status === 'archived' || event.status === 'inactive' || event.status === 'draft';
    const isAccessDisabled = event.settings?.guestAccessEnabled === false;
    if (isArchived || isAccessDisabled) {
      return {
        success: false,
        status: isArchived ? 'archived' : 'disabled',
        event,
        errorMessage: isArchived
          ? `The memory capsule "${event.name}" has been archived by the host.`
          : `Guest access for "${event.name}" is currently paused by the host.`,
      };
    }

    // Check Opening Date
    const startDate = event.startDate || event.settings?.startDate;
    if (startDate) {
      const startMs = new Date(startDate).getTime();
      if (!isNaN(startMs) && Date.now() < startMs) {
        return {
          success: false,
          status: 'not_open',
          event,
          startDate,
          errorMessage: `"${event.name}" is scheduled to open on ${new Date(startDate).toLocaleString()}. Uploads and guest entry are not available yet.`,
        };
      }
    }

    // Check Expiration Date
    const expDate = event.expirationDate || event.settings?.expirationDate;
    if (expDate) {
      const expMs = new Date(expDate).getTime();
      if (!isNaN(expMs) && Date.now() > expMs) {
        return {
          success: false,
          status: 'expired',
          event,
          expirationDate: expDate,
          errorMessage: `This capsule expired on ${new Date(expDate).toLocaleString()}. Guest uploads and contributions are closed.`,
        };
      }
    }

    // Check Guest Capacity Limit
    const maxGuests = event.maxGuests || event.settings?.maxGuests;
    const currentGuests = this.guests.filter((g) => g.eventId === event.id).length;
    if (maxGuests && maxGuests > 0 && currentGuests >= maxGuests) {
      return {
        success: false,
        status: 'full',
        event,
        maxGuests,
        currentGuests,
        errorMessage: `"${event.name}" has reached its guest limit (${maxGuests} guests). Contact the host for access.`,
      };
    }

    // Check Password
    const requiresPassword = event.settings?.requiresPassword || false;
    const expectedPassword = event.settings?.eventPassword;
    if (requiresPassword && expectedPassword) {
      if (!password) {
        return {
          success: false,
          status: 'password_required',
          event,
          errorMessage: 'This memory capsule is password protected. Enter the event password to proceed.',
        };
      }
      if (password.trim() !== expectedPassword.trim()) {
        return {
          success: false,
          status: 'password_required',
          event,
          errorMessage: 'Incorrect event password. Please verify with your host and try again.',
        };
      }
    }

    // Register Join Log
    const joinLog: EventJoinLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId: event.id,
      timestamp: new Date().toISOString(),
      guestName: guestInfo?.name || 'Guest Explorer',
      device: guestInfo?.device || 'Mobile',
      browser: guestInfo?.browser || 'Browser',
      country: guestInfo?.country || 'Global 🌍',
      referralSource: 'Direct Invitation',
      joinMethod,
      status: 'success',
    };
    this.joinLogs.unshift(joinLog);
    this.saveJoinLogs();

    // Register Guest
    const guest = this.addOrUpdateGuest({
      eventId: event.id,
      name: guestInfo?.name || 'Guest Explorer',
      email: guestInfo?.email,
      device: (guestInfo?.device === 'Desktop' ? 'Desktop' : 'Mobile'),
      country: guestInfo?.country || 'Global 🌍',
      status: 'active',
    });

    // Update event join history in settings
    const currentHistory = event.settings?.joinHistory || [];
    event.settings = {
      ...event.settings,
      joinHistory: [joinLog, ...currentHistory],
    };
    event.guestCount = this.guests.filter((g) => g.eventId === event.id).length;
    this.saveEvents();

    return {
      success: true,
      status: 'valid',
      event,
      guest,
      joinLog,
    };
  }

  public resetToDefaults() {
    this.events = INITIAL_EVENTS;
    this.contributions = INITIAL_CONTRIBUTIONS;
    this.guests = INITIAL_GUESTS;
    this.joinLogs = [];
    this.saveEvents();
    this.saveContributions();
    this.saveGuests();
    this.saveJoinLogs();
  }
}

export const db = new Database();
