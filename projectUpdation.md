# 🎯 Flex Builder Ultimate - Pure Tambo Architecture
## No Third-Party Dependencies + Route-Based Tool Organization

---

## 🏗️ CORE PHILOSOPHY

**Key Principles:**
1. ✅ **Use ONLY Tambo** - No direct Anthropic API calls, no external AI services
2. ✅ **Tool-First Architecture** - Each feature = Tambo tool
3. ✅ **Route-Based Organization** - Separate routes for different builder tools
4. ✅ **Clean UI Management** - Each route = isolated feature with own UI

**Why This Approach:**
- Simpler codebase
- Tambo handles ALL AI orchestration
- Better UI organization
- Easier to maintain and extend
- Works within Tambo's ecosystem perfectly

---

## 📁 NEW PROJECT STRUCTURE

```
src/
├── main.tsx                          # Root setup
├── App.tsx                           # Router
│
├── routes/                           # 🆕 Route-based organization
│   ├── builder/                      # Main website builder
│   │   ├── index.tsx                 # BuilderPage
│   │   ├── components/
│   │   │   ├── Canvas.tsx
│   │   │   ├── LayersPanel.tsx
│   │   │   ├── InspectorPanel.tsx
│   │   │   └── BuilderChat.tsx
│   │   └── tools/                    # Builder-specific tools
│   │       ├── section-tools.ts
│   │       ├── template-tools.ts
│   │       └── export-tools.ts
│   │
│   ├── component-lab/                # 🆕 Component testing/creation
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── ComponentPreview.tsx
│   │   │   ├── PropsEditor.tsx
│   │   │   └── ComponentLibrary.tsx
│   │   └── tools/
│   │       ├── component-tools.ts
│   │       └── styling-tools.ts
│   │
│   ├── template-studio/              # 🆕 Template creation/management
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── TemplateEditor.tsx
│   │   │   ├── TemplateGallery.tsx
│   │   │   └── TemplatePreview.tsx
│   │   └── tools/
│   │       └── template-tools.ts
│   │
│   ├── export-center/                # 🆕 Code export & deploy hub
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── CodeViewer.tsx
│   │   │   ├── ExportOptions.tsx
│   │   │   └── DeployPanel.tsx
│   │   └── tools/
│   │       └── export-tools.ts
│   │
│   ├── library-manager/              # 🆕 Component library management
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── ComponentList.tsx
│   │   │   ├── ImportPanel.tsx
│   │   │   └── VariantManager.tsx
│   │   └── tools/
│   │       └── library-tools.ts
│   │
│   └── design-analyzer/              # 🆕 Design analysis & suggestions
│       ├── index.tsx
│       ├── components/
│       │   ├── ScoreCard.tsx
│       │   ├── IssuesList.tsx
│       │   └── Suggestions.tsx
│       └── tools/
│           └── analysis-tools.ts
│
├── lib/
│   ├── persistence/                  # State & history management
│   │   ├── indexeddb-store.ts
│   │   ├── history-manager.ts
│   │   └── auto-save.ts
│   │
│   ├── templates/                    # Template definitions
│   │   ├── index.ts
│   │   ├── saas-templates.ts
│   │   ├── portfolio-templates.ts
│   │   └── ecommerce-templates.ts
│   │
│   ├── component-system/             # Component registry & management
│   │   ├── registry.ts
│   │   ├── schema-generator.ts
│   │   └── variant-system.ts
│   │
│   ├── code-generation/              # Code export logic
│   │   ├── react-generator.ts
│   │   ├── nextjs-generator.ts
│   │   └── html-generator.ts
│   │
│   └── design-intelligence/          # Analysis & recommendations
│       ├── analyzer.ts
│       ├── responsive-checker.ts
│       └── accessibility-checker.ts
│
└── types/
    ├── builder.types.ts
    ├── component.types.ts
    └── template.types.ts
```

---

## 🚀 IMPLEMENTATION STRATEGY

### **Approach: Pure Tambo Tools**

Instead of calling Claude API directly, we let Tambo do it through tools:

**OLD WAY (Avoid):**
```typescript
// ❌ Direct API call
const claude = new Anthropic({ apiKey: '...' });
const response = await claude.messages.create({ ... });
```

**NEW WAY (Use This):**
```typescript
// ✅ Tambo tool - AI decides when to use it
export const generateComponentVariantTool = {
  name: 'generate_component_variant',
  description: 'Generate a new variant of an existing component',
  inputSchema: z.object({ ... }),
  execute: async (args) => {
    // Pure logic - no AI calls
    // Return structured data Tambo can work with
  }
};
```

**Tambo handles:**
- When to call the tool
- How to chain multiple tools
- Streaming responses
- Context management

---

## 📋 PHASE 1: ENHANCED COMPONENT SYSTEM (Week 1)

### 1.1 Component Variant System

Instead of generating entirely new components, create **variants** of existing ones.

