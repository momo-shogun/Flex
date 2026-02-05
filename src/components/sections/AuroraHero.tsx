import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useCallback, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import type { CSSProperties } from 'react';
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from 'framer-motion';
import { cn } from '@/lib/utils';

const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];

export type AuroraElementKey = 'title' | 'subtitle' | 'button';

export interface ElementPosition {
  x: number;
  y: number;
}

interface AuroraHeroProps {
  title?: string;
  subtitle?: string;
  /** When set, render this as the hero title instead of plain title (e.g. Split Text animation). */
  renderTitle?: React.ReactNode;
  /** Padding/margin for the inner content area (builder-editable). */
  innerStyle?: CSSProperties;
  /** Builder: positions for title, subtitle, button (translate in px). */
  elementPositions?: Partial<Record<AuroraElementKey, ElementPosition>>;
  /** Builder: which inner element is selected. */
  selectedElementKey?: AuroraElementKey | null;
  /** Builder: called when user clicks an element. */
  onSelectElement?: (key: AuroraElementKey) => void;
  /** Builder: called when user drags to update position. */
  onUpdateElementPosition?: (key: AuroraElementKey, x: number, y: number) => void;
  /** Builder mode: show selection outline and enable drag. */
  builderMode?: boolean;
}

export function AuroraHero({
  title = 'Decrease your SaaS churn by over 90%',
  subtitle = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae, et, distinctio eum impedit nihil ipsum modi.',
  renderTitle,
  innerStyle,
  elementPositions = {},
  selectedElementKey = null,
  onSelectElement,
  onUpdateElementPosition,
  builderMode = false,
}: AuroraHeroProps) {
  const color = useMotionValue(COLORS_TOP[0]);
  const dragRef = useRef<{ key: AuroraElementKey; startX: number; startY: number; startPos: ElementPosition } | null>(null);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    });
  }, [color]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, key: AuroraElementKey) => {
      if (!builderMode || !onUpdateElementPosition) return;
      e.preventDefault();
      const pos = elementPositions[key] ?? { x: 0, y: 0 };
      dragRef.current = { key, startX: e.clientX, startY: e.clientY, startPos: { ...pos } };
    },
    [builderMode, elementPositions, onUpdateElementPosition]
  );

  useEffect(() => {
    if (!onUpdateElementPosition) return;
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      onUpdateElementPosition(d.key, d.startPos.x + dx, d.startPos.y + dy);
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [onUpdateElementPosition]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  const getPos = (key: AuroraElementKey): CSSProperties => {
    const pos = elementPositions[key] ?? { x: 0, y: 0 };
    return { transform: `translate(${pos.x}px, ${pos.y}px)` };
  };

  const wrap = (key: AuroraElementKey, children: React.ReactNode) => {
    if (!builderMode) return children;
    const isSelected = selectedElementKey === key;
    return (
      <div
        role="button"
        tabIndex={0}
        data-element-key={key}
        className={cn(
          'inline-block transition-shadow rounded',
          builderMode && 'cursor-grab active:cursor-grabbing',
          isSelected && 'ring-2 ring-[hsl(var(--builder-selection))] ring-offset-2 ring-offset-gray-950'
        )}
        style={getPos(key)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectElement?.(key);
        }}
        onMouseDown={(e) => handleMouseDown(e, key)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectElement?.(key);
          }
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center" style={innerStyle}>
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          Beta Now Live!
        </span>
        {wrap(
          'title',
          renderTitle ?? (
            <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
              {title}
            </h1>
          )
        )}
        {wrap(
          'subtitle',
          <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
            {subtitle}
          </p>
        )}
        {wrap(
          'button',
          <motion.button
            type="button"
            style={{
              border,
              boxShadow,
            }}
            whileHover={builderMode ? undefined : { scale: 1.015 }}
            whileTap={builderMode ? undefined : { scale: 0.985 }}
            className={cn(
              'group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50',
              builderMode && 'pointer-events-none'
            )}
          >
            Start free trial
            <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>
        )}
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
}
