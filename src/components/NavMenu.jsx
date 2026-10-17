import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { NAV_PAGES } from '../lib/headerMenu.js';
import { THEMES } from '../lib/theme.js';
import Icon from './Icon.jsx';

const THEME_ICONS = { system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' };

// The header's page menu, left of the title: every page, with the current one highlighted, then the theme.
export default function NavMenu({ page, onNavigate, theme, onTheme }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-10 cursor-pointer items-center justify-center rounded-md text-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
        aria-label="Pages"
      >
        <Icon name="menu" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto min-w-52 p-1.5">
        {NAV_PAGES.map((p) => {
          const current = p.id === page;
          return (
            <DropdownMenuItem
              key={p.id}
              aria-current={current ? 'page' : undefined}
              className={cn('gap-2.5 px-3 py-2 text-[15px]', current && 'bg-accent font-semibold text-accent-foreground')}
              onClick={() => !current && onNavigate(p.id)}
            >
              <Icon name={p.icon} />
              {p.label}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator className="-mx-1.5 my-1.5" />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 pt-1.5 pb-1">Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={onTheme}>
            {THEMES.map(([id, label]) => (
              <DropdownMenuRadioItem key={id} value={id} className="gap-2.5 py-2 pr-9 pl-3 text-[15px]">
                <Icon name={THEME_ICONS[id]} />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
