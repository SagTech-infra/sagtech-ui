'use client';

import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Modal } from '@/components/Modal/Modal';
import Typography from '@/components/Typography/Typography';
import Button from '@/components/Button/Button';
import Badge from '@/components/Badge/Badge';

export interface VariableItem {
  /** Code snippet inserted when user picks this item, e.g. `{{lead.firstName}}`. */
  token: string;
  /** Human-readable label. */
  label: string;
  /** Optional description shown under the label. */
  description?: string;
  /** Optional example value shown in its own column. */
  example?: string;
  /** Category/source tag used by the source-filter, e.g. 'Lead', 'ICP', 'Sender'. */
  source?: string;
}

export interface VariablePickerProps {
  isOpen: boolean;
  onClose: () => void;
  variables: VariableItem[];
  /** Called when the user double-clicks or presses Enter on a row, or hits "Insert". */
  onPick: (variable: VariableItem) => void;
  title?: string;
  searchPlaceholder?: string;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function VariablePicker({
  isOpen,
  onClose,
  variables,
  onPick,
  title = 'Insert variable',
  searchPlaceholder = 'Search variables…',
}: VariablePickerProps) {
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [activeToken, setActiveToken] = useState<string | null>(null);

  const sources = useMemo(() => {
    const set = new Set<string>();
    variables.forEach((v) => {
      if (v.source) set.add(v.source);
    });
    return Array.from(set).sort();
  }, [variables]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return variables.filter((v) => {
      if (sourceFilter && v.source !== sourceFilter) return false;
      if (!q) return true;
      return (
        v.token.toLowerCase().includes(q) ||
        v.label.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.example?.toLowerCase().includes(q)
      );
    });
  }, [variables, query, sourceFilter]);

  const activeVariable = filtered.find((v) => v.token === activeToken) ?? filtered[0];

  const handleInsert = () => {
    if (activeVariable) {
      onPick(activeVariable);
      onClose();
    }
  };

  const handleCopy = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
    } catch {
      /* ignore */
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      size="md"
      title={title}
      footer={
        <>
          <Button text="Cancel" variant="secondary" buttonSize="small" onClick={onClose} />
          <Button
            text="Insert"
            variant="primary"
            buttonSize="small"
            onClick={handleInsert}
            disabled={!activeVariable}
          />
        </>
      }
    >
      <div className="flex flex-col gap-12px">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          autoFocus
          className="bg-black_1 border border-solid border-black_3 focus:border-pr_purple rounded-8px h-40px px-12px text-14 text-white_4 font-manrope outline-none transition-colors"
        />

        {sources.length > 0 && (
          <div className="flex items-center gap-8px flex-wrap">
            <button
              type="button"
              onClick={() => setSourceFilter(null)}
              className={classNames(
                'text-12 px-10px py-4px rounded-circle font-manrope transition-colors cursor-pointer',
                sourceFilter === null
                  ? 'bg-pr_purple text-white'
                  : 'border border-solid border-grey_1 text-grey_4 hover:text-white_4 hover:border-white_4',
              )}
            >
              All
            </button>
            {sources.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSourceFilter(s)}
                className={classNames(
                  'text-12 px-10px py-4px rounded-circle font-manrope transition-colors cursor-pointer',
                  sourceFilter === s
                    ? 'bg-pr_purple text-white'
                    : 'border border-solid border-grey_1 text-grey_4 hover:text-white_4 hover:border-white_4',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="border border-solid border-black_3 rounded-8px overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-32px text-center">
              <Typography tag="p" color="text-grey_2" type="BodyS">
                No variables match your filters
              </Typography>
            </div>
          ) : (
            <ul role="listbox" aria-label="Variables">
              {filtered.map((v) => {
                const isActive = activeVariable?.token === v.token;
                return (
                  <li
                    key={v.token}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => setActiveToken(v.token)}
                    onDoubleClick={() => {
                      onPick(v);
                      onClose();
                    }}
                    className={classNames(
                      'px-12px py-10px border-b border-solid border-black_3 last:border-b-0 cursor-pointer transition-colors',
                      {
                        'bg-pr_purple/10': isActive,
                        'hover:bg-black_2': !isActive,
                      },
                    )}
                  >
                    <div className="flex items-start justify-between gap-12px">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-8px">
                          <code className="text-12 font-mono text-pr_purple break-all">{v.token}</code>
                          {v.source && <Badge color="purple" variant="subtle" size="sm">{v.source}</Badge>}
                        </div>
                        <div className="mt-2px text-14 text-white_4 font-manrope">{v.label}</div>
                        {v.description && (
                          <div className="mt-2px text-12 text-grey_4 font-manrope">
                            {v.description}
                          </div>
                        )}
                        {v.example && (
                          <div className="mt-4px text-12 text-grey_2 font-manrope italic">
                            Example: {v.example}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label={`Copy ${v.token}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(v.token);
                        }}
                        className="text-grey_4 hover:text-white_4 cursor-pointer shrink-0 p-4px"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
