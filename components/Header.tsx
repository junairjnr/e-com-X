"use client";

import { useState, useEffect, useRef } from "react";
import MegaMenu from "./MegaMenu";
import * as Icons from "./Icons";
import type { CartItem, WishlistItem, StoreUser } from "@/lib/types";
import Avatar from "./Avatar";
import { useClientTheme } from "./ThemeProvider";

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
  onNavigateHome: () => void;
}

const NAV = [
  { label: "Products", page: "shop", hasMenu: true },
  { label: "Solutions", page: "shop", hasMenu: true },
  { label: "Deals", page: "shop", hasMenu: true },
  { label: "Support", page: "support", hasMenu: false },
  { label: "Orders", page: "orders", hasMenu: false },
];

function NavIconBtn({
  label,
  onClick,
  children,
  className = "",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`nav-icon-btn h-[38px] w-[38px] md:h-[38px] md:w-[38px] max-md:h-[34px] max-md:w-[34px] ${className}`}
    >
      {children}
    </button>
  );
}

const SEARCH_CATEGORIES = [
  "POS Systems",
  "Printers",
  "Scanners",
  "Software & ERP",
  "Networking",
  "Laptops & PCs",
  "Security & CCTV",
  "UPS & Power",
];

function HeaderSearch({
  onOpen,
  className = "",
}: {
  onOpen: () => void;
  className?: string;
}) {
  const [hintIdx, setHintIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      swapTimerRef.current = setTimeout(() => {
        setHintIdx((i) => (i + 1) % SEARCH_CATEGORIES.length);
        setVisible(true);
      }, 550);
    }, 2500);
    return () => {
      clearInterval(interval);
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Search for ${SEARCH_CATEGORIES[hintIdx]}`}
      className={`flex h-8 w-[300px] shrink-0 items-center gap-2 rounded-full border border-border bg-white/90 px-3 text-left shadow-[inset_0_1px_2px_color-mix(in_srgb,var(--color-primary)_4%,transparent)] transition-[border-color,box-shadow] hover:border-accent/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent/40 xl:w-[320px] ${className}`}
    >
      <span className="shrink-0 text-muted">
        <Icons.Search />
      </span>
      <span className="flex min-w-0 flex-1 items-center text-[11px] text-muted sm:text-xs">
        <span className="shrink-0">Search for</span>
        <span className="relative ml-1 inline-block w-[132px] shrink-0 overflow-hidden xl:w-[148px]">
          <span
            className={`block truncate font-medium text-accent transition-opacity duration-500 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
          >
            &quot;{SEARCH_CATEGORIES[hintIdx]}&quot;
          </span>
        </span>
      </span>
    </button>
  );
}

