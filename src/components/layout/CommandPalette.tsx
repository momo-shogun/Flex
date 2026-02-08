import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import type { ComponentId } from '../../types/components';

const WEBSITE_BUILDER_VALUE = 'tools-website-builder';

const TEXT_ANIMATION_ITEMS: { id: ComponentId; label: string }[] = [
  { id: 'split-text', label: 'Split Text' },
  { id: 'blur-text', label: 'Blur Text' },
  { id: 'text-cursor', label: 'Text Cursor' },
];

const BACKGROUND_ITEMS: { id: ComponentId; label: string }[] = [
  { id: 'silk', label: 'Silk' },
  { id: 'floating-lines', label: 'Floating Lines' },
  { id: 'light-pillar', label: 'Light Pillar' },
];

const SECTION_ITEMS: { id: ComponentId; label: string }[] = [
  { id: 'smooth-scroll-hero', label: 'Smooth Scroll Hero' },
  { id: 'aurora-hero', label: 'Aurora Hero' },
  { id: 'faq', label: 'FAQ' },
];

const ALL_ITEMS = [...TEXT_ANIMATION_ITEMS, ...BACKGROUND_ITEMS, ...SECTION_ITEMS];

interface CommandPaletteProps {
  selectedComponent: ComponentId;
  onSelectComponent: (id: ComponentId) => void;
}

export function CommandPalette({
  selectedComponent,
  onSelectComponent,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const handleOpen = () => setOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpen);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-xl px-4"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <Command
          className="w-full rounded-lg border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
          onSelect={
            ((value: string) => {
              if (value === WEBSITE_BUILDER_VALUE) {
                navigate('/tools/website-builder');
                setOpen(false);
                return;
              }
              const item = ALL_ITEMS.find((i) => i.id === value);
              if (item) {
                onSelectComponent(item.id);
                setOpen(false);
              }
            }) as unknown as React.ReactEventHandler<HTMLDivElement>
          }
        >
        <Command.Input
          placeholder="Search components..."
          className="w-full px-4 py-3 bg-transparent border-b border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-base"
          autoFocus
        />
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-slate-500 text-sm">
            No results found.
          </Command.Empty>
          <Command.Group
            heading="Text Animations"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 py-1.5"
          >
            {TEXT_ANIMATION_ITEMS.map((item) => (
              <Command.Item
                key={item.id}
                value={item.id}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-slate-200 cursor-pointer data-[selected=true]:bg-slate-700 data-[selected=true]:text-white"
              >
                {item.label}
                {selectedComponent === item.id && (
                  <span className="ml-auto text-xs text-slate-400">Selected</span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group
            heading="Backgrounds"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 py-1.5"
          >
            {BACKGROUND_ITEMS.map((item) => (
              <Command.Item
                key={item.id}
                value={item.id}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-slate-200 cursor-pointer data-[selected=true]:bg-slate-700 data-[selected=true]:text-white"
              >
                {item.label}
                {selectedComponent === item.id && (
                  <span className="ml-auto text-xs text-slate-400">Selected</span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group
            heading="Sections"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 py-1.5"
          >
            {SECTION_ITEMS.map((item) => (
              <Command.Item
                key={item.id}
                value={item.id}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-slate-200 cursor-pointer data-[selected=true]:bg-slate-700 data-[selected=true]:text-white"
              >
                {item.label}
                {selectedComponent === item.id && (
                  <span className="ml-auto text-xs text-slate-400">Selected</span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group
            heading="Tools"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 py-1.5"
          >
            <Command.Item
              value={WEBSITE_BUILDER_VALUE}
              className="flex items-center gap-2 px-3 py-2.5 rounded-md text-slate-200 cursor-pointer data-[selected=true]:bg-slate-700 data-[selected=true]:text-white"
            >
              Website Builder
            </Command.Item>
          </Command.Group>
        </Command.List>
        <div className="px-3 py-2 border-t border-slate-700 flex items-center gap-4 text-xs text-slate-500">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              ↵
            </kbd>{' '}
            Select
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              Esc
            </kbd>{' '}
            Close
          </span>
        </div>
      </Command>
      </div>
    </div>
  );
}
