"use client";
import { useState } from "react";
import { fmt } from "@/lib/data";
import { tw, swatchBgClass } from "@/lib/theme";
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

export default function ProductCard({ product, onAddToCart, onWishlistToggle, isWishlisted, onClick }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [addedAnim, setAddedAnim] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const hasAltImage = product.images.length > 1;
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize) { setShowSizes(true); return; }
    onAddToCart(product, selectedColor.name, selectedSize);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
    setShowSizes(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle({ id: product.id, name: product.name, brand: product.brand, price: product.price, img: product.images[0] });
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer bg-white border border-border ${tw.card} ${tw.cardHover} ${showSizes ? "pick-size" : ""}`}
      onMouseLeave={() => setShowSizes(false)}
      onClick={() => onClick(product)}
    >
      {/* ── Image area ───────────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-soft">
        <div className="absolute inset-0">
          <StoreImage
            src={product.images[0]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.07] ${hasAltImage ? "group-hover:opacity-0" : ""}`}
          />
          {hasAltImage && (
            <StoreImage
              src={product.images[1]}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.07]"
            />
          )}
        </div>

        {/* Premium bottom gradient — always visible, deepens on hover */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        {/* Top-left: badge */}
        <div className="absolute top-2.5 left-2.5 z-[4]">
          <span
            className="rounded-full px-2.5 py-[3px] text-[9px] font-bold tracking-wider text-white shadow-md bg-primary-mid"
          >
            {product.badge}
          </span>
        </div>

        {/* Top-right: DISCOUNT % badge + wishlist stacked */}
        <div className="absolute top-2.5 right-2.5 z-[4] flex flex-col items-end gap-1.5">
          {discountPct && (
            <div className={tw.saleBadge}>
              <span>−{discountPct}%</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleWishlist}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/90 backdrop-blur-md shadow-md transition-all group-hover:scale-105 ${isWishlisted ? "text-red-500" : "text-muted"}`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Icons.Heart filled={isWishlisted} />
          </button>
        </div>

        {/* Size picker — slides up on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[5] flex flex-wrap gap-1 p-2.5 opacity-0 translate-y-2 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-[.pick-size]:opacity-100 group-[.pick-size]:translate-y-0 group-[.pick-size]:pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {product.sizes.map(s => (
            <button
              key={s}
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedSize(s); setShowSizes(false); }}
              className={`min-w-[30px] h-7 rounded-md px-2 text-[10px] font-semibold text-white backdrop-blur-md transition-colors ${selectedSize === s ? "bg-accent border-2 border-white shadow" : "bg-white/20 border border-white/50 hover:bg-white/35"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Info area — fills remaining space so cards stay same height ── */}
      <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3">
        {/* Brand */}
        <div className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-accent">{product.brand}</div>

        {/* Name — clamp 2 lines, takes flex space */}
        <div className="mb-auto line-clamp-2 text-[13px] font-semibold leading-snug text-primary">{product.name}</div>

        {/* Rating + colors */}
        <div className="mt-2 mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5 text-accent">
              {[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} filled={i <= Math.round(product.rating)} />)}
            </div>
            <span className="text-[10px] text-muted">{product.rating}</span>
          </div>
          <div className="flex gap-1">
            {product.colors.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedColor(c); }}
                title={c.name}
                className={`h-4 w-4 rounded-full border-0 cursor-pointer transition-all ${swatchBgClass(c.hex)} ${selectedColor.name === c.name ? "ring-2 ring-accent ring-offset-1" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Price + Add button — always at bottom */}
        <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold text-primary">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="mt-0.5 text-[10px] text-muted line-through">{fmt(product.originalPrice)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`${tw.btnPrimarySm} shrink-0 ${addedAnim ? "!bg-emerald-600 !text-white" : ""}`}
          >
            {addedAnim ? <><Icons.Check /> Added!</> : showSizes ? "Pick Size" : <><Icons.Plus /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
