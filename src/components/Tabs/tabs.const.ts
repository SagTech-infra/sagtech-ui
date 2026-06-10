"use client";

/** Shared Tailwind class strings for tab triggers */
export const TRIGGER_BASE =
  "leading-24 flex justify-center items-center text-14 px-16px py-7px rounded-circle transition-all duration-200 font-manrope cursor-pointer border border-solid";

export const TRIGGER_ACTIVE = "bg-pr_purple border-pr_purple text-white";

export const TRIGGER_INACTIVE =
  "border-grey_4 text-fg-muted hover:border-white_4 hover:text-fg-primary";

export const TRIGGER_DISABLED =
  "border-grey_4 text-fg-muted opacity-40 cursor-not-allowed pointer-events-none";
