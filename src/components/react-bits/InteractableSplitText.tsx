import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';
import { SplitText } from './text/SplitText';

const SplitTextPropsSchema = z.object({
  text: z.string().describe('The text to animate'),
  delay: z.number().optional().describe('Delay in seconds before animation starts'),
  duration: z.number().optional().describe('Animation duration in seconds'),
  animateBy: z.enum(['characters', 'words']).describe('Animation unit: characters or words'),
  className: z.string().optional().describe('Tailwind CSS classes'),
});

export const InteractableSplitText = withInteractable(SplitText, {
  componentName: 'SplitText',
  description:
    'Character or word reveal animation. AI can change text, speed (duration), delay, animateBy (characters/words), or className (e.g. color).',
  propsSchema: SplitTextPropsSchema,
});
