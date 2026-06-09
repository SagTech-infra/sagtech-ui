// Design tokens (typed constants)
export * as tokens from "./tokens/tokens";
export type {
  ColorToken,
  FontToken,
  TextSizeToken,
  SpacingToken,
  BreakpointToken,
  RadiusToken,
  ShadowToken,
  ZIndexToken,
} from "./tokens/tokens";

// Providers
export {
  SagtechUIProvider,
  UIComponentsContext,
  useImageComponent,
  useLinkComponent,
  DefaultImageShim,
  DefaultLinkShim,
  ThemeProvider,
  ThemeScript,
  ThemeContext,
  useTheme,
  LocaleProvider,
  LocaleContext,
  useLocale,
} from "./providers";
export type {
  SagtechUIProviderProps,
  UIComponentsContextValue,
  UIImageComponent,
  UIImageProps,
  UILinkComponent,
  UILinkProps,
  ThemeProviderProps,
  ThemeScriptProps,
  Theme,
  ResolvedTheme,
  ThemeContextValue,
  LocaleProviderProps,
  Direction,
  LocaleContextValue,
} from "./providers";

// Hooks
export {
  useWindowSize,
  useDeviceType,
  useIntersectionObserver,
  useOutsideClick,
  useModals,
  useStatusColor,
  useRovingTabindex,
  useTypeahead,
  useThemeColors,
} from "./hooks";
export type {
  StatusMeta,
  StatusTone,
  UseRovingTabindexOptions,
  UseRovingTabindexResult,
  UseTypeaheadOptions,
  UseTypeaheadResult,
  UseThemeColorsResult,
  ThemeColorRecord,
} from "./hooks";

// Utils
export {
  getCurrencySymbol,
  formatSalary,
  calculateQuarters,
  formatDate,
  getCompanyAge,
  formatRelativeTime,
  formatAbsoluteTime,
  detectCountryByTimezone,
  detectCountryByLanguage,
  detectCountry,
  scrollToAnchor,
  hideDocumentScroll,
  getWindowScrollTop,
  validateEmail,
  validateLink,
  validatePhone,
  Portal,
  mergeRefs,
} from "./utils";

// Motion presets
export {
  fadeIn,
  slideUp,
  scaleIn,
  popIn,
  useMotionPreset,
} from "./motion";
export type { MotionPresetOptions, MotionPresetName } from "./motion";

// Components — Foundations

/** Render any text with design-system styles. Use instead of raw <p>/<h1>-<h6>/<span>. Types: H1–H6, Body1–Body3, Caption, Buttons, Label, Code. */
export { default as Typography } from "./components/Typography/Typography";
export type { TypographyTypes } from "./components/Typography/Typography";
export type {
  VariantTypoTags,
  VariantTypoTagsStyles,
  VariantTypoColors,
} from "./components/Typography/types";

/** Render a design-system icon by name. Use IAvailableIcons type to enumerate available icon names. */
export { Icon } from "./components/Icon/Icon";

/** Base skeleton shimmer. Prefer presets: SkeletonText, SkeletonCard, SkeletonTable, SkeletonList, SkeletonAvatar. */
export { default as Skeleton } from "./components/Skeleton/Skeleton";
/** Loading placeholder for text blocks. Use instead of building custom shimmer UI. */
export {
  SkeletonText,
  /** Loading placeholder shaped like an avatar circle. */
  SkeletonAvatar,
  /** Loading placeholder shaped like a content card. */
  SkeletonCard,
  /** Loading placeholder for a data table. */
  SkeletonTable,
  /** Loading placeholder for a list of rows. */
  SkeletonList,
} from "./components/Skeleton/presets";
export type {
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonCardProps,
  SkeletonTableProps,
  SkeletonListProps,
} from "./components/Skeleton/presets";

/** Horizontal or vertical separator line. */
export { default as Divider } from "./components/Divider/Divider";

