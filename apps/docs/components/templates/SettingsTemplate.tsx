'use client';

import { useState } from 'react';
import {
  Container,
  PageHeader,
  Input,
  Switch,
  SelectInput,
  RadioGroup,
  Avatar,
  Badge,
  CardWrapper,
  Button,
} from '@sagtech-infra/ui';

type Section = 'profile' | 'notifications' | 'security' | 'billing';

const TIMEZONE_OPTIONS = [
  { label: '(UTC-08:00) Pacific Time', value: 'pst' },
  { label: '(UTC+00:00) London', value: 'gmt' },
  { label: '(UTC+01:00) Berlin', value: 'cet' },
  { label: '(UTC+03:00) Moscow', value: 'msk' },
  { label: '(UTC+09:00) Tokyo', value: 'jst' },
];

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Русский', value: 'ru' },
  { label: '日本語', value: 'ja' },
];

const TIMEOUT_OPTIONS = [
  { label: '15 minutes', value: '15', description: 'Best for shared devices' },
  { label: '1 hour', value: '60', description: 'Balanced for daily work' },
  { label: '8 hours', value: '480', description: 'Full workday, trusted device' },
  { label: 'Never', value: 'never', description: 'Stay signed in indefinitely' },
];

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'billing', label: 'Billing' },
];

function SectionHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col gap-4px">
      <h3 className="font-orbitron text-18 font-semibold text-fg-primary">{title}</h3>
      <p className="font-manrope text-14 text-fg-muted">{hint}</p>
    </div>
  );
}

function PanelCard({
  title,
  hint,
  children,
  footer,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <CardWrapper rounded="16" stoke="2" className="overflow-hidden">
      <div className="flex flex-col gap-24px p-24px">
        <SectionHeading title={title} hint={hint} />
        {children}
      </div>
      {footer && (
        <div className="flex items-center justify-end gap-12px border-t border-border-default bg-bg-secondary px-24px py-16px">
          {footer}
        </div>
      )}
    </CardWrapper>
  );
}

