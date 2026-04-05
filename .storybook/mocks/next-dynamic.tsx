import React from 'react';

type DynamicOptions = {
  ssr?: boolean;
  loading?: () => React.ReactNode;
};

function dynamic<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  _options?: DynamicOptions,
) {
  const LazyComponent = React.lazy(importFn);

  return function DynamicComponent(props: React.ComponentProps<T>) {
    return (
      <React.Suspense fallback={_options?.loading?.() || null}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

export default dynamic;
