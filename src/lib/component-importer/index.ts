export interface ImportSource {
  type: 'shadcn' | 'mui' | 'chakra' | 'url';
  identifier: string;
}

export interface ImportedComponent {
  id: string;
  name: string;
  source: ImportSource;
  code: string;
  adaptedCode: string;
  dependencies: string[];
}

async function adaptComponentToFlexSystem(
  code: string,
  sourceType: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return code;

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const claude = new Anthropic({ apiKey });
    const message = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Adapt this ${sourceType} component to work in the Flex Builder system. Use Tailwind CSS. Keep all original functionality. Return only the adapted component code.\n\n\`\`\`tsx\n${code.slice(0, 12000)}\n\`\`\``,
        },
      ],
    });
    const text = message.content
      .filter((block) => (block as { type: string }).type === 'text')
      .map((block) => (block as { text: string }).text)
      .join('');
    const match = text.match(/```(?:tsx?|jsx?)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim() || code;
  } catch {
    return code;
  }
}

function extractComponentName(code: string): string {
  const match = code.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
  return match ? match[1] : 'ImportedComponent';
}

function extractDependencies(code: string): string[] {
  const imports = code.match(/from\s+['"](.+?)['"]/g) || [];
  return imports
    .map((imp) => imp.replace(/from\s+['"]/, '').replace(/['"]$/, ''))
    .filter((dep) => !dep.startsWith('.') && !dep.startsWith('@/') && !dep.startsWith('react'));
}

async function importFromShadcn(componentName: string): Promise<ImportedComponent> {
  const url = `https://ui.shadcn.com/registry/styles/default/${componentName}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Shadcn registry returned ${response.status}. Try a different component name.`);
  }
  const data = (await response.json()) as {
    files?: Array<{ content?: string }>;
    dependencies?: string[];
  };
  const content = data.files?.[0]?.content ?? '';
  const adapted = await adaptComponentToFlexSystem(content || `export function ${componentName}() { return <div>${componentName}</div>; }`, 'shadcn');
  return {
    id: `shadcn-${componentName}-${Date.now()}`,
    name: componentName,
    source: { type: 'shadcn', identifier: componentName },
    code: content,
    adaptedCode: adapted,
    dependencies: data.dependencies ?? [],
  };
}

async function importFromMUI(componentName: string): Promise<ImportedComponent> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('MUI import requires VITE_ANTHROPIC_API_KEY');
  }
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const claude = new Anthropic({ apiKey });
  const message = await claude.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Create a standalone React component named ${componentName} that mimics the Material-UI ${componentName} component. Use Tailwind CSS only. No MUI imports. Return only the component code.`,
      },
    ],
  });
  const text = message.content
    .filter((block) => (block as { type: string }).type === 'text')
    .map((block) => (block as { text: string }).text)
    .join('');
  const code = text.match(/```(?:tsx?|jsx?)?\n?([\s\S]*?)```/)?.[1]?.trim() ?? text.trim();
  const adapted = await adaptComponentToFlexSystem(code, 'mui');
  return {
    id: `mui-${componentName}-${Date.now()}`,
    name: componentName,
    source: { type: 'mui', identifier: componentName },
    code: '',
    adaptedCode: adapted,
    dependencies: [],
  };
}

async function importFromChakra(componentName: string): Promise<ImportedComponent> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Chakra import requires VITE_ANTHROPIC_API_KEY');
  }
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const claude = new Anthropic({ apiKey });
  const message = await claude.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Create a standalone React component named ${componentName} that mimics the Chakra UI ${componentName} component. Use Tailwind CSS only. No Chakra imports. Return only the component code.`,
      },
    ],
  });
  const text = message.content
    .filter((block) => (block as { type: string }).type === 'text')
    .map((block) => (block as { text: string }).text)
    .join('');
  const code = text.match(/```(?:tsx?|jsx?)?\n?([\s\S]*?)```/)?.[1]?.trim() ?? text.trim();
  const adapted = await adaptComponentToFlexSystem(code, 'chakra');
  return {
    id: `chakra-${componentName}-${Date.now()}`,
    name: componentName,
    source: { type: 'chakra', identifier: componentName },
    code: '',
    adaptedCode: adapted,
    dependencies: [],
  };
}

async function importFromURL(url: string): Promise<ImportedComponent> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
  const code = await response.text();
  const name = extractComponentName(code);
  const adapted = await adaptComponentToFlexSystem(code, 'custom');
  return {
    id: `url-${Date.now()}`,
    name,
    source: { type: 'url', identifier: url },
    code,
    adaptedCode: adapted,
    dependencies: extractDependencies(code),
  };
}

export async function importComponent(source: ImportSource): Promise<ImportedComponent> {
  switch (source.type) {
    case 'shadcn':
      return importFromShadcn(source.identifier);
    case 'mui':
      return importFromMUI(source.identifier);
    case 'chakra':
      return importFromChakra(source.identifier);
    case 'url':
      return importFromURL(source.identifier);
    default:
      throw new Error(`Unsupported import source: ${(source as ImportSource).type}`);
  }
}
