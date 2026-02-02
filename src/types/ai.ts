/**
 * AI layer types — intent parser, mutations, system context
 */

import type { Component } from './design-system';
import type { Theme } from './design-system';
import type { A11yIssue } from './a11y';

export interface SystemContext {
  components: Map<string, Component>;
  theme: Theme;
  a11yIssues: A11yIssue[];
  selectedId: string | null;
}

export interface AIMutation {
  props?: Record<string, unknown>;
  tokens?: Record<string, unknown>;
  styles?: Record<string, unknown>;
}

export interface AIResponse {
  intent: string;
  targets: string[] | 'all' | `type:${string}`;
  mutations: Record<string, AIMutation>;
  accessibility?: {
    issues: string[];
    fixes: string[];
    wcagLevel: 'A' | 'AA' | 'AAA';
  };
  explanation: string;
}
