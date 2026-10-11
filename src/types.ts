export type ContributionType = 'photo' | 'video' | 'voice' | 'wish';

export type ExperienceMode = 'memory_capsule' | 'photo_collection';

export interface EventSettings {
  experienceMode?: ExperienceMode;
  guestUploadAllowed: boolean;
  instantReveal: boolean; // whether contributions appear instantly on the live wall
  allowedTypes: ContributionType[];
  requireApproval: boolean;
  allowGuestDownloads?: boolean;
  allowDownloads?: boolean;
  guestDownloadScope?: 'all' | 'own';
  downloadWatermarked?: boolean;
  downloadOriginalQuality?: boolean;
  allowOriginalQualityDownload?: boolean;
  applyWatermark?: boolean;
  liveScreenEnabled?: boolean;
  enableLiveScreen?: boolean;
  showPendingToGuests?: boolean;
  invitationToken?: string;
  // Host Account & Workspace Ownership
  hostId?: string;
  hostName?: string;
  hostEmail?: string;
  workspaceId?: string;
  // Upload Settings
  uploadStartTime?: string;
  uploadDeadline?: string;
  deadlineMode?: 'same_day' | 'plus_1_day' | 'plus_3_days' | 'plus_7_days' | 'custom';
  revealMode?: 'live' | 'after_event' | 'scheduled';
  photoLimit?: number;
  videoLimit?: number;
  voiceLimit?: number;
  wishLimit?: number;
  // Premium Photo Picker settings
  allowMultiplePhotos?: boolean;
  maxPhotosLimit?: number;
  maxPhotoSizeMB?: number;
  allowedFormats?: string[];
  // Privacy Settings
  hideContributorNames?: boolean;
  allowAnonymousWishes?: boolean;
  guestVisibility?: 'all' | 'own' | 'none';
  // Presentation & Live Settings
  presentationTheme?: 'wedding' | 'minimal_light' | 'minimal_dark' | 'elegant' | 'corporate' | 'cyber' | 'custom';
  presentationBackgroundType?: 'solid' | 'gradient' | 'image' | 'blur_glass' | 'minimal_light' | 'minimal_dark' | 'elegant' | 'wedding' | 'corporate' | 'custom';
  presentationBgColor?: string;
  presentationBgGradient?: string;
  presentationBgImageUrl?: string;
  presentationBgOpacity?: number;
  presentationBgBlur?: number;
  qrCodePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'none';
  qrCodeSize?: 'small' | 'medium' | 'large' | 'xl';
  joinLinkVisible?: boolean;
  joinLinkPosition?: 'adjacent' | 'bottom-center' | 'top-center';
  eventTitleVisible?: boolean;
  eventInfoVisible?: boolean;
  logoVisible?: boolean;
  logoUrl?: string;
  footerVisible?: boolean;
  footerText?: string;
  safeAreaEnabled?: boolean;
  screenMargins?: 'compact' | 'normal' | 'relaxed';
  slideshowInterval?: number;
  transitionAnimation?: 'fade' | 'slide' | 'zoom' | 'none';
  alwaysShowQr?: boolean;
  alwaysShowJoinLink?: boolean;
  showEventCode?: boolean;
  showUploadInstructions?: boolean;
  idleBehavior?: 'loop' | 'placeholder';
  // Live Reaction settings
  reactionsEnabled?: boolean;
  reactionFrequencyLimit?: 'none' | 'slow' | 'medium' | 'fast';
  reactionsMomentOnly?: boolean;
  reactionsActiveMoment?: boolean; // toggle during selected moments
  // Custom Live Background transform & layout parameters
  bgImageZoom?: number;
  bgImageRotate?: number;
  bgImageXOffset?: number;
  bgImageYOffset?: number;
  bgImageCropTop?: number;
  bgImageCropBottom?: number;
  bgImageCropLeft?: number;
  bgImageCropRight?: number;
  presentationFontFamily?: string;
  isSlideshowPaused?: boolean;
  showPhotos?: boolean;
  showVideos?: boolean;
  showVoices?: boolean;
  showWishes?: boolean;
  showPinnedMemories?: boolean;
  showOfficialPhotos?: boolean;
  moderationApprovedOnly?: boolean;
  moderationHideSelected?: boolean;
  moderationHideAnonymous?: boolean;
  moderationHideNames?: boolean;
  moderationShowPinnedOnly?: boolean;
  approvedConIds?: string[];
  rejectedConIds?: string[];
  hiddenConIds?: string[];
  contributionApprovalMode?: 'auto' | 'manual' | 'mixed';
  mixedApprovalTypes?: {
    photo?: boolean;
    video?: boolean;
    voice?: boolean;
    wish?: boolean;
  };
  guestAccessMode?: 'open' | 'code' | 'qr_only' | 'closed';
  guestRequireName?: boolean;
  // Background Music & Audio Mixer Settings
  enableBgm?: boolean;
  bgmSource?: 'preset' | 'upload';
  bgmFileUrl?: string;
  bgmFileName?: string;
  bgmFileSize?: string;
  bgmFileDuration?: string;
  bgmVolume?: number;
  bgmLoop?: boolean;
  bgmFadeIn?: number;
  bgmFadeOut?: number;
  bgmStartTiming?: string;
  enableDucking?: boolean;
  duckLevel?: number;
  fadeDownDuration?: number;
  fadeUpDuration?: number;
  mixerBgmVolume?: number;
  mixerVoiceVolume?: number;
  mixerSystemVolume?: number;
  bgmAutoplay?: boolean;
  // Greeting Settings (per Capsule/Event)
  greetingType?: 'voice' | 'video' | 'none';
  greetingVoiceUrl?: string;
  greetingVoiceName?: string;
  greetingVideoUrl?: string;
  greetingVideoName?: string;
  greetingAutoStartRecording?: boolean;
  greetingCountdown?: 'none' | '3' | '5';
  greetingNotificationTone?: 'classic' | 'soft_bell' | 'vintage_telephone' | 'wedding_chime';
  greetingVolume?: number; // 0-100
  greetingSkipEnabled?: boolean;
  greetingReplayEnabled?: boolean;
  greetingEnabled?: boolean;
  // Photo Experience settings
  photoTitle?: string;
  photoDesc?: string;
  photoWelcomeImage?: string;
  photoOverlayText?: string;
  photoEnableFrame?: boolean;
  photoFrameUrl?: string;
  photoFrameOpacity?: number;
  photoFramePosition?: string;
  photoEnableWatermark?: boolean;
  photoWatermarkUrl?: string;
  photoWatermarkPosition?: string;
  photoWatermarkSize?: number;
  photoWatermarkOpacity?: number;
  photoFilter?: string;
  photoCustomLutUrl?: string;
  photoCameraMode?: string;
  photoEnableLive?: boolean;
  photoAllowBurst?: boolean;
  photoCompress?: boolean;
  photoPreserveExif?: boolean;
  photoStripGps?: boolean;
  photoAutoEnhance?: boolean;
  // Photo Collection specific settings
  enableWatermark?: boolean;
  watermarkLogoUrl?: string;
  watermarkText?: string;
  photoWatermarkText?: string;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  watermarkOpacity?: number;
  photoFilterStyle?: string;
  photoFrameStyle?: string;
  photoFrameCaption?: string;
  photoShowDateOnFrame?: boolean;
  photoFrameFont?: string;
  photoRevealTiming?: string;
  photoCustomRevealDate?: string;
  photoDurationMode?: string;
  photoEndDate?: string;
  photoEndTime?: string;
  allowLikes?: boolean;
  showLikeCount?: boolean;
  allowReactions?: boolean;
  photoQualityMode?: 'original_lossless' | 'smart_web_optimized' | 'ultra_hd';
  cameraCaptureMode?: 'both' | 'camera_only' | 'upload_only' | 'burst';
  applyWatermarkToDownloads?: boolean;
  originalQualityStorage?: boolean;
  photoUploadLimit?: number;
  guestApprovalRequired?: boolean;
  guestGalleryVisibility?: 'all' | 'own' | 'none';
  revealDate?: string;
  allowGuestFullResolutionDownload?: boolean;
  // Video Experience settings
  videoIntroUrl?: string;
  videoEnableIntro?: boolean;
  videoMaxDuration?: number;
  videoQuality?: '720p' | '1080p' | '4k' | 'auto';
  allowCameraRecording?: boolean;
  allowVideoGalleryUpload?: boolean;
  allowGalleryUpload?: boolean;
  allowFlipCamera?: boolean;
  afterSubmitRedirect?: 'thanks' | 'gallery';
  videoCountdown?: string;
  videoAutoStart?: boolean;
  videoAllowReplay?: boolean;
  videoAllowSkipIntro?: boolean;
  videoOverlayLogoUrl?: string;
  videoFrameUrl?: string;
  videoIntroAnimation?: string;
  videoEndingScreen?: string;
  videoIntroBgmUrl?: string;
  videoAutoDucking?: boolean;
  // New Video Experience uploads settings
  videoIntroSourceType?: 'upload' | 'url';
  videoIntroFileName?: string;
  videoIntroFileSize?: string;
  videoIntroDuration?: string;
  videoIntroMaxSize?: number;
  videoBgmSourceType?: 'upload' | 'url';
  videoBgmFileName?: string;
  videoBgmVolume?: number;
  videoLoopMusic?: boolean;
  videoBgmFadeIn?: number;
  videoBgmFadeOut?: number;
  videoFrameSourceType?: 'upload' | 'url';
  videoFrameFileName?: string;
  videoFrameOpacity?: number;
  videoFrameSafeGuide?: boolean;
  videoWatermarkSourceType?: 'upload' | 'url';
  videoWatermarkFileName?: string;
  videoWatermarkPosition?: string;
  videoWatermarkSize?: string;
  videoWatermarkOpacity?: number;
  videoUseDefaultWatermark?: boolean;
  // Guest Invitation Cover Themes Settings
  invitationCoverTheme?: 'classic_card' | 'full_hero' | 'magazine_editorial' | 'minimal_poster';
  invitationCoverImage?: string;
  invitationOverlayStrength?: 'light' | 'medium' | 'dark';
  invitationTextAlignment?: 'left' | 'center';
  invitationImageStyle?: 'rounded' | 'full_width';
  invitationShowDate?: boolean;
  invitationShowLocation?: boolean;
  invitationShowDescription?: boolean;

