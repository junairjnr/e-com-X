"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import DealCard from "./DealCard";
import StoreImage from "./StoreImage";
import { PRODUCTS, HERO_SLIDER_SLIDES, HERO_CATEGORY_STRIP, FLASH_OFFERS } from "@/lib/data";
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
  timeLeft,
  offer,
}: {
  timeLeft: { hours: number; minutes: number; seconds: number };
  offer: (typeof FLASH_OFFERS)[number];
}) {
  return (
    <div className="flex flex-col gap-3 w-full lg:h-[460px] lg:gap-4">
      {/* Countdown */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-[0_4px_16px_color-mix(in_srgb,var(--color-primary)_6%,transparent)] shrink-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-hover" />
        <h3 className="mt-1 mb-3 flex items-center gap-1.5 text-base font-extrabold text-primary">
          <span className="text-lg text-accent">⚡</span> Flash Sale
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-sale animate-pulse">
            Live
          </span>
        </h3>
        <div className="flex gap-2">
          {[
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Min" },
            { value: timeLeft.seconds, label: "Sec" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex-1 rounded-xl border border-border bg-bg-soft px-2 py-2.5 text-center shadow-inner"
            >
              <div className="text-xl font-bold tabular-nums text-primary">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-muted">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer card */}
      <div className="relative flex-1 overflow-hidden rounded-2xl cursor-pointer bg-footer p-4 sm:p-5 shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5">
        {offer.img && (
          <>
            <StoreImage
              src={offer.img}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-footer/95 via-footer/90 to-footer/98" />
          </>
        )}
        <div className="relative z-[1] flex h-full flex-col justify-between gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-start">
          <div className="flex-1">
            <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              {offer.tag}
            </span>
            <h3 className="mt-2.5 text-lg sm:text-xl font-extrabold leading-tight text-white">
              {offer.title}
            </h3>
            <p className="mt-1 text-xs font-medium text-white/60">{offer.subtitle}</p>
            <p className="mt-1 hidden text-[11px] text-accent-soft sm:block">{offer.highlight}</p>
          </div>
          <div className="flex shrink-0 items-end justify-between gap-3 sm:flex-col sm:items-end lg:items-start">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{offer.price}</span>
              {offer.oldPrice && (
                <span className="text-xs line-through text-white/40">{offer.oldPrice}</span>
              )}
            </div>
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-primary shadow-md transition-colors hover:bg-accent-soft"
            >
              {offer.cta}
            </button>
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
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const s = SLIDES[slide];

  const scrollCat = (dir: "l" | "r") => {
    catRef.current?.scrollBy({ left: dir === "l" ? -320 : 320, behavior: "smooth" });
  };

  const handleProductClick = (product: Product) => {
    onProductClick?.(product);
  };

  const dealProducts = PRODUCTS.slice(0, 4);

  return (
    <section className="w-full bg-white font-sans select-none pb-12 pt-[104px]">
      {/* Top Banner */}
      <div className="bg-footer text-accent py-2 px-4 text-center text-[13px] font-semibold tracking-wide">
        🎉 MEGA SALE: Up to 50% OFF on selected items! Free shipping on orders over QAR 299
      </div>

      {/* Categories Section - Flipkart Style at the top */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-6 border-b border-border/50">
        <div className="relative">
          <button
            onClick={() => scrollCat("l")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-[0_4px_12px_color-mix(in_srgb,var(--color-primary)_10%,transparent)] border border-border flex items-center justify-center text-xl text-primary hover:bg-bg-soft transition-all opacity-90 hover:opacity-100"
          >
            ‹
          </button>
          
          <div
            ref={catRef}
            className="flex gap-6 md:gap-10 overflow-x-auto px-6 py-2 snap-x snap-mandatory scrollbar-hide items-start"
          >
            {CATEGORIES.map((c, idx) => (
              <button
                key={`${c.label}-${idx}`}
                type="button"
                onClick={() => onCategoryClick?.(c.shopCategory)}
                className="flex w-[72px] md:w-20 shrink-0 flex-col items-center gap-2 md:gap-2.5 cursor-pointer group snap-start border-0 bg-transparent p-0"
              >
                <div className="h-16 w-16 md:h-[84px] md:w-[84px] overflow-hidden rounded-full border border-border bg-white shadow-[0_4px_12px_color-mix(in_srgb,var(--color-primary)_8%,transparent)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/40 group-hover:shadow-[0_8px_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]">
                  <StoreImage
                    src={c.img}
                    alt={c.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-[11px] md:text-[12px] font-semibold text-primary text-center group-hover:text-accent transition-colors leading-tight line-clamp-2 max-w-[72px] md:max-w-[80px]">
                  {c.label}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCat("r")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-[0_4px_12px_color-mix(in_srgb,var(--color-primary)_10%,transparent)] border border-border flex items-center justify-center text-xl text-primary hover:bg-bg-soft transition-all opacity-90 hover:opacity-100"
          >
            ›
          </button>
        </div>
      </div>

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
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit bg-gradient-to-r from-accent to-accent-hover text-white shadow-md">
                      {s.eyebrow}
                    </span>
                    <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold leading-tight whitespace-pre-line text-primary drop-shadow-sm">
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
            <FlashSaleBlock timeLeft={timeLeft} offer={FLASH_OFFERS[0]} />
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary">Today's Deals</h2>
            <p className="text-sm text-muted mt-1">Grab these limited-time offers before they're gone!</p>
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
    </section>
  );
}