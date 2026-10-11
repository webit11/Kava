import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  Zap, 
  Headphones, 
  ChevronRight, 
  X,
  Play,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { isTourCompleted, DEFAULT_ONBOARDING_GUIDE } from '../lib/onboarding';

interface FloatingHelpMenuProps {
  onStartTour: () => void;
  onRestartTour: () => void;
  onOpenGuides?: () => void;
  onOpenWhatsNew?: () => void;
  onOpenHelpCenter?: () => void;
  currentStepIndex?: number;
  totalSteps?: number;
  userRole?: string;
  tourGuideId?: string;
  tourGuideVersion?: string;
}

export default function FloatingHelpMenu({
  onStartTour,
  onRestartTour,
  onOpenGuides,
  onOpenWhatsNew,
  onOpenHelpCenter,
  currentStepIndex: propStepIndex,
  totalSteps = 8,
  userRole = 'Host',
  tourGuideId = DEFAULT_ONBOARDING_GUIDE.id,
  tourGuideVersion = DEFAULT_ONBOARDING_GUIDE.version
}: FloatingHelpMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Read saved step index & completion status
  const [savedStep, setSavedStep] = useState<number>(0);
  const [tourCompleted, setTourCompleted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const isDone = isTourCompleted(tourGuideId, tourGuideVersion);
      setTourCompleted(isDone);
      const saved = localStorage.getItem(`kava_tour_step_${tourGuideId}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setSavedStep(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [isOpen, tourGuideId, tourGuideVersion]);

  const effectiveStep = propStepIndex !== undefined ? propStepIndex : savedStep;
  const isTourInProgress = effectiveStep > 0 && effectiveStep < totalSteps - 1 && !tourCompleted;

  // Close menu on click outside (both mousedown & touchstart)
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleStart = () => {
    setIsOpen(false);
    onStartTour();
  };

  const handleRestart = () => {
    setIsOpen(false);
    onRestartTour();
  };

  const handleGuides = () => {
    setIsOpen(false);
    if (onOpenGuides) onOpenGuides();
  };

  const handleWhatsNew = () => {
    setIsOpen(false);
    if (onOpenWhatsNew) onOpenWhatsNew();
  };

  const handleHelpCenter = () => {
    setIsOpen(false);
    if (onOpenHelpCenter) onOpenHelpCenter();
  };

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end pointer-events-auto font-sans" id="floating-help-widget">
      
      {/* Expanded Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mb-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-[26px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-slate-200/90 p-3 text-slate-800 text-left"
            id="popover-help-menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2.5 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 rounded-xl bg-slate-900 text-white shrink-0 shadow-xs">
                  <Compass className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase font-mono tracking-wider">
                    Help & Guides
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">Workspace Role: {userRole}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close help menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tour Status Banner */}
            {isTourInProgress ? (
              <div className="m-2 p-2.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-amber-300 font-mono uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Tour in Progress</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Step {effectiveStep + 1} of {totalSteps}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${((effectiveStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            ) : tourCompleted ? (
              <div className="m-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs flex items-center justify-between">
                <span className="font-bold text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Product Tour Completed</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">100%</span>
              </div>
            ) : null}

            {/* Menu Rows */}
            <div className="space-y-1 pt-1">
              
              {/* Option 1: Start/Continue Product Tour */}
              <button
                type="button"
                onClick={handleStart}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 active:scale-[0.99] transition-all group cursor-pointer text-left"
                id="btn-help-start-tour"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h5 className="text-xs font-extrabold text-slate-900 truncate">
                        {isTourInProgress ? 'Resume Product Tour' : 'Start Product Tour'}
                      </h5>
                      {isTourInProgress && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold font-mono">
                          Step {effectiveStep + 1}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Interactive workspace walkthrough</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {/* Option 2: Restart Tour */}
              <button
                type="button"
                onClick={handleRestart}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 active:scale-[0.99] transition-all group cursor-pointer text-left"
                id="btn-help-restart-tour"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <h5 className="text-xs font-extrabold text-slate-900 truncate">Restart Tour</h5>
                    <p className="text-[10px] text-slate-500 truncate">Reset & replay from Step 1</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {/* Option 3: View Guides */}
              <button
                type="button"
                onClick={handleGuides}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 active:scale-[0.99] transition-all group cursor-pointer text-left"
                id="btn-help-view-guides"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h5 className="text-xs font-extrabold text-slate-900 truncate">View Guides</h5>
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold font-mono">
                        Library
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Documentation & setup tutorials</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {/* Option 4: What's New */}
              <button
                type="button"
                onClick={handleWhatsNew}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 active:scale-[0.99] transition-all group cursor-pointer text-left"
                id="btn-help-whats-new"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h5 className="text-xs font-extrabold text-slate-900 truncate">What's New</h5>
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[9px] font-bold font-mono">
                        v2.4.2
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Changelog & latest release notes</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {/* Option 5: Help Center */}
              <button
                type="button"
                onClick={handleHelpCenter}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 active:scale-[0.99] transition-all group cursor-pointer text-left"
                id="btn-help-open-support"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <Headphones className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h5 className="text-xs font-extrabold text-slate-900 truncate">Help Center</h5>
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-bold font-mono">
                        24/7 Live
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Support tickets & ticket history</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-[0_10px_25px_rgba(0,0,0,0.25)] flex items-center space-x-2.5 transition-all cursor-pointer border border-slate-700/60 active:scale-95 group"
        id="btn-floating-help-tour"
        aria-label="Toggle Help & Guides menu"
      >
        <span className="p-1 rounded-full bg-slate-800 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
          <Compass className="w-4 h-4" />
        </span>
        <span className="text-xs font-extrabold tracking-tight">Help & Guides</span>
        {isTourInProgress && (
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        )}
      </button>

    </div>
  );
}
