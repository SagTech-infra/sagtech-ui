'use client';

import classNames from 'classnames';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

export interface InlineEditProps {
  value: string;
  onSave: (next: string) => void | Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  validate?: (next: string) => string | null;
  autoFocus?: boolean;
  className?: string;
  /** Render function for the read-mode display. Defaults to a plain text span. */
  renderDisplay?: (value: string) => React.ReactNode;
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function InlineEdit({
  value,
  onSave,
  onCancel,
  placeholder,
  disabled = false,
  multiline = false,
  validate,
  autoFocus = true,
  className,
  renderDisplay,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && autoFocus) {
      const el = inputRef.current;
      el?.focus();
      el?.select?.();
    }
  }, [editing, autoFocus]);

  const cancel = useCallback(() => {
    setDraft(value);
    setError(null);
    setEditing(false);
    onCancel?.();
  }, [value, onCancel]);

  const commit = useCallback(async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }
    const validationError = validate ? validate(draft) : null;
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setSaving(true);
      await onSave(draft);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [draft, value, onSave, validate]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
      return;
    }
    if (event.key === 'Enter' && !multiline) {
      event.preventDefault();
      void commit();
      return;
    }
    if (event.key === 'Enter' && multiline && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void commit();
    }
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => !disabled && setEditing(true)}
        disabled={disabled}
        className={classNames(
          'group inline-flex items-center gap-8px rounded-8px px-8px py-4px -mx-8px font-manrope text-14 text-fg-primary cursor-text transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent',
          {
            'hover:bg-black_2': !disabled,
          },
          className,
        )}
      >
        {renderDisplay ? (
          renderDisplay(value || '')
        ) : (
          <span className={value ? '' : 'text-fg-muted italic'}>
            {value || placeholder || 'Click to edit'}
          </span>
        )}
        <span className="opacity-0 group-hover:opacity-60 text-fg-muted transition-opacity">
          <PencilIcon />
        </span>
      </button>
    );
  }

  const InputTag = multiline ? 'textarea' : 'input';

  return (
    <div className={classNames('flex flex-col gap-4px', className)}>
      <InputTag
        ref={inputRef as never}
        value={draft}
        onChange={(e) => {
          setDraft(e.currentTarget.value);
          if (error) setError(null);
        }}
        onBlur={() => {
          if (!saving) void commit();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={saving}
        aria-invalid={Boolean(error) || undefined}
        {...(multiline ? { rows: 3 } : {})}
        className="bg-black_1 border border-solid border-pr_purple rounded-8px px-8px py-4px text-14 text-fg-primary font-manrope outline-none w-full min-w-[120px] resize-y"
      />
      {error && (
        <span className="text-12 font-manrope text-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
