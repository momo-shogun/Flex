import { useBuilder } from '@/contexts/BuilderContext';
import { useAutoSave } from '@/hooks/useAutoSave';
import { historyManager } from '@/lib/persistence/history-manager';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PROJECT_ID = 'default';
const PROJECT_NAME = 'Website';

/** Wires builder state to IndexedDB + history. Call inside BuilderProvider. */
export function BuilderAutoSave() {
  const { state } = useBuilder();
  const { pathname } = useLocation();
  useAutoSave(state, PROJECT_ID, PROJECT_NAME, pathname);

  useEffect(() => {
    historyManager.setProject(PROJECT_ID);
  }, []);

  return null;
}
