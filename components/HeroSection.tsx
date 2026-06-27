"use client";
import { useState, useEffect, useCallback } from "react";
import { HERO_SLIDES } from "@/lib/data";
import { tw } from "@/lib/theme";
import * as Icons from "./Icons";

const GRADIENT_CLASSES = [
  "bg-gradient-to-br from-[#1A1208] via-[#2C1E0A] to-[#0A0804]",
  "bg-gradient-to-br from-[#0A0804] via-[#2C1E0A] to-[#1A1208]",
  "bg-gradient-to-br from-[#1A1208] via-[#3C2A0A] to-[#0A0804]",
];

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setSlide(idx); setAnimating(false); }, 600);
  }, [animating]);

  useEffect(() => {
    const t = setInterval(() => go((slide + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [slide, go]);

  const s = HERO_SLIDES[slide];

  return (
    <section
      className={`relative flex min-h-screen items-center overflow-hidden transition-colors duration-800 ${GRADIENT_CLASSES[slide]}`}
    >
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={s.id}
          src={s.img}
          alt=""
          className={`h-full w-full object-cover transition-opacity duration-800 ${animating ? "opacity-0" : "opacity-25"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10" />
      </div>

      <div className="relative z-[1] mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 px-6 pt-[140px] pb-20 lg:grid-cols-2 lg:px-12">
        <div key={`${s.id}-text`} className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="block h-px w-8 bg-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              {s.eyebrow}
            </span>
          </div>

          <h1 className="mb-2 font-display text-[clamp(52px,7vw,92px)] font-bold leading-[1.02] text-white whitespace-pre-line">
            {s.title}
          </h1>
          <div className="mb-7 font-display text-[clamp(48px,6vw,80px)] font-semibold italic leading-tight text-accent">
            {s.accent}
          </div>

          <p className="mb-10 max-w-[440px] text-base leading-relaxed text-white/70">
            {s.desc}
          </p>

          <div className="flex flex-wrap gap-4">
            <button type="button" className={`${tw.btnPrimary} px-9 py-4 text-[15px]`}>
              {s.cta} <Icons.ArrowRight />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-9 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              {s.cta2}
            </button>
          </div>

          <div className="mt-13 flex gap-10">
            {[["100%", "Qatar VAT Certified"], ["12+", "Years in Qatar"], ["4.9★", "Trusted Partner"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-[22px] font-extrabold text-white">{val}</div>
                <div className="mt-0.5 text-xs text-white/55">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="relative h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] lg:h-[380px] lg:w-[380px] overflow-hidden rounded-full shadow-[0_40px_100px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)] animate-float"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`${s.id}-img`}
              // src={s.accent2}
              alt={s.title}
              className="h-full w-full object-cover animate-fade-in"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12)_0%,transparent_70%)]" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-[2] flex -translate-x-1/2 gap-2.5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            className={`h-2 rounded border-0 cursor-pointer transition-all duration-300 ${
              i === slide ? "w-8 bg-accent" : "w-2 bg-white/30"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-10 right-12 z-[2] hidden md:flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] uppercase tracking-[0.15em] text-white [writing-mode:vertical-rl]">Scroll</span>
        <div className="h-10 w-px bg-white/40" />
      </div>
    </section>
  );
}
