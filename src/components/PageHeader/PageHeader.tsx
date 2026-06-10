"use client";

import React, { forwardRef } from "react";
import Typography from "../Typography/Typography";

export interface PageHeaderProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  ({ eyebrow, title, subtitle, actions, className, ...rest }, ref) => {
    return (
      <header
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={`flex items-start justify-between gap-24px mb-24px${className ? ` ${className}` : ""}`}
        {...rest}
      >
        <div className="flex flex-col gap-6px">
          {eyebrow && (
            <Typography tag="span" type="LabelsS" color="text-pr_purple">
              {eyebrow}
            </Typography>
          )}
          <Typography tag="h1" color="text-current">
            {title}
          </Typography>
          {subtitle && (
            <Typography tag="p" type="BodyM" color="text-current">
              {subtitle}
            </Typography>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-12px shrink-0">{actions}</div>
        )}
      </header>
    );
  },
);

PageHeader.displayName = "PageHeader";

export default PageHeader;
