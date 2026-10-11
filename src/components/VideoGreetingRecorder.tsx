import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Video, 
  Square, 
  RotateCcw, 
  RefreshCw, 
  Zap, 
  ZapOff, 
  Check, 
  X, 
  Play, 
  Pause, 
  Clock, 
  Sparkles, 
  Upload, 
  Film, 
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { KavaEvent } from '../types';

interface VideoGreetingRecorderProps {
  event: KavaEvent;
  contributorName: string;
  onCancel: () => void;
  onSubmitVideo: (videoUrl: string, metadata?: Record<string, any>) => void;
  onRedirectGallery: () => void;
}

export const VideoGreetingRecorder: React.FC<VideoGreetingRecorderProps> = ({
  event,
  contributorName,
  onCancel,
  onSubmitVideo,
  onRedirectGallery
}) => {
  // Host settings resolution (Synchronized in real-time)
  const settings = event.settings || {};
  const isCameraAllowed = settings.allowCameraRecording !== false;
  const isGalleryAllowed = settings.allowVideoGalleryUpload !== false && settings.allowGalleryUpload !== false;
  const allowFlipCamera = settings.allowFlipCamera !== false;
  const maxDurationSeconds = Number(settings.videoMaxDuration || settings.videoDuration || settings.maxVideoDuration || 30);
  const requireApproval = !!(settings.requireApproval || settings.moderationApprovedOnly);
  const enableCountdown = settings.enableCountdown !== false && settings.videoCountdown !== false;
  const initialCountdownSeconds = enableCountdown ? Number(settings.videoCountdownSeconds || 3) : 0;

  // Host Video Greeting Detection
  const videoGreetingUrl = settings.greetingVideoUrl || settings.videoIntroUrl;
  const isGreetingEnabled = settings.greetingEnabled !== false && settings.videoEnableIntro !== false;
  const hasVideoGreeting = isGreetingEnabled && !!videoGreetingUrl;

  // View state: 'greeting' | 'camera' | 'review' | 'uploading' | 'gallery'
  const [viewMode, setViewMode] = useState<'greeting' | 'camera' | 'review' | 'uploading' | 'gallery'>(
    hasVideoGreeting ? 'greeting' : (isCameraAllowed ? 'camera' : 'gallery')
  );

  // Camera & Stream State
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<'requesting' | 'granted' | 'denied'>('requesting');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [actualDuration, setActualDuration] = useState<number>(0);

  // Preview & Upload States
  const [isPreviewMuted, setIsPreviewMuted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'success' | 'error'>('uploading');

  // Greeting Player State
  const [isGreetingPlaying, setIsGreetingPlaying] = useState(true);

  // Refs
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const greetingVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Format time display (00:00)
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. REQUEST CAMERA & MICROPHONE PERMISSION IMMEDIATELY WHEN IN CAMERA MODE
  useEffect(() => {
    if (viewMode !== 'camera') return;

    let activeStream: MediaStream | null = null;

    const requestCameraStream = async () => {
      setCameraError(null);
      setPermissionState('requesting');

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported in this browser.');
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        };

        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = newStream;
        setStream(newStream);
        setPermissionState('granted');

        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = newStream;
        }
      } catch (err: any) {
        console.warn('Camera access request failed or permission denied:', err);
        setPermissionState('denied');
        setCameraError(err.message || 'Camera and microphone permissions are required.');
      }
    };

    requestCameraStream();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [viewMode, cameraFacing]);

  // Keep video ref srcObject in sync if stream updates
  useEffect(() => {
    if (liveVideoRef.current && stream && viewMode === 'camera') {
      liveVideoRef.current.srcObject = stream;
    }
  }, [stream, viewMode]);

  // Handle Host Video Greeting Finish / Skip -> Proceed to Camera
  const handleSkipOrFinishGreeting = () => {
    if (greetingVideoRef.current) {
      greetingVideoRef.current.pause();
    }
    setViewMode('camera');
  };

  // Start Actual Recording (called directly or after countdown)
  const startRecordingStream = () => {
    if (!stream) return;

    recordedChunksRef.current = [];
    setRecordingSeconds(0);
    setActualDuration(0);
    setIsRecording(true);

    let mimeType = 'video/webm';
    if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mimeType = 'video/webm;codecs=vp9';
    }

    try {
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedVideoUrl(url);
        setViewMode('review');
      };

      recorder.start(500); // Collect data chunks every 500ms
    } catch (err) {
      console.error('Failed to initialize MediaRecorder:', err);
    }

    // Start recording timer interval
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        const next = prev + 1;
        setActualDuration(next);
        if (next >= maxDurationSeconds) {
          handleStopRecording();
        }
        return next;
      });
    }, 1000);
  };

  // Handle Record Button Click (Triggers countdown if enabled)
  const handleRecordButtonClick = () => {
    if (isRecording) {
      handleStopRecording();
      return;
    }

    if (enableCountdown && initialCountdownSeconds > 0) {
      setCountdownNumber(initialCountdownSeconds);
    } else {
      startRecordingStream();
    }
  };

  // Countdown Ticker Effect
  useEffect(() => {
    if (countdownNumber === null) return;

    if (countdownNumber === 0) {
      setCountdownNumber(null);
      startRecordingStream();
      return;
    }

    countdownTimerRef.current = setTimeout(() => {
      setCountdownNumber((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [countdownNumber]);

  // Stop Recording
  const handleStopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else if (recordedChunksRef.current.length > 0) {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setRecordedVideoUrl(url);
      setViewMode('review');
    }
  };

  // Handle Retake Video
  const handleRetake = () => {
    if (recordedVideoUrl && recordedVideoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
    setRecordedBlob(null);
    setRecordingSeconds(0);
    setActualDuration(0);
    setCountdownNumber(null);
    setViewMode('camera');
  };

  // Handle File Selection from Gallery
  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedBlob(file);
      setRecordedVideoUrl(url);
      setActualDuration(15); // Default duration for gallery uploads
      setViewMode('review');
    }
  };

  // Handle Upload Video (Guest taps "Upload" on Review screen)
  const handleUploadVideo = async () => {
    if (!recordedVideoUrl) return;

    setViewMode('uploading');
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate real upload progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          
          setTimeout(() => {
            onSubmitVideo(recordedVideoUrl, {
              duration: actualDuration || recordingSeconds || 15,
              facing: cameraFacing,
              approved: !requireApproval,
              contributorName,
            });

            const redirectTarget = settings.afterSubmitRedirect || 'thanks';
            if (redirectTarget === 'gallery') {
              onRedirectGallery();
            }
          }, 800);

          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-[99999] flex flex-col font-sans select-none overflow-hidden">
      
      {/* ======================================================= */}
      {/* 1. TOP HEADER NAVIGATION BAR                            */}
      {/* ======================================================= */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          onClick={onCancel}
          className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:bg-black/60 transition-all border border-white/10 active:scale-95 cursor-pointer"
          title="Cancel"
          id="btn-video-recorder-close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Status / Timer Pill */}
        {viewMode === 'recording' || isRecording ? (
          <div className="flex items-center space-x-2 bg-rose-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full shadow-lg border border-rose-400/30 animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="font-mono font-bold text-xs tracking-wider">
              {formatTime(recordingSeconds)} / {formatTime(maxDurationSeconds)}
            </span>
          </div>
        ) : viewMode === 'review' ? (
          <div className="bg-emerald-500/90 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-xs font-bold tracking-wide flex items-center space-x-1.5 border border-emerald-400/30">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Video Recorded</span>
          </div>
        ) : viewMode === 'greeting' ? (
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-emerald-400">
            <Video className="w-3.5 h-3.5" />
            <span>Host Welcome Video</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[150px]">{event.name}</span>
          </div>
        )}

        {/* Duration Limit Pill */}
        <div className="text-[10px] font-mono font-bold text-white/70 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center space-x-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>Max {maxDurationSeconds}s</span>
        </div>
      </div>

      {/* ======================================================= */}
      {/* 2. PROGRESS BAR (DURING RECORDING)                     */}
      {/* ======================================================= */}
      {isRecording && (
        <div className="absolute top-0 left-0 right-0 z-50 h-1.5 bg-white/20">
          <div
            className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(recordingSeconds / maxDurationSeconds) * 100}%` }}
          />
        </div>
      )}

      {/* ======================================================= */}
      {/* 3. MAIN VIEWFINDER / CONTENT AREA                       */}
      {/* ======================================================= */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        
        {/* VIEW 1: HOST VIDEO GREETING STAGE */}
        {viewMode === 'greeting' && videoGreetingUrl && (
          <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
            <video
              ref={greetingVideoRef}
              src={videoGreetingUrl}
              autoPlay
              playsInline
              controls
              onEnded={handleSkipOrFinishGreeting}
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleSkipOrFinishGreeting}
              className="absolute bottom-10 right-6 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Continue to Camera</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* VIEW 2: LIVE CAMERA VIEWFINDER */}
        {viewMode === 'camera' && (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {permissionState === 'granted' && (
              <video
                ref={liveVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  cameraFacing === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />
            )}

            {/* Requesting Permissions Spinner */}
            {permissionState === 'requesting' && (
              <div className="text-center space-y-4 p-6">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-300">Requesting camera & microphone access...</p>
                <p className="text-xs text-slate-500 max-w-xs">Please allow camera access when prompted by your browser.</p>
              </div>
            )}

            {/* Permission Denied / Error Screen */}
            {permissionState === 'denied' && (
              <div className="text-center space-y-5 p-8 max-w-sm mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl backdrop-blur-xl">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Camera Access Required</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cameraError || "Camera permission was blocked. Please grant access in your browser settings to record your video memory."}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setCameraFacing((prev) => (prev === 'user' ? 'user' : 'user'))}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-5 rounded-2xl transition-all cursor-pointer text-xs"
                  >
                    Retry Camera Access
                  </button>

                  {isGalleryAllowed && (
                    <label className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-2xl cursor-pointer transition-all text-xs text-center border border-white/10">
                      <span>Choose Video File from Gallery</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleGalleryFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Countdown Overlay */}
            <AnimatePresence>
              {countdownNumber !== null && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center z-50 text-white space-y-3"
                >
                  <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">Recording Starts In</span>
                  <motion.div
                    key={countdownNumber}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-8xl font-black font-mono text-white select-none"
                  >
                    {countdownNumber}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flash Effect Overlay */}
            <AnimatePresence>
              {isFlashOn && isRecording && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-amber-100 pointer-events-none z-20 mix-blend-soft-light"
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* VIEW 3: REVIEW RECORDED VIDEO */}
        {viewMode === 'review' && recordedVideoUrl && (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={previewVideoRef}
              src={recordedVideoUrl}
              autoPlay
              loop
              playsInline
              muted={isPreviewMuted}
              controls
              className="w-full h-full object-contain"
            />

            {/* Mute/Unmute Overlay Toggle */}
            <button
              onClick={() => setIsPreviewMuted(!isPreviewMuted)}
              className="absolute top-20 right-4 z-30 p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all border border-white/10 cursor-pointer"
              title={isPreviewMuted ? 'Unmute' : 'Mute'}
            >
              {isPreviewMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>
        )}

        {/* VIEW 4: UPLOADING PROGRESS SCREEN */}
        {viewMode === 'uploading' && (
          <div className="text-center space-y-6 p-8 max-w-sm mx-auto">
            {uploadStatus === 'uploading' ? (
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-2xl">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">
                {uploadStatus === 'uploading' ? 'Uploading Video Memory...' : 'Uploaded Successfully!'}
              </h3>
              <p className="text-xs text-slate-400">
                {uploadStatus === 'uploading' 
                  ? 'Saving your video memory inside the capsule...' 
                  : 'Your video contribution is saved.'}
              </p>
            </div>

            {/* Upload Progress Bar */}
            <div className="space-y-2 max-w-xs mx-auto">
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">{uploadProgress}%</span>
            </div>
          </div>
        )}

        {/* VIEW 5: GALLERY SELECT MODE */}
        {viewMode === 'gallery' && (
          <div className="p-8 text-center space-y-6 max-w-sm mx-auto">
            <div className="w-20 h-20 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center mx-auto shadow-xl">
              <Film className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Select Video Memory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose a pre-recorded video clip from your device gallery to share with {event.name}.
              </p>
            </div>

            <label className="block w-full bg-slate-100 hover:bg-white text-slate-900 font-extrabold py-4 px-6 rounded-2xl cursor-pointer transition-all shadow-lg text-sm text-center">
              <span>Choose Video from Gallery</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleGalleryFileSelect}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* ======================================================= */}
      {/* 4. CAMERA CONTROLS BOTTOM BAR (RECORDING / CAMERA MODE) */}
      {/* ======================================================= */}
      <AnimatePresence>
        {viewMode === 'camera' && permissionState === 'granted' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-0 left-0 right-0 z-40 p-8 flex items-center justify-around bg-gradient-to-t from-black/95 via-black/60 to-transparent"
          >
            {/* Flip Camera Button */}
            {allowFlipCamera ? (
              <button
                onClick={() => setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))}
                disabled={isRecording}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all border border-white/15 text-white cursor-pointer shadow-lg disabled:opacity-40"
                title="Flip Camera"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-14 h-14" />
            )}

            {/* LARGE RECORD / STOP BUTTON */}
            <button
              onClick={handleRecordButtonClick}
              className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer shadow-2xl transition-all active:scale-95 ${
                isRecording 
                  ? 'bg-rose-600 hover:bg-rose-500 border-4 border-white ring-8 ring-rose-600/40 animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-500 border-4 border-white'
              }`}
              title={isRecording ? "Stop Recording" : "Start Recording"}
              id="btn-toggle-video-recording"
            >
              {isRecording ? (
                <Square className="w-8 h-8 text-white fill-white rounded-xs" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white" />
              )}
            </button>

            {/* Flash Toggle (Rear Camera Only) */}
            {cameraFacing === 'environment' ? (
              <button
                onClick={() => setIsFlashOn(!isFlashOn)}
                className={`p-4 rounded-full transition-all border border-white/15 cursor-pointer shadow-lg ${
                  isFlashOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Toggle Flash"
              >
                {isFlashOn ? <Zap className="w-6 h-6 fill-slate-950" /> : <ZapOff className="w-6 h-6" />}
              </button>
            ) : (
              <div className="w-14 h-14" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================= */}
      {/* 5. REVIEW CONTROLS BOTTOM BAR (REVIEW MODE)             */}
      {/* ======================================================= */}
      <AnimatePresence>
        {viewMode === 'review' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-0 left-0 right-0 z-40 p-6 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 space-y-4 shadow-2xl"
          >
            {/* Moderation Warning if Required */}
            {requireApproval && (
              <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-amber-400 bg-amber-500/10 py-1 px-3 rounded-full border border-amber-500/20 max-w-xs mx-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Requires Host Moderation before appearing in album</span>
              </div>
            )}

            {/* Action Buttons: Retake & Upload */}
            <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
              {/* Retake Button */}
              <button
                onClick={handleRetake}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-extrabold py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer border border-white/15 text-xs active:scale-95"
                id="btn-retake-video"
              >
                <RotateCcw className="w-4 h-4 text-slate-300" />
                <span>Retake</span>
              </button>

              {/* Upload Button */}
              <button
                onClick={handleUploadVideo}
                className="flex-[2] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xl border border-emerald-300/40 text-xs active:scale-95"
                id="btn-submit-video-greeting"
              >
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>Upload Video</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
