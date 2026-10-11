import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Trash2, 
  Play, 
  Pause, 
  Volume2, 
  Music, 
  Sliders, 
  HelpCircle, 
  FileText,
  Video,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Info,
  ChevronDown
} from 'lucide-react';

// IndexedDB Helper functions (proxied to the ones we defined or run standalone for reliability)
const initLocalMediaDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KavaMediaDatabase', 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveLocalFileToDB = async (key: string, file: File): Promise<string> => {
  try {
    const db = await initLocalMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('media', 'readwrite');
      const store = tx.objectStore('media');
      const request = store.put(file, key);
      request.onsuccess = () => {
        resolve(URL.createObjectURL(file));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error saving to DB:', err);
    return URL.createObjectURL(file);
  }
};

const deleteLocalFileFromDB = async (key: string): Promise<void> => {
  try {
    const db = await initLocalMediaDB();
    return new Promise((resolve) => {
      const tx = db.transaction('media', 'readwrite');
      const store = tx.objectStore('media');
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (err) {
    console.error('Error deleting from DB:', err);
  }
};

interface VideoExperienceUploadsProps {
  selectedEventId: string;
  
  // Welcome Video
  settingsVideoIntroUrl: string;
  setSettingsVideoIntroUrl: (url: string) => void;
  settingsVideoIntroSourceType: 'upload' | 'url';
  setSettingsVideoIntroSourceType: (type: 'upload' | 'url') => void;
  settingsVideoIntroFileName: string;
  setSettingsVideoIntroFileName: (name: string) => void;
  settingsVideoIntroFileSize: string;
  setSettingsVideoIntroFileSize: (size: string) => void;
  settingsVideoIntroDuration: string;
  setSettingsVideoIntroDuration: (duration: string) => void;
  settingsVideoIntroMaxSize: number;
  setSettingsVideoIntroMaxSize: (size: number) => void;
  settingsVideoIntroAnimation: string;
  setSettingsVideoIntroAnimation: (animation: string) => void;
  settingsVideoAllowSkipIntro: boolean;
  setSettingsVideoAllowSkipIntro: (allow: boolean) => void;
  settingsVideoAutoStart: boolean;
  setSettingsVideoAutoStart: (auto: boolean) => void;

  // Background Music
  settingsVideoIntroBgmUrl: string;
  setSettingsVideoIntroBgmUrl: (url: string) => void;
  settingsVideoBgmSourceType: 'upload' | 'url';
  setSettingsVideoBgmSourceType: (type: 'upload' | 'url') => void;
  settingsVideoBgmFileName: string;
  setSettingsVideoBgmFileName: (name: string) => void;
  settingsVideoBgmVolume: number;
  setSettingsVideoBgmVolume: (vol: number) => void;
  settingsVideoLoopMusic: boolean;
  setSettingsVideoLoopMusic: (loop: boolean) => void;
  settingsVideoBgmFadeIn: number;
  setSettingsVideoBgmFadeIn: (sec: number) => void;
  settingsVideoBgmFadeOut: number;
  setSettingsVideoBgmFadeOut: (sec: number) => void;
  settingsVideoAutoDucking: boolean;
  setSettingsVideoAutoDucking: (duck: boolean) => void;

  // Video Frame Overlay
  settingsVideoFrameUrl: string;
  setSettingsVideoFrameUrl: (url: string) => void;
  settingsVideoFrameSourceType: 'upload' | 'url';
  setSettingsVideoFrameSourceType: (type: 'upload' | 'url') => void;
  settingsVideoFrameFileName: string;
  setSettingsVideoFrameFileName: (name: string) => void;
  settingsVideoFrameOpacity: number;
  setSettingsVideoFrameOpacity: (opacity: number) => void;
  settingsVideoFrameSafeGuide: boolean;
  setSettingsVideoFrameSafeGuide: (guide: boolean) => void;

  // Brand Logo / Watermark
  settingsVideoOverlayLogoUrl: string;
  setSettingsVideoOverlayLogoUrl: (url: string) => void;
  settingsVideoWatermarkSourceType: 'upload' | 'url';
  setSettingsVideoWatermarkSourceType: (type: 'upload' | 'url') => void;
  settingsVideoWatermarkFileName: string;
  setSettingsVideoWatermarkFileName: (name: string) => void;
  settingsVideoWatermarkPosition: string;
  setSettingsVideoWatermarkPosition: (pos: string) => void;
  settingsVideoWatermarkSize: string;
  setSettingsVideoWatermarkSize: (size: string) => void;
  settingsVideoWatermarkOpacity: number;
  setSettingsVideoWatermarkOpacity: (opacity: number) => void;
  settingsVideoUseDefaultWatermark: boolean;
  setSettingsVideoUseDefaultWatermark: (useDefault: boolean) => void;
}

export const VideoExperienceUploads: React.FC<VideoExperienceUploadsProps> = ({
  selectedEventId,

  settingsVideoIntroUrl,
  setSettingsVideoIntroUrl,
  settingsVideoIntroSourceType,
  setSettingsVideoIntroSourceType,
  settingsVideoIntroFileName,
  setSettingsVideoIntroFileName,
  settingsVideoIntroFileSize,
  setSettingsVideoIntroFileSize,
  settingsVideoIntroDuration,
  setSettingsVideoIntroDuration,
  settingsVideoIntroMaxSize,
  setSettingsVideoIntroMaxSize,
  settingsVideoIntroAnimation,
  setSettingsVideoIntroAnimation,
  settingsVideoAllowSkipIntro,
  setSettingsVideoAllowSkipIntro,
  settingsVideoAutoStart,
  setSettingsVideoAutoStart,

  settingsVideoIntroBgmUrl,
  setSettingsVideoIntroBgmUrl,
  settingsVideoBgmSourceType,
  setSettingsVideoBgmSourceType,
  settingsVideoBgmFileName,
  setSettingsVideoBgmFileName,
  settingsVideoBgmVolume,
  setSettingsVideoBgmVolume,
  settingsVideoLoopMusic,
  setSettingsVideoLoopMusic,
  settingsVideoBgmFadeIn,
  setSettingsVideoBgmFadeIn,
  settingsVideoBgmFadeOut,
  setSettingsVideoBgmFadeOut,
  settingsVideoAutoDucking,
  setSettingsVideoAutoDucking,

  settingsVideoFrameUrl,
  setSettingsVideoFrameUrl,
  settingsVideoFrameSourceType,
  setSettingsVideoFrameSourceType,
  settingsVideoFrameFileName,
  setSettingsVideoFrameFileName,
  settingsVideoFrameOpacity,
  setSettingsVideoFrameOpacity,
  settingsVideoFrameSafeGuide,
  setSettingsVideoFrameSafeGuide,

  settingsVideoOverlayLogoUrl,
  setSettingsVideoOverlayLogoUrl,
  settingsVideoWatermarkSourceType,
  setSettingsVideoWatermarkSourceType,
  settingsVideoWatermarkFileName,
  setSettingsVideoWatermarkFileName,
  settingsVideoWatermarkPosition,
  setSettingsVideoWatermarkPosition,
  settingsVideoWatermarkSize,
  setSettingsVideoWatermarkSize,
  settingsVideoWatermarkOpacity,
  setSettingsVideoWatermarkOpacity,
  settingsVideoUseDefaultWatermark,
  setSettingsVideoUseDefaultWatermark
}) => {
  // Ref pointers for hidden file inputs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);
  const frameInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  // Error States
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [bgmError, setBgmError] = useState<string | null>(null);
  const [frameError, setFrameError] = useState<string | null>(null);
  const [watermarkError, setWatermarkError] = useState<string | null>(null);

  // Drag over states
  const [isDragOverVideo, setIsDragOverVideo] = useState(false);
  const [isDragOverBgm, setIsDragOverBgm] = useState(false);
  const [isDragOverFrame, setIsDragOverFrame] = useState(false);
  const [isDragOverWatermark, setIsDragOverWatermark] = useState(false);

  // Helpers to format bytes to human readable sizes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helpers to format seconds into minutes/seconds
  const formatSeconds = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // HANDLER: Welcome Video Upload
  const processVideoFile = async (file: File) => {
    setVideoError(null);
    
    // Check file format
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['mp4', 'mov', 'webm'].includes(extension)) {
      setVideoError('Unsupported format. Please upload an MP4, MOV, or WebM video file.');
      return;
    }

    // Check size limit (MB)
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > settingsVideoIntroMaxSize) {
      setVideoError(`File size exceeds current limit of ${settingsVideoIntroMaxSize} MB. You can adjust the maximum limit using the slider below.`);
      return;
    }

    // Process file metadata (duration)
    try {
      const url = URL.createObjectURL(file);
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.src = url;
      videoEl.onloadedmetadata = async () => {
        setSettingsVideoIntroDuration(formatSeconds(videoEl.duration));
        setSettingsVideoIntroFileName(file.name);
        setSettingsVideoIntroFileSize(formatBytes(file.size));
        URL.revokeObjectURL(url);

        // Save persistently to DB
        const savedUrl = await saveLocalFileToDB(`${selectedEventId}_videoIntro`, file);
        setSettingsVideoIntroUrl(savedUrl);
      };
      videoEl.onerror = () => {
        setVideoError('Failed to parse video metadata. The file may be corrupted.');
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error(err);
      setVideoError('An unexpected error occurred while processing the video.');
    }
  };

  // HANDLER: Background Music Upload
  const processBgmFile = async (file: File) => {
    setBgmError(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['mp3', 'aac', 'wav', 'm4a'].includes(extension)) {
      setBgmError('Unsupported format. Please upload an MP3, AAC, WAV, or M4A audio file.');
      return;
    }

    // Max 15MB for audio BGM
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 15) {
      setBgmError('Audio track exceeds maximum limit of 15 MB.');
      return;
    }

    try {
      setSettingsVideoBgmFileName(file.name);
      const savedUrl = await saveLocalFileToDB(`${selectedEventId}_videoBgm`, file);
      setSettingsVideoIntroBgmUrl(savedUrl);
    } catch (err) {
      console.error(err);
      setBgmError('Failed to save background music.');
    }
  };

  // HANDLER: Video Frame Overlay
  const processFrameFile = async (file: File) => {
    setFrameError(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'png') {
      setFrameError('Unsupported format. Only transparent PNG files are supported for overlay frames.');
      return;
    }

    // Max 10MB for overlays
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 10) {
      setFrameError('Overlay file size exceeds limit of 10 MB.');
      return;
    }

    try {
      setSettingsVideoFrameFileName(file.name);
      const savedUrl = await saveLocalFileToDB(`${selectedEventId}_videoFrame`, file);
      setSettingsVideoFrameUrl(savedUrl);
    } catch (err) {
      console.error(err);
      setFrameError('Failed to save overlay frame.');
    }
  };

  // HANDLER: Custom Brand Watermark
  const processWatermarkFile = async (file: File) => {
    setWatermarkError(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['png', 'svg'].includes(extension)) {
      setWatermarkError('Unsupported format. Please upload a PNG or SVG transparent file.');
      return;
    }

    // Max 5MB for watermark logo
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 5) {
      setWatermarkError('Logo file size exceeds limit of 5 MB.');
      return;
    }

    try {
      setSettingsVideoWatermarkFileName(file.name);
      setSettingsVideoUseDefaultWatermark(false); // Disable default when custom is uploaded
      const savedUrl = await saveLocalFileToDB(`${selectedEventId}_videoWatermark`, file);
      setSettingsVideoOverlayLogoUrl(savedUrl);
    } catch (err) {
      console.error(err);
      setWatermarkError('Failed to save watermark brand logo.');
    }
  };

  // Clean-up and delete helpers
  const handleRemoveVideo = async () => {
    setSettingsVideoIntroUrl('');
    setSettingsVideoIntroFileName('');
    setSettingsVideoIntroFileSize('');
    setSettingsVideoIntroDuration('');
    await deleteLocalFileFromDB(`${selectedEventId}_videoIntro`);
  };

  const handleRemoveBgm = async () => {
    setSettingsVideoIntroBgmUrl('');
    setSettingsVideoBgmFileName('');
    await deleteLocalFileFromDB(`${selectedEventId}_videoBgm`);
  };

  const handleRemoveFrame = async () => {
    setSettingsVideoFrameUrl('');
    setSettingsVideoFrameFileName('');
    await deleteLocalFileFromDB(`${selectedEventId}_videoFrame`);
  };

  const handleRemoveWatermark = async () => {
    setSettingsVideoOverlayLogoUrl('');
    setSettingsVideoWatermarkFileName('');
    setSettingsVideoUseDefaultWatermark(true); // Return to default
    await deleteLocalFileFromDB(`${selectedEventId}_videoWatermark`);
  };

  return (
    <div className="space-y-6">
      
      {/* ---------------- WELCOME VIDEO GREETING CARD ---------------- */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
              <Video className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Upload Welcome Video</h3>
          </div>
          
          <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <button
              type="button"
              onClick={() => setSettingsVideoIntroSourceType('upload')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                settingsVideoIntroSourceType === 'upload' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Upload Local File
            </button>
            <button
              type="button"
              onClick={() => setSettingsVideoIntroSourceType('url')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                settingsVideoIntroSourceType === 'url' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Use External URL
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
          Greet your guests with a warm video message. This video will play before recording their video book greeting contribution.
        </p>

        {settingsVideoIntroSourceType === 'upload' ? (
          <div className="space-y-4">
            {settingsVideoIntroUrl ? (
              <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-3">
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <Video className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 max-w-[200px] truncate" title={settingsVideoIntroFileName || "welcome-video.mp4"}>
                        {settingsVideoIntroFileName || "welcome-video.mp4"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        {settingsVideoIntroFileSize ? `Size: ${settingsVideoIntroFileSize}` : 'Size Unknown'}
                        {settingsVideoIntroDuration ? ` • Duration: ${settingsVideoIntroDuration}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors"
                    >
                      Replace File
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Video Player */}
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black max-w-sm mx-auto shadow-inner">
                  <video 
                    src={settingsVideoIntroUrl} 
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOverVideo(true); }}
                onDragLeave={() => setIsDragOverVideo(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverVideo(false);
                  if (e.dataTransfer.files?.[0]) processVideoFile(e.dataTransfer.files[0]);
                }}
                onClick={() => videoInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragOverVideo 
                    ? 'border-slate-800 bg-slate-50' 
                    : 'border-slate-200 hover:border-slate-400 bg-slate-50/20'
                }`}
              >
                <input 
                  type="file" 
                  ref={videoInputRef} 
                  onChange={(e) => e.target.files?.[0] && processVideoFile(e.target.files[0])}
                  accept=".mp4,.mov,.webm" 
                  className="hidden" 
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-white rounded-full shadow-sm text-slate-400">
                    <Upload className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Drag & drop your welcome video or <span className="text-slate-900 underline">browse</span></p>
                    <p className="text-[10px] text-slate-400 font-normal">Supported: MP4, MOV, WebM (Max. {settingsVideoIntroMaxSize}MB)</p>
                  </div>
                </div>
              </div>
            )}

            {videoError && (
              <p className="text-[10px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100 flex items-center space-x-1.5 animate-fade-in">
                <span>⚠️ {videoError}</span>
              </p>
            )}

            {/* Slider to configure Max Welcome Video Size */}
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600 font-bold">Max Allowed Video Upload Size</span>
                <span className="font-mono font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">{settingsVideoIntroMaxSize} MB</span>
              </div>
              <input 
                type="range"
                min="10"
                max="250"
                step="5"
                value={settingsVideoIntroMaxSize}
                onChange={(e) => setSettingsVideoIntroMaxSize(parseInt(e.target.value))}
                className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
              />
              <p className="text-[9px] text-slate-400 font-normal">Increase limit if you expect high-resolution, longer HD greetings from hosts.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 bg-slate-50/40 p-3 rounded-xl border border-slate-100">
            <label className="text-[10px] text-slate-500 font-bold">Greeting Video MP4 URL</label>
            <input 
              type="text"
              value={settingsVideoIntroUrl}
              onChange={(e) => setSettingsVideoIntroUrl(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
              placeholder="https://example.com/welcome-speech.mp4"
            />
          </div>
        )}

        {/* Video options (Skip / Autostart / transition) */}
        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-bold">Allow Skip Greeting</span>
              <button
                type="button"
                onClick={() => setSettingsVideoAllowSkipIntro(!settingsVideoAllowSkipIntro)}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ${settingsVideoAllowSkipIntro ? 'bg-slate-900' : 'bg-slate-200'}`}
              >
                <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${settingsVideoAllowSkipIntro ? 'translate-x-3' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-bold">Auto-start Greeting</span>
              <button
                type="button"
                onClick={() => setSettingsVideoAutoStart(!settingsVideoAutoStart)}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ${settingsVideoAutoStart ? 'bg-slate-900' : 'bg-slate-200'}`}
              >
                <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${settingsVideoAutoStart ? 'translate-x-3' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-600 font-bold">Intro Video Animation</label>
            <select
              value={settingsVideoIntroAnimation}
              onChange={(e) => setSettingsVideoIntroAnimation(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none font-medium text-slate-700"
            >
              <option value="fade">Elegant Fade-in</option>
              <option value="zoom">Elastic Zoom-in</option>
              <option value="slide">Dynamic Slide-up</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------------- ADVANCED VIDEO CONFIGURATION ACCORDION ---------------- */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30 shadow-sm">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 transition-colors text-left"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Sliders className="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Advanced Asset & Branding Configuration</h4>
              <p className="text-[10px] text-slate-400 font-normal">Background music, overlay frame, and branding watermarks</p>
            </div>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
              isAdvancedOpen ? 'rotate-180 text-slate-800' : ''
            }`} 
          />
        </button>

        <AnimatePresence initial={false}>
          {isAdvancedOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-6 border-t border-slate-100 bg-slate-50/10">
                {/* ---------------- BACKGROUND MUSIC CARD ---------------- */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                        <Music className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Upload Background Music</h3>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSettingsVideoBgmSourceType('upload')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                          settingsVideoBgmSourceType === 'upload' 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Upload Local File
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettingsVideoBgmSourceType('url')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                          settingsVideoBgmSourceType === 'url' 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Use External URL
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                    Embed an ambient background tune or warm soft intro track to accompany the user recording phase or welcome video.
                  </p>

                  {settingsVideoBgmSourceType === 'upload' ? (
                    <div className="space-y-4">
                      {settingsVideoIntroBgmUrl ? (
                        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-3">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                <Music className="w-5 h-5 text-slate-600" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-800 max-w-[200px] truncate" title={settingsVideoBgmFileName || "ambient-track.mp3"}>
                                  {settingsVideoBgmFileName || "ambient-track.mp3"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-normal">Local Cached Blob Audio</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => bgmInputRef.current?.click()}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors"
                              >
                                Replace File
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveBgm}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Remove Audio"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Inline Audio Preview Player */}
                          <div className="bg-white rounded-xl p-2 border border-slate-100 flex items-center justify-center max-w-sm mx-auto shadow-inner">
                            <audio 
                              src={settingsVideoIntroBgmUrl} 
                              className="w-full max-h-8"
                              controls
                              preload="metadata"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragOverBgm(true); }}
                          onDragLeave={() => setIsDragOverBgm(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOverBgm(false);
                            if (e.dataTransfer.files?.[0]) processBgmFile(e.dataTransfer.files[0]);
                          }}
                          onClick={() => bgmInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                            isDragOverBgm 
                              ? 'border-slate-800 bg-slate-50' 
                              : 'border-slate-200 hover:border-slate-400 bg-slate-50/20'
                          }`}
                        >
                          <input 
                            type="file" 
                            ref={bgmInputRef} 
                            onChange={(e) => e.target.files?.[0] && processBgmFile(e.target.files[0])}
                            accept=".mp3,.aac,.wav,.m4a" 
                            className="hidden" 
                          />
                          <div className="flex flex-col items-center space-y-2">
                            <div className="p-3 bg-white rounded-full shadow-sm text-slate-400">
                              <Upload className="w-5 h-5 text-slate-700" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-700">Drag & drop your BGM track or <span className="text-slate-900 underline">browse</span></p>
                              <p className="text-[10px] text-slate-400 font-normal">Supported: MP3, AAC, WAV, M4A (Max. 15MB)</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {bgmError && (
                        <p className="text-[10px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100 flex items-center space-x-1.5 animate-fade-in">
                          <span>⚠️ {bgmError}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1 bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                      <label className="text-[10px] text-slate-500 font-bold">Intro Music / BGM track URL</label>
                      <input 
                        type="text"
                        value={settingsVideoIntroBgmUrl}
                        onChange={(e) => setSettingsVideoIntroBgmUrl(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                        placeholder="https://example.com/soft-harp.mp3"
                      />
                    </div>
                  )}

                  {/* Music Controls (Volume, Fade In/Out, Ducking, Loop) */}
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Loop Music Toggle */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-bold flex items-center space-x-1">
                          <span>Loop Music Track</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSettingsVideoLoopMusic(!settingsVideoLoopMusic)}
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ${settingsVideoLoopMusic ? 'bg-slate-900' : 'bg-slate-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${settingsVideoLoopMusic ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* Auto Ducking Toggle */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-bold flex items-center space-x-1">
                          <span>Auto-ducking (Lower BGM when talking)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSettingsVideoAutoDucking(!settingsVideoAutoDucking)}
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ${settingsVideoAutoDucking ? 'bg-slate-900' : 'bg-slate-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${settingsVideoAutoDucking ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>

                    <hr className="border-slate-200" />

                    {/* Volume and Fade Control sliders */}
                    <div className="space-y-3">
                      {/* Music Volume slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>BGM Track Volume</span>
                          </span>
                          <span className="font-mono">{settingsVideoBgmVolume}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={settingsVideoBgmVolume}
                          onChange={(e) => setSettingsVideoBgmVolume(parseInt(e.target.value))}
                          className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                      </div>

                      {/* Fades row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                            <span>Fade In duration</span>
                            <span className="font-mono">{settingsVideoBgmFadeIn}s</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="10"
                            value={settingsVideoBgmFadeIn}
                            onChange={(e) => setSettingsVideoBgmFadeIn(parseInt(e.target.value))}
                            className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                            <span>Fade Out duration</span>
                            <span className="font-mono">{settingsVideoBgmFadeOut}s</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="10"
                            value={settingsVideoBgmFadeOut}
                            onChange={(e) => setSettingsVideoBgmFadeOut(parseInt(e.target.value))}
                            className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ---------------- VIDEO OVERLAY FRAME CARD ---------------- */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Upload Overlay Frame</h3>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSettingsVideoFrameSourceType('upload')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                          settingsVideoFrameSourceType === 'upload' 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Upload PNG
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettingsVideoFrameSourceType('url')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                          settingsVideoFrameSourceType === 'url' 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Use External URL
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                    Provide a transparent border graphic overlay to encircle the guest's face or background scene on screen during recording.
                  </p>

                  {settingsVideoFrameSourceType === 'upload' ? (
                    <div className="space-y-4">
                      {settingsVideoFrameUrl ? (
                        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-3">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                                <img src={settingsVideoFrameUrl} alt="Overlay preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-800 max-w-[200px] truncate" title={settingsVideoFrameFileName || "frame-overlay.png"}>
                                  {settingsVideoFrameFileName || "frame-overlay.png"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-normal">Transparent Overlay Frame</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => frameInputRef.current?.click()}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors"
                              >
                                Replace File
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveFrame}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Remove Frame"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragOverFrame(true); }}
                          onDragLeave={() => setIsDragOverFrame(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOverFrame(false);
                            if (e.dataTransfer.files?.[0]) processFrameFile(e.dataTransfer.files[0]);
                          }}
                          onClick={() => frameInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                            isDragOverFrame 
                              ? 'border-slate-800 bg-slate-50' 
                              : 'border-slate-200 hover:border-slate-400 bg-slate-50/20'
                          }`}
                        >
                          <input 
                            type="file" 
                            ref={frameInputRef} 
                            onChange={(e) => e.target.files?.[0] && processFrameFile(e.target.files[0])}
                            accept=".png" 
                            className="hidden" 
                          />
                          <div className="flex flex-col items-center space-y-2">
                            <div className="p-3 bg-white rounded-full shadow-sm text-slate-400">
                              <Upload className="w-5 h-5 text-slate-700" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-700">Drag & drop your overlay PNG file or <span className="text-slate-900 underline">browse</span></p>
                              <p className="text-[10px] text-slate-400 font-normal">Supported: Transparent PNG only (Max. 10MB)</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {frameError && (
                        <p className="text-[10px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100 flex items-center space-x-1.5 animate-fade-in">
                          <span>⚠️ {frameError}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1 bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                      <label className="text-[10px] text-slate-500 font-bold">Overlay Frame PNG URL</label>
                      <input 
                        type="text"
                        value={settingsVideoFrameUrl}
                        onChange={(e) => setSettingsVideoFrameUrl(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                        placeholder="https://example.com/video-frame.png"
                      />
                    </div>
                  )}

                  {/* Frame layout modifiers */}
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-bold">Show Safe margin guides inside recorder</span>
                      <button
                        type="button"
                        onClick={() => setSettingsVideoFrameSafeGuide(!settingsVideoFrameSafeGuide)}
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ${settingsVideoFrameSafeGuide ? 'bg-slate-900' : 'bg-slate-200'}`}
                      >
                        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${settingsVideoFrameSafeGuide ? 'translate-x-3' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>Frame Opacity</span>
                        <span className="font-mono">{settingsVideoFrameOpacity}%</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="100"
                        value={settingsVideoFrameOpacity}
                        onChange={(e) => setSettingsVideoFrameOpacity(parseInt(e.target.value))}
                        className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* ---------------- BRAND LOGO / WATERMARK CARD ---------------- */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Upload Corner Watermark</h3>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSettingsVideoWatermarkSourceType('upload')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                          settingsVideoWatermarkSourceType === 'upload' 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Upload PNG/SVG
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettingsVideoWatermarkSourceType('url')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                          settingsVideoWatermarkSourceType === 'url' 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Use External URL
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                    Affix your business, event host logo, or subtle branding monogram to the corner of recorded videos as a transparent protective watermark.
                  </p>

                  {settingsVideoWatermarkSourceType === 'upload' ? (
                    <div className="space-y-4">
                      {settingsVideoOverlayLogoUrl && !settingsVideoUseDefaultWatermark ? (
                        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-3">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 p-1">
                                <img src={settingsVideoOverlayLogoUrl} alt="Watermark preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-800 max-w-[200px] truncate" title={settingsVideoWatermarkFileName || "watermark-logo.png"}>
                                  {settingsVideoWatermarkFileName || "watermark-logo.png"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-normal">Custom Transparent Watermark</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => watermarkInputRef.current?.click()}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors"
                              >
                                Replace File
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveWatermark}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Reset to Default"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {settingsVideoUseDefaultWatermark && (
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-medium flex items-center justify-between">
                              <span className="flex items-center space-x-1.5">
                                <Info className="w-3.5 h-3.5 text-slate-400" />
                                <span>Using KAVA Default Event Monogram Brand logo</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setSettingsVideoUseDefaultWatermark(false)}
                                className="text-slate-800 font-bold underline hover:text-slate-900"
                              >
                                Switch to Custom
                              </button>
                            </div>
                          )}

                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragOverWatermark(true); }}
                            onDragLeave={() => setIsDragOverWatermark(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragOverWatermark(false);
                              if (e.dataTransfer.files?.[0]) processWatermarkFile(e.dataTransfer.files[0]);
                            }}
                            onClick={() => watermarkInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                              isDragOverWatermark 
                                ? 'border-slate-800 bg-slate-50' 
                                : 'border-slate-200 hover:border-slate-400 bg-slate-50/20'
                            }`}
                          >
                            <input 
                              type="file" 
                              ref={watermarkInputRef} 
                              onChange={(e) => e.target.files?.[0] && processWatermarkFile(e.target.files[0])}
                              accept=".png,.svg" 
                              className="hidden" 
                            />
                            <div className="flex flex-col items-center space-y-2">
                              <div className="p-3 bg-white rounded-full shadow-sm text-slate-400">
                                <Upload className="w-5 h-5 text-slate-700" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-700">Drag & drop custom logo or <span className="text-slate-900 underline">browse</span></p>
                                <p className="text-[10px] text-slate-400 font-normal">Supported: Transparent PNG, SVG (Max. 5MB)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {watermarkError && (
                        <p className="text-[10px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100 flex items-center space-x-1.5 animate-fade-in">
                          <span>⚠️ {watermarkError}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1 bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                      <label className="text-[10px] text-slate-500 font-bold">Overlay Brand Logo URL (corner watermark)</label>
                      <input 
                        type="text"
                        value={settingsVideoOverlayLogoUrl}
                        onChange={(e) => setSettingsVideoOverlayLogoUrl(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                        placeholder="https://example.com/corner-watermark.png"
                      />
                    </div>
                  )}

                  {/* Logo/Watermark options layout */}
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold">Watermark position</label>
                        <select
                          value={settingsVideoWatermarkPosition}
                          onChange={(e) => setSettingsVideoWatermarkPosition(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none font-medium text-slate-700"
                        >
                          <option value="top-left">Top-Left corner</option>
                          <option value="top-right">Top-Right corner</option>
                          <option value="bottom-left">Bottom-Left corner</option>
                          <option value="bottom-right">Bottom-Right corner (Default)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold">Watermark scale size</label>
                        <select
                          value={settingsVideoWatermarkSize}
                          onChange={(e) => setSettingsVideoWatermarkSize(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none font-medium text-slate-700"
                        >
                          <option value="small">Small scale (10%)</option>
                          <option value="medium">Medium scale (15%)</option>
                          <option value="large">Large scale (20%)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>Watermark Opacity</span>
                        <span className="font-mono">{settingsVideoWatermarkOpacity}%</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="100"
                        value={settingsVideoWatermarkOpacity}
                        onChange={(e) => setSettingsVideoWatermarkOpacity(parseInt(e.target.value))}
                        className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
