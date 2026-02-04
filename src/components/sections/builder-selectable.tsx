import type { CSSProperties, ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import type { ElementPositions } from '@/utils/element-positions';

export function getBuilderElementStyle(
  elementPositions: ElementPositions | undefined,
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

export function BuilderSelectable({
  elementKey,
  selected,
  onPointerDown,
  style,
  className,
  children,
}: {
  elementKey: string;
  selected: boolean;
  onPointerDown?: (elementKey: string, e: ReactPointerEvent<HTMLElement>) => void;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  const isInteractive = typeof onPointerDown === 'function';

  return (
    <div
      data-builder-selectable="true"
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
    >
      {children}
    </div>
  );
}
