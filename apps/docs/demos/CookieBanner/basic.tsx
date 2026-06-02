'use client';
import { CookieBanner } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="relative w-full min-h-[200px]">
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
