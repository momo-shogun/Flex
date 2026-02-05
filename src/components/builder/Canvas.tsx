import { useRef } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { CanvasPreview } from '@/components/builder/CanvasPreview';
import { cn } from '@/lib/utils';

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
} as const;

export function Canvas() {
  const { state } = useBuilder();
  const containerRef = useRef<HTMLDivElement>(null);

  const scale = state.zoom / 100;
  const width = deviceWidths[state.device];

  return (
    <div
      ref={containerRef}
      className={cn(
        'h-full w-full min-h-0 overflow-auto flex justify-center items-start',
        state.device === 'desktop' ? 'py-6' : 'p-6'
      )}
    >
      <div
        className={cn(
          'rounded-lg shadow-xl overflow-hidden transition-all duration-300 flex-shrink-0',
          state.device !== 'desktop' && 'border',
          state.device !== 'desktop' && 'border-slate-700'
        )}
        style={{
          width,
          maxWidth: state.device === 'desktop' ? '100%' : width,
          minWidth: state.device === 'desktop' ? '100%' : undefined,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          backgroundColor: 'hsl(var(--builder-canvas-bg))',
        }}
      >
        {state.device !== 'desktop' && (
          <div
            className="h-6 flex items-center justify-center gap-1"
            style={{ backgroundColor: 'hsl(var(--builder-panel-border))' }}
          >
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: 'hsl(var(--builder-text-muted))' }}
            />
          </div>
        )}

        <CanvasPreview />
      </div>
    </div>
  );
}
