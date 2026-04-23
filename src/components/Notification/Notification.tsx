import classNames from 'classnames';
import type { MouseEventHandler } from 'react';
import type { IAvailableIcons } from '@/icons';
import notificationConsts from './notification.const';
import { Icon } from '@/components/Icon/Icon';
import Button from '@/components/Button/Button';

interface NotificationTypes {
  title?: string;
  text?: string;
  buttonTextFirst?: string;
  buttonTextSecond?: string;
  state?: IAvailableIcons;
  isbuttonSecond?: boolean;
  useIconButtonFirst?: boolean;
  color?: string;
  onClickButtonFirst?: MouseEventHandler;
}

export function Notification({
  title,
  text,
  buttonTextFirst,
  buttonTextSecond,
  state = 'success',
  isbuttonSecond = false,
  useIconButtonFirst = false,
  color = '#22C55E',
  onClickButtonFirst,
}: NotificationTypes) {
  return (
    <div
      role="alert"
      className={`${notificationConsts.basicStyles} pointer-events-auto h-full w-[359px] sm:w-[392px]`}
    >
      <div className="mr-16px">
        <Icon icon={state} color={color} />
      </div>
      <div>
        <h3 className="pb-4px font-semibold leading-24 text-white_4">{title}</h3>
        <p className={notificationConsts.basicTextStyles}>{text}</p>
        <div className="mt-16px flex gap-8px">
          <Button
            buttonSize="small"
            variant="primary"
            useIcon={useIconButtonFirst}
            text={buttonTextFirst}
            onClick={onClickButtonFirst}
          />
          {isbuttonSecond && (
            <Button buttonSize="small" variant="secondary" useIcon text={buttonTextSecond} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
