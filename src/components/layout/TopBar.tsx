import { Button } from '../ui/button';

interface TopBarProps {
  isTamboMode?: boolean;
  onToggleTamboMode?: () => void;
}

export function TopBar({ isTamboMode, onToggleTamboMode }: TopBarProps) {
  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 bg-slate-900 border-b border-slate-700">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-white">Flex</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleTamboMode}
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${
            isTamboMode
              ? 'border-violet-500 bg-violet-600/15 text-violet-100'
              : 'border-dashed border-slate-700/70 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <span className="font-medium text-slate-200">tamboMode</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
              isTamboMode
                ? 'bg-violet-600/40 text-violet-50'
                : 'bg-slate-800/80 text-slate-400'
            }`}
          >
            {isTamboMode ? 'on' : 'off'}
          </span>
        </button>
        <Button
          type="button"
          variant="outline"
          className="w-48 justify-start text-slate-400"
          onClick={() =>
            window.dispatchEvent(new CustomEvent('open-command-palette'))
          }
        >
          Search... (⌘K)
        </Button>
        <span className="text-slate-500">/</span>
        <Button type="button" variant="secondary" size="sm">
          <span aria-hidden>★</span>
          Star on GitHub
        </Button>
      </div>
    </header>
  );
}