  // Voice Guest Book settings
  voiceScriptPreview?: string;
  voiceEnableTranscript?: boolean;
  voiceNoiseReduction?: boolean;
  voiceEchoCancellation?: boolean;
  voiceNormalizeVolume?: boolean;
  voiceSilenceDetection?: boolean;
  voiceAutoTrim?: boolean;
  voiceMaxRecordingLength?: number;
  // Wishes & Messages settings
  wishHeadline?: string;
  wishIntroText?: string;
  wishPlaceholder?: string;
  wishSuggestedPrompts?: string;
  wishMinChars?: number;
  wishMaxChars?: number;
  wishAllowEmojis?: boolean;
  wishEnableHandwriting?: boolean;
  wishEnableSignature?: boolean;
  wishFont?: string;
  wishAlignment?: string;
  wishBubbleStyle?: string;
  wishTheme?: string;
  wishBgIllustration?: string;
  wishThankYou?: string;
  wishSuccessAnimation?: boolean;
  // Global Experience settings
  globalSuccessMessage?: string;
  globalSuccessIllustration?: string;
  globalCelebrationAnimation?: string;
  globalBrandLogo?: string;
  globalColorPrimary?: string;
  globalColorAccent?: string;
  typographyWeight?: string;
  typographyScale?: string;
  typographyFallback?: string;
  globalPrivacyNotice?: string;
  globalConsentText?: string;
  overrideWorkspaceBrand?: boolean;
  // Event Localization settings
  defaultLanguage?: SupportedLanguageCode;
  autoLocalization?: boolean;

