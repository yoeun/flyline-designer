import { useLayoutEffect, useRef } from 'react';

// The page header is position: fixed, so it stays put while the page scrolls. Its height (which changes
// as its buttons wrap) is kept in --header-h on <html>, for the spacer that holds its place in the
// layout and for anything that sticks or scrolls to just below it.
export function useFixedHeader() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const header = ref.current;
    if (!header) return;
    const root = document.documentElement;
    const set = () => root.style.setProperty('--header-h', `${header.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// Classes for the fixed header and its spacer.
export const FIXED_HEADER = 'fixed inset-x-0 top-0 z-30';
export const HEADER_SPACER = 'h-(--header-h) flex-none';
