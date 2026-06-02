"use client";

import { useState } from "react";
import classNames from "classnames";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize | number;
  className?: string;
  status?: "online" | "offline" | "away";
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
} as const;

const fontSizeMap = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
} as const;

const statusDotSizeMap = {
  xs: 4,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 8,
} as const;

const statusColorMap = {
  online: "bg-success",
  offline: "bg-grey_2",
  away: "bg-warning",
} as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function DefaultUserIcon({ size }: { size: number }) {
  return (
    <svg
      width={size * 0.6}
      height={size * 0.6}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
        fill="#83838A"
      />
    </svg>
  );
}

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  className,
  status,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const isNumeric = typeof size === "number";
  const dimension = isNumeric ? size : sizeMap[size];
  const fontSize = isNumeric ? Math.round(size * 0.4) : fontSizeMap[size];
  const statusDotSize = isNumeric
    ? Math.max(4, Math.round(size * 0.15))
    : statusDotSizeMap[size];

  const showImage = src && !imgError;
  const showInitials = !showImage && name;
  const showFallbackIcon = !showImage && !name;

  return (
    <div
      className={classNames("relative inline-flex flex-shrink-0", className)}
      style={{ width: dimension, height: dimension }}
    >
      <div
        className={classNames(
          "rounded-full overflow-hidden flex items-center justify-center w-full h-full",
          {
            "bg-pr_purple": showInitials,
            "bg-black_3": showFallbackIcon,
          },
        )}
      >
        {showImage && (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {showInitials && (
          <span
            className="text-white font-semibold font-manrope leading-none select-none"
            style={{ fontSize }}
          >
            {getInitials(name)}
          </span>
        )}
        {showFallbackIcon && <DefaultUserIcon size={dimension} />}
      </div>

      {status && (
        <span
          className={classNames(
            "absolute bottom-0 right-0 rounded-full border-2 border-black_1",
            statusColorMap[status],
          )}
          style={{
            width: statusDotSize,
            height: statusDotSize,
          }}
        />
      )}
    </div>
  );
}
