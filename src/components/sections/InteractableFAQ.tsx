import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';
import { FAQ } from './FAQ';
import { DEFAULT_ITEMS, DEFAULT_FAQ_TITLE } from './FAQ';

const FAQItemSchema = z.object({
  question: z.string().describe('The FAQ question text'),
  answer: z.string().describe('The FAQ answer text'),
});

const FAQPropsSchema = z.object({
  title: z.string().optional().describe('Section title, e.g. "Frequently Asked Questions"'),
  items: z
    .array(FAQItemSchema)
    .describe('List of FAQ entries with question and answer'),
});

export const InteractableFAQ = withInteractable(FAQ, {
  componentName: 'FAQ',
  description:
    'FAQ accordion section. AI can update the title and the list of items (each item has question and answer). Use this when the user wants to change FAQ content.',
  propsSchema: FAQPropsSchema,
});

export const DEFAULT_FAQ_PROPS = {
  title: DEFAULT_FAQ_TITLE,
  items: DEFAULT_ITEMS,
};
