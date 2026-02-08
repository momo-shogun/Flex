import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PropsEditorProps {
  componentId: string | null;
  props: Record<string, unknown>;
  onChange: (props: Record<string, unknown>) => void;
}

export function PropsEditor({
  componentId,
  props,
  onChange,
}: PropsEditorProps) {
  if (!componentId) {
    return (
      <div className="p-4 text-slate-500 text-sm">
        Select a component to edit props
      </div>
    );
  }
  const entries = Object.entries(props);
  return (
    <div className="p-4 space-y-3 overflow-auto">
      {entries.length === 0 ? (
        <p className="text-slate-500 text-sm">No props</p>
      ) : (
        entries.map(([key, value]) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs">{key}</Label>
            <Input
              className="h-8 text-sm"
              value={
                typeof value === 'string' || typeof value === 'number'
                  ? String(value)
                  : JSON.stringify(value)
              }
              onChange={(e) => {
                const next = { ...props };
                const v = e.target.value;
                if (v === 'true') next[key] = true;
                else if (v === 'false') next[key] = false;
                else if (/^\d+$/.test(v)) next[key] = parseInt(v, 10);
                else next[key] = v;
                onChange(next);
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}