/** Keyboard shortcut display, e.g. <KBD>⌘K</KBD>. */
export { default as KBD } from "./components/KBD/KBD";
export type { KBDProps, KBDSize } from "./components/KBD/KBD";

/** Visually hidden text for screen readers. Use for accessible labels that should not be visible. */
export { default as VisuallyHidden } from "./components/VisuallyHidden/VisuallyHidden";
export type { VisuallyHiddenProps } from "./components/VisuallyHidden/VisuallyHidden";

// Components — Form Controls

/** Primary action element. Use instead of raw <button>. Variants: primary | secondary | danger | tabButton. Props: buttonSize, loadingType, shape (pill), iconOnly. */
export { default as Button } from "./components/Button/Button";
export type { ButtonTypes } from "./components/Button/Button";

/** Single-line text input. Pair with Form + FormField for validation. */
export { default as Input } from "./components/Input/Input";

/** Multi-line text input. Pair with Form + FormField for validation. */
export { TextArea } from "./components/TextArea/TextArea";

/** Checkbox with label. */
export { default as Checkbox } from "./components/Checkbox/Checkbox";

/** Search field with icon and clear button. Use instead of a plain Input for search UX. */
export { default as SearchBar } from "./components/SearchBar/SearchBar";

/** Checkbox styled as a pressed/unpressed toggle button. Use for toolbar-style toggles (bold, italic, etc.). */
export { default as Toggle } from "./components/Toggle/Toggle";

/** iOS-style on/off switch. Use for binary settings. */
export { default as Switch } from "./components/Switch/Switch";
export type { SwitchProps } from "./components/Switch/Switch";

/** Single or range value slider with optional marks. */
export { default as Slider } from "./components/Slider/Slider";
export type {
  SliderProps,
  SliderMark,
  SliderSingleProps,
  SliderRangeProps,
} from "./components/Slider/Slider";

/** Color picker with hex input and swatches. Use DEFAULT_SWATCHES for the default palette. */
export {
  default as ColorPicker,
  DEFAULT_SWATCHES,
} from "./components/ColorPicker/ColorPicker";
export type { ColorPickerProps } from "./components/ColorPicker/ColorPicker";

/** Chip showing an attached file with a remove button. Use in comment boxes or message inputs. */
export { default as Attachment } from "./components/Attachment/Attachment";

/** International phone number input with country selector. Use instead of a plain Input for phone fields. */
export { default as PhoneInput } from "./components/PhoneInput/PhoneInput";

/** Dropdown select. Use instead of native <select>. For searchable or async options use Combobox. */
export { default as SelectInput } from "./components/SelectInput/SelectInput";
export type { SelectOption } from "./components/SelectInput/types";

/** Searchable select with async support. Supports single and multi-select. Use instead of SelectInput when search or multi is needed. */
export { default as Combobox } from "./components/Combobox/Combobox";
export type {
  ComboboxOption,
  ComboboxProps,
  ComboboxCommonProps,
} from "./components/Combobox/types";

/** React Hook Form integration. Use for any form with validation — wraps FormField, FormItem, FormLabel, FormControl, FormError. */
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormHint,
  FormError,
  useFormField,
  Slot,
} from "./components/Form";
export type { SlotProps } from "./components/Form";

/** Radio button group. */
export { default as RadioGroup } from "./components/RadioGroup/RadioGroup";
export type {
  RadioGroupProps,
  RadioOption,
} from "./components/RadioGroup/RadioGroup";

/** Calendar-based single date picker. */
export { default as DatePicker } from "./components/DatePicker/DatePicker";
export type { DatePickerProps } from "./components/DatePicker/DatePicker";

/** Calendar-based date range picker. Returns { from, to } DateRange. */
export { default as DateRangePicker } from "./components/DatePicker/DateRangePicker";
export type {
  DateRangePickerProps,
  DateRange,
} from "./components/DatePicker/DateRangePicker";

