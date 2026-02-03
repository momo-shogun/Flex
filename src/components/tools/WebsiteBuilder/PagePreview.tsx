import { Header } from '@/components/sections/Header';
import { SmoothScrollHero } from '@/components/sections/SmoothScrollHero';
import { AuroraHero } from '@/components/sections/AuroraHero';
import { FAQ } from '@/components/sections/FAQ';
import type { BuilderSection } from '@/types/website-builder';

interface PagePreviewProps {
  sections: BuilderSection[];
}

export function PagePreview({ sections }: PagePreviewProps) {
  if (sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Add sections from the left panel to build your page.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="min-h-full w-full">
        {sections.map((section) => {
          switch (section.type) {
            case 'header':
              return <Header key={section.id} />;
            case 'smooth-scroll-hero':
              return <SmoothScrollHero key={section.id} />;
            case 'aurora-hero':
              return <AuroraHero key={section.id} />;
            case 'faq':
              return <FAQ key={section.id} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
