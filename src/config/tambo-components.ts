/**
 * Generative components for TamboProvider.
 * AI can create new instances of these in chat; use Interactable* in the tree for modification.
 */

import type { TamboComponent } from '@tambo-ai/react';
import { z } from 'zod';
import { SplitText } from '@/components/react-bits/text/SplitText';
import { TextCursor } from '@/components/react-bits/text/TextCursor';
import { BlurText } from '@/components/react-bits/text/BlurText';

const splitTextSchema = z.object({
  text: z.string(),
  delay: z.number().optional(),
  duration: z.number().optional(),
  animateBy: z.enum(['characters', 'words']).optional(),
  className: z.string().optional(),
});

const textCursorSchema = z.object({
  text: z.string(),
  speed: z.number().optional(),
  delay: z.number().optional(),
  cursor: z.string().optional(),
  cursorClassName: z.string().optional(),
  className: z.string().optional(),
});

const blurTextSchema = z.object({
  text: z.string(),
  delay: z.number().optional(),
  duration: z.number().optional(),
  animateBy: z.enum(['characters', 'words']).optional(),
  blurAmount: z.number().optional(),
  className: z.string().optional(),
});

export const tamboComponents: TamboComponent[] = [
  {
    name: 'SplitText',
    description: 'Character or word reveal animation for text. Use when user wants animated text reveal.',
    component: SplitText,
    propsSchema: splitTextSchema,
  },
  {
    name: 'TextCursor',
    description: 'Typewriter effect with blinking cursor. Use when user wants typing animation.',
    component: TextCursor,
    propsSchema: textCursorSchema,
  },
  {
    name: 'BlurText',
    description: 'Blur fade-in text animation. Use when user wants blur reveal effect.',
    component: BlurText,
    propsSchema: blurTextSchema,
  },
];
