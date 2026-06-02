import type { ReactNode, Ref } from "react";
import classNames from "classnames";

export interface AspectRatioProps {
  /** Width-to-height ratio, e.g. 16 / 9 (default) or 1 for a square. */
  ratio?: number;
  /** Content stretched to fill the ratio box (image, video, iframe, etc.). */
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export default function AspectRatio({
  ratio = 16 / 9,
  children,
  className,
  ref,
}: AspectRatioProps) {
  return (
    <div
      ref={ref}
      className={classNames("relative w-full", className)}
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 h-full w-full">{children}</div>
    </div>
  );
}
