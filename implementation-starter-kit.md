# Implementation Starter Kit (Tambo Edition)
## Production-Ready Code Examples & Patterns

---

## 🤖 How to Use This Guide

**With Tambo (Your AI Assistant):**

Instead of copy-pasting, use tambo to generate/modify code:
- "Create Button component based on the pattern shown"
- "Add Input component following the same HOC pattern"
- "Implement the Inspector panel from the examples"

Tambo understands your codebase and generates code that fits perfectly!

---

## 🔧 Core Implementation Examples

### 1. withInteractable HOC (The Magic Wrapper)

```typescript
// src/core/interactable/withInteractable.tsx

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDesignSystemStore } from '@/store/design-system-store';
import type { ComponentMetadata } from './types';

export interface InteractableConfig {
  id: string;
  type: string;
  metadata?: Partial<ComponentMetadata>;
}

export function withInteractable<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultMetadata: ComponentMetadata
) {
  function InteractableWrapper(props: P & InteractableConfig) {
    const { id, type, metadata, ...componentProps } = props;
    const elementRef = useRef<HTMLElement>(null);
    const registerComponent = useDesignSystemStore((s) => s.registerComponent);
    const selectComponent = useDesignSystemStore((s) => s.selectComponent);
    const component = useDesignSystemStore((s) => s.components.get(id));
    const prevPropsRef = useRef<Record<string, unknown> | null>(null);

    // Register on mount
    useEffect(() => {
      registerComponent({
        id,
        type,
        props: componentProps as Record<string, unknown>,
        metadata: { ...defaultMetadata, ...metadata },
        element: elementRef.current,
      });
    }, [id, type]);

    // Animate when props change
    useEffect(() => {
      const storeProps = component?.props;
      if (!storeProps || !elementRef.current) return;
      if (prevPropsRef.current === storeProps) return;
      prevPropsRef.current = storeProps;

      // GSAP highlight animation
      gsap.to(elementRef.current, {
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5)',
        duration: 0.2,
      });
      const t = setTimeout(() => {
        gsap.to(elementRef.current, {
          boxShadow: 'none',
          duration: 0.3,
        });
      }, 600);
      return () => clearTimeout(t);
    }, [component?.props]);

    const mergedProps = {
      ...componentProps,
      ...(component?.props ?? {}),
      ref: elementRef,
      'data-component-id': id,
      'data-component-type': type,
      onClick: (e: React.MouseEvent) => {
        selectComponent(id);
        (componentProps as any).onClick?.(e);
      },
    } as P;

    return <WrappedComponent {...mergedProps} />;
  }

  InteractableWrapper.displayName = `Interactable(${WrappedComponent.displayName ?? 'Component'})`;
  return InteractableWrapper;
}
```

**Ask tambo:** "Create this HOC in my project"

---

### 2. Design System Store (Zustand + Immer)

```typescript
// src/store/design-system-store.ts

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Component, Theme, DesignTokens, A11yIssue } from '@/types';

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
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    radius: { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  };
}

function calculateA11yScore(issues: A11yIssue[]): number {
  const weights = { critical: 20, serious: 10, moderate: 5, minor: 2 };
  const deductions = issues.reduce((sum, issue) => sum + (weights[issue.impact] ?? 0), 0);
  return Math.max(0, 100 - deductions);
}
```

**Ask tambo:** "Implement this Zustand store in my project"

---

### 3. Component Examples

#### Button Component

```typescript
// src/components/design-system/Button.tsx

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'md', children = 'Button', className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
          variant === 'solid' && 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
          variant === 'outline' && 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
          variant === 'ghost' && 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
          variant === 'link' && 'text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500',
          size === 'sm' && 'px-3 py-1.5 text-sm rounded-md min-h-[36px]',
          size === 'md' && 'px-4 py-2 text-base rounded-lg min-h-[44px]',
          size === 'lg' && 'px-6 py-3 text-lg rounded-xl min-h-[52px]',
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

// Interactable version
import { withInteractable } from '@/core/interactable/withInteractable';

export const InteractableButton = withInteractable(Button, {
  category: 'interactive',
  editableProps: ['variant', 'size', 'children', 'className'],
  a11yRules: ['color-contrast', 'button-name', 'focus-visible'],
});
```

#### Input Component

```typescript
// src/components/design-system/Input.tsx

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
            className
          )}
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

export const InteractableInput = withInteractable(Input, {
  category: 'form',
  editableProps: ['label', 'placeholder', 'type', 'className'],
  a11yRules: ['label', 'placeholder', 'aria-describedby'],
});
```

#### Card Component

```typescript
// src/components/design-system/Card.tsx

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'elevated', hover = false, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg p-6 transition-all',
          variant === 'elevated' && 'bg-white shadow-md',
          variant === 'outlined' && 'bg-white border-2 border-gray-200',
          variant === 'filled' && 'bg-gray-100',
          hover && 'hover:shadow-lg hover:-translate-y-1',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;

export const InteractableCard = withInteractable(Card, {
  category: 'layout',
  editableProps: ['variant', 'hover', 'className'],
  a11yRules: ['role', 'aria-label'],
});
```

