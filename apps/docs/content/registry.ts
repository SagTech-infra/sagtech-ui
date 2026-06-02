// Single source of truth for the component catalogue: drives the sidebar nav,
// the command-palette search, and static param generation for component pages.
// Per-component prose (descriptions) and live examples live next to each
// component under demos/<Name>/ so this file stays a stable index.

export type Category =
  | 'Foundations'
  | 'Form Controls'
  | 'Layout'
  | 'Data Display'
  | 'Charts'
  | '3D'
  | 'Feedback';

export interface ComponentEntry {
  name: string;
  slug: string;
  category: Category;
  /** Library import subpath. Charts/3D also ship from additive subpaths. */
  importPath: '@sagtech-infra/ui' | '@sagtech-infra/ui/charts' | '@sagtech-infra/ui/3d';
}

/** Deterministic kebab slug: AvatarGroup -> avatar-group, Network3D -> network-3d. */
export function toSlug(name: string): string {
  return name
    .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([0-9])([A-Za-z])/g, '$1-$2')
    .toLowerCase();
}

const GROUPS: Record<Category, string[]> = {
  Foundations: ['Typography', 'Icon', 'Skeleton', 'Divider', 'KBD'],
  'Form Controls': [
    'Button', 'Input', 'TextArea', 'Checkbox', 'SearchBar', 'Toggle', 'Switch',
    'Slider', 'ColorPicker', 'Attachment', 'PhoneInput', 'SelectInput', 'Combobox',
    'Form', 'RadioGroup', 'DatePicker', 'DateRangePicker', 'TimePicker', 'Dropzone',
    'FileDropzone', 'DropdownMenu', 'TagInput', 'SegmentedControl', 'FaqDropdown',
    'FaqList', 'InfoTabs', 'Timeline',
  ],
  Layout: [
    'Carousel', 'PanelGroup', 'Modal', 'Confirm', 'CardWrapper', 'Container',
    'SectionTag', 'Sidebar', 'Wizard', 'Breadcrumbs', 'Drawer', 'CommandPalette',
    'VariablePicker', 'Sheet', 'BottomSheet', 'FAB', 'Toolbar', 'Stack', 'Inline',
    'PageHeader',
  ],
  'Data Display': [
    'Avatar', 'AvatarGroup', 'TreeView', 'Calendar', 'AvatarCard', 'ResultPill',
    'Rate', 'Point', 'Steps', 'Image', 'LazyImage', 'Badge', 'Tooltip', 'Popover',
    'Tabs', 'Table', 'DataTable', 'SortableList', 'VirtualList', 'InlineEdit',
    'CodeBlock', 'RichTextEditor', 'VisualGraphEditor', 'JsonView', 'GanttTimeline',
    'Pagination', 'StatCard', 'Stepper',
  ],
  Charts: [
    'AreaChart', 'BarChart', 'LineChart', 'DonutChart', 'HeatmapChart', 'RadarChart',
    'SparklineChart', 'ScatterChart', 'GaugeChart', 'SankeyChart', 'TreemapChart',
    'FunnelChart',
  ],
  '3D': ['Network3D', 'Globe3D', 'Scene3D', 'Mindmap3D'],
  Feedback: [
    'EmptyState', 'Alert', 'ProgressBar', 'AnimationButton', 'CookieBanner',
    'NotificationCenter', 'Toast', 'Banner', 'Spotlight', 'NumberTicker',
    'TypingAnimation', 'Particles',
  ],
};

const importPathFor = (category: Category): ComponentEntry['importPath'] =>
  category === 'Charts'
    ? '@sagtech-infra/ui/charts'
    : category === '3D'
      ? '@sagtech-infra/ui/3d'
      : '@sagtech-infra/ui';

export const categories = Object.keys(GROUPS) as Category[];

export const components: ComponentEntry[] = categories.flatMap((category) =>
  GROUPS[category].map((name) => ({
    name,
    slug: toSlug(name),
    category,
    importPath: importPathFor(category),
  })),
);

export const getComponent = (slug: string): ComponentEntry | undefined =>
  components.find((c) => c.slug === slug);

export const componentsByCategory = (category: Category): ComponentEntry[] =>
  components.filter((c) => c.category === category);
