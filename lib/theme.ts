/** Tailwind class strings — use theme CSS variables via @theme tokens */
export const tw = {
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-primary-mid to-accent shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] hover:from-accent-hover hover:to-primary-light",
  btnPrimarySm:
    "inline-flex items-center justify-center gap-1 rounded-full px-3.5 py-1.5 text-[10px] font-semibold text-white whitespace-nowrap transition-all duration-300 bg-gradient-to-br from-primary-mid to-accent max-w-full",
  btnDark:
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white bg-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-mid",
  btnOutline:
    "inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold border border-border bg-white text-primary transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5",
  glassCard:
    "bg-white/85 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_color-mix(in_srgb,var(--color-primary)_8%,transparent)]",
  productGrid:
    "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5",
  saleBadge:
    "inline-flex items-center justify-center rounded-md bg-sale px-2 py-1 text-[11px] font-black leading-none text-white shadow-[0_2px_8px_color-mix(in_srgb,var(--color-sale)_45%,transparent)]",
  card:
    "rounded-2xl border border-border bg-white shadow-[0_4px_16px_color-mix(in_srgb,var(--color-primary)_6%,transparent)]",
  cardHover:
    "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]",
  warmGradient:
    "bg-gradient-to-br from-accent-hover via-accent to-primary-light",
  warmGradientH:
    "bg-gradient-to-r from-accent-hover via-accent to-primary-light",
  footer:
    "bg-footer text-white/90",
  sectionBg:
    "bg-white",
} as const;

const BADGE_BG: Record<string, string> = {
  WAREHOUSE: "bg-teal-700",
  "MOBILE POS": "bg-violet-600",
  RETAIL: "bg-cyan-600",
  SECURITY: "bg-red-600",
  POWER: "bg-orange-600",
  SOFTWARE: "bg-cyan-600",
  SURVEILLANCE: "bg-red-600",
  STORAGE: "bg-primary",
  DISPLAY: "bg-cyan-600",
  PREMIUM: "bg-yellow-700",
};

/** Tailwind bg class for product badge labels; falls back to primary-mid. */
export function badgeBgClass(badge: string): string {
  return BADGE_BG[badge] ?? "bg-primary-mid";
}

const SWATCH_BG: Record<string, string> = {
  "#1A1208": "bg-[#1A1208]",
  "#E8E4DC": "bg-[#E8E4DC]",
  "#F5F0E8": "bg-[#F5F0E8]",
  "#D1D5DB": "bg-[#D1D5DB]",
  "#111827": "bg-[#111827]",
  "#A16207": "bg-[#A16207]",
  "#F8FAFC": "bg-[#F8FAFC]",
};

/** Tailwind bg class for product/filter color swatches. */
export function swatchBgClass(hex: string): string {
  return SWATCH_BG[hex] ?? "bg-primary-mid";
}
