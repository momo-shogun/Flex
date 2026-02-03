# 🧠 Skills System Guide
## Reusable AI Capabilities for Flex

---

## 🎯 What Are Skills?

Skills are **reusable capabilities** that provide procedural knowledge to AI agents. They enhance your Tambo-powered application with:

- ✅ **Step-by-step instructions** for common tasks
- ✅ **Best practices** and guidelines
- ✅ **Domain expertise** specific to your use case
- ✅ **Reusable workflows** that ensure consistency

Think of skills as "training manuals" that teach the AI how to handle specific situations.

---

## 📚 Flex Skills Library

### 1. Component Modification Skill

**Purpose:** Teach AI how to modify React-Bits components correctly

**File:** `src/core/skills/component-modification.skill.ts`

```typescript
export const ComponentModificationSkill = {
  name: "Modify React-Bits Components",
  version: "1.0.0",
  
  description: `
    This skill provides step-by-step guidance for modifying text animation
    components in the Flex design system. It ensures consistent, user-friendly
    modifications that maintain component integrity and visual quality.
  `,
  
  whenToUse: [
    "User asks to change component properties (text, speed, color)",
    "User wants to adjust animation behavior",
    "User requests styling changes",
    "User wants to fine-tune visual effects"
  ],
  
  steps: [
    {
      step: 1,
      action: "Identify Target Component",
      details: "Determine which component the user is referring to by analyzing context, component IDs, or recent interactions"
    },
    {
      step: 2,
      action: "Parse User Intent",
      details: "Understand what properties need to change based on natural language request"
    },
    {
      step: 3,
      action: "Map to Props",
      details: "Convert user's natural language to specific prop changes",
      examples: {
        "make it faster": { prop: "duration", change: "decrease by 0.2s" },
        "blue color": { prop: "className", change: "add text-blue-600" },
        "animate by words": { prop: "animateBy", change: "set to 'words'" }
      }
    },
    {
      step: 4,
      action: "Validate Changes",
      details: "Ensure new values are valid and won't break the component",
      validations: [
        "duration must be between 0.1s and 3s",
        "colors must be valid Tailwind classes",
        "animateBy must be 'characters' or 'words'",
        "text must not be empty"
      ]
    },
    {
      step: 5,
      action: "Update Component",
      details: "Use Tambo's updateProps tool to modify the component",
      code: `
        updateProps(componentId, {
          ...currentProps,
          [propName]: newValue
        })
      `
    },
    {
      step: 6,
      action: "Confirm with User",
      details: "Provide clear feedback about what was changed",
      template: "I've updated the [component] to [change]. [Additional context if needed]"
    }
  ],
  
  examples: [
    {
      userRequest: "Make the header animation faster",
      analysis: "User wants to speed up animation",
      propChange: { duration: 0.3 },
      response: "I've made the header animation faster by reducing the duration to 0.3 seconds."
    },
    {
      userRequest: "Change the subtitle color to blue",
      analysis: "User wants blue text color",
      propChange: { className: "text-2xl text-blue-600" },
      response: "I've changed the subtitle color to blue."
    },
    {
      userRequest: "Make it animate word by word instead",
      analysis: "User wants word-based animation",
      propChange: { animateBy: "words" },
      response: "I've updated the animation to reveal word by word instead of character by character."
    }
  ],
  
  bestPractices: [
    "Always preserve other props when updating one property",
    "Validate color values are valid Tailwind classes before applying",
    "Keep animation duration between 0.1s and 3s for good UX",
    "When changing text, ensure it's appropriate length for animation",
    "If unsure about user intent, ask clarifying questions",
    "Provide visual confirmation when possible (e.g., highlight changed component)"
  ],
  
  commonMistakes: [
    {
      mistake: "Replacing all props instead of merging",
      correct: "Spread existing props and only change target prop"
    },
    {
      mistake: "Using invalid Tailwind classes",
      correct: "Validate against Tailwind color scale before applying"
    },
    {
      mistake: "Setting extreme duration values",
      correct: "Clamp duration between reasonable bounds (0.1-3s)"
    }
  ]
};
```

