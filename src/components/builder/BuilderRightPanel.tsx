import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InspectorPanel } from '@/components/builder/InspectorPanel';
import { BuilderTamboChat } from '@/components/builder/BuilderTamboChat';
import { Settings2, MessageSquare } from 'lucide-react';

const tabTriggerStyle = { color: 'hsl(var(--builder-text-muted))' };
const tabsListStyle = { borderColor: 'hsl(var(--builder-panel-border))' };

export function BuilderRightPanel() {
  const [activeTab, setActiveTab] = useState<'inspector' | 'chat'>('inspector');

  return (
    <div className="flex flex-col h-full min-h-0">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'inspector' | 'chat')}
        className="flex flex-col h-full min-h-0"
      >
        <TabsList
          className="w-full justify-start rounded-none border-b shrink-0 h-9 bg-transparent p-0 gap-0"
          style={tabsListStyle}
        >
          <TabsTrigger
            value="inspector"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--builder-selection))] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-xs"
            style={tabTriggerStyle}
          >
            <Settings2 className="h-3.5 w-3.5 mr-1.5 inline" />
            Inspector
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--builder-selection))] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-xs"
            style={tabTriggerStyle}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5 inline" />
            AI Chat
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inspector" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <InspectorPanel />
        </TabsContent>
        <TabsContent value="chat" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <BuilderTamboChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