/** Hour / minute / AM-PM time picker. */
export { default as TimePicker } from "./components/TimePicker/TimePicker";
export type {
  TimePickerProps,
  TimeValue,
} from "./components/TimePicker/TimePicker";

/** Simple drag-and-drop file drop zone with selected-file list. */
export { default as Dropzone } from "./components/Dropzone/Dropzone";
export type { DropzoneProps } from "./components/Dropzone/Dropzone";

/** Click-triggered dropdown menu with items array. Use instead of building custom menus. */
export { default as DropdownMenu } from "./components/DropdownMenu/DropdownMenu";
export type {
  DropdownMenuProps,
  MenuItem,
} from "./components/DropdownMenu/DropdownMenu";

/** Input that creates tag chips on Enter. Use for multi-value text fields. */
export { default as TagInput } from "./components/TagInput/TagInput";
export type { TagInputProps } from "./components/TagInput/TagInput";

/** Tab-like option selector (mutually exclusive). Use instead of radio buttons for view switchers or mode selectors. */
export { default as SegmentedControl } from "./components/SegmentedControl/SegmentedControl";
export type {
  SegmentedControlProps,
  SegmentedOption,
  SegmentedSize,
} from "./components/SegmentedControl/SegmentedControl";

/** Form field label, optionally with required marker. Pair with FormItem. */
export { default as Label } from "./components/Label/Label";
export type { LabelProps } from "./components/Label/Label";

/** Groups related form fields with a legend/border. */
export { default as FieldSet } from "./components/FieldSet/FieldSet";
export type { FieldSetProps } from "./components/FieldSet/FieldSet";

/** Numeric input with increment / decrement controls. Use instead of a plain Input for number fields. */
export { default as NumberInput } from "./components/NumberInput/NumberInput";
export type { NumberInputProps } from "./components/NumberInput/NumberInput";

/** List of FAQ items with expand/collapse. Use instead of building accordion-style FAQ manually. */
export { default as FaqList } from "./components/FaqDropdown/FaqList";

/** Tabbed content sections driven by a label/content data array. */
export { default as InfoTabs } from "./components/InfoTabs/InfoTabs";
export type { InfoTab } from "./components/InfoTabs/types";

/** Vertical timeline of dated events. */
export { default as Timeline } from "./components/Timeline/Timeline";

// Components — Layout

/** Swiper-based carousel for images or cards. Supports autoplay, dots, and navigation arrows. */
export { default as Carousel } from "./components/Carousel/Carousel";
export type { CarouselProps } from "./components/Carousel/Carousel";

