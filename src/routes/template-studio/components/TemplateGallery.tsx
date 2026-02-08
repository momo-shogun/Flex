import { WEBSITE_TEMPLATES, getCustomTemplates } from '@/lib/templates';

interface TemplateGalleryProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function TemplateGallery({ selected, onSelect }: TemplateGalleryProps) {
  const builtIn = WEBSITE_TEMPLATES;
  const custom = getCustomTemplates();
  const all = [...builtIn, ...custom];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">Templates</h3>
      <div className="space-y-1">
        {all.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              selected === t.id
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="font-medium">{t.name}</span>
            <span className="block text-xs opacity-80">{t.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
