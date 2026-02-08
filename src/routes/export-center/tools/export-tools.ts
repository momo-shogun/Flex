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

export function createExportCenterTools(
  builderRef: MutableRefObject<BuilderActions | null>
) {
  const exportReact = defineTool({
    name: 'export_react_code',
    description: 'Export current website as React + Vite project.',
    inputSchema: z.object({
      typescript: z.boolean().default(true),
      includeTests: z.boolean().default(false),
    }),
    outputSchema: z.string(),
    tool: async ({ typescript, includeTests }) => {
      const state = builderRef.current?.state;
      if (!state) return '❌ No website to export. Open the builder first.';
      const files = await generateProductionCode(state, {
        ...defaultConfig,
        framework: 'react',
        typescript,
        includeTests,
      });
      setLastExport(files);
      return `✅ **React project generated!** (${files.size} files)\n\nTypeScript: ${typescript}, Tests: ${includeTests}. Use "Download ZIP" in Export Center to get the package.`;
    },
  });

  const exportNext = defineTool({
    name: 'export_nextjs_code',
    description: 'Export as Next.js 14 project.',
    inputSchema: z.object({
      typescript: z.boolean().default(true),
    }),
    outputSchema: z.string(),
    tool: async ({ typescript }) => {
      const state = builderRef.current?.state;
      if (!state) return '❌ No website to export. Open the builder first.';
      const files = await generateProductionCode(state, {
        ...defaultConfig,
        framework: 'nextjs',
        typescript,
      });
      setLastExport(files);
      return `✅ **Next.js project generated!** (${files.size} files). Use "Download ZIP" to get the package.`;
    },
  });

  const exportHtml = defineTool({
    name: 'export_html_code',
    description: 'Export as standalone HTML/CSS/JS (no framework).',
    inputSchema: z.object({}),
    outputSchema: z.string(),
    tool: async () => {
      const state = builderRef.current?.state;
      if (!state) return '❌ No website to export. Open the builder first.';
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Flex Export</title><script src="https://cdn.tailwindcss.com"></script></head><body><div class="p-8 text-center text-gray-500">${state.sections.length} sections – export as React/Next for full code.</div></body></html>`;
      const files = new Map<string, string>();
      files.set('index.html', html);
      setLastExport(files);
      return '✅ **Static HTML generated!** (index.html). Use "Download ZIP" to get the file.';
    },
  });

  const generatePackageJson = defineTool({
    name: 'generate_package_json',
    description: 'Generate package.json with dependencies.',
    inputSchema: z.object({
      projectName: z.string().default('flex-website'),
      framework: z.enum(['react', 'nextjs']).default('nextjs'),
    }),
    outputSchema: z.string(),
    tool: async ({ projectName, framework }) => {
      const pkg = {
        name: projectName,
        version: '1.0.0',
        private: true,
        scripts: {
          dev: framework === 'nextjs' ? 'next dev' : 'vite',
          build: framework === 'nextjs' ? 'next build' : 'vite build',
          start: framework === 'nextjs' ? 'next start' : 'vite preview',
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          ...(framework === 'nextjs' && { next: '^14.0.0' }),
          tailwindcss: '^3.4.0',
        },
        devDependencies: {
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          typescript: '^5.0.0',
        },
      };
      return `✅ **package.json**\n\n\`\`\`json\n${JSON.stringify(pkg, null, 2)}\n\`\`\``;
    },
  });

  return [exportReact, exportNext, exportHtml, generatePackageJson];
}
