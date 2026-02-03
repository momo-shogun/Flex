/**
 * Component Modification Skill
 * Step-by-step guidance for modifying text animation components in Flex.
 */

export const ComponentModificationSkill = {
  name: 'Modify React-Bits Components',
  version: '1.0.0',

  description: `
    This skill provides step-by-step guidance for modifying text animation
    components in the Flex design system. It ensures consistent, user-friendly
    modifications that maintain component integrity and visual quality.
  `,

  whenToUse: [
    'User asks to change component properties (text, speed, color)',
    'User wants to adjust animation behavior',
    'User requests styling changes',
    'User wants to fine-tune visual effects',
  ],

  steps: [
    {
      step: 1,
      action: 'Identify Target Component',
      details:
        'Determine which component the user is referring to by analyzing context, component IDs, or recent interactions',
    },
    {
      step: 2,
      action: 'Parse User Intent',
      details:
        'Understand what properties need to change based on natural language request',
    },
    {
      step: 3,
      action: 'Map to Props',
      details: "Convert user's natural language to specific prop changes",
      examples: {
        'make it faster': { prop: 'duration', change: 'decrease by 0.2s' },
        'blue color': { prop: 'className', change: 'add text-blue-600' },
        'animate by words': { prop: 'animateBy', change: "set to 'words'" },
      },
    },
    {
      step: 4,
      action: 'Validate Changes',
      details:
        "Ensure new values are valid and won't break the component",
      validations: [
        'duration must be between 0.1s and 3s',
        'colors must be valid Tailwind classes',
        "animateBy must be 'characters' or 'words'",
        'text must not be empty',
      ],
    },
    {
      step: 5,
      action: 'Update Component',
      details: "Use Tambo's updateProps tool to modify the component",
      code: `
        updateProps(componentId, {
          ...currentProps,
          [propName]: newValue
        })
      `,
    },
    {
      step: 6,
      action: 'Confirm with User',
      details: 'Provide clear feedback about what was changed',
      template:
        'I\'ve updated the [component] to [change]. [Additional context if needed]',
    },
  ],

  examples: [
    {
      userRequest: 'Make the header animation faster',
      analysis: 'User wants to speed up animation',
      propChange: { duration: 0.3 },
      response:
        "I've made the header animation faster by reducing the duration to 0.3 seconds.",
    },
    {
      userRequest: 'Change the subtitle color to blue',
      analysis: 'User wants blue text color',
      propChange: { className: 'text-2xl text-blue-600' },
      response: "I've changed the subtitle color to blue.",
    },
    {
      userRequest: 'Make it animate word by word instead',
      analysis: 'User wants word-based animation',
      propChange: { animateBy: 'words' },
      response:
        "I've updated the animation to reveal word by word instead of character by character.",
    },
  ],

  bestPractices: [
    'Always preserve other props when updating one property',
    'Validate color values are valid Tailwind classes before applying',
    'Keep duration between 0.1s and 3s for good UX',
    'When changing text, ensure it\'s appropriate length for animation',
    'If unsure about user intent, ask clarifying questions',
    'Provide visual confirmation when possible (e.g., highlight changed component)',
  ],

  commonMistakes: [
    {
      mistake: 'Replacing all props instead of merging',
      correct: 'Spread existing props and only change target prop',
    },
    {
      mistake: 'Using invalid Tailwind classes',
      correct: "Validate against Tailwind color scale before applying",
    },
    {
      mistake: 'Setting extreme duration values',
      correct: 'Clamp duration between reasonable bounds (0.1-3s)',
    },
  ],
} as const;
