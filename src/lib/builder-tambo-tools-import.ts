import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import { importComponent } from '@/lib/component-importer';
import { componentRegistry } from '@/lib/component-generator/registry';

export function createImportTool(
  builderActionsRef: MutableRefObject<BuilderActions | null>
) {
  return defineTool({
    name: 'import_component',
    description: `Import components from shadcn, MUI, Chakra, or a URL. Automatically adapts them to Flex Builder. Examples: "Import the button component from shadcn", "Import card from shadcn", "Import from https://example.com/component.tsx".`,
    inputSchema: z.object({
      source: z.enum(['shadcn', 'mui', 'chakra', 'url']),
      identifier: z.string().describe('Component name (e.g. button, card) or full URL'),
      addToCanvas: z.boolean().default(true),
    }),
    outputSchema: z.string(),
    tool: async ({ source, identifier, addToCanvas }) => {
      try {
        const imported = await importComponent({ type: source, identifier });
        const componentId = componentRegistry.registerGeneratedComponent(
          imported.adaptedCode,
          imported.name,
          z.record(z.unknown()),
          { description: `Imported from ${source}: ${imported.name}` }
        );

        if (addToCanvas && builderActionsRef.current) {
          const sectionId = builderActionsRef.current.addSection(componentId as import('@/types/builder.types').SectionType);
          builderActionsRef.current.dispatch({
            type: 'UPDATE_SECTION',
            id: sectionId,
            updates: { label: imported.name },
          });
        }

        const deps =
          imported.dependencies.length > 0
            ? `\n📦 **Dependencies**: ${imported.dependencies.join(', ')}\n⚠️ Install with: \`npm install ${imported.dependencies.join(' ')}\``
            : '\n📦 **Dependencies**: None – fully self-contained.';

        return `✅ **Imported ${imported.name} from ${source}!**${deps}\n\n${addToCanvas ? '🎯 **Component added to canvas!**' : '🎯 **Component saved to library.** Ask me to add it to the page.'}`;
      } catch (err) {
        return `❌ Import failed: ${err instanceof Error ? err.message : 'Unknown error'}. Check component name or URL and try again.`;
      }
    },
  });
}