**File**: `src/lib/component-system/variant-system.ts`

```typescript
import { ComponentId } from '@/types/builder.types';
import { z } from 'zod';

export interface ComponentVariant {
  id: string;
  baseComponentId: ComponentId;
  name: string;
  description: string;
  propsOverrides: Record<string, any>;
  styleModifiers: {
    theme?: 'light' | 'dark' | 'colored';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'outlined' | 'filled' | 'ghost';
  };
  createdAt: Date;
}

class VariantRegistry {
  private variants: Map<string, ComponentVariant> = new Map();

  createVariant(
    baseComponentId: ComponentId,
    name: string,
    propsOverrides: Record<string, any>,
    styleModifiers: ComponentVariant['styleModifiers']
  ): ComponentVariant {
    const variant: ComponentVariant = {
      id: `variant-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      baseComponentId,
      name,
      description: `${name} variant of ${baseComponentId}`,
      propsOverrides,
      styleModifiers,
      createdAt: new Date(),
    };

    this.variants.set(variant.id, variant);
    this.persistToStorage();
    
    return variant;
  }

  getVariant(id: string): ComponentVariant | undefined {
    return this.variants.get(id);
  }

  getVariantsForComponent(baseComponentId: ComponentId): ComponentVariant[] {
    return Array.from(this.variants.values())
      .filter(v => v.baseComponentId === baseComponentId);
  }

  getAllVariants(): ComponentVariant[] {
    return Array.from(this.variants.values());
  }

  private persistToStorage(): void {
    const variantsData = Array.from(this.variants.entries());
    localStorage.setItem('flex-component-variants', JSON.stringify(variantsData));
  }

  loadFromStorage(): void {
    const stored = localStorage.getItem('flex-component-variants');
    if (!stored) return;

    const variantsData = JSON.parse(stored);
    this.variants = new Map(variantsData);
  }
}

export const variantRegistry = new VariantRegistry();

// Auto-load on startup
if (typeof window !== 'undefined') {
  variantRegistry.loadFromStorage();
}

// Preset variant definitions
export const PRESET_VARIANTS: Record<ComponentId, ComponentVariant[]> = {
  'aurora-hero-splittext': [
    {
      id: 'aurora-hero-dark',
      baseComponentId: 'aurora-hero-splittext',
      name: 'Dark Aurora Hero',
      description: 'Dark theme with purple/blue gradient',
      propsOverrides: {
        topColor: '#1e1b4b',
        bottomColor: '#312e81',
      },
      styleModifiers: { theme: 'dark' },
      createdAt: new Date(),
    },
    {
      id: 'aurora-hero-sunset',
      baseComponentId: 'aurora-hero-splittext',
      name: 'Sunset Hero',
      description: 'Warm sunset colors',
      propsOverrides: {
        topColor: '#f97316',
        bottomColor: '#dc2626',
      },
      styleModifiers: { theme: 'colored' },
      createdAt: new Date(),
    },
  ],
  'silk-hero-splittext': [
    {
      id: 'silk-hero-ocean',
      baseComponentId: 'silk-hero-splittext',
      name: 'Ocean Silk',
      description: 'Cool blue tones',
      propsOverrides: {
        color: '#0ea5e9',
        speed: 2,
      },
      styleModifiers: { theme: 'colored' },
      createdAt: new Date(),
    },
  ],
  // Add more presets...
};
```

### 1.2 Variant Tools (Pure Tambo)

**File**: `src/routes/component-lab/tools/component-tools.ts`

```typescript
import { z } from 'zod';
import { variantRegistry, PRESET_VARIANTS } from '@/lib/component-system/variant-system';
import { ComponentId } from '@/types/builder.types';

// Tool 1: Create variant
export const createComponentVariantTool = {
  name: 'create_component_variant',
  description: `Create a new variant of an existing component by modifying its props and styling.
  Use this when user wants to customize a component (e.g., "make a dark version of the hero").
  
  Examples:
  - "Create a dark version of aurora hero"
  - "Make a smaller variant of the split text"
  - "Create an outlined version of this button"`,
  
  inputSchema: z.object({
    baseComponentId: z.string().describe('The base component to create variant from'),
    variantName: z.string().describe('Name for this variant (e.g., "Dark Hero", "Small Card")'),
    propsChanges: z.record(z.any()).describe('Props to override from base component'),
    styleModifiers: z.object({
      theme: z.enum(['light', 'dark', 'colored']).optional(),
      size: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
      variant: z.enum(['default', 'outlined', 'filled', 'ghost']).optional(),
    }).optional(),
  }),

  execute: async (args: any, builderRef: any) => {
    const variant = variantRegistry.createVariant(
      args.baseComponentId,
      args.variantName,
      args.propsChanges,
      args.styleModifiers || {}
    );

    return `✅ Created variant: **${variant.name}**

📋 **Base component**: ${args.baseComponentId}
🎨 **Theme**: ${variant.styleModifiers.theme || 'default'}
📏 **Size**: ${variant.styleModifiers.size || 'default'}

**Props modified**:
${Object.entries(args.propsChanges).map(([key, val]) => `• ${key}: ${JSON.stringify(val)}`).join('\n')}

The variant is saved and ready to use. Want to add it to your canvas?`;
  },
};

