'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

export interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  active?: boolean;
  children?: SidebarItem[];
  badge?: string | number;
}

export interface SidebarProps {
  items: SidebarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {collapsed ? (
        <path
          d="M7.5 4L13.5 10L7.5 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M13.5 4L7.5 10L13.5 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function SidebarNavItem({
  item,
  collapsed,
  openSubmenus,
  onToggleSubmenu,
}: {
  item: SidebarItem;
  collapsed: boolean;
  openSubmenus: Set<string>;
  onToggleSubmenu: (label: string) => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isSubmenuOpen = openSubmenus.has(item.label);

  const content = (
    <>
      {item.icon && <span className="flex-shrink-0 w-[20px] h-[20px]">{item.icon}</span>}
      <span
        className={classNames('whitespace-nowrap transition-all duration-300', {
          'opacity-0 w-0 overflow-hidden': collapsed,
          'opacity-100 w-auto': !collapsed,
        })}
      >
        {item.label}
      </span>
      {!collapsed && item.badge !== undefined && (
        <span className="ml-auto bg-pr_purple text-white text-10 px-6px py-[1px] rounded-circle font-semibold leading-16">
          {item.badge}
        </span>
      )}
      {!collapsed && hasChildren && <ChevronIcon open={isSubmenuOpen} />}
    </>
  );

  const itemClasses = classNames(
    'flex items-center gap-12px px-12px py-10px rounded-8px cursor-pointer transition-colors duration-200 font-manrope text-14 leading-24 w-full',
    {
      'bg-pr_purple/10 text-pr_purple border-l-2 border-pr_purple': item.active,
      'text-grey_4 hover:bg-black_3 hover:text-white_4': !item.active,
    },
  );

  const handleClick = () => {
    if (hasChildren) {
      onToggleSubmenu(item.label);
    }
  };

  return (
    <div>
      {item.href && !hasChildren ? (
        <a href={item.href} className={classNames(itemClasses, 'no-underline')}>
          {content}
        </a>
      ) : (
        <button type="button" onClick={handleClick} className={itemClasses}>
          {content}
        </button>
      )}
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isSubmenuOpen && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pl-32px flex flex-col gap-4px mt-4px">
                {item.children!.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    className={classNames(
                      'flex items-center gap-12px px-12px py-8px rounded-8px cursor-pointer transition-colors duration-200 font-manrope text-14 leading-24 no-underline',
                      {
                        'text-pr_purple': child.active,
                        'text-grey_4 hover:bg-black_3 hover:text-white_4': !child.active,
                      },
                    )}
                  >
                    {child.icon && (
                      <span className="flex-shrink-0 w-[20px] h-[20px]">{child.icon}</span>
                    )}
                    <span>{child.label}</span>
                    {child.badge !== undefined && (
                      <span className="ml-auto bg-pr_purple text-white text-10 px-6px py-[1px] rounded-circle font-semibold leading-16">
                        {child.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function Sidebar({
  items,
  header,
  footer,
  collapsed = false,
  onToggleCollapse,
  className,
}: SidebarProps) {
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  const handleToggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <nav
      className={classNames(
        'h-full flex flex-col bg-black_2 border-r border-black_3 transition-all duration-300',
        {
          'w-[72px]': collapsed,
          'w-[260px]': !collapsed,
        },
        className,
      )}
    >
      {header && <div className="p-16px border-b border-black_3">{header}</div>}

      <div className="flex flex-col gap-4px p-12px flex-1 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <SidebarNavItem
            key={item.label}
            item={item}
            collapsed={collapsed}
            openSubmenus={openSubmenus}
            onToggleSubmenu={handleToggleSubmenu}
          />
        ))}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="mt-auto flex items-center justify-center p-10px rounded-8px cursor-pointer transition-colors duration-200 text-grey_4 hover:bg-black_3 hover:text-white_4"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        )}
      </div>

      {footer && <div className="p-16px border-t border-black_3 mt-auto">{footer}</div>}
    </nav>
  );
}
