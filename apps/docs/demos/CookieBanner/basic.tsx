'use client';
import { CookieBanner } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    // A `transform` makes this the containing block for the banner's
    // `position: fixed`, so it renders at the bottom inside the example frame.
    <div
      style={{ transform: 'translateZ(0)' }}
      className="relative w-full overflow-hidden h-[320px] rounded-16px bg-black_1 p-20px"
    >
      <div className="h-16px w-1/3 rounded-8px bg-black_3" />
      <div className="mt-12px h-12px w-3/4 rounded-8px bg-black_3" />
      <div className="mt-8px h-12px w-2/3 rounded-8px bg-black_3" />
      <CookieBanner
        title="We use cookies"
        description="This website uses cookies to ensure you get the best experience on our website."
        acceptText="Accept"
        declineText="Decline"
        privacyHref="/privacy"
        privacyLabel="Privacy Policy"
        onAccept={() => console.log('Cookies accepted')}
        onDecline={() => console.log('Cookies declined')}
      />
    </div>
  );
}
