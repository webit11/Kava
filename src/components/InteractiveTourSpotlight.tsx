import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  CheckCircle, 
  Play, 
  RotateCcw, 
  Compass, 
  ShieldCheck,
  MousePointerClick
} from 'lucide-react';
import { OnboardingGuide, OnboardingStep } from '../types';
import { trackTourEvent, markTourCompleted } from '../lib/onboarding';

interface InteractiveTourSpotlightProps {
  guide: OnboardingGuide;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  userRole?: string;
}

export default function InteractiveTourSpotlight({
  guide,
  isOpen,
  onClose,
  onNavigateTab,
  userRole = 'Host'
}: InteractiveTourSpotlightProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`kava_tour_step_${guide.id}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < guide.steps.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to restore step index:', e);
    }
    return 0;
  });

  // Resync step index when tour opens or guide changes
  useEffect(() => {
    if (isOpen && guide?.id) {
      try {
        const saved = localStorage.getItem(`kava_tour_step_${guide.id}`);
        if (saved !== null) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed < (guide.steps?.length || 1)) {
            setCurrentStepIndex(parsed);
            return;
          }
        }
      } catch (e) {}
      setCurrentStepIndex(0);
    }
  }, [isOpen, guide?.id, guide?.steps?.length]);

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardCoords, setCardCoords] = useState<{ top: number; left: number; position: 'top' | 'bottom' | 'left' | 'right' }>({
    top: 100,
    left: 100,
    position: 'bottom'
  });
  const [targetFound, setTargetFound] = useState(true);

  const currentStep: OnboardingStep | undefined = guide?.steps?.[currentStepIndex];

  // Save progress step in localStorage whenever it changes
  useEffect(() => {
    if (guide?.id && currentStepIndex !== undefined) {
      try {
        localStorage.setItem(`kava_tour_step_${guide.id}`, currentStepIndex.toString());
      } catch (e) {
        // ignore
      }
    }
  }, [guide?.id, currentStepIndex]);

  // Map step to automatic tab navigation
  const triggerAutoTabNavigation = useCallback((step: OnboardingStep) => {
    if (!onNavigateTab) return;

    const targetId = step.targetId || '';
    const action = step.ctaAction || '';

    if (action === 'navigate_workspace' || targetId === '#nav-workspace') {
      onNavigateTab('overview');
    } else if (targetId === '#btn-create-capsule' || targetId === '#nav-events') {
      onNavigateTab('overview');
    } else if (targetId === '#nav-guest-studio') {
      onNavigateTab('qr_code');
    } else if (targetId === '#nav-live-screen') {
      onNavigateTab('live_display');
    } else if (targetId === '#nav-billing') {
      onNavigateTab('billing');
    } else if (targetId === '#nav-team') {
      onNavigateTab('team');
    } else if (targetId === '#nav-help') {
      onNavigateTab('overview');
    }
  }, [onNavigateTab]);

  // Update target bounding box and compute popover position intelligently
  const updateSpotlightPosition = useCallback(() => {
    if (!currentStep) return;

    let targetElement: HTMLElement | null = null;
    if (currentStep.targetId) {
      targetElement = document.querySelector(currentStep.targetId) as HTMLElement;
    }

    if (targetElement) {
      setTargetFound(true);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      const rect = targetElement.getBoundingClientRect();
      setTargetRect(rect);

      const cardWidth = 360;
      const cardHeight = 260;
      const margin = 16;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Desired position preference
      const preferredPos = currentStep.position || 'bottom';
      let chosenPos: 'top' | 'bottom' | 'left' | 'right' = preferredPos === 'auto' ? 'bottom' : preferredPos;

      let top = 0;
      let left = 0;

      // Test Bottom
      if (chosenPos === 'bottom') {
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2 - cardWidth / 2;

        // Flip to Top if overflowing bottom
        if (top + cardHeight > viewportHeight - margin) {
          chosenPos = 'top';
        }
      }

      // Test Top
      if (chosenPos === 'top') {
        top = rect.top - cardHeight - margin;
        left = rect.left + rect.width / 2 - cardWidth / 2;

        // Flip to Bottom if overflowing top
        if (top < margin) {
          chosenPos = 'bottom';
          top = rect.bottom + margin;
        }
      }

      // Test Right
      if (chosenPos === 'right') {
        left = rect.right + margin;
        top = rect.top + rect.height / 2 - cardHeight / 2;

        // Flip to Left if overflowing right
        if (left + cardWidth > viewportWidth - margin) {
          chosenPos = 'left';
        }
      }

      // Test Left
      if (chosenPos === 'left') {
        left = rect.left - cardWidth - margin;
        top = rect.top + rect.height / 2 - cardHeight / 2;

        if (left < margin) {
          chosenPos = 'bottom';
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - cardWidth / 2;
        }
      }

      // Bounds clamping
      left = Math.max(margin, Math.min(left, viewportWidth - cardWidth - margin));
      top = Math.max(margin, Math.min(top, viewportHeight - cardHeight - margin));

      setCardCoords({ top, left, position: chosenPos });
    } else {
      // Fallback: target not found on current view
      setTargetFound(false);
      setTargetRect(null);
      setCardCoords({
        top: Math.max(40, window.innerHeight / 2 - 130),
        left: Math.max(16, window.innerWidth / 2 - 180),
        position: 'bottom'
      });
    }
  }, [currentStep]);

  // Automatically switch tab on step change & measure
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    triggerAutoTabNavigation(currentStep);

    // Initial position check + delayed retries to allow tab render
    updateSpotlightPosition();
    const timer1 = setTimeout(updateSpotlightPosition, 150);
    const timer2 = setTimeout(updateSpotlightPosition, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, currentStepIndex, currentStep, triggerAutoTabNavigation, updateSpotlightPosition]);

  // Periodic position updates & resize/scroll listeners
  useEffect(() => {
    if (!isOpen) return;

    trackTourEvent('start');

    const interval = setInterval(updateSpotlightPosition, 300);
    const handleResizeOrScroll = () => updateSpotlightPosition();

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [isOpen, updateSpotlightPosition]);

  // Keyboard Navigation Listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, guide?.steps?.length]);

  if (!isOpen || !guide || !currentStep) return null;

  const totalSteps = guide.steps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNext = () => {
    trackTourEvent('step', currentStep.id);
    if (isLastStep) {
      trackTourEvent('complete');
      markTourCompleted(guide.id, guide.version);
      try {
        localStorage.removeItem(`kava_tour_step_${guide.id}`);
      } catch (e) {}
      onClose();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    trackTourEvent('skip', currentStep.id);
    markTourCompleted(guide.id, guide.version);
    onClose();
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    try {
      localStorage.setItem(`kava_tour_step_${guide.id}`, '0');
    } catch (e) {}
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999990] overflow-hidden select-none pointer-events-none">
        {/* Dark dim overlay with SVG spotlight cutout */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="tour-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left - 8}
                  y={targetRect.top - 8}
                  width={targetRect.width + 16}
                  height={targetRect.height + 16}
                  rx="18"
                  ry="18"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.68)"
            mask="url(#tour-spotlight-mask)"
            className="pointer-events-auto"
            onClick={handleNext}
          />
        </svg>

        {/* Target highlight pulsing ring */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: `${targetRect.top - 8}px`,
              left: `${targetRect.left - 8}px`,
              width: `${targetRect.width + 16}px`,
              height: `${targetRect.height + 16}px`,
              borderRadius: '18px',
              border: '2px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 0 4px rgba(15, 23, 42, 0.8), 0 0 35px rgba(0, 0, 0, 0.4)',
              pointerEvents: currentStep.requiredAction === 'click' ? 'auto' : 'none',
              zIndex: 999991
            }}
          />
        )}

        {/* Guided Tour Dialog Card */}
        <motion.div
          key={`${guide.id}_${currentStep.id}`}
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: `${cardCoords.top}px`,
            left: `${cardCoords.left}px`,
            zIndex: 999995
          }}
          className="w-90 bg-white rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-100 p-5 text-slate-800 text-left pointer-events-auto"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="p-1.5 rounded-xl bg-slate-900 text-white shrink-0 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </span>
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider font-mono block truncate">
                  {guide.name}
                </span>
                <span className="text-[9px] font-bold text-slate-400 font-mono flex items-center space-x-1">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                  <span>Role: {userRole}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={handleRestart}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Restart Tour from Step 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSkip}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close Tour (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media preview if available */}
          {currentStep.imageUrl && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 h-28">
              <img src={currentStep.imageUrl} alt={currentStep.title} className="w-full h-full object-cover" />
            </div>
          )}

          {currentStep.videoUrl && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 text-white p-3 flex items-center space-x-3">
              <Play className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Video Feature Walkthrough</p>
                <p className="text-[10px] text-slate-400">Click to preview feature demo</p>
              </div>
            </div>
          )}

          {/* Target fallback warning if not found */}
          {!targetFound && (
            <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 font-medium flex items-center space-x-2">
              <Compass className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Section loaded. Follow guided overview below.</span>
            </div>
          )}

          {/* Step Content */}
          <div className="space-y-1.5 mb-4">
            <h4 className="text-sm font-black text-slate-950 leading-snug">
              {currentStep.title}
            </h4>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Progress Indicators & Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {/* Step Dots & Numerical Counter */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {guide.steps.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentStepIndex
                        ? 'w-5 bg-slate-900'
                        : idx < currentStepIndex
                        ? 'w-1.5 bg-slate-400'
                        : 'w-1.5 bg-slate-200'
                    }`}
                    title={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono font-extrabold text-slate-400">
                {currentStepIndex + 1}/{totalSteps}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1.5">
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer min-h-[36px]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-md cursor-pointer active:scale-95 min-h-[36px]"
              >
                <span>{isLastStep ? 'Finish Tour' : currentStep.ctaText || 'Next'}</span>
                {isLastStep ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
