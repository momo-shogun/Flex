interface ComponentPreviewProps {
  componentId: string | null;
  props: Record<string, unknown>;
}

export function ComponentPreview({ componentId, props }: ComponentPreviewProps) {
  if (!componentId) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
        Select a component from the library
      </div>
    );
  }
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6 max-w-lg w-full">
        <p className="text-slate-400 text-sm font-mono mb-2">{componentId}</p>
        <pre className="text-xs text-slate-300 overflow-auto max-h-48">
          {JSON.stringify(props, null, 2)}
        </pre>
        <p className="text-slate-500 text-xs mt-4">
          Live preview runs in builder. Use variants here to test props.
        </p>
      </div>
    </div>
  );
}
