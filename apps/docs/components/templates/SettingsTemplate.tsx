'use client';

import { useState } from 'react';
import {
  Container,
  PageHeader,
  Tabs,
  Input,
  Switch,
  SelectInput,
  RadioGroup,
  Avatar,
  Badge,
  CardWrapper,
  Button,
} from '@sagtech-infra/ui';

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

function SectionHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col gap-4px mb-24px">
      <h3 className="font-orbitron text-18 font-semibold text-fg-primary">{title}</h3>
      <p className="font-manrope text-14 text-fg-muted">{hint}</p>
    </div>
  );
}

export default function SettingsTemplate() {
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

  const profile = (
    <div className="flex flex-col gap-32px py-32px max-w-[640px]">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16px">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16px">
        <div className="flex flex-col gap-6px">
          <span className="font-manrope text-12 text-fg-secondary">Timezone</span>
          <SelectInput
            options={TIMEZONE_OPTIONS}
            value={timezone}
            onChange={setTimezone}
            placeholder="Select timezone"
          />
        </div>
        <div className="flex flex-col gap-6px">
          <span className="font-manrope text-12 text-fg-secondary">Language</span>
          <SelectInput
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={setLanguage}
            placeholder="Select language"
          />
        </div>
      </div>
    </div>
  );

  const notifications = (
    <div className="flex flex-col gap-24px py-32px max-w-[640px]">
      <SectionHeading
        title="Notifications"
        hint="Choose how and when SagTech reaches out to you."
      />
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
    </div>
  );

  const security = (
    <div className="flex flex-col gap-32px py-32px max-w-[640px]">
      <div className="flex flex-col gap-16px">
        <SectionHeading title="Password" hint="Use at least 12 characters with a mix of types." />
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

      <div className="flex flex-col gap-16px">
        <SectionHeading title="Two-factor authentication" hint="Add an extra layer of protection." />
        <Switch
          checked={twoFactor}
          onChange={setTwoFactor}
          label="Authenticator app (2FA)"
          description="Require a one-time code at sign-in."
        />
      </div>

      <div className="flex flex-col gap-12px">
        <SectionHeading title="Session timeout" hint="Automatically sign out after inactivity." />
        <RadioGroup
          name="session-timeout"
          options={TIMEOUT_OPTIONS}
          value={sessionTimeout}
          onChange={setSessionTimeout}
        />
      </div>
    </div>
  );

  const billing = (
    <div className="flex flex-col gap-16px py-32px max-w-[640px]">
      <SectionHeading title="Billing" hint="Your current plan and upcoming charges." />
      <CardWrapper rounded="16" stoke="2" className="p-24px">
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
      </CardWrapper>

      <CardWrapper rounded="16" stoke="2" className="p-24px">
        <div className="flex items-center justify-between gap-16px">
          <div className="flex flex-col gap-4px">
            <p className="font-manrope text-16 text-fg-primary">Payment method</p>
            <p className="font-manrope text-14 text-fg-muted">Visa ending in 4242</p>
          </div>
          <Badge variant="subtle" color="success" size="sm" dot>
            Active
          </Badge>
        </div>
      </CardWrapper>

      <div className="flex items-center gap-12px mt-8px">
        <Button text="Manage subscription" variant="secondary" buttonSize="small" />
        <Button text="Download invoices" variant="secondary" buttonSize="small" />
      </div>
    </div>
  );

  const tabs = [
    { label: 'Profile', content: profile },
    { label: 'Notifications', content: notifications },
    { label: 'Security', content: security },
    { label: 'Billing', content: billing },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pb-[120px]">
      <Container size="lg" className="py-48px">
        <PageHeader
          eyebrow="Account"
          title="Settings"
          subtitle="Manage your profile, notifications, security and billing."
          actions={<Avatar name="Alex Rivera" size="md" status="online" />}
        />

        <Tabs items={tabs} defaultValue="tab-0" />
      </Container>

      <div className="fixed bottom-0 inset-x-0 border-t border-border-default bg-bg-secondary">
        <Container size="lg" className="py-16px">
          <div className="flex items-center justify-between gap-16px">
            <span className="font-manrope text-14 text-fg-muted">Unsaved changes</span>
            <div className="flex items-center gap-12px">
              <Button text="Cancel" variant="secondary" buttonSize="small" />
              <Button text="Save changes" variant="primary" buttonSize="small" />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
