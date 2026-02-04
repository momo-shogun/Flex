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

/** Figma-style layout props: padding and margin (px). Applied to every section. */
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

export function getDefaultPropsForType(
  type: ComponentId
): Record<string, unknown> {
  const layout = { ...DEFAULT_LAYOUT_PROPS };
  switch (type) {
    case 'split-text':
      return { ...DEFAULT_SPLIT_TEXT_PROPS, ...layout };
    case 'blur-text':
      return { ...DEFAULT_BLUR_TEXT_PROPS, ...layout };
    case 'text-cursor':
      return { ...DEFAULT_TEXT_CURSOR_PROPS, ...layout };
    case 'silk':
      return { ...DEFAULT_SILK_PROPS, ...layout };
    case 'floating-lines':
      return { ...DEFAULT_FLOATING_LINES_PROPS, ...layout };
    case 'light-pillar':
      return { ...DEFAULT_LIGHT_PILLAR_PROPS, ...layout };
    case 'smooth-scroll-hero':
      return { ...layout };
    case 'aurora-hero':
      return {
        ...layout,
        title: 'Decrease your SaaS churn by over 90%',
        subtitle:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae, et, distinctio eum impedit nihil ipsum modi.',
      };
    case 'faq':
      return { ...layout, title: 'Frequently Asked Questions' };
    default:
      return { ...layout };
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
  hoveredId: null,
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
        hoveredId: state.hoveredId === action.id ? null : state.hoveredId,
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
