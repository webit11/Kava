import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, 
  QrCode, 
  Sparkles, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Camera, 
  Heart, 
  Volume2,
  Video
} from 'lucide-react';
import { KavaEvent, KavaContribution } from '../types';
import { THEME_PRESETS, getFontClass, getBackgroundStyle } from '../theme';
import { getAudioFile } from '../audioStorage';
import { getEffectiveEventBranding, applyBrandKitCSSVariables } from '../lib/brandKit';
import { generateQrCodeDataUrl, getEventGuestLink, getEventGuestShortDisplay } from '../lib/qrUtils';

interface LiveExperienceProps {
  event: KavaEvent;
  contributions: KavaContribution[];
  onClose: () => void;
}

type LiveDisplayMode = 'loop' | 'slideshow' | 'gallery' | 'wishwall';

export default function LiveExperience({ event, contributions, onClose }: LiveExperienceProps) {
  const [displayMode, setDisplayMode] = useState<LiveDisplayMode>('loop');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveReactions, setLiveReactions] = useState<{ id: string; emoji: string; left: number; size: number }[]>([]);

  const effectiveBranding = getEffectiveEventBranding(event);
  
  useEffect(() => {
    applyBrandKitCSSVariables(effectiveBranding);
  }, [event]);

  const settings: any = event.settings || {};
  const presentationTheme = settings.presentationTheme || 'wedding';
  const presentationBackgroundType = settings.presentationBackgroundType || 'wedding';
  const presentationBgColor = settings.presentationBgColor || '#FAF5F5';
  const presentationBgGradient = settings.presentationBgGradient || 'linear-gradient(135deg, #FFF5F5, #FFF0F5, #FDF5E6)';
  const presentationBgImageUrl = settings.presentationBgImageUrl || '';
  const presentationBgOpacity = settings.presentationBgOpacity !== undefined ? settings.presentationBgOpacity : 80;
  const presentationBgBlur = settings.presentationBgBlur !== undefined ? settings.presentationBgBlur : 12;
  const qrCodePosition = settings.qrCodePosition || 'bottom-left';
  const qrCodeSize = settings.qrCodeSize || 'medium';
  const joinLinkVisible = settings.joinLinkVisible !== undefined ? settings.joinLinkVisible : true;
  const joinLinkPosition = settings.joinLinkPosition || 'adjacent';
  const eventTitleVisible = settings.eventTitleVisible !== undefined ? settings.eventTitleVisible : true;
  const eventInfoVisible = settings.eventInfoVisible !== undefined ? settings.eventInfoVisible : true;
  const logoVisible = settings.logoVisible !== undefined ? settings.logoVisible : true;
  const logoUrl = settings.logoUrl || effectiveBranding.logoUrl;
  const footerVisible = settings.footerVisible !== undefined ? settings.footerVisible : true;
  const footerText = settings.footerText !== undefined ? settings.footerText : 'Projected via Kava Collaborative Memory Suite';
  const safeAreaEnabled = settings.safeAreaEnabled !== undefined ? settings.safeAreaEnabled : false;
  const screenMargins = settings.screenMargins || 'normal';
  const slideshowInterval = settings.slideshowInterval || 6;
  const transitionAnimation = settings.transitionAnimation || 'fade';
  const alwaysShowQr = settings.alwaysShowQr !== undefined ? settings.alwaysShowQr : true;
  const alwaysShowJoinLink = settings.alwaysShowJoinLink !== undefined ? settings.alwaysShowJoinLink : true;
  const showEventCode = settings.showEventCode !== undefined ? settings.showEventCode : true;
  const showUploadInstructions = settings.showUploadInstructions !== undefined ? settings.showUploadInstructions : true;
  const idleBehavior = settings.idleBehavior || 'loop';

  // New Content Visibility and Moderation Settings
  const showPhotos = settings.showPhotos !== undefined ? settings.showPhotos : true;
  const showVideos = settings.showVideos !== undefined ? settings.showVideos : true;
  const showVoices = settings.showVoices !== undefined ? settings.showVoices : true;
  const showWishes = settings.showWishes !== undefined ? settings.showWishes : true;
  const showPinnedMemories = settings.showPinnedMemories !== undefined ? settings.showPinnedMemories : true;
  const showOfficialPhotos = settings.showOfficialPhotos !== undefined ? settings.showOfficialPhotos : true;

  const moderationApprovedOnly = settings.moderationApprovedOnly !== undefined ? settings.moderationApprovedOnly : false;
  const moderationHideSelected = settings.moderationHideSelected !== undefined ? settings.moderationHideSelected : true;
  const moderationHideAnonymous = settings.moderationHideAnonymous !== undefined ? settings.moderationHideAnonymous : false;
  const moderationHideNames = settings.moderationHideNames !== undefined ? settings.moderationHideNames : false;
  const moderationShowPinnedOnly = settings.moderationShowPinnedOnly !== undefined ? settings.moderationShowPinnedOnly : false;
  const hiddenConIds = settings.hiddenConIds || [];
  const approvedConIds = settings.approvedConIds || [];

  // Filter contributions by event and all visual/moderation filters
  const activeContributions = contributions.filter(c => {
    if (c.eventId !== event.id) return false;

    // Type toggles
    if (c.type === 'photo') {
      if (!showPhotos) return false;
      // Filter official/guest photos if specified
      if (!showOfficialPhotos && (c.contributorName.toLowerCase() === 'organizer' || c.contributorName.toLowerCase() === 'host' || c.contributorName.toLowerCase() === 'official')) {
        return false;
      }
    }
    if (c.type === 'video' && !showVideos) return false;
    if (c.type === 'voice' && !showVoices) return false;
    if (c.type === 'wish' && !showWishes) return false;

    // Pinned memories filter
    if (!showPinnedMemories && c.isPinned) return false;

    // Moderation options
    if (moderationShowPinnedOnly && !c.isPinned) return false;
    if (moderationHideSelected && hiddenConIds.includes(c.id)) return false;
    if (moderationApprovedOnly && !approvedConIds.includes(c.id)) return false;

    if (moderationHideAnonymous) {
      const name = c.contributorName.toLowerCase();
      if (!name || name === 'anonymous' || name === 'guest') return false;
    }

    return true;
  });

  // Auto cycling timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeContributions.length > 0 && (displayMode === 'loop' || displayMode === 'slideshow' || displayMode === 'wishwall')) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % activeContributions.length);
      }, slideshowInterval * 1000); // cycle at user-defined timing interval
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, activeContributions.length, displayMode, slideshowInterval]);

  // Sync slideshow index & active state to localStorage for real-time guest synchronization
  useEffect(() => {
    localStorage.setItem(`kava_live_index_${event.id}`, currentIndex.toString());
    localStorage.setItem(`kava_live_active_${event.id}`, 'true');
    return () => {
      localStorage.setItem(`kava_live_active_${event.id}`, 'false');
    };
  }, [currentIndex, event.id]);

  // Read live emoji reactions arriving from guest phones via localStorage
  useEffect(() => {
    let lastCheck = Date.now();
    
    const checkReactions = () => {
      // Honor reaction settings
      const reactionsEnabled = event.settings?.reactionsEnabled !== false;
      const reactionsMomentOnly = event.settings?.reactionsMomentOnly || false;
      const reactionsActiveMoment = event.settings?.reactionsActiveMoment !== false;
      
      if (!reactionsEnabled) return;
      if (reactionsMomentOnly && !reactionsActiveMoment) return;
      
      const key = `kava_reactions_${event.id}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const newReactions = parsed.filter((r: any) => r.timestamp > lastCheck);
            if (newReactions.length > 0) {
              const itemsToAdd = newReactions.map((r: any) => ({
                id: r.id || `${Date.now()}_${Math.random()}`,
                emoji: r.emoji,
                left: 10 + Math.random() * 80, // random x horizontal %
                size: 24 + Math.random() * 24  // random size in pixels
              }));
              setLiveReactions(prev => [...prev, ...itemsToAdd].slice(-40)); // keep max 40 in DOM
            }
          }
        } catch (err) {
          console.error('Error parsing live reactions:', err);
        }
      }
      lastCheck = Date.now();
    };

    // Poll every 300ms for ultra-responsive floating hearts/emojis
    const interval = setInterval(checkReactions, 300);

    return () => clearInterval(interval);
  }, [event.id, event.settings]);

  // --- AUDIO & BACKGROUND MUSIC SYSTEM ---
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio settings from settings object
  const enableBgm = settings.enableBgm === true;
  const bgmSource = settings.bgmSource || 'preset';
  const bgmFileUrl = settings.bgmFileUrl || '';
  const bgmFileName = settings.bgmFileName || 'Elegant Piano';
  const bgmVolume = settings.bgmVolume !== undefined ? settings.bgmVolume : 50;
  const bgmLoop = settings.bgmLoop !== false;
  const bgmFadeIn = settings.bgmFadeIn !== undefined ? settings.bgmFadeIn : 1;
  const bgmFadeOut = settings.bgmFadeOut !== undefined ? settings.bgmFadeOut : 1;
  const bgmStartTiming = settings.bgmStartTiming || 'immediately';

  const enableDucking = settings.enableDucking !== false;
  const duckLevel = settings.duckLevel !== undefined ? settings.duckLevel : 25;
  const fadeDownDuration = settings.fadeDownDuration !== undefined ? settings.fadeDownDuration : 0.5;
  const fadeUpDuration = settings.fadeUpDuration !== undefined ? settings.fadeUpDuration : 1;

  const mixerBgmVolume = settings.mixerBgmVolume !== undefined ? settings.mixerBgmVolume : 80;
  const mixerVoiceVolume = settings.mixerVoiceVolume !== undefined ? settings.mixerVoiceVolume : 100;
  const mixerSystemVolume = settings.mixerSystemVolume !== undefined ? settings.mixerSystemVolume : 50;
  const bgmAutoplay = settings.bgmAutoplay !== false;

  const currentContribution = activeContributions[currentIndex] || null;

  // Background Music URL resolver for custom uploaded files
  const [resolvedBgmUrl, setResolvedBgmUrl] = useState<string>('');

  useEffect(() => {
    let active = true;
    let currentObjectUrl = '';

    const resolveUrl = async () => {
      if (bgmFileUrl.startsWith('indexeddb://')) {
        const fileData = await getAudioFile(event.id);
        if (fileData && fileData.blob && active) {
          const objUrl = URL.createObjectURL(fileData.blob);
          currentObjectUrl = objUrl;
          setResolvedBgmUrl(objUrl);
        } else if (active) {
          setResolvedBgmUrl('');
        }
      } else {
        if (active) {
          setResolvedBgmUrl(bgmFileUrl);
        }
      }
    };

    resolveUrl();

    return () => {
      active = false;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [event.id, bgmFileUrl]);

  // Timing delay for countdown
  useEffect(() => {
    if (bgmStartTiming === 'countdown') {
      const t = setTimeout(() => setCountdownFinished(true), 5000);
      return () => clearTimeout(t);
    }
  }, [bgmStartTiming]);

  const shouldPlayBgm = enableBgm && (
    bgmStartTiming === 'immediately' ||
    (bgmStartTiming === 'first_slide' && currentIndex > 0) ||
    (bgmStartTiming === 'countdown' && countdownFinished)
  );

  const playWithFallback = (audio: HTMLAudioElement) => {
    audio.play().catch(() => {
      // Autoplay blocked. Add touch/click triggers to play on host action
      const startOnInteraction = () => {
        audio.play().catch(e => console.warn("Failed to play BGM on interaction:", e));
        window.removeEventListener('click', startOnInteraction);
        window.removeEventListener('touchstart', startOnInteraction);
      };
      window.addEventListener('click', startOnInteraction);
      window.addEventListener('touchstart', startOnInteraction);
    });
  };

  // 1. Spoken Voicemails (Voice Notes) Playback and Event Listener
  useEffect(() => {
    // Stop any active voicemail when transitioning slide/page
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current = null;
    }
    setIsVoicePlaying(false);

    if (isPlaying && currentContribution && currentContribution.type === 'voice' && currentContribution.url) {
      const voiceAudio = new Audio(currentContribution.url);
      voiceAudio.volume = mixerVoiceVolume / 100;
      
      voiceAudio.onplay = () => {
        setIsVoicePlaying(true);
      };
      voiceAudio.onended = () => {
        setIsVoicePlaying(false);
      };
      voiceAudio.onerror = () => {
        setIsVoicePlaying(false);
      };

      voiceAudioRef.current = voiceAudio;
      voiceAudio.play().catch(e => {
        console.warn("Spoken voicemail autoplay blocked or failed:", e);
        setIsVoicePlaying(false);
      });
    }

    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
    };
  }, [currentIndex, isPlaying, currentContribution, mixerVoiceVolume]);

  // 2. Background Music Playback and Volume Interpolator
  useEffect(() => {
    if (!enableBgm || !resolvedBgmUrl) {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
      return;
    }

    // Initialize or update source URL
    let audio = bgmAudioRef.current;
    if (!audio || audio.src !== resolvedBgmUrl) {
      if (audio) {
        audio.pause();
      }
      audio = new Audio(resolvedBgmUrl);
      bgmAudioRef.current = audio;
    }

    audio.loop = bgmLoop;

    // Determine normal vs ducked volume levels
    const normalVol = (bgmVolume / 100) * (mixerBgmVolume / 100);
    const duckedVol = normalVol * (duckLevel / 100);

    // Play/pause control
    if (shouldPlayBgm && isPlaying) {
      if (audio.paused) {
        // start at zero if fade-in is configured
        audio.volume = bgmFadeIn > 0 ? 0 : (isVoicePlaying ? duckedVol : normalVol);
        playWithFallback(audio);
      }
    } else {
      if (!audio.paused && bgmFadeOut === 0) {
        audio.pause();
      }
    }

    // Smoothly step volume changes every 50ms (volume interpolator)
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      if (!bgmAudioRef.current) return;
      const aud = bgmAudioRef.current;

      const activeTarget = (shouldPlayBgm && isPlaying)
        ? (isVoicePlaying ? duckedVol : normalVol)
        : 0;

      const currentVol = aud.volume;
      const diff = activeTarget - currentVol;

      if (Math.abs(diff) < 0.01) {
        aud.volume = activeTarget;
        if (activeTarget === 0 && !aud.paused) {
          aud.pause();
        }
      } else {
        let duration = 1.0;
        if (diff < 0) {
          // Decreasing volume (either ducking or stopping)
          duration = isVoicePlaying ? fadeDownDuration : (shouldPlayBgm ? fadeDownDuration : bgmFadeOut);
        } else {
          // Increasing volume (either restoring or starting)
          duration = isVoicePlaying ? fadeUpDuration : (aud.paused ? bgmFadeIn : fadeUpDuration);
        }
        if (duration <= 0) duration = 0.1;

        const step = (diff > 0 ? 1 : -1) * (0.05 / duration);
        let nextVol = currentVol + step;
        if (diff > 0 && nextVol > activeTarget) nextVol = activeTarget;
        if (diff < 0 && nextVol < activeTarget) nextVol = activeTarget;
        aud.volume = Math.max(0, Math.min(1, nextVol));
      }
    }, 50);

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [
    enableBgm,
    resolvedBgmUrl,
    bgmLoop,
    bgmVolume,
    mixerBgmVolume,
    duckLevel,
    isVoicePlaying,
    shouldPlayBgm,
    isPlaying,
    bgmFadeIn,
    bgmFadeOut,
    fadeDownDuration,
    fadeUpDuration
  ]);

  // Clean up references on unmount
  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
    };
  }, []);

  const getQrPositionClass = (pos: string) => {
    switch (pos) {
      case 'top-left':
        return 'absolute top-28 left-10';
      case 'top-right':
        return 'absolute top-28 right-10';
      case 'bottom-left':
        return 'absolute bottom-10 left-10';
      case 'bottom-right':
        return 'absolute bottom-10 right-10';
      case 'center':
        return 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'hidden';
    }
  };

  const getQrSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'scale-75 origin-center';
      case 'large':
        return 'scale-110 origin-center';
      case 'xl':
        return 'scale-125 origin-center';
      case 'medium':
      default:
        return 'scale-100 origin-center';
    }
  };

  const handleNext = () => {
    if (activeContributions.length > 0) {
      setCurrentIndex((currentIndex + 1) % activeContributions.length);
    }
  };

  const handlePrev = () => {
    if (activeContributions.length > 0) {
      setCurrentIndex((currentIndex - 1 + activeContributions.length) % activeContributions.length);
    }
  };

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const guestLink = useMemo(() => getEventGuestLink(event), [event]);
  const guestShortDisplay = useMemo(() => getEventGuestShortDisplay(event), [event]);

  useEffect(() => {
    let isMounted = true;
    generateQrCodeDataUrl(guestLink, 320).then((url) => {
      if (isMounted && url) {
        setQrDataUrl(url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [guestLink]);

  const [newMomentNotification, setNewMomentNotification] = useState<{ name: string; type: string } | null>(null);
  const previousCountRef = useRef(activeContributions.length);

  useEffect(() => {
    if (activeContributions.length > previousCountRef.current && previousCountRef.current > 0) {
      const latest = activeContributions[activeContributions.length - 1];
      if (latest) {
        setNewMomentNotification({
          name: latest.contributorName || 'A guest',
          type: latest.type
        });
        const timer = setTimeout(() => {
          setNewMomentNotification(null);
        }, 4500);
        return () => clearTimeout(timer);
      }
    }
    previousCountRef.current = activeContributions.length;
  }, [activeContributions.length]);

  // Keyboard navigation for Live Presenter mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeContributions.length, currentIndex]);

  const [idleIndex, setIdleIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeContributions.length === 0 && idleBehavior === 'loop') {
      timer = setInterval(() => {
        setIdleIndex((prev) => (prev + 1) % 3);
      }, 6000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeContributions.length, idleBehavior]);

  const activeTheme = THEME_PRESETS[presentationTheme] || THEME_PRESETS.wedding;
  const bgStyle = getBackgroundStyle(
    presentationBackgroundType,
    presentationBgColor,
    presentationBgGradient,
    presentationBgImageUrl,
    presentationBgOpacity,
    presentationBgBlur,
    presentationTheme
  );

  const getMotionProps = () => {
    switch (transitionAnimation) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -100 },
          transition: { duration: 0.6, ease: 'easeInOut' }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 },
          transition: { duration: 0.6, ease: 'easeOut' }
        };
      case 'none':
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 },
          transition: { duration: 0 }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.02 },
          transition: { duration: 0.5, ease: 'easeInOut' }
        };
    }
  };

  const getMarginClass = () => {
    switch (screenMargins) {
      case 'compact':
        return 'p-4';
      case 'relaxed':
        return 'p-16';
      case 'normal':
      default:
        return 'p-10';
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col justify-between selection:bg-white selection:text-black relative overflow-hidden transition-all duration-500 ${getFontClass(activeTheme.fontFamily)} ${getMarginClass()}`}
      style={{
        color: activeTheme.textColor,
        backgroundColor: activeTheme.bgColor
      }}
    >
      {/* Dynamic Background Layer */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-500"
        style={bgStyle}
      />

      {/* Subtle blend/mix overlay for readability */}
      {(presentationBackgroundType === 'image' || presentationBackgroundType === 'custom' || presentationBackgroundType === 'gradient') && (
        <div className="absolute inset-0 z-0 bg-black/15 mix-blend-multiply pointer-events-none" />
      )}

      {/* Real-time floating guest emoji reactions overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden" id="projector-live-reactions-layer">
        <AnimatePresence>
          {liveReactions.map((react) => (
            <motion.div
              key={react.id}
              initial={{ opacity: 0, y: '105vh', scale: 0.5, x: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: '-10vh', 
                scale: [0.6, 1.2, 1, 0.8],
                x: [0, Math.sin(react.left) * 60, Math.cos(react.left) * -60, Math.sin(react.left) * 60]
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

      {/* Safe Area Indicator */}
      {safeAreaEnabled && (
        <div className="absolute inset-6 border-2 border-dashed border-red-500/25 z-50 pointer-events-none flex items-start justify-end p-4 font-mono text-[9px] text-red-500/50">
          TV SAFE ZONE BOUNDARY (5% BLEED LIMIT)
        </div>
      )}

      {/* Top Header Row */}
      <header className="px-8 py-5 border-b border-white/10 flex items-center justify-between backdrop-blur-md bg-black/10 rounded-2xl z-20 shrink-0 relative">
        <div className="flex items-center space-x-4">
          {logoVisible && (
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/20 backdrop-blur-sm overflow-hidden shrink-0 shadow-sm">
              {logoUrl ? (
                <img src={logoUrl} alt="Event Crest" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-sm">✨</span>
              )}
            </div>
          )}
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-xl tracking-wider uppercase opacity-90">KAVA</span>
            <span className="text-[10px] bg-red-500 text-white font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse">LIVE</span>
          </div>
          {(eventTitleVisible || eventInfoVisible) && <span className="text-white/20 text-xs">|</span>}
          <div className="text-left">
            {eventTitleVisible && (
              <h2 className="text-sm font-extrabold tracking-tight">{event.name}</h2>
            )}
            {eventInfoVisible && (
              <p className="text-[10px] opacity-60 tracking-wider font-mono uppercase mt-0.5">
                {event.location} • {event.date}
              </p>
            )}
          </div>
        </div>

        {/* Display mode buttons */}
        <div className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 p-1 rounded-full text-[11px] font-semibold">
          <button
            onClick={() => { setDisplayMode('loop'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${displayMode === 'loop' ? 'bg-white text-black font-black' : 'opacity-60 hover:opacity-100'}`}
            id="btn-live-mode-loop"
          >
            Presentation Loop
          </button>
          <button
            onClick={() => { setDisplayMode('slideshow'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${displayMode === 'slideshow' ? 'bg-white text-black font-black' : 'opacity-60 hover:opacity-100'}`}
            id="btn-live-mode-slideshow"
          >
            Slideshow
          </button>
          <button
            onClick={() => setDisplayMode('gallery')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${displayMode === 'gallery' ? 'bg-white text-black font-black' : 'opacity-60 hover:opacity-100'}`}
            id="btn-live-mode-gallery"
          >
            Grid Wall
          </button>
          <button
            onClick={() => { setDisplayMode('wishwall'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${displayMode === 'wishwall' ? 'bg-white text-black font-black' : 'opacity-60 hover:opacity-100'}`}
            id="btn-live-mode-wishwall"
          >
            Wish Wall
          </button>
        </div>

        {/* Background Music Live Status Monitor */}
        {enableBgm && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center space-x-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] text-white/90 backdrop-blur-md select-none font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
            <span className="font-extrabold tracking-wider uppercase max-w-[130px] truncate">
              🎵 {bgmFileName}
            </span>
            <span className="opacity-40">|</span>
            <span className="font-black text-white/70">
              VOL: {Math.round(bgmVolume * (mixerBgmVolume / 100))}%
            </span>
            {isVoicePlaying && enableDucking && (
              <span className="bg-rose-500/80 text-white font-extrabold px-1.5 py-0.5 rounded-md text-[8px] tracking-widest animate-pulse scale-90">
                VOICEMAIL ACTIVE (DUCKED TO {duckLevel}%)
              </span>
            )}
          </div>
        )}

        {/* Exit screen button */}
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/15 text-white/80 hover:text-white p-2.5 rounded-full transition-all border border-white/5 shadow-sm cursor-pointer"
          title="Exit Projector Mode"
          id="btn-close-live-screen"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Live Toast Alert for New Guest Moments */}
      <AnimatePresence>
        {newMomentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl flex items-center space-x-3 pointer-events-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div className="text-left font-sans">
              <p className="text-xs font-black tracking-wide text-white">
                ✨ New {newMomentNotification.type === 'photo' ? 'Photo' : newMomentNotification.type === 'video' ? 'Video' : newMomentNotification.type === 'voice' ? 'Voice Note' : 'Wish'} Added!
              </p>
              <p className="text-[10px] text-slate-300 font-mono">
                Shared just now by {newMomentNotification.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Screen Content container */}
      <main className="flex-1 flex items-center justify-center p-8 z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* EMPTY STATE */}
          {activeContributions.length === 0 && (
            <motion.div
              key={`empty-state-${idleIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6 max-w-2xl"
            >
              {idleBehavior === 'loop' ? (
                // Beautiful interactive slide rotation
                <div 
                  className="p-10 md:p-14 rounded-[32px] border shadow-2xl space-y-6 max-w-xl mx-auto backdrop-blur-sm"
                  style={{
                    background: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                    color: activeTheme.textColor
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-3xl mx-auto shadow-inner">
                    {idleIndex === 0 ? '✨' : idleIndex === 1 ? '📸' : '💌'}
                  </div>
                  
                  {idleIndex === 0 && (
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-2xl tracking-tight">Welcome to {event.name}</h3>
                      <p className="text-sm opacity-70 leading-relaxed font-light">
                        Scan the QR code or visit <span className="font-mono font-bold bg-white/10 px-2 py-0.5 rounded">{guestShortDisplay}</span> on your phone to share table memories in real time.
                      </p>
                      {qrDataUrl && (
                        <div className="pt-2 flex justify-center">
                          <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-100">
                            <img src={qrDataUrl} alt="Scan QR Code" className="w-32 h-32 rounded-xl object-contain" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {idleIndex === 1 && (
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-2xl tracking-tight">Capture & Share Your Moments</h3>
                      <p className="text-sm opacity-70 leading-relaxed font-light">
                        Every snapshot, polaroid, video clip, voice note, and written blessing you share glides onto this live display instantly!
                      </p>
                    </div>
                  )}

                  {idleIndex === 2 && (
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-2xl tracking-tight">A Living Collective Keepsake</h3>
                      <p className="text-sm opacity-70 leading-relaxed font-light">
                        Be part of our memory capsule today. No special apps or setup required.
                      </p>
                    </div>
                  )}

                  {/* Indicator Dots */}
                  <div className="flex justify-center space-x-1.5 pt-2">
                    {[0, 1, 2].map((i) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idleIndex === i ? 'w-4 opacity-100 bg-current' : 'opacity-35 bg-current'}`} 
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // Standard stationary welcome card
                <div 
                  className="p-10 md:p-12 rounded-[32px] border shadow-2xl space-y-5 max-w-md mx-auto backdrop-blur-sm"
                  style={{
                    background: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                    color: activeTheme.textColor
                  }}
                >
                  {qrDataUrl ? (
                    <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-100 w-36 h-36 mx-auto flex items-center justify-center">
                      <img src={qrDataUrl} alt="Scan to join" className="w-32 h-32 rounded-xl object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-2xl mx-auto shadow-inner">
                      ✨
                    </div>
                  )}
                  <h3 className="font-extrabold text-xl">The Capsule is Live</h3>
                  <p className="text-xs opacity-70 leading-relaxed font-light">
                    Scan the QR code or visit <span className="font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded">{guestShortDisplay}</span> (Code: {event.code}) to start contributing.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* MODE 1 & 2 & 4: Presentation Loop / Slideshow / Wish Wall */}
          {activeContributions.length > 0 && displayMode !== 'gallery' && currentContribution && (
            <motion.div
              key={currentIndex + displayMode}
              {...getMotionProps()}
              className="max-w-4xl w-full flex flex-col items-center justify-center text-center"
            >
              
              {/* Slideshow Photo Type */}
              {currentContribution.type === 'photo' && currentContribution.url && displayMode !== 'wishwall' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
                  <div className="md:col-span-7 relative aspect-[4/3] rounded-[32px] overflow-hidden bg-black/30 border border-white/10 shadow-2xl ring-4 ring-white/5">
                    <img src={currentContribution.url} alt="Slideshow moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div 
                    className="md:col-span-5 text-left p-8 md:p-10 rounded-[32px] border shadow-2xl space-y-4"
                    style={{
                      background: activeTheme.cardBg,
                      borderColor: activeTheme.cardBorder,
                      color: activeTheme.textColor
                    }}
                  >
                    <span className="inline-flex items-center space-x-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider">
                      <Camera className="w-3.5 h-3.5 text-orange-400" />
                      <span>Shared Polaroid</span>
                    </span>
                    <blockquote className="text-xl md:text-2xl font-bold tracking-tight leading-tight italic">
                      {currentContribution.text ? `"${currentContribution.text}"` : '"Captured beautifully in the moment."'}
                    </blockquote>
                    <div className="pt-2">
                      <p className="text-sm font-black">{moderationHideNames ? "Guest" : currentContribution.contributorName}</p>
                      <p className="text-[9px] font-mono opacity-50 uppercase tracking-widest mt-1">Shared at {new Date(currentContribution.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slideshow Video Type */}
              {currentContribution.type === 'video' && currentContribution.url && displayMode !== 'wishwall' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
                  <div className="md:col-span-7 relative aspect-[4/3] rounded-[32px] overflow-hidden bg-black/40 border border-white/10 shadow-2xl ring-4 ring-white/5 flex items-center justify-center">
                    <video 
                      src={currentContribution.url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div 
                    className="md:col-span-5 text-left p-8 md:p-10 rounded-[32px] border shadow-2xl space-y-4"
                    style={{
                      background: activeTheme.cardBg,
                      borderColor: activeTheme.cardBorder,
                      color: activeTheme.textColor
                    }}
                  >
                    <span className="inline-flex items-center space-x-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider">
                      <Video className="w-3.5 h-3.5 text-rose-400" />
                      <span>Live Video Clip</span>
                    </span>
                    <blockquote className="text-xl md:text-2xl font-bold tracking-tight leading-tight italic">
                      {currentContribution.text ? `"${currentContribution.text}"` : '"Motion recorded live."'}
                    </blockquote>
                    <div className="pt-2">
                      <p className="text-sm font-black">{moderationHideNames ? "Guest" : currentContribution.contributorName}</p>
                      <p className="text-[9px] font-mono opacity-50 uppercase tracking-widest mt-1">Shared at {new Date(currentContribution.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slideshow Voice Type */}
              {currentContribution.type === 'voice' && (
                <div 
                  className="max-w-2xl p-10 md:p-14 rounded-[40px] border shadow-2xl space-y-6 text-center"
                  style={{
                    background: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                    color: activeTheme.textColor
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mx-auto shadow-md">
                    <Volume2 className="w-8 h-8 animate-pulse" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
                      Spoken Voice Voicemail ({currentContribution.audioDuration || '0:30'})
                    </p>
                    <div className="flex items-center justify-center space-x-1.5 h-8 py-1">
                      {[2, 4, 6, 8, 5, 7, 9, 6, 4, 7, 5, 8, 6, 3].map((height, i) => (
                        <span 
                          key={i} 
                          className="w-1 bg-emerald-400 rounded-full animate-bounce"
                          style={{ 
                            height: `${height * 3}px`, 
                            animationDelay: `${i * 0.1}s` 
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-1 border-t border-white/10">
                    <p className="text-xl font-black">{moderationHideNames ? "Guest" : currentContribution.contributorName}</p>
                    <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
                      Voice Recording
                    </p>
                  </div>
                </div>
              )}

              {/* Slideshow Wish / Written Wish Wall Type */}
              {((currentContribution.type === 'wish') || (displayMode === 'wishwall' && currentContribution.type !== 'voice')) && (
                <div 
                  className="max-w-3xl p-12 md:p-16 rounded-[40px] border shadow-2xl space-y-6 text-center"
                  style={{
                    background: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                    color: activeTheme.textColor
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-red-400 text-xl mx-auto shadow-md">
                    ❤
                  </div>
                  
                  <blockquote className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-relaxed max-w-4xl mx-auto italic">
                    "{currentContribution.text || 'A beautiful silent moment of love.'}"
                  </blockquote>

                  <div className="pt-4 space-y-1">
                    <p className="text-base font-black">{moderationHideNames ? "Guest" : currentContribution.contributorName}</p>
                    <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
                      Written wish book
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* MODE 3: GRID GALLERY WALL */}
          {activeContributions.length > 0 && displayMode === 'gallery' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl"
            >
              {activeContributions.map((con, idx) => (
                <div 
                  key={con.id || idx} 
                  className="border p-5 rounded-2xl flex flex-col justify-between text-left aspect-[4/5] hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden shadow-lg"
                  style={{
                    background: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                    color: activeTheme.textColor
                  }}
                >
                  {con.type === 'photo' && con.url ? (
                    <>
                      <div className="absolute inset-0 z-0">
                        <img src={con.url} alt="moment" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                      </div>
                      
                      <div className="z-10 mt-auto space-y-1 text-white">
                        <p className="text-[10px] text-white/90 line-clamp-2 italic font-light">"{con.text || 'Beautiful snapshot'}"</p>
                        <h4 className="font-bold text-xs text-white">{moderationHideNames ? "Guest" : con.contributorName}</h4>
                      </div>
                    </>
                  ) : con.type === 'video' && con.url ? (
                    <>
                      <div className="absolute inset-0 z-0">
                        <video src={con.url} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                      </div>
                      
                      <div className="z-10 mt-auto space-y-1 text-white">
                        <p className="text-[10px] text-white/90 line-clamp-2 italic font-light">"{con.text || 'Video clip'}"</p>
                        <h4 className="font-bold text-xs text-white">{moderationHideNames ? "Guest" : con.contributorName}</h4>
                      </div>
                    </>
                  ) : con.type === 'voice' ? (
                    <div className="flex flex-col justify-between h-full z-10">
                      <div className="flex items-center justify-between">
                        <span className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                          <Volume2 className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[8px] font-mono opacity-40 uppercase">Voice</span>
                      </div>
                      <div className="my-auto text-center space-y-1">
                        <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          Voice Recording
                        </p>
                        <p className="text-[9px] font-mono opacity-60">
                          {con.audioDuration || '0:30'}
                        </p>
                      </div>
                      <h4 className="font-bold text-xs pt-2 border-t border-white/5">{moderationHideNames ? "Guest" : con.contributorName}</h4>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between h-full z-10">
                      <div className="flex items-center justify-between">
                        <span className="p-1.5 bg-white/10 rounded-lg text-red-400">
                          <Heart className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[8px] font-mono opacity-40 uppercase">{con.type}</span>
                      </div>
                      <p className="text-xs leading-relaxed line-clamp-4 italic font-light">"{con.text}"</p>
                      <h4 className="font-bold text-xs pt-2 border-t border-white/5">{moderationHideNames ? "Guest" : con.contributorName}</h4>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Dynamic Floating Join Link Banner: TOP-CENTER */}
      {joinLinkVisible && joinLinkPosition === 'top-center' && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-white text-slate-900 px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-2xl flex items-center space-x-2 border border-slate-200">
          <QrCode className="w-4 h-4 text-slate-900" />
          <span>{guestShortDisplay}</span>
          {showEventCode && <span className="opacity-30">|</span>}
          {showEventCode && <span className="opacity-80">Code: {event.code}</span>}
        </div>
      )}

      {/* Dynamic Floating Join Link Banner: BOTTOM-CENTER */}
      {joinLinkVisible && joinLinkPosition === 'bottom-center' && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 bg-white text-slate-900 px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-2xl flex items-center space-x-2 border border-slate-200">
          <QrCode className="w-4 h-4 text-slate-900" />
          <span>{guestShortDisplay}</span>
          {showEventCode && <span className="opacity-30">|</span>}
          {showEventCode && <span className="opacity-80">Code: {event.code}</span>}
        </div>
      )}

      {/* Floating QR Join Poster Corner Overlay */}
      {qrCodePosition !== 'none' && qrCodePosition !== 'center' && (alwaysShowQr || activeContributions.length > 0) && (
        <div 
          className={`${getQrPositionClass(qrCodePosition)} ${getQrSizeClass(qrCodeSize)} bg-white text-slate-900 p-3.5 rounded-3xl flex items-center space-x-3.5 max-w-xs z-30 shadow-2xl transition-all duration-300 border border-slate-100/80`}
        >
          <div className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-2xl shrink-0 flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Scan to join" className="w-12 h-12 rounded-lg object-contain" />
            ) : (
              <QrCode className="w-8 h-8 text-black" />
            )}
          </div>
          {joinLinkVisible && joinLinkPosition === 'adjacent' && (
            <div className="space-y-0.5 leading-tight text-left">
              <h5 className="text-[11px] font-black text-slate-800">Scan to Share</h5>
              <p className="text-[9px] text-slate-500 font-mono">
                {showUploadInstructions ? 'Direct mobile upload' : 'No apps needed'}
              </p>
              <div className="pt-1 flex items-center flex-wrap gap-1">
                <span className="bg-slate-900 text-white font-mono font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                  {guestShortDisplay}
                </span>
                {showEventCode && (
                  <span className="text-[9px] text-slate-500 font-mono">
                    Pin: {event.code}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Center Stage Massive QR Overlap */}
      {qrCodePosition === 'center' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 p-8 rounded-[36px] shadow-2xl flex flex-col items-center justify-center space-y-4 z-35 transition-all duration-300 border border-slate-200">
          <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Scan to join" className="w-40 h-40 rounded-xl object-contain" />
            ) : (
              <QrCode className="w-24 h-24 text-black" />
            )}
          </div>
          <div className="text-center space-y-1">
            <span className="text-sm font-mono font-black uppercase bg-slate-100 px-3 py-1 rounded tracking-wider">
              {guestShortDisplay}
            </span>
            {showEventCode && (
              <p className="text-xs text-slate-500 font-mono">Event PIN: {event.code}</p>
            )}
          </div>
        </div>
      )}

      {/* Slide Navigation Controls */}
      {displayMode !== 'gallery' && activeContributions.length > 1 && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-3 z-30">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:scale-105 transition-all cursor-pointer shadow-md"
            title="Previous Moment (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-white text-slate-900 hover:scale-110 transition-all cursor-pointer shadow-lg font-black"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-slate-900" /> : <Play className="w-4 h-4 text-slate-900" />}
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:scale-105 transition-all cursor-pointer shadow-md"
            title="Next Moment (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dynamic customizable bottom footer */}
      {footerVisible && (
        <footer className="pb-4 text-center text-[10px] font-mono uppercase tracking-widest shrink-0 opacity-45 relative z-10">
          {footerText}
        </footer>
      )}
    </div>
  );
}
