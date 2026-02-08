import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import { generateProductionCode } from '@/lib/export/production-generator';
import { setLastExport } from '@/lib/export/last-export';

const defaultConfig = {
  framework: 'react' as const,
  typescript: true,
  styling: 'tailwind' as const,
  includeTests: false,
  includeStorybook: false,
};

export function createExportCodeTool(
  builderActionsRef: MutableRefObject<BuilderActions | null>
) {
  return defineTool({
    name: 'export_website_code',
    description:
      'Generate production-ready React/Vite code for the current website. Use when the user asks to export, download code, or get the project. After running, the user can click Export in the builder header to download a ZIP.',
    inputSchema: z.object({
      framework: z.enum(['react', 'nextjs']).optional(),
      typescript: z.boolean().optional(),
    }),
    outputSchema: z.string(),
    tool: async ({ framework, typescript }) => {
      const actions = builderActionsRef.current;
      if (!actions) {
        return 'Website builder is not open. Open the website builder page first.';
      }
      const config = {
        ...defaultConfig,
        framework: framework ?? defaultConfig.framework,
        typescript: typescript ?? defaultConfig.typescript,
      };
      const files = await generateProductionCode(actions.state, config);
      setLastExport(files);
      const list = Array.from(files.keys()).slice(0, 20);
      const more = files.size > 20 ? ` ... and ${files.size - 20} more` : '';
      return `✅ **Code generated!** (${files.size} files)

📦 **Includes**: ${list.join(', ')}${more}

🎯 **Next step**: Click **Export** or **Download ZIP** in the builder header to download the project. Then run \`npm install && npm run dev\` in the extracted folder.`;
    },
  });
}