// Tool 2: List variants
export const listComponentVariantsTool = {
  name: 'list_component_variants',
  description: `List all available variants for a component or all variants in the system.
  Use this when user asks "what variants exist?" or "show me hero variants".`,
  
  inputSchema: z.object({
    componentId: z.string().optional().describe('Specific component to list variants for'),
  }),

  execute: async (args: any) => {
    let variants: any[];
    
    if (args.componentId) {
      variants = variantRegistry.getVariantsForComponent(args.componentId);
      
      if (variants.length === 0) {
        return `No custom variants found for ${args.componentId}.

📦 **Preset variants available**:
${PRESET_VARIANTS[args.componentId as ComponentId]?.map((v, i) => `
${i + 1}. **${v.name}**
   ${v.description}
   Theme: ${v.styleModifiers.theme || 'default'}
`).join('\n') || 'None'}

Want me to create a custom variant?`;
      }
    } else {
      variants = variantRegistry.getAllVariants();
    }

    return `📦 **Component Variants** (${variants.length} total)

${variants.map((v, i) => `
${i + 1}. **${v.name}**
   Base: ${v.baseComponentId}
   Theme: ${v.styleModifiers.theme || 'default'}
   Size: ${v.styleModifiers.size || 'default'}
   Created: ${v.createdAt.toLocaleDateString()}
`).join('\n')}

To use a variant, just ask me to add it to your page!`;
  },
};

// Tool 3: Apply variant to section
export const applyVariantToSectionTool = {
  name: 'apply_variant_to_section',
  description: `Apply a variant's styling to an existing section on the canvas.
  Use when user wants to change a section to use a specific variant.`,
  
  inputSchema: z.object({
    sectionId: z.string().describe('Section to modify'),
    variantId: z.string().describe('Variant to apply'),
  }),

  execute: async (args: any, builderRef: any) => {
    const variant = variantRegistry.getVariant(args.variantId);
    if (!variant) {
      return `❌ Variant ${args.variantId} not found`;
    }

    const section = builderRef.current?.getSection(args.sectionId);
    if (!section) {
      return `❌ Section ${args.sectionId} not found`;
    }

    // Apply variant props
    builderRef.current?.dispatch({
      type: 'UPDATE_PROPS',
      payload: {
        id: args.sectionId,
        props: {
          ...section.props,
          ...variant.propsOverrides,
        },
      },
    });

    return `✅ Applied **${variant.name}** to "${section.label}"!

🎨 Changes applied:
${Object.entries(variant.propsOverrides).map(([key, val]) => `• ${key}: ${JSON.stringify(val)}`).join('\n')}

Check the canvas to see the updated styling!`;
  },
};

// Tool 4: Use preset variant
export const usePresetVariantTool = {
  name: 'use_preset_variant',
  description: `Use a pre-defined variant (like Dark Hero, Ocean Silk, etc).
  Faster than creating custom variants for common use cases.`,
  
  inputSchema: z.object({
    presetId: z.string().describe('ID of preset variant'),
    addToCanvas: z.boolean().default(true).describe('Add to canvas immediately'),
  }),

  execute: async (args: any, builderRef: any) => {
    // Find preset in PRESET_VARIANTS
    let preset: any = null;
    for (const variants of Object.values(PRESET_VARIANTS)) {
      preset = variants.find(v => v.id === args.presetId);
      if (preset) break;
    }

    if (!preset) {
      return `❌ Preset variant ${args.presetId} not found`;
    }

    if (args.addToCanvas) {
      const sectionId = builderRef.current?.addSection(preset.baseComponentId);
      
      if (sectionId) {
        builderRef.current?.dispatch({
          type: 'UPDATE_PROPS',
          payload: {
            id: sectionId,
            props: preset.propsOverrides,
          },
        });

        builderRef.current?.dispatch({
          type: 'UPDATE_SECTION',
          payload: {
            id: sectionId,
            updates: { label: preset.name },
          },
        });

        return `✅ Added **${preset.name}** to canvas!

📋 ${preset.description}
🎨 Theme: ${preset.styleModifiers.theme || 'default'}

The section is ready to customize!`;
      }
    }

    return `✅ Preset **${preset.name}** is ready to use!

Use "apply variant to section" to add it to an existing section, or ask me to add it to canvas.`;
  },
};
```

---

## 🎨 PHASE 2: ROUTE-BASED TOOL ORGANIZATION (Week 1-2)

### 2.1 Component Lab Route

**Purpose**: Isolated environment to test, create, and refine component variants.

**File**: `src/routes/component-lab/index.tsx`

```typescript
import React, { useState } from 'react';
import { TamboContextHelpersProvider, useTambo } from '@tambo-ai/react';
import { ComponentPreview } from './components/ComponentPreview';
import { PropsEditor } from './components/PropsEditor';
import { ComponentLibrary } from './components/ComponentLibrary';
import { LabChat } from './components/LabChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import lab-specific tools
import {
  createComponentVariantTool,
  listComponentVariantsTool,
  applyVariantToSectionTool,
  usePresetVariantTool,
} from './tools/component-tools';

