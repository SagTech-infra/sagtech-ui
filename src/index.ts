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
} from "./hooks";
export type { StatusMeta, StatusTone } from "./hooks";

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
export { default as Typography } from "./components/Typography/Typography";
export type { TypographyTypes } from "./components/Typography/Typography";
export type {
  VariantTypoTags,
  VariantTypoTagsStyles,
  VariantTypoColors,
} from "./components/Typography/types";
export { Icon } from "./components/Icon/Icon";
export { default as Skeleton } from "./components/Skeleton/Skeleton";
export {
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
} from "./components/Skeleton/presets";
export type {
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonCardProps,
  SkeletonTableProps,
  SkeletonListProps,
} from "./components/Skeleton/presets";
export { default as Divider } from "./components/Divider/Divider";
export { default as KBD } from "./components/KBD/KBD";
export type { KBDProps, KBDSize } from "./components/KBD/KBD";

// Components — Form Controls
export { default as Button } from "./components/Button/Button";
export type { ButtonTypes } from "./components/Button/Button";
export { default as Input } from "./components/Input/Input";
export { TextArea } from "./components/TextArea/TextArea";
export { default as Checkbox } from "./components/Checkbox/Checkbox";
export { default as SearchBar } from "./components/SearchBar/SearchBar";
export { default as Toggle } from "./components/Toggle/Toggle";
export { default as Switch } from "./components/Switch/Switch";
export type { SwitchProps } from "./components/Switch/Switch";
export { default as Slider } from "./components/Slider/Slider";
export type {
  SliderProps,
  SliderMark,
  SliderSingleProps,
  SliderRangeProps,
} from "./components/Slider/Slider";
export {
  default as ColorPicker,
  DEFAULT_SWATCHES,
} from "./components/ColorPicker/ColorPicker";
export type { ColorPickerProps } from "./components/ColorPicker/ColorPicker";
export { default as Attachment } from "./components/Attachment/Attachment";
export { default as PhoneInput } from "./components/PhoneInput/PhoneInput";
export { default as SelectInput } from "./components/SelectInput/SelectInput";
export type { SelectOption } from "./components/SelectInput/types";
export { default as Combobox } from "./components/Combobox/Combobox";
export type {
  ComboboxOption,
  ComboboxProps,
  ComboboxCommonProps,
} from "./components/Combobox/types";
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
export { default as RadioGroup } from "./components/RadioGroup/RadioGroup";
export type {
  RadioGroupProps,
  RadioOption,
} from "./components/RadioGroup/RadioGroup";
export { default as DatePicker } from "./components/DatePicker/DatePicker";
export type { DatePickerProps } from "./components/DatePicker/DatePicker";
export { default as DateRangePicker } from "./components/DatePicker/DateRangePicker";
export type {
  DateRangePickerProps,
  DateRange,
} from "./components/DatePicker/DateRangePicker";
export { default as TimePicker } from "./components/TimePicker/TimePicker";
export type {
  TimePickerProps,
  TimeValue,
} from "./components/TimePicker/TimePicker";
export { default as Dropzone } from "./components/Dropzone/Dropzone";
export type { DropzoneProps } from "./components/Dropzone/Dropzone";
export { default as FileDropzone } from "./components/FileDropzone/FileDropzone";
export type {
  FileDropzoneProps,
  FileUploadItem,
  FileUploadStatus,
} from "./components/FileDropzone/FileDropzone";
export { default as DropdownMenu } from "./components/DropdownMenu/DropdownMenu";
export type {
  DropdownMenuProps,
  MenuItem,
} from "./components/DropdownMenu/DropdownMenu";
export { default as TagInput } from "./components/TagInput/TagInput";
export type { TagInputProps } from "./components/TagInput/TagInput";
export { default as SegmentedControl } from "./components/SegmentedControl/SegmentedControl";
export type {
  SegmentedControlProps,
  SegmentedOption,
  SegmentedSize,
} from "./components/SegmentedControl/SegmentedControl";

export { default as FaqDropdown } from "./components/FaqDropdown/FaqDropdown";
export { default as FaqList } from "./components/FaqDropdown/FaqList";

