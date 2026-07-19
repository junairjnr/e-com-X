"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import LoginModal from "@/components/LoginModal";
import ShopPage from "@/components/ShopPage";
import ProductPage from "@/components/ProductPage";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import NewsletterSection from "@/components/NewsletterSection";
import FlashSaleSection from "@/components/FlashSaleSection";
import FlipkartProductRow from "@/components/FlipkartProductRow";
import PromoBannerStrip from "@/components/PromoBannerStrip";
import OrdersPage from "@/components/Orders";
import { useStore } from "@/components/StoreProvider";
import type { CartItem, Product, WishlistItem } from "@/lib/types";
import type { StorePage } from "@/lib/routes";
import * as Icons from "@/components/Icons";
import { tw } from "@/lib/theme";
import { useState } from "react";
import { PRODUCTS } from "@/lib/data";

export default function NestStore() {
  const {
    page,
    pageType,
    cart,
    wishlist,
    cartOpen,
    wishlistOpen,
    searchOpen,
    loginOpen,
    user,
    setCartOpen,
    setWishlistOpen,
    setSearchOpen,
    setLoginOpen,
    setUser,
    navigate,
    goBack,
    handleSetPage,
    addToCart,
    updateCart,
    removeFromCart,
    toggleWishlist,
    addWishlistToCart,
  } = useStore();

  const openProduct = (product: Product) => {
    navigate({ type: "product", product });
  };

  const renderPage = () => {
    switch (page.type) {
      case "shop":
        return (
          <ShopPage
            onAddToCart={addToCart}
            onWishlistToggle={toggleWishlist}
            wishlist={wishlist}
            onProductClick={openProduct}
            initialCategory={page.category}
            onHomeClick={() => navigate({ type: "home" })}
          />
        );

      case "product":
        return (
          <ProductPage
            key={page.product.id}
            product={page.product}
            onAddToCart={addToCart}
            onWishlistToggle={toggleWishlist}
            isWishlisted={wishlist.some(w => w.id === page.product.id)}
            onBack={goBack}
            onProductClick={openProduct}
            wishlist={wishlist}
          />
        );

      case "checkout":
        return <CheckoutPage onBack={goBack} cart={cart} />;

      case "orders":
        return <OrdersPage onBack={goBack} />;

      default:
        return (
          <HomePage
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            navigate={navigate}
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
        page={pageType}
        setPage={handleSetPage}
        onNavigateHome={() => navigate({ type: "home" })}
      />

      <main className="">{renderPage()}</main>
      <Footer />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onProductSelect={p => {
          setSearchOpen(false);
          openProduct(p);
        }}
      />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={setUser}
        user={user}
        onLogout={() => {
          setUser(null);
          setLoginOpen(false);
        }}
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
        onRemove={id => {
          const item = wishlist.find(w => w.id === id);
          if (item) toggleWishlist(item);
        }}
        onAddToCart={addWishlistToCart}
      />
    </>
  );
}

// ── Flipkart-Style Homepage ────────────────────────────────────────────────────
function HomePage({
  addToCart,
  toggleWishlist,
  wishlist,
  navigate,
}: {
  addToCart: (p: Product, c: string, s: string) => void;
  toggleWishlist: (i: WishlistItem) => void;
  wishlist: WishlistItem[];
  navigate: (page: StorePage) => void;
}) {
  const openProduct = (product: Product) => navigate({ type: "product", product });
  const goShop = () => navigate({ type: "shop" });

  const bestSellers = PRODUCTS.filter(p => p.isBestSeller);
  const newArrivals = PRODUCTS.filter(p => p.isNew);
  const allProducts = PRODUCTS;

  return (
    <div className="page-top-offset min-h-screen" style={{ background: "#f1f3f6" }}>
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 md:px-8 lg:px-[50px]" >

        {/* 1. Full-width hero slider */}
        <div className="mb-2">
          <HeroSection onViewAll={goShop} />
        </div>

        {/* 2. Flash Sale / Deal of the Day */}
        <div className="mb-2 bg-white">
          <FlashSaleSection onProductClick={openProduct} onViewAll={goShop} />
        </div>

        {/* 3. Promo banners */}
        <div className="mb-2">
          <PromoBannerStrip onCategoryClick={cat => navigate({ type: "shop", category: cat })} />
        </div>

        {/* 4. Best Sellers */}
        <div className="mb-2 bg-white">
          <FlipkartProductRow
            title="Best Sellers"
            subtitle="Top-rated products by Skynet customers"
            products={bestSellers.length > 0 ? bestSellers : allProducts}
            onProductClick={openProduct}
            onViewAll={goShop}
            bgColor="#ffffff"
          />
        </div>

        {/* 5. Shop by Category */}
        <div className="mb-2 bg-white">
          <CategoriesSection
            onCategoryClick={cat => navigate({ type: "shop", category: cat })}
            onViewAll={goShop}
          />
        </div>

        {/* 6. New Arrivals */}
        <div className="mb-2 bg-white">
          <FlipkartProductRow
            title="New Arrivals"
            subtitle="Latest products just added"
            products={newArrivals.length > 0 ? newArrivals : allProducts.slice(4)}
            onProductClick={openProduct}
            onViewAll={goShop}
            bgColor="#ffffff"
          />
        </div>

        {/* 7. Mega Sale Banner */}
        <div className="mb-2 overflow-hidden" style={{ background: "linear-gradient(135deg, #0a255dff 0%, #1e293b 40%, #334155 100%)" }}>
          <div
            className="flex cursor-pointer items-center justify-between px-10 py-8 md:py-10"
            onClick={goShop} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && goShop()}
          >
            <div>
              <div className="mb-1 font-eyebrow text-[9px] tracking-[0.2em] text-slate-400/70">LIMITED TIME OFFER</div>
              <div className="font-display text-[26px] font-extrabold leading-tight text-white md:text-[36px]">
                MEGA SALE — Up to 50% OFF
              </div>
              <div className="mt-2 font-label text-[12px] text-slate-300/60">
                Free installation on all POS systems · Qatar VAT Compliant
              </div>
              <div
                className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-label text-[13px] font-bold text-white transition-all hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                Shop Now →
              </div>
            </div>
            <div className="hidden shrink-0 md:flex flex-col items-center justify-center">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-2xl text-[42px] font-black text-white"
                style={{ background: "rgba(255,255,255,0.10)", border: "1.5px solid rgba(255,255,255,0.18)" }}
              >
                %
              </div>
            </div>
          </div>
        </div>

        {/* 8. Newsletter */}
        <NewsletterSection />

      </div>
    </div>
  );
}




function CheckoutPage({ onBack, cart }: { onBack: () => void; cart: CartItem[] }) {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [step, setStep] = useState(1);

  const inputClass =
    "w-full rounded-xl border border-border bg-bg px-3.5 py-3 text-sm text-primary outline-none focus:border-accent";
  const labelClass = "mb-1.5 block text-xs font-bold text-primary/80";

  return (
    <div className={`min-h-screen ${tw.sectionBg} pt-[100px] pb-20`}>
      <div className="mx-auto max-w-[900px] px-3 sm:px-5 md:px-8 lg:px-[50px]">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-1 border-0 bg-transparent text-[13px] font-semibold text-accent cursor-pointer"
        >
          <Icons.ChevronLeft /> Back
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
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[13px] text-gray-700">
                  ✓ Free installation included · Est. delivery 1–2 business days
                </div>
                <div className="flex gap-2.5">
                  <button type="button" className={`${tw.btnOutline} flex-1 justify-center`} onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button type="button" className={`${tw.btnPrimary} flex-[2] justify-center`} onClick={() => setStep(3)}>
                    Continue to Payment <Icons.ArrowRight />
                  </button>
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
                  <button type="button" className={`${tw.btnOutline} flex-1 justify-center`} onClick={() => setStep(2)}>
                    ← Back
                  </button>
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
                <div className="text-[13px] font-bold text-primary">QAR {(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
            <div className="flex flex-col gap-2 border-t border-border pt-3">
              {[["Subtotal", `QAR ${sub.toLocaleString()}`], ["Installation", "FREE"], ["Total", `QAR ${sub.toLocaleString()}`]].map(
                ([l, v], i) => (
                  <div key={l} className={`flex justify-between ${i === 2 ? "mt-1 border-t border-border pt-2" : ""}`}>
                    <span className={`${i === 2 ? "text-sm font-bold text-primary" : "text-xs text-muted"}`}>{l}</span>
                    <span className={`${i === 2 ? "font-price text-sm font-extrabold text-primary" : "text-xs font-medium"} ${i === 1 ? "text-gray-600" : "text-primary/80"}`}>
                      {v}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
