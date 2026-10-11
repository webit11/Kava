/**
 * KAVA Photo Processing & Watermark Engine
 * Safely retains uncompressed raw originals while rendering branded, filtered display versions.
 */

export interface PhotoFilterPreset {
  id: string;
  name: string;
  description: string;
  cssFilter: string;
  canvasFilter: string;
  tag: string;
}

export const PHOTO_FILTER_PRESETS: PhotoFilterPreset[] = [
  {
    id: 'original',
    name: 'Original / Natural',
    description: 'Clean, true-to-life color reproduction with zero post-processing.',
    cssFilter: 'none',
    canvasFilter: 'none',
    tag: 'Raw'
  },
  {
    id: 'warm',
    name: 'Golden Warmth',
    description: 'Soft champagne amber highlights with cozy, glowing skin tones.',
    cssFilter: 'sepia(0.2) saturate(1.15) brightness(1.02) contrast(1.04)',
    canvasFilter: 'sepia(20%) saturate(115%) brightness(102%) contrast(104%)',
    tag: 'Warm'
  },
  {
    id: 'noir',
    name: 'Monochrome Noir',
    description: 'Timeless high-contrast black & white with deep blacks and rich silvery grain.',
    cssFilter: 'grayscale(1) contrast(1.22) brightness(0.98)',
    canvasFilter: 'grayscale(100%) contrast(122%) brightness(98%)',
    tag: 'B&W'
  },
  {
    id: 'vivid',
    name: 'Vivid Modern',
    description: 'Punchy saturation and crisp dynamic range that pops on high-res displays.',
    cssFilter: 'saturate(1.35) contrast(1.1) brightness(1.02)',
    canvasFilter: 'saturate(135%) contrast(110%) brightness(102%)',
    tag: 'Pop'
  },
  {
    id: 'vintage',
    name: 'Analog Polaroid Film',
    description: 'Nostalgic matte fade with subtle sepia shadows and creamy whites.',
    cssFilter: 'sepia(0.3) saturate(0.9) contrast(0.95) brightness(1.05)',
    canvasFilter: 'sepia(30%) saturate(90%) contrast(95%) brightness(105%)',
    tag: 'Matte'
  },
  {
    id: 'cinematic',
    name: 'Cinematic Amber',
    description: 'Subtle teal shadows and warm golden highlights for storytelling.',
    cssFilter: 'contrast(1.15) saturate(1.1) hue-rotate(-5deg)',
    canvasFilter: 'contrast(115%) saturate(110%) hue-rotate(-5deg)',
    tag: 'Film'
  },
  {
    id: 'cool',
    name: 'Nordic Clean',
    description: 'Crisp editorial aesthetic with cool shadows and pure minimalist whites.',
    cssFilter: 'saturate(0.95) brightness(1.03) contrast(1.05) hue-rotate(5deg)',
    canvasFilter: 'saturate(95%) brightness(103%) contrast(105%) hue-rotate(5deg)',
    tag: 'Cool'
  }
];

export interface PhotoProcessingOptions {
  filter?: string;
  enableWatermark?: boolean;
  watermarkUrl?: string;
  watermarkText?: string;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center' | string;
  watermarkOpacity?: number; // 0 - 100
  watermarkSize?: number; // 10 - 40 (%)
  eventName?: string;
  eventDate?: string;
}

export interface ProcessedPhotoResult {
  originalUrl: string;
  displayUrl: string;
  dimensions: { width: number; height: number };
  fileSizeBytes: number;
  filterApplied?: string;
  watermarkApplied: boolean;
}

/**
 * Loads an image from a source string into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image for processing'));
    img.src = src;
  });
}

/**
 * Converts a File object into a DataURL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file as DataURL'));
      }
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Applies optional filter and watermark overlay to an uploaded photo.
 * CRITICAL: The raw original data URL is strictly preserved in `originalUrl` and never mutated.
 */