---

### 2. Component Creation Skill

**Purpose:** Guide AI in creating new text animation components

**File:** `src/core/skills/component-creation.skill.ts`

```typescript
export const ComponentCreationSkill = {
  name: "Create Text Animation Components",
  version: "1.0.0",
  
  description: `
    This skill guides the AI in selecting and creating appropriate text
    animation components based on user requests. It ensures the right
    component type is chosen with optimal default settings.
  `,
  
  whenToUse: [
    "User asks to create new text or headings",
    "User wants to add animations to their design",
    "User describes a text effect they want to see",
    "User asks for examples or demonstrations"
  ],
  
  steps: [
    {
      step: 1,
      action: "Analyze User Intent",
      details: "Understand what kind of text and animation the user wants",
      questions: [
        "What type of text? (heading, subtitle, body)",
        "What animation style? (reveal, typing, blur)",
        "What's the purpose? (emphasis, introduction, decoration)"
      ]
    },
    {
      step: 2,
      action: "Select Component Type",
      details: "Choose the most appropriate animation component",
      decisionTree: {
        "Wants typing effect OR mentions 'cursor'": "TextCursor",
        "Wants smooth reveal OR mentions 'blur'": "BlurText",
        "General animation OR mentions 'reveal'": "SplitText",
        "Default choice": "SplitText"
      }
    },
    {
      step: 3,
      action: "Determine Props",
      details: "Set appropriate props based on context and best practices",
      defaults: {
        SplitText: {
          animateBy: "words", // for headings
          duration: 0.5,
          delay: 0,
          className: "text-4xl font-bold"
        },
        TextCursor: {
          speed: 50,
          delay: 0,
          cursor: "|",
          className: "text-2xl"
        },
        BlurText: {
          animateBy: "characters",
          duration: 0.8,
          blurAmount: 10,
          className: "text-3xl font-semibold"
        }
      }
    },
    {
      step: 4,
      action: "Apply Context-Specific Adjustments",
      details: "Customize based on specific requirements",
      rules: [
        "Headlines: Larger text (text-5xl/text-6xl), word animation",
        "Subtitles: Medium text (text-2xl/text-3xl), slower speed",
        "Body: Smaller text (text-base/text-lg), character animation",
        "Emphasis: Bright colors, slower animation",
        "Decorative: Subtle colors, faster animation"
      ]
    },
    {
      step: 5,
      action: "Generate Component",
      details: "Create the component with determined props",
      code: `
        <GenerativeSplitText
          text={userText}
          animateBy={selectedAnimateBy}
          duration={calculatedDuration}
          className={contextualClasses}
        />
      `
    },
    {
      step: 6,
      action: "Explain Creation",
      details: "Tell user what was created and why",
      template: "I've created a [component type] with [characteristics]. [Why this choice was made]"
    }
  ],
  
  examples: [
    {
      userRequest: "Create a heading that says 'Welcome to Flex'",
      analysis: "User wants a heading - use large text, word animation",
      componentChoice: "SplitText",
      props: {
        text: "Welcome to Flex",
        animateBy: "words",
        duration: 0.6,
        className: "text-6xl font-bold text-gray-900"
      },
      reasoning: "SplitText with word animation creates dramatic reveals perfect for headings"
    },
    {
      userRequest: "Add a typing effect saying 'Loading...'",
      analysis: "User specifically wants typing effect",
      componentChoice: "TextCursor",
      props: {
        text: "Loading...",
        speed: 100,
        cursor: "_",
        className: "text-xl font-mono text-gray-600"
      },
      reasoning: "TextCursor creates classic typewriter effect as requested"
    },
    {
      userRequest: "Show smooth animated text 'AI-Powered Design'",
      analysis: "User wants smooth animation - blur effect works well",
      componentChoice: "BlurText",
      props: {
        text: "AI-Powered Design",
        animateBy: "characters",
        duration: 1,
        blurAmount: 12,
        className: "text-4xl font-bold text-blue-600"
      },
      reasoning: "BlurText provides smooth, professional reveal effect"
    }
  ],
  
  bestPractices: [
    "Match animation style to content purpose (emphasis vs decoration)",
    "Use word animation for short phrases, character for longer text",
    "Choose colors that provide good contrast (WCAG AA minimum)",
    "Set appropriate text sizes based on hierarchy",
    "Add appropriate delays when multiple animations appear together",
    "Keep total animation time under 2 seconds for UX"
  ],
  
  componentSelectionGuide: {
    SplitText: {
      bestFor: ["Headings", "Short phrases", "Dramatic reveals"],
      characteristics: "Staggered reveal, versatile, clean",
      whenToUse: "Default choice for most text animations"
    },
    TextCursor: {
      bestFor: ["Code snippets", "Terminal-like text", "Loading messages"],
      characteristics: "Sequential typing, retro feel, cursor blink",
      whenToUse: "When user wants typewriter or terminal effect"
    },
    BlurText: {
      bestFor: ["Smooth reveals", "Professional headings", "Hero sections"],
      characteristics: "Blur fade-in, elegant, modern",
      whenToUse: "When user wants smooth, professional animation"
    }
  }
};
```

