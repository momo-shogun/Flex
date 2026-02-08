import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Layers,
  Layout,
  Type,
  Plus,
  Trash2,
  Grid3X3,
  Merge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBuilder } from '@/contexts/BuilderContext';
import { useTamboThreadInput, useTamboContextAttachment } from '@tambo-ai/react';
import { cn } from '@/lib/utils';
import { toComponentId } from '@/types/builder.types';
import type { ComponentId } from '@/types/components';
import { toast } from 'sonner';

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

const COMPOSITES: { id: ComponentId; label: string }[] = [
  { id: 'silk-hero-splittext', label: 'Silk Hero + Split Text' },
  { id: 'aurora-hero-splittext', label: 'Aurora Hero + Split Text' },
];

const sectionIcons: Record<ComponentId, typeof Layout> = {
  'split-text': Type,
  'blur-text': Type,
  'text-cursor': Type,
  silk: Layers,
  'floating-lines': Layers,
  'light-pillar': Layers,
  'smooth-scroll-hero': Layout,
  'aurora-hero': Layout,
  faq: Layout,
  'silk-hero-splittext': Layout,
  'aurora-hero-splittext': Layout,
};

const CATEGORY_KEYS = ['textAnimations', 'backgrounds', 'composites', 'sections'] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const defaultCategoriesOpen: Record<CategoryKey, boolean> = {
  textAnimations: false,
  backgrounds: false,
  composites: false,
  sections: false,
};

function CategoryRow({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-left text-xs font-medium hover:bg-slate-800/80 transition-colors"
        style={{ color: 'hsl(var(--builder-text-muted))' }}
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        )}
        {label}
      </button>
      {open && <div className="space-y-1 mt-0.5">{children}</div>}
    </div>
  );
}