/** Resizable split-pane layout. Compose PanelGroup > Panel + PanelResizeHandle. */
export {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "./components/PanelGroup";
export type {
  PanelGroupProps,
  PanelProps,
  PanelResizeHandleProps,
} from "./components/PanelGroup";

/** Accessible dialog with focus trap, backdrop, and stacked-modal support. Sizes: sm (454px) | md (670px). */
export { Modal } from "./components/Modal/Modal";
export type { ModalMotionVariants } from "./components/Modal/types";

/** Imperative confirmation dialog — no manual modal state needed. Wrap app in ConfirmProvider and call useConfirm(). Use instead of window.confirm(). */
export {
  ConfirmDialog,
  ConfirmProvider,
  useConfirm,
  useConfirmWithNote,
  ConfirmContext,
} from "./components/Confirm";
export type {
  ConfirmDialogProps,
  ConfirmProviderProps,
  ConfirmFn,
  ConfirmOptions,
  ConfirmVariant,
  ConfirmWithNoteFn,
  ConfirmWithNoteOptions,
  ConfirmWithNoteResult,
} from "./components/Confirm";

/** Styled card container with border and padding. */
export { default as CardWrapper } from "./components/CardWrapper/CardWrapper";

/** Max-width content wrapper with responsive padding. Sizes: sm | md | lg | xl | full. */
export { default as Container } from "./components/Container/Container";
export type {
  ContainerProps,
  ContainerSize,
} from "./components/Container/Container";

/** Small decorative label tag to mark a section or category (e.g. "New", "Featured"). Not interactive. */
export { default as SectionTag } from "./components/SectionTag/SectionTag";

/** App navigation sidebar with items, icons, and active state. */
export { default as Sidebar } from "./components/Sidebar/Sidebar";
export type { SidebarProps, SidebarItem } from "./components/Sidebar/Sidebar";

/** Multi-step flow controller. Pair with useWizard for step state, and Stepper for visual indicator. */
export { Wizard } from "./components/Wizard/Wizard";
/** Hook that drives Wizard state: current step, navigation, completion. */
export { useWizard } from "./components/Wizard/useWizard";
export type {
  WizardStep,
  UseWizardArgs,
  UseWizardReturn,
} from "./components/Wizard/types";

/** Navigation breadcrumb trail. */
export { default as Breadcrumbs } from "./components/Breadcrumbs/Breadcrumbs";
export type {
  BreadcrumbsProps,
  BreadcrumbItem,
} from "./components/Breadcrumbs/Breadcrumbs";

/** Compact slide-in panel. Lighter than Sheet — use for contextual details or quick actions. */
export { default as Drawer } from "./components/Drawer/Drawer";

/** ⌘K command palette. Wrap app in CommandPaletteProvider, register commands with useRegisterCommand from anywhere. */
export { default as CommandPalette } from "./components/CommandPalette/CommandPalette";
export type {
  CommandItem,
  CommandPaletteProps,
} from "./components/CommandPalette/CommandPalette";
export {
  CommandPaletteProvider,
  useCommandPalette,
  /** Register a command into the palette from any component. */
  useRegisterCommand,
} from "./components/CommandPalette/CommandPaletteProvider";
export type { CommandPaletteProviderProps } from "./components/CommandPalette/CommandPaletteProvider";

/** Variable / token picker popup. Use in template or formula editors. */
export { default as VariablePicker } from "./components/VariablePicker/VariablePicker";
export type {
  VariablePickerProps,
  VariableItem,
} from "./components/VariablePicker/VariablePicker";

/** Side panel sliding from an edge. Use for filters, settings, or detail views. Lighter alternative: Drawer (compact). */
export { default as Sheet } from "./components/Sheet/Sheet";
export type {
  SheetProps,
  SheetSide,
  SheetSize,
} from "./components/Sheet/Sheet";

/** Floating action button (fixed-position). Use for a single primary action on a page. */
export { default as FAB } from "./components/FAB/FAB";
export type { FABProps, FABPosition } from "./components/FAB/FAB";

/** Horizontal or vertical action bar with accessible arrow-key navigation. Use for editor toolbars or grouped icon actions. */
export {
  default as Toolbar,
  ToolbarSeparator,
} from "./components/Toolbar/Toolbar";
export type {
  ToolbarProps,
  ToolbarSeparatorProps,
  ToolbarOrientation,
  ToolbarSize,
} from "./components/Toolbar/Toolbar";

/** Vertical flex container with consistent gap. Use instead of a div with flex-col + gap. */
export { default as Stack } from "./components/Stack/Stack";
export type { StackProps } from "./components/Stack/Stack";

/** Horizontal flex container with gap and wrapping. Use instead of a div with flex + gap + flex-wrap. */
export { default as Inline } from "./components/Inline/Inline";
export type { InlineProps } from "./components/Inline/Inline";

/** Page title bar with optional subtitle and right-side action slot. */
export { default as PageHeader } from "./components/PageHeader/PageHeader";
export type { PageHeaderProps } from "./components/PageHeader/PageHeader";

/** Constrains a child element to a fixed aspect ratio (e.g. 16/9 for video). */
export { default as AspectRatio } from "./components/AspectRatio/AspectRatio";
export type { AspectRatioProps } from "./components/AspectRatio/AspectRatio";

/** Right-click context menu. Use instead of building a custom positioned menu. */
export { default as ContextMenu } from "./components/ContextMenu/ContextMenu";
export type {
  ContextMenuProps,
  MenuItem as ContextMenuItem,
} from "./components/ContextMenu/ContextMenu";

/** Scrollable container with styled custom scrollbar. Wrap any overflow content. */
export { default as ScrollArea } from "./components/ScrollArea/ScrollArea";
export type { ScrollAreaProps } from "./components/ScrollArea/ScrollArea";

// Components — Data Display

/** User avatar with image and fallback initials. Sizes: xs | sm | md | lg | xl. */
export { default as Avatar } from "./components/Avatar/Avatar";
export type { AvatarProps, AvatarSize } from "./components/Avatar/Avatar";

/** Overlapping avatar stack with overflow count (+N). */
export { default as AvatarGroup } from "./components/AvatarGroup/AvatarGroup";
export type { AvatarGroupProps } from "./components/AvatarGroup/AvatarGroup";

/** Hierarchical tree with expand / collapse nodes. */
export { default as TreeView } from "./components/TreeView/TreeView";
export type { TreeNode, TreeViewProps } from "./components/TreeView/types";

/** Month / week calendar view with events. */
export { default as Calendar } from "./components/Calendar/Calendar";
export type { CalendarProps } from "./components/Calendar/Calendar";

/** Compact row: avatar + primary name + secondary subtitle. Use in lists, dropdowns, user search results. */
export { default as AvatarCard } from "./components/AvatarCard/AvatarCard";

/** Colored pill showing a status or result label (e.g. "Passed", "Failed"). Use in tables instead of custom badge divs. */
export { default as ResultPill } from "./components/ResultPill/ResultPill";

/** Star rating input or display. */
export { default as Rate } from "./components/Rate/Rate";
export type { RateProps } from "./components/Rate/Rate";

/** Small colored dot status indicator (e.g. ● Online). */
export { default as Point } from "./components/Point/Point";

/** Compact "Step X of Y" inline counter. Use in table cells or card headers. */
export { default as Steps } from "./components/Steps/Steps";

/** Optimized image via SagtechUIProvider. Use instead of raw <img>. Integrates Next.js Image when provided. */
export { default as Image, ForwardedImage } from "./components/Image/Image";
export type { ImageProps } from "./components/Image/Image";

/** Lazy-loads image when it enters the viewport. Use for below-the-fold images in long pages. */
export { default as LazyImage } from "./components/LazyImage/LazyImage";

/** Status or count badge. Attach to Avatar, nav items, or tabs to show unread/notification counts. */
export { default as Badge } from "./components/Badge/Badge";

/** Hover tooltip for any element. Keep content short — for rich previews use HoverCard. */
export { default as Tooltip } from "./components/Tooltip/Tooltip";

/** Click-triggered floating panel for secondary content. For hover previews use HoverCard, for menus use DropdownMenu. */
export { default as Popover } from "./components/Popover/Popover";
export type { PopoverProps } from "./components/Popover/Popover";

/** Collapsible sections. type="single" (one open at a time) or "multiple". Use instead of building custom accordion UI. */
export { Accordion, AccordionItem } from "./components/Accordion";
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionType,
} from "./components/Accordion";

