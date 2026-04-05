import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'icons/index': 'src/icons/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
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
    'react-apexcharts',
    'apexcharts',
    'libphonenumber-js',
  ],
  clean: true,
  treeshake: true,
});
