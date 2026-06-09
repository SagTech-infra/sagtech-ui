'use client';

import { useState } from 'react';
import {
  Container,
  Input,
  RadioGroup,
  CardWrapper,
  Avatar,
  Badge,
  Button,
  Divider,
} from '@sagtech-infra/ui';

interface LineItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
}

const ITEMS: LineItem[] = [
  { id: 'p1', name: 'Aurora Hoodie', variant: 'Charcoal · M', price: 89, qty: 1 },
  { id: 'p2', name: 'Orbit Sneakers', variant: 'White · 42', price: 140, qty: 1 },
  { id: 'p3', name: 'Mesh Tote Bag', variant: 'Purple', price: 38, qty: 2 },
];

const DELIVERY_OPTIONS = [
  { label: 'Standard — 4-6 business days', value: 'standard', description: 'Free' },
  { label: 'Express — 2 business days', value: 'express', description: '$12.00' },
  { label: 'Next day — order before 4pm', value: 'nextday', description: '$24.00' },
];

const SHIPPING_COST: Record<string, number> = { standard: 0, express: 12, nextday: 24 };

function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-12px">
      <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-surface-wash font-orbitron text-14 text-sec_purple">
        {step}
      </span>
      <h2 className="font-orbitron text-18 font-semibold text-fg-primary">{title}</h2>
    </div>
  );
}

export default function CheckoutTemplate() {
  const [delivery, setDelivery] = useState('standard');

  const subtotal = ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = SHIPPING_COST[delivery] ?? 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-border-default">
        <Container size="lg" className="flex items-center justify-between py-20px">
          <span className="font-orbitron text-18 font-bold text-fg-primary">SagTech Store</span>
          <div className="flex items-center gap-8px font-manrope text-14 text-fg-muted">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
              <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Secure checkout
          </div>
        </Container>
      </header>

      <Container size="lg" className="py-48px">
        <div className="grid gap-32px lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div className="flex flex-col gap-32px">
            <section className="flex flex-col gap-16px">
              <SectionTitle step={1} title="Contact" />
              <div className="grid gap-16px sm:grid-cols-2">
                <Input label="Email address" type="email" placeholder="you@example.com" />
                <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            </section>

            <Divider variant="solid" />

            <section className="flex flex-col gap-16px">
              <SectionTitle step={2} title="Shipping address" />
              <div className="grid gap-16px sm:grid-cols-2">
                <Input label="First name" placeholder="Alex" />
                <Input label="Last name" placeholder="Rivera" />
              </div>
              <Input label="Address" placeholder="123 Market Street" />
              <div className="grid gap-16px sm:grid-cols-3">
                <Input label="City" placeholder="San Francisco" />
                <Input label="State" placeholder="CA" />
                <Input label="ZIP" placeholder="94103" />
              </div>
            </section>

            <Divider variant="solid" />

            <section className="flex flex-col gap-16px">
              <SectionTitle step={3} title="Delivery method" />
              <RadioGroup
                name="delivery"
                options={DELIVERY_OPTIONS}
                value={delivery}
                onChange={setDelivery}
              />
            </section>

            <Divider variant="solid" />

            <section className="flex flex-col gap-16px">
              <SectionTitle step={4} title="Payment" />
              <Input label="Cardholder name" placeholder="Alex Rivera" />
              <Input label="Card number" placeholder="4242 4242 4242 4242" inputMode="numeric" />
              <div className="grid gap-16px sm:grid-cols-2">
                <Input label="Expiry" placeholder="MM / YY" />
                <Input label="CVC" placeholder="123" inputMode="numeric" />
              </div>
            </section>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-24px lg:self-start">
            <CardWrapper rounded="24" stoke="2" className="p-24px">
              <h2 className="mb-16px font-orbitron text-18 font-semibold text-fg-primary">
                Order summary
              </h2>

              <ul className="flex flex-col gap-16px">
                {ITEMS.map((item) => (
                  <li key={item.id} className="flex items-center gap-12px">
                    <div className="relative">
                      <Avatar name={item.name} size="lg" />
                      <span className="absolute -right-6px -top-6px flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-pr_purple px-4px font-manrope text-12 text-white">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-manrope text-14 text-fg-primary">
                        {item.name}
                      </span>
                      <span className="truncate font-manrope text-12 text-fg-muted">
                        {item.variant}
                      </span>
                    </div>
                    <span className="font-manrope text-14 text-fg-primary">
                      ${(item.price * item.qty).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="my-20px h-px bg-border-default" />

              <dl className="flex flex-col gap-8px font-manrope text-14">
                <div className="flex justify-between text-fg-secondary">
                  <dt>Subtotal</dt>
                  <dd>${subtotal.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between text-fg-secondary">
                  <dt>Shipping</dt>
                  <dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
                </div>
                <div className="flex justify-between text-fg-secondary">
                  <dt>Tax (8%)</dt>
                  <dd>${tax.toFixed(2)}</dd>
                </div>
                <div className="mt-8px flex items-baseline justify-between border-t border-border-default pt-12px">
                  <dt className="font-orbitron text-16 text-fg-primary">Total</dt>
                  <dd className="font-orbitron text-28 text-fg-primary">${total.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-24px">
                <Button
                  text={`Pay $${total.toFixed(2)}`}
                  variant="primary"
                  buttonSize="large"
                  classes="w-full justify-center"
                />
              </div>

              <div className="mt-16px flex items-center justify-center gap-8px">
                <Badge variant="subtle" color="success" size="sm" dot>
                  256-bit encrypted
                </Badge>
                <span className="font-manrope text-12 text-fg-muted">· 30-day returns</span>
              </div>
            </CardWrapper>
          </aside>
        </div>
      </Container>
    </div>
  );
}
