"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "./Icons";
import type { CartItem, WishlistItem, StoreUser } from "@/lib/types";
import Avatar from "./Avatar";
import { useClientTheme } from "./ThemeProvider";
import { HERO_CATEGORY_STRIP } from "@/lib/data";

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

const NAV_LINKS = [
  { label: "Products", page: "shop" },
  { label: "Solutions", page: "shop" },
  { label: "Deals", page: "shop" },
  { label: "Support", page: "support" },
  { label: "Orders", page: "orders" },
];

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

export default function Header({
  cart, wishlist,
  onCartOpen, onWishlistOpen, onSearchOpen, onLoginOpen, onLogout,
  user, setPage, onNavigateHome,
}: HeaderProps) {
  const { client } = useClientTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const [catVisible, setCatVisible] = useState(true);

  const [hintIdx, setHintIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

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

  useEffect(() => {
    // Heights: full = outer pt-3 + top-bar + category strip, compact = outer pt-3 + top-bar
    const setH = (full: boolean) => {
      document.documentElement.style.setProperty(
        "--header-height",
        full ? "120px" : "64px"
      );
    };

    const fn = () => {
      const y = window.scrollY;
      if (y <= 10) {
        setScrolled(false);
        setCatVisible(true);
        setH(true);
      } else {
        setScrolled(true);
        if (y > lastScrollY.current + 4) {
          setCatVisible(false);
          setH(false);
        } else if (y < lastScrollY.current - 4) {
          setCatVisible(true);
          setH(true);
        }
      }
      lastScrollY.current = y;
    };

    // Set initial
    setH(true);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", mobileOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);


  return (
    <>
      {/* ════════════════════════════════════════
          MAIN HEADER — floating pill style
      ════════════════════════════════════════ */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[150] px-2 pt-2 sm:px-3 sm:pt-3 md:px-5"
        style={{ paddingBottom: 0 }}
      >
        <motion.div
          className="mx-auto max-w-[1440px] overflow-hidden"
          animate={{
            boxShadow: scrolled
              ? "0 12px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.14)"
              : "0 4px 20px rgba(0,0,0,0.18), 0 1px 6px rgba(0,0,0,0.10)",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(135deg, #111827 0%, #1F2937 55%, #374151 100%)",
            borderRadius: "20px",
          }}
        >
          {/* ── Top bar ── */}
          <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 md:gap-4 md:px-6">

            {/* Logo */}
            <motion.button
              type="button"
              onClick={onNavigateHome}
              className="flex shrink-0 cursor-pointer flex-col items-start border-0 bg-transparent p-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="font-display text-[18px] font-extrabold leading-none tracking-tight text-white sm:text-[20px] md:text-[22px]">
                {client.name.split(" ")[0]}
                <span className="text-[11px] font-black text-slate-300 sm:text-[13px]">™</span>
              </span>
              <span className="hidden font-eyebrow text-[7.5px] tracking-[0.22em] text-slate-400/75 sm:block">
                {client.tagline}
              </span>
            </motion.button>

            {/* Search bar */}
            <motion.button
              type="button"
              onClick={onSearchOpen}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-left shadow-sm sm:gap-3 sm:px-4"
              whileHover={{ scale: 1.005, boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}
              whileTap={{ scale: 0.998 }}
              aria-label={`Search for ${SEARCH_CATEGORIES[hintIdx]}`}
            >
              <span className="shrink-0 text-muted">
                <Icons.Search />
              </span>
              <span className="hidden min-w-0 flex-1 items-center text-[11px] text-muted min-[480px]:flex sm:text-xs">
                <span className="shrink-0">Search for</span>
                <span className="relative ml-1 inline-block w-[90px] shrink-0 overflow-hidden sm:w-[120px] xl:w-[148px]">
                  <span
                    className={`block truncate font-medium text-accent transition-opacity duration-500 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
                  >
                    &quot;{SEARCH_CATEGORIES[hintIdx]}&quot;
                  </span>
                </span>
              </span>
              <span className="flex-1 text-[11px] text-gray-400 min-[480px]:hidden">
                Search…
              </span>
            </motion.button>

            {/* Desktop actions */}
            <div className="flex shrink-0 items-center gap-1">
              {/* Login */}
              <motion.button
                type="button"
                onClick={onLoginOpen}
                className="hidden items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 font-label text-[12.5px] font-bold text-white backdrop-blur-sm md:flex"
                whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {user ? (
                  <>
                    <Avatar name={user.name} size={18} imageUrl={user.avatarUrl} className="border-0 shadow-none" />
                    <span className="hidden md:inline">{user.name.split(" ")[0]}</span>
                  </>
                ) : (
                  <>
                    <Icons.User />
                    <span className="hidden md:inline">Login</span>
                  </>
                )}
              </motion.button>

              {/* Wishlist */}
              <motion.button
                type="button"
                onClick={onWishlistOpen}
                className="relative hidden items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 font-label text-[12.5px] font-bold text-white backdrop-blur-sm md:flex"
                whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icons.Heart filled={wishlist.length > 0} />
                <span className="hidden lg:inline">Wishlist</span>
                <AnimatePresence>
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow"
                    >
                      {wishlist.length > 9 ? "9+" : wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Cart */}
              <motion.button
                type="button"
                onClick={onCartOpen}
                className="relative hidden items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2.5 py-2 font-label text-[12.5px] font-bold text-white backdrop-blur-sm sm:flex sm:px-3.5"
                whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icons.Bag />
                <span className="hidden lg:inline">Cart</span>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* More */}
              <motion.button
                type="button"
                onClick={() => setPage("shop")}
                className="hidden items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 font-label text-[12.5px] font-bold text-white backdrop-blur-sm lg:flex"
                whileHover={{ background: "rgba(255,255,255,0.2)", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                More <Icons.ChevronDown />
              </motion.button>

              {/* Mobile cart btn — visible only on very small screens */}
              <motion.button
                type="button"
                onClick={onCartOpen}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white sm:hidden"
                whileHover={{ background: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.93 }}
                aria-label="Cart"
              >
                <Icons.Bag />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile menu btn */}
              <motion.button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white md:hidden"
                whileHover={{ background: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.93 }}
                aria-label="Open menu"
              >
                <Icons.Menu />
              </motion.button>
            </div>
          </div>

          {/* ── Category strip — hides on scroll down ── */}
          <motion.div
            className="overflow-hidden border-t border-white/10 bg-white"
            animate={{
              height: catVisible ? "auto" : 0,
              opacity: catVisible ? 1 : 0,
            }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative mx-auto max-w-[1440px]">
              <div
                ref={catRef}
                className="flex items-center overflow-x-auto scroll-smooth scrollbar-hide px-4 md:px-8"
              >
                {HERO_CATEGORY_STRIP.map((cat, i) => (
                  <motion.button
                    key={`${cat.label}-${i}`}
                    type="button"
                    onClick={() => setPage("shop")}
                    className="group flex shrink-0 flex-col items-center gap-0.5 border-0 bg-transparent px-2.5 py-1.5 md:px-3"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-gray-100 bg-gray-50 shadow-sm transition-all duration-200 group-hover:border-slate-300 group-hover:shadow-md md:h-8 md:w-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cat.img}
                        alt={cat.label}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span className="whitespace-nowrap font-label text-[8px] font-semibold text-gray-700 transition-colors group-hover:text-slate-900 md:text-[9px]">
                      {cat.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed bottom-0 left-0 top-0 z-[310] flex w-[min(300px,85vw)] flex-col overflow-y-auto bg-white"
              style={{ boxShadow: "4px 0 40px rgba(0,0,0,0.18)", borderRadius: "0 24px 24px 0" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ background: "linear-gradient(135deg, #111827 0%, #1F2937 55%, #374151 100%)" }}
              >
                <div>
                  <div className="font-display text-lg font-extrabold text-white">
                    {client.name.split(" ")[0]}<span className="text-slate-300 text-sm">™</span>
                  </div>
                  <div className="font-eyebrow text-[7.5px] tracking-widest text-slate-400/70">{client.tagline}</div>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white"
                  whileTap={{ scale: 0.9 }}
                >
                  <Icons.X />
                </motion.button>
              </div>

              {/* Quick action grid */}
              <div className="grid grid-cols-3 gap-2 border-b border-gray-100 p-4">
                {[
                  { icon: <Icons.Search />, label: "Search", fn: () => { onSearchOpen(); setMobileOpen(false); } },
                  { icon: <Icons.Heart filled={wishlist.length > 0} />, label: `Wishlist${wishlist.length > 0 ? ` (${wishlist.length})` : ""}`, fn: () => { onWishlistOpen(); setMobileOpen(false); } },
                  { icon: <Icons.Bag />, label: `Cart${cartCount > 0 ? ` (${cartCount})` : ""}`, fn: () => { onCartOpen(); setMobileOpen(false); } },
                ].map(({ icon, label, fn }) => (
                  <motion.button
                    key={label}
                    type="button"
                    onClick={fn}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-gray-100 bg-gray-50 py-3 text-gray-700"
                    whileHover={{ background: "#f3f4f6", borderColor: "#d1d5db" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-[18px]">{icon}</span>
                    <span className="text-[9.5px] font-semibold leading-tight text-center">{label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Nav */}
              <nav className="flex-1 p-4">
                <p className="mb-2 px-1 font-eyebrow text-[9px] text-gray-400">NAVIGATION</p>
                {NAV_LINKS.map(item => (
                  <motion.button
                    key={item.label}
                    type="button"
                    onClick={() => { setPage(item.page); setMobileOpen(false); }}
                    className="mb-1 flex w-full items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-left font-label text-[14px] font-semibold text-gray-800"
                    whileHover={{ background: "#f3f4f6", borderColor: "#e5e7eb", color: "#111827" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                    <span className="text-gray-500 text-sm">›</span>
                  </motion.button>
                ))}
              </nav>

              {/* User section */}
              <div className="border-t border-gray-100 p-4 pb-8">
                {user ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <Avatar name={user.name} size={40} imageUrl={user.avatarUrl} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-label text-[13px] font-bold text-gray-900">{user.name}</div>
                      <div className="truncate font-label text-[10.5px] text-gray-500">{user.email}</div>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => { onLogout?.(); setMobileOpen(false); }}
                      className="shrink-0 rounded-xl border border-gray-300 px-3 py-1.5 font-label text-[11px] font-bold text-gray-700"
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Out
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => { onLoginOpen(); setMobileOpen(false); }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-label text-[13.5px] font-bold text-white shadow"
                    style={{ background: "linear-gradient(135deg, #111827, #374151)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icons.LogIn />
                    Sign In / Register
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
