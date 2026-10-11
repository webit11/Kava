import { KavaEvent, EventJoinLog, KavaGuest } from '../types';

export interface JoinValidationResult {
  success: boolean;
  status: 'valid' | 'invalid_code' | 'archived' | 'disabled' | 'not_open' | 'expired' | 'full' | 'password_required';
  event?: KavaEvent;
  errorMessage?: string;
  startDate?: string;
  expirationDate?: string;
  maxGuests?: number;
  currentGuests?: number;
}

export function detectDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

export function detectBrowserName(): string {
  if (typeof window === 'undefined') return 'Chrome';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Internet';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'Internet Explorer';
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Microsoft Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Browser';
}

export function detectUserCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('America')) return 'United States 🇺🇸';
    if (tz.includes('Europe/London')) return 'United Kingdom 🇬🇧';
    if (tz.includes('Europe')) return 'Europe 🇪🇺';
    if (tz.includes('Asia/Tokyo')) return 'Japan 🇯🇵';
    if (tz.includes('Asia/Jakarta')) return 'Indonesia 🇮🇩';
    if (tz.includes('Asia/Singapore')) return 'Singapore 🇸🇬';
    if (tz.includes('Australia')) return 'Australia 🇦🇺';
    return 'Global 🌍';
  } catch (e) {
    return 'Global 🌍';
  }
}

/**
  Normalizes and sanitizes event codes input by guests
 */
export function sanitizeEventCode(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-') // Convert spaces to hyphens
    .replace(/[^A-Z0-9\-_]/g, ''); // Remove illegal chars
}

/**
 * Generates a unique, collision-safe guest access code for an event name
 */
export function generateUniqueEventCode(eventName: string, existingEvents: KavaEvent[] = []): string {
  const cleanName = (eventName || 'CAPSULE').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const prefix = cleanName.length > 6 ? cleanName.substring(0, 6) : (cleanName || 'CAPSULE');
  
  let candidate = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
  let attempts = 0;
  
  while (attempts < 200) {
    const exists = existingEvents.some(
      (e) => (e.code && e.code.toUpperCase() === candidate) || 
             (e.settings?.invitationToken && e.settings.invitationToken.toUpperCase() === candidate)
    );
    if (!exists) {
      return candidate;
    }
    candidate = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    attempts++;
  }
  
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}

/**
 * Extracts event code or invitation token from raw input string or scanned QR URL
 */
export function extractCodeFromQrData(scannedData: string): string {
  if (!scannedData) return '';
  const trimmed = scannedData.trim();

  // Handle URLs (e.g., https://domain.com/?code=SOFIA-LEO or https://domain.com/guest/SOFIA-LEO)
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      // Check query parameters
      const queryCode = url.searchParams.get('code') || 
                        url.searchParams.get('join') || 
                        url.searchParams.get('c') ||
                        url.searchParams.get('token');
      if (queryCode) {
        return sanitizeEventCode(queryCode);
      }
      // Check path segments
      const pathSegments = url.pathname.split('/').filter(Boolean);
      if (pathSegments.length >= 2) {
        const lastIndex = pathSegments.length - 1;
        if (['guest', 'code', 'join', 'capsule', 'events'].includes(pathSegments[lastIndex - 1].toLowerCase())) {
          return sanitizeEventCode(pathSegments[lastIndex]);
        }
      }
      if (pathSegments.length === 1) {
        return sanitizeEventCode(pathSegments[0]);
      }
    }
  } catch (e) {
    // Fall back to raw string parsing
  }

  // Check key=value format (code=XYZ)
  const paramMatch = trimmed.match(/(?:code|join|token)[:=]([A-Za-z0-9\-_]+)/i);
  if (paramMatch && paramMatch[1]) {
    return sanitizeEventCode(paramMatch[1]);
  }

  return sanitizeEventCode(trimmed);
}

/**
  Core Event Validation Logic
 */
