/**
 * React-Bits Best Practices Skill
 * Quality standards and best practices for text animation components.
 */

export const ReactBitsBestPracticesSkill = {
  name: 'React-Bits Animation Best Practices',
  version: '1.0.0',

  description: `
    This skill embeds React-Bits quality standards and best practices
    for creating beautiful, performant, and accessible animations.
  `,

  whenToUse: [
    'Creating or modifying any animation component',
    'User asks for recommendations or improvements',
    'Optimizing existing animations',
    'Ensuring accessibility compliance',
  ],

  categories: {
    animationTiming: {
      description: 'Guidelines for animation duration and timing',
      rules: [
        {
          rule: 'Fast animations (0.2-0.3s)',
          use: 'Buttons, small UI elements, micro-interactions',
          reasoning: 'Quick feedback keeps interface responsive',
        },
        {
          rule: 'Medium animations (0.5-0.8s)',
          use: 'Text reveals, cards, content transitions',
          reasoning: 'Balanced speed - noticeable but not slow',
        },
        {
          rule: 'Slow animations (1-2s)',
          use: 'Hero sections, main headings, emphasis',
          reasoning: 'Dramatic effect for key content',
        },
        {
          rule: 'Never exceed 3s',
          use: 'None - too slow',
          reasoning: 'Users will get impatient',
        },
      ],
      examples: {
        button: 'duration: 0.3',
        heading: 'duration: 0.6',
        hero: 'duration: 1.2',
      },
    },

    textAnimation: {
      description: 'Best practices for animating text',
      rules: [
        {
          element: 'Headlines and headings',
          recommendation: 'Use word-by-word animation',
          reasoning:
            'More dramatic, easier to read during animation',
        },
        {
          element: 'Body text and paragraphs',
          recommendation: 'Use character-by-character animation',
          reasoning: 'Smoother flow, less jarring',
        },
        {
          element: 'Short phrases (< 5 words)',
          recommendation: 'Either approach works',
          reasoning: 'User preference or context-dependent',
        },
        {
          element: 'Code or monospace text',
          recommendation: 'Use TextCursor component',
          reasoning: 'Matches terminal/coding aesthetic',
        },
      ],
      staggerTiming: {
        characters: '0.02-0.04s between each',
        words: '0.05-0.08s between each',
        reasoning:
          'Creates smooth reveal without being too slow',
      },
    },

    colorAndStyling: {
      description: 'Color and visual styling guidelines',
      rules: [
        {
          aspect: 'Color selection',
          guideline: 'Use Tailwind color scales',
          examples: [
            'text-blue-600',
            'text-purple-500',
            'text-gray-900',
          ],
          avoid: ['Arbitrary hex values', 'RGB colors'],
        },
        {
          aspect: 'Contrast',
          guideline: 'Ensure WCAG AA minimum (4.5:1 for normal text)',
          tools: [
            "Use Tailwind's built-in scales",
            'Test with contrast checker',
          ],
          critical:
            'Text must be readable during entire animation',
        },
        {
          aspect: 'Brand consistency',
          guideline: 'Match existing brand colors when known',
          fallback: 'Use neutral grays or blue scale as default',
        },
        {
          aspect: 'Text sizing',
          guideline: 'Follow typographic scale',
          scale: {
            hero: 'text-6xl or text-7xl',
            heading: 'text-4xl or text-5xl',
            subheading: 'text-2xl or text-3xl',
            body: 'text-base or text-lg',
          },
        },
      ],
    },

    performance: {
      description: 'Performance optimization guidelines',
      rules: [
        {
          rule: 'Limit simultaneous animations',
          limit: '3-5 elements at once',
          reasoning:
            'Too many animations create visual chaos and performance issues',
        },
        {
          rule: 'Use CSS transforms',
          prefer: 'transform, opacity',
          avoid: 'width, height, top, left',
          reasoning: 'Transforms are GPU-accelerated and performant',
        },
        {
          rule: 'Stagger element reveals',
          technique: 'Use delays between similar elements',
          example: 'delay: index * 0.1',
          reasoning: 'Reduces simultaneous work, creates flow',
        },
        {
          rule: 'Optimize re-renders',
          technique: 'Avoid animating on every state change',
          solution: 'Use animation keys or debounce',
          reasoning: 'Reduces unnecessary work',
        },
      ],
    },

    accessibility: {
      description: 'Ensuring animations are accessible',
      rules: [
        {
          requirement: 'Respect prefers-reduced-motion',
          implementation:
            'Disable or simplify animations when requested',
          code: `
            @media (prefers-reduced-motion: reduce) {
              * {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
              }
            }
          `,
          critical: 'Legal requirement in many jurisdictions',
        },
        {
          requirement: 'Maintain readability',
          guideline:
            'Text must be readable at all animation stages',
          checks: [
            'No extreme blur (max 15px)',
            'No complete transparency during key frames',
            'No extreme scaling (0.8-1.2 range)',
          ],
        },
        {
          requirement: 'Provide controls',
          options: [
            'Skip animation button',
            'Pause/play toggle',
            'Speed controls',
          ],
          useCase: 'Long or complex animations',
        },
        {
          requirement: 'Avoid seizure triggers',
          avoid: [
            'Rapid flashing (>3 per second)',
            'Extreme color changes',
            'Strobing effects',
          ],
          critical: 'Health and safety requirement',
        },
      ],
    },

    userExperience: {
      description: 'UX considerations for animations',
      principles: [
        {
          principle: 'Purposeful animation',
          guideline: 'Every animation should serve a purpose',
          purposes: [
            'Draw attention',
            'Indicate change',
            'Provide feedback',
            'Enhance brand',
          ],
          avoid: 'Animation for animation\'s sake',
        },
        {
          principle: 'Consistent timing',
          guideline: 'Similar elements should animate similarly',
          example: 'All headings use same duration',
          reasoning: 'Creates predictable, cohesive experience',
        },
        {
          principle: 'Respect user attention',
          guideline: "Don't distract from content",
          rule: 'Animations should enhance, not overpower',
          test: 'Can user focus on content during animation?',
        },
        {
          principle: 'Progressive enhancement',
          guideline: 'Content should work without animations',
          implementation:
            'Animations are enhancements, not requirements',
          fallback: 'Static content when animations disabled',
        },
      ],
    },
  },

  quickReference: {
    'Creating heading': {
      component: 'SplitText',
      props: {
        animateBy: 'words',
        duration: 0.6,
        className: 'text-5xl font-bold',
      },
    },
    'Creating subtitle': {
      component: 'SplitText',
      props: { animateBy: 'characters', duration: 0.5, className: 'text-2xl' },
    },
    'Typing effect': {
      component: 'TextCursor',
      props: { speed: 50, className: 'text-xl font-mono' },
    },
    'Smooth reveal': {
      component: 'BlurText',
      props: {
        animateBy: 'characters',
        duration: 0.8,
        blurAmount: 10,
      },
    },
    'Fast button': {
      component: 'Any',
      props: { duration: 0.3 },
    },
    'Dramatic hero': {
      component: 'BlurText',
      props: {
        animateBy: 'words',
        duration: 1.2,
        className: 'text-7xl font-bold',
      },
    },
  },

  checklistBeforeApplying: [
    'Animation serves clear purpose',
    'Duration is appropriate (0.1-3s range)',
    'Text remains readable during animation',
    'Colors have sufficient contrast (WCAG AA)',
    'Not too many simultaneous animations (max 5)',
    'Respects prefers-reduced-motion',
    'Consistent with other similar elements',
    'Performance tested (smooth 60fps)',
  ],
} as const;
