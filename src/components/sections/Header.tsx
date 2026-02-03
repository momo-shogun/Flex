import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-900/95 backdrop-blur border-b border-slate-700',
        className
      )}
    >
      <span className="text-lg font-semibold text-white">Your Logo</span>
      <nav className="flex items-center gap-6 text-sm">
        <a href="#home" className="text-slate-300 hover:text-white transition-colors">
          Home
        </a>
        <a href="#features" className="text-slate-300 hover:text-white transition-colors">
          Features
        </a>
        <a href="#faq" className="text-slate-300 hover:text-white transition-colors">
          FAQ
        </a>
      </nav>
    </header>
  );
}
