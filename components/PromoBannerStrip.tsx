"use client";

import StoreImage from "./StoreImage";
import { HARDWARE_SHOWCASE } from "@/lib/data";

interface PromoBannerStripProps {
  onCategoryClick?: (cat: string) => void;
}

export default function PromoBannerStrip({ onCategoryClick }: PromoBannerStripProps) {
  const banners = [
    {
      bg: "linear-gradient(135deg, #111827 0%, #1F2937 100%)",
      accent: "#9CA3AF",
      tag: "Best Seller",
      title: "Touch POS System",
      sub: "All-in-one retail & hospitality hardware",
      cta: "Shop POS",
      cat: "POS Systems",
      img: HARDWARE_SHOWCASE.img,
    },
    {
      bg: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      accent: "#9CA3AF",
      tag: "New Arrivals",
      title: "Networking & Servers",
      sub: "Cisco, HP, Dell enterprise solutions",
      cta: "Explore",
      cat: "Storage",
      img: null,
    },
  ];

  return (
    <div className="mb-2 grid grid-cols-1 gap-2 px-0 md:grid-cols-2">
      {banners.map((b, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onCategoryClick?.(b.cat)}
          className="group relative flex h-[140px] w-full cursor-pointer items-center justify-between overflow-hidden border-0 px-6 py-5 text-left md:h-[160px] md:px-8"
          style={{ background: b.bg }}
        >
          {/* Glow */}
          <span
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30"
            style={{ background: `radial-gradient(circle, ${b.accent}, transparent 70%)` }}
          />
          <div className="relative z-[1]">
            <span
              className="mb-2 inline-block rounded-full px-2.5 py-0.5 font-eyebrow text-[9px] font-bold tracking-widest"
              style={{ background: `${b.accent}22`, color: b.accent, border: `1px solid ${b.accent}55` }}
            >
              {b.tag}
            </span>
            <div className="font-display text-xl font-extrabold leading-tight text-white md:text-2xl">{b.title}</div>
            <div className="mt-1 font-label text-[11px] text-white/60">{b.sub}</div>
            <div
              className="mt-3 inline-flex items-center gap-1.5 rounded-sm px-4 py-1.5 font-label text-[12px] font-bold transition-all group-hover:brightness-110"
              style={{ background: b.accent, color: "#1a0a00" }}
            >
              {b.cta} →
            </div>
          </div>
          {b.img && (
            <div className="relative z-[1] h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl opacity-80 transition-opacity group-hover:opacity-100 md:h-[120px] md:w-[120px]">
              <StoreImage src={b.img} alt={b.title} className="h-full w-full object-cover" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