export default function ComponentLabPage() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [currentProps, setCurrentProps] = useState<Record<string, any>>({});
  const { registerTools } = useTambo();

  // Register lab-specific tools
  React.useEffect(() => {
    registerTools([
      createComponentVariantTool,
      listComponentVariantsTool,
      applyVariantToSectionTool,
      usePresetVariantTool,
    ]);
  }, [registerTools]);

  return (
    <TamboContextHelpersProvider
      contextHelpers={{
        labState: () => ({
          selectedComponent,
          currentProps,
          message: 'User is in Component Lab - help them test and create variants',
        }),
      }}
    >
      <div className="h-screen flex">
        {/* Left Sidebar - Component Library */}
        <div className="w-64 border-r bg-gray-50 overflow-y-auto">
          <ComponentLibrary
            onSelect={setSelectedComponent}
            selected={selectedComponent}
          />
        </div>

        {/* Center - Preview & Props */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8 bg-gray-100">
            <ComponentPreview
              componentId={selectedComponent}
              props={currentProps}
            />
          </div>

          <div className="h-80 border-t">
            <Tabs defaultValue="props">
              <TabsList className="w-full">
                <TabsTrigger value="props">Props</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>

              <TabsContent value="props">
                <PropsEditor
                  componentId={selectedComponent}
                  props={currentProps}
                  onChange={setCurrentProps}
                />
              </TabsContent>

              <TabsContent value="variants">
                {/* Variant management UI */}
              </TabsContent>

              <TabsContent value="code">
                {/* Generated code preview */}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar - AI Chat */}
        <div className="w-96 border-l flex flex-col">
          <LabChat />
        </div>
      </div>
    </TamboContextHelpersProvider>
  );
}
```

**File**: `src/routes/component-lab/components/LabChat.tsx`

```typescript
import React from 'react';
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const LAB_CONTEXT = `
You are in the Component Lab - a space for testing and creating component variants.

## What you can do here:

**Create Variants**:
- "Create a dark version of aurora hero"
- "Make a smaller variant with size sm"
- "Create an outlined variant"

**List Variants**:
- "Show me all hero variants"
- "What preset variants are available?"

**Apply Variants**:
- "Use the dark hero preset"
- "Apply ocean silk variant to this section"

**Test Props**:
- "Set the text to 'Hello World'"
- "Change the color to blue"
- "Make the animation faster"

## Current Context:
User is testing components in isolation before adding to their website.
Help them experiment, create variants, and understand component behavior.

Be encouraging and suggest creative variants!
`;

