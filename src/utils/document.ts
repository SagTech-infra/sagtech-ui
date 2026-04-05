'use client';

export function hideDocumentScroll(hide: boolean) {
  if (typeof window !== 'undefined') {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    const html = document.getElementsByTagName('html')[0];
    const header = document.querySelector('header') as HTMLElement;
    const main = document.querySelector('main') as HTMLElement;

    Object.assign(html.style, {
      marginRight: hide ? `${scrollbarWidth}px` : 'unset',
    });

    if (header) {
      header.classList[hide ? 'add' : 'remove']('scroll-class');
    }

    if (header && scrollbarWidth === 0) {
      header.classList.remove('scroll-class');
    }

    if (main) {
      Object.assign(main.style, {
        right: hide ? `${scrollbarWidth}px` : 0,
      });
    }

    html.classList[hide ? 'add' : 'remove']('scroll-fixed');
  }
}

export const getWindowScrollTop = () => {
  const doc = document.documentElement;
  return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
};
