import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type { ComponentId } from '@/types/components';
import {
  DEFAULT_SPLIT_TEXT_PROPS,
  DEFAULT_BLUR_TEXT_PROPS,
  DEFAULT_TEXT_CURSOR_PROPS,
  DEFAULT_SILK_PROPS,
  DEFAULT_FLOATING_LINES_PROPS,
  DEFAULT_LIGHT_PILLAR_PROPS,
} from '@/types/components';
import type { PageState, PageAction, PageSection } from '@/types/builder.types';

const COMPONENT_LABELS: Record<ComponentId, string> = {
  'split-text': 'Split Text',
  'blur-text': 'Blur Text',
  'text-cursor': 'Text Cursor',
  silk: 'Silk',
  'floating-lines': 'Floating Lines',
  'light-pillar': 'Light Pillar',
  'smooth-scroll-hero': 'Smooth Scroll Hero',
  'aurora-hero': 'Aurora Hero',
  faq: 'FAQ',
};

/** Figma-style layout props: padding and margin (px). Applied to section wrapper. */
export const DEFAULT_LAYOUT_PROPS: Record<string, number> = {
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};

/** Inner (content) layout: padding/margin inside the component. For sections that support it. */
export const DEFAULT_INNER_LAYOUT_PROPS: Record<string, number> = {
  innerPaddingTop: 0,
  innerPaddingRight: 0,
  innerPaddingBottom: 0,
  innerPaddingLeft: 0,
  innerMarginTop: 0,
  innerMarginRight: 0,
  innerMarginBottom: 0,
  innerMarginLeft: 0,
};

/** Section types that support editing inner padding/margin (content area inside component). */
export const INNER_LAYOUT_TYPES: ComponentId[] = [
  'split-text',
  'blur-text',
  'text-cursor',
  'aurora-hero',
  'faq',
];

/** Figma-style: position (px), rotation (deg), dimensions, appearance, fill, stroke. */
export const DEFAULT_FIGMA_STYLE_PROPS: Record<string, unknown> = {
  positionX: 0,
  positionY: 0,
  rotation: 0,
  width: 0,
  height: 0,
  fillWidth: false,
  fillHeight: false,
  clipContent: false,
  opacity: 100,
  backgroundColor: '',
  fillOpacity: 100,
  fillVisible: true,
  strokeWidth: 0,
  strokeColor: '#000000',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};

export function getDefaultPropsForType(
  type: ComponentId
): Record<string, unknown> {
  const layout = { ...DEFAULT_LAYOUT_PROPS };
  const figmaStyle = { ...DEFAULT_FIGMA_STYLE_PROPS };
  const innerLayout = INNER_LAYOUT_TYPES.includes(type)
    ? { ...DEFAULT_INNER_LAYOUT_PROPS }
    : {};
  switch (type) {
    case 'split-text':
      return { ...DEFAULT_SPLIT_TEXT_PROPS, ...layout, ...figmaStyle, ...innerLayout };
    case 'blur-text':
      return { ...DEFAULT_BLUR_TEXT_PROPS, ...layout, ...figmaStyle, ...innerLayout };
    case 'text-cursor':
      return { ...DEFAULT_TEXT_CURSOR_PROPS, ...layout, ...figmaStyle, ...innerLayout };
    case 'silk':
      return { ...DEFAULT_SILK_PROPS, ...layout, ...figmaStyle };
    case 'floating-lines':
      return { ...DEFAULT_FLOATING_LINES_PROPS, ...layout, ...figmaStyle };
    case 'light-pillar':
      return { ...DEFAULT_LIGHT_PILLAR_PROPS, ...layout, ...figmaStyle };
    case 'smooth-scroll-hero':
      return { ...layout, ...figmaStyle };
    case 'aurora-hero':
      return {
        ...layout,
        ...figmaStyle,
        ...innerLayout,
        title: 'Decrease your SaaS churn by over 90%',
        subtitle:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae, et, distinctio eum impedit nihil ipsum modi.',
        elementPositions: { title: { x: 0, y: 0 }, subtitle: { x: 0, y: 0 }, button: { x: 0, y: 0 } },
      };
    case 'faq':
      return { ...layout, ...figmaStyle, ...innerLayout, title: 'Frequently Asked Questions' };
    default:
      return { ...layout, ...figmaStyle };
  }
}

export function getDefaultLabelForType(type: ComponentId): string {
  return COMPONENT_LABELS[type] ?? type;
}

function generateId(): string {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const initialState: PageState = {
  sections: [],
  selectedId: null,
  selectedElementKey: null,
  hoveredId: null,
  hoveredElementKey: null,
  device: 'desktop',
  zoom: 100,
};

function pageReducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case 'SELECT':
      return { ...state, selectedId: action.id };
    case 'HOVER':
      return { ...state, hoveredId: action.id };
    case 'SET_DEVICE':
      return { ...state, device: action.device };
    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.min(200, Math.max(25, action.zoom)),
      };
    case 'TOGGLE_VISIBILITY':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.id
            ? { ...section, visible: !section.visible }
            : section
        ),
      };
    case 'UPDATE_PROPS':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.id
            ? { ...section, props: { ...section.props, ...action.props } }
            : section
        ),
      };
    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.id
            ? { ...section, ...action.updates }
            : section
        ),
      };
    case 'REORDER': {
      const newSections = [...state.sections];
      const [removed] = newSections.splice(action.fromIndex, 1);
      newSections.splice(action.toIndex, 0, removed);
      return { ...state, sections: newSections };
    }
    case 'ADD_SECTION':
      return {
        ...state,
        sections: [...state.sections, action.section],
      };
    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.filter((s) => s.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
        selectedElementKey: state.selectedId === action.id ? null : state.selectedElementKey,
        hoveredId: state.hoveredId === action.id ? null : state.hoveredId,
        hoveredElementKey: state.hoveredId === action.id ? null : state.hoveredElementKey,
      };
    default:
      return state;
  }
}

interface BuilderContextValue {
  state: PageState;
  dispatch: React.Dispatch<PageAction>;
  getSection: (id: string) => PageSection | undefined;
  selectedSection: PageSection | undefined;
  addSection: (type: ComponentId) => void;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pageReducer, initialState);

  const getSection = (id: string) =>
    state.sections.find((s) => s.id === id);
  const selectedSection = state.selectedId
    ? getSection(state.selectedId)
    : undefined;

  const addSection = (type: ComponentId) => {
    const id = generateId();
    const label = getDefaultLabelForType(type);
    const props = getDefaultPropsForType(type);
    dispatch({
      type: 'ADD_SECTION',
      section: { id, type, label, visible: true, props },
    });
  };

  return (
    <BuilderContext.Provider
      value={{
        state,
        dispatch,
        getSection,
        selectedSection,
        addSection,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
