// Playwright Component Testing entry — runs once before every mounted component.
//
// Mirrors the Storybook harness (.storybook/preview.ts) so CT renders with the
// real design tokens and Tailwind utilities instead of an unstyled DOM:
//   1. `./index.css` re-exports `src/tokens/index.css` (which pulls in
//      `@import "tailwindcss"` plus every token layer) and adds an explicit
//      `@source "../src"` so component utilities (e.g. `overflow-auto`) are
//      generated, not just the token variables.
//   2. The design system is dark-only — pin `data-theme="dark"` on the root and
//      paint the canvas the same near-black the Storybook decorator uses, so
//      geometry/focus-ring assertions see production styling.
import './index.css';

document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.style.colorScheme = 'dark';
document.body.style.background = '#070715';
