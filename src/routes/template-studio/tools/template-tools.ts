import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import type { WebsiteTemplate } from '@/lib/templates';
import { addCustomTemplate, updateCustomTemplate } from '@/lib/templates';
import { toComponentId } from '@/types/builder.types';
import type { ComponentId } from '@/types/components';

const sectionSchema = z.object({
  type: z.string(),
  label: z.string(),
  props: z.record(z.unknown()),
});

export function createTemplateStudioTools(
  builderRef: MutableRefObject<BuilderActions | null>
) {
  const createTemplate = defineTool({
    name: 'create_website_template',
    description: `Create a new reusable website template. Use when user wants to save a template from scratch or from current sections.`,
    inputSchema: z.object({
      name: z.string(),
      description: z.string(),
      category: z.enum(['landing', 'portfolio', 'saas', 'ecommerce', 'blog']),
      sections: z.array(sectionSchema),
      tags: z.array(z.string()).optional(),
    }),
    outputSchema: z.string(),
    tool: async ({ name, description, category, sections, tags }) => {
      const template: WebsiteTemplate = {
        id: `template-${Date.now()}`,
        name,
        description,
        category,
        sections: sections.map((s) => ({
          type: s.type as ComponentId,
          label: s.label,
          props: s.props,
          purpose: `Part of ${name} template`,
        })),
        tags: tags ?? [],
      };
      addCustomTemplate(template);
      return `✅ Created template: **${template.name}**

📋 Category: ${category}
📦 Sections: ${template.sections.length}
🏷️ Tags: ${template.tags.join(', ')}

Use it with: "Generate website from template" (search for "${name}").`;
    },
  });

  const updateTemplate = defineTool({
    name: 'update_template',
    description: 'Modify an existing custom template.',
    inputSchema: z.object({
      templateId: z.string(),
      updates: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        sections: z.array(sectionSchema).optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
    outputSchema: z.string(),
    tool: async ({ templateId, updates }) => {
      const normalizedUpdates: Partial<WebsiteTemplate> = updates.sections
        ? {
            ...updates,
            sections: updates.sections.map((s) => ({
              type: s.type as ComponentId,
              label: s.label,
              props: s.props,
              purpose: (s as { purpose?: string }).purpose ?? 'Section',
            })),
          }
        : updates as Partial<WebsiteTemplate>;
      const ok = updateCustomTemplate(templateId, normalizedUpdates);
      if (!ok) return `❌ Template ${templateId} not found.`;
      return `✅ Updated template **${templateId}**.`;
    },
  });

  const saveCurrentAsTemplate = defineTool({
    name: 'save_current_as_template',
    description: 'Save the current website in the builder as a reusable template.',
    inputSchema: z.object({
      name: z.string(),
      description: z.string(),
      category: z.enum(['landing', 'portfolio', 'saas', 'ecommerce', 'blog']),
    }),
    outputSchema: z.string(),
    tool: async ({ name, description, category }) => {
      const state = builderRef.current?.state;
      if (!state?.sections?.length) {
        return '❌ No website to save. Open the builder and add sections first.';
      }
      const template: WebsiteTemplate = {
        id: `snapshot-${Date.now()}`,
        name,
        description,
        category,
        sections: state.sections.map((s) => ({
          type: toComponentId(s.type),
          label: s.label,
          props: s.props,
          purpose: `Section from ${name}`,
        })),
        tags: [category, 'custom'],
      };
      addCustomTemplate(template);
      return `✅ Saved current website as template: **${template.name}** (${template.sections.length} sections).`;
    },
  });

  return [createTemplate, updateTemplate, saveCurrentAsTemplate];
}
