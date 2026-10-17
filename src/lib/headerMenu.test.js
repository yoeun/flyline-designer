import { describe, expect, it } from 'vitest';
import { MENU_ITEMS, NAV_PAGES, menuGroups } from './headerMenu.js';

const ids = (page) => menuGroups(page).map((group) => group.map((item) => item.id));

describe('NAV_PAGES', () => {
  it('lists every page in order', () => {
    expect(NAV_PAGES.map((p) => p.id)).toEqual(['designer', 'rack', 'guide']);
  });
});

describe('menuGroups', () => {
  it('offers the designer its exports', () => {
    expect(ids('designer')).toEqual([['svg', 'png']]);
  });

  it('has nothing for the rack or the guide', () => {
    expect(menuGroups('rack')).toEqual([]);
    expect(menuGroups('guide')).toEqual([]);
  });

  it('leaves page links to the page menu', () => {
    const pages = NAV_PAGES.map((p) => p.id);
    expect(MENU_ITEMS.filter((item) => pages.includes(item.id))).toEqual([]);
  });

  it('gives every item a unique id', () => {
    expect(new Set(MENU_ITEMS.map((item) => item.id)).size).toBe(MENU_ITEMS.length);
  });
});
