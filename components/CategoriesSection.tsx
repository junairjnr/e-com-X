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

export default function CategoriesSection({ onCategoryClick, onViewAll }: CategoriesSectionProps) {
  return (
    <section className={`py-16 md:py-20 ${tw.sectionBg}`}>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
              Shop by Category
            </div>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-tight text-primary">
              Find Your<br />
              <span className="italic text-accent">Right Solution</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1.5 border-0 bg-transparent text-sm font-semibold text-primary cursor-pointer hover:text-accent transition-colors"
          >
            View All <Icons.ArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.name}
              cat={cat}
              count={getCategoryDisplayCount(cat)}
              onClick={() => onCategoryClick?.(cat.shopCategory ?? cat.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  count,
  onClick,
}: {
  cat: (typeof CATEGORIES)[number];
  count: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[16/7] w-full overflow-hidden rounded-[18px] border-0 p-0 text-left cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1"
    >
      <StoreImage
        src={categoryImage(cat.img)}
        alt={cat.name}
        className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />
      <div className="absolute bottom-0 left-0 right-0 px-3.5 py-3 md:px-4 md:py-3.5">
        <div className="font-display text-sm md:text-base font-bold text-white leading-tight line-clamp-1">
          {cat.name}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-[11px] text-white/70">{count}+ items</span>
          <div className="flex h-6 w-6 md:h-7 md:w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
            <Icons.ArrowRight />
          </div>
        </div>
      </div>
    </button>
  );
}
