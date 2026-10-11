import React, { useState, useEffect, useRef } from 'react';
import { KavaEvent, EventJoinLog, KavaGuest } from '../types';
import { KeyRound, Clock, AlertTriangle, Users, Lock, QrCode, X, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Camera, Upload, RefreshCw, AlertCircle } from 'lucide-react';
// @ts-ignore
import jsQR from 'jsqr';
import { extractCodeFromQrData, validateEventJoinCode } from '../lib/eventValidation';

interface JoinEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'password' | 'expired' | 'not_open' | 'full' | 'qr_scanner' | 'disabled' | 'archived';
  event?: KavaEvent;
  events?: KavaEvent[];
  guests?: KavaGuest[];
  errorMessage?: string;
  startDate?: string;
  expirationDate?: string;
  maxGuests?: number;
  currentGuests?: number;
  onSubmitPassword?: (password: string) => void;
  onSelectQrCode?: (code: string) => void;
  isLoading?: boolean;
}

export default function JoinEventModal({
  isOpen,
  onClose,
  mode,
  event,
  events = [],
  guests = [],
  errorMessage,
  startDate,
  expirationDate,
  maxGuests,
  currentGuests,
  onSubmitPassword,
  onSelectQrCode,
  isLoading = false,
}: JoinEventModalProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Real Camera Scanner State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied'>('idle');
  const [cameraErrorMessage, setCameraErrorMessage] = useState<string | null>(null);
  const [scanErrorMessage, setScanErrorMessage] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let streamInstance: MediaStream | null = null;
    let isActive = true;

    if (isOpen && mode === 'qr_scanner') {
      setCameraState('requesting');
      setCameraErrorMessage(null);
      setScanErrorMessage(null);

      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState('denied');
        setCameraErrorMessage('Camera access is not supported by this browser.');
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
        .then((stream) => {
          if (!isActive) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          streamInstance = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute('playsinline', 'true');
            videoRef.current.play().catch(() => {});
          }
          setCameraState('active');

          // Scanning frame loop
          const scanFrame = () => {
            if (!isActive) return;
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
              const width = video.videoWidth;
              const height = video.videoHeight;
              if (width > 0 && height > 0) {
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                  ctx.drawImage(video, 0, 0, width, height);
                  const imageData = ctx.getImageData(0, 0, width, height);
                  const codeResult = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                  });

                  if (codeResult && codeResult.data) {
                    const extracted = extractCodeFromQrData(codeResult.data);
                    if (extracted) {
                      const valRes = validateEventJoinCode(extracted, events, guests);
                      if (valRes.success || valRes.status !== 'invalid_code') {
                        if (streamInstance) {
                          streamInstance.getTracks().forEach((track) => track.stop());
                        }
                        if (onSelectQrCode) {
                          onSelectQrCode(extracted);
                        }
                        return; // Stop scanning
                      } else {
                        setScanErrorMessage('This invitation is invalid or has expired.');
                      }
                    }
                  }
                }
              }
            }
            animFrameRef.current = requestAnimationFrame(scanFrame);
          };

          animFrameRef.current = requestAnimationFrame(scanFrame);
        })
        .catch((err) => {
          console.warn('Camera access denied or failed:', err);
          if (isActive) {
            setCameraState('denied');
            setCameraErrorMessage('Camera access was denied or is unavailable on this device.');
          }
        });
    }

    return () => {
      isActive = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, mode, events, guests, onSelectQrCode]);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError('Please enter the event password.');
      return;
    }
    setPasswordError(null);
    if (onSubmitPassword) {
      onSubmitPassword(passwordInput);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden text-slate-900 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. PASSWORD REQUIRED MODE */}
        {mode === 'password' && (
          <div className="space-y-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
                Protected Memory Capsule
              </span>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {event ? event.name : 'Enter Event Password'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                This capsule is private. Enter the passcode provided on your invitation card or by your host to unlock guest access.
              </p>
            </div>

            {(errorMessage || passwordError) && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{passwordError || errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block font-mono">
                  Event Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter passcode (e.g. 1234 or SOFIA-2026)"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(null);
                    }}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-all pl-11 min-h-[48px]"
                    autoFocus
                  />
                  <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px] py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Passcode...</span>
                  </span>
                ) : (
                  <>
                    <span>Unlock Capsule</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* 2. EXPIRED MODE */}
        {mode === 'expired' && (
          <div className="space-y-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 inline-block">
                Capsule Expired
              </span>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {event ? event.name : 'Event Access Closed'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {errorMessage || 'This memory capsule has passed its hosting expiration date. Guest photo uploads and voice notes are no longer accepting submissions.'}
              </p>
            </div>

            {expirationDate && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono font-medium text-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Expiration Timestamp</span>
                <p className="text-slate-900 font-extrabold">{new Date(expirationDate).toLocaleString()}</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full min-h-[48px] py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* 3. NOT YET OPEN MODE */}
        {mode === 'not_open' && (
          <div className="space-y-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 inline-block">
                Opening Soon
              </span>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {event ? event.name : 'Capsule Not Open Yet'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {errorMessage || 'This capsule is scheduled to open soon. Please return on the event date to contribute your photos and voice notes!'}
              </p>
            </div>

            {startDate && (
              <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 text-xs font-mono text-blue-950 space-y-1">
                <span className="text-blue-600 uppercase text-[10px] font-bold block">Opening Date & Time</span>
                <p className="text-blue-900 font-extrabold text-sm">{new Date(startDate).toLocaleString()}</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full min-h-[48px] py-3 bg-slate-950 text-white font-extrabold text-xs rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        )}

        {/* 4. EVENT FULL MODE */}
        {mode === 'full' && (
          <div className="space-y-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
                Capacity Limit Reached
              </span>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                Guest Limit Reached
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {errorMessage || `This event has reached its maximum guest capacity (${maxGuests || 50} guests). Please contact your host to increase guest limits.`}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-mono text-amber-950 flex justify-between items-center">
              <span>Current Joined Guests:</span>
              <strong className="text-amber-900 text-sm font-extrabold">{currentGuests || maxGuests} / {maxGuests}</strong>
            </div>

            <button
              onClick={onClose}
              className="w-full min-h-[48px] py-3 bg-slate-950 text-white font-extrabold text-xs rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Notice
            </button>
          </div>
        )}

        {/* 5. ARCHIVED OR DISABLED MODE */}
        {(mode === 'archived' || mode === 'disabled') && (
          <div className="space-y-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 inline-block">
                {mode === 'archived' ? 'Archived Capsule' : 'Guest Access Paused'}
              </span>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {event ? event.name : 'Capsule Unavailable'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {errorMessage || 'The host has currently paused or archived guest contributions for this event.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full min-h-[48px] py-3 bg-slate-950 text-white font-extrabold text-xs rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {/* 6. REAL CAMERA QR CODE SCANNER MODE */}
        {mode === 'qr_scanner' && (
          <div className="space-y-5 text-left">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950">Scan Event QR Code</h3>
                <p className="text-xs text-slate-500 font-mono">Point camera at event card or invitation</p>
              </div>
            </div>

            {/* Video camera viewfinder or fallback error */}
            {cameraState === 'active' || cameraState === 'requesting' ? (
              <div className="relative aspect-square w-full rounded-3xl bg-slate-950 overflow-hidden border-2 border-slate-800 flex flex-col items-center justify-center text-center p-2 shadow-inner">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Laser scan line animation */}
                <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-pulse top-1/3 z-10 pointer-events-none" />

                {cameraState === 'requesting' && (
                  <div className="relative z-20 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 text-xs font-mono text-white flex items-center space-x-2">
                    <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>Requesting camera access...</span>
                  </div>
                )}

                {/* Scan Error Alert Banner */}
                {scanErrorMessage && (
                  <div className="absolute top-4 inset-x-4 z-30 bg-rose-950/90 text-rose-200 border border-rose-600/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between shadow-lg backdrop-blur-md">
                    <span>{scanErrorMessage}</span>
                    <button
                      type="button"
                      onClick={() => setScanErrorMessage(null)}
                      className="text-white hover:underline text-[11px] font-bold ml-2 bg-rose-800 px-2 py-0.5 rounded-lg shrink-0"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Corner Frame Markers */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg z-20 pointer-events-none" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg z-20 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg z-20 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg z-20 pointer-events-none" />
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Camera className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {cameraErrorMessage || 'Camera access was denied or is unavailable on this device.'}
                </p>
              </div>
            )}

            {/* Fallback Manual Code Entry */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (manualCode.trim() && onSelectQrCode) {
                  onSelectQrCode(manualCode.trim().toUpperCase());
                }
              }}
              className="space-y-2 pt-1"
            >
              <label className="text-xs font-extrabold text-slate-700 font-mono uppercase tracking-wider block">
                Enter invitation code manually
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. WEDDING-2026"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-colors uppercase"
                />
                <button
                  type="submit"
                  disabled={!manualCode.trim()}
                  className="bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 min-h-[40px]"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
