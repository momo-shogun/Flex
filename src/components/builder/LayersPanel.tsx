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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBuilder } from '@/contexts/BuilderContext';
import { cn } from '@/lib/utils';
import type { ComponentId } from '@/types/components';

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
};

const CATEGORY_KEYS = ['textAnimations', 'backgrounds', 'sections'] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const defaultCategoriesOpen: Record<CategoryKey, boolean> = {
  textAnimations: false,
  backgrounds: false,
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
  const [expandedPage, setExpandedPage] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState<Record<CategoryKey, boolean>>(defaultCategoriesOpen);

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
                  {state.sections.map((section) => {
                    const Icon = sectionIcons[section.type] ?? Layout;
                    const isSelected = state.selectedId === section.id;
                    const isHovered = state.hoveredId === section.id;

                    return (
                      <div
                        key={section.id}
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
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-red-400 hover:text-red-300"
                          onClick={(e) => handleRemove(e, section.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
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
