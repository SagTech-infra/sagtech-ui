import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'icons/index': 'src/icons/index.ts',
    '3d/index': 'src/3d/index.ts',
    'charts/index': 'src/charts/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: false,
  // esbuild strips module-level "use client" directives when bundling, breaking
  // React Server Components consumers. tsup's pipeline re-strips anything an
  // esbuild plugin re-injects, so instead we stamp the directive onto the client
  // entry files after a successful build: the directive on the entry makes the
  // whole imported graph a client boundary in RSC, so the shared chunks don't
  // each need it, and icons stays server-safe. See scripts/add-use-client.mjs,
  // scripts/check-directives.mjs, and ADR-0005.
  onSuccess: 'node scripts/add-use-client.mjs',
  external: [
    'react',
    'react-dom',
    'next',
    'next/image',
    'next/link',
    'next/dynamic',
    'classnames',
    'framer-motion',
    'swiper',
    'swiper/react',
    'swiper/modules',
    'swiper/css',
    'react-hook-form',
    'react-international-phone',
    'libphonenumber-js',
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
    '@tanstack/react-virtual',
    '@tiptap/core',
    '@tiptap/extension-code-block-lowlight',
    '@tiptap/extension-image',
    '@tiptap/extension-mention',
    '@tiptap/pm',
    '@tiptap/pm/state',
    '@tiptap/pm/view',
    '@tiptap/react',
    '@tiptap/starter-kit',
    '@tiptap/suggestion',
    '@xyflow/react',
    'lowlight',
    'three',
    'three/*',
    '@react-three/fiber',
    '@react-three/drei',
    'react-force-graph-3d',
    'react-resizable-panels',
  ],
  clean: true,
  treeshake: true,
});
