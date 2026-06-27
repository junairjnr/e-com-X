"use client";

const MARQUEE_ITEMS = [
  { icon: "🖥️", text: "Qatar VAT Compliant" },
  { icon: "📊", text: "atACC ERP Integration" },
  { icon: "🔒", text: "Secure POS Software" },
  { icon: "🌐", text: "Cloud-Based Backup" },
  { icon: "📱", text: "Arabic + English UI" },
  { icon: "⚡", text: "24/7 Technical Support" },
  { icon: "🖨️", text: "All Brands Supported" },
  { icon: "💳", text: "All Payment Methods" },
];

// Duplicate for seamless infinite loop
const ALL_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function MarqueeSection() {
  return (
    <div
      className="relative overflow-hidden py-4"
      style={{
        background: "linear-gradient(90deg, #1A1208 0%, #2C1E0A 30%, #3C2A0A 60%, #2C1E0A 80%, #1A1208 100%)",
        borderTop: "1px solid rgba(200,155,60,0.25)",
        borderBottom: "1px solid rgba(200,155,60,0.25)",
      }}
    >
      {/* Left fade */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{ background: "linear-gradient(to right, #1A1208 0%, transparent 100%)" }}
      />
      {/* Right fade */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{ background: "linear-gradient(to left, #1A1208 0%, transparent 100%)" }}
      />

      {/* Scrolling strip */}
      <div className="flex w-max animate-marquee items-center">
        {ALL_ITEMS.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 whitespace-nowrap px-8"
          >
            {/* Icon */}
            <span className="text-base leading-none">{item.icon}</span>
            {/* Text */}
            <span
              className="text-[12px] font-semibold tracking-[0.06em] uppercase"
              style={{ color: "#F0D080", letterSpacing: "0.08em" }}
            >
              {item.text}
            </span>
            {/* Dot separator */}
            <span
              className="text-xs"
              style={{ color: "rgba(200,155,60,0.4)", marginLeft: 8 }}
            >
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
