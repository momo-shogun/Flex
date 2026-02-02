# Implementation Starter Kit
## Code Examples & Patterns

---

## 🔧 Core Implementation Examples

### 1. withInteractable HOC (The Magic Wrapper)

```typescript
// core/interactable/withInteractable.tsx

import React, { useEffect, useRef } from 'react';
import { useDesignSystemStore } from '@/store/design-system-store';
import { ComponentMetadata } from './types';
import gsap from 'gsap';

interface InteractableProps {
  id: string;
  type: string;
  metadata?: Partial<ComponentMetadata>;
}

export function withInteractable<P extends object>(
  Component: React.ComponentType<P>,
  defaultMetadata: ComponentMetadata
) {
  return function InteractableComponent(
    props: P & InteractableProps
  ) {
    const { id, type, metadata, ...componentProps } = props;
    const elementRef = useRef<HTMLElement>(null);
    const registerComponent = useDesignSystemStore((s) => s.registerComponent);
    const updateComponent = useDesignSystemStore((s) => s.updateComponent);
    const getComponent = useDesignSystemStore((s) => s.getComponent);

    // Register component on mount
    useEffect(() => {
      registerComponent({
        id,
        type,
        props: componentProps,
        metadata: { ...defaultMetadata, ...metadata },
        element: elementRef.current,
      });

      return () => {
        // Cleanup on unmount
      };
    }, []);

    // Watch for prop changes from AI
    useEffect(() => {
      const component = getComponent(id);
      if (component && elementRef.current) {
        animatePropChange(elementRef.current, component.props);
      }
    }, [getComponent(id)?.props]);

    // Animate prop changes
    const animatePropChange = (element: HTMLElement, newProps: any) => {
      // Highlight the component
      gsap.to(element, {
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5)',
        duration: 0.2,
      });

      // Apply changes
      setTimeout(() => {
        gsap.to(element, {
          boxShadow: 'none',
          duration: 0.3,
        });
      }, 800);
    };

    const mergedProps = {
      ...componentProps,
      ...getComponent(id)?.props,
      ref: elementRef,
      'data-component-id': id,
      'data-component-type': type,
    } as P;

    return <Component {...mergedProps} />;
  };
}

// Usage example:
const InteractableButton = withInteractable(Button, {
  category: 'interactive',
  editableProps: ['variant', 'size', 'radius', 'contrast'],
  a11yRules: ['color-contrast', 'button-name', 'focus-visible'],
});
```

---

### 2. Design System Store (Zustand + Immer)

```typescript
// store/design-system-store.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { Component, Theme, DesignTokens, A11yIssue } from '@/types';

interface DesignSystemState {
  // Component registry
  components: Map<string, Component>;
  
  // Theme state
  theme: Theme;
  tokens: DesignTokens;
  
  // Selection
  selectedId: string | null;
  
  // Accessibility
  a11yIssues: A11yIssue[];
  a11yScore: number;
  
  // History
  history: Array<{ theme: Theme; components: Map<string, Component> }>;
  historyIndex: number;
  
  // Actions
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
          Object.entries(updates).forEach(([id, update]) => {
            const component = state.components.get(id);
            if (component) {
              state.components.set(id, { ...component, ...update });
            }
          });
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
          // Trim future history
          state.history = state.history.slice(0, state.historyIndex + 1);
          
          // Add snapshot
          state.history.push({
            theme: structuredClone(state.theme),
            components: new Map(state.components),
          });
          
          state.historyIndex++;
          
          // Keep only last 50 snapshots
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
            state.components = snapshot.components;
          }
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            const snapshot = state.history[state.historyIndex];
            state.theme = snapshot.theme;
            state.components = snapshot.components;
          }
        }),
    }))
  )
);

// Helper functions
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

function calculateA11yScore(issues: A11yIssue[]): number {
  const weights = {
    critical: 20,
    serious: 10,
    moderate: 5,
    minor: 2,
  };
  
  const deductions = issues.reduce(
    (sum, issue) => sum + weights[issue.impact],
    0
  );
  
  return Math.max(0, 100 - deductions);
}
```

---

### 3. AI Intent Parser

