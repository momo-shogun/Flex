import type { ComponentId } from '@/types/components';

export interface WebsiteSection {
  type: ComponentId;
  label: string;
  props: Record<string, unknown>;
  purpose: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'landing' | 'portfolio' | 'saas' | 'ecommerce' | 'blog';
  sections: WebsiteSection[];
  tags: string[];
}

export const saasLandingTemplate: WebsiteTemplate = {
  id: 'saas-landing-01',
  name: 'SaaS Landing Page',
  description: 'Modern landing page with hero, features, pricing, and CTA',
  category: 'saas',
  tags: ['startup', 'software', 'tech'],
  sections: [
    {
      type: 'aurora-hero-splittext',
      label: 'Hero Section',
      purpose: 'Grab attention with animated headline and value proposition',
      props: {
        text: 'Transform Your Workflow',
        subtitle: 'The modern platform for teams that move fast',
        delay: 0.1,
        duration: 1.5,
        animateBy: 'words',
        topColor: '#4F46E5',
        bottomColor: '#7C3AED',
      },
    },
    {
      type: 'smooth-scroll-hero',
      label: 'Features Overview',
      purpose: 'Showcase key product features with parallax',
      props: {
        text: 'Built for Performance',
        subtitle: 'Lightning-fast, secure, and scalable',
      },
    },
    {
      type: 'faq',
      label: 'FAQ Section',
      purpose: 'Answer common questions and build trust',
      props: {
        title: 'Frequently Asked Questions',
      },
    },
    {
      type: 'silk-hero-splittext',
      label: 'CTA Footer',
      purpose: 'Final conversion push with animated CTA',
      props: {
        text: 'Ready to Get Started?',
        subtitle: 'Join thousands of teams already using our platform',
        color: '#3B82F6',
        speed: 3,
      },
    },
  ],
};

export const portfolioTemplate: WebsiteTemplate = {
  id: 'portfolio-01',
  name: 'Creative Portfolio',
  description: 'Showcase work with hero, project gallery, and contact',
  category: 'portfolio',
  tags: ['designer', 'developer', 'creative'],
  sections: [
    {
      type: 'silk-hero-splittext',
      label: 'Hero Introduction',
      purpose: 'Personal brand statement',
      props: {
        text: 'Designer & Developer',
        subtitle: 'Crafting digital experiences that inspire',
        color: '#F59E0B',
        speed: 4,
      },
    },
    {
      type: 'light-pillar',
      label: 'Featured Work',
      purpose: 'Highlight best projects',
      props: {
        topColor: '#8B5CF6',
        bottomColor: '#C084FC',
      },
    },
    {
      type: 'floating-lines',
      label: 'Skills & Expertise',
      purpose: 'Showcase technical skills',
      props: {
        animationSpeed: 2,
      },
    },
  ],
};

export const coffeeShopTemplate: WebsiteTemplate = {
  id: 'coffee-shop-01',
  name: 'Coffee Shop Landing',
  description: 'Warm, inviting landing page for local coffee shop',
  category: 'landing',
  tags: ['coffee', 'local', 'retail', 'food'],
  sections: [
    {
      type: 'silk-hero-splittext',
      label: 'Hero Welcome',
      purpose: 'Warm welcome with brand personality',
      props: {
        text: 'Artisan Coffee, Crafted Daily',
        subtitle: 'Where every cup tells a story',
        color: '#92400E',
        speed: 3,
      },
    },
    {
      type: 'floating-lines',
      label: 'Our Story',
      purpose: 'Build connection with brand story',
      props: {
        animationSpeed: 2,
      },
    },
    {
      type: 'light-pillar',
      label: 'Menu Highlights',
      purpose: 'Showcase signature drinks',
      props: {
        topColor: '#F59E0B',
        bottomColor: '#D97706',
      },
    },
    {
      type: 'aurora-hero',
      label: 'Visit Us',
      purpose: 'Location and hours CTA',
      props: {
        title: 'Visit Our Café',
        subtitle: 'Open Daily 7AM - 7PM | 123 Main Street',
        topColor: '#92400E',
        bottomColor: '#F59E0B',
      },
    },
  ],
};

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  saasLandingTemplate,
  portfolioTemplate,
  coffeeShopTemplate,
];

export function findTemplateByCategory(category: string): WebsiteTemplate[] {
  return WEBSITE_TEMPLATES.filter((t) => t.category === category);
}

export function findTemplateByTags(tags: string[]): WebsiteTemplate[] {
  return WEBSITE_TEMPLATES.filter((t) =>
    tags.some((tag) => t.tags.includes(tag.toLowerCase()))
  );
}

export function searchTemplates(query: string): WebsiteTemplate[] {
  const lowerQuery = query.toLowerCase();
  return WEBSITE_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.includes(lowerQuery))
  );
}
