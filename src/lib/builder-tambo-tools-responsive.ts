import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import { analyzeResponsiveness, generateResponsiveFixes } from '@/lib/responsive-analyzer';

export function createAnalyzeResponsivenessTool(
  builderActionsRef: MutableRefObject<BuilderActions | null>
) {
  return defineTool({
    name: 'analyze_responsiveness',
    description:
      'Analyze the current website for responsive design issues (mobile/tablet/desktop). Use when the user asks "how does my site look on mobile?" or "check responsive design".',
    inputSchema: z.object({}),
    outputSchema: z.string(),
    tool: async () => {
      const actions = builderActionsRef.current;
      if (!actions) {
        return 'Website builder is not open. Open the website builder page first.';
      }
      const sections = actions.state.sections;
      const issues = analyzeResponsiveness(sections);
      return generateResponsiveFixes(issues);
    },
  });
}
