"use client";
import { useState, useEffect, useRef } from "react";
import MegaMenu from "./MegaMenu";
import * as Icons from "./Icons";
import type { CartItem, WishlistItem, StoreUser } from "@/lib/types";
import Avatar from "./Avatar";

interface HeaderProps {
  cart: CartItem[];
  wishlist: WishlistItem[];
  onCartOpen: () => void;
  onWishlistOpen: () => void;
  onSearchOpen: () => void;
  onLoginOpen: () => void;
  onLogout?: () => void;
  user?: StoreUser | null;
  page: string;
  setPage: (p: string) => void;
}

const NAV = [
  { label: "Products",  page: "shop",    hasMenu: true  },
  { label: "Solutions", page: "shop",    hasMenu: true  },
  { label: "Deals",     page: "shop",    hasMenu: true  },
  { label: "Support",   page: "support", hasMenu: false },
  { label: "Orders",    page: "orders",  hasMenu: false },
];

export default function Header({
  cart, wishlist, onCartOpen, onWishlistOpen, onSearchOpen,
  onLoginOpen, onLogout, user, page, setPage,
}: HeaderProps) {
  const [scrolled,        setScrolled]       = useState(false);
  const [activeMenu,      setActiveMenu]     = useState<string | null>(null);
  const [mobileOpen,      setMobileOpen]     = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [activeNavLabel,  setActiveNavLabel] = useState<string | null>(null);
  // JS-side viewport width for responsive logic
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const headerRef = useRef<HTMLDivElement>(null);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const isMobile = vw < 768;   // < md
  const isTablet = vw >= 768 && vw < 1024; // md → lg

  /* ── Viewport width tracker ────────────────────────────────────────── */
  useEffect(() => {
    const fn = () => setVw(window.innerWidth);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* ── Scroll detection ──────────────────────────────────────────────── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Close mega-menu when clicking outside ─────────────────────────── */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node))
        setActiveMenu(null);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ── Reset active label on home ────────────────────────────────────── */
  useEffect(() => {
    if (page === "home") setActiveNavLabel(null);
  }, [page]);

  /* ── Close mobile drawer on resize to desktop ──────────────────────── */
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const handleNav = (item: typeof NAV[0]) => {
    setPage(item.page);
    setActiveNavLabel(item.label);
    setActiveMenu(null);
    setMobileOpen(false);
  };

  const isActive = (item: typeof NAV[0]) => {
    if (activeNavLabel !== null) return activeNavLabel === item.label;
    if (item.label === "Support" && page === "support") return true;
    if (item.label === "Orders"  && page === "orders")  return true;
    return false;
  };

  /* ── Announcement bar height ────────────────────────────────────────── */
  const barH = vw < 480 ? 28 : 34;
  const navTop = scrolled ? barH + 6 : barH + 8;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          ANNOUNCEMENT BAR
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "#1A1208",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 110,
        display: "flex", alignItems: "center", justifyContent: "center",
        height: barH, gap: 6,
        borderBottom: "1px solid rgba(200,155,60,0.15)",
        overflow: "hidden",
        padding: "0 12px",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(105deg, transparent 35%, rgba(200,155,60,0.07) 50%, transparent 65%)",
          animation: "shimmerBar 3.5s ease-in-out infinite",
        }} />
        {vw >= 480 && (
          <span style={{ fontSize: 10.5, color: "rgba(240,208,128,0.7)", fontFamily: "'Inter',sans-serif", fontWeight: 500, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
            🎁 Free installation on all POS systems &nbsp;·&nbsp; Qatar VAT Compliant &nbsp;·&nbsp;
          </span>
        )}
        {vw < 480 && (
          <span style={{ fontSize: 10, color: "rgba(240,208,128,0.7)", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>
            🎁 Free installation · Qatar VAT Compliant
          </span>
        )}
        <a
          href="https://www.skynetqatar.com/"
          target="_blank" rel="noreferrer"
          style={{
            color: "#C89B3C", fontSize: vw < 480 ? 9.5 : 10.5, fontWeight: 700,
            fontFamily: "'Inter',sans-serif", textDecoration: "none",
            letterSpacing: "0.02em", transition: "color 0.2s",
            borderBottom: "1px solid rgba(200,155,60,0.35)",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#F0D080")}
          onMouseLeave={e => (e.currentTarget.style.color = "#C89B3C")}
        >
          {vw < 480 ? "Free Demo →" : "Book a Free Demo →"}
        </a>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          FLOATING NAVBAR WRAPPER
      ══════════════════════════════════════════════════════════════════ */}
      <div
        ref={headerRef}
        style={{
          position: "fixed",
          top: navTop,
          left: 0, right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          padding: isMobile ? "0 8px" : "0 14px",
          transition: "top 0.3s ease",
          pointerEvents: "none",
        }}
      >
        <header
          style={{
            width: "100%",
            maxWidth: 1350,
            pointerEvents: "auto",
            background: scrolled ? "rgba(255,253,248,0.97)" : "rgba(255,253,248,0.90)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            borderRadius: isMobile ? 14 : 10,
            border: "1px solid rgba(200,155,60,0.22)",
            boxShadow: scrolled
              ? "0 8px 40px rgba(26,18,8,0.12), 0 2px 0 rgba(200,155,60,0.1), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 2px 24px rgba(26,18,8,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            display: "flex",
            alignItems: "center",
            height: isMobile ? 52 : 58,
            padding: isMobile ? "0 6px 0 14px" : "0 10px 0 20px",
            position: "relative",
            overflow: "visible",
          }}
          onMouseLeave={() => setActiveMenu(null)}
        >
          {/* ── Logo ─────────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => { setPage("home"); setActiveNavLabel(null); }}
            style={{
              border: "none", background: "none", cursor: "pointer",
              display: "flex", alignItems: "center",
              gap: vw < 380 ? 0 : 8,
              padding: "4px 6px 4px 0", flexShrink: 0,
              borderRadius: 10, transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.72")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <div style={{
              width: vw < 380 ? 28 : 32,
              height: vw < 380 ? 28 : 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1A1208 0%, #3C2A0A 55%, #C89B3C 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 10px rgba(200,155,60,0.32)",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#F0D080", fontFamily: "'Cormorant',serif" }}>S</span>
            </div>
            {/* Hide text on tiny phones, show on >= 380 */}
            {vw >= 380 && (
              <div style={{ lineHeight: 1 }}>
                <span style={{ fontFamily: "'Cormorant',serif", fontSize: vw < 500 ? 18 : 21, fontWeight: 800, color: "#1A1208", letterSpacing: "-0.03em", display: "block" }}>
                  Skynet<span style={{ color: "#C89B3C", fontSize: 11, fontWeight: 900 }}>™</span>
                </span>
                {vw >= 500 && (
                  <span style={{ fontSize: 8, fontWeight: 600, color: "#9D8B6E", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "'Inter',sans-serif" }}>
                    Qatar
                  </span>
                )}
              </div>
            )}
          </button>

          {/* ── Center Desktop Nav (hidden on mobile/tablet) ──────────── */}
          {!isMobile && (
            <nav style={{
              position: "absolute",
              left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center",
              gap: isTablet ? 0 : 2,
            }}>
              {NAV.map(item => {
                const active = isActive(item);
                return (
                  <div
                    key={item.label}
                    style={{ position: "relative" }}
                    onMouseEnter={() => item.hasMenu ? setActiveMenu(item.label) : setActiveMenu(null)}
                  >
                    <button
                      type="button"
                      onClick={() => handleNav(item)}
                      style={{
                        border: active
                          ? "1px solid rgba(200,155,60,0.38)"
                          : "1px solid transparent",
                        background: active
                          ? "linear-gradient(135deg, rgba(200,155,60,0.14) 0%, rgba(240,208,128,0.07) 100%)"
                          : "transparent",
                        cursor: "pointer",
                        padding: isTablet ? "5px 10px" : "6px 14px",
                        fontSize: isTablet ? 12 : 13,
                        fontWeight: active ? 700 : 500,
                        color: active ? "#9A6F10" : "#2C1E08",
                        fontFamily: "'Inter',sans-serif",
                        letterSpacing: "0.01em",
                        borderRadius: 999,
                        transition: "all 0.2s ease",
                        position: "relative",
                        whiteSpace: "nowrap",
                        boxShadow: active
                          ? "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 6px rgba(200,155,60,0.14)"
                          : "none",
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          const btn = e.currentTarget as HTMLButtonElement;
                          btn.style.background = "rgba(200,155,60,0.08)";
                          btn.style.border = "1px solid rgba(200,155,60,0.22)";
                          btn.style.color = "#1A1208";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          const btn = e.currentTarget as HTMLButtonElement;
                          btn.style.background = "transparent";
                          btn.style.border = "1px solid transparent";
                          btn.style.color = "#2C1E08";
                        }
                      }}
                    >
                      {item.label}
                      {active && (
                        <span style={{
                          position: "absolute", bottom: 4, left: "50%",
                          transform: "translateX(-50%)",
                          width: "55%", height: 2, borderRadius: 2,
                          background: "linear-gradient(90deg, #C89B3C, #F0D080, #C89B3C)",
                          boxShadow: "0 0 6px rgba(200,155,60,0.5)",
                        }} />
                      )}
                    </button>
                  </div>
                );
              })}
            </nav>
          )}

          {/* ── Spacer ───────────────────────────────────────────────── */}
          <div style={{ flex: 1 }} />

          {/* ── Right Action Icons ────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 1 : 2 }}>

            {/* Search — always visible */}
            <GoldIconBtn label="Search" onClick={onSearchOpen} size={isMobile ? 34 : 38}>
              <Icons.Search />
            </GoldIconBtn>

            {/* User — hide on tiny phones */}
            {vw >= 360 && (
              <GoldIconBtn label={user ? user.name : "Sign in"} onClick={onLoginOpen} size={isMobile ? 34 : 38}>
                {user
                  ? <Avatar name={user.name} size={22} imageUrl={user.avatarUrl} className="border-0 shadow-none" />
                  : <Icons.User />
                }
              </GoldIconBtn>
            )}

            {/* Wishlist — hide on small mobile */}
            {vw >= 480 && (
              <GoldIconBtn label={`Wishlist (${wishlist.length})`} onClick={onWishlistOpen} size={isMobile ? 34 : 38}>
                <div style={{ position: "relative" }}>
                  <Icons.Heart filled={wishlist.length > 0} />
                  {wishlist.length > 0 && (
                    <span style={{
                      position: "absolute", top: -5, right: -5,
                      background: "linear-gradient(135deg, #C89B3C, #E8BB5C)",
                      color: "#1A1208",
                      borderRadius: "50%", width: 14, height: 14,
                      fontSize: 8, fontWeight: 900,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(200,155,60,0.5)",
                    }}>
                      {wishlist.length > 9 ? "9+" : wishlist.length}
                    </span>
                  )}
                </div>
              </GoldIconBtn>
            )}

            {/* Cart — icon-only on mobile, pill with text on desktop */}
            {isMobile ? (
              /* Mobile: compact icon button */
              <button
                type="button"
                onClick={onCartOpen}
                aria-label={`Cart (${cartCount})`}
                style={{
                  position: "relative",
                  width: 36, height: 36, borderRadius: "50%",
                  border: cartCount > 0 ? "1px solid rgba(200,155,60,0.5)" : "1px solid rgba(200,155,60,0.22)",
                  background: cartCount > 0
                    ? "linear-gradient(135deg, #C89B3C 0%, #F0D080 50%, #C89B3C 100%)"
                    : "linear-gradient(135deg, rgba(200,155,60,0.08), rgba(240,208,128,0.04))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  color: cartCount > 0 ? "#1A1208" : "#7A5D0A",
                  boxShadow: cartCount > 0
                    ? "0 3px 12px rgba(200,155,60,0.4), inset 0 1px 0 rgba(255,255,255,0.5)"
                    : "inset 0 1px 0 rgba(255,255,255,0.5)",
                  transition: "all 0.2s ease",
                  marginLeft: 2,
                }}
              >
                <Icons.Bag />
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute", top: -3, right: -3,
                    background: "#1A1208", color: "#F0D080",
                    borderRadius: "50%", width: 16, height: 16,
                    fontSize: 8, fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            ) : (
              /* Desktop: full pill */
              <button
                type="button"
                onClick={onCartOpen}
                aria-label={`Cart (${cartCount})`}
                style={{
                  display: "flex", alignItems: "center",
                  gap: isTablet ? 5 : 7,
                  height: 38,
                  padding: isTablet ? "0 12px" : "0 16px",
                  borderRadius: 999,
                  border: cartCount > 0
                    ? "1px solid rgba(200,155,60,0.55)"
                    : "1px solid rgba(200,155,60,0.28)",
                  background: cartCount > 0
                    ? "linear-gradient(135deg, #C89B3C 0%, #F0D080 45%, #D4A849 75%, #C89B3C 100%)"
                    : "linear-gradient(135deg, rgba(200,155,60,0.10) 0%, rgba(240,208,128,0.05) 100%)",
                  cursor: "pointer",
                  color: cartCount > 0 ? "#1A1208" : "#7A5D0A",
                  fontSize: isTablet ? 12 : 13, fontWeight: 700,
                  fontFamily: "'Inter',sans-serif",
                  letterSpacing: "0.01em",
                  boxShadow: cartCount > 0
                    ? "0 4px 16px rgba(200,155,60,0.38), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08)"
                    : "inset 0 1px 0 rgba(255,255,255,0.55)",
                  transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                  marginLeft: 6,
                }}
                onMouseEnter={e => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.transform = "scale(1.04)";
                  btn.style.boxShadow = cartCount > 0
                    ? "0 6px 24px rgba(200,155,60,0.55), inset 0 1px 0 rgba(255,255,255,0.55)"
                    : "0 4px 14px rgba(200,155,60,0.22), inset 0 1px 0 rgba(255,255,255,0.55)";
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.transform = "scale(1)";
                  btn.style.boxShadow = cartCount > 0
                    ? "0 4px 16px rgba(200,155,60,0.38), inset 0 1px 0 rgba(255,255,255,0.5)"
                    : "inset 0 1px 0 rgba(255,255,255,0.55)";
                }}
              >
                <Icons.Bag />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span style={{
                    background: "rgba(26,18,8,0.85)", color: "#F0D080",
                    borderRadius: 999, padding: "1px 8px",
                    fontSize: 10.5, fontWeight: 900, lineHeight: "17px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile burger — only on mobile */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: "1px solid rgba(200,155,60,0.25)",
                  background: "linear-gradient(135deg, rgba(200,155,60,0.08) 0%, rgba(240,208,128,0.03) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#2C1E08", marginLeft: 3,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  transition: "all 0.18s ease",
                  flexShrink: 0,
                }}
              >
                <Icons.Menu />
              </button>
            )}
          </div>

          {/* ── Mega Menu dropdown (desktop only) ────────────────────── */}
          {!isMobile && activeMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                left: "50%", transform: "translateX(-50%)",
                width: isTablet ? "min(700px, 95vw)" : "min(940px, 90vw)",
                zIndex: 200,
                animation: "megaFadeIn 0.18s ease",
                pointerEvents: "auto",
              }}
            >
              <div style={{
                background: "rgba(255,253,248,0.98)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: 20,
                border: "1px solid rgba(200,155,60,0.18)",
                boxShadow: "0 20px 60px rgba(26,18,8,0.13), 0 4px 16px rgba(200,155,60,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
                padding: isTablet ? "18px 20px" : "24px 28px",
                overflow: "hidden",
              }}>
                <div style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 9.5, fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "#C89B3C",
                  marginBottom: 16, paddingBottom: 10,
                  borderBottom: "1px solid rgba(200,155,60,0.12)",
                }}>
                  {activeMenu}
                </div>
                <MegaMenu section={activeMenu} onClose={() => setActiveMenu(null)} />
              </div>
            </div>
          )}
        </header>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE DRAWER (slide-in from left)
      ══════════════════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 300,
              background: "rgba(26,18,8,0.5)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              animation: "fadeIn 0.2s ease",
            }}
          />
          {/* Drawer panel */}
          <div style={{
            position: "fixed", top: 0, left: 0, bottom: 0,
            width: "min(320px, 85vw)",
            zIndex: 310,
            background: "#FDFAF5",
            overflowY: "auto",
            overflowX: "hidden",
            animation: "slideInLeft 0.26s cubic-bezier(0.34,1.56,0.64,1)",
            display: "flex", flexDirection: "column",
            boxShadow: "4px 0 40px rgba(26,18,8,0.18)",
          }}>
            {/* Drawer header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 16px",
              background: "#1A1208",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "rgba(240,208,128,0.12)",
                  border: "1px solid rgba(240,208,128,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#F0D080", fontFamily: "'Cormorant',serif" }}>S</span>
                </div>
                <div>
                  <span style={{ fontFamily: "'Cormorant',serif", fontSize: 18, fontWeight: 800, color: "#F0D080", letterSpacing: "-0.02em", display: "block" }}>
                    Skynet™
                  </span>
                  <span style={{ fontSize: 8, color: "rgba(240,208,128,0.5)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter',sans-serif" }}>Qatar</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                style={{
                  border: "1px solid rgba(240,208,128,0.2)",
                  background: "rgba(255,255,255,0.07)", cursor: "pointer",
                  width: 32, height: 32, borderRadius: 9,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#F0D080",
                }}
              >
                <Icons.X />
              </button>
            </div>

            {/* Quick actions row */}
            <div style={{
              display: "flex", gap: 8, padding: "12px 14px",
              background: "rgba(200,155,60,0.04)",
              borderBottom: "1px solid rgba(200,155,60,0.1)",
            }}>
              <MobileQuickBtn icon={<Icons.Search />} label="Search" onClick={() => { onSearchOpen(); setMobileOpen(false); }} />
              <MobileQuickBtn icon={<Icons.User />} label={user ? "Account" : "Sign In"} onClick={() => { onLoginOpen(); setMobileOpen(false); }} />
              <MobileQuickBtn
                icon={
                  <div style={{ position: "relative" }}>
                    <Icons.Heart filled={wishlist.length > 0} />
                    {wishlist.length > 0 && (
                      <span style={{
                        position: "absolute", top: -4, right: -4,
                        background: "#C89B3C", color: "#1A1208",
                        borderRadius: "50%", width: 12, height: 12,
                        fontSize: 7, fontWeight: 900,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{wishlist.length}</span>
                    )}
                  </div>
                }
                label="Wishlist"
                onClick={() => { onWishlistOpen(); setMobileOpen(false); }}
              />
            </div>

            {/* Nav links */}
            <nav style={{ padding: "8px 10px", flex: 1 }}>
              {NAV.map(item => (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.hasMenu) {
                        setMobileAccordion(mobileAccordion === item.label ? null : item.label);
                      } else {
                        handleNav(item);
                      }
                    }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%",
                      border: isActive(item) ? "1px solid rgba(200,155,60,0.28)" : "1px solid transparent",
                      background: isActive(item)
                        ? "linear-gradient(135deg, rgba(200,155,60,0.1), rgba(240,208,128,0.04))"
                        : "transparent",
                      cursor: "pointer", padding: "12px 14px",
                      borderRadius: 12,
                      fontFamily: "'Cormorant',serif",
                      fontSize: 20, fontWeight: 700,
                      color: isActive(item) ? "#B8821E" : "#1A1208",
                      transition: "all 0.15s",
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                    <span style={{
                      fontSize: 14, color: "#C89B3C", opacity: 0.7,
                      transition: "transform 0.2s",
                      transform: mobileAccordion === item.label ? "rotate(90deg)" : "none",
                      display: "inline-block",
                    }}>
                      {item.hasMenu ? "›" : "→"}
                    </span>
                  </button>
                  {/* Mini sub-links when accordion open */}
                  {item.hasMenu && mobileAccordion === item.label && (
                    <div style={{
                      padding: "4px 14px 8px 24px",
                      animation: "fadeIn 0.15s ease",
                    }}>
                      {["New Arrivals", "Bestsellers", "Shop All", "Bundles"].map(sub => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleNav(item)}
                          style={{
                            display: "block", width: "100%",
                            border: "none", background: "none", cursor: "pointer",
                            textAlign: "left", padding: "7px 0",
                            fontSize: 13, fontWeight: 500,
                            color: "#6B5A44", fontFamily: "'Inter',sans-serif",
                            transition: "color 0.15s",
                            borderBottom: "1px solid rgba(200,155,60,0.06)",
                          }}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(200,155,60,0.12)", margin: "0 14px" }} />

            {/* User section */}
            <div style={{ padding: "14px 14px 28px", flexShrink: 0 }}>
              {user ? (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#F7F1E3", borderRadius: 14, padding: "12px 14px",
                  border: "1px solid rgba(200,155,60,0.2)",
                }}>
                  <Avatar name={user.name} size={38} imageUrl={user.avatarUrl} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                    <div style={{ fontSize: 10.5, color: "#9D8B6E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onLogout?.(); setMobileOpen(false); }}
                    style={{
                      border: "1px solid rgba(200,155,60,0.4)",
                      background: "transparent", cursor: "pointer",
                      fontSize: 10.5, fontWeight: 700, color: "#C89B3C",
                      borderRadius: 8, padding: "5px 10px", flexShrink: 0,
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { onLoginOpen(); setMobileOpen(false); }}
                  style={{
                    width: "100%", border: "none", borderRadius: 12,
                    padding: "13px 18px",
                    background: "linear-gradient(135deg, #1A1208, #3C2A0A 60%, #C89B3C)",
                    color: "#F0D080", fontSize: 13.5, fontWeight: 700,
                    fontFamily: "'Inter',sans-serif", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    letterSpacing: "0.02em",
                    boxShadow: "0 4px 16px rgba(200,155,60,0.25)",
                  }}
                >
                  <Icons.LogIn />
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Global Keyframes ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes shimmerBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0.6; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes megaFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}

/* ── Golden glassy round icon button ─────────────────────────────────── */
function GoldIconBtn({
  children, label, onClick, size = 38,
}: { children: React.ReactNode; label: string; onClick: () => void; size?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        width: size, height: size, borderRadius: "50%",
        border: "1px solid transparent",
        background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "#2C1E08",
        transition: "all 0.18s ease",
        position: "relative",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.background = "linear-gradient(135deg, rgba(200,155,60,0.13) 0%, rgba(240,208,128,0.06) 100%)";
        btn.style.border = "1px solid rgba(200,155,60,0.32)";
        btn.style.color = "#8A6820";
        btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 8px rgba(200,155,60,0.14)";
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.background = "transparent";
        btn.style.border = "1px solid transparent";
        btn.style.color = "#2C1E08";
        btn.style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}

/* ── Mobile drawer quick-action button ──────────────────────────────── */
function MobileQuickBtn({
  icon, label, onClick,
}: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, border: "1px solid rgba(200,155,60,0.2)",
        background: "rgba(255,253,248,0.8)", cursor: "pointer",
        borderRadius: 10, padding: "8px 4px",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 4,
        color: "#2C1E08", transition: "all 0.15s ease",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.background = "linear-gradient(135deg, rgba(200,155,60,0.12), rgba(240,208,128,0.06))";
        btn.style.borderColor = "rgba(200,155,60,0.4)";
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.background = "rgba(255,253,248,0.8)";
        btn.style.borderColor = "rgba(200,155,60,0.2)";
      }}
    >
      <span style={{ fontSize: 16, color: "#2C1E08" }}>{icon}</span>
      <span style={{ fontSize: 9.5, fontWeight: 600, color: "#7A6040", fontFamily: "'Inter',sans-serif", letterSpacing: "0.03em" }}>{label}</span>
    </button>
  );
}