export function LabChat() {
  const { thread } = useTamboThread();
  const { value, setValue, submit } = useTamboThreadInput();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-purple-50">
        <h3 className="font-semibold text-lg">Component Lab Assistant</h3>
        <p className="text-sm text-gray-600 mt-1">
          Test variants, experiment with props, create custom versions
        </p>
      </div>

      {/* System context - hidden from user */}
      <div className="hidden">{LAB_CONTEXT}</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe variant or ask for help..."
            className="resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <Button onClick={submit} size="icon" className="shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 2.2 Template Studio Route

**Purpose**: Create, manage, and organize website templates.

**File**: `src/routes/template-studio/index.tsx`

```typescript
import React, { useState } from 'react';
import { TamboContextHelpersProvider, useTambo } from '@tambo-ai/react';
import { TemplateEditor } from './components/TemplateEditor';
import { TemplateGallery } from './components/TemplateGallery';
import { TemplatePreview } from './components/TemplatePreview';

// Template studio tools
import {
  createTemplateTool,
  updateTemplateTool,
  saveTemplateSnapshotTool,
} from './tools/template-tools';

export default function TemplateStudioPage() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const { registerTools } = useTambo();

  React.useEffect(() => {
    registerTools([
      createTemplateTool,
      updateTemplateTool,
      saveTemplateSnapshotTool,
    ]);
  }, [registerTools]);

  return (
    <TamboContextHelpersProvider
      contextHelpers={{
        studioState: () => ({
          activeTemplate,
          mode: 'template-studio',
        }),
      }}
    >
      <div className="h-screen flex">
        {/* Template Gallery Sidebar */}
        <div className="w-80 border-r overflow-y-auto">
          <TemplateGallery
            onSelect={setActiveTemplate}
            selected={activeTemplate}
          />
        </div>

        {/* Template Editor */}
        <div className="flex-1">
          {activeTemplate ? (
            <TemplateEditor templateId={activeTemplate} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a template or create a new one
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="w-96 border-l">
          {activeTemplate && <TemplatePreview templateId={activeTemplate} />}
        </div>
      </div>
    </TamboContextHelpersProvider>
  );
}
```

**File**: `src/routes/template-studio/tools/template-tools.ts`

```typescript
import { z } from 'zod';
import { WEBSITE_TEMPLATES, WebsiteTemplate } from '@/lib/templates';

export const createTemplateTool = {
  name: 'create_website_template',
  description: `Create a new reusable website template from current sections or from scratch.
  Templates can be used to quickly generate websites.`,
  
  inputSchema: z.object({
    name: z.string(),
    description: z.string(),
    category: z.enum(['landing', 'portfolio', 'saas', 'ecommerce', 'blog']),
    sections: z.array(z.object({
      type: z.string(),
      label: z.string(),
      props: z.record(z.any()),
    })),
    tags: z.array(z.string()).optional(),
  }),

  execute: async (args: any) => {
    const template: WebsiteTemplate = {
      id: `template-${Date.now()}`,
      name: args.name,
      description: args.description,
      category: args.category,
      sections: args.sections.map((s: any) => ({
        ...s,
        purpose: `Part of ${args.name} template`,
      })),
      tags: args.tags || [],
    };

    // Save to templates registry
    WEBSITE_TEMPLATES.push(template);
    
    // Persist to localStorage
    localStorage.setItem(
      'flex-custom-templates',
      JSON.stringify(WEBSITE_TEMPLATES)
    );

    return `✅ Created template: **${template.name}**

📋 **Category**: ${template.category}
📦 **Sections**: ${template.sections.length}
🏷️ **Tags**: ${template.tags.join(', ')}

Your template is saved and ready to use!
Use it with: "Generate website from ${template.name} template"`;
  },
};

export const updateTemplateTool = {
  name: 'update_template',
  description: 'Modify an existing template',
  inputSchema: z.object({
    templateId: z.string(),
    updates: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      sections: z.array(z.any()).optional(),
      tags: z.array(z.string()).optional(),
    }),
  }),

  execute: async (args: any) => {
    const template = WEBSITE_TEMPLATES.find(t => t.id === args.templateId);
    if (!template) {
      return `❌ Template not found`;
    }

    Object.assign(template, args.updates);
    
    localStorage.setItem(
      'flex-custom-templates',
      JSON.stringify(WEBSITE_TEMPLATES)
    );

    return `✅ Updated template: **${template.name}**`;
  },
};

export const saveTemplateSnapshotTool = {
  name: 'save_current_as_template',
  description: 'Save the current website state as a reusable template',
  inputSchema: z.object({
    name: z.string(),
    description: z.string(),
    category: z.enum(['landing', 'portfolio', 'saas', 'ecommerce', 'blog']),
  }),

  execute: async (args: any, builderRef: any) => {
    const state = builderRef.current?.state;
    if (!state) {
      return '❌ No website to save as template';
    }

    const template: WebsiteTemplate = {
      id: `snapshot-${Date.now()}`,
      name: args.name,
      description: args.description,
      category: args.category,
      sections: state.sections.map((s: any) => ({
        type: s.type,
        label: s.label,
        props: s.props,
        purpose: `Section from ${args.name}`,
      })),
      tags: [args.category, 'custom'],
    };

    WEBSITE_TEMPLATES.push(template);
    
    localStorage.setItem(
      'flex-custom-templates',
      JSON.stringify(WEBSITE_TEMPLATES)
    );

    return `✅ Saved current website as template: **${template.name}**

Your website is now a reusable template!
It contains ${template.sections.length} sections and can be used to create similar sites.`;
  },
};
```

### 2.3 Export Center Route

**Purpose**: Dedicated space for code export and deployment.

**File**: `src/routes/export-center/index.tsx`

```typescript
import React, { useState } from 'react';
import { TamboContextHelpersProvider, useTambo } from '@tambo-ai/react';
import { CodeViewer } from './components/CodeViewer';
import { ExportOptions } from './components/ExportOptions';
import { DeployPanel } from './components/DeployPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Export tools
import {
  exportReactCodeTool,
  exportNextJSCodeTool,
  exportHTMLCodeTool,
  generatePackageJsonTool,
} from './tools/export-tools';

export default function ExportCenterPage() {
  const [exportedFiles, setExportedFiles] = useState<Map<string, string>>(new Map());
  const [exportConfig, setExportConfig] = useState({
    framework: 'nextjs' as const,
    typescript: true,
    styling: 'tailwind' as const,
  });
  const { registerTools } = useTambo();

  React.useEffect(() => {
    registerTools([
      exportReactCodeTool,
      exportNextJSCodeTool,
      exportHTMLCodeTool,
      generatePackageJsonTool,
    ]);
  }, [registerTools]);

  return (
    <TamboContextHelpersProvider
      contextHelpers={{
        exportState: () => ({
          config: exportConfig,
          filesGenerated: exportedFiles.size,
        }),
      }}
    >
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b p-4 bg-white">
          <h1 className="text-2xl font-bold">Export Center</h1>
          <p className="text-gray-600 text-sm mt-1">
            Generate production-ready code from your website
          </p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left - Export Options */}
          <div className="w-80 border-r overflow-y-auto bg-gray-50 p-4">
            <ExportOptions
              config={exportConfig}
              onChange={setExportConfig}
            />
          </div>

          {/* Center - Code Viewer */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="files">Files ({exportedFiles.size})</TabsTrigger>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="flex-1 overflow-auto">
                <CodeViewer files={exportedFiles} />
              </TabsContent>

              <TabsContent value="files" className="flex-1 overflow-auto">
                {/* File tree view */}
              </TabsContent>

              <TabsContent value="deploy" className="flex-1 overflow-auto">
                <DeployPanel files={exportedFiles} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right - AI Assistant */}
          <div className="w-96 border-l">
            {/* Export-specific AI chat */}
          </div>
        </div>
      </div>
    </TamboContextHelpersProvider>
  );
}
```

**File**: `src/routes/export-center/tools/export-tools.ts`

```typescript
import { z } from 'zod';
import { generateProductionCode } from '@/lib/code-generation/react-generator';

export const exportReactCodeTool = {
  name: 'export_react_code',
  description: 'Export current website as React + Vite project',
  inputSchema: z.object({
    typescript: z.boolean().default(true),
    includeTests: z.boolean().default(false),
  }),

  execute: async (args: any, builderRef: any) => {
    const state = builderRef.current?.state;
    if (!state) {
      return '❌ No website to export';
    }

    const files = await generateProductionCode(state, {
      framework: 'react',
      typescript: args.typescript,
      styling: 'tailwind',
      includeTests: args.includeTests,
      includeStorybook: false,
    });

    return `✅ **React project generated!**

📦 **Files created**: ${files.size}
⚙️ **TypeScript**: ${args.typescript ? 'Yes' : 'No'}
🧪 **Tests**: ${args.includeTests ? 'Included' : 'Not included'}

**Project structure**:
- src/App.tsx (main component)
- src/components/ (${state.sections.length} components)
- package.json (dependencies configured)
- vite.config.ts (build configuration)
${args.includeTests ? '- __tests__/ (test files)' : ''}

Files are ready to download or deploy!`;
  },
};

export const exportNextJSCodeTool = {
  name: 'export_nextjs_code',
  description: 'Export as Next.js 14 App Router project',
  inputSchema: z.object({
    typescript: z.boolean().default(true),
  }),

  execute: async (args: any, builderRef: any) => {
    const state = builderRef.current?.state;
    if (!state) return '❌ No website to export';

    const files = await generateProductionCode(state, {
      framework: 'nextjs',
      typescript: args.typescript,
      styling: 'tailwind',
      includeTests: false,
      includeStorybook: false,
    });

    return `✅ **Next.js project generated!**

📦 **Files created**: ${files.size}
🚀 **Framework**: Next.js 14 (App Router)
⚙️ **TypeScript**: ${args.typescript ? 'Yes' : 'No'}

**Project structure**:
- app/page.tsx (homepage)
- app/layout.tsx (root layout)
- components/ (reusable components)
- next.config.js
- tailwind.config.js

Ready for deployment to Vercel!`;
  },
};

export const exportHTMLCodeTool = {
  name: 'export_html_code',
  description: 'Export as standalone HTML/CSS/JS (no framework)',
  inputSchema: z.object({}),

  execute: async (args: any, builderRef: any) => {
    const state = builderRef.current?.state;
    if (!state) return '❌ No website to export';

    // Generate static HTML
    const html = generateStaticHTML(state);
    const css = generateCSS(state);

    return `✅ **Static HTML generated!**

📄 **Files**:
- index.html (complete page)
- styles.css (Tailwind CDN + custom styles)

🌐 **Deployment**: Ready to upload to any hosting
📦 **Size**: ~${(html.length / 1024).toFixed(1)} KB

No build step required - just upload and go!`;
  },
};

export const generatePackageJsonTool = {
  name: 'generate_package_json',
  description: 'Generate package.json with all dependencies',
  inputSchema: z.object({
    projectName: z.string().default('flex-website'),
    framework: z.enum(['react', 'nextjs', 'remix']).default('nextjs'),
  }),

  execute: async (args: any, builderRef: any) => {
    const state = builderRef.current?.state;
    
    const packageJson = {
      name: args.projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        dev: args.framework === 'nextjs' ? 'next dev' : 'vite',
        build: args.framework === 'nextjs' ? 'next build' : 'vite build',
        start: args.framework === 'nextjs' ? 'next start' : 'vite preview',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        ...(args.framework === 'nextjs' && { next: '^14.0.0' }),
        tailwindcss: '^3.4.0',
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        typescript: '^5.0.0',
      },
    };

    return `✅ **package.json generated!**

\`\`\`json
${JSON.stringify(packageJson, null, 2)}
\`\`\`

Install with: \`npm install\``;
  },
};

