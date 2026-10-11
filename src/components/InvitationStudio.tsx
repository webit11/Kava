import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Grid, 
  Sliders, 
  Layout, 
  Type, 
  Palette, 
  QrCode, 
  FileText, 
  Printer, 
  Eye, 
  Image as ImageIcon, 
  Sparkles,
  ChevronRight,
  Info,
  ExternalLink,
  Smartphone,
  Share2,
  Tv,
  PenTool,
  Bookmark,
  Heart,
  Gift,
  Briefcase,
  Compass,
  Moon,
  Flower2,
  Camera,
  Upload,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { KavaEvent, KavaContribution } from '../types';
import { COVER_PRESETS } from '../data';
import { getEventGuestLink, generateQrCodeDataUrl } from '../lib/qrUtils';

interface InvitationStudioProps {
  event: KavaEvent;
  onUpdateEventSettings: (eventId: string, updated: Partial<KavaEvent>) => void;
}

type TemplateId = 'minimal' | 'elegant' | 'wedding' | 'birthday' | 'corporate' | 'modern' | 'dark' | 'floral' | 'polaroid';
type LayoutSize = 'A6' | 'A5' | 'A4' | 'Square' | 'TableTent' | 'Poster';
type AssetType = 'invitation' | 'table_card' | 'welcome' | 'table_tent' | 'social_post' | 'whatsapp_share' | 'projector';

// Helper to strip oklch colors before html2canvas and restore them afterward
const executeWithSafeStyles = async <T,>(action: () => Promise<T>): Promise<T> => {
  const backups: { element: HTMLStyleElement | HTMLLinkElement; disabled: boolean; originalContent?: string }[] = [];
  let tempStyle: HTMLStyleElement | null = null;
  const originalGetComputedStyle = window.getComputedStyle;

  const replaceOklColor = (val: string): string => {
    if (!val || typeof val !== 'string') return val;
    let clean = val;
    // Replace oklch(...)
    clean = clean.replace(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi, (match, lStr, cStr, hStr, aStr) => {
      try {
        const l = parseFloat(lStr);
        const a = aStr ? (aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;
        if (l > 0.8) return `rgba(255, 255, 255, ${a})`;
        if (l < 0.2) return `rgba(15, 23, 42, ${a})`;
        return `rgba(100, 116, 139, ${a})`;
      } catch (e) {
        return 'rgb(15, 23, 42)';
      }
    });
    // Replace oklab(...)
    clean = clean.replace(/oklab\(\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi, (match, lStr, aStrVal, bStrVal, aStr) => {
      try {
        const l = parseFloat(lStr);
        const a = aStr ? (aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;
        if (l > 0.8) return `rgba(255, 255, 255, ${a})`;
        if (l < 0.2) return `rgba(15, 23, 42, ${a})`;
        return `rgba(100, 116, 139, ${a})`;
      } catch (e) {
        return 'rgb(15, 23, 42)';
      }
    });
    // Fallback replacing any remaining oklch/oklab signatures
    clean = clean.replace(/oklch\([^)]+\)/gi, 'rgb(15, 23, 42)');
    clean = clean.replace(/oklab\([^)]+\)/gi, 'rgb(15, 23, 42)');
    return clean;
  };

  try {
    // Monkey patch window.getComputedStyle to intercept oklch/oklab color inquiries
    window.getComputedStyle = function (elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {
      const style = originalGetComputedStyle(elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === 'getPropertyValue') {
            return function (propertyName: string) {
              const originalVal = target.getPropertyValue(propertyName);
              if (originalVal && (originalVal.includes('oklch') || originalVal.includes('oklab'))) {
                return replaceOklColor(originalVal);
              }
              return originalVal;
            };
          }
          // Fetch directly from target to avoid internal slot errors on native CSSStyleDeclaration
          const val = target[prop as any];
          if (typeof val === 'string') {
            if (val.includes('oklch') || val.includes('oklab')) {
              return replaceOklColor(val);
            }
          } else if (typeof val === 'function') {
            return (val as any).bind(target);
          }
          return val;
        }
      }) as unknown as CSSStyleDeclaration;
    };

    let combinedCss = '';

    // 1. Process all <style> elements
    const styleElements = Array.from(document.querySelectorAll('style'));
    for (const style of styleElements) {
      combinedCss += '\n' + style.innerHTML;
      backups.push({
        element: style,
        disabled: style.disabled,
        originalContent: style.innerHTML
      });
      // Temporarily disable the original style
      style.disabled = true;
    }

    // 2. Process all <link rel="stylesheet"> elements
    const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    for (const link of linkElements) {
      backups.push({
        element: link,
        disabled: link.disabled
      });
      
      try {
        if (link.href && link.href.startsWith(window.location.origin)) {
          const res = await fetch(link.href);
          if (res.ok) {
            const cssText = await res.text();
            combinedCss += '\n' + cssText;
          }
        }
      } catch (e) {
        console.warn('Could not fetch stylesheet:', link.href, e);
      }
      
      // Temporarily disable the link
      link.disabled = true;
    }

    // 3. Replace all oklch(...) and oklab(...) references with a safe rgb fallback
    // e.g. oklch(0.15 0.02 240) -> rgb(15, 23, 42)
    let cleanedCss = combinedCss.replace(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi, (match, lStr, cStr, hStr, aStr) => {
      try {
        const l = parseFloat(lStr);
        const a = aStr ? (aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;
        
        // Approximate mapping based on lightness
        if (l > 0.8) return `rgba(255, 255, 255, ${a})`;
        if (l < 0.2) return `rgba(15, 23, 42, ${a})`;
        return `rgba(100, 116, 139, ${a})`;
      } catch (err) {
        return 'rgb(15, 23, 42)';
      }
    });

    cleanedCss = cleanedCss.replace(/oklab\(\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.%]+))?\s*\)/gi, (match, lStr, aStrVal, bStrVal, aStr) => {
      try {
        const l = parseFloat(lStr);
        const a = aStr ? (aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;
        
        if (l > 0.8) return `rgba(255, 255, 255, ${a})`;
        if (l < 0.2) return `rgba(15, 23, 42, ${a})`;
        return `rgba(100, 116, 139, ${a})`;
      } catch (err) {
        return 'rgb(15, 23, 42)';
      }
    });

    // Also replace any generic oklch(...) or oklab(...) that might not fit the regex exactly
    const fullyCleanedCss = cleanedCss
      .replace(/oklch\([^)]+\)/gi, 'rgb(15, 23, 42)')
      .replace(/oklab\([^)]+\)/gi, 'rgb(15, 23, 42)');

    // 4. Create temporary style element with cleaned CSS
    tempStyle = document.createElement('style');
    tempStyle.setAttribute('id', 'temp-html2canvas-safe-style');
    tempStyle.innerHTML = fullyCleanedCss;
    document.head.appendChild(tempStyle);

  } catch (error) {
    console.error('Error preparing safe styles for html2canvas:', error);
  }

  try {
    // Run the html2canvas drawing action
    return await action();
  } finally {
    // Restore window.getComputedStyle
    window.getComputedStyle = originalGetComputedStyle;

    // 5. Restore original styles
    if (tempStyle && tempStyle.parentNode) {
      tempStyle.parentNode.removeChild(tempStyle);
    }
    backups.forEach(backup => {
      backup.element.disabled = backup.disabled;
      if ('originalContent' in backup && backup.originalContent !== undefined) {
        (backup.element as HTMLStyleElement).innerHTML = backup.originalContent;
      }
    });
  }
};

