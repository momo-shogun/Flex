import { useEffect } from 'react';
import { useTambo } from '@tambo-ai/react';
import { useBuilderActionsRef } from '@/contexts/BuilderActionsRefContext';
import { createBuilderTools } from '@/lib/builder-tambo-tools';
import { createEnhancedBuilderTools } from '@/lib/builder-tambo-tools-enhanced';

/**
 * Registers website builder tools (add_builder_section, update_builder_section,
 * list_builder_sections, merge_builder_sections) and enhanced tools
 * (generate_website_from_template, search_website_templates, generate_custom_website)
 * with Tambo. The ref may be null when not on the builder page; tools no-op in that case.
 */
export function BuilderTamboToolRegistration() {
  const ref = useBuilderActionsRef();
  const { registerTools } = useTambo();

  useEffect(() => {
    if (!ref) return;
    const baseTools = createBuilderTools(ref);
    const enhancedTools = createEnhancedBuilderTools(ref);
    registerTools([...baseTools, ...enhancedTools]);
  }, [ref, registerTools]);

  return null;
}
