import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, X, RotateCcw, Globe, Link2, Shield, Trash2, 
  Settings, CheckCircle2, AlertCircle, Loader2, HelpCircle, 
  Activity, Database, Search, Filter, Download, RefreshCw, 
  AlertTriangle, Key, Upload, Lock, Unlock, Sliders, 
  Calendar, Mail, Plus, ChevronDown, ChevronRight, Copy, Check,
  Share2, Eye, Server, Cloud, ExternalLink, Palette, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { KavaEvent } from '../types';
import BrandKitTab from './BrandKitTab';
import { getUserSubscription, isFeatureAvailableInUserPlan } from '../lib/billing';

interface WorkspaceSettingsTabProps {
  currentWorkspace: { id: string; name: string; host: string };
  events: KavaEvent[];
  onUpdateEventSettings: (eventId: string, updates: Partial<KavaEvent>) => void;
  currentUser: any;
  onWorkspaceUpdate: (updatedWorkspace: { name: string }) => void;
  isWorkspaceSettingsDirty: boolean;
  setIsWorkspaceSettingsDirty: (dirty: boolean) => void;
  setToast: (toast: { title: string; description: string; items: string[] } | null) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  workspaceBrandLogo?: string;
  setWorkspaceBrandLogo?: (logo: string) => void;
  workspaceBrandPrimaryColor?: string;
  setWorkspaceBrandPrimaryColor?: (color: string) => void;
  workspaceBrandAccentColor?: string;
  setWorkspaceBrandAccentColor?: (color: string) => void;
  workspaceBrandTypography?: string;
  setWorkspaceBrandTypography?: (font: string) => void;
  isWorkspaceBrandDirty?: boolean;
  setIsWorkspaceBrandDirty?: (dirty: boolean) => void;
  brandPreviewTab?: 'guest_room' | 'invitation' | 'live_screen' | 'qr_landing' | 'email' | 'dashboard';
  setBrandPreviewTab?: (tab: any) => void;
  logoInputRef?: React.RefObject<HTMLInputElement>;
}

interface IntegrationState {
  id: string;
  name: string;
  category: 'storage' | 'productivity' | 'automation' | 'communication' | 'developer';
  icon?: any;
  description: string;
  connected: boolean;
  syncStatus: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  config: Record<string, string>;
  logs: Array<{ timestamp: string; type: 'info' | 'success' | 'error'; message: string }>;
}

