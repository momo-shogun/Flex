# 🤖 Tambo Concepts - Complete Guide
## Generative UI aur Interactable Components

**Source:** [Tambo Documentation](https://docs.tambo.co/concepts/generative-interfaces)

---

## 📖 Table of Contents

1. [Generative User Interfaces](#generative-user-interfaces)
2. [Generative Components](#generative-components)
3. [Interactable Components](#interactable-components)
4. [Component State](#component-state)
5. [Flex Implementation Strategy](#flex-implementation-strategy)
6. [Skills System](#skills-system)

---

## 🎨 Generative User Interfaces

### Traditional vs Generative UI

**Traditional UI:**
- Fixed, predetermined layouts
- Users navigate menus and forms
- Must know where to find features
- Interface is static

**Generative UI (Tambo):**
- Interfaces created on-demand
- Users describe what they want in natural language
- AI renders appropriate components in real-time
- Interface adapts to users

### Example

```
User: "Show me sales data"
Traditional: User navigates to dashboard → selects filters → configures view
Generative: AI renders interactive chart component with data instantly
```

---

## 🧩 Generative Components

### What Are Generative Components?

Tambo creates new component instances in response to user messages. When a user asks for information or functionality, Tambo:

1. **Selects** an appropriate component from your library
2. **Generates** the data to populate it
3. **Includes** it in the response message

### How It Works

**You Provide:**
- React components
- Descriptions of when/how to use each component

**Tambo Automatically:**
- Uses appropriate components when responding
- Populates them with data
- Renders them in real-time

### Implementation in Flex

```typescript
// src/components/generative/GenerativeTextAnimation.tsx

import { withGenerative } from '@tambo/react';
import { SplitText } from '@/components/react-bits/text/SplitText';

export const GenerativeSplitText = withGenerative(SplitText, {
  componentName: "SplitText",
  description: "Character or word reveal animation for text",
  usage: "Use when user wants animated text reveal",
  propsSchema: {
    text: { type: "string", description: "Text to animate" },
    animateBy: { 
      type: "enum", 
      values: ["characters", "words"],
      description: "Animation unit"
    },
    delay: { type: "number", description: "Delay before animation starts" },
    duration: { type: "number", description: "Animation duration" },
    className: { type: "string", description: "Tailwind classes" }
  }
});

// Usage in conversation:
// User: "Show me a cool text animation saying 'Welcome to Flex'"
// Tambo: [Generates and renders GenerativeSplitText with appropriate props]
```

### Example Flow

```tsx
// User message
"Create an animated heading that says 'AI-Powered Design'"

// Tambo analyzes and responds with:
<TamboMessage>
  <p>Here's an animated heading for you:</p>
  <GenerativeSplitText 
    text="AI-Powered Design"
    animateBy="words"
    className="text-4xl font-bold text-blue-600"
  />
</TamboMessage>
```

---

## ✋ Interactable Components

### What Are Interactable Components?

Pre-placed components that AI can **read** and **update**. Unlike generative components:

- **You place them** in your UI
- **You set initial state**
- Users can interact traditionally (click, type, etc.)
- **Tambo can also modify them** via natural language

### Key Features

**Automatic Context Sending:**
- Current props are visible to Tambo automatically
- Tambo knows component state without extra code

**Automatic Tool Registration:**
- Update tools are registered automatically
- Tambo can modify props when needed

### Bidirectional Interaction

```
Traditional:     User clicks → Component updates
Natural Language: User asks Tambo → Tambo updates component
Combined:        Both work together seamlessly!
```

### Implementation in Flex

```typescript
// src/components/react-bits/InteractableSplitText.tsx

import { withInteractable } from '@tambo/react';
import { SplitText } from './text/SplitText';
import { z } from 'zod';

// Define props schema
const SplitTextPropsSchema = z.object({
  text: z.string().describe("The text to animate"),
  animateBy: z.enum(["characters", "words"]).describe("Animation unit"),
  delay: z.number().optional().describe("Delay in seconds"),
  duration: z.number().optional().describe("Duration in seconds"),
  className: z.string().optional().describe("Tailwind CSS classes")
});

// Create interactable version
export const InteractableSplitText = withInteractable(SplitText, {
  componentName: "SplitText",
  description: "Character or word reveal animation that can be modified by AI",
  propsSchema: SplitTextPropsSchema,
});
```

### Usage in Canvas

```tsx
// src/components/canvas/Canvas.tsx

import { InteractableSplitText } from '@/components/react-bits/InteractableSplitText';
import { InteractableTextCursor } from '@/components/react-bits/InteractableTextCursor';
import { InteractableBlurText } from '@/components/react-bits/InteractableBlurText';

export function Canvas() {
  return (
    <div className="canvas">
      {/* Pre-placed interactable components */}
      <InteractableSplitText
        id="header-1"
        text="Welcome to Flex"
        animateBy="words"
        className="text-6xl font-bold"
      />
      
      <InteractableTextCursor
        id="subtitle-1"
        text="AI-Powered Design System"
        speed={50}
        className="text-2xl"
      />
      
      <InteractableBlurText
        id="tagline-1"
        text="Build Beautiful Interfaces"
        animateBy="characters"
        className="text-4xl"
      />
    </div>
  );
}
```

### Natural Language Modification

```
User: "Make the header animation faster"
Tambo: [Updates InteractableSplitText with id="header-1", duration=0.3]

User: "Change the subtitle text to 'Powered by AI'"
Tambo: [Updates InteractableTextCursor with id="subtitle-1", text="Powered by AI"]

User: "Add blue color to the tagline"
Tambo: [Updates InteractableBlurText with id="tagline-1", className="text-4xl text-blue-600"]
```

---

## 🔄 Component State

### Making State Visible to AI

Tambo can see component state automatically when using interactables:

```typescript
// Component state is automatically sent to Tambo
const InteractableNote = withInteractable(Note, {
  componentName: "Note",
  description: "A note component with title and content",
  propsSchema: NotePropsSchema,
});

// Tambo can see:
// - Current title
// - Current content  
// - Current background color
// - Any other props
```

### Contextual Responses

Because Tambo sees state, it can give contextual responses:

```
User: "What's in my note?"
Tambo: "Your note has the title 'Meeting Notes' and contains 'Discuss Q4 goals...'"

User: "Make it red"
Tambo: [Updates backgroundColor to red, knows which component user is referring to]
```

---

## 🎯 Flex Implementation Strategy

### Two-Pronged Approach

**1. Generative Components (For Creation)**
```typescript
// User asks AI to create something new
User: "Create a typewriter animation saying 'Hello'"
Tambo: [Generates new TextCursor component in response]
```

**2. Interactable Components (For Modification)**
```typescript
// User modifies existing components
User: "Make this animation slower"
Tambo: [Updates existing component's speed prop]
```

### Implementation Steps

#### Step 1: Create Base Components (Done ✅)
```typescript
// Already have:
- SplitText.tsx
- TextCursor.tsx
- BlurText.tsx
```

#### Step 2: Add Interactable Wrappers
```typescript
// src/components/react-bits/InteractableSplitText.tsx

import { withInteractable } from '@tambo/react';
import { SplitText } from './text/SplitText';
import { z } from 'zod';

const SplitTextPropsSchema = z.object({
  text: z.string(),
  animateBy: z.enum(["characters", "words"]).default("characters"),
  delay: z.number().default(0),
  duration: z.number().default(0.5),
  className: z.string().optional()
});

export const InteractableSplitText = withInteractable(SplitText, {
  componentName: "SplitText",
  description: "Animated text that reveals character by character or word by word. Users can modify the text, animation speed, and styling.",
  propsSchema: SplitTextPropsSchema,
});
```

#### Step 3: Add Generative Wrappers
```typescript
// src/components/generative/GenerativeSplitText.tsx

import { withGenerative } from '@tambo/react';
import { SplitText } from '@/components/react-bits/text/SplitText';

export const GenerativeSplitText = withGenerative(SplitText, {
  componentName: "SplitText",
  description: "Creates animated text with character or word reveal effect",
  usage: "Use when user wants to create new animated text or headings",
  examples: [
    "Create a heading saying 'Welcome'",
    "Show an animated title",
    "Make text that appears word by word"
  ],
  propsSchema: SplitTextPropsSchema
});
```

#### Step 4: Register Both Types
```typescript
// src/App.tsx

import { TamboProvider } from '@tambo/react';
import { InteractableSplitText } from './components/react-bits/InteractableSplitText';
import { GenerativeSplitText } from './components/generative/GenerativeSplitText';

function App() {
  return (
    <TamboProvider
      config={{
        apiKey: process.env.VITE_TAMBO_API_KEY,
        generativeComponents: [
          GenerativeSplitText,
          GenerativeTextCursor,
          GenerativeBlurText
        ]
      }}
    >
      <Canvas /> {/* Contains InteractableSplitText components */}
      <TamboChat /> {/* Can generate new components */}
    </TamboProvider>
  );
}
```

---

## 🧠 Skills System

### What Are Skills?

Skills are **reusable capabilities** for AI agents that provide procedural knowledge. They enhance agents with:

- Step-by-step instructions
- Best practices
- Domain expertise
- Reusable workflows

### Skill Structure

```markdown
# Skill Name

## Description
Brief overview of what this skill does

## When to Use
Conditions for using this skill

## Steps
1. Step one
2. Step two
3. Step three

## Examples
Example usage scenarios

## Best Practices
Tips and guidelines
```

### Flex Skills to Create

#### Skill 1: Component Modification
```markdown
# Modify React-Bits Components

## Description
Step-by-step process to modify text animation components

## When to Use
- User asks to change component properties
- User wants to adjust animation speed/style
- User requests color or text changes

## Steps
1. Identify which component user is referring to
2. Determine which props need to change
3. Validate new prop values
4. Update component using updateProps tool
5. Confirm change with user

## Examples
- "Make it faster" → Reduce duration prop
- "Change to blue" → Update className with text-blue-600
- "Animate by words" → Set animateBy to "words"

## Best Practices
- Always preserve other props when updating
- Validate color values are valid Tailwind classes
- Keep duration between 0.1s and 3s for good UX
```

#### Skill 2: Component Creation
```markdown
# Create New Text Animations

## Description
Generate appropriate text animation components based on user requests

## When to Use
- User asks to create new text
- User wants to add animations to their design
- User describes a text effect they want

## Steps
1. Analyze user's intent and desired text
2. Choose appropriate animation type:
   - SplitText: General reveals, headings
   - TextCursor: Typewriter effects
   - BlurText: Smooth reveals, emphasis
3. Set appropriate props based on context
4. Generate component with good defaults
5. Render in conversation

## Examples
- "Create a heading" → SplitText, large text, word animation
- "Add typing effect" → TextCursor, medium speed
- "Smooth reveal" → BlurText, character animation

## Best Practices
- Use words for headings (more dramatic)
- Use characters for body text (smoother)
- Default to 0.5s duration (balanced)
- Choose colors that match context
```

#### Skill 3: React-Bits Best Practices
```markdown
# React-Bits Animation Best Practices

## Description
Guidelines for creating beautiful animations following React-Bits patterns

## When to Use
- Creating or modifying any animation component
- User asks for recommendations
- Optimizing existing animations

## Best Practices

### Animation Timing
- Fast: 0.3s (buttons, small elements)
- Medium: 0.5-0.8s (text, cards)
- Slow: 1-2s (hero sections, emphasis)

### Text Animation
- Headlines: Use word-by-word
- Body text: Use character-by-character
- Short phrases: Either works

### Colors
- Use Tailwind color scales
- Ensure WCAG AA contrast
- Match brand colors when known

### Performance
- Limit simultaneous animations to 3-5
- Use CSS transforms (better performance)
- Stagger delays for multiple elements

### Accessibility
- Respect prefers-reduced-motion
- Provide skip animation option
- Ensure readable during animation
```

### Implementing Skills in Flex

```typescript
// src/core/skills/component-modification.skill.ts

export const ComponentModificationSkill = {
  name: "Modify React-Bits Components",
  
  description: "Step-by-step process to modify text animation components",
  
  whenToUse: [
    "User asks to change component properties",
    "User wants to adjust animation speed/style",
    "User requests color or text changes"
  ],
  
  steps: [
    "Identify which component user is referring to",
    "Determine which props need to change",
    "Validate new prop values",
    "Update component using updateProps tool",
    "Confirm change with user"
  ],
  
  examples: {
    "Make it faster": {
      action: "Reduce duration prop",
      implementation: "duration: 0.3"
    },
    "Change to blue": {
      action: "Update className",
      implementation: "className: 'text-blue-600'"
    },
    "Animate by words": {
      action: "Set animateBy",
      implementation: "animateBy: 'words'"
    }
  },
  
  bestPractices: [
    "Always preserve other props when updating",
    "Validate color values are valid Tailwind classes",
    "Keep duration between 0.1s and 3s for good UX"
  ]
};
```

### Registering Skills with Tambo

```typescript
// src/config/tambo.config.ts

import { ComponentModificationSkill } from '@/core/skills/component-modification.skill';
import { ComponentCreationSkill } from '@/core/skills/component-creation.skill';
import { ReactBitsBestPracticesSkill } from '@/core/skills/react-bits-best-practices.skill';

export const tamboConfig = {
  apiKey: process.env.VITE_TAMBO_API_KEY,
  
  skills: [
    ComponentModificationSkill,
    ComponentCreationSkill,
    ReactBitsBestPracticesSkill
  ],
  
  generativeComponents: [
    GenerativeSplitText,
    GenerativeTextCursor,
    GenerativeBlurText
  ],
  
  features: {
    generativeComponents: true,
    interactableComponents: true,
    skills: true
  }
};
```

---

## 📋 Implementation Checklist

### Phase 1: Interactable Components (Week 1)

- [ ] Install Tambo SDK
  ```bash
  pnpm add @tambo/react zod
  ```

- [ ] Create props schemas
  - [ ] SplitTextPropsSchema
  - [ ] TextCursorPropsSchema
  - [ ] BlurTextPropsSchema

- [ ] Create interactable wrappers
  - [ ] InteractableSplitText
  - [ ] InteractableTextCursor
  - [ ] InteractableBlurText

- [ ] Update Canvas to use interactables
  ```tsx
  <InteractableSplitText id="header-1" ... />
  ```

- [ ] Test modification
  - [ ] "Make it faster"
  - [ ] "Change color to blue"
  - [ ] "Update the text"

### Phase 2: Generative Components (Week 2)

- [ ] Create generative wrappers
  - [ ] GenerativeSplitText
  - [ ] GenerativeTextCursor
  - [ ] GenerativeBlurText

- [ ] Register with TamboProvider
  ```tsx
  <TamboProvider generativeComponents={[...]} />
  ```

- [ ] Test generation
  - [ ] "Create an animated heading"
  - [ ] "Show a typewriter effect"
  - [ ] "Add a blur reveal animation"

### Phase 3: Skills System (Week 2-3)

- [ ] Create skill definitions
  - [ ] ComponentModificationSkill
  - [ ] ComponentCreationSkill
  - [ ] ReactBitsBestPracticesSkill

- [ ] Register skills with Tambo
  ```typescript
  config.skills = [...]
  ```

- [ ] Test skill usage
  - [ ] Tambo follows modification steps
  - [ ] Tambo applies best practices
  - [ ] Tambo gives helpful suggestions

---

## 🚀 Quick Start Commands

```bash
# Install Tambo SDK
pnpm add @tambo/react zod

# Create environment file
echo "VITE_TAMBO_API_KEY=your_key_here" > .env

# Start development
pnpm dev
```

---

## 📚 Resources

- **[Tambo Generative UI Docs](https://docs.tambo.co/concepts/generative-interfaces)**
- **[Interactable Components Guide](https://docs.tambo.co/concepts/generative-interfaces/interactable-components)**
- **[Generative Components Guide](https://docs.tambo.co/concepts/generative-interfaces/generative-components)**
- **[React-Bits Components](https://github.com/DavidHDev/react-bits)**

---

## 💡 Key Takeaways

### Generative Components
✅ AI creates new components on-demand  
✅ User describes what they want  
✅ Tambo selects and renders appropriate component  
✅ Great for creating new UI elements  

### Interactable Components
✅ Pre-placed in your UI  
✅ AI can read current state  
✅ AI can modify props via natural language  
✅ Great for modifying existing elements  

### Skills
✅ Reusable procedural knowledge  
✅ Enhance AI capabilities  
✅ Follow best practices  
✅ Consistent user experience  

### Combined Power
🚀 **Create** new components with generative  
🚀 **Modify** existing components with interactable  
🚀 **Enhance** with skills for better results  
🚀 **Build** intelligent, adaptive interfaces  

---

## 🔧 Troubleshooting: 403 Forbidden

Agar Tambo chat mein **`{"message":"Forbidden resource","error":"Forbidden","statusCode":403}`** aaye:

1. **API key check**: `.env` mein `VITE_TAMBO_API_KEY` sahi hai (Tambo dashboard se copy karo). Badlav ke baad dev server **restart** karo (`npm run dev`).
2. **User Authentication**: Agar project mein "User Authentication" on hai, to backend bina `userToken` ke request reject kar sakta hai. **Fix**: Tambo dashboard → Settings → User Authentication → disable karo (dev ke liye), ya app mein auth implement karke `TamboProvider` ko `userToken` pass karo.
3. **Key invalid/expired**: Dashboard se nayi API key banao aur `.env` update karo.

---

**Ready to implement! Generative aur Interactable components se Flex ko powerful banao! 🎨🤖**
