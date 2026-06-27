"use client";
import { useState, useRef, useCallback } from "react";
import { PRODUCTS, fmt } from "@/lib/data";
import type { Product, WishlistItem } from "@/lib/types";
import ReviewsSection from "./ReviewsSection";
import ProductCard from "./ProductCard";
import { tw } from "@/lib/theme";
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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotate360, setRotate360] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);

  const similar = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    for (let i = 0; i < qty; i++) onAddToCart(product, selectedColor.name, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleZoom = (dir: "in" | "out" | "reset") => {
    if (dir === "reset") { setZoom(1); setPan({ x: 0, y: 0 }); }
    else setZoom(z => Math.min(3, Math.max(0.5, z + (dir === "in" ? 0.25 : -0.25))));
  };

  const handleRotate = () => setRotation(r => (r + 90) % 360);
  const handleRotateReset = () => { setRotation(0); };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => setIsDragging(false);

  // 360° drag
  const handle360Down = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startRot = rotate360;
    const move = (me: MouseEvent) => setRotate360(startRot + (me.clientX - startX) * 0.5);
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // ── Image viewer JSX ──────────────────────────────────────────────────────

  const premiumToolBtn: React.CSSProperties = {
    width: 40, height: 40, background: "transparent", border: "none",
    color: "rgba(255,255,255,0.75)", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", transition: "all 0.2s",
  };
  const applyPremiumHover = (el: HTMLButtonElement) => { el.style.color = "#C89B3C"; el.style.transform = "scale(1.15)"; };
  const removePremiumHover = (el: HTMLButtonElement) => { el.style.color = "rgba(255,255,255,0.75)"; el.style.transform = "scale(1)"; };

  const imageViewer = (
    <div
      ref={imgRef}
      onMouseDown={is360Mode ? handle360Down : handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        flex: 1,
        borderRadius: isFullscreen ? 0 : 28,
        overflow: "hidden",
        position: "relative",
        minHeight: isFullscreen ? "100vh" : 500,
        /* Premium warm pearl background */
        background: "radial-gradient(ellipse 90% 80% at 50% 44%, #F8F6F0 0%, #F0EDE4 35%, #E8E3D8 70%, #DDD8CC 100%)",
        boxShadow: isFullscreen ? "none" : "0 8px 60px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: isFullscreen ? "none" : "1px solid rgba(200,190,170,0.5)",
        cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : is360Mode ? "ew-resize" : "default",
      }}
    >
      {/* Premium vignette overlay — darkens edges for depth */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 65% at 50% 48%, transparent 40%, rgba(0,0,0,0.04) 100%)",
      }} />

      {/* Soft glowing circle behind product */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -52%)",
        width: "62%", paddingBottom: "62%", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,252,240,0.7) 0%, rgba(240,235,220,0.3) 50%, transparent 75%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Product drop-shadow reflection */}
      <div style={{
        position: "absolute", bottom: "12%", left: "50%",
        transform: "translateX(-50%)",
        width: "55%", height: 24,
        background: "radial-gradient(ellipse 100% 100%, rgba(0,0,0,0.14) 0%, transparent 75%)",
        pointerEvents: "none", zIndex: 0, filter: "blur(6px)",
      }} />

      {/* Product image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.images[imgIdx] || product.images[0]}
        alt={product.name}
        draggable={false}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "contain", padding: "40px 80px 48px 40px",
          transform: is360Mode
            ? `perspective(800px) rotateY(${rotate360}deg)`
            : `scale(${zoom}) rotate(${rotation}deg) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transition: isDragging || is360Mode ? "none" : "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
          userSelect: "none", zIndex: 1,
          filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.18))",
        }}
      />

      {/* ── SALE badge — top left ────hided for the % to the top─────────────────────────────────────── */}
      {/* <div style={{ position: "absolute", top: 18, left: 18, zIndex: 6 }}>
        <span style={{
          background: product.badgeColor,
          color: "#fff", borderRadius: 100,
          padding: "6px 16px",
          fontSize: 10, fontWeight: 900, letterSpacing: "0.12em",
          textTransform: "uppercase",
          boxShadow: `0 4px 16px ${product.badgeColor}60`,
          fontFamily: "'Inter',sans-serif",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ fontSize: 8 }}>●</span>
          {product.badge}
        </span>
      </div> */}

      {/* ── Discount % — top left below badge ────────────────────────────── */}
      {product.originalPrice && (
        <div style={{ position: "absolute", top: 18, left: 18, zIndex: 6 }}>
          <span style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "#fff", borderRadius: 10,
            padding: "7px 14px",
            fontSize: 13, fontWeight: 900,
            fontFamily: "'Inter',sans-serif",
            boxShadow: "0 4px 18px rgba(239,68,68,0.4)",
            display: "inline-block",
            letterSpacing: "-0.02em",
          }}>
            −{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </span>
        </div>
      )}

      {/* ── Wishlist heart — top right ────────────────────────────────────── */}
      <button
        onClick={() => onWishlistToggle({ id: product.id, name: product.name, brand: product.brand, price: product.price, img: product.images[0] })}
        style={{
          position: "absolute", top: 18, right: 18, zIndex: 6,
          width: 42, height: 42, borderRadius: 21,
          background: "rgba(255,255,255,0.88)",
          border: "1.5px solid rgba(200,190,170,0.6)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: isWishlisted ? "#ef4444" : "#9CA3AF",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onMouseEnter={e => { (e.currentTarget).style.transform = "scale(1.12)"; (e.currentTarget).style.boxShadow = "0 6px 20px rgba(239,68,68,0.25)"; }}
        onMouseLeave={e => { (e.currentTarget).style.transform = "scale(1)"; (e.currentTarget).style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; }}
        aria-label="Wishlist"
      >
        <Icons.Heart filled={isWishlisted} />
      </button>

      {/* ── Premium grouped toolbar — dark glass pill, right side center ─── */}
      <div style={{
        position: "absolute", right: 16, top: "50%",
        transform: "translateY(-50%)",
        zIndex: 6,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 0,
        /* Single grouped dark glass pill */
        background: "rgba(16, 12, 6, 0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 10,
        border: "1px solid rgba(200,155,60,0.28)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.06) inset",
        padding: "6px 0",
        overflow: "hidden",
      }}>

        {/* Zoom In */}
        <button onClick={() => handleZoom("in")} title="Zoom In" style={premiumToolBtn}
          onMouseEnter={e => applyPremiumHover(e.currentTarget as HTMLButtonElement)}
          onMouseLeave={e => removePremiumHover(e.currentTarget as HTMLButtonElement)}>
          <Icons.ZoomIn />
        </button>

        {/* Zoom % label */}
        <div style={{
          color: zoom !== 1 ? "#C89B3C" : "rgba(255,255,255,0.45)",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
          fontFamily: "'Inter',sans-serif",
          padding: "2px 0 4px",
          cursor: "default",
          textAlign: "center", width: "100%",
          transition: "color 0.2s",
        }}>{Math.round(zoom * 100)}%</div>

        {/* Zoom Out */}
        <button onClick={() => handleZoom("out")} title="Zoom Out" style={premiumToolBtn}
          onMouseEnter={e => applyPremiumHover(e.currentTarget as HTMLButtonElement)}
          onMouseLeave={e => removePremiumHover(e.currentTarget as HTMLButtonElement)}>
          <Icons.ZoomOut />
        </button>

        {/* Divider */}
        <div style={{ width: 28, height: "1px", background: "rgba(200,155,60,0.22)", margin: "4px 0" }} />

        {/* Rotate */}
        <button
          onClick={handleRotate}
          onContextMenu={e => { e.preventDefault(); handleRotateReset(); }}
          title="Rotate 90° · right-click to reset"
          style={{ ...premiumToolBtn, color: rotation !== 0 ? "#C89B3C" : "rgba(255,255,255,0.75)" }}
          onMouseEnter={e => applyPremiumHover(e.currentTarget as HTMLButtonElement)}
          onMouseLeave={e => { removePremiumHover(e.currentTarget as HTMLButtonElement); if (rotation !== 0) (e.currentTarget as HTMLButtonElement).style.color = "#C89B3C"; }}>
          <Icons.RotateCw />
        </button>

        {/* Divider */}
        <div style={{ width: 28, height: "1px", background: "rgba(200,155,60,0.22)", margin: "4px 0" }} />

        {/* Fullscreen */}
        <button onClick={() => setIsFullscreen(fs => !fs)} title="Fullscreen" style={premiumToolBtn}
          onMouseEnter={e => applyPremiumHover(e.currentTarget as HTMLButtonElement)}
          onMouseLeave={e => removePremiumHover(e.currentTarget as HTMLButtonElement)}>
          {isFullscreen ? <Icons.Minimize /> : <Icons.Maximize />}
        </button>

        {/* Divider */}
        <div style={{ width: 28, height: "1px", background: "rgba(200,155,60,0.22)", margin: "4px 0" }} />

        {/* 360° */}
        <button
          onClick={() => { setIs360Mode(m => !m); setRotate360(0); }}
          title="360° drag view"
          style={{
            ...premiumToolBtn,
            background: is360Mode ? "rgba(200,155,60,0.22)" : "transparent",
            color: is360Mode ? "#F0D080" : "rgba(255,255,255,0.75)",
            fontSize: 9, fontWeight: 900, letterSpacing: "0.06em",
          }}
          onMouseEnter={e => { if (!is360Mode) applyPremiumHover(e.currentTarget as HTMLButtonElement); }}
          onMouseLeave={e => { if (!is360Mode) removePremiumHover(e.currentTarget as HTMLButtonElement); }}>
          360°
        </button>
      </div>

      {/* ── Bottom hint bar — premium gold-tinted ────────────────────────── */}
      {is360Mode && <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 5, pointerEvents: "none" }}>
        <div style={{
          background: "rgba(16, 12, 6, 0.72)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderRadius: 100, padding: "8px 20px",
          fontSize: 11, fontWeight: 500,
          color: "rgba(240, 225, 180, 0.85)",
          fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap",
          border: "1px solid rgba(200,155,60,0.25)",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          letterSpacing: "0.02em",
        }}>
          <span style={{ fontSize: 13, opacity: 0.7 }}>↔</span>
          {is360Mode && "Drag to rotate 360°"}
        </div>
      </div>}
    </div>
  );


  // Fullscreen overlay
  if (isFullscreen) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "#0F0E0C", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontFamily: "'Cormorant', serif", fontSize: 20, color: "#FAFAF9", fontWeight: 700 }}>{product.name}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", border: imgIdx === i ? "2px solid #C89B3C" : "2px solid transparent", background: "none", cursor: "pointer", padding: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
          <button onClick={() => setIsFullscreen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <Icons.X />
          </button>
        </div>
        <div style={{ flex: 1, position: "relative", display: "flex" }}>
          {imageViewer}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FDFAF4", paddingTop: 108 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#7D6E5A" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#C89B3C", fontWeight: 600, fontFamily: "'Inter', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
            <Icons.ChevronLeft /> Back to Shop
          </button>
          <Icons.ChevronRight />
          <span>{product.category || "Products"}</span>
          <Icons.ChevronRight />
          <span style={{ fontWeight: 600, color: "#1A1208" }}>{product.name}</span>
        </div>

        {/* Main layout — left image fills full height of right panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "stretch" }} className="max-lg:grid-cols-1">

          {/* ── LEFT: Image Gallery — sticky, full height ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 10, height: "100%", minHeight: 520 }}>

              {/* Vertical thumbnails strip */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setImgIdx(i); setZoom(1); setPan({ x: 0, y: 0 }); setRotation(0); setIs360Mode(false); }}
                    style={{
                      width: 68, height: 68, borderRadius: 12, overflow: "hidden",
                      border: "none", cursor: "pointer", padding: 0, flexShrink: 0,
                      outline: imgIdx === i ? "2.5px solid #C89B3C" : "2px solid #E8D9B8",
                      outlineOffset: 2, transition: "all 0.18s",
                      boxShadow: imgIdx === i ? "0 4px 18px rgba(200,155,60,0.30)" : "none",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
                <button
                  style={{ width: 68, height: 36, borderRadius: 10, border: "1.5px solid #E8D9B8", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#7D6E5A" }}
                  title="Share"
                >
                  <Icons.Share />
                </button>
              </div>

              {/* Main image viewer — flex:1 takes all remaining width + full height */}
              {imageViewer}
            </div>
          </div>

          {/* ── RIGHT: Product Info — scroll-linked, same height ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Brand + SKU */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C89B3C", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                {product.brand} · <span style={{ color: "#7D6E5A", textTransform: "none", letterSpacing: 0 }}>Skynet Solution Qatar</span>
              </div>
              {product.sku && (
                <div style={{ fontSize: 11, color: "#9E8E78", fontFamily: "'Inter', sans-serif" }}>SKU: {product.sku}</div>
              )}
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 38, fontWeight: 700, color: "#1A1208", lineHeight: 1.1 }}>
              {product.name}
            </h1>

            {/* Rating row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} filled={i <= Math.round(product.rating)} />)}
              </div>
              <span style={{ fontSize: 14, color: "#C89B3C", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: "#7D6E5A", fontFamily: "'Inter', sans-serif" }}>({product.reviews.toLocaleString()} reviews)</span>
              <span style={{ fontSize: 12, color: "#059669", fontWeight: 600, background: "#D1FAE5", borderRadius: 100, padding: "2px 8px" }}>
                {Math.round(product.rating * 20)}% recommended
              </span>
              {product.stock !== undefined && product.stock < 20 && (
                <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, background: "#FEE2E2", borderRadius: 100, padding: "2px 8px" }}>
                  Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Price block */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "#F7F1E3", borderRadius: 16 }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: "#1A1208", fontFamily: "'Inter', sans-serif" }}>{fmt(product.price)}</span>
              {product.originalPrice && <>
                <span style={{ fontSize: 16, color: "#7D6E5A", textDecoration: "line-through", fontFamily: "'Inter', sans-serif" }}>{fmt(product.originalPrice)}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "#ef4444", borderRadius: 100, padding: "3px 10px" }}>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>}
            </div>

            {/* Spec tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {product.tags.map(t => (
                <span key={t} style={{ fontSize: 11, fontWeight: 600, color: "#C89B3C", background: "#FEF3C7", borderRadius: 100, padding: "4px 12px", fontFamily: "'Inter', sans-serif" }}>
                  ✓ {t}
                </span>
              ))}
            </div>

            {/* Color/Variant */}
            {product.colors.length > 1 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#44403C", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
                  Color: <span style={{ color: "#1A1208", fontWeight: 700 }}>{selectedColor.name}</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {product.colors.map(c => (
                    <button key={c.name} onClick={() => setSelectedColor(c)} title={c.name}
                      style={{ width: 30, height: 30, borderRadius: 15, background: c.hex, border: "none", cursor: "pointer", outline: selectedColor.name === c.name ? "2.5px solid #1A1208" : "2px solid transparent", outlineOffset: 3, transition: "outline 0.15s" }} />
                  ))}
                </div>
              </div>
            )}

            {/* Size / Variant picker */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#44403C", fontFamily: "'Inter', sans-serif" }}>
                  Select Variant:
                  {sizeError && <span style={{ color: "#ef4444", marginLeft: 8 }}>Please select</span>}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    style={{ minWidth: 52, height: 40, borderRadius: 10, padding: "0 14px", border: `2px solid ${selectedSize === s ? "#1A1208" : sizeError ? "#ef4444" : "#E8D9B8"}`, background: selectedSize === s ? "#1A1208" : "#fff", color: selectedSize === s ? "#fff" : "#44403C", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.15s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#44403C", fontFamily: "'Inter', sans-serif" }}>Qty:</span>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E8D9B8", borderRadius: 100 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "none", border: "none", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#7D6E5A" }}><Icons.Minus /></button>
                <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: "none", border: "none", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1208" }}><Icons.Plus /></button>
              </div>
              {product.stock !== undefined && (
                <span style={{ fontSize: 12, color: product.stock > 20 ? "#059669" : "#dc2626", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                  {product.stock > 20 ? `✓ In Stock (${product.stock})` : `⚡ Only ${product.stock} left`}
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="product-cta-row">
              <button
                onClick={handleAdd}
                style={{
                  background: added ? "#059669" : "var(--color-primary)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(26,18,8,0.28)",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { if (!added) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-mid)"; }}
                onMouseLeave={e => { if (!added) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary)"; }}
              >
                {added ? <><Icons.Check /> Added to Cart!</> : <><Icons.Bag /> Add to Cart</>}
              </button>
              <button
                onClick={handleAdd}
                style={{
                  background: "linear-gradient(135deg, var(--color-accent-hover) 0%, var(--color-accent) 50%, var(--color-accent-light) 100%)",
                  color: "var(--color-primary)",
                  boxShadow: "0 4px 20px rgba(200,155,60,0.38)",
                  letterSpacing: "0.01em",
                  fontWeight: 800,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(200,155,60,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(200,155,60,0.38)"; }}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Delivery check */}
            <div style={{ background: "#F5F5F4", borderRadius: 16, padding: "14px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1208", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>📦 Check Delivery to Qatar</div>
              <div className="delivery-row" style={{ display: "flex", gap: 8 }}>
                <input value={pincode} onChange={e => setPincode(e.target.value.slice(0, 8))}
                  placeholder="Area (e.g., Lusail, West Bay)"
                  style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #E8D9B8", borderRadius: 100, fontSize: 12, fontFamily: "'Inter', sans-serif", outline: "none", background: "#fff" }} />
                <button className={tw.btnPrimary} style={{ padding: "10px 16px", fontSize: 12 }}>Check</button>
              </div>
              {pincode.length > 4 && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#059669", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                  ✓ Delivery in 1–2 business days · Free installation included
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["🚚", "Free Installation", "All POS systems"], ["↩️", "1-Year Warranty", "Parts & labour"], ["🔒", "Qatar VAT Ready", "Auto-compliance"], ["📞", "24/7 Support", "Local Doha team"]].map(([icon, title, sub]) => (
                <div key={title} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 12, border: "1px solid #E8D9B8" }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1A1208", fontFamily: "'Inter', sans-serif" }}>{title}</div>
                    <div style={{ fontSize: 10, color: "#7D6E5A", fontFamily: "'Inter', sans-serif" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Tabs */}
        <div style={{ marginTop: 56, border: "1.5px solid #E8D9B8", borderRadius: 24, overflow: "hidden", background: "#fff" }}>
          <div className="tab-row" style={{ display: "flex", borderBottom: "1.5px solid #E8D9B8" }}>
            {(["desc", "details", "care"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: "16px 20px", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: tab === t ? 700 : 500, fontSize: 14, color: tab === t ? "#1A1208" : "#7D6E5A", background: tab === t ? "#F7F1E3" : "#fff", borderBottom: tab === t ? "2.5px solid #C89B3C" : "2.5px solid transparent", transition: "all 0.2s" }}>
                {t === "desc" ? "Description" : t === "details" ? "Specifications" : "Support"}
              </button>
            ))}
          </div>
          <div style={{ padding: "28px 32px" }}>
            {tab === "desc" && (
              <p style={{ fontSize: 15, color: "#44403C", lineHeight: 1.8, fontFamily: "'Inter', sans-serif" }}>
                {product.description}<br /><br />
                This product is backed by Skynet Solution Qatar&apos;s full implementation and support service. Includes professional installation, software configuration, staff training, and one year of priority technical support. All products are Qatar VAT compliant and integrate seamlessly with atACC ERP.
              </p>
            )}
            {tab === "details" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[["SKU", product.sku || "—"], ["Category", product.category || "—"], ["In Stock", `${product.stock || "—"} units`], ["Warranty", "1 Year (Parts & Labour)"], ["Certification", "Qatar VAT Compliant"], ["Support", "24/7 Local Doha Team"], ["Interface", product.tags[2] || "USB"], ["Origin", "Commercial Grade"]].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#7D6E5A", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif" }}>{label}</span>
                    <span style={{ fontSize: 14, color: "#1A1208", fontFamily: "'Inter', sans-serif" }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === "care" && (
              <div>
                <p style={{ fontSize: 14, color: "#44403C", lineHeight: 1.8, fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
                  Skynet provides full support for all hardware and software products:
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Call +974 4431 1525 for 24/7 technical support", "Remote desktop support available for software issues", "On-site engineer visits for hardware faults (Doha)", "Replacement units provided within 24 hours under warranty", "Annual Maintenance Contracts (AMC) available", "Visit skynetqatar.com/support for knowledge base"].map(tip => (
                    <li key={tip} style={{ display: "flex", gap: 10, fontSize: 14, color: "#44403C", fontFamily: "'Inter', sans-serif" }}>
                      <span style={{ color: "#C89B3C", fontWeight: 700, flexShrink: 0 }}>✓</span> {tip}
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
        <div style={{ marginTop: 60 }}>
          <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 700, color: "#1A1208", marginBottom: 28 }}>
            You Might Also <span style={{ fontStyle: "italic", color: "#C89B3C" }}>Like</span>
          </h2>
          <div className={"product-grid-equal"}>
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