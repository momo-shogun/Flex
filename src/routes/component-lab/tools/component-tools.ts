import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import type { ComponentId } from '@/types/components';
import type { ComponentVariant } from '@/lib/component-system/variant-system';
import {
  variantRegistry,
  PRESET_VARIANTS,
} from '@/lib/component-system/variant-system';

const componentIdSchema = z.string();

export function createComponentLabTools(
  builderRef: MutableRefObject<BuilderActions | null>
) {
  const createComponentVariant = defineTool({
    name: 'create_component_variant',
    description: `Create a new variant of an existing component by modifying its props and styling. Use when user wants to customize (e.g. "make a dark version of the hero", "create a smaller variant").`,
    inputSchema: z.object({
      baseComponentId: componentIdSchema,
      variantName: z.string(),
      propsChanges: z.record(z.unknown()).default({}),
      styleModifiers: z
        .object({
          theme: z.enum(['light', 'dark', 'colored']).optional(),
          size: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
          variant: z.enum(['default', 'outlined', 'filled', 'ghost']).optional(),
        })
        .optional(),
    }),
    outputSchema: z.string(),
    tool: async ({ baseComponentId, variantName, propsChanges, styleModifiers }) => {
      const variant = variantRegistry.createVariant(
        baseComponentId as ComponentId,
        variantName,
        propsChanges,
        styleModifiers ?? {}
      );
      return `✅ Created variant: **${variant.name}**

📋 **Base component**: ${baseComponentId}
🎨 **Theme**: ${variant.styleModifiers.theme ?? 'default'}
📏 **Size**: ${variant.styleModifiers.size ?? 'default'}

**Props modified**:
${Object.entries(propsChanges)
  .map(([k, v]) => `• ${k}: ${JSON.stringify(v)}`)
  .join('\n')}

The variant is saved. Want to add it to your canvas?`;
    },
  });

  const listComponentVariants = defineTool({
    name: 'list_component_variants',
    description: `List all variants for a component or all variants. Use when user asks "what variants exist?" or "show me hero variants".`,
    inputSchema: z.object({
      componentId: z.string().optional(),
    }),
    outputSchema: z.string(),
    tool: async ({ componentId }) => {
      if (componentId) {
        const variants = variantRegistry.getVariantsForComponent(
          componentId as ComponentId
        );
        const presets = PRESET_VARIANTS[componentId as ComponentId];
        if (variants.length === 0 && !presets?.length) {
          return `No variants found for ${componentId}. Ask me to create one!`;
        }
        const lines = [
          ...variants.map(
            (v, i) =>
              `${i + 1}. **${v.name}** (custom)\n   Base: ${v.baseComponentId}\n   Theme: ${v.styleModifiers.theme ?? 'default'}`
          ),
          ...(presets ?? []).map(
            (v, i) =>
              `${variants.length + i + 1}. **${v.name}** (preset)\n   ${v.description}\n   Theme: ${v.styleModifiers.theme ?? 'default'}`
          ),
        ];
        return `📦 **Variants for ${componentId}**\n\n${lines.join('\n\n')}`;
      }
      const all = variantRegistry.getAllVariants();
      return `📦 **All variants** (${all.length})\n\n${all.map((v, i) => `${i + 1}. **${v.name}** – ${v.baseComponentId} (${v.styleModifiers.theme ?? 'default'})`).join('\n')}`;
    },
  });

  const applyVariantToSection = defineTool({
    name: 'apply_variant_to_section',
    description: `Apply a variant's styling to an existing section. Use when user wants to change a section to use a specific variant.`,
    inputSchema: z.object({
      sectionId: z.string(),
      variantId: z.string(),
    }),
    outputSchema: z.string(),
    tool: async ({ sectionId, variantId }) => {
      const variant = variantRegistry.getVariant(variantId);
      if (!variant) return `❌ Variant ${variantId} not found.`;
      const actions = builderRef.current;
      if (!actions) {
        return 'Open the Website Builder to apply variants to sections.';
      }
      const section = actions.getSection(sectionId);
      if (!section) return `❌ Section ${sectionId} not found.`;
      actions.dispatch({
        type: 'UPDATE_PROPS',
        id: sectionId,
        props: { ...section.props, ...variant.propsOverrides },
      });
      return `✅ Applied **${variant.name}** to "${section.label}"!

🎨 Changes: ${Object.entries(variant.propsOverrides)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join(', ')}`;
    },
  });

  const usePresetVariant = defineTool({
    name: 'use_preset_variant',
    description: `Use a pre-defined variant (Dark Hero, Ocean Silk, etc). Add to canvas or apply.`,
    inputSchema: z.object({
      presetId: z.string(),
      addToCanvas: z.boolean().default(true),
    }),
    outputSchema: z.string(),
    tool: async ({ presetId, addToCanvas }) => {
      let preset: ComponentVariant | null = null;
      for (const variants of Object.values(PRESET_VARIANTS)) {
        if (!variants) continue;
        preset = variants.find((v) => v.id === presetId) ?? null;
        if (preset) break;
      }
      if (!preset) return `❌ Preset variant ${presetId} not found.`;
      const actions = builderRef.current;
      if (addToCanvas && actions) {
        const sectionId = actions.addSection(preset.baseComponentId);
        actions.dispatch({
          type: 'UPDATE_PROPS',
          id: sectionId,
          props: preset.propsOverrides,
        });
        actions.dispatch({
          type: 'UPDATE_SECTION',
          id: sectionId,
          updates: { label: preset.name },
        });
        return `✅ Added **${preset.name}** to canvas!\n\n📋 ${preset.description}\n🎨 Theme: ${preset.styleModifiers.theme ?? 'default'}`;
      }
      return `✅ Preset **${preset.name}** is ready. Open the builder and ask to "add ${preset.name}" or "apply variant ${presetId} to section".`;
    },
  });

  return [
    createComponentVariant,
    listComponentVariants,
    applyVariantToSection,
    usePresetVariant,
  ];
}
