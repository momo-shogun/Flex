import type { ComponentMetadata } from '@/types/design-system';

export type { ComponentMetadata };

export interface InteractableProps {
  id: string;
  type: string;
  metadata?: Partial<ComponentMetadata>;
}
