import type { ComponentId } from '@/types/components';
import { z } from 'zod';

export interface ComponentVariant {
  id: string;
  baseComponentId: ComponentId;
  name: string;
  description: string;
  propsOverrides: Record<string, unknown>;
  styleModifiers: {
    theme?: 'light' | 'dark' | 'colored';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'outlined' | 'filled' | 'ghost';
  };
  createdAt: Date;
}

const STORAGE_KEY = 'flex-component-variants';

class VariantRegistry {
  private variants = new Map<string, ComponentVariant>();

  createVariant(
    baseComponentId: ComponentId,
    name: string,
    propsOverrides: Record<string, unknown>,
    styleModifiers: ComponentVariant['styleModifiers']
  ): ComponentVariant {
    const variant: ComponentVariant = {
      id: `variant-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      baseComponentId,
      name,
      description: `${name} variant of ${baseComponentId}`,
      propsOverrides,
      styleModifiers,
      createdAt: new Date(),
    };
    this.variants.set(variant.id, variant);
    this.persistToStorage();
    return variant;
  }

  getVariant(id: string): ComponentVariant | undefined {
    return this.variants.get(id);
  }

  getVariantsForComponent(baseComponentId: ComponentId): ComponentVariant[] {
    return Array.from(this.variants.values()).filter(
      (v) => v.baseComponentId === baseComponentId
    );
  }

  getAllVariants(): ComponentVariant[] {
    return Array.from(this.variants.values());
  }

  private persistToStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      const data = Array.from(this.variants.entries()).map(([id, v]) => ({
        id,
        ...v,
        createdAt: v.createdAt.toISOString(),
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Array<[string, ComponentVariant & { createdAt: string }]>;
      this.variants = new Map(
        data.map(([id, v]) => [
          id,
          { ...v, id, createdAt: new Date(v.createdAt) },
        ])
      );
    } catch {
      // ignore
    }
  }
}

export const variantRegistry = new VariantRegistry();

if (typeof window !== 'undefined') {
  variantRegistry.loadFromStorage();
}

export const PRESET_VARIANTS: Partial<Record<ComponentId, ComponentVariant[]>> = {
  'aurora-hero-splittext': [
    {
      id: 'aurora-hero-dark',
      baseComponentId: 'aurora-hero-splittext',
      name: 'Dark Aurora Hero',
      description: 'Dark theme with purple/blue gradient',
      propsOverrides: {
        topColor: '#1e1b4b',
        bottomColor: '#312e81',
      },
      styleModifiers: { theme: 'dark' },
      createdAt: new Date(),
    },
    {
      id: 'aurora-hero-sunset',
      baseComponentId: 'aurora-hero-splittext',
      name: 'Sunset Hero',
      description: 'Warm sunset colors',
      propsOverrides: {
        topColor: '#f97316',
        bottomColor: '#dc2626',
      },
      styleModifiers: { theme: 'colored' },
      createdAt: new Date(),
    },
  ],
  'silk-hero-splittext': [
    {
      id: 'silk-hero-ocean',
      baseComponentId: 'silk-hero-splittext',
      name: 'Ocean Silk',
      description: 'Cool blue tones',
      propsOverrides: {
        color: '#0ea5e9',
        speed: 2,
      },
      styleModifiers: { theme: 'colored' },
      createdAt: new Date(),
    },
  ],
};
