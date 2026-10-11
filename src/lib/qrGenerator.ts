import QRCode from 'qrcode';
// @ts-ignore
import jsQR from 'jsqr';
import { KavaQrConfig, QrEyeShape, QrLogoShape, QrModuleShape } from '../types';
import { getSuperAdminQrConfig } from './qrConfig';

export interface QrValidationResult {
  isScannable: boolean;
  decodedText: string | null;
  matchExpected: boolean;
  latencyMs: number;
  error?: string;
}

/**
 * Loads an image from a URL or Data URL safely as an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!src) {
      return reject(new Error('Empty image source'));
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Helper to draw a rounded rectangle on a 2D canvas context
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Helper to draw a shield shape on canvas
 */
function drawShield(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const cx = x + width / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + height * 0.15);
  ctx.lineTo(x, y + height * 0.6);
  ctx.quadraticCurveTo(x, y + height, cx, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height * 0.6);
  ctx.lineTo(x + width, y + height * 0.15);
  ctx.quadraticCurveTo(cx, y, x, y + height * 0.15);
  ctx.closePath();
}

/**
 * Checks if a matrix coordinate (row, col) is within the 3 Finder Pattern (Eye) zones
 */
function isFinderPatternZone(row: number, col: number, moduleCount: number): boolean {
  // Top-Left (7x7 modules + 1 module border)
  if (row < 8 && col < 8) return true;
  // Top-Right
  if (row < 8 && col >= moduleCount - 8) return true;
  // Bottom-Left
  if (row >= moduleCount - 8 && col < 8) return true;
  return false;
}

/**
 * Checks if a module coordinate is inside the center logo exclusion zone
 */
function isCenterLogoZone(
  row: number,
  col: number,
  moduleCount: number,
  centerModuleRadius: number
): boolean {
  if (centerModuleRadius <= 0) return false;
  const center = (moduleCount - 1) / 2;
  const dist = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
  return dist <= centerModuleRadius;
}

/**
 * Renders an Eye / Finder Pattern at pixel coordinates (x, y) with size (7 * moduleSize)
 */
function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  moduleSize: number,
  shape: QrEyeShape,
  outerColor: string,
  innerColor: string,
  bgColor: string
) {
  ctx.save();

  // 1. Draw Outer Frame (7x7 modules)
  ctx.fillStyle = outerColor;
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'rounded') {
    drawRoundedRect(ctx, x, y, size, size, moduleSize * 1.8);
    ctx.fill();
  } else if (shape === 'extra_rounded') {
    drawRoundedRect(ctx, x, y, size, size, moduleSize * 2.8);
    ctx.fill();
  } else if (shape === 'leaf') {
    // Leaf shape: rounded top-left and bottom-right
    ctx.beginPath();
    ctx.moveTo(x + moduleSize * 2.5, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size, y + size - moduleSize * 2.5);
    ctx.quadraticCurveTo(x + size, y + size, x + size - moduleSize * 2.5, y + size);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x, y + moduleSize * 2.5);
    ctx.quadraticCurveTo(x, y, x + moduleSize * 2.5, y);
    ctx.closePath();
    ctx.fill();
  } else {
    // Sharp Square
    ctx.fillRect(x, y, size, size);
  }

  // 2. Draw Inner White Ring (5x5 modules)
  const innerRingX = x + moduleSize;
  const innerRingY = y + moduleSize;
  const innerRingSize = size - 2 * moduleSize;
  ctx.fillStyle = bgColor;

  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, innerRingSize / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'rounded' || shape === 'extra_rounded') {
    drawRoundedRect(ctx, innerRingX, innerRingY, innerRingSize, innerRingSize, moduleSize * 1.2);
    ctx.fill();
  } else if (shape === 'leaf') {
    drawRoundedRect(ctx, innerRingX, innerRingY, innerRingSize, innerRingSize, moduleSize * 1.0);
    ctx.fill();
  } else {
    ctx.fillRect(innerRingX, innerRingY, innerRingSize, innerRingSize);
  }

  // 3. Draw Center Pupil (3x3 modules)
  const pupilX = x + 2 * moduleSize;
  const pupilY = y + 2 * moduleSize;
  const pupilSize = size - 4 * moduleSize;
  ctx.fillStyle = innerColor;

  if (shape === 'circle' || shape === 'rounded' || shape === 'extra_rounded') {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, pupilSize / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'leaf') {
    drawRoundedRect(ctx, pupilX, pupilY, pupilSize, pupilSize, moduleSize * 0.8);
    ctx.fill();
  } else {
    ctx.fillRect(pupilX, pupilY, pupilSize, pupilSize);
  }

  ctx.restore();
}