export default function SettingsTemplate() {
  const [section, setSection] = useState<Section>('profile');

  // Profile
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex@sagtech.io');
  const [timezone, setTimezone] = useState('cet');
  const [language, setLanguage] = useState('en');

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(false);

  // Security
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');

  const saveFooter = (
    <>
      <Button text="Cancel" variant="secondary" buttonSize="small" />
      <Button text="Save changes" variant="primary" buttonSize="small" />
    </>
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      <Container size="lg" className="py-48px">
        <PageHeader
          eyebrow="Account"
          title="Settings"
          subtitle="Manage your profile, notifications, security and billing."
          actions={<Avatar name="Alex Rivera" size="md" status="online" />}
        />

        <div className="mt-32px grid gap-32px lg:grid-cols-[220px_1fr]">
          {/* Section nav */}
          <nav className="lg:sticky lg:top-24px lg:self-start">
            <ul className="flex flex-col gap-4px">
              {SECTIONS.map((item) => {
                const active = item.id === section;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSection(item.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex w-full items-center gap-12px rounded-12px border-l-2 px-16px py-10px text-left font-manrope text-14 transition-colors ${
                        active
                          ? 'border-pr_purple bg-bg-tertiary text-fg-primary'
                          : 'border-transparent text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Active panel */}
          <div className="flex flex-col gap-24px">
            {section === 'profile' && (
              <PanelCard
                title="Profile"
                hint="This information is visible to your team."
                footer={saveFooter}
              >
                <div className="flex items-center gap-24px">
                  <Avatar name={name} size="xl" status="online" />
                  <div className="flex flex-col gap-8px">
                    <p className="font-manrope text-16 text-fg-primary">Profile photo</p>
                    <div className="flex items-center gap-12px">
                      <Button text="Change" variant="secondary" buttonSize="small" />
                      <Button text="Remove" variant="secondary" buttonSize="small" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-16px sm:grid-cols-2">
                  <Input
                    label="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                  <Input
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid gap-16px sm:grid-cols-2">
                  <div className="flex flex-col gap-6px">
                    <span className="font-manrope text-12 font-bold leading-18 text-fg-secondary">
                      Timezone
                    </span>
                    <SelectInput
                      options={TIMEZONE_OPTIONS}
                      value={timezone}
                      onChange={setTimezone}
                      placeholder="Select timezone"
                    />
                  </div>
                  <div className="flex flex-col gap-6px">
                    <span className="font-manrope text-12 font-bold leading-18 text-fg-secondary">
                      Language
                    </span>
                    <SelectInput
                      options={LANGUAGE_OPTIONS}
                      value={language}
                      onChange={setLanguage}
                      placeholder="Select language"
                    />
                  </div>
                </div>
              </PanelCard>
            )}

            {section === 'notifications' && (
              <PanelCard
                title="Notifications"
                hint="Choose how and when SagTech reaches out to you."
                footer={saveFooter}
              >
                <Switch
                  checked={emailNotif}
                  onChange={setEmailNotif}
                  label="Email notifications"
                  description="Account activity, security alerts and weekly digests."
                />
                <Switch
                  checked={pushNotif}
                  onChange={setPushNotif}
                  label="Push notifications"
                  description="Real-time alerts delivered to your devices."
                />
                <Switch
                  checked={marketingNotif}
                  onChange={setMarketingNotif}
                  label="Product & marketing"
                  description="New features, tips and occasional announcements."
                />
              </PanelCard>
            )}

            {section === 'security' && (
              <>
                <PanelCard
                  title="Password"
                  hint="Use at least 12 characters with a mix of types."
                  footer={
                    <Button text="Update password" variant="primary" buttonSize="small" />
                  }
                >
                  <div className="grid gap-16px sm:grid-cols-2">
                    <Input
                      label="Current password"
                      type="password"
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      placeholder="••••••••"
                    />
                    <Input
                      label="New password"
                      type="password"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </PanelCard>

                <PanelCard
                  title="Two-factor authentication"
                  hint="Add an extra layer of protection at sign-in."
                >
                  <Switch
                    checked={twoFactor}
                    onChange={setTwoFactor}
                    label="Authenticator app (2FA)"
                    description="Require a one-time code at sign-in."
                  />
                </PanelCard>

                <PanelCard
                  title="Session timeout"
                  hint="Automatically sign out after inactivity."
                  footer={saveFooter}
                >
                  <RadioGroup
                    name="session-timeout"
                    options={TIMEOUT_OPTIONS}
                    value={sessionTimeout}
                    onChange={setSessionTimeout}
                  />
                </PanelCard>
              </>
            )}

            {section === 'billing' && (
              <>
                <PanelCard title="Plan" hint="Your current plan and upcoming charges.">
                  <div className="flex items-start justify-between gap-16px">
                    <div className="flex flex-col gap-8px">
                      <div className="flex items-center gap-12px">
                        <h4 className="font-orbitron text-18 text-fg-primary">Pro plan</h4>
                        <Badge variant="subtle" color="purple" size="sm">
                          Current
                        </Badge>
                      </div>
                      <p className="font-manrope text-14 text-fg-muted">
                        Renews on July 1, 2026 · billed annually
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-4px">
                      <span className="font-orbitron text-32 text-fg-primary">$290</span>
                      <span className="font-manrope text-14 text-fg-muted">per year</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-12px">
                    <Button text="Change plan" variant="secondary" buttonSize="small" />
                    <Button text="Cancel subscription" variant="secondary" buttonSize="small" />
                  </div>
                </PanelCard>

                <PanelCard
                  title="Payment method"
                  hint="The card charged for your subscription."
                  footer={
                    <Button text="Download invoices" variant="secondary" buttonSize="small" />
                  }
                >
                  <div className="flex items-center justify-between gap-16px">
                    <div className="flex flex-col gap-4px">
                      <p className="font-manrope text-16 text-fg-primary">Visa ending in 4242</p>
                      <p className="font-manrope text-14 text-fg-muted">Expires 08 / 2027</p>
                    </div>
                    <Badge variant="subtle" color="success" size="sm" dot>
                      Active
                    </Badge>
                  </div>
                </PanelCard>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
