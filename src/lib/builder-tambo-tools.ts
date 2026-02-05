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

  const mergeBuilderSections = defineTool({
    name: 'merge_builder_sections',
    description:
      'Merge two sections into one composite section. Takes two section IDs, analyzes their types and props, and creates a merged component that combines both. Returns the new merged section ID and removes the original two sections.',
    inputSchema: z.object({
      sectionId1: z.string(),
      sectionId2: z.string(),
      mergedType: componentIdSchema.optional(),
      mergedProps: sectionPropsObjectSchema.optional(),
    }),
    outputSchema: z.string(),
    tool: async ({ sectionId1, sectionId2, mergedType, mergedProps }) => {
      const actions = builderActionsRef.current;
      if (!actions) {
        return 'Website builder is not open. Open the website builder page first.';
      }
      const section1 = actions.getSection(sectionId1);
      const section2 = actions.getSection(sectionId2);
      if (!section1 || !section2) {
        return `One or both sections not found: ${sectionId1}, ${sectionId2}. Use list_builder_sections to see existing sections.`;
      }

      // Determine merged type, preferring known composites even if mergedType was provided
      const types = [section1.type, section2.type] as ComponentId[];
      let finalType: ComponentId;
      const hasSilk = types.includes('silk');
      const hasTextAnimation =
        types.includes('split-text') || types.includes('blur-text') || types.includes('text-cursor');
      const hasAuroraHero = types.includes('aurora-hero');

      if (hasSilk && hasTextAnimation) {
        // Always use silk-hero-splittext when merging Silk + any text animation
        finalType = 'silk-hero-splittext';
      } else if (hasAuroraHero && (types.includes('split-text') || types.includes('blur-text'))) {
        // Aurora hero + text animation -> aurora-hero-splittext
        finalType = 'aurora-hero-splittext';
      } else if (mergedType) {
        // Otherwise, respect caller's mergedType if provided
        finalType = mergedType;
      } else {
        // Fallback: keep first section type
        finalType = section1.type;
      }

      // Merge props (for known composites, merge smartly)
      let mergedPropsFinal: Record<string, unknown>;
      if (mergedProps) {
        mergedPropsFinal = mergedProps as Record<string, unknown>;
      } else if (finalType === 'silk-hero-splittext') {
        const silkSection = section1.type === 'silk' ? section1 : section2;
        const textSection = section1.type === 'silk' ? section2 : section1;
        mergedPropsFinal = {
          // Silk background props first
          ...silkSection.props,
          // Text animation props override where needed (text, delay, duration, animateBy, className, etc.)
          ...textSection.props,
        };
      } else if (finalType === 'aurora-hero-splittext') {
        const auroraSection = section1.type === 'aurora-hero' ? section1 : section2;
        const textSection = section1.type === 'aurora-hero' ? section2 : section1;
        mergedPropsFinal = {
          // Aurora hero layout/positions first
          ...auroraSection.props,
          // Text animation props override text-related fields
          ...textSection.props,
        };
      } else {
        // Generic merge: later section props override earlier
        mergedPropsFinal = {
          ...section1.props,
          ...section2.props,
        };
      }

      // Get index of first section to insert merged section at that position
      const index1 = actions.state.sections.findIndex((s) => s.id === sectionId1);
      const index2 = actions.state.sections.findIndex((s) => s.id === sectionId2);
      const insertIndex = Math.min(index1, index2);

      // Create merged section first
      const mergedId = `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const mergedLabel = `Merged: ${section1.label} + ${section2.label}`;
      const mergedSection = {
        id: mergedId,
        type: finalType,
        label: mergedLabel,
        visible: true,
        props: mergedPropsFinal,
      };

      // Remove both sections and insert merged at insertIndex
      const newSections = [...actions.state.sections];
      newSections.splice(Math.max(index1, index2), 1);
      newSections.splice(Math.min(index1, index2), 1);
      newSections.splice(insertIndex, 0, mergedSection);

      // Update state: remove both, then add merged
      actions.dispatch({ type: 'REMOVE_SECTION', id: sectionId1 });
      actions.dispatch({ type: 'REMOVE_SECTION', id: sectionId2 });
      actions.dispatch({ type: 'ADD_SECTION', section: mergedSection });

      return `Merged sections "${section1.label}" and "${section2.label}" into "${finalType}" with id ${mergedId}.`;
    },
  });

  return [addBuilderSection, updateBuilderSection, listBuilderSections, mergeBuilderSections];
}
