import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ExportOptionsProps {
  config: {
    framework: 'react' | 'nextjs';
    typescript: boolean;
    styling: string;
  };
  onChange: (config: ExportOptionsProps['config']) => void;
}

export function ExportOptions({ config, onChange }: ExportOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">Export options</h3>
      <div className="flex items-center justify-between">
        <Label className="text-slate-400">TypeScript</Label>
        <Switch
          checked={config.typescript}
          onCheckedChange={(v) => onChange({ ...config, typescript: v })}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-400">Framework</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...config, framework: 'react' })}
            className={`px-3 py-1.5 rounded text-sm ${
              config.framework === 'react'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            React
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...config, framework: 'nextjs' })}
            className={`px-3 py-1.5 rounded text-sm ${
              config.framework === 'nextjs'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Next.js
          </button>
        </div>
      </div>
    </div>
  );
}