export async function processPhotoForCollection(
  fileOrUrl: File | string,
  options: PhotoProcessingOptions = {}
): Promise<ProcessedPhotoResult> {
  // 1. Get raw original string
  const originalUrl = typeof fileOrUrl === 'string' ? fileOrUrl : await fileToDataUrl(fileOrUrl);
  const fileSizeBytes = typeof fileOrUrl === 'string' ? Math.round(originalUrl.length * 0.75) : fileOrUrl.size;

  const rawImage = await loadImage(originalUrl);
  const width = rawImage.naturalWidth || rawImage.width || 1200;
  const height = rawImage.naturalHeight || rawImage.height || 800;

  // Determine if processing is needed
  const selectedFilterPreset = PHOTO_FILTER_PRESETS.find(
    (p) => p.id === options.filter || p.id === (options.filter === 'none' ? 'original' : options.filter)
  ) || PHOTO_FILTER_PRESETS[0];

  const hasFilter = selectedFilterPreset && selectedFilterPreset.id !== 'original';
  const hasWatermark = Boolean(
    options.enableWatermark && (options.watermarkUrl || options.watermarkText || options.eventName)
  );

  // If neither filter nor watermark is active, return original for both
  if (!hasFilter && !hasWatermark) {
    return {
      originalUrl,
      displayUrl: originalUrl,
      dimensions: { width, height },
      fileSizeBytes,
      filterApplied: 'original',
      watermarkApplied: false
    };
  }

  // 2. Setup high-DPI canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return {
      originalUrl,
      displayUrl: originalUrl,
      dimensions: { width, height },
      fileSizeBytes,
      filterApplied: 'original',
      watermarkApplied: false
    };
  }

  // 3. Draw filtered photo
  if (hasFilter && selectedFilterPreset.canvasFilter !== 'none') {
    try {
      ctx.filter = selectedFilterPreset.canvasFilter;
    } catch {
      ctx.filter = 'none';
    }
  }

  ctx.drawImage(rawImage, 0, 0, width, height);
  // Reset canvas filter so watermark isn't altered by the color filter
  ctx.filter = 'none';

  // 4. Draw Watermark if enabled
  if (hasWatermark) {
    const position = options.watermarkPosition || 'bottom-right';
    const opacity = typeof options.watermarkOpacity === 'number' ? Math.max(0.1, options.watermarkOpacity / 100) : 0.75;
    const sizePercent = typeof options.watermarkSize === 'number' ? Math.max(8, Math.min(45, options.watermarkSize)) : 18;

    ctx.save();
    ctx.globalAlpha = opacity;

    // Check if custom logo image watermark is provided
    if (options.watermarkUrl && options.watermarkUrl.trim()) {
      try {
        const logoImg = await loadImage(options.watermarkUrl.trim());
        const logoAspect = (logoImg.naturalWidth || 1) / (logoImg.naturalHeight || 1);
        const targetLogoWidth = Math.max(60, Math.floor(width * (sizePercent / 100)));
        const targetLogoHeight = Math.floor(targetLogoWidth / logoAspect);

        const margin = Math.max(20, Math.floor(Math.min(width, height) * 0.035));
        let x = width - targetLogoWidth - margin;
        let y = height - targetLogoHeight - margin;

        if (position === 'top-left') {
          x = margin;
          y = margin;
        } else if (position === 'top-right') {
          x = width - targetLogoWidth - margin;
          y = margin;
        } else if (position === 'bottom-left') {
          x = margin;
          y = height - targetLogoHeight - margin;
        } else if (position === 'center') {
          x = Math.floor((width - targetLogoWidth) / 2);
          y = Math.floor((height - targetLogoHeight) / 2);
        }

        // Draw soft backdrop shadow under logo for contrast
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = Math.max(4, Math.floor(targetLogoWidth * 0.08));
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        ctx.drawImage(logoImg, x, y, targetLogoWidth, targetLogoHeight);
      } catch (err) {
        console.warn('Custom logo watermark failed to load, falling back to typography crest:', err);
        renderTypographyWatermark(ctx, width, height, position, options, sizePercent);
      }
    } else {
      // Render text badge watermark
      renderTypographyWatermark(ctx, width, height, position, options, sizePercent);
    }

    ctx.restore();
  }

  // 5. Generate high-quality JPEG display version
  const displayUrl = canvas.toDataURL('image/jpeg', 0.92);

  return {
    originalUrl,
    displayUrl,
    dimensions: { width, height },
    fileSizeBytes,
    filterApplied: selectedFilterPreset.id,
    watermarkApplied: hasWatermark
  };
}

function renderTypographyWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  position: string,
  options: PhotoProcessingOptions,
  sizePercent: number
) {
  const label = (options.watermarkText || options.eventName || 'KAVA MEMORY').trim().toUpperCase();
  const dateStr = options.eventDate || '';

  const baseFontSize = Math.max(14, Math.floor(Math.min(width, height) * (sizePercent / 550)));
  const subFontSize = Math.max(9, Math.floor(baseFontSize * 0.65));

  ctx.font = `bold ${baseFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const mainMetrics = ctx.measureText(label);
  
  let totalWidth = mainMetrics.width;
  if (dateStr) {
    ctx.font = `500 ${subFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const dateMetrics = ctx.measureText(dateStr);
    totalWidth = Math.max(totalWidth, dateMetrics.width);
  }

  const paddingX = baseFontSize * 1.0;
  const paddingY = baseFontSize * 0.7;
  const badgeWidth = totalWidth + paddingX * 2;
  const badgeHeight = (dateStr ? baseFontSize + subFontSize + 8 : baseFontSize) + paddingY * 1.8;

  const margin = Math.max(20, Math.floor(Math.min(width, height) * 0.035));
  let x = width - badgeWidth - margin;
  let y = height - badgeHeight - margin;

  if (position === 'top-left') {
    x = margin;
    y = margin;
  } else if (position === 'top-right') {
    x = width - badgeWidth - margin;
    y = margin;
  } else if (position === 'bottom-left') {
    x = margin;
    y = height - badgeHeight - margin;
  } else if (position === 'center') {
    x = Math.floor((width - badgeWidth) / 2);
    y = Math.floor((height - badgeHeight) / 2);
  }

  // Draw semi-translucent dark pill
  ctx.fillStyle = 'rgba(10, 10, 12, 0.72)';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, badgeWidth, badgeHeight, Math.max(8, baseFontSize * 0.6));
  } else {
    ctx.rect(x, y, badgeWidth, badgeHeight);
  }
  ctx.fill();

  // Draw crisp white text
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'top';
  ctx.font = `800 ${baseFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(label, x + paddingX, y + paddingY);

  if (dateStr) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = `600 ${subFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(dateStr, x + paddingX, y + paddingY + baseFontSize + 4);
  }
}