/**
 * Draws an individual data module on canvas based on moduleShape
 */
function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: QrModuleShape,
  fillColor: string | CanvasGradient
) {
  ctx.fillStyle = fillColor;

  if (shape === 'dots') {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size * 0.44, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'rounded') {
    drawRoundedRect(ctx, x + size * 0.05, y + size * 0.05, size * 0.9, size * 0.9, size * 0.28);
    ctx.fill();
  } else if (shape === 'smooth') {
    drawRoundedRect(ctx, x, y, size, size, size * 0.35);
    ctx.fill();
  } else if (shape === 'classy') {
    // Diamond with rounded corners
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((45 * Math.PI) / 180);
    const dSize = size * 0.65;
    drawRoundedRect(ctx, -dSize / 2, -dSize / 2, dSize, dSize, dSize * 0.2);
    ctx.fill();
    ctx.restore();
  } else {
    // Crisp Classic Square
    ctx.fillRect(x, y, size, size);
  }
}

/**
 * Generates a full branded KAVA QR canvas with customized styles and official logo
 */
export async function generateBrandedQrCanvas(
  content: string,
  userConfig?: Partial<KavaQrConfig>,
  width = 600
): Promise<HTMLCanvasElement> {
  const config: KavaQrConfig = {
    ...getSuperAdminQrConfig(),
    ...(userConfig || {})
  };

  if (!content) {
    content = 'https://kava.app';
  }

  // Generate raw QR code matrix
  const qrData = QRCode.create(content, {
    errorCorrectionLevel: config.errorCorrectionLevel || 'H',
  });

  const moduleCount = qrData.modules.size;
  const marginModules = Math.max(1, config.margin || 2);
  const totalModules = moduleCount + marginModules * 2;

  // Frame heights if frame style is active
  let topExtra = 0;
  let bottomExtra = 0;
  const hasFrame = config.frameStyle && config.frameStyle !== 'none';
  if (hasFrame) {
    if (config.frameStyle === 'card_clean' || config.frameStyle === 'kava_gold_frame') {
      topExtra = 40;
      bottomExtra = 70;
    } else if (config.frameStyle === 'badge_pill') {
      bottomExtra = 60;
    }
  }

  const canvas = document.createElement('canvas');
  const qrBaseSize = width;
  canvas.width = qrBaseSize;
  canvas.height = qrBaseSize + topExtra + bottomExtra;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  // 1. Background Fill
  ctx.fillStyle = config.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // If card frame is active, draw luxury outer border
  if (config.frameStyle === 'kava_gold_frame') {
    ctx.strokeStyle = '#C19A2E';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  } else if (config.frameStyle === 'card_clean') {
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 4, 4, canvas.width - 8, canvas.height - 8, 16);
    ctx.stroke();
  }

  const moduleSize = qrBaseSize / totalModules;
  const qrOriginX = marginModules * moduleSize;
  const qrOriginY = topExtra + marginModules * moduleSize;

  // Determine center logo exclusion radius (in modules)
  let centerModuleRadius = 0;
  if (config.logoUrl && config.logoShape !== 'none') {
    const ratio = Math.min(0.28, Math.max(0.15, config.logoSizeRatio || 0.22));
    const logoPixelSize = qrBaseSize * ratio;
    const logoModules = logoPixelSize / moduleSize;
    centerModuleRadius = (logoModules / 2) + 0.8;
  }

  // Setup gradient if enabled
  let moduleFill: string | CanvasGradient = config.foregroundColor || '#0F172A';
  if (config.gradientEnabled && config.gradientStartColor && config.gradientEndColor) {
    let grad: CanvasGradient;
    if (config.gradientDirection === 'to_right') {
      grad = ctx.createLinearGradient(qrOriginX, qrOriginY, qrOriginX + moduleCount * moduleSize, qrOriginY);
    } else if (config.gradientDirection === 'to_bottom') {
      grad = ctx.createLinearGradient(qrOriginX, qrOriginY, qrOriginX, qrOriginY + moduleCount * moduleSize);
    } else {
      grad = ctx.createLinearGradient(qrOriginX, qrOriginY, qrOriginX + moduleCount * moduleSize, qrOriginY + moduleCount * moduleSize);
    }
    grad.addColorStop(0, config.gradientStartColor);
    grad.addColorStop(1, config.gradientEndColor);
    moduleFill = grad;
  }

  // 2. Draw Data Modules (excluding finder pattern zones and center logo exclusion zone)
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderPatternZone(row, col, moduleCount)) {
        continue; // Handled separately by custom eye drawer
      }
      if (isCenterLogoZone(row, col, moduleCount, centerModuleRadius)) {
        continue; // Reserved for center logo badge
      }

      const isDark = qrData.modules.get(row, col);
      if (isDark) {
        const x = qrOriginX + col * moduleSize;
        const y = qrOriginY + row * moduleSize;
        drawModule(ctx, x, y, moduleSize, config.moduleShape || 'rounded', moduleFill);
      }
    }
  }

  // 3. Draw the 3 Eye / Finder Patterns
  const eyeOuter = config.customEyeColor ? config.eyeOuterColor || config.foregroundColor : config.foregroundColor;
  const eyeInner = config.customEyeColor ? config.eyeInnerColor || config.foregroundColor : config.foregroundColor;
  const eyeSize = 7 * moduleSize;

  // Top-Left Eye
  drawEye(
    ctx,
    qrOriginX,
    qrOriginY,
    eyeSize,
    moduleSize,
    config.eyeShape || 'rounded',
    eyeOuter,
    eyeInner,
    config.backgroundColor || '#ffffff'
  );

  // Top-Right Eye
  drawEye(
    ctx,
    qrOriginX + (moduleCount - 7) * moduleSize,
    qrOriginY,
    eyeSize,
    moduleSize,
    config.eyeShape || 'rounded',
    eyeOuter,
    eyeInner,
    config.backgroundColor || '#ffffff'
  );

  // Bottom-Left Eye
  drawEye(
    ctx,
    qrOriginX,
    qrOriginY + (moduleCount - 7) * moduleSize,
    eyeSize,
    moduleSize,
    config.eyeShape || 'rounded',
    eyeOuter,
    eyeInner,
    config.backgroundColor || '#ffffff'
  );

  // 4. Draw Center KAVA Logo & Protection Badge
  if (config.logoUrl && config.logoShape !== 'none') {
    try {
      const img = await loadImage(config.logoUrl);
      const ratio = Math.min(0.28, Math.max(0.15, config.logoSizeRatio || 0.22));
      const badgeSize = qrBaseSize * ratio;
      const centerX = qrOriginX + (moduleCount * moduleSize) / 2;
      const centerY = qrOriginY + (moduleCount * moduleSize) / 2;
      const badgeX = centerX - badgeSize / 2;
      const badgeY = centerY - badgeSize / 2;

      ctx.save();

      // Badge background & shadow
      ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = config.logoBackground || '#ffffff';

      if (config.logoShape === 'circle') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, badgeSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (config.logoShape === 'rounded') {
        drawRoundedRect(ctx, badgeX, badgeY, badgeSize, badgeSize, badgeSize * 0.24);
        ctx.fill();
      } else if (config.logoShape === 'shield') {
        drawShield(ctx, badgeX, badgeY, badgeSize, badgeSize);
        ctx.fill();
      } else {
        ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize);
      }

      ctx.restore();

      // Badge border stroke
      if (config.logoBorderWidth && config.logoBorderWidth > 0) {
        ctx.save();
        ctx.strokeStyle = config.logoBorderColor || '#C19A2E';
        ctx.lineWidth = config.logoBorderWidth;
        if (config.logoShape === 'circle') {
          ctx.beginPath();
          ctx.arc(centerX, centerY, badgeSize / 2 - config.logoBorderWidth / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (config.logoShape === 'rounded') {
          drawRoundedRect(
            ctx,
            badgeX + config.logoBorderWidth / 2,
            badgeY + config.logoBorderWidth / 2,
            badgeSize - config.logoBorderWidth,
            badgeSize - config.logoBorderWidth,
            badgeSize * 0.22
          );
          ctx.stroke();
        } else if (config.logoShape === 'shield') {
          drawShield(ctx, badgeX, badgeY, badgeSize, badgeSize);
          ctx.stroke();
        } else {
          ctx.strokeRect(
            badgeX + config.logoBorderWidth / 2,
            badgeY + config.logoBorderWidth / 2,
            badgeSize - config.logoBorderWidth,
            badgeSize - config.logoBorderWidth
          );
        }
        ctx.restore();
      }

      // Draw Logo Image with padding inside badge
      const padding = config.logoPadding || 4;
      const logoDrawX = badgeX + padding;
      const logoDrawY = badgeY + padding;
      const logoDrawSize = badgeSize - 2 * padding;

      ctx.save();
      // Clip image to badge shape if circular or rounded
      if (config.logoShape === 'circle') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoDrawSize / 2, 0, Math.PI * 2);
        ctx.clip();
      } else if (config.logoShape === 'rounded') {
        drawRoundedRect(ctx, logoDrawX, logoDrawY, logoDrawSize, logoDrawSize, logoDrawSize * 0.2);
        ctx.clip();
      }
      ctx.drawImage(img, logoDrawX, logoDrawY, logoDrawSize, logoDrawSize);
      ctx.restore();
    } catch (logoErr) {
      console.warn('Failed to render center logo onto QR canvas:', logoErr);
    }
  }

  // 5. Draw Frame Header & CTA Footer
  if (hasFrame && config.frameText) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (config.frameStyle === 'badge_pill') {
      // Pill banner under QR
      const pillW = canvas.width * 0.85;
      const pillH = 38;
      const pillX = (canvas.width - pillW) / 2;
      const pillY = qrBaseSize + topExtra + (bottomExtra - pillH) / 2;

      ctx.fillStyle = config.frameBgColor || '#0F172A';
      drawRoundedRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();

      ctx.fillStyle = config.frameTextColor || '#FFFFFF';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText(config.frameText, canvas.width / 2, pillY + pillH / 2);
    } else if (config.frameStyle === 'kava_gold_frame' || config.frameStyle === 'card_clean') {
      // Top Title
      ctx.fillStyle = config.frameTextColor || '#0F172A';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('KAVA MEMORY CAPSULE', canvas.width / 2, topExtra / 2 + 4);

      // Bottom CTA Banner
      const ctaY = qrBaseSize + topExtra + bottomExtra / 2;
      ctx.fillStyle = config.frameTextColor || '#0F172A';
      ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(config.frameText, canvas.width / 2, ctaY - 8);

      ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('Scan with mobile camera to upload photos', canvas.width / 2, ctaY + 12);
    }
    ctx.restore();
  }

  return canvas;
}

