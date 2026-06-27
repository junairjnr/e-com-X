"use client";
import { CATEGORIES, getCategoryCount } from "@/lib/data";
import * as Icons from "./Icons";

interface CategoriesSectionProps {
  onCategoryClick?: (category: string) => void;
  onViewAll?: () => void;
}

export default function CategoriesSection({ onCategoryClick, onViewAll }: CategoriesSectionProps) {
  return (
    <section className="py-24 bg-bg">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
              Shop by Category
            </div>
            <h2 className="font-display text-[clamp(36px,4vw,52px)] font-bold leading-tight text-primary">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.name}
              cat={cat}
              count={getCategoryCount(cat.name)}
              large={i === 0}
              onClick={() => onCategoryClick?.(cat.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, count, large, onClick }: { cat: typeof CATEGORIES[number]; count: number; large?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[22px] border-0 p-0 text-left w-full cursor-pointer shadow-[0_8px_40px_rgba(15,40,71,0.1)] transition-transform duration-400 hover:-translate-y-1 ${
        large ? "col-span-2 aspect-[21/8]" : "col-span-1 aspect-[16/7]"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://images.unsplash.com/${cat.img}?w=800&q=85`}
        alt={cat.name}
        className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cat.color }} />
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3.5">
        <div className={`font-display font-bold text-white leading-tight ${large ? "text-lg" : "text-base"}`}>
          {cat.name}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-white/70">{count} product{count !== 1 ? "s" : ""}</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
            <Icons.ArrowRight />
          </div>
        </div>
      </div>
    </button>
  );
}
