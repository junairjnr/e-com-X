import type React from "react";

export const glassStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.55)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid var(--border-light)",
  boxShadow: "var(--glass-shadow)",
};

export const glassCardStyle: React.CSSProperties = {
  background: "var(--surface)",
  backdropFilter: "blur(24px) saturate(200%)",
  WebkitBackdropFilter: "blur(24px) saturate(200%)",
  border: "1px solid var(--border-light)",
  boxShadow: "var(--glass-shadow)",
};

export const clayStyle = (color = "#EEF2F9"): React.CSSProperties => ({
  background: color,
  borderRadius: 20,
  boxShadow: "0 8px 28px rgba(15, 40, 71, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
  border: "1px solid var(--border-light)",
});

export const neoStyle = (bg = "var(--bg)"): React.CSSProperties => ({
  background: bg,
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(15, 40, 71, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
  border: "1px solid var(--border-light)",
});
