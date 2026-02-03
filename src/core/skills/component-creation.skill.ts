/**
 * Component Creation Skill
 * Guides AI in selecting and creating appropriate text animation components.
 */

export const ComponentCreationSkill = {
  name: 'Create Text Animation Components',
  version: '1.0.0',

  description: `
    This skill guides the AI in selecting and creating appropriate text
    animation components based on user requests. It ensures the right
    component type is chosen with optimal default settings.
  `,

  whenToUse: [
    'User asks to create new text or headings',
    'User wants to add animations to their design',
    'User describes a text effect they want to see',
    'User asks for examples or demonstrations',
  ],

  steps: [
    {
      step: 1,
      action: 'Analyze User Intent',
      details: 'Understand what kind of text and animation the user wants',
      questions: [
        'What type of text? (heading, subtitle, body)',
        'What animation style? (reveal, typing, blur)',
        "What's the purpose? (emphasis, introduction, decoration)",
      ],
    },
    {
      step: 2,
      action: 'Select Component Type',
      details: 'Choose the most appropriate animation component',
      decisionTree: {
        "Wants typing effect OR mentions 'cursor'": 'TextCursor',
        "Wants smooth reveal OR mentions 'blur'": 'BlurText',
        "General animation OR mentions 'reveal'": 'SplitText',
        'Default choice': 'SplitText',
      },
    },
    {
      step: 3,
      action: 'Determine Props',
      details: 'Set appropriate props based on context and best practices',
      defaults: {
        SplitText: {
          animateBy: 'words',
          duration: 0.5,
          delay: 0,
          className: 'text-4xl font-bold',
        },
        TextCursor: {
          speed: 50,
          delay: 0,
          cursor: '|',
          className: 'text-2xl',
        },
        BlurText: {
          animateBy: 'characters',
          duration: 0.8,
          blurAmount: 10,
          className: 'text-3xl font-semibold',
        },
      },
    },
    {
      step: 4,
      action: 'Apply Context-Specific Adjustments',
      details: 'Customize based on specific requirements',
      rules: [
        'Headlines: Larger text (text-5xl/text-6xl), word animation',
        'Subtitles: Medium text (text-2xl/text-3xl), slower speed',
        'Body: Smaller text (text-base/text-lg), character animation',
        'Emphasis: Bright colors, slower animation',
        'Decorative: Subtle colors, faster animation',
      ],
    },
    {
      step: 5,
      action: 'Generate Component',
      details: 'Create the component with determined props',
      code: `
        <GenerativeSplitText
          text={userText}
          animateBy={selectedAnimateBy}
          duration={calculatedDuration}
          className={contextualClasses}
        />
      `,
    },
    {
      step: 6,
      action: 'Explain Creation',
      details: 'Tell user what was created and why',
      template:
        "I've created a [component type] with [characteristics]. [Why this choice was made]",
    },
  ],

  examples: [
    {
      userRequest: "Create a heading that says 'Welcome to Flex'",
      analysis: 'User wants a heading - use large text, word animation',
      componentChoice: 'SplitText',
      props: {
        text: 'Welcome to Flex',
        animateBy: 'words',
        duration: 0.6,
        className: 'text-6xl font-bold text-gray-900',
      },
      reasoning:
        'SplitText with word animation creates dramatic reveals perfect for headings',
    },
    {
      userRequest: "Add a typing effect saying 'Loading...'",
      analysis: 'User specifically wants typing effect',
      componentChoice: 'TextCursor',
      props: {
        text: 'Loading...',
        speed: 100,
        cursor: '_',
        className: 'text-xl font-mono text-gray-600',
      },
      reasoning: 'TextCursor creates classic typewriter effect as requested',
    },
    {
      userRequest: "Show smooth animated text 'AI-Powered Design'",
      analysis: 'User wants smooth animation - blur effect works well',
      componentChoice: 'BlurText',
      props: {
        text: 'AI-Powered Design',
        animateBy: 'characters',
        duration: 1,
        blurAmount: 12,
        className: 'text-4xl font-bold text-blue-600',
      },
      reasoning: 'BlurText provides smooth, professional reveal effect',
    },
  ],

  bestPractices: [
    'Match animation style to content purpose (emphasis vs decoration)',
    'Use word animation for short phrases, character for longer text',
    'Choose colors that provide good contrast (WCAG AA minimum)',
    'Set appropriate text sizes based on hierarchy',
    'Add appropriate delays when multiple animations appear together',
    'Keep total animation time under 2 seconds for UX',
  ],

  componentSelectionGuide: {
    SplitText: {
      bestFor: ['Headings', 'Short phrases', 'Dramatic reveals'],
      characteristics: 'Staggered reveal, versatile, clean',
      whenToUse: 'Default choice for most text animations',
    },
    TextCursor: {
      bestFor: ['Code snippets', 'Terminal-like text', 'Loading messages'],
      characteristics: 'Sequential typing, retro feel, cursor blink',
      whenToUse: 'When user wants typewriter or terminal effect',
    },
    BlurText: {
      bestFor: ['Smooth reveals', 'Professional headings', 'Hero sections'],
      characteristics: 'Blur fade-in, elegant, modern',
      whenToUse: 'When user wants smooth, professional animation',
    },
  },
} as const;
