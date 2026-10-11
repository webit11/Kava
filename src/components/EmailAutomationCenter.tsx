import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Settings, Activity, Database, Bell, ChevronRight, Plus, Trash2, Copy, 
  RotateCcw, Check, AlertCircle, Eye, Edit3, Layers, Globe, Languages, FileText, 
  Layout, Smartphone, Laptop, Sliders, Share2, Send, Save, Search, Filter, 
  TrendingUp, BarChart2, CheckCircle2, XCircle, AlertTriangle, UserCheck, Info, 
  Sparkles, Code, EyeOff, Palette, RefreshCw, Play, ArrowRight, History, 
  User, Folder, Calendar, DollarSign, Ticket, Lock, Shield, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';

// Email Template definition
interface EmailTemplate {
  id: string;
  name: string;
  category: 'Authentication' | 'Workspace' | 'Event Lifecycle' | 'Guest Experience' | 'Billing & Subscription' | 'Support' | 'Security' | 'Notifications' | 'Marketing';
  trigger: string;
  enabled: boolean;
  subject: string;
  previewText: string;
  contentHtml: string;
  contentText: string;
  status: 'Published' | 'Draft';
  languages?: {
    [key: string]: {
      subject: string;
      previewText: string;
      contentHtml: string;
      contentText: string;
    }
  };
  versionHistory: {
    version: number;
    timestamp: string;
    modifiedBy: string;
    subject: string;
    contentHtml: string;
  }[];
}

// Brand Styles
interface BrandSettings {
  logoUrl: string;
  logoHeight: number;
  logoAlignment: 'left' | 'center' | 'right';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: 'Inter' | 'Space Grotesk' | 'Outfit' | 'Playfair Display' | 'Fira Code';
  headerText: string;
  footerText: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;
  legalText: string;
  unsubscribeText: string;
}

// SMTP Config
interface SmtpSettings {
  provider: 'resend' | 'sendgrid' | 'ses' | 'smtp';
  apiKey: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  senderName: string;
  senderEmail: string;
  failoverEnabled: boolean;
  failoverHost: string;
  failoverPort: string;
}

// Sent Email Log
interface SentLog {
  id: string;
  recipient: string;
  triggerSource: string;
  subject: string;
  timestamp: string;
  status: 'Delivered' | 'Opened' | 'Clicked' | 'Failed';
  failureReason?: string;
}

