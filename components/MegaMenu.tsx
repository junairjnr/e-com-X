"use client";
import { NAV_MENUS } from "@/lib/data";

interface MegaMenuProps {
  section: string;
  onClose: () => void;
}

export default function MegaMenu({ section, onClose }: MegaMenuProps) {
  const data = NAV_MENUS[section];
  if (!data) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr auto",
      gap: 32,
      fontFamily: "'Inter',sans-serif",
    }}>
      {/* ── Column 1 : Featured + Apparel ─────────────────── */}
      <div>
        <ColLabel>Featured</ColLabel>
        {data.featured.map(item => (
          <MenuLink key={item} onClick={onClose}>{item}</MenuLink>
        ))}
        {data.apparel.length > 0 && (
          <>
            <ColLabel style={{ marginTop: 20 }}>Services</ColLabel>
            {data.apparel.map(item => (
              <MenuLink key={item} onClick={onClose} muted>{item}</MenuLink>
            ))}
          </>
        )}
      </div>

      {/* ── Column 2 : Categories ─────────────────────────── */}
      <div>
        <ColLabel>Categories</ColLabel>
        {data.shoes.map(item => (
          <MenuLink key={item} onClick={onClose} muted>{item}</MenuLink>
        ))}
      </div>

      {/* ── Column 3 : Customer Favorites ────────────────── */}
      <div>
        {data.favorites.length > 0 && (
          <>
            <ColLabel>Customer Favorites</ColLabel>
            {data.favorites.map(item => (
              <MenuLink key={item} onClick={onClose} muted>{item}</MenuLink>
            ))}
          </>
        )}
      </div>

      {/* ── Column 4 : Image cards ────────────────────────── */}
      <div style={{ display: "flex", gap: 12 }}>
        {data.imgs.map(img => (
          <div
            key={img.label}
            onClick={onClose}
            style={{
              width: 148,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(200,155,60,0.14)",
              background: "#F7F2E8",
              cursor: "pointer",
              transition: "transform 0.25s, box-shadow 0.25s",
              boxShadow: "0 2px 8px rgba(26,18,8,0.06)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(26,18,8,0.12)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(26,18,8,0.06)";
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://images.unsplash.com/${img.url}?w=300&q=80`}
              alt={img.label}
              style={{ display: "block", width: "100%", height: 110, objectFit: "cover" }}
            />
            <div style={{ padding: "10px 12px 12px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1208" }}>{img.label}</div>
              <div style={{ marginTop: 2, fontSize: 11, fontWeight: 700, color: "#C89B3C" }}>{img.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */
function ColLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
      textTransform: "uppercase", color: "#C89B3C",
      marginBottom: 12,
      ...style,
    }}>
      {children}
    </div>
  );
}

function MenuLink({ children, onClick, muted }: { children: React.ReactNode; onClick: () => void; muted?: boolean }) {
  return (
    <a
      href="#"
      onClick={e => { e.preventDefault(); onClick(); }}
      style={{
        display: "block",
        padding: "5px 0",
        fontSize: muted ? 13 : 13.5,
        fontWeight: muted ? 400 : 600,
        color: muted ? "#6B5A44" : "#1A1208",
        textDecoration: "none",
        letterSpacing: "0.01em",
        transition: "color 0.15s",
        lineHeight: 1.5,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#C89B3C"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = muted ? "#6B5A44" : "#1A1208"; }}
    >
      {children}
    </a>
  );
}
