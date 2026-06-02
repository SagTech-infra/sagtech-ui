"use client";

import classNames from "classnames";
import React, { forwardRef, type CSSProperties } from "react";

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Tag to render; defaults to `span`. */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * Inline `sr-only` clip styles: keeps content in the accessibility tree for
 * screen readers while removing it from the visual layout. Inlined (rather than
 * a Tailwind utility) so the primitive works in consumers that have not loaded
 * a `sr-only` utility class.
 */
const hiddenStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
};

const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Tag = "span", className, style, children, ...rest }, ref) => {
    // Render via createElement: with the polymorphic `as` typed as
    // React.ElementType, JSX would intersect every intrinsic (incl. r3f's
    // ThreeElements) and collapse `children` to `never`. createElement sidesteps
    // that intrinsic-union resolution.
    return React.createElement(
      Tag,
      {
        ref,
        className: classNames(className),
        style: { ...hiddenStyle, ...style },
        ...rest,
      },
      children,
    );
  },
);

VisuallyHidden.displayName = "VisuallyHidden";

export default VisuallyHidden;