export function validateEventJoinCode(
  rawCode: string,
  events: KavaEvent[],
  guests: KavaGuest[],
  providedPassword?: string
): JoinValidationResult {
  const code = extractCodeFromQrData(rawCode);

  if (!code) {
    return {
      success: false,
      status: 'invalid_code',
      errorMessage: 'Please enter a valid event code.',
    };
  }

  // Match by event code, invitation token, or event ID
  const event = events.find((e) => 
    (e.code && e.code.toUpperCase() === code) ||
    (e.settings?.invitationToken && e.settings.invitationToken.toUpperCase() === code) ||
    (e.id && e.id.toUpperCase() === code)
  );

  if (!event) {
    return {
      success: false,
      status: 'invalid_code',
      errorMessage: 'This invitation code is invalid or has expired.',
    };
  }

  // Check 1: Event Status & Host Access Toggle
  const isArchived = event.status === 'archived' || event.status === 'inactive' || event.status === 'draft';
  const isAccessDisabled = event.settings?.guestAccessEnabled === false;

  if (isArchived || isAccessDisabled) {
    return {
      success: false,
      status: isArchived ? 'archived' : 'disabled',
      event,
      errorMessage: isArchived
        ? `The capsule "${event.name}" has been archived or closed by the host.`
        : `Guest access for "${event.name}" is currently paused by the host.`,
    };
  }

  // Check 2: Event Opening Date (Not yet open)
  const startDate = event.startDate || event.settings?.startDate;
  if (startDate) {
    const startMs = new Date(startDate).getTime();
    const nowMs = Date.now();
    if (!isNaN(startMs) && nowMs < startMs) {
      const formattedStart = new Date(startDate).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      return {
        success: false,
        status: 'not_open',
        event,
        startDate,
        errorMessage: `"${event.name}" is scheduled to open on ${formattedStart}. Uploads and guest entry are not available yet.`,
      };
    }
  }

  // Check 3: Event Expiration Date
  const expDate = event.expirationDate || event.settings?.expirationDate;
  if (expDate) {
    const expMs = new Date(expDate).getTime();
    const nowMs = Date.now();
    if (!isNaN(expMs) && nowMs > expMs) {
      const formattedExp = new Date(expDate).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      return {
        success: false,
        status: 'expired',
        event,
        expirationDate: expDate,
        errorMessage: `This capsule expired on ${formattedExp}. Guest uploads and contributions are now closed.`,
      };
    }
  }

  // Check 4: Maximum Guest Capacity
  const maxGuests = event.maxGuests || event.settings?.maxGuests;
  const currentGuestCount = guests.filter((g) => g.eventId === event.id).length;
  if (maxGuests && maxGuests > 0 && currentGuestCount >= maxGuests) {
    return {
      success: false,
      status: 'full',
      event,
      maxGuests,
      currentGuests: currentGuestCount,
      errorMessage: `"${event.name}" has reached its guest capacity limit (${maxGuests} guests). Contact the host to request access.`,
    };
  }

  // Check 5: Password Protection
  const requiresPassword = event.settings?.requiresPassword || false;
  const expectedPassword = event.settings?.eventPassword;

  if (requiresPassword && expectedPassword) {
    if (!providedPassword) {
      return {
        success: false,
        status: 'password_required',
        event,
        errorMessage: 'This memory capsule is password protected. Please enter the event password to proceed.',
      };
    }

    if (providedPassword.trim() !== expectedPassword.trim()) {
      return {
        success: false,
        status: 'password_required',
        event,
        errorMessage: 'Incorrect event password. Please verify the password with your host and try again.',
      };
    }
  }

  // All checks passed!
  return {
    success: true,
    status: 'valid',
    event,
  };
}

/**
  Creates a guest session and join log record
 */
export function recordGuestJoinSession(
  event: KavaEvent,
  joinMethod: 'code' | 'qr' | 'invitation_link' = 'code',
  status: EventJoinLog['status'] = 'success'
): EventJoinLog {
  const device = detectDeviceType();
  const browser = detectBrowserName();
  const country = detectUserCountry();
  const referralSource = typeof document !== 'undefined' && document.referrer ? document.referrer : 'Direct Link';

  const joinLog: EventJoinLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    eventId: event.id,
    timestamp: new Date().toISOString(),
    device,
    browser,
    country,
    referralSource,
    joinMethod,
    status,
  };

  // Save guest session in LocalStorage for persistence
  if (typeof localStorage !== 'undefined') {
    const sessionData = {
      sessionId: `sess-${Date.now()}`,
      eventId: event.id,
      eventCode: event.code,
      joinedAt: joinLog.timestamp,
      device,
      browser,
      country,
      joinMethod,
    };
    localStorage.setItem('kava_active_guest_session', JSON.stringify(sessionData));
  }

  return joinLog;
}
