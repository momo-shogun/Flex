import { BuilderProvider } from '@/contexts/BuilderContext';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { LayersPanel } from '@/components/builder/LayersPanel';
import { InspectorPanel } from '@/components/builder/InspectorPanel';
import { Canvas } from '@/components/builder/Canvas';

export function WebsiteBuilderPage() {
  return (
    <div className="h-full w-full min-h-0 flex flex-col overflow-hidden">
      <BuilderProvider>
        <BuilderLayout
          header={<BuilderHeader />}
          leftPanel={<LayersPanel />}
          canvas={<Canvas />}
          rightPanel={<InspectorPanel />}
        />
      </BuilderProvider>
    </div>
  );
}
