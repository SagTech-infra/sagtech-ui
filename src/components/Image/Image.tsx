'use client';

import cn from 'classnames';
import type { LegacyRef } from 'react';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

export type ImageProps = {
  url?: string;
  url2x?: string;
  alt?: string;
  className?: string;
  maxWidthOn?: boolean;
  rounded?: string;
  classes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  imgHeight?: string | number;
  imgWidth?: string | number;
  containerRef?: LegacyRef<HTMLDivElement>;
  objectPosition?: 'top' | 'left' | 'center' | 'right' | 'bottom' | 'bottom-center';
};

function Image({
  url,
  url2x,
  alt,
  className,
  objectFit,
  imgHeight,
  imgWidth,
  classes,
  rounded,
  maxWidthOn,
  containerRef = null,
  objectPosition,
}: ImageProps) {
  const [imgSrc, setSrc] = useState<string | undefined>();
  const [fallbackSrc, setFallbackSrc] = useState<string | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (url && url !== imgSrc) {
      setSrc(url);
    }
  }, [url]);

  const onLoad = useCallback(() => {
    setError(false);
    setLoading(false);
  }, [setLoading]);

  const onError = useCallback(() => {
    setLoading(false);

    if (url) {
      setError(true);
      setFallbackSrc(url);
    }
  }, [setLoading, url]);

  const isLoadingState = useMemo(
    () => !imgSrc || isLoading || isError,
    [imgSrc, isLoading, isError],
  );

  const containerClasses = useMemo(() => cn(className), [className]);

  const imgClasses = useMemo(
    () =>
      cn(
        maxWidthOn ? 'max-w-full' : 'max-w-none w-full',
        objectFit && 'w-full h-full',
        objectFit === 'cover' && 'object-cover',
        objectFit === 'contain' && 'object-contain',
        objectPosition === 'bottom' && 'object-bottom',
        rounded && `rounded-${rounded}`,
      ),
    [objectFit, maxWidthOn, rounded, objectPosition],
  );

  const srcSet = imgSrc && url2x ? `${imgSrc}, ${url2x} 2x` : undefined;

  return (
    <div ref={containerRef || null} className={containerClasses}>
      {(!imgSrc || isLoading) && !isError && (
        <div className="top-0 left-0 absolute z-[10] h-full w-full overflow-hidden" style={{ borderRadius: rounded ? `${rounded}` : undefined }}>
          <div className="h-full w-full bg-gradient-to-r from-black_2 via-black_3 to-black_2 bg-[length:200%_100%]" style={{ animation: 'shimmer 1.5s infinite' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-grey_1">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
      {isError && (
        <div className="top-0 left-0 absolute z-[10] h-full w-full overflow-hidden flex flex-col items-center justify-center gap-8px bg-black_2" style={{ borderRadius: rounded ? `${rounded}` : undefined }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-error">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-grey_2 font-manrope text-12">Failed to load image</span>
        </div>
      )}

      <picture className="block h-full w-full">
        <img
          width={imgWidth}
          height={imgHeight}
          className={`${imgClasses} ${classes}`}
          src={isError ? fallbackSrc : imgSrc}
          srcSet={srcSet}
          alt={!isLoading && imgSrc ? alt : ''}
          onError={onError}
          onLoad={onLoad}
        />
      </picture>
    </div>
  );
}

const ForwardedImage = forwardRef((props: ImageProps, ref: LegacyRef<HTMLDivElement>) => (
  <Image containerRef={ref} {...props} />
));

ForwardedImage.displayName = 'ForwardedImage';

export { ForwardedImage };
export default Image;
