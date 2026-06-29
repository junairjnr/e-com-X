"use client";
import { useState } from "react";
import { tw } from "@/lib/theme";
import * as Icons from "./Icons";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  return (
    <section className="relative overflow-hidden bg-bg-soft py-24">
      <div className="pointer-events-none absolute -top-15 -right-15 h-[300px] w-[300px] rounded-full bg-accent/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-[250px] w-[250px] rounded-full bg-accent/8" />

      <div className="relative z-[1] mx-auto max-w-[640px] px-6 text-center">
        <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
          Stay in the Loop
        </div>
        <h2 className="mb-4 font-display text-[clamp(36px,4vw,52px)] font-bold leading-tight text-primary">
          New Arrivals. Early Access.<br />
          <span className="italic text-accent">Members First.</span>
        </h2>
        <p className="mb-10 text-[15px] leading-relaxed text-muted">
          Join 120,000+ members who get first access to new drops, exclusive offers, and product updates.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-[480px] flex-wrap gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="min-w-[200px] flex-1 rounded-full border-2 border-border bg-white px-5 py-3.5 text-sm text-primary shadow-[0_4px_20px_color-mix(in_srgb,var(--color-primary)_6%,transparent)] outline-none transition-colors focus:border-accent"
            />
            <button type="submit" className={`${tw.btnPrimary} ${loading ? "opacity-70" : ""}`} disabled={loading}>
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <><Icons.ArrowRight /> Subscribe</>
              )}
            </button>
          </form>
        ) : (
          <div className="inline-block animate-fade-up rounded-[20px] border-2 border-accent bg-white px-8 py-6 shadow-[0_8px_32px_color-mix(in_srgb,var(--color-accent)_15%,transparent)]">
            <div className="mb-2 text-2xl">🎉</div>
            <div className="text-base font-bold text-primary">You&apos;re in!</div>
            <div className="mt-1 text-[13px] text-muted">Check your inbox for a welcome gift.</div>
          </div>
        )}

        <div className="mt-4 text-xs text-muted">
          No spam. Unsubscribe anytime. Your data is yours.
        </div>
      </div>
    </section>
  );
}
