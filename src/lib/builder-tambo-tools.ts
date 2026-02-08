import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import { toComponentId } from '@/types/builder.types';
import type { ComponentId } from '@/types/components';
import {
  WEBSITE_TEMPLATES,
  searchTemplates,
  findTemplateByCategory,
} from './website-templates';

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
        // Fallback: keep first section type (narrow for composite types)
        finalType = toComponentId(section1.type);
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

// --- Enhanced tools (templates, custom website) - same file for optimal single-source ---

const categorySchema = z.enum([
  'landing',
  'portfolio',
  'saas',
  'ecommerce',
  'blog',
]);

const customizationsSchema = z
  .object({
    brandName: z.string().optional(),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    heroText: z.string().optional(),
    heroSubtitle: z.string().optional(),
  })
  .optional();

const requiredSectionsSchema = z.array(
  z.enum([
    'hero',
    'features',
    'about',
    'services',
    'pricing',
    'testimonials',
    'faq',
    'cta',
    'gallery',
    'contact',
  ])
);

function adjustColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const factor = 0.8;
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

const SECTION_MAPPING: Record<
  string,
  { type: ComponentId; label: string }
> = {
  hero: { type: 'aurora-hero-splittext', label: 'Hero Section' },
  features: { type: 'smooth-scroll-hero', label: 'Features' },
  about: { type: 'floating-lines', label: 'About Us' },
  services: { type: 'light-pillar', label: 'Our Services' },
  pricing: { type: 'faq', label: 'Pricing' },
  testimonials: { type: 'floating-lines', label: 'Testimonials' },
  faq: { type: 'faq', label: 'FAQ' },
  cta: { type: 'silk-hero-splittext', label: 'Call to Action' },
  gallery: { type: 'light-pillar', label: 'Gallery' },
  contact: { type: 'aurora-hero', label: 'Contact Us' },
};