  // Guest Access & Security settings
  guestAccessEnabled?: boolean;
  requiresPassword?: boolean;
  eventPassword?: string;
  expirationDate?: string;
  startDate?: string;
  maxGuests?: number;
  joinHistory?: EventJoinLog[];
}

export interface EventJoinLog {
  id: string;
  eventId: string;
  timestamp: string;
  guestName?: string;
  guestId?: string;
  device: string;
  browser: string;
  country: string;
  referralSource: string;
  joinMethod: 'code' | 'qr' | 'invitation_link';
  status: 'success' | 'failed_password' | 'expired' | 'full' | 'disabled' | 'not_open';
  ipAddress?: string;
}

export interface KavaEvent {
  id: string;
  name: string;
  type: string;
  date: string;
  location: string;
  code: string; // Event code used for guest join (e.g., "SOPHIA-LEO")
  coverUrl: string;
  coverPositionY?: number; // Cover reposition vertical offset percentage (0 to 100)
  guestCount: number;
  status: 'active' | 'inactive' | 'archived' | 'draft';
  experienceMode?: ExperienceMode;
  hostId?: string;
  hostName?: string;
  hostEmail?: string;
  workspaceId?: string;
  settings: EventSettings;
  templateId?: string;
  templateVersion?: string;
  expirationDate?: string;
  startDate?: string;
  maxGuests?: number;
}

