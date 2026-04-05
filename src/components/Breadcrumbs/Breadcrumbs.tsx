import classNames from 'classnames';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

function DefaultSeparator() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="text-grey_1 flex-shrink-0"
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Breadcrumbs({ items, separator, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={classNames('flex items-center gap-8px flex-wrap font-manrope text-14', className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-8px">
            {index > 0 && (
              <span className="flex items-center text-grey_1" aria-hidden="true">
                {separator ?? <DefaultSeparator />}
              </span>
            )}

            {isLast || !item.href ? (
              <span
                className={classNames('flex items-center gap-4px', {
                  'text-white_4 font-semibold': isLast,
                  'text-grey_4': !isLast,
                })}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-[16px] h-[16px] flex items-center">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="flex items-center gap-4px text-grey_4 hover:text-pr_purple transition-colors duration-200 cursor-pointer no-underline"
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-[16px] h-[16px] flex items-center">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </a>
            )}
          </div>
        );
      })}
    </nav>
  );
}