export function createEnhancedBuilderTools(
  builderActionsRef: MutableRefObject<BuilderActions | null>
) {
  const generateWebsiteFromTemplate = defineTool({
    name: 'generate_website_from_template',
    description: `Generate a complete website from a pre-built template. Use when user requests a full website (landing page, portfolio, etc). Templates provide coordinated sections. ALWAYS search templates first to show user options.`,
    inputSchema: z.object({
      templateId: z.string(),
      customizations: customizationsSchema,
      clearExisting: z.boolean().default(true),
    }),
    outputSchema: z.string(),
    tool: async ({ templateId, customizations = {}, clearExisting = true }) => {
      const actions = builderActionsRef.current;
      if (!actions) {
        return 'Website builder is not open. Open the website builder page first.';
      }
      const template = WEBSITE_TEMPLATES.find((t) => t.id === templateId);
      if (!template) {
        return `Template ${templateId} not found. Available: ${WEBSITE_TEMPLATES.map((t) => t.id).join(', ')}`;
      }
      if (clearExisting) {
        actions.dispatch({ type: 'RESET' });
      }
      const addedSections: string[] = [];
      for (const section of template.sections) {
        let props: Record<string, unknown> = { ...section.props };
        if (customizations.primaryColor) {
          if ('color' in props) props.color = customizations.primaryColor;
          if ('topColor' in props) props.topColor = customizations.primaryColor;
        }
        if (customizations.accentColor && 'bottomColor' in props) {
          props.bottomColor = customizations.accentColor;
        }
        if (customizations.heroText && section.purpose.toLowerCase().includes('hero')) {
          props.text = customizations.heroText;
        }
        if (customizations.heroSubtitle && section.purpose.toLowerCase().includes('hero')) {
          props.subtitle = customizations.heroSubtitle;
        }
        const sectionId = actions.addSection(section.type);
        actions.dispatch({ type: 'UPDATE_PROPS', id: sectionId, props });
        actions.dispatch({
          type: 'UPDATE_SECTION',
          id: sectionId,
          updates: { label: section.label },
        });
        addedSections.push(`${section.label} (${section.type})`);
      }
      return `✅ Generated **${template.name}**!\n\n📋 **Sections created:**\n${addedSections.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n📝 **Template**: ${template.description}\n\n🎨 The website is now live on your canvas. You can edit sections in the inspector, reorder in the layers panel, or ask me to modify specific sections.`;
    },
  });

  const searchTemplatesTool = defineTool({
    name: 'search_website_templates',
    description: `Search available website templates by keywords or category. Use first when user asks to create a website.`,
    inputSchema: z.object({
      query: z.string().optional(),
      category: categorySchema.optional(),
    }),
    outputSchema: z.string(),
    tool: async ({ query, category }) => {
      let results = WEBSITE_TEMPLATES;
      if (category) {
        results = findTemplateByCategory(category);
      } else if (query) {
        results = searchTemplates(query);
      }
      if (results.length === 0) {
        return `No templates found for "${query ?? category}". Available: ${WEBSITE_TEMPLATES.map((t) => `${t.name} (${t.category})`).join(', ')}. Try: ${WEBSITE_TEMPLATES.flatMap((t) => t.tags.slice(0, 2)).join(', ')}`;
      }
      const formatted = results
        .map(
          (t, i) =>
            `**${i + 1}. ${t.name}** (${t.category})\n- ${t.description}\n- Sections: ${t.sections.map((s) => s.label).join(', ')}\n- Tags: ${t.tags.join(', ')}\n- ID: \`${t.id}\``
        )
        .join('\n\n');
      return `Found ${results.length} template(s):\n\n${formatted}\n\nTo use one, I can run \`generate_website_from_template\` with the template ID. Which would you like?`;
    },
  });

  const generateCustomWebsite = defineTool({
    name: 'generate_custom_website',
    description: `Generate a custom website by composing sections. Use when user describes what they need and no template fits exactly.`,
    inputSchema: z.object({
      websiteType: z.string(),
      businessDescription: z.string(),
      requiredSections: requiredSectionsSchema,
      stylePreference: z.enum(['modern', 'minimal', 'bold', 'elegant']).optional(),
      primaryColor: z.string().optional(),
    }),
    outputSchema: z.string(),
    tool: async ({
      websiteType,
      businessDescription,
      requiredSections,
      primaryColor,
    }) => {
      const actions = builderActionsRef.current;
      if (!actions) {
        return 'Website builder is not open. Open the website builder page first.';
      }
      actions.dispatch({ type: 'RESET' });
      const created: string[] = [];
      const primary = primaryColor ?? '#4F46E5';
      const accent = primaryColor ? adjustColor(primaryColor) : '#7C3AED';

      for (const sectionType of requiredSections) {
        const mapping = SECTION_MAPPING[sectionType];
        if (!mapping) continue;

        const sectionId = actions.addSection(mapping.type);
        let props: Record<string, unknown> = {};

        if (sectionType === 'hero') {
          props = {
            text: businessDescription,
            subtitle: 'Discover what makes us different',
            topColor: primary,
            bottomColor: accent,
            delay: 0.1,
            duration: 1.5,
            animateBy: 'words',
          };
        } else if (sectionType === 'features') {
          props = { text: 'Key Features', subtitle: 'Everything you need to succeed' };
        } else if (sectionType === 'about' || sectionType === 'testimonials') {
          props = { animationSpeed: 2 };
        } else if (sectionType === 'services' || sectionType === 'gallery') {
          props = { topColor: primary, bottomColor: accent };
        } else if (sectionType === 'cta') {
          props = {
            text: 'Ready to Get Started?',
            subtitle: 'Get in touch today',
            color: primary,
            speed: 3,
          };
        } else if (sectionType === 'faq' || sectionType === 'pricing') {
          props = { title: sectionType === 'pricing' ? 'Pricing Plans' : 'Frequently Asked Questions' };
        } else if (sectionType === 'contact') {
          props = {
            title: 'Get In Touch',
            subtitle: "We'd love to hear from you",
            topColor: primary,
            bottomColor: accent,
          };
        }

        if (Object.keys(props).length > 0) {
          actions.dispatch({ type: 'UPDATE_PROPS', id: sectionId, props });
        }
        actions.dispatch({
          type: 'UPDATE_SECTION',
          id: sectionId,
          updates: { label: mapping.label },
        });
        created.push(sectionType);
      }

      return `✅ Created custom **${websiteType}** with ${created.length} sections:\n\n${created.map((s, i) => `${i + 1}. ${s.charAt(0).toUpperCase() + s.slice(1)}`).join('\n')}\n\n🎯 **Tailored for**: ${businessDescription}${primaryColor ? `\n🎨 **Primary Color**: ${primaryColor}` : ''}\n\nNext: edit content in the inspector or ask me to change specific sections.`;
    },
  });

  return [generateWebsiteFromTemplate, searchTemplatesTool, generateCustomWebsite];
}
