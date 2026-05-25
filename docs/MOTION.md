# Motion

Motion in `@sagtech-infra/ui` is built on three layers: CSS tokens (durations and
easings), preset variant factories, and a `useMotionPreset` hook that collapses
animation automatically when the user prefers reduced motion.

---

## 1. Motion tokens

Durations and easings are defined in `src/tokens/theme.css` inside the `@theme`
block and exposed as CSS custom properties:

```
--motion-duration-fast:       120ms
--motion-duration-normal:     200ms
--motion-duration-slow:       320ms

--motion-ease-standard:       cubic-bezier(0.4, 0, 0.2, 1)
--motion-ease-emphasized:     cubic-bezier(0.2, 0, 0, 1)
--motion-ease-decelerated:    cubic-bezier(0, 0, 0.2, 1)
```

Use these for CSS transitions inside component stylesheets or Tailwind `transition`
utilities. For framer-motion, use the JS helpers below.

### JS helpers — `src/utils/motion`

```ts
import {
  motionDurationS,
  motionEaseBezier,
  tokenTransition,
} from '@sagtech-infra/ui';
```

`motionDurationS` — durations in seconds (framer-motion numeric form):

```ts
motionDurationS.fast    // 0.12
motionDurationS.normal  // 0.2
motionDurationS.slow    // 0.32
```

`motionEaseBezier` — easing tuples (`[n, n, n, n]`):

```ts
motionEaseBezier.standard    // [0.4, 0, 0.2, 1]
motionEaseBezier.emphasized  // [0.2, 0, 0, 1]
motionEaseBezier.decelerated // [0, 0, 0.2, 1]
```

`tokenTransition(duration?, ease?)` — builds a framer-motion transition object:

```ts
// defaults: duration="normal", ease="standard"
tokenTransition()
// { duration: 0.2, ease: [0.4, 0, 0.2, 1] }

tokenTransition('slow', 'emphasized')
// { duration: 0.32, ease: [0.2, 0, 0, 1] }
```

---

## 2. Presets

Four preset factories produce framer-motion `Variants` objects with `hidden`,
`visible`, and `exit` keys.

```ts
import { fadeIn, slideUp, scaleIn, popIn } from '@sagtech-infra/ui';
import type { MotionPresetOptions } from '@sagtech-infra/ui';
```

### Available presets

| Name | `hidden` state | Notes |
|---|---|---|
| `fadeIn` | `opacity: 0` | Pure opacity fade |
| `slideUp` | `opacity: 0, y: distance` | Translates upward into view; default distance `8px` |
| `scaleIn` | `opacity: 0, scale: 0.96` | Subtle scale-up |
| `popIn` | `opacity: 0, scale: 0.9` | Larger scale-up; `"emphasized"` ease on enter by default |

All presets return:

```ts
{
  hidden: { /* initial state */ },
  visible: { /* target state */, transition: { duration, ease } },
  exit:    { /* initial state */, transition: { duration, ease } },
}
```

### `MotionPresetOptions`

| Prop | Type | Default | Description |
|---|---|---|---|
| `distance` | `number` | `8` | Travel distance in px (`slideUp`, `popIn`) |
| `duration` | `"fast" \| "normal" \| "slow" \| number` | `"normal"` | Token name or explicit seconds |
| `ease` | `"standard" \| "emphasized" \| "decelerated"` | `"standard"` | Easing token name |

### Usage with framer-motion

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { slideUp } from '@sagtech-infra/ui';

const variants = slideUp({ duration: 'fast', distance: 12 });

function Panel({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          Panel content
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 3. `useMotionPreset(name, options?)`

A hook that selects a preset by name and collapses it to an instant opacity-only
variant when `prefers-reduced-motion: reduce` is active.

```ts
import { useMotionPreset } from '@sagtech-infra/ui';
import type { MotionPresetName } from '@sagtech-infra/ui';
```

**Signature:**

```ts
function useMotionPreset(
  name: MotionPresetName,
  options?: MotionPresetOptions,
): Variants
```

`MotionPresetName` is `"fadeIn" | "slideUp" | "scaleIn" | "popIn"`.

**Example:**

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionPreset } from '@sagtech-infra/ui';

function Tooltip({ open }: { open: boolean }) {
  const variants = useMotionPreset('scaleIn', { duration: 'fast' });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="tooltip"
        >
          Tooltip text
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

When `prefers-reduced-motion: reduce` is set, the hook returns:

```ts
{
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
  exit:    { opacity: 0, transition: { duration: 0 } },
}
```

No translate, no scale, instant duration — the element still fades in/out so
focus management and `AnimatePresence` teardown work correctly.

---

## 4. Reduced motion

`useMotionPreset` handles reduced motion automatically via framer-motion's
`useReducedMotion()` hook, which reads the `prefers-reduced-motion` media query
and re-runs when the OS setting changes at runtime.

The raw preset functions (`fadeIn`, `slideUp`, `scaleIn`, `popIn`) do **not**
check `prefers-reduced-motion` by design — they are pure variant factories
suitable for server-rendered variant objects or cases where reduced-motion
handling is done at a higher level. Use `useMotionPreset` in component code.

---

## 5. Internal overlay variants

`src/motion/overlayVariants.ts` contains shared variant objects used by Popover,
Tooltip, DatePicker, and DateRangePicker:

- `directionalFadeVariants` — position-aware fade with a 4px offset
  (`top`/`bottom`/`left`/`right` keys, `initial`/`animate` states).
- `dropdownFadeSlideVariants` — fade + slight upward slide
  (`open`/`closed` keys).

These are **internal** — they are not part of the public API and not exported
from `src/index.ts`. They exist to deduplicate identical variant objects that
were previously copy-pasted across components.