/** Rich floating preview on hover — for user profiles, link previews, entity details. Delay-triggered. */
export { default as HoverCard } from "./components/HoverCard/HoverCard";
export type { HoverCardProps } from "./components/HoverCard/HoverCard";

/** Data-driven tab navigation. For custom tab layouts use TabsRoot + TabsList + TabsTrigger + TabsContent. */
export { default as Tabs } from "./components/Tabs/Tabs";
/** Compound tab root (uncontrolled or controlled). */
export { default as TabsRoot } from "./components/Tabs/TabsRoot";
/** Tab list container — renders the tab bar. */
export { default as TabsList } from "./components/Tabs/TabsList";
/** Individual tab trigger button inside TabsList. */
export { default as TabsTrigger } from "./components/Tabs/TabsTrigger";
/** Tab panel shown when its trigger is active. */
export { default as TabsContent } from "./components/Tabs/TabsContent";
export type { TabsRootProps } from "./components/Tabs/TabsRoot";
export type { TabsListProps } from "./components/Tabs/TabsList";
export type { TabsTriggerProps } from "./components/Tabs/TabsTrigger";
export type { TabsContentProps } from "./components/Tabs/TabsContent";
export type { TabItem, TabsProps } from "./components/Tabs/Tabs";

/** Simple read-only data table with typed columns. For sortable / paginated tables use DataTable. */
export { default as Table } from "./components/Table/Table";
export type { TableProps, Column } from "./components/Table/Table";

