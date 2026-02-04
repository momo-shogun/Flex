import type { CSSProperties } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { cn } from '@/lib/utils';
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

  const handleSectionClick = (id: string) => {
    dispatch({ type: 'SELECT', id });
  };

  const handleSectionHover = (id: string | null) => {
    dispatch({ type: 'HOVER', id });
  };

  const visibleSections = state.sections.filter((s) => s.visible);

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
    <div className="min-h-screen bg-slate-950 relative">
      {visibleSections.map((section) => {
        const isSelected = state.selectedId === section.id;
        const isHovered = state.hoveredId === section.id;

        return (
          <div
            key={section.id}
            className="relative"
            style={{
              ...getLayoutStyle(section.props as Record<string, unknown>),
              ...getFigmaStyle(section.props as Record<string, unknown>),
            }}
            onClick={(e) => {
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
              />
            )}
            {section.type === 'faq' && (
              <FAQ
                title={section.props?.title != null && section.props.title !== '' ? String(section.props.title) : undefined}
                innerStyle={getInnerLayoutStyle(section.props as Record<string, unknown>)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
