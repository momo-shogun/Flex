import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import { generateComponentOnTheFly } from '@/lib/component-generator';
import { componentRegistry } from '@/lib/component-generator/registry';

export function createComponentGenTools(
  builderActionsRef: MutableRefObject<BuilderActions | null>
) {
  const generateComponent = defineTool({
    name: 'generate_component',
    description: `Generate a brand new, fully functional React component on-the-fly based on user description. Use when user requests a component that doesn't exist in the library. Examples: "Create a pricing table with 3 tiers", "Build a contact form", "Make an animated testimonial carousel".`,
    inputSchema: z.object({
      description: z.string(),
      functionality: z.array(z.string()).default([]),
      styling: z.enum(['minimal', 'modern', 'glassmorphism', 'neumorphism']).default('modern'),
      interactivity: z.enum(['static', 'interactive', 'animated']).default('interactive'),
      dataFields: z
        .array(z.object({ name: z.string(), type: z.enum(['string', 'number', 'boolean', 'email', 'url', 'date']) }))
        .optional(),
      addToCanvas: z.boolean().default(true),
    }),
    outputSchema: z.string(),
    tool: async ({ description, functionality, styling, interactivity, dataFields, addToCanvas }) => {
      try {
        const generated = await generateComponentOnTheFly({
          description,
          functionality,
          styling,
          interactivity,
          dataBinding: dataFields?.length ? { fields: dataFields } : undefined,
        });

        const componentId = componentRegistry.registerGeneratedComponent(
          generated.code,
          generated.name,
          z.record(z.unknown()),
          { description: generated.description }
        );

        if (addToCanvas && builderActionsRef.current) {
          const sectionId = builderActionsRef.current.addSection(componentId);
          builderActionsRef.current.dispatch({
            type: 'UPDATE_SECTION',
            id: sectionId,
            updates: { label: generated.name },
          });
        }

        return `✨ **Generated new component: ${generated.name}**

📝 **Description**: ${description}
🎨 **Styling**: ${styling}
⚡ **Interactivity**: ${interactivity}

${functionality.length > 0 ? `✅ **Features**: ${functionality.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n` : ''}
${addToCanvas ? '🎯 **Component added to canvas!** Edit in the inspector or add more from the Layers panel.' : '🎯 **Component saved to library.** Ask me to "add [component name] to the page" to use it.'}`;
      } catch (err) {
        return `❌ Failed to generate component: ${err instanceof Error ? err.message : 'Unknown error'}. Try simplifying the description or breaking into smaller parts.`;
      }
    },
  });

  const listGeneratedComponents = defineTool({
    name: 'list_generated_components',
    description: 'List all AI-generated components available in the library.',
    inputSchema: z.object({}),
    outputSchema: z.string(),
    tool: async () => {
      const components = componentRegistry
        .getAllComponents()
        .filter((c) => c.category === 'ai-generated' || c.id.startsWith('gen-'));

      if (components.length === 0) {
        return 'No AI-generated components yet. Ask me to generate one (e.g. "Create a pricing table" or "Build a contact form").';
      }

      return `📦 **Your Generated Components** (${components.length} total)

${components
  .map(
    (c, i) =>
      `${i + 1}. **${c.name}**\n   - ID: \`${c.id}\`\n   - Created: ${c.metadata.createdAt.toLocaleDateString()}\n   - Used: ${c.metadata.usageCount} times`
  )
  .join('\n\n')}

You can ask me to add any of these to your page by ID.`;
    },
  });

  const improveGeneratedComponent = defineTool({
    name: 'improve_generated_component',
    description: 'Improve an existing AI-generated component based on feedback (e.g. "add animations", "make it responsive", "improve colors").',
    inputSchema: z.object({
      componentId: z.string(),
      improvements: z.string(),
    }),
    outputSchema: z.string(),
    tool: async ({ componentId, improvements }) => {
      const existing = componentRegistry.getComponent(componentId);
      if (!existing) {
        return `Component ${componentId} not found. Use list_generated_components to see available IDs.`;
      }

      const existingCode = componentRegistry.getComponentCode(componentId);
      if (!existingCode) {
        return 'Could not retrieve component code.';
      }

      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        return 'Improvements require VITE_ANTHROPIC_API_KEY. The original component is unchanged.';
      }

      try {
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const claude = new Anthropic({ apiKey });

        const message = await claude.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: `Improve this React component based on: ${improvements}\n\nCurrent code:\n\`\`\`tsx\n${existingCode}\n\`\`\`\n\nReturn ONLY the improved component code, same structure and props.`,
            },
          ],
        });

        const improvedCode = message.content
          .filter((block) => (block as { type: string }).type === 'text')
          .map((block) => (block as { text: string }).text)
          .join('');

        const codeMatch = improvedCode.match(/```(?:tsx?|jsx?)?\n?([\s\S]*?)```/) ?? improvedCode.trim();
        const code = typeof codeMatch === 'string' ? codeMatch : (codeMatch[1] ?? improvedCode).trim();

        const newId = componentRegistry.registerGeneratedComponent(
          code || existingCode,
          `${existing.name} (Improved)`,
          existing.propsSchema,
          { description: existing.metadata.description }
        );

        return `✨ **Component improved!** Changes: ${improvements}\n\nNew version saved as "${existing.name} (Improved)" (ID: \`${newId}\`). Your original is still available. Add the improved version to the page?`;
      } catch (err) {
        return `❌ Improve failed: ${err instanceof Error ? err.message : 'Unknown error'}. Original component unchanged.`;
      }
    },
  });

  return [generateComponent, listGeneratedComponents, improveGeneratedComponent];
}
