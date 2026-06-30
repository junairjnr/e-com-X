"use client";
import { CATEGORIES, getCategoryDisplayCount } from "@/lib/data";
import { tw } from "@/lib/theme";
import { categoryImage } from "@/lib/images";
import StoreImage from "./StoreImage";
import * as Icons from "./Icons";

interface CategoriesSectionProps {
  onCategoryClick?: (category: string) => void;
  onViewAll?: () => void;
}

type CategoryLayout = "hero" | "wide" | "tile";

/** lg+ bento: 6 columns × 4 rows (12 categories) */
const BENTO_SPANS: readonly string[] = [
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-6",
];

function getLayout(index: number): CategoryLayout {
  if (index === 0) return "hero";
  if (index === 11) return "wide";
  return "tile";
}

export default function CategoriesSection({ onCategoryClick, onViewAll }: CategoriesSectionProps) {
  return (
    <section className={`py-12 sm:py-16 md:py-20 ${tw.sectionBg}`}>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex min-w-0 items-start gap-4">
            <div
              aria-hidden
              className="mt-1 hidden h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-accent to-accent-hover sm:block"
            />
            <div className="min-w-0">
              <p className="font-eyebrow mb-2 text-[11px] text-accent">Shop by Category</p>
              <h2 className="font-sans text-[clamp(1.375rem,3.5vw,2.25rem)] font-bold leading-[1.15] tracking-tight text-primary">
                Find the right <span className="text-accent">solution</span> for your business
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                POS systems, printers, scanners, and software — all in one place.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className={`${tw.btnOutline} shrink-0 self-start sm:self-center`}
          >
            View All <Icons.ArrowRight />
          </button>
        </div>

        {/* ── Mobile: horizontal snap carousel (< md) ── */}
        <div className="md:hidden">
          <p className="font-label mb-3 text-[11px] text-muted">Swipe to explore →</p>
          <div
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-3 scrollbar-hide"
            style={{ scrollPaddingInline: "16px" }}
          >
            {CATEGORIES.map((cat, index) => (
              <CategoryCard
                key={cat.name}
                cat={cat}
                index={index}
                count={getCategoryDisplayCount(cat)}
                layout={index === 0 ? "hero" : "tile"}
                onClick={() => onCategoryClick?.(cat.shopCategory ?? cat.name)}
                className={
                  index === 0
                    ? "w-[min(82vw,320px)] shrink-0 snap-start min-h-[240px]"
                    : "w-[min(72vw,260px)] shrink-0 snap-start min-h-[200px]"
                }
              />
            ))}
          </div>
        </div>

        {/* ── Tablet: 2-column grid (md → lg) ── */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-4 lg:hidden">
          {CATEGORIES.map((cat, index) => (
            <CategoryCard
              key={cat.name}
              cat={cat}
              index={index}
              count={getCategoryDisplayCount(cat)}
              layout={index === 0 ? "hero" : index === 11 ? "wide" : "tile"}
              onClick={() => onCategoryClick?.(cat.shopCategory ?? cat.name)}
              className={
                index === 0
                  ? "md:col-span-2 min-h-[260px]"
                  : index === 11
                    ? "md:col-span-2 min-h-[140px]"
                    : "min-h-[180px]"
              }
            />
          ))}
        </div>

        {/* ── Desktop: bento mosaic (lg+) ── */}
        <div className="hidden lg:grid lg:grid-cols-6 lg:grid-rows-4 lg:gap-4 lg:auto-rows-[minmax(148px,1fr)]">
          {CATEGORIES.map((cat, index) => (
            <CategoryCard
              key={cat.name}
              cat={cat}
              index={index}
              count={getCategoryDisplayCount(cat)}
              layout={getLayout(index)}
              onClick={() => onCategoryClick?.(cat.shopCategory ?? cat.name)}
              className={`min-h-[148px] ${BENTO_SPANS[index]}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  index,
  count,
  layout,
  onClick,
  className = "",
}: {
  cat: (typeof CATEGORIES)[number];
  index: number;
  count: number;
  layout: CategoryLayout;
  onClick?: () => void;
  className?: string;
}) {
  const isHero = layout === "hero";
  const isWide = layout === "wide";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border border-border/60 bg-bg-soft p-0 text-left shadow-[0_4px_20px_color-mix(in_srgb,var(--color-primary)_7%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isWide ? "flex min-h-[120px] flex-row items-stretch" : "flex min-h-[160px] flex-col"
      } ${className}`}
    >
      {/* Accent strip */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 z-[3] h-0.5"
        style={{ background: `linear-gradient(90deg, ${cat.color}, var(--color-accent-light))` }}
      />

      {/* Background image */}
      <div
        className={`overflow-hidden ${
          isWide
            ? "relative h-full min-h-[120px] w-[36%] min-w-[112px] max-w-[220px] shrink-0 self-stretch"
            : "absolute inset-0 h-full w-full"
        }`}
      >
        <StoreImage
          src={categoryImage(cat.img)}
          alt=""
          aria-hidden
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Overlay */}
      <div
        aria-hidden
        className={`absolute inset-0 z-[1] ${
          isWide
            ? "bg-gradient-to-r from-black/75 via-black/40 to-black/55"
            : "bg-gradient-to-t from-black/88 via-black/40 to-black/15"
        }`}
      />

      {/* Hover tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 70% 100%, color-mix(in srgb, ${cat.color} 30%, transparent), transparent 60%)`,
        }}
      />

      {/* Index */}
      <span className="absolute top-3 left-3 z-[3] font-mono text-[10px] font-semibold tabular-nums text-white/45 group-hover:text-accent-light">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div
        className={`relative z-[2] flex flex-col ${
          isWide
            ? "min-w-0 flex-1 justify-center px-4 py-4 sm:px-6"
            : "mt-auto px-4 pb-4 pt-10 sm:px-5 sm:pb-5"
        }`}
      >
        <h3
          className={`font-sans font-semibold leading-snug text-white ${
            isHero
              ? "text-lg sm:text-xl lg:text-2xl"
              : isWide
                ? "line-clamp-2 text-base sm:text-lg"
                : "line-clamp-2 text-sm sm:text-base"
          }`}
        >
          {cat.name}
        </h3>

        {isHero && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/60 sm:text-[13px]">
            Explore {count}+ products for retail, hospitality &amp; enterprise.
          </p>
        )}

        <div className={`flex items-center justify-between gap-2 ${isHero ? "mt-3" : "mt-2"}`}>
          <span className="font-label text-[11px] text-white/65">{count}+ items</span>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-accent/60 group-hover:bg-accent/25">
            <Icons.ArrowRight />
          </span>
        </div>
      </div>
    </button>
  );
}
