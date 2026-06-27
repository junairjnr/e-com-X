/** Global design tokens — mirrored in globals.css @theme */
export const theme = {
  bg: "#FDFAF4",
  bgSoft: "#F7F1E3",
  primary: "#1A1208",
  primaryMid: "#2C1E0A",
  accent: "#C89B3C",           // Rich gold
  accentHover: "#A87C2A",      // Deeper gold on hover
  accentSoft: "#FEF9EC",       // Very light gold tint
  accentLight: "#F0D080",      // Bright gold highlight
  muted: "#7D6E5A",
  border: "#E8D9B8",
  btnGradient: "linear-gradient(135deg, #2C1E0A 0%, #C89B3C 100%)",
  btnGradientHover: "linear-gradient(135deg, #A87C2A 0%, #F0D080 100%)",
} as const;

/** Tailwind class strings for reuse in components */
export const tw = {
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-primary transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-accent to-accent-light shadow-[0_4px_20px_rgba(200,155,60,0.38)] hover:shadow-[0_8px_28px_rgba(200,155,60,0.50)] hover:from-accent-hover hover:to-accent",
  btnPrimarySm:
    "inline-flex items-center justify-center gap-1 rounded-full px-3.5 py-1.5 text-[10px] font-semibold text-primary transition-all duration-300 bg-gradient-to-br from-accent to-accent-light shadow-[0_2px_12px_rgba(200,155,60,0.30)] hover:from-accent-hover hover:to-accent",
  btnDark:
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white bg-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-mid shadow-[0_4px_20px_rgba(26,18,8,0.30)]",
  btnOutline:
    "inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold border border-accent/50 bg-white/60 backdrop-blur-sm text-primary transition-all hover:bg-accent hover:text-primary hover:-translate-y-0.5",
  glassCard:
    "bg-white/85 backdrop-blur-xl border border-accent/20 shadow-[0_8px_32px_rgba(200,155,60,0.08)]",
  productGrid:
    "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5",
} as const;
