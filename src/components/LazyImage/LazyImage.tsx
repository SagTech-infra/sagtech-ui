'use client';

import { useState, useEffect } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import type { ImageProps } from '@/components/Image/Image';
import { ForwardedImage } from '@/components/Image/Image';

type Props = ImageProps;

export default function LazyImage({ url, ...props }: Props) {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [containerRef, isVisible] = useIntersectionObserver({
    rootMargin: '30%',
    threshold: 0.2,
  });

  useEffect(() => {
    if (isVisible) {
      setImageSrc(url);
    }
  }, [isVisible, url]);

  return <ForwardedImage url={imageSrc} ref={containerRef} {...props} />;
}
