import type { PageState } from '@/types/builder.types';
import { componentRegistry } from '@/lib/component-generator/registry';

export interface ExportConfig {
  framework: 'react' | 'nextjs';
  typescript: boolean;
  styling: 'tailwind';
  includeTests: boolean;
  includeStorybook: boolean;
}

function getComponentName(type: string): string {
  if (type.startsWith('gen-')) {
    return `Generated_${type.replace(/-/g, '_')}`;
  }
  return type
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

function getMainFilePath(config: ExportConfig): string {
  return config.framework === 'nextjs'
    ? `app/page.${config.typescript ? 'tsx' : 'jsx'}`
    : `src/App.${config.typescript ? 'tsx' : 'jsx'}`;
}

function generatePackageJson(_state: PageState, config: ExportConfig): string {
  const deps: Record<string, string> = {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
  };
  if (config.framework === 'nextjs') deps.next = '^14.0.0';
  if (config.styling === 'tailwind') {
    deps.tailwindcss = '^3.4.0';
    deps.autoprefixer = '^10.4.0';
    deps.postcss = '^8.4.0';
  }
  return JSON.stringify(
    {
      name: 'flex-generated-website',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: config.framework === 'nextjs' ? 'next dev' : 'vite',
        build: config.framework === 'nextjs' ? 'next build' : 'vite build',
        start: config.framework === 'nextjs' ? 'next start' : 'vite preview',
        lint: 'eslint .',
        ...(config.includeTests && { test: 'vitest' }),
      },
      dependencies: deps,
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        ...(config.typescript && { typescript: '^5.0.0' }),
        ...(config.framework !== 'nextjs' && { vite: '^5.0.0', '@vitejs/plugin-react': '^4.0.0' }),
      },
    },
    null,
    2
  );
}

function propsToJsx(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      if (typeof v === 'string') return `${k}="${v.replace(/"/g, '&quot;')}"`;
      if (typeof v === 'number') return `${k}={${v}}`;
      if (typeof v === 'boolean') return v ? k : '';
      return `${k}={${JSON.stringify(v)}}`;
    })
    .filter(Boolean)
    .join(' ');
}

async function generateMainComponent(
  state: PageState,
  config: ExportConfig
): Promise<string> {
  const ext = config.typescript ? 'tsx' : 'jsx';
  const imports = new Set<string>();
  const sections: string[] = [];

  for (const section of state.sections.filter((s) => s.visible)) {
    const type = section.type;
    const name = getComponentName(type);
    if (typeof type === 'string' && type.startsWith('gen-')) {
      const compPath = config.framework === 'react' ? './components/' : './components/';
      imports.add(`import { ${name} } from '${compPath}${name}.${ext}';`);
      sections.push(
        `      <section key="${section.id}"><${name} ${propsToJsx(section.props as Record<string, unknown>)} /></section>`
      );
    } else {
      imports.add(`import { SectionPlaceholder } from './components/SectionPlaceholder.${ext}';`);
      sections.push(
        `      <section key="${section.id}"><SectionPlaceholder type="${String(type)}" label="${(section.label || type).replace(/"/g, '\\"')}" props={${JSON.stringify(section.props)}} /></section>`
      );
    }
  }

  if (sections.length === 0) {
    sections.push('      <div className="p-8 text-center text-gray-500">No sections yet.</div>');
  }

  return `${Array.from(imports).join('\n')}

export default function App() {
  return (
    <div className="min-h-screen">
${sections.join('\n')}
    </div>
  );
}
`;
}

function generateSectionPlaceholder(config: ExportConfig): string {
  const ext = config.typescript ? 'tsx' : 'jsx';
  return `import React from 'react';

export function SectionPlaceholder({ type, label, props }: { type: string; label: string; props: Record<string, unknown> }) {
  return (
    <div className="min-h-[120px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="text-center text-gray-600">
        <p className="font-semibold">${'${label}'} (${'${type}'})</p>
        <p className="text-sm mt-1">Replace with your component</p>
      </div>
    </div>
  );
}
`;
}

export async function generateProductionCode(
  state: PageState,
  config: ExportConfig
): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  const ext = config.typescript ? 'tsx' : 'jsx';

  files.set('package.json', generatePackageJson(state, config));
  const mainCode = await generateMainComponent(state, config);
  files.set(getMainFilePath(config), mainCode);
  if (config.framework === 'react') {
    files.set(
      'src/main.' + (config.typescript ? 'tsx' : 'jsx'),
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.${ext}';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
`
    );
    files.set(
      'index.html',
      `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Flex Export</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.${ext}"></script></body>
</html>
`
    );
  }

  const prefix = config.framework === 'react' ? 'src/' : '';
  const writtenPlaceholder = new Set<string>();
  for (const section of state.sections.filter((s) => s.visible)) {
    const type = section.type;
    if (typeof type === 'string' && type.startsWith('gen-')) {
      const code = componentRegistry.getComponentCode(type);
      if (code) {
        const name = getComponentName(type);
        files.set(`${prefix}components/${name}.${ext}`, code);
      }
    } else if (!writtenPlaceholder.has('SectionPlaceholder')) {
      writtenPlaceholder.add('SectionPlaceholder');
      files.set(`${prefix}components/SectionPlaceholder.${ext}`, generateSectionPlaceholder(config));
    }
  }

  if (!writtenPlaceholder.has('SectionPlaceholder')) {
    files.set(`${prefix}components/SectionPlaceholder.${ext}`, generateSectionPlaceholder(config));
  }

  if (config.styling === 'tailwind') {
    files.set(
      'tailwind.config.js',
      `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
`
    );
    files.set(
      'postcss.config.js',
      `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
`
    );
    files.set(
      'src/globals.css',
      `@tailwind base;
@tailwind components;
@tailwind utilities;
`
    );
  }

  files.set(
    'README.md',
    `# Flex Builder Export

Generated with ${state.sections.length} section(s).

## Run

\`\`\`bash
npm install
npm run dev
\`\`\`
`
  );

  return files;
}
