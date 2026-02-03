import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PagePreview } from './PagePreview';
import type { BuilderSection, BuilderSectionType } from '@/types/website-builder';
import { BUILDER_SECTION_LABELS } from '@/types/website-builder';
import { downloadProjectZip } from '@/utils/website-builder-export';
import { toast } from 'sonner';

const ADDABLE_TYPES: BuilderSectionType[] = [
  'header',
  'smooth-scroll-hero',
  'aurora-hero',
  'faq',
];

function generateId(): string {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function WebsiteBuilder() {
  const [sections, setSections] = useState<BuilderSection[]>([]);

  const addSection = (type: BuilderSectionType) => {
    setSections((prev) => [...prev, { id: generateId(), type }]);
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleExport = async () => {
    if (sections.length === 0) {
      toast.error('Add at least one section before exporting.');
      return;
    }
    try {
      await downloadProjectZip(sections);
      toast.success('Project downloaded.');
    } catch (err) {
      console.error(err);
      toast.error('Export failed.');
    }
  };

  return (
    <div className="flex-1 flex min-w-0 min-h-0 bg-slate-950">
      <aside className="w-72 flex-shrink-0 border-r border-slate-700 flex flex-col bg-slate-900 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white mb-3">Add section</h2>
          <ul className="space-y-1">
            {ADDABLE_TYPES.map((type) => (
              <li key={type}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-slate-200 border-slate-600 hover:bg-slate-800"
                  onClick={() => addSection(type)}
                >
                  {BUILDER_SECTION_LABELS[type]}
                  <span className="text-slate-500">+</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <h2 className="text-sm font-semibold text-white mb-3">Page structure</h2>
          {sections.length === 0 ? (
            <p className="text-xs text-slate-500">No sections yet.</p>
          ) : (
            <ul className="space-y-1">
              {sections.map((s, i) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2 py-2 px-2 rounded bg-slate-800/50 text-sm text-slate-200"
                >
                  <span className="truncate">
                    {i + 1}. {BUILDER_SECTION_LABELS[s.type]}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-slate-400 hover:text-red-400 shrink-0"
                    onClick={() => removeSection(s.id)}
                    aria-label={`Remove ${BUILDER_SECTION_LABELS[s.type]}`}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-end gap-2 p-3 border-b border-slate-700 bg-slate-900/50">
          <Button
            type="button"
            onClick={handleExport}
            className="bg-violet-600 hover:bg-violet-500 text-white"
          >
            Export as project
          </Button>
        </div>
        <PagePreview sections={sections} />
      </div>
    </div>
  );
}
