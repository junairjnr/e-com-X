"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, fmt } from "@/lib/data";
import StoreImage from "./StoreImage";
import * as Icons from "./Icons";
import type { Product } from "@/lib/types";

interface FlashSaleSectionProps {
  onProductClick: (product: Product) => void;
  onViewAll: () => void;
}

function useCountdown(targetHours = 8) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });
  useEffect(() => {
    const end = Date.now() + targetHours * 3600 * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetHours]);
  return time;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function FlashSaleSection({ onProductClick, onViewAll }: FlashSaleSectionProps) {
  const time = useCountdown(8);
  const deals = PRODUCTS.filter(p => p.originalPrice).slice(0, 8);

  return (
    <section className="mb-2 overflow-hidden" style={{ background: "#ffffff", borderRadius: "0" }}>
      {/* Header */}
      <div
        className="flex flex-wrap items-center gap-3 px-5 py-4 md:px-6"
        style={{ background: "linear-gradient(135deg, #111827 0%, #1F2937 60%, #374151 100%)" }}
      >
        {/* Fire icon + title */}
        <div className="flex items-center gap-2">
          <motion.span
            className="text-2xl"
            animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            🔥
          </motion.span>
          <h2 className="font-display text-xl font-extrabold text-white md:text-2xl">
            Deal of the Day
          </h2>
        </div>

        {/* Countdown timer */}
        <div className="flex items-center gap-1.5">
          <span className="font-label text-xs font-semibold text-slate-300">Ends in</span>
          <div className="flex items-center gap-1">
            {[time.h, time.m, time.s].map((val, i) => (
              <span key={i} className="flex items-center gap-1">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={val}
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 12, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-8 min-w-[32px] items-center justify-center rounded-lg bg-white/15 px-1.5 font-mono text-[14px] font-extrabold text-white backdrop-blur-sm tabular-nums border border-white/20"
                  >
                    {pad(val)}
                  </motion.span>
                </AnimatePresence>
                {i < 2 && <span className="font-bold text-white/70 text-sm">:</span>}
              </span>
            ))}
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onViewAll}
          className="ml-auto flex items-center gap-1.5 rounded-full bg-white px-5 py-2 font-label text-[12px] font-bold text-gray-800"
          whileHover={{ scale: 1.05, boxShadow: "0 4px 16px rgba(255,255,255,0.3)" }}
          whileTap={{ scale: 0.97 }}
        >
          View All <Icons.ArrowRight />
        </motion.button>
      </div>

      {/* Cards */}
      <div className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide bg-gray-50 px-5 py-4 md:px-6">
        {deals.map((product, i) => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : null;

          return (
            <motion.button
              key={product.id}
              type="button"
              onClick={() => onProductClick(product)}
              className="group flex shrink-0 flex-col text-left"
              style={{
                width: "clamp(150px, 20vw, 185px)",
                background: "#fff",
                borderRadius: "16px",
                border: "1.5px solid #f0f0f0",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{
                y: -5,
                boxShadow: "0 16px 40px rgba(17,24,39,0.14)",
                borderColor: "#9CA3AF",
              }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Image — fully rounded inner container */}
              <div
                className="relative mx-2.5 mt-2.5 flex items-center justify-center overflow-hidden"
                style={{
                  borderRadius: "12px",
                  height: "130px",
                  background: "linear-gradient(135deg, #f8f9fa, #f3f4f6)",
                }}
              >
                <motion.div
                  className="h-full w-full flex items-center justify-center p-3"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <StoreImage
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-contain drop-shadow-sm"
                  />
                </motion.div>

                {discount && (
                  <span
                    className="absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 font-label text-[10px] font-black text-white"
                    style={{ background: "linear-gradient(135deg,#111827,#1F2937)", boxShadow: "0 1px 6px rgba(17,24,39,0.4)" }}
                  >
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col px-3 pt-2.5 pb-3">
                <div className="mb-1 line-clamp-2 font-sans text-[12px] font-semibold leading-snug text-gray-800">
                  {product.name}
                </div>
                <div className="font-price text-[15px] font-extrabold text-gray-900">
                  {fmt(product.price)}
                </div>
                {product.originalPrice && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-price text-[10px] text-gray-400 line-through">{fmt(product.originalPrice)}</span>
                    {discount && (
                      <span className="font-label text-[10px] font-bold text-gray-600">{discount}% off</span>
                    )}
                  </div>
                )}
                <span className="mt-1 font-label text-[9px] font-semibold text-gray-500">✓ Free Delivery</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
