export function TamboModePanel() {
  return (
    <aside className="w-80 flex-shrink-0 min-h-0 bg-slate-950 border-l border-slate-800 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          tamboMode
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Chat instructions for integrating React components with shadcn, Tailwind and
          TypeScript.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-4 text-xs">
        <div className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-slate-100">
          <p className="whitespace-pre-wrap">
            Create a card that is attractive using clean teal green and gray tones
            inspired by modern database interfaces with fresh, professional aesthetics
            using shadcn/ui components.
          </p>
        </div>

        <div className="space-y-1 text-slate-400">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 text-[10px]">
              &lt;/&gt;
            </span>
            <span>Component generated</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-700/80 text-slate-200 text-[10px]">
              $
            </span>
            <span>Run terminal command</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-700/80 text-slate-200 text-[10px]">
              👁
            </span>
            <span>Read App.tsx</span>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-[11px] text-emerald-100">
          Done! Created an attractive database analytics dashboard card with clean teal
          green and gray tones. Features stat cards, progress bars, server status panels,
          and modern professional styling using shadcn/ui components.
        </div>
      </div>

      <div className="border-t border-slate-800 px-3 py-2">
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <textarea
            className="flex-1 resize-none rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            rows={2}
            placeholder="Describe the UI you want to generate..."
          />
          <button
            type="submit"
            className="inline-flex h-8 items-center rounded-md bg-violet-600 px-3 text-[11px] font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </aside>
  );
}

