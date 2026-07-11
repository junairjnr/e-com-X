"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fmt } from "@/lib/data";
import StoreImage from "./StoreImage";
import type { Product, WishlistItem } from "@/lib/types";
import * as Icons from "./Icons";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onWishlistToggle: (item: WishlistItem) => void;
  isWishlisted: boolean;
  onClick: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted,
  onClick,
}: ProductCardProps) {
  const [selectedColor] = useState(product.colors[0]);
  const [selectedSize] = useState(product.sizes[0] || "");
  const [addedAnim, setAddedAnim] = useState(false);
  const [hovered, setHovered] = useState(false);

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedColor.name, selectedSize);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      img: product.images[0],
    });
  };

  return (
    <motion.div
      className="group relative flex flex-col cursor-pointer select-none"
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: hovered
          ? "0 20px 60px rgba(17,24,39,0.18), 0 4px 20px rgba(0,0,0,0.08)"
          : "0 2px 16px rgba(0,0,0,0.07)",
        border: hovered ? "1.5px solid #9CA3AF" : "1.5px solid #f0f0f0",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(product)}
    >
      {/* ── Image container — all-side border radius ── */}
      <div className="relative mx-3 mt-3 overflow-hidden" style={{ borderRadius: "16px", aspectRatio: "1/1", background: "linear-gradient(135deg, #f8f9fa 0%, #f3f4f6 100%)" }}>

        {/* Shimmer spotlight on hover */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)" }}
          animate={hovered ? { x: ["−100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Product image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-4"
          animate={hovered ? { scale: 1.07 } : { scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <StoreImage
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain drop-shadow-md"
          />
        </motion.div>

        {/* Top-left: discount badge */}
        <AnimatePresence>
          {discountPct && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="absolute left-2.5 top-2.5 z-20 flex items-center gap-0.5 rounded-full px-2.5 py-1 font-label text-[11px] font-black text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #111827, #1F2937)", boxShadow: "0 2px 10px rgba(17,24,39,0.4)" }}
            >
              {discountPct}% off
            </motion.span>
          )}
        </AnimatePresence>

        {/* NEW badge */}
        {product.isNew && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-2.5 top-2.5 z-20 rounded-full px-2.5 py-1 font-label text-[10px] font-black text-white shadow"
            style={{ background: "linear-gradient(135deg, #0891b2, #0e7490)" }}
          >
            NEW
          </motion.span>
        )}

        {/* Wishlist button */}
        <motion.button
          type="button"
          onClick={handleWishlist}
          className="absolute bottom-2.5 right-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-lg backdrop-blur-sm"
          style={{
            background: isWishlisted ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.92)",
            border: isWishlisted ? "1.5px solid #fca5a5" : "1.5px solid rgba(255,255,255,0.8)",
          }}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.15 }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.span
            animate={isWishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={isWishlisted ? "text-red-500" : "text-gray-400"}
          >
            <Icons.Heart filled={isWishlisted} />
          </motion.span>
        </motion.button>
      </div>

      {/* ── Info area ── */}
      <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
        {/* Brand */}
        <div className="mb-1 font-eyebrow text-[9px] tracking-widest text-gray-500 uppercase">
          {product.brand}
        </div>

        {/* Name */}
        <div className="mb-2.5 line-clamp-2 font-sans text-[13.5px] font-semibold leading-snug text-gray-900">
          {product.name}
        </div>

        {/* Rating row */}
        <div className="mb-2.5 flex items-center gap-2">
          <span
            className="flex items-center gap-0.5 rounded-full px-2 py-0.5 font-label text-[11px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #111827, #1F2937)" }}
          >
            {product.rating} <span className="text-[9px]">★</span>
          </span>
          <span className="font-label text-[11px] text-gray-400">
            ({product.reviews?.toLocaleString() ?? 0} reviews)
          </span>
        </div>

        {/* Price row */}
        <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-price text-[17px] font-extrabold text-gray-900">{fmt(product.price)}</span>
          {product.originalPrice && (
            <span className="font-price text-[12px] text-gray-400 line-through">{fmt(product.originalPrice)}</span>
          )}
          {discountPct && (
            <span className="font-label text-[12px] font-bold text-gray-600">{discountPct}% off</span>
          )}
        </div>

        {/* Free delivery */}
        <div className="mb-3 flex items-center gap-1 font-label text-[11px] font-semibold text-gray-500">
          <span>✓</span> Free Delivery
        </div>

        {/* Add to Cart — animated button */}
        <motion.button
          type="button"
          onClick={handleAddToCart}
          className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-2.5 font-label text-[13px] font-bold text-white"
          style={
            addedAnim
              ? { background: "linear-gradient(135deg, #111827, #1F2937)" }
              : { background: "linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)", boxShadow: "0 4px 16px rgba(17,24,39,0.35)" }
          }
          whileTap={{ scale: 0.97 }}
          whileHover={{ boxShadow: "0 6px 24px rgba(17,24,39,0.5)" }}
        >
          {/* Ripple shimmer on hover */}
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
            animate={hovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
            transition={{ duration: 0.7, ease: "easeInOut", repeat: hovered ? Infinity : 0, repeatDelay: 0.5 }}
          />

          <AnimatePresence mode="wait">
            {addedAnim ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1.5"
              >
                <Icons.Check /> Added to Cart!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1.5"
              >
                <Icons.Plus /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Bottom glow on hover */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 rounded-b-[20px]"
        style={{ background: "linear-gradient(90deg, #111827, #374151, #111827)" }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
