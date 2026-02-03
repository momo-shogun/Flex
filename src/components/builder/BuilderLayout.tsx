import type { ReactNode } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface BuilderLayoutProps {
  leftPanel: ReactNode;
  canvas: ReactNode;
  rightPanel: ReactNode;
  header: ReactNode;
}

export function BuilderLayout({
  leftPanel,
  canvas,
  rightPanel,
  header,
}: BuilderLayoutProps) {
  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-background overflow-hidden">
      <div
        className="h-12 border-b flex-shrink-0 flex items-center"
        style={{
          borderColor: 'hsl(var(--builder-panel-border))',
          backgroundColor: 'hsl(var(--builder-panel-bg))',
        }}
      >
        {header}
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={18} minSize={15} maxSize={30}>
            <div
              className="h-full overflow-hidden flex flex-col border-r"
              style={{
                borderColor: 'hsl(var(--builder-panel-border))',
                backgroundColor: 'hsl(var(--builder-panel-bg))',
              }}
            >
              {leftPanel}
            </div>
          </ResizablePanel>

          <ResizableHandle
            className="w-px transition-colors hover:bg-[hsl(var(--builder-selection))]"
            style={{ backgroundColor: 'hsl(var(--builder-panel-border))' }}
          />

          <ResizablePanel defaultSize={58} minSize={40}>
            <div
              className="h-full overflow-hidden"
              style={{ backgroundColor: 'hsl(var(--builder-canvas-bg))' }}
            >
              {canvas}
            </div>
          </ResizablePanel>

          <ResizableHandle
            className="w-px transition-colors hover:bg-[hsl(var(--builder-selection))]"
            style={{ backgroundColor: 'hsl(var(--builder-panel-border))' }}
          />

          <ResizablePanel defaultSize={24} minSize={20} maxSize={35}>
            <div
              className="h-full overflow-hidden flex flex-col border-l"
              style={{
                borderColor: 'hsl(var(--builder-panel-border))',
                backgroundColor: 'hsl(var(--builder-panel-bg))',
              }}
            >
              {rightPanel}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
