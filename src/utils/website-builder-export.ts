import JSZip from 'jszip';
import type { BuilderSection } from '@/types/website-builder';

function generateAppTsx(sections: BuilderSection[]): string {
  const importSet = new Set<string>();
  const elements: string[] = [];

  for (const section of sections) {
    switch (section.type) {
      // Text Animations
      case 'split-text':
        importSet.add("import { SplitText } from './components/SplitText';");
        elements.push(`      <div key="${section.id}" className="min-h-screen flex items-center justify-center p-8">`);
        elements.push(`        <SplitText />`);
        elements.push(`      </div>`);
        break;
      case 'blur-text':
        importSet.add("import { BlurText } from './components/BlurText';");
        elements.push(`      <div key="${section.id}" className="min-h-screen flex items-center justify-center p-8">`);
        elements.push(`        <BlurText />`);
        elements.push(`      </div>`);
        break;
      case 'text-cursor':
        importSet.add("import { TextCursor } from './components/TextCursor';");
        elements.push(`      <div key="${section.id}" className="min-h-screen flex items-center justify-center p-8">`);
        elements.push(`        <TextCursor />`);
        elements.push(`      </div>`);
        break;
      // Backgrounds
      case 'silk':
      case 'floating-lines':
      case 'light-pillar':
        const bgName = section.type === 'silk' ? 'Silk' : section.type === 'floating-lines' ? 'FloatingLines' : 'LightPillar';
        importSet.add(`import { ${bgName} } from './components/${bgName}';`);
        elements.push(`      <div key="${section.id}" className="relative min-h-screen">`);
        elements.push(`        <${bgName} />`);
        elements.push(`        <div className="relative z-10 flex items-center justify-center h-screen">`);
        elements.push(`          <h2 className="text-4xl font-bold text-white">${bgName}</h2>`);
        elements.push(`        </div>`);
        elements.push(`      </div>`);
        break;
      // Sections
      case 'smooth-scroll-hero':
        importSet.add("import { SmoothScrollHero } from './components/SmoothScrollHero';");
        elements.push(`      <SmoothScrollHero key="${section.id}" />`);
        break;
      case 'aurora-hero':
        importSet.add("import { AuroraHero } from './components/AuroraHero';");
        elements.push(`      <AuroraHero key="${section.id}" />`);
        break;
      case 'faq':
        importSet.add("import { FAQ } from './components/FAQ';");
        elements.push(`      <FAQ key="${section.id}" />`);
        break;
      default:
        break;
    }
  }

  const imports = Array.from(importSet);
  return `${imports.join('\n')}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
${elements.join('\n')}
    </div>
  );
}
`;
}

async function getPackageJson(): Promise<string> {
  return JSON.stringify(
    {
      name: 'flex-exported-project',
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'framer-motion': '^11.11.17',
        'react-icons': '^5.4.0',
        three: '^0.170.0',
        '@react-three/fiber': '^8.17.10',
        '@react-three/drei': '^9.117.3',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.3.4',
        vite: '^5.4.11',
        tailwindcss: '^3.4.17',
        postcss: '^8.4.49',
        autoprefixer: '^10.4.20',
      },
    },
    null,
    2
  );
}

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exported Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const MAIN_TSX = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;

const VITE_CONFIG = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`;

const INDEX_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { margin: 0; min-height: 100vh; }
  #root { min-height: 100vh; }
}
`;

const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
`;

const POSTCSS_CONFIG = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

// Text Animations
const SPLIT_TEXT_SOURCE = `import { motion } from 'framer-motion';

export function SplitText() {
  const text = 'Beautiful animated text';
  const characters = text.split('');
  
  return (
    <div className="flex flex-wrap justify-center">
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className="text-5xl font-bold text-white"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}
`;

const BLUR_TEXT_SOURCE = `import { motion } from 'framer-motion';

export function BlurText() {
  const text = 'Smooth blur effect';
  const words = text.split(' ');
  
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ delay: i * 0.2, duration: 0.8 }}
          className="text-5xl font-bold text-white"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
`;

const TEXT_CURSOR_SOURCE = `import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function TextCursor() {
  const [text, setText] = useState('');
  const fullText = 'Type with cursor effect';
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center text-5xl font-bold text-white">
      <span>{text}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="ml-1 inline-block h-12 w-1 bg-white"
      />
    </div>
  );
}
`;

// Backgrounds
const SILK_SOURCE = `export function Silk() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-950 to-blue-950 opacity-50" />
  );
}
`;

const FLOATING_LINES_SOURCE = `import { motion } from 'framer-motion';

