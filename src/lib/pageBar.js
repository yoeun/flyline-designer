import { useCallback } from 'react';

// A page's title bar (its title, search and filters) sticks just below the fixed header while the page
// scrolls. Its height, which changes as its filters wrap, is kept in --bar-h on <html> so the group
// headings under it stick just below it in turn, each pushed off by the next, like iOS list headers.
// A callback ref, so it picks up a bar that only renders once the page has loaded.
export function usePageBar() {
  return useCallback((bar) => {
    if (!bar) return;
    const root = document.documentElement;
    const set = () => root.style.setProperty('--bar-h', `${bar.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--bar-h');
    };
  }, []);
}

// Classes for the bar and for a group heading, both drawn edge to edge across the page's gutter. The bar
// sits above a hovered card (z-10) and the headings; a heading sits above the cards but under the bar.
export const PAGE_BAR = 'sticky top-(--header-h) z-20 -mx-[max(16px,2.5vw)] -mt-6 flex flex-col gap-2.5 border-b border-border bg-background/95 px-[max(16px,2.5vw)] pt-4 pb-3 backdrop-blur';
export const GROUP_HEADING = 'sticky top-[calc(var(--header-h)+var(--bar-h,0px))] z-[15] -mx-[max(16px,2.5vw)] border-b border-border bg-background/95 px-[max(16px,2.5vw)] py-2 backdrop-blur';
