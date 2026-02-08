import { useEffect, useState } from 'react';
import { useTambo } from '@tambo-ai/react';
import { useBuilderActionsRef } from '@/contexts/BuilderActionsRefContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeViewer } from './components/CodeViewer';
import { ExportOptions } from './components/ExportOptions';
import { DeployPanel } from './components/DeployPanel';
import { createExportCenterTools } from './tools/export-tools';

export default function ExportCenterPage() {
  const [exportedFiles, setExportedFiles] = useState<Map<string, string>>(new Map());
  const [exportConfig, setExportConfig] = useState({
    framework: 'nextjs' as const,
    typescript: true,
    styling: 'tailwind',
  });
  const { registerTools } = useTambo();
  const builderRef = useBuilderActionsRef();

  useEffect(() => {
    const ref = builderRef ?? { current: null };
    const tools = createExportCenterTools(ref);
    registerTools(tools);
  }, [registerTools, builderRef]);

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="border-b border-slate-800 p-4">
        <h1 className="text-xl font-bold text-slate-100">Export Center</h1>
        <p className="text-slate-500 text-sm mt-1">
          Generate production-ready code from your website
        </p>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-slate-800 bg-slate-900/50 p-4 overflow-y-auto">
          <ExportOptions config={exportConfig} onChange={setExportConfig} />
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full shrink-0 rounded-none border-b border-slate-800 bg-slate-900/50">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="flex-1 overflow-auto mt-0">
              <CodeViewer files={exportedFiles} />
            </TabsContent>
            <TabsContent value="files" className="flex-1 overflow-auto mt-0 p-4 text-slate-500 text-sm">
              File tree – use Preview or generate code first.
            </TabsContent>
            <TabsContent value="deploy" className="flex-1 overflow-auto mt-0">
              <DeployPanel files={exportedFiles} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