export default function EmailAutomationCenter({ triggerToast }: { triggerToast: (title: string, msg: string, type: 'success' | 'error' | 'info') => void }) {
  // Tabs: templates, branding, triggers, analytics, logs, smtp
  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'branding' | 'triggers' | 'analytics' | 'logs' | 'smtp'>('templates');
  const [selectedCategory, setSelectedCategory] = useState<string>('Authentication');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  // Dirty state for unsaved changes detection
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState<(() => void) | null>(null);

  // Sample data browser variables
  const [sampleVariables, setSampleVariables] = useState({
    user_name: 'Sophia Chen',
    workspace_name: 'Gala Event Ventures',
    event_name: 'Modern Memories Wedding Capsule',
    host_name: 'Leo Matthews',
    guest_name: 'Olivia Martinez',
    plan_name: 'KAVA Enterprise Diamond VIP',
    invoice_number: 'INV-2026-0042',
    payment_amount: '$149.00',
    event_date: 'Oct 12, 2026',
    verification_code: '821-495',
    reset_link: 'https://kavamemories.com/auth/reset?token=x4f923a',
    ticket_id: 'SUPPORT-901',
    ticket_subject: 'QR scan error on Android tablet browser',
    ticket_status: 'Resolved'
  });

  // Languages supported
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const languagesList = [
    { code: 'en', label: 'English (US)' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' }
  ];

  // HTML content block helpers
  const [reusableBlocks] = useState([
    { id: 'b-btn', label: 'Call-to-Action Button', template: '<div style="text-align: center; margin: 24px 0;"><a href="{{reset_link}}" style="background-color: {{primary_color}}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Complete Action</a></div>' },
    { id: 'b-divider', label: 'Decorative Line', template: '<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />' },
    { id: 'b-alert', label: 'Highlight Warning Card', template: '<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px; color: #78350f;"><strong>Notice:</strong> This is a secure time-sensitive automated trigger. Do not share credentials.</div>' }
  ]);

  // Initial State definitions
  const DEFAULT_BRAND_SETTINGS: BrandSettings = {
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&h=80&q=80',
    logoHeight: 40,
    logoAlignment: 'center',
    primaryColor: '#111111',
    secondaryColor: '#2b2b2b',
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    fontFamily: 'Inter',
    headerText: 'KAVA MEMORIES PLATFORM',
    footerText: '© 2026 KAVA Inc. All rights reserved.',
    socialFacebook: 'https://facebook.com/kavamemories',
    socialTwitter: 'https://twitter.com/kavamemories',
    socialInstagram: 'https://instagram.com/kavamemories',
    socialLinkedin: 'https://linkedin.com/company/kava',
    legalText: 'This is a system generated transmission. KAVA secures guest privacy via end-to-end encrypted storage vaults.',
    unsubscribeText: 'If you wish to manage your notification preferences or opt-out, click here to unsubscribe instantly.'
  };

  const DEFAULT_SMTP_SETTINGS: SmtpSettings = {
    provider: 'resend',
    apiKey: 're_xK9a7D1mQp3_secure_token',
    smtpHost: 'smtp.resend.com',
    smtpPort: '465',
    smtpUser: 'resend-api',
    smtpPass: '••••••••••••••••••••••••',
    senderName: 'KAVA Concierge',
    senderEmail: 'hello@kavamemories.com',
    failoverEnabled: true,
    failoverHost: 'smtp.sendgrid.net',
    failoverPort: '587'
  };

  // Generate initial templates array programmatically for absolute full category coverage
  const INITIAL_TEMPLATES: EmailTemplate[] = [
    {
      id: 'tpl-registration',
      name: 'Account Registration Welcome',
      category: 'Authentication',
      trigger: 'account_registration',
      enabled: true,
      subject: 'Welcome to KAVA, {{user_name}}!',
      previewText: 'Your live memory capsule workspace is ready.',
      contentHtml: '<h1 style="color: {{primary_color}}; font-family: {{font_family}};">Let the celebrations begin!</h1><p>Dear {{user_name}},</p><p>Welcome to KAVA. We have successfully created your professional hosting workspace: <strong>{{workspace_name}}</strong>.</p><p>You can now customize slideshow walls, download offline QR kits, and collect ultra-high-definition video uploads from your guests.</p><p>Log in now to launch your first memory capsule.</p>',
      contentText: 'Welcome to KAVA, {{user_name}}! Your workspace {{workspace_name}} is ready. Log in to launch your first capsule.',
      status: 'Published',
      languages: {
        es: {
          subject: '¡Bienvenido a KAVA, {{user_name}}!',
          previewText: 'Tu espacio de cápsula de memoria está listo.',
          contentHtml: '<h1 style="color: {{primary_color}};">¡Que comience la celebración!</h1><p>Estimado {{user_name}},</p><p>Tu espacio de trabajo <strong>{{workspace_name}}</strong> ha sido activado.</p>',
          contentText: 'Bienvenido a KAVA, {{user_name}}! Tu espacio de trabajo {{workspace_name}} está listo.'
        }
      },
      versionHistory: [
        { version: 2, timestamp: '2026-07-19T01:30:00Z', modifiedBy: 'SuperAdmin', subject: 'Welcome to KAVA, {{user_name}}!', contentHtml: '<h1 style="color: {{primary_color}};">Let the celebrations begin!</h1>' },
        { version: 1, timestamp: '2026-07-15T09:00:00Z', modifiedBy: 'System Engine', subject: 'Your KAVA Account is Configured', contentHtml: '<h1>KAVA Account Ready</h1>' }
      ]
    },
    {
      id: 'tpl-verification',
      name: 'Email Secure Verification',
      category: 'Authentication',
      trigger: 'email_verification',
      enabled: true,
      subject: 'Verify your email address - Code: {{verification_code}}',
      previewText: 'Enter this verification code to secure your host portal.',
      contentHtml: '<h2>Security Verification Code</h2><p>Please use the following verification code to complete your login setup:</p><div style="font-size: 32px; font-weight: bold; background: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; letter-spacing: 4px; margin: 18px 0; border: 1px solid #cbd5e1; color: {{secondary_color}};">{{verification_code}}</div><p>This code remains active for 10 minutes. If you did not initiate this, please secure your account immediately.</p>',
      contentText: 'Your secure verification code is: {{verification_code}}. Enter this to confirm registration.',
      status: 'Published',
      versionHistory: [{ version: 1, timestamp: '2026-07-18T12:00:00Z', modifiedBy: 'System Engine', subject: 'Verify your email address', contentHtml: '<h2>Code: {{verification_code}}</h2>' }]
    },
    {
      id: 'tpl-pwreset',
      name: 'Secure Password Reset',
      category: 'Authentication',
      trigger: 'password_reset',
      enabled: true,
      subject: 'Reset your KAVA Account Password',
      previewText: 'Reset password security link within.',
      contentHtml: '<h2>Password Reset Request</h2><p>Hi {{user_name}},</p><p>We received a secure request to reset your password. Click the button below to establish a new password:</p><div style="text-align: center; margin: 24px 0;"><a href="{{reset_link}}" style="background-color: {{primary_color}}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password Now</a></div><p>If you did not make this request, you can safely ignore this email.</p>',
      contentText: 'Reset your password using this link: {{reset_link}}',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-workspaceinv',
      name: 'Workspace Host Invitation',
      category: 'Workspace',
      trigger: 'workspace_invitation',
      enabled: true,
      subject: 'Co-Host Invitation: {{workspace_name}}',
      previewText: '{{host_name}} invited you to co-manage events.',
      contentHtml: '<h3>Collaborative Workspace Invitation</h3><p>Hello,</p><p><strong>{{host_name}}</strong> has invited you to join the team as a Co-Host on KAVA.</p><p>Work together to moderate incoming guest photos, manage projection walls, and coordinate downloads on: <strong>{{workspace_name}}</strong>.</p><p>Accept your invitation now to get started.</p>',
      contentText: '{{host_name}} invited you to join {{workspace_name}} as a Co-Host.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-eventcreation',
      name: 'Event Capsule Spawned',
      category: 'Event Lifecycle',
      trigger: 'event_creation',
      enabled: true,
      subject: 'New Live Capsule Active: {{event_name}}',
      previewText: 'Your live guest submission queue is live.',
      contentHtml: '<h2>Your Event Capsule is Live!</h2><p>Excellent news, {{user_name}}!</p><p>Your memory capsule <strong>{{event_name}}</strong> has been activated for <strong>{{event_date}}</strong>.</p><p>Make sure to print your customizable QR code table-tents so guests can instantly capture and upload beautiful media without any downloads!</p>',
      contentText: 'Your capsule {{event_name}} is live for {{event_date}}.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-contribution',
      name: 'Guest Contribution Uploaded',
      category: 'Guest Experience',
      trigger: 'guest_contribution_received',
      enabled: true,
      subject: 'New Memory received from {{guest_name}}!',
      previewText: 'A guest added a photo/video to {{event_name}}.',
      contentHtml: '<h3>New Live Contribution!</h3><p>Hi {{host_name}},</p><p>Your guest <strong>{{guest_name}}</strong> just uploaded a beautiful piece of media to your active capsule: <strong>{{event_name}}</strong>.</p><p>You can view this contribution in real-time on your live slideshow projection wall or access high-fidelity files in your administrator dashboard.</p>',
      contentText: '{{guest_name}} uploaded a photo to {{event_name}}.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-moderation',
      name: 'Media Moderation Approval',
      category: 'Guest Experience',
      trigger: 'moderation_approval',
      enabled: true,
      subject: 'Guest Upload Approved & Live!',
      previewText: 'Moderated media has passed quality guidelines.',
      contentHtml: '<h4>Moderation Cleared</h4><p>The photo uploaded by <strong>{{guest_name}}</strong> has passed your auto-moderation rules and has been dispatched to the active projection slideshow for <strong>{{event_name}}</strong>.</p>',
      contentText: 'Photo by {{guest_name}} approved for {{event_name}}.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-paymentsucc',
      name: 'Billing: Payment Receipt',
      category: 'Billing & Subscription',
      trigger: 'payment_success',
      enabled: true,
      subject: 'Receipt for Invoice {{invoice_number}}',
      previewText: 'Thank you for your payment of {{payment_amount}}.',
      contentHtml: '<h2>Thank you for your purchase!</h2><p>Hi {{user_name}},</p><p>We have successfully processed your billing transaction for: <strong>{{plan_name}}</strong>.</p><div style="background: #f8fafc; padding: 18px; border-radius: 8px; margin: 16px 0; border: 1px dashed #cbd5e1;"><p><strong>Invoice Reference:</strong> {{invoice_number}}</p><p><strong>Amount Charged:</strong> {{payment_amount}} (Credit Card)</p><p><strong>Renewal Cycle:</strong> Annual Automated Billing</p></div><p>Your subscription is fully active. Enjoy premium features such as custom watermarks and uncompressed video archival files.</p>',
      contentText: 'Payment received for {{invoice_number}}. Amount: {{payment_amount}}.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-paymentfail',
      name: 'Billing: Payment Failed Alert',
      category: 'Billing & Subscription',
      trigger: 'payment_failure',
      enabled: true,
      subject: 'URGENT: Transaction Declined - {{invoice_number}}',
      previewText: 'Action required: Update your payment credentials.',
      contentHtml: '<h2 style="color: #ef4444;">Payment Declined</h2><p>Hello {{user_name}},</p><p>We tried to charge your card for invoice <strong>{{invoice_number}}</strong> but the transaction was declined by the cardholder bank.</p><p>To prevent any service interruption to your active slideshow projection walls or guest media ingestion channels, please review and update your secure billing source immediately.</p>',
      contentText: 'Payment failed for {{invoice_number}}. Please update billing credentials.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-subrenew',
      name: 'Subscription Automated Renewal',
      category: 'Billing & Subscription',
      trigger: 'subscription_renewal',
      enabled: true,
      subject: 'Subscription Renewed Successfully!',
      previewText: 'Your premium account has been extended.',
      contentHtml: '<h3>Subscription Extended</h3><p>Your subscription for plan <strong>{{plan_name}}</strong> has been successfully renewed. Your workspace remains active with pristine storage vaults.</p>',
      contentText: 'Subscription for {{plan_name}} renewed successfully.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-subexpire',
      name: 'Subscription Expired Notice',
      category: 'Billing & Subscription',
      trigger: 'subscription_expiration',
      enabled: true,
      subject: 'KAVA Subscription Expired',
      previewText: 'Workspace limits have reverted to standard tiers.',
      contentHtml: '<h3 style="color: #b91c1c;">Workspace Tier Downgraded</h3><p>Hello {{user_name}},</p><p>Your premium tier <strong>{{plan_name}}</strong> has expired because we did not receive your renewal payment.</p><p>Your active capsules have reverted to free tier storage limits (250MB), and custom branding watermarks have been temporarily paused.</p>',
      contentText: 'Your KAVA subscription for {{plan_name}} has expired.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-ticketupdate',
      name: 'Support Ticket Modified',
      category: 'Support',
      trigger: 'support_ticket_updates',
      enabled: true,
      subject: 'Support Ticket [{{ticket_id}}] Update: {{ticket_status}}',
      previewText: 'An administrator updated your support thread.',
      contentHtml: '<h3>Support Thread Update</h3><p>Hi {{user_name}},</p><p>Your support ticket has been updated.</p><div style="padding: 16px; background-color: #f1f5f9; border-radius: 6px;"><p><strong>Ticket ID:</strong> {{ticket_id}}</p><p><strong>Subject:</strong> {{ticket_subject}}</p><p><strong>Current Status:</strong> <span style="background-color: #22c55e; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">{{ticket_status}}</span></p></div><p>Log in to your host portal support section to review messages and communicate with staff.</p>',
      contentText: 'Ticket {{ticket_id}} has been updated to {{ticket_status}}.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-archivecomplete',
      name: 'Archival Export Ready',
      category: 'Notifications',
      trigger: 'archive_completion',
      enabled: true,
      subject: 'Your Premium ZIP Archive is ready for download!',
      previewText: 'Download your high-fidelity photo gallery.',
      contentHtml: '<h2>Archive Packaged and Ready!</h2><p>Excellent news, {{user_name}}!</p><p>We have finished packaging all uncompressed high-fidelity videos and pictures from <strong>{{event_name}}</strong> into a single secure ZIP archive.</p><p>Click the button below to download your permanent offline storage bundle:</p><div style="text-align: center; margin: 24px 0;"><a href="#" style="background-color: {{secondary_color}}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Download ZIP Archive</a></div>',
      contentText: 'ZIP Archive ready for event {{event_name}}.',
      status: 'Published',
      versionHistory: []
    },
    {
      id: 'tpl-broadcast',
      name: 'Admin Broadcast Announcement',
      category: 'Marketing',
      trigger: 'administrator_broadcasts',
      enabled: true,
      subject: 'KAVA Core Update: Dynamic Polaroid Frames!',
      previewText: 'Discover beautiful new retro overlays for your live projections.',
      contentHtml: '<h2>Major Upgrade Announcement</h2><p>Hello {{user_name}},</p><p>We are thrilled to unveil retro photo overlay layouts for all premium host portfolios! Your guests can now overlay vintage border frames, custom event stamps, and greetings live on-screen.</p><p>Navigate to your capsule style panels to toggle these beautiful creative modules.</p>',
      contentText: 'Major Update: Vintage Polaroid Overlays are now live!',
      status: 'Published',
      versionHistory: []
    }
  ];

  // Load from local storage if available
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    const local = localStorage.getItem('kava_email_templates');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return INITIAL_TEMPLATES;
      }
    }
    return INITIAL_TEMPLATES;
  });

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => {
    const local = localStorage.getItem('kava_brand_settings');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return DEFAULT_BRAND_SETTINGS;
      }
    }
    return DEFAULT_BRAND_SETTINGS;
  });

  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>(() => {
    const local = localStorage.getItem('kava_smtp_settings');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return DEFAULT_SMTP_SETTINGS;
      }
    }
    return DEFAULT_SMTP_SETTINGS;
  });

  const [sentLogs, setSentLogs] = useState<SentLog[]>(() => {
    const local = localStorage.getItem('kava_email_sent_logs');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 'log-001', recipient: 'sophia.chen@example.com', triggerSource: 'account_registration', subject: 'Welcome to KAVA, Sophia!', timestamp: '2026-07-19T01:45:00Z', status: 'Opened' },
      { id: 'log-002', recipient: 'leo.m@example.com', triggerSource: 'workspace_invitation', subject: 'Co-Host Invitation: Gala Event Ventures', timestamp: '2026-07-19T01:30:00Z', status: 'Clicked' },
      { id: 'log-003', recipient: 'decline.tester@bounced.com', triggerSource: 'payment_failure', subject: 'URGENT: Transaction Declined - INV-2026-0042', timestamp: '2026-07-18T18:22:00Z', status: 'Failed', failureReason: 'Hard bounce - Recipient mailbox suspended by provider.' },
      { id: 'log-004', recipient: 'olivia.m@example.com', triggerSource: 'guest_contribution_received', subject: 'New Memory received from Olivia!', timestamp: '2026-07-18T14:10:00Z', status: 'Delivered' }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<string[]>(() => {
    const local = localStorage.getItem('kava_email_audit_logs');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    }
    return [
      'Email Automation Center initialized with default triggers.',
      'SMTP credentials updated: resend integration authenticated.',
      'Template "Secure Password Reset" status updated to Published.'
    ];
  });

  // Track state of current editing template
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [filterLogStatus, setFilterLogStatus] = useState<string>('All');

  // Load first template of current category by default
  useEffect(() => {
    const inCat = templates.filter(t => t.category === selectedCategory);
    if (inCat.length > 0) {
      // Find matching template ID if exists, otherwise load first
      const found = inCat.find(t => t.id === selectedTemplateId) || inCat[0];
      setEditingTemplate(JSON.parse(JSON.stringify(found))); // deep copy
      setSelectedTemplateId(found.id);
      setSelectedLanguage('en');
    } else {
      setEditingTemplate(null);
    }
    setIsDirty(false);
  }, [selectedCategory, selectedTemplateId]);

  // Persist logic
  const handleSaveAll = () => {
    if (!editingTemplate) return;

    // Check if the current editing template is a translated version or primary
    let updatedTemplate = { ...editingTemplate };

    const updatedTemplatesList = templates.map(t => {
      if (t.id === editingTemplate.id) {
        // Build version history
        const latestHistory = t.versionHistory || [];
        const isContentDifferent = t.contentHtml !== editingTemplate.contentHtml || t.subject !== editingTemplate.subject;
        const nextHistory = isContentDifferent ? [
          {
            version: (latestHistory[0]?.version || 0) + 1,
            timestamp: new Date().toISOString(),
            modifiedBy: 'SuperAdmin',
            subject: t.subject,
            contentHtml: t.contentHtml
          },
          ...latestHistory
        ] : latestHistory;

        return {
          ...editingTemplate,
          versionHistory: nextHistory
        };
      }
      return t;
    });

    setTemplates(updatedTemplatesList);
    localStorage.setItem('kava_email_templates', JSON.stringify(updatedTemplatesList));
    
    // Also save branding and smtp settings
    localStorage.setItem('kava_brand_settings', JSON.stringify(brandSettings));
    localStorage.setItem('kava_smtp_settings', JSON.stringify(smtpSettings));
    
    // Add to audit logs
    const msg = `Template "${editingTemplate.name}" updated & saved by Administrator (Subject: "${editingTemplate.subject}").`;
    const newAudit = [msg, ...auditLogs];
    setAuditLogs(newAudit);
    localStorage.setItem('kava_email_audit_logs', JSON.stringify(newAudit));

    setIsDirty(false);
    triggerToast('Email Center Saved', 'All template, branding, and SMTP modifications written to permanent storage.', 'success');
  };

  // Helper to generate full parsed HTML representation for live preview
  const generateInterpContent = (htmlContent: string) => {
    let parsed = htmlContent;
    // Substitute brand settings
    parsed = parsed.replace(/{{primary_color}}/g, brandSettings.primaryColor);
    parsed = parsed.replace(/{{secondary_color}}/g, brandSettings.secondaryColor);
    parsed = parsed.replace(/{{font_family}}/g, brandSettings.fontFamily);
    
    // Substitute sample variables
    Object.entries(sampleVariables).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      parsed = parsed.replace(regex, String(val));
    });

    // Build overall wrapper template matching the Branding preferences
    const logoHtml = brandSettings.logoUrl 
      ? `<div style="text-align: ${brandSettings.logoAlignment}; padding-bottom: 20px;">
          <img src="${brandSettings.logoUrl}" alt="Brand Logo" style="height: ${brandSettings.logoHeight}px; max-width: 100%; object-fit: contain;" />
         </div>`
      : '';

    const socialIconsHtml = `
      <div style="text-align: center; margin-top: 20px; margin-bottom: 15px;">
        ${brandSettings.socialFacebook ? `<a href="${brandSettings.socialFacebook}" style="display: inline-block; margin: 0 8px; color: ${brandSettings.primaryColor}; text-decoration: none; font-weight: bold;">Facebook</a>` : ''}
        ${brandSettings.socialTwitter ? `<a href="${brandSettings.socialTwitter}" style="display: inline-block; margin: 0 8px; color: ${brandSettings.primaryColor}; text-decoration: none; font-weight: bold;">Twitter/X</a>` : ''}
        ${brandSettings.socialInstagram ? `<a href="${brandSettings.socialInstagram}" style="display: inline-block; margin: 0 8px; color: ${brandSettings.primaryColor}; text-decoration: none; font-weight: bold;">Instagram</a>` : ''}
        ${brandSettings.socialLinkedin ? `<a href="${brandSettings.socialLinkedin}" style="display: inline-block; margin: 0 8px; color: ${brandSettings.primaryColor}; text-decoration: none; font-weight: bold;">LinkedIn</a>` : ''}
      </div>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              background-color: ${brandSettings.backgroundColor};
              color: ${brandSettings.textColor};
              font-family: ${brandSettings.fontFamily}, 'Helvetica Neue', Arial, sans-serif;
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: none;
            }
            .wrapper {
              width: 100%;
              background-color: ${brandSettings.backgroundColor};
              padding: 24px 12px;
              box-sizing: border-box;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              padding: 32px;
              box-sizing: border-box;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            }
            .header-text {
              font-size: 11px;
              letter-spacing: 2px;
              color: #94a3b8;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 12px;
              text-align: ${brandSettings.logoAlignment};
            }
            .body-text {
              font-size: 14px;
              line-height: 1.6;
              color: ${brandSettings.textColor};
            }
            .footer {
              max-width: 600px;
              margin: 24px auto 0 auto;
              text-align: center;
              font-size: 11px;
              color: #64748b;
              line-height: 1.5;
            }
            .legal-text {
              margin-top: 12px;
              border-top: 1px solid #e2e8f0;
              padding-top: 12px;
              font-size: 10px;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header-text">${brandSettings.headerText}</div>
              ${logoHtml}
              <div class="body-text">
                ${parsed}
              </div>
            </div>
            <div class="footer">
              ${socialIconsHtml}
              <p>${brandSettings.footerText}</p>
              <p style="font-weight: 500; margin-top: 8px;">${brandSettings.unsubscribeText}</p>
              <div class="legal-text">${brandSettings.legalText}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  // Duplicate current template
  const handleDuplicateTemplate = () => {
    if (!editingTemplate) return;
    const newId = `tpl-dup-${Date.now()}`;
    const newTpl: EmailTemplate = {
      ...editingTemplate,
      id: newId,
      name: `${editingTemplate.name} (Copy)`,
      enabled: false,
      status: 'Draft',
      versionHistory: []
    };

    const newList = [...templates, newTpl];
    setTemplates(newList);
    localStorage.setItem('kava_email_templates', JSON.stringify(newList));
    setSelectedTemplateId(newId);
    triggerToast('Template Duplicated', `Created an editable clone: "${newTpl.name}".`, 'success');
  };

  // Reset to system default
  const handleResetToDefault = () => {
    if (!editingTemplate) return;
    const defaultTpl = INITIAL_TEMPLATES.find(t => t.id === editingTemplate.id);
    if (defaultTpl) {
      setEditingTemplate(JSON.parse(JSON.stringify(defaultTpl)));
      setIsDirty(true);
      triggerToast('Reset Applied', 'Template fields rolled back to default structure. Save to apply.', 'info');
    }
  };

  // Version Restore
  const handleRestoreVersion = (versionSubject: string, versionHtml: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      subject: versionSubject,
      contentHtml: versionHtml
    });
    setIsDirty(true);
    triggerToast('Version Restored', 'Older content layout loaded in editor. Save changes to commit.', 'success');
  };

  // Handle language updates
  const handleLanguageChange = (langCode: string) => {
    if (!editingTemplate) return;
    
    // Save current values to previous language
    const currentLang = selectedLanguage;
    const currentSubject = editingTemplate.subject;
    const currentPreview = editingTemplate.previewText;
    const currentHtml = editingTemplate.contentHtml;
    const currentText = editingTemplate.contentText;

    let updatedLangs = { ...(editingTemplate.languages || {}) };
    
    if (currentLang !== 'en') {
      updatedLangs[currentLang] = {
        subject: currentSubject,
        previewText: currentPreview,
        contentHtml: currentHtml,
        contentText: currentText
      };
    } else {
      // Primary English backup in main object
    }

    // Now load target language
    let nextSubject = '';
    let nextPreview = '';
    let nextHtml = '';
    let nextText = '';

    if (langCode === 'en') {
      // Restore from primary defaults of original templates list or previous memory
      const orig = templates.find(t => t.id === editingTemplate.id)!;
      nextSubject = orig.subject;
      nextPreview = orig.previewText;
      nextHtml = orig.contentHtml;
      nextText = orig.contentText;
    } else if (updatedLangs[langCode]) {
      nextSubject = updatedLangs[langCode].subject;
      nextPreview = updatedLangs[langCode].previewText;
      nextHtml = updatedLangs[langCode].contentHtml;
      nextText = updatedLangs[langCode].contentText;
    } else {
      // Start empty based on original template as boilerplate
      const orig = templates.find(t => t.id === editingTemplate.id)!;
      nextSubject = `[${langCode.toUpperCase()}] ${orig.subject}`;
      nextPreview = orig.previewText;
      nextHtml = orig.contentHtml;
      nextText = orig.contentText;
    }

    setEditingTemplate({
      ...editingTemplate,
      subject: nextSubject,
      previewText: nextPreview,
      contentHtml: nextHtml,
      contentText: nextText,
      languages: updatedLangs
    });

    setSelectedLanguage(langCode);
    triggerToast('Language Switched', `Editor now showing language: ${langCode.toUpperCase()}`, 'info');
  };

  // Simulate Trigger Event Execution
  const [triggerToRun, setTriggerToRun] = useState<string>('account_registration');
  const [triggerInputEmail, setTriggerInputEmail] = useState<string>('test.recipient@domain.com');
  const [triggerResults, setTriggerResults] = useState<string>('');

  const handleSimulateTrigger = () => {
    const matchedTpl = templates.find(t => t.trigger === triggerToRun);
    if (!matchedTpl) {
      triggerToast('Simulation Failed', 'No active template bound to this system trigger.', 'error');
      return;
    }

    if (!matchedTpl.enabled) {
      setTriggerResults(`[SIMULATION TERMINATED] System trigger: "${triggerToRun}" is currently disabled. Mail skipped.`);
      triggerToast('Trigger Disabled', 'System trigger is disabled. No email was sent.', 'error');
      return;
    }

    // Determine random delivery outcome
    const outcomes: ('Delivered' | 'Opened' | 'Clicked' | 'Failed')[] = ['Delivered', 'Opened', 'Clicked', 'Failed'];
    const randOutcome = outcomes[Math.floor(Math.random() * 3.6)]; // heavier weight on success
    const failureReason = randOutcome === 'Failed' ? 'Mailgun / SES failed validation: Recipient mailbox invalid.' : undefined;

    const newLogId = `log-${Date.now().toString().slice(-4)}`;
    const newLog: SentLog = {
      id: newLogId,
      recipient: triggerInputEmail,
      triggerSource: triggerToRun,
      subject: matchedTpl.subject.replace(/{{user_name}}/g, sampleVariables.user_name),
      timestamp: new Date().toISOString(),
      status: randOutcome,
      failureReason
    };

    const nextLogs = [newLog, ...sentLogs];
    setSentLogs(nextLogs);
    localStorage.setItem('kava_email_sent_logs', JSON.stringify(nextLogs));

    // Log in audit trail
    const auditMsg = `System Event Triggered: "${triggerToRun}" sent email to "${triggerInputEmail}". ID: ${newLogId} Status: ${randOutcome}`;
    const nextAudits = [auditMsg, ...auditLogs];
    setAuditLogs(nextAudits);
    localStorage.setItem('kava_email_audit_logs', JSON.stringify(nextAudits));

    // Update simulation summary
    setTriggerResults(`[TRIGGER SUCCEEDED] System event logged successfully!