```typescript
// core/ai/intent-parser.ts

import { z } from 'zod';

// Response schema
const AIResponseSchema = z.object({
  intent: z.string(),
  targets: z.union([
    z.array(z.string()),
    z.literal('all'),
    z.string().startsWith('type:'),
  ]),
  mutations: z.record(
    z.object({
      props: z.record(z.any()).optional(),
      tokens: z.record(z.any()).optional(),
      styles: z.record(z.any()).optional(),
    })
  ),
  accessibility: z.object({
    issues: z.array(z.string()),
    fixes: z.array(z.string()),
    wcagLevel: z.enum(['A', 'AA', 'AAA']),
  }).optional(),
  explanation: z.string(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

export class IntentParser {
  async parse(command: string, context: SystemContext): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: this.buildPrompt(command, context),
          },
        ],
        system: SYSTEM_PROMPT,
      }),
    });

    const data = await response.json();
    const rawResponse = data.content[0].text;

    // Extract JSON from potential markdown code blocks
    const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/) ||
                      rawResponse.match(/(\{[\s\S]*\})/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const parsed = JSON.parse(jsonMatch[1]);
    return AIResponseSchema.parse(parsed);
  }

  private buildPrompt(command: string, context: SystemContext): string {
    return `
COMMAND: "${command}"

CURRENT SYSTEM STATE:
Components: ${Array.from(context.components.values())
  .map((c) => `${c.id} (${c.type})`)
  .join(', ')}

Selected: ${context.selectedId || 'none'}

Theme:
${JSON.stringify(context.theme, null, 2)}

Accessibility Issues:
${context.a11yIssues.map((i) => `- ${i.component}: ${i.message}`).join('\n') || 'None'}

Parse this command and return mutation JSON.
    `.trim();
  }

  resolveTargets(
    targets: AIResponse['targets'],
    components: Map<string, Component>,
    selectedId?: string
  ): string[] {
    if (targets === 'all') {
      return Array.from(components.keys());
    }

    if (typeof targets === 'string' && targets.startsWith('type:')) {
      const type = targets.slice(5);
      return Array.from(components.values())
        .filter((c) => c.type === type)
        .map((c) => c.id);
    }

    return targets;
  }
}
```

---

### 4. Mutation Engine

```typescript
// core/ai/mutation-engine.ts

import { getContrast, darken, lighten, parseToRgb } from 'color2k';
import { AIResponse, Component } from '@/types';

export class MutationEngine {
  applyMutations(
    response: AIResponse,
    components: Map<string, Component>
  ): Map<string, Partial<Component>> {
    const updates = new Map<string, Partial<Component>>();

    Object.entries(response.mutations).forEach(([id, mutation]) => {
      const component = components.get(id);
      if (!component) return;

      const update: Partial<Component> = {};

      // Apply prop mutations
      if (mutation.props) {
        update.props = { ...component.props, ...mutation.props };
      }

      // Apply style mutations
      if (mutation.styles) {
        update.styles = { ...component.styles, ...mutation.styles };
      }

      // Apply token mutations
      if (mutation.tokens) {
        update.tokens = { ...component.tokens, ...mutation.tokens };
      }

      updates.set(id, update);
    });

    return updates;
  }

  // Calculate WCAG-compliant color
  ensureContrast(
    foreground: string,
    background: string,
    ratio: number = 4.5
  ): string {
    let color = foreground;
    let currentRatio = getContrast(color, background);
    let iterations = 0;

    while (currentRatio < ratio && iterations < 20) {
      // Darken or lighten based on background
      const bgLuminance = this.getLuminance(background);
      color = bgLuminance > 0.5 ? darken(color, 0.05) : lighten(color, 0.05);
      currentRatio = getContrast(color, background);
      iterations++;
    }

    return color;
  }

  // Calculate relative luminance
  private getLuminance(color: string): number {
    const rgb = parseToRgb(color);
    const [r, g, b] = [rgb.red, rgb.green, rgb.blue].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Generate spacing based on intent
  generateSpacing(intent: 'compact' | 'comfortable' | 'spacious'): Record<string, string> {
    const scales = {
      compact: [0.125, 0.25, 0.5, 0.75, 1],
      comfortable: [0.25, 0.5, 1, 1.5, 2],
      spacious: [0.5, 1, 1.5, 2, 3],
    };

    const scale = scales[intent];
    return {
      xs: `${scale[0]}rem`,
      sm: `${scale[1]}rem`,
      md: `${scale[2]}rem`,
      lg: `${scale[3]}rem`,
      xl: `${scale[4]}rem`,
    };
  }

  // Generate border radius based on intent
  generateRadius(intent: 'sharp' | 'soft' | 'round'): Record<string, string> {
    const scales = {
      sharp: [0, 0.125, 0.25, 0.375],
      soft: [0.25, 0.5, 0.75, 1],
      round: [0.5, 0.75, 1, 1.5],
    };

    const scale = scales[intent];
    return {
      none: '0',
      sm: `${scale[0]}rem`,
      md: `${scale[1]}rem`,
      lg: `${scale[2]}rem`,
      full: '9999px',
    };
  }
}
```

