import { getLastExport } from '@/lib/export/last-export';

interface CodeViewerProps {
  files: Map<string, string>;
}

export function CodeViewer({ files }: CodeViewerProps) {
  const last = getLastExport();
  const map = files.size > 0 ? files : last;
  const entries = map ? Array.from(map.entries()) : [];

  if (entries.length === 0) {
    return (
      <div className="p-6 text-slate-500 text-sm">
        Generate code with the AI or use the export tools. Last export will appear here.
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4 overflow-auto">
      {entries.slice(0, 15).map(([path, content]) => (
        <div key={path} className="rounded border border-slate-700 overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-mono">
            {path}
          </div>
          <pre className="p-3 bg-slate-900 text-slate-300 text-xs overflow-auto max-h-48 whitespace-pre-wrap">
            {content.slice(0, 2000)}
            {content.length > 2000 ? '\n...' : ''}
          </pre>
        </div>
      ))}
      {entries.length > 15 && (
        <p className="text-slate-500 text-xs">+ {entries.length - 15} more files</p>
      )}
    </div>
  );
}
