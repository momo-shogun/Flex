# 🎨 React-Bits Integration Guide
## Flex ke liye Text Animation Components

**Source:** [React-Bits GitHub](https://github.com/DavidHDev/react-bits)  
**Live Demo:** [reactbits.dev](https://reactbits.dev)

---

## 🎯 Integration Strategy

### Phase 1: Initial 3 Components (Week 1)
Start with high-impact text animations jo instantly impressive lagein:

1. **SplitText** — Character/word reveal animation
2. **TextCursor** — Typing effect with blinking cursor  
3. **BlurText** — Blur fade-in effect

### Phase 2: Extended Library (Week 2-3)
Gradually add more components from React-Bits:
- All text animation variants
- Background effects
- Interactive components
- 3D effects

### Phase 3: Tambo Modification (Ongoing)
Users can modify any React-Bits component using Tambo:
- Change colors, speeds, styles
- Add custom animations
- Combine multiple effects

---

## 📦 Installation

```bash
# Core dependencies
pnpm add framer-motion  # For smooth animations
pnpm add gsap          # For advanced animations (optional)
pnpm add clsx          # For className utilities
```

---

## 🎨 Component Implementations

### 1. SplitText Component

**Location:** `src/components/react-bits/text/SplitText.tsx`

```typescript
import React from 'react';
import { motion } from 'framer-motion';

export interface SplitTextProps {
  text: string;
  delay?: number;
  duration?: number;
  animateBy?: 'characters' | 'words';
  className?: string;
}

export function SplitText({
  text,
  delay = 0,
  duration = 0.5,
  animateBy = 'characters',
  className = ''
}: SplitTextProps) {
  const items = animateBy === 'characters' 
    ? text.split('')
    : text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay
      }
    }
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap ${className}`}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block' }}
        >
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.div>
  );
}
```

**Usage Examples:**

```tsx
// Basic usage
<SplitText text="Welcome to Flex" />

// Word-by-word animation
<SplitText 
  text="Welcome to Flex" 
  animateBy="words"
  className="text-4xl font-bold"
/>

// With delay and custom duration
<SplitText 
  text="AI-Powered Design System"
  delay={0.5}
  duration={0.8}
  className="text-2xl text-gray-700"
/>
```

**Interactable Version:**

```typescript
// src/components/react-bits/InteractableSplitText.tsx

import { withInteractable } from '@/core/interactable/withInteractable';
import { SplitText } from './SplitText';

export const InteractableSplitText = withInteractable(SplitText, {
  category: 'text-animation',
  editableProps: ['text', 'delay', 'duration', 'animateBy', 'className'],
  a11yRules: ['readable-text', 'color-contrast'],
  tamboModifiable: true,
  metadata: {
    description: 'Character or word reveal animation',
    source: 'React-Bits',
    tags: ['text', 'animation', 'reveal']
  }
});
```

---

### 2. TextCursor Component

**Location:** `src/components/react-bits/text/TextCursor.tsx`

```typescript
import React, { useState, useEffect } from 'react';

export interface TextCursorProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: string;
  cursorClassName?: string;
  className?: string;
  onComplete?: () => void;
}

export function TextCursor({
  text,
  speed = 50,
  delay = 0,
  cursor = '|',
  cursorClassName = '',
  className = '',
  onComplete
}: TextCursorProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [started, setStarted] = useState(false);

  // Start typing after delay
  useEffect(() => {
    if (!started && delay > 0) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    } else {
      setStarted(true);
    }
  }, [delay, started]);

  // Typing animation
  useEffect(() => {
    if (!started) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, speed, started, onComplete]);

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayedText}
      <span 
        className={`inline-block transition-opacity duration-100 ${cursorClassName}`}
        style={{ opacity: showCursor ? 1 : 0 }}
      >
        {cursor}
      </span>
    </span>
  );
}
```

**Usage Examples:**

```tsx
// Basic typing effect
<TextCursor text="Hello World" />

// Custom speed and cursor
<TextCursor 
  text="AI-Powered Design System"
  speed={100}
  cursor="_"
  className="text-3xl font-mono"
/>

// With delay and completion callback
<TextCursor 
  text="Welcome to Flex!"
  delay={1000}
  speed={50}
  onComplete={() => console.log('Typing complete!')}
  cursorClassName="text-blue-600"
/>
```

**Interactable Version:**

```typescript
import { withInteractable } from '@/core/interactable/withInteractable';
import { TextCursor } from './TextCursor';

