"use client";
import { useState, useCallback } from "react";
import { PRODUCTS } from "@/lib/data";
import type { CartItem, WishlistItem, Product, StoreUser } from "@/lib/types";

// Layout
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Overlays
import SearchModal from "@/components/SearchModal";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import LoginModal from "@/components/LoginModal";

// Pages
import ShopPage from "@/components/ShopPage";
import ProductPage from "@/components/ProductPage";

// Home page sections
import HeroSection from "@/components/HeroSection";
import MarqueeSection from "@/components/MarqueeSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import ProductCard from "@/components/ProductCard";
import * as Icons from "@/components/Icons";
import { tw } from "@/lib/theme";
import OrdersPage from "./Orders";

type Page =
  | { type: "home" }
  | { type: "shop"; category?: string }
  | { type: "product"; product: Product }
  | { type: "cart" }
  | { type: "checkout" }
  | { type: "orders" };

export default function NestStore() {
  // ── Routing ────────────────────────────────────────────────────────────────
  const [page, setPage] = useState<Page>({ type: "home" });

  // ── State ──────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<StoreUser | null>(null);

  // ── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = useCallback((product: Product, color: string, size: string) => {
    const id = `${product.id}-${color}-${size}`;
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, productId: product.id, name: product.name, brand: product.brand, price: product.price, img: product.images[0], color, size, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const updateCart = useCallback((id: string, qty: number) => {
    if (qty < 1) setCart(prev => prev.filter(i => i.id !== id));
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  // ── Wishlist ───────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlist(prev =>
      prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]
    );
  }, []);

  const addWishlistToCart = useCallback((item: WishlistItem) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;
    addToCart(product, product.colors[0].name, product.sizes[0]);
    setWishlistOpen(false);
    setCartOpen(true);
  }, [addToCart]);

  // ── Navigation helper ────────────────────────────────────────────────────
  const handleSetPage = useCallback((p: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (p === "home") setPage({ type: "home" });
    else if (p === "shop") setPage({ type: "shop" });
    else if (p === "checkout") setPage({ type: "checkout" });
    else if (p === "cart") setPage({ type: "cart" });
    else if (p === "orders") setPage({ type: "orders" });
    else if (p === "login") setLoginOpen(true);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (page.type) {
      case "shop":
        return (
          <ShopPage
            onAddToCart={addToCart}
            onWishlistToggle={toggleWishlist}
            wishlist={wishlist}
            onProductClick={(p) => { window.scrollTo({ top: 0, behavior: "smooth" }); setPage({ type: "product", product: p }); }}
            initialCategory={page.category}
            onHomeClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setPage({ type: "home" }); }}
          />
        );

      case "product":
        return (
          <ProductPage
            product={page.product}
            onAddToCart={addToCart}
            onWishlistToggle={toggleWishlist}
            isWishlisted={wishlist.some(w => w.id === page.product.id)}
            onBack={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setPage({ type: "shop" }); }}
            onProductClick={(p) => { window.scrollTo({ top: 0, behavior: "smooth" }); setPage({ type: "product", product: p }); }}
            wishlist={wishlist}
          />
        );

      case "checkout":
        return <CheckoutPage onBack={() => setPage({ type: "home" })} cart={cart} />;
      case "orders":
        return <OrdersPage onBack={() => setPage({ type: "home" })}  />;

      default:
        return (
          <HomePage
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            setPage={(p) => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setPage(p as Page);
            }}
          />
        );
    }
  };

  return (
    <>
      <Header
        cart={cart}
        wishlist={wishlist}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
        onLoginOpen={() => setLoginOpen(true)}
        onLogout={() => setUser(null)}
        user={user}
        page={page.type}
        setPage={handleSetPage}
      />

      <main>{renderPage()}</main>

      <Footer />

      {/* Overlays */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={setUser}
        user={user}
        onLogout={() => { setUser(null); setLoginOpen(false); }}
      />
      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdate={updateCart}
        onRemove={removeFromCart}
        setPage={handleSetPage}
      />
      <WishlistDrawer
        wishlist={wishlist}
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onRemove={(id) => setWishlist(prev => prev.filter(i => i.id !== id))}
        onAddToCart={addWishlistToCart}
      />
    </>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ addToCart, toggleWishlist, wishlist, setPage }: {
  addToCart: (p: Product, c: string, s: string) => void;
  toggleWishlist: (i: WishlistItem) => void;
  wishlist: WishlistItem[];
  setPage: (p: { type: string; product?: Product; category?: string }) => void;
}) {
  const [filter, setFilter] = useState<"all" | "new" | "bestseller">("all");

  const filtered = PRODUCTS.filter(p => {
    if (filter === "new") return p.isNew;
    if (filter === "bestseller") return p.isBestSeller;
    return true;
  });

  return (
    <>
      <HeroSection />
      <MarqueeSection />

      {/* Products */}
      <section id="shop" className="py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
                Our Products
              </div>
              <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-tight text-primary">
                POS &amp; IT Hardware<br />
                <span className="italic text-accent">For Every Business</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "new", "bestseller"] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full border-0 px-5 py-2.5 text-[13px] font-semibold cursor-pointer transition-all ${filter === f
                      ? "bg-primary text-white shadow-[0_4px_16px_rgba(15,40,71,0.25)]"
                      : "bg-bg-soft text-primary/80"
                    }`}
                >
                  {f === "all" ? "All" : f === "new" ? "New Arrivals" : "Bestsellers"}
                </button>
              ))}
            </div>
          </div>

          <div className={"grid grid-cols-2 md:grid-cols-4 gap-5"}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product}
                onAddToCart={addToCart} onWishlistToggle={toggleWishlist}
                isWishlisted={wishlist.some(w => w.id === product.id)}
                onClick={(p) => setPage({ type: "product", product: p })} />
            ))}
          </div>

          <div className="mt-15 text-center">
            <button type="button" className={`${tw.btnOutline} px-10 py-4 text-[15px]`} onClick={() => setPage({ type: "shop" })}>
              View All Products <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </section>

      <CategoriesSection
        onCategoryClick={(cat) => setPage({ type: "shop", category: cat })}
        onViewAll={() => setPage({ type: "shop" })}
      />
      {/* <FeaturesSection /> */}
      {/* <TestimonialsSection /> */}

      {/* Trust banner */}
      <section className="relative overflow-hidden py-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=85" alt="" className="absolute inset-0 h-full w-full object-cover opacity-12" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-mid" />
        <div className="relative z-[1] mx-auto max-w-[760px] px-6 text-center">
          <div className="mb-6 text-[56px]">📊</div>
          <h2 className="mb-5 font-display text-[clamp(36px,4vw,56px)] font-bold leading-tight text-white">
            1,300+ Businesses Trust<br />
            <span className="italic text-accent">Skynet Solution Qatar.</span>
          </h2>
          <p className="mb-10 text-base leading-relaxed text-white/65">
            From single-shop retail to large enterprise chains — complete POS systems, ERP software, and 24/7 local support. Qatar VAT certified and ISO 9001 compliant.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-10 py-4 text-[15px] font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-colors">
              View Our Clients
            </button>
            <button type="button" className={`${tw.btnPrimary} px-10 py-4 text-[15px]`} onClick={() => setPage({ type: "shop" })}>
              Shop All Products <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}

// ─── CHECKOUT PAGE ─────────────────────────────────────────────────────────────
function CheckoutPage({ onBack, cart }: { onBack: () => void; cart: CartItem[] }) {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [step, setStep] = useState(1);

  const inputClass = "w-full rounded-xl border border-border bg-bg px-3.5 py-3 text-sm text-primary outline-none focus:border-accent";
  const labelClass = "mb-1.5 block text-xs font-bold text-primary/80";

  return (
    <div className="min-h-screen bg-bg pt-[100px] pb-20">
      <div className="mx-auto max-w-[900px] px-6">
        <button type="button" onClick={onBack} className="mb-8 flex items-center gap-1 border-0 bg-transparent text-[13px] font-semibold text-accent cursor-pointer">
          <Icons.ChevronLeft /> Continue Shopping
        </button>

        <h1 className="mb-2 font-display text-[42px] font-bold text-primary">Checkout</h1>

        <div className="mb-10 flex overflow-hidden rounded-full border border-border">
          {["Contact Info", "Delivery", "Payment"].map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(i + 1)}
              className={`flex-1 border-0 py-3 text-[13px] font-semibold cursor-pointer transition-all ${step === i + 1 ? "bg-primary text-white" : "bg-white text-muted"
                } ${i < 2 ? "border-r border-border" : ""}`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="rounded-3xl border border-border bg-white p-8">
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h3 className="mb-1 font-display text-[22px] font-bold text-primary">Contact Information</h3>
                {["Full Name", "Email Address", "Phone (+974)"].map(label => (
                  <div key={label}>
                    <label className={labelClass}>{label}</label>
                    <input placeholder={label} className={inputClass} />
                  </div>
                ))}
                <button type="button" className={`${tw.btnPrimary} justify-center`} onClick={() => setStep(2)}>
                  Continue to Delivery <Icons.ArrowRight />
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h3 className="mb-1 font-display text-[22px] font-bold text-primary">Delivery Details</h3>
                {["Street Address", "Area / District", "City"].map(label => (
                  <div key={label}>
                    <label className={labelClass}>{label}</label>
                    <input placeholder={label} className={inputClass} />
                  </div>
                ))}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-[13px] text-emerald-700">
                  ✓ Free installation included with this order · Est. delivery 1–2 business days
                </div>
                <div className="flex gap-2.5">
                  <button type="button" className={`${tw.btnOutline} flex-1 justify-center`} onClick={() => setStep(1)}>← Back</button>
                  <button type="button" className={`${tw.btnPrimary} flex-[2] justify-center`} onClick={() => setStep(3)}>Continue to Payment <Icons.ArrowRight /></button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h3 className="mb-1 font-display text-[22px] font-bold text-primary">Payment</h3>
                <div className="flex flex-wrap gap-2.5">
                  {["Credit Card", "Bank Transfer", "Cash on Delivery"].map((m, i) => (
                    <button
                      key={m}
                      type="button"
                      className={`min-w-[120px] flex-1 rounded-xl px-2 py-3 text-xs font-semibold cursor-pointer ${i === 0 ? "border-2 border-primary bg-primary text-white" : "border border-border bg-white text-primary/80"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {["Card Number", "Expiry (MM/YY)", "CVV"].map(label => (
                  <div key={label}>
                    <label className={labelClass}>{label}</label>
                    <input placeholder={label} className={inputClass} />
                  </div>
                ))}
                <div className="mt-2 flex gap-2.5">
                  <button type="button" className={`${tw.btnOutline} flex-1 justify-center`} onClick={() => setStep(2)}>← Back</button>
                  <button type="button" className={`${tw.btnPrimary} flex-[2] justify-center`}>
                    Place Order · QAR {sub.toLocaleString()} <Icons.ArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="sticky top-[100px] rounded-3xl border border-border bg-white p-6">
            <div className="mb-4 text-sm font-bold text-primary">
              Order Summary ({cart.length} item{cart.length !== 1 ? "s" : ""})
            </div>
            {cart.slice(0, 3).map(item => (
              <div key={item.id} className="mb-3 flex gap-2.5 border-b border-bg-soft pb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.img} alt={item.name} className="h-12 w-12 shrink-0 rounded-[10px] object-cover" />
                <div className="flex-1">
                  <div className="text-xs font-semibold leading-snug text-primary">{item.name}</div>
                  <div className="text-[11px] text-muted">Qty: {item.qty}</div>
                </div>
                <div className="text-[13px] font-bold text-primary">
                  QAR {(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))}
            {cart.length > 3 && <div className="mb-3 text-xs text-muted">+{cart.length - 3} more items</div>}
            <div className="flex flex-col gap-2 border-t border-border pt-3">
              {[["Subtotal", `QAR ${sub.toLocaleString()}`], ["Installation", "FREE"], ["VAT (0%)", "QAR 0"], ["Total", `QAR ${sub.toLocaleString()}`]].map(([l, v], i) => (
                <div key={l} className={`flex justify-between ${i === 3 ? "mt-1 border-t border-border pt-2" : ""}`}>
                  <span className={`${i === 3 ? "text-sm font-bold text-primary" : "text-xs text-muted"}`}>{l}</span>
                  <span className={`${i === 3 ? "text-sm font-extrabold text-primary" : "text-xs font-medium"} ${i === 1 ? "text-emerald-600" : "text-primary/80"}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
