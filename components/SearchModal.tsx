"use client";
import { useState, useEffect, useRef } from "react";
import { PRODUCTS, fmt } from "@/lib/data";
import { tw } from "@/lib/theme";
import * as Icons from "./Icons";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = query.length > 1
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 backdrop-blur-md px-4 pt-20 pb-4 animate-fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`${tw.glassCard} w-full max-w-[640px] overflow-hidden rounded-3xl`}
      >
        <div className="flex items-center gap-3 border-b border-black/6 px-6 py-5">
          <Icons.Search />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search POS systems, printers, software..."
            className="flex-1 border-0 bg-transparent text-base text-primary outline-none"
          />
          <button type="button" onClick={onClose} className="border-0 bg-transparent p-1 text-muted cursor-pointer">
            <Icons.X />
          </button>
        </div>

        {query.length > 1 && (
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {results.length === 0 ? (
              <div className="p-8 text-center text-muted">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : results.map(p => (
              <div
                key={p.id}
                className="flex gap-4 border-b border-black/5 px-6 py-4 cursor-pointer transition-colors hover:bg-black/3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt={p.name} className="h-14 w-14 rounded-xl object-cover bg-bg-soft" />
                <div>
                  <div className="text-[15px] font-semibold text-primary">{p.name}</div>
                  <div className="mt-0.5 text-[13px] text-muted">{p.tags.join(" · ")}</div>
                  <div className="mt-1 text-sm font-bold text-accent">{fmt(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.length === 0 && (
          <div className="px-6 py-5">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Popular Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {["POS Systems", "Thermal Printer", "atACC ERP", "Barcode Scanner", "New Arrivals", "Bestsellers"].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-bg px-4 py-2 text-[13px] font-medium text-primary cursor-pointer shadow-[2px_2px_6px_rgba(15,40,71,0.06),-2px_-2px_6px_rgba(255,255,255,0.9)] hover:border-accent hover:text-accent transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
