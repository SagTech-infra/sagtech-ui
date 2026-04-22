// Providers
export {
  SagtechUIProvider,
  UIComponentsContext,
  useImageComponent,
  useLinkComponent,
  DefaultImageShim,
  DefaultLinkShim,
} from './providers';
export type {
  SagtechUIProviderProps,
  UIComponentsContextValue,
  UIImageComponent,
  UIImageProps,
  UILinkComponent,
  UILinkProps,
} from './providers';

// Hooks
export {
  useWindowSize,
  useDeviceType,
  useIntersectionObserver,
  useOutsideClick,
  useModals,
} from './hooks';

// Utils
export {
  getCurrencySymbol,
  formatSalary,
  calculateQuarters,
  formatDate,
  getCompanyAge,
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
} from './utils';

// Components — Foundations
export { default as Typography } from './components/Typography/Typography';
export type { TypographyTypes } from './components/Typography/Typography';
export type { VariantTypoTags, VariantTypoTagsStyles, VariantTypoColors } from './components/Typography/types';
export { Icon } from './components/Icon/Icon';
export { default as Skeleton } from './components/Skeleton/Skeleton';
export { default as Divider } from './components/Divider/Divider';

// Components — Form Controls
export { default as Button } from './components/Button/Button';
export { default as Input } from './components/Input/Input';
export { default as TextArea } from './components/TextArea/TextArea';
export { default as Checkbox } from './components/Checkbox/Checkbox';
export { default as SearchBar } from './components/SearchBar/SearchBar';
export { default as Toggle } from './components/Toggle/Toggle';
export { default as Attachment } from './components/Attachment/Attachment';
export { default as PhoneInput } from './components/PhoneInput/PhoneInput';
export { default as SelectInput } from './components/SelectInput/SelectInput';
export type { SelectOption } from './components/SelectInput/types';
export { default as Combobox } from './components/Combobox/Combobox';
export type {
  ComboboxOption,
  ComboboxProps,
  ComboboxCommonProps,
} from './components/Combobox/types';
export { default as RadioGroup } from './components/RadioGroup/RadioGroup';
export type { RadioGroupProps, RadioOption } from './components/RadioGroup/RadioGroup';
export { default as DatePicker } from './components/DatePicker/DatePicker';
export type { DatePickerProps } from './components/DatePicker/DatePicker';
export { default as Dropzone } from './components/Dropzone/Dropzone';
export type { DropzoneProps } from './components/Dropzone/Dropzone';
export { default as DropdownMenu } from './components/DropdownMenu/DropdownMenu';
export type { DropdownMenuProps, MenuItem } from './components/DropdownMenu/DropdownMenu';
export { default as TagInput } from './components/TagInput/TagInput';
export type { TagInputProps } from './components/TagInput/TagInput';

export { default as FaqDropdown } from './components/FaqDropdown/FaqDropdown';
export { default as FaqList } from './components/FaqDropdown/FaqList';

export { default as InfoTabs } from './components/InfoTabs/InfoTabs';
export type { InfoTab } from './components/InfoTabs/types';

export { default as Timeline } from './components/Timeline/Timeline';

// Components — Layout
export { Modal } from './components/Modal/Modal';
export {
  ConfirmDialog,
  ConfirmProvider,
  useConfirm,
  ConfirmContext,
} from './components/Confirm';
export type {
  ConfirmDialogProps,
  ConfirmProviderProps,
  ConfirmFn,
  ConfirmOptions,
  ConfirmVariant,
} from './components/Confirm';
export { default as CardWrapper } from './components/CardWrapper/CardWrapper';
export { default as SectionTag } from './components/SectionTag/SectionTag';
export { default as Sidebar } from './components/Sidebar/Sidebar';
export type { SidebarProps, SidebarItem } from './components/Sidebar/Sidebar';
export { default as Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './components/Breadcrumbs/Breadcrumbs';
export { default as Drawer } from './components/Drawer/Drawer';
export { default as CommandPalette } from './components/CommandPalette/CommandPalette';

// Components — Data Display
export { default as Avatar } from './components/Avatar/Avatar';
export type { AvatarProps } from './components/Avatar/Avatar';
export { default as AvatarCard } from './components/AvatarCard/AvatarCard';
export { default as ResultPill } from './components/ResultPill/ResultPill';
export { default as Point } from './components/Point/Point';
export { default as Steps } from './components/Steps/Steps';
export { default as Image, ForwardedImage } from './components/Image/Image';
export type { ImageProps } from './components/Image/Image';
export { default as LazyImage } from './components/LazyImage/LazyImage';
export { default as Badge } from './components/Badge/Badge';
export { default as Tooltip } from './components/Tooltip/Tooltip';
export { default as Popover } from './components/Popover/Popover';
export type { PopoverProps } from './components/Popover/Popover';
export { default as Tabs } from './components/Tabs/Tabs';
export { default as Table } from './components/Table/Table';
export type { TableProps, Column } from './components/Table/Table';
export { default as Pagination } from './components/Pagination/Pagination';
export type { PaginationProps } from './components/Pagination/Pagination';
export { default as StatCard } from './components/StatCard/StatCard';
export type { StatCardProps } from './components/StatCard/StatCard';

// Components — Feedback
export { default as EmptyState } from './components/EmptyState/EmptyState';
export type { EmptyStateProps } from './components/EmptyState/EmptyState';
export { default as ProgressBar } from './components/ProgressBar/ProgressBar';
export type { ProgressBarProps } from './components/ProgressBar/ProgressBar';
export { default as AnimationButton } from './components/AnimationButton/AnimationButton';
export { default as CookieBanner } from './components/CookieBanner/CookieBanner';
export type { CookieBannerProps } from './components/CookieBanner/CookieBanner';
export { Notification } from './components/Notification/Notification';
export { default as NotificationWrapper } from './components/Notification/NotificationWrapper';
export { NotificationContext } from './components/Notification/NotificationContext';
export { default as SliderArrow } from './components/SliderArrow/SliderArrow';

export { default as LineChart } from './components/LineChart/LineChart';
export type { LineChartSeriesType, VariantType as LineChartVariantType } from './components/LineChart/types';

export { default as DonutChart } from './components/DonutChart/DonutChart';
export type { VariantType as DonutChartVariantType } from './components/DonutChart/types';

// Icons
export { content as iconContent } from './icons';
export type { IAvailableIcons } from './icons';
