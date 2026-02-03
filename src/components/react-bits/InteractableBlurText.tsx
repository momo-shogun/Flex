import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';
import { BlurText } from './text/BlurText';

const BlurTextPropsSchema = z.object({
  text: z.string().describe('The text to animate'),
  delay: z.number().optional().describe('Delay in seconds before animation starts'),
  duration: z.number().optional().describe('Animation duration in seconds'),
  animateBy: z.enum(['characters', 'words']).describe('Animation unit: characters or words'),
  blurAmount: z.number().optional().describe('Blur intensity in pixels'),
  className: z.string().optional().describe('Tailwind CSS classes'),
});

export const InteractableBlurText = withInteractable(BlurText, {
  componentName: 'BlurText',
  description:
    'Blur fade-in text animation. AI can change text, duration, delay, animateBy, blurAmount, or className (e.g. color).',
  propsSchema: BlurTextPropsSchema,
});
