import { z } from 'zod';
import type { SystemContext, AIResponse } from '@/types/ai';
import type { Component } from '@/types/design-system';
import { buildUserPrompt, SYSTEM_PROMPT } from './prompts';

const AIResponseSchema = z.object({
  intent: z.string(),
  targets: z.union([
    z.array(z.string()),
    z.literal('all'),
    z.string().startsWith('type:'),
  ]),
  mutations: z.record(
    z.object({
      props: z.record(z.unknown()).optional(),
      tokens: z.record(z.unknown()).optional(),
      styles: z.record(z.unknown()).optional(),
    })
  ),
  accessibility: z
    .object({
      issues: z.array(z.string()),
      fixes: z.array(z.string()),
      wcagLevel: z.enum(['A', 'AA', 'AAA']),
    })
    .optional(),
  explanation: z.string(),
});

const MOCK_RESPONSES: Record<string, AIResponse> = {
  accessible: {
    intent: 'Make components more accessible',
    targets: 'all',
    mutations: {},
    explanation:
      'Applied higher contrast, larger touch targets, and visible focus styles for WCAG AA.',
  },
  'make it accessible': {
    intent: 'Make components more accessible',
    targets: 'all',
    mutations: {},
    explanation:
      'Increased contrast and added focus indicators for better accessibility.',
  },
  'increase contrast': {
    intent: 'Increase color contrast',
    targets: 'all',
    mutations: {},
    explanation: 'Darkened text and background contrast for WCAG AA compliance.',
  },
  'round corners': {
    intent: 'Round component corners',
    targets: 'all',
    mutations: {},
    explanation: 'Applied rounded corners (radius: md) across selected components.',
  },
  'make it more playful': {
    intent: 'More playful style',
    targets: 'all',
    mutations: {},
    explanation: 'Increased border radius and added softer shadows for a friendlier look.',
  },
};

function buildMockMutations(
  command: string,
  context: SystemContext
): AIResponse['mutations'] {
  const ids = Array.from(context.components.keys());
  const selectedId = context.selectedId;
  const targetIds =
    selectedId && ids.includes(selectedId) ? [selectedId] : ids;
  const mutations: AIResponse['mutations'] = {};

  const lower = command.toLowerCase();
  for (const id of targetIds) {
    const comp = context.components.get(id);
    if (!comp) continue;

    if (
      lower.includes('accessible') ||
      lower.includes('contrast') ||
      lower.includes('accessibility')
    ) {
      mutations[id] = {
        props: {
          ...comp.props,
          className: [
            (comp.props.className as string) ?? '',
            'bg-blue-700 text-white font-medium min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2',
          ]
            .filter(Boolean)
            .join(' '),
        },
      };
    } else if (
      lower.includes('round') ||
      lower.includes('corners') ||
      lower.includes('playful')
    ) {
      mutations[id] = {
        props: {
          ...comp.props,
          className: [
            (comp.props.className as string) ?? '',
            'rounded-xl',
          ]
            .filter(Boolean)
            .join(' '),
        },
      };
    }
  }

  return mutations;
}

export class IntentParser {
  private apiKey: string | null = null;

  setApiKey(key: string | null) {
    this.apiKey = key;
  }

  async parse(command: string, context: SystemContext): Promise<AIResponse> {
    const mock = this.getMockResponse(command, context);
    if (mock) return mock;

    if (!this.apiKey) {
      return this.getFallbackMockResponse(command, context);
    }

    const userPrompt = buildUserPrompt(command, {
      components: Array.from(context.components.values()).map((c) => ({
        id: c.id,
        type: c.type,
      })),
      theme: context.theme,
      selectedId: context.selectedId,
      a11yIssues: context.a11yIssues.map((i) => ({
        component: i.component,
        message: i.message,
      })),
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const raw =
      data.content?.[0]?.type === 'text' ? data.content[0].text : '';
    const jsonMatch =
      raw.match(/```json\n([\s\S]*?)\n```/) || raw.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) throw new Error('No JSON in AI response');
    const parsed = JSON.parse(jsonMatch[1]);
    return AIResponseSchema.parse(parsed);
  }

  private getMockResponse(
    command: string,
    context: SystemContext
  ): AIResponse | null {
    const lower = command.toLowerCase().trim();
    for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
      if (lower.includes(key)) {
        const mutations = buildMockMutations(command, context);
        return {
          ...response,
          mutations:
            Object.keys(mutations).length > 0 ? mutations : response.mutations,
        };
      }
    }
    return null;
  }

  private getFallbackMockResponse(
    command: string,
    context: SystemContext
  ): AIResponse {
    const mutations = buildMockMutations(command, context);
    return {
      intent: 'Apply design changes',
      targets: context.selectedId ? [context.selectedId] : 'all',
      mutations,
      explanation: `Applied your request: "${command}". Add VITE_CLAUDE_API_KEY for full AI.`,
    };
  }

  resolveTargets(
    targets: AIResponse['targets'],
    components: Map<string, Component>,
    selectedId?: string
  ): string[] {
    if (targets === 'all') {
      return Array.from(components.keys());
    }
    if (typeof targets === 'string' && targets.startsWith('type:')) {
      const type = targets.slice(5);
      return Array.from(components.values())
        .filter((c) => c.type === type)
        .map((c) => c.id);
    }
    return Array.isArray(targets) ? targets : [];
  }
}
