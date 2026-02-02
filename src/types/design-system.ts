/**
 * Design system core types — theme, tokens, components
 */

export interface Theme {
  mode: 'light' | 'dark';
  colors: Record<string, string>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
}

export interface DesignTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
}

export interface ComponentMetadata {
  category: string;
  editableProps: string[];
  a11yRules?: string[];
}

export interface Component {
  id: string;
  type: string;
  props: Record<string, unknown>;
  metadata: ComponentMetadata;
  element?: HTMLElement | null;
  tokens?: Record<string, unknown>;
  styles?: Record<string, unknown>;
}
