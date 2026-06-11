'use client';

import { useState, type ReactNode } from 'react';
import cn from 'classnames';
import Button from '@/components/Button/Button';
import Typography from '@/components/Typography/Typography';

export interface CookieBannerProps {
  title?: string;
  description?: string;
  acceptText?: string;
  declineText?: string;
  privacyHref?: string;
  privacyLabel?: string;
  cookieName?: string;
  cookieMaxAge?: number;
  onAccept?: () => void;
  onDecline?: () => void;
  /**
   * Where the banner anchors. 'bottom' (default) preserves the existing
   * placement; 'top' renders the banner at the top of the viewport.
   */
  position?: 'top' | 'bottom';
  /**
   * Optional custom content slot. When provided, replaces the default
   * title/description block. The Accept / Decline buttons still render.
   */
  children?: ReactNode;
}

function setCookieValue(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export default function CookieBanner({
  title = 'We use cookies',
  description = 'This website uses cookies to ensure you get the best experience on our website.',
  acceptText = 'Accept',
  declineText = 'Decline',
  privacyHref = '/privacy',
  privacyLabel = 'Privacy Policy',
  cookieName = 'consent',
  cookieMaxAge = 365 * 24 * 60 * 60,
  onAccept,
  onDecline,
  position = 'bottom',
  children,
}: CookieBannerProps) {
  const [isHidden, setHidden] = useState<boolean>(false);

  const acceptConsent = () => {
    setCookieValue(cookieName, 'true', cookieMaxAge);
    setHidden(true);
    onAccept?.();
  };

  const declineConsent = () => {
    setCookieValue(cookieName, 'false', cookieMaxAge);
    setHidden(true);
    onDecline?.();
  };

  return (
    <div
      style={{ zIndex: 'var(--z-banner)' }}
      className={cn(
        'fixed left-[0px] right-[0px] w-full transition-transform',
        position === 'top' ? 'top-[0px]' : 'bottom-[0px]',
        isHidden && (position === 'top' ? '-translate-y-full' : 'translate-y-full'),
      )}
    >
      <div
        className={cn(
          'rounded-halfRound bg-pr_purple px-16px py-24px sm:px-40px',
          !isHidden && 'shadow-6xl',
          isHidden && 'shadow-none',
        )}
      >
        {children ? (
          <div className="text-center">{children}</div>
        ) : (
          <div className="text-center">
            <h1 className="text-16 font-semibold leading-24 text-white">{title}</h1>
            <p className="mt-4px text-14 font-medium leading-24 text-white">
              {description}
              {privacyHref && (
                <>
                  {' '}
                  Read our&nbsp;
                  <a href={privacyHref}>
                    <span className="underline text-white">{privacyLabel}</span>
                  </a>
                </>
              )}
            </p>
          </div>
        )}
        <div className="mt-16px flex items-center justify-center gap-8px">
          <Button
            useIcon={false}
            variant="primary"
            hoverOff
            type="submit"
            buttonSize="small"
            loadingType={false}
            onClick={acceptConsent}
            classes="bg-white button"
            changeColor
          >
            <Typography text={acceptText} type="Buttons" className="!text-14" color="text-pr_purple" />
          </Button>
          <Button
            onClick={declineConsent}
            useIcon={false}
            variant="secondary"
            type="submit"
            buttonSize="small"
            classes="button h-[32px]"
          >
            <Typography text={declineText} type="Buttons" className="!text-14" color="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