---

### 3. React-Bits Best Practices Skill

**Purpose:** Ensure all animations follow React-Bits quality standards

**File:** `src/core/skills/react-bits-best-practices.skill.ts`

```typescript
export const ReactBitsBestPracticesSkill = {
  name: "React-Bits Animation Best Practices",
  version: "1.0.0",
  
  description: `
    This skill embeds React-Bits quality standards and best practices
    for creating beautiful, performant, and accessible animations.
  `,
  
  whenToUse: [
    "Creating or modifying any animation component",
    "User asks for recommendations or improvements",
    "Optimizing existing animations",
    "Ensuring accessibility compliance"
  ],
  
  categories: {
    
    animationTiming: {
      description: "Guidelines for animation duration and timing",
      
      rules: [
        {
          rule: "Fast animations (0.2-0.3s)",
          use: "Buttons, small UI elements, micro-interactions",
          reasoning: "Quick feedback keeps interface responsive"
        },
        {
          rule: "Medium animations (0.5-0.8s)",
          use: "Text reveals, cards, content transitions",
          reasoning: "Balanced speed - noticeable but not slow"
        },
        {
          rule: "Slow animations (1-2s)",
          use: "Hero sections, main headings, emphasis",
          reasoning: "Dramatic effect for key content"
        },
        {
          rule: "Never exceed 3s",
          use: "None - too slow",
          reasoning: "Users will get impatient"
        }
      ],
      
      examples: {
        button: "duration: 0.3",
        heading: "duration: 0.6",
        hero: "duration: 1.2"
      }
    },
    
    textAnimation: {
      description: "Best practices for animating text",
      
      rules: [
        {
          element: "Headlines and headings",
          recommendation: "Use word-by-word animation",
          reasoning: "More dramatic, easier to read during animation"
        },
        {
          element: "Body text and paragraphs",
          recommendation: "Use character-by-character animation",
          reasoning: "Smoother flow, less jarring"
        },
        {
          element: "Short phrases (< 5 words)",
          recommendation: "Either approach works",
          reasoning: "User preference or context-dependent"
        },
        {
          element: "Code or monospace text",
          recommendation: "Use TextCursor component",
          reasoning: "Matches terminal/coding aesthetic"
        }
      ],
      
      staggerTiming: {
        characters: "0.02-0.04s between each",
        words: "0.05-0.08s between each",
        reasoning: "Creates smooth reveal without being too slow"
      }
    },
    
    colorAndStyling: {
      description: "Color and visual styling guidelines",
      
      rules: [
        {
          aspect: "Color selection",
          guideline: "Use Tailwind color scales",
          examples: ["text-blue-600", "text-purple-500", "text-gray-900"],
          avoid: ["Arbitrary hex values", "RGB colors"]
        },
        {
          aspect: "Contrast",
          guideline: "Ensure WCAG AA minimum (4.5:1 for normal text)",
          tools: ["Use Tailwind's built-in scales", "Test with contrast checker"],
          critical: "Text must be readable during entire animation"
        },
        {
          aspect: "Brand consistency",
          guideline: "Match existing brand colors when known",
          fallback: "Use neutral grays or blue scale as default"
        },
        {
          aspect: "Text sizing",
          guideline: "Follow typographic scale",
          scale: {
            hero: "text-6xl or text-7xl",
            heading: "text-4xl or text-5xl",
            subheading: "text-2xl or text-3xl",
            body: "text-base or text-lg"
          }
        }
      ]
    },
    
    performance: {
      description: "Performance optimization guidelines",
      
      rules: [
        {
          rule: "Limit simultaneous animations",
          limit: "3-5 elements at once",
          reasoning: "Too many animations create visual chaos and performance issues"
        },
        {
          rule: "Use CSS transforms",
          prefer: "transform, opacity",
          avoid: "width, height, top, left",
          reasoning: "Transforms are GPU-accelerated and performant"
        },
        {
          rule: "Stagger element reveals",
          technique: "Use delays between similar elements",
          example: "delay: index * 0.1",
          reasoning: "Reduces simultaneous work, creates flow"
        },
        {
          rule: "Optimize re-renders",
          technique: "Avoid animating on every state change",
          solution: "Use animation keys or debounce",
          reasoning: "Reduces unnecessary work"
        }
      ]
    },
    
    accessibility: {
      description: "Ensuring animations are accessible",
      
      rules: [
        {
          requirement: "Respect prefers-reduced-motion",
          implementation: "Disable or simplify animations when requested",
          code: `
            @media (prefers-reduced-motion: reduce) {
              * {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
              }
            }
          `,
          critical: "Legal requirement in many jurisdictions"
        },
        {
          requirement: "Maintain readability",
          guideline: "Text must be readable at all animation stages",
          checks: [
            "No extreme blur (max 15px)",
            "No complete transparency during key frames",
            "No extreme scaling (0.8-1.2 range)"
          ]
        },
        {
          requirement: "Provide controls",
          options: ["Skip animation button", "Pause/play toggle", "Speed controls"],
          useCase: "Long or complex animations"
        },
        {
          requirement: "Avoid seizure triggers",
          avoid: ["Rapid flashing (>3 per second)", "Extreme color changes", "Strobing effects"],
          critical: "Health and safety requirement"
        }
      ]
    },
    
    userExperience: {
      description: "UX considerations for animations",
      
      principles: [
        {
          principle: "Purposeful animation",
          guideline: "Every animation should serve a purpose",
          purposes: ["Draw attention", "Indicate change", "Provide feedback", "Enhance brand"],
          avoid: "Animation for animation's sake"
        },
        {
          principle: "Consistent timing",
          guideline: "Similar elements should animate similarly",
          example: "All headings use same duration",
          reasoning: "Creates predictable, cohesive experience"
        },
        {
          principle: "Respect user attention",
          guideline: "Don't distract from content",
          rule: "Animations should enhance, not overpower",
          test: "Can user focus on content during animation?"
        },
        {
          principle: "Progressive enhancement",
          guideline: "Content should work without animations",
          implementation: "Animations are enhancements, not requirements",
          fallback: "Static content when animations disabled"
        }
      ]
    }
  },
  
  quickReference: {
    "Creating heading": {
      component: "SplitText",
      props: { animateBy: "words", duration: 0.6, className: "text-5xl font-bold" }
    },
    "Creating subtitle": {
      component: "SplitText",
      props: { animateBy: "characters", duration: 0.5, className: "text-2xl" }
    },
    "Typing effect": {
      component: "TextCursor",
      props: { speed: 50, className: "text-xl font-mono" }
    },
    "Smooth reveal": {
      component: "BlurText",
      props: { animateBy: "characters", duration: 0.8, blurAmount: 10 }
    },
    "Fast button": {
      component: "Any",
      props: { duration: 0.3 }
    },
    "Dramatic hero": {
      component: "BlurText",
      props: { animateBy: "words", duration: 1.2, className: "text-7xl font-bold" }
    }
  },
  
  checklistBeforeApplying: [
    "☐ Animation serves clear purpose",
    "☐ Duration is appropriate (0.1-3s range)",
    "☐ Text remains readable during animation",
    "☐ Colors have sufficient contrast (WCAG AA)",
    "☐ Not too many simultaneous animations (max 5)",
    "☐ Respects prefers-reduced-motion",
    "☐ Consistent with other similar elements",
    "☐ Performance tested (smooth 60fps)"
  ]
};
```

