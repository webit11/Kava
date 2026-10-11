import { ContributionType, ExperienceMode } from '../types';
import { COVER_PRESETS } from '../data';
import { getEventContext } from './onboardingContext';

export const CAPSULE_DRAFT_KEY = 'kava_create_capsule_draft';

export interface CapsuleDraft {
  step: number;
  eventType: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  experienceMode: ExperienceMode;
  selectedCover: string;
  customCoverUrl: string;
  uploadedCoverUrl: string;
  onboardingCoverPositionY: number;
  guestUploadAllowed: boolean;
  requireApproval: boolean;
  onboardingHideContributorNames: boolean;
  onboardingAllowAnonymousWishes: boolean;
  onboardingGuestVisibility: 'all' | 'own' | 'none';
  onboardingRevealMode: 'live' | 'after_event' | 'scheduled';
  instantReveal: boolean;
  onboardingUploadStartTime: string;
  onboardingUploadDeadline: string;
  onboardingDeadlineMode: 'same_day' | 'plus_1_day' | 'plus_3_days' | 'plus_7_days' | 'custom';
  allowedTypes: ContributionType[];
  onboardingPhotoLimit: number;
  onboardingVideoLimit: number;
  onboardingVoiceLimit: number;
  onboardingWishLimit: number;
  photoWatermarkEnabled: boolean;
  photoWatermarkText: string;
  photoWatermarkPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  photoWatermarkOpacity: number;
  photoFilter: string;
  photoFrameStyle?: string;
  photoFrameCaption?: string;
  photoRevealTiming?: 'instant_live' | 'time_capsule_midnight' | 'time_capsule_morning' | 'custom_reveal';
  photoCustomRevealDate?: string;
  photoDurationMode?: '24_hours' | '3_days' | '7_days' | '30_days' | 'custom';
  photoCustomEndDate?: string;
  photoPerGuestLimit?: number;
  allowGuestLikes?: boolean;
  downloadOriginalQuality: boolean;
  allowGuestDownloads: boolean;
  guestDownloadScope: 'all' | 'own';
  maxPhotoSizeMB: number;
  generatedEventCode: string;
  qrDataUrl: string;
  isCustomTitleUserEdited?: boolean;
}

export function getDefaultCapsuleDraft(initialEventType = 'Wedding'): CapsuleDraft {
  const ctx = getEventContext(initialEventType);
  return {
    step: 1,
    eventType: initialEventType,
    eventName: '',
    eventDate: '2026-06-20',
    eventLocation: '',
    experienceMode: 'memory_capsule',
    selectedCover: ctx.recommendedCovers?.[0] || COVER_PRESETS[0],
    customCoverUrl: '',
    uploadedCoverUrl: '',
    onboardingCoverPositionY: 50,
    guestUploadAllowed: true,
    requireApproval: false,
    onboardingHideContributorNames: false,
    onboardingAllowAnonymousWishes: true,
    onboardingGuestVisibility: 'all',
    onboardingRevealMode: 'live',
    instantReveal: true,
    onboardingUploadStartTime: '2026-06-20T09:00',
    onboardingUploadDeadline: '2026-06-21T23:59',
    onboardingDeadlineMode: 'plus_1_day',
    allowedTypes: ['photo', 'video', 'voice', 'wish'],
    onboardingPhotoLimit: 0,
    onboardingVideoLimit: 0,
    onboardingVoiceLimit: 0,
    onboardingWishLimit: 0,
    photoWatermarkEnabled: false,
    photoWatermarkText: '',
    photoWatermarkPosition: 'bottom-right',
    photoWatermarkOpacity: 75,
    photoFilter: 'natural',
    downloadOriginalQuality: true,
    allowGuestDownloads: true,
    guestDownloadScope: 'all',
    maxPhotoSizeMB: 25,
    generatedEventCode: '',
    qrDataUrl: '',
    isCustomTitleUserEdited: false,
  };
}

export function loadCapsuleDraft(): CapsuleDraft {
  if (typeof window === 'undefined') {
    return getDefaultCapsuleDraft();
  }
  try {
    const raw = localStorage.getItem(CAPSULE_DRAFT_KEY);
    if (!raw) return getDefaultCapsuleDraft();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultCapsuleDraft(parsed.eventType || 'Wedding'),
      ...parsed,
    };
  } catch (err) {
    console.warn('Failed to load capsule draft from storage:', err);
    return getDefaultCapsuleDraft();
  }
}

export function saveCapsuleDraft(draft: Partial<CapsuleDraft>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadCapsuleDraft();
    const merged = { ...existing, ...draft };
    localStorage.setItem(CAPSULE_DRAFT_KEY, JSON.stringify(merged));
  } catch (err) {
    console.warn('Failed to save capsule draft to storage:', err);
  }
}

export function clearCapsuleDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CAPSULE_DRAFT_KEY);
  } catch (err) {
    console.warn('Failed to clear capsule draft:', err);
  }
}
