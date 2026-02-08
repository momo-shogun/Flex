import { useEffect, useState } from 'react';
import { useTambo } from '@tambo-ai/react';
import { useBuilderActionsRef } from '@/contexts/BuilderActionsRefContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentPreview } from './components/ComponentPreview';
import { PropsEditor } from './components/PropsEditor';
import { ComponentLibrary } from './components/ComponentLibrary';
import { LabChat } from './components/LabChat';
import { createComponentLabTools } from './tools/component-tools';

export default function ComponentLabPage() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [currentProps, setCurrentProps] = useState<Record<string, unknown>>({});
  const { registerTools } = useTambo();
  const builderRef = useBuilderActionsRef();

  useEffect(() => {
    const ref = builderRef ?? { current: null };
    const tools = createComponentLabTools(ref);
    registerTools(tools);
  }, [registerTools, builderRef]);

  return (
    <div className="h-full flex bg-slate-950">
      <div className="w-64 border-r border-slate-800 bg-slate-900/50 overflow-y-auto">
        <ComponentLibrary
          onSelect={setSelectedComponent}
          selected={selectedComponent}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 bg-slate-900/30 overflow-auto">
          <ComponentPreview
            componentId={selectedComponent}
            props={currentProps}
          />
        </div>
        <div className="h-72 border-t border-slate-800 flex flex-col">
          <Tabs defaultValue="props" className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full shrink-0 rounded-none border-b border-slate-800 bg-slate-900/50">
              <TabsTrigger value="props">Props</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="props" className="flex-1 overflow-auto mt-0">
              <PropsEditor
                componentId={selectedComponent}
                props={currentProps}
                onChange={setCurrentProps}
              />
            </TabsContent>
            <TabsContent value="variants" className="flex-1 overflow-auto mt-0 p-4 text-slate-500 text-sm">
              Use the chat to list or create variants.
            </TabsContent>
            <TabsContent value="code" className="flex-1 overflow-auto mt-0 p-4 text-slate-500 text-sm">
              Code preview (export from builder).
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="w-96 border-l border-slate-800 flex flex-col shrink-0">
        <LabChat />
      </div>
    </div>
  );
}
