import { useEffect, useRef, type CSSProperties } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { cn } from '@/lib/utils';
import {
  parseElementPositions,
  type ElementPosition,
  type ElementPositions,
} from '@/utils/element-positions';
import { SmoothScrollHero } from '@/components/sections/SmoothScrollHero';
import { AuroraHero } from '@/components/sections/AuroraHero';
import { FAQ } from '@/components/sections/FAQ';
import { InteractableSplitText } from '@/components/react-bits/InteractableSplitText';
import { InteractableBlurText } from '@/components/react-bits/InteractableBlurText';
import { InteractableTextCursor } from '@/components/react-bits/InteractableTextCursor';
import { Silk } from '@/components/react-bits/backgrounds/Silk';
import { FloatingLines } from '@/components/react-bits/backgrounds/FloatingLines';
import { LightPillar } from '@/components/react-bits/backgrounds/LightPillar';
import {
  DEFAULT_SPLIT_TEXT_PROPS,
  DEFAULT_BLUR_TEXT_PROPS,
  DEFAULT_TEXT_CURSOR_PROPS,
  DEFAULT_SILK_PROPS,
  DEFAULT_FLOATING_LINES_PROPS,
  DEFAULT_LIGHT_PILLAR_PROPS,
} from '@/types/components';
import type { SplitTextProps, BlurTextProps, TextCursorProps } from '@/types/components';
import type { SilkProps, FloatingLinesProps, LightPillarProps } from '@/types/components';

