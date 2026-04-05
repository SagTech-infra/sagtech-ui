'use client';

import { useMemo } from 'react';
import useWindowSize from './useWindowSize';

export default function useDeviceType() {
  const size = useWindowSize();
  const desktop = useMemo(() => size && size >= 1440, [size]);
  const tab = useMemo(() => size && size >= 767 && size <= 1439, [size]);
  const mobile = useMemo(() => size && size >= 320 && size <= 767, [size]);

  return { desktop, mobile, tab };
}