#### Alert Component

```typescript
// src/components/design-system/Alert.tsx

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, children, className, ...rest }, ref) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(
          'rounded-lg p-4 flex gap-3',
          variant === 'info' && 'bg-blue-50 text-blue-900 border border-blue-200',
          variant === 'success' && 'bg-green-50 text-green-900 border border-green-200',
          variant === 'warning' && 'bg-yellow-50 text-yellow-900 border border-yellow-200',
          variant === 'error' && 'bg-red-50 text-red-900 border border-red-200',
          className
        )}
        {...rest}
      >
        <span className="text-xl">{icons[variant]}</span>
        <div className="flex-1">
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
export default Alert;

export const InteractableAlert = withInteractable(Alert, {
  category: 'feedback',
  editableProps: ['variant', 'title', 'children', 'className'],
  a11yRules: ['role'],
});
```

**Ask tambo:** "Create these 4 components plus Badge, Switch, Checkbox, Select, Tooltip, Modal"

---

### 4. Inspector Panel

```typescript
// src/components/inspector/Inspector.tsx

import { useDesignSystemStore } from '@/store/design-system-store';

export function Inspector() {
  const selectedId = useDesignSystemStore((s) => s.selectedId);
  const component = useDesignSystemStore((s) =>
    selectedId ? s.components.get(selectedId) : null
  );
  const updateComponent = useDesignSystemStore((s) => s.updateComponent);
  const snapshot = useDesignSystemStore((s) => s.snapshot);

  if (!component) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <p className="text-sm text-gray-500">Select a component to edit</p>
      </div>
    );
  }

  const handlePropChange = (key: string, value: unknown) => {
    snapshot();
    updateComponent(selectedId!, {
      props: { ...component.props, [key]: value },
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">{component.type}</h2>
      <p className="text-sm text-gray-500 mb-4">ID: {component.id}</p>

      <div className="space-y-4">
        {component.metadata.editableProps?.map((propKey) => (
          <PropEditor
            key={propKey}
            propKey={propKey}
            value={component.props[propKey]}
            onChange={(value) => handlePropChange(propKey, value)}
          />
        ))}
      </div>
    </div>
  );
}

function PropEditor({
  propKey,
  value,
  onChange,
}: {
  propKey: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (propKey === 'variant' || propKey === 'size') {
    const options =
      propKey === 'variant'
        ? ['solid', 'outline', 'ghost', 'link']
        : ['sm', 'md', 'lg'];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {propKey}
        </label>
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {propKey}
        </label>
        <input
          type="text"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }

  return null;
}
```

**Ask tambo:** "Create Inspector panel with prop editing"

---

### 5. Toolbar with Undo/Redo

```typescript
// src/components/toolbar/Toolbar.tsx

import { useDesignSystemStore } from '@/store/design-system-store';
import { useEffect } from 'react';

export function Toolbar() {
  const undo = useDesignSystemStore((s) => s.undo);
  const redo = useDesignSystemStore((s) => s.redo);
  const historyIndex = useDesignSystemStore((s) => s.historyIndex);
  const historyLength = useDesignSystemStore((s) => s.history.length);
  const a11yScore = useDesignSystemStore((s) => s.a11yScore);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">Flex</span>
        <span className="text-sm text-gray-500">Design System Playground</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↶ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↷ Redo
        </button>

        <div className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg font-medium">
          A11y: {a11yScore}%
        </div>
      </div>
    </div>
  );
}
```

**Ask tambo:** "Add Toolbar with undo/redo and keyboard shortcuts"

---

## 🎯 Quick Implementation Checklist

**With tambo, just ask:**

- [ ] "Create Vite + React + TS project with Tailwind"
- [ ] "Add types for design system (Component, Theme, etc.)"
- [ ] "Create Zustand store with components Map, theme, undo/redo"
- [ ] "Implement withInteractable HOC with GSAP animations"
- [ ] "Create Button, Input, Card, Alert components"
- [ ] "Wrap components with withInteractable HOC"
- [ ] "Build Canvas component showing all interactable components"
- [ ] "Add Inspector panel for editing selected component props"
- [ ] "Create Toolbar with undo/redo, a11y score"
- [ ] "Add keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)"
- [ ] "Create 6 more components (Badge, Switch, Checkbox, Select, Tooltip, Modal)"
- [ ] "Add export functionality (Tailwind config, CSS variables)"
- [ ] "Polish GSAP animations (entrance, exit, change)"

---

## 💡 Tambo Pro Tips

1. **Be specific**: "Create Button component with 4 variants (solid, outline, ghost, link) and 3 sizes, using Tailwind and forwardRef"

2. **Reference existing code**: "Add Card component following the same pattern as Button"

3. **Ask for help**: "I'm getting a TypeScript error in withInteractable, can you fix it?"

4. **Iterate fast**: "Make buttons more accessible (WCAG AA contrast, min-height 44px, focus ring)"

5. **Get creative**: "Add a fun hover animation to Cards using GSAP"

---

Good luck! 🚀
