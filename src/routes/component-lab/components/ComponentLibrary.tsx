import type { ComponentId } from '@/types/components';

const COMPONENTS: { id: ComponentId; label: string }[] = [
  { id: 'aurora-hero-splittext', label: 'Aurora Hero + Split Text' },
  { id: 'silk-hero-splittext', label: 'Silk Hero + Split Text' },
  { id: 'aurora-hero', label: 'Aurora Hero' },
  { id: 'smooth-scroll-hero', label: 'Smooth Scroll Hero' },
  { id: 'split-text', label: 'Split Text' },
  { id: 'blur-text', label: 'Blur Text' },
  { id: 'faq', label: 'FAQ' },
  { id: 'silk', label: 'Silk' },
  { id: 'floating-lines', label: 'Floating Lines' },
  { id: 'light-pillar', label: 'Light Pillar' },
];

interface ComponentLibraryProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function ComponentLibrary({ selected, onSelect }: ComponentLibraryProps) {
  return (
    <div className="p-3 space-y-1">
      <h3 className="text-sm font-semibold text-slate-300 px-2 mb-2">
        Components
      </h3>
      {COMPONENTS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            selected === id
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
