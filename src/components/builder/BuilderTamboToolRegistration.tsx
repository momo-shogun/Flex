import { useEffect } from 'react';
import { useTambo } from '@tambo-ai/react';
import { useBuilderActionsRef } from '@/contexts/BuilderActionsRefContext';
import {
  createBuilderTools,
  createEnhancedBuilderTools,
} from '@/lib/builder-tambo-tools';
import { createComponentGenTools } from '@/lib/builder-tambo-tools-component-gen';
import { createImportTool } from '@/lib/builder-tambo-tools-import';
import { createAnalyzeResponsivenessTool } from '@/lib/builder-tambo-tools-responsive';
import { createExportCodeTool } from '@/lib/builder-tambo-tools-export';

/**
 * Registers website builder tools (add/update/list/merge sections), enhanced tools
 * (templates, custom website), component-gen, import_component, analyze_responsiveness, export_website_code.
 */
export function BuilderTamboToolRegistration() {
  const ref = useBuilderActionsRef();
  const { registerTools } = useTambo();

  useEffect(() => {
    if (!ref) return;
    const baseTools = createBuilderTools(ref);
    const enhancedTools = createEnhancedBuilderTools(ref);
    const componentGenTools = createComponentGenTools(ref);
    const importTool = createImportTool(ref);
    const responsiveTool = createAnalyzeResponsivenessTool(ref);
    const exportTool = createExportCodeTool(ref);
    registerTools([
      ...baseTools,
      ...enhancedTools,
      ...componentGenTools,
      importTool,
      responsiveTool,
      exportTool,
    ]);
  }, [ref, registerTools]);

  return null;
}
