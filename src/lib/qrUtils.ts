import { KavaEvent, KavaQrConfig } from '../types';
import { generateBrandedQrDataUrl, generateBrandedQrCanvas, validateQrScannability } from './qrGenerator';
import { getSuperAdminQrConfig, fetchSuperAdminQrConfig } from './qrConfig';

/**
 * Returns the full guest invitation URL for a given KAVA event or code.
 */
export function getEventGuestLink(
  eventOrCode: (Pick<KavaEvent, 'code'> & { settings?: { invitationToken?: string } }) | string
): string {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : (typeof location !== 'undefined' ? location.origin : '');
  
  if (typeof eventOrCode === 'string') {
    const cleanCode = eventOrCode.trim().toUpperCase();
    return `${origin}/join?code=${encodeURIComponent(cleanCode)}`;
  }

  if (!eventOrCode) return origin;

  const token = eventOrCode.settings?.invitationToken || eventOrCode.code;
  return `${origin}/join?code=${encodeURIComponent(token)}`;
}

/**
 * Returns a short readable domain display string for guest join cards
 */
export function getEventGuestShortDisplay(
  eventOrCode: (Pick<KavaEvent, 'code'> & { settings?: { invitationToken?: string } }) | string
): string {
  const host = typeof window !== 'undefined' && window.location.host ? window.location.host : 'kava.app';
  
  if (typeof eventOrCode === 'string') {
    return `${host}/join?code=${eventOrCode.trim().toUpperCase()}`;
  }

  if (!eventOrCode) return `${host}/join`;

  const token = eventOrCode.settings?.invitationToken || eventOrCode.code;
  return `${host}/join?code=${token}`;
}

/**
 * Generates a PNG Data URL for a QR code encoding the provided content string,
 * automatically applying the official KAVA logo and Superadmin visual style.
 */
export async function generateQrCodeDataUrl(
  content: string,
  width = 500,
  customConfig?: Partial<KavaQrConfig>
): Promise<string> {
  if (!content) return '';
  return await generateBrandedQrDataUrl(content, customConfig, width);
}

/**
 * Generates and downloads the high-resolution event invitation QR PNG (1000px print ready)
 */
export async function downloadEventQrPng(
  eventOrLink: (Pick<KavaEvent, 'code' | 'name'> & { settings?: { invitationToken?: string } }) | string,
  customConfig?: Partial<KavaQrConfig>
): Promise<boolean> {
  try {
    const link = typeof eventOrLink === 'string' ? eventOrLink : getEventGuestLink(eventOrLink);
    const code = typeof eventOrLink === 'string' ? 'invitation' : (eventOrLink.code || 'invitation');
    const name = typeof eventOrLink === 'string' ? 'KAVA-Event' : (eventOrLink.name || 'Event').replace(/[^a-zA-Z0-9_-]/g, '_');

    const dataUrl = await generateBrandedQrDataUrl(link, customConfig, 1000);
    if (!dataUrl) return false;

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `KAVA-QR-${name}-${code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch (err) {
    console.error('Failed to download QR PNG:', err);
    return false;
  }
}

/**
 * Generates a printable invitation card canvas and triggers download or print preview
 */
export async function generatePrintableInvitationCard(
  event: KavaEvent,
  customConfig?: Partial<KavaQrConfig>
): Promise<string> {
  const qrUrl = await generateBrandedQrDataUrl(getEventGuestLink(event), customConfig, 800);
  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = 1200;
  cardCanvas.height = 1600;
  const ctx = cardCanvas.getContext('2d');
  if (!ctx) return qrUrl;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1200, 1600);

  // Border & Gold Accent
  ctx.strokeStyle = '#C19A2E';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1120, 1520);
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2;
  ctx.strokeRect(55, 55, 1090, 1490);

  // Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#C19A2E';
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('— OFFICIAL INVITATION —', 600, 140);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(event.name || 'Memory Capsule', 600, 220);

  ctx.fillStyle = '#64748B';
  ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const subInfo = `${event.date || 'Active Event'} • ${event.location || 'Celebration'}`;
  ctx.fillText(subInfo, 600, 270);

  // Draw QR Image
  const qrImg = new Image();
  await new Promise((resolve) => {
    qrImg.onload = resolve;
    qrImg.src = qrUrl;
  });
  ctx.drawImage(qrImg, 300, 360, 600, 600);

  // Scan instructions
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('SCAN WITH CAMERA TO JOIN', 600, 1040);

  ctx.fillStyle = '#64748B';
  ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Upload your favorite photos, videos, voice notes & wishes', 600, 1090);

  // Event Code Badge
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(400, 1150, 400, 90);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.strokeRect(400, 1150, 400, 90);

  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('CAPSULE ACCESS CODE', 600, 1180);

  ctx.fillStyle = '#0F172A';
  ctx.font = '900 34px monospace';
  ctx.fillText(event.code || 'KAVA', 600, 1222);

  // Footer Web Link
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 18px monospace';
  ctx.fillText(getEventGuestLink(event), 600, 1310);

  // KAVA Branding Seal
  ctx.fillStyle = '#C19A2E';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('POWERED BY KAVA MEMORY CAPSULES', 600, 1500);

  return cardCanvas.toDataURL('image/png');
}

export { generateBrandedQrCanvas, generateBrandedQrDataUrl, validateQrScannability, getSuperAdminQrConfig, fetchSuperAdminQrConfig };
