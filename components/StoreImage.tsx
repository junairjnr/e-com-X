"use client";

import { useState, useEffect } from "react";
import { IMAGE_FALLBACK } from "@/lib/images";

interface StoreImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: string;
  draggable?: boolean;
  "aria-hidden"?: boolean;
}

/** Image with local fallback — no external CDN dependency at runtime */
export default function StoreImage({
  src,
  alt,
  className = "",
  style,
  fallback = IMAGE_FALLBACK,
  draggable,
  "aria-hidden": ariaHidden,
}: StoreImageProps) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      aria-hidden={ariaHidden}
      draggable={draggable}
      className={className}
      style={style}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
