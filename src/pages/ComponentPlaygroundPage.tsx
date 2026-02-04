import { useOutletContext } from 'react-router-dom';
import { MainContent } from '@/components/layout/MainContent';
import { CustomizePanel } from '@/components/layout/CustomizePanel';
import { TamboModePanel } from '@/components/layout/TamboModePanel';
import type { PlaygroundContext } from './Layout';

export function ComponentPlaygroundPage() {
  const ctx = useOutletContext<PlaygroundContext>();

  return (
    <div className="flex flex-1 min-h-0 w-full overflow-hidden h-full">
      <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
        <MainContent
          key={ctx.previewKey}
          selectedComponent={ctx.selectedComponent}
          splitTextProps={ctx.splitTextProps}
          blurTextProps={ctx.blurTextProps}
          textCursorProps={ctx.textCursorProps}
          silkProps={ctx.silkProps}
          floatingLinesProps={ctx.floatingLinesProps}
          lightPillarProps={ctx.lightPillarProps}
          showDemoContent={ctx.showDemoContent}
          onShowDemoContentChange={ctx.setShowDemoContent}
          onRefresh={ctx.handleRefresh}
        />
      </div>
      {ctx.isTamboMode ? (
        <TamboModePanel />
      ) : (
        <CustomizePanel
          selectedComponent={ctx.selectedComponent}
          splitTextProps={ctx.splitTextProps}
          blurTextProps={ctx.blurTextProps}
          textCursorProps={ctx.textCursorProps}
          silkProps={ctx.silkProps}
          floatingLinesProps={ctx.floatingLinesProps}
          lightPillarProps={ctx.lightPillarProps}
          onSplitTextPropsChange={(updates) =>
            ctx.setSplitTextProps((prev) => ({ ...prev, ...updates }))
          }
          onBlurTextPropsChange={(updates) =>
            ctx.setBlurTextProps((prev) => ({ ...prev, ...updates }))
          }
          onTextCursorPropsChange={(updates) =>
            ctx.setTextCursorProps((prev) => ({ ...prev, ...updates }))
          }
          onSilkPropsChange={(updates) =>
            ctx.setSilkProps((prev) => ({ ...prev, ...updates }))
          }
          onFloatingLinesPropsChange={(updates) =>
            ctx.setFloatingLinesProps((prev) => ({ ...prev, ...updates }))
          }
          onLightPillarPropsChange={(updates) =>
            ctx.setLightPillarProps((prev) => ({ ...prev, ...updates }))
          }
        />
      )}
    </div>
  );
}
