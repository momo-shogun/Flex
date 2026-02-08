import type { PageSection } from '@/types/builder.types';

export interface ResponsiveIssue {
  sectionId: string;
  sectionLabel: string;
  device: 'mobile' | 'tablet' | 'desktop';
  issue: string;
  severity: 'error' | 'warning' | 'info';
  fix: string;
}

export function analyzeResponsiveness(sections: PageSection[]): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];

  for (const section of sections) {
    const width = section.props?.width;
    if (width !== undefined && typeof width === 'number' && width > 768) {
      issues.push({
        sectionId: section.id,
        sectionLabel: section.label,
        device: 'mobile',
        issue: 'Fixed width may exceed mobile viewport',
        severity: 'warning',
        fix: 'Use percentage or max-width: 100%',
      });
    }

    const fontSize = section.props?.fontSize;
    if (fontSize !== undefined) {
      const size = parseInt(String(fontSize), 10);
      if (!Number.isNaN(size) && size > 48) {
        issues.push({
          sectionId: section.id,
          sectionLabel: section.label,
          device: 'mobile',
          issue: 'Text size may be too large on mobile',
          severity: 'warning',
          fix: 'Consider reducing font size on mobile to 32px or less',
        });
      }
    }

    const padding = section.props?.padding ?? section.props?.paddingTop ?? section.props?.paddingLeft;
    if (padding !== undefined) {
      const val = typeof padding === 'number' ? padding : parseInt(String(padding), 10);
      if (!Number.isNaN(val) && val > 40) {
        issues.push({
          sectionId: section.id,
          sectionLabel: section.label,
          device: 'mobile',
          issue: 'Large padding may cause overflow on small screens',
          severity: 'warning',
          fix: 'Use 16–24px padding on mobile',
        });
      }
    }

    if (section.props?.imageUrl && !section.props?.imageAlt) {
      issues.push({
        sectionId: section.id,
        sectionLabel: section.label,
        device: 'mobile',
        issue: 'Image missing alt text',
        severity: 'error',
        fix: 'Add descriptive alt text for accessibility',
      });
    }
  }

  return issues;
}

export function generateResponsiveFixes(issues: ResponsiveIssue[]): string {
  if (issues.length === 0) {
    return '✅ Your website looks responsive. No issues found.';
  }

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  const block = (title: string, list: ResponsiveIssue[]) =>
    list.length > 0
      ? `**${title}** (${list.length}):\n${list.map((e, i) => `${i + 1}. **${e.sectionLabel}** (${e.device})\n   Problem: ${e.issue}\n   Fix: ${e.fix}`).join('\n')}`
      : '';

  return [
    '📱 **Responsive design analysis**\n',
    block('Critical', errors),
    block('Warnings', warnings),
    block('Info', infos),
  ]
    .filter(Boolean)
    .join('\n\n');
}
