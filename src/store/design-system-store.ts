import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Component, Theme, DesignTokens } from '@/types/design-system';
import type { A11yIssue } from '@/types/a11y';

function getDefaultTheme(): Theme {
  return {
    mode: 'light',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      neutral: '#6B7280',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    radius: {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  };
}

function getDefaultTokens(): DesignTokens {
  const t = getDefaultTheme();
  return {
    colors: { ...t.colors },
    spacing: { ...t.spacing },
    radius: { ...t.radius },
    shadows: { ...t.shadows },
  };
}

function calculateA11yScore(issues: A11yIssue[]): number {
  const weights: Record<A11yIssue['impact'], number> = {
    critical: 20,
    serious: 10,
    moderate: 5,
    minor: 2,
  };
  const deductions = issues.reduce(
    (sum, issue) => sum + (weights[issue.impact] ?? 0),
    0
  );
  return Math.max(0, 100 - deductions);
}

export interface DesignSystemState {
  components: Map<string, Component>;
  theme: Theme;
  tokens: DesignTokens;
  selectedId: string | null;
  a11yIssues: A11yIssue[];
  a11yScore: number;
  history: Array<{ theme: Theme; components: Map<string, Component> }>;
  historyIndex: number;

  registerComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  updateMultipleComponents: (updates: Record<string, Partial<Component>>) => void;
  selectComponent: (id: string | null) => void;
  updateTheme: (updates: Partial<Theme>) => void;
  updateTokens: (updates: Partial<DesignTokens>) => void;
  setA11yIssues: (issues: A11yIssue[]) => void;
  undo: () => void;
  redo: () => void;
  snapshot: () => void;
}

export const useDesignSystemStore = create<DesignSystemState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      components: new Map(),
      theme: getDefaultTheme(),
      tokens: getDefaultTokens(),
      selectedId: null,
      a11yIssues: [],
      a11yScore: 100,
      history: [],
      historyIndex: -1,

      registerComponent: (component) =>
        set((state) => {
          state.components.set(component.id, component);
        }),

      updateComponent: (id, updates) =>
        set((state) => {
          const component = state.components.get(id);
          if (component) {
            state.components.set(id, { ...component, ...updates });
          }
        }),

      updateMultipleComponents: (updates) =>
        set((state) => {
          for (const [id, update] of Object.entries(updates)) {
            const component = state.components.get(id);
            if (component) {
              state.components.set(id, { ...component, ...update });
            }
          }
        }),

      selectComponent: (id) =>
        set((state) => {
          state.selectedId = id;
        }),

      updateTheme: (updates) =>
        set((state) => {
          state.theme = { ...state.theme, ...updates };
        }),

      updateTokens: (updates) =>
        set((state) => {
          state.tokens = { ...state.tokens, ...updates };
        }),

      setA11yIssues: (issues) =>
        set((state) => {
          state.a11yIssues = issues;
          state.a11yScore = calculateA11yScore(issues);
        }),

      snapshot: () =>
        set((state) => {
          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push({
            theme: structuredClone(state.theme),
            components: new Map(state.components),
          });
          state.historyIndex++;
          if (state.history.length > 50) {
            state.history.shift();
            state.historyIndex--;
          }
        }),

      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            state.historyIndex--;
            const snapshot = state.history[state.historyIndex];
            state.theme = snapshot.theme;
            state.components = new Map(snapshot.components);
          }
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            const snapshot = state.history[state.historyIndex];
            state.theme = snapshot.theme;
            state.components = new Map(snapshot.components);
          }
        }),
    }))
  )
);
