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

export function getDefaultPropsForType(
  type: ComponentId
): Record<string, unknown> {
  switch (type) {
    case 'split-text':
      return { ...DEFAULT_SPLIT_TEXT_PROPS };
    case 'blur-text':
      return { ...DEFAULT_BLUR_TEXT_PROPS };
    case 'text-cursor':
      return { ...DEFAULT_TEXT_CURSOR_PROPS };
    case 'silk':
      return { ...DEFAULT_SILK_PROPS };
    case 'floating-lines':
      return { ...DEFAULT_FLOATING_LINES_PROPS };
    case 'light-pillar':
      return { ...DEFAULT_LIGHT_PILLAR_PROPS };
    case 'smooth-scroll-hero':
    case 'aurora-hero':
    case 'faq':
      return {};
    default:
      return {};
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
