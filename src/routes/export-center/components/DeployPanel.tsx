import { Button } from '@/components/ui/button';
import { getLastExport } from '@/lib/export/last-export';
import { downloadAsZip } from '@/lib/export/deploy';

interface DeployPanelProps {
  files: Map<string, string>;
}

export function DeployPanel({ files }: DeployPanelProps) {
  const last = getLastExport();
  const map = files.size > 0 ? files : last;

  const handleDownload = () => {
    if (map && map.size > 0) {
      downloadAsZip(map, 'flex-website.zip');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">Deploy</h3>
      <p className="text-slate-500 text-sm">
        Download your project as a ZIP, then run npm install && npm run dev.
      </p>
      <Button
        onClick={handleDownload}
        disabled={!map || map.size === 0}
        className="bg-violet-600 hover:bg-violet-500"
      >
        Download ZIP
      </Button>
    </div>
  );
}
