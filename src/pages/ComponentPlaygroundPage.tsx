import { useOutletContext } from 'react-router-dom';
import { MainContent } from '@/components/layout/MainContent';
import { CustomizePanel } from '@/components/layout/CustomizePanel';
import type { PlaygroundContext } from './Layout';

export function ComponentPlaygroundPage() {
  const ctx = useOutletContext<PlaygroundContext>();

  return (
    <>
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
    </>
  );
}