function generateStaticHTML(state: any): string {
  // Implementation for static HTML generation
  return '<!DOCTYPE html>...';
}

function generateCSS(state: any): string {
  return '/* Tailwind + custom styles */';
}
```

---

## 🗺️ PHASE 3: NAVIGATION & APP STRUCTURE (Week 2)

### 3.1 Main App Router

**File**: `src/App.tsx`

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layouts/AppLayout';

// Route pages
import WebsiteBuilderPage from './routes/builder';
import ComponentLabPage from './routes/component-lab';
import TemplateStudioPage from './routes/template-studio';
import ExportCenterPage from './routes/export-center';
import LibraryManagerPage from './routes/library-manager';
import DesignAnalyzerPage from './routes/design-analyzer';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/builder" replace />} />
        
        {/* Main builder */}
        <Route path="/builder" element={<WebsiteBuilderPage />} />
        
        {/* Tool-specific routes */}
        <Route path="/component-lab" element={<ComponentLabPage />} />
        <Route path="/template-studio" element={<TemplateStudioPage />} />
        <Route path="/export-center" element={<ExportCenterPage />} />
        <Route path="/library-manager" element={<LibraryManagerPage />} />
        <Route path="/design-analyzer" element={<DesignAnalyzerPage />} />
      </Route>
    </Routes>
  );
}
```

