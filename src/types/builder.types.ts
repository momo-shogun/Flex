import type { ComponentId } from './components';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface PageSection {
  id: string;
  type: ComponentId;
  label: string;
  visible: boolean;
  props: Record<string, unknown>;
}

/** Key of a selectable inner element within a section (e.g. 'title', 'subtitle', 'button'). */
export type ElementKey = string;

export interface PageState {
  sections: PageSection[];
  selectedId: string | null;
  /** When set, an inner element is selected; 'section' or null = whole section selected. */
  selectedElementKey: ElementKey | null;
  hoveredId: string | null;
  hoveredElementKey: ElementKey | null;
  device: DeviceType;
  zoom: number;
}

export type PageAction =
  | { type: 'SELECT'; id: string | null }
  | { type: 'SELECT_ELEMENT'; sectionId: string; elementKey: ElementKey | null }
  | { type: 'HOVER'; id: string | null }
  | { type: 'HOVER_ELEMENT'; sectionId: string | null; elementKey: ElementKey | null }
  | { type: 'SET_DEVICE'; device: DeviceType }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'TOGGLE_VISIBILITY'; id: string }
  | { type: 'UPDATE_PROPS'; id: string; props: Record<string, unknown> }
  | { type: 'UPDATE_SECTION'; id: string; updates: Partial<PageSection> }
  | { type: 'REORDER'; fromIndex: number; toIndex: number }
  | { type: 'ADD_SECTION'; section: PageSection }
  | { type: 'REMOVE_SECTION'; id: string }
  | { type: 'RESET' };
