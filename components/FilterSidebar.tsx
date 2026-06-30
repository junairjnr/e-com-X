"use client";
import { useState } from "react";
import { SHOP_CATEGORIES, getCategoryCount, PRICE_MAX, fmt } from "@/lib/data";
import type { FilterState } from "@/lib/types";
import { swatchBgClass } from "@/lib/theme";
import * as Icons from "./Icons";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
  resultCount: number;
  mobile?: boolean;
}

const ALL_TAGS = ["Qatar VAT Certified", "atACC ERP Ready", "Arabic Support", "Wi-Fi", "Touchscreen", "Wireless", "USB", "Cloud-based", "Android"];
const ALL_SIZES = ["In Stock", "Pre-order"];
const ALL_COLORS = [
  { name: "Black", hex: "#1A1208" },
  { name: "Silver", hex: "#E8E4DC" },
  { name: "White", hex: "#F5F0E8" },
];

const PRICE_PRESETS: { min: number; max: number; label: string }[] = [
  { min: 0, max: 500, label: "Under QAR 500" },
  { min: 500, max: 1500, label: "QAR 500 – 1,500" },
  { min: 1500, max: 3000, label: "QAR 1,500 – 3,000" },
  { min: 3000, max: PRICE_MAX, label: "QAR 3,000+" },
];

export default function FilterSidebar({ filters, onChange, onClear, resultCount, mobile }: FilterSidebarProps) {
  const [sections, setSections] = useState({ categories: true, price: true, rating: true, colors: false, sizes: false, tags: true });

  const toggle = (key: keyof typeof sections) =>
    setSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleArr = <K extends keyof FilterState>(key: K, val: string) => {
    const arr = filters[key] as string[];
    const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
    onChange({ ...filters, [key]: next });
  };

  const activeCount =
    filters.categories.length + filters.ratings.length + filters.colors.length +
    filters.sizes.length + filters.tags.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < PRICE_MAX ? 1 : 0);

  const wrapperClass = mobile
    ? "w-full"
    : "w-[260px] shrink-0";

  const stickyClass = mobile
    ? ""
    : "sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin";

  return (
    <aside className={wrapperClass}>
      <div className={stickyClass}>
        <div className="rounded-[20px] border border-border bg-white p-4 shadow-[0_4px_24px_color-mix(in_srgb,var(--color-primary)_5%,transparent)]">
          <div className="mb-4 flex items-center justify-between border-b border-bg-soft pb-3.5">
            <div>
              <div className="font-display text-[15px] font-bold text-primary">Filters</div>
              <div className="mt-0.5 text-xs text-muted">{resultCount} result{resultCount !== 1 ? "s" : ""}</div>
            </div>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-full border-0 bg-accent-soft px-2.5 py-1.5 text-[11px] font-semibold text-accent cursor-pointer whitespace-nowrap"
              >
                Clear ({activeCount})
              </button>
            )}
          </div>

          <div className="flex flex-col">
            <FilterSection title="Category" open={sections.categories} onToggle={() => toggle("categories")}>
              {SHOP_CATEGORIES.map(cat => (
                <FilterCheckbox
                  key={cat}
                  label={cat}
                  count={getCategoryCount(cat)}
                  checked={filters.categories.includes(cat)}
                  onChange={() => toggleArr("categories", cat)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Price Range" open={sections.price} onToggle={() => toggle("price")}>
              <div className="py-1 pb-2">
                <div className="mb-2.5 flex justify-between text-xs font-semibold text-primary">
                  <span>{fmt(filters.priceRange[0])}</span>
                  <span>{filters.priceRange[1] >= PRICE_MAX ? `${fmt(PRICE_MAX)}+` : fmt(filters.priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={PRICE_MAX}
                  value={filters.priceRange[1]}
                  onChange={e => onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                  className="w-full cursor-pointer accent-accent"
                />
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {PRICE_PRESETS.map(({ min, max, label }) => {
                    const active = filters.priceRange[0] === min && filters.priceRange[1] === max;
                    return (
                      <button
                        key={`${min}-${max}`}
                        type="button"
                        onClick={() => onChange({ ...filters, priceRange: [min, max] })}
                        className={`rounded-lg border-[1.5px] px-2 py-1.5 text-[10px] font-semibold cursor-pointer transition-colors ${
                          active
                            ? "border-accent bg-accent-soft text-primary"
                            : "border-border bg-bg text-primary"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Customer Rating" open={sections.rating} onToggle={() => toggle("rating")}>
              {[4, 3, 2].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleArr("ratings", String(r))}
                  className="flex w-full items-center gap-2 border-0 bg-transparent cursor-pointer py-1.5 text-left"
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                      filters.ratings.includes(String(r))
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-white"
                    }`}
                  >
                    {filters.ratings.includes(String(r)) && <Icons.Check />}
                  </div>
                  <div className="flex gap-0.5 text-accent">
                    {[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} filled={i <= r} />)}
                  </div>
                  <span className="text-[11px] text-primary">& above</span>
                </button>
              ))}
            </FilterSection>

            <FilterSection title="Color" open={sections.colors} onToggle={() => toggle("colors")}>
              <div className="flex flex-wrap gap-2 py-1 pb-2">
                {ALL_COLORS.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => toggleArr("colors", c.name)}
                    className={`h-[26px] w-[26px] rounded-full border-0 cursor-pointer transition-all ${swatchBgClass(c.hex)} ${
                      filters.colors.includes(c.name) ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Availability" open={sections.sizes} onToggle={() => toggle("sizes")}>
              <div className="flex flex-wrap gap-1.5 py-1 pb-2">
                {ALL_SIZES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleArr("sizes", s)}
                    className={`rounded-lg border-[1.5px] px-3 py-1.5 text-[11px] font-semibold cursor-pointer transition-all ${
                      filters.sizes.includes(s)
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Features" open={sections.tags} onToggle={() => toggle("tags")} last>
              {ALL_TAGS.map(t => (
                <FilterCheckbox key={t} label={t} checked={filters.tags.includes(t)} onChange={() => toggleArr("tags", t)} />
              ))}
            </FilterSection>
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterSection({ title, open, onToggle, children, last }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`py-3 ${last ? "" : "border-b border-bg-soft"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between border-0 bg-transparent cursor-pointer p-0"
      >
        <span className="font-eyebrow text-xs tracking-wide text-primary">{title}</span>
        <span className={`flex text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <Icons.ChevronDown />
        </span>
      </button>
      {open && (
        <div className="mt-2.5 animate-fade-up">
          {children}
        </div>
      )}
    </div>
  );
}

function FilterCheckbox({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center gap-2 rounded-md border-0 cursor-pointer px-1.5 py-1.5 text-left transition-colors ${
        checked ? "bg-bg-soft" : "bg-transparent"
      }`}
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${
          checked ? "border-accent bg-accent text-white" : "border-border bg-white"
        }`}
      >
        {checked && <Icons.Check />}
      </div>
      <span className={`flex-1 text-xs leading-snug ${checked ? "font-semibold text-primary" : "text-primary/80"}`}>
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] font-medium text-muted">({count})</span>
      )}
    </button>
  );
}
