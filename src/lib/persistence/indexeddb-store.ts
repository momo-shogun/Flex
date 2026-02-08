import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { PageState } from '@/types/builder.types';

interface FlexBuilderDB extends DBSchema {
  projects: {
    key: string;
    value: {
      id: string;
      name: string;
      route?: string;
      lastModified: Date;
      state: PageState;
      thumbnail?: string;
    };
    indexes: { 'by-date': Date };
  };
  history: {
    key: string;
    value: {
      id: string;
      projectId: string;
      timestamp: Date;
      state: PageState;
      description: string;
      route?: string;
    };
    indexes: { 'by-project': string; 'by-date': Date };
  };
  components: {
    key: string;
    value: {
      id: string;
      code: string;
      name: string;
      category: string;
      metadata: Record<string, unknown>;
    };
  };
  variants: {
    key: string;
    value: {
      id: string;
      baseComponentId: string;
      name: string;
      propsOverrides: Record<string, unknown>;
      styleModifiers: Record<string, unknown>;
      createdAt: Date;
    };
    indexes: { 'by-component': string };
  };
  templates: {
    key: string;
    value: {
      id: string;
      name: string;
      category: string;
      sections: unknown[];
      tags: string[];
      createdAt: Date;
    };
    indexes: { 'by-category': string };
  };
}

class IndexedDBStore {
  private db: IDBPDatabase<FlexBuilderDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<FlexBuilderDB>('flex-builder-db', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-date', 'lastModified');
          const historyStore = db.createObjectStore('history', { keyPath: 'id' });
          historyStore.createIndex('by-project', 'projectId');
          historyStore.createIndex('by-date', 'timestamp');
          db.createObjectStore('components', { keyPath: 'id' });
        }
        if (oldVersion < 2) {
          const variantStore = db.createObjectStore('variants', { keyPath: 'id' });
          variantStore.createIndex('by-component', 'baseComponentId');
          const templateStore = db.createObjectStore('templates', { keyPath: 'id' });
          templateStore.createIndex('by-category', 'category');
        }
      },
    });
  }

  async saveProject(project: {
    id: string;
    name: string;
    route?: string;
    state: PageState;
    thumbnail?: string;
  }): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('projects', {
      ...project,
      lastModified: new Date(),
    });
  }

  async getProject(id: string): Promise<FlexBuilderDB['projects']['value'] | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('projects', id);
  }

  async getAllProjects(route?: string): Promise<FlexBuilderDB['projects']['value'][]> {
    if (!this.db) await this.init();
    const all = await this.db!.getAllFromIndex('projects', 'by-date');
    if (route) return all.filter((p) => p.route === route);
    return all;
  }

  async saveHistorySnapshot(
    projectId: string,
    state: PageState,
    description: string,
    route?: string
  ): Promise<void> {
    if (!this.db) await this.init();
    const id = `${projectId}-${Date.now()}`;
    await this.db!.add('history', {
      id,
      projectId,
      timestamp: new Date(),
      state,
      description,
      route,
    });

    const allHistory = await this.db!.getAllFromIndex('history', 'by-project', projectId);
    if (allHistory.length > 50) {
      const toDelete = allHistory.slice(0, allHistory.length - 50);
      for (const item of toDelete) {
        await this.db!.delete('history', item.id);
      }
    }
  }

  async getHistory(projectId: string): Promise<FlexBuilderDB['history']['value'][]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('history', 'by-project', projectId);
  }

  async saveComponent(component: FlexBuilderDB['components']['value']): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('components', component);
  }

  async getComponent(id: string): Promise<FlexBuilderDB['components']['value'] | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('components', id);
  }

  async getAllComponents(): Promise<FlexBuilderDB['components']['value'][]> {
    if (!this.db) await this.init();
    return this.db!.getAll('components');
  }

  async saveVariant(variant: FlexBuilderDB['variants']['value']): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('variants', variant);
  }

  async getVariantsForComponent(componentId: string): Promise<FlexBuilderDB['variants']['value'][]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('variants', 'by-component', componentId);
  }

  async saveTemplate(template: FlexBuilderDB['templates']['value']): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('templates', template);
  }

  async getTemplatesByCategory(category: string): Promise<FlexBuilderDB['templates']['value'][]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('templates', 'by-category', category);
  }

  async getAllTemplates(): Promise<FlexBuilderDB['templates']['value'][]> {
    if (!this.db) await this.init();
    return this.db!.getAll('templates');
  }
}

export const indexedDBStore = new IndexedDBStore();
