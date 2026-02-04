import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from 'framer-motion';

const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];

interface AuroraHeroProps {
  title?: string;
  subtitle?: string;
  /** Padding/margin for the inner content area (builder-editable). */
  innerStyle?: CSSProperties;
  /** Optional offsets for specific inner elements (builder-exported). */
  elementPositions?: Record<string, { x: number; y: number } | undefined>;

  /** Builder-only: which inner element is currently selected. */
  selectedElementKey?: string | null;
  /** Builder-only: pointer handler used to select/drag an inner element. */
  onElementPointerDown?: (
    elementKey: string,
    e: React.PointerEvent<HTMLElement>
  ) => void;
}

function getElementStyle(
  elementPositions: AuroraHeroProps['elementPositions'] | undefined,
  elementKey: string
): CSSProperties | undefined {
  const pos = elementPositions?.[elementKey];
  if (!pos) return undefined;
  const x = typeof pos.x === 'number' && !Number.isNaN(pos.x) ? pos.x : 0;
  const y = typeof pos.y === 'number' && !Number.isNaN(pos.y) ? pos.y : 0;
  if (x === 0 && y === 0) return undefined;
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
}

function BuilderSelectable({
  elementKey,
  selected,
  onPointerDown,
  style,
  className,
  children,
}: {
  elementKey: string;
  selected: boolean;
  onPointerDown?: (elementKey: string, e: React.PointerEvent<HTMLElement>) => void;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  const isInteractive = typeof onPointerDown === 'function';
  return (
    <div
      className={className}
      style={{
        ...style,
        ...(selected
          ? {
              outline: '2px solid hsl(var(--builder-selection))',
              outlineOffset: 6,
            }
          : undefined),
        ...(isInteractive
          ? {
              cursor: 'grab',
              touchAction: 'none',
              userSelect: 'none',
            }
          : undefined),
      }}
      onPointerDown={isInteractive ? (e) => onPointerDown(elementKey, e) : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function AuroraHero({
  title = 'Decrease your SaaS churn by over 90%',
  subtitle = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae, et, distinctio eum impedit nihil ipsum modi.',
  innerStyle,
  elementPositions,
  selectedElementKey,
  onElementPointerDown,
}: AuroraHeroProps) {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    });
  }, [color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center" style={innerStyle}>
        <BuilderSelectable
          elementKey="badge"
          selected={selectedElementKey === 'badge'}
          onPointerDown={onElementPointerDown}
          style={getElementStyle(elementPositions, 'badge')}
          className="w-fit"
        >
          <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
            Beta Now Live!
          </span>
        </BuilderSelectable>

        <BuilderSelectable
          elementKey="title"
          selected={selectedElementKey === 'title'}
          onPointerDown={onElementPointerDown}
          style={getElementStyle(elementPositions, 'title')}
        >
          <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
            {title}
          </h1>
        </BuilderSelectable>

        <BuilderSelectable
          elementKey="subtitle"
          selected={selectedElementKey === 'subtitle'}
          onPointerDown={onElementPointerDown}
          style={getElementStyle(elementPositions, 'subtitle')}
        >
          <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
            {subtitle}
          </p>
        </BuilderSelectable>

        <BuilderSelectable
          elementKey="button"
          selected={selectedElementKey === 'button'}
          onPointerDown={onElementPointerDown}
          style={getElementStyle(elementPositions, 'button')}
          className="w-fit"
        >
          <motion.button
            type="button"
            style={{
              border,
              boxShadow,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            Start free trial
            <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>
        </BuilderSelectable>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
}
