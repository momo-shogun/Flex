import type { ComponentId } from './components';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface PageSection {
  id: string;
  type: ComponentId;
  label: string;
  visible: boolean;
  props: Record<string, unknown>;
}

export interface PageState {
  sections: PageSection[];
  selectedId: string | null;
  /** Optional key for an element within the selected section (e.g. 'title'). */
  selectedElementKey: string | null;
  hoveredId: string | null;
  device: DeviceType;
  zoom: number;
}

export type PageAction =
  | { type: 'SELECT'; id: string | null }
  | { type: 'SELECT_ELEMENT'; id: string; elementKey: string }
  | { type: 'HOVER'; id: string | null }
  | { type: 'SET_DEVICE'; device: DeviceType }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'TOGGLE_VISIBILITY'; id: string }
  | { type: 'UPDATE_PROPS'; id: string; props: Record<string, unknown> }
  | { type: 'UPDATE_SECTION'; id: string; updates: Partial<PageSection> }
  | { type: 'REORDER'; fromIndex: number; toIndex: number }
  | { type: 'ADD_SECTION'; section: PageSection }
  | { type: 'REMOVE_SECTION'; id: string };
