import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MoreVertical, 
  Layers, 
  Settings, 
  Sparkles, 
  Share2, 
  Users, 
  FileText, 
  Archive, 
  Pause, 
  Play, 
  Trash2 
} from 'lucide-react';
import { KavaEvent } from '../types';

interface EventCardContextMenuProps {
  ev: KavaEvent;
  onSelectEvent: (ev: KavaEvent) => void;
  setIsEventLevel?: (val: boolean) => void;
  setActiveTab?: (tab: any) => void;
  handleDuplicate: (ev: KavaEvent) => void;
  handleShare: (ev: KavaEvent) => void;
  handleExport: (ev: KavaEvent) => void;
  handleStatusChange: (id: string, status: any) => void;
  handleDelete: (id: string) => void;
  buttonClassName?: string;
  iconClassName?: string;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const VIEWPORT_PADDING = 16;
const ESTIMATED_MENU_WIDTH = 216;
const ESTIMATED_MENU_HEIGHT = 380;

export default function EventCardContextMenu({
  ev,
  onSelectEvent,
  setIsEventLevel,
  setActiveTab,
  handleDuplicate,
  handleShare,
  handleExport,
  handleStatusChange,
  handleDelete,
  buttonClassName,
  iconClassName,
  isOpen: externalIsOpen,
  onToggle
}: EventCardContextMenuProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const setIsOpen = useCallback((val: boolean) => {
    if (isControlled) {
      onToggle?.(val);
    } else {
      setInternalIsOpen(val);
    }
  }, [isControlled, onToggle]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [coords, setCoords] = useState<{ top: number; left: number; transformOrigin: string }>({
    top: 0,
    left: 0,
    transformOrigin: 'top right'
  });

  // Calculate position with collision detection and automatic flipping
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();

    const menuWidth = menuRef.current?.offsetWidth || ESTIMATED_MENU_WIDTH;
    const menuHeight = menuRef.current?.offsetHeight || ESTIMATED_MENU_HEIGHT;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Determine vertical position (flip top/bottom)
    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;

    let top: number;
    let isFlippedVertically = false;

    if (menuHeight > spaceBelow && spaceAbove > spaceBelow) {
      // Position ABOVE button
      top = rect.top - menuHeight - 8;
      isFlippedVertically = true;
    } else {
      // Position BELOW button
      top = rect.bottom + 8;
      isFlippedVertically = false;
    }

    // Clamp vertical position within viewport bounds
    if (top < VIEWPORT_PADDING) {
      top = VIEWPORT_PADDING;
    } else if (top + menuHeight > viewportHeight - VIEWPORT_PADDING) {
      top = viewportHeight - VIEWPORT_PADDING - menuHeight;
    }

    // Determine horizontal position (align right or left with collision detection)
    let left = rect.right - menuWidth; // Right aligned by default
    let isFlippedHorizontally = false;

    if (left < VIEWPORT_PADDING) {
      left = rect.left; // Try left aligned
      if (left + menuWidth > viewportWidth - VIEWPORT_PADDING) {
        // Clamp to viewport padding
        left = viewportWidth - menuWidth - VIEWPORT_PADDING;
      }
      isFlippedHorizontally = true;
    } else if (left + menuWidth > viewportWidth - VIEWPORT_PADDING) {
      left = viewportWidth - menuWidth - VIEWPORT_PADDING;
    }

    // Clamp left within viewport bounds
    left = Math.max(VIEWPORT_PADDING, Math.min(left, viewportWidth - menuWidth - VIEWPORT_PADDING));

    const vOrigin = isFlippedVertically ? 'bottom' : 'top';
    const hOrigin = isFlippedHorizontally ? 'left' : 'right';

    setCoords({
      top,
      left,
      transformOrigin: `${vOrigin} ${hOrigin}`
    });
  }, []);

  // Update position when opening or when window resizes/scrolls
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    // Recompute on next frame to get exact rendered height/width
    const rafId = requestAnimationFrame(updatePosition);

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && buttonRef.current.contains(target)
      ) {
        return;
      }
      if (
        menuRef.current && menuRef.current.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  const defaultBtnClass = "h-8 w-8 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:scale-95";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={buttonClassName || defaultBtnClass}
        title="More actions"
        aria-label="Event context menu"
      >
        <MoreVertical className={iconClassName || "w-3.5 h-3.5"} />
      </button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.94, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                transformOrigin: coords.transformOrigin,
                zIndex: 99999
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-54 bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.14),0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 py-2 px-1 text-slate-700 select-none"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onSelectEvent(ev);
                  setIsEventLevel?.(true);
                  setActiveTab?.('overview');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-slate-700"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Open Dashboard</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onSelectEvent(ev);
                  setIsEventLevel?.(true);
                  setActiveTab?.('settings');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-slate-700"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Edit Configuration</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  handleDuplicate(ev);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Duplicate Capsule</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  handleShare(ev);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-slate-700"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Share Invite Link</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsEventLevel?.(false);
                  setActiveTab?.('team');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-slate-700"
              >
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Manage Team</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  handleExport(ev);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Export JSON Data</span>
              </button>

              <hr className="my-1.5 border-slate-100 mx-2" />

              {ev.status !== 'archived' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    handleStatusChange(ev.id, 'archived');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-slate-600"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Archive Capsule</span>
                </button>
              )}

              {ev.status === 'active' ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    handleStatusChange(ev.id, 'inactive');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-slate-600"
                >
                  <Pause className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Deactivate Capsule</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    handleStatusChange(ev.id, 'active');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 active:bg-emerald-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-emerald-600"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Activate Capsule</span>
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  handleDelete(ev.id);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-red-50 active:bg-red-100 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors cursor-pointer text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Delete Capsule</span>
              </button>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
