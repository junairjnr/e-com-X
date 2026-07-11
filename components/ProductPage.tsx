"use client";
import { useState, useRef, useEffect } from "react";
import { PRODUCTS, fmt } from "@/lib/data";
import type { Product, WishlistItem } from "@/lib/types";
import ReviewsSection from "./ReviewsSection";
import ProductCard from "./ProductCard";
import StoreImage from "./StoreImage";
import { tw, badgeBgClass, swatchBgClass } from "@/lib/theme";
import * as Icons from "./Icons";



interface ProductPageProps {
  product: Product;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onWishlistToggle: (item: WishlistItem) => void;
  isWishlisted: boolean;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  wishlist: WishlistItem[];
}

export default function ProductPage({ product, onAddToCart, onWishlistToggle, isWishlisted, onBack, onProductClick, wishlist }: ProductPageProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [pincode, setPincode] = useState("");
  const [tab, setTab] = useState<"desc" | "details" | "care">("desc");

  // ── Image viewer state ─────────────────────────────────────────────────────
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotate360, setRotate360] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const rotate360Ref = useRef<{ startX: number; startRot: number } | null>(null);

  const similar = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [product.id]);

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    for (let i = 0; i < qty; i++) onAddToCart(product, selectedColor.name, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleZoom = (dir: "in" | "out" | "reset") => {
    if (is360Mode) return;
    if (dir === "reset") { setZoom(1); setPan({ x: 0, y: 0 }); }
    else setZoom(z => Math.min(3, Math.max(0.5, z + (dir === "in" ? 0.25 : -0.25))));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (is360Mode) return;
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    setZoom(z => {
      const next = Math.min(3, Math.max(0.5, z + delta));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleRotate = () => setRotation(r => (r + 90) % 360);
  const handleRotateReset = () => setRotation(0);

  const isControlTarget = (target: EventTarget | null) =>
    !!(target as HTMLElement)?.closest?.("[data-viewer-control]");

  const handleViewerPointerDown = (e: React.PointerEvent) => {
    if (isControlTarget(e.target)) return;

    if (is360Mode) {
      e.preventDefault();
      rotate360Ref.current = { startX: e.clientX, startRot: rotate360 };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }

    if (zoom > 1) {
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handleViewerPointerMove = (e: React.PointerEvent) => {
    if (rotate360Ref.current) {
      const { startX, startRot } = rotate360Ref.current;
      setRotate360(startRot + (e.clientX - startX) * 0.5);
      return;
    }
    if (dragRef.current && isDragging) {
      const { startX, startY, panX, panY } = dragRef.current;
      setPan({ x: panX + (e.clientX - startX), y: panY + (e.clientY - startY) });
    }
  };

  const handleViewerPointerUp = (e: React.PointerEvent) => {
    rotate360Ref.current = null;
    dragRef.current = null;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer may already be released */
    }
  };

  const stopControl = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const toolBtnClass =
    "viewer-toolbar-btn flex h-10 w-10 lg:h-11 lg:w-11 items-center justify-center rounded-lg border-0 bg-white/10 text-white cursor-pointer transition-all active:scale-95 active:bg-accent/30 hover:bg-white/20 hover:text-accent-light";

  const viewerCursorClass = is360Mode
    ? "cursor-grab active:cursor-grabbing"
    : zoom > 1
      ? isDragging
        ? "cursor-grabbing"
        : "cursor-grab"
      : "cursor-zoom-in";

  const viewerTouchClass = is360Mode || zoom > 1 ? "touch-none" : "";

  const imageTransformStyle: React.CSSProperties = is360Mode
    ? { transform: `perspective(900px) rotateY(${rotate360}deg)`, transformStyle: "preserve-3d" }
    : { transform: `scale(${zoom}) rotate(${rotation}deg) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` };

  const imageTransitionStyle: React.CSSProperties =
    isDragging || is360Mode
      ? {}
      : { transition: "transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1)" };

  const imageViewer = (
    <div
      ref={imgRef}
      onPointerDown={handleViewerPointerDown}
      onPointerMove={handleViewerPointerMove}
      onPointerUp={handleViewerPointerUp}
      onPointerCancel={handleViewerPointerUp}
      onWheel={handleWheel}
      className={`relative w-full overflow-hidden bg-white select-none ${viewerCursorClass} ${viewerTouchClass} ${
        isFullscreen
          ? "h-full min-h-screen rounded-none border-0 shadow-none"
          : "h-[340px] sm:h-[420px] lg:h-[520px] rounded-2xl lg:rounded-[28px] border border-border shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      }`}
    >
      {/* Soft spotlight behind product */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,var(--color-bg-soft)_0%,transparent_70%)]" />

      {/* Product image — inline transform so zoom/360 work at runtime */}
      <div
        className="absolute inset-0 z-[1] flex items-center justify-center p-14 pb-20 lg:p-12 lg:pr-16"
        style={{ ...imageTransformStyle, ...imageTransitionStyle }}
      >
        <StoreImage
          src={product.images[imgIdx] || product.images[0]}
          alt={product.name}
          draggable={false}
          className="max-h-full max-w-full object-contain select-none drop-shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
        />
      </div>

      {/* ── Top action bar: discount + wishlist ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between p-3 sm:p-4 pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap gap-2">
          {product.originalPrice && (
            <span className={tw.saleBadge}>
              −{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
          {product.badge && (
            <span
              className={`font-eyebrow inline-flex items-center rounded-lg px-3 py-1.5 text-[10px] tracking-wider text-white shadow-md ${badgeBgClass(product.badge)}`}
            >
              {product.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle({ id: product.id, name: product.name, brand: product.brand, price: product.price, img: product.images[0] });
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
            isWishlisted
              ? "border-red-400 bg-red-50 text-red-500"
              : "border-white bg-white/95 text-muted hover:border-red-200 hover:text-red-500"
          }`}
        >
          <Icons.Heart filled={isWishlisted} />
        </button>
      </div>

      {/* ── Toolbar — touch-safe controls ── */}
      <div
        data-viewer-control
        className="pointer-events-auto absolute z-40 flex touch-manipulation items-center gap-1 overflow-hidden rounded-xl border border-white/10 bg-[#131921]/95 px-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl bottom-3 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-3 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:flex-col lg:gap-0.5 lg:px-1 lg:py-2"
      >
        <button
          type="button"
          data-viewer-control
          onClick={(e) => { stopControl(e); handleZoom("in"); }}
          title="Zoom In"
          className={toolBtnClass}
        >
          <Icons.ZoomIn />
        </button>

        <button
          type="button"
          data-viewer-control
          onClick={(e) => { stopControl(e); handleZoom("reset"); }}
          title="Reset zoom"
          className={`${toolBtnClass} text-[10px] font-bold tabular-nums !w-auto min-w-[40px] px-1 ${zoom !== 1 ? "!text-accent-light" : ""}`}
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          type="button"
          data-viewer-control
          onClick={(e) => { stopControl(e); handleZoom("out"); }}
          title="Zoom Out"
          className={toolBtnClass}
        >
          <Icons.ZoomOut />
        </button>

        <div className="mx-0.5 h-px w-5 bg-white/20 lg:mx-0 lg:my-0.5 lg:h-px lg:w-8" />

        <button
          type="button"
          data-viewer-control
          onClick={(e) => { stopControl(e); handleRotate(); }}
          onContextMenu={(e) => { e.preventDefault(); handleRotateReset(); }}
          title="Rotate 90° (right-click to reset)"
          className={`${toolBtnClass} ${rotation !== 0 ? "!bg-accent/30 !text-accent-light" : ""}`}
        >
          <Icons.RotateCw />
        </button>

        <div className="mx-0.5 h-px w-5 bg-white/20 lg:mx-0 lg:my-0.5 lg:h-px lg:w-8" />

        <button
          type="button"
          data-viewer-control
          onClick={(e) => { stopControl(e); setIsFullscreen((fs) => !fs); }}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          className={toolBtnClass}
        >
          {isFullscreen ? <Icons.Minimize /> : <Icons.Maximize />}
        </button>

        <div className="mx-0.5 h-px w-5 bg-white/20 lg:mx-0 lg:my-0.5 lg:h-px lg:w-8" />

        <button
          type="button"
          data-viewer-control
          onClick={(e) => {
            stopControl(e);
            setIs360Mode((m) => !m);
            setRotate360(0);
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="360° view — drag to spin"
          className={`${toolBtnClass} text-[9px] font-black tracking-wide ${is360Mode ? "!bg-accent/35 !text-accent-light" : ""}`}
        >
          360°
        </button>
      </div>

      {/* 360° hint */}
      {is360Mode && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 z-10 -translate-x-1/2 lg:bottom-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-footer/90 px-4 py-2 text-[11px] font-medium text-white/90 backdrop-blur-md shadow-lg">
            ↔ Drag to rotate 360°
          </span>
        </div>
      )}
    </div>
  );


  // Fullscreen overlay
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[600] flex flex-col bg-footer">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="font-display text-xl font-bold text-white">{product.name}</div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button key={i} type="button" onClick={() => setImgIdx(i)} className={`h-11 w-11 overflow-hidden rounded-lg border-2 p-0 cursor-pointer ${imgIdx === i ? "border-accent" : "border-transparent"}`}>
                <StoreImage src={img} alt="" aria-hidden className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setIsFullscreen(false)} className="flex h-9 w-9 items-center justify-center rounded-full border-0 bg-white/10 text-white cursor-pointer">
            <Icons.X />
          </button>
        </div>
        <div className="relative flex flex-1">
          {imageViewer}
        </div>
      </div>
    );
  }

  return (
    <div className={`page-top-offset min-h-screen ${tw.sectionBg}`}>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 pb-16 md:pb-20">

        {/* Breadcrumb */}
        <div className="mb-4 md:mb-6 flex flex-wrap items-center gap-1.5 text-xs md:text-[13px] text-muted">
          <button type="button" onClick={onBack} className="flex items-center gap-1 border-0 bg-transparent cursor-pointer text-accent font-semibold">
            <Icons.ChevronLeft /> Back
          </button>
          <span className="hidden sm:inline"><Icons.ChevronRight /></span>
          <span className="hidden sm:inline">{product.category || "Products"}</span>
          <span className="hidden sm:inline"><Icons.ChevronRight /></span>
          <span className="font-semibold text-primary line-clamp-1">{product.name}</span>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

          {/* ── LEFT: Image Gallery ── */}
          <div className="lg:sticky w-full" style={{ top: "var(--page-top)" }}>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-2.5 w-full">

              {/* Thumbnails — below viewer on mobile, left strip on desktop */}
              <div className="order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 shrink-0 scrollbar-thin">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setImgIdx(i); setZoom(1); setPan({ x: 0, y: 0 }); setRotation(0); setIs360Mode(false); }}
                    className={`shrink-0 w-14 h-14 lg:w-[68px] lg:h-[68px] rounded-xl overflow-hidden border-0 cursor-pointer p-0 transition-all ${
                      imgIdx === i
                        ? "outline outline-2 outline-accent outline-offset-2 shadow-[0_4px_18px_color-mix(in_srgb,var(--color-accent)_30%,transparent)]"
                        : "outline outline-2 outline-border outline-offset-2"
                    }`}
                  >
                    <StoreImage src={img} alt="" aria-hidden className="h-full w-full object-cover" />
                  </button>
                ))}
                <button
                  type="button"
                  className="hidden lg:flex shrink-0 w-[68px] h-9 rounded-[10px] border border-border bg-white cursor-pointer items-center justify-center text-muted"
                  title="Share"
                >
                  <Icons.Share />
                </button>
              </div>

              {/* Main image viewer */}
              <div className="order-1 lg:order-2 flex-1 min-w-0 w-full">
                {imageViewer}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info — scroll-linked, same height ── */}
          <div className="flex flex-col gap-[18px]">
            {/* Brand + SKU */}
            <div className="flex justify-between items-start">
              <div className="font-eyebrow text-[11px] tracking-widest text-accent">
                {product.brand} · <span className="normal-case tracking-normal text-muted">Skynet Solution Qatar</span>
              </div>
              {product.sku && (
                <div className="text-[11px] text-muted">SKU: {product.sku}</div>
              )}
            </div>

            <h1 className="font-display text-[32px] md:text-[38px] font-bold leading-tight text-primary">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex gap-0.5 text-accent">
                {[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} filled={i <= Math.round(product.rating)} />)}
              </div>
              <span className="text-sm font-bold text-accent">{product.rating}</span>
              <span className="text-[13px] text-muted">({product.reviews.toLocaleString()} reviews)</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                {Math.round(product.rating * 20)}% recommended
              </span>
              {product.stock !== undefined && product.stock < 20 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Price block */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-accent-soft px-5 py-4">
              <span className="font-price text-[30px] font-extrabold text-primary">{fmt(product.price)}</span>
              {product.originalPrice && <>
                <span className="text-base text-muted line-through">{fmt(product.originalPrice)}</span>
                <span className={tw.saleBadge}>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>}
            </div>

            {/* Spec tags */}
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map(t => (
                <span key={t} className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-semibold text-accent">
                  ✓ {t}
                </span>
              ))}
            </div>

            {/* Color/Variant */}
            {product.colors.length > 1 && (
              <div>
                <div className="mb-2 text-[13px] font-semibold text-primary/80">
                  Color: <span className="font-bold text-primary">{selectedColor.name}</span>
                </div>
                <div className="flex gap-2.5">
                  {product.colors.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      className={`h-[30px] w-[30px] rounded-full border-0 cursor-pointer transition-all ${swatchBgClass(c.hex)} ${
                        selectedColor.name === c.name
                          ? "outline outline-[2.5px] outline-primary outline-offset-[3px]"
                          : "outline outline-2 outline-transparent outline-offset-[3px]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size / Variant picker */}
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-[13px] font-semibold text-primary/80">
                  Select Variant:
                  {sizeError && <span className="ml-2 text-red-500">Please select</span>}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    className={`min-w-[52px] h-10 rounded-[10px] px-3.5 text-[13px] font-semibold cursor-pointer transition-all ${
                      selectedSize === s
                        ? "border-2 border-primary bg-primary text-white"
                        : sizeError
                          ? "border-2 border-red-500 bg-white text-primary/80"
                          : "border-2 border-border bg-white text-primary/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-semibold text-primary/80">Qty:</span>
              <div className="flex items-center rounded-full border border-border">
                <button
                  type="button"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center border-0 bg-transparent cursor-pointer text-muted"
                >
                  <Icons.Minus />
                </button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(q => q + 1)}
                  className="flex h-9 w-9 items-center justify-center border-0 bg-transparent cursor-pointer text-primary"
                >
                  <Icons.Plus />
                </button>
              </div>
              {product.stock !== undefined && (
                <span className={`text-xs font-medium ${product.stock > 20 ? "text-gray-600" : "text-red-600"}`}>
                  {product.stock > 20 ? `✓ In Stock (${product.stock})` : `⚡ Only ${product.stock} left`}
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="product-cta-row">
              <button
                type="button"
                onClick={handleAdd}
                className={`${added ? "!bg-gray-700" : tw.btnPrimary} !font-bold !shadow-none sm:!shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent)_30%,transparent)]`}
              >
                {added ? <><Icons.Check /> Added to Cart!</> : <><Icons.Bag /> Add to Cart</>}
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className={`${tw.btnPrimary} !font-extrabold`}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Delivery check */}
            <div className="rounded-2xl bg-stone-100 px-[18px] py-3.5">
              <div className="mb-2 text-xs font-bold text-primary">📦 Check Delivery to Qatar</div>
              <div className="delivery-row flex flex-col sm:flex-row gap-2 sm:gap-2">
                <input
                  value={pincode}
                  onChange={e => setPincode(e.target.value.slice(0, 8))}
                  placeholder="Area (e.g., Lusail, West Bay)"
                  className="flex-1 rounded-full border-[1.5px] border-border bg-white px-3.5 py-2.5 text-xs outline-none"
                />
                <button type="button" className={`${tw.btnPrimarySm} px-4 py-2.5`}>Check</button>
              </div>
              {pincode.length > 4 && (
                <div className="mt-2 text-xs font-medium text-gray-600">
                  ✓ Delivery in 1–2 business days · Free installation included
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5">
              {[["🚚", "Free Installation", "All POS systems"], ["↩️", "1-Year Warranty", "Parts & labour"], ["🔒", "Qatar VAT Ready", "Auto-compliance"], ["📞", "24/7 Support", "Local Doha team"]].map(([icon, title, sub]) => (
                <div key={title} className="flex gap-2.5 rounded-xl border border-border bg-white p-3">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <div className="text-[11px] font-bold text-primary">{title}</div>
                    <div className="text-[10px] text-muted">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Tabs */}
        <div className="mt-14 rounded-3xl border border-border overflow-hidden bg-white">
          <div className="tab-row flex overflow-x-auto border-b border-border">
            {(["desc", "details", "care"] as const).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`shrink-0 flex-1 min-w-[110px] px-4 py-4 border-0 cursor-pointer text-sm transition-all ${
                  tab === t
                    ? "font-bold text-primary bg-accent-soft border-b-2 border-accent"
                    : "font-medium text-muted bg-white border-b-2 border-transparent"
                }`}>
                {t === "desc" ? "Description" : t === "details" ? "Specs" : "Support"}
              </button>
            ))}
          </div>
          <div className="p-5 md:p-8">
            {tab === "desc" && (
              <p className="text-[15px] leading-[1.8] text-primary/80">
                {product.description}<br /><br />
                This product is backed by Skynet Solution Qatar&apos;s full implementation and support service. Includes professional installation, software configuration, staff training, and one year of priority technical support. All products are Qatar VAT compliant and integrate seamlessly with atACC ERP.
              </p>
            )}
            {tab === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {[["SKU", product.sku || "—"], ["Category", product.category || "—"], ["In Stock", `${product.stock || "—"} units`], ["Warranty", "1 Year (Parts & Labour)"], ["Certification", "Qatar VAT Compliant"], ["Support", "24/7 Local Doha Team"], ["Interface", product.tags[2] || "USB"], ["Origin", "Commercial Grade"]].map(([label, val]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="font-eyebrow text-[10px] tracking-wider text-muted">{label}</span>
                    <span className="text-sm text-primary">{val}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === "care" && (
              <div>
                <p className="mb-4 text-sm leading-[1.8] text-primary/80">
                  Skynet provides full support for all hardware and software products:
                </p>
                <ul className="flex list-none flex-col gap-2.5">
                  {["Call +974 4431 1525 for 24/7 technical support", "Remote desktop support available for software issues", "On-site engineer visits for hardware faults (Doha)", "Replacement units provided within 24 hours under warranty", "Annual Maintenance Contracts (AMC) available", "Visit skynetqatar.com/support for knowledge base"].map(tip => (
                    <li key={tip} className="flex gap-2.5 text-sm text-primary/80">
                      <span className="text-accent font-bold shrink-0">✓</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection productId={product.id} rating={product.rating} reviewCount={product.reviews} />

        {/* Similar products */}
        <div className="mt-[60px]">
          <h2 className="font-display text-2xl md:text-[32px] font-bold text-primary mb-6 md:mb-7">
            You Might Also <span className="italic text-accent">Like</span>
          </h2>
          <div className="product-grid-equal">
            {similar.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onWishlistToggle={onWishlistToggle}
                isWishlisted={wishlist.some(w => w.id === p.id)} onClick={onProductClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