export interface KavaContribution {
  id: string;
  eventId: string;
  type: ContributionType;
  contributorName: string;
  url?: string; // photo/video source url (display or watermarked/filtered version)
  originalUrl?: string; // raw unmodified original photo/video url
  text?: string; // wish text or transcript
  audioDuration?: string; // for voice contributions
  timestamp: string;
  isPinned: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'hidden';
  filterApplied?: string;
  watermarkApplied?: boolean;
  fileSizeBytes?: number;
  dimensions?: { width: number; height: number };
  caption?: string;
  tags?: string[];
  metadata?: {
    guestId?: string;
    capsuleId?: string;
    recordingDuration?: number;
    recordingTimestamp?: string;
    deviceType?: string;
    browser?: string;
    timezone?: string;
    secureFilename?: string;
    source?: string;
    timestamp?: string;
  };
}

export interface KavaGuest {
  id: string;
  eventId: string;
  name: string;
  contributionsCount: number;
  joinedAt: string;
  email?: string;
  phone?: string;
  country?: string;
  status?: 'active' | 'left' | 'blocked';
  lastActivity?: string;
  device?: 'Mobile' | 'Desktop';
  avatar?: string;
}

export type AppView = 'landing' | 'onboarding' | 'dashboard' | 'guest' | 'live' | 'admin';

export interface RegionalPricing {
  currency: string;
  monthly: number;
  yearly: number;
  perEvent: number;
}

export interface PlanOveragePolicies {
  storageOveragePricePerGb: number;
  uploadsOveragePricePerHundred: number;
  allowOverages: boolean;
}

export interface SubscriptionPlan {
  id: string; // e.g. 'free', 'premium', 'enterprise'
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  perEventPrice: number;
  freeTrialDays: number;
  storageQuotaGb: number;
  maxEvents: number;
  maxGuestsPerEvent: number;
  maxUploads: number;
  allowedMediaTypes: ('photo' | 'video' | 'voice' | 'wish')[];
  
  // Feature Matrix (ON/OFF)
  liveScreenAvailable: boolean;
  invitationDesigner: boolean;
  guestStudioCustomization: boolean;
  analytics: boolean;
  archiveDownloads: boolean;
  customBranding: boolean;
  watermarkRemoval: boolean;
  frameCustomization: boolean;
  musicUpload: boolean;
  videoGreeting: boolean;
  qrCustomization: boolean;
  apiAccess: boolean;
  teamMembersCount: number; // 1 = solo, >1 = team
  customDomain: boolean;
  prioritySupport: boolean;
  moderationTools: boolean;
  aiFeatures: boolean;
  
