import type {
  ComponentId,
  SplitTextProps,
  BlurTextProps,
  TextCursorProps,
  SilkProps,
  FloatingLinesProps,
  LightPillarProps,
} from '../types/components';
const COMPONENT_IMPORT_NAMES: Record<ComponentId, string> = {
  'split-text': 'SplitText',
  'blur-text': 'BlurText',
  'text-cursor': 'TextCursor',
  silk: 'Silk',
  'floating-lines': 'FloatingLines',
  'light-pillar': 'LightPillar',
  'smooth-scroll-hero': 'SmoothScrollHero',
  'aurora-hero': 'AuroraHero',
  faq: 'FAQ',
  'silk-hero-splittext': 'SilkHeroSplitText',
  'aurora-hero-splittext': 'AuroraHeroSplitText',
};

export function getInstallCommand(packageManager: 'pnpm' | 'npm' | 'yarn' | 'bun'): string {
  const deps = 'framer-motion three @react-three/fiber @react-three/drei react-icons';
  switch (packageManager) {
    case 'pnpm':
      return `pnpm add ${deps}`;
    case 'npm':
      return `npm install ${deps}`;
    case 'yarn':
      return `yarn add ${deps}`;
    case 'bun':
      return `bun add ${deps}`;
    default:
      return `pnpm add ${deps}`;
  }
}

export function generateComponentCode(
  componentId: ComponentId,
  splitTextProps: SplitTextProps,
  blurTextProps: BlurTextProps,
  textCursorProps: TextCursorProps,
  silkProps?: SilkProps,
  floatingLinesProps?: FloatingLinesProps,
  lightPillarProps?: LightPillarProps
): string {
  const name = COMPONENT_IMPORT_NAMES[componentId];
  const defaultClassName =
    componentId === 'text-cursor'
      ? 'text-3xl font-mono text-white'
      : 'text-4xl font-bold text-white';
  const cn = (p: string | undefined) => (p && p.trim() ? p : defaultClassName);

  if (componentId === 'silk' && silkProps) {
    const path = './components/react-bits/backgrounds/Silk';
    return `import { Silk } from '${path}';\n\n<div className="relative w-full h-[280px]">\n  <Silk\n    speed={${silkProps.speed ?? 5}}\n    scale={${silkProps.scale ?? 1}}\n    color="${silkProps.color ?? '#7B7481'}"\n    noiseIntensity={${silkProps.noiseIntensity ?? 1.5}}\n    rotation={${silkProps.rotation ?? 0}}\n  />\n</div>`;
  }
  if (componentId === 'floating-lines' && floatingLinesProps) {
    const path = './components/react-bits/backgrounds/FloatingLines';
    return `import { FloatingLines } from '${path}';\n\n<div className="relative w-full h-[280px]">\n  <FloatingLines animationSpeed={${floatingLinesProps.animationSpeed ?? 1}} />\n</div>`;
  }
  if (componentId === 'light-pillar' && lightPillarProps) {
    const path = './components/react-bits/backgrounds/LightPillar';
    return `import { LightPillar } from '${path}';\n\n<div className="relative w-full h-[280px]">\n  <LightPillar\n    topColor="${lightPillarProps.topColor ?? '#5227FF'}"\n    bottomColor="${lightPillarProps.bottomColor ?? '#FF9FFC'}"\n    intensity={${lightPillarProps.intensity ?? 1}}\n    rotationSpeed={${lightPillarProps.rotationSpeed ?? 0.3}}\n  />\n</div>`;
  }

  switch (componentId) {
    case 'split-text':
      return `import { ${name} } from './components/react-bits/text/${name}';\n\n<${name}\n  text="${escapeJsxString(splitTextProps.text)}"\n  animateBy="${splitTextProps.animateBy ?? 'characters'}"\n  delay={${splitTextProps.delay ?? 0}}\n  duration={${splitTextProps.duration ?? 0.5}}\n  className="${cn(splitTextProps.className)}"\n/>`;

    case 'blur-text':
      return `import { ${name} } from './components/react-bits/text/${name}';\n\n<${name}\n  text="${escapeJsxString(blurTextProps.text)}"\n  animateBy="${blurTextProps.animateBy ?? 'characters'}"\n  delay={${blurTextProps.delay ?? 0}}\n  duration={${blurTextProps.duration ?? 0.8}}\n  blurAmount={${blurTextProps.blurAmount ?? 10}}\n  className="${cn(blurTextProps.className)}"\n/>`;

    case 'text-cursor':
      return `import { ${name} } from './components/react-bits/text/${name}';\n\n<${name}\n  text="${escapeJsxString(textCursorProps.text)}"\n  speed={${textCursorProps.speed ?? 50}}\n  delay={${textCursorProps.delay ?? 0}}\n  cursor="${escapeJsxString(textCursorProps.cursor ?? '|')}"\n  className="${cn(textCursorProps.className)}"\n/>`;

    case 'smooth-scroll-hero':
      return `import { SmoothScrollHero } from './components/sections/SmoothScrollHero';\n\n<div className="h-screen overflow-auto">\n  <SmoothScrollHero />\n</div>`;

    case 'aurora-hero':
      return `import { AuroraHero } from './components/sections/AuroraHero';\n\n<AuroraHero />`;

    case 'faq':
      return `import { FAQ } from './components/sections/FAQ';\n\n<FAQ />`;

    default:
      return '';
  }
}

function escapeJsxString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
