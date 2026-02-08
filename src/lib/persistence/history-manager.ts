import type { PageState } from '@/types/builder.types';
import { indexedDBStore } from './indexeddb-store';

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  state: PageState;
  description: string;
}

class HistoryManager {
  private currentProjectId = 'default';
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];
  private maxStackSize = 50;

  setProject(projectId: string): void {
    this.currentProjectId = projectId;
    void this.loadHistory();
  }

  async saveSnapshot(state: PageState, description: string, route?: string): Promise<void> {
    const entry: HistoryEntry = {
      id: `${Date.now()}`,
      timestamp: new Date(),
      state: JSON.parse(JSON.stringify(state)) as PageState,
      description,
    };

    this.undoStack.push(entry);
    this.redoStack = [];

    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }

    await indexedDBStore.saveHistorySnapshot(
      this.currentProjectId,
      state,
      description,
      route
    );
  }

  undo(): PageState | null {
    if (this.undoStack.length <= 1) return null;
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    const previous = this.undoStack[this.undoStack.length - 1];
    return previous ? previous.state : null;
  }

  redo(): PageState | null {
    if (this.redoStack.length === 0) return null;
    const next = this.redoStack.pop()!;
    this.undoStack.push(next);
    return next.state;
  }

  canUndo(): boolean {
    return this.undoStack.length > 1;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getHistory(): HistoryEntry[] {
    return [...this.undoStack].reverse();
  }

  async loadHistory(): Promise<void> {
    const history = await indexedDBStore.getHistory(this.currentProjectId);
    this.undoStack = history.map((h) => ({
      id: h.id,
      timestamp: h.timestamp,
      state: h.state,
      description: h.description,
    }));
  }

  async restoreFromSnapshot(snapshotId: string): Promise<PageState | null> {
    const snapshot = this.undoStack.find((e) => e.id === snapshotId);
    return snapshot ? snapshot.state : null;
  }
}

export const historyManager = new HistoryManager();
