import React from 'react';
import { z } from 'zod';

const STORAGE_KEY = 'flex-generated-components';

export interface ComponentDefinition {
  id: string;
  name: string;
  component: React.ComponentType<Record<string, unknown>>;
  propsSchema: z.ZodSchema;
  category: 'ai-generated' | 'pre-built' | 'imported';
  metadata: {
    description: string;
    author: string;
    createdAt: Date;
    usageCount: number;
  };
}

/** Placeholder component shown in canvas for generated/imported components (real code used on export). */
function PlaceholderComponent({
  name,
  id,
}: {
  name?: string;
  id?: string;
} & Record<string, unknown>) {
  return React.createElement(
    'div',
    {
      className:
        'min-h-[200px] flex flex-col items-center justify-center bg-slate-800/50 border border-slate-600 rounded-lg p-6 gap-2',
      'data-generated-id': id,
    },
    React.createElement('p', { className: 'text-sm text-slate-400 font-mono' }, id ?? 'generated'),
    React.createElement('p', { className: 'text-lg text-slate-200' }, name ?? 'Generated Component'),
    React.createElement('p', { className: 'text-xs text-slate-500' }, 'Preview in export')
  );
}

class ComponentRegistry {
  private components = new Map<string, ComponentDefinition>();
  private codeCache = new Map<string, string>();

  registerGeneratedComponent(
    code: string,
    name: string,
    propsSchema: z.ZodSchema = z.record(z.unknown()),
    meta?: { description?: string }
  ): string {
    const id = `gen-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const component: React.ComponentType<Record<string, unknown>> = (props) =>
      React.createElement(PlaceholderComponent, { name, id, ...props });

    this.components.set(id, {
      id,
      name,
      component,
      propsSchema,
      category: 'ai-generated',
      metadata: {
        description: meta?.description ?? `AI-generated: ${name}`,
        author: 'AI',
        createdAt: new Date(),
        usageCount: 0,
      },
    });
    this.codeCache.set(id, code);
    this.persistToStorage();
    return id;
  }

  getComponent(id: string): ComponentDefinition | undefined {
    return this.components.get(id);
  }

  getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  getComponentCode(id: string): string | undefined {
    return this.codeCache.get(id);
  }

  getGeneratedIds(): string[] {
    return this.getAllComponents()
      .filter((c) => c.category === 'ai-generated' || c.id.startsWith('gen-'))
      .map((c) => c.id);
  }

  private persistToStorage(): void {
    try {
      const data = Array.from(this.components.entries()).map(([id, def]) => ({
        id,
        name: def.name,
        code: this.codeCache.get(id),
        category: def.category,
        metadata: def.metadata,
      }));
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // ignore
    }
  }

  loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Array<{
        id: string;
        name: string;
        code?: string;
        category: string;
        metadata: { description?: string; createdAt?: string; usageCount?: number };
      }>;
      for (const item of data) {
        if (!item.code || !item.id) continue;
        const component: React.ComponentType<Record<string, unknown>> = (props) =>
          React.createElement(PlaceholderComponent, {
            name: item.name,
            id: item.id,
            ...props,
          });
        this.components.set(item.id, {
          id: item.id,
          name: item.name,
          component,
          propsSchema: z.record(z.unknown()),
          category: 'ai-generated',
          metadata: {
            description: item.metadata?.description ?? `AI-generated: ${item.name}`,
            author: 'AI',
            createdAt: item.metadata?.createdAt ? new Date(item.metadata.createdAt) : new Date(),
            usageCount: item.metadata?.usageCount ?? 0,
          },
        });
        this.codeCache.set(item.id, item.code);
      }
    } catch {
      // ignore
    }
  }
}

export const componentRegistry = new ComponentRegistry();

if (typeof window !== 'undefined') {
  componentRegistry.loadFromStorage();
}
