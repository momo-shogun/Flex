import { useState } from 'react';
import {
  Settings2,
  Layout,
  ChevronDown,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Eye,
  EyeOff,
  Minus,
  Pencil,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPickerField } from '@/components/ui/color-picker-field';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useBuilder } from '@/contexts/BuilderContext';
import { INNER_LAYOUT_TYPES } from '@/contexts/BuilderContext';
import { toComponentId } from '@/types/builder.types';
import type { ComponentId } from '@/types/components';

const borderCls = 'border-b';
const borderStyle = { borderColor: 'hsl(var(--builder-panel-border))' };
const mutedStyle = { color: 'hsl(var(--builder-text-muted))' };
const primaryStyle = { color: 'hsl(var(--builder-text-primary))' };
const labelClass = 'text-xs font-medium';
const inputClass = 'h-8 text-sm bg-slate-800 border-slate-600';

function toPx(value: unknown): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  return 0;
}
function toNum(value: unknown, fallback: number): number {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}
function toBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  return fallback;
}
function toStr(value: unknown, fallback: string): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

function InspectSection({
  title,
  defaultOpen = false,
  children,
  rightElement,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={borderCls} style={borderStyle}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="w-full justify-between px-3 py-2 h-auto font-normal rounded-none hover:bg-slate-800/50"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
          <span className="text-xs font-medium" style={primaryStyle}>
            {title}
          </span>
        </div>
        {rightElement}
      </Button>
      {open && <div className="px-3 pb-3 pt-0">{children}</div>}
    </div>
  );
}

