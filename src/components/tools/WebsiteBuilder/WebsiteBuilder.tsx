import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PagePreview } from './PagePreview';
import type { BuilderSection } from '@/types/website-builder';
import { downloadProjectZip } from '@/utils/website-builder-export';
import { toast } from 'sonner';
import type { ComponentId } from '@/types/components';
import {
  FiType,
  FiLayers,
  FiLayout,
  FiPlus,
  FiX,
  FiDownload,
  FiMove,
} from 'react-icons/fi';

// Components grouped by category (matching Sidebar structure)
const TEXT_ANIMATIONS: { id: ComponentId; label: string }[] = [
  { id: 'split-text', label: 'Split Text' },
  { id: 'blur-text', label: 'Blur Text' },
  { id: 'text-cursor', label: 'Text Cursor' },
];

const BACKGROUNDS: { id: ComponentId; label: string }[] = [
  { id: 'silk', label: 'Silk' },
  { id: 'floating-lines', label: 'Floating Lines' },
  { id: 'light-pillar', label: 'Light Pillar' },
];

const SECTIONS: { id: ComponentId; label: string }[] = [
  { id: 'smooth-scroll-hero', label: 'Smooth Scroll Hero' },
  { id: 'aurora-hero', label: 'Aurora Hero' },
  { id: 'faq', label: 'FAQ' },
];

// Icons per category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'text':
      return FiType;
    case 'background':
      return FiLayers;
    case 'section':
      return FiLayout;
    default:
      return FiLayout;
  }
};

function generateId(): string {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function WebsiteBuilder() {
  const [sections, setSections] = useState<BuilderSection[]>([]);

  const addComponent = (componentId: ComponentId) => {
    setSections((prev) => [...prev, { id: generateId(), type: componentId }]);
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

  const getComponentLabel = (id: ComponentId): string => {
    const allComponents = [...TEXT_ANIMATIONS, ...BACKGROUNDS, ...SECTIONS];
    return allComponents.find((c) => c.id === id)?.label || id;
  };

  return (
    <div className="flex-1 flex min-w-0 min-h-0 bg-slate-950">
      {/* Left Panel - Component Library */}
      <aside className="w-80 flex-shrink-0 border-r border-slate-800/50 flex flex-col bg-slate-900/50 overflow-hidden">
        {/* Components Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiLayout className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Components
              </h2>
            </div>

            {/* Text Animations Group */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <FiType className="w-3.5 h-3.5" />
                Text Animations
              </h3>
              <div className="grid gap-2">
                {TEXT_ANIMATIONS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => addComponent(comp.id)}
                    className="group relative flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-200 text-left"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                        {comp.label}
                      </p>
                    </div>
                    <FiPlus className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Backgrounds Group */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <FiLayers className="w-3.5 h-3.5" />
                Backgrounds
              </h3>
              <div className="grid gap-2">
                {BACKGROUNDS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => addComponent(comp.id)}
                    className="group relative flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-200 text-left"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                        {comp.label}
                      </p>
                    </div>
                    <FiPlus className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sections Group */}
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <FiLayout className="w-3.5 h-3.5" />
                Sections
              </h3>
              <div className="grid gap-2">
                {SECTIONS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => addComponent(comp.id)}
                    className="group relative flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-200 text-left"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                        {comp.label}
                      </p>
                    </div>
                    <FiPlus className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Page Structure Section */}
        <div className="border-t border-slate-800/50 bg-slate-900/80 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiMove className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Page Structure
            </h2>
            {sections.length > 0 && (
              <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                {sections.length}
              </span>
            )}
          </div>
          {sections.length === 0 ? (
            <div className="text-center py-8">
              <FiLayout className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                Add components to build your page
              </p>
            </div>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {sections.map((s, i) => (
                <li
                  key={s.id}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs font-mono text-slate-500 flex-shrink-0 w-6">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-200 truncate">
                      {getComponentLabel(s.type)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(s.id)}
                    className="flex-shrink-0 p-1.5 rounded hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-colors"
                    aria-label={`Remove ${getComponentLabel(s.type)}`}
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Right Panel - Preview + Export */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Export */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-900/30">
          <div>
            <h1 className="text-lg font-semibold text-white">Website Builder</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {sections.length === 0
                ? 'Start by adding components'
                : `${sections.length} component${sections.length === 1 ? '' : 's'} added`}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleExport}
            disabled={sections.length === 0}
            className="bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Export Project
          </Button>
        </div>

        {/* Preview */}
        <PagePreview sections={sections} />
      </div>
    </div>
  );
}
