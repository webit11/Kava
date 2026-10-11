import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, ArrowLeft, Check, RotateCw, 
  Crop, ZoomIn, Image, Trash2, Heart, FolderOpen, 
  Upload, AlertCircle, Sparkles, Smile, Sun, Maximize2, Layers,
  Zap, ZapOff, RefreshCw, Settings, HelpCircle, Info, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KavaEvent } from '../types';
import { useFeatureFlag } from '../lib/featureFlags';

// Preset high-res aesthetic Unsplash photos for the simulated Camera Roll
interface GalleryPhoto {
  id: string;
  url: string;
  category: 'recent' | 'favorites' | 'selfies';
  album?: string;
}

const PRESET_GALLERY: GalleryPhoto[] = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    category: 'recent',
    album: 'Wedding'
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    category: 'recent',
    album: 'Summer Party'
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    category: 'recent',
    album: 'Wedding'
  },
  {
    id: 'p4',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    category: 'selfies',
    album: 'Favorites'
  },
  {
    id: 'p5',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    category: 'recent',
    album: 'Summer Party'
  },
  {
    id: 'p6',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    category: 'selfies',
    album: 'Favorites'
  },
  {
    id: 'p7',
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    category: 'favorites',
    album: 'Aesthetic'
  },
  {
    id: 'p8',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
    category: 'favorites',
    album: 'Travel'
  }
];

export interface PhotoPickerProps {
  event: KavaEvent;
  onClose: () => void;
  onDone: (photoUrls: string[]) => void;
  maxPhotos?: number;
  maxSizeMB?: number;
  allowedFormats?: string[];
  allowMultiple?: boolean;
  guestPhotosCount?: number;
}

type TabType = 'recent' | 'favorites' | 'selfies' | 'albums';

interface EditingState {
  id: string;
  url: string;
  rotation: number;
  scale: number;
  flipH: boolean;
  cropPreset: 'free' | '1:1' | '4:3' | '16:9';
  fitFill: 'fit' | 'fill';
  brightness: number;
  showFrame: boolean;
  filterType: string;
}

