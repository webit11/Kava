export interface WorkspaceBrandKit {
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  typography: string;
  typographyWeight: string;
  typographyScale: number;
  typographyFallback: string;
  updatedAt?: string;
}

export const DEFAULT_BRAND_KIT: WorkspaceBrandKit = {
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&h=80&q=80',
  primaryColor: '#0F172A',
  accentColor: '#C19A2E',
  typography: 'Inter',
  typographyWeight: '500',
  typographyScale: 1.0,
  typographyFallback: 'sans-serif',
};

export function loadGoogleFont(fontName: string): void {
  if (!fontName || fontName === 'Inter' || fontName === 'sans-serif' || fontName === 'serif') return;
  const fontId = `gfont-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(fontId)) return;

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

export function getWorkspaceBrandKit(workspaceId?: string): WorkspaceBrandKit {
  const id = workspaceId || 'default';

  // 1. Check composite object store
  const storedJson = localStorage.getItem(`kava_workspace_brand_kit_${id}`);
  if (storedJson) {
    try {
      const parsed = JSON.parse(storedJson);
      if (parsed && (parsed.primaryColor || parsed.accentColor || parsed.logoUrl)) {
        return {
          ...DEFAULT_BRAND_KIT,
          ...parsed,
          typographyScale: parsed.typographyScale ? parseFloat(parsed.typographyScale) : DEFAULT_BRAND_KIT.typographyScale,
        };
      }
    } catch (e) {
      console.error('Error parsing workspace brand kit JSON:', e);
    }
  }

  // 2. Check individual key entries for backward compatibility
  const logoUrl = localStorage.getItem(`kava_brand_logo_${id}`);
  const primaryColor = localStorage.getItem(`kava_brand_primary_${id}`);
  const accentColor = localStorage.getItem(`kava_brand_accent_${id}`);
  const typography = localStorage.getItem(`kava_brand_typography_${id}`);
  const typographyWeight = localStorage.getItem(`kava_brand_typography_weight_${id}`);
  const typographyScaleStr = localStorage.getItem(`kava_brand_typography_scale_${id}`);
  const typographyFallback = localStorage.getItem(`kava_brand_typography_fallback_${id}`);

  if (logoUrl || primaryColor || accentColor || typography) {
    return {
      logoUrl: logoUrl || DEFAULT_BRAND_KIT.logoUrl,
      primaryColor: primaryColor || DEFAULT_BRAND_KIT.primaryColor,
      accentColor: accentColor || DEFAULT_BRAND_KIT.accentColor,
      typography: typography || DEFAULT_BRAND_KIT.typography,
      typographyWeight: typographyWeight || DEFAULT_BRAND_KIT.typographyWeight,
      typographyScale: typographyScaleStr ? parseFloat(typographyScaleStr) : DEFAULT_BRAND_KIT.typographyScale,
      typographyFallback: typographyFallback || DEFAULT_BRAND_KIT.typographyFallback,
    };
  }

  // 3. Check admin workspace entries
  const savedWorkspaces = localStorage.getItem('kava_admin_workspaces');
  if (savedWorkspaces) {
    try {
      const parsedWorkspaces = JSON.parse(savedWorkspaces);
      const found = parsedWorkspaces.find((ws: any) => ws.id === id);
      if (found && found.brandKit) {
        const bk = found.brandKit;
        return {
          logoUrl: bk.logoUrl || DEFAULT_BRAND_KIT.logoUrl,
          primaryColor: bk.primaryColor || DEFAULT_BRAND_KIT.primaryColor,
          accentColor: bk.accentColor || DEFAULT_BRAND_KIT.accentColor,
          typography: bk.typography || DEFAULT_BRAND_KIT.typography,
          typographyWeight: bk.typographyWeight || DEFAULT_BRAND_KIT.typographyWeight,
          typographyScale: bk.typographyScale ? parseFloat(bk.typographyScale) : DEFAULT_BRAND_KIT.typographyScale,
          typographyFallback: bk.typographyFallback || DEFAULT_BRAND_KIT.typographyFallback,
        };
      }
    } catch (e) {
      console.error('Error checking admin workspaces for brand kit:', e);
    }
  }

  return DEFAULT_BRAND_KIT;
}

export function saveWorkspaceBrandKit(workspaceId: string, brandKit: WorkspaceBrandKit): void {
  const id = workspaceId || 'default';
  const updatedKit: WorkspaceBrandKit = {
    ...brandKit,
    updatedAt: new Date().toISOString(),
  };

  // 1. Store composite object
  localStorage.setItem(`kava_workspace_brand_kit_${id}`, JSON.stringify(updatedKit));

  // 2. Store individual keys
  localStorage.setItem(`kava_brand_logo_${id}`, updatedKit.logoUrl);
  localStorage.setItem(`kava_brand_primary_${id}`, updatedKit.primaryColor);
  localStorage.setItem(`kava_brand_accent_${id}`, updatedKit.accentColor);
  localStorage.setItem(`kava_brand_typography_${id}`, updatedKit.typography);
  localStorage.setItem(`kava_brand_typography_weight_${id}`, updatedKit.typographyWeight);
  localStorage.setItem(`kava_brand_typography_scale_${id}`, updatedKit.typographyScale.toString());
  localStorage.setItem(`kava_brand_typography_fallback_${id}`, updatedKit.typographyFallback);

  // 3. Sync with kava_admin_workspaces
  const savedWorkspaces = localStorage.getItem('kava_admin_workspaces');
  if (savedWorkspaces) {
    try {
      const parsedWorkspaces = JSON.parse(savedWorkspaces);
      const updated = parsedWorkspaces.map((ws: any) => {
        if (ws.id === id) {
          return {
            ...ws,
            brandKit: {
              logoUrl: updatedKit.logoUrl,
              primaryColor: updatedKit.primaryColor,
              accentColor: updatedKit.accentColor,
              typography: updatedKit.typography,
              typographyWeight: updatedKit.typographyWeight,
              typographyScale: updatedKit.typographyScale.toString(),
              typographyFallback: updatedKit.typographyFallback,
            },
          };
        }
        return ws;
      });
      localStorage.setItem('kava_admin_workspaces', JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating admin workspaces brand kit:', e);
    }
  }

  // 4. Load font and apply design tokens
  applyBrandKitCSSVariables(updatedKit);

  // 5. Notify all components across windows/tabs
  window.dispatchEvent(new CustomEvent('kava_brand_kit_updated', { detail: { workspaceId: id, brandKit: updatedKit } }));
}

export function applyBrandKitCSSVariables(brandKit: WorkspaceBrandKit, element: HTMLElement = document.documentElement): void {
  element.style.setProperty('--brand-primary', brandKit.primaryColor);
  element.style.setProperty('--brand-accent', brandKit.accentColor);
  element.style.setProperty('--brand-font', `"${brandKit.typography}", ${brandKit.typographyFallback || 'sans-serif'}`);
  element.style.setProperty('--brand-logo', `url("${brandKit.logoUrl}")`);
  element.style.setProperty('--brand-typography-scale', brandKit.typographyScale.toString());
  element.style.setProperty('--brand-typography-weight', brandKit.typographyWeight);
  
  loadGoogleFont(brandKit.typography);

  // Inject or update dynamic style element for brand utility classes & typography targets
  if (typeof document !== 'undefined') {
    const styleId = 'kava-brand-kit-dynamic-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      :root {
        --brand-primary: ${brandKit.primaryColor};
        --brand-accent: ${brandKit.accentColor};
        --brand-font: "${brandKit.typography}", ${brandKit.typographyFallback || 'sans-serif'};
        --brand-logo: url("${brandKit.logoUrl}");
      }

      .brand-primary-bg { background-color: var(--brand-primary) !important; }
      .brand-primary-text { color: var(--brand-primary) !important; }
      .brand-primary-border { border-color: var(--brand-primary) !important; }

      .brand-accent-bg { background-color: var(--brand-accent) !important; }
      .brand-accent-text { color: var(--brand-accent) !important; }
      .brand-accent-border { border-color: var(--brand-accent) !important; }

      .brand-font-family,
      .phone-viewport-content,
      .phone-viewport-content *:not(.font-mono),
      .guest-flow-container,
      .guest-flow-container *:not(.font-mono),
      .invitation-studio-container,
      .invitation-studio-container *:not(.font-mono),
      .email-preview-container,
      .email-preview-container *:not(.font-mono),
      .live-screen-container,
      .live-screen-container *:not(.font-mono),
      .dashboard-preview-container,
      .dashboard-preview-container *:not(.font-mono),
      .event-page-container,
      .event-page-container *:not(.font-mono) {
        font-family: "${brandKit.typography}", ${brandKit.typographyFallback || 'sans-serif'} !important;
      }
    `;
  }
}

export function getEffectiveEventBranding(event: any, workspaceId?: string): WorkspaceBrandKit {
  const wsKit = getWorkspaceBrandKit(workspaceId || event?.workspaceId);

  if (event?.settings?.overrideWorkspaceBrand) {
    return {
      logoUrl: event.settings.globalBrandLogo !== undefined ? event.settings.globalBrandLogo : wsKit.logoUrl,
      primaryColor: event.settings.globalColorPrimary || wsKit.primaryColor,
      accentColor: event.settings.globalColorAccent || wsKit.accentColor,
      typography: event.settings.presentationFontFamily || event.settings.wishFont || wsKit.typography,
      typographyWeight: event.settings.typographyWeight || wsKit.typographyWeight,
      typographyScale: event.settings.typographyScale || wsKit.typographyScale,
      typographyFallback: event.settings.typographyFallback || wsKit.typographyFallback,
    };
  }

  return wsKit;
}
