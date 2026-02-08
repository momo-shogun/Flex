import { useEffect, useState } from 'react';
import { useTambo } from '@tambo-ai/react';
import { useBuilderActionsRef } from '@/contexts/BuilderActionsRefContext';
import { TemplateEditor } from './components/TemplateEditor';
import { TemplateGallery } from './components/TemplateGallery';
import { TemplatePreview } from './components/TemplatePreview';
import { createTemplateStudioTools } from './tools/template-tools';

export default function TemplateStudioPage() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const { registerTools } = useTambo();
  const builderRef = useBuilderActionsRef();

  useEffect(() => {
    const ref = builderRef ?? { current: null };
    const tools = createTemplateStudioTools(ref);
    registerTools(tools);
  }, [registerTools, builderRef]);

  return (
    <div className="h-full flex bg-slate-950">
      <div className="w-80 border-r border-slate-800 bg-slate-900/50 overflow-y-auto">
        <TemplateGallery selected={activeTemplate} onSelect={setActiveTemplate} />
      </div>
      <div className="flex-1 overflow-auto">
        {activeTemplate ? (
          <TemplateEditor templateId={activeTemplate} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Select a template or create a new one
          </div>
        )}
      </div>
      <div className="w-96 border-l border-slate-800">
        {activeTemplate && <TemplatePreview templateId={activeTemplate} />}
      </div>
    </div>
  );
}