export function InspectorPanel() {
  const { dispatch, selectedSection } = useBuilder();

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
          style={borderStyle}
        >
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" style={mutedStyle} />
            <span className="text-sm font-medium" style={primaryStyle}>
              Inspector
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mx-auto mb-3"
              style={borderStyle}
            >
              <Layout className="h-6 w-6" style={mutedStyle} />
            </div>
            <p className="text-sm" style={mutedStyle}>
              Select an element to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isDev = import.meta.env.MODE === 'development';

  const props = selectedSection.props as Record<string, unknown>;
  const showInnerLayout = INNER_LAYOUT_TYPES.includes(toComponentId(selectedSection.type));

  return (
    <div className="h-full flex flex-col min-w-0 bg-slate-900/50">
      <div
        className="h-10 flex items-center px-3 border-b flex-shrink-0"
        style={borderStyle}
      >
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" style={mutedStyle} />
          <span className="text-sm font-medium" style={primaryStyle}>
            Inspector
          </span>
        </div>
      </div>

      <TooltipProvider delayDuration={300}>
        <ScrollArea className="flex-1">
          {/* Editing: selected component */}
          <div className="px-3 py-3 space-y-2" style={borderStyle}>
            <div className="flex items-center gap-2 text-xs" style={mutedStyle}>
              <Pencil className="h-3.5 w-3.5" />
              <span>Editing</span>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Component title</Label>
              <div className="flex items-center gap-2 flex-wrap">
                <Input
                  value={selectedSection.label}
                  onChange={(e) => updateSection('label', e.target.value)}
                  className={cn(inputClass, 'flex-1 min-w-0 font-medium')}
                  placeholder="e.g. Hero, Footer"
                />
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-slate-800 border border-slate-600"
                  style={mutedStyle}
                >
                  {selectedSection.type}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="inspector-visible" className="text-xs text-slate-400">
                Visible
              </Label>
              <Switch
                id="inspector-visible"
                checked={selectedSection.visible}
                onCheckedChange={(checked) => updateSection('visible', checked)}
              />
            </div>
          </div>
          <Separator className="bg-slate-700/80" />

        {/* Content */}
        <InspectSection title="Content" defaultOpen>
          <ContentProperties
            type={toComponentId(selectedSection.type)}
            props={props}
            onUpdate={updateProp}
          />
        </InspectSection>

        {/* Alignment */}
        <InspectSection title="Alignment">
          <div className="space-y-2">
            <Label className={labelClass}>Horizontal</Label>
            <div className="flex gap-1">
              {[
                { value: 'flex-start', icon: AlignLeft, label: 'Align left' },
                { value: 'center', icon: AlignCenter, label: 'Center' },
                { value: 'flex-end', icon: AlignRight, label: 'Align right' },
              ].map(({ value, icon: Icon, label }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={props.justifyContent === value ? 'default' : 'outline'}
                      size="icon"
                      className={cn(
                        'h-8 w-8 flex-1',
                        props.justifyContent === value &&
                          'bg-[hsl(var(--builder-selection))] border-[hsl(var(--builder-selection))] hover:bg-[hsl(var(--builder-selection))]/90'
                      )}
                      onClick={() => updateProp('justifyContent', value)}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <Label className={labelClass}>Vertical</Label>
            <div className="flex gap-1">
              {[
                { value: 'flex-start', icon: AlignStartVertical, label: 'Align top' },
                { value: 'center', icon: AlignCenterVertical, label: 'Align middle' },
                { value: 'flex-end', icon: AlignEndVertical, label: 'Align bottom' },
              ].map(({ value, icon: Icon, label }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={props.alignItems === value ? 'default' : 'outline'}
                      size="icon"
                      className={cn(
                        'h-8 w-8 flex-1',
                        props.alignItems === value &&
                          'bg-[hsl(var(--builder-selection))] border-[hsl(var(--builder-selection))] hover:bg-[hsl(var(--builder-selection))]/90'
                      )}
                      onClick={() => updateProp('alignItems', value)}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </InspectSection>

        <Separator className="bg-slate-700/80" />
        {/* Position */}
        <InspectSection title="Position">
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-500">X</Label>
              <Input
                type="number"
                value={toNum(props.positionX, 0)}
                onChange={(e) => updateProp('positionX', Number(e.target.value) || 0)}
                className={cn(inputClass, 'w-full')}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-500">Y</Label>
              <Input
                type="number"
                value={toNum(props.positionY, 0)}
                onChange={(e) => updateProp('positionY', Number(e.target.value) || 0)}
                className={cn(inputClass, 'w-full')}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-500">R</Label>
              <Input
                type="number"
                value={toNum(props.rotation, 0)}
                onChange={(e) => updateProp('rotation', Number(e.target.value) || 0)}
                className={cn(inputClass, 'w-full')}
                placeholder="0°"
              />
            </div>
          </div>
        </InspectSection>

        {/* Layout — padding & margin */}
        <InspectSection title="Layout">
          <LayoutProperties
            type={toComponentId(selectedSection.type)}
            props={props}
            onUpdate={updateProp}
            showInnerLayout={showInnerLayout}
            compact
          />
        </InspectSection>

        {/* Dimensions */}
        <InspectSection title="Dimensions">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-slate-500 block mb-0.5">W</Label>
                <Input
                  type="number"
                  value={toNum(props.width, 0) || ''}
                  onChange={(e) => updateProp('width', e.target.value === '' ? 0 : Number(e.target.value))}
                  className={cn(inputClass, 'w-full')}
                  placeholder="auto"
                />
              </div>
              <div>
                <Label className="text-[10px] text-slate-500 block mb-0.5">H</Label>
                <Input
                  type="number"
                  value={toNum(props.height, 0) || ''}
                  onChange={(e) => updateProp('height', e.target.value === '' ? 0 : Number(e.target.value))}
                  className={cn(inputClass, 'w-full')}
                  placeholder="auto"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-300 hover:text-slate-100">
                <input
                  type="checkbox"
                  checked={toBool(props.fillWidth, false)}
                  onChange={(e) => updateProp('fillWidth', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-[hsl(var(--builder-selection))] focus:ring-[hsl(var(--builder-selection))]"
                />
                Fill width
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-300 hover:text-slate-100">
                <input
                  type="checkbox"
                  checked={toBool(props.fillHeight, false)}
                  onChange={(e) => updateProp('fillHeight', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-[hsl(var(--builder-selection))] focus:ring-[hsl(var(--builder-selection))]"
                />
                Fill height
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-300 hover:text-slate-100">
                <input
                  type="checkbox"
                  checked={toBool(props.clipContent, false)}
                  onChange={(e) => updateProp('clipContent', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-[hsl(var(--builder-selection))] focus:ring-[hsl(var(--builder-selection))]"
                />
                Clip content
              </label>
            </div>
          </div>
        </InspectSection>

        {/* Appearance */}
        <InspectSection title="Appearance">
          <div className="space-y-1.5">
            <Label className={labelClass}>Opacity (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
                value={toNum(props.opacity, 100)}
                onChange={(e) => updateProp('opacity', Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className={cn(inputClass, 'w-full')}
            />
          </div>
        </InspectSection>

        {/* Dev-only raw props view for debugging AI updates */}
        {isDev && (
          <InspectSection title="Raw props (dev only)">
            <div className="max-h-40 overflow-auto rounded-md bg-slate-900/80 border border-slate-700 px-2 py-1.5">
              <pre className="text-[10px] leading-snug text-slate-200 whitespace-pre-wrap break-words">
                {JSON.stringify(props, null, 2)}
              </pre>
            </div>
          </InspectSection>
        )}

        {/* Fill */}
        <InspectSection
          title="Fill"
          rightElement={
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-slate-200"
                  onClick={() => updateProp('fillVisible', !toBool(props.fillVisible, true))}
                >
                  {toBool(props.fillVisible, true) ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {toBool(props.fillVisible, true) ? 'Hide fill' : 'Show fill'}
              </TooltipContent>
            </Tooltip>
          }
        >
          <div className="space-y-2">
            <ColorPickerField
              value={toStr(props.backgroundColor, '')}
              onChange={(hex) => updateProp('backgroundColor', hex)}
              placeholder="#FFFFFF or empty for transparent"
              inputClassName={inputClass}
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={0}
                max={100}
                value={toNum(props.fillOpacity, 100)}
                onChange={(e) => updateProp('fillOpacity', Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className={cn(inputClass, 'w-16')}
              />
              <span className="text-[10px] text-slate-500">%</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-center gap-1.5 h-8 text-xs"
              onClick={() => {
                updateProp('backgroundColor', '');
                updateProp('fillOpacity', 100);
              }}
            >
              <Minus className="h-3 w-3" /> Remove fill
            </Button>
          </div>
        </InspectSection>

        {/* Stroke */}
        <InspectSection title="Stroke">
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <Label className={labelClass + ' w-16 shrink-0'}>Width</Label>
              <Input
                type="number"
                min={0}
                value={toNum(props.strokeWidth, 0)}
                onChange={(e) => updateProp('strokeWidth', Math.max(0, Number(e.target.value) || 0))}
                className={cn(inputClass, 'flex-1')}
              />
            </div>
            <ColorPickerField
              value={toStr(props.strokeColor, '#000000')}
              onChange={(hex) => updateProp('strokeColor', hex)}
              placeholder="#000000"
              inputClassName={inputClass}
            />
          </div>
        </InspectSection>
        </ScrollArea>
      </TooltipProvider>
    </div>
  );
}

function LayoutProperties({
  type: _type,
  props,
  onUpdate,
  showInnerLayout,
  compact = false,
}: {
  type: ComponentId;
  props: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
  showInnerLayout: boolean;
  compact?: boolean;
}) {
  const inputClassShort = 'h-8 text-sm bg-slate-800 border-slate-600 w-14';

  const padGrid = (
    label: string,
    keys: { t: string; r: string; b: string; l: string }
  ) => (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      <Label className="text-[10px]" style={mutedStyle}>{label}</Label>
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { k: keys.t, l: 'T' },
          { k: keys.r, l: 'R' },
          { k: keys.b, l: 'B' },
          { k: keys.l, l: 'L' },
        ].map(({ k, l }) => (
          <div key={k}>
            <span className="text-[10px] text-slate-500 block mb-0.5">{l}</span>
            <Input
              type="number"
              value={toPx(props[k as keyof typeof props])}
              onChange={(e) => onUpdate(k, e.target.value === '' ? 0 : Number(e.target.value))}
              className={inputClassShort}
              placeholder="0"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {padGrid('Padding (px)', {
        t: 'paddingTop',
        r: 'paddingRight',
        b: 'paddingBottom',
        l: 'paddingLeft',
      })}
      {padGrid('Margin (px)', {
        t: 'marginTop',
        r: 'marginRight',
        b: 'marginBottom',
        l: 'marginLeft',
      })}
      {showInnerLayout && (
        <>
          <div className="pt-2" style={borderStyle}>
            {padGrid('Inner padding (px)', {
              t: 'innerPaddingTop',
              r: 'innerPaddingRight',
              b: 'innerPaddingBottom',
              l: 'innerPaddingLeft',
            })}
          </div>
          {padGrid('Inner margin (px)', {
            t: 'innerMarginTop',
            r: 'innerMarginRight',
            b: 'innerMarginBottom',
            l: 'innerMarginLeft',
          })}
        </>
      )}
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
  const inputClassFull = inputClass + ' w-full';

  switch (type) {
    case 'split-text':
    case 'blur-text':
    case 'text-cursor':
      return (
        <div className="space-y-2">
          <div>
            <Label className={labelClass}>Text</Label>
            <Input
              value={String(props.text ?? '')}
              onChange={(e) => onUpdate('text', e.target.value)}
              className={inputClassFull}
              placeholder="Text"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className={labelClass}>Delay</Label>
              <Input
                type="number"
                value={String(props.delay ?? 0)}
                onChange={(e) => onUpdate('delay', Number(e.target.value) || 0)}
                className={inputClassFull}
              />
            </div>
            <div>
              <Label className={labelClass}>Duration</Label>
              <Input
                type="number"
                value={String(props.duration ?? 0.5)}
                onChange={(e) => onUpdate('duration', Number(e.target.value) || 0.5)}
                className={inputClassFull}
              />
            </div>
          </div>
          {(type === 'split-text' || type === 'blur-text') && (
            <div>
              <Label className={labelClass}>Animate by</Label>
              <select
                value={String(props.animateBy ?? 'characters')}
                onChange={(e) =>
                  onUpdate('animateBy', e.target.value as 'characters' | 'words')
                }
                className={inputClassFull + ' rounded-md border px-3'}
              >
                <option value="characters">Characters</option>
                <option value="words">Words</option>
              </select>
            </div>
          )}
          {type === 'blur-text' && (
            <div>
              <Label className={labelClass}>Blur amount</Label>
              <Input
                type="number"
                value={String(props.blurAmount ?? 10)}
                onChange={(e) => onUpdate('blurAmount', Number(e.target.value) || 10)}
                className={inputClassFull}
              />
            </div>
          )}
          {type === 'text-cursor' && (
            <>
              <div>
                <Label className={labelClass}>Speed</Label>
                <Input
                  type="number"
                  value={String(props.speed ?? 50)}
                  onChange={(e) => onUpdate('speed', Number(e.target.value) || 50)}
                  className={inputClassFull}
                />
              </div>
              <div>
                <Label className={labelClass}>Cursor</Label>
                <Input
                  value={String(props.cursor ?? '|')}
                  onChange={(e) => onUpdate('cursor', e.target.value)}
                  className={inputClassFull}
                />
              </div>
            </>
          )}
        </div>
      );

    case 'silk':
      return (
        <div className="space-y-2">
          <div>
            <Label className={labelClass}>Title (display text on canvas)</Label>
            <Input
              value={String(props.text ?? 'Silk Background')}
              onChange={(e) => onUpdate('text', e.target.value)}
              className={inputClassFull}
              placeholder="e.g. Silk Background"
            />
          </div>
          <div>
            <Label className={labelClass}>Subtitle / description</Label>
            <Input
              value={String(props.subtitle ?? '')}
              onChange={(e) => onUpdate('subtitle', e.target.value)}
              className={inputClassFull}
              placeholder="Optional description below title"
            />
          </div>
          <div>
            <Label className={labelClass}>Speed</Label>
            <Input
              type="number"
              value={String(props.speed ?? 5)}
              onChange={(e) => onUpdate('speed', Number(e.target.value) || 5)}
              className={inputClassFull}
            />
          </div>
          <div>
            <Label className={labelClass}>Color</Label>
            <ColorPickerField
              value={String(props.color ?? '#7B7481')}
              onChange={(hex) => onUpdate('color', hex)}
              placeholder="#7B7481"
              className="mt-1"
            />
          </div>
        </div>
      );

    case 'floating-lines':
      return (
        <div className="space-y-2">
          <div>
            <Label className={labelClass}>Title (display text on canvas)</Label>
            <Input
              value={String(props.title ?? 'Floating Lines')}
              onChange={(e) => onUpdate('title', e.target.value)}
              className={inputClassFull}
              placeholder="e.g. Floating Lines"
            />
          </div>
          <div>
            <Label className={labelClass}>Animation speed</Label>
            <Input
              type="number"
              value={String(props.animationSpeed ?? 1)}
              onChange={(e) =>
                onUpdate('animationSpeed', Number(e.target.value) || 1)
              }
              className={inputClassFull}
            />
          </div>
        </div>
      );

    case 'light-pillar':
      return (
        <div className="space-y-2">
          <div>
            <Label className={labelClass}>Title (display text on canvas)</Label>
            <Input
              value={String(props.title ?? 'Light Pillar')}
              onChange={(e) => onUpdate('title', e.target.value)}
              className={inputClassFull}
              placeholder="e.g. Light Pillar"
            />
          </div>
          <div>
            <Label className={labelClass}>Top color</Label>
            <ColorPickerField
              value={String(props.topColor ?? '#5227FF')}
              onChange={(hex) => onUpdate('topColor', hex)}
              placeholder="#5227FF"
              className="mt-1"
            />
          </div>
          <div>
            <Label className={labelClass}>Bottom color</Label>
            <ColorPickerField
              value={String(props.bottomColor ?? '#FF9FFC')}
              onChange={(hex) => onUpdate('bottomColor', hex)}
              placeholder="#FF9FFC"
              className="mt-1"
            />
          </div>
        </div>
      );

    case 'smooth-scroll-hero':
      return (
        <div className="space-y-4">
          <div>
            <Label className={labelClass}>Title (overlay text)</Label>
            <Input
              value={String(props.text ?? '')}
              onChange={(e) => onUpdate('text', e.target.value)}
              className={inputClassFull}
              placeholder="Hero overlay title (optional)"
            />
          </div>
          <div>
            <Label className={labelClass}>Subtitle / description</Label>
            <Input
              value={String(props.subtitle ?? '')}
              onChange={(e) => onUpdate('subtitle', e.target.value)}
              className={inputClassFull}
              placeholder="Optional description below title"
            />
          </div>
        </div>
      );

    case 'aurora-hero':
      return (
        <div className="space-y-2">
          <div>
            <Label className={labelClass}>Title</Label>
            <Input
              value={String(props.title ?? '')}
              onChange={(e) => onUpdate('title', e.target.value)}
              className={inputClassFull}
              placeholder="Hero title"
            />
          </div>
          <div>
            <Label className={labelClass}>Subtitle</Label>
            <Input
              value={String(props.subtitle ?? '')}
              onChange={(e) => onUpdate('subtitle', e.target.value)}
              className={inputClassFull}
              placeholder="Hero subtitle"
            />
          </div>
        </div>
      );

    case 'aurora-hero-splittext':
      return (
        <div className="space-y-4">
          <div>
            <Label className={labelClass}>Hero title (split text)</Label>
            <Input
              value={String(props.text ?? '')}
              onChange={(e) => onUpdate('text', e.target.value)}
              className={inputClassFull}
              placeholder="Animated hero title"
            />
          </div>
          <div>
            <Label className={labelClass}>Subtitle</Label>
            <Input
              value={String(props.subtitle ?? '')}
              onChange={(e) => onUpdate('subtitle', e.target.value)}
              className={inputClassFull}
              placeholder="Hero subtitle"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className={labelClass}>Delay</Label>
              <Input
                type="number"
                value={String(props.delay ?? 0)}
                onChange={(e) => onUpdate('delay', Number(e.target.value) || 0)}
                className={inputClassFull}
              />
            </div>
            <div>
              <Label className={labelClass}>Duration</Label>
              <Input
                type="number"
                value={String(props.duration ?? 0.5)}
                onChange={(e) => onUpdate('duration', Number(e.target.value) || 0.5)}
                className={inputClassFull}
              />
            </div>
          </div>
          <div>
            <Label className={labelClass}>Animate by</Label>
            <select
              value={String(props.animateBy ?? 'characters')}
              onChange={(e) =>
                onUpdate('animateBy', e.target.value as 'characters' | 'words')
              }
              className={inputClassFull}
            >
              <option value="characters">Characters</option>
              <option value="words">Words</option>
            </select>
          </div>
        </div>
      );

    case 'faq':
      return (
        <div>
          <Label className={labelClass}>Section title</Label>
          <Input
            value={String(props.title ?? '')}
            onChange={(e) => onUpdate('title', e.target.value)}
            className={inputClassFull}
            placeholder="FAQ section title"
          />
        </div>
      );

    case 'silk-hero-splittext':
      return (
        <div className="space-y-4">
          <div>
            <Label className={labelClass}>Hero text</Label>
            <Input
              value={String(props.text ?? '')}
              onChange={(e) => onUpdate('text', e.target.value)}
              className={inputClassFull}
              placeholder="Text"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className={labelClass}>Delay</Label>
              <Input
                type="number"
                value={String(props.delay ?? 0)}
                onChange={(e) => onUpdate('delay', Number(e.target.value) || 0)}
                className={inputClassFull}
              />
            </div>
            <div>
              <Label className={labelClass}>Duration</Label>
              <Input
                type="number"
                value={String(props.duration ?? 0.5)}
                onChange={(e) => onUpdate('duration', Number(e.target.value) || 0.5)}
                className={inputClassFull}
              />
            </div>
          </div>
          <div>
            <Label className={labelClass}>Animate by</Label>
            <select
              value={String(props.animateBy ?? 'characters')}
              onChange={(e) =>
                onUpdate('animateBy', e.target.value as 'characters' | 'words')
              }
              className={inputClassFull + ' rounded-md border px-3'}
            >
              <option value="characters">Characters</option>
              <option value="words">Words</option>
            </select>
          </div>
          <Separator className="bg-slate-700/80" />
          <div>
            <Label className={labelClass}>Silk speed</Label>
            <Input
              type="number"
              value={String(props.speed ?? 5)}
              onChange={(e) => onUpdate('speed', Number(e.target.value) || 5)}
              className={inputClassFull}
            />
          </div>
          <div>
            <Label className={labelClass}>Silk color</Label>
            <ColorPickerField
              value={String(props.color ?? '#7B7481')}
              onChange={(hex) => onUpdate('color', hex)}
              placeholder="#7B7481"
              className="mt-1"
            />
          </div>
        </div>
      );

    default:
      return (
        <p className="text-xs py-2" style={mutedStyle}>
          No editable content for this type.
        </p>
      );
  }
}
