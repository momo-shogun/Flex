import {
  Settings2,
  Palette,
  Layout,
  Type,
  AlignLeft,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBuilder } from '@/contexts/BuilderContext';
import type { ComponentId } from '@/types/components';

export function InspectorPanel() {
  const { state, dispatch, selectedSection } = useBuilder();

  const updateProp = (key: string, value: unknown) => {
    if (selectedSection) {
      dispatch({
        type: 'UPDATE_PROPS',
        id: selectedSection.id,
        props: { [key]: value },
      });
    }
  };

  const updateSection = (key: string, value: unknown) => {
    if (selectedSection) {
      dispatch({
        type: 'UPDATE_SECTION',
        id: selectedSection.id,
        updates: { [key]: value },
      });
    }
  };

  if (!selectedSection) {
    return (
      <div className="h-full flex flex-col">
        <div
          className="h-10 flex items-center px-3 border-b flex-shrink-0"
          style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
        >
          <div className="flex items-center gap-2">
            <Settings2
              className="h-4 w-4"
              style={{ color: 'hsl(var(--builder-text-muted))' }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: 'hsl(var(--builder-text-primary))' }}
            >
              Inspector
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mx-auto mb-3"
              style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
            >
              <Layout
                className="h-6 w-6"
                style={{ color: 'hsl(var(--builder-text-muted))' }}
              />
            </div>
            <p
              className="text-sm"
              style={{ color: 'hsl(var(--builder-text-secondary))' }}
            >
              Select an element to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const props = selectedSection.props as Record<string, unknown>;

  return (
    <div className="h-full flex flex-col">
      <div
        className="h-10 flex items-center justify-between px-3 border-b flex-shrink-0"
        style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
      >
        <div className="flex items-center gap-2">
          <Settings2
            className="h-4 w-4"
            style={{ color: 'hsl(var(--builder-text-muted))' }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: 'hsl(var(--builder-text-primary))' }}
          >
            Inspector
          </span>
        </div>
      </div>

      <div
        className="px-3 py-3 border-b"
        style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'hsl(var(--builder-text-muted))' }}
          >
            {selectedSection.type}
          </span>
          <Switch
            checked={selectedSection.visible}
            onCheckedChange={(checked) => updateSection('visible', checked)}
          />
        </div>
        <Input
          value={selectedSection.label}
          onChange={(e) => updateSection('label', e.target.value)}
          className="h-8 text-sm"
          placeholder="Section name"
        />
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
        <TabsList
          className="w-full justify-start rounded-none border-b bg-transparent h-9 px-3"
          style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
        >
          <TabsTrigger
            value="content"
            className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-2 data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--builder-selection))] data-[state=active]:text-[hsl(var(--builder-selection))]"
          >
            <Type className="h-3.5 w-3.5 mr-1.5" />
            Content
          </TabsTrigger>
          <TabsTrigger
            value="style"
            className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-2 data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--builder-selection))] data-[state=active]:text-[hsl(var(--builder-selection))]"
          >
            <Palette className="h-3.5 w-3.5 mr-1.5" />
            Style
          </TabsTrigger>
          <TabsTrigger
            value="layout"
            className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-2 data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--builder-selection))] data-[state=active]:text-[hsl(var(--builder-selection))]"
          >
            <AlignLeft className="h-3.5 w-3.5 mr-1.5" />
            Layout
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="content" className="p-3 m-0 space-y-4">
            <ContentProperties
              type={selectedSection.type}
              props={props}
              onUpdate={updateProp}
            />
          </TabsContent>

          <TabsContent value="style" className="p-3 m-0">
            <div
              className="text-xs text-center py-8"
              style={{ color: 'hsl(var(--builder-text-muted))' }}
            >
              Style properties coming soon
            </div>
          </TabsContent>

          <TabsContent value="layout" className="p-3 m-0">
            <LayoutProperties props={props} onUpdate={updateProp} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

function toPx(value: unknown): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  return 0;
}

