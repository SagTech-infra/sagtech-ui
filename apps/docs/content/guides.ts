// Narrative guides rendered from the library's existing /docs markdown files.

export interface Guide {
  slug: string;
  title: string;
  /** File name under the repo-root docs/ directory. */
  file: string;
  description: string;
}

export const guides: Guide[] = [
  {
    slug: 'theming',
    title: 'Theming',
    file: 'THEMING.md',
    description: 'Dark/light themes, token mapping, custom themes.',
  },
  {
    slug: 'motion',
    title: 'Motion',
    file: 'MOTION.md',
    description: 'Motion tokens, presets, reduced-motion handling.',
  },
  {
    slug: 'i18n',
    title: 'Internationalization',
    file: 'I18N.md',
    description: 'LocaleProvider, Intl-based dates, RTL support.',
  },
  {
    slug: 'component-picker',
    title: 'Component Picker',
    file: 'COMPONENT_PICKER.md',
    description: 'Decision trees for choosing between similar components.',
  },
  {
    slug: 'migration',
    title: 'Migration',
    file: 'MIGRATION.md',
    description: 'Breaking changes per version with codemods.',
  },
];

export const getGuide = (slug: string): Guide | undefined =>
  guides.find((g) => g.slug === slug);
