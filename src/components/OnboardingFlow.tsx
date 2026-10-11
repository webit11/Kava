import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../lib/useTranslation';
import {
  KavaEvent,
  ContributionType,
  ExperienceMode,
} from '../types';
import { COVER_PRESETS } from '../data';
import { HostUser, getActiveUser } from '../lib/auth';
import { generateQrCodeDataUrl, getEventGuestLink } from '../lib/qrUtils';
import LanguageSwitcher from './LanguageSwitcher';
import {
  getEventContext,
} from '../lib/onboardingContext';
import {
  CreateAppearanceMode,
} from '../lib/createExperienceThemes';
import {
  loadCapsuleDraft,
  saveCapsuleDraft,
  clearCapsuleDraft,
  CapsuleDraft,
} from '../lib/onboardingDraft';
import {
  getPhotoModeContext,
  PhotoModeEventType,
} from '../lib/photoModeContext';

// Full Memory Capsule Steps (Mode: memory_capsule - 8 steps total)
import CapsuleStep2Category from './onboarding/CapsuleStep2Category';
import Step2Details from './onboarding/Step2Details';
import Step3Cover from './onboarding/Step3Cover';
import Step4Permissions from './onboarding/Step4Permissions';
import Step5Reveal from './onboarding/Step5Reveal';
import Step6Formats from './onboarding/Step6Formats';
import Step7Success from './onboarding/Step7Success';

// Focused Photo Album Steps (Mode: photo_collection - 11 steps total)
import PhotoStep1Experience from './onboarding/photo/PhotoStep1Experience';
import PhotoStep2EventType from './onboarding/photo/PhotoStep2EventType';
import PhotoStep3Name from './onboarding/photo/PhotoStep3Name';
import PhotoStep4CameraStyle from './onboarding/photo/PhotoStep4CameraStyle';
import PhotoStep5RevealTiming from './onboarding/photo/PhotoStep5RevealTiming';
import PhotoStep6PhotoFrame from './onboarding/photo/PhotoStep6PhotoFrame';
import PhotoStep7Visibility from './onboarding/photo/PhotoStep7Visibility';
import PhotoStep8Duration from './onboarding/photo/PhotoStep8Duration';
import PhotoStep9Limits from './onboarding/photo/PhotoStep9Limits';
import PhotoStep10Review from './onboarding/photo/PhotoStep10Review';
import PhotoStep11Success from './onboarding/photo/PhotoStep11Success';

function generateUniqueEventCode(title?: string): string {
  if (title && title.trim()) {
    const slug = title.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    if (slug.length >= 3) {
      return `${slug}-${Math.floor(10 + Math.random() * 90)}`;
    }
  }
  return `KAVA-${Math.floor(1000 + Math.random() * 9000)}`;
}

interface OnboardingFlowProps {
  onComplete: (event: KavaEvent) => void;
  onCancel: () => void;
  onRequireAuth?: () => void;
  initialStep?: number;
  onStepChange?: (step: number) => void;
}