  // Future flags
  featureFlags: Record<string, boolean>;

  // Advanced constraints & policies
  exportQuality: '720p' | '1080p' | '4K raw';
  uploadSizeLimitMb: number;
  retentionPeriodDays: number; // e.g. 30, 365, -1 for unlimited
  bandwidthLimitGb: number;
  
  overagePolicies: PlanOveragePolicies;
  upgradePaths: string[]; // plan IDs this plan can upgrade to
  downgradeRules: string; // e.g. "Auto-freeze uploads above quota" or "Force clean cache"
  gracePeriodDays: number;
  renewalBehavior: 'auto_renew' | 'expire' | 'invoice';
  couponCompatibility: boolean;
  regionalPricing: RegionalPricing[];

  // Metadata / Status
  active: boolean;
  archived: boolean;
  displayOrder: number;
  version: number;
  updatedAt: string;
  
  // Custom display badges & labels for Landing Page & Checkout
  isPopular?: boolean;
  popularBadgeText?: string;
  ctaText?: string;
  promoLabel?: string;
  trialLabel?: string;
  tagline?: string;
}

export interface PromotionItem {
  id: string;
  name: string;
  code: string;
  type: 'welcome' | 'early_bird' | 'anniversary' | 'black_friday' | 'holiday' | 'coupon' | 'referral' | 'limited_upgrade';
  startDate: string;
  endDate: string;
  targetPlans: string[]; // ['all'] or ['Premium', 'Enterprise']
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  ctaText: string;
  landingVisibility: boolean;
  dashboardVisibility: boolean;
  active: boolean;
  badgeLabel?: string;
}

export interface OfferPopupConfig {
  id: string;
  title: string;
  subtitle: string;
  heroIllustration: string;
  highlightedPlanId: string;
  ctaButtonText: string;
  secondaryButtonText: string;
  countdownEndTime?: string;
  promotionBadge: string;
  closeBehavior: 'dismiss_session' | 'dismiss_forever' | 'remind_later';
  displayRules: {
    triggerOnFirstLogin?: boolean;
    triggerOnFreePlanOnly?: boolean;
    triggerOnTrialEnding?: boolean;
    triggerOnStorageNearFull?: boolean; // >80%
    triggerOnGuestLimitReached?: boolean;
    triggerOnEventLimitReached?: boolean;
    triggerOnFeatureLocked?: boolean;
    triggerOnReturningDays?: number;
    triggerOnExitIntent?: boolean;
    customAudience?: 'all' | 'free_hosts' | 'trial_hosts';
  };
  frequency: 'once' | 'daily' | 'weekly' | 'every_login' | 'until_dismissed';
  active: boolean;
}

export interface UserSubscriptionState {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'expired' | 'pending';
  startDate: string;
  renewalDate: string;
  trialEndsAt?: string;
  customStorageGb?: number;
  isLifetime?: boolean;
  appliedCoupon?: string;
}

export interface BillingAnalyticsData {
  mrr: number;
  arr: number;
  activeSubscriptions: number;
  churnRate: number;
  upgradeConversionRate: number;
  popupConversionRate: number;
  couponUsageCount: number;
  mostPopularPlan: string;
}

export interface PlanAuditLog {
  id: string;
  timestamp: string;
  planId: string;
  planName: string;
  actor: string;
  action: 'create' | 'update' | 'duplicate' | 'archive' | 'activate' | 'deactivate' | 'reorder' | 'rollback' | 'manually_assigned';
  description: string;
  changeSummary?: string; // description of fields modified
  previousState?: string; // serialized previous version for rollback
}

