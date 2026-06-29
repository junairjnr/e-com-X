/** Brand theme tokens — applied as CSS variables on :root */
export interface ClientTheme {
  bg: string;
  bgSoft: string;
  primary: string;
  primaryMid: string;
  primaryLight: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  accentLight: string;
  muted: string;
  border: string;
}

export interface ClientConfig {
  id: string;
  name: string;
  tagline: string;
  siteUrl: string;
  phone: string;
  theme: ClientTheme;
}

/** Optional per-page theme overrides (merge on top of client theme) */
export interface PageThemeOverride {
  pageId: string;
  theme: Partial<ClientTheme>;
}