export { default as InfoTabs } from "./components/InfoTabs/InfoTabs";
export type { InfoTab } from "./components/InfoTabs/types";

export { default as Timeline } from "./components/Timeline/Timeline";

// Components — Layout
export { Modal } from "./components/Modal/Modal";
export type { ModalMotionVariants } from "./components/Modal/Modal";
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
export { default as CardWrapper } from "./components/CardWrapper/CardWrapper";
export { default as Container } from "./components/Container/Container";
export type {
  ContainerProps,
  ContainerSize,
} from "./components/Container/Container";
export { default as SectionTag } from "./components/SectionTag/SectionTag";
export { default as Sidebar } from "./components/Sidebar/Sidebar";
export type { SidebarProps, SidebarItem } from "./components/Sidebar/Sidebar";
export { Wizard } from "./components/Wizard/Wizard";
export { useWizard } from "./components/Wizard/useWizard";
export type {
  WizardStep,
  UseWizardArgs,
  UseWizardReturn,
} from "./components/Wizard/types";
export { default as Breadcrumbs } from "./components/Breadcrumbs/Breadcrumbs";
export type {
  BreadcrumbsProps,
  BreadcrumbItem,
} from "./components/Breadcrumbs/Breadcrumbs";
export { default as Drawer } from "./components/Drawer/Drawer";
export { default as CommandPalette } from "./components/CommandPalette/CommandPalette";
export type {
  CommandItem,
  CommandPaletteProps,
} from "./components/CommandPalette/CommandPalette";
export {
  CommandPaletteProvider,
  useCommandPalette,
  useRegisterCommand,
} from "./components/CommandPalette/CommandPaletteProvider";
export type { CommandPaletteProviderProps } from "./components/CommandPalette/CommandPaletteProvider";
export { default as VariablePicker } from "./components/VariablePicker/VariablePicker";
export type {
  VariablePickerProps,
  VariableItem,
} from "./components/VariablePicker/VariablePicker";
export { default as Sheet } from "./components/Sheet/Sheet";
export type {
  SheetProps,
  SheetSide,
  SheetSize,
} from "./components/Sheet/Sheet";
export { default as BottomSheet } from "./components/BottomSheet/BottomSheet";
export type { BottomSheetProps } from "./components/BottomSheet/BottomSheet";
export { default as FAB } from "./components/FAB/FAB";
export type { FABProps, FABPosition } from "./components/FAB/FAB";
export {
  default as Toolbar,
  ToolbarSeparator,
} from "./components/Toolbar/Toolbar";
export { default as Stack } from "./components/Stack/Stack";
export type { StackProps } from "./components/Stack/Stack";
export { default as Inline } from "./components/Inline/Inline";
export type { InlineProps } from "./components/Inline/Inline";
export { default as PageHeader } from "./components/PageHeader/PageHeader";
export type { PageHeaderProps } from "./components/PageHeader/PageHeader";
export type {
  ToolbarProps,
  ToolbarSeparatorProps,
  ToolbarOrientation,
  ToolbarSize,
} from "./components/Toolbar/Toolbar";