export interface TemplateVersion {
  version: string;
  releaseNotes: string;
  updatedAt: string;
  updatedBy: string;
  autoUpdate: boolean; // whether to automatically apply this version to existing events using this template
  config: Partial<EventSettings>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'Wedding' | 'Corporate' | 'Nightlife' | 'Birthday' | 'Festivals' | 'Memorial' | 'General';
  tags: string[];
  thumbnail: string;
  previewImages: string[];
  previewVideos: string[];
  version: string;
  author: string;
  compatibility: string;
  premiumBadge: boolean;
  featuredBadge: boolean;
  plan: 'Free' | 'Premium' | 'Enterprise';
  releaseNotes: string;
  rating: number;
  ratingCount: number;
  downloads: number;
  status: 'Published' | 'Unpublished' | 'Archived';
  order: number;
  createdAt: string;
  updatedAt: string;
  versionHistory: TemplateVersion[];
  config: Partial<EventSettings>;
}

export type NotificationCategory = 'Event Activity' | 'Guest Activity' | 'Team' | 'Billing' | 'System';

export interface KavaNotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  time: string;
  timestamp: number;
  unread: boolean;
  targetTab: string;
  eventId?: string;
  iconType?: 'rsvp' | 'upload' | 'comment' | 'approval' | 'live' | 'team' | 'billing' | 'subscription' | 'storage' | 'announcement';
  actionLabel?: string;
}

export interface TestimonialMediaVideo {
  id: string;
  url: string;
  title?: string;
  duration?: string;
  thumbnail?: string;
  caption?: string;
  isFeatured?: boolean;
}

export interface TestimonialMediaVoice {
  id: string;
  url: string;
  sender?: string;
  duration?: string;
  transcript?: string;
  waveform?: number[];
}

export interface TestimonialWish {
  id: string;
  sender: string;
  text: string;
  table?: string;
  time?: string;
  likes?: number;
}

