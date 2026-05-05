import type { MouseEventHandler } from 'react';
import type { IAvailableIcons } from '@/icons';
import notificationConsts from './notification.const';
import { Icon } from '@/components/Icon/Icon';
import Button from '@/components/Button/Button';

/**
 * @deprecated Use Toast instead — see docs/COMPONENT_PICKER.md.
 *
 * The Notification component, NotificationContext, and NotificationContextProvider
 * are scheduled for removal in v2.0. New code should use the imperative `toast`
 * API and `<Toaster />` from `@sagtech-infra/ui`.
 */
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

/**
 * @deprecated Use Toast instead — see docs/COMPONENT_PICKER.md.
 *
 * Notification is the legacy feedback primitive and is scheduled for removal
 * in v2.0. Migrate to `toast.success(...)`, `toast.error(...)`, etc., paired
 * with a single `<Toaster />` mounted at your app root.
 */
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
