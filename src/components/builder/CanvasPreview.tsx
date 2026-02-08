import type { CSSProperties } from 'react';
import { useEffect } from 'react';
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
import { componentRegistry } from '@/lib/component-generator/registry';

/** Interactable components accept id for Tambo; types may not expose it. */
type InteractableSplitTextProps = SplitTextProps & { id: string };
type InteractableBlurTextProps = BlurTextProps & { id: string };
type InteractableTextCursorProps = TextCursorProps & { id: string };

export function CanvasPreview() {
  const { state, dispatch } = useBuilder();

  const handleSectionClick = (id: string) => {
    dispatch({ type: 'SELECT', id });
  };

  const handleSectionHover = (id: string | null) => {
    dispatch({ type: 'HOVER', id });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.selectedElementKey != null && state.selectedId) {
        dispatch({ type: 'SELECT', id: state.selectedId });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, state.selectedId, state.selectedElementKey]);

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
    <div className="min-h-screen w-full bg-slate-950 relative">
      {visibleSections.map((section) => {
        const isSelected = state.selectedId === section.id;
        const isHovered = state.hoveredId === section.id;

        return (
          <div
            key={section.id}
            className="relative w-full"
            style={{
              ...getLayoutStyle(section.props as Record<string, unknown>),
              ...getFigmaStyle(section.props as Record<string, unknown>),
              width: '100%',
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

            {typeof section.type === 'string' &&
              section.type.startsWith('gen-') &&
              (() => {
                const def = componentRegistry.getComponent(section.type);
                if (!def) {
                  return (
                    <div className="min-h-[200px] flex items-center justify-center bg-slate-800/50 text-slate-400 rounded-lg">
                      Unknown generated component
                    </div>
                  );
                }
                const Comp = def.component;
                return (
                  <div className="min-h-[200px] w-full flex items-center justify-center p-4">
                    <Comp {...(section.props as Record<string, unknown>)} />
                  </div>
                );
              })()}

            {section.type === 'split-text' && (
              <div
                className="min-h-screen flex items-center justify-center"
                style={getInnerLayoutStyle(section.props as Record<string, unknown>)}
              >
                <InteractableSplitText
                  {...{
                    ...DEFAULT_SPLIT_TEXT_PROPS,
                    ...(section.props as Partial<SplitTextProps>),
                    id: section.id,
                  } as InteractableSplitTextProps}
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
                    id: section.id,
                  } as InteractableBlurTextProps}
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
                    id: section.id,
                  } as InteractableTextCursorProps}
                />
              </div>
            )}
            {section.type === 'silk' && (
              <div className="relative min-h-screen w-full">
                <Silk
                  {...{
                    ...DEFAULT_SILK_PROPS,
                    ...(section.props as Partial<SilkProps>),
                  }}
                />
                <div className="relative z-10 flex flex-col items-center justify-center h-screen gap-4 px-4">
                  {section.props?.text != null && String(section.props.text).trim() !== '' ? (
                    <InteractableSplitText
                      {...{
                        ...DEFAULT_SPLIT_TEXT_PROPS,
                        ...(section.props as Partial<SplitTextProps>),
                        id: section.id,
                      } as InteractableSplitTextProps}
                    />
                  ) : (
                    <h2 className="text-4xl font-bold text-white">
                      {section.props?.title != null && String(section.props.title).trim() !== ''
                        ? String(section.props.title)
                        : 'Silk Background'}
                    </h2>
                  )}
                  {section.props?.subtitle != null && String(section.props.subtitle).trim() !== '' && (
                    <p className="max-w-2xl text-center text-base text-slate-200/90">
                      {String(section.props.subtitle)}
                    </p>
                  )}
                </div>
              </div>
            )}
            {section.type === 'silk-hero-splittext' && (
              <div className="relative min-h-screen w-full">
                <Silk
                  {...{
                    ...DEFAULT_SILK_PROPS,
                    ...(section.props as Partial<SilkProps>),
                  }}
                />
                <div
                  className="relative z-10 flex flex-col items-center justify-center h-screen gap-4"
                  style={getInnerLayoutStyle(section.props as Record<string, unknown>)}
                >
                  <InteractableSplitText
                    {...{
                      ...DEFAULT_SPLIT_TEXT_PROPS,
                      ...(section.props as Partial<SplitTextProps>),
                      id: section.id,
                    } as InteractableSplitTextProps}
                  />
                  {section.props?.subtitle != null && String(section.props.subtitle).trim() !== '' && (
                    <p className="max-w-2xl text-center text-base text-slate-200/90">
                      {String(section.props.subtitle)}
                    </p>
                  )}
                </div>
              </div>
            )}
            {section.type === 'floating-lines' && (
              <div className="relative min-h-screen w-full">
                <FloatingLines
                  {...{
                    ...DEFAULT_FLOATING_LINES_PROPS,
                    ...(section.props as Partial<FloatingLinesProps>),
                  }}
                />
                <div className="relative z-10 flex items-center justify-center h-screen">
                  <h2 className="text-4xl font-bold text-white">
                    {section.props?.title != null && String(section.props.title).trim() !== ''
                      ? String(section.props.title)
                      : 'Floating Lines'}
                  </h2>
                </div>
              </div>
            )}
            {section.type === 'light-pillar' && (
              <div className="relative min-h-screen w-full">
                <LightPillar
                  {...{
                    ...DEFAULT_LIGHT_PILLAR_PROPS,
                    ...(section.props as Partial<LightPillarProps>),
                  }}
                />
                <div className="relative z-10 flex items-center justify-center h-screen">
                  <h2 className="text-4xl font-bold text-white">
                    {section.props?.title != null && String(section.props.title).trim() !== ''
                      ? String(section.props.title)
                      : 'Light Pillar'}
                  </h2>
                </div>
              </div>
            )}
            {section.type === 'smooth-scroll-hero' && (
              <div className="relative w-full">
                <SmoothScrollHero />
                {(section.props?.text != null || section.props?.subtitle != null) && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
                    <div className="pointer-events-auto max-w-3xl text-center space-y-3">
                      {section.props?.text != null && String(section.props.text).trim() !== '' && (
                        <InteractableSplitText
                          {...{
                            ...DEFAULT_SPLIT_TEXT_PROPS,
                            ...(section.props as Partial<SplitTextProps>),
                            id: section.id,
                          } as InteractableSplitTextProps}
                        />
                      )}
                      {section.props?.subtitle != null && String(section.props.subtitle).trim() !== '' && (
                        <p className="text-base text-slate-100/90">
                          {String(section.props.subtitle)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {section.type === 'aurora-hero' && (
              <AuroraHero
                title={section.props?.title != null && section.props.title !== '' ? String(section.props.title) : undefined}
                subtitle={section.props?.subtitle != null && section.props.subtitle !== '' ? String(section.props.subtitle) : undefined}
                innerStyle={getInnerLayoutStyle(section.props as Record<string, unknown>)}
              />
            )}
            {section.type === 'aurora-hero-splittext' && (
              <AuroraHero
                subtitle={section.props?.subtitle != null && section.props.subtitle !== '' ? String(section.props.subtitle) : undefined}
                renderTitle={
                  <InteractableSplitText
                    {...{
                      ...DEFAULT_SPLIT_TEXT_PROPS,
                      ...(section.props as Partial<SplitTextProps>),
                      className:
                        (section.props?.className as string) ||
                        'max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight',
                      id: section.id,
                    } as InteractableSplitTextProps}
                  />
                }
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
