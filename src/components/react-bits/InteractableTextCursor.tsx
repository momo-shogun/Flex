import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';
import { TextCursor } from './text/TextCursor';

const TextCursorPropsSchema = z.object({
  text: z.string().describe('The text to type out'),
  speed: z.number().optional().describe('Typing speed in ms per character (lower = faster)'),
  delay: z.number().optional().describe('Delay in ms before typing starts'),
  cursor: z.string().optional().describe('Cursor character (e.g. | or _)'),
  cursorClassName: z.string().optional().describe('Tailwind classes for the cursor'),
  className: z.string().optional().describe('Tailwind CSS classes'),
});

export const InteractableTextCursor = withInteractable(TextCursor, {
  componentName: 'TextCursor',
  description:
    'Typewriter effect with blinking cursor. AI can change text, speed, delay, cursor character, or className (e.g. color).',
  propsSchema: TextCursorPropsSchema,
});
