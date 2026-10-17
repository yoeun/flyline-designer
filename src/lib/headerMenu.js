// The header's page menu, in display order. Every page is listed, the current one highlighted.
export const NAV_PAGES = [
  { id: 'designer', label: 'Designer', icon: 'design_services' },
  { id: 'rack', label: 'Rack', icon: 'shelves' },
  { id: 'guide', label: 'Line guide', icon: 'menu_book' },
];

// The header's download menu, in display order. Each item names the pages it shows on; the menu draws a
// divider between groups and drops a group with nothing to show. An icon is optional.
export const MENU_ITEMS = [
  { id: 'svg', label: 'Download SVG', group: 'export', pages: ['designer'] },
  { id: 'png', label: 'Download PNG', group: 'export', pages: ['designer'] },
];

// The items for a page, as a list of non-empty groups in display order.
export function menuGroups(page) {
  const groups = [];
  for (const item of MENU_ITEMS) {
    if (!item.pages.includes(page)) continue;
    const last = groups.at(-1);
    if (last?.[0].group === item.group) last.push(item);
    else groups.push([item]);
  }
  return groups;
}