export default function Header({
  cart,
  wishlist,
  onCartOpen,
  onWishlistOpen,
  onSearchOpen,
  onLoginOpen,
  onLogout,
  user,
  page,
  setPage,
  onNavigateHome,
}: HeaderProps) {
  const { client } = useClientTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [activeNavLabel, setActiveNavLabel] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setActiveMenu(null);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    if (page === "home") setActiveNavLabel(null);
  }, [page]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", mobileOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  const handleNav = (item: (typeof NAV)[0]) => {
    setPage(item.page);
    setActiveNavLabel(item.label);
    setActiveMenu(null);
    setMobileOpen(false);
  };

  const isActive = (item: (typeof NAV)[0]) => {
    if (activeNavLabel !== null) return activeNavLabel === item.label;
    if (item.label === "Support" && page === "support") return true;
    if (item.label === "Orders" && page === "orders") return true;
    return false;
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-[160] flex h-8 sm:h-[34px] items-center justify-center gap-1.5 overflow-hidden border-b border-white/10 bg-footer px-3">
        <div className="pointer-events-none absolute inset-0 animate-shimmer-bar bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
        <span className="hidden font-label text-[10.5px] font-medium tracking-wide text-white/70 sm:inline">
          🎁 Free installation on all POS systems · Qatar VAT Compliant ·
        </span>
        <span className="font-label text-[10px] font-medium text-white/70 sm:hidden">
          🎁 Free installation · Qatar VAT Compliant
        </span>
        <a
          href={client.siteUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 border-b border-accent/50 font-label text-[9.5px] sm:text-[10.5px] font-bold tracking-wide text-accent transition-colors hover:text-accent-light"
        >
          <span className="sm:hidden">Free Demo →</span>
          <span className="hidden sm:inline">Book a Free Demo →</span>
        </a>
      </div>

      {/* Floating navbar */}
      <div
        ref={headerRef}
        className={`pointer-events-none fixed left-0 right-0 z-[150] flex justify-center px-2 md:px-3.5 transition-[top] duration-300 ${scrolled ? "top-[38px] sm:top-[40px]" : "top-9 sm:top-[42px]"}`}
      >
        <header
          className={`pointer-events-auto relative flex w-full max-w-[1350px] flex-col gap-2 overflow-visible rounded-[14px] md:rounded-[12px] border border-border bg-bg-soft/95 px-3 py-2 md:px-5 md:py-0 backdrop-blur-[28px] transition-all duration-300 ${
            scrolled
              ? "shadow-[0_10px_44px_rgba(0,0,0,0.08)]"
              : "shadow-[0_4px_28px_rgba(0,0,0,0.06)]"
          }`}
          onMouseLeave={() => setActiveMenu(null)}
        >
          {/* Main bar — grouped: brand | search | nav ··· actions */}
          <div className="flex h-[44px] w-full items-center md:h-[56px]">
            {/* Group 1: Company / brand */}
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => { onNavigateHome(); setActiveNavLabel(null); }}
                className="flex items-center gap-2 rounded-[10px] border-0 bg-transparent p-1 pr-2 cursor-pointer transition-opacity hover:opacity-75"
              >
                <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-hover via-accent to-primary-light shadow-[0_3px_10px_color-mix(in_srgb,var(--color-accent)_32%,transparent)]">
                  <span className="font-display text-[13px] font-black text-white">S</span>
                </div>
                <div className="hidden min-[380px]:block leading-none text-left">
                  <span className="font-display block text-lg md:text-[20px] font-extrabold tracking-tight text-primary">
                    {client.name.split(" ")[0]}
                    <span className="text-[11px] font-black text-accent">™</span>
                  </span>
                  <span className="font-eyebrow hidden min-[500px]:block mt-0.5 text-[8px] font-semibold tracking-[0.16em] text-muted">
                    {client.tagline}
                  </span>
                </div>
              </button>
            </div>

            {/* Group 2: Search — fixed width so nav links don't shift */}
            <div className="hidden min-[520px]:flex w-[300px] shrink-0 items-center pl-3 md:pl-4 xl:w-[320px]">
              <HeaderSearch onOpen={onSearchOpen} className="w-full max-w-none xl:w-[320px]" />
            </div>

            {/* Group 3: Nav links — spaced from search */}
            <nav
              aria-label="Main"
              className="hidden shrink-0 items-center gap-2  border-border/60 pl-5 lg:pl-8 xl:flex"
            >
              {NAV.map((item) => {
                const active = isActive(item);
                const menuOpen = activeMenu === item.label;
                const highlighted = active || menuOpen;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => (item.hasMenu ? setActiveMenu(item.label) : setActiveMenu(null))}
                  >
                    <button
                      type="button"
                      onClick={() => handleNav(item)}
                      className={`nav-link ${highlighted ? (active ? "nav-link--active" : "nav-link--open") : ""}`}
                    >
                      {item.label}
                      <span className="nav-link__indicator" aria-hidden />
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* Spacer — pushes action icons to the end */}
            <div className="min-w-3 flex-1" aria-hidden />

            {/* Group 4: Action icons — separated at the end */}
            <div className="flex shrink-0 items-center gap-2  border-border/60 pl-3 md:gap-2.5 md:pl-5">
              <NavIconBtn label={user ? user.name : "Sign in"} onClick={onLoginOpen}>
                {user ? <Avatar name={user.name} size={22} imageUrl={user.avatarUrl} className="border-0 shadow-none" /> : <Icons.User />}
              </NavIconBtn>
              <NavIconBtn label={`Wishlist (${wishlist.length})`} onClick={onWishlistOpen} className="hidden min-[480px]:flex">
                <div className="relative">
                  <Icons.Heart filled={wishlist.length > 0} />
                  {wishlist.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-black text-white">
                      {wishlist.length > 9 ? "9+" : wishlist.length}
                    </span>
                  )}
                </div>
              </NavIconBtn>

              <button
                type="button"
                onClick={onCartOpen}
                aria-label={`Cart (${cartCount})`}
                className={`relative flex items-center justify-center rounded-full border transition-all md:gap-1.5 md:px-4 md:py-0 md:h-[38px] max-md:h-9 max-md:w-9 ${
                  cartCount > 0
                    ? "border-accent/50 bg-gradient-to-br from-accent to-primary-light text-white shadow-[0_4px_16px_color-mix(in_srgb,var(--color-accent)_38%,transparent)]"
                    : "border-accent/25 bg-accent-soft/40 text-muted hover:border-accent/40"
                }`}
              >
                <Icons.Bag />
                <span className="hidden md:inline text-[13px] font-bold">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-accent-light md:static md:h-auto md:w-auto md:rounded-full md:bg-primary/85 md:px-2 md:py-0 md:text-[10.5px]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent text-primary transition-all hover:border-accent/30 hover:bg-accent-soft/80 max-xl:flex"
              >
                <Icons.Menu />
              </button>
            </div>
          </div>

          {/* Mobile full-width search row */}
          <HeaderSearch onOpen={onSearchOpen} className="min-[520px]:hidden !w-full max-w-none pb-0.5" />

          {/* Mega menu */}
          {activeMenu && (
            <div className="absolute left-1/2 top-[calc(100%+10px)] z-[200] hidden w-[min(940px,90vw)] -translate-x-1/2 animate-mega-fade-in md:block lg:w-[min(940px,90vw)]">
              <div className="overflow-hidden rounded-[20px] border border-accent/20 bg-white/98 p-6 backdrop-blur-2xl shadow-[0_20px_60px_color-mix(in_srgb,var(--color-primary)_13%,transparent)] lg:px-7 lg:py-6">
                <div className="mb-4 border-b border-accent/15 pb-2.5 font-eyebrow text-[9.5px] tracking-[0.15em] text-accent">
                  {activeMenu}
                </div>
                <MegaMenu section={activeMenu} onClose={() => setActiveMenu(null)} />
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[300] animate-fade-in bg-primary/50 backdrop-blur-sm"
          />
          <div className="fixed bottom-0 left-0 top-0 z-[310] flex w-[min(320px,85vw)] animate-slide-in-left flex-col overflow-y-auto overflow-x-hidden bg-bg shadow-[4px_0_40px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]">
            <div className="flex shrink-0 items-center justify-between bg-primary px-4 py-[18px]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-accent-light/30 bg-accent-light/10">
                  <span className="font-display text-[13px] font-black text-accent-light">S</span>
                </div>
                <div>
                  <span className="font-display block text-lg font-extrabold text-accent-light">{client.name.split(" ")[0]}™</span>
                  <span className="font-eyebrow text-[8px] tracking-[0.14em] text-accent-light/50">{client.tagline}</span>
                </div>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-light/20 bg-white/10 text-accent-light">
                <Icons.X />
              </button>
            </div>

            <div className="flex gap-2 border-b border-accent/10 bg-accent-soft/40 px-3.5 py-3">
              {[
                { icon: <Icons.Search />, label: "Search", action: () => { onSearchOpen(); setMobileOpen(false); } },
                { icon: <Icons.User />, label: user ? "Account" : "Sign In", action: () => { onLoginOpen(); setMobileOpen(false); } },
                { icon: <Icons.Heart filled={wishlist.length > 0} />, label: "Wishlist", action: () => { onWishlistOpen(); setMobileOpen(false); } },
              ].map(({ icon, label, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className="flex flex-1 flex-col items-center gap-1 rounded-[10px] border border-accent/20 bg-white/80 py-2 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                >
                  <span className="text-base">{icon}</span>
                  <span className="text-[9.5px] font-semibold tracking-wide text-muted">{label}</span>
                </button>
              ))}
            </div>

            <nav className="flex-1 p-2.5">
              {NAV.map((item) => (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.hasMenu) setMobileAccordion(mobileAccordion === item.label ? null : item.label);
                      else handleNav(item);
                    }}
                    className={`mb-0.5 flex w-full items-center justify-between rounded-xl border px-3.5 py-3 font-display text-xl font-bold transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out ${
                      isActive(item)
                        ? "border-accent/30 bg-accent-soft text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                        : mobileAccordion === item.label
                          ? "border-accent/25 bg-accent-soft/80 text-accent"
                          : "border-transparent bg-transparent text-primary hover:border-accent/25 hover:bg-accent-soft/70 hover:text-accent hover:shadow-sm active:scale-[0.99]"
                    }`}
                  >
                    {item.label}
                    <span className={`text-sm text-accent/70 transition-transform ${mobileAccordion === item.label ? "rotate-90" : ""}`}>
                      {item.hasMenu ? "›" : "→"}
                    </span>
                  </button>
                  {item.hasMenu && mobileAccordion === item.label && (
                    <div className="animate-fade-in px-3.5 pb-2 pl-6">
                      {["New Arrivals", "Bestsellers", "Shop All", "Bundles"].map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleNav(item)}
                          className="block w-full border-b border-accent/10 py-1.5 text-left text-[13px] font-medium text-muted transition-[color,background-color,padding] duration-300 ease-out hover:bg-accent-soft/50 hover:pl-1 hover:text-accent"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mx-3.5 h-px bg-accent/15" />

            <div className="shrink-0 p-3.5 pb-7">
              {user ? (
                <div className="flex items-center gap-2.5 rounded-[14px] border border-accent/20 bg-accent-soft p-3">
                  <Avatar name={user.name} size={38} imageUrl={user.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold text-primary">{user.name}</div>
                    <div className="truncate text-[10.5px] text-muted">{user.email}</div>
                  </div>
                  <button type="button" onClick={() => { onLogout?.(); setMobileOpen(false); }} className="shrink-0 rounded-lg border border-accent/40 px-2.5 py-1 text-[10.5px] font-bold text-accent">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { onLoginOpen(); setMobileOpen(false); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-br from-accent-hover via-accent to-primary-light py-3.5 text-[13.5px] font-bold text-white shadow-[0_4px_16px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
                >
                  <Icons.LogIn />
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
