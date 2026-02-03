import { SmoothScrollHero } from '@/components/sections/SmoothScrollHero';
import { AuroraHero } from '@/components/sections/AuroraHero';
import { FAQ } from '@/components/sections/FAQ';
import { InteractableSplitText } from '@/components/react-bits/InteractableSplitText';
import { InteractableBlurText } from '@/components/react-bits/InteractableBlurText';
import { InteractableTextCursor } from '@/components/react-bits/InteractableTextCursor';
import { Silk } from '@/components/react-bits/backgrounds/Silk';
import { FloatingLines } from '@/components/react-bits/backgrounds/FloatingLines';
import { LightPillar } from '@/components/react-bits/backgrounds/LightPillar';
import type { BuilderSection } from '@/types/website-builder';
import {
  DEFAULT_SPLIT_TEXT_PROPS,
  DEFAULT_BLUR_TEXT_PROPS,
  DEFAULT_TEXT_CURSOR_PROPS,
  DEFAULT_SILK_PROPS,
  DEFAULT_FLOATING_LINES_PROPS,
  DEFAULT_LIGHT_PILLAR_PROPS,
} from '@/types/components';

interface PagePreviewProps {
  sections: BuilderSection[];
}

export function PagePreview({ sections }: PagePreviewProps) {
  if (sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        <div className="text-center">
          <p className="mb-2">No components added yet</p>
          <p className="text-xs text-slate-600">
            Select components from the left panel to start building
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="min-h-full w-full">
        {sections.map((section) => {
          switch (section.type) {
            // Text Animations
            case 'split-text':
              return (
                <div key={section.id} className="min-h-screen flex items-center justify-center p-8">
                  <InteractableSplitText {...DEFAULT_SPLIT_TEXT_PROPS} />
                </div>
              );
            case 'blur-text':
              return (
                <div key={section.id} className="min-h-screen flex items-center justify-center p-8">
                  <InteractableBlurText {...DEFAULT_BLUR_TEXT_PROPS} />
                </div>
              );
            case 'text-cursor':
              return (
                <div key={section.id} className="min-h-screen flex items-center justify-center p-8">
                  <InteractableTextCursor {...DEFAULT_TEXT_CURSOR_PROPS} />
                </div>
              );
            // Backgrounds
            case 'silk':
              return (
                <div key={section.id} className="relative min-h-screen">
                  <Silk {...DEFAULT_SILK_PROPS} />
                  <div className="relative z-10 flex items-center justify-center h-screen">
                    <h2 className="text-4xl font-bold text-white">Silk Background</h2>
                  </div>
                </div>
              );
            case 'floating-lines':
              return (
                <div key={section.id} className="relative min-h-screen">
                  <FloatingLines {...DEFAULT_FLOATING_LINES_PROPS} />
                  <div className="relative z-10 flex items-center justify-center h-screen">
                    <h2 className="text-4xl font-bold text-white">Floating Lines</h2>
                  </div>
                </div>
              );
            case 'light-pillar':
              return (
                <div key={section.id} className="relative min-h-screen">
                  <LightPillar {...DEFAULT_LIGHT_PILLAR_PROPS} />
                  <div className="relative z-10 flex items-center justify-center h-screen">
                    <h2 className="text-4xl font-bold text-white">Light Pillar</h2>
                  </div>
                </div>
              );
            // Sections
            case 'smooth-scroll-hero':
              return <SmoothScrollHero key={section.id} />;
            case 'aurora-hero':
              return <AuroraHero key={section.id} />;
            case 'faq':
              return <FAQ key={section.id} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
