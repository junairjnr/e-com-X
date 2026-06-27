"use client";
import { getAvatarColor, getInitials } from "@/lib/avatars";

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
  imageUrl?: string;
  className?: string;
}

export default function Avatar({ name, size = 36, color, imageUrl, className = "" }: AvatarProps) {
  const bg = color ?? getAvatarColor(name);
  const fontSize = Math.max(10, Math.round(size * 0.36));
  const baseClass = `shrink-0 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] ${className}`;

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className={`object-cover ${baseClass}`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`flex items-center justify-center font-bold tracking-wide text-white ${baseClass}`}
      style={{ width: size, height: size, fontSize, background: bg }}
    >
      {getInitials(name)}
    </div>
  );
}
