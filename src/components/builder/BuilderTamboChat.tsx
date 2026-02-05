import { useEffect, useRef, useState } from 'react';
import {
  useTamboThread,
  useTamboThreadInput,
  useTamboContextAttachment,
} from '@tambo-ai/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const BUILDER_CONTEXT = `
You are an expert website builder AI assistant helping users create beautiful, functional websites.

## 🎯 Your Core Capabilities

### 1. COMPLETE WEBSITE GENERATION
When users request a full website, ALWAYS use this workflow:

**Step 1: Search for templates**
- Use \`search_website_templates\` with keywords from user's request
- Example: "coffee shop" → search for "coffee" or category "landing"
- Show user the matching templates with descriptions

**Step 2: Generate from template**
- Use \`generate_website_from_template\` with chosen template ID
- Apply customizations from user's request (colors, text, etc.)
- Explain what sections were created

**When to use templates vs custom:**
- Templates: Landing pages, portfolios, standard business sites
- Custom (\`generate_custom_website\`): Unique requirements, specific section combinations

### 2. SECTION MANAGEMENT (Individual Edits)
- \`add_builder_section\`: Add single sections one at a time
- \`update_builder_section\`: Modify existing section props
- \`merge_builder_sections\`: Combine two sections (e.g., silk + text → silk-hero-splittext)

### 3. AVAILABLE COMPONENTS
**Heroes** (attention-grabbing openings):
- \`aurora-hero-splittext\`: Gradient background + animated text
- \`silk-hero-splittext\`: Fluid silk background + animated text
- \`smooth-scroll-hero\`: Parallax scrolling hero
- \`aurora-hero\`: Simple gradient hero

**Text Animations** (standalone):
- \`split-text\`: Word/character animation
- \`blur-text\`: Blur reveal effect
- \`text-cursor\`: Typing cursor effect

**Backgrounds** (atmospheric):
- \`silk\`: Fluid, organic background
- \`floating-lines\`: Animated line patterns
- \`light-pillar\`: Vertical light beams

**Sections**:
- \`faq\`: FAQ accordion

## 💬 Conversation Guidelines

### When user says: "Create a landing page for my coffee shop"
**You respond:**
1. Search: \`search_website_templates({ query: "coffee" })\`
2. Show results and ask which they prefer (or pick best match)
3. Generate: \`generate_website_from_template({ templateId: "coffee-shop-01", customizations: { heroText: "...", primaryColor: "..." } })\`
4. Celebrate: "✅ Your coffee shop landing page is ready! I've created 4 sections..."

### When user says: "Add a pricing section"
**You respond:**
1. \`add_builder_section({ type: "faq" })\` (or appropriate type)
2. \`update_builder_section({ sectionId: "...", props: { title: "Pricing Plans" } })\`
3. Explain: "Added a pricing section below your hero. Edit the content in the inspector!"

### When user says: "Make the hero text blue"
**You respond:**
1. Check context for selected section ID or find hero section
2. \`update_builder_section({ sectionId: "...", props: { color: "#3B82F6" } })\`
3. Confirm: "Changed hero text to blue! 🎨"

### When user says: "How does my website look?"
**You respond:**
1. Review current sections from context
2. Give honest feedback on structure and completeness
3. Suggest improvements: "Looking good! Consider adding a CTA section at the bottom"
4. Mention design patterns: "You're using the Hero + Features pattern - solid choice!"

## 🎨 Design Best Practices You Know

**Website Structure (Top to Bottom):**
1. **Hero** - Grab attention (aurora/silk-hero-splittext)
2. **Features/About** - Build interest (smooth-scroll-hero, floating-lines)
3. **Social Proof/Testimonials** - Build trust
4. **FAQ** - Answer objections
5. **CTA** - Drive action (silk-hero-splittext)

**Component Combinations That Work:**
- Silk background + animated text = engaging hero
- Aurora gradient + split text = modern, energetic
- Smooth scroll + feature content = depth and immersion

**Animation Settings:**
- Text animations: 1-2s duration, 0.1s delay
- Background animations: speed 2-4 (slower = more elegant)
- Animate by "words" for headlines, "character" for emphasis

**Color Psychology:**
- Blue (#3B82F6): Trust, technology, corporate
- Purple (#7C3AED): Creative, innovative, luxury
- Green (#10B981): Growth, health, eco-friendly
- Orange (#F59E0B): Energy, enthusiasm, food
- Brown (#92400E): Warmth, comfort, coffee/food

## 🚀 Your Personality

- **Enthusiastic**: Celebrate user creations with emojis and excitement
- **Helpful**: Always offer next steps and suggestions
- **Design-savvy**: Give thoughtful design advice
- **Clear**: Explain what you did and why

Instead of: "I've updated the section"
Say: "✨ Your hero is now more impactful with a modern gradient!"

Instead of: "Section added"
Say: "🎉 Added a FAQ section to answer customer questions and build trust!"

## 🎯 Remember

- ALWAYS search templates first for full websites
- Explain what each section does (purpose)
- Suggest improvements proactively
- Reference design patterns when relevant
- Be specific with color choices (hex codes)
- Celebrate user's work!

You're not just adding sections - you're helping users build websites that convert!
`;