export default function WorkspaceSettingsTab({
  currentWorkspace,
  events,
  onUpdateEventSettings,
  currentUser,
  onWorkspaceUpdate,
  isWorkspaceSettingsDirty,
  setIsWorkspaceSettingsDirty,
  setToast,
  activeTab,
  setActiveTab,
  workspaceBrandLogo = '',
  setWorkspaceBrandLogo = () => {},
  workspaceBrandPrimaryColor = '#0F172A',
  setWorkspaceBrandPrimaryColor = () => {},
  workspaceBrandAccentColor = '#111111',
  setWorkspaceBrandAccentColor = () => {},
  workspaceBrandTypography = 'Inter',
  setWorkspaceBrandTypography = () => {},
  isWorkspaceBrandDirty = false,
  setIsWorkspaceBrandDirty = () => {},
  brandPreviewTab = 'guest_room',
  setBrandPreviewTab = () => {},
  logoInputRef = { current: null }
}: WorkspaceSettingsTabProps) {
  // Sub-tab navigation: 'general' vs 'brand'
  const [workspaceSettingsSubTab, setWorkspaceSettingsSubTab] = useState<'general' | 'brand'>(() => {
    return activeTab === 'brand' ? 'brand' : 'general';
  });

  useEffect(() => {
    if (activeTab === 'brand') {
      setWorkspaceSettingsSubTab('brand');
    }
  }, [activeTab]);

  // Collapsed Advanced Settings State
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const localLogoFileRef = useRef<HTMLInputElement>(null);

  // Subscription plan capabilities
  const isCustomDomainSupported = isFeatureAvailableInUserPlan('customDomain') || currentWorkspace.id === 'ws-artha';

  // Snapshot/Original state for Rollback & Reset
  const originalStateRef = useRef<Record<string, any>>({});

  // 1. Identity & Slugs States
  const [wsName, setWsName] = useState('');
  const [wsSlug, setWsSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [slugHistory, setSlugHistory] = useState<string[]>([]);

  const handleGenerateSlug = () => {
    const base = (wsName || currentWorkspace.name || 'workspace').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const rand = Math.floor(1000 + Math.random() * 9000);
    setWsSlug(`${base}-${rand}`);
    setSlugStatus('available');
  };

  // 2. Custom Domain States
  const [wsDomain, setWsDomain] = useState('');
  const [isDomainVerified, setIsDomainVerified] = useState(false);
  const [sslStatus, setSslStatus] = useState<'Active' | 'Pending' | 'None'>('None');
  const [dnsPropagation, setDnsPropagation] = useState(0); // 0, 50, 100
  const [dnsVerifyLoading, setDnsVerifyLoading] = useState(false);
  const [domainAutoRenew, setDomainAutoRenew] = useState(true);
  const [dnsLogs, setDnsLogs] = useState<string[]>([]);

  // 3. Privacy, General, and Backups
  const [privacy, setPrivacy] = useState<'Public' | 'Unlisted' | 'Private'>('Public');
  const [timeZone, setTimeZone] = useState('UTC-08:00 (Pacific Time)');
  const [language, setLanguage] = useState('English');
  const [region, setRegion] = useState('us-east1');
  const [backupSchedule, setBackupSchedule] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Disabled'>('Weekly');
  const [backups, setBackups] = useState<Array<{ id: string; timestamp: string; size: string; eventsCount: number }>>([]);
  const [restoringBackupId, setRestoringBackupId] = useState<string | null>(null);

  // 4. Default Event Settings
  const [defaultTheme, setDefaultTheme] = useState('elegant-dark');
  const [defaultDuration, setDefaultDuration] = useState('6');
  const [defaultGuestLimit, setDefaultGuestLimit] = useState('200');
  const [defaultRequireEmail, setDefaultRequireEmail] = useState(true);

  // 5. Integrations Center
  const [activeIntegrationTab, setActiveIntegrationTab] = useState<'all' | 'storage' | 'productivity' | 'automation' | 'communication' | 'developer'>('all');
  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationState[]>([]);
  const [testingIntegrationId, setTestingIntegrationId] = useState<string | null>(null);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<Array<{ key: string; name: string; created: string }>>([]);
  const [newKeyName, setNewKeyName] = useState('');

  // 6. Audit Log & Operations
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; timestamp: string; action: string; actor: string; category: string; ip: string }>>([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState('All');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [transferRole, setTransferRole] = useState('admin');

  // Loading & Global States
  const [isSaving, setIsSaving] = useState(false);
  const [showBackupSuccess, setShowBackupSuccess] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Initialize and load settings from database (localStorage)
  useEffect(() => {
    const wsId = currentWorkspace.id;

    // Load values or set defaults
    const savedName = localStorage.getItem(`kava_ws_name_${wsId}`) || currentWorkspace.name;
    const savedSlug = localStorage.getItem(`kava_ws_slug_${wsId}`) || wsId.replace('ws-', '');
    const savedDomain = localStorage.getItem(`kava_ws_domain_${wsId}`) || 'kava.arthastudio.com';
    const savedDomainVerified = localStorage.getItem(`kava_ws_domain_verified_${wsId}`) === 'true';
    const savedSsl = (localStorage.getItem(`kava_ws_domain_ssl_${wsId}`) || 'Active') as any;
    const savedProp = Number(localStorage.getItem(`kava_ws_domain_prop_${wsId}`) || '100');
    const savedAutoRenew = localStorage.getItem(`kava_ws_domain_autorenew_${wsId}`) !== 'false';
    const savedPrivacy = (localStorage.getItem(`kava_ws_privacy_${wsId}`) || 'Public') as any;
    const savedTimeZone = localStorage.getItem(`kava_ws_timezone_${wsId}`) || 'UTC-08:00 (Pacific Time)';
    const savedLanguage = localStorage.getItem(`kava_ws_language_${wsId}`) || 'English';
    const savedRegion = localStorage.getItem(`kava_ws_region_${wsId}`) || 'us-east1';
    const savedBackupSchedule = (localStorage.getItem(`kava_ws_backup_${wsId}`) || 'Weekly') as any;

    // Default Event Settings
    const savedTheme = localStorage.getItem(`kava_ws_def_theme_${wsId}`) || 'elegant-dark';
    const savedDuration = localStorage.getItem(`kava_ws_def_duration_${wsId}`) || '6';
    const savedGuestLimit = localStorage.getItem(`kava_ws_def_guestlimit_${wsId}`) || '200';
    const savedRequireEmail = localStorage.getItem(`kava_ws_def_requireemail_${wsId}`) !== 'false';

    setWsName(savedName);
    setWsSlug(savedSlug);
    setWsDomain(savedDomain);
    setIsDomainVerified(savedDomainVerified);
    setSslStatus(savedSsl);
    setDnsPropagation(savedProp);
    setDomainAutoRenew(savedAutoRenew);
    setPrivacy(savedPrivacy);
    setTimeZone(savedTimeZone);
    setLanguage(savedLanguage);
    setRegion(savedRegion);
    setBackupSchedule(savedBackupSchedule);

    setDefaultTheme(savedTheme);
    setDefaultDuration(savedDuration);
    setDefaultGuestLimit(savedGuestLimit);
    setDefaultRequireEmail(savedRequireEmail);

    // Initialize snapshot for rollback
    originalStateRef.current = {
      wsName: savedName,
      wsSlug: savedSlug,
      wsDomain: savedDomain,
      isDomainVerified: savedDomainVerified,
      sslStatus: savedSsl,
      dnsPropagation: savedProp,
      domainAutoRenew: savedAutoRenew,
      privacy: savedPrivacy,
      timeZone: savedTimeZone,
      language: savedLanguage,
      region: savedRegion,
      backupSchedule: savedBackupSchedule,
      defaultTheme: savedTheme,
      defaultDuration: savedDuration,
      defaultGuestLimit: savedGuestLimit,
      defaultRequireEmail: savedRequireEmail
    };

    // Load Slug History
    const history = localStorage.getItem(`kava_ws_slug_history_${wsId}`);
    if (history) {
      setSlugHistory(JSON.parse(history));
    } else {
      setSlugHistory([`${savedSlug}-legacy`, `${savedSlug}-v1`]);
    }

    // Load Backups
    const localBackups = localStorage.getItem(`kava_ws_backups_${wsId}`);
    if (localBackups) {
      setBackups(JSON.parse(localBackups));
    } else {
      const initialBackups = [
        { id: 'bak-1', timestamp: '2026-07-15T09:30:00Z', size: '14.2 MB', eventsCount: 2 },
        { id: 'bak-2', timestamp: '2026-07-01T02:00:00Z', size: '11.8 MB', eventsCount: 1 }
      ];
      setBackups(initialBackups);
      localStorage.setItem(`kava_ws_backups_${wsId}`, JSON.stringify(initialBackups));
    }

    // Load Integrations
    const localIntegrations = localStorage.getItem(`kava_ws_integrations_${wsId}`);
    if (localIntegrations) {
      setIntegrations(JSON.parse(localIntegrations));
    } else {
      const initialIntegrations: IntegrationState[] = [
        {
          id: 'aws-s3',
          name: 'Amazon S3 Bucket Storage',
          category: 'storage',
          icon: Server,
          description: 'Archive high-fidelity guest assets directly into secure Amazon S3 Buckets.',
          connected: false,
          syncStatus: 'disconnected',
          lastSync: 'Never',
          config: { bucketName: '', accessKey: '', secretKey: '', region: 'us-east-1' },
          logs: []
        },
        {
          id: 'gcs',
          name: 'Google Cloud Storage',
          category: 'storage',
          icon: Cloud,
          description: 'Synchronize media assets with your Google Cloud platform container bucket.',
          connected: true,
          syncStatus: 'connected',
          lastSync: new Date().toLocaleDateString(),
          config: { bucketName: 'kava-personal-assets', projectId: 'kava-prod-2026' },
          logs: [
            { timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'success', message: 'Asset batch sync completed. Transferred 14 files.' },
            { timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'info', message: 'Google Cloud connection established successfully.' }
          ]
        },
        {
          id: 'r2',
          name: 'Cloudflare R2 Storage',
          category: 'storage',
          icon: Globe,
          description: 'Zero egress cost asset storage leveraging Cloudflare edge server systems.',
          connected: false,
          syncStatus: 'disconnected',
          lastSync: 'Never',
          config: { bucketName: '', accountId: '', accessKey: '', secretKey: '' },
          logs: []
        },
        {
          id: 'gdrive',
          name: 'Google Drive Sync',
          category: 'productivity',
          icon: Folder2Icon,
          description: 'Auto-sync photos & videos directly into a dedicated Google Drive folder.',
          connected: false,
          syncStatus: 'disconnected',
          lastSync: 'Never',
          config: { folderId: '', autoSync: 'true' },
          logs: []
        },
        {
          id: 'dropbox',
          name: 'Dropbox Personal / Team',
          category: 'productivity',
          icon: Share2,
          description: 'Backup media resources directly to cloud-based Dropbox directories.',
          connected: false,
          syncStatus: 'disconnected',
          lastSync: 'Never',
          config: { folderPath: '' },
          logs: []
        },
        {
          id: 'zapier',
          name: 'Zapier Webhook Automations',
          category: 'automation',
          icon: Sliders,
          description: 'Forward registration events, guest check-ins, and media uploads directly to Zapier.',
          connected: false,
          syncStatus: 'disconnected',
          lastSync: 'Never',
          config: { webhookUrl: '' },
          logs: []
        },
        {
          id: 'webhooks',
          name: 'Custom Webhooks (REST API)',
          category: 'automation',
          icon: ExternalLink,
          description: 'Register REST endpoints to consume live event triggers instantly on contribution.',
          connected: false,
          syncStatus: 'disconnected',
          lastSync: 'Never',
          config: { webhookUrl: '', secretToken: '' },
          logs: []
        },
        {
          id: 'smtp',
          name: 'SMTP Email Sender Server',
          category: 'communication',
          icon: Mail,
          description: 'Deliver invitations and RSVP notifications via your company SMTP server IP.',
          connected: true,
          syncStatus: 'connected',
          lastSync: new Date(Date.now() - 1800000).toLocaleTimeString(),
          config: { host: 'smtp.sendgrid.net', port: '587', username: 'apikey', encryption: 'STARTTLS' },
          logs: [
            { timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'success', message: 'SMTP Test connection passed.' },
            { timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'success', message: 'Dispatched 43 RSVP confirmation emails.' }
          ]
        },
        {
          id: 'analytics',
          name: 'Google Analytics (GA4)',
          category: 'communication',
          icon: Activity,
          description: 'Track guest visits, conversion, scroll rates, and interactive photo views.',
          connected: false,
          syncStatus: 'disconnected',
          lastSync: 'Never',
          config: { measurementId: '' },
          logs: []
        }
      ];
      setIntegrations(initialIntegrations);
      localStorage.setItem(`kava_ws_integrations_${wsId}`, JSON.stringify(initialIntegrations));
    }

    // Load API keys
    const localKeys = localStorage.getItem(`kava_ws_api_keys_${wsId}`);
    if (localKeys) {
      setApiKeys(JSON.parse(localKeys));
    } else {
      const initialKeys = [
        { key: 'kv_live_9f4bc3a17e884b22c7a916', name: 'Production Sync Token', created: '2026-07-02' }
      ];
      setApiKeys(initialKeys);
      localStorage.setItem(`kava_ws_api_keys_${wsId}`, JSON.stringify(initialKeys));
    }

    // Load Audit Logs
    const localAudit = localStorage.getItem(`kava_ws_audit_${wsId}`);
    if (localAudit) {
      setAuditLogs(JSON.parse(localAudit));
    } else {
      const initialAudit = [
        { id: 'aud-1', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'DNS configuration verified successfully', actor: currentWorkspace.host, category: 'Domain', ip: '192.168.1.42' },
        { id: 'aud-2', timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'Google Cloud Storage integration connected', actor: currentWorkspace.host, category: 'Integration', ip: '192.168.1.42' },
        { id: 'aud-3', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'Backup schedule updated to Weekly', actor: currentWorkspace.host, category: 'Backup', ip: '192.168.1.42' },
        { id: 'aud-4', timestamp: new Date(Date.now() - 172800000).toISOString(), action: 'Workspace billing tier adjusted to Premium', actor: 'Super Admin Server', category: 'Security', ip: '10.0.4.15' }
      ];
      setAuditLogs(initialAudit);
      localStorage.setItem(`kava_ws_audit_${wsId}`, JSON.stringify(initialAudit));
    }

    setIsWorkspaceSettingsDirty(false);
  }, [currentWorkspace.id]);

  // Track state changes to mark dirty
  useEffect(() => {
    if (!originalStateRef.current.wsName) return; // Wait until loaded

    const isDirty = 
      wsName !== originalStateRef.current.wsName ||
      wsSlug !== originalStateRef.current.wsSlug ||
      wsDomain !== originalStateRef.current.wsDomain ||
      isDomainVerified !== originalStateRef.current.isDomainVerified ||
      sslStatus !== originalStateRef.current.sslStatus ||
      dnsPropagation !== originalStateRef.current.dnsPropagation ||
      domainAutoRenew !== originalStateRef.current.domainAutoRenew ||
      privacy !== originalStateRef.current.privacy ||
      timeZone !== originalStateRef.current.timeZone ||
      language !== originalStateRef.current.language ||
      region !== originalStateRef.current.region ||
      backupSchedule !== originalStateRef.current.backupSchedule ||
      defaultTheme !== originalStateRef.current.defaultTheme ||
      defaultDuration !== originalStateRef.current.defaultDuration ||
      defaultGuestLimit !== originalStateRef.current.defaultGuestLimit ||
      defaultRequireEmail !== originalStateRef.current.defaultRequireEmail;

    setIsWorkspaceSettingsDirty(isDirty);
  }, [
    wsName, wsSlug, wsDomain, isDomainVerified, sslStatus, 
    dnsPropagation, domainAutoRenew, privacy, timeZone, language, 
    region, backupSchedule, defaultTheme, defaultDuration, 
    defaultGuestLimit, defaultRequireEmail
  ]);

  // Helper to safely retrieve integration icon component even after JSON deserialization
  const getIntegrationIcon = (id: string) => {
    switch (id) {
      case 'aws-s3': return Server;
      case 'gcs': return Cloud;
      case 'r2': return Globe;
      case 'gdrive': return Sliders;
      case 'dropbox': return Share2;
      case 'zapier': return Sliders;
      case 'webhooks': return ExternalLink;
      case 'smtp': return Mail;
      case 'analytics': return Activity;
      default: return Server;
    }
  };

  // Helper placeholder for folder icon
  function Folder2Icon(props: any) {
    return <Sliders {...props} />;
  }

  // Live Slug Validation (with debounce simulation)
  useEffect(() => {
    if (!wsSlug) {
      setSlugStatus('idle');
      return;
    }
    setSlugStatus('checking');
    const timer = setTimeout(() => {
      // Uniqueness rule: check if any other workspace in kava_admin_workspaces uses this slug
      const savedWorkspaces = localStorage.getItem('kava_admin_workspaces');
      let taken = false;
      if (savedWorkspaces) {
        try {
          const parsed = JSON.parse(savedWorkspaces);
          // If there is another workspace ID with this slug (excluding current)
          taken = parsed.some((w: any) => w.id !== currentWorkspace.id && w.slug === wsSlug);
        } catch (e) {}
      }
      
      // Additional simple check for mock demo taken slugs
      if (wsSlug === 'taken' || wsSlug === 'admin' || wsSlug === 'kava') {
        taken = true;
      }

      setSlugStatus(taken ? 'taken' : 'available');
    }, 400);

    return () => clearTimeout(timer);
  }, [wsSlug, currentWorkspace.id]);

  // Auto generate slug from display name
  const handleAutoGenerateSlug = () => {
    const generated = wsName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setWsSlug(generated);
    setToast({
      title: "URL Slug Auto-Generated",
      description: `Generated compatible URL path parameter "${generated}" successfully.`,
      items: ["Alphanumeric sanitized", "Altered hyphens to separators"]
    });
  };

  // Simulated DNS Verification
  const handleVerifyDns = () => {
    if (!wsDomain) {
      setToast({
        title: "Validation Error",
        description: "Please specify a valid custom domain name before requesting DNS link status.",
        items: ["Domain field cannot be empty."]
      });
      return;
    }

    setDnsVerifyLoading(true);
    setDnsLogs([
      `[00:01] INFO: Querying Authoritative Name Servers for "${wsDomain}"...`,
      `[00:05] INFO: Attempting secure handshakes with Cloudflare secure nodes...`
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step === 1) {
        setDnsLogs(prev => [...prev, `[00:15] CNAME lookup: Expected "kava.secure.edge" | Resolved: "kava.secure.edge"`]);
        setDnsPropagation(50);
      } else if (step === 2) {
        setDnsLogs(prev => [...prev, `[00:32] SSL certificate validation: Checking Let's Encrypt authority parameters...`]);
        setDnsPropagation(100);
        setSslStatus('Active');
        setIsDomainVerified(true);
      } else if (step === 3) {
        setDnsLogs(prev => [...prev, `[00:45] SUCCESS: SSL issued. DNS propagated to all global edge server containers.`]);
        clearInterval(interval);
        setDnsVerifyLoading(false);
        setToast({
          title: "Custom Domain Connected",
          description: `Enterprise DNS routing parameters for "${wsDomain}" successfully mapped.`,
          items: ["Let's Encrypt SSL Activated", "Global Edge CDN synchronized"]
        });
        
        // Log to audit log
        addAuditLog(`Connected and verified custom domain ${wsDomain}`, 'Domain');
      }
    }, 500);
  };

  const addAuditLog = (action: string, category: string) => {
    const newLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      actor: currentWorkspace.host,
      category,
      ip: '192.168.1.42'
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem(`kava_ws_audit_${currentWorkspace.id}`, JSON.stringify(updated));
  };

  const handleDisconnectDomain = () => {
    setWsDomain('');
    setIsDomainVerified(false);
    setSslStatus('None');
    setDnsPropagation(0);
    setDnsLogs([]);
    setToast({
      title: "Custom Domain Disconnected",
      description: "Direct URL domain mapping was removed. Custom URL redirects deleted.",
      items: ["Restored to standard kava.co/workspace/ path routing."]
    });
    addAuditLog(`Disconnected custom domain`, 'Domain');
  };

  // Connect/Disconnect Integration
  const handleToggleIntegration = (id: string) => {
    const updated = integrations.map(item => {
      if (item.id === id) {
        const nextConnected = !item.connected;
        return {
          ...item,
          connected: nextConnected,
          syncStatus: nextConnected ? 'connected' : 'disconnected' as any,
          lastSync: nextConnected ? new Date().toLocaleDateString() : 'Never',
          logs: nextConnected ? [
            { timestamp: new Date().toISOString(), type: 'success' as const, message: `${item.name} connected.` }
          ] : []
        };
      }
      return item;
    });
    setIntegrations(updated);
    localStorage.setItem(`kava_ws_integrations_${currentWorkspace.id}`, JSON.stringify(updated));
    setToast({
      title: "Integration Parameters Toggled",
      description: `Updated status settings for selected integration node.`,
      items: ["Synchronized in real-time with server hooks"]
    });
  };

  // Test Connection
  const handleTestIntegration = (id: string) => {
    setTestingIntegrationId(id);
    setTimeout(() => {
      const updated = integrations.map(item => {
        if (item.id === id) {
          const newLog = {
            timestamp: new Date().toISOString(),
            type: 'success' as const,
            message: `Mock Connection test successful. Received HTTP 200 OK payload verification handshake.`
          };
          return {
            ...item,
            syncStatus: 'connected' as const,
            lastSync: new Date().toLocaleTimeString(),
            logs: [newLog, ...(item.logs || [])]
          };
        }
        return item;
      });
      setIntegrations(updated);
      localStorage.setItem(`kava_ws_integrations_${currentWorkspace.id}`, JSON.stringify(updated));
      setTestingIntegrationId(null);
      setToast({
        title: "Connection Test Successful",
        description: "Target server validated credential authorizations and schema routes perfectly.",
        items: ["HTTP Status 200 Received", "Verified read/write access parameters"]
      });
      addAuditLog(`Tested connection for integration ${id}`, 'Integration');
    }, 1200);
  };

  // Add API Key
  const handleCreateApiKey = () => {
    if (!newKeyName) {
      setToast({
        title: "Validation Error",
        description: "API Key description name cannot be blank.",
        items: ["Name helps map access points"]
      });
      return;
    }
    const token = `kv_live_${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    const newKey = {
      key: token,
      name: newKeyName,
      created: new Date().toISOString().split('T')[0]
    };
    const updated = [newKey, ...apiKeys];
    setApiKeys(updated);
    localStorage.setItem(`kava_ws_api_keys_${currentWorkspace.id}`, JSON.stringify(updated));
    setNewKeyName('');
    setToast({
      title: "API Token Generated",
      description: "Save this key securely. It authorizes programmatic access.",
      items: ["Direct write/read scopes included", "HTTPS Transport validation required"]
    });
    addAuditLog(`Generated API key "${newKeyName}"`, 'Security');
  };

  // Remove API Key
  const handleDeleteApiKey = (keyToDelete: string) => {
    const updated = apiKeys.filter(k => k.key !== keyToDelete);
    setApiKeys(updated);
    localStorage.setItem(`kava_ws_api_keys_${currentWorkspace.id}`, JSON.stringify(updated));
    setToast({
      title: "API Token Revoked",
      description: " پروگرامmatic credentials disconnected immediately from edge endpoints.",
      items: ["Connections using this token will throw unauthorized alerts"]
    });
    addAuditLog(`Revoked API key`, 'Security');
  };

  // Backup Creation
  const handleCreateBackup = () => {
    const wsId = currentWorkspace.id;
    const backupId = `bak-${Date.now()}`;
    const newBackup = {
      id: backupId,
      timestamp: new Date().toISOString(),
      size: `${(Math.random() * 5 + 10).toFixed(1)} MB`,
      eventsCount: events.length || 1
    };
    const updated = [newBackup, ...backups];
    setBackups(updated);
    localStorage.setItem(`kava_ws_backups_${wsId}`, JSON.stringify(updated));
    
    setShowBackupSuccess(true);
    setTimeout(() => setShowBackupSuccess(false), 2000);

    setToast({
      title: "Snapshot Backup Created",
      description: "Direct offline database backup initialized and stored locally.",
      items: ["Compressed JSON manifest", "Asset lookup tables fully mapped"]
    });
    addAuditLog(`Created local workspace backup ${backupId}`, 'Backup');
  };

  // Backup Restoration
  const handleRestoreBackup = (bId: string) => {
    setRestoringBackupId(bId);
    
    setTimeout(() => {
      // Restore default values from mock backup logic
      setWsName('Personal Studio Restored');
      setWsSlug('personal-studio-restored');
      setWsDomain('kava.arthastudio.com');
      setIsDomainVerified(true);
      setSslStatus('Active');
      setPrivacy('Public');

      setRestoringBackupId(null);
      setToast({
        title: "Backup Restored Successfully",
        description: "Reverted workspace configurations to target snapshot.",
        items: ["Reloaded original brand settings", "Database tables re-indexed"]
      });
      addAuditLog(`Restored backup ${bId}`, 'Backup');
    }, 1500);
  };

  // Save Settings
  const handleSaveAll = () => {
    if (!wsName.trim()) {
      setToast({
        title: "Save Failed",
        description: "Workspace Name cannot be left completely blank.",
        items: ["Display Name is critical for branding and notifications."]
      });
      return;
    }

    if (slugStatus === 'taken') {
      setToast({
        title: "Save Failed",
        description: "The specified URL slug is currently registered by another user.",
        items: ["Choose a different slug parameter."]
      });
      return;
    }

    setIsSaving(true);
    const wsId = currentWorkspace.id;

    setTimeout(() => {
      try {
        // Save to individual keys
        localStorage.setItem(`kava_ws_name_${wsId}`, wsName);
        localStorage.setItem(`kava_ws_slug_${wsId}`, wsSlug);
        localStorage.setItem(`kava_ws_domain_${wsId}`, wsDomain);
        localStorage.setItem(`kava_ws_domain_verified_${wsId}`, String(isDomainVerified));
        localStorage.setItem(`kava_ws_domain_ssl_${wsId}`, sslStatus);
        localStorage.setItem(`kava_ws_domain_prop_${wsId}`, String(dnsPropagation));
        localStorage.setItem(`kava_ws_domain_autorenew_${wsId}`, String(domainAutoRenew));
        localStorage.setItem(`kava_ws_privacy_${wsId}`, privacy);
        localStorage.setItem(`kava_ws_timezone_${wsId}`, timeZone);
        localStorage.setItem(`kava_ws_language_${wsId}`, language);
        localStorage.setItem(`kava_ws_region_${wsId}`, region);
        localStorage.setItem(`kava_ws_backup_${wsId}`, backupSchedule);

        // Save Default Event Settings
        localStorage.setItem(`kava_ws_def_theme_${wsId}`, defaultTheme);
        localStorage.setItem(`kava_ws_def_duration_${wsId}`, defaultDuration);
        localStorage.setItem(`kava_ws_def_guestlimit_${wsId}`, defaultGuestLimit);
        localStorage.setItem(`kava_ws_def_requireemail_${wsId}`, String(defaultRequireEmail));

        // Save slug history if current slug is changed
        if (wsSlug !== originalStateRef.current.wsSlug && !slugHistory.includes(originalStateRef.current.wsSlug)) {
          const updatedHistory = [originalStateRef.current.wsSlug, ...slugHistory];
          setSlugHistory(updatedHistory);
          localStorage.setItem(`kava_ws_slug_history_${wsId}`, JSON.stringify(updatedHistory));
        }

        // Update the central workspace roster to sync with Super Admin Portal and layout!
        const savedWorkspaces = localStorage.getItem('kava_admin_workspaces');
        if (savedWorkspaces) {
          const parsed = JSON.parse(savedWorkspaces);
          const updated = parsed.map((ws: any) => {
            if (ws.id === wsId) {
              return { 
                ...ws, 
                name: wsName,
                slug: wsSlug,
                status: 'Active'
              };
            }
            return ws;
          });
          localStorage.setItem('kava_admin_workspaces', JSON.stringify(updated));
        }

        // Update the current local storage user as well if impersonated or matching
        const savedActiveUser = localStorage.getItem('kava_active_user');
        if (savedActiveUser) {
          try {
            const uObj = JSON.parse(savedActiveUser);
            if (uObj.name === currentWorkspace.host) {
              uObj.workspaceName = wsName;
              localStorage.setItem('kava_active_user', JSON.stringify(uObj));
            }
          } catch (e) {}
        }

        // Trigger dynamic layout updates
        onWorkspaceUpdate({ name: wsName });

        // Update snapshot reference
        originalStateRef.current = {
          wsName, wsSlug, wsDomain, isDomainVerified, sslStatus, 
          dnsPropagation, domainAutoRenew, privacy, timeZone, language, 
          region, backupSchedule, defaultTheme, defaultDuration, 
          defaultGuestLimit, defaultRequireEmail
        };

        setIsWorkspaceSettingsDirty(false);
        setIsSaving(false);

        setToast({
          title: "Configurations Synchronized",
          description: "All workspace parameters, integration center states, and routing paths successfully saved.",
          items: ["Synchronized across events & guest interfaces", "Propagated to Super Admin controllers", "Re-indexed system slug route registries"]
        });

        addAuditLog("Saved full workspace configurations update", "Security");

        // Dispatch a global custom event to force headers to update immediately
        window.dispatchEvent(new CustomEvent('kava_workspace_updated', { detail: { name: wsName } }));

      } catch (err) {
        setIsSaving(false);
        setToast({
          title: "Rollback Triggered",
          description: "An unexpected client-side storage exception was detected. Restored original configuration state.",
          items: ["System properties reverted to last known secure snapshot"]
        });
        handleReset();
      }
    }, 800);
  };

  // Reset to original snapshot
  const handleReset = () => {
    setWsName(originalStateRef.current.wsName || '');
    setWsSlug(originalStateRef.current.wsSlug || '');
    setWsDomain(originalStateRef.current.wsDomain || '');
    setIsDomainVerified(originalStateRef.current.isDomainVerified ?? false);
    setSslStatus(originalStateRef.current.sslStatus || 'None');
    setDnsPropagation(originalStateRef.current.dnsPropagation ?? 0);
    setDomainAutoRenew(originalStateRef.current.domainAutoRenew ?? true);
    setPrivacy(originalStateRef.current.privacy || 'Public');
    setTimeZone(originalStateRef.current.timeZone || 'UTC-08:00 (Pacific Time)');
    setLanguage(originalStateRef.current.language || 'English');
    setRegion(originalStateRef.current.region || 'us-east1');
    setBackupSchedule(originalStateRef.current.backupSchedule || 'Weekly');

    setDefaultTheme(originalStateRef.current.defaultTheme || 'elegant-dark');
    setDefaultDuration(originalStateRef.current.defaultDuration || '6');
    setDefaultGuestLimit(originalStateRef.current.defaultGuestLimit || '200');
    setDefaultRequireEmail(originalStateRef.current.defaultRequireEmail ?? true);

    setIsWorkspaceSettingsDirty(false);
    setToast({
      title: "Modifications Discarded",
      description: "Reverted local input states back to saved database configurations.",
      items: ["No server resources modified"]
    });
  };

  // Export JSON File Download
  const handleExportWorkspace = () => {
    const wsId = currentWorkspace.id;
    const backupData = {
      workspaceId: wsId,
      workspaceName: wsName,
      slug: wsSlug,
      domain: wsDomain,
      privacy,
      timeZone,
      language,
      region,
      backupSchedule,
      apiKeysCount: apiKeys.length,
      eventsCount: events.length,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kava_workspace_${wsSlug}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToast({
      title: "Workspace Export Complete",
      description: "JSON package containing events registry, schemas, and configurations was compiled.",
      items: ["Export file downloaded successfully."]
    });
    addAuditLog("Exported full workspace JSON package", "Backup");
  };

  // Wipe Trash / Clear Cache
  const handleCleanStorage = () => {
    setToast({
      title: "Storage Cache Purged",
      description: "Obsolete logs, image thumbnails, and metadata logs wiped from local sandbox limits.",
      items: ["Freed 4.2 MB storage space", "No critical files or records affected"]
    });
    addAuditLog("Cleared system storage caches", "Security");
  };

  // Mock Workspace Deletion
  const handleDeleteWorkspace = () => {
    if (deleteConfirmText !== currentWorkspace.id) {
      setToast({
        title: "Validation Error",
        description: "Incorrect confirm code. You must type the exact current workspace ID to continue.",
        items: ["Confirm Key is case-sensitive."]
      });
      return;
    }

    setToast({
      title: "Workspace Soft Deleted",
      description: "The workspace is set for permanent deletion. Super Admin registry scheduled deletion task.",
      items: ["This workspace will auto-expire in 30 days."]
    });
    addAuditLog("Scheduled workspace for deletion", "Security");
    setDeleteConfirmText('');
  };

  // Mock Ownership Transfer
  const handleTransferOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferEmail) return;

    setToast({
      title: "Transfer Requested",
      description: `Ownership transfer invite dispatched to "${transferEmail}" successfully.`,
      items: [`Assigned designated target role: ${transferRole}`, "Pending invite confirmation link"]
    });
    addAuditLog(`Initiated ownership transfer proposal to ${transferEmail}`, 'Security');
    setTransferEmail('');
  };

  // Filtered Audit logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(auditSearch.toLowerCase()) || 
                          log.category.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesFilter = auditFilter === 'All' || log.category === auditFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate dynamic storage limits & values
  const totalEventsCount = events.length;
  const storageMB = totalEventsCount * 45 + 12; // Dynamic representation based on event count
  const maxStorageMB = currentWorkspace.id === 'ws-artha' ? 5120 : (currentWorkspace.id === 'ws-1' ? 2048 : 500);
  const percentUsed = Math.min(100, Math.round((storageMB / maxStorageMB) * 100));

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* 1. Header with Stats Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white rounded-[32px] p-6 shadow-md gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-slate-300 font-bold bg-white/10 px-3 py-1 rounded-full uppercase">
            Active Workspace: {currentWorkspace.id}
          </span>
          <h2 className="text-2xl font-black mt-2 tracking-tight text-white">{wsName || 'Personal Studio'}</h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Managed by <strong className="text-white font-semibold">{currentWorkspace.host}</strong> • Live Domain Routing Active
          </p>
        </div>

        <div className="flex items-center space-x-6 shrink-0 border-t border-white/10 lg:border-t-0 pt-4 lg:pt-0">
          <div className="text-left">
            <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">Storage Capacity</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-black">{storageMB} MB</span>
              <span className="text-xs text-slate-300 font-medium">/ {maxStorageMB} MB</span>
            </div>
            <div className="w-24 bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${percentUsed}%` }} />
            </div>
          </div>

          <div className="text-left border-l border-white/10 pl-6">
            <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">Events Linked</span>
            <span className="text-xl font-black block mt-1">{totalEventsCount}</span>
          </div>

          <div className="text-left border-l border-white/10 pl-6">
            <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">Privacy Level</span>
            <span className="text-xs font-bold block mt-1.5 bg-white/15 px-2.5 py-0.5 rounded-md text-emerald-300 uppercase tracking-wide">
              {privacy}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs: General Settings vs Brand Kit & Identity */}
      <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setWorkspaceSettingsSubTab('general')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            workspaceSettingsSubTab === 'general'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
          id="ws-subtab-general"
        >
          <Settings className="w-4 h-4" />
          <span>General Settings</span>
        </button>

        <button
          onClick={() => setWorkspaceSettingsSubTab('brand')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            workspaceSettingsSubTab === 'brand'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
          id="ws-subtab-brand"
        >
          <Palette className="w-4 h-4" />
          <span>Brand Kit & Visual Identity</span>
          {isWorkspaceBrandDirty && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
          )}
        </button>
      </div>

      {workspaceSettingsSubTab === 'brand' ? (
        <BrandKitTab
          currentWorkspace={currentWorkspace}
          events={events}
          onUpdateEventSettings={onUpdateEventSettings}
          setToast={setToast}
          workspaceBrandLogo={workspaceBrandLogo}
          setWorkspaceBrandLogo={setWorkspaceBrandLogo}
          workspaceBrandPrimaryColor={workspaceBrandPrimaryColor}
          setWorkspaceBrandPrimaryColor={setWorkspaceBrandPrimaryColor}
          workspaceBrandAccentColor={workspaceBrandAccentColor}
          setWorkspaceBrandAccentColor={setWorkspaceBrandAccentColor}
          workspaceBrandTypography={workspaceBrandTypography}
          setWorkspaceBrandTypography={setWorkspaceBrandTypography}
          isWorkspaceBrandDirty={isWorkspaceBrandDirty}
          setIsWorkspaceBrandDirty={setIsWorkspaceBrandDirty}
          brandPreviewTab={brandPreviewTab}
          setBrandPreviewTab={setBrandPreviewTab}
          logoInputRef={logoInputRef}
        />
      ) : (
        <>
          {/* ESSENTIAL SETTINGS (ALWAYS VISIBLE) */}
          <div className="space-y-8">
            
            {/* 1. Workspace Identity (Name & Logo) */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-6">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-800">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Workspace Identity</h3>
                  <p className="text-xs text-slate-400 font-medium">Core display name and brand logo for your events, host dashboard, and guest pages.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Workspace Display Name</label>
                  <input
                    type="text"
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    className="mt-2 w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all"
                    id="ws-name-input"
                    placeholder="e.g. Artha Studio"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Workspace Logo</label>
                  <div className="mt-2 flex items-center space-x-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      {workspaceBrandLogo ? (
                        <img src={workspaceBrandLogo} alt="Workspace Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-white">{wsName.slice(0, 2).toUpperCase() || 'KW'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={workspaceBrandLogo}
                        onChange={(e) => {
                          setWorkspaceBrandLogo(e.target.value);
                          setIsWorkspaceSettingsDirty(true);
                          if (setIsWorkspaceBrandDirty) setIsWorkspaceBrandDirty(true);
                        }}
                        placeholder="Image URL or upload file..."
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <input
                      type="file"
                      ref={localLogoFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const result = ev.target?.result as string;
                            if (result) {
                              setWorkspaceBrandLogo(result);
                              setIsWorkspaceSettingsDirty(true);
                              if (setIsWorkspaceBrandDirty) setIsWorkspaceBrandDirty(true);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => localLogoFileRef.current?.click()}
                      className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold font-mono uppercase tracking-wider flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Workspace Privacy Level */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-6">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Workspace Privacy Level</h3>
                  <p className="text-xs text-slate-400 font-medium">Determine indexing, discovery rules, and guest entrance security constraints.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  onClick={() => setPrivacy('Public')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    privacy === 'Public' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Globe className={`w-5 h-5 ${privacy === 'Public' ? 'text-white' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                      privacy === 'Public' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>Public</span>
                  </div>
                  <h4 className="text-xs font-bold">Discoverable</h4>
                  <p className={`text-[11px] mt-1 font-medium ${privacy === 'Public' ? 'text-slate-300' : 'text-slate-400'}`}>Events indexed by search engines and listed on landing showcase.</p>
                </div>

                <div 
                  onClick={() => setPrivacy('Unlisted')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    privacy === 'Unlisted' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Unlock className={`w-5 h-5 ${privacy === 'Unlisted' ? 'text-white' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                      privacy === 'Unlisted' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>Unlisted</span>
                  </div>
                  <h4 className="text-xs font-bold">Direct Link Only</h4>
                  <p className={`text-[11px] mt-1 font-medium ${privacy === 'Unlisted' ? 'text-slate-300' : 'text-slate-400'}`}>Accessible via direct link or QR code only. Hidden from public indexing.</p>
                </div>

                <div 
                  onClick={() => setPrivacy('Private')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    privacy === 'Private' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Lock className={`w-5 h-5 ${privacy === 'Private' ? 'text-white' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                      privacy === 'Private' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>Restricted</span>
                  </div>
                  <h4 className="text-xs font-bold">Password / Access Code</h4>
                  <p className={`text-[11px] mt-1 font-medium ${privacy === 'Private' ? 'text-slate-300' : 'text-slate-400'}`}>Guests must enter an access passcode or workspace PIN to view events.</p>
                </div>
              </div>
            </div>

            {/* 3. Branding Summary Card */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Branding Overview</h3>
                    <p className="text-xs text-slate-400 font-medium">Visual theme colors and typography applied across guest invitations & live displays.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWorkspaceSettingsSubTab('brand')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Brand Kit Studio →</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Primary Color</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-md border border-slate-200 shadow-sm" style={{ backgroundColor: workspaceBrandPrimaryColor }} />
                    <span className="text-xs font-mono font-bold text-slate-700">{workspaceBrandPrimaryColor}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Accent Color</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-md border border-slate-200 shadow-sm" style={{ backgroundColor: workspaceBrandAccentColor }} />
                    <span className="text-xs font-mono font-bold text-slate-700">{workspaceBrandAccentColor}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Typography</span>
                  <span className="text-xs font-bold text-slate-700 truncate block">{workspaceBrandTypography}</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Brand Logo</span>
                  <span className="text-xs font-bold text-slate-700 truncate block">{workspaceBrandLogo ? 'Custom Logo' : 'Default Badge'}</span>
                </div>
              </div>
            </div>

            {/* 4. Default Event Settings */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-6">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Default Event Settings</h3>
                  <p className="text-xs text-slate-400 font-medium">Default configurations automatically pre-applied whenever you create new events.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Default Theme Template</label>
                  <select
                    value={defaultTheme}
                    onChange={(e) => setDefaultTheme(e.target.value)}
                    className="mt-2 w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Modern Minimal">Modern Minimal</option>
                    <option value="Luxury Gala">Luxury Gala</option>
                    <option value="Festive Cyber">Festive Cyber</option>
                    <option value="Warm Botanical">Warm Botanical</option>
                    <option value="Monochrome Studio">Monochrome Studio</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Default Slide Duration</label>
                  <select
                    value={defaultDuration}
                    onChange={(e) => setDefaultDuration(e.target.value)}
                    className="mt-2 w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="5 seconds">5 seconds per photo</option>
                    <option value="8 seconds">8 seconds per photo</option>
                    <option value="10 seconds">10 seconds per photo</option>
                    <option value="15 seconds">15 seconds per photo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Default Max Guests Limit</label>
                  <input
                    type="number"
                    value={defaultGuestLimit}
                    onChange={(e) => setDefaultGuestLimit(e.target.value)}
                    className="mt-2 w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none transition-all"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="def-require-email"
                  checked={defaultRequireEmail}
                  onChange={(e) => setDefaultRequireEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-slate-900 focus:ring-slate-200 cursor-pointer"
                />
                <label htmlFor="def-require-email" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Mandate Guest RSVP Email Verification by default for new events
                </label>
              </div>
            </div>

            {/* 5. Custom Domain (Or Upgrade Prompt) */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Custom Domain Mapping</h3>
                    <p className="text-xs text-slate-400 font-medium">Link custom subdomains (e.g. events.yourbrand.com) directly to your workspace.</p>
                  </div>
                </div>
                {isCustomDomainSupported && (
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                      isDomainVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isDomainVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                )}
              </div>

              {isCustomDomainSupported ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Connected Domain Address</label>
                    <div className="mt-2 flex items-center space-x-2">
                      <input
                        type="text"
                        value={wsDomain}
                        onChange={(e) => setWsDomain(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none transition-all"
                        id="ws-custom-domain-input"
                        placeholder="e.g. events.yourbrand.com"
                      />
                      
                      {isDomainVerified ? (
                        <button
                          type="button"
                          onClick={handleDisconnectDomain}
                          className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleVerifyDns}
                          disabled={dnsVerifyLoading}
                          className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1 cursor-pointer"
                        >
                          {dnsVerifyLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <span>Verify Domain</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Detailed DNS CNAME records and SSL certificate logs are managed under <strong className="font-bold text-slate-700">Advanced Settings</strong> below.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">Custom Domain Mapping Available on Enterprise Guild</h4>
                    </div>
                    <p className="text-xs text-slate-300 max-w-lg font-medium">
                      Upgrade your workspace subscription to connect custom subdomains with automated Cloudflare SSL certificates and white-label guest links.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('subscription')}
                    className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <span>Upgrade Workspace →</span>
                  </button>
                </div>
              )}
            </div>

            {/* COLLAPSED ADVANCED SETTINGS ACCORDION */}
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm transition-all">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full p-6 sm:p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-700">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <span>Advanced Settings & Developer Options</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                        Technical
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Workspace URL slug, DNS details, API integration webhooks, backups, regional servers & audit logs.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500 font-mono hidden sm:inline">
                    {isAdvancedOpen ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isAdvancedOpen && (
                <div className="p-6 sm:p-8 pt-4 border-t border-slate-100 space-y-8 bg-slate-50/30">
                  {/* Technical Card A: Workspace Slug & URL Registry */}
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                          <Link2 className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Workspace Custom Web URL Slug</h3>
                          <p className="text-xs text-slate-400 font-medium">Unique URL identifier for guest access links and event sub-paths.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Custom Workspace Slug</label>
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                              kava.app/ws/
                            </span>
                            <input
                              type="text"
                              value={wsSlug}
                              onChange={(e) => {
                                setWsSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                                setSlugStatus('checking');
                              }}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:bg-white rounded-xl pl-24 pr-10 py-2 text-xs font-mono font-bold text-slate-700 focus:outline-none transition-all"
                              placeholder="artha-studio"
                            />
                            {slugStatus === 'checking' && (
                              <Loader2 className="w-4 h-4 animate-spin text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                            {slugStatus === 'available' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleGenerateSlug}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                          >
                            Auto-Generate
                          </button>
                        </div>
                      </div>

                      {/* Slug Redirect History */}
                      {slugHistory.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
                            Redirect History & Legacy Slugs
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {slugHistory.map((oldSlug, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center space-x-1">
                                <span>/ws/{oldSlug}</span>
                                <span className="text-slate-400">→</span>
                                <span className="text-emerald-600">/ws/{wsSlug}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technical Card B: Advanced DNS & SSL Infrastructure */}
                  {isCustomDomainSupported && (
                    <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                            <Server className="w-5 h-5 text-slate-700" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Advanced DNS & SSL Configuration</h3>
                            <p className="text-xs text-slate-400 font-medium">CNAME routing records, propagation tracking, and Cloudflare SSL certificates.</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                          sslStatus === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          SSL: {sslStatus}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs space-y-2 border border-slate-800">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                            <span>TYPE</span>
                            <span>HOST / NAME</span>
                            <span>TARGET / VALUE</span>
                            <span>TTL</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 pt-1">
                            <span>CNAME</span>
                            <span>{wsDomain || 'events.yourdomain.com'}</span>
                            <span className="text-slate-200">kava.secure.edge</span>
                            <span className="text-slate-400">300 (Auto)</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                            <span>A RECORD</span>
                            <span>@</span>
                            <span className="text-slate-200">34.120.45.18</span>
                            <span className="text-slate-400">300 (Auto)</span>
                          </div>
                        </div>

                        {/* DNS Propagation Bar */}
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 mb-1.5">
                            <span>GLOBAL DNS PROPAGATION</span>
                            <span>{dnsPropagation}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${dnsPropagation}%` }} />
                          </div>
                        </div>

                        {/* SSL Auto-Renew toggle */}
                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={domainAutoRenew}
                              onChange={(e) => setDomainAutoRenew(e.target.checked)}
                              className="rounded border-slate-300 accent-slate-900"
                            />
                            <span>Automatic Cloudflare SSL Certificate Renewal</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleVerifyDns}
                            disabled={dnsVerifyLoading}
                            className="text-xs text-slate-900 hover:text-black font-bold font-mono underline cursor-pointer"
                          >
                            Refresh DNS Status
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technical Card C: Workspace Integrations Center */}
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                          <Sliders className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Workspace Integrations Center</h3>
                          <p className="text-xs text-slate-400 font-medium">Forward guest uploads, RSVP details, or analytics triggers instantly to cloud partners.</p>
                        </div>
                      </div>
                    </div>

                    {/* Integration Filter Tabs */}
                    <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                      {(['all', 'storage', 'productivity', 'automation', 'communication', 'developer'] as const).map((tabId) => (
                        <button
                          key={tabId}
                          type="button"
                          onClick={() => setActiveIntegrationTab(tabId)}
                          className={`px-3 py-1 text-[10px] font-bold uppercase font-mono tracking-wider rounded-lg transition-all ${
                            activeIntegrationTab === tabId ? 'bg-white text-slate-900 shadow-sm border border-slate-150' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {tabId}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {integrations
                        .filter(item => activeIntegrationTab === 'all' || item.category === activeIntegrationTab)
                        .map((item) => {
                          const isExpanded = expandedIntegration === item.id;
                          const IconComp = getIntegrationIcon(item.id);
                          return (
                            <div 
                              key={item.id} 
                              className={`border rounded-2xl transition-all ${
                                item.connected ? 'border-slate-150 bg-slate-50/30' : 'border-slate-100'
                              }`}
                            >
                              <div className="p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-3.5 min-w-0">
                                  <div className={`p-2 rounded-xl border ${
                                    item.connected ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-slate-50 border-slate-100 text-slate-400'
                                  }`}>
                                    <IconComp className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                                      {item.name}
                                      {item.connected && (
                                        <span className="text-[8px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full uppercase font-mono tracking-wide">
                                          ACTIVE
                                        </span>
                                      )}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 truncate max-w-sm md:max-w-md font-medium mt-0.5">{item.description}</p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                  {item.connected && (
                                    <button
                                      type="button"
                                      onClick={() => handleTestIntegration(item.id)}
                                      disabled={testingIntegrationId === item.id}
                                      className="text-[10px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1"
                                    >
                                      {testingIntegrationId === item.id ? (
                                        <>
                                          <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                                          <span>Testing...</span>
                                        </>
                                      ) : (
                                        <span>Test Connection</span>
                                      )}
                                    </button>
                                  )}
                                  
                                  <button
                                    type="button"
                                    onClick={() => handleToggleIntegration(item.id)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                                      item.connected 
                                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100' 
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                                  >
                                    {item.connected ? 'Disconnect' : 'Connect'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setExpandedIntegration(isExpanded ? null : item.id)}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
                                  >
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="border-t border-slate-150 p-4 bg-white/70 space-y-4">
                                  {/* Sync details */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono text-slate-500">
                                    <div>
                                      <span className="block font-bold uppercase text-slate-400">Sync Status</span>
                                      <span className={`font-bold uppercase ${
                                        item.syncStatus === 'connected' ? 'text-emerald-600' : 'text-slate-400'
                                      }`}>{item.syncStatus}</span>
                                    </div>
                                    <div>
                                      <span className="block font-bold uppercase text-slate-400">Last Sync Time</span>
                                      <span className="text-slate-700 font-bold">{item.lastSync}</span>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="block font-bold uppercase text-slate-400">Credential Auth Scopes</span>
                                      <span className="text-slate-600 truncate block">Read, Write, Asset synchronization</span>
                                    </div>
                                  </div>

                                  {/* Dynamic configuration form fields */}
                                  <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-slate-100 pb-1">
                                      API Configuration Settings
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                                      {Object.keys(item.config).map((key) => (
                                        <div key={key}>
                                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{key.replace(/([A-Z])/g, ' $1')}</label>
                                          <input
                                            type={key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') ? 'password' : 'text'}
                                            value={item.config[key]}
                                            onChange={(e) => {
                                              const nextConfig = { ...item.config, [key]: e.target.value };
                                              const nextIntegrations = integrations.map(it => {
                                                if (it.id === item.id) {
                                                  return { ...it, config: nextConfig };
                                                }
                                                return it;
                                              });
                                              setIntegrations(nextIntegrations);
                                              localStorage.setItem(`kava_ws_integrations_${currentWorkspace.id}`, JSON.stringify(nextIntegrations));
                                            }}
                                            className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                                            placeholder={`Enter ${key}...`}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Connection logs list */}
                                  {item.logs && item.logs.length > 0 && (
                                    <div className="bg-slate-900 text-slate-300 font-mono text-[9px] p-3 rounded-xl space-y-1.5 max-h-28 overflow-y-auto">
                                      <span className="text-[8px] font-bold text-slate-500 uppercase block border-b border-slate-800 pb-1 mb-1">
                                        Recent Integration Events
                                      </span>
                                      {item.logs.map((log, lidx) => (
                                        <p key={lidx} className="flex justify-between">
                                          <span className={log.type === 'error' ? 'text-rose-400' : (log.type === 'success' ? 'text-emerald-400' : 'text-slate-300')}>
                                            ● {log.message}
                                          </span>
                                          <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Developer programmatic API keys section */}
                    {activeIntegrationTab === 'developer' && (
                      <div className="border border-dashed border-slate-200 rounded-3xl p-6 mt-6 space-y-4">
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-slate-700" />
                          <h4 className="text-xs font-extrabold text-slate-900">Programmatic API Keys</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Develop external webhooks or server tools. Authorized API tokens enjoy complete secure scopes on event resources.
                        </p>

                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                            placeholder="e.g. Analytics server webhook trigger"
                          />
                          <button
                            type="button"
                            onClick={handleCreateApiKey}
                            className="bg-slate-950 hover:bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer"
                          >
                            Generate Key
                          </button>
                        </div>

                        <div className="space-y-2 mt-4">
                          {apiKeys.map((keyObj, kIdx) => (
                            <div key={kIdx} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center justify-between text-xs">
                              <div className="text-left font-semibold">
                                <p className="text-slate-800">{keyObj.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Created: {keyObj.created}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-mono text-slate-500 select-all bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                                  {keyObj.key}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteApiKey(keyObj.key)}
                                  className="text-rose-500 hover:text-rose-700 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Technical Card D: Backups and Recovery */}
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                          <Database className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Database Backups & Recovery</h3>
                          <p className="text-xs text-slate-400 font-medium">Keep offline copies. Automatically snap backup files into secure storage containers.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateBackup}
                        disabled={showBackupSuccess}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Instant Backup</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Automated Backup Frequency</label>
                        <select
                          value={backupSchedule}
                          onChange={(e) => setBackupSchedule(e.target.value as any)}
                          className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="Daily">Daily automatic incremental backup</option>
                          <option value="Weekly">Weekly full system backup snapshot</option>
                          <option value="Monthly">Monthly archive snapshot</option>
                          <option value="Disabled">Disable automated backups (Not Recommended)</option>
                        </select>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Export All Workspace Configurations</h4>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Includes full integrations registry, billing limits, and settings.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportWorkspace}
                          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export JSON</span>
                        </button>
                      </div>
                    </div>

                    {/* Backups List */}
                    <div className="space-y-3 mt-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Available System Snapshots</span>
                      <div className="space-y-2">
                        {backups.map((bak) => (
                          <div key={bak.id} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center space-x-3.5">
                              <div className="p-1.5 bg-white border border-slate-150 rounded-lg text-slate-400">
                                <Calendar className="w-4 h-4 text-slate-500" />
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-slate-700">Snapshot ID: {bak.id}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{new Date(bak.timestamp).toLocaleString()} • {bak.size} • {bak.eventsCount} events mapped</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRestoreBackup(bak.id)}
                              disabled={restoringBackupId !== null}
                              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center space-x-1 cursor-pointer"
                            >
                              {restoringBackupId === bak.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                  <span>Restoring...</span>
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="w-3 h-3 text-slate-800" />
                                  <span>Restore</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Technical Card E: Regional Configurations */}
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <Globe className="w-5 h-5 text-slate-700" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Regional Configurations</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Default Time Zone</label>
                        <select
                          value={timeZone}
                          onChange={(e) => setTimeZone(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time)</option>
                          <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                          <option value="UTC+00:00 (London GMT)">UTC+00:00 (London GMT)</option>
                          <option value="UTC+07:00 (Jakarta/Bangkok)">UTC+07:00 (Jakarta/Bangkok)</option>
                          <option value="UTC+08:00 (Singapore/Bali)">UTC+08:00 (Singapore/Bali)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Workspace Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="English">English (United States)</option>
                          <option value="Spanish">Español (Spanish)</option>
                          <option value="French">Français (French)</option>
                          <option value="Indonesian">Bahasa Indonesia</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Cloud Hosting Region</label>
                        <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="us-east1">United States East (Iowa)</option>
                          <option value="us-west1">United States West (Oregon)</option>
                          <option value="europe-west3">Europe West (Frankfurt)</option>
                          <option value="asia-east1">Asia East (Taiwan)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Technical Card F: Ownership & Deletion */}
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-red-50 border border-red-100 rounded-xl text-rose-600">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-rose-600">Dangerous Operations</h3>
                    </div>

                    {/* Transfer Ownership Form */}
                    <form onSubmit={handleTransferOwnership} className="space-y-3.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Transfer Workspace Ownership</span>
                      <p className="text-[10px] text-slate-400 font-medium">Relinquish host access to a designated team member or administrator.</p>
                      
                      <div className="space-y-2">
                        <input
                          type="email"
                          value={transferEmail}
                          onChange={(e) => setTransferEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                          placeholder="enter target host email address..."
                          required
                        />
                        
                        <div className="flex space-x-2">
                          <select
                            value={transferRole}
                            onChange={(e) => setTransferRole(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value="admin">Promote to Workspace Owner</option>
                            <option value="editor">Promote to Moderator Editor</option>
                          </select>
                          
                          <button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer"
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Soft / Permanent Delete */}
                    <div className="space-y-3.5 pt-4 border-t border-slate-100 text-left">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider font-mono block">Wipe & Terminate Workspace</span>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        Permanently terminates all events, metadata, backups, and configurations of this workspace container.
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="bg-rose-50/50 text-rose-700 p-2.5 rounded-xl font-mono text-[9px] font-medium leading-relaxed border border-rose-100">
                          CRITICAL: Type <strong className="font-bold underline text-rose-800">{currentWorkspace.id}</strong> to confirm.
                        </div>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                          placeholder="enter confirmation workspace ID..."
                        />
                        <button
                          type="button"
                          onClick={handleDeleteWorkspace}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-2 rounded-xl text-xs transition-all tracking-wider cursor-pointer text-center block"
                        >
                          Terminate Workspace Container
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Technical Card G: Workspace Audit Log */}
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                          <Activity className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Workspace Audit Log</h3>
                          <p className="text-xs text-slate-400 font-medium">A real-time tamper-proof chronological history of all workspace actions.</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 shrink-0">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-48 md:w-64">
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5" />
                          <input
                            type="text"
                            placeholder="Search actions or tags..."
                            value={auditSearch}
                            onChange={(e) => setAuditSearch(e.target.value)}
                            className="w-full bg-transparent border-none text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none"
                          />
                        </div>

                        <select
                          value={auditFilter}
                          onChange={(e) => setAuditFilter(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-600 focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Categories</option>
                          <option value="Domain">Domain Maps</option>
                          <option value="Integration">Integrations</option>
                          <option value="Backup">Backups</option>
                          <option value="Security">Security Logs</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                      <table className="w-full text-xs font-semibold text-slate-600 border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                            <th className="px-4 py-3 text-left">Timestamp</th>
                            <th className="px-4 py-3 text-left">Action Trigger</th>
                            <th className="px-4 py-3 text-left">Actor ID</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-right">Terminal IP</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredAuditLogs.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-mono text-[10px]">
                                No corresponding audit logs located.
                              </td>
                            </tr>
                          ) : (
                            filteredAuditLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                                  {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-slate-800 text-[11px] font-bold">{log.action}</td>
                                <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{log.actor}</td>
                                <td className="px-4 py-3">
                                  <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md ${
                                    log.category === 'Domain' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    (log.category === 'Integration' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                                    (log.category === 'Backup' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                    'bg-slate-100 text-slate-600 border border-slate-200'))
                                  }`}>
                                    {log.category}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-[10px] text-slate-400">{log.ip}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Floating Sticky Unsaved Changes Control Banner */}
      {isWorkspaceSettingsDirty && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 bg-slate-900 border border-slate-800 text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-6 z-40 max-w-lg md:w-full animate-bounce-short">
          <div className="flex items-center space-x-3 text-left pl-2">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-black">Unsaved Configuration Changes</p>
              <p className="text-[10px] text-slate-400 font-medium">Settings are not synced yet.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-400 hover:text-white px-3.5 py-1.5 text-xs font-bold border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1 shadow-md cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