---

### 5. Accessibility Analyzer

```typescript
// core/a11y/analyzer.ts

import { run, AxeResults } from 'axe-core';
import { getContrast } from 'color2k';
import { A11yIssue, Component } from '@/types';

export class AccessibilityAnalyzer {
  async analyze(container: HTMLElement): Promise<A11yIssue[]> {
    const results = await run(container, {
      rules: {
        'color-contrast': { enabled: true },
        'button-name': { enabled: true },
        'link-name': { enabled: true },
        'focus-visible': { enabled: true },
        'target-size': { enabled: true },
      },
    });

    return this.parseResults(results);
  }

  async analyzeComponent(component: Component): Promise<A11yIssue[]> {
    const issues: A11yIssue[] = [];

    // Check color contrast
    if (component.props.color && component.props.backgroundColor) {
      const ratio = getContrast(
        component.props.color,
        component.props.backgroundColor
      );

      if (ratio < 4.5) {
        issues.push({
          id: `${component.id}-contrast`,
          component: component.id,
          type: 'color-contrast',
          impact: 'serious',
          message: `Contrast ratio ${ratio.toFixed(2)}:1 is below WCAG AA (4.5:1)`,
          fix: 'Increase color contrast',
          wcagLevel: 'AA',
        });
      }
    }

    // Check touch target size
    if (component.metadata.category === 'interactive') {
      const minSize = 44; // WCAG 2.1 minimum
      const { width, height } = component.props;

      if (
        (width && parseInt(width) < minSize) ||
        (height && parseInt(height) < minSize)
      ) {
        issues.push({
          id: `${component.id}-target-size`,
          component: component.id,
          type: 'target-size',
          impact: 'serious',
          message: `Touch target too small (min: ${minSize}px)`,
          fix: 'Increase button size',
          wcagLevel: 'AAA',
        });
      }
    }

    // Check focus indicator
    if (component.metadata.category === 'interactive') {
      if (!component.styles?.['&:focus-visible']) {
        issues.push({
          id: `${component.id}-focus`,
          component: component.id,
          type: 'focus-visible',
          impact: 'serious',
          message: 'Missing focus indicator',
          fix: 'Add visible focus state',
          wcagLevel: 'AA',
        });
      }
    }

    return issues;
  }

  private parseResults(results: AxeResults): A11yIssue[] {
    return results.violations.flatMap((violation) =>
      violation.nodes.map((node) => ({
        id: `${violation.id}-${node.target[0]}`,
        component: this.extractComponentId(node.target[0]),
        type: violation.id,
        impact: violation.impact as A11yIssue['impact'],
        message: violation.description,
        fix: node.failureSummary,
        wcagLevel: this.getWCAGLevel(violation.tags),
      }))
    );
  }

  private extractComponentId(selector: string): string {
    // Extract data-component-id from selector
    const match = selector.match(/data-component-id="([^"]+)"/);
    return match ? match[1] : 'unknown';
  }

  private getWCAGLevel(tags: string[]): 'A' | 'AA' | 'AAA' {
    if (tags.includes('wcag2aaa')) return 'AAA';
    if (tags.includes('wcag2aa')) return 'AA';
    return 'A';
  }

  generateFixes(issue: A11yIssue, component: Component): Partial<Component> {
    switch (issue.type) {
      case 'color-contrast':
        return {
          props: {
            ...component.props,
            color: this.fixContrast(
              component.props.color,
              component.props.backgroundColor
            ),
          },
        };

      case 'target-size':
        return {
          props: {
            ...component.props,
            minWidth: '44px',
            minHeight: '44px',
          },
        };

      case 'focus-visible':
        return {
          styles: {
            ...component.styles,
            '&:focus-visible': {
              outline: '2px solid currentColor',
              outlineOffset: '2px',
            },
          },
        };

      default:
        return {};
    }
  }

  private fixContrast(foreground: string, background: string): string {
    let color = foreground;
    let ratio = getContrast(color, background);

    while (ratio < 4.5) {
      color = this.adjustBrightness(color, background);
      ratio = getContrast(color, background);
    }

    return color;
  }

  private adjustBrightness(color: string, background: string): string {
    // Implementation of contrast adjustment
    // (using color2k darken/lighten based on background luminance)
    return color; // Simplified
  }
}
```

