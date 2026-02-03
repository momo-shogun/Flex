export type BuilderSectionType =
  | 'header'
  | 'smooth-scroll-hero'
  | 'aurora-hero'
  | 'faq';

export interface BuilderSection {
  id: string;
  type: BuilderSectionType;
}

export const BUILDER_SECTION_LABELS: Record<BuilderSectionType, string> = {
  header: 'Header',
  'smooth-scroll-hero': 'Smooth Scroll Hero',
  'aurora-hero': 'Aurora Hero',
  faq: 'FAQ',
};