/** Full-featured table: sortable columns, pagination, row selection. Use instead of Table when interactivity is needed. */
export { default as DataTable } from "./components/DataTable/DataTable";
export type {
  DataTableProps,
  DataTableColumn,
  SortDirection,
  SortState,
} from "./components/DataTable/types";

/** Drag-to-reorder list powered by dnd-kit. Use instead of building custom drag-and-drop. */
export { default as SortableList } from "./components/SortableList/SortableList";
export type {
  SortableListProps,
  SortableListRenderContext,
} from "./components/SortableList/SortableList";

/** Virtualized list for 500+ items. Use instead of mapping over a large array — renders only visible rows. */
export { default as VirtualList } from "./components/VirtualList/VirtualList";
export type { VirtualListProps } from "./components/VirtualList/VirtualList";

/** Click-to-edit text field. Use in tables or detail views where in-place editing is preferred over a modal. */
export { default as InlineEdit } from "./components/InlineEdit/InlineEdit";
export type { InlineEditProps } from "./components/InlineEdit/InlineEdit";

/** Syntax-highlighted code block with copy button. Use instead of raw <pre>/<code> for code display. */
export { default as CodeBlock } from "./components/CodeBlock/CodeBlock";
export type {
  CodeBlockProps,
  CodeLanguage,
} from "./components/CodeBlock/CodeBlock";

/** Full-featured WYSIWYG editor (Tiptap). Supports mentions, slash commands, image upload via extension presets. */
export { default as RichTextEditor } from "./components/RichTextEditor/RichTextEditor";
export type { RichTextEditorProps } from "./components/RichTextEditor/RichTextEditor";
export {
  createMentionExtension,
  createSlashCommandExtension,
  createImageUploadExtension,
  createSyntaxHighlightExtension,
  defaultSlashCommands,
  validateImageFile,
} from "./components/RichTextEditor/presets";
export type {
  MentionItem,
  SlashCommand,
  CreateMentionOptions,
  CreateSlashCommandOptions,
  CreateImageUploadOptions,
  CreateSyntaxHighlightOptions,
  LowlightInstance,
} from "./components/RichTextEditor/presets";

/** Interactive node-edge graph editor (React Flow). Use for workflow builders, diagrams, and visual config tools. */
export { default as VisualGraphEditor } from "./components/VisualGraphEditor/VisualGraphEditor";
export type {
  VisualGraphEditorProps,
  GraphNode,
  GraphEdge,
} from "./components/VisualGraphEditor/VisualGraphEditor";

/** Collapsible JSON tree viewer. Use instead of raw <pre> for displaying API responses or config objects. */
export { default as JsonView } from "./components/JsonView/JsonView";
export type { JsonViewProps } from "./components/JsonView/JsonView";

/** Gantt chart for project / task timelines. Scales: day | week | month. */
export { default as GanttTimeline } from "./components/GanttTimeline/GanttTimeline";
export type {
  GanttTimelineProps,
  GanttItem,
  GanttScale,
} from "./components/GanttTimeline/GanttTimeline";

/** Page navigation controls. */
export { default as Pagination } from "./components/Pagination/Pagination";
export type { PaginationProps } from "./components/Pagination/Pagination";