---

### 6. GSAP Animation Hook

```typescript
// hooks/useAnimation.ts

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useComponentAnimation(componentId: string) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Entrance animation
    gsap.from(elementRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });

    return () => {
      // Cleanup
    };
  }, []);

  const animatePropChange = (newProps: Record<string, any>) => {
    if (!elementRef.current) return;

    const tl = gsap.timeline();

    // Highlight
    tl.to(elementRef.current, {
      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5)',
      duration: 0.2,
    });

    // Morph
    tl.to(elementRef.current, {
      ...newProps,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    // Remove highlight
    tl.to(elementRef.current, {
      boxShadow: 'none',
      duration: 0.3,
    });
  };

  const animateA11yIssue = () => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
      duration: 0.5,
      yoyo: true,
      repeat: 3,
      ease: 'sine.inOut',
    });
  };

  const animateSuccess = () => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
    });
  };

  return {
    elementRef,
    animatePropChange,
    animateA11yIssue,
    animateSuccess,
  };
}
```

---

### 7. Chat Panel Component

```typescript
// components/chat/ChatPanel.tsx

import { useState } from 'react';
import { useDesignSystemStore } from '@/store/design-system-store';
import { IntentParser } from '@/core/ai/intent-parser';
import { MutationEngine } from '@/core/ai/mutation-engine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const components = useDesignSystemStore((s) => s.components);
  const theme = useDesignSystemStore((s) => s.theme);
  const a11yIssues = useDesignSystemStore((s) => s.a11yIssues);
  const selectedId = useDesignSystemStore((s) => s.selectedId);
  const updateMultipleComponents = useDesignSystemStore(
    (s) => s.updateMultipleComponents
  );
  const snapshot = useDesignSystemStore((s) => s.snapshot);

  const parser = new IntentParser();
  const mutationEngine = new MutationEngine();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Parse intent
      const response = await parser.parse(input, {
        components,
        theme,
        a11yIssues,
        selectedId,
      });

      // Resolve targets
      const targetIds = parser.resolveTargets(
        response.targets,
        components,
        selectedId || undefined
      );

      // Apply mutations
      const mutations = mutationEngine.applyMutations(response, components);

      // Take snapshot for undo
      snapshot();

      // Update store
      updateMultipleComponents(Object.fromEntries(mutations));

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.explanation,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI processing error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Design Assistant</h2>
        <p className="text-sm text-gray-500">
          Tell me how to improve your design system
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {[
            'Make it accessible',
            'Increase contrast',
            'Round corners',
            'Make it more playful',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Make buttons more accessible..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## 🎯 Quick Start Commands

```bash
# 1. Create project
npm create vite@latest design-playground -- --template react-ts
cd design-playground

# 2. Install dependencies
npm install zustand immer zod
npm install @radix-ui/react-slot @radix-ui/react-checkbox @radix-ui/react-switch
npm install gsap framer-motion
npm install axe-core color2k polished
npm install clsx tailwind-merge
npm install lucide-react
npm install react-hot-toast

# 3. Install dev dependencies
npm install -D @types/node
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Start dev server
npm run dev
```

---

## 🎬 Demo Script Checklist

- [ ] Open playground with ugly defaults
- [ ] Show A11y score (45%)
- [ ] Voice: "Make this accessible and modern"
- [ ] Watch animations + score jump to 95%
- [ ] Click button, say: "Make this more playful"
- [ ] Show only that button changes
- [ ] Say: "Apply to all buttons"
- [ ] Toggle before/after comparison
- [ ] Export Tailwind config
- [ ] BONUS: "Create a new pricing card component"
- [ ] Mic drop

---

## 💡 Pro Tips

1. **Start small**: Get 3 components working perfectly before adding more
2. **Nail the animations**: GSAP polish = judge wow factor
3. **Practice the demo**: Under 3 minutes, no mistakes
4. **Have fallbacks**: Pre-recorded demo if WiFi fails
5. **Prepare for questions**: "How does this integrate with X?"

Good luck! 🚀
