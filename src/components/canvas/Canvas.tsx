import React from 'react';
import InteractableButton from '@/components/design-system/InteractableButton';
import { useDesignSystemStore } from '@/store/design-system-store';

export function Canvas() {
  const selectedId = useDesignSystemStore((s) => s.selectedId);

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Design canvas
        </h1>
        <p className="text-slate-600 text-sm">
          Click a component to select it, then use the chat to change it (e.g. “make it accessible”, “round corners”).
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <InteractableButton
            id="btn-1"
            type="Button"
            metadata={{ category: 'interactive' }}
          >
            Primary action
          </InteractableButton>
          <InteractableButton
            id="btn-2"
            type="Button"
            metadata={{ category: 'interactive' }}
          >
            Secondary
          </InteractableButton>
        </div>
        {selectedId && (
          <p className="text-sm text-blue-600">
            Selected: <code className="bg-blue-50 px-1 rounded">{selectedId}</code>
          </p>
        )}
      </div>
    </div>
  );
}