/** KPI metric card with value, label, and optional trend indicator. */
export { default as StatCard } from "./components/StatCard/StatCard";
export type { StatCardProps } from "./components/StatCard/StatCard";

/** Filled area chart for volume or cumulative trends. */
export { default as AreaChart } from "./components/AreaChart/AreaChart";
export type {
  AreaChartProps,
  AreaChartSeries,
} from "./components/AreaChart/types";

/** Bar chart for comparisons and rankings. Supports grouped and stacked variants. */
export { default as BarChart } from "./components/BarChart/BarChart";
export type {
  BarChartProps,
  BarChartSeries,
} from "./components/BarChart/types";

/** Heatmap for density or frequency data on a grid (e.g. activity calendars). */
export { default as HeatmapChart } from "./components/HeatmapChart/HeatmapChart";
export type {
  HeatmapChartProps,
  HeatmapDatum,
} from "./components/HeatmapChart/types";

/** Radar / spider chart for multi-axis comparisons. */
export { default as RadarChart } from "./components/RadarChart/RadarChart";
export type {
  RadarChartProps,
  RadarChartSeries,
} from "./components/RadarChart/types";

/** Inline mini trend line with no axes or labels. Use inside table cells or stat cards. */
export { default as SparklineChart } from "./components/SparklineChart/SparklineChart";
export type { SparklineChartProps } from "./components/SparklineChart/SparklineChart";

/** Scatter plot for correlation or distribution data. */
export { default as ScatterChart } from "./components/ScatterChart/ScatterChart";
export type {
  ScatterChartProps,
  ScatterChartSeries,
  ScatterPoint,
} from "./components/ScatterChart/types";

/** Circular gauge / speedometer for a single value with color thresholds. */
export { default as GaugeChart } from "./components/GaugeChart/GaugeChart";
export type {
  GaugeChartProps,
  GaugeThreshold,
} from "./components/GaugeChart/types";

/** Sankey flow diagram showing volume between source and target categories. */
export { default as SankeyChart } from "./components/SankeyChart/SankeyChart";
export type {
  SankeyChartProps,
  SankeyNode,
  SankeyLink,
} from "./components/SankeyChart/types";

/** Treemap for hierarchical part-of-whole proportions. */
export { default as TreemapChart } from "./components/TreemapChart/TreemapChart";
export type {
  TreemapChartProps,
  TreemapNode,
} from "./components/TreemapChart/types";

/** Funnel chart for conversion or drop-off stages. */
export { default as FunnelChart } from "./components/FunnelChart/FunnelChart";
export type {
  FunnelChartProps,
  FunnelStage,
} from "./components/FunnelChart/types";

/** Visual step indicator (horizontal or vertical). Use with Wizard for multi-step flows, or standalone. */
export { default as Stepper } from "./components/Stepper/Stepper";
export type { StepperProps } from "./components/Stepper/Stepper";
export type {
  StepperStep,
  StepperStatus,
  StepperOrientation,
  StepperClickable,
} from "./components/Stepper/types";

// Components — Marketing
export { default as Hero } from "./components/Hero/Hero";
export type { HeroProps } from "./components/Hero/Hero";
export { default as FeatureGrid } from "./components/FeatureGrid/FeatureGrid";
export type { FeatureGridProps, FeatureItem } from "./components/FeatureGrid/FeatureGrid";
export { default as StatGrid } from "./components/StatGrid/StatGrid";
export type { StatGridProps, StatItem } from "./components/StatGrid/StatGrid";
export { default as CTASection } from "./components/CTASection/CTASection";
export type { CTASectionProps } from "./components/CTASection/CTASection";

// Components — 3D / WebGL (all lazy-load their Three.js core)

/** Interactive 3D force-directed node-link graph. Use for network topology, knowledge graphs. */
export { default as Network3D } from "./components/Network3D/Network3D";
export type {
  Network3DProps,
  Network3DNode,
  Network3DLink,
} from "./components/Network3D/types";

