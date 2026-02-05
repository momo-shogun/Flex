import { useEffect } from 'react';
import { useTambo } from '@tambo-ai/react';
import { useBuilderActionsRef } from '@/contexts/BuilderActionsRefContext';
import { createBuilderTools } from '@/lib/builder-tambo-tools';

/**
 * Registers website builder tools (add_builder_section, update_builder_section,
 * list_builder_sections) with Tambo. The ref may be null when not on the builder
 * page; tools no-op in that case.
 */
export function BuilderTamboToolRegistration() {
  const ref = useBuilderActionsRef();
  const { registerTools } = useTambo();

  useEffect(() => {
    if (!ref) return;
    const tools = createBuilderTools(ref);
    registerTools(tools);
  }, [ref, registerTools]);

  return null;
}
