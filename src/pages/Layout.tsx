import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import type {
  ComponentId,
  SplitTextProps,
  BlurTextProps,
  TextCursorProps,
  SilkProps,
  FloatingLinesProps,
  LightPillarProps,
} from '@/types/components';
import {
  DEFAULT_SPLIT_TEXT_PROPS,
  DEFAULT_BLUR_TEXT_PROPS,
  DEFAULT_TEXT_CURSOR_PROPS,
  DEFAULT_SILK_PROPS,
  DEFAULT_FLOATING_LINES_PROPS,
  DEFAULT_LIGHT_PILLAR_PROPS,
} from '@/types/components';

export type PlaygroundContext = {
  selectedComponent: ComponentId;
  setSelectedComponent: (id: ComponentId) => void;
  splitTextProps: SplitTextProps;
  setSplitTextProps: React.Dispatch<React.SetStateAction<SplitTextProps>>;
  blurTextProps: BlurTextProps;
  setBlurTextProps: React.Dispatch<React.SetStateAction<BlurTextProps>>;
  textCursorProps: TextCursorProps;
  setTextCursorProps: React.Dispatch<React.SetStateAction<TextCursorProps>>;
  silkProps: SilkProps;
  setSilkProps: React.Dispatch<React.SetStateAction<SilkProps>>;
  floatingLinesProps: FloatingLinesProps;
  setFloatingLinesProps: React.Dispatch<React.SetStateAction<FloatingLinesProps>>;
  lightPillarProps: LightPillarProps;
  setLightPillarProps: React.Dispatch<React.SetStateAction<LightPillarProps>>;
  previewKey: number;
  handleRefresh: () => void;
  showDemoContent: boolean;
  setShowDemoContent: (value: boolean) => void;
};

export function Layout() {
  const location = useLocation();
  const isWebsiteBuilder = location.pathname === '/tools/website-builder';

  const [selectedComponent, setSelectedComponent] =
    useState<ComponentId>('split-text');
  const [splitTextProps, setSplitTextProps] =
    useState<SplitTextProps>(DEFAULT_SPLIT_TEXT_PROPS);
  const [blurTextProps, setBlurTextProps] =
    useState<BlurTextProps>(DEFAULT_BLUR_TEXT_PROPS);
  const [textCursorProps, setTextCursorProps] =
    useState<TextCursorProps>(DEFAULT_TEXT_CURSOR_PROPS);
  const [silkProps, setSilkProps] = useState<SilkProps>(DEFAULT_SILK_PROPS);
  const [floatingLinesProps, setFloatingLinesProps] =
    useState<FloatingLinesProps>(DEFAULT_FLOATING_LINES_PROPS);
  const [lightPillarProps, setLightPillarProps] =
    useState<LightPillarProps>(DEFAULT_LIGHT_PILLAR_PROPS);
  const [previewKey, setPreviewKey] = useState(0);
  const [showDemoContent, setShowDemoContent] = useState(true);

  const handleRefresh = useCallback(() => {
    setPreviewKey((k) => k + 1);
  }, []);

  const context: PlaygroundContext = {
    selectedComponent,
    setSelectedComponent,
    splitTextProps,
    setSplitTextProps,
    blurTextProps,
    setBlurTextProps,
    textCursorProps,
    setTextCursorProps,
    silkProps,
    setSilkProps,
    floatingLinesProps,
    setFloatingLinesProps,
    lightPillarProps,
    setLightPillarProps,
    previewKey,
    handleRefresh,
    showDemoContent,
    setShowDemoContent,
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      <CommandPalette
        selectedComponent={selectedComponent}
        onSelectComponent={setSelectedComponent}
      />
      <TopBar />
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {!isWebsiteBuilder && (
          <Sidebar
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
          />
        )}
        <main className={isWebsiteBuilder ? 'flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden' : 'flex-1 min-h-0 min-w-0 overflow-auto'} style={{ width: isWebsiteBuilder ? '100%' : undefined }}>
          <Outlet context={context} />
        </main>
      </div>
    </div>
  );
}