export function LayersPanel() {
  const { state, dispatch, addSection } = useBuilder();
  const { setValue, submit } = useTamboThreadInput();
  const { addContextAttachment } = useTamboContextAttachment();
  const [expandedPage, setExpandedPage] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState<Record<CategoryKey, boolean>>(defaultCategoriesOpen);
  const [mergingIds, setMergingIds] = useState<Set<string>>(new Set());

  const toggleExpand = () => setExpandedPage((p) => !p);

  const toggleCategory = (key: CategoryKey) => {
    setCategoriesOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (id: string) => {
    dispatch({ type: 'SELECT', id });
  };

  const handleToggleVisibility = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_VISIBILITY', id });
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch({ type: 'REMOVE_SECTION', id });
  };

  const handleFocusInAi = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    const section = state.sections.find((s) => s.id === sectionId);
    if (!section) return;
    addContextAttachment({
      context: JSON.stringify(section, null, 2),
      displayName: section.label || section.id,
      type: 'builder-section',
    });
    toast.success(`Staged "${section.label || section.id}" for AI`);
  };

  const handleMerge = async (e: React.MouseEvent, sectionId1: string, sectionId2: string) => {
    e.stopPropagation();
    const key = `${sectionId1}-${sectionId2}`;
    if (mergingIds.has(key)) return;
    setMergingIds((prev) => new Set(prev).add(key));
    try {
      const section1 = state.sections.find((s) => s.id === sectionId1);
      const section2 = state.sections.find((s) => s.id === sectionId2);
      if (!section1 || !section2) {
        toast.error('One or both sections not found.');
        return;
      }

      // Send merge request to Tambo via thread
      const prompt = `Merge these two components into one composite section using merge_builder_sections tool:
- Section 1: "${section1.label}" (id: ${sectionId1}, type: ${section1.type})
- Section 2: "${section2.label}" (id: ${sectionId2}, type: ${section2.type})

Call merge_builder_sections with sectionId1="${sectionId1}" and sectionId2="${sectionId2}". Choose an appropriate mergedType based on the component types (e.g. silk-hero-splittext if silk + split-text, aurora-hero-splittext if aurora-hero + split-text) and merge their props intelligently.`;

      toast.info('Merging components via AI...');
      setValue(prompt);
      // Use a small delay to ensure value is set, then submit
      await new Promise((resolve) => setTimeout(resolve, 50));
      await submit({ streamResponse: true });
      toast.success('Merge request sent. Check AI Chat for result.');
    } catch (error) {
      console.error('Merge error:', error);
      toast.error('Failed to merge components.');
    } finally {
      setMergingIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Add Components */}
      <div
        className="flex-shrink-0 border-b px-3 py-3"
        style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Layers
            className="h-4 w-4"
            style={{ color: 'hsl(var(--builder-text-muted))' }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: 'hsl(var(--builder-text-primary))' }}
          >
            Components
          </span>
        </div>
        <div className="space-y-2">
          <CategoryRow
            label="Text Animations"
            open={categoriesOpen.textAnimations}
            onToggle={() => toggleCategory('textAnimations')}
          >
            {TEXT_ANIMATIONS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => addSection(comp.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left text-sm hover:bg-slate-800/80 transition-colors"
                style={{
                  color: 'hsl(var(--builder-text-secondary))',
                }}
              >
                {comp.label}
                <Plus className="h-3.5 w-3.5" />
              </button>
            ))}
          </CategoryRow>
          <CategoryRow
            label="Backgrounds"
            open={categoriesOpen.backgrounds}
            onToggle={() => toggleCategory('backgrounds')}
          >
            {BACKGROUNDS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => addSection(comp.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left text-sm hover:bg-slate-800/80 transition-colors"
                style={{
                  color: 'hsl(var(--builder-text-secondary))',
                }}
              >
                {comp.label}
                <Plus className="h-3.5 w-3.5" />
              </button>
            ))}
          </CategoryRow>
          <CategoryRow
            label="Composites"
            open={categoriesOpen.composites}
            onToggle={() => toggleCategory('composites')}
          >
            {COMPOSITES.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => addSection(comp.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left text-sm hover:bg-slate-800/80 transition-colors"
                style={{
                  color: 'hsl(var(--builder-text-secondary))',
                }}
              >
                {comp.label}
                <Plus className="h-3.5 w-3.5" />
              </button>
            ))}
          </CategoryRow>
          <CategoryRow
            label="Sections"
            open={categoriesOpen.sections}
            onToggle={() => toggleCategory('sections')}
          >
            {SECTIONS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => addSection(comp.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left text-sm hover:bg-slate-800/80 transition-colors"
                style={{
                  color: 'hsl(var(--builder-text-secondary))',
                }}
              >
                {comp.label}
                <Plus className="h-3.5 w-3.5" />
              </button>
            ))}
          </CategoryRow>
        </div>
      </div>

      {/* Layers Tree */}
      <div className="flex-1 flex flex-col min-h-0">
        <div
          className="h-10 flex items-center justify-between px-3 border-b flex-shrink-0"
          style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
        >
          <div className="flex items-center gap-2">
            <Layers
              className="h-4 w-4"
              style={{ color: 'hsl(var(--builder-text-muted))' }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: 'hsl(var(--builder-text-primary))' }}
            >
              Layers
            </span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="mb-1">
              <div
                className="flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors"
                style={{
                  backgroundColor: expandedPage
                    ? 'hsl(var(--builder-hover))'
                    : 'transparent',
                }}
                onClick={toggleExpand}
              >
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent">
                  {expandedPage ? (
                    <ChevronDown
                      className="h-3 w-3"
                      style={{ color: 'hsl(var(--builder-text-muted))' }}
                    />
                  ) : (
                    <ChevronRight
                      className="h-3 w-3"
                      style={{ color: 'hsl(var(--builder-text-muted))' }}
                    />
                  )}
                </Button>
                <Grid3X3
                  className="h-4 w-4"
                  style={{ color: 'hsl(var(--builder-text-secondary))' }}
                />
                <span
                  className="text-sm font-medium flex-1"
                  style={{ color: 'hsl(var(--builder-text-primary))' }}
                >
                  Page
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'hsl(var(--builder-text-muted))' }}
                >
                  {state.sections.length}
                </span>
              </div>

              {expandedPage && (
                <div
                  className="ml-3 border-l pl-2 mt-1 space-y-0.5"
                  style={{ borderColor: 'hsl(var(--builder-divider))' }}
                >
                  {state.sections.map((section, index) => {
                    const Icon = sectionIcons[toComponentId(section.type)] ?? Layout;
                    const isSelected = state.selectedId === section.id;
                    const isHovered = state.hoveredId === section.id;
                    const nextSection = state.sections[index + 1];
                    const mergeKey = `${section.id}-${nextSection?.id || ''}`;
                    const isMerging = mergingIds.has(mergeKey);

                    return (
                      <div key={section.id} className="space-y-0.5">
                        <div
                          className={cn(
                            'group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
                            isSelected && 'bg-[hsl(var(--builder-selection-light))]',
                            !isSelected && isHovered && 'bg-[hsl(var(--builder-hover))]',
                            !isSelected && !isHovered && 'hover:bg-[hsl(var(--builder-hover))]'
                          )}
                          onClick={() => handleSelect(section.id)}
                          onMouseEnter={() =>
                            dispatch({ type: 'HOVER', id: section.id })
                          }
                          onMouseLeave={() => dispatch({ type: 'HOVER', id: null })}
                        >
                          <Icon
                            className={cn(
                              'h-4 w-4 flex-shrink-0',
                              isSelected
                                ? 'text-[hsl(var(--builder-selection))]'
                                : 'text-[hsl(var(--builder-text-secondary))]'
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm truncate flex-1',
                              isSelected
                                ? 'font-medium'
                                : '',
                              !section.visible && 'opacity-50'
                            )}
                            style={{
                              color: isSelected
                                ? 'hsl(var(--builder-selection))'
                                : 'hsl(var(--builder-text-secondary))',
                            }}
                          >
                            {section.label}
                          </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0',
                            !section.visible && 'opacity-100'
                          )}
                          style={{ color: 'hsl(var(--builder-text-muted))' }}
                          onClick={(e) => handleToggleVisibility(e, section.id)}
                        >
                          {section.visible ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-[hsl(var(--builder-selection))]"
                          onClick={(e) => handleFocusInAi(e, section.id)}
                          title="Stage this section for AI"
                        >
                          <Grid3X3 className="h-3 w-3" />
                        </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-red-400 hover:text-red-300"
                            onClick={(e) => handleRemove(e, section.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {nextSection && (
                          <div className="relative h-0 overflow-visible z-10">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                'absolute right-0 top-0 -translate-y-1/2',
                                'h-7 w-7 p-0 rounded-full shrink-0 shadow-lg transition-all duration-200',
                                'border-2 bg-slate-800 border-[hsl(var(--builder-selection))]/60',
                                'text-[hsl(var(--builder-selection))]',
                                'hover:scale-110 hover:bg-[hsl(var(--builder-selection))]/25 hover:border-[hsl(var(--builder-selection))]',
                                'hover:shadow-lg active:scale-95',
                                isMerging && 'animate-pulse scale-110 bg-[hsl(var(--builder-selection))]/25 border-[hsl(var(--builder-selection))]'
                              )}
                              onClick={(e) => handleMerge(e, section.id, nextSection.id)}
                              disabled={isMerging}
                              title={`Merge "${section.label}" and "${nextSection.label}"`}
                            >
                              <Merge className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div
          className="h-10 flex items-center justify-center border-t px-3 flex-shrink-0"
          style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
        >
          <span
            className="text-xs"
            style={{ color: 'hsl(var(--builder-text-muted))' }}
          >
            {state.sections.filter((s) => s.visible).length} of{' '}
            {state.sections.length} visible
          </span>
        </div>
      </div>
    </div>
  );
}
