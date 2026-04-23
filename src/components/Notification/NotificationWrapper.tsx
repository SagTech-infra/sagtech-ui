'use client';

import { useCallback, useContext, useEffect } from 'react';
import '@/tokens/index.css';
import { Notification } from './Notification';
import { NotificationContext } from './NotificationContext';
import Portal from '@/utils/Portal';

export default function NotificationWrapper() {
  const { isOpen, toggle, title, text, color, state } = useContext(NotificationContext);

  const onClose = useCallback(() => {
    toggle(false);
  }, [toggle]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        toggle(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
    return () => {};
  }, [isOpen, toggle]);

  return (
    <Portal>
      {isOpen && (
        <div
          className="sm:bottom-32px 2xl:bottom-40px pointer-events-none fixed bottom-24px right-0px flex w-full justify-center sm:right-[32px] sm:block sm:w-auto 2xl:right-[40px]"
          style={{ zIndex: 5000 }}
        >
          <Notification
            title={title}
            text={text}
            buttonTextFirst="Got it"
            useIconButtonFirst={false}
            color={color}
            onClickButtonFirst={onClose}
            state={state}
          />
        </div>
      )}
    </Portal>
  );
}
