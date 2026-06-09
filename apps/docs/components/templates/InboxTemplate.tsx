'use client';

import { useState } from 'react';
import { Avatar, Badge, Input, Button } from '@sagtech-infra/ui';

interface Conversation {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
}

const CONVERSATIONS: Conversation[] = [
  { id: 'c1', name: 'Ava Chen', preview: 'Sounds great — shipping the fix now.', time: '2m', unread: 2, status: 'online' },
  { id: 'c2', name: 'Liam Brooks', preview: 'Can you review the PR when free?', time: '18m', unread: 0, status: 'online' },
  { id: 'c3', name: 'Design Team', preview: 'Mia: new tokens are merged 🎉', time: '1h', unread: 5, status: 'away' },
  { id: 'c4', name: 'Noah Patel', preview: 'Thanks, that worked perfectly.', time: '3h', unread: 0, status: 'offline' },
  { id: 'c5', name: 'Sofia Marenko', preview: 'Let me know about the demo slot.', time: 'Yesterday', unread: 0, status: 'offline' },
];

interface Message {
  id: string;
  from: 'them' | 'me';
  text: string;
  time: string;
}

const THREAD: Record<string, Message[]> = {
  c1: [
    { id: 'm1', from: 'them', text: 'Hey! Did the build go through on staging?', time: '09:41' },
    { id: 'm2', from: 'me', text: 'Yep, green across the board. Deploying now.', time: '09:42' },
    { id: 'm3', from: 'them', text: 'Nice. The chart spacing looks much better.', time: '09:43' },
    { id: 'm4', from: 'me', text: 'Agreed — rebalanced the dashboard grid this morning.', time: '09:44' },
    { id: 'm5', from: 'them', text: 'Sounds great — shipping the fix now.', time: '09:45' },
  ],
};

export default function InboxTemplate() {
  const [activeId, setActiveId] = useState('c1');
  const [draft, setDraft] = useState('');

  const active = CONVERSATIONS.find((c) => c.id === activeId)!;
  const messages = THREAD[activeId] ?? THREAD.c1;

  return (
    <div className="grid h-screen grid-cols-1 bg-bg-primary lg:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <aside className="hidden flex-col border-r border-border-default lg:flex">
        <div className="flex flex-col gap-12px border-b border-border-default p-16px">
          <h1 className="font-orbitron text-18 font-bold text-fg-primary">Inbox</h1>
          <Input placeholder="Search conversations" />
        </div>
        <ul className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <li key={conv.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(conv.id)}
                  className={`flex w-full items-center gap-12px border-b border-border-default px-16px py-12px text-left transition-colors ${
                    isActive ? 'bg-bg-tertiary' : 'hover:bg-bg-secondary'
                  }`}
                >
                  <Avatar name={conv.name} size="md" status={conv.status} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2px">
                    <div className="flex items-center justify-between gap-8px">
                      <span className="truncate font-manrope text-14 text-fg-primary">
                        {conv.name}
                      </span>
                      <span className="flex-shrink-0 font-manrope text-12 text-fg-muted">
                        {conv.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-8px">
                      <span className="truncate font-manrope text-12 text-fg-muted">
                        {conv.preview}
                      </span>
                      {conv.unread > 0 && (
                        <Badge variant="filled" color="purple" size="sm">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Thread */}
      <section className="flex h-screen flex-col">
        <header className="flex items-center gap-12px border-b border-border-default px-24px py-16px">
          <Avatar name={active.name} size="md" status={active.status} />
          <div className="flex flex-col">
            <span className="font-manrope text-16 text-fg-primary">{active.name}</span>
            <span className="font-manrope text-12 text-fg-muted">
              {active.status === 'online' ? 'Active now' : 'Last seen recently'}
            </span>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-12px overflow-y-auto bg-surface-wash px-24px py-24px">
          {messages.map((msg) => {
            const mine = msg.from === 'me';
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] rounded-16px px-16px py-10px font-manrope text-14 ${
                    mine
                      ? 'bg-pr_purple text-white'
                      : 'bg-bg-secondary text-fg-primary'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`mt-4px block text-12 ${
                      mine ? 'text-white/60' : 'text-fg-muted'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="border-t border-border-default px-24px py-16px">
          <form
            className="flex items-center gap-12px"
            onSubmit={(e) => {
              e.preventDefault();
              setDraft('');
            }}
          >
            <div className="flex-1">
              <Input
                placeholder="Write a message…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
            <Button text="Send" type="submit" variant="primary" buttonSize="large" />
          </form>
        </footer>
      </section>
    </div>
  );
}
