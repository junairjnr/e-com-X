"use client";
import { useState, useMemo, useEffect } from "react";
import { PRODUCTS, PRICE_MAX, fmt } from "@/lib/data";
import { tw } from "@/lib/theme";
import type { FilterState, SortOption, WishlistItem, Product } from "@/lib/types";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import * as Icons from "./Icons";

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceRange: [0, PRICE_MAX],
  ratings: [],
  colors: [],
  sizes: [],
  tags: [],
};

interface ShopPageProps {
  onAddToCart: (product: Product, color: string, size: string) => void;
  onWishlistToggle: (item: WishlistItem) => void;
  wishlist: WishlistItem[];
  onProductClick: (product: Product) => void;
  initialCategory?: string;
  onHomeClick?: () => void;
}

export default function ShopPage({ onAddToCart, onWishlistToggle, wishlist, onProductClick, initialCategory, onHomeClick }: ShopPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [sort, setSort] = useState<SortOption>("relevance");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, categories: [initialCategory] }));
    }
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (filters.categories.length > 0) {
      list = list.filter(p => p.category && filters.categories.includes(p.category));
    }

    list = list.filter(p => p.price >= filters.priceRange[0] && p.price <= (filters.priceRange[1] >= PRICE_MAX ? Infinity : filters.priceRange[1]));

    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings.map(Number));
      list = list.filter(p => p.rating >= minRating);
    }

    if (filters.colors.length > 0) {
      list = list.filter(p =>
        filters.colors.some(c => p.colors.some(pc => pc.name.toLowerCase().includes(c.toLowerCase())))
      );
    }

    if (filters.sizes.length > 0) {
      list = list.filter(p => filters.sizes.some(s => p.sizes.includes(s)));
    }

    if (filters.tags.length > 0) {
      list = list.filter(p => filters.tags.some(t => p.tags.includes(t)));
    }

    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew)); break;
      case "bestseller": list = list.filter(p => p.isBestSeller).concat(list.filter(p => !p.isBestSeller)); break;
    }

    return list;
  }, [filters, sort]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const pageTitle = filters.categories.length === 1
    ? filters.categories[0]
    : filters.categories.length > 1
      ? "Filtered Products"
      : "All Products";

  const activeChips: { label: string; remove: () => void }[] = [];
  filters.categories.forEach(c => activeChips.push({ label: c, remove: () => setFilters(f => ({ ...f, categories: f.categories.filter(x => x !== c) })) }));
  filters.ratings.forEach(r => activeChips.push({ label: `${r}★+`, remove: () => setFilters(f => ({ ...f, ratings: f.ratings.filter(x => x !== r) })) }));
  filters.colors.forEach(c => activeChips.push({ label: c, remove: () => setFilters(f => ({ ...f, colors: f.colors.filter(x => x !== c) })) }));
  filters.sizes.forEach(s => activeChips.push({ label: s, remove: () => setFilters(f => ({ ...f, sizes: f.sizes.filter(x => x !== s) })) }));
  filters.tags.forEach(t => activeChips.push({ label: t, remove: () => setFilters(f => ({ ...f, tags: f.tags.filter(x => x !== t) })) }));
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < PRICE_MAX) {
    const maxLabel = filters.priceRange[1] >= PRICE_MAX ? `${fmt(PRICE_MAX)}+` : fmt(filters.priceRange[1]);
    activeChips.push({
      label: `${fmt(filters.priceRange[0])} – ${maxLabel}`,
      remove: () => setFilters(f => ({ ...f, priceRange: [0, PRICE_MAX] })),
    });
  }

  return (
    <div className={`min-h-screen ${tw.sectionBg} pt-[120px]`}>
      <div className="mx-auto max-w-[1400px] px-4 pb-20 md:px-6">
        <div className="mb-6 flex items-center gap-1.5 text-[13px] text-muted">
          <button type="button" onClick={onHomeClick} className="font-medium text-accent hover:text-accent-hover bg-transparent border-0 cursor-pointer p-0">
            Home
          </button>
          <Icons.ChevronRight />
          <span className="font-semibold text-primary">{pageTitle}</span>
        </div>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[32px] md:text-[38px] font-bold leading-tight text-primary">
              {filters.categories.length === 1 ? (
                <span className="italic text-accent">{pageTitle}</span>
              ) : (
                <>All <span className="italic text-accent">Products</span></>
              )}
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex md:hidden items-center gap-1.5 rounded-full bg-gradient-to-br from-primary-mid to-accent px-4 py-2.5 text-[13px] font-semibold text-primary shadow-[0_4px_16px_color-mix(in_srgb,var(--color-accent)_30%,transparent)]"
            >
              <Icons.SlidersH />
              Filters {activeChips.length > 0 && `(${activeChips.length})`}
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="appearance-none rounded-full border border-border bg-white py-2.5 pl-4 pr-10 text-[13px] font-medium text-primary shadow-[0_2px_8px_rgba(0,0,0,0.06)] outline-none cursor-pointer"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
                <option value="bestseller">Bestsellers</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted flex">
                <Icons.ChevronDown />
              </span>
            </div>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {activeChips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs font-semibold text-primary"
              >
                {chip.label}
                <button type="button" onClick={chip.remove} className="flex border-0 bg-transparent cursor-pointer p-0 leading-none text-accent-hover">
                  ✕
                </button>
              </span>
            ))}
            <button type="button" onClick={clearFilters} className="text-xs font-medium text-muted underline bg-transparent border-0 cursor-pointer">
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 md:gap-7 items-start">
          <div className="hidden md:block w-[260px] shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} onClear={clearFilters} resultCount={filtered.length} />
          </div>

          <div className="min-w-0 flex-1">
            {filtered.length === 0 ? (
              <div className="py-20 text-center px-6">
                <div className="mb-4 text-5xl">🔍</div>
                <div className="mb-2 text-lg font-semibold text-primary">No matches found</div>
                <div className="mb-6 text-sm text-muted">Try adjusting your filters</div>
                <button type="button" onClick={clearFilters} className={tw.btnPrimary}>Clear Filters</button>
              </div>
            ) : (
              <div className={"product-grid-equal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onWishlistToggle={onWishlistToggle}
                    isWishlisted={wishlist.some(w => w.id === product.id)}
                    onClick={onProductClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[300]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-bg p-6 animate-fade-up scrollbar-thin">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Filters</h2>
              <button type="button" onClick={() => setMobileFilterOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-border text-muted">
                <Icons.X />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={setFilters} onClear={clearFilters} resultCount={filtered.length} mobile />
            <button
              type="button"
              className={`${tw.btnPrimary} w-full mt-4`}
              onClick={() => setMobileFilterOpen(false)}
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
