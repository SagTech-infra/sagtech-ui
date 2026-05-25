// Generated from src/tokens/theme.css by scripts/generate-tokens.mjs.
// DO NOT EDIT MANUALLY. Re-run `node scripts/generate-tokens.mjs` after changing theme.css.

export const colors = {
  black_1: "#070715",
  black_1_5: "#1b1b27",
  black_2: "#20202d",
  black_3: "#393944",
  black_4: "#51515b",
  grey_1: "#6a6a73",
  grey_2: "#83838a",
  grey_3: "#9c9ca1",
  grey_4: "#b5b5b9",
  white_1: "#cdcdd0",
  white_2: "#e6e6e8",
  white_3: "#f3f3f3",
  white_4: "#f8f8f8",
  white: "#ffffff",
  pr_purple: "#6d3ef1",
  sec_purple: "#b69ff8",
  pr_blue: "#292a94",
  sec_blue: "#9494c9",
  error: "#992d2d",
  warning: "#c6a328",
  success: "#58a61b",
  shape_stroke_1_part_one: "#0c0c1e",
  shape_stroke_1_part_two: "#221546",
  shape_stroke_2_part_one: "#1f1f38",
  shape_stroke_2_part_two: "#2f1e5e",
  backdrop: "rgba(0, 0, 0, 0.56)",
  backdrop_2: "rgba(255, 255, 255, 0.04)",
  back_load: "rgba(7, 7, 15, 0.05)",
} as const;

export const fonts = {
  orbitron: "var(--font-orbitron), serif",
  roboto: "var(--font-roboto), serif",
  manrope: "var(--font-manrope), serif",
} as const;

export const textSizes = {
  '64': "64px",
  '48': "48px",
  '40': "40px",
  '32': "32px",
  '28': "28px",
  '18': "18px",
  '16': "16px",
  '14': "14px",
  '12': "12px",
  '10': "10px",
} as const;

export const leading = {
  '80': "80px",
  '64': "64px",
  '56': "56px",
  '48': "48px",
  '40': "40px",
  '36': "36px",
  '32': "32px",
  '28': "28px",
  '24': "24px",
  '18': "18px",
  '16': "16px",
} as const;

export const spacing = {
  '0px': "0px",
  '4px': "4px",
  '6px': "6px",
  '7px': "7px",
  '8px': "8px",
  '10px': "10px",
  '11px': "11px",
  '12px': "12px",
  '15px': "15px",
  '16px': "16px",
  '20px': "20px",
  '23px': "23px",
  '24px': "24px",
  '30px': "30px",
  '32px': "32px",
  '40px': "40px",
  '48px': "48px",
  '52px': "52px",
  '56px': "56px",
  '60px': "60px",
  '62px': "62px",
  '64px': "64px",
  '72px': "72px",
  '88px': "88px",
  '117px': "117px",
  '157px': "157px",
} as const;

export const breakpoints = {
  ls: "320px",
  es: "380px",
  xs: "500px",
  mds: "600px",
  sm: "768px",
  sl: "1025px",
  xl: "1024px",
  md: "1100px",
  lg: "1300px",
  '2xl': "1440px",
  xh: "1600px",
  '3xl': "1920px",
} as const;

export const shadows = {
  '3xl': "0px 0px 16px 0px rgba(109, 62, 241, 0.24)",
  '4xl': "0px -8px 24px 0px rgba(255, 255, 255, 0.04)",
  '5xl': "0px 0px 4px 0px rgba(109, 62, 241, 0.64)",
  '6xl': "0px 0px 16px rgba(109, 62, 241, 0.56)",
  'glow-purple': "0 0 24px rgba(109, 62, 241, 0.2)",
  'elevate-md': "0 18px 36px rgba(0, 0, 0, 0.55)",
  'elevate-lg': "0 24px 64px rgba(0, 0, 0, 0.5)",
} as const;

export const dropShadows = {
  '3xl': "-1px 1px 1px rgba(17, 17, 30, 1)",
} as const;

export const radius = {
  circle: "50px",
  '40px': "40px",
  '24px': "24px",
  '18px': "18px",
  '16px': "16px",
  '14px': "14px",
  '12px': "12px",
  '10px': "10px",
  '8px': "8px",
  halfRound: "40px 40px 0px 0px",
} as const;

export const borderWidths = {
  '1': "1px",
  '2': "2px",
  '5': "5px",
  '6': "6px",
} as const;

export const zIndex = {
  '5': "5",
  '10': "10",
  '20': "20",
  '30': "30",
  '40': "40",
  '50': "50",
  dropdown: "1000",
  popover: "2000",
  'modal-backdrop': "3000",
  modal: "3001",
  'drawer-backdrop': "4000",
  drawer: "4001",
  banner: "4500",
  toast: "5000",
  tooltip: "6000",
} as const;

export const inset = {
  '0px': "0px",
  '8px': "8px",
  '24px': "24px",
  '43px': "43px",
  '70px': "70px",
} as const;

export const aspect = {
  '204': "204",
  '240': "240",
  '258': "258",
  '288': "288",
  '327': "327",
  '339': "339",
  '343': "343",
  '384': "384",
  '528': "528",
  '704': "704",
} as const;

export const motionDuration = {
  fast: "120ms",
  normal: "200ms",
  slow: "320ms",
} as const;

export const motionEase = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  decelerated: "cubic-bezier(0, 0, 0.2, 1)",
} as const;


export type ColorToken = keyof typeof colors;
export type FontToken = keyof typeof fonts;
export type TextSizeToken = keyof typeof textSizes;
export type SpacingToken = keyof typeof spacing;
export type BreakpointToken = keyof typeof breakpoints;
export type RadiusToken = keyof typeof radius;
export type ShadowToken = keyof typeof shadows;
export type ZIndexToken = keyof typeof zIndex;
export type MotionDurationToken = keyof typeof motionDuration;
export type MotionEaseToken = keyof typeof motionEase;
