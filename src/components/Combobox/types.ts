import type { ReactNode } from 'react';

export interface ComboboxOption<V extends string = string> {
  label: string;
  value: V;
  disabled?: boolean;
}

export interface ComboboxCommonProps<V extends string = string> {
  options: Array<ComboboxOption<V>>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  /** Show a search input inside the dropdown. Defaults to true when options > 7. */
  searchable?: boolean;
  /** Controlled search query. Omit for internal client-side filtering. */
  searchValue?: string;
  /** Called with every keystroke in the search box. Use for async/server search. */
  onSearch?: (query: string) => void;
  /** Renders a loading state inside the dropdown (spinner row). */
  loading?: boolean;
  /** Text rendered when the options list is empty. */
  emptyText?: string;
  /** Max height of the options list in px. Default 240. */
  maxHeight?: number;
  /** Show a clear (X) affordance inside the trigger. Default true when there is a value. */
  clearable?: boolean;
  /** Render the dropdown in a React portal. Default true. */
  portal?: boolean;
  /** Custom portal container. Defaults to document.body. */
  portalContainer?: Element | null;
  /** Custom option renderer. */
  renderOption?: (option: ComboboxOption<V>, state: { selected: boolean; active: boolean }) => ReactNode;
  /** Custom trigger value renderer. */
  renderValue?: (selected: Array<ComboboxOption<V>>) => ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  name?: string;
}

export type ComboboxProps<V extends string = string> = ComboboxCommonProps<V> &
  (
    | {
        multiple?: false;
        value: V | null | '';
        onChange: (value: V | null) => void;
      }
    | {
        multiple: true;
        value: Array<V>;
        onChange: (value: Array<V>) => void;
      }
  );
