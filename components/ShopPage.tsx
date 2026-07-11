"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, PRICE_MAX, fmt } from "@/lib/data";
import type { FilterState, SortOption, WishlistItem, Product } from "@/lib/types";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import * as Icons from "./Icons";

/* ─── Constants ──────────────────────────────────────────────── */
const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceRange: [0, PRICE_MAX],
  ratings: [],
  colors: [],
  sizes: [],
  tags: [],
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance",   label: "Relevance" },
  { value: "price-asc",   label: "Price: Low → High" },
  { value: "price-desc",  label: "Price: High → Low" },
  { value: "rating",      label: "Top Rated" },
  { value: "newest",      label: "New Arrivals" },
  { value: "bestseller",  label: "Best Sellers" },
];

/* ─── Types ──────────────────────────────────────────────────── */
interface ShopPageProps {
  onAddToCart: (product: Product, color: string, size: string) => void;
  onWishlistToggle: (item: WishlistItem) => void;
  wishlist: WishlistItem[];
  onProductClick: (product: Product) => void;
  initialCategory?: string;
  onHomeClick?: () => void;
}

/* ═══════════════════════════════════════════════════════════════
   SHOP PAGE
═══════════════════════════════════════════════════════════════ */
export default function ShopPage({
  onAddToCart, onWishlistToggle, wishlist,
  onProductClick, initialCategory, onHomeClick,
}: ShopPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [sort, setSort] = useState<SortOption>("relevance");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  /* Sync category from parent navigation */
  useEffect(() => {
    if (initialCategory) setFilters(f => ({ ...f, categories: [initialCategory] }));
  }, [initialCategory]);

  /* Scroll to top on mount so --header-height resets to full size */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  /* ── Filtering + Sorting ── */
  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (filters.categories.length)
      list = list.filter(p => p.category && filters.categories.includes(p.category));
    list = list.filter(
      p => p.price >= filters.priceRange[0] &&
           p.price <= (filters.priceRange[1] >= PRICE_MAX ? Infinity : filters.priceRange[1])
    );
    if (filters.ratings.length) {
      const min = Math.min(...filters.ratings.map(Number));
      list = list.filter(p => p.rating >= min);
    }
    if (filters.colors.length)
      list = list.filter(p => filters.colors.some(c => p.colors.some(pc => pc.name.toLowerCase().includes(c.toLowerCase()))));
    if (filters.sizes.length)
      list = list.filter(p => filters.sizes.some(s => p.sizes.includes(s)));
    if (filters.tags.length)
      list = list.filter(p => filters.tags.some(t => p.tags.includes(t)));

    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating":     list.sort((a, b) => b.rating - a.rating); break;
      case "newest":     list = [...list.filter(p => p.isNew), ...list.filter(p => !p.isNew)]; break;
      case "bestseller": list = [...list.filter(p => p.isBestSeller), ...list.filter(p => !p.isBestSeller)]; break;
    }
    return list;
  }, [filters, sort]);

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  /* ── Active filter chips ── */
  const chips: { label: string; remove: () => void }[] = [];
  filters.categories.forEach(c => chips.push({ label: c, remove: () => setFilters(f => ({ ...f, categories: f.categories.filter(x => x !== c) })) }));
  filters.ratings.forEach(r => chips.push({ label: `${r}★+`, remove: () => setFilters(f => ({ ...f, ratings: f.ratings.filter(x => x !== r) })) }));
  filters.colors.forEach(c => chips.push({ label: c, remove: () => setFilters(f => ({ ...f, colors: f.colors.filter(x => x !== c) })) }));
  filters.sizes.forEach(s => chips.push({ label: s, remove: () => setFilters(f => ({ ...f, sizes: f.sizes.filter(x => x !== s) })) }));
  filters.tags.forEach(t => chips.push({ label: t, remove: () => setFilters(f => ({ ...f, tags: f.tags.filter(x => x !== t) })) }));
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < PRICE_MAX) {
    const maxL = filters.priceRange[1] >= PRICE_MAX ? `${fmt(PRICE_MAX)}+` : fmt(filters.priceRange[1]);
    chips.push({ label: `${fmt(filters.priceRange[0])} – ${maxL}`, remove: () => setFilters(f => ({ ...f, priceRange: [0, PRICE_MAX] })) });
  }

  const pageTitle = filters.categories.length === 1
    ? filters.categories[0]
    : filters.categories.length > 1 ? "Filtered Results" : "All Products";

  return (
    <div
      className="page-top-offset min-h-screen"
      style={{ background: "#f3f4f6" }}
    >
      {/* ────────────────────────────────────────────────────
          STICKY TOOLBAR
      ──────────────────────────────────────────────────── */}
      <div
        className="sticky z-[100] border-b border-gray-200 bg-white shadow-sm mr-[20px] ml-[20px] rounded-lg"
        style={{ top: "var(--header-height, 120px)", transition: "top 0.28s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div className="mx-auto max-w-[1440px] px-5">
          <div className="flex items-center justify-between gap-3 py-3">

            {/* Left: breadcrumb */}
            <nav className="flex min-w-0 items-center gap-1.5 text-[12px]">
              <motion.button
                type="button"
                onClick={onHomeClick}
                className="shrink-0 border-0 bg-transparent p-0 font-semibold text-gray-700 hover:underline cursor-pointer"
                whileTap={{ scale: 0.96 }}
              >
                Home
              </motion.button>
              <span className="text-gray-300">›</span>
              <span className="truncate font-semibold text-gray-800">{pageTitle}</span>
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                {filtered.length}
              </span>
            </nav>

            {/* Right: controls */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Sort */}
              <div className="relative hidden sm:block">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  className="h-9 cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-[12px] font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-400"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">▾</span>
              </div>

              {/* Grid / List toggle */}
              <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
                {(["grid", "list"] as const).map(v => (
                  <motion.button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`flex h-9 w-9 items-center justify-center text-[15px] transition-colors ${
                      view === v ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                    whileTap={{ scale: 0.92 }}
                    title={v === "grid" ? "Grid view" : "List view"}
                  >
                    {v === "grid" ? "⊞" : "☰"}
                  </motion.button>
                ))}
              </div>

              {/* Mobile filter button */}
              <motion.button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-gray-900 px-4 text-[12px] font-bold text-white shadow-sm md:hidden"
                whileTap={{ scale: 0.95 }}
              >
                <Icons.SlidersH />
                Filters
                {chips.length > 0 && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[9px] font-black text-gray-900 leading-none px-1">
                    {chips.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {chips.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2 pb-3">
                  {chips.map((chip, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={chip.remove}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-800 transition-colors hover:bg-gray-100 cursor-pointer"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      whileTap={{ scale: 0.93 }}
                    >
                      {chip.label} <span className="text-gray-500">✕</span>
                    </motion.button>
                  ))}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="cursor-pointer border-0 bg-transparent p-0 text-[11px] font-medium text-gray-400 underline underline-offset-2 hover:text-gray-600"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────
          MAIN CONTENT — Sidebar + Products
      ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-5 py-5">
        <div className="flex items-start gap-5">

          {/* ── Sidebar ── */}
          <aside
            className="hidden w-[250px] shrink-0 md:block scrollbar-thin"
            style={{ position: "sticky", top: "calc(var(--header-height, 120px) + 60px)", maxHeight: "calc(100vh - var(--header-height, 120px) - 80px)", overflowY: "auto" }}
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: "1.5px solid #e8e8e8" }}>
              {/* Sidebar header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Icons.SlidersH />
                  <span className="font-display text-[14px] font-bold text-gray-900">Filters</span>
                  {chips.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-black text-gray-700">
                      {chips.length}
                    </span>
                  )}
                </div>
                {chips.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="cursor-pointer rounded-lg border-0 bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-200"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Sidebar body — FilterSidebar fills this */}
              <div className="px-3 py-2">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                  resultCount={filtered.length}
                />
              </div>
            </div>
          </aside>

          {/* ── Products ── */}
          <main className="min-w-0 flex-1">
            {/* Section title */}
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h1 className="font-display text-[20px] font-extrabold text-gray-900 md:text-[24px]">
                  {pageTitle}
                </h1>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                </p>
              </div>
              {/* Mobile sort */}
              <div className="relative sm:hidden">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  className="h-9 appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-7 text-[12px] font-medium text-gray-700 outline-none"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">▾</span>
              </div>
            </div>

            {/* Products grid / list / empty */}
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center shadow-sm"
                style={{ border: "1.5px solid #eee" }}
              >
                <div className="mb-4 text-6xl">🔍</div>
                <div className="mb-2 font-display text-xl font-bold text-gray-800">No products found</div>
                <div className="mb-6 text-sm text-gray-500">Try adjusting your filters</div>
                <motion.button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-2xl bg-gray-900 px-8 py-3 font-label text-sm font-bold text-white shadow-md"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Clear all filters
                </motion.button>
              </motion.div>
            ) : view === "list" ? (
              /* ── LIST VIEW ── */
              <div className="flex flex-col gap-3">
                {filtered.map((product, i) => {
                  const disc = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;
                  return (
                    <motion.div
                      key={product.id}
                      className="flex gap-4 rounded-2xl bg-white p-4"
                      style={{ border: "1.5px solid #f0f0f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.025, duration: 0.3 }}
                      whileHover={{ boxShadow: "0 6px 24px rgba(17,24,39,0.10)", borderColor: "#9CA3AF" }}
                    >
                      {/* Image */}
                      <motion.div
                        className="flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-2"
                        onClick={() => onProductClick(product)}
                        whileHover={{ scale: 1.04 }}
                      >
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain" />
                      </motion.div>

                      {/* Info */}
                      <div className="flex flex-1 min-w-0 flex-col justify-between">
                        <div className="cursor-pointer" onClick={() => onProductClick(product)}>
                          <div className="mb-0.5 font-eyebrow text-[9px] text-gray-500">{product.brand}</div>
                          <div className="mb-1.5 line-clamp-2 font-sans text-[14px] font-semibold leading-snug text-gray-900">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                              style={{ background: "#111827" }}
                            >
                              {product.rating} ★
                            </span>
                            <span className="text-[11px] text-gray-400">({product.reviews?.toLocaleString()})</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="font-price text-[18px] font-extrabold text-gray-900">{fmt(product.price)}</span>
                            {product.originalPrice && (
                              <span className="font-price text-[12px] text-gray-400 line-through">{fmt(product.originalPrice)}</span>
                            )}
                            {disc && (
                              <span className="font-label text-[11px] font-bold text-gray-600">{disc}% off</span>
                            )}
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => onAddToCart(product, product.colors[0]?.name || "", product.sizes[0] || "")}
                            className="flex items-center gap-1.5 rounded-full px-5 py-2 font-label text-[12px] font-bold text-white"
                            style={{ background: "linear-gradient(135deg,#111827,#1F2937)", boxShadow: "0 3px 12px rgba(17,24,39,0.3)" }}
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                          >
                            <Icons.Plus /> Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* ── GRID VIEW ── */
              <motion.div
                className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────
          MOBILE FILTER DRAWER (spring slide-up)
      ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[310] flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl bg-white"
              style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="h-1 w-10 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[16px] font-bold text-gray-900">Filters</span>
                  {chips.length > 0 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-700">
                      {chips.length} active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {chips.length > 0 && (
                    <button type="button" onClick={clearFilters} className="cursor-pointer rounded-xl border-0 bg-gray-100 px-3 py-1.5 text-[11px] font-semibold text-gray-600">
                      Clear all
                    </button>
                  )}
                  <motion.button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icons.X />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable filter body */}
              <div className="flex-1 overflow-y-auto px-5 py-3">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                  resultCount={filtered.length}
                  mobile
                />
              </div>

              {/* Sticky show results button */}
              <div className="border-t border-gray-100 bg-white px-5 py-4 pb-safe">
                <motion.button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full rounded-2xl py-3.5 font-label text-[14px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#111827,#1F2937)", boxShadow: "0 4px 16px rgba(17,24,39,0.35)" }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Show {filtered.length} Results
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