export interface Testimonial {
  id: string;
  sourceType: 'featured_event' | 'manual';
  eventId?: string;
  coverImage: string;
  coverPosition?: number; // Vertical crop reposition offset percentage (0-100)
  galleryImages: string[];
  galleryCaptions?: Record<string, string>;
  featuredGalleryIndex?: number;
  videos?: TestimonialMediaVideo[];
  voiceMessages?: TestimonialMediaVoice[];
  wishes?: TestimonialWish[];
  hostName: string;
  eventTitle: string;
  eventCategory: string;
  testimonialTitle: string;
  quote: string;
  rating: number;
  guestCount: number;
  uploadedPhotos: number;
  mediaPriority?: 'photos' | 'videos' | 'voice' | 'wishes' | 'live';
  status?: 'published' | 'draft' | 'scheduled';
  scheduledAt?: string;
  isFeatured?: boolean;
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GlobalTestimonialStats {
  guestPhotosUploaded: string;
  eventsCreated: string;
  averageRating: string;
  qrScans: string;
  memoryCapsulesCompleted: string;
  autoCalculateFromAnalytics?: boolean;
}

export interface SupportTicketMessageAttachment {
  id?: string;
  name: string;
  size?: string;
  url: string;
  type?: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'admin' | 'system';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isInternalNote?: boolean;
  attachments?: SupportTicketMessageAttachment[];
}

export interface SupportTicketAuditLog {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export interface SupportTicketSystemDetails {
  browser?: string;
  device?: string;
  appVersion?: string;
  hasLogsAttached?: boolean;
  systemLogs?: string[];
}

export interface SupportTicketSatisfaction {
  score: number;
  feedback?: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  user: string;
  userEmail: string;
  userAvatar?: string;
  workspaceId?: string;
  workspaceName?: string;
  eventId?: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
  created: string;
  lastActivity: string;
  assignedTo?: string;
  unreadByHost?: boolean;
  unreadByAdmin?: boolean;
  tags?: string[];
  systemDetails?: SupportTicketSystemDetails;
  attachments?: SupportTicketMessageAttachment[];
  messages: SupportTicketMessage[];
  auditLogs?: SupportTicketAuditLog[];
  satisfactionRating?: SupportTicketSatisfaction;
}

export interface SupportChannelConfig {
  id: string;
  type: 'whatsapp' | 'zalo' | 'facebook' | 'instagram' | 'telegram' | 'line' | 'email' | 'phone' | 'website' | 'custom';
  name: string;
  enabled: boolean;
  value: string;
  icon: string;
  description?: string;
  businessHours?: string;
  availabilityStatus?: 'Online' | 'Offline' | 'Away' | 'Busy' | '24/7 Live';
  regionalVisibility?: 'Global' | 'North America' | 'Europe' | 'Asia Pacific' | 'Latin America';
  order: number;
  badgeText?: string;
}

export interface FAQVersion {
  version: number;
  question: string;
  answer: string;
  category?: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface FAQAnalytics {
  views: number;
  expansions: number;
  helpfulYes: number;
  helpfulNo: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  language: string; // e.g. 'English', 'Spanish', 'French', 'German', 'Japanese', 'Bahasa'
  visibility: 'Public' | 'Restricted' | 'Admin Only';
  status: 'Draft' | 'Published';
  scheduledPublishDate?: string;
  versionHistory?: FAQVersion[];
  analytics?: FAQAnalytics;
  createdAt?: string;
  updatedAt?: string;
}

export interface LandingBannerConfig {
  id: string;
  enabled: boolean;
  text: string;
  ctaText?: string;
  destinationUrl?: string;
  actionType?: 'link' | 'scroll' | 'demo' | 'checkout';
  theme: 'monochrome' | 'slate' | 'emerald' | 'amber' | 'rose' | 'gradient';
  startDate?: string;
  endDate?: string;
  updatedAt?: string;
}

export interface MegaMenuCampaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  badgeText?: string;
  badgeStyle?: 'monochrome' | 'amber' | 'emerald' | 'rose' | 'slate' | 'violet';
  categoryTarget: 'all' | 'how_it_works' | 'capsule_types' | 'pricing' | 'resources' | 'navbar' | 'hero' | 'footer';
  deviceTarget?: 'all' | 'desktop' | 'mobile_tablet';
  ctaText: string;
  ctaAction: 'demo' | 'scroll' | 'link' | 'checkout' | 'create';
  ctaUrl?: string;
  countdownEndTime?: string;
  targetLanguage?: SupportedLanguageCode | 'all';
  priority: number;
  startDate?: string;
  endDate?: string;
  status?: 'draft' | 'published';
  abVariant?: 'A' | 'B' | 'Control';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SupportedLanguageCode = 'en' | 'id' | 'vi' | 'zh' | 'ja' | 'th' | 'ko';

export interface LanguageOption {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  regionCode: string;
  displayCode?: string;
}

export interface TranslationKeyItem {
  id: string;
  key: string;
  category: 'nav' | 'hero' | 'features' | 'pricing' | 'faq' | 'dashboard' | 'guest' | 'auth' | 'emails' | 'billing' | 'support' | 'admin' | 'common' | 'onboarding' | 'tooltips' | 'notifications' | 'megamenu' | 'live_wall' | 'testimonials' | 'footer' | 'how_it_works' | string;
  description?: string;
  translations: Record<SupportedLanguageCode, string>;
  status: 'Draft' | 'Published';
  updatedAt: string;
  updatedBy: string;
  version: number;
  history?: TranslationVersionRecord[];
}

export interface TranslationVersionRecord {
  version: number;
  key: string;
  translations: Record<SupportedLanguageCode, string>;
  modifiedAt: string;
  modifiedBy: string;
}

export interface UnansweredSearchTerm {
  id: string;
  query?: string;
  term?: string;
  count: number;
  lastSearched: string;
  status?: 'Pending' | 'Converted' | 'Dismissed';
}

export interface FooterColumnLink {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  badge?: string;
  actionType?: 'scroll' | 'modal' | 'link' | 'demo';
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterColumnLink[];
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'email';
  url: string;
  label: string;
  enabled: boolean;
}

export interface TrustBadgeItem {
  id: string;
  iconName: 'camera' | 'smartphone' | 'tv' | 'shield' | 'sparkles' | 'heart' | 'lock' | 'check';
  label: string;
}

export interface FooterConfig {
  id: string;
  brandName: string;
  tagline: string;
  description: string;
  copyrightText: string;
  badgeTagline: string;
  ctaHeadline: string;
  ctaDescription: string;
  ctaTrustIndicator: string;
  primaryCtaText: string;
  primaryCtaAction: 'create' | 'checkout' | 'demo';
  secondaryCtaText: string;
  secondaryCtaAction: 'demo' | 'scroll' | 'support';
  socialLinks: SocialLink[];
  trustBadges: TrustBadgeItem[];
  columns: FooterColumn[];
  updatedAt?: string;
}

export interface OnboardingStep {
  id: string;
  targetId: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaAction?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  requiredAction?: 'click' | 'none';
}

export interface OnboardingGuide {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'draft' | 'scheduled';
  targetRole: 'Host' | 'Guest' | 'Workspace Admin' | 'All';
  triggerType: 'first_login' | 'major_update' | 'manual_help' | 'plan_based';
  requiredPlan?: string;
  language: string;
  steps: OnboardingStep[];
  updatedAt: string;
}

export interface TooltipItem {
  id: string;
  title?: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  enabled: boolean;
  roleRestriction?: 'all' | 'host' | 'guest' | 'admin';
  iconName?: string;
  linkUrl?: string;
  videoUrl?: string;
  language?: string;
}

export interface OnboardingAnalytics {
  totalTourStarts: number;
  totalTourCompletions: number;
  totalTourSkips: number;
  totalTooltipViews: number;
  stepDropOffs: Record<string, number>;
  updatedAt: string;
}

// --- KAVA Centralized QR Branding & Configuration Types ---
export type QrModuleShape = 'square' | 'rounded' | 'dots' | 'smooth' | 'classy';
export type QrEyeShape = 'square' | 'rounded' | 'extra_rounded' | 'circle' | 'leaf';
export type QrLogoShape = 'circle' | 'rounded' | 'square' | 'shield' | 'none';
export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H';
export type QrFrameStyle = 'none' | 'card_clean' | 'badge_pill' | 'vintage_border' | 'kava_gold_frame' | 'scanner_bracket';

export interface KavaQrConfig {
  id: string;
  version: number;
  name: string;
  