### 3.2 App Layout with Navigation

**File**: `src/components/layouts/AppLayout.tsx`

```typescript
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TestTube,
  FileText,
  Download,
  Library,
  Sparkles,
} from 'lucide-react';

const navigation = [
  { name: 'Builder', href: '/builder', icon: LayoutDashboard },
  { name: 'Component Lab', href: '/component-lab', icon: TestTube },
  { name: 'Templates', href: '/template-studio', icon: FileText },
  { name: 'Export', href: '/export-center', icon: Download },
  { name: 'Library', href: '/library-manager', icon: Library },
  { name: 'Analyzer', href: '/design-analyzer', icon: Sparkles },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="h-screen flex">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-gray-900 flex flex-col items-center py-4 space-y-4">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">F</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  w-14 h-14 rounded-lg flex items-center justify-center
                  transition-colors relative group
                  ${isActive 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
                title={item.name}
              >
                <Icon className="w-6 h-6" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
          <span className="text-white text-sm font-medium">U</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
```

---

## 📊 PHASE 4: PERSISTENCE & HISTORY (Week 2-3)

### 4.1 Enhanced IndexedDB Implementation

**File**: `src/lib/persistence/indexeddb-store.ts`

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface FlexBuilderDB extends DBSchema {
  projects: {
    key: string;
    value: {
      id: string;
      name: string;
      route: string; // Which route created it
      lastModified: Date;
      state: any;
      thumbnail?: string;
    };
    indexes: { 'by-date': Date; 'by-route': string };
  };
  
  history: {
    key: string;
    value: {
      id: string;
      projectId: string;
      timestamp: Date;
      state: any;
      description: string;
      route: string;
    };
    indexes: { 'by-project': string; 'by-date': Date };
  };
  
  variants: {
    key: string;
    value: {
      id: string;
      baseComponentId: string;
      name: string;
      propsOverrides: any;
      styleModifiers: any;
      createdAt: Date;
    };
    indexes: { 'by-component': string };
  };
  
  templates: {
    key: string;
    value: {
      id: string;
      name: string;
      category: string;
      sections: any[];
      tags: string[];
      createdAt: Date;
    };
    indexes: { 'by-category': string };
  };
}

class IndexedDBStore {
  private db: IDBPDatabase<FlexBuilderDB> | null = null;

