import { KavaQrConfig, QrLogoShape, QrModuleShape, QrEyeShape, QrErrorCorrection, QrFrameStyle } from '../types';

// Official KAVA SVG Logo Presets (High-resolution data URLs for vector-crisp rendering)
export const OFFICIAL_KAVA_LOGOS = [
  {
    id: 'kava_gold_monogram',
    name: 'Official KAVA Gold Monogram',
    description: 'Gold geometric K monogram on midnight badge with gold border',
    previewColor: '#C19A2E',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F3E7C4"/>
            <stop offset="30%" stop-color="#D4AF37"/>
            <stop offset="70%" stop-color="#AA7C11"/>
            <stop offset="100%" stop-color="#E5C158"/>
          </linearGradient>
          <linearGradient id="bgDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="44" fill="url(#bgDark)" />
        <rect x="6" y="6" width="188" height="188" rx="38" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.8" />
        <!-- Monogram K -->
        <path d="M 64 45 L 82 45 L 82 155 L 64 155 Z" fill="url(#goldGrad)" />
        <path d="M 82 108 L 126 45 L 148 45 L 98 116 L 152 155 L 130 155 L 82 118 Z" fill="url(#goldGrad)" />
        <!-- KAVA Subtext -->
        <text x="100" y="180" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" letter-spacing="4" fill="#F3E7C4" text-anchor="middle">KAVA</text>
      </svg>
    `.trim())
  },
  {
    id: 'kava_midnight_minimal',
    name: 'KAVA Midnight Minimalist',
    description: 'Clean slate-900 and ivory emblem for high-contrast invitations',
    previewColor: '#0F172A',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="100" fill="#0F172A" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="#334155" stroke-width="3" />
        <path d="M 68 52 L 86 52 L 86 148 L 68 148 Z" fill="#FFFFFF" />
        <path d="M 86 106 L 124 52 L 146 52 L 102 113 L 148 148 L 126 148 L 86 116 Z" fill="#FFFFFF" />
        <circle cx="100" cy="100" r="8" fill="#C19A2E" />
      </svg>
    `.trim())
  },
  {
    id: 'kava_gold_crest',
    name: 'KAVA Luxury Crest & Diamond',
    description: 'Refined celebration badge with capsule diamond star',
    previewColor: '#D4AF37',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFEBB0"/>
            <stop offset="50%" stop-color="#C59B27"/>
            <stop offset="100%" stop-color="#916E0D"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="46" fill="#FFFFFF" />
        <rect x="8" y="8" width="184" height="184" rx="38" fill="#FAF5E8" stroke="#C59B27" stroke-width="4" />
        <!-- Crest Monogram -->
        <path d="M 66 52 L 84 52 L 84 148 L 66 148 Z" fill="url(#goldGrad2)" />
        <path d="M 84 106 L 122 52 L 144 52 L 100 113 L 146 148 L 124 148 L 84 116 Z" fill="url(#goldGrad2)" />
        <polygon points="100,28 104,36 112,40 104,44 100,52 96,44 88,40 96,36" fill="#C59B27" />
        <text x="100" y="174" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" letter-spacing="3" fill="#664D03" text-anchor="middle">CAPSULE</text>
      </svg>
    `.trim())
  },
  {
    id: 'kava_emerald_botanical',
    name: 'KAVA Emerald Botanical',
    description: 'Deep forest emerald emblem with crisp white typography',
    previewColor: '#064E3B',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="100" fill="#064E3B" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="#10B981" stroke-width="3" stroke-dasharray="8 4" />
        <path d="M 68 55 L 86 55 L 86 145 L 68 145 Z" fill="#F0FDF4" />
        <path d="M 86 106 L 124 55 L 146 55 L 102 113 L 148 145 L 126 145 L 86 116 Z" fill="#F0FDF4" />
        <circle cx="100" cy="100" r="6" fill="#FCD34D" />
      </svg>
    `.trim())
  },
  {
    id: 'kava_indigo_modern',
    name: 'KAVA Indigo Royal',
    description: 'Modern indigo and violet gradient badge with clean geometry',
    previewColor: '#4338CA',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4F46E5"/>
            <stop offset="100%" stop-color="#1E1B4B"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="44" fill="url(#indigoGrad)" />
        <rect x="6" y="6" width="188" height="188" rx="38" fill="none" stroke="#818CF8" stroke-width="3" />
        <path d="M 66 52 L 84 52 L 84 148 L 66 148 Z" fill="#FFFFFF" />
        <path d="M 84 106 L 122 52 L 144 52 L 100 113 L 146 148 L 124 148 L 84 116 Z" fill="#FFFFFF" />
        <text x="100" y="174" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" letter-spacing="4" fill="#A5B4FC" text-anchor="middle">KAVA</text>
      </svg>
    `.trim())
  }
];

export const DEFAULT_QR_CONFIG: KavaQrConfig = {
  id: 'kava_default_qr_v1',
  version: 1,
  name: 'Official KAVA Master Invitation Style',
  
  // Official Logo Configuration
  logoUrl: OFFICIAL_KAVA_LOGOS[0].url,
  logoShape: 'circle',
  logoSizeRatio: 0.22, // 22% is the sweet spot for scannability with Level H (30%)
  logoBackground: '#ffffff',
  logoBorderColor: '#C19A2E',
  logoBorderWidth: 2,
  logoPadding: 5,
  
  // Matrix & Module Styling
  moduleShape: 'rounded', // Smooth rounded modules look polished & modern
  foregroundColor: '#0F172A', // Deep slate-900
  backgroundColor: '#FFFFFF', // Clean pure white
  
  // Corner Eye / Finder Pattern Styling
  eyeShape: 'rounded',
  customEyeColor: true,
  eyeOuterColor: '#0F172A',
  eyeInnerColor: '#C19A2E', // Subtle gold eye center
  
  // Scannability & Margin Configuration
  margin: 2, // 2 module quiet zone
  errorCorrectionLevel: 'H', // 30% error correction guarantees 100% scannability with logo
  
  // Gradient & Visual FX
  gradientEnabled: false,
  gradientStartColor: '#0F172A',
  gradientEndColor: '#1E293B',
  gradientDirection: 'diagonal',
  
  // Frame CTA & Badge
  frameStyle: 'none',
  frameText: 'SCAN TO JOIN CAPSULE',
  frameTextColor: '#0F172A',
  frameBgColor: '#F8FAFC',
  
  includeKavaBrandingBadge: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'Super Administrator'
};

const STORAGE_KEY = 'kava_superadmin_qr_config';
const API_BASE = '/api/qr-config';

let cachedQrConfig: KavaQrConfig | null = null;

/**
 * Returns current QR configuration synchronously (memory or localStorage or DEFAULT)
 */
export function getSuperAdminQrConfig(): KavaQrConfig {
  if (cachedQrConfig) {
    return cachedQrConfig;
  }
  
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.foregroundColor && parsed.logoUrl) {
          cachedQrConfig = {
            ...DEFAULT_QR_CONFIG,
            ...parsed
          };
          return cachedQrConfig;
        }
      }
    } catch (e) {
      console.warn('Failed to read QR config from localStorage:', e);
    }
  }
  
  cachedQrConfig = DEFAULT_QR_CONFIG;
  return DEFAULT_QR_CONFIG;
}

/**
 * Fetches the master QR configuration from the backend API, syncing to local storage
 */
export async function fetchSuperAdminQrConfig(): Promise<KavaQrConfig> {
  try {
    const res = await fetch(API_BASE);
    if (res.ok) {
      const data = await res.json();
      if (data && data.foregroundColor) {
        cachedQrConfig = {
          ...DEFAULT_QR_CONFIG,
          ...data
        };
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedQrConfig));
        }
        dispatchQrConfigUpdate(cachedQrConfig);
        return cachedQrConfig;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch QR config from server, using local fallback:', err);
  }
  return getSuperAdminQrConfig();
}

/**
 * Saves and broadcasts updated QR configuration to backend and client listeners
 */
export async function saveSuperAdminQrConfig(config: Partial<KavaQrConfig>): Promise<KavaQrConfig> {
  const current = getSuperAdminQrConfig();
  const nextConfig: KavaQrConfig = {
    ...current,
    ...config,
    version: (current.version || 1) + 1,
    updatedAt: new Date().toISOString(),
  };

  cachedQrConfig = nextConfig;

  // Persist locally immediately
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConfig));
  }

  // Persist to server API
  try {
    const res = await fetch(API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextConfig),
    });
    if (res.ok) {
      const saved = await res.json();
      cachedQrConfig = saved;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      }
    }
  } catch (err) {
    console.error('Failed to save QR config to server:', err);
  }

  dispatchQrConfigUpdate(cachedQrConfig);
  return cachedQrConfig;
}

/**
 * Resets the QR configuration to standard KAVA defaults
 */
export async function resetSuperAdminQrConfig(): Promise<KavaQrConfig> {
  const resetConfig: KavaQrConfig = {
    ...DEFAULT_QR_CONFIG,
    version: (cachedQrConfig?.version || 1) + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'Super Administrator'
  };

  cachedQrConfig = resetConfig;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetConfig));
  }

  try {
    await fetch(`${API_BASE}/reset`, { method: 'POST' });
  } catch (e) {}

  dispatchQrConfigUpdate(resetConfig);
  return resetConfig;
}

/**
 * Dispatches a window event so all open tabs and components instantly react
 */
function dispatchQrConfigUpdate(config: KavaQrConfig) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kava_qr_config_updated', { detail: config }));
  }
}

/**
 * Calculates WCAG contrast ratio between foreground and background colors
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  function getLuminance(hex: string): number {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2) || '0', 16) / 255;
    const g = parseInt(clean.substring(2, 4) || '0', 16) / 255;
    const b = parseInt(clean.substring(4, 6) || '0', 16) / 255;

    const [rr, gg, bb] = [r, g, b].map((val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
  }

  try {
    const l1 = getLuminance(fgHex);
    const l2 = getLuminance(bgHex);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch (e) {
    return 7.0; // Fallback
  }
}

/**
 * Validates scannability safety of a QR configuration
 */
export function validateQrConfigSafety(config: KavaQrConfig): {
  isSafe: boolean;
  contrastRatio: number;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const ratio = calculateContrastRatio(config.foregroundColor, config.backgroundColor);

  if (ratio < 3.5) {
    warnings.push(`Low contrast ratio (${ratio.toFixed(1)}:1). Camera scanners may struggle in dim lighting.`);
    recommendations.push('Increase contrast by selecting a darker foreground or lighter background.');
  }

  if (config.logoUrl && config.logoSizeRatio > 0.26) {
    warnings.push(`Logo scale (${Math.round(config.logoSizeRatio * 100)}%) is high.`);
    recommendations.push('Keep logo ratio at 22-24% to maintain 100% error recovery.');
  }

  if (config.logoUrl && config.errorCorrectionLevel !== 'H' && config.errorCorrectionLevel !== 'Q') {
    warnings.push(`Error correction is set to '${config.errorCorrectionLevel}'. Level 'H' is strongly advised when a center logo is present.`);
    recommendations.push("Set Error Correction Level to 'H' (30% fault tolerance).");
  }

  if (config.margin < 1) {
    warnings.push('Margin is 0 modules. Some mobile scanners require a quiet zone boundary.');
    recommendations.push('Set margin to at least 1 or 2 modules.');
  }

  return {
    isSafe: warnings.length === 0,
    contrastRatio: ratio,
    warnings,
    recommendations
  };
}