---

## 🔧 Implementation Guide

### Step 1: Create Skills Directory

```bash
mkdir -p src/core/skills
```

### Step 2: Create Skill Files

Save each skill definition in its own file:
- `component-modification.skill.ts`
- `component-creation.skill.ts`
- `react-bits-best-practices.skill.ts`

### Step 3: Create Skills Index

```typescript
// src/core/skills/index.ts

export { ComponentModificationSkill } from './component-modification.skill';
export { ComponentCreationSkill } from './component-creation.skill';
export { ReactBitsBestPracticesSkill } from './react-bits-best-practices.skill';

export const AllSkills = [
  ComponentModificationSkill,
  ComponentCreationSkill,
  ReactBitsBestPracticesSkill
];
```

### Step 4: Register with Tambo

```typescript
// src/config/tambo.config.ts

import { AllSkills } from '@/core/skills';

export const tamboConfig = {
  apiKey: process.env.VITE_TAMBO_API_KEY,
  
  // Register skills
  skills: AllSkills,
  
  // Other config...
  generativeComponents: [...],
  features: {
    skills: true,
    generativeComponents: true,
    interactableComponents: true
  }
};
```

---

## 📋 Skills Checklist

- [ ] Create skills directory
- [ ] Implement Component Modification Skill
- [ ] Implement Component Creation Skill
- [ ] Implement React-Bits Best Practices Skill
- [ ] Create skills index file
- [ ] Register skills with Tambo config
- [ ] Test each skill with example prompts
- [ ] Verify AI follows skill guidelines
- [ ] Document custom skills for your team

