import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  Tv, 
  Mic, 
  Heart, 
  Upload, 
  Check, 
  Play, 
  Pause, 
  Smile, 
  Volume2, 
  VolumeX,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Lock,
  Calendar,
  MapPin,
  X,
  Plus,
  AlertCircle,
  Download,
  Loader2,
  Share2,
  Search,
  SlidersHorizontal,
  Info,
  Eye,
  EyeOff,
  QrCode,
  Maximize2,
  MessageSquare,
  Film,
  Clock,
  PartyPopper,
  ThumbsUp
} from 'lucide-react';
import { KavaEvent, KavaContribution, ContributionType, SupportedLanguageCode } from '../types';
import { PhotoPicker } from './PhotoPicker';
import { VideoGreetingRecorder } from './VideoGreetingRecorder';
import { useFeatureFlag } from '../lib/featureFlags';
import { useTranslation } from '../lib/useTranslation';
import { detectBrowserLanguage } from '../lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { getEffectiveEventBranding, applyBrandKitCSSVariables } from '../lib/brandKit';
import { processPhotoForCollection } from '../lib/photoProcessing';

interface GuestFlowProps {
  key?: string;
  event: KavaEvent;
  contributions: KavaContribution[];
  onSubmitContribution: (contribution: Omit<KavaContribution, 'id' | 'timestamp' | 'isPinned'>) => void;
  onBackToLanding: () => void;
  isEmbedded?: boolean;
  initialStep?: 'invite' | 'name' | 'choose' | 'greeting' | 'photo' | 'video' | 'voice' | 'wish' | 'review' | 'uploading' | 'thanks' | 'album';
  theme?: 'light' | 'dark';
}

type GuestStep = 'invite' | 'name' | 'choose' | 'greeting' | 'photo' | 'video' | 'voice' | 'wish' | 'review' | 'uploading' | 'thanks' | 'album';

