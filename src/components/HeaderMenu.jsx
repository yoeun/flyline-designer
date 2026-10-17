import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { menuGroups } from '../lib/headerMenu.js';
import Icon from './Icon.jsx';

// The header's download menu: the page's items from lib/headerMenu.js. A page with none gets no menu.
export default function HeaderMenu({ page, onSelect }) {
  const groups = menuGroups(page);
  if (groups.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-input bg-card text-foreground hover:border-primary focus-visible:outline-2 focus-visible:outline-ring"
        aria-label="Download"
      >
        <Icon name="download" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-52 p-1.5">
        {groups.map((group, i) => (
          <DropdownMenuGroup key={group[0].group}>
            {i > 0 && <DropdownMenuSeparator className="-mx-1.5 my-1.5" />}
            {group.map((item) => (
              <DropdownMenuItem key={item.id} className="gap-2.5 px-3 py-2 text-[15px]" onClick={() => onSelect(item.id)}>
                {item.icon && <Icon name={item.icon} />}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
