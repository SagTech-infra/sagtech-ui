import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideUp } from './presets';
import { useMotionPreset, type MotionPresetName } from './useMotionPreset';

// ─── dummy root component (stories need a component in meta) ──────────────────

function PresetsRoot() {
  return null;
}

const meta = {
  title: 'Motion/Presets',
  component: PresetsRoot,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The four built-in motion presets (`fadeIn`, `slideUp`, `scaleIn`, `popIn`) return framer-motion `Variants` objects. ' +
          '`useMotionPreset(name, options?)` is a hook wrapper that respects `prefers-reduced-motion` by collapsing all presets to an instant opacity-only variant.',
      },
    },
  },
} satisfies Meta<typeof PresetsRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── helpers ──────────────────────────────────────────────────────────────────

const BOX_STYLE: React.CSSProperties = {
  width: 160,
  height: 80,
  background: 'linear-gradient(135deg, #6D3EF1, #3B5BF1)',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontFamily: 'monospace',
  fontSize: 13,
  fontWeight: 600,
  boxShadow: '0 4px 24px rgba(109,62,241,0.35)',
};

const BTN_STYLE: React.CSSProperties = {
  padding: '7px 18px',
  borderRadius: 8,
  border: 'none',
  background: '#6D3EF1',
  color: '#fff',
  cursor: 'pointer',
  fontFamily: 'monospace',
  fontSize: 13,
};

// Single preset replay demo
function PresetDemo({ name, label }: { name: MotionPresetName; label: string }) {
  const [visible, setVisible] = useState(true);
  const variants = useMotionPreset(name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ fontSize: 12, color: '#a78bfa', fontFamily: 'monospace' }}>{label}</div>
      <div style={{ height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={name}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={BOX_STYLE}
            >
              {name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        style={BTN_STYLE}
        onClick={() => {
          setVisible(false);
          setTimeout(() => setVisible(true), 80);
        }}
      >
        ↺ replay
      </button>
    </div>
  );
}

// ─── stories ──────────────────────────────────────────────────────────────────

export const AllPresets: Story = {
  name: 'All presets side-by-side',
  render: () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
      <PresetDemo name="fadeIn" label="fadeIn()" />
      <PresetDemo name="slideUp" label="slideUp()" />
      <PresetDemo name="scaleIn" label="scaleIn()" />
      <PresetDemo name="popIn" label="popIn()" />
    </div>
  ),
};

export const FadeIn: Story = {
  name: 'fadeIn',
  render: () => <PresetDemo name="fadeIn" label="opacity 0 → 1" />,
};

export const SlideUp: Story = {
  name: 'slideUp',
  render: () => <PresetDemo name="slideUp" label="opacity + translateY(8px → 0)" />,
};

export const ScaleIn: Story = {
  name: 'scaleIn',
  render: () => <PresetDemo name="scaleIn" label="opacity + scale(0.96 → 1)" />,
};

export const PopIn: Story = {
  name: 'popIn',
  render: () => <PresetDemo name="popIn" label="opacity + scale(0.9 → 1, emphasized ease)" />,
};

export const CustomOptions: Story = {
  name: 'Custom options (distance + duration)',
  render: () => {
    function Demo() {
      const [visible, setVisible] = useState(true);
      const variants = slideUp({ distance: 32, duration: 'slow' });

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#a78bfa', fontFamily: 'monospace' }}>
            slideUp({'{ distance: 32, duration: "slow" }'})
          </div>
          <div style={{ height: 96, display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              {visible && (
                <motion.div
                  key="custom"
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={BOX_STYLE}
                >
                  custom
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            style={BTN_STYLE}
            onClick={() => {
              setVisible(false);
              setTimeout(() => setVisible(true), 80);
            }}
          >
            ↺ replay
          </button>
        </div>
      );
    }
    return <Demo />;
  },
};

export const UseMotionPresetHook: Story = {
  name: 'useMotionPreset() hook (reduced-motion aware)',
  render: () => {
    const PRESETS: MotionPresetName[] = ['fadeIn', 'slideUp', 'scaleIn', 'popIn'];

    function HookDemo() {
      const [active, setActive] = useState<MotionPresetName>('fadeIn');
      const [visible, setVisible] = useState(true);
      const variants = useMotionPreset(active);

      function replay() {
        setVisible(false);
        setTimeout(() => setVisible(true), 80);
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {PRESETS.map((p) => (
              <button
                key={p}
                style={{
                  ...BTN_STYLE,
                  background: active === p ? '#6D3EF1' : 'transparent',
                  border: '1px solid',
                  borderColor: active === p ? '#6D3EF1' : '#444',
                  color: active === p ? '#fff' : '#aaa',
                }}
                onClick={() => {
                  setActive(p);
                  replay();
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <div style={{ height: 96, display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              {visible && (
                <motion.div
                  key={active}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={BOX_STYLE}
                >
                  {active}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div style={{ fontSize: 12, color: '#666', fontFamily: 'monospace' }}>
            Respects prefers-reduced-motion — collapses to instant opacity-only when enabled.
          </div>
          <button style={BTN_STYLE} onClick={replay}>↺ replay</button>
        </div>
      );
    }
    return <HookDemo />;
  },
};