export default function GuestFlow({ 
  event, 
  contributions, 
  onSubmitContribution, 
  onBackToLanding,
  isEmbedded = false,
  initialStep,
  theme = 'light'
}: GuestFlowProps) {
  const { t, lang, setLanguage } = useTranslation();
  const isVideoGreetingsEnabled = useFeatureFlag('video_greetings', { eventCode: event?.code });
  const isCustomLutsEnabled = useFeatureFlag('custom_luts', { eventCode: event?.code });
  const isSupportConciergeEnabled = useFeatureFlag('support_concierge_widget', { eventCode: event?.code });

  // Guest Experience language uses KAVA's global language system (useTranslation)

  const [step, setStep] = useState<GuestStep>(initialStep || 'invite');

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);
  const [contributorName, setContributorName] = useState('');
  const [selectedType, setSelectedType] = useState<ContributionType | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  const isPhotoCollectionMode = useMemo(() => {
    return event.experienceMode === 'photo_collection' || event.settings?.experienceMode === 'photo_collection';
  }, [event.experienceMode, event.settings?.experienceMode]);

  // If in photo collection mode and guest hits 'choose', directly direct to photo picker
  useEffect(() => {
    if (step === 'choose' && isPhotoCollectionMode) {
      setSelectedType('photo');
      setForceMobilePhotoPicker(true);
      setStep('photo');
    }
  }, [step, isPhotoCollectionMode]);

  const effectiveBranding = useMemo(() => getEffectiveEventBranding(event), [event]);
  
  useEffect(() => {
    applyBrandKitCSSVariables(effectiveBranding);
  }, [effectiveBranding]);

  const brandColor = effectiveBranding.accentColor;
  const brandPrimaryColor = effectiveBranding.primaryColor;
  const brandLogo = effectiveBranding.logoUrl;
  const brandBgStyle = { backgroundColor: brandColor };
  const brandTextStyle = { color: brandColor };
  const brandBorderStyle = { borderColor: brandColor };

  const getSuccessIllustration = () => {
    switch (event.settings?.globalSuccessIllustration) {
      case 'envelope': return '✉️';
      case 'calendar': return '📅';
      case 'hearts': return '💖';
      default: return '🥳';
    }
  };
  
  // Host Greeting States & References
  const [greetingTargetStep, setGreetingTargetStep] = useState<ContributionType | null>(null);
  const [isGreetingPlaying, setIsGreetingPlaying] = useState(false);
  const [greetingCurrentTime, setGreetingCurrentTime] = useState(0);
  const [greetingDuration, setGreetingDuration] = useState(0);
  const [isGreetingComplete, setIsGreetingComplete] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);
  const [greetingVolume, setLocalGreetingVolume] = useState(80); // local volume percentage 0-100
  const [isGreetingMuted, setIsGreetingMuted] = useState(false);

  const greetingAudioRef = useRef<HTMLAudioElement | null>(null);
  const greetingVideoRef = useRef<HTMLVideoElement | null>(null);

  // Dynamic Host Greeting Detection
  const videoGreetingUrl = event.settings?.greetingVideoUrl || event.settings?.videoIntroUrl;
  const audioGreetingUrl = event.settings?.greetingVoiceUrl;
  const isGreetingEnabled = event.settings?.greetingEnabled !== false && event.settings?.videoEnableIntro !== false;

  const effectiveGreetingType: 'video' | 'voice' | 'none' = useMemo(() => {
    if (!isGreetingEnabled) return 'none';
    if (event.settings?.greetingType === 'none') return 'none';

    if (event.settings?.greetingType === 'video') {
      return videoGreetingUrl ? 'video' : (audioGreetingUrl ? 'voice' : 'none');
    }
    if (event.settings?.greetingType === 'voice') {
      return audioGreetingUrl ? 'voice' : (videoGreetingUrl ? 'video' : 'none');
    }

    if (videoGreetingUrl) return 'video';
    if (audioGreetingUrl) return 'voice';
    return 'none';
  }, [
    isGreetingEnabled,
    event.settings?.greetingType,
    videoGreetingUrl,
    audioGreetingUrl,
  ]);

  const hasGreeting = effectiveGreetingType !== 'none';
  
  // Album/Timeline & Gallery states
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo' | 'video' | 'voice' | 'wish'>('all');
  const [gallerySearch, setGallerySearch] = useState('');
  const [gallerySort, setGallerySort] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [displayLimit, setDisplayLimit] = useState(12);
  const [timelineItems, setTimelineItems] = useState<KavaContribution[]>([]);
  const [viewingLightboxItem, setViewingLightboxItem] = useState<KavaContribution | null>(null);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isEventInfoOpen, setIsEventInfoOpen] = useState(false);
  const [projectorIndex, setProjectorIndex] = useState(0);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [localReactions, setLocalReactions] = useState<{ id: string; emoji: string; left: number; size: number }[]>([]);
  const [itemReactionsMap, setItemReactionsMap] = useState<Record<string, Record<string, number>>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [thanksRedirectTimer, setThanksRedirectTimer] = useState(2);
  
  const lastReactionTimeRef = useRef<number>(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Helper toast shower
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Host permissions derived variables
  const allowDownloads = event.settings?.allowGuestDownloads !== false && event.settings?.allowDownloads !== false;
  const allowOriginalQuality = event.settings?.allowOriginalQualityDownload ?? true;
  const applyWatermark = event.settings?.applyWatermark ?? false;
  const liveScreenEnabled = event.settings?.liveScreenEnabled !== false && event.settings?.enableLiveScreen !== false;
  const reactionsEnabled = event.settings?.reactionsEnabled !== false;
  const approvedConIds = event.settings?.approvedConIds || [];
  const hiddenConIds = event.settings?.hiddenConIds || [];
  const rejectedConIds = event.settings?.rejectedConIds || [];
  const guestVisibility = event.settings?.guestVisibility || 'all';

  // Auto-redirect effect after successful upload on thanks step
  useEffect(() => {
    if (step === 'thanks' && !isEmbedded) {
      setThanksRedirectTimer(2);
      const interval = setInterval(() => {
        setThanksRedirectTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStep('album');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, isEmbedded]);

  // Sync timelineItems with contributions prop
  useEffect(() => {
    setTimelineItems(contributions);
  }, [contributions]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [likedItemIds, setLikedItemIds] = useState<Record<string, boolean>>({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});

  const toggleLikeItem = (e: React.MouseEvent, conId: string) => {
    e.stopPropagation();
    setLikedItemIds(prev => {
      const isLiked = !prev[conId];
      if (isLiked) showToast("Added reaction ❤️");
      return { ...prev, [conId]: isLiked };
    });
  };

  // Check if current guest can download a given contribution based on Host Event Settings
  const canDownloadContribution = (con: KavaContribution | null): boolean => {
    if (!con) return false;

    // 1. Check if downloads are enabled in Event Settings
    const isGlobalDownloadAllowed = event.settings?.allowGuestDownloads !== false && event.settings?.allowDownloads !== false;
    if (!isGlobalDownloadAllowed) return false;

    // 2. Guests can NEVER download Pending, Rejected, Hidden, or Private content
    if (hiddenConIds.includes(con.id) || con.status === 'hidden') return false;
    if (rejectedConIds.includes(con.id) || con.status === 'rejected') return false;
    if (con.status === 'pending') return false;

    const isApproved = con.status === 'approved' || approvedConIds.includes(con.id) || !event.settings?.moderationApprovedOnly;
    if (!isApproved) return false;

    // 3. Scope restriction check ('all' vs 'own')
    const scope = event.settings?.guestDownloadScope || 'all';
    if (scope === 'own') {
      const isOwn = contributorName && con.contributorName.trim().toLowerCase() === contributorName.trim().toLowerCase();
      if (!isOwn) return false;
    }

    // Only allow downloadable files (photo or video with URL)
    return Boolean(con.url && (con.type === 'photo' || con.type === 'video'));
  };

  const handleDownloadContribution = async (con: KavaContribution, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canDownloadContribution(con) || !con.url) return;

    setDownloadingId(con.id);

    const isWatermarkEnabled = event.settings?.downloadWatermarked ?? event.settings?.applyWatermark ?? false;
    const filename = `${event.name.replace(/\s+/g, '_')}_${con.type}_${con.id || Date.now()}.${con.type === 'video' ? 'mp4' : 'jpg'}`;

    try {
      if (con.type === 'photo' && isWatermarkEnabled) {
        await downloadPhotoWithWatermark(con.url, filename, event.name || 'KAVA Event');
      } else {
        await directBlobDownload(con.url, filename);
      }
      showToast("Saved to your device");
    } catch (err) {
      console.warn("Watermarked or blob download failed, falling back to direct URL trigger:", err);
      try {
        await directBlobDownload(con.url, filename);
        showToast("Saved to your device");
      } catch {
        const a = document.createElement('a');
        a.href = con.url;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Saved to your device");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadPhotoWithWatermark = (imageUrl: string, filename: string, watermarkText: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error("Canvas context unavailable");

          // Draw original photo
          ctx.drawImage(img, 0, 0);

          // Watermark text styling proportional to image dimensions
          const fontSize = Math.max(16, Math.floor(canvas.height * 0.035));
          ctx.font = `bold ${fontSize}px sans-serif`;

          const padding = fontSize * 0.6;
          const textMetrics = ctx.measureText(watermarkText);
          const rectWidth = textMetrics.width + padding * 2;
          const rectHeight = fontSize + padding * 1.2;

          const margin = Math.max(16, Math.floor(canvas.width * 0.03));
          const x = canvas.width - rectWidth - margin;
          const y = canvas.height - rectHeight - margin;

          // Draw dark pill backdrop for watermark text
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, rectWidth, rectHeight, 10);
          } else {
            ctx.rect(x, y, rectWidth, rectHeight);
          }
          ctx.fill();

          // Render crisp white watermark text
          ctx.fillStyle = '#ffffff';
          ctx.textBaseline = 'middle';
          ctx.fillText(watermarkText, x + padding, y + rectHeight / 2);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              resolve();
            } else {
              reject(new Error("Failed to encode canvas blob"));
            }
          }, 'image/jpeg', 0.95);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (e) => reject(e);
      img.src = imageUrl;
    });
  };

  const directBlobDownload = async (fileUrl: string, filename: string) => {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const handleShareItem = async (e: React.MouseEvent, con: KavaContribution) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.name} Memory`,
          text: con.text ? `"${con.text}" — ${getDisplayName(con.contributorName)}` : `Check out this memory from ${getDisplayName(con.contributorName)}!`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Memory link copied to clipboard!");
    }
  };

  const handleReactToItem = (e: React.MouseEvent, conId: string, emoji: string) => {
    e.stopPropagation();
    if (!reactionsEnabled) return;
    
    if (navigator.vibrate) navigator.vibrate(12);

    setItemReactionsMap(prev => {
      const current = prev[conId] || { '❤️': 3, '🎉': 2, '✨': 1, '👏': 2 };
      return {
        ...prev,
        [conId]: {
          ...current,
          [emoji]: (current[emoji] || 0) + 1
        }
      };
    });

    const now = Date.now();
    const newLocalReact = {
      id: `${now}_${Math.random()}`,
      emoji,
      left: 20 + Math.random() * 60,
      size: 24 + Math.random() * 20
    };
    setLocalReactions(prev => [...prev, newLocalReact]);
  };

  // Real-time synchronization of current presentation slide with the host projector
  useEffect(() => {
    if (step !== 'album') return;
    const interval = setInterval(() => {
      const indexStr = localStorage.getItem(`kava_live_index_${event.id}`);
      if (indexStr !== null) {
        setProjectorIndex(parseInt(indexStr, 10));
      }
      const activeStr = localStorage.getItem(`kava_live_active_${event.id}`);
      setIsLiveActive(activeStr === 'true');
    }, 800); // refresh index & active status every 800ms
    
    return () => clearInterval(interval);
  }, [step, event.id]);

  // Clean local reaction state list after their animations are over
  useEffect(() => {
    if (localReactions.length === 0) return;
    const timer = setTimeout(() => {
      setLocalReactions([]);
    }, 6000);
    return () => clearTimeout(timer);
  }, [localReactions]);

  // Contribution data states
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [forceMobilePhotoPicker, setForceMobilePhotoPicker] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [wishText, setWishText] = useState('');
  const [captionText, setCaptionText] = useState('');
  
  // Voice message state
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);
  
  // Voice Recording, Playback and Upload States & References
  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'prompting' | 'granted' | 'denied' | 'nodevice'>('idle');
  const [visualizerLevels, setVisualizerLevels] = useState<number[]>(new Array(16).fill(0.1));
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'failed' | 'paused' | 'success'>('idle');
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const maxVolumeDetectedRef = useRef<number>(0);
  const secureFilenameRef = useRef<string>('');
  const contributionMetadataRef = useRef<any>(null);
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentProgressRef = useRef<number>(0);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  // Timing Constraints & Countdowns
  const [countdownStr, setCountdownStr] = useState('');
  const now = new Date();
  const startTime = event.settings?.uploadStartTime ? new Date(event.settings.uploadStartTime) : null;
  const deadline = event.settings?.uploadDeadline ? new Date(event.settings.uploadDeadline) : null;

  const uploadsNotStarted = startTime ? now < startTime : false;
  const uploadsClosed = deadline ? now > deadline : false;

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const diff = startTime.getTime() - Date.now();
      if (diff <= 0) {
        setCountdownStr('');
        clearInterval(interval);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setCountdownStr(`${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Contribution limit selectors
  const guestContributions = contributions.filter(
    c => c.eventId === event.id && c.contributorName.trim().toLowerCase() === contributorName.trim().toLowerCase()
  );

  const guestPhotosCount = guestContributions.filter(c => c.type === 'photo').length;
  const guestVideosCount = guestContributions.filter(c => c.type === 'video').length;
  const guestVoicesCount = guestContributions.filter(c => c.type === 'voice').length;
  const guestWishesCount = guestContributions.filter(c => c.type === 'wish').length;

  const photoLimit = event.settings?.photoLimit || 0;
  const videoLimit = event.settings?.videoLimit || 0;
  const voiceLimit = event.settings?.voiceLimit || 0;
  const wishLimit = event.settings?.wishLimit || 0;

  const isPhotoLimitReached = photoLimit > 0 && guestPhotosCount >= photoLimit;
  const isVideoLimitReached = videoLimit > 0 && guestVideosCount >= videoLimit;
  const isVoiceLimitReached = voiceLimit > 0 && guestVoicesCount >= voiceLimit;
  const isWishLimitReached = wishLimit > 0 && guestWishesCount >= wishLimit;

  // Helper for name anonymization
  const getDisplayName = (name: string) => {
    if (event.settings?.hideContributorNames) {
      if (contributorName && name.trim().toLowerCase() === contributorName.trim().toLowerCase()) {
        return "You";
      }
      return "Anonymous Contributor";
    }
    return name;
  };

  // Sample guest uploads for mock
  const samplePhotos = [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80'
  ];

  // Analytics tracker
  const trackVoiceAnalytics = (eventName: string, metadata?: any) => {
    console.log(`[Analytics] Track Event: ${eventName}`, {
      timestamp: new Date().toISOString(),
      ...metadata
    });
  };

  // Device detection
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/tablet|ipad|playbook|silk/i.test(ua.toLowerCase())) {
      deviceType = 'Tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua.toLowerCase())) {
      deviceType = 'Mobile';
    }
    
    let browserName = 'Unknown Browser';
    if (ua.includes('Chrome') && !ua.includes('Chromium')) {
      browserName = 'Chrome';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browserName = 'Safari';
    } else if (ua.includes('Firefox')) {
      browserName = 'Firefox';
    } else if (ua.includes('Edge')) {
      browserName = 'Edge';
    } else if (ua.includes('SamsungBrowser')) {
      browserName = 'Samsung Internet';
    }
    
    return { deviceType, browserName };
  };

  // Secure random server filename generator
  const generateSecureFilename = () => {
    const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    return `voice_contribution_${event.id}_${timestamp}_${randomStr}.webm`;
  };

  // Check audio blob mime-type & size
  const validateAudioBlob = (blob: Blob): boolean => {
    const allowedTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/mpeg', 'audio/x-m4a', 'audio/3gpp'];
    const isTypeAllowed = allowedTypes.some(t => blob.type.startsWith(t) || t === blob.type);
    if (!isTypeAllowed && blob.type !== "") {
      alert("Security Error: Unsupported audio format. Valid voice contribution files only.");
      return false;
    }
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (blob.size > maxSize) {
      alert("Security Error: Voice message exceeds maximum file size (15MB).");
      return false;
    }
    return true;
  };

  // Online / Offline synchronization
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (uploadState === 'paused' || uploadState === 'failed') {
        resumeUpload();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      if (uploadState === 'uploading') {
        pauseUpload();
      }
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [uploadState]);

  // Tab switching suspension
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRecording && !isRecordingPaused) {
        handlePauseRecording();
        alert("Recording was paused because you left the browser tab. Tap resume when you are ready!");
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRecording, isRecordingPaused]);

  // Prevent accidental page leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRecording) {
        e.preventDefault();
        e.returnValue = 'You are currently recording a voicemail. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRecording]);

  // Playback tone using Web Audio API
  const playNotificationTone = (toneType: 'classic' | 'soft_bell' | 'vintage_telephone' | 'wedding_chime') => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return Promise.resolve();

    const ctx = new AudioContextClass();
    const volumeLevel = (event.settings?.greetingVolume ?? 80) / 100;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volumeLevel, ctx.currentTime);
    masterGain.connect(ctx.destination);

    return new Promise<void>((resolve) => {
      if (toneType === 'classic') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        setTimeout(() => {
          ctx.close();
          resolve();
        }, 500);
      } else if (toneType === 'soft_bell') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.50, ctx.currentTime);

        gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(masterGain);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.3);
        osc2.stop(ctx.currentTime + 1.3);

        setTimeout(() => {
          ctx.close();
          resolve();
        }, 1300);
      } else if (toneType === 'vintage_telephone') {
        const playRing = (startOffset: number) => {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const ringGain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(440, ctx.currentTime + startOffset);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(480, ctx.currentTime + startOffset);

          ringGain.gain.setValueAtTime(0, ctx.currentTime + startOffset);
          ringGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + startOffset + 0.05);
          ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + 0.25);

          osc1.connect(ringGain);
          osc2.connect(ringGain);
          ringGain.connect(masterGain);

          osc1.start(ctx.currentTime + startOffset);
          osc2.start(ctx.currentTime + startOffset);
          osc1.stop(ctx.currentTime + startOffset + 0.3);
          osc2.stop(ctx.currentTime + startOffset + 0.3);
        };

        playRing(0);
        playRing(0.35);

        setTimeout(() => {
          ctx.close();
          resolve();
        }, 800);
      } else if (toneType === 'wedding_chime') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

          chimeGain.gain.setValueAtTime(0.001, ctx.currentTime);
          chimeGain.gain.setValueAtTime(1.0, ctx.currentTime + idx * 0.15);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 1.0);

          osc.connect(chimeGain);
          chimeGain.connect(masterGain);

          osc.start(ctx.currentTime + idx * 0.15);
          osc.stop(ctx.currentTime + idx * 0.15 + 1.1);
        });

        setTimeout(() => {
          ctx.close();
          resolve();
        }, 1800);
      } else {
        resolve();
      }
    });
  };

  const handleGreetingFinished = () => {
    setIsGreetingPlaying(false);
    
    // Pause any playing media
    if (greetingAudioRef.current) {
      greetingAudioRef.current.pause();
    }
    if (greetingVideoRef.current) {
      greetingVideoRef.current.pause();
    }

    const target = greetingTargetStep || 'voice';
    const countdown = event.settings?.greetingCountdown || 'none';
    const toneType = event.settings?.greetingNotificationTone || 'classic';

    // Transition to the target recording step immediately
    setStep(target);
    setSelectedType(target);

    // Play notification tone, then initiate countdown or direct auto-start
    playNotificationTone(toneType).then(() => {
      if (countdown !== 'none') {
        const count = parseInt(countdown, 10);
        setCountdownNumber(count);
      } else {
        // Direct start (no countdown)
        const autoStart = event.settings?.greetingAutoStartRecording !== false;
        if (autoStart) {
          if (target === 'voice') {
            setTimeout(() => {
              handleStartRecording();
            }, 200);
          } else if (target === 'video') {
            setStep('video');
          }
        }
      }
    });
  };

  // Manage Greeting Audio/Video Playback
  useEffect(() => {
    if (step !== 'greeting') {
      if (greetingAudioRef.current) {
        greetingAudioRef.current.pause();
        greetingAudioRef.current = null;
      }
      if (greetingVideoRef.current) {
        greetingVideoRef.current.pause();
        greetingVideoRef.current = null;
      }
      setIsGreetingPlaying(false);
      return;
    }

    if (effectiveGreetingType === 'none') {
      setStep(greetingTargetStep || 'video');
      return;
    }

    if (effectiveGreetingType === 'voice') {
      const audioUrl = audioGreetingUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      
      let audio = greetingAudioRef.current;
      if (!audio) {
        audio = new Audio(audioUrl);
        greetingAudioRef.current = audio;
      }
      
      audio.volume = isGreetingMuted ? 0 : (greetingVolume / 100);

      const handleLoadedMetadata = () => {
        setGreetingDuration(audio!.duration || 30);
      };
      const handleTimeUpdate = () => {
        setGreetingCurrentTime(audio!.currentTime);
      };
      const handleEnded = () => {
        setIsGreetingPlaying(false);
        setIsGreetingComplete(true);
        handleGreetingFinished();
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      if (isGreetingPlaying) {
        audio.play().catch(err => {
          console.warn("Greeting audio autoplay blocked:", err);
          setIsGreetingPlaying(false);
        });
      } else {
        audio.pause();
      }

      return () => {
        if (audio) {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('ended', handleEnded);
        }
      };
    } else if (effectiveGreetingType === 'video') {
      const video = greetingVideoRef.current;
      if (video) {
        video.volume = isGreetingMuted ? 0 : (greetingVolume / 100);
        if (isGreetingPlaying) {
          video.play().catch(err => {
            console.warn("Greeting video autoplay unmuted blocked, trying muted:", err);
            video.muted = true;
            setIsGreetingMuted(true);
            video.play().catch(e => {
              console.warn("Greeting video autoplay failed:", e);
              setIsGreetingPlaying(false);
            });
          });
        } else {
          video.pause();
        }
      }
    }
  }, [step, isGreetingPlaying, isGreetingMuted, greetingVolume, effectiveGreetingType, audioGreetingUrl, videoGreetingUrl]);

  // Manage Greeting Countdown Ticker
  useEffect(() => {
    if (countdownNumber === null) return;
    
    if (countdownNumber === 0) {
      setCountdownNumber(null);
      const target = greetingTargetStep || 'voice';
      const autoStart = event.settings?.greetingAutoStartRecording !== false;
      if (autoStart) {
        if (target === 'voice') {
          setTimeout(() => {
            handleStartRecording();
          }, 200);
        } else if (target === 'video') {
          setStep('video');
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdownNumber(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdownNumber, greetingTargetStep, event.settings?.greetingAutoStartRecording]);

  // Live wave visualizer animation loop
  const startVisualizerLoop = (analyserNode: AnalyserNode) => {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    
    const updateVisualizer = () => {
      if (!isRecording) return;
      
      analyserNode.getByteFrequencyData(dataArray);
      const bucketSize = Math.floor(dataArray.length / 16) || 1;
      const newLevels: number[] = [];
      
      for (let i = 0; i < 16; i++) {
        let sum = 0;
        for (let j = 0; j < bucketSize; j++) {
          sum += dataArray[i * bucketSize + j] || 0;
        }
        const val = sum / bucketSize / 255;
        newLevels.push(Math.max(0.08, val));
      }
      
      // Track maximum volume detected to screen for silent captures
      const currentMax = Math.max(...newLevels);
      if (currentMax > maxVolumeDetectedRef.current) {
        maxVolumeDetectedRef.current = currentMax;
      }
      
      setVisualizerLevels(newLevels);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  // Upload Management engine
  const startUpload = () => {
    if (uploadState === 'success') return; // Prevent duplicate uploads
    
    setUploadState('uploading');
    setUploadErrorMessage('');
    
    if (!navigator.onLine) {
      setUploadState('paused');
      return;
    }
    
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    
    uploadIntervalRef.current = setInterval(() => {
      if (!navigator.onLine) {
        setUploadState('paused');
        clearInterval(uploadIntervalRef.current!);
        return;
      }
      
      currentProgressRef.current += Math.floor(Math.random() * 12) + 5;
      if (currentProgressRef.current >= 100) {
        currentProgressRef.current = 100;
        setUploadProgress(100);
        setUploadState('success');
        trackVoiceAnalytics("Upload completed", { filename: secureFilenameRef.current });
        clearInterval(uploadIntervalRef.current!);
      } else {
        setUploadProgress(currentProgressRef.current);
      }
    }, 200);
  };

  const pauseUpload = () => {
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    setUploadState('paused');
  };

  const resumeUpload = () => {
    startUpload();
  };

  const cancelUpload = () => {
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    currentProgressRef.current = 0;
    setUploadProgress(0);
    setUploadState('idle');
  };

  const retryUpload = () => {
    currentProgressRef.current = 0;
    setUploadProgress(0);
    startUpload();
  };

  // Voice recording triggers
  const handleStartRecording = async () => {
    // Reset states
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setIsRecordingPaused(false);
    maxVolumeDetectedRef.current = 0;
    currentProgressRef.current = 0;
    setUploadProgress(0);
    setUploadState('idle');
    
    setPermissionStatus('prompting');
    
    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionStatus('granted');
      
      // 2. Setup Audio DSP for background noise reduction & volume normalization
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        
        const source = audioCtx.createMediaStreamSource(stream);
        
        // High-pass filter (cut out room rumble < 80Hz)
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(80, audioCtx.currentTime);
        
        // Dynamics compressor to normalize peaks
        const compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
        compressor.knee.setValueAtTime(30, audioCtx.currentTime);
        compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
        compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
        compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
        
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        
        const destination = audioCtx.createMediaStreamDestination();
        
        // Route audio graph
        source.connect(filter);
        filter.connect(compressor);
        compressor.connect(analyser);
        compressor.connect(destination);
        
        // Use processed destination stream for recording!
        const recordingStream = destination.stream;
        
        // Determine encoder supported by browser
        let options = {};
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          options = { mimeType: 'audio/wav' };
        }
        
        const mediaRecorder = new MediaRecorder(recordingStream, options);
        mediaRecorderRef.current = mediaRecorder;
        
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
          audioChunksRef.current = [];
          
          // Validate length
          if (recordingSeconds < 1 || audioBlob.size < 100) {
            alert("The voice message was too short. Please speak longer!");
            handleResetVoice();
            return;
          }
          
          // Validate security & format integrity
          if (!validateAudioBlob(audioBlob)) {
            handleResetVoice();
            return;
          }
          
          // Silent capture checks
          if (maxVolumeDetectedRef.current < 0.02) {
            alert("No sound detected. Please verify your microphone is unmuted and try again.");
            trackVoiceAnalytics("Upload failed", { reason: 'silent recording' });
            handleResetVoice();
            return;
          }
          
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          
          // Generate secure filename and metadata
          secureFilenameRef.current = generateSecureFilename();
          const { deviceType, browserName } = getDeviceInfo();
          contributionMetadataRef.current = {
            guestId: localStorage.getItem('kava_guest_uuid') || (() => {
              const uuid = 'guest_' + Math.random().toString(36).substring(2, 11);
              localStorage.setItem('kava_guest_uuid', uuid);
              return uuid;
            })(),
            capsuleId: event.id,
            recordingDuration: recordingSeconds,
            recordingTimestamp: new Date().toISOString(),
            deviceType,
            browser: browserName,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          };
          
          // Trigger automatic upload
          startUpload();
        };
        
        mediaRecorder.start(250); // Get data slices every 250ms
        startVisualizerLoop(analyser);
      } else {
        // Fallback recorder if Web Audio API not fully available
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          secureFilenameRef.current = generateSecureFilename();
          startUpload();
        };
        mediaRecorder.start();
      }
      
      setIsRecording(true);
      trackVoiceAnalytics("Recording started");
      
    } catch (err: any) {
      console.warn("Microphone capture failed:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('denied') || err.message?.includes('Permission')) {
        setPermissionStatus('denied');
        trackVoiceAnalytics("Recording permission denied");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError' || err.message?.includes('found') || err.message?.includes('device')) {
        setPermissionStatus('nodevice');
        trackVoiceAnalytics("No microphone found");
      } else {
        console.warn("Unrecognized capture failure, falling back to Sandbox Voice Simulator");
        setPermissionStatus('granted');
        setIsSimulatorMode(true);
        setIsRecording(true);
        trackVoiceAnalytics("Recording started (Sandbox Simulator Mode)");
      }
    }
  };

  const handlePauseRecording = () => {
    if (isSimulatorMode) {
      setIsRecordingPaused(true);
      return;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsRecordingPaused(true);
    }
  };

  const handleResumeRecording = () => {
    if (isSimulatorMode) {
      setIsRecordingPaused(false);
      return;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsRecordingPaused(false);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsRecordingPaused(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    
    if (isSimulatorMode) {
      // Use a valid tiny silent WAV base64 so it can be played back successfully
      const silentWavBase64 = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA";
      setRecordedAudioUrl(silentWavBase64);
      
      secureFilenameRef.current = generateSecureFilename();
      const { deviceType, browserName } = getDeviceInfo();
      contributionMetadataRef.current = {
        guestId: localStorage.getItem('kava_guest_uuid') || (() => {
          const uuid = 'guest_' + Math.random().toString(36).substring(2, 11);
          localStorage.setItem('kava_guest_uuid', uuid);
          return uuid;
        })(),
        capsuleId: event.id,
        recordingDuration: recordingSeconds || 12,
        recordingTimestamp: new Date().toISOString(),
        deviceType,
        browser: browserName,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isSimulated: true
      };
      
      startUpload();
      trackVoiceAnalytics("Simulated recording completed", { duration: recordingSeconds });
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      trackVoiceAnalytics("Recording completed", { duration: recordingSeconds });
    }
  };

  const handleResetVoice = () => {
    setIsRecording(false);
    setIsRecordingPaused(false);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setPermissionStatus('idle');
    setUploadProgress(0);
    setUploadState('idle');
    currentProgressRef.current = 0;
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackTime(0);
    setPlaybackDuration(0);
    
    trackVoiceAnalytics("Recording discarded");
  };

  // Recording countdown and tick timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let visualizerInterval: NodeJS.Timeout | null = null;
    if (isRecording && !isRecordingPaused) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          const maxSecs = event.settings?.voiceMaxRecordingLength || event.settings?.voiceLimit || 120; // single recording max length
          if (prev >= maxSecs - 1) {
            handleStopRecording();
            return maxSecs;
          }
          return prev + 1;
        });
      }, 1000);

      if (isSimulatorMode) {
        visualizerInterval = setInterval(() => {
          const levels = Array.from({ length: 16 }, () => 0.08 + Math.random() * 0.7);
          setVisualizerLevels(levels);
          maxVolumeDetectedRef.current = Math.max(maxVolumeDetectedRef.current, ...levels);
        }, 120);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
      if (visualizerInterval) clearInterval(visualizerInterval);
    };
  }, [isRecording, isRecordingPaused, isSimulatorMode, event.settings?.voiceMaxRecordingLength, event.settings?.voiceLimit]);

  // Audio Playback Helpers for Preview Screen
  const handlePlayPlayback = () => {
    if (!recordedAudioUrl) return;
    
    if (!playbackAudioRef.current) {
      const audio = new Audio(recordedAudioUrl);
      audio.playbackRate = playbackSpeed;
      playbackAudioRef.current = audio;
      
      audio.addEventListener('loadedmetadata', () => {
        setPlaybackDuration(audio.duration || recordingSeconds);
      });
      
      audio.addEventListener('timeupdate', () => {
        setPlaybackTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      });
    }
    
    playbackAudioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(e => {
      console.error("Audio playback failed:", e);
    });
  };

  const handlePausePlayback = () => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.currentTime = time;
      setPlaybackTime(time);
    } else {
      setPlaybackTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChooseContribution = (type: ContributionType) => {
    if (type === 'photo' && isPhotoLimitReached) {
      alert(`You have reached the maximum photo upload limit of ${photoLimit} photos for this capsule.`);
      return;
    }
    if (type === 'video' && isVideoLimitReached) {
      alert(`You have reached the maximum video upload limit of ${videoLimit} videos for this capsule.`);
      return;
    }
    if (type === 'voice' && isVoiceLimitReached) {
      alert(`You have reached the maximum voice message limit of ${voiceLimit} voice messages for this capsule.`);
      return;
    }
    if (type === 'wish' && isWishLimitReached) {
      alert(`You have reached the maximum written wish limit of ${wishLimit} wishes for this capsule.`);
      return;
    }

    if (hasGreeting && (type === 'voice' || type === 'video')) {
      setGreetingTargetStep(type);
      setStep('greeting');
      setGreetingCurrentTime(0);
      setIsGreetingPlaying(true);
      setIsGreetingComplete(false);
      setLocalGreetingVolume(event.settings?.greetingVolume ?? 80);
      setIsGreetingMuted(false);
    } else {
      setSelectedType(type);
      if (type === 'photo') {
        setForceMobilePhotoPicker(true);
      }
      setStep(type);
    }
  };

  const handleSelectSamplePhoto = (url: string) => {
    setPhotoUrl(url);
    setPhotoUrls([url]);
    setStep('review');
  };

  const handleMockUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulate a file upload by selecting a random sample photo
    const randomImg = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    if (selectedType === 'photo') {
      setPhotoUrl(randomImg);
      setPhotoUrls([randomImg]);
    } else if (selectedType === 'video') {
      setVideoUrl('https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80');
    }
    setStep('review');
  };

  const handleNextToChoose = () => {
    if (!contributorName.trim()) {
      alert("Please tell us your name.");
      return;
    }
    if (isPhotoCollectionMode) {
      setSelectedType('photo');
      setForceMobilePhotoPicker(true);
      setStep('photo');
    } else {
      setStep('choose');
    }
  };

  const handleReviewWishSubmit = () => {
    if (!wishText.trim()) {
      alert("Please write a wish first.");
      return;
    }
    setStep('review');
  };

  const handleReviewVoiceSubmit = () => {
    if (!recordedAudioUrl) {
      alert("Please record a message first.");
      return;
    }
    // Review Contribution button should validate recording and upload readiness
    if (uploadState !== 'success') {
      alert("Your recording is still uploading or has been paused. Please ensure upload reaches 100% first.");
      return;
    }
    setStep('review');
  };

  const renderCountdownOverlay = (roundedClass = "rounded-[32px]") => {
    if (countdownNumber === null) return null;
    return (
      <div className={`absolute inset-0 bg-slate-900/95 ${roundedClass} flex flex-col items-center justify-center text-white z-50 space-y-4 animate-fade-in`}>
        <p className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase animate-pulse">RECORDING BEGINNING IN</p>
        <motion.div 
          key={countdownNumber}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-7xl font-black font-mono text-white select-none"
        >
          {countdownNumber}
        </motion.div>
        <p className="text-xs text-slate-400">Get ready!</p>
      </div>
    );
  };

  const [uploadPercent, setUploadPercent] = useState<number>(0);

  const handleFinalSubmit = async () => {
    if (selectedType === 'voice' && uploadState !== 'success') {
      alert("Please wait for your voice recording to finish uploading before submitting.");
      return;
    }

    setStep('uploading');
    setUploadPercent(15);

    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 250);

    // Process photo watermark / filter if photo contribution
    const processedPhotos: Array<{ url: string; originalUrl?: string; filterApplied?: string; watermarkApplied?: boolean }> = [];
    
    if (selectedType === 'photo') {
      const urlsToProcess = photoUrls.length > 0 ? photoUrls : photoUrl ? [photoUrl] : [];
      for (const rawUrl of urlsToProcess) {
        try {
          if (isPhotoCollectionMode || event.settings?.applyWatermark || event.settings?.photoFilterStyle) {
            const processed = await processPhotoForCollection(rawUrl, {
              filter: event.settings?.photoFilterStyle || 'original',
              enableWatermark: event.settings?.enableWatermark ?? event.settings?.applyWatermark ?? false,
              watermarkUrl: event.settings?.watermarkLogoUrl,
              watermarkText: event.settings?.watermarkText || event.name,
              watermarkPosition: event.settings?.watermarkPosition || 'bottom-right',
              watermarkOpacity: event.settings?.watermarkOpacity ?? 75,
              eventName: event.name,
              eventDate: event.date
            });
            processedPhotos.push({
              url: processed.displayUrl,
              originalUrl: processed.originalUrl,
              filterApplied: processed.filterApplied,
              watermarkApplied: processed.watermarkApplied
            });
          } else {
            processedPhotos.push({ url: rawUrl, originalUrl: rawUrl });
          }
        } catch (err) {
          console.warn("Photo processing fallback:", err);
          processedPhotos.push({ url: rawUrl, originalUrl: rawUrl });
        }
      }
    }

    setTimeout(() => {
      clearInterval(interval);
      setUploadPercent(100);

      // Package submission
      if (selectedType === 'photo' && processedPhotos.length > 0) {
        processedPhotos.forEach((item) => {
          const newCon: Omit<KavaContribution, 'id' | 'timestamp' | 'isPinned'> = {
            eventId: event.id,
            type: 'photo',
            contributorName: contributorName || 'Anonymous Guest',
            url: item.url,
            originalUrl: item.originalUrl,
            filterApplied: item.filterApplied,
            watermarkApplied: item.watermarkApplied,
            text: captionText || undefined,
            metadata: {
              source: 'guest_camera_upload',
              timestamp: new Date().toISOString()
            }
          };
          onSubmitContribution(newCon);
        });
      } else {
        const newCon: Omit<KavaContribution, 'id' | 'timestamp' | 'isPinned'> = {
          eventId: event.id,
          type: selectedType!,
          contributorName: contributorName || 'Anonymous Guest',
          url: selectedType === 'photo' ? (photoUrl || undefined) : selectedType === 'video' ? (videoUrl || undefined) : (selectedType === 'voice' ? recordedAudioUrl || undefined : undefined),
          text: selectedType === 'wish' ? wishText : captionText || undefined,
          audioDuration: selectedType === 'voice' ? formatTime(recordingSeconds) : undefined,
          metadata: selectedType === 'voice' ? {
            ...contributionMetadataRef.current,
            secureFilename: secureFilenameRef.current
          } : undefined,
        };
        onSubmitContribution(newCon);
      }

      setTimeout(() => {
        setStep('thanks');
      }, 300);
    }, 1200);
  };

  // Reset local form states
  const handleResetAll = () => {
    setWishText('');
    setCaptionText('');
    setPhotoUrl(null);
    setPhotoUrls([]);
    setVideoUrl(null);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setIsRecording(false);
    setSelectedType(null);
    setStep('choose');
  };

  if (step === 'video') {
    return (
      <VideoGreetingRecorder
        event={event}
        contributorName={contributorName}
        onCancel={() => setStep('choose')}
        onSubmitVideo={(recordedUrl, metadata) => {
          setVideoUrl(recordedUrl);
          const newCon: Omit<KavaContribution, 'id' | 'timestamp' | 'isPinned'> = {
            eventId: event.id,
            type: 'video',
            contributorName: contributorName || 'Anonymous Guest',
            url: recordedUrl,
            metadata: metadata
          };
          onSubmitContribution(newCon);

          const redirectTarget = event.settings?.afterSubmitRedirect || 'thanks';
          if (redirectTarget === 'gallery') {
            setStep('album');
          } else {
            setStep('thanks');
          }
        }}
        onRedirectGallery={() => setStep('album')}
      />
    );
  }

  if (step === 'album') {
    // Filter contributions according to host permissions and moderation
    const approvedConIds = event.settings?.approvedConIds || [];
    const hiddenConIds = event.settings?.hiddenConIds || [];
    const rejectedConIds = event.settings?.rejectedConIds || [];
    const guestVisibility = event.settings?.guestVisibility || 'all';

    const visibleContributions = timelineItems
      .filter(c => c.eventId === event.id)
      .filter(c => {
        // Guest visibility check
        if (guestVisibility === 'none') return false;
        if (guestVisibility === 'own') {
          return c.contributorName.trim().toLowerCase() === contributorName.trim().toLowerCase();
        }
        return true;
      })
      .filter(c => {
        // Moderation checks: hidden or rejected items
        if (hiddenConIds.includes(c.id) || c.status === 'hidden') return false;
        if (rejectedConIds.includes(c.id) || c.status === 'rejected') return false;

        const isApproved = c.status === 'approved' || approvedConIds.includes(c.id) || !event.settings?.moderationApprovedOnly;
        const isOwn = contributorName && c.contributorName.trim().toLowerCase() === contributorName.trim().toLowerCase();

        if (isApproved) return true;
        if (event.settings?.showPendingToGuests) return true;
        if (isOwn) return true; // Allow guest to see their own pending item

        return false;
      })
      .filter(c => {
        // Type tab filter
        if (activeFilter === 'all') return true;
        return c.type === activeFilter;
      })
      .filter(c => {
        // Search filter
        if (!gallerySearch.trim()) return true;
        const q = gallerySearch.toLowerCase();
        return (
          c.contributorName.toLowerCase().includes(q) ||
          (c.text && c.text.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (gallerySort === 'oldest') {
          return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime();
        }
        if (gallerySort === 'popular') {
          const mapA = itemReactionsMap[a.id] || {};
          const mapB = itemReactionsMap[b.id] || {};
          const countA = (Object.values(mapA) as number[]).reduce((sum, v) => sum + (Number(v) || 0), 0) + (a.isPinned ? 100 : 0);
          const countB = (Object.values(mapB) as number[]).reduce((sum, v) => sum + (Number(v) || 0), 0) + (b.isPinned ? 100 : 0);
          return countB - countA;
        }
        return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
      });

    const paginatedContributions = visibleContributions.slice(0, displayLimit);

    return (
      <div className={isEmbedded 
        ? `w-full h-full text-slate-900 flex flex-col relative selection:bg-slate-900 selection:text-white font-sans ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50'}`
        : "bg-slate-50 min-h-screen text-slate-900 flex flex-col relative selection:bg-slate-900 selection:text-white font-sans"}>
        
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl border border-slate-800 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STICKY TOP BAR: Apple/Linear-inspired with blur & quick tools */}
        <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/85 border-b border-slate-200/60 px-4 py-3 flex flex-col gap-2.5 shrink-0 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">{event.name}</span>
              <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center space-x-2">
                <span>{isPhotoCollectionMode ? 'Photo Collection' : 'Event Gallery'}</span>
                <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border border-emerald-200/60 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live Feed</span>
                </span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {guestVisibility === 'own' && (
                <span className="bg-amber-50 text-amber-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border border-amber-200 uppercase flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Your Vault</span>
                </span>
              )}
              
              <button 
                onClick={() => {
                  if (isPhotoCollectionMode) {
                    setSelectedType('photo');
                    setForceMobilePhotoPicker(true);
                    setStep('photo');
                  } else {
                    handleResetAll();
                  }
                }}
                className="p-2 rounded-full hover:bg-slate-100 cursor-pointer transition-colors border border-slate-200 bg-white shadow-xs"
                id="btn-upload-more-gallery-header"
                title={isPhotoCollectionMode ? "Add Photos" : "Upload Memory"}
              >
                <Plus className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>

          {/* SEARCH & SORT TOOLBAR */}
          <div className="flex items-center gap-2 pt-0.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search contributor or wish..."
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                className="w-full bg-slate-100/80 border border-slate-200/80 rounded-full pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all font-medium"
                id="input-gallery-search"
              />
              {gallerySearch && (
                <button
                  onClick={() => setGallerySearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <select
              value={gallerySort}
              onChange={(e) => setGallerySort(e.target.value as any)}
              className="bg-slate-100/80 border border-slate-200/80 rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-200/60"
              id="select-gallery-sort"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Popular</option>
            </select>
          </div>

          {/* SEGMENTED FILTER TABS */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-1 pb-0.5">
            {(() => {
              const allowed = event.settings?.allowedTypes || ['photo', 'video', 'voice', 'wish'];
              const showPhotos = allowed.includes('photo') && event.settings?.showPhotos !== false;
              const showVideos = allowed.includes('video') && event.settings?.showVideos !== false;
              const showWishes = allowed.includes('wish') && event.settings?.showWishes !== false;
              const showVoices = allowed.includes('voice') && event.settings?.showVoices !== false;

              const tabs = [
                { id: 'all', label: 'All', icon: Sparkles },
                ...(showPhotos ? [{ id: 'photo', label: 'Photos', icon: Camera }] : []),
                ...(showVideos ? [{ id: 'video', label: 'Videos', icon: Film }] : []),
                ...(showWishes ? [{ id: 'wish', label: 'Wishes', icon: MessageSquare }] : []),
                ...(showVoices ? [{ id: 'voice', label: 'Voice', icon: Mic }] : []),
              ];

              return tabs.map((tab) => {
                const TabIcon = tab.icon;
                const count = timelineItems.filter(c => c.eventId === event.id && (tab.id === 'all' || c.type === tab.id)).length;
                const isActive = activeFilter === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                    }`}
                    id={`btn-gallery-tab-${tab.id}`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              });
            })()}
          </div>
        </header>

        {/* NOW SHOWING LIVE PRESENTER BANNER */}
        {isLiveActive && (
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md relative z-20 shrink-0">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <p className="text-xs font-black tracking-wide uppercase">Now Showing Live</p>
                <p className="text-[10px] text-slate-400">Join the live presentation studio experience</p>
              </div>
            </div>
            <button
              onClick={() => setIsLiveModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1 shadow-sm"
              id="btn-watch-live-presentation"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Watch Live</span>
            </button>
          </div>
        )}

        {/* If live is not active, we still show an engaging mock live banner so it is fully testable */}
        {!isLiveActive && (
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between shadow-md relative z-20 shrink-0">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
              </span>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-300">Live Presentation Screen</p>
                <p className="text-[9px] text-slate-400">Launch Projector in Host tab to sync automatically</p>
              </div>
            </div>
            <button
              onClick={() => setIsLiveModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-[9px] px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1"
              id="btn-watch-live-simulator"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Preview Live View</span>
            </button>
          </div>
        )}

        {/* BENTO-STYLE RESPONSIVE MEMORY FEED */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 pb-28">
          {visibleContributions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">No memories found</p>
                <p className="text-xs text-slate-400 max-w-xs leading-normal">
                  {gallerySearch ? 'No items match your search filter.' : 'Select another filter or tap below to upload the very first memory to this shared capsule!'}
                </p>
              </div>
              <button
                onClick={handleResetAll}
                className="bg-slate-900 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md hover:bg-slate-800 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Upload First Memory</span>
              </button>
            </div>
          ) : (
            <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-5 w-full">
              <AnimatePresence mode="popLayout">
                {paginatedContributions.map((con, idx) => {
                  return (
                    <motion.div
                      key={con.id || idx}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      onClick={() => setViewingLightboxItem(con)}
                      className="break-inside-avoid mb-4 sm:mb-5 rounded-[22px] bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden relative group text-left"
                    >
                      {/* Photo memory card: edge-to-edge photo with subtle hover overlay */}
                      {con.type === 'photo' && con.url && (
                        <div className="relative overflow-hidden rounded-[22px] bg-slate-100 group">
                          <img 
                            src={con.url} 
                            alt="Memory" 
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-auto object-cover rounded-[22px] transition-transform duration-500 group-hover:scale-[1.02]" 
                          />
                          
                          {/* Hover/Tap subtle overlay with View icon */}
                          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 rounded-[22px]">
                            <div className="w-10 h-10 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg backdrop-blur-xs transform scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Eye className="w-5 h-5 text-slate-900" />
                            </div>

                            {/* Download Action Overlay if Host allows */}
                            {canDownloadContribution(con) && (
                              <button
                                type="button"
                                onClick={(e) => handleDownloadContribution(con, e)}
                                title="Download photo"
                                className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                              >
                                {downloadingId === con.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                                ) : (
                                  <Download className="w-3.5 h-3.5 text-white" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Video memory card: video thumbnail edge-to-edge + centered play button + duration */}
                      {con.type === 'video' && (
                        <div className="relative overflow-hidden rounded-[22px] bg-slate-950 aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center group">
                          {con.url ? (
                            <img 
                              src={con.url} 
                              alt="Video Preview" 
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300 rounded-[22px] group-hover:scale-[1.02] transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-[22px]">
                              <Film className="w-8 h-8 text-slate-600" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300 rounded-[22px]" />

                          {/* Centered Large Play Button */}
                          <div className="absolute w-12 h-12 rounded-full bg-white/95 text-slate-950 flex items-center justify-center shadow-xl backdrop-blur-xs transform group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-5 h-5 text-slate-950 fill-slate-950 translate-x-0.5" />
                          </div>

                          {/* Duration in bottom-right corner */}
                          <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 text-white px-2.5 py-1 rounded-full text-[10px] font-mono font-bold backdrop-blur-md">
                            {con.videoDuration || '0:15'}
                          </div>

                          {/* Download icon if Host allows */}
                          {canDownloadContribution(con) && (
                            <button
                              type="button"
                              onClick={(e) => handleDownloadContribution(con, e)}
                              title="Download video"
                              className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                            >
                              {downloadingId === con.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                              ) : (
                                <Download className="w-3.5 h-3.5 text-white" />
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Voice memory card: circular play button + audio waveform + duration */}
                      {con.type === 'voice' && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingLightboxItem(con);
                          }}
                          className="p-4 sm:p-5 rounded-[22px] bg-white border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group space-y-3"
                        >
                          <div className="flex items-center justify-between space-x-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayingVoiceId(playingVoiceId === con.id ? null : con.id);
                              }}
                              className="w-10 h-10 rounded-full bg-slate-900 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all shrink-0 cursor-pointer"
                            >
                              {playingVoiceId === con.id ? (
                                <Pause className="w-4 h-4 fill-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-white translate-x-0.5" />
                              )}
                            </button>

                            {/* Audio Waveform */}
                            <div className="flex-1 flex items-center justify-center space-x-1 h-8 px-2 bg-slate-50 rounded-xl border border-slate-100">
                              {[4, 8, 14, 20, 16, 24, 18, 28, 20, 12, 26, 16, 10, 20, 14, 8, 12].map((h, bIdx) => (
                                <span 
                                  key={bIdx} 
                                  className={`w-0.5 sm:w-1 rounded-full transition-all duration-300 ${
                                    playingVoiceId === con.id ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 group-hover:bg-slate-400'
                                  }`} 
                                  style={{ 
                                    height: playingVoiceId === con.id ? `${Math.min(26, h + (bIdx % 3) * 3)}px` : `${Math.max(4, h * 0.7)}px`,
                                    animationDelay: `${(bIdx % 5) * 0.12}s` 
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex justify-end">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                              {con.audioDuration || '0:35'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Wish card: first 2-3 lines of message + bottom gradient fade */}
                      {con.type === 'wish' && con.text && (
                        <div className="p-5 rounded-[22px] bg-white border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden group">
                          <p className="text-sm text-slate-800 font-serif italic leading-relaxed line-clamp-3">
                            "{con.text}"
                          </p>
                          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* STICKY BOTTOM PRIMARY ACTION: Floating "Contribute More" CTA */}
        {!uploadsClosed && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pointer-events-none z-30 flex justify-center">
            <button
              onClick={handleResetAll}
              className="pointer-events-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2.5 shadow-xl hover:shadow-2xl cursor-pointer text-xs uppercase tracking-wider"
              id="btn-timeline-contribute-more"
            >
              <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>Contribute More Memories</span>
            </button>
          </div>
        )}

        {/* ======================================================= */}
        {/* LIGHTBOX DETAIL VIEW: Opened when any card is clicked */}
        {/* ======================================================= */}
        <AnimatePresence>
          {viewingLightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingLightboxItem(null)}
              className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto backdrop-blur-xl"
            >
              {/* Detail View Header */}
              <div className="flex items-center justify-between text-white w-full max-w-2xl mx-auto pt-2 pb-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {getDisplayName(viewingLightboxItem.contributorName).substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-extrabold text-sm text-white">
                        {event.settings?.hideContributorNames ? 'Guest Contributor' : getDisplayName(viewingLightboxItem.contributorName)}
                      </p>
                      {(viewingLightboxItem.isAnonymous || !viewingLightboxItem.contributorName || viewingLightboxItem.contributorName.toLowerCase() === 'anonymous') && (
                        <span className="text-[9px] font-mono bg-white/10 border border-white/15 px-2 py-0.5 rounded-full text-slate-300 font-medium">
                          Anonymous
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {viewingLightboxItem.timestamp 
                          ? new Date(viewingLightboxItem.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + new Date(viewingLightboxItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Recently shared'}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewingLightboxItem(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                  title="Close details"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Detail View Main Media/Content */}
              <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full my-auto py-4" onClick={(e) => e.stopPropagation()}>
                {/* Photo Detail */}
                {viewingLightboxItem.type === 'photo' && viewingLightboxItem.url && (
                  <div className="space-y-4 w-full text-center">
                    <div className="relative inline-block max-w-full">
                      <img 
                        src={viewingLightboxItem.url} 
                        alt="Detail moment" 
                        className="max-h-[60vh] max-w-full rounded-2xl object-contain mx-auto shadow-2xl border border-white/10" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {viewingLightboxItem.text && (
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl max-w-lg mx-auto text-center">
                        <p className="text-white text-sm italic leading-relaxed">
                          "{viewingLightboxItem.text}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Video Detail */}
                {viewingLightboxItem.type === 'video' && viewingLightboxItem.url && (
                  <div className="space-y-4 w-full text-center">
                    <div className="aspect-[4/3] max-h-[60vh] w-full max-w-lg rounded-2xl overflow-hidden bg-black mx-auto relative flex items-center justify-center border border-white/10 shadow-2xl">
                      <img 
                        src={viewingLightboxItem.url} 
                        alt="Video Detail" 
                        className="w-full h-full object-cover opacity-80" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
                          <Play className="w-6 h-6 fill-slate-950 translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    {viewingLightboxItem.text && (
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl max-w-lg mx-auto text-center">
                        <p className="text-white text-sm italic leading-relaxed">
                          "{viewingLightboxItem.text}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Wish Detail */}
                {viewingLightboxItem.type === 'wish' && (
                  <div className="bg-white/10 border border-white/15 p-8 rounded-3xl text-center max-w-lg mx-auto backdrop-blur-xl shadow-2xl space-y-4 w-full">
                    <p className="text-white text-lg sm:text-xl italic leading-relaxed font-serif">
                      "{viewingLightboxItem.text}"
                    </p>
                  </div>
                )}

                {/* Voice Detail */}
                {viewingLightboxItem.type === 'voice' && (
                  <div className="bg-white/10 border border-white/15 p-8 rounded-3xl text-center max-w-lg mx-auto backdrop-blur-xl shadow-2xl space-y-5 w-full">
                    <button
                      onClick={() => setPlayingVoiceId(playingVoiceId === viewingLightboxItem.id ? null : viewingLightboxItem.id)}
                      className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center mx-auto shadow-xl transition-all hover:scale-105 cursor-pointer"
                    >
                      {playingVoiceId === viewingLightboxItem.id ? (
                        <Pause className="w-8 h-8 fill-white" />
                      ) : (
                        <Play className="w-8 h-8 fill-white translate-x-0.5" />
                      )}
                    </button>
                    <div>
                      <p className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-widest">
                        Voice Memory ({viewingLightboxItem.audioDuration || '0:35'})
                      </p>
                      {viewingLightboxItem.text && (
                        <p className="text-white/80 text-xs italic mt-2">"{viewingLightboxItem.text}"</p>
                      )}
                    </div>
                    {/* Waveform bars */}
                    <div className="flex items-center justify-center space-x-1 h-10 px-4">
                      {[6, 12, 18, 28, 20, 32, 24, 38, 26, 16, 30, 22, 12, 26, 18, 10, 16, 8].map((bar, bIdx) => (
                        <span 
                          key={bIdx} 
                          className={`w-1 bg-emerald-400 rounded-full transition-all duration-300 ${
                            playingVoiceId === viewingLightboxItem.id ? 'animate-pulse' : 'opacity-60'
                          }`} 
                          style={{ 
                            height: playingVoiceId === viewingLightboxItem.id ? `${bar}px` : `${Math.max(6, bar * 0.4)}px`,
                            animationDelay: `${bIdx * 0.1}s` 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Detail View Action Footer */}
              <div className="w-full max-w-2xl mx-auto pt-4 border-t border-white/10 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                {/* Like / Reaction Button */}
                {reactionsEnabled && (
                  <button
                    type="button"
                    onClick={(e) => toggleLikeItem(e, viewingLightboxItem.id)}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer border ${
                      likedItemIds[viewingLightboxItem.id]
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-white/10 text-white hover:bg-white/20 border-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedItemIds[viewingLightboxItem.id] ? 'fill-rose-500 text-rose-500 animate-bounce' : 'text-white'}`} />
                    <span>{likedItemIds[viewingLightboxItem.id] ? 'Liked' : 'Like'}</span>
                  </button>
                )}

                {/* Share Button */}
                <button
                  type="button"
                  onClick={(e) => handleShareItem(e, viewingLightboxItem)}
                  className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-white" />
                  <span>Share</span>
                </button>

                {/* Download Button (if Host allows) */}
                {canDownloadContribution(viewingLightboxItem) && (
                  <button
                    type="button"
                    onClick={(e) => handleDownloadContribution(viewingLightboxItem, e)}
                    className="px-5 py-2.5 rounded-2xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
                  >
                    {downloadingId === viewingLightboxItem.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-slate-950" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ======================================================= */}
        {/* IMMERSIVE LIVE PRESENTATION VIEWER OVERLAY */}
        {/* ======================================================= */}
        <AnimatePresence>
          {isLiveModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950 z-50 flex flex-col justify-between p-4 selection:bg-white selection:text-slate-950 text-white font-sans overflow-hidden"
            >
              {/* Local visual reactions floating layers */}
              <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden" id="guest-live-reactions-layer">
                <AnimatePresence>
                  {localReactions.map((react) => (
                    <motion.div
                      key={react.id}
                      initial={{ opacity: 0, y: '100vh', scale: 0.5 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], 
                        y: '20vh', 
                        scale: [0.7, 1.3, 1, 0.8],
                        x: [0, Math.sin(react.left) * 40, Math.cos(react.left) * -40, Math.sin(react.left) * 40]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 4.5, ease: "easeOut" }}
                      style={{ 
                        position: 'absolute',
                        left: `${react.left}%`,
                        fontSize: `${react.size}px`,
                      }}
                    >
                      {react.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
                <div className="flex items-center space-x-2 text-left">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h2 className="text-xs font-black tracking-wider uppercase">Live Screen Companion</h2>
                    <p className="text-[9px] text-emerald-400 font-semibold uppercase font-mono">Synced with Host Projector</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsLiveModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Synced Slide Frame */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 max-w-lg mx-auto w-full">
                {(() => {
                  // Filter out moderated/hidden items just like projector
                  const activeForSync = timelineItems
                    .filter(c => c.eventId === event.id);
                  
                  if (activeForSync.length === 0) {
                    return (
                      <div className="text-center space-y-2 text-slate-400">
                        <Tv className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                        <p className="text-xs font-bold uppercase">No slide content available yet</p>
                        <p className="text-[10px] text-slate-500">Upload a memory to see it synchronized live on screen.</p>
                      </div>
                    );
                  }

                  const slide = activeForSync[projectorIndex % activeForSync.length];
                  if (!slide) return null;

                  return (
                    <motion.div
                      key={slide.id + projectorIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 text-center backdrop-blur-md relative overflow-hidden"
                    >
                      {/* Badge */}
                      <span className="absolute top-4 right-4 text-[7px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded uppercase text-slate-300">
                        Live Slider Index #{projectorIndex}
                      </span>

                      {/* Contributor Profile */}
                      <div className="flex items-center space-x-2 justify-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-white text-slate-950 flex items-center justify-center text-[10px] font-bold uppercase">
                          {slide.contributorName.substring(0, 2)}
                        </div>
                        <p className="text-xs font-extrabold text-slate-200">
                          {getDisplayName(slide.contributorName)}'s memory
                        </p>
                      </div>

                      {/* Photo / Video image display */}
                      {slide.type === 'photo' && slide.url && (
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-lg max-h-[35vh]">
                          <img src={slide.url} alt="Synced moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}

                      {slide.type === 'video' && slide.url && (
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-lg max-h-[35vh] flex items-center justify-center relative">
                          <img src={slide.url} alt="Video Synced Preview" className="w-full h-full object-cover opacity-65" referrerPolicy="no-referrer" />
                          <div className="absolute w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-slate-950 translate-x-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Wish text */}
                      {slide.type === 'wish' && slide.text && (
                        <p className="text-white italic text-sm font-serif leading-relaxed px-2 py-1 max-w-sm mx-auto">
                          "{slide.text}"
                        </p>
                      )}

                      {slide.type === 'voice' && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl inline-flex items-center space-x-2 text-emerald-400 text-[10px] uppercase font-bold mx-auto">
                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          <span>Playing voice voicemail ({slide.audioDuration || '0:35'})</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })()}
              </div>

              {/* Real-time reaction triggers tray */}
              <div className="border-t border-white/10 pt-4 pb-3 flex flex-col gap-3.5 z-10 w-full max-w-md mx-auto shrink-0">
                {(() => {
                  const enabled = event.settings?.reactionsEnabled !== false;
                  const momentOnly = event.settings?.reactionsMomentOnly || false;
                  const activeMoment = event.settings?.reactionsActiveMoment !== false;

                  if (!enabled) {
                    return (
                      <div className="text-center py-2 bg-white/5 border border-white/5 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reactions disabled by host</p>
                      </div>
                    );
                  }

                  if (momentOnly && !activeMoment) {
                    return (
                      <div className="text-center py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <p className="text-[10px] text-amber-400 font-black uppercase tracking-wider">Reactions Locked By Host</p>
                        <p className="text-[8px] text-slate-400 font-normal mt-0.5">Host opens reactions during speeches, dances or announcements.</p>
                      </div>
                    );
                  }

                  return (
                    <>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                          <Smile className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tap to react live</span>
                        </span>
                        <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                          12 Guests Watching
                        </span>
                      </div>

                      {/* Elegant tap buttons row */}
                      <div className="grid grid-cols-6 gap-2">
                        {['❤️', '👏', '🎉', '😂', '😍', '😮'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              // Perform lightweight web-vitals haptic
                              if (navigator.vibrate) navigator.vibrate(15);
                              
                              // Trigger state logic
                              const now = Date.now();
                              const limit = event.settings?.reactionFrequencyLimit || 'medium';
                              if (limit !== 'none') {
                                const cooldown = limit === 'slow' ? 2000 : limit === 'medium' ? 1000 : 250;
                                if (now - lastReactionTimeRef.current < cooldown) {
                                  return; // throttle taps
                                }
                              }
                              lastReactionTimeRef.current = now;

                              // Add local floater
                              const newLocalReact = {
                                id: `${now}_${Math.random()}`,
                                emoji,
                                left: 20 + Math.random() * 60, // random start horizontal %
                                size: 24 + Math.random() * 24
                              };
                              setLocalReactions(prev => [...prev, newLocalReact]);

                              // Push to localStorage
                              const key = `kava_reactions_${event.id}`;
                              const stored = localStorage.getItem(key);
                              let list: any[] = [];
                              if (stored) {
                                try {
                                  list = JSON.parse(stored);
                                  list = list.filter((r: any) => now - r.timestamp < 10000);
                                } catch (e) {}
                              }
                              list.push({
                                id: `${now}_${Math.random()}`,
                                emoji,
                                timestamp: now
                              });
                              localStorage.setItem(key, JSON.stringify(list));
                            }}
                            className="bg-white/10 hover:bg-white/20 active:scale-90 font-bold text-2xl py-3.5 rounded-2xl transition-all border border-white/5 cursor-pointer text-center flex items-center justify-center shadow-sm hover:shadow-md"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={isEmbedded
      ? `w-full h-full text-slate-900 flex flex-col justify-between selection:bg-slate-900 selection:text-white pb-2 overflow-y-auto scrollbar-none ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50'}`
      : "bg-slate-50 min-h-screen text-slate-900 flex flex-col justify-between selection:bg-slate-900 selection:text-white pb-6"}>
      
      {/* Small subtle sticky header */}
      <header className="max-w-md mx-auto w-full px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100 shrink-0">
        {step !== 'invite' && step !== 'thanks' && (
          <button
            onClick={() => {
              if (step === 'name') setStep('invite');
              else if (step === 'choose') setStep('name');
              else if (step === 'greeting') {
                // Pause and cleanup greeting media
                if (greetingAudioRef.current) {
                  greetingAudioRef.current.pause();
                }
                if (greetingVideoRef.current) {
                  greetingVideoRef.current.pause();
                }
                setIsGreetingPlaying(false);
                setStep('choose');
              }
              else if (step === 'photo' || step === 'video' || step === 'voice' || step === 'wish') {
                if (isPhotoCollectionMode) {
                  setStep('name');
                } else if (hasGreeting && (step === 'voice' || step === 'video')) {
                  setStep('greeting');
                  setIsGreetingPlaying(true);
                } else {
                  setStep('choose');
                }
              }
              else if (step === 'review') setStep(selectedType!);
              else if (step === 'album') setStep('thanks');
            }}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer"
            id="btn-guest-back"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back</span>
          </button>
        )}

        {step === 'invite' && (
          <button 
            onClick={onBackToLanding}
            className="text-xs font-semibold text-slate-400 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
          >
            <span>Exit Invitation</span>
          </button>
        )}

        <div className="flex items-center space-x-2">
          <LanguageSwitcher variant="compact" />
          <span className="hidden sm:inline font-bold text-xs tracking-wide uppercase font-mono text-slate-400">
            KAVA GUEST ROOM
          </span>
        </div>
      </header>

      {/* Main card body container tailored specifically for premium, high-density touch targets */}
      <main className={`flex-1 max-w-md mx-auto w-full ${step === 'invite' ? 'px-3 sm:px-4 py-2 sm:py-4' : 'px-4 sm:px-6 py-4'} flex flex-col ${step === 'invite' ? 'justify-start' : 'justify-center'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={step === 'invite' 
              ? "w-full space-y-6" 
              : "bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden"
            }
          >
            
            {/* SCREEN 1: OPEN INVITATION CARD */}
            {step === 'invite' && (() => {
              const coverImg = event.settings?.invitationCoverImage || event.settings?.photoWelcomeImage || event.coverUrl;
              const overlayStrength = event.settings?.invitationOverlayStrength || 'medium';
              const textAlign = event.settings?.invitationTextAlignment || 'left';
              const imageStyle = event.settings?.invitationImageStyle || 'rounded';
              const showDate = event.settings?.invitationShowDate !== false;
              const showLocation = event.settings?.invitationShowLocation !== false;
              const showDescription = event.settings?.invitationShowDescription !== false;
              const theme = event.settings?.invitationCoverTheme || 'full_hero';

              const overlayGradient = overlayStrength === 'light' 
                ? 'from-black/50 via-black/15 to-transparent' 
                : overlayStrength === 'dark' 
                ? 'from-black/95 via-black/60 to-transparent' 
                : 'from-black/80 via-black/35 to-transparent';

              const textAlignClass = textAlign === 'center' ? 'text-center items-center' : 'text-left items-start';

              const renderCTAButton = (extraClass = "") => {
                if (uploadsNotStarted) {
                  return (
                    <button
                      disabled
                      className={`w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 cursor-not-allowed ${extraClass}`}
                    >
                      <span>Locked Until Launch</span>
                    </button>
                  );
                }
                if (uploadsClosed) {
                  if (event.settings?.guestVisibility !== 'none') {
                    return (
                      <button
                        onClick={() => {
                          setContributorName('Visitor');
                          setStep('album');
                        }}
                        className={`w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] ${extraClass}`}
                        id="btn-browse-closed-capsule"
                      >
                        <span>Browse Shared Album</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    );
                  }
                  return (
                    <button
                      disabled
                      className={`w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 cursor-not-allowed ${extraClass}`}
                    >
                      <span>Private Vault (Locked)</span>
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => setStep('name')}
                    className={`w-full text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.99] ${extraClass}`}
                    style={brandBgStyle}
                    id="btn-join-capsule"
                  >
                    <span>{isPhotoCollectionMode ? 'Upload Photos to Album' : 'Join Memory Capsule'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                );
              };

              return (
                <div className="space-y-5 w-full">
                  {/* THEME 01: FULL HERO COVER (Default Premium Theme) */}
                  {theme === 'full_hero' && (
                    <div className="space-y-5 w-full flex flex-col">
                      <div className={`relative w-full min-h-[72vh] sm:min-h-[580px] ${imageStyle === 'rounded' ? 'rounded-3xl sm:rounded-[36px]' : 'rounded-none'} overflow-hidden shadow-xl flex flex-col justify-end p-6 sm:p-8 text-white border border-slate-200/80`}>
                        <img 
                          src={coverImg} 
                          alt="Cover" 
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ objectPosition: `center ${event.coverPositionY ?? 50}%` }}
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} z-0`}></div>
                        
                        <div className={`relative z-10 space-y-3 flex flex-col ${textAlignClass}`}>
                          <span className="inline-flex items-center space-x-1.5 bg-emerald-500/90 text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md shadow-xs w-fit">
                            <Sparkles className="w-3 h-3 text-white" />
                            <span>Capsule Live</span>
                          </span>

                          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                            {event.name}
                          </h1>

                          {(showDate || showLocation) && (
                            <div className={`flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-white/95 ${textAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
                              {showDate && (
                                <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center space-x-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-white/80" />
                                  <span>{new Date(event.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </span>
                              )}
                              {showLocation && (
                                <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center space-x-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-white/80" />
                                  <span>{event.location}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Primary CTA Button directly below Hero Section */}
                      <div className="w-full pt-1">
                        {renderCTAButton()}
                      </div>

                      {/* Remaining Event Info placed after CTA */}
                      <div className="space-y-4 w-full">
                        {showDescription && (
                          <div className="p-5 sm:p-6 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-2xs space-y-2 text-left">
                            <h3 className="text-base font-bold text-slate-900">{event.settings?.photoTitle || "You're invited to preserve moments."}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                              {event.settings?.photoDesc || `${event.name} want to preserve memories through your eyes. Contribute high-resolution photos, written wishes, or a spoken voice recording.`}
                            </p>
                          </div>
                        )}

                        {uploadsNotStarted && (
                          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-left space-y-1">
                            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider block">Contributions Open Soon</span>
                            <p className="text-xs text-amber-600 font-light">This capsule starts accepting memories in:</p>
                            <p className="text-lg font-bold font-mono text-amber-800 tracking-tight">{countdownStr || 'Calculating...'}</p>
                          </div>
                        )}

                        {uploadsClosed && (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-1">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Contributions Closed</span>
                            <p className="text-xs text-slate-500 font-light leading-relaxed">
                              The contribution deadline has passed. {event.settings?.guestVisibility !== 'none' ? 'You can still explore memories shared by others.' : 'This capsule is now locked as a private digital vault.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* THEME 02: EDITORIAL MAGAZINE */}
                  {theme === 'magazine_editorial' && (
                    <div className="space-y-5 w-full flex flex-col">
                      <div className={`relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[260px] ${imageStyle === 'rounded' ? 'rounded-2xl sm:rounded-3xl' : 'rounded-none'} overflow-hidden shadow-sm`}>
                        <img 
                          src={coverImg} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                          style={{ objectPosition: `center ${event.coverPositionY ?? 50}%` }}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest border border-white/20">
                          Volume No. 01
                        </div>
                      </div>

                      {/* Floating White Editorial Card */}
                      <div className={`relative z-10 mx-3 sm:mx-4 -mt-12 sm:-mt-16 bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 flex flex-col ${textAlignClass}`}>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block">
                          Exclusive Memory Capsule
                        </span>

                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight leading-snug">
                          {event.name}
                        </h1>
                        
                        {showDescription && (
                          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                            {event.settings?.photoDesc || event.settings?.photoTitle || 'A curated collection of shared memories.'}
                          </p>
                        )}

                        {(showDate || showLocation) && (
                          <div className={`w-full pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5 font-medium flex flex-col ${textAlign === 'center' ? 'items-center' : 'items-start'}`}>
                            {showDate && <p className="flex items-center space-x-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>{new Date(event.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span></p>}
                            {showLocation && <p className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{event.location}</span></p>}
                          </div>
                        )}

                        <div className="w-full pt-2">
                          {renderCTAButton()}
                        </div>
                      </div>

                      {uploadsNotStarted && (
                        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-left space-y-1">
                          <span className="text-[10px] font-mono font-bold text-amber-700 uppercase block">Contributions Open Soon</span>
                          <p className="text-xs text-amber-600 font-light">This capsule starts accepting memories in:</p>
                          <p className="text-lg font-bold font-mono text-amber-800 tracking-tight">{countdownStr || 'Calculating...'}</p>
                        </div>
                      )}

                      {uploadsClosed && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-1">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Contributions Closed</span>
                          <p className="text-xs text-slate-500 font-light leading-relaxed">The contribution deadline has passed.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* THEME 03: IMMERSIVE POSTER */}
                  {theme === 'minimal_poster' && (
                    <div className="space-y-5 w-full flex flex-col">
                      <div className={`relative w-full min-h-[76vh] sm:min-h-[580px] ${imageStyle === 'rounded' ? 'rounded-[36px]' : 'rounded-none'} overflow-hidden shadow-2xl flex flex-col justify-end p-6 sm:p-8 text-white border border-slate-200/80`}>
                        <img 
                          src={coverImg} 
                          alt="Cover" 
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ objectPosition: `center ${event.coverPositionY ?? 50}%` }}
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} z-0`}></div>

                        <div className={`relative z-10 space-y-4 flex flex-col ${textAlignClass}`}>
                          <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-white border border-white/25 w-fit">
                            Cinematic Invitation
                          </span>

                          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-xl">
                            {event.name}
                          </h1>

                          {showDescription && (
                            <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-xs">
                              {event.settings?.photoDesc || event.settings?.photoTitle || 'Preserve your memories directly to our live capsule.'}
                            </p>
                          )}

                          {(showDate || showLocation) && (
                            <div className={`flex flex-wrap gap-2 pt-1 text-xs font-mono text-white/90 ${textAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
                              {showDate && (
                                <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center space-x-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                </span>
                              )}
                              {showLocation && (
                                <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center space-x-1.5">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{event.location}</span>
                                </span>
                              )}
                            </div>
                          )}

                          <div className="pt-2 w-full">
                            {renderCTAButton("shadow-xl")}
                          </div>
                        </div>
                      </div>

                      {uploadsNotStarted && (
                        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-left space-y-1">
                          <span className="text-[10px] font-mono font-bold text-amber-700 uppercase block">Open Soon</span>
                          <p className="text-xs text-amber-600">Countdown: {countdownStr || 'Calculating...'}</p>
                        </div>
                      )}

                      {uploadsClosed && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-1">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Closed</span>
                          <p className="text-xs text-slate-500">The contribution deadline has passed.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* THEME 04: MINIMAL APPLE */}
                  {theme === 'classic_card' && (
                    <div className={`space-y-6 w-full flex flex-col ${textAlignClass}`}>
                      <div className={`relative w-full aspect-[4/3] sm:aspect-[16/10] ${imageStyle === 'rounded' ? 'rounded-[32px]' : 'rounded-none'} overflow-hidden shadow-md border border-slate-100/80`}>
                        <img 
                          src={coverImg} 
                          alt="Cover" 
                          className="w-full h-full object-cover" 
                          style={{ objectPosition: `center ${event.coverPositionY ?? 50}%` }}
                          referrerPolicy="no-referrer" 
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient}`}></div>
                        
                        <div className="absolute bottom-4 left-4 right-4 text-left text-white bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-mono tracking-widest font-bold uppercase text-white/80">Capsule Live</p>
                            <h3 className="font-sans font-extrabold text-base leading-tight text-white">{event.name}</h3>
                          </div>
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>

                      <div className={`space-y-5 w-full flex flex-col ${textAlignClass}`}>
                        <span className="inline-flex items-center space-x-1.5 bg-slate-100 border border-slate-200/80 rounded-full px-3.5 py-1 text-[10px] font-bold text-slate-600 font-mono uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Collaborative Memory Capsule</span>
                        </span>

                        <div className="space-y-2.5 w-full">
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                            {event.settings?.photoTitle || "You're invited to preserve moments."}
                          </h2>
                          {showDescription && (
                            <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                              {event.settings?.photoDesc || `${event.name} want to preserve memories through your eyes. Contribute high-resolution photos, written wishes, or a spoken voice recording.`}
                            </p>
                          )}
                        </div>

                        {(showDate || showLocation) && (
                          <div className={`w-full space-y-2 text-xs text-slate-500 font-semibold border-t border-slate-100 pt-4 flex flex-col ${textAlign === 'center' ? 'items-center' : 'items-start'}`}>
                            {showDate && (
                              <p className="flex items-center space-x-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{new Date(event.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </p>
                            )}
                            {showLocation && (
                              <p className="flex items-center space-x-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{event.location}</span>
                              </p>
                            )}
                          </div>
                        )}

                        {uploadsNotStarted && (
                          <div className="w-full p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-1 text-left">
                            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider block">Contributions Open Soon</span>
                            <p className="text-xs text-amber-600 font-light">This capsule starts accepting memories in:</p>
                            <p className="text-lg font-bold font-mono text-amber-800 tracking-tight">{countdownStr || 'Calculating...'}</p>
                          </div>
                        )}

                        {uploadsClosed && (
                          <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1 text-left">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Contributions Closed</span>
                            <p className="text-xs text-slate-500 font-light leading-relaxed">
                              The contribution deadline has passed. {event.settings?.guestVisibility !== 'none' ? 'You can still explore memories shared by others.' : 'This capsule is now locked as a private digital vault.'}
                            </p>
                          </div>
                        )}

                        <div className="w-full pt-1">
                          {renderCTAButton()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* SCREEN 2: ENTER NAME */}
            {step === 'name' && (
              <div className="space-y-6 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">The Circle</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Who is contributing?</h3>
                  <p className="text-xs text-slate-500 font-light">
                    {event.settings?.hideContributorNames 
                      ? "This capsule is fully anonymized. Other guests will see contributions anonymously, but the host can still see names."
                      : "Your name will be visible next to your contributions on the Live Wall & shared timeline."}
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your first & last name"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-slate-400 text-slate-800"
                    id="input-contributor-name"
                    autoFocus
                  />

                  <button
                    onClick={handleNextToChoose}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                    id="btn-name-continue"
                  >
                    <span>{isPhotoCollectionMode ? 'Upload Photos to Album' : 'Choose Contribution'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {(event.settings?.allowAnonymousWishes || event.settings?.hideContributorNames) && (
                    <button
                      type="button"
                      onClick={() => {
                        setContributorName('Anonymous Guest');
                        if (isPhotoCollectionMode) {
                          setSelectedType('photo');
                          setForceMobilePhotoPicker(true);
                          setStep('photo');
                        } else {
                          setStep('choose');
                        }
                      }}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold py-3.5 rounded-2xl transition-all text-xs cursor-pointer text-center animate-fade-in"
                      id="btn-name-anonymous"
                    >
                      {isPhotoCollectionMode ? 'Upload Anonymously' : 'Contribute Anonymously'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 3: CHOOSE CONTRIBUTION TYPE */}
            {step === 'choose' && (
              <div className="space-y-6 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Hi, {contributorName || 'Guest'}</span>
                  <h3 className="text-xl font-extrabold text-slate-900">How will you contribute?</h3>
                  <p className="text-xs text-slate-500 font-light">Select a contribution type to save a memory instantly in the shared capsule.</p>
                </div>

                {/* Upload Closed Banner */}
                {((event.status as string) === 'completed' || event.status === 'archived' || event.settings?.guestUploadAllowed === false) && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Uploads are currently closed by the host. You can still explore the event gallery below.</span>
                  </div>
                )}

                {/* Big Thumb Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* Photo Option */}
                  {(event.settings?.allowedTypes ? event.settings.allowedTypes.includes('photo') : true) && (event.settings?.showPhotos !== false) && (
                    <button
                      onClick={() => handleChooseContribution('photo')}
                      disabled={(event.status as string) === 'completed' || event.status === 'archived' || event.settings?.guestUploadAllowed === false}
                      className={`flex items-center justify-between p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                        isPhotoLimitReached 
                          ? 'opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-100 hover:border-slate-950 hover:bg-white'
                      }`}
                      id="btn-choose-photo"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs text-slate-900">Photos & Polaroids</h4>
                            {photoLimit > 0 && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-orange-100/50 text-orange-700 rounded-full">
                                {guestPhotosCount}/{photoLimit} {isPhotoLimitReached ? 'Limit Reached' : 'Slots'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-light mt-0.5">Share high-res snaps using camera or camera roll.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {/* Written Wish */}
                  {(event.settings?.allowedTypes ? event.settings.allowedTypes.includes('wish') : true) && (event.settings?.showWishes !== false) && (
                    <button
                      onClick={() => handleChooseContribution('wish')}
                      disabled={(event.status as string) === 'completed' || event.status === 'archived' || event.settings?.guestUploadAllowed === false}
                      className={`flex items-center justify-between p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                        isWishLimitReached 
                          ? 'opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-100 hover:border-slate-950 hover:bg-white'
                      }`}
                      id="btn-choose-wish"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs text-slate-900">Heartfelt Written Wish</h4>
                            {wishLimit > 0 && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-red-100/50 text-red-700 rounded-full">
                                {guestWishesCount}/{wishLimit} {isWishLimitReached ? 'Limit Reached' : 'Slots'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-light mt-0.5">Write a long digital guestbook memory for the timeline.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {/* Voice Message */}
                  {(event.settings?.allowedTypes ? event.settings.allowedTypes.includes('voice') : true) && (event.settings?.showVoices !== false) && (
                    <button
                      onClick={() => handleChooseContribution('voice')}
                      disabled={(event.status as string) === 'completed' || event.status === 'archived' || event.settings?.guestUploadAllowed === false}
                      className={`flex items-center justify-between p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                        isVoiceLimitReached 
                          ? 'opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-100 hover:border-slate-950 hover:bg-white'
                      }`}
                      id="btn-choose-voice"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                          <Mic className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs text-slate-900">Record a Voice Voicemail</h4>
                            {voiceLimit > 0 && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-emerald-100/50 text-emerald-700 rounded-full">
                                {guestVoicesCount}/{voiceLimit} {isVoiceLimitReached ? 'Limit Reached' : 'Slots'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-light mt-0.5">Leave an emotional spoken voice recording in-browser.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {/* Video Option */}
                  {isVideoGreetingsEnabled && (event.settings?.allowedTypes ? event.settings.allowedTypes.includes('video') : true) && (event.settings?.showVideos !== false) && (
                    <button
                      onClick={() => handleChooseContribution('video')}
                      disabled={(event.status as string) === 'completed' || event.status === 'archived' || event.settings?.guestUploadAllowed === false}
                      className={`flex items-center justify-between p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                        isVideoLimitReached 
                          ? 'opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-100 hover:border-slate-950 hover:bg-white'
                      }`}
                      id="btn-choose-video"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2.5 bg-slate-100 text-slate-900 rounded-xl">
                          <Tv className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs text-slate-900">High-Resolution Video</h4>
                            {videoLimit > 0 && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 text-slate-800 rounded-full">
                                {guestVideosCount}/{videoLimit} {isVideoLimitReached ? 'Limit Reached' : 'Slots'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-light mt-0.5">Post landscape dancing snippets or toast clips.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                </div>
              </div>
            )}

            {/* SCREEN 4A: PHOTO CHOOSE */}
            {step === 'photo' && (
              <PhotoPicker
                event={event}
                onClose={() => {
                  setForceMobilePhotoPicker(false);
                  setStep('choose');
                }}
                onDone={(urls) => {
                  setPhotoUrls(urls);
                  if (urls.length > 0) {
                    setPhotoUrl(urls[0]);
                  }
                  setForceMobilePhotoPicker(false);
                  setStep('review');
                }}
                maxPhotos={event.settings?.photoLimit || event.settings?.maxPhotosLimit || 10}
                maxSizeMB={event.settings?.maxPhotoSizeMB || 15}
                allowedFormats={event.settings?.allowedFormats || ['jpg', 'png', 'heic']}
                allowMultiple={event.settings?.allowMultiplePhotos !== false}
                guestPhotosCount={guestPhotosCount}
              />
            )}

            {/* SCREEN 4C: WRITTEN WISH */}
            {step === 'wish' && (
              <div className="space-y-6 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Guestbook letter</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Write a Wish</h3>
                  <p className="text-xs text-slate-500 font-light">Type a beautiful note, wedding blessing or piece of advice for their future journey.</p>
                </div>

                <div className="space-y-4">
                  <textarea
                    placeholder="Dearest Sofia & Leo, hearing your vows today..."
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:border-slate-400 leading-relaxed italic text-slate-800"
                    id="textarea-guest-wish"
                    autoFocus
                  />

                  <button
                    onClick={handleReviewWishSubmit}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                    id="btn-wish-review"
                  >
                    <span>Review Wish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 3.5: HOST GREETING STAGE */}
            {step === 'greeting' && (
              <div className="space-y-6 text-center animate-fade-in relative">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {effectiveGreetingType === 'video' ? 'Welcome Video' : 'Welcome Greeting'}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Message for {event.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    {effectiveGreetingType === 'video' 
                      ? 'Watch a welcoming message from our host before you record.' 
                      : 'Listen to a welcoming message from our host before you record.'}
                  </p>
                </div>

                {effectiveGreetingType === 'video' ? (
                  /* FULL-WIDTH VIDEO PLAYER CONTAINER */
                  <div className="bg-black rounded-[24px] overflow-hidden relative shadow-xl border border-slate-800 flex flex-col group">
                    <div className="absolute top-3 right-3 z-20 text-[9px] font-mono font-bold text-white tracking-widest bg-black/60 backdrop-blur-md px-3 py-1 rounded-full uppercase border border-white/10 flex items-center space-x-1.5 pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>WELCOME VIDEO</span>
                    </div>

                    <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                      <video
                        ref={greetingVideoRef}
                        src={videoGreetingUrl}
                        playsInline
                        controls
                        autoPlay
                        muted={isGreetingMuted}
                        onPlay={() => setIsGreetingPlaying(true)}
                        onPause={() => setIsGreetingPlaying(false)}
                        onLoadedMetadata={(e) => setGreetingDuration(e.currentTarget.duration || 15)}
                        onTimeUpdate={(e) => setGreetingCurrentTime(e.currentTarget.currentTime)}
                        onEnded={() => {
                          setIsGreetingPlaying(false);
                          setIsGreetingComplete(true);
                          handleGreetingFinished();
                        }}
                        className="w-full h-full object-contain mx-auto bg-black cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  /* PREMIUM VOICE GREETING AUDIO PLAYER CARD */
                  <div className="bg-slate-900 text-white p-6 rounded-[28px] space-y-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-3 right-3 text-[8px] font-mono text-white/30 tracking-widest uppercase">AUDIO GREETING</div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                        <Volume2 className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-sm text-white truncate max-w-[200px]">
                          {event.settings?.greetingVoiceName || `${event.name}'s Greeting`}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {isGreetingPlaying ? "Playing Welcome message..." : "Voice Greeting Loaded"}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Sound Waves animation */}
                    <div className="flex items-end justify-center space-x-1.5 h-14">
                      {isGreetingPlaying ? (
                        Array.from({ length: 18 }).map((_, i) => {
                          const height = 15 + Math.sin(i * 0.5 + greetingCurrentTime * 4) * 35 + Math.random() * 20;
                          return (
                            <div 
                              key={i} 
                              style={{ height: `${Math.max(8, Math.min(100, height))}%` }} 
                              className="bg-emerald-500 w-1 rounded-full transition-all duration-100"
                            />
                          );
                        })
                      ) : (
                        Array.from({ length: 18 }).map((_, i) => (
                          <div 
                            key={i} 
                            style={{ height: '6px' }} 
                            className="bg-white/20 w-1 rounded-full"
                          />
                        ))
                      )}
                    </div>

                    {/* Playback timeline tracker */}
                    <div className="space-y-1 text-left">
                      <input 
                        type="range"
                        min={0}
                        max={greetingDuration || 1}
                        step={0.1}
                        value={greetingCurrentTime}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (greetingAudioRef.current) {
                            greetingAudioRef.current.currentTime = val;
                          }
                          setGreetingCurrentTime(val);
                        }}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                        aria-label="Seek Greeting Audio"
                      />
                      <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
                        <span>{formatTime(Math.floor(greetingCurrentTime))}</span>
                        <span>{formatTime(Math.floor(greetingDuration))}</span>
                      </div>
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center justify-between px-2 pt-1">
                      {event.settings?.greetingReplayEnabled !== false ? (
                        <button
                          onClick={() => {
                            if (greetingAudioRef.current) {
                              greetingAudioRef.current.currentTime = 0;
                              setGreetingCurrentTime(0);
                              if (!isGreetingPlaying) {
                                setIsGreetingPlaying(true);
                              }
                            }
                          }}
                          className="p-2 bg-white/5 hover:bg-white/10 active:scale-95 transition-all rounded-full border border-white/5 cursor-pointer text-slate-300"
                          title="Replay from start"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : <div className="w-8" />}

                      <button
                        onClick={() => setIsGreetingPlaying(!isGreetingPlaying)}
                        className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500"
                        title={isGreetingPlaying ? "Pause" : "Play"}
                      >
                        {isGreetingPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
                      </button>

                      <button
                        onClick={() => setIsGreetingMuted(!isGreetingMuted)}
                        className="p-2 bg-white/5 hover:bg-white/10 active:scale-95 transition-all rounded-full border border-white/5 cursor-pointer text-slate-300"
                        title={isGreetingMuted ? "Unmute" : "Mute"}
                      >
                        {isGreetingMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Greeting Instruction or Welcome Text */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left text-xs text-slate-500 space-y-1 leading-relaxed font-sans">
                  <p className="font-bold text-slate-700">Message from Host:</p>
                  <p className="italic font-light">
                    {effectiveGreetingType === 'voice' 
                      ? (event.settings?.greetingVoiceName || "Hello! Thank you so much for celebrating this special day with us. We'd love to hear your wishes, favorite memories, or any message you'd like to leave for us.")
                      : (event.settings?.greetingVideoName || "Welcome to our event memory capsule! Share your greetings, blessings, and toasts in our video booth.")
                    }
                  </p>
                </div>

                {/* Bottom navigation actions */}
                <div className="flex space-x-3">
                  {event.settings?.greetingSkipEnabled !== false && (
                    <button
                      onClick={handleGreetingFinished}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all cursor-pointer text-xs"
                      id="btn-greeting-skip"
                    >
                      Skip Greeting
                    </button>
                  )}
                  
                  <button
                    onClick={handleGreetingFinished}
                    disabled={!isGreetingComplete && event.settings?.greetingSkipEnabled === false}
                    className={`flex-1 font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 text-xs shadow-sm ${
                      isGreetingComplete || event.settings?.greetingSkipEnabled !== false
                        ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    id="btn-greeting-continue"
                  >
                    <span>Continue to Record</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 4D: VOICE RECORDER */}
            {step === 'voice' && (
              <div className="space-y-8 text-center animate-fade-in max-w-md mx-auto py-2">
                {/* Header Section */}
                <div className="space-y-2 text-center">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">
                    Message for {event.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-normal max-w-xs mx-auto leading-relaxed">
                    Record a spoken message to leave in the memory capsule.
                  </p>
                </div>

                {/* Voice Recording Card / Apple Voice Memos inspired Canvas */}
                <div className="bg-slate-900 text-white p-8 rounded-[36px] shadow-2xl space-y-8 relative overflow-hidden transition-all duration-300">
                  {renderCountdownOverlay("rounded-[36px]")}

                  {/* Permission / Device Error Panel (Clean Inline Notice) */}
                  {permissionStatus === 'denied' && !isRecording && !recordedAudioUrl && (
                    <div className="bg-rose-950/50 border border-rose-800/40 rounded-2xl p-4 space-y-3 text-center max-w-sm mx-auto">
                      <AlertCircle className="w-7 h-7 text-rose-400 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-rose-200">Microphone Access Needed</p>
                        <p className="text-[11px] text-rose-300/80 leading-snug">
                          Please allow microphone access in your browser to record a voice message.
                        </p>
                      </div>
                      <div className="flex space-x-2 justify-center pt-1">
                        <button
                          type="button"
                          onClick={handleStartRecording}
                          className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-full cursor-pointer transition-all"
                        >
                          Allow Access
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPermissionStatus('granted');
                            setIsSimulatorMode(true);
                            setIsRecording(true);
                          }}
                          className="bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs px-4 py-2 rounded-full cursor-pointer transition-all"
                        >
                          Use Voice Simulator
                        </button>
                      </div>
                    </div>
                  )}

                  {permissionStatus === 'nodevice' && !isRecording && !recordedAudioUrl && (
                    <div className="bg-amber-950/50 border border-amber-800/40 rounded-2xl p-4 space-y-3 text-center max-w-sm mx-auto">
                      <AlertCircle className="w-7 h-7 text-amber-400 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-amber-200">No Microphone Detected</p>
                        <p className="text-[11px] text-amber-300/80 leading-snug">
                          No active microphone input was found. Please connect a microphone and try again.
                        </p>
                      </div>
                      <div className="flex space-x-2 justify-center pt-1">
                        <button
                          type="button"
                          onClick={handleStartRecording}
                          className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-4 py-2 rounded-full cursor-pointer transition-all"
                        >
                          Check Microphone
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPermissionStatus('granted');
                            setIsSimulatorMode(true);
                            setIsRecording(true);
                          }}
                          className="bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs px-4 py-2 rounded-full cursor-pointer transition-all"
                        >
                          Use Voice Simulator
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STATE 1: INITIAL STATE (Not recording, no recorded audio) */}
                  {permissionStatus !== 'denied' && permissionStatus !== 'nodevice' && !isRecording && !recordedAudioUrl && (
                    <div className="space-y-8 py-2">
                      {/* Large Timer & Recording Limit */}
                      <div className="space-y-2">
                        <div className="text-5xl font-black tracking-tight font-mono text-white">
                          0:00
                        </div>
                        <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-emerald-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Max {Math.floor((event.settings?.voiceMaxRecordingLength || event.settings?.voiceLimit || 120) / 60)} mins</span>
                        </div>
                      </div>

                      {/* Single Large Microphone Button */}
                      <div className="flex justify-center pt-2">
                        <button
                          onClick={handleStartRecording}
                          className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center text-white shadow-xl shadow-red-500/30 border-4 border-white/20 transition-all cursor-pointer group"
                          id="btn-voice-record-start"
                          aria-label="Start Recording"
                        >
                          <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STATE 2: RECORDING IN PROGRESS */}
                  {isRecording && (
                    <div className="space-y-8 py-2">
                      {/* Timer with Active Recording Indicator */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">Recording</span>
                        </div>
                        <div className="text-6xl font-black tracking-tight font-mono text-white">
                          {formatTime(recordingSeconds)}
                        </div>
                        <p className="text-xs font-mono text-white/50">
                          Max {Math.floor((event.settings?.voiceMaxRecordingLength || event.settings?.voiceLimit || 120) / 60)} mins
                        </p>
                      </div>

                      {/* Animated Waveform */}
                      <div className="flex items-end justify-center space-x-1.5 h-16 px-4">
                        {visualizerLevels.map((val, i) => (
                          <div 
                            key={i} 
                            style={{ 
                              height: `${Math.max(12, val * 100)}%`,
                            }} 
                            className="bg-emerald-400 w-2 rounded-full transition-all duration-75"
                          />
                        ))}
                      </div>

                      {/* Stop Button */}
                      <div className="flex justify-center pt-2">
                        <button
                          onClick={handleStopRecording}
                          className="w-20 h-20 rounded-full bg-white text-slate-900 active:scale-95 flex items-center justify-center shadow-xl border-4 border-white/20 hover:bg-slate-100 transition-all cursor-pointer"
                          id="btn-voice-record-stop"
                          aria-label="Stop Recording"
                        >
                          <div className="w-7 h-7 bg-red-500 rounded-lg"></div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STATE 3: AFTER RECORDING (Playback) */}
                  {!isRecording && recordedAudioUrl && (
                    <div className="space-y-6 py-2">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">Voice Recording</span>
                        <div className="text-5xl font-black tracking-tight font-mono text-white">
                          {formatTime(Math.floor(playbackTime || playbackDuration || recordingSeconds))}
                        </div>
                      </div>

                      {/* Waveform & Playback Scrubber */}
                      <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={isPlaying ? handlePausePlayback : handlePlayPlayback}
                            className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white flex items-center justify-center shadow-lg shrink-0 transition-all cursor-pointer"
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? (
                              <Pause className="w-6 h-6 fill-current" />
                            ) : (
                              <Play className="w-6 h-6 fill-current translate-x-0.5" />
                            )}
                          </button>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-end space-x-1 h-10 px-1">
                              {[30, 50, 40, 65, 80, 55, 30, 45, 60, 75, 40, 50, 60, 80, 70, 50, 30, 40, 60, 50, 45, 30, 20, 15].map((height, idx) => {
                                const isPlayed = idx / 24 < (playbackTime / (playbackDuration || 1));
                                return (
                                  <div
                                    key={idx}
                                    style={{ height: `${height}%` }}
                                    className={`flex-1 rounded-full transition-colors duration-150 ${isPlayed ? 'bg-emerald-400' : 'bg-white/20'}`}
                                  />
                                );
                              })}
                            </div>

                            <input 
                              type="range"
                              min={0}
                              max={playbackDuration || 1}
                              step={0.1}
                              value={playbackTime}
                              onChange={(e) => handleSeek(parseFloat(e.target.value))}
                              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                              aria-label="Seek playback"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* AFTER RECORDING ACTION BUTTONS */}
                {!isRecording && recordedAudioUrl && (
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleReviewVoiceSubmit}
                      disabled={uploadState === 'uploading'}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer text-base"
                      id="btn-voice-continue"
                    >
                      <span>{uploadState === 'uploading' ? 'Saving Recording...' : 'Continue'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleResetVoice}
                      className="text-slate-500 hover:text-slate-800 font-semibold text-sm py-2 px-4 transition-colors cursor-pointer block mx-auto"
                      id="btn-voice-retake"
                    >
                      Retake Recording
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SCREEN 5: REVIEW CONTRIBUTION */}
            {step === 'review' && (
              <div className="space-y-6 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Ready to preserve</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Review your contribution</h3>
                  <p className="text-xs text-slate-500 font-light">Take a moment to preview how this will live inside Sofia & Leo's memory capsule.</p>
                </div>

                {/* Contribution visual preview box */}
                <div className="border border-slate-100 p-5 rounded-2xl space-y-4 bg-slate-50/50">
                  <div className="flex items-center space-x-2.5 text-xs">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[9px] uppercase">
                      {contributorName.substring(0,2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{contributorName}</h4>
                      <p className="text-[9px] text-slate-400 font-mono">CONTRIBUTOR</p>
                    </div>
                  </div>

                  {selectedType === 'photo' && photoUrl && (
                    <div className="space-y-3">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-sm">
                        <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <input
                        type="text"
                        placeholder="Add sweet caption/wish... (optional)"
                        value={captionText}
                        onChange={(e) => setCaptionText(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-slate-950 text-slate-800"
                        id="input-guest-caption"
                      />
                    </div>
                  )}

                  {selectedType === 'video' && videoUrl && (
                    <div className="aspect-[16/10] bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80" alt="Video cover" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs space-x-1 bg-black/30">
                        <span>Video Ready for upload • MP4</span>
                      </div>
                    </div>
                  )}

                  {selectedType === 'wish' && wishText && (
                    <p className="text-xs text-slate-600 italic leading-relaxed">"{wishText}"</p>
                  )}

                  {selectedType === 'voice' && recordedAudioUrl && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white border border-slate-100 py-2.5 px-4 rounded-2xl shadow-xs">
                        <div className="flex items-center space-x-3">
                          <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                          <span className="text-xs font-bold text-slate-900">Spoken Voicemail ({formatTime(recordingSeconds)})</span>
                        </div>
                        
                        {isPlaying ? (
                          <button
                            onClick={handlePausePlayback}
                            className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-xs cursor-pointer focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            aria-label="Pause recorded blessing preview"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={handlePlayPlayback}
                            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs cursor-pointer focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            aria-label="Play recorded blessing preview"
                          >
                            <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium italic text-center pt-1">
                        "Your spoken voicemail is ready to be safely preserved inside the shared capsule."
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleFinalSubmit}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  id="btn-final-submit"
                >
                  <Check className="w-4 h-4" />
                  <span>{isPhotoCollectionMode ? 'Upload to Photo Collection' : 'Submit to Capsule'}</span>
                </button>
              </div>
            )}

            {/* SCREEN 6: UPLOADING STATE */}
            {step === 'uploading' && (
              <div className="space-y-6 text-center py-10 max-w-sm mx-auto">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
                  <span className="absolute font-mono text-xs font-black text-slate-900">{uploadPercent}%</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {uploadPercent < 50 ? 'Optimizing memory...' : uploadPercent < 90 ? 'Uploading to capsule...' : 'Securing contribution!'}
                  </h3>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300 rounded-full" 
                      style={{ width: `${uploadPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-light font-mono pt-1">
                    Preserving directly into {event.name || 'Memory Capsule'}'s shared timeline.
                  </p>
                </div>
              </div>
            )}

            {/* SCREEN 7: THANK YOU & AUTO REDIRECT */}
            {step === 'thanks' && (
              <div className="space-y-6 text-center py-6 animate-fade-in">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-md border border-emerald-100/80">
                    ✨
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white rounded-full p-1 shadow-xs">
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
                    Memory Preserved Successfully
                  </span>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">Thank you, {contributorName || 'Guest'}!</h2>
                  <p className="text-xs text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
                    Your contribution has been saved to {event.name}'s memory capsule. Redirecting you to the Event Gallery...
                  </p>
                </div>

                {/* Auto redirect progress bar indicator */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2 max-w-xs mx-auto">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 font-mono">
                    <span>Entering Event Gallery</span>
                    <span>{thanksRedirectTimer}s</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${((2 - thanksRedirectTimer) / 2) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-2 max-w-xs mx-auto">
                  <button
                    onClick={() => setStep('album')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md text-xs uppercase tracking-wider"
                    id="btn-view-capsule-album-now"
                  >
                    <span>View Event Gallery Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetAll}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl transition-all text-xs cursor-pointer"
                    id="btn-submit-another"
                  >
                    Upload Another Memory
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mini quiet quote footer */}
      <footer className="text-center pt-4 text-[10px] text-slate-400 font-mono">
        "We don't store files. We preserve memories."
      </footer>
    </div>
  );
}
