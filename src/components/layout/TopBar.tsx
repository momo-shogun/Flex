import { Button } from '../ui/button';

export function TopBar() {
  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 bg-slate-900 border-b border-slate-700">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-white">Flex</span>
      </div>
      <div className="flex items-center gap-3">
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