// Components — Data Display
export { default as Avatar } from "./components/Avatar/Avatar";
export type { AvatarProps, AvatarSize } from "./components/Avatar/Avatar";
export { default as AvatarGroup } from "./components/AvatarGroup/AvatarGroup";
export type { AvatarGroupProps } from "./components/AvatarGroup/AvatarGroup";
export { default as AvatarCard } from "./components/AvatarCard/AvatarCard";
export { default as ResultPill } from "./components/ResultPill/ResultPill";
export { default as Rate } from "./components/Rate/Rate";
export type { RateProps } from "./components/Rate/Rate";
export { default as Point } from "./components/Point/Point";
export { default as Steps } from "./components/Steps/Steps";
export { default as Image, ForwardedImage } from "./components/Image/Image";
export type { ImageProps } from "./components/Image/Image";
export { default as LazyImage } from "./components/LazyImage/LazyImage";
export { default as Badge } from "./components/Badge/Badge";
export { default as Tooltip } from "./components/Tooltip/Tooltip";
export { default as Popover } from "./components/Popover/Popover";
export type { PopoverProps } from "./components/Popover/Popover";
export { default as Tabs } from "./components/Tabs/Tabs";
export { default as TabsRoot } from "./components/Tabs/TabsRoot";
export { default as TabsList } from "./components/Tabs/TabsList";
export { default as TabsTrigger } from "./components/Tabs/TabsTrigger";
export { default as TabsContent } from "./components/Tabs/TabsContent";
export type { TabsRootProps } from "./components/Tabs/TabsRoot";
export type { TabsListProps } from "./components/Tabs/TabsList";
export type { TabsTriggerProps } from "./components/Tabs/TabsTrigger";
export type { TabsContentProps } from "./components/Tabs/TabsContent";
export type { TabItem, TabsProps } from "./components/Tabs/Tabs";
export { default as Table } from "./components/Table/Table";
export type { TableProps, Column } from "./components/Table/Table";
export { default as DataTable } from "./components/DataTable/DataTable";
export type {
  DataTableProps,
  DataTableColumn,
  SortDirection,
  SortState,
} from "./components/DataTable/types";
export { default as SortableList } from "./components/SortableList/SortableList";
export type {
  SortableListProps,
  SortableListRenderContext,
} from "./components/SortableList/SortableList";
export { default as VirtualList } from "./components/VirtualList/VirtualList";
export type { VirtualListProps } from "./components/VirtualList/VirtualList";
export { default as InlineEdit } from "./components/InlineEdit/InlineEdit";
export type { InlineEditProps } from "./components/InlineEdit/InlineEdit";
export { default as CodeBlock } from "./components/CodeBlock/CodeBlock";
export type {
  CodeBlockProps,
  CodeLanguage,
} from "./components/CodeBlock/CodeBlock";
export { default as RichTextEditor } from "./components/RichTextEditor/RichTextEditor";
export type { RichTextEditorProps } from "./components/RichTextEditor/RichTextEditor";
export { default as VisualGraphEditor } from "./components/VisualGraphEditor/VisualGraphEditor";
export type {
  VisualGraphEditorProps,
  GraphNode,
  GraphEdge,
} from "./components/VisualGraphEditor/VisualGraphEditor";
export { default as JsonView } from "./components/JsonView/JsonView";
export type { JsonViewProps } from "./components/JsonView/JsonView";
export { default as GanttTimeline } from "./components/GanttTimeline/GanttTimeline";
export type {
  GanttTimelineProps,
  GanttItem,
  GanttScale,
} from "./components/GanttTimeline/GanttTimeline";
export { default as Pagination } from "./components/Pagination/Pagination";
export type { PaginationProps } from "./components/Pagination/Pagination";
export { default as StatCard } from "./components/StatCard/StatCard";
export type { StatCardProps } from "./components/StatCard/StatCard";
export { default as AreaChart } from "./components/AreaChart/AreaChart";
export type {
  AreaChartProps,
  AreaChartSeries,
} from "./components/AreaChart/types";
export { default as BarChart } from "./components/BarChart/BarChart";
export type {
  BarChartProps,
  BarChartSeries,
} from "./components/BarChart/types";
export { default as HeatmapChart } from "./components/HeatmapChart/HeatmapChart";
export type {
  HeatmapChartProps,
  HeatmapDatum,
} from "./components/HeatmapChart/types";
export { default as RadarChart } from "./components/RadarChart/RadarChart";
export type {
  RadarChartProps,
  RadarChartSeries,
} from "./components/RadarChart/types";
export { default as SparklineChart } from "./components/SparklineChart/SparklineChart";
export type { SparklineChartProps } from "./components/SparklineChart/SparklineChart";
export { default as ScatterChart } from "./components/ScatterChart/ScatterChart";
export type {
  ScatterChartProps,
  ScatterChartSeries,
  ScatterPoint,
} from "./components/ScatterChart/types";
export { default as GaugeChart } from "./components/GaugeChart/GaugeChart";
export type {
  GaugeChartProps,
  GaugeThreshold,
} from "./components/GaugeChart/types";
export { default as SankeyChart } from "./components/SankeyChart/SankeyChart";
export type {
  SankeyChartProps,
  SankeyNode,
  SankeyLink,
} from "./components/SankeyChart/types";
export { default as TreemapChart } from "./components/TreemapChart/TreemapChart";
export type {
  TreemapChartProps,
  TreemapNode,
} from "./components/TreemapChart/types";
export { default as FunnelChart } from "./components/FunnelChart/FunnelChart";
export type {
  FunnelChartProps,
  FunnelStage,
} from "./components/FunnelChart/types";
export { default as Stepper } from "./components/Stepper/Stepper";
export type { StepperProps } from "./components/Stepper/Stepper";
export type {
  StepperStep,
  StepperStatus,
  StepperOrientation,
  StepperClickable,
} from "./components/Stepper/types";

