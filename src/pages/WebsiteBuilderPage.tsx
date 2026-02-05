import { BuilderProvider } from '@/contexts/BuilderContext';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { LayersPanel } from '@/components/builder/LayersPanel';
import { Canvas } from '@/components/builder/Canvas';
import { BuilderTamboBridge } from '@/components/builder/BuilderTamboBridge';
import { BuilderRightPanel } from '@/components/builder/BuilderRightPanel';

export function WebsiteBuilderPage() {
  return (
    <div className="h-full w-full min-h-0 flex flex-col overflow-hidden">
      <BuilderProvider>
        <BuilderTamboBridge />
        <BuilderLayout
          header={<BuilderHeader />}
          leftPanel={<LayersPanel />}
          canvas={<Canvas />}
          rightPanel={<BuilderRightPanel />}
        />
      </BuilderProvider>
    </div>
  );
}