Recipient: ${triggerInputEmail}
Trigger Source: "${triggerToRun}"
Bound Template: "${matchedTpl.name}"
SMTP Relay Target: "${smtpSettings.smtpHost}:${smtpSettings.smtpPort}" (SSL Authenticated)
Security Hash Checksum: ${Math.random().toString(36).substring(2, 10).toUpperCase()}
Result Status: ${randOutcome} ${failureReason ? `\nError Logs: ${failureReason}` : ''}`);

    triggerToast('Trigger Event Dispatched', `Simulated trigger successfully mapped. Status: ${randOutcome}`, 'success');
  };

  // Test send handlers
  const [testEmailTarget, setTestEmailTarget] = useState('arthawibawa777@gmail.com');
  const handleSendTestMail = (mode: 'myself' | 'test') => {
    const target = mode === 'myself' ? 'logged-in-admin@kavamemories.com' : testEmailTarget;
    if (!editingTemplate) return;

    triggerToast('Test Email Dispatched', `API simulated secure packet relayed to: ${target}`, 'success');

    const newLog: SentLog = {
      id: `test-${Date.now().toString().slice(-3)}`,
      recipient: target,
      triggerSource: editingTemplate.trigger,
      subject: `[TEST] ${editingTemplate.subject.replace(/{{user_name}}/g, sampleVariables.user_name)}`,
      timestamp: new Date().toISOString(),
      status: 'Delivered'
    };

    const nextLogs = [newLog, ...sentLogs];
    setSentLogs(nextLogs);
    localStorage.setItem('kava_email_sent_logs', JSON.stringify(nextLogs));
  };

  // SMTP credentials testing
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const handleTestSmtpConnection = () => {
    setIsTestingSmtp(true);
    setTimeout(() => {
      setIsTestingSmtp(false);
      triggerToast('SMTP Authentication Cleared', `Successfully established handshake with ${smtpSettings.smtpHost}:${smtpSettings.smtpPort}. SPF, DKIM, and DMARC alignments verification succeeded.`, 'success');
    }, 1200);
  };

  // Unsaved changes safety wrapper
  const handleNavigateSubTab = (target: 'templates' | 'branding' | 'triggers' | 'analytics' | 'logs' | 'smtp') => {
    if (isDirty) {
      setShowDiscardModal(() => () => {
        setActiveSubTab(target);
        setIsDirty(false);
        setShowDiscardModal(null);
      });
    } else {
      setActiveSubTab(target);
    }
  };

  // Log Searching & Filtering
  const filteredLogs = sentLogs.filter(log => {
    const matchesSearch = log.recipient.toLowerCase().includes(searchLogQuery.toLowerCase()) || 
                          log.subject.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
                          log.triggerSource.toLowerCase().includes(searchLogQuery.toLowerCase());
    const matchesStatus = filterLogStatus === 'All' ? true : log.status === filterLogStatus;
    return matchesSearch && matchesStatus;
  });

  // Analytics aggregate calculations
  const totalSent = sentLogs.length * 12 + 4210; // offset with dummy base
  const totalOpened = Math.round(totalSent * 0.81);
  const totalClicked = Math.round(totalSent * 0.24);
  const totalBounced = Math.round(totalSent * 0.012);
  const totalFailed = Math.round(totalSent * 0.005);
  const spamComplaints = Math.round(totalSent * 0.0004);
  const unsubscribeRate = 1.34;

  return (
    <div id="email_automation_center_root" className="space-y-6 animate-fade-in text-left">
      
      {/* UNSAVED CHANGES INDICATOR BANNER */}
      {isDirty && (
        <div className="flex justify-between items-center bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-black">UNSAVED CHANGES DETECTED</p>
              <p className="text-[10px] text-amber-700 font-semibold">You have made edits to your email automated configurations. Please save changes to synchronize them across the KAVA pipeline.</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                const orig = templates.find(t => t.id === editingTemplate?.id);
                if (orig) setEditingTemplate(JSON.parse(JSON.stringify(orig)));
                setIsDirty(false);
                triggerToast('Changes Discarded', 'Reverted modifications back to stored database snapshot.', 'info');
              }}
              className="px-3 py-1 bg-amber-200/50 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold rounded-lg text-[10px] transition-all cursor-pointer"
            >
              Discard
            </button>
            <button 
              onClick={handleSaveAll}
              className="px-4 py-1 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-lg text-[10px] shadow-sm transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Save className="w-3 h-3" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* DISCARD CONFIRMATION DIALOG MODAL */}
      {showDiscardModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-scale-up text-left">
            <div className="flex items-center space-x-3 mb-4 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-black text-slate-900">Discard unsaved settings?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              You are navigating away with unsaved email parameters. All recent changes made to templates, branding layout colors, or SMTP failovers will be permanently lost.
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowDiscardModal(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
              >
                Continue Editing
              </button>
              <button 
                onClick={() => {
                  showDiscardModal();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Yes, Discard All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-slate-800 tracking-widest uppercase font-mono">Platform Admin Panel</span>
          <h2 className="text-lg font-black text-slate-950 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-slate-700" />
            <span>KAVA Email Automation Center</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">Design responsive template wrappers, bind SMTP failover hooks, test triggers, and audit delivery analytics.</p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={handleSaveAll}
            disabled={!isDirty}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
              isDirty ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save Configurations</span>
          </button>
        </div>
      </div>

      {/* TAB SYSTEM */}
      <div className="flex overflow-x-auto border-b border-slate-200 pb-px scrollbar-none space-x-1">
        {[
          { id: 'templates', label: 'Email Templates', icon: Mail },
          { id: 'branding', label: 'Global Branding', icon: Sliders },
          { id: 'triggers', label: 'Trigger Simulator', icon: Play },
          { id: 'analytics', label: 'Delivery Analytics', icon: TrendingUp },
          { id: 'logs', label: 'Transmission Logs', icon: Database },
          { id: 'smtp', label: 'SMTP & SES Setup', icon: Settings }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => handleNavigateSubTab(tb.id as any)}
            className={`py-2.5 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === tb.id 
                ? 'border-slate-700 text-slate-900 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
            }`}
          >
            <tb.icon className="w-3.5 h-3.5 shrink-0" />
            <span>{tb.label}</span>
          </button>
        ))}
      </div>

      {/* CORE VIEWPORT SUB-VIEWS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ======================= TEMPLATE VIEW ======================= */}
        {activeSubTab === 'templates' && editingTemplate && (
          <>
            {/* LEFT CATEGORIES & TEMPLATES LIST */}
            <div className="xl:col-span-4 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 font-mono">Category Filter</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    'Authentication', 'Workspace', 'Event Lifecycle', 
                    'Guest Experience', 'Billing & Subscription', 'Support', 
                    'Security', 'Notifications', 'Marketing'
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        // reset editingTemplate focus on transition
                        const firstInCat = templates.find(t => t.category === cat);
                        if (firstInCat) setSelectedTemplateId(firstInCat.id);
                      }}
                      className={`px-1.5 py-2.5 rounded-lg border text-[9px] font-bold transition-all text-center leading-tight cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-slate-900 border-transparent text-white shadow-sm font-black' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {cat.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIST OF TEMPLATES IN CATEGORY */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-2">
                <h3 className="text-xs font-extrabold text-slate-900 pb-2 border-b border-slate-100 flex justify-between items-center">
                  <span>Templates ({templates.filter(t => t.category === selectedCategory).length})</span>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold uppercase">{selectedCategory}</span>
                </h3>
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
                  {templates.filter(t => t.category === selectedCategory).map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`w-full p-3 border text-left rounded-xl transition-all flex items-start space-x-3 cursor-pointer ${
                        selectedTemplateId === tpl.id 
                          ? 'bg-slate-100 border-slate-300' 
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${tpl.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-950 truncate pr-2">{tpl.name}</h4>
                          <span className={`text-[8px] px-1.5 py-0.2 rounded-md font-mono font-bold ${tpl.status === 'Published' ? 'bg-slate-200 text-slate-900' : 'bg-amber-100 text-amber-700'}`}>{tpl.status}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 block truncate">Trigger: {tpl.trigger}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      const newId = `tpl-custom-${Date.now()}`;
                      const customTpl: EmailTemplate = {
                        id: newId,
                        name: 'Custom Marketing Blast',
                        category: selectedCategory as any,
                        trigger: 'administrator_broadcasts',
                        enabled: true,
                        subject: 'An exciting update for you!',
                        previewText: 'Read our platform announcements.',
                        contentHtml: '<h3>KAVA Alert</h3><p>Hello {{user_name}}, welcome to our workspace news.</p>',
                        contentText: 'Welcome to our workspace news.',
                        status: 'Draft',
                        versionHistory: []
                      };
                      const newList = [...templates, customTpl];
                      setTemplates(newList);
                      localStorage.setItem('kava_email_templates', JSON.stringify(newList));
                      setSelectedTemplateId(newId);
                      triggerToast('Custom Template Added', 'New template registered inside selected category.', 'success');
                    }}
                    className="w-full py-2 border border-dashed border-slate-300 hover:border-slate-800 hover:text-slate-900 rounded-xl text-[11px] font-bold text-slate-500 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Custom Template</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC VARIABLES BROWSER CARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3 text-xs">
                <div className="flex items-center space-x-1 text-slate-900 pb-2 border-b border-slate-200">
                  <Sparkles className="w-4 h-4 text-slate-700 shrink-0" />
                  <h4 className="font-extrabold">Dynamic Variable Injection</h4>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Hover or click any tag below to insert it into the active cursor position. These interpolate live client-specific fields instantly.
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto">
                  {Object.entries(sampleVariables).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => {
                        // Quick insertion helper
                        const copyTag = `{{${key}}}`;
                        navigator.clipboard.writeText(copyTag);
                        setEditingTemplate({
                          ...editingTemplate,
                          contentHtml: editingTemplate.contentHtml + ' ' + copyTag
                        });
                        setIsDirty(true);
                        triggerToast('Tag Copied & Appended', `Injected variable block: ${copyTag}`, 'info');
                      }}
                      title={`Example value: ${val}`}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-mono font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>{`{{${key}}}`}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* MIDDLE TEXT/HTML EDITOR PANEL */}
            <div className="xl:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                
                {/* Status bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{editingTemplate.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Bound Event: {editingTemplate.trigger}</p>
                  </div>
                  
                  {/* Enabled Toggle & Published Status */}
                  <div className="flex items-center space-x-3 text-xs font-bold">
                    <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500">Status:</span>
                      <select
                        value={editingTemplate.status}
                        onChange={(e) => {
                          setEditingTemplate({ ...editingTemplate, status: e.target.value as any });
                          setIsDirty(true);
                        }}
                        className="bg-transparent border-none font-bold text-slate-800 text-[10px] focus:outline-none cursor-pointer"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500 shrink-0">Trigger Hook:</span>
                      <button
                        onClick={() => {
                          setEditingTemplate({ ...editingTemplate, enabled: !editingTemplate.enabled });
                          setIsDirty(true);
                        }}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          editingTemplate.enabled ? 'bg-slate-900' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            editingTemplate.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Multilingual Support Dropdown */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>Language Localization</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Languages className="w-3.5 h-3.5 text-slate-700" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 text-[10px] focus:outline-none"
                    >
                      {languagesList.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject & Preheader */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex justify-between">
                      <span>Email Subject line</span>
                      <span className="text-[10px] text-slate-400 font-mono">({selectedLanguage.toUpperCase()})</span>
                    </label>
                    <input
                      type="text"
                      value={editingTemplate.subject}
                      onChange={(e) => {
                        setEditingTemplate({ ...editingTemplate, subject: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="e.g. Welcome to KAVA, {{user_name}}!"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-slate-950 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      <span>Preheader Preview Text</span>
                    </label>
                    <input
                      type="text"
                      value={editingTemplate.previewText}
                      onChange={(e) => {
                        setEditingTemplate({ ...editingTemplate, previewText: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="Appears in mailbox list summaries right after the subject"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:border-slate-950 text-[11px]"
                    />
                  </div>
                </div>

                {/* Rich HTML Content Editor */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <label className="block font-bold text-slate-700">Body Content Layout (Rich HTML)</label>
                    <span className="text-[10px] text-slate-600 font-bold">Base64 Images / Web assets allowed</span>
                  </div>
                  
                  {/* Quick insert blocks toolbar */}
                  <div className="flex overflow-x-auto bg-slate-50 border border-slate-200 p-1.5 rounded-lg gap-1 scrollbar-none mb-1">
                    <span className="text-[9px] text-slate-400 font-bold self-center px-1.5 shrink-0">Insert Block:</span>
                    {reusableBlocks.map(blk => (
                      <button
                        key={blk.id}
                        onClick={() => {
                          setEditingTemplate({
                            ...editingTemplate,
                            contentHtml: editingTemplate.contentHtml + '\n' + blk.template
                          });
                          setIsDirty(true);
                          triggerToast('Block Injected', `Appended snippet: ${blk.label}`, 'info');
                        }}
                        className="bg-white hover:bg-slate-100 border border-slate-200 rounded-md px-2 py-1 text-[9px] text-slate-700 font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        {blk.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={12}
                    value={editingTemplate.contentHtml}
                    onChange={(e) => {
                      setEditingTemplate({ ...editingTemplate, contentHtml: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-slate-800"
                    placeholder="Enter standard HTML with inline styling directives..."
                  />
                </div>

                {/* Plain Text Fallback Section */}
                <div className="space-y-2 text-xs pt-1">
                  <label className="block font-bold text-slate-700">Plain Text Fallback Fallback</label>
                  <textarea
                    rows={3}
                    value={editingTemplate.contentText}
                    onChange={(e) => {
                      setEditingTemplate({ ...editingTemplate, contentText: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-sans text-[11px] leading-relaxed text-slate-600 focus:outline-none focus:border-slate-400"
                    placeholder="Stripped-down copy used for older readers and spam compliance..."
                  />
                </div>

                {/* VERSION HISTORY ACCORDION */}
                {editingTemplate.versionHistory && editingTemplate.versionHistory.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
                    <h4 className="font-extrabold text-slate-900 pb-2 border-b border-slate-200 flex items-center space-x-1">
                      <History className="w-3.5 h-3.5 text-slate-700" />
                      <span>Saved Draft Version History</span>
                    </h4>
                    <div className="mt-2.5 space-y-2 max-h-[110px] overflow-y-auto">
                      {editingTemplate.versionHistory.map((hist, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[10px]">
                          <div>
                            <span className="font-bold text-slate-800">v{hist.version}</span>
                            <span className="text-slate-400 ml-1.5">by {hist.modifiedBy} • {new Date(hist.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <button
                            onClick={() => handleRestoreVersion(hist.subject, hist.contentHtml)}
                            className="text-slate-900 hover:text-black hover:underline font-bold font-mono cursor-pointer"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTION TOOLBAR FOOTER */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100 justify-between">
                  <div className="flex space-x-1.5">
                    <button
                      onClick={handleResetToDefault}
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-[11px] font-bold text-slate-500 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={handleDuplicateTemplate}
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-[11px] font-bold text-slate-500 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Clone</span>
                    </button>
                  </div>
                  
                  <div className="flex space-x-1.5">
                    <button
                      onClick={handleSaveAll}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-[11px] transition-all cursor-pointer flex items-center space-x-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Changes</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE LIVE DESKTOP/MOBILE PREVIEW */}
            <div className="xl:col-span-3 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col h-full min-h-[500px]">
                
                {/* PREVIEW CONTAINER HEADER */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Eye className="w-4 h-4 text-slate-700 shrink-0" />
                    <span className="text-[11px] font-black text-slate-900">Live Client Viewport</span>
                  </div>
                  
                  {/* Viewport Width Controls */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'}`}
                      title="Desktop Viewport (600px)"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'}`}
                      title="Mobile Viewport (360px)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* METRICS TEST DISPATCH BAR */}
                <div className="my-3 bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Send className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span className="font-extrabold">Instant Simulation Box</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <input
                      type="email"
                      value={testEmailTarget}
                      onChange={(e) => setTestEmailTarget(e.target.value)}
                      placeholder="Receiver Address..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-medium"
                    />
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleSendTestMail('myself')}
                        className="py-1 px-2 border border-slate-200 hover:bg-slate-50 rounded text-[9px] font-bold text-slate-600"
                      >
                        Send to Admin
                      </button>
                      <button
                        onClick={() => handleSendTestMail('test')}
                        className="py-1 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[9px] font-black text-center"
                      >
                        Dispatch Test
                      </button>
                    </div>
                  </div>
                </div>

                {/* IFRAME WRAPPER PREVIEW CONTAINER */}
                <div className="flex-1 bg-slate-200 rounded-2xl overflow-hidden p-2 flex justify-center items-center relative min-h-[350px]">
                  <div 
                    className="h-full bg-white transition-all duration-300 shadow-xl overflow-y-auto rounded-lg"
                    style={{ 
                      width: previewMode === 'desktop' ? '100%' : '320px', 
                      maxHeight: '480px' 
                    }}
                  >
                    <iframe
                      title="Email Preview Container"
                      srcDoc={generateInterpContent(editingTemplate.contentHtml)}
                      sandbox="allow-same-origin"
                      className="w-full h-full min-h-[420px] border-none pointer-events-none"
                    />
                  </div>
                </div>

                <div className="mt-3 text-[9px] text-center text-slate-400 font-semibold leading-relaxed">
                  Real-time CSS is securely sandboxed to prevent styles from colliding with KAVA's core layouts.
                </div>

              </div>
            </div>
          </>
        )}

        {/* ======================= BRANDING VIEW ======================= */}
        {activeSubTab === 'branding' && (
          <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* DESIGN CONTROLS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">Global Email Template Wrapper Stylist</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Customize global fonts, logos, colors, social indexes, and legal disclosures.</p>
              </div>

              {/* Logo Upload Mock / Alignment */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company logo image asset URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={brandSettings.logoUrl}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, logoUrl: e.target.value });
                        setIsDirty(true);
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                      placeholder="https://images.unsplash.com/photo..."
                    />
                    <button
                      onClick={() => {
                        // Simulate local asset mock loader
                        setBrandSettings({
                          ...brandSettings,
                          logoUrl: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?auto=format&fit=crop&w=150&h=50&q=80'
                        });
                        setIsDirty(true);
                        triggerToast('Simulated Upload', 'Uploaded customized corporate assets into sandbox state.', 'success');
                      }}
                      className="px-3 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
                    >
                      Mock Upload
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Logo Height (pixels)</label>
                    <input
                      type="number"
                      value={brandSettings.logoHeight}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, logoHeight: parseInt(e.target.value) || 30 });
                        setIsDirty(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Logo Alignment</label>
                    <select
                      value={brandSettings.logoAlignment}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, logoAlignment: e.target.value as any });
                        setIsDirty(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                    >
                      <option value="left">Left-aligned</option>
                      <option value="center">Centered</option>
                      <option value="right">Right-aligned</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Brand Color Indicators */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Color (Action elements)</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={brandSettings.primaryColor}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, primaryColor: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 shrink-0"
                    />
                    <input
                      type="text"
                      value={brandSettings.primaryColor}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, primaryColor: e.target.value });
                        setIsDirty(true);
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 font-mono uppercase text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secondary Color (Accents)</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={brandSettings.secondaryColor}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, secondaryColor: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 shrink-0"
                    />
                    <input
                      type="text"
                      value={brandSettings.secondaryColor}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, secondaryColor: e.target.value });
                        setIsDirty(true);
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 font-mono uppercase text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Typography / Headers / Social */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selected Body Typography</label>
                  <select
                    value={brandSettings.fontFamily}
                    onChange={(e) => {
                      setBrandSettings({ ...brandSettings, fontFamily: e.target.value as any });
                      setIsDirty(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="Inter">Inter (Clean modern sans-serif)</option>
                    <option value="Space Grotesk">Space Grotesk (Tech-forward)</option>
                    <option value="Outfit">Outfit (Geometric & spacious)</option>
                    <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                    <option value="Fira Code">Fira Code (Developer Mono)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Header Top Margin Greeting Text</label>
                  <input
                    type="text"
                    value={brandSettings.headerText}
                    onChange={(e) => {
                      setBrandSettings({ ...brandSettings, headerText: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Facebook Handle</label>
                    <input
                      type="text"
                      value={brandSettings.socialFacebook}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, socialFacebook: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Twitter/X Link</label>
                    <input
                      type="text"
                      value={brandSettings.socialTwitter}
                      onChange={(e) => {
                        setBrandSettings({ ...brandSettings, socialTwitter: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unsubscribe Disclosure Notice</label>
                  <input
                    type="text"
                    value={brandSettings.unsubscribeText}
                    onChange={(e) => {
                      setBrandSettings({ ...brandSettings, unsubscribeText: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Legal Footnotes & Copyright disclosures</label>
                  <textarea
                    rows={2}
                    value={brandSettings.legalText}
                    onChange={(e) => {
                      setBrandSettings({ ...brandSettings, legalText: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-sans text-slate-500"
                  />
                </div>
              </div>

            </div>

            {/* LIVE BRANDING MOCK PREVIEW */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center space-x-1.5">
                  <Layout className="w-4 h-4 text-slate-700" />
                  <span>Branding Grid Frame Preview</span>
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  Below is how all emails will be wrapped when routed dynamically by KAVA trigger hooks.
                </p>
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-[450px] overflow-y-auto">
                  <iframe
                    title="Global Branding Template View"
                    srcDoc={generateInterpContent('<h1 style="color: {{primary_color}}; font-family: {{font_family}};">Example Core Alert</h1><p>This is a mock presentation of transactional payload injected safely into the brand styled wrapper.</p>')}
                    sandbox="allow-same-origin"
                    className="w-full h-full min-h-[380px] border-none pointer-events-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setBrandSettings(DEFAULT_BRAND_SETTINGS);
                    setIsDirty(true);
                    triggerToast('Branding Reset', 'Custom stylings rolled back to initial KAVA design presets.', 'info');
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Reset To Default presets
                </button>
                <button
                  onClick={handleSaveAll}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Apply & Synchronize Branding
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ======================= TRIGGER SIMULATOR ======================= */}
        {activeSubTab === 'triggers' && (
          <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* INSTRUCTIONS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:col-span-1 space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">Live Trigger Hook Simulator</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Test real-time routing engines without actual user-action overhead.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select System Event Trigger</label>
                  <select
                    value={triggerToRun}
                    onChange={(e) => setTriggerToRun(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.trigger}>{t.name} ({t.trigger})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Receiver Recipient Box</label>
                  <input
                    type="email"
                    value={triggerInputEmail}
                    onChange={(e) => setTriggerInputEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    placeholder="recipient@example.com"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSimulateTrigger}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 shrink-0 fill-current" />
                    <span>Relay Simulation Packet</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 leading-relaxed space-y-1">
                <p className="font-extrabold text-slate-900">Platform Integration Active:</p>
                <p className="text-[10px] text-slate-700 font-medium">
                  Trigger mappings automatically synchronize. For example, if a user files a new Support ticket, the database immediately triggers the <strong>support_ticket_updates</strong> email automatically.
                </p>
              </div>
            </div>

            {/* RESULTS OUTPUT TERMINAL */}
            <div className="bg-slate-950 border border-slate-300 rounded-3xl p-6 md:col-span-2 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Code className="w-64 h-64 text-white" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-slate-500 pl-2 font-bold">KAVA_SMTP_RELAY_CONSOLE</span>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">SMTP STATUS: SECURE</span>
                </div>

                <div className="font-mono text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {triggerResults || `[IDLE] Waiting for event simulation... Select an event trigger on the left and dispatch it to view diagnostic metadata trace logs here.`}
                </div>
              </div>

              <div className="border-t border-slate-900 pt-4 mt-6 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                <span>DNS SECURE Handshake: VERIFIED</span>
                <button
                  onClick={() => setTriggerResults('')}
                  className="text-slate-400 hover:text-white transition-all underline cursor-pointer"
                >
                  Clear Console Logs
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ======================= DELIVERY ANALYTICS VIEW ======================= */}
        {activeSubTab === 'analytics' && (
          <div className="xl:col-span-12 space-y-6">
            
            {/* STATS HIGHLIGHT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { label: 'Total Volume Dispatched', count: totalSent.toLocaleString(), percent: '100%', color: 'text-slate-950', bg: 'bg-white' },
                { label: 'Unique Opens Recorded', count: totalOpened.toLocaleString(), percent: '84.1%', color: 'text-slate-900', bg: 'bg-slate-100' },
                { label: 'Unique Click-Throughs', count: totalClicked.toLocaleString(), percent: '27.5%', color: 'text-emerald-600', bg: 'bg-emerald-50/20' },
                { label: 'Hard/Soft Bounces', count: totalBounced.toLocaleString(), percent: '0.71%', color: 'text-amber-600', bg: 'bg-amber-50/20' },
                { label: 'Relay Failures logged', count: totalFailed.toLocaleString(), percent: '0.24%', color: 'text-rose-600', bg: 'bg-rose-50/20' },
                { label: 'Complaints & Opt-outs', count: `${spamComplaints} / ${unsubscribeRate}%`, percent: '0.04%', color: 'text-slate-500', bg: 'bg-slate-50' }
              ].map((card, idx) => (
                <div key={idx} className={`${card.bg} border border-slate-200 rounded-2xl p-4 space-y-1 shadow-xs`}>
                  <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest leading-normal">{card.label}</p>
                  <h4 className={`text-sm md:text-base font-black ${card.color}`}>{card.count}</h4>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md font-mono font-bold">{card.percent}</span>
                    <span className="text-[9px] text-slate-400 font-bold">rate</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LINE GRAPH DISPATCH TIMELINE */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-900">Interactive Dispatch Timeline Index</h3>
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">Past 30 Days</span>
                </div>
                
                {/* SVG Visual Chart */}
                <div className="w-full h-[240px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 relative p-4">
                  <svg className="w-full h-full" viewBox="0 0 500 180">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0f172a" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                    
                    {/* Graph Area */}
                    <path d="M 0,130 Q 80,40 160,90 T 320,50 T 450,30 L 500,10 L 500,160 L 0,160 Z" fill="url(#grad)" />
                    {/* Line path */}
                    <path d="M 0,130 Q 80,40 160,90 T 320,50 T 450,30 L 500,10" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                    
                    {/* Data Nodes */}
                    <circle cx="160" cy="90" r="4.5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="320" cy="50" r="4.5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="450" cy="30" r="4.5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  
                  {/* Floating labels */}
                  <div className="absolute top-8 left-4 text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">v1.2 Launch Spike</div>
                  <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 font-bold">July 2026 Timeline</div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                  <span>Week 1 (11,002)</span>
                  <span>Week 2 (14,409)</span>
                  <span>Week 3 (19,879)</span>
                  <span>Today (Active Flowing)</span>
                </div>
              </div>

              {/* DYNAMIC RATIOS PIE CHART */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-900">Device User-Agent Share</h3>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">Real-time</span>
                </div>

                <div className="flex justify-center items-center h-[200px] relative">
                  {/* Mock Pie Ring */}
                  <div className="w-36 h-36 rounded-full border-[18px] border-slate-900 flex items-center justify-center border-t-emerald-500 border-r-amber-500">
                    <div className="text-center">
                      <p className="text-base font-black text-slate-900">Desktop</p>
                      <p className="text-[10px] text-slate-400 font-mono font-bold">64.2% Share</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10px] font-bold text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-slate-900" /> <span>Desktop Mail Readers</span></span>
                    <span>64.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> <span>Mobile / Tablet Apps</span></span>
                    <span>31.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> <span>Fallback Console / API</span></span>
                    <span>4.3%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================= TRANSMISSION LOGS VIEW ======================= */}
        {activeSubTab === 'logs' && (
          <div className="xl:col-span-12 space-y-4">
            
            {/* SEARCH AND FILTERS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLogQuery}
                  onChange={(e) => setSearchLogQuery(e.target.value)}
                  placeholder="Search recipient, trigger, or subject..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex space-x-2 w-full md:w-auto">
                <select
                  value={filterLogStatus}
                  onChange={(e) => setFilterLogStatus(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                >
                  <option value="All">All statuses</option>
                  <option value="Opened">Opened</option>
                  <option value="Clicked">Clicked</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>

                <button
                  onClick={() => {
                    setSentLogs([]);
                    localStorage.setItem('kava_email_sent_logs', JSON.stringify([]));
                    triggerToast('Logs Cleared', 'Historical transmission tracking tables purged.', 'success');
                  }}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 font-bold rounded-xl text-xs flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Tracking History</span>
                </button>
              </div>
            </div>

            {/* LOGS TABLE LIST */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500">
                  <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-bold">Recipient</th>
                      <th className="px-6 py-3 font-bold">Trigger Source</th>
                      <th className="px-6 py-3 font-bold">Subject Injected Header</th>
                      <th className="px-6 py-3 font-bold">Dispatch Timestamp</th>
                      <th className="px-6 py-3 font-bold">Relay Status</th>
                      <th className="px-6 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{log.recipient}</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                            {log.triggerSource}
                          </span>
                        </td>
                        <td className="px-6 py-4 truncate max-w-xs">{log.subject}</td>
                        <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                            log.status === 'Opened' ? 'bg-slate-200 text-slate-800' :
                            log.status === 'Clicked' ? 'bg-emerald-100 text-emerald-800' :
                            log.status === 'Failed' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {log.status}
                          </span>
                          {log.failureReason && (
                            <span className="block text-[9px] text-rose-500 font-semibold mt-1" title={log.failureReason}>
                              Reason: {log.failureReason}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              // Resend simulation
                              const resendLog: SentLog = {
                                ...log,
                                id: `log-resend-${Date.now().toString().slice(-3)}`,
                                timestamp: new Date().toISOString(),
                                status: 'Delivered'
                              };
                              const nextLogs = [resendLog, ...sentLogs];
                              setSentLogs(nextLogs);
                              localStorage.setItem('kava_email_sent_logs', JSON.stringify(nextLogs));
                              triggerToast('Email Dispatched', `Re-transmitted simulation block to: ${log.recipient}`, 'success');
                            }}
                            className="text-slate-900 hover:text-slate-700 hover:underline font-bold transition-colors cursor-pointer text-[11px]"
                          >
                            Resend Email
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400 font-bold">
                          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <span>No transmission metrics found matching criteria.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AUDIT TRAIL LOGS BOX */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs">
              <h4 className="font-extrabold text-slate-900 pb-2 border-b border-slate-200 flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>Security Audit Trail & Connection Handshakes</span>
              </h4>
              <div className="mt-3.5 space-y-2 max-h-[160px] overflow-y-auto">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[10px] font-mono leading-relaxed border-b border-slate-100 pb-1.5">
                    <span className="text-slate-900 font-bold shrink-0">[{new Date().toLocaleDateString()}]</span>
                    <span className="text-slate-600">{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================= SMTP & API CONFIG VIEW ======================= */}
        {activeSubTab === 'smtp' && (
          <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SMTP CREDENTIALS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">API Gateway & SMTP Server Integrations</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Relay raw emails safely via industry providers or standard SMTP relay links.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Email Delivery Service</label>
                  <select
                    value={smtpSettings.provider}
                    onChange={(e) => {
                      setSmtpSettings({ ...smtpSettings, provider: e.target.value as any });
                      setIsDirty(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800"
                  >
                    <option value="resend">Resend (Highly Recommended)</option>
                    <option value="sendgrid">SendGrid Web API</option>
                    <option value="ses">Amazon SES Gateway</option>
                    <option value="smtp">Standard SMTP Relay Host</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">API Key / Secret Token</label>
                  <input
                    type="password"
                    value={smtpSettings.apiKey}
                    onChange={(e) => {
                      setSmtpSettings({ ...smtpSettings, apiKey: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                    placeholder="Enter private client authorization key"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SMTP Outbound Host</label>
                    <input
                      type="text"
                      value={smtpSettings.smtpHost}
                      onChange={(e) => {
                        setSmtpSettings({ ...smtpSettings, smtpHost: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Secure Port</label>
                    <input
                      type="text"
                      value={smtpSettings.smtpPort}
                      onChange={(e) => {
                        setSmtpSettings({ ...smtpSettings, smtpPort: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sender Friendly Name</label>
                    <input
                      type="text"
                      value={smtpSettings.senderName}
                      onChange={(e) => {
                        setSmtpSettings({ ...smtpSettings, senderName: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sender Email address</label>
                    <input
                      type="email"
                      value={smtpSettings.senderEmail}
                      onChange={(e) => {
                        setSmtpSettings({ ...smtpSettings, senderEmail: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleTestSmtpConnection}
                    disabled={isTestingSmtp}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTestingSmtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying SPF/DKIM Handshake...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4" />
                        <span>Perform Outbound Connection Test</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* FAILOVER SETTINGS */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-200 flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Secure Delivery Failover System</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Prevent customer communication failure. If your primary email provider triggers an outage or a rate-limit error, KAVA automatically routes transactions via your secondary failover server.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-slate-950">Enable Automatic Failover Handler</p>
                      <p className="text-[10px] text-slate-500 font-medium">Auto-reroute on bounce or validation timeout.</p>
                    </div>
                    <button
                      onClick={() => {
                        setSmtpSettings({ ...smtpSettings, failoverEnabled: !smtpSettings.failoverEnabled });
                        setIsDirty(true);
                      }}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        smtpSettings.failoverEnabled ? 'bg-slate-950' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          smtpSettings.failoverEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {smtpSettings.failoverEnabled && (
                    <div className="space-y-3 animate-fade-in text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Secondary Backup SMTP Host</label>
                        <input
                          type="text"
                          value={smtpSettings.failoverHost}
                          onChange={(e) => {
                            setSmtpSettings({ ...smtpSettings, failoverHost: e.target.value });
                            setIsDirty(true);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Failover Threshold Timeout</label>
                        <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700">
                          <option>5 Seconds (Recommended)</option>
                          <option>10 Seconds</option>
                          <option>30 Seconds</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleSaveAll}
                  className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Integration Preferences
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
