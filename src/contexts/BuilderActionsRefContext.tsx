import { createContext, useContext, useRef, type ReactNode } from 'react';
import type { ComponentId } from '@/types/components';
import type { PageAction, PageSection, PageState } from '@/types/builder.types';

export interface BuilderActions {
  addSection: (type: ComponentId) => string;
  dispatch: React.Dispatch<PageAction>;
  getSection: (id: string) => PageSection | undefined;
  state: PageState;
}

export type BuilderActionsRef = React.MutableRefObject<BuilderActions | null>;

const BuilderActionsRefContext = createContext<BuilderActionsRef | null>(null);

export function BuilderActionsRefProvider({ children }: { children: ReactNode }) {
  const ref = useRef<BuilderActions | null>(null);
  return (
    <BuilderActionsRefContext.Provider value={ref}>
      {children}
    </BuilderActionsRefContext.Provider>
  );
}

export function useBuilderActionsRef(): BuilderActionsRef | null {
  return useContext(BuilderActionsRefContext);
}
