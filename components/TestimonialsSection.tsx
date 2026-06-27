"use client";
import { TESTIMONIALS } from "@/lib/data";
import Avatar from "./Avatar";
import * as Icons from "./Icons";

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-24">
      <div className="pointer-events-none absolute -top-25 -right-25 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,transparent_70%)]" />

      <div className="relative z-[1] mx-auto max-w-[1200px] px-6">
        <div className="mb-16 text-center">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
            Real Stories
          </div>
          <h2 className="font-display text-[clamp(36px,4vw,56px)] font-bold leading-tight text-white">
            Trusted by Businesses,<br />
            <span className="italic text-accent">Across Qatar</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[480px] text-[15px] leading-relaxed text-white/55">
            Over 1,300 businesses rely on Skynet for POS, ERP, and IT solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className="rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="mb-5 flex gap-0.5 text-accent">
                {[1, 2, 3, 4, 5].map(j => <Icons.Star key={j} filled={j <= t.rating} />)}
              </div>

              <p className="mb-7 text-[15px] italic leading-relaxed text-white/85">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 border-t border-white/8 pt-5">
                <Avatar name={t.name} size={40} className="border-white/20" />
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="mt-0.5 text-xs text-accent">{t.role}</div>
                  <div className="mt-1 text-[11px] text-white/40">Purchased: {t.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-16">
          {[["1,300+", "Happy Clients"], ["4.9", "Average Rating"], ["99%", "Would Recommend"]].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-5xl font-bold leading-none text-accent">{val}</div>
              <div className="mt-2 text-[13px] text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
