import { LogoutButton } from '@/features/user/components/ui';
import {
  MessageCircle,
  Sparkles,
  UserRoundPen,
  UsersRound,
} from 'lucide-react';
import { Link, NavLink } from 'react-router';

const menus = [
  { to: '/', label: '친구찾기', icon: UsersRound },
  { to: '/messages', label: '메세지', icon: MessageCircle },
];

function MainNavigation({ className }: { className: string }) {
  return (
    <nav aria-label="주요 메뉴" className={className}>
      {menus.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
              isActive
                ? 'bg-violet-500/10 text-violet-600 dark:text-violet-300'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`
          }
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Quick 홈"
          className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500"
        >
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
              <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-foreground group-hover:text-primary transition-colors">
              Quick
            </span>
          </div>
        </Link>
        <MainNavigation className="hidden items-center gap-2 sm:flex" />
        <div className="flex items-center gap-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                isActive
                  ? 'border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300'
                  : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
              }`
            }
          >
            <UserRoundPen className="size-4" aria-hidden="true" />
            프로필
          </NavLink>
          <LogoutButton />
        </div>
      </div>
      <MainNavigation className="grid grid-cols-2 gap-2 border-t border-border px-4 py-2 sm:hidden" />
    </header>
  );
}