export function CanvasPreview() {
  const { state, dispatch } = useBuilder();

  const sectionsRef = useRef(state.sections);
  sectionsRef.current = state.sections;

  const dragRef = useRef<{
    sectionId: string;
    elementKey: string;
    pointerId: number;
    target: HTMLElement | null;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const dragMoveListenerRef = useRef<((ev: PointerEvent) => void) | null>(null);
  const dragEndListenerRef = useRef<((ev: PointerEvent) => void) | null>(null);
  const dragRafRef = useRef<number | null>(null);
  const pendingDragUpdateRef = useRef<{
    sectionId: string;
    elementKey: string;
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);

  const handleSectionClick = (id: string) => {
    dispatch({ type: 'SELECT', id });
  };

  const handleSectionHover = (id: string | null) => {
    dispatch({ type: 'HOVER', id });
  };

  const visibleSections = state.sections.filter((s) => s.visible);

  // Keep in sync with the CSS transform scale applied to the canvas content.
  const scale = Math.max(0.25, state.zoom / 100);

  const cleanupDrag = () => {
    const drag = dragRef.current;
    if (drag?.target && typeof drag.target.releasePointerCapture === 'function') {
      try {
        drag.target.releasePointerCapture(drag.pointerId);
      } catch {
        // Ignore release failures (e.g. capture already lost).
      }
    }

    if (dragRafRef.current != null) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    pendingDragUpdateRef.current = null;

    const onMove = dragMoveListenerRef.current;
    const onEnd = dragEndListenerRef.current;

    if (onMove) window.removeEventListener('pointermove', onMove);
    if (onEnd) {
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
    }

    dragMoveListenerRef.current = null;
    dragEndListenerRef.current = null;
    dragRef.current = null;
  };

  useEffect(() => {
    return () => {
      cleanupDrag();
    };
  }, []);

  function getElementPosition(positions: ElementPositions, key: string): ElementPosition {
    return positions[key] ?? { x: 0, y: 0 };
  }

  const handleElementPointerDown = (
    sectionId: string,
    elementKey: string,
    e: React.PointerEvent<HTMLElement>
  ) => {
    if (e.button !== 0) return;
    if (dragRef.current) cleanupDrag();

    const target = e.currentTarget as HTMLElement;
    if (typeof target.setPointerCapture === 'function') {
      target.setPointerCapture(e.pointerId);
    }

    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SELECT_ELEMENT', id: sectionId, elementKey });

    const section = sectionsRef.current.find((s) => s.id === sectionId);
    if (!section) return;
    const sectionProps = section.props as Record<string, unknown>;
    const startPositions = parseElementPositions(sectionProps.elementPositions);
    const start = getElementPosition(startPositions, elementKey);

    dragRef.current = {
      sectionId,
      elementKey,
      pointerId: e.pointerId,
      target,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: start.x,
      startY: start.y,
    };

    const onMove = (ev: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (ev.pointerId !== drag.pointerId) return;

      const latestSection = sectionsRef.current.find(
        (s) => s.id === drag.sectionId && s.visible
      );
      if (!latestSection) {
        cleanupDrag();
        return;
      }

      const dx = (ev.clientX - drag.startClientX) / scale;
      const dy = (ev.clientY - drag.startClientY) / scale;
      const nextX = Math.round(drag.startX + dx);
      const nextY = Math.round(drag.startY + dy);

      pendingDragUpdateRef.current = {
        sectionId: drag.sectionId,
        elementKey: drag.elementKey,
        pointerId: drag.pointerId,
        x: nextX,
        y: nextY,
      };
      if (dragRafRef.current == null) {
        dragRafRef.current = requestAnimationFrame(() => {
          dragRafRef.current = null;
          const pending = pendingDragUpdateRef.current;
          const drag = dragRef.current;
          if (!pending || !drag) return;
          if (pending.pointerId !== drag.pointerId) return;

          const latestSection = sectionsRef.current.find(
            (s) => s.id === pending.sectionId && s.visible
          );
          if (!latestSection) {
            cleanupDrag();
            return;
          }

          const latestProps = latestSection.props as Record<string, unknown>;
          const latestPositions = parseElementPositions(latestProps.elementPositions);

          dispatch({
            type: 'UPDATE_PROPS',
            id: pending.sectionId,
            props: {
              elementPositions: {
                ...latestPositions,
                [pending.elementKey]: { x: pending.x, y: pending.y },
              },
            },
          });
        });
      }
    };

    const endDrag = (ev: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (ev.pointerId !== drag.pointerId) return;
      cleanupDrag();
    };
    dragMoveListenerRef.current = onMove;
    dragEndListenerRef.current = endDrag;

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  };

  function getLayoutStyle(props: Record<string, unknown>): CSSProperties {
    const px = (v: unknown) =>
      typeof v === 'number' && !Number.isNaN(v) ? v : 0;
    return {
      paddingTop: px(props.paddingTop),
      paddingRight: px(props.paddingRight),
      paddingBottom: px(props.paddingBottom),
      paddingLeft: px(props.paddingLeft),
      marginTop: px(props.marginTop),
      marginRight: px(props.marginRight),
      marginBottom: px(props.marginBottom),
      marginLeft: px(props.marginLeft),
    };
  }

  function getInnerLayoutStyle(props: Record<string, unknown>): CSSProperties {
    const px = (v: unknown) =>
      typeof v === 'number' && !Number.isNaN(v) ? v : 0;
    return {
      paddingTop: px(props.innerPaddingTop),
      paddingRight: px(props.innerPaddingRight),
      paddingBottom: px(props.innerPaddingBottom),
      paddingLeft: px(props.innerPaddingLeft),
      marginTop: px(props.innerMarginTop),
      marginRight: px(props.innerMarginRight),
      marginBottom: px(props.innerMarginBottom),
      marginLeft: px(props.innerMarginLeft),
    };
  }

  function getFigmaStyle(props: Record<string, unknown>): CSSProperties {
    const num = (v: unknown, fallback: number): number =>
      v !== undefined && v !== null && typeof v === 'number' && !Number.isNaN(v) ? v : fallback;
    const bool = (v: unknown, fallback: boolean): boolean =>
      typeof v === 'boolean' ? v : fallback;
    const str = (v: unknown, fallback: string): string =>
      v !== undefined && v !== null ? String(v) : fallback;
    const style: CSSProperties = {};
    const x = num(props.positionX, 0);
    const y = num(props.positionY, 0);
    const rot = num(props.rotation, 0);
    const transforms: string[] = [];
    if (x !== 0 || y !== 0) transforms.push(`translate(${x}px, ${y}px)`);
    if (rot !== 0) transforms.push(`rotate(${rot}deg)`);
    if (transforms.length) style.transform = transforms.join(' ');

    const w = num(props.width, 0);
    const h = num(props.height, 0);
    if (bool(props.fillWidth, false)) style.width = '100%';
    else if (w > 0) style.width = w;
    if (bool(props.fillHeight, false)) style.minHeight = '100%';
    else if (h > 0) style.height = h;

    if (bool(props.clipContent, false)) style.overflow = 'hidden';

    const opacityVal = num(props.opacity, 100);
    if (opacityVal < 100) style.opacity = opacityVal / 100;

    const bg = str(props.backgroundColor, '').trim();
    if (bg && bool(props.fillVisible, true)) {
      const fillOp = num(props.fillOpacity, 100) / 100;
      const rgb = hexToRgb(bg);
      style.backgroundColor = rgb && fillOp < 1 ? `rgba(${rgb}, ${fillOp})` : bg;
    }

    const strokeW = num(props.strokeWidth, 0);
    if (strokeW > 0) {
      style.borderWidth = strokeW;
      style.borderStyle = 'solid';
      style.borderColor = str(props.strokeColor, '#000000');
    }

    const justifyContent = str(props.justifyContent, 'flex-start');
    const alignItems = str(props.alignItems, 'flex-start');
    if (justifyContent || alignItems) {
      style.display = 'flex';
      style.flexDirection = 'column';
      style.justifyContent = justifyContent as CSSProperties['justifyContent'];
      style.alignItems = alignItems as CSSProperties['alignItems'];
    }

    return style;
  }

  function hexToRgb(hex: string): string | null {
    const m = hex.replace(/^#/, '').match(/^(..)(..)(..)$/);
    if (!m) return null;
    return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
  }

  if (visibleSections.length === 0) {
    return (
      <div
        className="min-h-[400px] flex items-center justify-center text-sm"
        style={{ color: 'hsl(var(--builder-text-muted))' }}
      >
        <div className="text-center">
          <p className="mb-2">No components added yet</p>
          <p className="text-xs">Add components from the left panel</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 relative"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        if (e.target !== e.currentTarget) return;
        dispatch({ type: 'SELECT', id: null });
      }}
      role="presentation"
    >
      {visibleSections.map((section) => {
        const isSelected = state.selectedId === section.id;
        const isHovered = state.hoveredId === section.id;
        const selectedElementKey = isSelected ? state.selectedElementKey : null;
        const elementPositions = parseElementPositions(
          (section.props as Record<string, unknown>).elementPositions
        );

        return (
          <div
            key={section.id}
            className="relative"
            style={{
              ...getLayoutStyle(section.props as Record<string, unknown>),
              ...getFigmaStyle(section.props as Record<string, unknown>),
            }}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              const target = e.target as HTMLElement | null;
              if (target?.closest('[data-builder-selectable="true"]')) return;
              e.stopPropagation();
              handleSectionClick(section.id);
            }}
            onMouseEnter={() => handleSectionHover(section.id)}
            onMouseLeave={() => handleSectionHover(null)}
          >
            {(isSelected || isHovered) && (
              <div
                className={cn(
                  'absolute inset-0 pointer-events-none z-50 border-2 transition-colors',
                  isSelected
                    ? 'border-[hsl(var(--builder-selection))]'
                    : 'border-[hsl(var(--builder-selection))]/50 border-dashed'
                )}
                style={
                  isSelected
                    ? {
                        backgroundColor: 'hsl(var(--builder-selection) / 0.05)',
                      }
                    : undefined
                }
              >
                <div
                  className={cn(
                    'absolute -top-6 left-2 px-2 py-0.5 text-xs font-medium rounded',
                    isSelected
                      ? 'bg-[hsl(var(--builder-selection))] text-white'
                      : 'bg-[hsl(var(--builder-selection))]/80 text-white'
                  )}
                >
                  {section.label}
                </div>
              </div>
            )}

            {section.type === 'split-text' && (
              <div
                className="min-h-screen flex items-center justify-center"
                style={getInnerLayoutStyle(section.props as Record<string, unknown>)}
              >
                <InteractableSplitText
                  {...{
                    ...DEFAULT_SPLIT_TEXT_PROPS,
                    ...(section.props as Partial<SplitTextProps>),
                  }}
                />
              </div>
            )}
            {section.type === 'blur-text' && (
              <div
                className="min-h-screen flex items-center justify-center"
                style={getInnerLayoutStyle(section.props as Record<string, unknown>)}
              >
                <InteractableBlurText
                  {...{
                    ...DEFAULT_BLUR_TEXT_PROPS,
                    ...(section.props as Partial<BlurTextProps>),
                  }}
                />
              </div>
            )}
            {section.type === 'text-cursor' && (
              <div
                className="min-h-screen flex items-center justify-center"
                style={getInnerLayoutStyle(section.props as Record<string, unknown>)}
              >
                <InteractableTextCursor
                  {...{
                    ...DEFAULT_TEXT_CURSOR_PROPS,
                    ...(section.props as Partial<TextCursorProps>),
                  }}
                />
              </div>
            )}
            {section.type === 'silk' && (
              <div className="relative min-h-screen">
                <Silk
                  {...{
                    ...DEFAULT_SILK_PROPS,
                    ...(section.props as Partial<SilkProps>),
                  }}
                />
                <div className="relative z-10 flex items-center justify-center h-screen">
                  <h2 className="text-4xl font-bold text-white">Silk Background</h2>
                </div>
              </div>
            )}
            {section.type === 'floating-lines' && (
              <div className="relative min-h-screen">
                <FloatingLines
                  {...{
                    ...DEFAULT_FLOATING_LINES_PROPS,
                    ...(section.props as Partial<FloatingLinesProps>),
                  }}
                />
                <div className="relative z-10 flex items-center justify-center h-screen">
                  <h2 className="text-4xl font-bold text-white">Floating Lines</h2>
                </div>
              </div>
            )}
            {section.type === 'light-pillar' && (
              <div className="relative min-h-screen">
                <LightPillar
                  {...{
                    ...DEFAULT_LIGHT_PILLAR_PROPS,
                    ...(section.props as Partial<LightPillarProps>),
                  }}
                />
                <div className="relative z-10 flex items-center justify-center h-screen">
                  <h2 className="text-4xl font-bold text-white">Light Pillar</h2>
                </div>
              </div>
            )}
            {section.type === 'smooth-scroll-hero' && (
              <SmoothScrollHero />
            )}
            {section.type === 'aurora-hero' && (
              <AuroraHero
                title={section.props?.title != null && section.props.title !== '' ? String(section.props.title) : undefined}
                subtitle={section.props?.subtitle != null && section.props.subtitle !== '' ? String(section.props.subtitle) : undefined}
                innerStyle={getInnerLayoutStyle(section.props as Record<string, unknown>)}
                elementPositions={elementPositions}
                selectedElementKey={selectedElementKey}
                onElementPointerDown={(elementKey, e) =>
                  handleElementPointerDown(section.id, elementKey, e)
                }
              />
            )}
            {section.type === 'faq' && (
              <FAQ
                title={section.props?.title != null && section.props.title !== '' ? String(section.props.title) : undefined}
                innerStyle={getInnerLayoutStyle(section.props as Record<string, unknown>)}
                elementPositions={elementPositions}
                selectedElementKey={selectedElementKey}
                onElementPointerDown={(elementKey, e) =>
                  handleElementPointerDown(section.id, elementKey, e)
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
