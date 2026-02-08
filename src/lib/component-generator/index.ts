/**
 * On-the-fly component generation using AI.
 * Requires VITE_ANTHROPIC_API_KEY for live generation.
 */

export interface GenerateComponentRequest {
  description: string;
  functionality: string[];
  styling: 'minimal' | 'modern' | 'glassmorphism' | 'neumorphism';
  interactivity: 'static' | 'interactive' | 'animated';
  dataBinding?: {
    fields: Array<{ name: string; type: string }>;
  };
}

export interface GeneratedComponent {
  id: string;
  name: string;
  code: string;
  props: Record<string, unknown>;
  dependencies: string[];
  propsSchema: unknown;
  description?: string;
}

const DEFAULT_GENERATED_CODE = `
import React from 'react';

export function GeneratedComponent({ title = "Generated Component" }: { title?: string }) {
  return (
    <div className="min-h-[200px] flex items-center justify-center bg-slate-800/50 border border-slate-600 rounded-lg p-6">
      <p className="text-lg text-slate-200">{title}</p>
    </div>
  );
}
`.trim();

export async function generateComponentOnTheFly(
  request: GenerateComponentRequest
): Promise<GeneratedComponent> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const componentId = `generated-${Date.now()}`;

  if (!apiKey || typeof apiKey !== 'string') {
    return {
      id: componentId,
      name: request.description.slice(0, 40).replace(/\W/g, '') || 'GeneratedComponent',
      code: DEFAULT_GENERATED_CODE.replace(
        'Generated Component',
        request.description.slice(0, 60)
      ),
      props: { title: request.description.slice(0, 60) },
      dependencies: [],
      propsSchema: {},
      description: request.description,
    };
  }

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const claude = new Anthropic({ apiKey });

    const prompt = `
You are an expert React component generator. Create a production-ready, fully functional component based on these requirements:

**Description**: ${request.description}
**Functionality**: ${request.functionality.join(', ')}
**Styling**: ${request.styling}
**Interactivity**: ${request.interactivity}
${request.dataBinding ? `**Data Fields**: ${JSON.stringify(request.dataBinding.fields)}` : ''}

Requirements:
1. Use TypeScript
2. Use Tailwind CSS for styling
3. Include all necessary imports
4. Make it fully self-contained (no external file dependencies)
5. Use React hooks (useState, useEffect) for interactivity
6. Follow shadcn/ui design patterns
7. Include proper TypeScript types for props
8. Add JSDoc comments
9. Export a single named function component (e.g. export function MyComponent(props) { ... })

Return ONLY a JSON object with this structure (escape any quotes inside strings):
{
  "name": "ComponentName",
  "code": "full component code here as single line or escaped",
  "dependencies": ["package-name@version"],
  "description": "brief description"
}
`;

    const message = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content
      .filter((block) => (block as { type: string }).type === 'text')
      .map((block) => (block as { text: string }).text)
      .join('');

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        id: componentId,
        name: 'GeneratedComponent',
        code: DEFAULT_GENERATED_CODE,
        props: {},
        dependencies: [],
        propsSchema: {},
        description: request.description,
      };
    }

    const generated = JSON.parse(jsonMatch[0]) as {
      name?: string;
      code?: string;
      dependencies?: string[];
      description?: string;
    };

    const name =
      typeof generated.name === 'string' && generated.name
        ? generated.name.replace(/\W/g, '')
        : 'GeneratedComponent';
    const code =
      typeof generated.code === 'string' && generated.code
        ? generated.code
        : DEFAULT_GENERATED_CODE;

    return {
      id: componentId,
      name,
      code,
      props: {},
      dependencies: Array.isArray(generated.dependencies) ? generated.dependencies : [],
      propsSchema: {},
      description: generated.description ?? request.description,
    };
  } catch (err) {
    return {
      id: componentId,
      name: 'GeneratedComponent',
      code: DEFAULT_GENERATED_CODE,
      props: {},
      dependencies: [],
      propsSchema: {},
      description: request.description,
    };
  }
}
