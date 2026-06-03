import type { Meta, StoryObj } from "@storybook/react";
import FeatureGrid from "./FeatureGrid";

const meta = {
  title: "Marketing/FeatureGrid",
  component: FeatureGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns: 3,
    items: [
      { title: "Dark-first", description: "Tokenized theme, light mode tuned for AA." },
      { title: "Charts & 3D", description: "12 canvas charts + WebGL scenes, lazy-loaded." },
      { title: "Accessible", description: "WAI-ARIA patterns, jest-axe in CI." },
      { title: "Tree-shakeable", description: "sideEffects:false + /charts /3d subpaths." },
      { title: "SSR / Next", description: "Framework-agnostic via SagtechUIProvider." },
      { title: "Dogfooded", description: "These docs are built from the library itself." },
    ],
  },
};