/**
 * Generates high-res PNG Data URL with master Superadmin QR styling
 */
export async function generateBrandedQrDataUrl(
  content: string,
  userConfig?: Partial<KavaQrConfig>,
  width = 600
): Promise<string> {
  try {
    const canvas = await generateBrandedQrCanvas(content, userConfig, width);
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Failed to generate branded QR Data URL:', err);
    // Safe standard fallback
    return await QRCode.toDataURL(content || 'https://kava.app', {
      width,
      margin: 2,
      color: { dark: '#0F172A', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
  }
}

/**
 * Decodes and validates a generated QR image using jsQR to guarantee 100% scannability
 */
export async function validateQrScannability(
  canvasOrDataUrl: HTMLCanvasElement | string,
  expectedContent?: string
): Promise<QrValidationResult> {
  const startTime = performance.now();
  try {
    let canvas: HTMLCanvasElement;
    if (typeof canvasOrDataUrl === 'string') {
      const img = await loadImage(canvasOrDataUrl);
      canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('No canvas context');
      ctx.drawImage(img, 0, 0);
    } else {
      canvas = canvasOrDataUrl;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Failed to get 2D context for decoding');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (code && code.data) {
      const match = expectedContent ? code.data.trim() === expectedContent.trim() : true;
      return {
        isScannable: true,
        decodedText: code.data,
        matchExpected: match,
        latencyMs,
      };
    } else {
      return {
        isScannable: false,
        decodedText: null,
        matchExpected: false,
        latencyMs,
        error: 'QR code could not be resolved by scanner detector.',
      };
    }
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      isScannable: false,
      decodedText: null,
      matchExpected: false,
      latencyMs,
      error: err?.message || 'Decoder runtime error',
    };
  }
}
