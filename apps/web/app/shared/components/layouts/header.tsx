import { LogoutButton } from '@/features/user/components/ui';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router';

export default function Header() {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-foreground group-hover:text-primary transition-colors">
              Quick
            </span>
          </div>
        </Link>
        <LogoutButton />
      </div>
    </nav>
  );
}
