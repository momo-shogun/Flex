import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ComponentId } from '../../types/components';

const GET_STARTED_ITEMS = [
  { label: 'Introduction', id: 'intro' },
  { label: 'Installation', id: 'install' },
  { label: 'Index', id: 'index' },
] as const;

const TEXT_ANIMATION_ITEMS: { id: ComponentId; label: string }[] = [
  { id: 'split-text', label: 'Split Text' },
  { id: 'blur-text', label: 'Blur Text' },
  { id: 'text-cursor', label: 'Text Cursor' },
];

const BACKGROUND_ITEMS: { id: ComponentId; label: string; new?: boolean }[] = [
  { id: 'silk', label: 'Silk', new: true },
  { id: 'floating-lines', label: 'Floating Lines', new: true },
  { id: 'light-pillar', label: 'Light Pillar', new: true },
];

const SECTION_ITEMS: { id: ComponentId; label: string }[] = [
  { id: 'smooth-scroll-hero', label: 'Smooth Scroll Hero' },
  { id: 'aurora-hero', label: 'Aurora Hero' },
  { id: 'faq', label: 'FAQ' },
];

interface SidebarProps {
  selectedComponent: ComponentId;
  onSelectComponent: (id: ComponentId) => void;
}

export function Sidebar({ selectedComponent, onSelectComponent }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isWebsiteBuilder = location.pathname === '/tools/website-builder';

  const handleComponentSelect = (id: ComponentId) => {
    if (isWebsiteBuilder) navigate('/');
    onSelectComponent(id);
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-700 overflow-y-auto">
      <nav className="p-4 space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Get Started
          </h2>
          <ul className="space-y-0.5">
            {GET_STARTED_ITEMS.map((item) => (
              <li key={item.id}>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 h-auto text-slate-300 text-sm hover:bg-slate-800 hover:text-white"
                >
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Text Animations
          </h2>
          <ul className="space-y-0.5">
            {TEXT_ANIMATION_ITEMS.map((item) => {
              const isSelected = !isWebsiteBuilder && selectedComponent === item.id;
              return (
                <li key={item.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleComponentSelect(item.id)}
                    className={cn(
                      'w-full justify-start px-3 py-2 h-auto text-sm',
                      isSelected
                        ? 'bg-slate-700 text-white border-l-2 border-blue-500 -ml-0.5 pl-3.5'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Backgrounds
          </h2>
          <ul className="space-y-0.5">
            {BACKGROUND_ITEMS.map((item) => {
              const isSelected = !isWebsiteBuilder && selectedComponent === item.id;
              return (
                <li key={item.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleComponentSelect(item.id)}
                    className={cn(
                      'w-full justify-start px-3 py-2 h-auto text-sm',
                      isSelected
                        ? 'bg-slate-700 text-white border-l-2 border-blue-500 -ml-0.5 pl-3.5'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.new && (
                      <span className="rounded bg-violet-600/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        New
                      </span>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Sections
          </h2>
          <ul className="space-y-0.5">
            {SECTION_ITEMS.map((item) => {
              const isSelected = !isWebsiteBuilder && selectedComponent === item.id;
              return (
                <li key={item.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleComponentSelect(item.id)}
                    className={cn(
                      'w-full justify-start px-3 py-2 h-auto text-sm',
                      isSelected
                        ? 'bg-slate-700 text-white border-l-2 border-blue-500 -ml-0.5 pl-3.5'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Tools
          </h2>
          <ul className="space-y-0.5">
            <li>
              <Link
                to="/tools/website-builder"
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors',
                  isWebsiteBuilder
                    ? 'bg-slate-700 text-white border-l-2 border-blue-500 -ml-0.5 pl-3.5'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
                Website Builder
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
