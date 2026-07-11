"use client";

import { motion } from "framer-motion";
import { fmt } from "@/lib/data";
import StoreImage from "./StoreImage";
import * as Icons from "./Icons";
import type { Product } from "@/lib/types";

interface FlipkartProductRowProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  onViewAll: () => void;
  bgColor?: string;
}

export default function FlipkartProductRow({
  title,
  subtitle,
  products,
  onProductClick,
  onViewAll,
  bgColor = "#ffffff",
}: FlipkartProductRowProps) {
  return (
    <section className="mb-2 overflow-hidden" style={{ background: bgColor, borderRadius: "0" }}>
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 md:px-6">
        <div>
          <h2 className="font-display text-xl font-extrabold text-gray-900 md:text-2xl">{title}</h2>
          {subtitle && <p className="mt-0.5 font-label text-xs text-gray-500">{subtitle}</p>}
        </div>
        <motion.button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1.5 rounded-full border border-[#111827] px-5 py-2 font-label text-[12px] font-bold text-[#111827] transition-all"
          whileHover={{ background: "#111827", color: "#ffffff", scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          View All <Icons.ArrowRight />
        </motion.button>
      </div>

      {/* Cards scroll row */}
      <div className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide px-5 pb-5 md:px-6">
        {products.map((product, i) => {
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
                width: "clamp(150px, 22vw, 200px)",
                background: "#fff",
                borderRadius: "16px",
                border: "1.5px solid #f0f0f0",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{
                y: -5,
                boxShadow: "0 16px 40px rgba(17,24,39,0.14)",
                borderColor: "#9CA3AF",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image — all-side rounded inner */}
              <div
                className="relative mx-2.5 mt-2.5 flex items-center justify-center overflow-hidden"
                style={{
                  borderRadius: "12px",
                  height: "140px",
                  background: "linear-gradient(135deg, #f8f9fa, #f3f4f6)",
                }}
              >
                <motion.div
                  className="h-full w-full flex items-center justify-center p-3"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.35 }}
                >
                  <StoreImage
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-contain drop-shadow-sm"
                  />
                </motion.div>

                {/* Discount badge */}
                {discount && (
                  <span
                    className="absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 font-label text-[10px] font-black text-white"
                    style={{ background: "linear-gradient(135deg,#111827,#1F2937)", boxShadow: "0 1px 6px rgba(17,24,39,0.35)" }}
                  >
                    -{discount}%
                  </span>
                )}
                {product.isNew && (
                  <span
                    className="absolute right-1.5 top-1.5 rounded-full px-2 py-0.5 font-label text-[9px] font-black text-white"
                    style={{ background: "linear-gradient(135deg,#0891b2,#0e7490)" }}
                  >
                    NEW
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col px-3 pt-2.5 pb-3">
                <div className="mb-0.5 font-eyebrow text-[8px] tracking-widest text-gray-500 uppercase">
                  {product.brand}
                </div>
                <div className="mb-1.5 line-clamp-2 font-sans text-[12px] font-semibold leading-snug text-gray-800">
                  {product.name}
                </div>

                {/* Rating */}
                <div className="mb-1.5 flex items-center gap-1">
                  <span
                    className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-label text-[9px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#111827,#1F2937)" }}
                  >
                    {product.rating} ★
                  </span>
                  <span className="font-label text-[9px] text-gray-400">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="font-price text-[14px] font-extrabold text-gray-900">{fmt(product.price)}</div>
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
