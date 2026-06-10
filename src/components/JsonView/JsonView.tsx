"use client";

import { forwardRef, useState } from "react";
import classNames from "classnames";

export interface JsonViewProps extends React.HTMLAttributes<HTMLDivElement> {
  data: unknown;
  /**
   * Initial collapse depth.
   * `true`    — collapses everything (only root visible, collapsed).
   * `false`   — expands all nodes.
   * `number`  — nodes at depth >= collapsed start collapsed; shallower nodes open.
   * Default: 1
   */
  collapsed?: number | boolean;
  /** Show copy-JSON button. Default: true */
  copy?: boolean;
  /** Indent size in spaces. Default: 2 */
  indent?: number;
}

// ─── inline SVGs (no external dep) ─────────────────────────────────────────

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

/** Determine whether a node at `depth` should start collapsed. */
function shouldCollapse(depth: number, collapsed: number | boolean): boolean {
  if (collapsed === true) return true;
  if (collapsed === false) return false;
  // number: collapse at depth >= collapsed
  return depth >= collapsed;
}

// ─── primitive renderer ───────────────────────────────────────────────────────

function PrimitiveValue({ value }: { value: unknown }) {
  if (typeof value === "string") {
    return <span className="text-success">&quot;{value}&quot;</span>;
  }
  if (typeof value === "number") {
    return <span className="text-pr_blue">{String(value)}</span>;
  }
  if (typeof value === "boolean") {
    return <span className="text-pr_purple">{String(value)}</span>;
  }
  if (value === null) {
    return <span className="text-fg-muted">null</span>;
  }
  // undefined, symbol, function — show as string
  return <span className="text-fg-muted">{String(value)}</span>;
}

// ─── recursive node renderer ──────────────────────────────────────────────────

interface JsonNodeProps {
  value: unknown;
  depth: number;
  collapsed: number | boolean;
  indent: number;
  /** Property key this node is under, if any */
  label?: string;
}

function JsonNode({ value, depth, collapsed, indent, label }: JsonNodeProps) {
  const [open, setOpen] = useState(() => !shouldCollapse(depth, collapsed));

  const indentStyle: React.CSSProperties = {
    paddingLeft: indent * 8,
  };

  const labelEl =
    label !== undefined ? (
      <span className="text-fg-muted">&quot;{label}&quot;: </span>
    ) : null;

  // ── Object ──────────────────────────────────────────────────────────────
  if (isObject(value)) {
    const entries = Object.entries(value);
    const summary = `{ ${entries.length} ${entries.length === 1 ? "key" : "keys"} }`;

    return (
      <div style={indentStyle}>
        <details
          open={open}
          onToggle={(e) =>
            setOpen((e.currentTarget as HTMLDetailsElement).open)
          }
        >
          <summary className="list-none cursor-pointer select-none hover:opacity-70 outline-none">
            {labelEl}
            <span className="text-fg-muted">{open ? "{" : summary}</span>
          </summary>
          <div>
            {entries.map(([k, v]) => (
              <JsonNode
                key={k}
                value={v}
                depth={depth + 1}
                collapsed={collapsed}
                indent={indent}
                label={k}
              />
            ))}
            <span className="text-fg-muted">{"}"}</span>
          </div>
        </details>
      </div>
    );
  }

  // ── Array ────────────────────────────────────────────────────────────────
  if (isArray(value)) {
    const summary = `[ ${value.length} ${value.length === 1 ? "item" : "items"} ]`;

    return (
      <div style={indentStyle}>
        <details
          open={open}
          onToggle={(e) =>
            setOpen((e.currentTarget as HTMLDetailsElement).open)
          }
        >
          <summary className="list-none cursor-pointer select-none hover:opacity-70 outline-none">
            {labelEl}
            <span className="text-fg-muted">{open ? "[" : summary}</span>
          </summary>
          <div>
            {value.map((item, i) => (
              <JsonNode
                key={i}
                value={item}
                depth={depth + 1}
                collapsed={collapsed}
                indent={indent}
                label={String(i)}
              />
            ))}
            <span className="text-fg-muted">{"]"}</span>
          </div>
        </details>
      </div>
    );
  }

  // ── Primitive ────────────────────────────────────────────────────────────
  return (
    <div style={indentStyle}>
      {labelEl}
      <PrimitiveValue value={value} />
    </div>
  );
}

// ─── public component ─────────────────────────────────────────────────────────

const JsonView = forwardRef<HTMLDivElement, JsonViewProps>(function JsonView(
  { data, collapsed = 1, copy = true, indent = 2, className, ...rest },
  ref,
) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, indent));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      ref={ref}
      className={classNames(
        "relative font-mono text-12 text-fg-primary bg-black_2 rounded-12px p-16px overflow-auto",
        className,
      )}
      {...rest}
    >
      {copy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy JSON"}
          className="absolute top-12px right-12px flex items-center gap-4px text-11 text-fg-muted hover:text-fg-primary cursor-pointer bg-transparent border-0 p-4px rounded-4px"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      )}
      <JsonNode value={data} depth={0} collapsed={collapsed} indent={indent} />
    </div>
  );
});

export default JsonView;
