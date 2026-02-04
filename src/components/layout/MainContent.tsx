import { toast } from 'sonner';
import { InteractableSplitText } from '../react-bits/InteractableSplitText';
import { InteractableBlurText } from '../react-bits/InteractableBlurText';
import { InteractableTextCursor } from '../react-bits/InteractableTextCursor';
import { Silk } from '../react-bits/backgrounds/Silk';
import { FloatingLines } from '../react-bits/backgrounds/FloatingLines';
import { LightPillar } from '../react-bits/backgrounds/LightPillar';
import { SmoothScrollHero } from '../sections/SmoothScrollHero';
import { AuroraHero } from '../sections/AuroraHero';
import { InteractableFAQ, DEFAULT_FAQ_PROPS } from '../sections/InteractableFAQ';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CodeView } from './CodeView';
import type {
  ComponentId,
  SplitTextProps,
  BlurTextProps,
  TextCursorProps,
  SilkProps,
  FloatingLinesProps,
  LightPillarProps,
} from '../../types/components';
import { isBackgroundId, isSectionId } from '../../types/components';

const COMPONENT_TITLES: Record<ComponentId, string> = {
  'split-text': 'Split Text',
  'blur-text': 'Blur Text',
  'text-cursor': 'Text Cursor',
  silk: 'Silk',
  'floating-lines': 'Floating Lines',
  'light-pillar': 'Light Pillar',
  'smooth-scroll-hero': 'Smooth Scroll Hero',
  'aurora-hero': 'Aurora Hero',
  faq: 'FAQ',
};

interface MainContentProps {
  selectedComponent: ComponentId;
  splitTextProps: SplitTextProps;
  blurTextProps: BlurTextProps;
  textCursorProps: TextCursorProps;
  silkProps: SilkProps;
  floatingLinesProps: FloatingLinesProps;
  lightPillarProps: LightPillarProps;
  showDemoContent: boolean;
  onShowDemoContentChange: (value: boolean) => void;
  onRefresh?: () => void;
}

export function MainContent({
  selectedComponent,
  splitTextProps,
  blurTextProps,
  textCursorProps,
  silkProps,
  floatingLinesProps,
  lightPillarProps,
  showDemoContent,
  onShowDemoContentChange,
  onRefresh,
}: MainContentProps) {
  const title = COMPONENT_TITLES[selectedComponent];
  const isBackground = isBackgroundId(selectedComponent);
  const isSection = isSectionId(selectedComponent);

  const renderPreview = () => {
    switch (selectedComponent) {
      case 'split-text':
        return (
          <InteractableSplitText
            key="split-text"
            text={splitTextProps.text}
            delay={splitTextProps.delay}
            duration={splitTextProps.duration}
            animateBy={splitTextProps.animateBy}
            className={splitTextProps.className ?? 'text-4xl font-bold text-white'}
          />
        );
      case 'blur-text':
        return (
          <InteractableBlurText
            key="blur-text"
            text={blurTextProps.text}
            delay={blurTextProps.delay}
            duration={blurTextProps.duration}
            animateBy={blurTextProps.animateBy}
            blurAmount={blurTextProps.blurAmount}
            className={blurTextProps.className ?? 'text-4xl font-bold text-white'}
          />
        );
      case 'text-cursor':
        return (
          <InteractableTextCursor
            key="text-cursor"
            text={textCursorProps.text}
            speed={textCursorProps.speed}
            delay={textCursorProps.delay}
            cursor={textCursorProps.cursor}
            cursorClassName={textCursorProps.cursorClassName}
            className={textCursorProps.className ?? 'text-3xl font-mono text-white'}
          />
        );
      case 'silk':
        return (
          <Silk
            key="silk"
            speed={silkProps.speed}
            scale={silkProps.scale}
            color={silkProps.color}
            noiseIntensity={silkProps.noiseIntensity}
            rotation={silkProps.rotation}
            className={silkProps.className}
          />
        );
      case 'floating-lines':
        return (
          <FloatingLines
            key="floating-lines"
            animationSpeed={floatingLinesProps.animationSpeed}
            className={floatingLinesProps.className}
          />
        );
      case 'light-pillar':
        return (
          <LightPillar
            key="light-pillar"
            topColor={lightPillarProps.topColor}
            bottomColor={lightPillarProps.bottomColor}
            intensity={lightPillarProps.intensity}
            rotationSpeed={lightPillarProps.rotationSpeed}
            className={lightPillarProps.className}
          />
        );
      case 'smooth-scroll-hero':
        return <SmoothScrollHero key="smooth-scroll-hero" />;
      case 'aurora-hero':
        return <AuroraHero key="aurora-hero" />;
      case 'faq':
        return (
          <InteractableFAQ
            key="faq"
            title={DEFAULT_FAQ_PROPS.title}
            items={DEFAULT_FAQ_PROPS.items}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-auto">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="w-fit">
            <TabsTrigger value="preview" className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <span className="font-mono">&lt;/&gt;</span>
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div
              className={`relative rounded-lg border border-slate-700 overflow-hidden ${
                isSection
                  ? 'min-h-[500px] max-h-[75vh] bg-slate-950 flex flex-col'
                  : isBackground
                    ? 'min-h-[280px] bg-slate-950'
                    : 'min-h-[280px] bg-slate-900 flex items-center justify-center p-8'
              }`}
            >
              {onRefresh && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onRefresh}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white"
                  title="Refresh preview"
                  aria-label="Refresh preview"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                </Button>
              )}
              <div
                className={
                  isSection
                    ? 'flex-1 min-h-0 w-full flex flex-col overflow-hidden'
                    : isBackground
                      ? 'absolute inset-0 w-full h-full'
                      : 'flex items-center justify-center w-full'
                }
              >
                {renderPreview()}
              </div>
              {isBackground && !isSection && (
                <>
                  {showDemoContent && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/90 px-3 py-1 text-xs font-medium text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3v18" /><path d="m8 7 4-4 4 4" /><path d="m8 17 4 4 4-4" />
                        </svg>
                        New Background
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-white text-center drop-shadow-lg max-w-xl">
                        {selectedComponent === 'silk' && 'Silk touch is a good enhancement, Steve!'}
                        {selectedComponent === 'floating-lines' && 'Floating lines add motion to your UI'}
                        {selectedComponent === 'light-pillar' && 'Light Pillar brings depth to backgrounds'}
                      </h2>
                      <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
                        <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                          Get Started
                        </Button>
                        <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 flex items-center gap-3 pointer-events-auto">
                    <Label htmlFor="demo-content" className="text-sm text-white cursor-pointer">
                      Demo Content
                    </Label>
                    <Switch
                      id="demo-content"
                      checked={showDemoContent}
                      onCheckedChange={onShowDemoContentChange}
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <CodeView
              selectedComponent={selectedComponent}
              splitTextProps={splitTextProps}
              blurTextProps={blurTextProps}
              textCursorProps={textCursorProps}
              silkProps={silkProps}
              floatingLinesProps={floatingLinesProps}
              lightPillarProps={lightPillarProps}
              onCopy={() => toast('Copied to clipboard')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
