import type { ComponentId } from './components';

export interface BuilderSection {
  id: string;
  type: ComponentId;
  props?: Record<string, unknown>;
}
