/**
 * Accessibility types — issues, impact, WCAG
 */

export type A11yImpact = 'critical' | 'serious' | 'moderate' | 'minor';

export interface A11yIssue {
  id: string;
  component: string;
  type: string;
  impact: A11yImpact;
  message: string;
  fix: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
}
