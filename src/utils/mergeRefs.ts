import type { Ref, RefCallback } from 'react';

/**
 * Combines any number of React refs (object or callback) into a single
 * ref callback. Useful when a component needs to forward an external
 * ref while also keeping its own internal ref on the same DOM node.
 *
 * Null refs are ignored.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}
