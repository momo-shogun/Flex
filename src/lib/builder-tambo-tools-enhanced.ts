import type { MutableRefObject } from 'react';
import { defineTool } from '@tambo-ai/react';
import { z } from 'zod';
import type { BuilderActions } from '@/contexts/BuilderActionsRefContext';
import {
  WEBSITE_TEMPLATES,
  searchTemplates,
  findTemplateByCategory,
} from './website-templates';

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

  const sectionMapping: Record<
    string,
    { type: 'aurora-hero-splittext' | 'smooth-scroll-hero' | 'floating-lines' | 'light-pillar' | 'faq' | 'silk-hero-splittext' | 'aurora-hero'; label: string }
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
        const mapping = sectionMapping[sectionType];
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
