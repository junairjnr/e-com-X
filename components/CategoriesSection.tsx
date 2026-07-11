"use client";
import { motion } from "framer-motion";
import { CATEGORIES, getCategoryDisplayCount } from "@/lib/data";
import { categoryImage } from "@/lib/images";
import StoreImage from "./StoreImage";

interface CategoriesSectionProps {
  onCategoryClick?: (category: string) => void;
  onViewAll?: () => void;
}

export default function CategoriesSection({ onCategoryClick, onViewAll }: CategoriesSectionProps) {
  return (
    <section className="mb-2 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 md:px-6">
        <div>
          <h2 className="font-display text-xl font-extrabold text-gray-900 md:text-2xl">Shop by Category</h2>
          <p className="mt-0.5 font-label text-xs text-gray-500">Explore all product categories</p>
        </div>
        <motion.button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1.5 rounded-full border border-[#111827] px-5 py-2 font-label text-[12px] font-bold text-[#111827]"
          whileHover={{ background: "#111827", color: "#ffffff", scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          View All
        </motion.button>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-3 gap-2 px-3 pb-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 md:px-5">
        {CATEGORIES.map((cat, i) => {
          const count = getCategoryDisplayCount(cat);
          return (
            <motion.button
              key={cat.name}
              type="button"
              onClick={() => onCategoryClick?.(cat.shopCategory ?? cat.name)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center"
              style={{
                border: "1.5px solid #f0f0f0",
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 32px rgba(17,24,39,0.14)",
                borderColor: "#9CA3AF",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.96 }}
            >
              {/* Circle image with gradient ring on hover */}
              <motion.div
                className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full md:h-20 md:w-20"
                style={{
                  background: "linear-gradient(135deg, #f8f9fa, #f3f4f6)",
                  border: "2px solid #e5e7eb",
                }}
                whileHover={{ borderColor: "#9CA3AF", scale: 1.06 }}
                transition={{ duration: 0.25 }}
              >
                <StoreImage
                  src={categoryImage(cat.img)}
                  alt={cat.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <div>
                <span className="block font-label text-[11px] font-semibold leading-tight text-gray-800 md:text-[12px]">
                  {cat.name}
                </span>
                <span className="mt-0.5 block font-label text-[9px] text-gray-500 font-medium">
                  {count}+ items
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
