import { BuilderProvider } from '@/contexts/BuilderContext';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { LayersPanel } from '@/components/builder/LayersPanel';
import { Canvas } from '@/components/builder/Canvas';
import { BuilderTamboBridge } from '@/components/builder/BuilderTamboBridge';
import { BuilderRightPanel } from '@/components/builder/BuilderRightPanel';
import { TamboContextHelpersProvider } from '@tambo-ai/react';

export function WebsiteBuilderPage() {
  return (
    <div className="h-full w-full min-h-0 flex flex-col overflow-hidden">
      <BuilderProvider>
        <TamboContextHelpersProvider
          contextHelpers={{
            // Expose current selection + props while builder page is mounted
            builderSelection: async () => {
              // The global helper already exposes overall state; this helper
              // gives Tambo richer details for the currently selected section.
              // We rely on the builder state bridge, which is kept up to date
              // by BuilderProvider.
              const { getBuilderStateForTambo } = await import('@/lib/tambo-builder-context');
              const state = getBuilderStateForTambo();
              if (!state?.selectedId) return null;
              // NOTE: full props are already available to tools; here we just
              // expose selection identity/context for language guidance.
              return {
                selectedSectionId: state.selectedId,
              };
            },
          }}
        >
          <BuilderTamboBridge />
          <BuilderLayout
            header={<BuilderHeader />}
            leftPanel={<LayersPanel />}
            canvas={<Canvas />}
            rightPanel={<BuilderRightPanel />}
          />
        </TamboContextHelpersProvider>
      </BuilderProvider>
    </div>
  );
}