export default function OnboardingFlow({
  onComplete,
  onCancel,
  onRequireAuth,
  initialStep = 1,
  onStepChange,
}: OnboardingFlowProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(initialStep);
  const [, setActiveUser] = useState<HostUser | null>(() => getActiveUser());

  // Appearance Mode State
  const [appearance, setAppearance] = useState<CreateAppearanceMode>(() => {
    const saved = localStorage.getItem('kava_create_appearance') as CreateAppearanceMode;
    return saved === 'dark' ? 'dark' : 'light';
  });

  const handleToggleAppearance = () => {
    const next = appearance === 'light' ? 'dark' : 'light';
    setAppearance(next);
    localStorage.setItem('kava_create_appearance', next);
  };

  useEffect(() => {
    if (initialStep && initialStep !== step) {
      setStep(initialStep);
    }
  }, [initialStep, step]);

  const changeStep = (newStep: number) => {
    setStep(newStep);
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  useEffect(() => {
    const handleSync = () => setActiveUser(getActiveUser());
    window.addEventListener('kava_active_user_updated', handleSync);
    return () => window.removeEventListener('kava_active_user_updated', handleSync);
  }, []);

  // Single Source of Truth for Event State with Draft Recovery
  const initialDraft = React.useMemo<CapsuleDraft>(() => loadCapsuleDraft(), []);

  // Experience Mode State (Defaults to photo_collection for photography-first experience)
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>(
    initialDraft.experienceMode || 'photo_collection'
  );

  const isPhotoMode = experienceMode === 'photo_collection';
  const totalSteps = isPhotoMode ? 10 : 7;

  // General Event Details
  const [eventType, setEventType] = useState<string>(initialDraft.eventType || 'Wedding');
  const [eventName, setEventName] = useState<string>(initialDraft.eventName || '');
  const [eventDate, setEventDate] = useState<string>(initialDraft.eventDate || '2026-06-20');
  const [eventLocation, setEventLocation] = useState<string>(initialDraft.eventLocation || '');
  const [selectedCover, setSelectedCover] = useState<string>(initialDraft.selectedCover || COVER_PRESETS[0]);
  const [customCoverUrl, setCustomCoverUrl] = useState<string>(initialDraft.customCoverUrl || '');
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string>(initialDraft.uploadedCoverUrl || '');
  const [onboardingCoverPositionY, setOnboardingCoverPositionY] = useState<number>(initialDraft.onboardingCoverPositionY ?? 50);
  const [isCustomTitleUserEdited, setIsCustomTitleUserEdited] = useState<boolean>(initialDraft.isCustomTitleUserEdited || false);

  // Settings
  const [guestUploadAllowed, setGuestUploadAllowed] = useState(initialDraft.guestUploadAllowed ?? true);
  const [requireApproval, setRequireApproval] = useState(initialDraft.requireApproval ?? false);
  const [instantReveal, setInstantReveal] = useState(initialDraft.instantReveal ?? true);
  const [allowedTypes, setAllowedTypes] = useState<ContributionType[]>(initialDraft.allowedTypes || ['photo', 'video', 'voice', 'wish']);

  // Permissions & Timeline Settings
  const [onboardingHideContributorNames, setOnboardingHideContributorNames] = useState(initialDraft.onboardingHideContributorNames ?? false);
  const [onboardingAllowAnonymousWishes, setOnboardingAllowAnonymousWishes] = useState(initialDraft.onboardingAllowAnonymousWishes ?? true);
  const [onboardingGuestVisibility, setOnboardingGuestVisibility] = useState<'all' | 'own' | 'none'>(initialDraft.onboardingGuestVisibility || 'all');
  const [onboardingRevealMode, setOnboardingRevealMode] = useState<'live' | 'after_event' | 'scheduled'>(initialDraft.onboardingRevealMode || 'live');
  const [onboardingUploadStartTime, setOnboardingUploadStartTime] = useState(initialDraft.onboardingUploadStartTime || '2026-06-20T09:00');
  const [onboardingUploadDeadline, setOnboardingUploadDeadline] = useState(initialDraft.onboardingUploadDeadline || '2026-06-21T23:59');
  const [onboardingDeadlineMode, setOnboardingDeadlineMode] = useState<'same_day' | 'plus_1_day' | 'plus_3_days' | 'plus_7_days' | 'custom'>(initialDraft.onboardingDeadlineMode || 'plus_1_day');

  // Media Limits & Watermark
  const [onboardingPhotoLimit, setOnboardingPhotoLimit] = useState<number>(initialDraft.onboardingPhotoLimit ?? 0);
  const [onboardingVideoLimit, setOnboardingVideoLimit] = useState<number>(initialDraft.onboardingVideoLimit ?? 0);
  const [onboardingVoiceLimit, setOnboardingVoiceLimit] = useState<number>(initialDraft.onboardingVoiceLimit ?? 0);
  const [onboardingWishLimit, setOnboardingWishLimit] = useState<number>(initialDraft.onboardingWishLimit ?? 0);
  const [photoWatermarkEnabled, setPhotoWatermarkEnabled] = useState(initialDraft.photoWatermarkEnabled ?? false);
  const [photoWatermarkText, setPhotoWatermarkText] = useState(initialDraft.photoWatermarkText || '');
  const [photoWatermarkUrl, setPhotoWatermarkUrl] = useState('');
  const [photoWatermarkPosition, setPhotoWatermarkPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'>(initialDraft.photoWatermarkPosition || 'bottom-right');
  const [photoWatermarkOpacity, setPhotoWatermarkOpacity] = useState(initialDraft.photoWatermarkOpacity ?? 75);
  const [photoWatermarkSize, setPhotoWatermarkSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [photoFilter, setPhotoFilter] = useState(initialDraft.photoFilter || 'natural');
  const [photoFrameStyle, setPhotoFrameStyle] = useState('classic_minimal');
  const [cameraCaptureMode, setCameraCaptureMode] = useState<'both' | 'camera_only' | 'upload_only'>('both');
  const [photoQualityMode, setPhotoQualityMode] = useState<'original_lossless' | 'smart_web_optimized' | 'ultra_hd'>('original_lossless');
  const [downloadOriginalQuality, setDownloadOriginalQuality] = useState(initialDraft.downloadOriginalQuality ?? true);
  const [allowGuestDownloads, setAllowGuestDownloads] = useState(initialDraft.allowGuestDownloads ?? true);
  const [applyWatermarkToDownloads, setApplyWatermarkToDownloads] = useState(false);
  const [guestDownloadScope, setGuestDownloadScope] = useState<'all' | 'own'>(initialDraft.guestDownloadScope || 'all');
  const [maxPhotoSizeMB, setMaxPhotoSizeMB] = useState(initialDraft.maxPhotoSizeMB ?? 25);

  // Photo Mode Specific States
  const [photoCameraStyleId, setPhotoCameraStyleId] = useState<string>('funsaver');
  const [photoRevealTiming, setPhotoRevealTiming] = useState<'instant_live' | 'time_capsule_midnight' | 'time_capsule_morning' | 'custom_reveal'>(
    initialDraft.photoRevealTiming || 'instant_live'
  );
  const [photoCustomRevealDate, setPhotoCustomRevealDate] = useState(initialDraft.photoCustomRevealDate || '2026-06-21T09:00');
  const [photoWelcomeMessage, setPhotoWelcomeMessage] = useState('');
  const [photoFrameStyleId, setPhotoFrameStyleId] = useState<string>('polaroid');
  const [photoFrameCaption, setPhotoFrameCaption] = useState(initialDraft.photoFrameCaption || '');
  const [photoShowDateOnFrame, setPhotoShowDateOnFrame] = useState(true);
  const [photoFrameFont, setPhotoFrameFont] = useState<'handwritten' | 'sans' | 'serif' | 'mono'>('handwritten');
  const [photoGuestVisibility, setPhotoGuestVisibility] = useState<'all' | 'host_only' | 'after_reveal'>('all');
  const [photoAllowGuestDownloads, setPhotoAllowGuestDownloads] = useState(true);
  const [photoAllowGuestLikes, setPhotoAllowGuestLikes] = useState(true);
  const [photoShowLikeCount, setShowLikeCount] = useState(true);
  const [photoAllowReactions, setPhotoAllowReactions] = useState(true);
  const [photoDurationMode, setPhotoDurationMode] = useState<'24_hours' | '3_days' | '7_days' | '30_days' | 'custom'>('3_days');
  const [photoEndDate, setPhotoEndDate] = useState('2026-06-23');
  const [photoEndTime, setPhotoEndTime] = useState('23:59');
  const [guestLimit, setGuestLimit] = useState(0);
  const [photoPerGuestLimit, setPhotoPerGuestLimit] = useState(0);

  // Success QR state
  const [generatedEventCode, setGeneratedEventCode] = useState(initialDraft.generatedEventCode || '');
  const [qrDataUrl, setQrDataUrl] = useState(initialDraft.qrDataUrl || '');
  const [isCreatingPhotoAlbum, setIsCreatingPhotoAlbum] = useState(false);
  const [createdEventHolder, setCreatedEventHolder] = useState<KavaEvent | null>(null);

  // Experience Mode Selection Handler
  const handleSetExperienceMode = (mode: ExperienceMode) => {
    setExperienceMode(mode);
    if (mode === 'photo_collection') {
      setAllowedTypes(['photo']);
    } else {
      setAllowedTypes(['photo', 'video', 'voice', 'wish']);
    }
    saveCapsuleDraft({
      experienceMode: mode,
      allowedTypes: mode === 'photo_collection' ? ['photo'] : ['photo', 'video', 'voice', 'wish']
    });
  };

  // Save changes to draft on state update
  useEffect(() => {
    saveCapsuleDraft({
      step,
      eventType,
      eventName,
      eventDate,
      eventLocation,
      experienceMode,
      selectedCover,
      customCoverUrl,
      uploadedCoverUrl,
      onboardingCoverPositionY,
      guestUploadAllowed,
      requireApproval,
      onboardingHideContributorNames,
      onboardingAllowAnonymousWishes,
      onboardingGuestVisibility,
      onboardingRevealMode,
      instantReveal,
      onboardingUploadStartTime,
      onboardingUploadDeadline,
      onboardingDeadlineMode,
      allowedTypes,
      onboardingPhotoLimit,
      onboardingVideoLimit,
      onboardingVoiceLimit,
      onboardingWishLimit,
      photoWatermarkEnabled,
      photoWatermarkText,
      photoWatermarkPosition,
      photoWatermarkOpacity,
      photoFilter,
      downloadOriginalQuality,
      allowGuestDownloads,
      guestDownloadScope,
      maxPhotoSizeMB,
      photoRevealTiming,
      photoCustomRevealDate,
      photoDurationMode,
      photoCustomEndDate: photoEndDate,
      photoPerGuestLimit,
      allowGuestLikes: photoAllowGuestLikes,
      generatedEventCode,
      qrDataUrl,
      isCustomTitleUserEdited,
    });
  }, [
    step,
    eventType,
    eventName,
    eventDate,
    eventLocation,
    experienceMode,
    selectedCover,
    customCoverUrl,
    uploadedCoverUrl,
    onboardingCoverPositionY,
    guestUploadAllowed,
    requireApproval,
    onboardingHideContributorNames,
    onboardingAllowAnonymousWishes,
    onboardingGuestVisibility,
    onboardingRevealMode,
    instantReveal,
    onboardingUploadStartTime,
    onboardingUploadDeadline,
    onboardingDeadlineMode,
    allowedTypes,
    onboardingPhotoLimit,
    onboardingVideoLimit,
    onboardingVoiceLimit,
    onboardingWishLimit,
    photoWatermarkEnabled,
    photoWatermarkText,
    photoWatermarkPosition,
    photoWatermarkOpacity,
    photoFilter,
    downloadOriginalQuality,
    allowGuestDownloads,
    guestDownloadScope,
    maxPhotoSizeMB,
    photoRevealTiming,
    photoCustomRevealDate,
    photoDurationMode,
    photoEndDate,
    photoPerGuestLimit,
    photoAllowGuestLikes,
    generatedEventCode,
    qrDataUrl,
    isCustomTitleUserEdited,
  ]);

  // Handle Event Type Selection in Full Capsule Mode
  const handleSelectFullCapsuleCategory = (typeId: string, typeName: string, defaultName: string) => {
    setEventType(typeName);
    const ctx = getEventContext(typeName);
    if (!isCustomTitleUserEdited || !eventName.trim()) {
      setEventName(defaultName || ctx.defaultTitle);
    }
    if (ctx.recommendedCovers?.[0]) {
      setSelectedCover(ctx.recommendedCovers[0]);
    }
    saveCapsuleDraft({
      eventType: typeName,
      eventName: !isCustomTitleUserEdited || !eventName.trim() ? (defaultName || ctx.defaultTitle) : eventName,
      selectedCover: ctx.recommendedCovers?.[0] || selectedCover,
    });
    changeStep(3);
  };

  // Handle Event Type Selection in Photo Mode
  const handleSelectPhotoModeEventType = (typeId: string) => {
    setEventType(typeId);
    const photoCtx = getPhotoModeContext(typeId);
    if (!isCustomTitleUserEdited || !eventName.trim()) {
      setEventName(photoCtx.defaultName);
    }
    if (photoCtx.imageUrl) {
      setSelectedCover(photoCtx.imageUrl);
    }
    saveCapsuleDraft({
      eventType: typeId,
      eventName: !isCustomTitleUserEdited || !eventName.trim() ? photoCtx.defaultName : eventName,
      selectedCover: photoCtx.imageUrl || selectedCover,
    });
    changeStep(3);
  };

  // Type toggler for media formats
  const toggleType = (type: ContributionType) => {
    if (allowedTypes.includes(type)) {
      if (allowedTypes.length === 1) return;
      setAllowedTypes(allowedTypes.filter((t) => t !== type));
    } else {
      setAllowedTypes([...allowedTypes, type]);
    }
  };

  // Deadline Presets
  const handleSelectDeadlinePreset = (preset: 'same_day' | 'plus_1_day' | 'plus_3_days' | 'plus_7_days' | 'custom') => {
    setOnboardingDeadlineMode(preset);
    if (!eventDate) return;
    const baseDate = new Date(`${eventDate}T23:59:00`);
    if (isNaN(baseDate.getTime())) return;

    if (preset === 'same_day') {
      setOnboardingUploadDeadline(`${eventDate}T23:59`);
    } else if (preset === 'plus_1_day') {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + 1);
      setOnboardingUploadDeadline(d.toISOString().slice(0, 16));
    } else if (preset === 'plus_3_days') {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + 3);
      setOnboardingUploadDeadline(d.toISOString().slice(0, 16));
    } else if (preset === 'plus_7_days') {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + 7);
      setOnboardingUploadDeadline(d.toISOString().slice(0, 16));
    }
  };

  // Photo Mode: Create Event Handler
  const handleCreatePhotoModeAlbum = () => {
    setIsCreatingPhotoAlbum(true);
    const currentUser = getActiveUser();
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        navigate('/signup?redirect=/create-capsule/step/13&intendedAction=create_capsule');
      }
      setIsCreatingPhotoAlbum(false);
      return;
    }

    const photoCtx = getPhotoModeContext(eventType);
    const finalCode = generatedEventCode || generateUniqueEventCode(eventName || photoCtx.defaultName);
    setGeneratedEventCode(finalCode);
    const finalTitle = eventName.trim() || photoCtx.defaultName;
    const finalCover = customCoverUrl.trim() || uploadedCoverUrl || selectedCover || photoCtx.imageUrl || COVER_PRESETS[0];

    const newEvent: KavaEvent = {
      id: `album-${Date.now()}`,
      name: finalTitle,
      type: eventType,
      date: eventDate,
      location: eventLocation || 'Shared Gathering',
      code: finalCode,
      coverUrl: finalCover,
      coverPositionY: onboardingCoverPositionY,
      guestCount: 0,
      status: 'active',
      experienceMode: 'photo_collection',
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostEmail: currentUser.email,
      workspaceId: currentUser.id,
      settings: {
        experienceMode: 'photo_collection',
        guestUploadAllowed: true,
        instantReveal: photoRevealTiming === 'instant_live',
        revealMode: photoRevealTiming === 'instant_live' ? 'live' : 'scheduled',
        allowedTypes: ['photo'],
        requireApproval: false,
        photoLimit: photoPerGuestLimit || undefined,
        maxPhotosLimit: photoPerGuestLimit || undefined,
        hideContributorNames: false,
        allowAnonymousWishes: false,
        photoFrameStyle: photoFrameStyleId,
        photoFrameCaption: photoFrameCaption || undefined,
        photoShowDateOnFrame: photoShowDateOnFrame,
        photoFrameFont: photoFrameFont,
        photoRevealTiming: photoRevealTiming,
        photoCustomRevealDate: photoCustomRevealDate,
        photoDurationMode: photoDurationMode,
        photoEndDate: photoEndDate,
        photoEndTime: photoEndTime,
        allowLikes: photoAllowGuestLikes,
        showLikeCount: photoShowLikeCount,
        allowReactions: photoAllowReactions,
        allowGuestDownloads: photoAllowGuestDownloads,
        allowDownloads: photoAllowGuestDownloads,
        downloadOriginalQuality: true,
        allowOriginalQualityDownload: true,
        guestVisibility: photoGuestVisibility === 'host_only' ? 'none' : 'all',
        guestDownloadScope: photoGuestVisibility === 'host_only' ? 'own' : 'all',
        photoQualityMode: 'original_lossless',
        cameraCaptureMode: 'both',
        hostId: currentUser.id,
        hostName: currentUser.name,
        hostEmail: currentUser.email,
        workspaceId: currentUser.id,
        photoTitle: finalTitle,
        photoDesc: photoWelcomeMessage || `Capture and share photos for ${finalTitle}`,
        presentationTheme: 'minimal_light',
        transitionAnimation: 'fade',
      }
    };

    setCreatedEventHolder(newEvent);

    // Generate QR Code for step 11
    const invUrl = getEventGuestLink(finalCode);
    generateQrCodeDataUrl(invUrl, 500).then((dataUrl) => {
      if (dataUrl) setQrDataUrl(dataUrl);
      setIsCreatingPhotoAlbum(false);
      changeStep(11);
    });
  };

  // Full Capsule Mode: Next Step Handler
  const handleFullCapsuleNext = () => {
    if (step === 1) {
      changeStep(2);
      return;
    }

    if (step < 7) {
      if (step === 3 && !eventName.trim()) {
        const ctx = getEventContext(eventType);
        setEventName(ctx.defaultTitle);
      }
      if (step === 6 && isDateRangeInvalid) {
        alert(t('onboarding.err_deadline_before_start', 'Upload deadline cannot be earlier than upload start time.'));
        return;
      }

      if (step === 6) {
        const nextCode = generatedEventCode || generateUniqueEventCode(eventName);
        setGeneratedEventCode(nextCode);
        const invUrl = getEventGuestLink(nextCode);
        generateQrCodeDataUrl(invUrl, 400).then((dataUrl) => {
          setQrDataUrl(dataUrl);
        });
      }

      changeStep(step + 1);
    } else if (step === 7) {
      // Step 7 confirmation & create -> step 8 success
      const currentUser = getActiveUser();
      if (!currentUser) {
        if (onRequireAuth) {
          onRequireAuth();
        } else {
          navigate('/signup?redirect=/create-capsule/step/7&intendedAction=create_capsule');
        }
        return;
      }

      const code = generatedEventCode || generateUniqueEventCode(eventName);
      const finalTitle = eventName.trim() || getEventContext(eventType).defaultTitle;
      const finalCover = customCoverUrl.trim() || uploadedCoverUrl || selectedCover || getEventContext(eventType).recommendedCovers[0];

      const newEvent: KavaEvent = {
        id: `evt-${Date.now()}`,
        name: finalTitle,
        type: eventType,
        date: eventDate,
        location: eventLocation || 'Virtual Gathering',
        code: code,
        coverUrl: finalCover,
        coverPositionY: onboardingCoverPositionY,
        guestCount: 0,
        status: 'active',
        experienceMode: 'memory_capsule',
        hostId: currentUser.id,
        hostName: currentUser.name,
        hostEmail: currentUser.email,
        workspaceId: currentUser.id,
        settings: {
          experienceMode: 'memory_capsule',
          guestUploadAllowed,
          instantReveal: onboardingRevealMode === 'live',
          allowedTypes,
          requireApproval,
          uploadStartTime: onboardingUploadStartTime || undefined,
          uploadDeadline: onboardingUploadDeadline || undefined,
          deadlineMode: onboardingDeadlineMode,
          revealMode: onboardingRevealMode,
          photoLimit: onboardingPhotoLimit || undefined,
          videoLimit: onboardingVideoLimit || undefined,
          voiceLimit: onboardingVoiceLimit || undefined,
          wishLimit: onboardingWishLimit || undefined,
          hideContributorNames: onboardingHideContributorNames,
          allowAnonymousWishes: onboardingAllowAnonymousWishes,
          guestVisibility: onboardingGuestVisibility,
          photoEnableWatermark: photoWatermarkEnabled,
          photoWatermarkUrl: photoWatermarkUrl.trim() || undefined,
          photoWatermarkText: photoWatermarkText.trim() || undefined,
          photoWatermarkPosition,
          photoWatermarkOpacity,
          photoWatermarkSize: photoWatermarkSize === 'large' ? 40 : photoWatermarkSize === 'small' ? 18 : 26,
          photoFilter,
          photoFrameStyle,
          cameraCaptureMode,
          photoQualityMode,
          applyWatermarkToDownloads,
          downloadOriginalQuality,
          allowOriginalQualityDownload: downloadOriginalQuality,
          allowGuestDownloads,
          allowDownloads: allowGuestDownloads,
          guestDownloadScope,
          maxPhotoSizeMB,
          maxPhotosLimit: onboardingPhotoLimit || undefined,
          downloadWatermarked: photoWatermarkEnabled,
          applyWatermark: photoWatermarkEnabled,
          hostId: currentUser.id,
          hostName: currentUser.name,
          hostEmail: currentUser.email,
          workspaceId: currentUser.id,
          photoTitle: `Share Your Best ${eventType} Memories`,
          photoDesc: `Help us capture every perfect moment from our ${eventType.toLowerCase()} celebration`,
          transitionAnimation: 'fade',
        }
      };

      setCreatedEventHolder(newEvent);
      setGeneratedEventCode(code);
      const invUrl = getEventGuestLink(code);
      generateQrCodeDataUrl(invUrl, 400).then((dataUrl) => {
        setQrDataUrl(dataUrl);
      });

      changeStep(8);
    } else if (step === 8) {
      if (createdEventHolder) {
        clearCapsuleDraft();
        onComplete(createdEventHolder);
      } else {
        navigate('/dashboard');
      }
    }
  };

  // General Back Handler
  const handleBack = () => {
    if (step > 1) {
      changeStep(step - 1);
    } else {
      clearCapsuleDraft();
      onCancel();
    }
  };

  // General Next Handler router
  const handleNext = () => {
    if (isPhotoMode) {
      if (step === 1) {
        changeStep(2);
      } else if (step === 2) {
        changeStep(3);
      } else if (step === 3) {
        if (!eventName.trim()) {
          const photoCtx = getPhotoModeContext(eventType);
          setEventName(photoCtx.defaultName);
        }
        changeStep(4);
      } else if (step === 4) {
        changeStep(5);
      } else if (step === 5) {
        changeStep(6);
      } else if (step === 6) {
        changeStep(7);
      } else if (step === 7) {
        changeStep(8);
      } else if (step === 8) {
        changeStep(9);
      } else if (step === 9) {
        changeStep(10);
      } else if (step === 10) {
        handleCreatePhotoModeAlbum();
      } else if (step === 11) {
        if (createdEventHolder) {
          clearCapsuleDraft();
          onComplete(createdEventHolder);
        } else {
          navigate('/dashboard');
        }
      } else {
        changeStep(step + 1);
      }
    } else {
      handleFullCapsuleNext();
    }
  };

  const isDateRangeInvalid = React.useMemo(() => {
    if (!onboardingUploadStartTime || !onboardingUploadDeadline) return false;
    return new Date(onboardingUploadDeadline) < new Date(onboardingUploadStartTime);
  }, [onboardingUploadStartTime, onboardingUploadDeadline]);

  const formatDisplayDate = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    try {
      const d = new Date(dateTimeStr);
      if (isNaN(d.getTime())) return dateTimeStr;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTimeStr;
    }
  };

  const isDark = appearance === 'dark';
  const progressPercentage = Math.min(100, Math.round((step / totalSteps) * 100));

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#080E1E] text-slate-100' : 'bg-[#FAFAFA] text-[#0B132B]'
      }`}
      id="onboarding-flow-container"
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-[#0E7A6B]/20' : 'bg-[#99F6E4]/40'}`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-cyan-900/20' : 'bg-teal-100/50'}`} />
      </div>

      {/* Top Header & Step Progress Bar */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-2">
        <div className="flex flex-col space-y-2 mb-2">
          <div className="flex items-center justify-between">
            {/* Left Back / Brand */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleBack}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs'
                }`}
                id="btn-onboarding-back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs font-semibold hidden sm:inline">
                  {step === 1 ? 'Exit' : 'Back'}
                </span>
              </button>

              <div className="flex items-center space-x-2 pl-1">
                <span className="font-extrabold tracking-tight text-sm sm:text-base font-serif text-[#0B132B] dark:text-white">
                  KAVA
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E6FFFA] dark:bg-[#0E7A6B]/30 text-[#0E7A6B] dark:text-[#5EEAD4] border border-[#99F6E4] dark:border-[#0E7A6B]/40">
                  {isPhotoMode ? 'PHOTO ALBUM' : 'MEMORY CAPSULE'}
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleToggleAppearance}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <LanguageSwitcher variant="compact" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-0.5">
            <span>{step > totalSteps ? 'Complete' : `Step ${step} of ${totalSteps}`}</span>
            <span>{progressPercentage}%</span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200/80'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-[#0E7A6B] via-[#14B8A6] to-[#5EEAD4]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-3.5 sm:px-6 py-2 sm:py-4 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isPhotoMode ? 'photo' : 'capsule'}-${step}-${appearance}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-[28px] border transition-all duration-300 ${
              isDark 
                ? 'bg-[#0E162B]/95 border-slate-800 shadow-2xl text-slate-100' 
                : 'bg-white border-slate-200/90 shadow-xl shadow-slate-200/40 text-[#0B132B]'
            }`}
          >
            {/* ============================================================
                STEP 1: UNIFIED EXPERIENCE SELECTION (BOTH FLOWS)
               ============================================================ */}
            {step === 1 && (
              <PhotoStep1Experience
                experienceMode={experienceMode}
                onSelectExperienceMode={handleSetExperienceMode}
                onNext={handleNext}
                appearance={appearance}
              />
            )}

            {/* ============================================================
                BRANCH 1: FOCUSED PHOTO ALBUM (STEPS 2 - 11)
               ============================================================ */}
            {isPhotoMode && step > 1 && (
              <>
                {step === 2 && (
                  <PhotoStep2EventType
                    selectedType={eventType}
                    onSelectEventType={(typeObj: PhotoModeEventType) => {
                      handleSelectPhotoModeEventType(typeObj.id);
                    }}
                    onNext={handleNext}
                    appearance={appearance}
                  />
                )}

                {step === 3 && (
                  <PhotoStep3Name
                    eventType={eventType}
                    eventName={eventName}
                    setEventName={(name) => {
                      setEventName(name);
                      setIsCustomTitleUserEdited(true);
                    }}
                    eventDate={eventDate}
                    setEventDate={setEventDate}
                    eventLocation={eventLocation}
                    setEventLocation={setEventLocation}
                    selectedCover={selectedCover}
                    onNext={handleNext}
                    appearance={appearance}
                  />
                )}

                {step === 4 && (
                  <PhotoStep4CameraStyle
                    cameraStyleId={photoCameraStyleId}
                    setCameraStyleId={setPhotoCameraStyleId}
                    captureMode={cameraCaptureMode}
                    setCaptureMode={setCameraCaptureMode}
                    onNext={handleNext}
                    appearance={appearance}
                  />
                )}

                {step === 5 && (
                  <PhotoStep5RevealTiming
                    revealTiming={photoRevealTiming}
                    setRevealTiming={setPhotoRevealTiming}
                    customRevealDate={photoCustomRevealDate}
                    setCustomRevealDate={setPhotoCustomRevealDate}
                    onNext={handleNext}
                    appearance={appearance}
                  />
                )}

                {step === 6 && (
                  <PhotoStep6PhotoFrame
                    eventType={eventType}
                    eventName={eventName}
                    eventDate={eventDate}
                    frameStyleId={photoFrameStyleId}
                    setFrameStyleId={setPhotoFrameStyleId}
                    selectedCover={selectedCover}
                    onNext={handleNext}
                    appearance={appearance}
                  />
                )}

                {step === 7 && (
                  <PhotoStep7Visibility
                    allowLikes={photoAllowGuestLikes}
                    setAllowLikes={setPhotoAllowGuestLikes}
                    showLikeCount={photoShowLikeCount}
                    setShowLikeCount={setShowLikeCount}
                    visibility={photoGuestVisibility === 'host_only' ? 'guests_only' : 'everyone_with_link'}
                    setVisibility={(val) => setPhotoGuestVisibility(val === 'guests_only' ? 'host_only' : 'all')}
                    onNext={handleNext}
                  />
                )}

                {step === 8 && (
                  <PhotoStep8Duration
                    endDate={photoEndDate}
                    setEndDate={setPhotoEndDate}
                    endTime={photoEndTime}
                    setEndTime={setPhotoEndTime}
                    onNext={handleNext}
                  />
                )}

                {step === 9 && (
                  <PhotoStep9Limits
                    guestLimit={guestLimit || 50}
                    setGuestLimit={setGuestLimit}
                    photoLimitPerGuest={photoPerGuestLimit || 20}
                    setPhotoLimitPerGuest={setPhotoPerGuestLimit}
                    onNext={handleNext}
                  />
                )}

                {step === 10 && (
                  <PhotoStep10Review
                    eventType={eventType}
                    eventName={eventName}
                    cameraStyleId={photoCameraStyleId}
                    frameStyleId={photoFrameStyleId}
                    revealTiming={photoRevealTiming}
                    allowLikes={photoAllowGuestLikes}
                    endDate={photoEndDate}
                    endTime={photoEndTime}
                    guestLimit={guestLimit || 50}
                    photoLimitPerGuest={photoPerGuestLimit || 20}
                    onCreateAlbum={handleCreatePhotoModeAlbum}
                  />
                )}

                {step === 11 && (
                  <PhotoStep11Success
                    eventName={eventName}
                    eventCode={generatedEventCode}
                    qrCodeUrl={qrDataUrl}
                    onGoToDashboard={() => {
                      if (createdEventHolder) {
                        clearCapsuleDraft();
                        onComplete(createdEventHolder);
                      } else {
                        navigate('/dashboard');
                      }
                    }}
                  />
                )}
              </>
            )}

            {/* ============================================================
                BRANCH 2: FULL MEMORY CAPSULE (STEPS 2 - 8)
               ============================================================ */}
            {!isPhotoMode && step > 1 && (
              <>
                {step === 2 && (
                  <CapsuleStep2Category
                    selectedType={eventType}
                    onSelectEventType={handleSelectFullCapsuleCategory}
                    onNext={handleNext}
                    appearance={appearance}
                  />
                )}

                {step === 3 && (
                  <Step2Details
                    eventName={eventName}
                    setEventName={setEventName}
                    eventDate={eventDate}
                    setEventDate={setEventDate}
                    eventLocation={eventLocation}
                    setEventLocation={setEventLocation}
                    eventType={eventType}
                    appearance={appearance}
                  />
                )}

                {step === 4 && (
                  <Step3Cover
                    eventName={eventName}
                    eventDate={eventDate}
                    eventLocation={eventLocation}
                    eventType={eventType}
                    selectedCover={selectedCover}
                    setSelectedCover={setSelectedCover}
                    customCoverUrl={customCoverUrl}
                    setCustomCoverUrl={setCustomCoverUrl}
                    uploadedCoverUrl={uploadedCoverUrl}
                    setUploadedCoverUrl={setUploadedCoverUrl}
                    onboardingCoverPositionY={onboardingCoverPositionY}
                    setOnboardingCoverPositionY={setOnboardingCoverPositionY}
                    appearance={appearance}
                  />
                )}

                {step === 5 && (
                  <Step4Permissions
                    guestUploadAllowed={guestUploadAllowed}
                    setGuestUploadAllowed={setGuestUploadAllowed}
                    requireApproval={requireApproval}
                    setRequireApproval={setRequireApproval}
                    onboardingHideContributorNames={onboardingHideContributorNames}
                    setOnboardingHideContributorNames={setOnboardingHideContributorNames}
                    onboardingAllowAnonymousWishes={onboardingAllowAnonymousWishes}
                    setOnboardingAllowAnonymousWishes={setOnboardingAllowAnonymousWishes}
                    onboardingGuestVisibility={onboardingGuestVisibility}
                    setOnboardingGuestVisibility={setOnboardingGuestVisibility}
                    eventType={eventType}
                    appearance={appearance}
                  />
                )}

                {step === 6 && (
                  <Step5Reveal
                    eventDate={eventDate}
                    onboardingRevealMode={onboardingRevealMode}
                    setOnboardingRevealMode={setOnboardingRevealMode}
                    setInstantReveal={setInstantReveal}
                    onboardingUploadStartTime={onboardingUploadStartTime}
                    setOnboardingUploadStartTime={setOnboardingUploadStartTime}
                    onboardingUploadDeadline={onboardingUploadDeadline}
                    setOnboardingUploadDeadline={setOnboardingUploadDeadline}
                    onboardingDeadlineMode={onboardingDeadlineMode}
                    setOnboardingDeadlineMode={setOnboardingDeadlineMode}
                    handleSelectDeadlinePreset={handleSelectDeadlinePreset}
                    isDateRangeInvalid={isDateRangeInvalid}
                    formatDisplayDate={formatDisplayDate}
                    eventType={eventType}
                    appearance={appearance}
                  />
                )}

                {step === 7 && (
                  <Step6Formats
                    experienceMode={experienceMode}
                    eventName={eventName}
                    allowedTypes={allowedTypes}
                    toggleType={toggleType}
                    onboardingPhotoLimit={onboardingPhotoLimit}
                    setOnboardingPhotoLimit={setOnboardingPhotoLimit}
                    onboardingVideoLimit={onboardingVideoLimit}
                    setOnboardingVideoLimit={setOnboardingVideoLimit}
                    onboardingVoiceLimit={onboardingVoiceLimit}
                    setOnboardingVoiceLimit={setOnboardingVoiceLimit}
                    onboardingWishLimit={onboardingWishLimit}
                    setOnboardingWishLimit={setOnboardingWishLimit}
                    photoWatermarkEnabled={photoWatermarkEnabled}
                    setPhotoWatermarkEnabled={setPhotoWatermarkEnabled}
                    photoWatermarkText={photoWatermarkText}
                    setPhotoWatermarkText={setPhotoWatermarkText}
                    photoWatermarkUrl={photoWatermarkUrl}
                    setPhotoWatermarkUrl={setPhotoWatermarkUrl}
                    photoWatermarkPosition={photoWatermarkPosition}
                    setPhotoWatermarkPosition={setPhotoWatermarkPosition}
                    photoWatermarkOpacity={photoWatermarkOpacity}
                    setPhotoWatermarkOpacity={setPhotoWatermarkOpacity}
                    photoWatermarkSize={photoWatermarkSize}
                    setPhotoWatermarkSize={setPhotoWatermarkSize}
                    photoFilter={photoFilter}
                    setPhotoFilter={setPhotoFilter}
                    photoFrameStyle={photoFrameStyle}
                    setPhotoFrameStyle={setPhotoFrameStyle}
                    cameraCaptureMode={cameraCaptureMode}
                    setCameraCaptureMode={setCameraCaptureMode}
                    photoQualityMode={photoQualityMode}
                    setPhotoQualityMode={setPhotoQualityMode}
                    downloadOriginalQuality={downloadOriginalQuality}
                    setDownloadOriginalQuality={setDownloadOriginalQuality}
                    allowGuestDownloads={allowGuestDownloads}
                    setAllowGuestDownloads={setAllowGuestDownloads}
                    applyWatermarkToDownloads={applyWatermarkToDownloads}
                    setApplyWatermarkToDownloads={setApplyWatermarkToDownloads}
                    guestDownloadScope={guestDownloadScope}
                    setGuestDownloadScope={setGuestDownloadScope}
                    maxPhotoSizeMB={maxPhotoSizeMB}
                    setMaxPhotoSizeMB={setMaxPhotoSizeMB}
                    requireApproval={requireApproval}
                    setRequireApproval={setRequireApproval}
                    onboardingGuestVisibility={onboardingGuestVisibility}
                    setOnboardingGuestVisibility={setOnboardingGuestVisibility}
                    eventType={eventType}
                    appearance={appearance}
                  />
                )}

                {step === 8 && (
                  <Step7Success
                    eventName={eventName}
                    eventType={eventType}
                    eventDate={eventDate}
                    eventLocation={eventLocation}
                    experienceMode={experienceMode}
                    generatedEventCode={generatedEventCode}
                    qrDataUrl={qrDataUrl}
                    onQrRegenerated={(newUrl) => setQrDataUrl(newUrl)}
                    appearance={appearance}
                    onRevealDashboard={handleFullCapsuleNext}
                  />
                )}
              </>
            )}

            {/* Standard Bottom Footer Navigation for Full Capsule Steps 3 to 7 */}
            {!isPhotoMode && step >= 3 && step < 8 && (
              <div className={`flex items-center justify-between pt-4 sm:pt-5 mt-4 sm:mt-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={handleBack}
                  className={`text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  id="btn-onboarding-back-footer"
                >
                  {t('onboarding.nav_back', 'Back')}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl flex items-center space-x-1.5 cursor-pointer text-xs sm:text-sm transition-all font-bold text-white bg-[#0E7A6B] hover:bg-[#096357] shadow-md shadow-[#0E7A6B]/20 active:scale-[0.99]"
                  id="btn-onboarding-next"
                >
                  <span>{step === 7 ? 'Create Memory Capsule' : t('onboarding.nav_continue', 'Continue')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Subtle Quote Footer */}
      <footer className="relative z-10 text-center pb-5 text-[11px] sm:text-xs text-slate-400 font-mono">
        "{isPhotoMode ? 'Capture the night together through one shared lens.' : t('onboarding.footer_quote', "We don't store files. We preserve memories.")}"
      </footer>
    </div>
  );
}
