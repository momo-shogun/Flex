export type ComponentId =
  | 'split-text'
  | 'blur-text'
  | 'text-cursor'
  | 'silk'
  | 'floating-lines'
  | 'light-pillar'
  | 'smooth-scroll-hero'
  | 'aurora-hero'
  | 'faq';

export const SECTION_IDS = ['smooth-scroll-hero', 'aurora-hero', 'faq'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export function isSectionId(id: ComponentId): id is SectionId {
  return SECTION_IDS.includes(id as SectionId);
}

export interface SplitTextProps {
  text: string;
  delay?: number;
  duration?: number;
  animateBy?: 'characters' | 'words';
  className?: string;
}

export interface BlurTextProps {
  text: string;
  delay?: number;
  duration?: number;
  animateBy?: 'characters' | 'words';
  blurAmount?: number;
  className?: string;
}

export interface TextCursorProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: string;
  cursorClassName?: string;
  className?: string;
}

export const DEFAULT_SPLIT_TEXT_PROPS: SplitTextProps = {
  text: 'Hello, you!',
  animateBy: 'characters',
  delay: 0,
  duration: 0.5,
  className: 'text-4xl font-bold text-white',
};

export const DEFAULT_BLUR_TEXT_PROPS: BlurTextProps = {
  text: 'Smooth Blur Effect',
  animateBy: 'characters',
  delay: 0,
  duration: 0.8,
  blurAmount: 10,
  className: 'text-4xl font-bold text-white',
};

export const DEFAULT_TEXT_CURSOR_PROPS: TextCursorProps = {
  text: 'This is a typing animation!',
  speed: 50,
  delay: 0,
  cursor: '|',
  className: 'text-3xl font-mono text-white',
};

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
}

export interface FloatingLinesProps {
  animationSpeed?: number;
  className?: string;
}

export interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  className?: string;
}

export const DEFAULT_SILK_PROPS: SilkProps = {
  speed: 5,
  scale: 1,
  color: '#7B7481',
  noiseIntensity: 1.5,
  rotation: 0,
  className: '',
};

export const DEFAULT_FLOATING_LINES_PROPS: FloatingLinesProps = {
  animationSpeed: 1,
  className: '',
};

export const DEFAULT_LIGHT_PILLAR_PROPS: LightPillarProps = {
  topColor: '#5227FF',
  bottomColor: '#FF9FFC',
  intensity: 1.0,
  rotationSpeed: 0.3,
  className: '',
};

export const BACKGROUND_IDS = ['silk', 'floating-lines', 'light-pillar'] as const;
export type BackgroundId = (typeof BACKGROUND_IDS)[number];

export function isBackgroundId(id: ComponentId): id is BackgroundId {
  return BACKGROUND_IDS.includes(id as BackgroundId);
}
