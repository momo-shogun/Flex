import { z } from 'zod';
import { componentRegistry } from '@/lib/component-generator/registry';

export interface MarketplaceComponent {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  code: string;
  thumbnail: string;
  price: number;
  license: 'MIT' | 'Apache' | 'GPL' | 'Commercial';
}

const MOCK_ITEMS: MarketplaceComponent[] = [];

/** Publish a component to the marketplace (stub: requires backend API). */
export async function publishComponent(
  component: Omit<MarketplaceComponent, 'id' | 'downloads' | 'rating'>
): Promise<string> {
  const id = `mp-${Date.now()}`;
  if (typeof window !== 'undefined') {
    console.warn(
      'Marketplace publish is a stub. Configure /api/marketplace/publish to enable.'
    );
  }
  return id;
}

/** Search marketplace (stub: returns empty until backend is connected). */
export async function searchMarketplace(
  query: string,
  _filters?: {
    tags?: string[];
    priceRange?: [number, number];
    minRating?: number;
  }
): Promise<MarketplaceComponent[]> {
  if (typeof window !== 'undefined') {
    console.warn(
      'Marketplace search is a stub. Configure /api/marketplace/search to enable.'
    );
  }
  return [...MOCK_ITEMS].filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );
}

/** Install a component from marketplace into local registry (stub: uses local registry for demo). */
export async function installFromMarketplace(componentId: string): Promise<void> {
  const item = MOCK_ITEMS.find((c) => c.id === componentId);
  if (item) {
    componentRegistry.registerGeneratedComponent(
      item.code,
      item.name,
      z.record(z.unknown()),
      { description: item.description }
    );
  } else {
    console.warn(
      'Marketplace install is a stub. No backend; component not found:',
      componentId
    );
  }
}
