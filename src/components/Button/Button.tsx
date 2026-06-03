"use client";

import React, { forwardRef, useMemo } from "react";
import type {
  MouseEventHandler,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from "react";
import { Icon } from "@/components/Icon/Icon";
import type { VariantTypoTagsStyles } from "@/components/Typography/types";
import Typography from "@/components/Typography/Typography";
import useButtonStyles from "./useButtonStyles";

export interface ButtonTypes extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  loadingType?: boolean;
  text?: string;
  buttonSize?: "small" | "large" | "tabSize";
  variant?: "primary" | "secondary" | "danger" | "tabButton" | "tabButtonWhite";
  useIcon?: boolean;
  stateOfButton?: "default" | "active";
  classes?: string;
  hoverOff?: boolean;
  changeColor?: boolean;
  children?: React.ReactNode;
  typeText?: VariantTypoTagsStyles;
  onClick?: MouseEventHandler;
  shape?: "default" | "pill";
  iconOnly?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonTypes>(function Button(
  {
    text,
    disabled,
    buttonSize = "large",
    loadingType,
    classes,
    variant,
    useIcon,
    stateOfButton = "default",
    hoverOff,
    children,
    changeColor,
    typeText = "Buttons",
    onClick,
    type = "button",
    shape = "default",
    iconOnly = false,
    ...rest
  },
  ref,
) {
  const buttonClasses = useButtonStyles({
    variant,
    stateOfButton,
    disabled,
    loadingType,
    changeColor,
    buttonSize,
    hoverOff,
  });

  const iconComponent = useMemo(() => {
    if (useIcon) {
      return <Icon icon="arrow" size={buttonSize === "small" ? 18 : 24} />;
    }
    return null;
  }, [useIcon, buttonSize]);

  if (iconOnly && !rest["aria-label"]) {
    const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } })
      .process?.env?.NODE_ENV;
    if (env !== "production") {
      console.warn(
        "@sagtech-infra/ui Button: iconOnly requires aria-label for accessibility",
      );
    }
  }

  const shapeClass = shape === "pill" ? "rounded-full" : "";
  const iconOnlyClass = iconOnly ? "aspect-square !px-8px" : "";

  return (
    <button
      ref={ref}
      type={type}
      className={`${classes ?? ""} ${buttonClasses} ${shapeClass} ${iconOnlyClass}`.trim()}
      disabled={disabled || loadingType}
      aria-busy={loadingType || undefined}
      aria-disabled={disabled || loadingType || undefined}
      onClick={onClick}
      {...rest}
    >
      {children}
      {loadingType && (
        <svg
          className="animate-spin"
          width={buttonSize === "small" ? 16 : 20}
          height={buttonSize === "small" ? 16 : 20}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.3"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {iconComponent}
      {text && (
        <Typography
          type={typeText}
          // Secondary is an outline variant on a transparent background, so its
          // label must follow the (theme-aware) button text color rather than a
          // hardcoded white — otherwise it is invisible on light surfaces.
          // `text-current` makes the label inherit the button's own text color.
          color={variant === "secondary" ? "text-current" : "text-white"}
          className="hidde-paragraph"
        >
          {text}
        </Typography>
      )}
    </button>
  );
});

export default Button;
