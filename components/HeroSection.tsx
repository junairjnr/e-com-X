"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import DealCard from "./DealCard";
import StoreImage from "./StoreImage";
import { PRODUCTS, HERO_SLIDER_SLIDES, HERO_CATEGORY_STRIP, FLASH_OFFERS } from "@/lib/data";
import HardwarePromoBanner from "./HardwarePromoBanner";
import HeroPromoBanner from "./HeroPromoBanner";
import type { Product, WishlistItem } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  onAddToCart?: (product: Product, color: string, size: string) => void;
  onWishlistToggle?: (item: WishlistItem) => void;
  wishlist?: WishlistItem[];
  onProductClick?: (product: Product) => void;
  onViewAllDeals?: () => void;
  onCategoryClick?: (category: string) => void;
}

const SLIDES = HERO_SLIDER_SLIDES;
const CATEGORIES = HERO_CATEGORY_STRIP;

function FlashSaleBlock({
  offer,
  onShop,
}: {
  offer: (typeof FLASH_OFFERS)[number];
  onShop?: () => void;
}) {
  return (
    <div className="flex h-full w-full lg:h-[460px]">
      <div className="coupon-ticket relative flex h-full min-h-[280px] w-full cursor-pointer flex-row items-stretch transition-transform duration-300 hover:-translate-y-0.5 lg:min-h-0">
        <div className="flex w-[38%] min-w-[108px] max-w-[130px] shrink-0 flex-col items-center justify-center gap-2 px-3 py-6 sm:px-4 lg:py-8">
          <span className="font-eyebrow text-[8px] tracking-widest text-accent">Today only</span>
          <div className="text-center">
            <span className="font-price block text-xl font-bold leading-none text-primary sm:text-2xl">
              {offer.price}
            </span>
            {offer.oldPrice && (
              <span className="font-price mt-1 block text-[11px] text-muted line-through">
                {offer.oldPrice}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onShop}
            className="mt-1 w-full rounded-full bg-gradient-to-r from-accent-hover to-accent px-3 py-2 font-label text-[10px] font-bold text-white shadow-[0_3px_12px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition-all hover:brightness-105"
          >
            {offer.cta}
          </button>
        </div>

        <div className="coupon-divider" aria-hidden />

        <div className="relative flex min-w-0 flex-1 flex-col justify-center px-4 py-6 sm:px-5 lg:py-8">
          {offer.img && (
            <StoreImage
              src={offer.img}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
            />
          )}
          <div className="relative z-[1]">
            <span className="font-eyebrow inline-block rounded border border-accent/25 bg-accent/10 px-2 py-0.5 text-[8px] tracking-widest text-accent">
              {offer.tag}
            </span>
            <h3 className="mt-2 font-sans text-base font-extrabold leading-tight text-primary sm:text-lg">
              {offer.title}
            </h3>
            <p className="mt-1 text-xs font-medium text-primary/70">{offer.subtitle}</p>
            {offer.highlight && (
              <p className="mt-2 border-t border-dashed border-accent/20 pt-2 text-[10px] leading-relaxed text-muted">
                {offer.highlight}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({
  onProductClick,
  onViewAllDeals,
  onCategoryClick,
}: HeroSectionProps) {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const go = useCallback((idx: number) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setSlide(idx);
      setFading(false);
    }, 350);
  }, [fading]);

  useEffect(() => {
    const t = setInterval(() => go((slide + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [slide, go]);

  const s = SLIDES[slide];

  const scrollCat = (dir: "l" | "r") => {
    catRef.current?.scrollBy({ left: dir === "l" ? -320 : 320, behavior: "smooth" });
  };

  const handleProductClick = (product: Product) => {
    onProductClick?.(product);
  };

  const dealProducts = PRODUCTS.slice(0, 4);

  return (
    <section className="w-full bg-white font-sans select-none pb-12 pt-[150px] md:pt-[104px]">
      {/* Top Banner */}
      <div className="bg-footer font-label text-accent py-2 px-4 text-center text-[13px] font-semibold tracking-wide">
        🎉 MEGA SALE: Up to 50% OFF on selected items! Free shipping on orders over QAR 299
      </div>

      {/* Categories — horizontal scroll; arrows desktop only */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4 md:py-6 border-b border-border/50">
        <div className="flex items-start gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollCat("l")}
            className="mt-2 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-lg leading-none text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:bg-bg-soft sm:mt-2.5 md:mt-3.5 md:flex"
          >
            ‹
          </button>

          <div
            ref={catRef}
            className="flex min-w-0 flex-1 items-start gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-1 sm:gap-5 md:gap-8"
            style={{ scrollPaddingInline: "12px" }}
          >
            {CATEGORIES.map((c, idx) => (
              <button
                key={`${c.label}-${idx}`}
                type="button"
                onClick={() => onCategoryClick?.(c.shopCategory)}
                className="flex w-[56px] shrink-0 snap-start flex-col items-center gap-1.5 border-0 bg-transparent p-0 cursor-pointer group sm:w-[60px] md:w-[68px] md:gap-2"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/40 sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <StoreImage
                    src={c.img}
                    alt={c.label}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <span className="font-label flex min-h-[2rem] w-full items-center justify-center text-center text-[10px] font-semibold leading-tight text-primary group-hover:text-accent sm:min-h-[2.25rem] sm:text-[11px] md:text-[12px] line-clamp-2">
                  {c.label}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollCat("r")}
            className="mt-2 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-lg leading-none text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:bg-bg-soft sm:mt-2.5 md:mt-3.5 md:flex"
          >
            ›
          </button>
        </div>
      </div>

      {/* Highlight promo banner (under categories) */}
      <HeroPromoBanner onExplore={onViewAllDeals} />

      {/* Hero Area + Flash Sale Side */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {/* Main Slider - Takes 3 columns */}
          <div className="lg:col-span-3 relative rounded-2xl md:rounded-3xl overflow-hidden h-[340px] md:h-[460px] shadow-[0_8px_30px_color-mix(in_srgb,var(--color-primary)_10%,transparent)] bg-bg-soft group">
            <AnimatePresence initial={false}>
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <StoreImage
                  src={s.img}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="relative z-10 flex items-center h-full px-6 md:px-12 w-full max-w-[500px]">
                  <div className="bg-white/90 backdrop-blur-xl border border-white/80 p-6 md:p-8 rounded-3xl flex flex-col gap-3 w-full shadow-[0_12px_40px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]">
                    <span className="font-eyebrow text-[10px] md:text-[11px] tracking-widest px-3 py-1 rounded-full w-fit bg-gradient-to-r from-accent to-accent-hover text-white shadow-md">
                      {s.eyebrow}
                    </span>
                    <h2 className="font-display text-[clamp(24px,3vw,36px)] font-extrabold leading-tight whitespace-pre-line text-primary drop-shadow-sm">
                      {s.title}
                    </h2>
                    <p className="text-muted font-medium text-[13px] md:text-[14px] leading-relaxed">
                      {s.sub}
                    </p>
                    <button className="mt-2 w-fit px-6 py-2.5 text-sm font-bold clay-button">
                      {s.cta}
                    </button>
                    <span className="text-muted text-[10px] font-medium">{s.note}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <button
                  onClick={() => go((slide - 1 + SLIDES.length) % SLIDES.length)}
                  className="w-10 h-16 md:w-12 md:h-20 bg-white/80 backdrop-blur-md border border-white/50 shadow-[4px_0_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-3xl text-primary hover:bg-white transition-all rounded-r-xl"
                >
                  ‹
                </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <button
                  onClick={() => go((slide + 1) % SLIDES.length)}
                  className="w-10 h-16 md:w-12 md:h-20 bg-white/80 backdrop-blur-md border border-white/50 shadow-[-4px_0_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-3xl text-primary hover:bg-white transition-all rounded-l-xl"
                >
                  ›
                </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === slide ? "w-8 bg-accent shadow-[0_0_8px_color-mix(in_srgb,var(--color-accent)_80%,transparent)]" : "w-2 bg-white/50 border border-border"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Flash Sale — visible on all screen sizes (below slider on mobile) */}
          <div className="lg:col-span-1">
            <FlashSaleBlock offer={FLASH_OFFERS[0]} onShop={onViewAllDeals} />
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="max-w-[1400px] mx-auto px-4 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-primary">Today&apos;s Deals</h2>
            <p className="text-sm text-muted mt-1">Grab these limited-time offers before they&apos;re gone!</p>
          </div>
          <button
            type="button"
            onClick={onViewAllDeals}
            className="px-5 py-2.5 clay-button text-sm border-0 cursor-pointer"
          >
            View All Deals
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {dealProducts.map((product) => (
            <DealCard
              key={product.id}
              product={product}
              onClick={handleProductClick}
            />
          ))}
        </div>
      </div>

      <HardwarePromoBanner onCategoryClick={onCategoryClick} />
    </section>
  );
}