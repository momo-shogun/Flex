import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import type { ComponentId } from '@/types/components';

const COMPONENT_IDS: ComponentId[] = [
  'split-text',
  'blur-text',
  'text-cursor',
  'silk',
  'floating-lines',
  'light-pillar',
  'smooth-scroll-hero',
  'aurora-hero',
  'faq',
  'silk-hero-splittext',
  'aurora-hero-splittext',
];

const componentIdSchema = z.enum([
  'split-text',
  'blur-text',
  'text-cursor',
  'silk',
  'floating-lines',
  'light-pillar',
  'smooth-scroll-hero',
  'aurora-hero',
  'faq',
  'silk-hero-splittext',
  'aurora-hero-splittext',
]);

/** Explicit optional keys for section props (Tambo does not support z.record in tool schema). */
const sectionPropsObjectSchema = z.object({
  text: z.string().optional(),
  className: z.string().optional(),
  delay: z.number().optional(),
  duration: z.number().optional(),
  animateBy: z.enum(['characters', 'words']).optional(),
  speed: z.number().optional(),
  scale: z.number().optional(),
  color: z.string().optional(),
  noiseIntensity: z.number().optional(),
  rotation: z.number().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  animationSpeed: z.number().optional(),
  topColor: z.string().optional(),
  bottomColor: z.string().optional(),
  blurAmount: z.number().optional(),
  cursor: z.string().optional(),
  cursorClassName: z.string().optional(),
});

export function createBuilderTools(
  builderActionsRef: MutableRefObject<BuilderActions | null>
) {
  const addBuilderSection = defineTool({
    name: 'add_builder_section',
    description: `Add a new section to the website builder canvas. IMPORTANT: When the user asks for a hero WITH split text animation (e.g. "aurora hero with split text", "hero with split text", "silk hero with split text"), add exactly ONE composite section—do NOT add two separate sections. Use aurora-hero-splittext for "aurora hero with split text" (one section: Aurora Hero with animated split-text title). Use silk-hero-splittext for "silk hero with split text" (one section: Silk background with split-text hero). Section types: ${COMPONENT_IDS.join(', ')}.`,
    inputSchema: z.object({
      type: componentIdSchema,
      props: sectionPropsObjectSchema.optional(),
    }),
    outputSchema: z.string(),
    tool: async ({ type, props }) => {
      const actions = builderActionsRef.current;
      if (!actions) {
        return 'Website builder is not open. Open the website builder page first.';
      }
      const sectionId = actions.addSection(type);
      if (props && Object.keys(props).length > 0) {
        actions.dispatch({ type: 'UPDATE_PROPS', id: sectionId, props: props as Record<string, unknown> });
      }
      return `Added section "${type}" with id ${sectionId}.`;
    },
  });

  const updateBuilderSection = defineTool({
    name: 'update_builder_section',
    description:
      'Update the props of an existing section on the website builder canvas. Use the section id returned when the section was added, or list sections first.',
    inputSchema: z.object({
      sectionId: z.string(),
      props: sectionPropsObjectSchema,
    }),
    outputSchema: z.string(),
    tool: async ({ sectionId, props }) => {
      const actions = builderActionsRef.current;
      if (!actions) {
        return 'Website builder is not open. Open the website builder page first.';
      }
      const section = actions.getSection(sectionId);
      if (!section) {
        return `Section not found: ${sectionId}. Use list_builder_sections to see existing sections.`;
      }
      actions.dispatch({ type: 'UPDATE_PROPS', id: sectionId, props });
      return `Updated section ${sectionId}.`;
    },
  });

  const listBuilderSections = defineTool({
    name: 'list_builder_sections',
    description:
      'List all sections currently on the website builder canvas (id and label). Use this to find section ids before updating.',
    inputSchema: z.object({}),
    outputSchema: z.string(),
    tool: async () => {
      const actions = builderActionsRef.current;
      if (!actions) {
        return 'Website builder is not open. Open the website builder page first.';
      }
      const sections = actions.state.sections;
      if (!sections.length) {
        return 'No sections on the canvas yet.';
      }
      return sections.map((s) => `${s.id}: ${s.label}`).join('\n');
    },
  });

  return [addBuilderSection, updateBuilderSection, listBuilderSections];
}
