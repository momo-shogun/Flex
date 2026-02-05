import type { PageState } from '@/types/builder.types';

let lastBuilderState: PageState | null = null;

export function setBuilderStateForTambo(state: PageState): void {
  lastBuilderState = state;
}

export function getBuilderStateForTambo():
  | {
      sections: {
        id: string;
        type: string;
        label: string;
        visible: boolean;
      }[];
      selectedId: string | null;
    }
  | null {
  if (!lastBuilderState) return null;
  return {
    sections: lastBuilderState.sections.map((s) => ({
      id: s.id,
      type: s.type,
      label: s.label,
      visible: s.visible,
    })),
    selectedId: lastBuilderState.selectedId,
  };
}

