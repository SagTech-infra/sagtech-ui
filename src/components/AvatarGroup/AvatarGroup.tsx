"use client";

import classNames from "classnames";
import Avatar, { type AvatarProps, type AvatarSize } from "../Avatar/Avatar";

export interface AvatarGroupProps {
  /** Avatars to render, in order. */
  avatars: AvatarProps[];
  /** Maximum avatars shown before collapsing the rest into a "+N" counter. */
  max?: number;
  /** Size applied to every avatar (and the counter) unless overridden per-item. */
  size?: AvatarSize | number;
  /** Overlap between adjacent avatars, in px. Defaults to 30% of the avatar size. */
  overlap?: number;
  /** Accessible group label. */
  label?: string;
  className?: string;
}

const sizeMap = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 } as const;

function resolveDimension(size: AvatarSize | number): number {
  return typeof size === "number" ? size : sizeMap[size];
}

export default function AvatarGroup({
  avatars,
  max = 5,
  size = "md",
  overlap,
  label,
  className,
}: AvatarGroupProps) {
  const dimension = resolveDimension(size);
  const gap = overlap ?? Math.round(dimension * 0.3);
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;

  return (
    <div
      role="group"
      aria-label={label}
      className={classNames("inline-flex items-center", className)}
    >
      {visible.map((avatar, idx) => (
        <div
          key={`${avatar.src ?? avatar.name ?? "avatar"}-${idx}`}
          className="rounded-full ring-2 ring-bg-primary"
          style={{
            marginInlineStart: idx === 0 ? 0 : -gap,
            zIndex: visible.length - idx,
          }}
        >
          <Avatar {...avatar} size={avatar.size ?? size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="rounded-full ring-2 ring-bg-primary bg-black_3 text-fg-primary font-manrope font-semibold inline-flex items-center justify-center select-none flex-shrink-0"
          style={{
            width: dimension,
            height: dimension,
            marginInlineStart: -gap,
            fontSize: Math.round(dimension * 0.32),
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