export const InteractableTextCursor = withInteractable(TextCursor, {
  category: 'text-animation',
  editableProps: ['text', 'speed', 'delay', 'cursor', 'className'],
  a11yRules: ['readable-text', 'color-contrast'],
  tamboModifiable: true,
  metadata: {
    description: 'Typewriter effect with blinking cursor',
    source: 'React-Bits',
    tags: ['text', 'animation', 'typewriter', 'cursor']
  }
});
```

---

### 3. BlurText Component

**Location:** `src/components/react-bits/text/BlurText.tsx`

```typescript
import React from 'react';
import { motion } from 'framer-motion';

export interface BlurTextProps {
  text: string;
  delay?: number;
  duration?: number;
  animateBy?: 'characters' | 'words';
  blurAmount?: number;
  className?: string;
}

export function BlurText({
  text,
  delay = 0,
  duration = 0.8,
  animateBy = 'characters',
  blurAmount = 10,
  className = ''
}: BlurTextProps) {
  const items = animateBy === 'characters' 
    ? text.split('')
    : text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay
      }
    }
  };

  const child = {
    hidden: { 
      opacity: 0, 
      filter: `blur(${blurAmount}px)`,
      scale: 1.1
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: { 
        duration,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap ${className}`}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block' }}
        >
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.div>
  );
}
```

**Usage Examples:**

```tsx
// Basic blur reveal
<BlurText text="Beautiful Animations" />

// Word-by-word with custom blur
<BlurText 
  text="React Bits Components"
  animateBy="words"
  blurAmount={15}
  className="text-5xl font-bold text-blue-600"
/>

// Delayed animation
<BlurText 
  text="Powered by AI"
  delay={0.5}
  duration={1}
  className="text-3xl text-gray-700"
/>
```

**Interactable Version:**

```typescript
import { withInteractable } from '@/core/interactable/withInteractable';
import { BlurText } from './BlurText';

export const InteractableBlurText = withInteractable(BlurText, {
  category: 'text-animation',
  editableProps: ['text', 'delay', 'duration', 'animateBy', 'blurAmount', 'className'],
  a11yRules: ['readable-text', 'color-contrast', 'motion-safe'],
  tamboModifiable: true,
  metadata: {
    description: 'Text reveal with blur fade-in effect',
    source: 'React-Bits',
    tags: ['text', 'animation', 'blur', 'reveal']
  }
});
```

---

## 🎭 Demo Canvas Setup

Create a showcase page to demonstrate all text animations:

```typescript
// src/pages/TextAnimationsDemo.tsx

import React from 'react';
import { InteractableSplitText } from '@/components/react-bits/InteractableSplitText';
import { InteractableTextCursor } from '@/components/react-bits/InteractableTextCursor';
import { InteractableBlurText } from '@/components/react-bits/InteractableBlurText';

export function TextAnimationsDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <InteractableBlurText
            id="header-1"
            type="BlurText"
            text="React-Bits Text Animations"
            animateBy="words"
            className="text-6xl font-bold text-gray-900"
          />
          <InteractableTextCursor
            id="subtitle-1"
            type="TextCursor"
            text="Beautiful, customizable, and interactive"
            delay={1000}
            className="text-2xl text-gray-600"
          />
        </div>

        {/* SplitText Section */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            1. SplitText Animation
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Character Animation:</p>
              <InteractableSplitText
                id="split-1"
                type="SplitText"
                text="Hello World"
                animateBy="characters"
                className="text-4xl font-bold text-blue-600"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Word Animation:</p>
              <InteractableSplitText
                id="split-2"
                type="SplitText"
                text="Welcome to Flex Design System"
                animateBy="words"
                duration={0.6}
                className="text-3xl font-semibold text-purple-600"
              />
            </div>
          </div>
        </section>

        {/* TextCursor Section */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            2. TextCursor (Typewriter) Effect
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Fast Typing:</p>
              <InteractableTextCursor
                id="cursor-1"
                type="TextCursor"
                text="This is a fast typing animation!"
                speed={50}
                className="text-3xl font-mono text-green-600"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Slow Typing with Underscore:</p>
              <InteractableTextCursor
                id="cursor-2"
                type="TextCursor"
                text="Slow and steady wins the race..."
                speed={150}
                cursor="_"
                className="text-2xl font-mono text-orange-600"
              />
            </div>
          </div>
        </section>

        {/* BlurText Section */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            3. BlurText Animation
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Character Blur:</p>
              <InteractableBlurText
                id="blur-1"
                type="BlurText"
                text="Smooth Blur Effect"
                animateBy="characters"
                blurAmount={10}
                className="text-4xl font-bold text-pink-600"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Word Blur with High Intensity:</p>
              <InteractableBlurText
                id="blur-2"
                type="BlurText"
                text="Beautiful Animations Powered by AI"
                animateBy="words"
                blurAmount={15}
                duration={1}
                className="text-3xl font-bold text-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            🤖 Modify with Tambo
          </h3>
          <p className="text-gray-700 mb-4">
            Click any text animation above, then ask Tambo to modify it:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• "Make it faster/slower"</li>
            <li>• "Change the color to red"</li>
            <li>• "Add a gradient effect"</li>
            <li>• "Increase blur amount"</li>
            <li>• "Animate by words instead of characters"</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
```

---

## 🔧 Tambo Modification Integration

Enable users to modify React-Bits components using Tambo:

```typescript
// src/features/tambo-modification/ComponentModifier.tsx

import { useGenerativeComponent } from '@tambo/react';
import { useDesignSystemStore } from '@/store/design-system-store';

export function ComponentModifier() {
  const selectedComponent = useDesignSystemStore(s => {
    const id = s.selectedId;
    return id ? s.components.get(id) : null;
  });

  const { generate, isGenerating } = useGenerativeComponent();

  const handleModify = async (instruction: string) => {
    if (!selectedComponent) return;

    // Generate modified component
    const modified = await generate({
      prompt: `Modify this ${selectedComponent.type} component: ${instruction}`,
      baseComponent: selectedComponent,
      preserveStructure: true
    });

    // Update in store
    useDesignSystemStore.getState().updateComponent(
      selectedComponent.id,
      { props: modified.props }
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-3">Modify with Tambo</h3>
      
      {selectedComponent && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Selected: <strong>{selectedComponent.type}</strong>
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Make it blue and faster"
              className="flex-1 px-3 py-2 border rounded-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleModify(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleModify('Make it faster')}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded"
            >
              ⚡ Faster
            </button>
            <button
              onClick={() => handleModify('Make it slower')}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded"
            >
              🐌 Slower
            </button>
            <button
              onClick={() => handleModify('Change color to gradient')}
              className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 rounded"
            >
              🌈 Gradient
            </button>
            <button
              onClick={() => handleModify('Add bounce effect')}
              className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 rounded"
            >
              🎾 Bounce
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 📋 Implementation Checklist

### Phase 1: Initial Setup (Day 1)

- [ ] Create project structure
  ```
  src/
  ├── components/
  │   └── react-bits/
  │       ├── text/
  │       │   ├── SplitText.tsx
  │       │   ├── TextCursor.tsx
  │       │   └── BlurText.tsx
  │       ├── InteractableSplitText.tsx
  │       ├── InteractableTextCursor.tsx
  │       └── InteractableBlurText.tsx
  ```

- [ ] Install dependencies
  ```bash
  pnpm add framer-motion clsx
  ```

- [ ] Implement 3 base components
  - [ ] SplitText
  - [ ] TextCursor
  - [ ] BlurText

- [ ] Create interactable wrappers
  - [ ] InteractableSplitText
  - [ ] InteractableTextCursor
  - [ ] InteractableBlurText

- [ ] Create demo page
  - [ ] TextAnimationsDemo.tsx
  - [ ] Showcase all 3 components
  - [ ] Add usage examples

### Phase 2: Tambo Integration (Day 2)

- [ ] Setup Tambo SDK
  ```bash
  pnpm add @tambo/react @tambo/core
  ```

- [ ] Create ComponentModifier feature
  - [ ] Quick action buttons
  - [ ] Text input for custom instructions
  - [ ] Real-time preview

- [ ] Test modification flows
  - [ ] Speed adjustments
  - [ ] Color changes
  - [ ] Animation type changes
  - [ ] Custom effects

### Phase 3: Extended Components (Week 2)

- [ ] Add more React-Bits text animations
  - [ ] RevealText
  - [ ] GlitchText
  - [ ] WaveText
  - [ ] RotateText
  - [ ] ScrambleText

- [ ] Create component library browser
  - [ ] Search functionality
  - [ ] Category filters
  - [ ] Preview thumbnails

---

## 🚀 Quick Start Commands

```bash
# Start fresh project
cd /Users/apple/Desktop/pp/hakathon/Flex

# Initialize if needed
pnpm create vite@latest . --template react-ts

# Install all dependencies
pnpm add framer-motion gsap clsx tailwind-merge lucide-react zustand immer

# Start dev server
pnpm dev
```

---

## 🎨 Styling Guidelines

Match React-Bits aesthetic:
- Clean, modern design
- Smooth animations (0.5-1s duration)
- Use Tailwind utilities
- Maintain consistency across components
- Ensure responsiveness

---

## 📚 Resources

- **React-Bits GitHub:** https://github.com/DavidHDev/react-bits
- **Live Demo:** https://reactbits.dev
- **Text Animations:** https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations
- **Framer Motion Docs:** https://www.framer.com/motion/
- **GSAP Docs:** https://greensock.com/docs/

---

**Ready to build! Pehle 3 components implement karo, phir gradually baaki sab add karte jaana. Users Tambo se kisi bhi component ko modify kar sakenge! 🚀**