---

## 🧪 Testing Skills

### Test Component Modification Skill

```
User: "Make the header faster"
Expected: AI reduces duration, explains change
Verify: Component actually updates, duration is valid

User: "Change color to blue"
Expected: AI applies text-blue-600, preserves other props
Verify: Color changes, other styling intact

User: "Make it animate by words"
Expected: AI sets animateBy to "words"
Verify: Animation switches to word-based
```

### Test Component Creation Skill

```
User: "Create a heading saying 'Welcome'"
Expected: AI chooses SplitText, word animation, large text
Verify: Appropriate component and props

User: "Add a typing effect"
Expected: AI chooses TextCursor
Verify: Cursor animation appears

User: "Show smooth animated text"
Expected: AI chooses BlurText
Verify: Blur effect works
```

### Test Best Practices Skill

```
User: "Make it better"
Expected: AI applies best practices (timing, colors, etc.)
Verify: Improvements follow guidelines

User: "Is this animation good?"
Expected: AI references best practices to evaluate
Verify: Feedback is helpful and accurate
```

---

## 📚 Resources

- **[Tambo Skills Documentation](https://docs.tambo.co)** (hypothetical)
- **[React-Bits GitHub](https://github.com/DavidHDev/react-bits)**
- **[WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)**
- **[Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)**

---

**Skills enhance karo aur AI ko expert banao! 🧠✨**