  // Official Logo Configuration
  logoUrl: string;
  logoShape: QrLogoShape;
  logoSizeRatio: number; // 0.15 to 0.28 (default 0.22)
  logoBackground: string; // Background fill behind logo badge (e.g. '#ffffff')
  logoBorderColor: string; // Border stroke color (e.g. '#c19a2e' or 'transparent')
  logoBorderWidth: number; // 0 to 4px
  logoPadding: number; // 2 to 10px
  
  // Matrix & Module Styling
  moduleShape: QrModuleShape;
  foregroundColor: string; // Dark dots color (e.g. '#0f172a')
  backgroundColor: string; // Light canvas color (e.g. '#ffffff')
  
  // Corner Eye / Finder Pattern Styling
  eyeShape: QrEyeShape;
  customEyeColor: boolean;
  eyeOuterColor: string; // e.g. '#0f172a' or '#c19a2e'
  eyeInnerColor: string; // e.g. '#c19a2e' or '#0f172a'
  
  // Scannability & Margin Configuration
  margin: number; // 1 to 4 quiet zone modules
  errorCorrectionLevel: QrErrorCorrection; // Default 'H' (30% fault recovery for reliable logo scanning)
  
  // Gradient & Visual FX
  gradientEnabled: boolean;
  gradientStartColor: string;
  gradientEndColor: string;
  gradientDirection: 'to_bottom' | 'to_right' | 'diagonal';
  
  // Frame CTA & Badge
  frameStyle: QrFrameStyle;
  frameText: string; // e.g. "SCAN TO JOIN CAPSULE"
  frameTextColor: string;
  frameBgColor: string;
  
  // Verification & Audit
  includeKavaBrandingBadge: boolean;
  updatedAt: string;
  updatedBy: string;
}