const FILTERS_LIST = [
  { id: 'original', name: 'Original', style: 'none' },
  { id: 'warm', name: 'Warm', style: 'sepia(20%) saturate(120%) hue-rotate(-5deg)' },
  { id: 'soft-film', name: 'Film', style: 'contrast(85%) saturate(90%) sepia(5%)' },
  { id: 'vintage', name: 'Vintage', style: 'sepia(50%) saturate(95%) contrast(90%)' },
  { id: 'black-white', name: 'B&W', style: 'grayscale(100%) contrast(110%)' },
  { id: 'custom-lut', name: 'Pop', style: 'contrast(120%) saturate(110%)' },
];

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  event,
  onClose,
  onDone,
  maxPhotos = 10,
  maxSizeMB = 15,
  allowedFormats = ['jpg', 'png', 'heic'],
  allowMultiple = true,
  guestPhotosCount = 0,
}) => {
  const isCustomLutsActive = useFeatureFlag('custom_luts', { eventCode: event?.code });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    const stored = localStorage.getItem('kava_custom_camera_roll');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return [...parsed, ...PRESET_GALLERY];
      } catch (e) {
        return PRESET_GALLERY;
      }
    }
    return PRESET_GALLERY;
  });

  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  // Synchronize Host Event Settings
  const cameraMode = event.settings?.photoCameraMode || 'both'; // 'both' | 'camera' | 'roll'
  const isCameraAllowedByHost = cameraMode !== 'roll' && event.settings?.guestUploadAllowed !== false;
  const isGalleryAllowedByHost = cameraMode !== 'camera' && event.settings?.guestUploadAllowed !== false;

  const totalAllowed = event.settings?.photoLimit || event.settings?.maxPhotosLimit || maxPhotos || 10;
  const remainingUploads = Math.max(0, totalAllowed - guestPhotosCount);

  // Camera active by default if allowed by host
  const [isCameraActive, setIsCameraActive] = useState<boolean>(isCameraAllowedByHost);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Native camera effects & state
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [showFlashEffect, setShowFlashEffect] = useState(false);
  const [shutterFlicker, setShutterFlicker] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Editing state
  const [editingPhoto, setEditingPhoto] = useState<EditingState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Start camera on mount if allowed by host
  useEffect(() => {
    if (isCameraAllowedByHost) {
      handleStartCamera();
    } else {
      setIsCameraActive(false);
    }
    return () => {
      cleanupCamera();
    };
  }, [isCameraAllowedByHost]);

  // Bind video element srcObject whenever stream or camera state updates
  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      if (videoRef.current.srcObject !== cameraStream) {
        videoRef.current.srcObject = cameraStream;
        videoRef.current.play().catch(e => console.log('Video stream play error:', e));
      }
    }
  }, [cameraStream, isCameraActive]);

  const cleanupCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleStartCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    setPermissionDenied(false);
    setIsCameraActive(true);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setPermissionDenied(true);
      setCameraError('Camera API is not supported on this browser or connection context.');
      return;
    }

    try {
      cleanupCamera();
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log('Video play failed:', e));
      }
    } catch (err: any) {
      console.log('Camera permission or device info error:', err);
      setPermissionDenied(true);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied in your browser settings. Please allow access or select a photo from your device gallery.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was detected on your system. You can select photos from your device gallery instead.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is currently in use by another application or browser tab.');
      } else {
        setCameraError(err.message || 'Could not initialize camera feed.');
      }
    }
  };

  const toggleCameraFacing = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    cleanupCamera();
    await handleStartCamera(newMode);
  };

  const handleStopCamera = () => {
    cleanupCamera();
    setIsCameraActive(false);
  };

  const compressImage = (
    imageSource: string | HTMLImageElement | HTMLVideoElement,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.88,
    flipHorizontal = false
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const processCanvas = (imgWidth: number, imgHeight: number, drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
        let width = imgWidth;
        let height = imgHeight;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (flipHorizontal) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }

        drawFn(ctx, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      if (imageSource instanceof HTMLVideoElement) {
        const w = imageSource.videoWidth || 1280;
        const h = imageSource.videoHeight || 720;
        processCanvas(w, h, (ctx, width, height) => {
          ctx.drawImage(imageSource, 0, 0, width, height);
        });
      } else if (imageSource instanceof HTMLImageElement) {
        processCanvas(imageSource.naturalWidth || imageSource.width, imageSource.naturalHeight || imageSource.height, (ctx, width, height) => {
          ctx.drawImage(imageSource, 0, 0, width, height);
        });
      } else if (typeof imageSource === 'string') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          processCanvas(img.naturalWidth || img.width, img.naturalHeight || img.height, (ctx, width, height) => {
            ctx.drawImage(img, 0, 0, width, height);
          });
        };
        img.onerror = (err) => reject(err);
        img.src = imageSource;
      } else {
        reject(new Error('Unsupported image source type'));
      }
    });
  };

  const handleCapturePhoto = async () => {
    if (remainingUploads <= 0) {
      alert(`You have reached the maximum upload limit of ${totalAllowed} photos for this event.`);
      return;
    }

    if (!videoRef.current || !cameraStream) {
      alert("Camera feed is not active. Please tap 'Retry Camera' or choose a photo from your device library.");
      return;
    }

    // Trigger tactile visual shutter/flash feedback
    if (isFlashOn) {
      setShowFlashEffect(true);
    } else {
      setShutterFlicker(true);
    }

    setTimeout(async () => {
      setShowFlashEffect(false);
      setShutterFlicker(false);

      try {
        const video = videoRef.current;
        if (!video || !video.videoWidth || !video.videoHeight) {
          throw new Error("Video frame not ready");
        }

        const isFrontSelfie = facingMode === 'user';
        const compressedDataUrl = await compressImage(video, 1920, 1920, 0.88, isFrontSelfie);

        // Capture photo -> go straight to editor
        handleStopCamera();
        setEditingPhoto({
          id: `captured_${Date.now()}`,
          url: compressedDataUrl,
          rotation: 0,
          scale: 1,
          flipH: false,
          cropPreset: 'free',
          fitFill: 'fill',
          brightness: 100,
          showFrame: true,
          filterType: event.settings?.photoFilter || 'original'
        });
      } catch (err) {
        console.error('Camera capture error:', err);
        alert("Could not capture photo frame from camera. Please try again or select a photo from your library.");
      }
    }, 250);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (remainingUploads <= 0) {
      alert(`You have reached the maximum photo upload limit of ${totalAllowed} photos.`);
      return;
    }

    // Limit files count according to remaining uploads
    const filesToProcess = files.slice(0, remainingUploads);
    setIsLoading(true);

    try {
      const compressedUrls: string[] = [];

      for (const file of filesToProcess) {
        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > maxSizeMB) {
          alert(`File "${file.name}" is too large. Limit is ${maxSizeMB}MB.`);
          continue;
        }

        const rawDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        const compressed = await compressImage(rawDataUrl, 1920, 1920, 0.88);
        compressedUrls.push(compressed);
      }

      if (compressedUrls.length === 1) {
        // Single file chosen: send to editor preview
        handleStopCamera();
        setEditingPhoto({
          id: `custom_${Date.now()}`,
          url: compressedUrls[0],
          rotation: 0,
          scale: 1,
          flipH: false,
          cropPreset: 'free',
          fitFill: 'fill',
          brightness: 100,
          showFrame: true,
          filterType: event.settings?.photoFilter || 'original'
        });
      } else if (compressedUrls.length > 1) {
        // Multiple files chosen: submit all directly
        handleStopCamera();
        onDone(compressedUrls);
      }
    } catch (err) {
      console.warn('Native file import error:', err);
      alert('An error occurred while loading selected photos. Please try again.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image: ' + src));
      img.src = src;
    });
  };

  // Compositing final output on HTML Canvas to bake in frame, watermark, adjustments & filter
  const handleSaveEdit = async () => {
    if (!editingPhoto) return;

    setIsLoading(true);
    try {
      const img = await loadImage(editingPhoto.url);

      // Load Frame overlay if enabled by host & toggled
      let frameImg: HTMLImageElement | null = null;
      if (editingPhoto.showFrame && event?.settings?.photoEnableFrame && event?.settings?.photoFrameUrl) {
        try {
          frameImg = await loadImage(event.settings.photoFrameUrl);
        } catch (e) {
          console.warn("Could not load frame overlay", e);
        }
      }

      // Load Watermark if enabled by host
      let watermarkImg: HTMLImageElement | null = null;
      if (event?.settings?.photoEnableWatermark && event?.settings?.photoWatermarkUrl) {
        try {
          watermarkImg = await loadImage(event.settings.photoWatermarkUrl);
        } catch (e) {
          console.warn("Could not load watermark overlay", e);
        }
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not create canvas context");

      const is90or270 = editingPhoto.rotation % 180 !== 0;
      const baseWidth = is90or270 ? img.height : img.width;
      const baseHeight = is90or270 ? img.width : img.height;

      let canvasWidth = baseWidth;
      let canvasHeight = baseHeight;

      if (editingPhoto.cropPreset === '1:1') {
        const side = Math.min(baseWidth, baseHeight);
        canvasWidth = side;
        canvasHeight = side;
      } else if (editingPhoto.cropPreset === '4:3') {
        if (baseWidth / baseHeight > 4 / 3) {
          canvasWidth = baseHeight * (4 / 3);
          canvasHeight = baseHeight;
        } else {
          canvasWidth = baseWidth;
          canvasHeight = baseWidth * (3 / 4);
        }
      } else if (editingPhoto.cropPreset === '16:9') {
        if (baseWidth / baseHeight > 16 / 9) {
          canvasWidth = baseHeight * (16 / 9);
          canvasHeight = baseHeight;
        } else {
          canvasWidth = baseWidth;
          canvasHeight = baseWidth * (9 / 16);
        }
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Apply filter matching adjustments
      let filterString = `brightness(${editingPhoto.brightness}%)`;
      if (editingPhoto.filterType === 'warm') {
        filterString += ` sepia(20%) saturate(120%) hue-rotate(-5deg)`;
      } else if (editingPhoto.filterType === 'soft-film') {
        filterString += ` contrast(85%) saturate(90%) sepia(5%)`;
      } else if (editingPhoto.filterType === 'vintage') {
        filterString += ` sepia(50%) saturate(95%) contrast(90%)`;
      } else if (editingPhoto.filterType === 'black-white') {
        filterString += ` grayscale(100%) contrast(110%)`;
      } else if (editingPhoto.filterType === 'custom-lut') {
        filterString += ` contrast(120%) saturate(110%)`;
      }
      ctx.filter = filterString;

      // Draw photo with transforms
      ctx.save();
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((editingPhoto.rotation * Math.PI) / 180);
      if (editingPhoto.flipH) {
        ctx.scale(-1, 1);
      }
      ctx.scale(editingPhoto.scale, editingPhoto.scale);

      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawW = img.width;
      let drawH = img.height;

      if (editingPhoto.fitFill === 'fit') {
        if (imgRatio > canvasRatio) {
          drawW = canvasWidth;
          drawH = canvasWidth / imgRatio;
        } else {
          drawH = canvasHeight;
          drawW = canvasHeight * imgRatio;
        }
      } else {
        if (imgRatio > canvasRatio) {
          drawH = canvasHeight;
          drawW = canvasHeight * imgRatio;
        } else {
          drawW = canvasWidth;
          drawH = canvasWidth / imgRatio;
        }
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Clear filters for overlays
      ctx.filter = 'none';

      // Apply Frame on top
      if (frameImg) {
        ctx.save();
        ctx.globalAlpha = (event?.settings?.photoFrameOpacity ?? 100) / 100;
        ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);
        ctx.restore();
      }

      // Apply Watermark
      if (watermarkImg) {
        ctx.save();
        ctx.globalAlpha = (event?.settings?.photoWatermarkOpacity ?? 50) / 100;
        
        const wmSizePct = (event?.settings?.photoWatermarkSize ?? 15) / 100;
        const wmWidth = canvasWidth * wmSizePct;
        const wmHeight = wmWidth * (watermarkImg.height / watermarkImg.width);
        
        const margin = canvasWidth * 0.04;
        let wmX = canvasWidth - wmWidth - margin;
        let wmY = canvasHeight - wmHeight - margin;

        const pos = event?.settings?.photoWatermarkPosition || 'bottom-right';
        if (pos === 'bottom-left') {
          wmX = margin;
        } else if (pos === 'top-left') {
          wmX = margin;
          wmY = margin;
        } else if (pos === 'top-right') {
          wmX = canvasWidth - wmWidth - margin;
          wmY = margin;
        } else if (pos === 'center') {
          wmX = (canvasWidth - wmWidth) / 2;
          wmY = (canvasHeight - wmHeight) / 2;
        }

        ctx.drawImage(watermarkImg, wmX, wmY, wmWidth, wmHeight);
        ctx.restore();
      }

      const editedUrl = canvas.toDataURL('image/jpeg', 0.9);

      // Save custom photo to Camera Roll
      const savedPhoto: GalleryPhoto = {
        id: editingPhoto.id,
        url: editedUrl,
        category: 'recent'
      };

      const updatedGallery = [savedPhoto, ...gallery.filter(p => p.id !== editingPhoto.id)];
      setGallery(updatedGallery);
      const customOnly = updatedGallery.filter(p => p.id.startsWith('custom_') || p.id.startsWith('captured_'));
      localStorage.setItem('kava_custom_camera_roll', JSON.stringify(customOnly));

      // Done flow: direct callback
      onDone([editedUrl]);
    } catch (err) {
      console.error("Canvas composite fail", err);
      onDone([editingPhoto.url]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWatermarkPositionStyles = (position: string): React.CSSProperties => {
    const margin = '4%';
    switch (position) {
      case 'top-left':
        return { top: margin, left: margin };
      case 'top-right':
        return { top: margin, right: margin };
      case 'bottom-left':
        return { bottom: margin, left: margin };
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'bottom-right':
      default:
        return { bottom: margin, right: margin };
    }
  };

  const getAlbums = () => {
    const albums: Record<string, GalleryPhoto[]> = {};
    gallery.forEach(p => {
      const albName = p.album || 'Others';
      if (!albums[albName]) albums[albName] = [];
      albums[albName].push(p);
    });
    return albums;
  };

  const getFilteredPhotos = () => {
    if (activeTab === 'albums') {
      if (selectedAlbum) {
        return gallery.filter(p => (p.album || 'Others') === selectedAlbum);
      }
      return [];
    }
    if (activeTab === 'favorites') return gallery.filter(p => p.category === 'favorites');
    if (activeTab === 'selfies') return gallery.filter(p => p.category === 'selfies');
    return gallery;
  };

  const filteredPhotos = getFilteredPhotos();
  const albums = getAlbums();

  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-[9999] flex flex-col font-sans select-none overflow-hidden" id="native-photo-picker-container">
      
      {/* Settings Modal popover for Camera Instructions */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[10200] flex items-center justify-center p-4 text-slate-900"
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">How to Enable Camera</h3>
                </div>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p>Tap the lock icon <Lock className="w-3 h-3 inline text-slate-700" /> or site permissions icon in your browser address bar.</p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p>Locate <strong>Camera</strong> permissions and switch it to <strong>Allow</strong>.</p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p>Return here and tap <strong>Retry Camera</strong> below.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsModal(false);
                    handleStartCamera();
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-2xl transition-all cursor-pointer shadow-sm text-center"
                >
                  Retry Camera
                </button>
                {isGalleryAllowedByHost && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettingsModal(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-2xl transition-all cursor-pointer text-center"
                  >
                    Choose from Camera Roll
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 1. VIEWFINDER / CAMERA MODE ==================== */}
      {isCameraActive && !editingPhoto && (
        <div className="flex-1 flex flex-col justify-between bg-black text-white relative h-full">
          
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 px-5 py-4 flex items-center justify-between shrink-0 z-30 safe-top bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            {/* Minimal Back Button */}
            <button 
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all text-white active:scale-95 cursor-pointer shadow-lg"
              id="btn-picker-close"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Event Name & Remaining Counter Header */}
            <div className="text-center px-4 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md select-none max-w-[65%]">
              <span className="text-xs font-black tracking-tight text-white block truncate">
                {event.name || 'Event Photos'}
              </span>
              <span className="text-[9px] font-mono font-extrabold text-emerald-400 uppercase tracking-widest block">
                {remainingUploads} OF {totalAllowed} REMAINING
              </span>
            </div>

            {/* Flash Toggle Button */}
            <button
              onClick={() => setIsFlashOn(!isFlashOn)}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 active:scale-95 transition-all text-white cursor-pointer shadow-lg"
              title="Toggle Flash"
            >
              {isFlashOn ? (
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              ) : (
                <ZapOff className="w-5 h-5 text-white/60" />
              )}
            </button>
          </div>

          {/* Full Screen Viewfinder Container */}
          <div className="flex-1 relative bg-neutral-950 flex items-center justify-center overflow-hidden">
            
            {/* Real Video Stream vs Camera Standby */}
            {(!permissionDenied && cameraStream) ? (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{
                    filter: `brightness(100%) ${
                      (event.settings?.photoFilter === 'warm') ? 'sepia(20%) saturate(120%) hue-rotate(-5deg)' :
                      (event.settings?.photoFilter === 'soft-film') ? 'contrast(85%) saturate(90%) sepia(5%)' :
                      (event.settings?.photoFilter === 'vintage') ? 'sepia(50%) saturate(95%) contrast(90%)' :
                      (event.settings?.photoFilter === 'black-white') ? 'grayscale(100%) contrast(110%)' :
                      (event.settings?.photoFilter === 'custom-lut') ? 'contrast(120%) saturate(110%)' : 'none'
                    }`,
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-neutral-950 flex flex-col items-center justify-center overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-30 scale-110 select-none pointer-events-none"
                  style={{ 
                    backgroundImage: `url(${gallery[0]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'})` 
                  }}
                />
                
                <div className="relative flex flex-col items-center justify-center z-10 space-y-3 p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shadow-2xl relative">
                    <Camera className="w-8 h-8 text-white/50" />
                  </div>
                  <p className="text-xs font-mono tracking-widest text-white/60 uppercase">
                    {permissionDenied ? 'Camera Access Needed' : 'Starting Camera...'}
                  </p>
                </div>
              </div>
            )}

            {/* Event Host Layout Frame Overlay (always active on viewfinder) */}
            {event?.settings?.photoEnableFrame && event?.settings?.photoFrameUrl && (
              <img 
                src={event.settings.photoFrameUrl} 
                alt="Frame" 
                className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10 select-none"
                style={{ opacity: (event.settings.photoFrameOpacity ?? 100) / 100 }}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Event Host Watermark Overlay (always active on viewfinder) */}
            {event?.settings?.photoEnableWatermark && event?.settings?.photoWatermarkUrl && (
              <img 
                src={event.settings.photoWatermarkUrl} 
                alt="Watermark" 
                className="absolute pointer-events-none z-10 select-none"
                style={{
                  opacity: (event.settings.photoWatermarkOpacity ?? 50) / 100,
                  width: `${event.settings.photoWatermarkSize ?? 15}%`,
                  ...getWatermarkPositionStyles(event.settings.photoWatermarkPosition || 'bottom-right'),
                }}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Tactile Camera Shutter Dim Flicker Effect */}
            <AnimatePresence>
              {shutterFlicker && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black z-30 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Shutter White Flashbang Effect */}
            <AnimatePresence>
              {showFlashEffect && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-40 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Lightweight Bottom Sheet when Camera Permission is Denied */}
            {permissionDenied && (
              <div 
                className="absolute bottom-4 left-4 right-4 z-40 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl space-y-3 text-left animate-in fade-in slide-in-from-bottom-5 duration-300"
                id="camera-permission-bottom-sheet"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Camera Access Denied</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                      Please allow camera access in your browser settings to take live snaps for <span className="font-semibold text-white">{event.name}</span>, or select from your camera roll.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs py-3 rounded-2xl cursor-pointer transition-all active:scale-98 flex items-center justify-center space-x-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-300" />
                    <span>Camera Settings</span>
                  </button>

                  {isGalleryAllowedByHost && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white hover:bg-neutral-100 text-black font-extrabold text-xs py-3 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-md flex items-center justify-center space-x-1.5"
                    >
                      <Image className="w-3.5 h-3.5 text-slate-950" />
                      <span>Camera Roll</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Bottom Control Action Bar */}
          <div className="bg-black/90 backdrop-blur-xl py-6 px-8 flex items-center justify-between shrink-0 border-t border-white/10 safe-bottom relative z-20">
            {/* Left: Gallery Thumbnail or Native File Trigger */}
            <div className="w-14 flex justify-start">
              {isGalleryAllowedByHost ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/30 hover:border-white relative group active:scale-95 transition-all bg-neutral-900 shadow-md shrink-0 cursor-pointer flex items-center justify-center"
                  title="Choose from Camera Roll"
                >
                  {gallery.length > 0 ? (
                    <img src={gallery[0].url} alt="Latest roll" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Image className="w-5 h-5 text-white/80" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </button>
              ) : (
                <div className="w-12 h-12" /> // spacer
              )}
            </div>

            {/* Center: Large Shutter Button (Hidden if camera not allowed by host) */}
            <div className="flex items-center justify-center">
              {isCameraAllowedByHost && !permissionDenied ? (
                <button
                  onClick={handleCapturePhoto}
                  disabled={remainingUploads <= 0}
                  className="w-20 h-20 rounded-full border-[5px] border-white flex items-center justify-center bg-transparent active:scale-90 transition-all cursor-pointer shadow-2xl group shrink-0 relative disabled:opacity-40"
                  title="Capture Photo"
                >
                  <div className="w-14 h-14 rounded-full bg-white group-hover:scale-95 transition-transform duration-200" />
                </button>
              ) : isGalleryAllowedByHost ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-xl flex items-center space-x-2"
                >
                  <Image className="w-4 h-4 text-slate-950" />
                  <span>Choose from Photos</span>
                </button>
              ) : null}
            </div>

            {/* Right: Camera Switch Toggle Button (Hidden if camera disabled) */}
            <div className="w-14 flex justify-end">
              {isCameraAllowedByHost && !permissionDenied ? (
                <button
                  onClick={toggleCameraFacing}
                  className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 flex items-center justify-center active:scale-95 transition-all text-white shadow-md shrink-0 cursor-pointer"
                  title="Switch Camera Facing"
                >
                  <RefreshCw className="w-5 h-5 text-white/90" />
                </button>
              ) : (
                <div className="w-12 h-12" /> // spacer
              )}
            </div>
          </div>

        </div>
      )}

      {/* ==================== 2. GALLERY ROLL / RECENT LIST MODE ==================== */}
      {!isCameraActive && !editingPhoto && (
        <div className="flex-1 flex flex-col justify-between bg-white text-slate-900 relative">
          
          {/* Header */}
          <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0 safe-top">
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-sm font-extrabold text-slate-950 block">Recent Photos</span>
              <span className="text-[10px] text-slate-400 font-medium">Select a snapshot to fine-tune</span>
            </div>
            <button
              onClick={() => {
                setIsCameraActive(true);
                handleStartCamera();
              }}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-900 text-white rounded-full font-bold text-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
          </div>

          {/* Grid list or Albums */}
          <div className="flex-1 overflow-y-auto pb-10">
            {activeTab === 'albums' && !selectedAlbum ? (
              <div className="p-4 grid grid-cols-2 gap-4">
                {Object.entries(albums).map(([albumName, photos]) => (
                  <div 
                    key={albumName}
                    onClick={() => setSelectedAlbum(albumName)}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-3 hover:border-slate-300 transition-all cursor-pointer text-left space-y-2 group"
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-slate-200">
                      <img 
                        src={photos[0]?.url} 
                        alt={albumName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded-md font-mono text-[9px] text-white font-bold">
                        {photos.length}
                      </div>
                    </div>
                    <div>
                      <h6 className="text-xs font-extrabold text-slate-900 truncate">{albumName}</h6>
                      <p className="text-[9px] text-slate-400 font-medium">Capsule Album</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2">
                {activeTab === 'albums' && selectedAlbum && (
                  <div className="px-2 py-1.5 flex items-center justify-between mb-2">
                    <button 
                      onClick={() => setSelectedAlbum(null)}
                      className="flex items-center space-x-1 text-slate-500 hover:text-slate-900 text-xs font-bold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>All Albums</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{filteredPhotos.length} items</span>
                  </div>
                )}

                {filteredPhotos.length === 0 ? (
                  <div className="text-center py-24 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
                      <Image className="w-6 h-6 stroke-1" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">No snapshots in this view</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1">
                    {filteredPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => {
                          setEditingPhoto({
                            id: photo.id,
                            url: photo.url,
                            rotation: 0,
                            scale: 1,
                            flipH: false,
                            cropPreset: 'free',
                            fitFill: 'fill',
                            brightness: 100,
                            showFrame: true,
                            filterType: event.settings?.photoFilter || 'original'
                          });
                        }}
                        className="aspect-square relative group overflow-hidden cursor-pointer bg-slate-50 rounded-lg hover:scale-98 transition-transform"
                      >
                        <img src={photo.url} alt="Snap" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation tabs bottom */}
          <div className="bg-slate-50 border-t border-slate-100 py-3.5 px-6 grid grid-cols-4 text-center shrink-0 safe-bottom">
            {[
              { id: 'recent', label: 'Recents', icon: Image },
              { id: 'favorites', label: 'Favorites', icon: Heart },
              { id: 'selfies', label: 'Selfies', icon: Smile },
              { id: 'albums', label: 'Albums', icon: FolderOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setSelectedAlbum(null);
                  }}
                  className={`flex flex-col items-center justify-center space-y-1 cursor-pointer transition-colors ${
                    isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-bold tracking-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== 3. LIGHTWEIGHT PHOTO EDITOR MODE ==================== */}
      <AnimatePresence>
        {editingPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[10100] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0 safe-top">
              <button
                onClick={() => {
                  setEditingPhoto(null);
                  setIsCameraActive(true);
                  handleStartCamera();
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 py-1 px-3 rounded-full hover:bg-slate-50"
              >
                Discard
              </button>
              <span className="text-sm font-black text-slate-950 uppercase tracking-wider">Quick Edit</span>
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs px-4 py-1.5 rounded-full transition-all active:scale-95 shadow-sm"
              >
                {isLoading ? 'Composing...' : 'Continue'}
              </button>
            </div>

            {/* Editing canvas view */}
            <div className="flex-1 relative bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
              <div 
                className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xl flex items-center justify-center"
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  aspectRatio: editingPhoto.cropPreset === '1:1' ? '1/1' : editingPhoto.cropPreset === '4:3' ? '4/3' : editingPhoto.cropPreset === '16:9' ? '16/9' : 'auto',
                }}
              >
                {/* Image under modification */}
                <img 
                  src={editingPhoto.url} 
                  alt="Edit view" 
                  className={`transition-all duration-150 ${editingPhoto.fitFill === 'fill' ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'}`}
                  style={{
                    transform: `rotate(${editingPhoto.rotation}deg) scale(${editingPhoto.scale}) scaleX(${editingPhoto.flipH ? -1 : 1})`,
                    filter: `brightness(${editingPhoto.brightness}%) ${
                      editingPhoto.filterType === 'warm' ? 'sepia(20%) saturate(120%) hue-rotate(-5deg)' :
                      editingPhoto.filterType === 'soft-film' ? 'contrast(85%) saturate(90%) sepia(5%)' :
                      editingPhoto.filterType === 'vintage' ? 'sepia(50%) saturate(95%) contrast(90%)' :
                      editingPhoto.filterType === 'black-white' ? 'grayscale(100%) contrast(110%)' :
                      editingPhoto.filterType === 'custom-lut' ? 'contrast(120%) saturate(110%)' : 'none'
                    }`,
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Live frame overlay */}
                {editingPhoto.showFrame && event?.settings?.photoEnableFrame && event?.settings?.photoFrameUrl && (
                  <img 
                    src={event.settings.photoFrameUrl} 
                    alt="Layout Frame" 
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                    style={{ opacity: (event.settings.photoFrameOpacity ?? 100) / 100 }}
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Live watermark overlay */}
                {event?.settings?.photoEnableWatermark && event?.settings?.photoWatermarkUrl && (
                  <img 
                    src={event.settings.photoWatermarkUrl} 
                    alt="Watermark" 
                    className="absolute pointer-events-none"
                    style={{
                      opacity: (event.settings.photoWatermarkOpacity ?? 50) / 100,
                      width: `${event.settings.photoWatermarkSize ?? 15}%`,
                      ...getWatermarkPositionStyles(event.settings.photoWatermarkPosition || 'bottom-right'),
                    }}
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>

            {/* Controls bottom bar */}
            <div className="bg-white border-t border-slate-100 p-6 shrink-0 safe-bottom">
              
              {/* Dual tools tab: Crop Ratio on left, Rotate on right */}
              <div className="flex items-center justify-between gap-6">
                {/* Crop buttons presets */}
                <div className="flex flex-col items-start gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Crop Aspect Ratio</span>
                  <div className="flex space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    {(['free', '1:1', '4:3', '16:9'] as const).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setEditingPhoto({ ...editingPhoto, cropPreset: preset })}
                        className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all ${
                          editingPhoto.cropPreset === preset 
                            ? 'bg-slate-900 text-white shadow-xs' 
                            : 'bg-transparent text-slate-500 hover:text-slate-950 hover:bg-slate-100/50'
                        }`}
                      >
                        {preset.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transform functions - Rotate */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Orientation</span>
                  <button
                    onClick={() => setEditingPhoto({ ...editingPhoto, rotation: (editingPhoto.rotation + 90) % 360 })}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all text-slate-900 font-extrabold text-xs active:scale-95 cursor-pointer shadow-xs"
                    title="Rotate 90 Degrees"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-slate-900" />
                    <span>Rotate 90°</span>
                  </button>
                </div>
              </div>

              {/* Feature Flag LUT Filter Bar */}
              {isCustomLutsActive && (
                <div className="flex flex-col gap-1.5 pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-900 uppercase tracking-widest font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Creative LUT Color Grade Filters (Feature Active)</span>
                  </span>
                  <div className="flex space-x-1.5 overflow-x-auto pb-1">
                    {FILTERS_LIST.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setEditingPhoto({ ...editingPhoto, filterType: f.id })}
                        className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all flex-shrink-0 cursor-pointer ${
                          editingPhoto.filterType === f.id
                            ? 'bg-slate-950 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        className="hidden" 
        accept="image/*"
        multiple={allowMultiple && remainingUploads > 1}
      />

    </div>
  );
};
