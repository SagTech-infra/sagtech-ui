import type { Preview } from "@storybook/react";
import "../src/tokens/index.css";

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true }, // background follows the theme decorator
    controls: { expanded: true },
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Foundations",
          "Form Controls",
          "Layout",
          "Overlays",
          "Data Display",
          "Charts",
          "3D",
          "Feedback",
          "Providers",
          "*",
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "light", title: "Light", icon: "sun" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "light" ? "light" : "dark";
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      root.style.colorScheme = theme;
      document.body.style.background =
        theme === "light" ? "#f7f7fa" : "#070715";
      return Story();
    },
  ],
};

export default preview;
