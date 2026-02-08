import { useEffect, useRef } from 'react';
import type { PageState } from '@/types/builder.types';
import { indexedDBStore } from '@/lib/persistence/indexeddb-store';
import { historyManager } from '@/lib/persistence/history-manager';

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  ms: number
): T & { flush?: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const wrapped = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn(...args);
    }, ms);
  };
  (wrapped as T & { flush?: () => void }).flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      (fn as unknown as (...args: unknown[]) => void)();
    }
  };
  return wrapped as T & { flush?: () => void };
}

function getChangeDescription(prev: PageState, current: PageState): string {
  if (prev.sections.length < current.sections.length) return 'Added section';
  if (prev.sections.length > current.sections.length) return 'Removed section';
  for (let i = 0; i < current.sections.length; i++) {
    const prevSection = prev.sections[i];
    const currSection = current.sections[i];
    if (!prevSection || !currSection) continue;
    if (
      JSON.stringify(prevSection.props) !== JSON.stringify(currSection.props)
    ) {
      return `Updated ${currSection.label}`;
    }
  }
  if (prev.selectedId !== current.selectedId) return 'Changed selection';
  return 'Modified layout';
}

export function useAutoSave(
  state: PageState,
  projectId: string,
  projectName: string,
  route?: string
): { manualSave: () => void } {
  const previousState = useRef<PageState | null>(null);

  const saveProject = useRef(
    debounce(async (currentState: PageState) => {
      await indexedDBStore.saveProject({
        id: projectId,
        name: projectName,
        route,
        state: currentState,
      });
    }, 1000)
  ).current;

  const saveHistorySnapshot = useRef(
    debounce(async (currentState: PageState, prevState: PageState) => {
      const description = getChangeDescription(prevState, currentState);
      await historyManager.saveSnapshot(currentState, description, route);
    }, 5000)
  ).current;

  useEffect(() => {
    if (previousState.current !== null) {
      saveProject(state);
      saveHistorySnapshot(state, previousState.current);
    }
    previousState.current = state;
  }, [state, saveProject, saveHistorySnapshot]);

  return {
    manualSave: () => {
      void indexedDBStore.saveProject({
        id: projectId,
        name: projectName,
        route,
        state,
      });
    },
  };
}
