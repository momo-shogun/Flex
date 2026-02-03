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
              <div className="min-h-screen flex items-center justify-center p-8">
                <InteractableSplitText
                  {...{
                    ...DEFAULT_SPLIT_TEXT_PROPS,
                    ...(section.props as Partial<SplitTextProps>),
                  }}
                />
              </div>
            )}
            {section.type === 'blur-text' && (
              <div className="min-h-screen flex items-center justify-center p-8">
                <InteractableBlurText
                  {...{
                    ...DEFAULT_BLUR_TEXT_PROPS,
                    ...(section.props as Partial<BlurTextProps>),
                  }}
                />
              </div>
            )}
            {section.type === 'text-cursor' && (
              <div className="min-h-screen flex items-center justify-center p-8">
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
            {section.type === 'aurora-hero' && <AuroraHero />}
            {section.type === 'faq' && <FAQ />}
          </div>
        );
      })}
    </div>
  );
}