// Components — 3D / WebGL
export { default as Network3D } from "./components/Network3D/Network3D";
export type {
  Network3DProps,
  Network3DNode,
  Network3DLink,
} from "./components/Network3D/types";
export { default as Globe3D } from "./components/Globe3D/Globe3D";
export type { Globe3DProps, Globe3DMarker } from "./components/Globe3D/types";
export { default as Scene3D } from "./components/Scene3D/Scene3D";
export type { Scene3DProps } from "./components/Scene3D/Scene3D";
export { default as Mindmap3D } from "./components/Mindmap3D/Mindmap3D";
export type { Mindmap3DProps, MindmapNode } from "./components/Mindmap3D/types";

// Components — Feedback
export { default as EmptyState } from "./components/EmptyState/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState/EmptyState";
export { default as Alert } from "./components/Alert/Alert";
export type { AlertProps, AlertVariant } from "./components/Alert/Alert";
export { default as ProgressBar } from "./components/ProgressBar/ProgressBar";
export type { ProgressBarProps } from "./components/ProgressBar/ProgressBar";
export { default as AnimationButton } from "./components/AnimationButton/AnimationButton";
export { default as CookieBanner } from "./components/CookieBanner/CookieBanner";
export type { CookieBannerProps } from "./components/CookieBanner/CookieBanner";
export { Notification } from "./components/Notification/Notification";
export { default as NotificationWrapper } from "./components/Notification/NotificationWrapper";
export {
  NotificationContext,
  NotificationContextProvider,
} from "./components/Notification/NotificationContext";
export { default as NotificationCenter } from "./components/NotificationCenter/NotificationCenter";
export type {
  NotificationCenterProps,
  NotificationItem,
  NotificationVariant,
} from "./components/NotificationCenter/NotificationCenter";
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
export { default as SliderArrow } from "./components/SliderArrow/SliderArrow";

export { default as LineChart } from "./components/LineChart/LineChart";
export type {
  LineChartSeriesType,
  VariantType as LineChartVariantType,
} from "./components/LineChart/types";

export { default as DonutChart } from "./components/DonutChart/DonutChart";
export type { VariantType as DonutChartVariantType } from "./components/DonutChart/types";

export { default as Banner } from "./components/Banner/Banner";
export type {
  BannerProps,
  BannerVariant,
  BannerPosition,
} from "./components/Banner/Banner";
export { default as Spotlight } from "./components/Spotlight/Spotlight";
export type {
  SpotlightProps,
  SpotlightPlacement,
} from "./components/Spotlight/types";

// Feedback — Motion primitives
export { default as NumberTicker } from "./components/NumberTicker/NumberTicker";
export type { NumberTickerProps } from "./components/NumberTicker/NumberTicker";
export { default as TypingAnimation } from "./components/TypingAnimation/TypingAnimation";
export type { TypingAnimationProps } from "./components/TypingAnimation/TypingAnimation";
export { default as Particles } from "./components/Particles/Particles";
export type { ParticlesProps } from "./components/Particles/Particles";

// Icons
export { content as iconContent } from "./icons";
export type { IAvailableIcons } from "./icons";
