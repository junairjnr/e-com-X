"use client";

import { HARDWARE_SHOWCASE } from "@/lib/data";
import { useClientTheme } from "./ThemeProvider";
import StoreImage from "./StoreImage";
import * as Icons from "./Icons";

interface HardwarePromoBannerProps {
  onCategoryClick?: (category: string) => void;
}

export default function HardwarePromoBanner({ onCategoryClick }: HardwarePromoBannerProps) {
  const { client } = useClientTheme();
  const { sectionEyebrow, sectionSubtitle, featured } = HARDWARE_SHOWCASE;

  return (
    <section className="w-full pb-10 md:pb-12">
      <div className="relative w-full overflow-hidden border-y border-border/80 bg-gradient-to-r from-accent-soft/50 via-white to-bg-soft shadow-[0_8px_40px_rgba(17,24,39,0.06)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_12%_50%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_92%_40%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_50%)]" />
        <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent-light via-accent to-accent-hover" />

        <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 py-7 sm:px-6 sm:py-8 lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:py-9">
          {/* Copy */}
          <div className="min-w-0 flex-1 lg:max-w-[62%]">
            <p className="font-eyebrow text-[11px] text-accent">{sectionEyebrow}</p>
            <h2 className="mt-1 font-sans text-5xl font-bold leading-tight tracking-tight text-primary">
              Reliable hardware for <span className="text-accent">your business</span>
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{sectionSubtitle}</p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft/80 px-3 py-1">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                {featured.category}
              </span>
            </div>

            <h3 className="mt-3 font-display text-xl md:text-3xl font-bold text-primary">
              {featured.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted md:text-[15px]">
              {featured.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-1.5">
                <span className="flex gap-0.5 text-accent">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icons.Star key={i} filled />
                  ))}
                </span>
                <span className="font-label text-[12px] font-semibold text-primary/80">
                  4.9/5 · 1,300+ businesses
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="font-label text-[12px] font-semibold text-primary/80">
                {featured.modelCount} models in stock
              </span>
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {featured.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-[12px] text-primary/80 sm:text-[13px]">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-soft text-accent">
                    <Icons.Check />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              {featured.services.map((service) => (
                <span
                  key={service}
                  className="rounded-md border border-border bg-white/80 px-2.5 py-1 font-label text-[9px] font-medium uppercase tracking-wide text-muted shadow-sm"
                >
                  {service}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onCategoryClick?.(featured.shopCategory)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-gradient-to-r from-accent-hover via-accent to-primary-light px-6 py-2.5 font-label text-[13px] font-bold text-white shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent)_30%,transparent)] transition-all hover:brightness-105"
              >
                {featured.cta}
                <Icons.ArrowRight />
              </button>
              <a
                href={client.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white px-5 py-2.5 font-label text-[13px] font-semibold text-primary no-underline shadow-sm transition-colors hover:border-accent/50 hover:bg-accent-soft/50"
              >
                {featured.demoCta}
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex w-full shrink-0 items-center justify-center lg:w-[38%] xl:w-[36%]">
            <div className="relative w-full max-w-[360px] rounded-2xl border border-border/80 bg-white/90 p-5 shadow-[0_8px_32px_rgba(17,24,39,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-sm sm:p-6 md:p-7">
              <span className="absolute -top-3 right-4 z-[1] inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-hover via-accent to-primary-light px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_4px_14px_color-mix(in_srgb,var(--color-accent)_35%,transparent)]">
                <Icons.Star filled />
                Best Seller
              </span>
              <StoreImage
                src={featured.img}
                alt={featured.title}
                className="mx-auto h-[180px] w-full object-contain sm:h-[220px] md:h-[260px] lg:h-[280px]"
              />
            </div>
            <div className="absolute -bottom-2 left-4 flex items-center gap-2 rounded-xl border border-accent/25 bg-white px-3.5 py-2 shadow-[0_4px_16px_rgba(17,24,39,0.1)] sm:left-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icons.Truck />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-label text-[11px] font-bold text-primary">Same-day delivery</span>
                <span className="font-label text-[9px] uppercase tracking-wide text-muted">across Doha</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
