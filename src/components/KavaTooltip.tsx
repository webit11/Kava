import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ExternalLink, Video } from 'lucide-react';
import { TooltipItem } from '../types';
import { getStoredTooltips, trackTooltipView } from '../lib/onboarding';

interface KavaTooltipProps {
  id?: string;
  title?: string;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  children: React.ReactNode;
  icon?: boolean;
  disabled?: boolean;
  className?: string;
}

const VIEWPORT_PADDING = 12;

export default function KavaTooltip({
  id,
  title: customTitle,
  content: customContent,
  position: customPosition = 'top',
  children,
  disabled = false,
  className = ''
}: KavaTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTooltipData, setActiveTooltipData] = useState<TooltipItem | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const longPressTimer = useRef<any>(null);

  const [coords, setCoords] = useState<{ top: number; left: number; transformOrigin: string }>({
    top: 0,
    left: 0,
    transformOrigin: 'bottom center'
  });

  // Fetch or update tooltip metadata from central store if `id` is provided
  useEffect(() => {
    if (id) {
      const tooltips = getStoredTooltips();
      const matched = tooltips.find(t => t.id === id);
      if (matched) {
        setActiveTooltipData(matched);
      }
    }
  }, [id]);

  // Listen to external updates from Super Admin
  useEffect(() => {
    const handleUpdate = () => {
      if (id) {
        const tooltips = getStoredTooltips();
        const matched = tooltips.find(t => t.id === id);
        if (matched) {
          setActiveTooltipData(matched);
        }
      }
    };
    window.addEventListener('kava_tooltips_updated', handleUpdate);
    return () => window.removeEventListener('kava_tooltips_updated', handleUpdate);
  }, [id]);

  // Resolve final properties
  const isEnabled = activeTooltipData ? activeTooltipData.enabled : true;
  const finalTitle = customTitle || activeTooltipData?.title;
  const finalContent = customContent || activeTooltipData?.content;
  const finalPosition = customPosition || activeTooltipData?.position || 'top';

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    const tooltipWidth = tooltipRef.current?.offsetWidth || 220;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 80;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.top - tooltipHeight - 8;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let vOrigin = 'bottom';
    let hOrigin = 'center';

    if (finalPosition === 'bottom' || (top < VIEWPORT_PADDING && finalPosition === 'top')) {
      top = rect.bottom + 8;
      vOrigin = 'top';
    } else if (finalPosition === 'left') {
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - tooltipWidth - 8;
      vOrigin = 'center';
      hOrigin = 'right';
    } else if (finalPosition === 'right') {
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + 8;
      vOrigin = 'center';
      hOrigin = 'left';
    }

    // Viewport collision bounds clamp
    if (left < VIEWPORT_PADDING) {
      left = VIEWPORT_PADDING;
      hOrigin = 'left';
    } else if (left + tooltipWidth > viewportWidth - VIEWPORT_PADDING) {
      left = viewportWidth - tooltipWidth - VIEWPORT_PADDING;
      hOrigin = 'right';
    }

    if (top < VIEWPORT_PADDING) {
      top = VIEWPORT_PADDING;
    } else if (top + tooltipHeight > viewportHeight - VIEWPORT_PADDING) {
      top = viewportHeight - tooltipHeight - VIEWPORT_PADDING;
    }

    setCoords({
      top,
      left,
      transformOrigin: `${vOrigin} ${hOrigin}`
    });
  }, [finalPosition]);

  useEffect(() => {
    if (!isVisible) return;
    updatePosition();
    const raf = requestAnimationFrame(updatePosition);

    const handleScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    if (id) {
      trackTooltipView(id);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isVisible, updatePosition, id]);

  if (disabled || !isEnabled || !finalContent) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  // Mobile Touch handlers
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsVisible(true);
    }, 350);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`inline-block relative ${className}`}
      id={id ? `tooltip-host-${id}` : undefined}
    >
      {children}

      {isVisible &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                transformOrigin: coords.transformOrigin,
                zIndex: 999999
              }}
              className="w-64 bg-slate-900 text-white rounded-2xl shadow-2xl p-3 text-left border border-slate-800 pointer-events-none select-none"
            >
              <div className="flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {finalTitle && (
                    <h5 className="text-xs font-bold text-white tracking-wide">{finalTitle}</h5>
                  )}
                  <p className="text-[11px] text-slate-300 font-normal leading-relaxed">
                    {finalContent}
                  </p>

                  {activeTooltipData?.linkUrl && (
                    <div className="pt-1 flex items-center space-x-1 text-[10px] text-emerald-400 font-bold">
                      <span>Learn more</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}

                  {activeTooltipData?.videoUrl && (
                    <div className="pt-1 flex items-center space-x-1 text-[10px] text-sky-400 font-bold">
                      <Video className="w-3 h-3" />
                      <span>Watch video demo</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