  async init() {
    this.db = await openDB<FlexBuilderDB>('flex-builder-db', 2, {
      upgrade(db, oldVersion, newVersion) {
        // Projects
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-date', 'lastModified');
          projectStore.createIndex('by-route', 'route');
        }

        // History
        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', { keyPath: 'id' });
          historyStore.createIndex('by-project', 'projectId');
          historyStore.createIndex('by-date', 'timestamp');
        }

        // Variants
        if (!db.objectStoreNames.contains('variants')) {
          const variantStore = db.createObjectStore('variants', { keyPath: 'id' });
          variantStore.createIndex('by-component', 'baseComponentId');
        }

        // Templates
        if (!db.objectStoreNames.contains('templates')) {
          const templateStore = db.createObjectStore('templates', { keyPath: 'id' });
          templateStore.createIndex('by-category', 'category');
        }
      },
    });
  }

  // Projects
  async saveProject(project: any) {
    if (!this.db) await this.init();
    await this.db!.put('projects', {
      ...project,
      lastModified: new Date(),
    });
  }

  async getProject(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('projects', id);
  }

  async getAllProjects(route?: string) {
    if (!this.db) await this.init();
    if (route) {
      return this.db!.getAllFromIndex('projects', 'by-route', route);
    }
    return this.db!.getAll('projects');
  }

  // History
  async saveHistorySnapshot(snapshot: any) {
    if (!this.db) await this.init();
    await this.db!.add('history', snapshot);

    // Keep only last 50 per project
    const history = await this.db!.getAllFromIndex(
      'history',
      'by-project',
      snapshot.projectId
    );
    
    if (history.length > 50) {
      const toDelete = history.slice(0, history.length - 50);
      for (const item of toDelete) {
        await this.db!.delete('history', item.id);
      }
    }
  }

  async getHistory(projectId: string, limit = 50) {
    if (!this.db) await this.init();
    const all = await this.db!.getAllFromIndex('history', 'by-project', projectId);
    return all.slice(-limit).reverse();
  }

  // Variants
  async saveVariant(variant: any) {
    if (!this.db) await this.init();
    await this.db!.put('variants', variant);
  }

  async getVariantsForComponent(componentId: string) {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('variants', 'by-component', componentId);
  }

  // Templates
  async saveTemplate(template: any) {
    if (!this.db) await this.init();
    await this.db!.put('templates', template);
  }

  async getTemplatesByCategory(category: string) {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('templates', 'by-category', category);
  }

  async getAllTemplates() {
    if (!this.db) await this.init();
    return this.db!.getAll('templates');
  }
}

export const indexedDBStore = new IndexedDBStore();
```

### 4.2 Auto-Save Hook (Universal)

**File**: `src/hooks/useAutoSave.ts`

```typescript
import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { indexedDBStore } from '@/lib/persistence/indexeddb-store';
import { useLocation } from 'react-router-dom';

export function useAutoSave(
  state: any,
  projectId: string,
  projectName: string
) {
  const location = useLocation();
  const previousState = useRef<any>(null);

  const saveProject = debounce(async (currentState: any) => {
    await indexedDBStore.saveProject({
      id: projectId,
      name: projectName,
      route: location.pathname,
      state: currentState,
    });
  }, 1000);

  const saveSnapshot = debounce(async (currentState: any) => {
    await indexedDBStore.saveHistorySnapshot({
      id: `${projectId}-${Date.now()}`,
      projectId,
      timestamp: new Date(),
      state: currentState,
      description: getChangeDescription(previousState.current, currentState),
      route: location.pathname,
    });
  }, 5000);

  useEffect(() => {
    if (previousState.current) {
      saveProject(state);
      saveSnapshot(state);
    }
    previousState.current = state;
  }, [state]);

  return {
    manualSave: () => {
      saveProject.flush();
      saveSnapshot.flush();
    },
  };
}

function getChangeDescription(prev: any, current: any): string {
  if (!prev) return 'Initial state';
  // Analyze changes
  return 'State updated';
}
```

---

## 🎯 SUMMARY: PURE TAMBO ARCHITECTURE

### ✅ **What We've Built (Without Third-Party AI)**

**1. Component Variant System**
- Create variants of existing components
- Preset variants library
- Save custom variants
- Apply variants to sections
- **ALL via Tambo tools**

**2. Route-Based Organization**
- `/builder` - Main website builder
- `/component-lab` - Test and create variants
- `/template-studio` - Manage templates
- `/export-center` - Export code
- `/library-manager` - Organize components
- `/design-analyzer` - Quality analysis

**3. Robust Persistence**
- IndexedDB for all data
- Automatic history tracking
- Never lose work
- Works offline

**4. Clean Tool Architecture**
- Each route has own tools
- Tools registered per-route
- Context helpers per-route
- Clean separation of concerns

### 🚀 **Next Implementation Steps**

**Week 1:**
1. ✅ Create variant system (`variant-system.ts`)
2. ✅ Build Component Lab route
3. ✅ Add variant tools

**Week 2:**
1. ✅ Template Studio route
2. ✅ Export Center route
3. ✅ App layout with navigation

**Week 3:**
1. ✅ IndexedDB implementation
2. ✅ Auto-save hooks
3. ✅ History management

### 💡 **Key Advantages**

**vs Direct API Calls:**
- ✅ Tambo handles orchestration
- ✅ No API key management
- ✅ Streaming built-in
- ✅ Context automatically managed
- ✅ Simpler codebase

**vs Single Route:**
- ✅ Better UI organization
- ✅ Focused tools per feature
- ✅ Isolated contexts
- ✅ Easier to maintain
- ✅ Clearer user flow

**Result:**
A production-grade, maintainable, scalable website builder that works entirely within Tambo's ecosystem!

🎯 **Ready to implement? Start with Component Lab (Week 1)!**