function LayoutProperties({
  props,
  onUpdate,
}: {
  props: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}) {
  const labelClass = 'text-xs';
  const inputClass = 'h-8 text-sm bg-slate-800 border-slate-600 w-14';

  return (
    <div className="space-y-4">
      <div>
        <Label className={labelClass}>Padding (px)</Label>
        <div className="grid grid-cols-4 gap-1.5 mt-1">
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">T</span>
            <Input
              type="number"
              value={toPx(props.paddingTop)}
              onChange={(e) =>
                onUpdate('paddingTop', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">R</span>
            <Input
              type="number"
              value={toPx(props.paddingRight)}
              onChange={(e) =>
                onUpdate('paddingRight', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">B</span>
            <Input
              type="number"
              value={toPx(props.paddingBottom)}
              onChange={(e) =>
                onUpdate('paddingBottom', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">L</span>
            <Input
              type="number"
              value={toPx(props.paddingLeft)}
              onChange={(e) =>
                onUpdate('paddingLeft', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
        </div>
      </div>
      <div>
        <Label className={labelClass}>Margin (px)</Label>
        <div className="grid grid-cols-4 gap-1.5 mt-1">
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">T</span>
            <Input
              type="number"
              value={toPx(props.marginTop)}
              onChange={(e) =>
                onUpdate('marginTop', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">R</span>
            <Input
              type="number"
              value={toPx(props.marginRight)}
              onChange={(e) =>
                onUpdate('marginRight', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">B</span>
            <Input
              type="number"
              value={toPx(props.marginBottom)}
              onChange={(e) =>
                onUpdate('marginBottom', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">L</span>
            <Input
              type="number"
              value={toPx(props.marginLeft)}
              onChange={(e) =>
                onUpdate('marginLeft', e.target.value === '' ? 0 : Number(e.target.value))
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentProperties({
  type,
  props,
  onUpdate,
}: {
  type: ComponentId;
  props: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}) {
  const labelClass = 'text-xs';
  const inputClass = 'h-8 text-sm bg-slate-800 border-slate-600';

  switch (type) {
    case 'split-text':
    case 'blur-text':
    case 'text-cursor':
      return (
        <>
          <div className="space-y-1.5">
            <Label className={labelClass}>Text</Label>
            <Input
              value={String(props.text ?? '')}
              onChange={(e) => onUpdate('text', e.target.value)}
              className={inputClass}
              placeholder="Text"
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Delay</Label>
            <Input
              type="number"
              value={String(props.delay ?? 0)}
              onChange={(e) =>
                onUpdate('delay', Number(e.target.value) || 0)
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Duration</Label>
            <Input
              type="number"
              value={String(props.duration ?? 0.5)}
              onChange={(e) =>
                onUpdate('duration', Number(e.target.value) || 0.5)
              }
              className={inputClass}
            />
          </div>
          {(type === 'split-text' || type === 'blur-text') && (
            <div className="space-y-1.5">
              <Label className={labelClass}>Animate by</Label>
              <select
                value={String(props.animateBy ?? 'characters')}
                onChange={(e) =>
                  onUpdate('animateBy', e.target.value as 'characters' | 'words')
                }
                className={inputClass + ' w-full rounded-md border px-3'}
              >
                <option value="characters">Characters</option>
                <option value="words">Words</option>
              </select>
            </div>
          )}
          {type === 'blur-text' && (
            <div className="space-y-1.5">
              <Label className={labelClass}>Blur amount</Label>
              <Input
                type="number"
                value={String(props.blurAmount ?? 10)}
                onChange={(e) =>
                  onUpdate('blurAmount', Number(e.target.value) || 10)
                }
                className={inputClass}
              />
            </div>
          )}
          {type === 'text-cursor' && (
            <>
              <div className="space-y-1.5">
                <Label className={labelClass}>Speed</Label>
                <Input
                  type="number"
                  value={String(props.speed ?? 50)}
                  onChange={(e) =>
                    onUpdate('speed', Number(e.target.value) || 50)
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className={labelClass}>Cursor</Label>
                <Input
                  value={String(props.cursor ?? '|')}
                  onChange={(e) => onUpdate('cursor', e.target.value)}
                  className={inputClass}
                />
              </div>
            </>
          )}
        </>
      );

    case 'silk':
      return (
        <>
          <div className="space-y-1.5">
            <Label className={labelClass}>Speed</Label>
            <Input
              type="number"
              value={String(props.speed ?? 5)}
              onChange={(e) =>
                onUpdate('speed', Number(e.target.value) || 5)
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Color</Label>
            <Input
              value={String(props.color ?? '#7B7481')}
              onChange={(e) => onUpdate('color', e.target.value)}
              className={inputClass}
            />
          </div>
        </>
      );

    case 'floating-lines':
      return (
        <div className="space-y-1.5">
          <Label className={labelClass}>Animation speed</Label>
          <Input
            type="number"
            value={String(props.animationSpeed ?? 1)}
            onChange={(e) =>
              onUpdate('animationSpeed', Number(e.target.value) || 1)
            }
            className={inputClass}
          />
        </div>
      );

    case 'light-pillar':
      return (
        <>
          <div className="space-y-1.5">
            <Label className={labelClass}>Top color</Label>
            <Input
              value={String(props.topColor ?? '#5227FF')}
              onChange={(e) => onUpdate('topColor', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Bottom color</Label>
            <Input
              value={String(props.bottomColor ?? '#FF9FFC')}
              onChange={(e) => onUpdate('bottomColor', e.target.value)}
              className={inputClass}
            />
          </div>
        </>
      );

    case 'aurora-hero':
      return (
        <>
          <div className="space-y-1.5">
            <Label className={labelClass}>Title</Label>
            <Input
              value={String(props.title ?? '')}
              onChange={(e) => onUpdate('title', e.target.value)}
              className={inputClass}
              placeholder="Hero title"
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Subtitle</Label>
            <Input
              value={String(props.subtitle ?? '')}
              onChange={(e) => onUpdate('subtitle', e.target.value)}
              className={inputClass}
              placeholder="Hero subtitle"
            />
          </div>
        </>
      );

    case 'faq':
      return (
        <div className="space-y-1.5">
          <Label className={labelClass}>Section title</Label>
          <Input
            value={String(props.title ?? '')}
            onChange={(e) => onUpdate('title', e.target.value)}
            className={inputClass}
            placeholder="FAQ section title"
          />
        </div>
      );

    case 'smooth-scroll-hero':
    default:
      return (
        <div
          className="text-xs py-4"
          style={{ color: 'hsl(var(--builder-text-muted))' }}
        >
          No editable content props for this section type.
        </div>
      );
  }
}
