'use client';

import type { MutableRefObject } from 'react';
import { useState, useRef, useEffect } from 'react';

type UseIntersectionObserver = (
  options: IntersectionObserverInit | undefined,
) => [MutableRefObject<HTMLDivElement | null>, boolean];

const useIntersectionObserver: UseIntersectionObserver = (options) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);
    const ref = containerRef?.current;

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

export default useIntersectionObserver;
