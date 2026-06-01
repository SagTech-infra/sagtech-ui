import type { ReactNode, Ref } from "react";

/**
 * A single node in the tree.
 *
 * `children` may be omitted for leaf nodes, or omitted alongside
 * `hasChildren: true` to signal a branch whose children are lazy-loaded via
 * `TreeViewProps.loadChildren`.
 */
export interface TreeNode {
  /** Stable unique identifier. */
  id: string;
  /** Rendered label (string or arbitrary node). */
  label: ReactNode;
  /** Already-loaded child nodes. */
  children?: TreeNode[];
  /** Marks a branch with not-yet-loaded children (enables lazy loading). */
  hasChildren?: boolean;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Disabled nodes are skipped by keyboard navigation and not selectable. */
  disabled?: boolean;
}

export interface TreeViewProps {
  /** Root-level nodes. */
  nodes: TreeNode[];

  /** Controlled set of expanded node ids. */
  expandedIds?: string[];
  /** Called when the expanded set changes (controlled or uncontrolled). */
  onExpandedChange?: (ids: string[]) => void;
  /** Uncontrolled initial expanded ids. */
  defaultExpandedIds?: string[];

  /** Controlled selected node id. */
  selectedId?: string;
  /** Called when a node is selected. */
  onSelect?: (id: string) => void;
  /** Uncontrolled initial selected id. */
  defaultSelectedId?: string;

  /**
   * Lazy loader. Called when expanding a node whose `children` are not yet
   * loaded but `hasChildren` is true. Resolved children replace the node's
   * children for the lifetime of the component.
   */
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;

  /** Accessible name for the tree (use this or `aria-labelledby`). */
  "aria-label"?: string;
  /** Id of an element labelling the tree. */
  "aria-labelledby"?: string;

  /** Extra class names for the root `<ul role="tree">`. */
  className?: string;
  /** Ref to the root list element. */
  ref?: Ref<HTMLUListElement>;
}