export function FloatingLines() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"
          style={{
            top: \`\${Math.random() * 100}%\`,
            left: 0,
            width: '100%',
            opacity: 0.2,
          }}
          animate={{
            y: [-20, 20],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
`;

const LIGHT_PILLAR_SOURCE = `import { motion } from 'framer-motion';

export function LightPillar() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div
        className="h-full w-64 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent blur-3xl"
        animate={{
          x: [-100, 100],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </div>
  );
}
`;

const AURORA_HERO_SOURCE = `import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useMotionTemplate, useMotionValue, motion, animate } from 'framer-motion';

const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];

export function AuroraHero() {
  const color = useMotionValue(COLORS_TOP[0]);
  useEffect(() => {
    animate(color, COLORS_TOP, { ease: 'easeInOut', duration: 10, repeat: Infinity, repeatType: 'mirror' });
  }, [color]);
  const backgroundImage = useMotionTemplate\`radial-gradient(125% 125% at 50% 0%, #020617 50%, \${color})\`;
  const border = useMotionTemplate\`1px solid \${color}\`;
  const boxShadow = useMotionTemplate\`0px 4px 24px \${color}\`;
  return (
    <motion.section style={{ backgroundImage }} className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200">
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">Beta Now Live!</span>
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl md:text-7xl">
          Decrease your SaaS churn by over 90%
        </h1>
        <p className="my-6 max-w-xl text-center text-base text-gray-400">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
        <motion.button type="button" style={{ border, boxShadow }} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
          className="flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 hover:bg-gray-950/50">
          Start free trial <FiArrowRight className="group-hover:-rotate-45" />
        </motion.button>
      </div>
      <div className="absolute inset-0 z-0"><Canvas><Stars radius={50} count={2500} factor={4} fade speed={2} /></Canvas></div>
    </motion.section>
  );
}
`;

const FAQ_SOURCE = `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_ITEMS = [
  { question: 'How do I get started?', answer: 'Sign up and follow the onboarding steps.' },
  { question: 'What payment methods do you accept?', answer: 'We accept credit cards, PayPal, and bank transfers.' },
  { question: 'Can I cancel anytime?', answer: 'Yes. Cancel from account settings.' },
];

function cn(...c) { return c.filter(Boolean).join(' '); }

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className={cn('mx-auto max-w-2xl px-4 py-16 text-slate-100')}>
      <h2 className="mb-10 text-2xl font-bold text-white">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {DEFAULT_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div key={index} layout className="rounded-lg border border-slate-700 bg-slate-900/50 overflow-hidden">
              <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium text-white hover:bg-slate-800/50">
                <span>{item.question}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <p className="border-t border-slate-700 px-4 py-3 text-sm text-slate-400">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
`;

const SMOOTH_SCROLL_HERO_SOURCE = `import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';

export function SmoothScrollHero() {
  return (
    <div className="bg-zinc-950">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 text-white bg-zinc-950/80">
        <span className="text-2xl font-bold text-white">Logo</span>
        <a href="#schedule" className="text-xs text-zinc-400 hover:text-white">LAUNCH SCHEDULE</a>
      </nav>
      <div className="relative h-[70vh] min-h-[400px] w-full flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Hero</div>
      </div>
      <section id="schedule" className="mx-auto max-w-5xl px-4 py-48 text-white">
        <motion.h1 initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-20 text-4xl font-black uppercase">Launch Schedule</motion.h1>
        {['NG-21', 'Starlink', 'GOES-U'].map((title, i) => (
          <motion.div key={i} initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
            className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9">
            <div><p className="mb-1.5 text-xl text-zinc-50">{title}</p><p className="text-sm uppercase text-zinc-500">Date</p></div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-500"><p>Location</p><FiMapPin /></div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
`;

function getComponentSource(type: BuilderSection['type']): string {
  switch (type) {
    // Text Animations
    case 'split-text':
      return SPLIT_TEXT_SOURCE;
    case 'blur-text':
      return BLUR_TEXT_SOURCE;
    case 'text-cursor':
      return TEXT_CURSOR_SOURCE;
    // Backgrounds
    case 'silk':
      return SILK_SOURCE;
    case 'floating-lines':
      return FLOATING_LINES_SOURCE;
    case 'light-pillar':
      return LIGHT_PILLAR_SOURCE;
    // Sections
    case 'aurora-hero':
      return AURORA_HERO_SOURCE;
    case 'faq':
      return FAQ_SOURCE;
    case 'smooth-scroll-hero':
      return SMOOTH_SCROLL_HERO_SOURCE;
    default:
      return '';
  }
}

function getComponentFileName(type: BuilderSection['type']): string {
  const map: Record<string, string> = {
    'split-text': 'SplitText',
    'blur-text': 'BlurText',
    'text-cursor': 'TextCursor',
    'silk': 'Silk',
    'floating-lines': 'FloatingLines',
    'light-pillar': 'LightPillar',
    'smooth-scroll-hero': 'SmoothScrollHero',
    'aurora-hero': 'AuroraHero',
    'faq': 'FAQ',
  };
  return map[type] || type;
}

export async function downloadProjectZip(sections: BuilderSection[]): Promise<void> {
  const zip = new JSZip();

  const TS_CONFIG = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`;

  zip.file('package.json', await getPackageJson());
  zip.file('index.html', INDEX_HTML);
  zip.file('vite.config.ts', VITE_CONFIG);
  zip.file('tsconfig.json', TS_CONFIG);
  zip.file('tailwind.config.js', TAILWIND_CONFIG);
  zip.file('postcss.config.js', POSTCSS_CONFIG);
  zip.file('src/main.tsx', MAIN_TSX);
  zip.file('src/index.css', INDEX_CSS);
  zip.file('src/App.tsx', generateAppTsx(sections));

  const componentsDir = zip.folder('src/components');
  if (componentsDir) {
    const typesUsed = [...new Set(sections.map((s) => s.type))];
    for (const type of typesUsed) {
      const fileName = getComponentFileName(type);
      const source = getComponentSource(type);
      if (source) {
        componentsDir.file(`${fileName}.tsx`, source);
      }
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `flex-website-${Date.now()}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