/** Interactive 3D globe with location markers. */
export { default as Globe3D } from "./components/Globe3D/Globe3D";
export type { Globe3DProps, Globe3DMarker } from "./components/Globe3D/types";

/** Generic Three.js scene wrapper for custom 3D content. */
export { default as Scene3D } from "./components/Scene3D/Scene3D";
export type { Scene3DProps } from "./components/Scene3D/Scene3D";

// Components — Feedback

/** Empty list / zero-state placeholder with icon, message, and optional CTA. Use instead of a custom empty-state div. */
export { default as EmptyState } from "./components/EmptyState/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState/EmptyState";

/** Inline status message. Variants: info | success | warning | error. Use instead of custom colored alert divs. */
export { default as Alert } from "./components/Alert/Alert";
export type { AlertProps, AlertVariant } from "./components/Alert/Alert";

/** Linear progress bar. */
export { default as ProgressBar } from "./components/ProgressBar/ProgressBar";
export type { ProgressBarProps } from "./components/ProgressBar/ProgressBar";

/** Button with shimmer / pulse animation. Use for primary landing page CTAs where motion draws attention. */
export { default as AnimationButton } from "./components/AnimationButton/AnimationButton";

/** GDPR cookie consent banner. */
export { default as CookieBanner } from "./components/CookieBanner/CookieBanner";
export type { CookieBannerProps } from "./components/CookieBanner/CookieBanner";

/** In-app notification panel with unread count, mark-read, and clear-all actions. */
export { default as NotificationCenter } from "./components/NotificationCenter/NotificationCenter";
export type {
  NotificationCenterProps,
  NotificationItem,
  NotificationVariant,
} from "./components/NotificationCenter/NotificationCenter";

/** Toast notification system. Place <Toaster /> once in root layout, then call toast.success() / toast.error() anywhere. */
export { Toaster, toast, toastStore } from "./components/Toast";
export type {
  ToasterProps,
  ToasterPosition,
  ToastApi,
  ToastAction,
  ToastData,
  ToastOptions,
  ToastVariant,
} from "./components/Toast";

/** Styled navigation arrow button for carousels and custom sliders. isReversed flips direction (left arrow). */
export { default as SliderArrow } from "./components/SliderArrow/SliderArrow";

/** Line / time-series chart. Use for trends over time. */
export { default as LineChart } from "./components/LineChart/LineChart";
export type {
  LineChartSeriesType,
  VariantType as LineChartVariantType,
} from "./components/LineChart/types";

/** Donut / pie chart for part-of-whole proportions. */
export { default as DonutChart } from "./components/DonutChart/DonutChart";
export type { VariantType as DonutChartVariantType } from "./components/DonutChart/types";

/** Full-width announcement banner, fixed or inline. Variants: info | success | warning | error. */
export { default as Banner } from "./components/Banner/Banner";
export type {
  BannerProps,
  BannerVariant,
  BannerPosition,
} from "./components/Banner/Banner";

/** Onboarding spotlight: dims the page and highlights one element with a tooltip. Use for feature tours. */
export { default as Spotlight } from "./components/Spotlight/Spotlight";
export type {
  SpotlightProps,
  SpotlightPlacement,
} from "./components/Spotlight/types";

// Feedback — Motion primitives

/** Animated number count-up. Use in dashboards and stat cards for visual impact. */
export { default as NumberTicker } from "./components/NumberTicker/NumberTicker";
export type { NumberTickerProps } from "./components/NumberTicker/NumberTicker";

/** Typewriter text animation — reveals text character by character. */
export { default as TypingAnimation } from "./components/TypingAnimation/TypingAnimation";
export type { TypingAnimationProps } from "./components/TypingAnimation/TypingAnimation";

/** Animated canvas particle background. Use on hero sections or loading screens. */
export { default as Particles } from "./components/Particles/Particles";
export type { ParticlesProps } from "./components/Particles/Particles";

// Icons
export { content as iconContent } from "./icons";
export type { IAvailableIcons } from "./icons";