export function InvitationStudio({ event, onUpdateEventSettings }: InvitationStudioProps) {
  // State for customizations
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('minimal');
  const [layoutSize, setLayoutSize] = useState<LayoutSize>('A6');
  const [assetType, setAssetType] = useState<AssetType>('invitation');
  
  // Custom design overrides
  const [eventTitle, setEventTitle] = useState(event.name);
  const [eventDate, setEventDate] = useState(event.date);
  const [eventLocation, setEventLocation] = useState(event.location);
  const [welcomeMessage, setWelcomeMessage] = useState('We invite you to share in our joy. Scan the code below to instantly contribute your memories to our live high-fidelity digital capsule.');
  const [footerText, setFooterText] = useState('Please scan the code. No app or registration required.');
  const [optionalInstructions, setOptionalInstructions] = useState('Capture photos, record voice voicemails, or write wishes directly from your mobile browser!');
  const [eventCode, setEventCode] = useState(event.code);
  const [customShortSlug, setCustomShortSlug] = useState(event.code.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
  const [eventLink, setEventLink] = useState(getEventGuestLink(event));

  // Keep invitation link and code synced with event props
  useEffect(() => {
    setEventCode(event.code);
    setEventLink(getEventGuestLink(event));
  }, [event.code, event.settings?.invitationToken]);
  
  // Visual Overrides
  const [coverUrl, setCoverUrl] = useState(event.coverUrl || COVER_PRESETS[0]);
  const [coverPositionY, setCoverPositionY] = useState(event.coverPositionY ?? 50);
  const [logoUrl, setLogoUrl] = useState('');
  const [qrSize, setQrSize] = useState(140); // px
  const [qrPosition, setQrPosition] = useState<'center' | 'bottom' | 'split'>('center');
  const [showBleedGuides, setShowBleedGuides] = useState(false);
  const [showCropMarks, setShowCropMarks] = useState(false);
  
  // Active typography category
  const [typography, setTypography] = useState<'serif' | 'sans' | 'display' | 'playful' | 'mono'>('sans');
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  const [accentColor, setAccentColor] = useState('#64748b');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Extended DESIGN states
  const [backgroundType, setBackgroundType] = useState<'solid' | 'gradient' | 'image'>('image');
  const [gradientStart, setGradientStart] = useState('#FAF6F0');
  const [gradientEnd, setGradientEnd] = useState('#FFEAD2');
  const [gradientDirection, setGradientDirection] = useState<string>('to bottom');
  const [recentColors, setRecentColors] = useState<string[]>([
    '#ffffff', '#000000', '#FAF6F0', '#FFFBF9', '#FFFDF0', '#F8FAFC', '#09090b', '#d4af37', '#64748b'
  ]);
  const [fillMode, setFillMode] = useState<'fill' | 'contain' | 'cover' | 'stretch'>('cover');
  const [imagePosition, setImagePosition] = useState<string>('center');
  const [imageScale, setImageScale] = useState<number>(100);
  const [imageRotate, setImageRotate] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [overlayType, setOverlayType] = useState<'none' | 'light' | 'dark' | 'custom'>('none');
  const [overlayColor, setOverlayColor] = useState<string>('#000000');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(40);
  const [headerHeight, setHeaderHeight] = useState<'25%' | '35%' | '45%' | '60%'>('35%');
  const [minimalCanvas, setMinimalCanvas] = useState<boolean>(false);

  // Extended LAYOUT states
  const [layoutMargin, setLayoutMargin] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [blockSpacing, setBlockSpacing] = useState<'compact' | 'normal' | 'relaxed'>('normal');

  // Extended EXPORT states
  const [exportDpi, setExportDpi] = useState<number>(300);
  
  // State for generated elements
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeControlTab, setActiveControlTab] = useState<'template' | 'design' | 'content' | 'layout' | 'export'>('template');
  const [showDesignMore, setShowDesignMore] = useState(false);
  const [showContentMore, setShowContentMore] = useState(false);
  const [showLayoutMore, setShowLayoutMore] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const previewCardRef = useRef<HTMLDivElement>(null);

  // Define Template Presets
  const templatesConfig: Record<TemplateId, {
    name: string;
    description: string;
    bgColor: string;
    primaryColor: string;
    accentColor: string;
    typography: 'serif' | 'sans' | 'display' | 'playful' | 'mono';
    styles: string;
  }> = {
    minimal: {
      name: 'Studio Minimal',
      description: 'Sophisticated typography, generous whitespace, sharp lines.',
      bgColor: '#ffffff',
      primaryColor: '#000000',
      accentColor: '#4b5563',
      typography: 'sans',
      styles: 'border border-slate-100 tracking-tight'
    },
    elegant: {
      name: 'Ivory Classical',
      description: 'Golden frame lines, luxury warmth, and serif display.',
      bgColor: '#FAF6F0',
      primaryColor: '#1c1917',
      accentColor: '#c5a880',
      typography: 'serif',
      styles: 'border-double border-4 border-[#c5a880]'
    },
    wedding: {
      name: 'Blush Botanical',
      description: 'Soft pastel hues, botanical curves, romantic aura.',
      bgColor: '#FFFBF9',
      primaryColor: '#3a2e2b',
      accentColor: '#d4af37',
      typography: 'serif',
      styles: 'border border-[#f5e3dc] rounded-2xl'
    },
    birthday: {
      name: 'Solar Fest',
      description: 'Energetic contrast, warm modern glow, star glyphs.',
      bgColor: '#FFFDF0',
      primaryColor: '#c2410c',
      accentColor: '#f97316',
      typography: 'playful',
      styles: 'border-2 border-dashed border-orange-200'
    },
    corporate: {
      name: 'Steel Corporate',
      description: 'Geometric layouts, clinical grids, technical slate.',
      bgColor: '#F8FAFC',
      primaryColor: '#0f172a',
      accentColor: '#2563eb',
      typography: 'sans',
      styles: 'border-t-8 border-blue-600'
    },
    modern: {
      name: 'Neo Brutalist',
      description: 'Thick visual blocks, heavy black lines, electric pop.',
      bgColor: '#FAFAFA',
      primaryColor: '#000000',
      accentColor: '#ec4899',
      typography: 'mono',
      styles: 'border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
    },
    dark: {
      name: 'Obsidian Premium',
      description: 'Pure copper text overlays on rich pitch-black canvas.',
      bgColor: '#09090b',
      primaryColor: '#fafafa',
      accentColor: '#d97706',
      typography: 'serif',
      styles: 'border border-zinc-800/80 shadow-[inset_0_1px_30px_rgba(255,255,255,0.02)]'
    },
    floral: {
      name: 'Sage Meadow',
      description: 'Organic botanical watercolors, sage border, delicate.',
      bgColor: '#F4F7F4',
      primaryColor: '#1e293b',
      accentColor: '#16a34a',
      typography: 'serif',
      styles: 'border-4 border-sage rounded-[32px] border-[#d1e2d1]'
    },
    polaroid: {
      name: 'Vintage Snapshot',
      description: 'Retro cardboard backing with floating polaroid slots.',
      bgColor: '#FDFBF7',
      primaryColor: '#18181b',
      accentColor: '#71717a',
      typography: 'mono',
      styles: 'border border-stone-200 shadow-sm'
    }
  };

  // Keep colors & typography in sync when template changes
  useEffect(() => {
    const config = templatesConfig[selectedTemplate];
    if (config) {
      setBgColor(config.bgColor);
      setPrimaryColor(config.primaryColor);
      setAccentColor(config.accentColor);
      setTypography(config.typography);
    }
  }, [selectedTemplate]);

  // Synchronize generated branded QR Code when parameters or master branding shift
  useEffect(() => {
    let isCurrent = true;
    generateQrCodeDataUrl(eventLink, 450, { foregroundColor: primaryColor }).then(url => {
      if (isCurrent && url) {
        setQrCodeDataUrl(url);
      }
    }).catch(err => {
      console.error('QR code generation failed:', err);
    });

    const handleBrandingUpdate = () => {
      generateQrCodeDataUrl(eventLink, 450, { foregroundColor: primaryColor }).then(url => {
        if (isCurrent && url) setQrCodeDataUrl(url);
      });
    };

    window.addEventListener('kava_qr_config_updated', handleBrandingUpdate);
    return () => {
      isCurrent = false;
      window.removeEventListener('kava_qr_config_updated', handleBrandingUpdate);
    };
  }, [eventLink, primaryColor]);

  const addRecentColor = (color: string) => {
    if (color && !recentColors.includes(color)) {
      setRecentColors(prev => [color, ...prev.slice(0, 11)]);
    }
  };

  const getOverlayStyle = () => {
    if (overlayType === 'none') return 'transparent';
    const alpha = overlayOpacity / 100;
    if (overlayType === 'light') return `rgba(255, 255, 255, ${alpha})`;
    if (overlayType === 'dark') return `rgba(0, 0, 0, ${alpha})`;
    
    try {
      const hex = overlayColor || '#000000';
      const r = parseInt(hex.slice(1, 3), 16) || 0;
      const g = parseInt(hex.slice(3, 5), 16) || 0;
      const b = parseInt(hex.slice(5, 7), 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (e) {
      return `rgba(0, 0, 0, ${alpha})`;
    }
  };

  // Handle local image upload for cover
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCoverUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image upload for custom logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setLogoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Save Cover and details back to digital event settings
  const handleSyncWithDigitalCapsule = () => {
    onUpdateEventSettings(event.id, {
      name: eventTitle,
      date: eventDate,
      location: eventLocation,
      coverUrl: coverUrl,
      coverPositionY: coverPositionY
    });
    alert("Physical design specs synchronized perfectly with your Live Digital Memory Capsule!");
  };

  // Real offline PDF generator
  const exportPDF = async () => {
    const element = previewCardRef.current;
    if (!element) return;
    setIsExporting(true);
    try {
      const canvas = await executeWithSafeStyles(async () => {
        return await html2canvas(element, {
          scale: 2.5,
          useCORS: true,
          backgroundColor: bgColor
        });
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [canvas.width * 0.264583, canvas.height * 0.264583]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`kava-invite-print-${event.code.toLowerCase()}-${layoutSize.toLowerCase()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate high-resolution PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Real offline Image exporter
  const exportImage = async (format: 'png' | 'jpg') => {
    const element = previewCardRef.current;
    if (!element) return;
    setIsExporting(true);
    try {
      const canvas = await executeWithSafeStyles(async () => {
        return await html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: bgColor
        });
      });
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `kava-invite-${event.code.toLowerCase()}-${layoutSize.toLowerCase()}.${format}`;
      link.click();
    } catch (error) {
      console.error('Image export failed:', error);
      alert('Failed to generate high-resolution image file.');
    } finally {
      setIsExporting(false);
    }
  };

  // Real vector SVG exporter
  const exportSVG = () => {
    const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="100%" height="100%" style="font-family: system-ui, -apple-system, sans-serif;">
      <!-- Background -->
      <rect width="100%" height="100%" fill="${bgColor}" />
      
      <!-- Styled Double Frame if elegant -->
      ${selectedTemplate === 'elegant' ? `
        <rect x="15" y="15" width="470" height="670" fill="none" stroke="${accentColor}" stroke-width="2" />
        <rect x="22" y="22" width="456" height="656" fill="none" stroke="${accentColor}" stroke-width="1" />
      ` : ''}

      ${selectedTemplate === 'modern' ? `
        <rect x="10" y="10" width="480" height="680" fill="none" stroke="#000" stroke-width="4" />
      ` : ''}

      ${selectedTemplate === 'floral' ? `
        <rect x="15" y="15" width="470" height="670" fill="none" stroke="#d1e2d1" stroke-width="6" rx="20" />
      ` : ''}
      
      <!-- Layout Title -->
      <text x="250" y="70" font-size="28" font-weight="bold" fill="${primaryColor}" text-anchor="middle" letter-spacing="1">
        ${eventTitle.toUpperCase()}
      </text>
      
      <text x="250" y="110" font-size="14" fill="${accentColor}" text-anchor="middle" font-weight="600">
        ${eventDate} • ${eventLocation}
      </text>

      <!-- Welcome Message wrapped in SVG foreignObject for flawless text wrap -->
      <foreignObject x="50" y="140" width="400" height="120">
        <p xmlns="http://www.w3.org/1999/xhtml" style="color: ${primaryColor}cc; font-size: 11px; line-height: 1.6; text-align: center; margin: 0; font-family: inherit;">
          ${welcomeMessage}
        </p>
      </foreignObject>

      <!-- Optional instructions -->
      <foreignObject x="50" y="240" width="400" height="80">
        <p xmlns="http://www.w3.org/1999/xhtml" style="color: ${accentColor}; font-size: 10px; line-height: 1.4; text-align: center; font-weight: bold; margin: 0; font-family: inherit;">
          ${optionalInstructions}
        </p>
      </foreignObject>
      
      <!-- Embedded QR Code -->
      <image x="${250 - qrSize/2}" y="340" width="${qrSize}" height="${qrSize}" href="${qrCodeDataUrl}" />
      
      <!-- Code Box -->
      <rect x="160" y="525" width="180" height="35" fill="${bgColor}" stroke="${accentColor}" stroke-width="1" rx="6" />
      <text x="250" y="547" font-size="11" font-weight="bold" fill="${primaryColor}" text-anchor="middle" font-family="monospace">
        EVENT CODE: ${eventCode}
      </text>
      
      <text x="250" y="590" font-size="12" font-weight="600" fill="${primaryColor}" text-anchor="middle">
        ${eventLink}
      </text>

      <text x="250" y="630" font-size="10" fill="${accentColor}" text-anchor="middle">
        ${footerText}
      </text>
    </svg>
    `;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kava-invite-vector-${event.code.toLowerCase()}.svg`;
    link.click();
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `kava-qr-${event.code.toLowerCase()}.png`;
    link.click();
  };

  // CSS Font Selector helpers
  const getFontClass = () => {
    switch (typography) {
      case 'serif':
        return 'font-serif tracking-normal';
      case 'mono':
        return 'font-mono tracking-tight';
      case 'display':
        return 'font-sans font-black uppercase tracking-widest';
      case 'playful':
        return 'font-sans tracking-wide leading-relaxed font-bold';
      default:
        return 'font-sans tracking-tight';
    }
  };

  // Layout Ratios for previews on desktop
  const getLayoutDimensions = () => {
    switch (layoutSize) {
      case 'A5':
        return { width: 'w-[400px]', height: 'h-[565px]', label: 'A5 (148 x 210mm)' };
      case 'A4':
        return { width: 'w-[420px]', height: 'h-[594px]', label: 'A4 (210 x 297mm)' };
      case 'Square':
        return { width: 'w-[400px]', height: 'h-[400px]', label: 'Square (140 x 140mm)' };
      case 'TableTent':
        return { width: 'w-[480px]', height: 'h-[600px]', label: 'Table Tent (Foldable)' };
      case 'Poster':
        return { width: 'w-[430px]', height: 'h-[610px]', label: 'A2 Event Poster' };
      default: // A6
        return { width: 'w-[370px]', height: 'h-[522px]', label: 'A6 (105 x 148mm)' };
    }
  };

  const currentLayoutSpec = getLayoutDimensions();

  // Switch to different matching asset views
  const applyAssetConfiguration = (type: AssetType) => {
    setAssetType(type);
    switch (type) {
      case 'table_card':
        setLayoutSize('Square');
        setWelcomeMessage('Welcome to our celebration table!');
        setOptionalInstructions('Scan code to share photos at this table!');
        break;
      case 'welcome':
        setLayoutSize('Poster');
        setWelcomeMessage('Welcome to the Wedding of Sofia and Leo');
        setOptionalInstructions('We are so happy you are here! Scan to upload raw memories to our timeline.');
        break;
      case 'table_tent':
        setLayoutSize('TableTent');
        setWelcomeMessage('Scan & Share Memories');
        setOptionalInstructions('No App Required. Photos, voices, and wishes stream live to the screen.');
        break;
      case 'social_post':
        setLayoutSize('Square');
        setWelcomeMessage('Can’t wait to celebrate! Drop your wishes early by scanning below.');
        break;
      case 'whatsapp_share':
        setLayoutSize('A4'); // fits standard vertical
        setWelcomeMessage('Scan or click to view Sofia & Leo’s Live Memory Capsule!');
        break;
      case 'projector':
        setLayoutSize('A4');
        setWelcomeMessage('Sofia & Leo’s Memory Capsule is Live!');
        setOptionalInstructions('Scan this code right now with your phone camera to participate!');
        break;
      default:
        setLayoutSize('A6');
        setWelcomeMessage('We invite you to share in our joy. Scan the code below to instantly contribute your memories to our live high-fidelity digital capsule.');
        setOptionalInstructions('Capture photos, record voice voicemails, or write wishes directly from your mobile browser!');
        break;
    }
  };

  // Layout class calculations
  const paddingClass = 
    layoutMargin === 'compact' ? 'p-4 sm:p-5' :
    layoutMargin === 'relaxed' ? 'p-8 sm:p-10' :
    'p-6 sm:p-8';

  const alignmentClass = 
    textAlignment === 'left' ? 'text-left items-start' :
    textAlignment === 'right' ? 'text-right items-end' :
    'text-center items-center';

  const spacingClass = 
    blockSpacing === 'compact' ? 'space-y-2' :
    blockSpacing === 'relaxed' ? 'space-y-6' :
    'space-y-4';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,_400px)_minmax(0,_1fr)] gap-8 text-left items-stretch animate-fade-in">
      
      {/* Left Config Panel - true KAVA Studio Layout with fixed height & sticky footer */}
      <div className="w-full bg-white border border-slate-100 rounded-[32px] shadow-xs flex flex-col h-[82vh] lg:h-[85vh] overflow-hidden">
        
        {/* Section 0: Info Header - stationary */}
        <div className="p-5 pb-3 border-b border-slate-100 shrink-0 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <PenTool className="w-4 h-4 text-slate-800" />
              <span>Invitation Studio</span>
            </h3>
            <span className="bg-slate-900 text-white text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Print Hub</span>
          </div>
          <p className="text-[10px] text-slate-500 font-normal leading-relaxed">
            Design professional-grade matching posters, cards, table tents, and signs.
          </p>
        </div>

        {/* Sub Navigation tabs - stationary segmented control */}
        <div className="px-5 pt-3 pb-1 shrink-0">
          <div className="grid grid-cols-5 bg-slate-50 border border-slate-100 p-1 rounded-2xl shrink-0 gap-0.5">
            {[
              { id: 'template', label: 'Style' },
              { id: 'design', label: 'Design' },
              { id: 'content', label: 'Content' },
              { id: 'layout', label: 'Layout' },
              { id: 'export', label: 'Export' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveControlTab(tab.id as any)}
                className={`py-2 text-center text-[8px] sm:text-[9px] md:text-[8px] xl:text-[9.5px] uppercase font-bold tracking-tight transition-all rounded-xl cursor-pointer truncate px-0.5 ${
                  activeControlTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-800'
                }`}
                title={tab.id === 'template' ? 'Style Theme' : tab.id === 'content' ? 'Content Copy' : tab.id === 'design' ? 'Design Accents' : tab.id === 'layout' ? 'Print Layout' : 'Export Asset'}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Tab Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-3 custom-scrollbar min-h-0 space-y-4">

          {/* TAB CONTENT: STYLE (TEMPLATES) */}
          {activeControlTab === 'template' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Atmosphere presets</span>
                <h4 className="text-xs font-bold text-slate-800">Select Design Style</h4>
              </div>

              {/* Grid with compact icon-based cards */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {Object.entries(templatesConfig).map(([id, cfg]) => {
                  const isSelected = selectedTemplate === id;
                  
                  // Pick corresponding icon
                  let IconComponent = FileText;
                  if (id === 'elegant') IconComponent = Sparkles;
                  else if (id === 'wedding') IconComponent = Heart;
                  else if (id === 'birthday') IconComponent = Gift;
                  else if (id === 'corporate') IconComponent = Briefcase;
                  else if (id === 'modern') IconComponent = Compass;
                  else if (id === 'dark') IconComponent = Moon;
                  else if (id === 'floral') IconComponent = Flower2;
                  else if (id === 'polaroid') IconComponent = Camera;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedTemplate(id as TemplateId)}
                      className={`flex flex-col items-center justify-between p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-900 border-transparent text-white shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-col items-center mt-1">
                        <IconComponent className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                        <span className="text-[8.5px] font-bold uppercase tracking-tight block truncate w-full max-w-[80px]">
                          {cfg.name.replace('Studio ', '').replace('Ivory ', '').replace('Blush ', '').replace('Solar ', '').replace('Steel ', '').replace('Neo ', '').replace('Obsidian ', '').replace('Sage ', '').replace('Vintage ', '')}
                        </span>
                      </div>
                      
                      {/* Compact Palette indicator */}
                      <div className="flex space-x-0.5 mt-2">
                        <span className="w-2 h-2 rounded-full border border-slate-300/30" style={{ backgroundColor: cfg.bgColor }} />
                        <span className="w-2 h-2 rounded-full border border-slate-300/30" style={{ backgroundColor: cfg.primaryColor }} />
                        <span className="w-2 h-2 rounded-full border border-slate-300/30" style={{ backgroundColor: cfg.accentColor }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Small "Current Style" summary */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2 text-left mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Current Style Summary</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/5 text-slate-800 text-[8px] font-mono font-bold uppercase tracking-wider">{typography} font</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-slate-800">{templatesConfig[selectedTemplate].name}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-light">{templatesConfig[selectedTemplate].description}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1 text-[8.5px] font-mono text-slate-500">
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full border border-slate-300" style={{ backgroundColor: bgColor }} />
                    <span>BG: {bgColor.toUpperCase()}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full border border-slate-300" style={{ backgroundColor: primaryColor }} />
                    <span>PRI: {primaryColor.toUpperCase()}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full border border-slate-300" style={{ backgroundColor: accentColor }} />
                    <span>ACC: {accentColor.toUpperCase()}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: DESIGN ACCENTS */}
          {activeControlTab === 'design' && (
            <div className="space-y-4 text-xs font-semibold animate-fade-in">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Visual Editor</span>
                <h4 className="text-xs font-bold text-slate-800">Visual Styling & Backdrop</h4>
              </div>

              {/* 1. Background Type Selection */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Backdrop Type</label>
                <div className="grid grid-cols-3 bg-slate-50 border border-slate-100 p-1 rounded-xl gap-0.5">
                  {[
                    { id: 'solid', label: 'Solid Color' },
                    { id: 'gradient', label: 'Gradient' },
                    { id: 'image', label: 'Cover Image' }
                  ].map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setBackgroundType(type.id as any)}
                      className={`py-1.5 text-center text-[9px] uppercase font-bold tracking-tight transition-all rounded-lg cursor-pointer ${
                        backgroundType === type.id 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Dynamic Color Picker/Gradient Editor Panel */}
              {backgroundType === 'solid' && (
                <div className="space-y-3 p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block text-left">Solid Backdrop Colors</span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-bold text-slate-500">Background</label>
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => { setBgColor(e.target.value); addRecentColor(e.target.value); }}
                        className="w-full h-8 bg-transparent cursor-pointer rounded overflow-hidden border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-bold text-slate-500">Primary Text</label>
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => { setPrimaryColor(e.target.value); addRecentColor(e.target.value); }}
                        className="w-full h-8 bg-transparent cursor-pointer rounded overflow-hidden border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-bold text-slate-500">Accent Frame</label>
                      <input 
                        type="color" 
                        value={accentColor} 
                        onChange={(e) => { setAccentColor(e.target.value); addRecentColor(e.target.value); }}
                        className="w-full h-8 bg-transparent cursor-pointer rounded overflow-hidden border border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Recent Colors list */}
                  <div className="space-y-1 pt-1 text-left">
                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Recent Colors</span>
                    <div className="flex flex-wrap gap-1.5">
                      {recentColors.map((color, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { setBgColor(color); }}
                          style={{ backgroundColor: color }}
                          className="w-5 h-5 rounded-full border border-slate-300 shadow-3xs cursor-pointer hover:scale-110 active:scale-95 transition-all"
                          title="Click to apply as Background"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {backgroundType === 'gradient' && (
                <div className="space-y-3 p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block text-left">Gradient Backdrop Editor</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-bold text-slate-500">Start Color</label>
                      <input 
                        type="color" 
                        value={gradientStart} 
                        onChange={(e) => { setGradientStart(e.target.value); addRecentColor(e.target.value); }}
                        className="w-full h-8 bg-transparent cursor-pointer rounded overflow-hidden border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-bold text-slate-500">End Color</label>
                      <input 
                        type="color" 
                        value={gradientEnd} 
                        onChange={(e) => { setGradientEnd(e.target.value); addRecentColor(e.target.value); }}
                        className="w-full h-8 bg-transparent cursor-pointer rounded overflow-hidden border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-slate-500">Direction</label>
                    <select
                      value={gradientDirection}
                      onChange={(e) => setGradientDirection(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                    >
                      <option value="to bottom">To Bottom (Vertical)</option>
                      <option value="to right">To Right (Horizontal)</option>
                      <option value="to bottom right">To Bottom Right (Diagonal)</option>
                      <option value="to bottom left">To Bottom Left</option>
                      <option value="to top">To Top</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 3. Minimal Canvas Toggle Option */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/60 border border-slate-100 rounded-2xl">
                <div className="space-y-0.5 text-left">
                  <span className="text-xs font-bold text-slate-800 block">Minimal Canvas</span>
                  <span className="text-[9px] text-slate-500 font-light block font-normal leading-normal">Pure layout typography with no cover image</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMinimalCanvas(!minimalCanvas)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-100 ${minimalCanvas ? 'bg-slate-900' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${minimalCanvas ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* 4. Cover Image Upload & Customizations (Visible if backgroundType is image and minimalCanvas is false) */}
              {backgroundType === 'image' && !minimalCanvas && (
                <div className="space-y-4 pt-1 animate-fade-in">
                  
                  {/* Preset cover picture selector */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Preset Cover Art</label>
                    <div className="grid grid-cols-6 gap-2">
                      {COVER_PRESETS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCoverUrl(url)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            coverUrl === url ? 'border-slate-950 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload, Replace and Remove Options */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block text-left">Image Source</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {/* Upload / Replace button */}
                      <div className="relative h-[36px] bg-white hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-700 cursor-pointer transition-all shadow-2xs">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="flex items-center space-x-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{coverUrl ? 'Replace file' : 'Choose file'}</span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => setCoverUrl('')}
                        disabled={!coverUrl}
                        className="h-[36px] bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 border border-red-100 rounded-xl flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        <span>Remove Art</span>
                      </button>
                    </div>

                    {/* URL Input */}
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Or Custom Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={coverUrl.startsWith('data:') ? '' : coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  {/* Scale, Rotate, Position, Fit Controls */}
                  {coverUrl && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block text-left">Fitting & Alignment</span>
                      
                      {/* Fill mode */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Fill Mode</label>
                        <div className="grid grid-cols-4 bg-white border border-slate-200 p-0.5 rounded-lg">
                          {[
                            { id: 'cover', label: 'Cover' },
                            { id: 'contain', label: 'Contain' },
                            { id: 'fill', label: 'Fill' },
                            { id: 'stretch', label: 'Stretch' }
                          ].map(mode => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setFillMode(mode.id as any)}
                              className={`py-1 rounded text-[8.5px] font-bold uppercase text-center cursor-pointer transition-all ${
                                fillMode === mode.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Image Position */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Image Anchor Position</label>
                        <div className="grid grid-cols-5 bg-white border border-slate-200 p-0.5 rounded-lg">
                          {[
                            { id: 'top', label: 'Top' },
                            { id: 'center', label: 'Center' },
                            { id: 'bottom', label: 'Bottom' },
                            { id: 'left', label: 'Left' },
                            { id: 'right', label: 'Right' }
                          ].map(pos => (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => setImagePosition(pos.id)}
                              className={`py-1 rounded text-[8.5px] font-bold uppercase text-center cursor-pointer transition-all ${
                                imagePosition === pos.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scale Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-500 uppercase font-mono">Image Zoom Scale</span>
                          <span className="font-bold font-mono text-slate-900">{imageScale}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="200" 
                          value={imageScale}
                          onChange={(e) => setImageScale(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>

                      {/* Rotate Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-500 uppercase font-mono">Image Rotation</span>
                          <span className="font-bold font-mono text-slate-900">{imageRotate}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="-180" 
                          max="180" 
                          value={imageRotate}
                          onChange={(e) => setImageRotate(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* CSS Filters */}
                  {coverUrl && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3.5">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block text-left">Image Enhancement Filters</span>
                      
                      {/* Brightness */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9.5px]">
                          <span className="font-bold text-slate-500 uppercase font-mono">Brightness</span>
                          <span className="font-bold font-mono text-slate-900">{brightness}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="150" 
                          value={brightness}
                          onChange={(e) => setBrightness(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>

                      {/* Contrast */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9.5px]">
                          <span className="font-bold text-slate-500 uppercase font-mono">Contrast</span>
                          <span className="font-bold font-mono text-slate-900">{contrast}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="150" 
                          value={contrast}
                          onChange={(e) => setContrast(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>

                      {/* Saturation */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9.5px]">
                          <span className="font-bold text-slate-500 uppercase font-mono">Saturation</span>
                          <span className="font-bold font-mono text-slate-900">{saturation}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="150" 
                          value={saturation}
                          onChange={(e) => setSaturation(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>

                      {/* Blur */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9.5px]">
                          <span className="font-bold text-slate-500 uppercase font-mono">Soft Focus / Blur</span>
                          <span className="font-bold font-mono text-slate-900">{blur}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="20" 
                          value={blur}
                          onChange={(e) => setBlur(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Overlays */}
                  {coverUrl && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block text-left">Readability Overlay Mask</span>
                      
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Overlay Tone</label>
                        <div className="grid grid-cols-4 bg-white border border-slate-200 p-0.5 rounded-lg">
                          {[
                            { id: 'none', label: 'None' },
                            { id: 'light', label: 'Light' },
                            { id: 'dark', label: 'Dark' },
                            { id: 'custom', label: 'Custom' }
                          ].map(mode => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setOverlayType(mode.id as any)}
                              className={`py-1 rounded text-[8.5px] font-bold uppercase text-center cursor-pointer transition-all ${
                                overlayType === mode.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {overlayType === 'custom' && (
                        <div className="space-y-1 text-left pt-1">
                          <label className="text-[9px] font-bold text-slate-500">Custom Mask Color</label>
                          <input 
                            type="color" 
                            value={overlayColor} 
                            onChange={(e) => setOverlayColor(e.target.value)}
                            className="w-full h-8 bg-transparent cursor-pointer rounded overflow-hidden border border-slate-200"
                          />
                        </div>
                      )}

                      {overlayType !== 'none' && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-500 uppercase font-mono">Overlay Opacity</span>
                            <span className="font-bold font-mono text-slate-900">{overlayOpacity}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={overlayOpacity}
                            onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Header Height options (25%, 35%, 45%, 60%) */}
                  {coverUrl && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block text-left">Header Scale Height</span>
                      
                      <div className="grid grid-cols-4 bg-white border border-slate-200 p-0.5 rounded-lg">
                        {['25%', '35%', '45%', '60%'].map(h => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setHeaderHeight(h as any)}
                            className={`py-1 rounded text-[9px] font-bold text-center cursor-pointer transition-all ${
                              headerHeight === h ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: CONTENT */}
          {activeControlTab === 'content' && (
            <div className="space-y-4 text-xs font-semibold animate-fade-in">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Copy & Typography</span>
                <h4 className="text-xs font-bold text-slate-800 text-left">Invitation Core Elements</h4>
              </div>

              <div className="space-y-3">
                {/* Logo Section */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Branding Logo / Initials (URL)</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="https://example.com/logo.png"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400"
                    />
                    <div className="relative h-[34px] px-3 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-700 cursor-pointer transition-all">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span className="truncate max-w-[80px]">Upload</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Invitation Title</label>
                  <input 
                    type="text" 
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-950"
                  />
                </div>

                {/* Subtitle / Instructions */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Invitation Subtitle (Instructions)</label>
                  <input 
                    type="text" 
                    value={optionalInstructions}
                    onChange={(e) => setOptionalInstructions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-950"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Invitation Description (Welcome Message)</label>
                  <textarea 
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-slate-950 leading-normal"
                  />
                </div>

                {/* Date & Venue (Location) */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Event Date</label>
                    <input 
                      type="text" 
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-950"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Event Venue (Location)</label>
                    <input 
                      type="text" 
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>

                {/* QR Code link & Code identifier */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Join Link URL</label>
                    <input 
                      type="url" 
                      value={eventLink}
                      onChange={(e) => setEventLink(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Code Identifier</label>
                    <input 
                      type="text" 
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                {/* Footer text */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Footer Description</label>
                  <input 
                    type="text" 
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-950"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PHYSICAL PRINT LAYOUT */}
          {activeControlTab === 'layout' && (
            <div className="space-y-4 text-xs font-semibold animate-fade-in">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Structure & Position</span>
                <h4 className="text-xs font-bold text-slate-800 text-left">Print Margins & Page Setup</h4>
              </div>

              {/* 1. Page Size / Target Dimensions */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Page Size</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['A6', 'A5', 'A4', 'Square', 'TableTent', 'Poster'] as const).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setLayoutSize(size);
                        setAssetType('invitation'); // reset asset mode
                      }}
                      className={`py-2 rounded-xl border text-center font-bold text-[10px] cursor-pointer transition-all ${
                        layoutSize === size && assetType === 'invitation'
                          ? 'border-slate-900 bg-slate-900 text-white font-extrabold shadow-2xs' 
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {size === 'TableTent' ? 'Table Tent' : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Margins */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Margins Padding</label>
                <div className="grid grid-cols-3 bg-slate-50 border border-slate-100 p-1 rounded-xl gap-0.5">
                  {[
                    { id: 'compact', label: 'Compact' },
                    { id: 'normal', label: 'Normal' },
                    { id: 'relaxed', label: 'Relaxed' }
                  ].map(margin => (
                    <button
                      key={margin.id}
                      type="button"
                      onClick={() => setLayoutMargin(margin.id as any)}
                      className={`py-1.5 text-center text-[9px] uppercase font-bold tracking-tight transition-all rounded-lg cursor-pointer ${
                        layoutMargin === margin.id 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {margin.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Text Alignment */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Text Alignment</label>
                <div className="grid grid-cols-3 bg-slate-50 border border-slate-100 p-1 rounded-xl gap-0.5">
                  {[
                    { id: 'left', label: 'Left', icon: AlignLeft },
                    { id: 'center', label: 'Center', icon: AlignCenter },
                    { id: 'right', label: 'Right', icon: AlignRight }
                  ].map(align => {
                    const IconComp = align.icon;
                    return (
                      <button
                        key={align.id}
                        type="button"
                        onClick={() => setTextAlignment(align.id as any)}
                        className={`py-1.5 text-center text-[9px] uppercase font-bold tracking-tight transition-all rounded-lg cursor-pointer flex items-center justify-center space-x-1 ${
                          textAlignment === align.id 
                            ? 'bg-slate-900 text-white shadow-xs' 
                            : 'text-slate-400 hover:text-slate-800'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{align.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. QR Placement */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">QR Placement</label>
                <div className="grid grid-cols-3 bg-slate-50 border border-slate-100 p-1 rounded-xl gap-0.5">
                  {[
                    { id: 'center', label: 'Center' },
                    { id: 'bottom', label: 'Bottom' },
                    { id: 'split', label: 'Split' }
                  ].map(pos => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setQrPosition(pos.id as any)}
                      className={`py-1.5 text-center text-[9px] uppercase font-bold tracking-tight transition-all rounded-lg cursor-pointer ${
                        qrPosition === pos.id 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Spacing Options */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Element Block Spacing</label>
                <div className="grid grid-cols-3 bg-slate-50 border border-slate-100 p-1 rounded-xl gap-0.5">
                  {[
                    { id: 'compact', label: 'Compact' },
                    { id: 'normal', label: 'Normal' },
                    { id: 'relaxed', label: 'Relaxed' }
                  ].map(spacing => (
                    <button
                      key={spacing.id}
                      type="button"
                      onClick={() => setBlockSpacing(spacing.id as any)}
                      className={`py-1.5 text-center text-[9px] uppercase font-bold tracking-tight transition-all rounded-lg cursor-pointer ${
                        blockSpacing === spacing.id 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {spacing.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: EXPORT OPTIONS */}
          {activeControlTab === 'export' && (
            <div className="space-y-4 text-xs font-semibold animate-fade-in">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Delivery Options</span>
                <h4 className="text-xs font-bold text-slate-800 text-left">Print Ready Export Studio</h4>
              </div>

              {/* Print Size Selection */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Print Size Target</label>
                <select
                  value={layoutSize}
                  onChange={(e) => setLayoutSize(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                >
                  <option value="A6">A6 Portrait (105 x 148mm)</option>
                  <option value="A5">A5 Portrait (148 x 210mm)</option>
                  <option value="A4">A4 Portrait (210 x 297mm)</option>
                  <option value="Square">Square Card (140 x 140mm)</option>
                  <option value="TableTent">Foldable Table Tent Card</option>
                  <option value="Poster">Event Poster Size (A2)</option>
                </select>
              </div>

              {/* DPI Quality settings */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Export Quality DPI</label>
                <div className="grid grid-cols-3 bg-slate-50 border border-slate-100 p-1 rounded-xl gap-0.5">
                  {[
                    { id: 150, label: '150 DPI (Draft)' },
                    { id: 300, label: '300 DPI (High)' },
                    { id: 600, label: '600 DPI (Press)' }
                  ].map(dpi => (
                    <button
                      key={dpi.id}
                      type="button"
                      onClick={() => setExportDpi(dpi.id)}
                      className={`py-1.5 text-center text-[9px] uppercase font-bold tracking-tight transition-all rounded-lg cursor-pointer ${
                        exportDpi === dpi.id 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {dpi.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deliverables Grid */}
              <div className="space-y-2 text-left pt-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Export Formats</label>
                
                <div className="space-y-2">
                  {[
                    { name: 'Print PDF Document', desc: 'Standard CMYK document (.pdf) for professional printers', color: 'bg-red-500', action: () => exportPDF() },
                    { name: 'Vector Graphic (SVG)', desc: 'Editable resolution-independent vector format (.svg)', color: 'bg-slate-800', action: () => exportSVG() },
                    { name: 'High-Resolution PNG', desc: 'Crisp transparent background image (.png) for screen sharing', color: 'bg-emerald-500', action: () => exportImage('png') },
                    { name: 'Print-Ready JPEG', desc: 'Maximum quality compressed image (.jpg) for local print shops', color: 'bg-amber-500', action: () => exportImage('jpg') },
                    { name: 'QR Code Only', desc: 'Only the high-fidelity scannable code (.png) to place on your own designs', color: 'bg-slate-500', icon: true, action: () => handleDownloadQR() }
                  ].map((option, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={option.action}
                      className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all cursor-pointer flex items-start space-x-3 text-left"
                    >
                      {option.icon ? (
                        <QrCode className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      ) : (
                        <span className={`w-2.5 h-2.5 rounded-full ${option.color} shrink-0 mt-1`} />
                      )}
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">{option.name}</span>
                        <span className="text-[9.5px] text-slate-500 leading-normal font-normal block">{option.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-left">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <p className="text-[9px] text-slate-500 leading-normal font-normal">
                  Exports utilize up to <strong>{exportDpi} DPI pixel magnification</strong> scales to ensure fully crisp lines and QR codes remain highly scannable.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Footer: Export Asset & Dropdown section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 space-y-2.5 relative" ref={dropdownRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              disabled={isExporting}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer text-[10px] uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-[1.01] disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting Asset...' : 'Export Asset...'}</span>
            </button>

            {showExportDropdown && (
              <div className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-left">
                <button
                  type="button"
                  onClick={() => { exportPDF(); setShowExportDropdown(false); }}
                  className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Print PDF Document (.pdf)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { exportSVG(); setShowExportDropdown(false); }}
                  className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                  <span>Vector Graphic (.svg)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { exportImage('png'); setShowExportDropdown(false); }}
                  className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>High-Resolution PNG (.png)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { exportImage('jpg'); setShowExportDropdown(false); }}
                  className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Print-Ready JPEG (.jpg)</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => { handleDownloadQR(); setShowExportDropdown(false); }}
                  className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>QR Code Only (.png)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE PRINT & BLEED PREVIEW */}
      <div className="w-full bg-white border border-slate-100 p-5 rounded-[32px] shadow-xs flex flex-col h-[82vh] lg:h-[85vh] lg:sticky lg:top-6 overflow-hidden space-y-4">
          
          {/* Header Specs Bar */}
          <div className="w-full bg-slate-50 border border-slate-200/60 px-4 py-2.5 rounded-2xl flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-500 gap-2 shrink-0">
            <div className="flex items-center space-x-1.5">
              <Layout className="w-3.5 h-3.5 text-slate-400" />
              <span>Previewing: <strong className="text-slate-800 font-bold">{assetType.toUpperCase()} ({layoutSize})</strong></span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span>Aspect Scale: <strong className="text-slate-800">{currentLayoutSpec.label}</strong></span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Printer className="w-3 h-3 text-emerald-600" />
                <span className="font-bold text-emerald-700 font-mono tracking-wider uppercase">300 DPI WYSIWYG</span>
              </span>
            </div>
          </div>

          {/* Scrollable Container for the Canvas Box */}
          <div className="flex-1 overflow-y-auto min-h-0 w-full flex flex-col items-center justify-start space-y-4 py-2 custom-scrollbar">

            {/* ACTIVE LIVE RENDER CANVAS BOX */}
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-[24px] p-8 w-full flex items-center justify-center overflow-hidden border border-slate-200/80 min-h-[580px] shadow-sm shrink-0">
            
            {/* Background grids styling resembling visual artist desks */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-45 pointer-events-none" />

            {/* Simulated table background textures if previewing a physical table tent card */}
            {assetType === 'table_tent' && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-900/10 via-amber-950/2 to-transparent pointer-events-none" />
            )}

            {/* PREVIEW CONTAINER STAGED CARD */}
            {/* PREVIEW CONTAINER STAGED CARD */}
            {(() => {
              const cardStyle: React.CSSProperties = {};
              if (backgroundType === 'solid') {
                cardStyle.backgroundColor = bgColor;
              } else if (backgroundType === 'gradient') {
                cardStyle.backgroundImage = `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
              } else if (backgroundType === 'image') {
                cardStyle.backgroundColor = bgColor; // fallback
              }

              return (
                <div 
                  id="print-preview-card"
                  ref={previewCardRef}
                  style={cardStyle}
                  className={`relative shadow-2xl transition-all duration-300 select-none overflow-hidden ${currentLayoutSpec.width} ${currentLayoutSpec.height} ${templatesConfig[selectedTemplate].styles}`}
                >
                  
                  {/* Full Bleed or Header Cover Image Background Layer */}
                  {coverUrl && !minimalCanvas && (
                    <div 
                      className="absolute overflow-hidden pointer-events-none z-0"
                      style={{
                        height: backgroundType === 'image' ? '100%' : headerHeight,
                        top: 0,
                        left: 0,
                        right: 0,
                        width: '100%'
                      }}
                    >
                      <img 
                        src={coverUrl} 
                        alt="Canvas Cover" 
                        className="w-full h-full transition-all duration-300"
                        style={{
                          objectFit: fillMode === 'fill' ? 'fill' : fillMode === 'contain' ? 'contain' : fillMode === 'stretch' ? 'fill' : 'cover',
                          objectPosition: imagePosition,
                          transform: `scale(${imageScale / 100}) rotate(${imageRotate}deg)`,
                          filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
                        }}
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Readability Overlay Mask */}
                      {overlayType !== 'none' && (
                        <div 
                          className="absolute inset-0 transition-all duration-300"
                          style={{ backgroundColor: getOverlayStyle() }}
                        />
                      )}
                    </div>
                  )}

                  {/* Bleed Guide Safe lines Overlay */}
                  {showBleedGuides && (
                    <div className="absolute inset-[12px] border border-dashed border-red-500/40 rounded-lg pointer-events-none z-50 flex items-start justify-start p-1">
                      <span className="text-[7px] text-red-500 font-mono font-bold bg-white/90 px-1 py-0.2 rounded uppercase leading-none scale-90 origin-top-left">3mm Bleed Safety Guide</span>
                    </div>
                  )}

                  {/* Crop marks mockup overlay */}
                  {showCropMarks && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-900" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-600" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-900" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-900" />
                    </div>
                  )}

                  {/* TABLE TENT FORMAT WITH CENTRAL FOLD LINE */}
                  {layoutSize === 'TableTent' ? (
                    <div className="flex flex-col h-full justify-between p-6 relative z-10">
                      
                      {/* Top Face (Fold Panel Backside Upside Down) */}
                      <div className="flex-1 border-b border-dashed border-slate-300/80 flex flex-col justify-center items-center text-center p-4 relative origin-center rotate-180">
                        <div className="absolute bottom-1 right-2 font-mono text-[6px] text-slate-400 uppercase tracking-wider scale-90">Tent Backside Panel</div>
                        
                        <div className="space-y-2">
                          <div className="aspect-square bg-white p-2.5 border border-slate-100 rounded-xl w-24 mx-auto flex items-center justify-center shadow-xs">
                            {qrCodeDataUrl ? (
                              <img src={qrCodeDataUrl} alt="QR Code" className="w-full h-full" referrerPolicy="no-referrer" />
                            ) : (
                              <QrCode className="w-12 h-12 text-slate-900" />
                            )}
                          </div>
                          <h5 className={`font-bold text-xs text-slate-800 ${getFontClass()}`}>{eventTitle}</h5>
                          <p className="text-[8px] text-slate-500 leading-normal max-w-[200px] font-medium">Scan here from your seats to stream photos directly onto our screen!</p>
                        </div>
                      </div>

                      {/* Visual central fold indication tag */}
                      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-center z-10 pointer-events-none">
                        <span className="bg-slate-900 text-white font-mono text-[7px] px-2 py-0.5 rounded-full uppercase tracking-wider scale-95 shadow-xs">FOLD HERE</span>
                      </div>

                      {/* Bottom Face (Front Face) */}
                      <div className="flex-1 flex flex-col justify-center items-center text-center p-4 relative pt-6">
                        <div className="absolute top-1 left-2 font-mono text-[6px] text-slate-400 uppercase tracking-wider scale-90">Tent Frontside Panel</div>
                        
                        <div className="space-y-4">
                          {/* Logo or Initials */}
                          <div className="flex justify-center">
                            {logoUrl ? (
                              <img src={logoUrl} alt="Logo" className="h-6 w-auto object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-slate-350 flex items-center justify-center text-[9px] font-serif font-extrabold text-slate-800 uppercase">
                                {eventTitle.substring(0, 2)}
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[7px] tracking-widest uppercase font-mono font-bold text-slate-400 block">JOIN CELEBRATION</span>
                            <h4 className={`text-base font-extrabold text-slate-900 leading-tight ${getFontClass()}`} style={{ color: primaryColor }}>
                              {eventTitle}
                            </h4>
                            <p className="text-[9px] font-bold text-slate-500">
                              {eventDate} • {eventLocation}
                            </p>
                          </div>

                          <div className="bg-white/90 backdrop-blur-xs py-1.5 px-3 border border-slate-200/60 rounded-lg inline-block shadow-2xs">
                            <span className="text-[9px] font-mono font-bold text-slate-900">Event Code: {eventCode}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* REGULAR CONTINUOUS PORTRAIT OR SQUARE ASSET FORMAT */
                    <div className={`h-full w-full flex flex-col justify-between relative z-10 ${paddingClass} ${alignmentClass}`}>
                      
                      {/* Outer design borders according to template selected */}
                      {selectedTemplate === 'floral' && (
                        <div className="absolute inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#16a34a_0.5px,transparent_0.5px)] [background-size:10px_10px]" />
                      )}

                      {/* Logo header */}
                      <div className={`w-full flex flex-col ${alignmentClass} ${spacingClass} relative z-10 ${
                        // Offset text slightly downwards if we have a top-docked header cover to ensure readability/fit
                        backgroundType !== 'image' && coverUrl && !minimalCanvas ? 'pt-[28%]' : ''
                      }`}>
                        <div className={`flex w-full items-center gap-2 ${
                          textAlignment === 'left' ? 'justify-start' :
                          textAlignment === 'right' ? 'justify-end' :
                          'justify-center'
                        }`}>
                          {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-serif font-bold text-slate-800 uppercase bg-white/80">
                              {eventTitle.substring(0, 2)}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 w-full">
                          <span className="text-[8px] tracking-widest font-mono font-extrabold text-slate-400 uppercase block">WELCOME TO</span>
                          <h4 className={`text-lg font-black leading-tight ${getFontClass()}`} style={{ color: primaryColor }}>
                            {eventTitle}
                          </h4>
                          <p className="text-[10px] font-bold" style={{ color: accentColor }}>
                            {eventDate} • {eventLocation}
                          </p>
                        </div>
                      </div>

                      {/* Mid copy texts */}
                      <div className={`w-full ${spacingClass} px-4 relative z-10 my-1`}>
                        <p className="text-[10px] leading-relaxed font-light" style={{ color: primaryColor + 'cc' }}>
                          {welcomeMessage}
                        </p>
                        {optionalInstructions && (
                          <p className="text-[9px] font-bold font-medium" style={{ color: accentColor }}>
                            {optionalInstructions}
                          </p>
                        )}
                      </div>

                      {/* Bottom QR centering panel */}
                      <div className={`w-full flex flex-col ${alignmentClass} ${spacingClass} relative z-10`}>
                        
                        {/* QR block frame */}
                        <div className="flex justify-center items-center">
                          <div 
                            style={{ width: `${qrSize}px`, height: `${qrSize}px` }}
                            className="aspect-square bg-white border border-slate-100 p-2.5 rounded-2xl flex items-center justify-center shadow-md transition-all hover:scale-105"
                          >
                            {qrCodeDataUrl ? (
                              <img src={qrCodeDataUrl} alt="QR Code Link" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <QrCode className="w-full h-full text-slate-900 stroke-1" />
                            )}
                          </div>
                        </div>

                        {/* Numeric event code and quick link */}
                        <div className="space-y-2 w-full">
                          <div className="bg-white/90 backdrop-blur-xs py-1.5 px-4 border border-slate-200/60 rounded-xl inline-block shadow-2xs">
                            <span className="text-[10px] font-mono font-bold text-slate-900 uppercase">Event Code: {eventCode}</span>
                          </div>
                          
                          <p className="text-[10px] font-mono font-bold text-slate-700/80 hover:underline">
                            {eventLink}
                          </p>

                          <p className="text-[8px] text-slate-400 font-light leading-none pt-0.5">
                            {footerText}
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Bottom decorative bar according to design */}
                  {selectedTemplate === 'wedding' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-200 via-pink-300 to-amber-100 pointer-events-none z-20" />
                  )}
                  {selectedTemplate === 'dark' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 pointer-events-none opacity-50 z-20" />
                  )}

                </div>
              );
            })()}

          </div>

          {/* Quick instructions for user */}
          <div className="text-[10px] text-slate-400 font-mono text-center flex items-center justify-center space-x-2 shrink-0 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive print desk active. Move sliders, select assets, or apply styles.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