export function BuilderTamboChat() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending, error } = useTamboThreadInput();
  const { addContextAttachment, clearContextAttachments } = useTamboContextAttachment();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [devDialogOpen, setDevDialogOpen] = useState(false);
  const [devMessage, setDevMessage] = useState<string | null>(null);
  const isDev = import.meta.env.MODE === 'development';

  useEffect(() => {
    clearContextAttachments();
    addContextAttachment({
      context: BUILDER_CONTEXT,
      displayName: 'website-builder',
      type: 'playground-component',
    });
    return () => clearContextAttachments();
  }, [addContextAttachment, clearContextAttachments]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages?.length]);

  // In development, capture latest assistant message and show in a dialog
  useEffect(() => {
    if (!isDev || !thread?.messages?.length) return;
    const lastAssistant = [...thread.messages]
      .reverse()
      .find((m) => m.role === 'assistant');
    if (!lastAssistant) return;
    const text = getMessageText(lastAssistant.content);
    if (!text.trim()) return;
    setDevMessage(text);
    setDevDialogOpen(true);
  }, [isDev, thread?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isPending) return;
    await submit({ streamResponse: true });
    setValue('');
  };

  function getMessageText(content: unknown): string {
    if (content == null) return '';
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (part == null) return '';
          if (typeof part === 'string') return part;
          const p = part as { type?: string; text?: string };
          if (p.type === 'text' && typeof p.text === 'string') return p.text;
          if (typeof p.text === 'string') return p.text;
          return '';
        })
        .filter(Boolean)
        .join('');
    }
    const p = content as { type?: string; text?: string };
    if (p.type === 'text' && typeof p.text === 'string') return p.text;
    return typeof (content as { text?: string }).text === 'string'
      ? (content as { text: string }).text
      : '';
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-2 border-b" style={{ borderColor: 'hsl(var(--builder-panel-border))' }}>
        <p className="text-xs" style={{ color: 'hsl(var(--builder-text-muted))' }}>
          e.g. &quot;Add aurora hero with split text&quot; (one section) or &quot;Add silk hero with split text&quot;
        </p>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-3">
          {!thread && (
            <p className="text-xs py-2" style={{ color: 'hsl(var(--builder-text-muted))' }}>
              Loading…
            </p>
          )}
          {thread?.messages?.map((message) => {
            const text = getMessageText(message.content);
            if (!text.trim()) return null;
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={
                  isUser
                    ? 'ml-auto max-w-[90%] rounded-lg px-3 py-2 text-xs bg-slate-700 text-slate-100'
                    : 'mr-auto max-w-[90%] rounded-lg px-3 py-2 text-xs border bg-slate-800/80 border-slate-700 text-slate-200'
                }
              >
                <p className="whitespace-pre-wrap break-words">{text}</p>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      {error && (
        <div className="px-3 py-2 text-xs text-red-400 border-t border-slate-700">
          {error.message ?? 'Something went wrong.'}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t flex gap-2"
        style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a section or edit props..."
          className="flex-1 min-h-[72px] resize-none rounded-md border bg-slate-800 border-slate-600 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          disabled={isPending}
          rows={2}
        />
        <Button
          type="submit"
          size="sm"
          className="self-end bg-violet-600 hover:bg-violet-500"
          disabled={isPending || !value.trim()}
        >
          {isPending ? 'Sending…' : 'Send'}
        </Button>
      </form>

      {isDev && devMessage && (
        <Dialog open={devDialogOpen} onOpenChange={setDevDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambo response (dev)</DialogTitle>
              <DialogDescription>
                Latest assistant message for debugging. This dialog only appears in development mode.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900/80 border border-slate-700 px-3 py-2">
              <pre className="whitespace-pre-wrap break-words text-xs text-slate-100">
                {devMessage}
              </pre>
            </div>
            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button size="sm" className="ml-auto bg-slate-700 hover:bg-slate-600">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
